import { useAtom } from 'jotai';
import { stateAtom, websocketAddressAtom } from '../../atoms/stateAtom';

export const SettingsScreen = () => {
  const [websocketAddress, setWebsocketAddress] = useAtom(websocketAddressAtom);
  const [playerName, setPlayerName] = useAtom(stateAtom);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title">Настройки</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">WebSocket адрес</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              value={websocketAddress}
              onChange={(e) => setWebsocketAddress(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Имя игрока</span>
            </label>
            <input
              type="text"
              className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
