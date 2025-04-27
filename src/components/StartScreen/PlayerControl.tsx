import { useAtomValue } from 'jotai/index';
import { playersAtom } from '../../atoms/playerAtoms';
import { useNavigate } from 'react-router-dom';
import { GAME_EVENTS, startRound } from './gameActions';
import { broadcastMsg } from '../../core/playerService';

export const PlayerControl = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          broadcastMsg({ type: GAME_EVENTS.START_GAME });
          navigate('/game');
        }}
        className={'btn btn-primary'}
      >
        start game
      </button>
      <button
        className={'btn btn-accent'}
        onClick={() => {
          startRound();
        }}
      >
        startRound
      </button>
    </div>
  );
};
