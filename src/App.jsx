import './App.css';
// import { StartScreen } from './components/StartScreen/StartScreen.jsx';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { RoomScreen } from './components/RoomScreen/RoomScreen.jsx';
import { GameScreen } from './components/GameScreen/GameScreen.jsx';
import WebRtcQR2 from './components/StartScreen/WebRtcQR2.tsx';

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
          {/*<Route path={'/'} element={<StartScreen />}></Route>*/}
          {/*<Route path={'/'} element={<WebRtcQR />}></Route>*/}
          <Route path={'/'} element={<WebRtcQR2 />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
