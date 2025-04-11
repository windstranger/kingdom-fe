import { BehaviorSubject, Subject } from 'rxjs';
import { store } from '../../atoms/stateAtom';
import { playersAtom } from '../../atoms/playerAtoms';

export enum GAME_EVENTS {
  START_GAME = 'START_GAME',
  START_TURN = 'START_TURN',
  END_TURN = 'END_TURN',
  START_ROUND = 'START_ROUND',
  END_ROUND = 'END_ROUND',
}
type GameEvent =
  | { type: GAME_EVENTS.START_GAME }
  | { type: GAME_EVENTS.START_TURN; playerId: string; payload: {} }
  | { type: GAME_EVENTS.START_ROUND; playerId: string; payload: { cards: number[] } }
  | { type: 'chat'; message: string };

const incoming$ = new Subject<GameEvent>();
const outcoming$ = new Subject<GameEvent>();
// const gameState$ = new BehaviorSubject<GameState>(initialState);

function startGame() {
  //broadcast message
  //navigate to route
}

export function startRound() {
  debugger;
  const players = store.get(playersAtom);
  outcoming$.next({
    type: GAME_EVENTS.START_ROUND,
    playerId: 'lol',
    payload: { cards: [1, 2, 3] },
  });
  // give cards myself
  //
  //sendCards to players
}
outcoming$.subscribe((ev) => {
  console.log(ev);
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
