import {useNavigate} from "react-router-dom";
import {stateAtom} from "../../atoms/stateAtom.js";
import {useAtom} from "jotai";

export const StartScreen = () => {
    const navigate = useNavigate();
    const [playerName, setPlayerName]=useAtom(stateAtom);

    const onEnterRoom = (e) => {
        e.preventDefault();
        // console.log(e.target.nick.value);
        setPlayerName(e.target.nick.value);
        navigate("/game");
    };

    return (
        <div>
            <form onSubmit={onEnterRoom}>
                <label>
                    Введите ник
                    <input defaultValue={playerName} name={"nick"} className={"p-2 border"}/>
                </label>
                <button className={"bg-amber-300 border p-2"} type={"submit"}>Зайти</button>
            </form>
        </div>
    )
}
