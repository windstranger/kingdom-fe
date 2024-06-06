import { useNavigate } from 'react-router-dom';
import { stateAtom, websocketAtom } from '../../atoms/stateAtom.js';
import { useAtom } from 'jotai';
import { LoginForm } from './LoginForm.jsx';
import WebSocketHandler from '../../WebSocketHandler.jsx';
import { WaitingRoom } from './WaitingRoom.jsx';
import { useCallback, useState } from 'react';
import { GameController } from './GameController.jsx';
import { useAtomValue } from 'jotai';

export const StartScreen = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useAtom(stateAtom);
  const [serverCreated, setServerCreated] = useState(false);

  const onEnterRoom = (e) => {
    e.preventDefault();
    setPlayerName(e.target.nick.value);
    navigate('/room');
  };

  const { sendMessage } = useAtomValue(websocketAtom);
  const createServer = useCallback(() => {
    setServerCreated(true);
    sendMessage(JSON.stringify({ fromId: playerName, type: 'newServer' }));
  }, [sendMessage]);

  return (
    <div>
      {!playerName ? (
        <LoginForm onEnterRoom={onEnterRoom} />
      ) : (
        <>
          <WebSocketHandler playerName={playerName} />
          {!serverCreated ? (
            <WaitingRoom createServer={createServer} playerName={playerName} />
          ) : (
            <GameController />
          )}
        </>
      )}
    </div>
  );
};
