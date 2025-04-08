import { atomWithLocalStorage } from '../atomWithStorage.js';
import { atom, createStore } from 'jotai';

export const store = createStore();
export const hasServerAtom = atom(false);
export const stateAtom = atomWithLocalStorage('playerName', null);
export const playerConnectionsAtom = atom([]);
export const playersAtom = atom([]);
export const gameAtom = atom(null);
export const websocketAtom = atom({});
export const playerMessagesAtom = atom([]);
export const serverPlayerConnection = atom();

export const mySettings = atom([]);
