#!/usr/bin/env python

import asyncio
import json
import uuid
from urllib.parse import urlparse, parse_qs
import ssl

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(certfile="./cert.pem", keyfile="./key.pem")

from websockets.server import serve

from Player import Player

# Dictionary to store WebSocket connections with unique names
connections = []


def extract_player_name(host, path):
    parsed_url = urlparse(f"ws://{host}{path}")
    query_params = parse_qs(parsed_url.query)
    player_name = query_params.get("playerName", [None])[0]
    uuid_value = str(uuid.uuid4())
    return player_name if player_name is not None else uuid_value


count = 0


async def broadCastMessage(jsonData):
    for connection in connections:
        await connection.websocket.send(json.dumps(jsonData))


async def echo(websocket):
    global connections
    global count
    playerName = extract_player_name(websocket.request_headers.get("Host"), websocket.path)
    existing_player = next((player for player in connections if player.info["playerName"] == playerName), None)

    try:
        if not existing_player:
            connections.append(Player(websocket, playerName))
            players = [connection.info for connection in connections]
            print(players)
            await broadCastMessage({"data": players, "type": "players"})
        else:
            await websocket.send(json.dumps({"message": "player exists", "type": "error"}))
            await websocket.close()
            return
            # connections[connections.index(existing_player)]={"playerName": playerName, "websocket": websocket}

        async for message in websocket:
            msg = json.loads(message)
            print(msg)
            if msg["type"] == "sdp" or msg["type"] == "icecandidate":
                print("sdp")
                print(msg["remoteId"])
                connection = next((player for player in connections if player.info["playerName"] == msg["remoteId"]),
                                  None)
                await connection.websocket.send(message)
            if msg["type"] == "dropServer":
                print("newserver")
                myConnection = next((player for player in connections if player.info["playerName"] == msg["fromId"]),
                                    None)
                myConnection.info["hasServer"] = False
                for connection in connections:
                    await connection.websocket.send(message)
            if msg["type"] == "newServer":
                myConnection = next((player for player in connections if player.info["playerName"] == msg["fromId"]),
                                    None)
                myConnection.info["hasServer"] = True
                players = [connection.info for connection in connections]
                await broadCastMessage({"data": players, "type": "players"})
    finally:
        # Cleanup operations for disconnection
        existing_player = next((player for player in connections if player.info["playerName"] == playerName), None)
        del connections[connections.index(existing_player)]
        players = [connection.info for connection in connections]
        for connection in connections:
            await connection.websocket.send(json.dumps({"data": players, "type": "players"}))
        print("disconnected")
        # await handle_disconnection(name)


async def main():
    async with serve(echo, "0.0.0.0", 8765, ssl=ssl_context):
        await asyncio.Future()  # run forever


asyncio.run(main())
