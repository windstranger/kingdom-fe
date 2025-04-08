import { statuses } from './constants.js';

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
      this.status = statuses.pickingCards;
      this.cards = [...cards];
    }
  }

  endTurn(playedCards) {
    this.playedCards = [...this.playedCards, ...playedCards];
    const remainingCards = [...this.cards];
    if (this.nextCards?.length) {
      this.cards = [...this.nextCards.splice(0, 1)]?.[0] || [];
      this.nextCards = [...this.nextCards];
      this.status = statuses.pickingCards;
    } else {
      this.status = statuses.waitingCards;
      this.cards = [];
    }

    this.game.endTurn(this, playedCards, remainingCards);
  }

  endRound(placedItems) {
    this.game.endRound(this, placedItems);
  }
}
