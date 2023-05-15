import React, {useEffect, useRef, useState} from 'react';
import useWebSocket from "react-use-websocket";
import {PlayerConnection} from "./PlayerConnection.js";

function WebSocketHandler({playerName}) {
    const playerConnections = useRef([])
    const [players, setPlayers] = useState([]);
    const playerRef = useRef();
    const socketUrl = `ws://localhost:8765/?playerName=${playerName}`
    const usernameRef = useRef();
    const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl,
        {
            onOpen: () => console.log('opened'),
            onClose: () => console.log("disconnected"),
            onError: () => console.log("error happened"),
            //Will attempt to reconnect on all close events, such as server shutting down
            // shouldReconnect: (closeEvent) => true,
            onMessage: async (msg) => {
                try {
                    console.log(msg.data);
                    const data = JSON.parse(msg.data)
                    if (data.type === "error") {
                        console.log(data.message)
                        // setPlayers(data.data)
                    }
                    if (data.type === "players") {
                        setPlayers(data.data)
                    }
                    if (data.type === "sdp") {
                        console.log("received sdp", data);
                        const playerCon = playerConnections.current.find(con => con.fromId = data.fromId)
                        if (playerCon) {
                            await playerCon.setRemoteDescription(data.data)
                        } else {
                            const playerConnection = new PlayerConnection(playerName, data.fromId, sendMessage, true)

                            playerConnections.current.push(playerConnection);
                            await playerConnection.createAnswer(data.data);
                        }
                        // setPlayers(data.data)
                    }
                    if (data.type === "offer") {
                        setPlayers(data.data)
                    }
                    if (data.type === "answer") {
                        setPlayers(data.data)
                    }
                    if (data.type === "icecandidate") {
                        console.log("icecandidate");
                        const candidate = new RTCIceCandidate(data.data);
                        try {
                            const playerCon = playerConnections.current.find(con => con.fromId = data.fromId)
                            await playerCon.addIceCandidate(candidate)
                        } catch (e) {
                            console.log(e)
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    );
    const onSendMessage = () => {
        sendMessage(JSON.stringify({name: usernameRef.current.value, type: "hello"}))
    }

    function onServerSelect(ev) {
        console.log(ev.target.value);
    }

    async function onConnectToPlayer() {
        const playerConnection = new PlayerConnection(playerName, playerRef.current.value, sendMessage)
        playerConnections.current.push(playerConnection);
        await playerConnection.createOffer()

    }

    const sendWebRtcMessage= async ()=>{
        // console.log(playerConnections.current);
        await playerConnections.current[0].sendDataChannelMessage();
    }

    useEffect(() => {
        console.log("mounted");
    }, []);

    return (
        <div>
            <select size={10} ref={playerRef}>
                {players.map((player, index) => {
                    return <option key={index} value={player}>{player}</option>
                })}
            </select>
            <div>
                Server status: {readyState}
            </div>
            <button onClick={onConnectToPlayer}>connect to player</button>
            <button onClick={sendWebRtcMessage}>send webrtc message</button>

            {/*<button onClick={onSendMessage}>connect to client</button>*/}
        </div>
    );
}

export default React.memo(WebSocketHandler);