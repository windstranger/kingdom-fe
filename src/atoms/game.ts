import { range } from 'lodash';

import { cardsAmount } from './constants';
import { AbstractPlayer, Card, Item } from './playerAtoms';
import { GAME_EVENTS, outcomingEvents$ } from '../components/StartScreen/gameActions';

export type AbstractGameType = {
  endTurn: (player: AbstractPlayer, playedCards: Card[], remainingCards: Card[]) => void;
};

export class RemoteGame implements AbstractGameType {
  endTurn(player: AbstractPlayer, playedCards: Card[], remainingCards: Card[]) {
    outcomingEvents$.next({
      type: GAME_EVENTS.END_TURN,
      fromId: player.playerName,
      data: { playedCards, cardsLeft: remainingCards },
    });
  }
}

export class Game {
  currentRound: number;
  playersFinished: number;
  players: AbstractPlayer[];
  cards: Card[];
  world: object;

  constructor(players: AbstractPlayer[]) {
    this.players = players;
    this.currentRound = 0;
    this.playersFinished = 0;
    this.cards = [];
    this.world = {};
  }

  getNextPlayer(currentPlayer: AbstractPlayer) {
    const currentPlayerIndex = this.players.findIndex(
      (pl) => pl.playerName === currentPlayer.playerName,
    );
    let nextPlayerIndex = currentPlayerIndex + 1;
    if (nextPlayerIndex === this.players?.length) {
      nextPlayerIndex = 0;
    }
    return this.players[nextPlayerIndex];
  }

  endRound(player: AbstractPlayer, placedItems: Item[]) {
    this.playersFinished += 1;
    if (this.playersFinished === this.players?.length && this.currentRound !== 4) {
      this.playersFinished = 0;
      this.currentRound += 1;
      this.roundBegin();
    }
    if (this.currentRound === 4 && this.playersFinished === this.players?.length) {
      this.gameEnd();
    }
  }

  giveCards(player: AbstractPlayer, amount: number) {
    const rest = this.cards.splice(0, amount);
    this.cards = [...this.cards];
    outcomingEvents$.next({
      toId: player.playerName,
      type: GAME_EVENTS.TAKE_CARDS,
      data: { cards: rest },
    });
  }

  gameEnd() {
    this.currentRound = 0;
    console.log('game end');
  }

  endTurn(player: AbstractPlayer, playedCards: Card[], remainingCards: Card[]) {
    if (remainingCards?.length) {
      const nextPlayer = this.getNextPlayer(player);
      nextPlayer.takeCards(remainingCards);
    }
  }

  joinGame(player: AbstractPlayer) {
    // player.game = this;
    this.players.push(player);
  }

  startGame() {
    // this.cards = shuffle(range(cardsAmount));
    this.cards = range(cardsAmount).map((c) => {
      return { id: c };
    });
    this.currentRound = 1;
    this.roundBegin();
  }

  roundBegin() {
    this.players.forEach((player) => {
      this.giveCards(player, 10);
    });
  }
}
