import WebSocketHandler from "../../WebSocketHandler.jsx";
import {useAtomValue} from 'jotai';
import {stateAtom} from "../../atoms/stateAtom.js";

export const RoomScreen = () => {
    const playerName = useAtomValue(stateAtom);
    return (
        <div>
            <WebSocketHandler playerName={playerName} />
        </div>
    )
}
