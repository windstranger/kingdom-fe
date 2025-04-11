import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { RoomScreen } from './components/RoomScreen/RoomScreen.jsx';
import { GameScreen } from './components/GameScreen/GameScreen.jsx';
// import WebRtcQR2 from './components/StartScreen/WebRtcQR2.tsx';
import { StartScreen } from './components/StartScreen/StartScreen';
import WebRtcQR2 from './components/StartScreen/WebRtcQR2';
import { InternetWebRtc } from './components/StartScreen/InternetWebRTC';
import { SettingsScreen } from './components/SettingsScreen/SettingsScreen';
import { TestScreen } from './components/TestScreen';
import { WebsocketComponent } from './components/StartScreen/WebsocketComponent';
import { PlayerControl } from './components/StartScreen/PlayerControl';
import { Provider } from 'jotai';
import { store } from './atoms/stateAtom';

function App() {
  return (
    //todo: carefull
    <Provider store={store}>
      <Router>
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
        <Routes>
          <Route path={'/game'} element={<GameScreen />}></Route>
          <Route path={'/room'} element={<RoomScreen />}></Route>
          <Route path={'/webrtc'} element={<WebRtcQR2 />}></Route>
          <Route path={'/test'} element={<TestScreen />}></Route>
          <Route path={'/internet'} element={<InternetWebRtc />}></Route>
          <Route path={'/settings'} element={<SettingsScreen />}></Route>
          <Route path={'/'} element={<StartScreen />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
