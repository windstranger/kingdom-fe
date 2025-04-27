import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasServerAtom, meAtom } from '../../atoms/stateAtom.js';
import { useAtom, useAtomValue } from 'jotai';
import { Card, Item } from '../../atoms/playerAtoms';
import { drawEvents$, GAME_EVENTS } from './gameActions.js';
import { flushQueue, isGameReady } from '../../core/eventQueue';

export const GameController = () => {
  const me = useAtomValue(meAtom);
  const [force, setForce] = useState(false);
  console.log('game controller my cards', me?.myCards);

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

  useEffect(() => {
    isGameReady.flag = true;
    flushQueue();
  }, []);

  useEffect(() => {
    const meSub = me?.changes$.subscribe((e) => {
      // debugger;
      // setForce((f) => !f);
    });
    const drawSub = drawEvents$.subscribe((ev) => {
      // if (ev.type === GAME_EVENTS.TAKE_CARDS) {
      //   debugger;
      //   setMyCards(ev.data.cards);
      // }
      // if (ev.type === GAME_EVENTS.WORLD_STATE) {
      //   setWorldItems(ev.data.world);
      // }
    });
    return () => {
      drawSub.unsubscribe();
      meSub?.unsubscribe();
    };
  }, [me?.changes$]);

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
      <div>
        <div className={'flex'}>
          {me?.myCards.map((card, index) => {
            return (
              <div
                className={`w-16 h-32  border m-1 ${playedCards.has(card) ? 'bg-green-300' : 'bg-amber-400'}`}
                key={index}
                onClick={() => {
                  onSelectCard(card);
                }}
              >
                {card.id}
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
