import { atomWithLocalStorage } from '../atomWithStorage.js';
import { atom, createStore } from 'jotai';
import { AbstractGameType, Game } from './game';
import { Player } from './playerAtoms';
import { GameWithBatching } from '../core/Game';

export const store = createStore();

export const hasServerAtom = atom(false);
export const stateAtom = atomWithLocalStorage('playerName', '');
export const playerConnectionsAtom = atom([]);
export const playersAtom = atom([]);
export const gameAtom = atom<Game | null>(null);
export const meAtom = atom<(GameWithBatching & Player) | null>(null);
export const websocketAtom = atom({});
export const playerMessagesAtom = atom([]);

export const websocketAddressAtom = atomWithLocalStorage('websocket', 'ws://127.0.0.1:8765');

export type ConnectedUser = {
  playerName: string;
  hasServer: boolean;
};

export const connectedUsersAtom = atom<ConnectedUser[]>([]);
