import React, { memo, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { PlayerConnection } from './PlayerConnection.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  playerConnectionsAtom,
  playerMessagesAtom,
  playersAtom,
  stateAtom,
  websocketAddressAtom,
  websocketAtom,
} from './atoms/stateAtom.js';

export const useWebRtcHandlers = () => {
  const [, setPlayerMessages] = useAtom(playerMessagesAtom);
  const webrtcHandlers = (data) => {
    switch (data.type) {
      case 'message':
        setPlayerMessages((prevPlayers) => [...prevPlayers, `${data.fromId} saying: ` + data.data]);
        break;
      case 'serverWelcome':
        console.log('serverWelcome');
        break;
      case 'startGame':
        console.log('startGame');
        break;
    }
  };
  return webrtcHandlers;
};
const WebSocketHandler = memo(() => {
  const [playerName, setPlayerName] = useAtom(stateAtom);
  const websocketAddress = useAtomValue(websocketAddressAtom);
  const [playerConnections, setPlayerConnections] = useAtom(playerConnectionsAtom);
  const setPlayers = useSetAtom(playersAtom);
  // const socketUrl = `ws://192.168.0.10:8765/?playerName=${playerName}`
  // const socketUrl = `ws://194.87.235.155:8765/?playerName=${playerName}`;
  const socketUrl = `${websocketAddress}/?playerName=${playerName}`;

  const webrtcHandlers = useWebRtcHandlers();

  const setSendMessage = useSetAtom(websocketAtom);
  const webSocket = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('disconnected'),
    onError: () => console.log('error happened'),
    //Will attempt to reconnect on all close events, such as server shutting down
    // shouldReconnect: (closeEvent) => true,
    onMessage: async (msg) => {
      const { sendMessage } = webSocket;
      try {
        console.log(msg.data);
        const data = JSON.parse(msg.data);
        if (data.type === 'error') {
          console.log(data.message);
          // setPlayers(data.data)
        }
        if (data.type === 'players') {
          const nPlayers = data.data.filter((p) => p.playerName !== playerName);
          setPlayers(nPlayers);
        }

        if (data.type === 'sdp') {
          const playerCon = playerConnections.find((con) => con.remoteId === data.fromId);
          if (playerCon) {
            console.log('received answer', data);
            await playerCon.setRemoteDescription(data.data);
          } else {
            console.log('received offer', data);
            const playerConnection = new PlayerConnection(
              playerName,
              data.fromId,
              sendMessage,
              true,
              webrtcHandlers,
            );
            setPlayerConnections((pc) => [...pc, playerConnection]);
            await playerConnection.createAnswer(data.data);
            console.log('answer created');
          }
          // setPlayers(data.data)
        }
        if (data.type === 'icecandidate') {
          const candidate = new RTCIceCandidate(data.data);
          console.log('icecandidate from other peer');
          console.log(data.data);
          try {
            const playerCon = playerConnections.find((con) => con.remoteId === data.fromId);
            await playerCon.addIceCandidate(candidate);
            console.log('setting candidate success');
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    setSendMessage(webSocket);
  }, [webSocket]);

  return <div></div>;
});

export default WebSocketHandler;
