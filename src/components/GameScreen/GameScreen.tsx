import { UnityContainer } from '../../UnityContainer';
import { memo, useEffect, useRef } from 'react';
import { Player } from '../../atoms/player';
import { GameController } from '../StartScreen/GameController';
import { useAtomValue } from 'jotai';

// import { useEffect } from 'react';
// type Field = {
//   type: string;
//   ownPlayer: Player
// }
// class GameEngine {
//   players: Player[] = [];
//   cards: number[] = [];
//   field:
// }

export const GameScreen = memo(() => {
  // useEffect(() => {}, []);
  // const gameEngine = useRef<GameEngine>();
  // useEffect(() => {
  // console.log('game engine');
  // gameEngine.current = new GameEngine();
  // }, []);

  return (
    <div>
      <GameController />
      {/*<UnityContainer />*/}
    </div>
  );
});
