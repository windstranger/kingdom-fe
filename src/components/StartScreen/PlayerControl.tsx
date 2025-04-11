import { useAtomValue } from 'jotai/index';
import { playersAtom } from '../../atoms/playerAtoms';
import { useNavigate } from 'react-router-dom';

const useGameEvents = () => {
  const players = useAtomValue(playersAtom);
  const broadcastMsg = (msg: any) => {
    Object.keys(players).forEach((key) => {
      players[key].dc.send(JSON.stringify(msg));
    });
  };
  return { broadcastMsg };
};

export const PlayerControl = () => {
  const navigate = useNavigate();
  const { broadcastMsg } = useGameEvents();
  return (
    <div>
      <button
        onClick={() => {
          broadcastMsg({ type: 'start_game', data: 'some data' });
          navigate('/game');
        }}
        className={'btn btn-primary'}
      >
        start game
      </button>
    </div>
  );
};
