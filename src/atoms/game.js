import { range } from 'lodash';

import { cardsAmount } from './constants.js';

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

  endRound(player, placedItems) {
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
    if (remainingCards?.length) {
      const nextPlayer = this.getNextPlayer(player);
      nextPlayer.takeCards(remainingCards);
    }
  }

  joinGame(player) {
    player.game = this;
    this.players.push(player);
  }

  startGame() {
    // this.cards = shuffle(range(cardsAmount));
    this.cards = range(cardsAmount);
    this.currentRound = 1;
    this.roundBegin();
  }

  roundBegin() {
    this.players.forEach((player) => {
      this.giveCards(player, 10);
    });
  }
}
