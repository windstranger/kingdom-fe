import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { RoomScreen } from './components/RoomScreen/RoomScreen.jsx';
import { GameScreen } from './components/GameScreen/GameScreen.jsx';
// import WebRtcQR2 from './components/StartScreen/WebRtcQR2.tsx';
import { StartScreen } from './components/StartScreen/StartScreen';
import WebRtcQR2 from './components/StartScreen/WebRtcQR2';
import { InternetWebRtc } from './components/StartScreen/InternetWebRTC';

function App() {
  return (
    <>
      <Router>
        <div className={'flex gap-4'}>
          <Link className={'underline text-blue-400'} to={'/'}>
            home
          </Link>
          <Link className={'underline text-blue-400'} to={'/game'}>
            game
          </Link>
        </div>
        <Routes>
          <Route path={'/game'} element={<GameScreen />}></Route>
          <Route path={'/room'} element={<RoomScreen />}></Route>
          <Route path={'/webrtc'} element={<WebRtcQR2 />}></Route>
          <Route path={'/internet'} element={<InternetWebRtc />}></Route>
          <Route path={'/'} element={<StartScreen />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
