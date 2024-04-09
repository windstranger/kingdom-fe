import { atomWithLocalStorage } from '../atomWithStorage.js';
import { atom } from 'jotai';
import { range, shuffle } from 'lodash';
import { difference } from 'lodash/array.js';

export const stateAtom = atomWithLocalStorage('playerName', null);
export const playerConnectionsAtom = atom([]);
export const gameAtom = atom();

const cardsAmount = 182;
const statuses = {
  waitingCards: 'waitingCards',
  running: 'runningCards',
};
export class Player {
  status = statuses.waitingCards;
  playedCards = [];
  game;
  playerName;
  playerConnection;
  cards;
  nextCards = [];

  constructor(playerName) {
    this.playerName = playerName;
  }

  takeCards(cards) {
    if (this.status !== statuses.waitingCards) {
      this.nextCards.push([...cards]);
    } else {
      this.status = statuses.running;
      this.cards = [...cards];
    }
  }
  endTurn(playedCards) {
    this.playedCards = [...this.playedCards, ...playedCards];
    const remainingCards = [...this.cards];
    if (this.nextCards?.length) {
      this.cards = [...this.nextCards.splice(0, 1)]?.[0] || [];
      this.nextCards = [...this.nextCards];
      this.status = statuses.running;
    } else {
      this.status = statuses.waitingCards;
      this.cards = [];
    }
    this.game.endTurn(this, playedCards, remainingCards);
  }
}
export class Game {
  currentRound = 1;
  playersFinished = 0;
  players = [];
  cards = [];
  world = {};

  getNextPlayer(currentPlayer) {
    const currentPlayerIndex = this.players.findIndex(
      (pl) => pl.playerName === currentPlayer.playerName,
    );
    let nextPlayerIndex = currentPlayerIndex + 1;
    if (nextPlayerIndex === this.players?.length) {
      nextPlayerIndex = 0;
    }
    return this.players[nextPlayerIndex];
  }
  endRound() {
    this.playersFinished = 0;
    this.currentRound += 1;
    if (this.currentRound !== 4) {
      this.roundBegin();
    } else {
      this.gameEnd();
    }
  }
  giveCards(player, amount) {
    const rest = this.cards.splice(0, amount);
    this.cards = [...this.cards];
    player.takeCards(rest);
  }
  gameEnd() {
    this.currentRound = 0;
    console.log('game end');
  }
  endTurn(player, playedCards, remainingCards) {
    if (!remainingCards?.length) {
      this.playersFinished += 1;
    } else {
      const nextPlayer = this.getNextPlayer(player);
      nextPlayer.takeCards(remainingCards);
    }

    if (!remainingCards?.length && this.playersFinished === this.players?.length) {
      debugger;
      this.endRound();
    }
  }
  joinGame(player) {
    player.game = this;
    this.players.push(player);
  }
  startGame() {
    this.cards = shuffle(range(cardsAmount));
    this.currentRound = 1;
    this.roundBegin();
  }

  roundBegin() {
    this.players.forEach((player) => {
      this.giveCards(player, 10);
    });
  }
}
