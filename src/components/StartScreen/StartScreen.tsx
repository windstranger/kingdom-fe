'use client';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { stateAtom } from '../../atoms/stateAtom.js';
import { useAtom } from 'jotai';
import { LoginForm } from './LoginForm.jsx';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { gameEvent$, notifyUnity } from './eventBus.ts';

import LZString from 'lz-string';
import { PlayerList } from '../ui/PlayerList';
import { PlayerControl } from './PlayerControl';
import { WebsocketComponent } from './WebsocketComponent';

const sdp = {
  type: 'answer',
  sdp: 'v=0\r\no=mozilla...THIS_IS_SDPARTA-99.0 395828366236135998 0 IN IP4 0.0.0.0\r\ns=-\r\nt=0 0\r\na=fingerprint:sha-256 DA:2F:98:1E:40:38:8C:10:89:BD:B1:C9:75:85:7C:C2:FD:E7:01:66:BC:C0:62:BF:02:73:9C:8C:00:AD:BC:86\r\na=group:BUNDLE 0\r\na=ice-options:trickle\r\na=msid-semantic:WMS *\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=sendrecv\r\na=ice-pwd:110ddb3ec566c0dd635532169923f2bd\r\na=ice-ufrag:56afa2b3\r\na=mid:0\r\na=setup:active\r\na=sctp-port:5000\r\na=max-message-size:1073741823\r\n',
};
const sdpString = JSON.stringify(sdp);
const compressed = LZString.compressToBase64(sdpString);
console.log('Compressed length:', compressed.length);
type ScanTypes = 'scan' | 'internet';

export const StartScreen = () => {
  const navigate = useNavigate();
  const [qrConeectionType, setQrConnectionType] = useState<ScanTypes>('scan');

  const [playerName, setPlayerName] = useAtom(stateAtom);

  const onEnterRoom = (e) => {
    e.preventDefault();
    setPlayerName(e.target.nick.value);
  };

  useEffect(() => {
    const sub = gameEvent$.subscribe(notifyUnity);
    return () => sub.unsubscribe();
  }, [gameEvent$]);

  return (
    <div>
      <div className={'flex gap-4'}>
        <PlayerControl />
        <Link className={'underline text-blue-400'} to={'/'}>
          home
        </Link>
        <Link className={'underline text-blue-400'} to={'/game'}>
          game
        </Link>
        <Link className={'underline text-blue-400'} to={'/test'}>
          test
        </Link>
        <Link className={'underline text-blue-400'} to={'/settings'}>
          settings
        </Link>
        <WebsocketComponent />
      </div>
      <ToastContainer />
      {!playerName ? (
        <LoginForm onEnterRoom={onEnterRoom} />
      ) : (
        <div>
          <div className={''}>
            <div className={'flex gap-2'}>
              <NavLink className={'link'} to={'/webrtc'}>
                add webrtc connection
              </NavLink>
              <NavLink className={'link'} to={'/internet'}>
                add internet connection
              </NavLink>
            </div>
            <PlayerList />
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};
