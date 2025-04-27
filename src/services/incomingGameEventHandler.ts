import { useCallback } from 'react';
import { GAME_EVENTS, GameEvent, processEvent } from '../components/StartScreen/gameActions';
import { router } from '../constants/router';

export const useIncomingGameEventHandler = () => {
  return useCallback((event: { data: string }) => {
    const eventData: GameEvent = JSON.parse(event.data);
    if (eventData) {
      if (eventData.type === GAME_EVENTS.START_GAME) {
        router.navigate('/game');
      }
      processEvent(eventData);
      // incomingEvent$.next(eventData);
    }
  }, []);
};
