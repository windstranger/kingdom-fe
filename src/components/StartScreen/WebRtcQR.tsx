import React, { useRef, useState } from 'react';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { Html5QrcodeScanner } from 'html5-qrcode';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export function WebRtcQR() {
  const [step, setStep] = useState<'init' | 'offer' | 'answer' | 'connect'>('init');
  const [localSDP, setLocalSDP] = useState('');
  const [remoteSDP, setRemoteSDP] = useState('');
  const [qrChunks, setQrChunks] = useState<string[]>([]);
  const [channelState, setChannelState] = useState('closed');

  const peerRef = useRef<RTCPeerConnection>();
  const dataChannelRef = useRef<RTCDataChannel>();

  const setupConnection = () => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        const sdp = JSON.stringify(pc.localDescription);
        const compressed = compressToBase64(sdp);
        const chunks = compressed.match(/.{1,500}/g) || [];
        setQrChunks(chunks);
        setLocalSDP(compressed);
      }
    };

    pc.ondatachannel = (e) => {
      e.channel.onopen = () => setChannelState('open');
      e.channel.onmessage = (msg) => console.log('Recv:', msg.data);
    };

    peerRef.current = pc;
  };

  const createOffer = async () => {
    setupConnection();
    const channel = peerRef.current!.createDataChannel('chat');
    dataChannelRef.current = channel;
    channel.onopen = () => setChannelState('open');
    channel.onmessage = (e) => console.log('Recv:', e.data);

    const offer = await peerRef.current!.createOffer();
    await peerRef.current!.setLocalDescription(offer);
    setStep('offer');
  };

  const createAnswer = async () => {
    setupConnection();
    const json = decompressFromBase64(remoteSDP);
    if (!json) return alert('Invalid SDP input');
    const desc = new RTCSessionDescription(JSON.parse(json));
    await peerRef.current!.setRemoteDescription(desc);
    const answer = await peerRef.current!.createAnswer();
    await peerRef.current!.setLocalDescription(answer);
    setStep('answer');
  };

  const connectAnswer = async () => {
    const json = decompressFromBase64(remoteSDP);
    if (!json) return alert('Invalid SDP input');
    const desc = new RTCSessionDescription(JSON.parse(json));
    await peerRef.current!.setRemoteDescription(desc);
    setStep('connect');
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);
    const chunks: string[] = [];

    scanner.render(
      (decoded) => {
        chunks.push(decoded);
        if (decoded.endsWith('#END')) {
          scanner.clear();
          const all = chunks.join('').replace('#END', '');
          setRemoteSDP(all);
        }
      },
      (err) => console.warn(err),
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebRTC QR Connect</h2>

      {step === 'init' && (
        <div>
          <button onClick={createOffer}>🔵 Создать offer (инициатор)</button>
          <button onClick={startScanner}>🟢 Ответить через QR</button>
        </div>
      )}

      {step === 'offer' && (
        <div>
          <h4>Сканируй на втором устройстве:</h4>
          {qrChunks.map((chunk, idx) => (
            <img
              key={idx}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                idx === qrChunks.length - 1 ? chunk + '#END' : chunk,
              )}`}
              alt={`QR part ${idx + 1}`}
              style={{ margin: 8 }}
            />
          ))}
          <input
            placeholder="Вставь ответ (Answer)"
            value={remoteSDP}
            onChange={(e) => setRemoteSDP(e.target.value)}
          />
          <button onClick={connectAnswer}>🔗 Подключить</button>
        </div>
      )}

      {step === 'answer' && (
        <div>
          <h4>Сканируй эти QR на инициаторе:</h4>
          {qrChunks.map((chunk, idx) => (
            <img
              key={idx}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                idx === qrChunks.length - 1 ? chunk + '#END' : chunk,
              )}`}
              alt={`QR part ${idx + 1}`}
              style={{ margin: 8 }}
            />
          ))}
        </div>
      )}

      {channelState === 'open' && (
        <div>
          <h3>🎉 Соединение установлено!</h3>
          <button onClick={() => dataChannelRef.current?.send('Hello!')}>Отправить Hello</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <textarea
          rows={6}
          style={{ width: '100%' }}
          placeholder="Вставь или вставляется сюда с QR"
          value={remoteSDP}
          onChange={(e) => setRemoteSDP(e.target.value)}
        />
        {step === 'init' && <button onClick={createAnswer}>Создать Answer</button>}
      </div>

      <div id="reader" style={{ width: 300, marginTop: 20 }}></div>
    </div>
  );
}
