import { useEffect, useRef, useState } from 'react';

export function usePersistentConnection() {
  const peerRef = useRef<RTCPeerConnection>(null);
  const dataChannelRef = useRef<RTCDataChannel>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('rtc-state');
    if (saved && peerRef.current && dataChannelRef.current) {
      const parsed = JSON.parse(saved);
      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      peer.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
        dataChannelRef.current.onmessage = (e) => {
          setMessages((prev) => [...prev, e.data]);
        };
      };

      peer
        .setRemoteDescription(parsed.offer)
        .then(() => {
          return peer.createAnswer();
        })
        .then((answer) => {
          return peer.setLocalDescription(answer);
        })
        .then(() => {
          // ready
          console.log('Reconnected');
        });

      // Добавить ICE кандидаты из parsed.iceCandidates при необходимости
    }
  }, []);

  const sendMessage = (msg: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(msg);
      setMessages((prev) => [...prev, msg]);
    }
  };

  return { sendMessage, messages };
}
