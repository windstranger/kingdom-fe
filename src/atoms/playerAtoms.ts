import { atom } from 'jotai';
import { GAME_EVENTS, GameEvent, outcomingEvents$ } from '../components/StartScreen/gameActions';
// import { GameEvent } from '../components/StartScreen/eventBus';

export type Item = {
  id: number;
  playerName?: string;
  pos?: {
    row?: number;
    col?: number;
  };
};
export type Card = {
  id: number;
};

export type AbstractPlayer = {
  playerName: string;
  playedCards?: Card[];
  myCards?: Card[];
  myItems?: Item[];
  isMe: boolean;
  isHost: boolean;
  takeCards: (cards: Card[]) => void;
  nextCards: Card[];
};

type RemotePlayerType = AbstractPlayer & {
  pc?: RTCPeerConnection;
  dc?: RTCDataChannel;
  isMe: boolean;
};

export class RemotePlayer implements RemotePlayerType {
  nextCards: Card[] = [];
  playerName: string = '';
  // cards that has been played
  playedCards?: Card[];
  myCards?: Card[];
  myItems?: Item[];
  isHost: boolean;

  pc?: RTCPeerConnection;
  dc?: RTCDataChannel;
  isMe = false;

  constructor(
    pc: RTCPeerConnection,
    dc: RTCDataChannel,
    playerName: string,
    isHost: boolean = false,
  ) {
    this.pc = pc;
    this.dc = dc;
    this.playerName = playerName;
    this.isHost = isHost;
  }

  takeCards = (cards: Card[]) => {
    this.dc?.send(
      JSON.stringify({ toId: this.playerName, type: GAME_EVENTS.TAKE_CARDS, data: { cards } }),
    );
  };
}

export class Player implements AbstractPlayer {
  nextCards: Card[] = [];
  playerName: string = '';
  playedCards: Card[] = [];
  myCards: Card[] = [];
  myItems: Item[] = [];
  isHost: boolean;

  constructor(playerName: string, isHost: boolean = false) {
    this.playerName = playerName;
    this.isHost = isHost;
  }

  isMe = true;
  takeCards = (cards: Card[]) => {
    this.myCards = [...cards];

    console.log('take local cards');
    console.log(cards);
  };
  playCards = (cards: Card[]) => {
    this.playedCards = [...this.playedCards, ...cards];
    const cardsLeft = this.myCards.filter((card) => !cards.includes(card));
    const playEvent: GameEvent = {
      fromId: this.playerName,
      type: GAME_EVENTS.END_TURN,
      data: {
        cardsLeft: cardsLeft,
        playedCards: cards,
      },
    };
    outcomingEvents$.next(playEvent);
  };
}

export const playersAtom = atom<{ [key: string]: AbstractPlayer }>({});

export const hostAtom = atom<AbstractPlayer | null>(null);
