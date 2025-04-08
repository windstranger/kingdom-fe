import { atom } from 'jotai';

type Player = {
  name: string;
  pc: RTCPeerConnection;
  sendMessage: (msg: RTCPeerConnection) => void;
  dc: RTCDataChannel;
};

export const playersAtom = atom<{ [key: string]: Player }>({});
