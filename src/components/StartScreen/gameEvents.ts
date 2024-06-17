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
