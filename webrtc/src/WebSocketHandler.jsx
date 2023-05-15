import React, {useEffect, useRef, useState} from 'react';
import useWebSocket from "react-use-websocket";
import {PlayerConnection} from "./PlayerConnection.js";

function WebSocketHandler({playerName}) {
    const [textToSend, setTextToSend] = useState("");
    const [playerMessages, setPlayerMessages] = useState([]);
    const playerConnections = useRef([])
    const [players, setPlayers] = useState([]);
    const playerRef = useRef();
    const socketUrl = `ws://192.168.0.10:8765/?playerName=${playerName}`
    const usernameRef = useRef();
    const webrtcHandlers = (data) => {
        console.log(data);
        switch (data.type) {
            case "message":
                setPlayerMessages(prevPlayers => [...prevPlayers, `${data.fromId} saying: ` + data.data])
                break;
        }
    }

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

                    if (data.type === "newplayer") {
                        // const nPlayers = data.data.filter(p => p !== playerName)
                        setPlayers(players => {
                            return [...players, data.data]
                        })
                        const playerConnection = new PlayerConnection(playerName, data.data, sendMessage, false, webrtcHandlers)
                        playerConnections.current.push(playerConnection);
                        await playerConnection.createOffer()
                    }

                    if (data.type === "players") {
                        const nPlayers = data.data.filter(p => p !== playerName)

                        setPlayers(players => {
                            return [...players, ...nPlayers]
                        })

                        // console.log(nPlayers);
                        //
                    }
                    if (data.type === "sdp") {
                        const playerCon = playerConnections.current.find(con => con.remoteId === data.fromId)
                        if (playerCon) {
                            console.log("received answer", data);
                            await playerCon.setRemoteDescription(data.data)
                        } else {
                            console.log("received offer", data);
                            const playerConnection = new PlayerConnection(playerName, data.fromId, sendMessage, true, webrtcHandlers)
                            playerConnections.current.push(playerConnection);
                            await playerConnection.createAnswer(data.data);
                            console.log("answer created");
                        }
                        // setPlayers(data.data)
                    }
                    if (data.type === "icecandidate") {
                        const candidate = new RTCIceCandidate(data.data);
                        console.log("icecandidate from other peer");
                        console.log(data.data);
                        try {
                            const playerCon = playerConnections.current.find(con => con.remoteId === data.fromId)
                            await playerCon.addIceCandidate(candidate)
                            console.log("setting candidate success");
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

    async function onConnectToPlayer() {
        const playerConnection = new PlayerConnection(playerName, playerRef.current.value, sendMessage, false, webrtcHandlers)
        playerConnections.current.push(playerConnection);
        await playerConnection.createOffer()
    }

    const sendWebRtcMessage = async () => {
        // console.log(playerConnections.current);
        await Promise.all(playerConnections.current?.map(async pc => {
            await pc.sendDataChannelMessage(textToSend);
        }))

        setPlayerMessages(prevPlayers => [...prevPlayers, textToSend])
        setTextToSend("")
    }

    useEffect(() => {
        console.log("mounted");
    }, []);

    return (
        <div>
            My name is: {playerName}
            <select size={10} ref={playerRef}>
                {players.map((player, index) => {
                    return <option key={index} value={player}>{player}</option>
                })}
            </select>
            <div>
                Server status: {readyState}
            </div>
            <div>
                {playerMessages.map((msg, index) => {
                    return <div key={index}>{msg}</div>
                })
                }
            </div>
            <button onClick={onConnectToPlayer}>connect to player</button>
            <input type={"text"} value={textToSend} onChange={(e) => setTextToSend(e.target.value)}/>
            <button onClick={sendWebRtcMessage}>send webrtc message to all</button>

            {/*<button onClick={onSendMessage}>connect to client</button>*/}
        </div>
    );
}

export default React.memo(WebSocketHandler);