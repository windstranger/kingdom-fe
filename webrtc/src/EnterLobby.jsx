import React, {useState} from 'react';
import WebSocketHandler from "./WebSocketHandler.jsx";

function EnterLobby(props) {
    const [playerName, setPlayerName] = useState("sasha"+new Date().getSeconds());
    const [connected, setConnected] = useState(false);

    function onEnterLobby() {
        setConnected(!connected)
        // sendMessage(JSON.stringify({name: usernameRef.current.value, type: "hello"}))
    }

    console.log(connected);
    return (
        <div>
            {!connected && <div>
                <label>userName</label>
                <input type={"text"} value={playerName} onChange={(e) => {
                    setPlayerName(e.target.value)
                }}/>
            </div>
            }
            {connected && <WebSocketHandler playerName={playerName}/>}
            <button onClick={onEnterLobby}>{connected ? "disconnect" : "enter lobby"}</button>
        </div>
    );
}

export default EnterLobby;