import { useNavigate } from 'react-router-dom';
import { Game, Player, stateAtom } from '../../atoms/stateAtom.js';
import { useAtom } from 'jotai';
import { slice, take } from 'lodash/array.js';
import { useEffect } from 'react';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const StartScreen = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useAtom(stateAtom);

  const onEnterRoom = (e) => {
    e.preventDefault();
    setPlayerName(e.target.nick.value);
    navigate('/room');
  };

  useEffect(() => {
    (async () => {
      const player1 = new Player('sasha');
      const player2 = new Player('katya');
      const game = new Game();
      game.joinGame(player1);
      game.joinGame(player2);
      game.startGame();

      for (let i = 0; i < 20; ++i) {
        player1.endTurn(player1.cards.splice(0, 2));
        player2.endTurn(player2.cards.splice(0, 2));
      }

      console.log(game);
    })();
  }, []);
  return (
    <div>
      <form onSubmit={onEnterRoom}>
        <label>
          Введите ник
          <input defaultValue={playerName} name={'nick'} className={'p-2 border'} />
        </label>
        <button className={'bg-amber-300 border p-2'} type={'submit'}>
          Войти
        </button>
      </form>
    </div>
  );
};
