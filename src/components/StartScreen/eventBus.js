// src/services/eventBus.ts
import { Subject } from 'rxjs';

export interface GameEvent {
  type: 'START_GAME' | 'TURN_END' | 'ROUND_END' | 'CARD_PLAYED';
  payload?: any;
}

export const gameEvent$ = new Subject<GameEvent>();

// src/services/gameEvents.ts
import { gameEvent$ } from './eventBus';

export const startGame = () => {
  gameEvent$.next({ type: 'START_GAME' });
};

export const endTurn = (playerId: number) => {
  gameEvent$.next({ type: 'TURN_END', payload: { playerId } });
};

export const endRound = () => {
  gameEvent$.next({ type: 'ROUND_END' });
};

export const playCard = (cardId: number, playerId: number) => {
  gameEvent$.next({ type: 'CARD_PLAYED', payload: { cardId, playerId } });
};

// src/services/unityCommunicator.ts
const unityInstance = (window as any).unityInstance;

export const notifyUnity = (event: GameEvent) => {
  switch (event.type) {
    case 'START_GAME':
      unityInstance.SendMessage('GameManager', 'OnGameStart');
      break;
    case 'TURN_END':
      unityInstance.SendMessage('GameManager', 'OnTurnEnd', JSON.stringify(event.payload));
      break;
    case 'ROUND_END':
      unityInstance.SendMessage('GameManager', 'OnRoundEnd');
      break;
    case 'CARD_PLAYED':
      unityInstance.SendMessage('GameManager', 'PlayCard', JSON.stringify(event.payload));
      break;
    default:
      break;
  }
};

// Subscribe to gameEvent$ and notify Unity
gameEvent$.subscribe(notifyUnity);