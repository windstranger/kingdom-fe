import { useNavigate } from 'react-router-dom';
import { hasServerAtom, stateAtom, store, websocketAtom } from '../../atoms/stateAtom.js';
import { Provider, useAtom, useAtomValue } from 'jotai';
import { LoginForm } from './LoginForm.jsx';
import WebSocketHandler from '../../WebSocketHandler.jsx';
import { WaitingRoom } from './WaitingRoom.jsx';
import { useCallback, useEffect } from 'react';
import { GameController } from './GameController.jsx';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { gameEvent$, notifyUnity } from './eventBus.ts';
import { Button } from '../ui/Button.jsx';

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

  useEffect(() => {
    const sub = gameEvent$.subscribe(notifyUnity);
    return () => sub.unsubscribe();
  }, [gameEvent$]);

  return (
    <Provider store={store}>
      <ToastContainer />
      {!playerName ? (
        <LoginForm onEnterRoom={onEnterRoom} />
      ) : (
        <>
          <Button
            onClick={() => {
              gameEvent$.next({ type: 'START_GAME', payload: playerName });
            }}
          >
            event
          </Button>
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
