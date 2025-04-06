import React, { useRef, useState } from 'react';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrScanner } from './QrScanner';
import { Answerer } from './Answerer';

// const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const config = { iceServers: [] };

// function reconstructString(qrDataArray: string[]) {
//   let reconstructedString = '';
//   const totalParts = parseInt(qrDataArray[0].split('|')[1].split('/')[1]); // Читаем количество частей
//
//   // Сортируем части, если они не пришли по порядку
//   const sortedChunks = qrDataArray.sort((a, b) => {
//     const partA = parseInt(a.split('|')[1].split('/')[0]);
//     const partB = parseInt(b.split('|')[1].split('/')[0]);
//     return partA - partB;
//   });
//
//   // Восстанавливаем строку
//   sortedChunks.forEach((data) => {
//     reconstructedString += data.split('|')[0];
//   });
//
//   return reconstructedString;
// }

type Mode = 'idle' | 'offerer' | 'answerer' | 'connected';

function splitDataIntoChunks(inputString: string, chunkSize: number) {
  const chunks = [];
  const totalChunks = Math.ceil(inputString.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = inputString.slice(i * chunkSize, (i + 1) * chunkSize);
    chunks.push({
      chunk,
      partNumber: i + 1,
      totalChunks: totalChunks,
    });
  }

  return chunks;
}

type OfferChunks = { [key: number]: string };

export default function WebRtcQR2() {
  const [mode, setMode] = useState<Mode>('idle');

  const [scanning, setScanning] = useState(false);
  const [qrChunks, setQrChunks] = useState<
    { partNumber: number; totalChunks: number; chunk: string }[]
  >([]);
  const [channelState, setChannelState] = useState('closed');
  const [log, setLog] = useState<string[]>([]);
  // const [scannerVisible, setScannerVisible] = useState(false);

  const peerRef = useRef<RTCPeerConnection>();
  const dataChannelRef = useRef<RTCDataChannel>();
  const offerChunks: OfferChunks = useRef({}).current;

  const setupPeer = () => {
    const pc = new RTCPeerConnection(config);
    pc.onicecandidate = (e) => {
      if (!e.candidate && pc.localDescription) {
        const compressed = compressToBase64(JSON.stringify(pc.localDescription));
        const chunks = splitDataIntoChunks(compressed, 300); // 400 symbols max per chunk

        // const chunks = compressed.match(/.{1,400}/g) || [];
        // chunks[chunks.length - 1] += '#END';
        setQrChunks(chunks);
      }
    };

    pc.ondatachannel = (e) => {
      logMsg('💬 Получен data channel');
      const ch = e.channel;
      ch.onopen = () => {
        logMsg('🟢 Канал открыт');
        setChannelState('open');
      };
      ch.onmessage = (msg) => logMsg(`📩: ${msg.data}`);
    };

    peerRef.current = pc;
  };

  const logMsg = (msg: string) => setLog((prev) => [...prev, msg]);

  const startAsOfferer = async () => {
    setMode('offerer');
    setupPeer();
    const dc = peerRef.current!.createDataChannel('chat');
    dataChannelRef.current = dc;
    dc.onopen = () => {
      logMsg('🟢 Канал открыт (offerer)');
      setChannelState('open');
    };
    dc.onmessage = (msg) => logMsg(`📩: ${msg.data}`);

    const offer = await peerRef.current!.createOffer();
    await peerRef.current!.setLocalDescription(offer);
  };

  const startAsAnswerer = () => {
    setScanning(true);
    setMode('answerer');
    // setScannerVisible(true);
    setupPeer();
    // const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);

    // scanner.render(
    //   (decoded) => {
    //     console.log(decoded);
    //     debugger
    // offerChunks.push(decoded);
    // if (decoded.endsWith('#END')) {
    //   scanner.clear();
    //   const full = offerChunks.join('').replace('#END', '');
    //   const sdp = decompressFromBase64(full);
    //   if (!sdp) return alert('❌ Ошибка распаковки SDP');
    //
    //   const offerDesc = new RTCSessionDescription(JSON.parse(sdp));
    //   peerRef.current!.setRemoteDescription(offerDesc).then(async () => {
    //     const answer = await peerRef.current!.createAnswer();
    //     await peerRef.current!.setLocalDescription(answer);
    //   });
    // }
    // },
    // (err) => logMsg(`QR error: ${err}`),
    // );
  };

  const handleAnswerScan = () => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);
    const answerChunks: string[] = [];

    scanner.render(
      (decoded) => {
        // answerChunks.push(decoded);
        // if (decoded.endsWith('#END')) {
        //   scanner.clear();
        //   const full = answerChunks.join('').replace('#END', '');
        //   const sdp = decompressFromBase64(full);
        //   if (!sdp) return alert('❌ Ошибка распаковки SDP');
        //
        //   const answerDesc = new RTCSessionDescription(JSON.parse(sdp));
        //   peerRef.current!.setRemoteDescription(answerDesc);
        //   logMsg('✅ Ответ принят');
        // }
      },
      (err) => logMsg(`QR error: ${err}`),
    );
  };

  const getSdp = (text: string, sdpChunks: any) => {
    const parts = text.split('|');
    const data = parts[0];
    const partNums = parts[1].split('/');
    const current = parseInt(partNums[0].split(':')[1]);
    const totalParts = parseInt(partNums[1]);
    console.log('📷 Отсканировано:', current);
    console.log('📷 Отсканировано:', totalParts);
    console.log('📷 Отсканировано:', data);
    offerChunks[current] = data;

    if (Object.keys(offerChunks).length === totalParts) {
      const concatenated = Object.keys(offerChunks)
        .sort()
        .reduce((sum, prev) => {
          sum += offerChunks[parseInt(prev)];
          return sum;
        }, '');
      const sdp = decompressFromBase64(concatenated);
      setScanning(false);
      const offerDesc = new RTCSessionDescription(JSON.parse(sdp));
      console.log(offerDesc);
      peerRef.current!.setRemoteDescription(offerDesc).then(async () => {
        const answer = await peerRef.current!.createAnswer();
        await peerRef.current!.setLocalDescription(answer);
      });
    }
  };
  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>📡 WebRTC P2P через QR</h2>

      {scanning && (
        <QrScanner
          key={'scan'}
          onScan={(text) => {
            handleOfferScan(text);
          }}
        />
      )}

      {mode === 'idle' && (
        <>
          <button onClick={startAsOfferer}>🟢 Я инициатор (offerer)</button>
          <button onClick={startAsAnswerer}>🔵 Я ответчик (answerer)</button>
        </>
      )}

      {mode === 'offerer' && qrChunks.length > 0 && (
        <>
          <Answerer qrChunks={qrChunks} />
          <button onClick={handleAnswerScan}>📥 Сканировать ответ</button>
        </>
      )}

      {mode === 'answerer' && qrChunks.length > 0 && <Answerer qrChunks={qrChunks} />}

      {/*{scannerVisible && <div id="reader" style={{ width: 300, marginTop: 20 }}></div>}*/}

      {channelState === 'open' && (
        <div>
          <h3>✅ Соединение установлено!</h3>
          <button onClick={() => dataChannelRef.current?.send('👋 Привет')}>
            Отправить "Привет"
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Лог:</h4>
        <pre style={{ background: '#eee', padding: 8, height: 150, overflow: 'auto' }}>
          {log.join('\n')}
        </pre>
      </div>
    </div>
  );
}
