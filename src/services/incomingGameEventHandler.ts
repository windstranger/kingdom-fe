import { useCallback } from 'react';
import { GAME_EVENTS, GameEvent, processEvent } from '../components/StartScreen/gameActions';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { meAtom, stateAtom } from '../atoms/stateAtom';
import { Player } from '../atoms/playerAtoms';

export const useIncomingGameEventHandler = () => {
  const navigate = useNavigate();
  const playerName = useAtomValue(stateAtom);
  const setMe = useSetAtom(meAtom);

  return useCallback(
    (event: { data: string }) => {
      const eventData: GameEvent = JSON.parse(event.data);
      if (eventData.type === GAME_EVENTS.START_GAME) {
        navigate('/game');

        // add players from webrtc
        setMe(new Player(playerName));
        // game.startGame();

        // outcomingEvents$.next(eventData);
        return;
      }
      if (eventData) {
        processEvent(eventData);
        // incomingEvent$.next(eventData);
      }
    },
    [navigate, playerName, setMe],
  );
};
