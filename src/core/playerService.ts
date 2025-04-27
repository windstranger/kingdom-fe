import { stateAtom, store } from '../atoms/stateAtom';
import { playersAtom } from '../atoms/playerAtoms';
import { outcomingEvents$ } from '../components/StartScreen/gameActions';

export const broadcastMsg = (msg: any) => {
  const players = store.get(playersAtom);
  const myName = store.get(stateAtom);
  Object.keys(players).forEach((key) => {
    outcomingEvents$.next({ toId: key, ...msg });
  });

  outcomingEvents$.next({ toId: myName, ...msg });
};
export const sendToUserMsg = (playerName: string, msg: any) => {
  outcomingEvents$.next({ toId: playerName, ...msg });
};
