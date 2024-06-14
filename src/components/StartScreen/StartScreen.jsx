import { useNavigate } from 'react-router-dom';
import { hasServerAtom, stateAtom, store, websocketAtom } from '../../atoms/stateAtom.js';
import { Provider, useAtom, useAtomValue } from 'jotai';
import { LoginForm } from './LoginForm.jsx';
import WebSocketHandler from '../../WebSocketHandler.jsx';
import { WaitingRoom } from './WaitingRoom.jsx';
import { useCallback } from 'react';
import { GameController } from './GameController.jsx';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const StartScreen = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useAtom(stateAtom);
  const [serverCreated, setServerCreated] = useAtom(hasServerAtom);
  console.log(serverCreated);

  const onEnterRoom = (e) => {
    e.preventDefault();
    setPlayerName(e.target.nick.value);
  };

  const { sendMessage } = useAtomValue(websocketAtom);
  const createServer = useCallback(() => {
    setServerCreated(true);
    sendMessage(JSON.stringify({ fromId: playerName, type: 'newServer' }));
  }, [sendMessage, setServerCreated]);

  return (
    <Provider store={store}>
      <ToastContainer />
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
    </Provider>
  );
};
