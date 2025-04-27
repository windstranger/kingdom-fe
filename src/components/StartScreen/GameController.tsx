import { useCallback, useEffect, useMemo, useState } from 'react';
import { gameAtom, hasServerAtom, meAtom, stateAtom } from '../../atoms/stateAtom.js';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Game } from '../../atoms/game';
import { Card, Item, Player, playersAtom } from '../../atoms/playerAtoms';
import { drawEvents$, GAME_EVENTS } from './gameActions.js';
import { createReactiveGame } from '../../core/Game';

export const GameController = () => {
  const setGame = useSetAtom(gameAtom);
  const players = useAtomValue(playersAtom);

  const playerName = useAtomValue(stateAtom);
  const [me, setMe] = useAtom(meAtom);
  const serverCreated = useAtomValue(hasServerAtom);

  const [myCards, setMyCards] = useState([1, 2, 3]);
  const [worldItems, setWorldItems] = useState<Item[]>([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ]);
  const notPlacedItems = useMemo(() => {
    return worldItems.filter((el) => !el.pos);
  }, [worldItems]);
  const placedItems = useMemo(() => {
    return worldItems.filter((el) => el.pos);
  }, [worldItems]);
  const [playedCards, setPlayedCards] = useState(new Set());

  const startGame = useCallback(() => {
    // add players from webrtc
    const game = createReactiveGame(
      new Game([new Player(playerName, true), ...Object.values(players)]),
    );
    setGame(game);
    setMe(new Player(playerName, true));
    game.startGame();
    return game;
    // game.currentRound = 2;
  }, [playerName, players, setGame, setMe]);

  useEffect(() => {
    (async () => {
      if (serverCreated) {
        startGame();
        console.log('im server');
      } else {
        console.log('im client');
      }
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

    drawEvents$.subscribe((ev) => {
      if (ev.type === GAME_EVENTS.TAKE_CARDS) {
        setMyCards(ev.data.cards);
      }

      if (ev.type === GAME_EVENTS.WORLD_STATE) {
        setWorldItems(ev.data.world);
      }
    });
    // return () => {
    //   drawEvents$.unsubscribe();
    // };
  }, [serverCreated, startGame]);
  const rows = useMemo(() => {
    return [...Array(10).keys()];
  }, []);
  const cols = useMemo(() => {
    return [...Array(10).keys()];
  }, []);

  const onSelectCard = useCallback(
    (card: Card) => {
      setPlayedCards((pl) => {
        const nSet = new Set(pl);
        if (nSet.has(card)) {
          nSet.delete(card);
        } else {
          if (nSet.size !== 2) {
            nSet.add(card);
          }
        }
        return nSet;
      });
      // me.playCards(card)
      // console.log(row);
      // console.log(col);
    },
    [setPlayedCards],
  );

  // console.log(Array.from(playedCards));

  const handleDragStart = (item: { id: number }) => (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (row: number, col: number) => (e: DragEvent) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    debugger;
    console.log(row);
    console.log(col);
    setWorldItems((worldItems) => {
      const nItems = [...worldItems];
      const elIndex = nItems.findIndex((i) => i.id === item.id);
      nItems[elIndex].pos = { col, row };
      return nItems;
    });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };
  return (
    <div>
      {/*connected players:*/}
      {/*<button className={'p-4 bg-yellow-300 border-r'} onClick={startGame}>*/}
      {/*  start game*/}
      {/*</button>*/}
      <div>
        <div className={'flex'}>
          {myCards.map((card, index) => {
            return (
              <div
                className={`w-16 h-32  border m-1 ${playedCards.has(card) ? 'bg-green-300' : 'bg-amber-400'}`}
                key={index}
                onClick={() => {
                  onSelectCard(card);
                }}
              >
                {card}
              </div>
            );
          })}
        </div>
        <div className={'flex'}>
          {notPlacedItems.map((card, index) => {
            return (
              <div
                className={'w-8 h-16 bg-amber-800 border m-1'}
                key={index}
                draggable={true}
                onDragStart={handleDragStart(card)}
              >
                {card.id}
              </div>
            );
          })}
        </div>
        <div className={'flex  mx-auto'}>
          {rows.map((row) => {
            return (
              <div key={row}>
                {cols.map((col) => {
                  const item = placedItems.find((i) => i.pos?.col === col && i.pos.row === row);
                  return (
                    <div
                      key={col}
                      className={`m-1 w-16 h-16 ${item?.id ? 'bg-red-200' : 'bg-blue-200'} border-2`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop(row, col)}
                    >
                      {item?.id}

                      {row}
                      {col}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
