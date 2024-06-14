import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import {
  playerConnectionsAtom,
  playerMessagesAtom,
  playersAtom,
  websocketAtom,
} from '../../atoms/stateAtom.js';
import { PlayerConnection } from '../../PlayerConnection.js';
import { useWebRtcHandlers } from '../../WebSocketHandler.jsx';
import { useAtomValue } from 'jotai';
import { Button } from '../ui/Button.jsx';

export const WaitingRoom = ({ playerName, createServer }) => {
  const [textToSend, setTextToSend] = useState('');
  const [playerMessages, setPlayerMessages] = useAtom(playerMessagesAtom);
  const [playerConnections, setPlayerConnections] = useAtom(playerConnectionsAtom);
  const players = useAtomValue(playersAtom);
  const playerRef = useRef();
  // const socketUrl = `ws://192.168.0.10:8765/?playerName=${playerName}`
  // const socketUrl = `ws://194.87.235.155:8765/?playerName=${playerName}`;
  // const socketUrl = `ws://127.0.0.1:8765/?playerName=${playerName}`;

  const webrtcHandlers = useWebRtcHandlers();

  const { sendMessage } = useAtomValue(websocketAtom);
  async function onConnectToPlayer() {
    const playerConnection = new PlayerConnection(
      playerName,
      playerRef.current.value,
      sendMessage,
      false,
      webrtcHandlers,
    );
    setPlayerConnections((pc) => [...pc, playerConnection]);
    await playerConnection.createOffer();
  }

  const sendWebRtcMessage = async () => {
    // console.log(playerConnections.current);
    await Promise.all(
      playerConnections.map(async (pc) => {
        await pc.sendDataChannelMessage(textToSend);
      }),
    );

    setPlayerMessages((prevPlayers) => [...prevPlayers, textToSend]);
    setTextToSend('');
  };

  const sendMessageToUser = async () => {
    const userId = playerRef.current.value;
    const pc = playerConnections.find((pc) => pc.remoteId === userId);
    await pc.sendDataChannelMessage(textToSend);
    setPlayerMessages((prevPlayers) => [...prevPlayers, textToSend]);
    setTextToSend('');
  };
  return (
    <div>
      My name is: {playerName}
      <select size={10} ref={playerRef}>
        {players.map((player, index) => {
          return (
            <option key={index} value={player.playerName}>
              {player.playerName} {player.hasServer ? 'сервер' : ''}
            </option>
          );
        })}
      </select>
      {/*<div>Server status: {readyState}</div>*/}
      <div>
        {playerMessages.map((msg, index) => {
          return <div key={index}>{msg}</div>;
        })}
      </div>
      <Button onClick={onConnectToPlayer}>connect to server</Button>
      <input type={'text'} value={textToSend} onChange={(e) => setTextToSend(e.target.value)} />
      <Button onClick={sendWebRtcMessage}>send webrtc message to all</Button>
      <Button onClick={sendMessageToUser}>send webrtc message to all</Button>
      <Button onClick={createServer}>create server</Button>
      {/*<button onClick={onSendMessage}>connect to client</button>*/}
    </div>
  );
};
