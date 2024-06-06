import { useCallback, useEffect, useRef } from 'react';
import { Game, gameAtom } from '../../atoms/stateAtom.js';
import { useAtom } from 'jotai';

export const GameController = () => {
  const [, setGame] = useAtom(gameAtom);

  const startGame = useCallback(() => {
    setGame(new Game());
  });
  useEffect(() => {
    (async () => {
      // const player1 = new Player('sasha');
      // const player2 = new Player('katya');
      // const game = new Game();
      // game.joinGame(player1);
      // game.joinGame(player2);
      // game.startGame();
      // const roundAmount = 5;
      // for (let i = 0; i < roundAmount; ++i) {
      //   player1.endTurn(player1.cards.splice(0, 2));
      //   player2.endTurn(player2.cards.splice(0, 2));
      // }
      // player1.endRound();
      // player2.endRound();
      //
      // for (let i = 0; i < roundAmount; ++i) {
      //   player1.endTurn(player1.cards.splice(0, 2));
      //   player2.endTurn(player2.cards.splice(0, 2));
      // }
      // player1.endRound();
      // player2.endRound();
      //
      // console.log(game);
    })();
  }, []);
  return (
    <div>
      connected players:
      <button className={'p-4 bg-yellow-300 border-r'} onClick={startGame}>
        start game
      </button>
    </div>
  );
};
