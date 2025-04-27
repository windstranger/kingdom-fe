// eventQueue.ts
import { GameEvent, processEvent } from '../components/StartScreen/gameActions';

export const eventQueue: GameEvent[] = [];
export let isGameReady = { flag: false };

export const queueEvent = (ev: GameEvent) => {
  if (!isGameReady.flag) {
    eventQueue.push(ev);
    return true;
  }
  return false;
};

export const flushQueue = () => {
  while (eventQueue.length > 0) {
    const ev = eventQueue.shift();
    if (ev) {
      processEvent(ev);
    }
  }
};
