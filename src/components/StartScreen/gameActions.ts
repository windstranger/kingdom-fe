import { gameAtom, hasServerAtom, meAtom, stateAtom, store } from '../../atoms/stateAtom';
import { Card, hostAtom, Item, Player, playersAtom, RemotePlayer } from '../../atoms/playerAtoms';
import { Subject } from 'rxjs';
import { Game, RemoteGame } from '../../atoms/game';
import { router } from '../../constants/router';
import { createReactiveGame } from '../../core/Game';
import { queueEvent } from '../../core/eventQueue';

export enum GAME_EVENTS {
  START_GAME = 'START_GAME',
  TAKE_CARDS = 'TAKE_CARDS',
  START_TURN = 'START_TURN',
  END_TURN = 'END_TURN',
  START_ROUND = 'START_ROUND',
  PLAYED_CARDS = 'PLAYED_CARDS',
  END_ROUND = 'END_ROUND',
  WORLD_STATE = 'WORLD_STATE',
}

export enum PLAYER_EVENTS {}

export type GameEvent = { fromId?: string; toId?: string } & (
  | { type: GAME_EVENTS.START_GAME; players: string[] }
  | { type: GAME_EVENTS.PLAYED_CARDS; data: { cardsLeft: Card[]; playedCards: Card[] } }
  | { type: GAME_EVENTS.TAKE_CARDS; data: { cards: Card[] } }
  | { type: GAME_EVENTS.START_TURN }
  | { type: GAME_EVENTS.WORLD_STATE; data: { world: Item[] } }
  | { type: GAME_EVENTS.END_TURN; data: { cardsLeft: Card[]; playedCards: Card[] } }
  | { type: GAME_EVENTS.START_ROUND; payload: { cards: Card[] } }
  | { type: 'chat'; message: string }
);

export const incomingEvent$ = new Subject<GameEvent>();
export const outcomingEvents$ = new Subject<GameEvent>();
export const playerEvents$ = new Subject<GameEvent>();
export const drawEvents$ = new Subject<GameEvent>();

export function startRound() {
  const me = store.get(meAtom);
  if (!me) throw new Error('no me');
  outcomingEvents$.next({
    fromId: me.playerName,
    type: GAME_EVENTS.START_ROUND,
    payload: { cards: [1, 2, 3] },
  });
  // give cards myself
  //
  //sendCards to players
}

export const processEvent = (ev: GameEvent) => {
  if (queueEvent(ev)) return;
  const game = store.get(gameAtom);
  const playerName = store.get(stateAtom);
  const players = store.get(playersAtom);
  const me = store.get(meAtom);
  const isServer = store.get(hasServerAtom);

  if (ev.type === GAME_EVENTS.START_GAME) {
    if (isServer) {
      const me = createReactiveGame(new Player(playerName, true));
      store.set(meAtom, me);
      const game = new Game([me, ...Object.values(players)]);
      store.set(gameAtom, game);
      game.startGame();
    } else {
      const me = createReactiveGame(new Player(playerName));
      store.set(meAtom, me);
      const game = new Game([me, ...Object.values(players)]);
      store.set(gameAtom, game);
    }
  }
  if (ev.type === GAME_EVENTS.TAKE_CARDS) {
    me?.takeCards(ev.data.cards);
    // if (ev.toId === me?.playerName) {
    //   drawEvents$.next(ev);
    // }
    return;
  }
  if (ev.type === GAME_EVENTS.END_TURN) {
    game?.endTurn(players[ev.fromId], ev.data.playedCards, ev.data.cardsLeft);
    return;
  }
  if (ev.type === GAME_EVENTS.PLAYED_CARDS) {
    const playerEvIndex = game?.players.findIndex((pl) => (pl.playerName = ev.fromId));
    //todo: check logic
    if (playerEvIndex !== undefined && playerEvIndex > -1) {
      const nextIndex = (playerEvIndex + 1) % (game?.players?.length || 0);
      const nextPlayer = game?.players[nextIndex];
      if (!nextPlayer) throw new Error('next player should exist');
      nextPlayer.nextCards = ev.data.cardsLeft;
    }
    return;
  }
};
outcomingEvents$.subscribe((ev) => {
  const host = store.get(hostAtom);
  const playerName = store.get(stateAtom);
  const players = store.get(playersAtom);

  if (ev.toId && playerName !== ev.toId) {
    const targetPlayer = players[ev.toId];
    if (targetPlayer instanceof RemotePlayer) {
      targetPlayer.dc?.send(JSON.stringify({ fromId: playerName, ...ev }));
    }
    return;
  }
  if (!ev.toId && host instanceof RemotePlayer) {
    host.dc?.send(JSON.stringify({ fromId: playerName, ...ev }));
  } else {
    if (ev.type === GAME_EVENTS.START_GAME) {
      router.navigate('/game');
    }
    processEvent({ ...ev, fromId: playerName });
  }
});

function startTurn() {
  // give cards myself
  //
  // sendCards to players according to position
}

function endTurn() {
  // tell the server which cards were picked or left
}

function endRound() {
  // tell the server where you want to place items
  // count scores
}

function endGame() {
  //count scores
}
