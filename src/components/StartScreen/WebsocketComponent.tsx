import { useCallback, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { connectedUsersAtom, stateAtom, websocketAddressAtom } from '../../atoms/stateAtom';
import useWebSocket from 'react-use-websocket';
import { playersAtom } from '../../atoms/playerAtoms';

// stun:stun.l.google.com:19302
// urls: ['stun:194.87.235.155:3478'],
const rtcConfig = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
      // username: 'twin',
      // credential: '5387436sasha',
    },
  ],
};
export const WebsocketComponent = () => {
  const [msg, setMsg] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wsAddress = useAtomValue(websocketAddressAtom);
  const playerName = useAtomValue(stateAtom);
  const [connectedUsers, setConnectedUsers] = useAtom(connectedUsersAtom);
  const [hasServer, setHasServer] = useState(false);
  const peerRef = useRef<RTCPeerConnection>();
  const dataChannelRef = useRef<RTCDataChannel>();
  const [players, setPlayers] = useAtom(playersAtom);

  const webSocket = useWebSocket(`${wsAddress}/?playerName=${playerName}`, {
    onOpen: () => {
      setMsg('opened');
      setIsOpen(true);
      console.log('opened');
    },
    onClose: () => {
      setIsOpen(false);
      console.log('disconnected');
      setMsg('disconnected');
    },
    onError: () => {
      setIsOpen(false);
      setMsg('error happened');
      console.log('error happened');
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    // shouldReconnect: (closeEvent) => true,
    onMessage: async (msg) => {
      console.log(msg);

      const data = JSON.parse(msg.data);
      console.log(data);

      if (data.type === 'players') {
        const nPlayers = data.data.filter((p) => p.playerName !== playerName);
        setConnectedUsers(nPlayers);
      }
      if (data.type === 'sdp') {
        console.log(msg);
        const remoteDesc = new RTCSessionDescription(data.sdp);

        if (data.sdp.type === 'offer') {
          const peerConnection = new RTCPeerConnection(rtcConfig);
          // Это для клиента-ответчика (answerer)
          await peerConnection.setRemoteDescription(remoteDesc);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;
            dataChannel.onopen = () => {
              console.log('📡 DataChannel opened');
              setPlayers((players) => {
                return {
                  ...players,
                  [data.fromId]: {
                    pc: peerRef.current,
                    name: data.fromId,
                    dc: dataChannelRef.current,
                  },
                };
              });
            };
            dataChannel.onmessage = (event) => console.log('📩 Received:', event.data);
            dataChannelRef.current = dataChannel;
          };
          // Send ICE candidates during the offer-answer process
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              webSocket.sendMessage(
                JSON.stringify({
                  type: 'icecandidate',
                  candidate: event.candidate,
                  fromId: playerName,
                  remoteId: data.fromId,
                }),
              );
            }
          };
          webSocket.sendMessage(
            JSON.stringify({
              type: 'sdp',
              sdp: answer,
              fromId: playerName,
              remoteId: data.fromId,
            }),
          );
          peerRef.current = peerConnection;
        }

        if (data.sdp.type === 'answer') {
          // Это для клиента-инициатора (offerer) — вот тут важный шаг:
          const peerConnection = peerRef.current;
          await peerConnection.setRemoteDescription(remoteDesc);
          // dataChannelRef.current?.send('Привет!');
          console.log('✅ Answer обработан. Соединение установлено.');

          setPlayers((players) => {
            return {
              ...players,
              [data.fromId]: {
                pc: peerRef.current,
                name: data.fromId,
                dc: dataChannelRef.current,
              },
            };
          });
        }
      }
      if (data.type === 'icecandidate') {
        // Add the ICE candidate received from the other peer
        const peerConnection = peerRef.current;
        if (data.candidate) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      }
      setMsg(msg.data);
      console.log(msg);
    },
  });

  const createServer = useCallback(() => {
    setHasServer(true);
    webSocket.sendMessage(JSON.stringify({ fromId: playerName, type: 'newServer' }));
  }, [playerName, webSocket]);

  const removeServer = useCallback(() => {
    setHasServer(false);
    webSocket.sendMessage(JSON.stringify({ fromId: playerName, type: 'dropServer' }));
  }, [playerName, webSocket]);

  const connectToServer = async (remotePlayerName: string) => {
    const peerConnection = new RTCPeerConnection(rtcConfig);
    const dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = () => console.log('📡 DataChannel opened');
    dataChannel.onmessage = (event) => console.log('📩 Received:', event.data);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    webSocket.sendMessage(
      JSON.stringify({
        type: 'sdp',
        sdp: offer,
        fromId: playerName,
        remoteId: remotePlayerName,
      }),
    );
    dataChannelRef.current = dataChannel;
    peerRef.current = peerConnection;
  };

  return (
    <div>
      <div className={'p-4 max-w-md mx-auto'}>
        <div className="avatar aspect-square rounded-full"></div>
        <div
          className={`w-3 h-3 shrink-0 grow-0 rounded-full ${isOpen ? 'bg-green-300' : 'bg-red-600'} text-green-700`}
        ></div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body space-y-4">
            <h2 className="card-title">connected users to websocket:</h2>
            {!hasServer ? (
              <button className={'btn btn-primary'} onClick={createServer}>
                create server
              </button>
            ) : (
              <button
                className={'btn btn-primary'}
                onClick={() => {
                  removeServer();
                }}
              >
                Отключить сервер
              </button>
            )}
            <ul>
              {connectedUsers.map((user, i) => {
                return (
                  <li key={i} className={'border-1 p-2'}>
                    {user.playerName}{' '}
                    {user.hasServer ? (
                      <button
                        className={'btn btn-primary'}
                        onClick={() => connectToServer(user.playerName)}
                      >
                        Подключиться
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {msg}
      </div>
    </div>
  );
};
