import { useAtomValue } from 'jotai';
import { playersAtom } from '../../atoms/playerAtoms';

export const PlayerList = () => {
  const players = useAtomValue(playersAtom);
  return (
    <div className={'bg-gray-100 p-3 flex flex-col gap-3'}>
      {Object.values(players).map((player) => {
        return (
          <div key={player.name} className={'text-2xl'}>
            {player.name}{' '}
          </div>
        );
      })}
    </div>
  );
};
