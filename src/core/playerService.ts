import { store } from '../atoms/stateAtom';
import { playersAtom } from '../atoms/playerAtoms';
import { outcomingEvents$ } from '../components/StartScreen/gameActions';

export const broadcastMsg = (msg: any) => {
  const players = store.get(playersAtom);
  Object.keys(players).forEach((key) => {
    outcomingEvents$.next({ toId: key, ...msg });
  });
};
export const sendToUserMsg = (playerName: string, msg: any) => {
  outcomingEvents$.next({ toId: playerName, ...msg });
};
