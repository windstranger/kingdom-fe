import { useNavigate } from 'react-router-dom';
import { GAME_EVENTS, startRound } from './gameActions';
import { broadcastMsg } from '../../core/playerService';

export const PlayerControl = () => {
  return (
    <div>
      <button
        onClick={() => {
          broadcastMsg({ type: GAME_EVENTS.START_GAME });
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
