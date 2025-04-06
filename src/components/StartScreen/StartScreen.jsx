'use client';
import { useNavigate } from 'react-router-dom';
import { hasServerAtom, stateAtom, store, websocketAtom } from '../../atoms/stateAtom.js';
import { Provider, useAtom, useAtomValue } from 'jotai';
import { LoginForm } from './LoginForm.jsx';
import WebSocketHandler from '../../WebSocketHandler.jsx';
import { WaitingRoom } from './WaitingRoom.jsx';
import { useCallback, useEffect } from 'react';
import { GameController } from './GameController.jsx';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { gameEvent$, notifyUnity } from './eventBus.ts';
import { Button } from '../ui/Button.jsx';
import { QRCodeReader } from '../QRCodeReader/QRCodeReader.jsx';

import LZString from 'lz-string';
const sdp = {
  type: 'answer',
  sdp: 'v=0\r\no=mozilla...THIS_IS_SDPARTA-99.0 395828366236135998 0 IN IP4 0.0.0.0\r\ns=-\r\nt=0 0\r\na=fingerprint:sha-256 DA:2F:98:1E:40:38:8C:10:89:BD:B1:C9:75:85:7C:C2:FD:E7:01:66:BC:C0:62:BF:02:73:9C:8C:00:AD:BC:86\r\na=group:BUNDLE 0\r\na=ice-options:trickle\r\na=msid-semantic:WMS *\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=sendrecv\r\na=ice-pwd:110ddb3ec566c0dd635532169923f2bd\r\na=ice-ufrag:56afa2b3\r\na=mid:0\r\na=setup:active\r\na=sctp-port:5000\r\na=max-message-size:1073741823\r\n',
};
const sdpString = JSON.stringify(sdp);
const compressed = LZString.compressToBase64(sdpString);
console.log('Compressed length:', compressed.length);

export const StartScreen = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useAtom(stateAtom);
  const [serverCreated, setServerCreated] = useAtom(hasServerAtom);
  console.log(serverCreated);

  const onEnterRoom = (e) => {
    e.preventDefault();
    setPlayerName(e.target.nick.value);
  };

  const { sendMessage } = useAtomValue(websocketAtom);
  const createServer = useCallback(() => {
    setServerCreated(true);
    sendMessage(JSON.stringify({ fromId: playerName, type: 'newServer' }));
  }, [sendMessage, setServerCreated]);

  useEffect(() => {
    const sub = gameEvent$.subscribe(notifyUnity);
    return () => sub.unsubscribe();
  }, [gameEvent$]);

  return (
    <Provider store={store}>
      <ToastContainer />
      {/*<QRCodeReader*/}
      {/*  fps={10}*/}
      {/*  verbose={false}*/}
      {/*  qrbox={{ width: 400, height: 400 }}*/}
      {/*  disableFlip={true}*/}
      {/*  qrCodeSuccessCallback={(res) => {*/}
      {/*    console.log(res);*/}
      {/*  }}*/}
      {/*/>*/}
      {!playerName ? (
        <LoginForm onEnterRoom={onEnterRoom} />
      ) : (
        <>
          <Button
            onClick={() => {
              gameEvent$.next({ type: 'START_GAME', payload: playerName });
            }}
          >
            event
          </Button>
          <WebSocketHandler playerName={playerName} />
          {!serverCreated ? (
            <WaitingRoom createServer={createServer} playerName={playerName} />
          ) : (
            <GameController />
          )}
        </>
      )}
    </Provider>
  );
};
