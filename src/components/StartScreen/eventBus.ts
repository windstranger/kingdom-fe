// src/services/eventBus.ts
import { Subject } from 'rxjs';

export interface GameEvent {
  type: 'START_GAME' | 'TURN_END' | 'ROUND_END' | 'CARD_PLAYED';
  payload?: any;
}

export const gameEvent$ = new Subject<GameEvent>();

// src/services/unityCommunicator.ts
const unityInstance = (window as any).unityInstance;

export const notifyUnity = (event: GameEvent) => {
  console.log('event', event);
  switch (event.type) {
    case 'START_GAME':
      // unityInstance.SendMessage('GameManager', 'OnGameStart');
      break;
    case 'TURN_END':
      // unityInstance.SendMessage('GameManager', 'OnTurnEnd', JSON.stringify(event.payload));
      break;
    case 'ROUND_END':
      // unityInstance.SendMessage('GameManager', 'OnRoundEnd');
      break;
    case 'CARD_PLAYED':
      // unityInstance.SendMessage('GameManager', 'PlayCard', JSON.stringify(event.payload));
      break;
    default:
      break;
  }
};
