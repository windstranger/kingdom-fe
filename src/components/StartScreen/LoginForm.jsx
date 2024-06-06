import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { stateAtom } from '../../atoms/stateAtom.js';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
export const LoginForm = ({ onEnterRoom }) => {
  const playerName = useAtomValue(stateAtom);

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
