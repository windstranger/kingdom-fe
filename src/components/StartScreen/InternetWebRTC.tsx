import { Button } from '../ui/Button';
import { gameEvent$ } from './eventBus';
import WebSocketHandler from '../../WebSocketHandler';
import { WaitingRoom } from './WaitingRoom';
import { GameController } from './GameController';
import { useAtom } from 'jotai/index';
import { hasServerAtom, stateAtom, websocketAtom } from '../../atoms/stateAtom';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';

export const InternetWebRtc = () => {
  const [playerName, setPlayerName] = useAtom(stateAtom);

  const [serverCreated, setServerCreated] = useAtom(hasServerAtom);
  // const { sendMessage } = useAtomValue(websocketAtom);
  const createServer = useCallback(() => {
    setServerCreated(true);
    // sendMessage(JSON.stringify({ fromId: playerName, type: 'newServer' }));
  }, [setServerCreated]);
  return (
    <div>
      <Button
        onClick={() => {
          gameEvent$.next({ type: 'START_GAME', payload: playerName });
        }}
      >
        event
      </Button>
      <WebSocketHandler />
      {!serverCreated ? (
        <WaitingRoom createServer={createServer} playerName={playerName} />
      ) : (
        <GameController />
      )}
    </div>
  );
};
