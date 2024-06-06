import './App.css';
import { StartScreen } from './components/StartScreen/StartScreen.jsx';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import { RoomScreen } from './components/RoomScreen/RoomScreen.jsx';
import { GameScreen } from './components/GameScreen/GameScreen.jsx';

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
          <Route path={'/'} element={<StartScreen />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
