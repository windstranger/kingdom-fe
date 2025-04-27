import { createBrowserRouter } from 'react-router-dom';
import { GameScreen } from '../components/GameScreen/GameScreen';
import { RoomScreen } from '../components/RoomScreen/RoomScreen';
import WebRtcQR2 from '../components/StartScreen/WebRtcQR2';
import { TestScreen } from '../components/TestScreen';
import { SettingsScreen } from '../components/SettingsScreen/SettingsScreen';
import { StartScreen } from '../components/StartScreen/StartScreen';
import { InternetWebRtc } from '../components/StartScreen/InternetWebRTC';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: StartScreen,
    children: [
      { path: 'game', Component: GameScreen },
      { path: 'room', Component: RoomScreen },
      { path: 'webrtc', Component: WebRtcQR2 },
      { path: 'test', Component: TestScreen },
      { path: 'internet', Component: InternetWebRtc },
      { path: 'settings', Component: SettingsScreen },
    ],
  },
]);
