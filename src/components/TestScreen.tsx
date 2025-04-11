import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAtomValue } from 'jotai';
import { stateAtom, websocketAddressAtom } from '../atoms/stateAtom';

export const TestScreen = () => {
  const [msg, setMsg] = useState<string>('');
  const wsAddress = useAtomValue(websocketAddressAtom);
  const playerName = useAtomValue(stateAtom);
  const webSocket = useWebSocket(`${wsAddress}/?playerName=${playerName}`, {
    onOpen: () => {
      setMsg('opened');
      console.log('opened');
    },
    onClose: () => {
      console.log('disconnected');
      setMsg('disconnected');
    },
    onError: () => {
      setMsg('error happened');
      console.log('error happened');
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    // shouldReconnect: (closeEvent) => true,
    onMessage: async (msg) => {
      setMsg(msg.data);
      console.log(msg);
    },
  });
  return <div>{msg}</div>;
};
