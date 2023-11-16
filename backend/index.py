#!/usr/bin/env python

import asyncio
import json
from websockets.server import serve
from urllib.parse import urlparse, parse_qs
import uuid

# Dictionary to store WebSocket connections with unique names
connections = []

def extract_player_name(host, path):
    parsed_url = urlparse(f"ws://{host}{path}")
    query_params = parse_qs(parsed_url.query)
    player_name = query_params.get("playerName", [None])[0]
    uuid_value = str(uuid.uuid4())
    return player_name if player_name is not None else uuid_value

count = 0
async def echo(websocket):
    global connections
    global count
    playerName = extract_player_name(websocket.request_headers.get("Host"), websocket.path)
    existing_player = next((player for player in connections if player["playerName"] == playerName), None)

    try:
        if not existing_player:
            players = [connection["playerName"] for connection in connections]
            connections.append({"playerName": playerName, "websocket": websocket})
            # curConnection = next((player for player in connections if player["playerName"] != playerName), [])

            await websocket.send(json.dumps({"data": players, "type": "players"}))

            for connection in connections:
                if connection["playerName"] != playerName:
                    await connection["websocket"].send(json.dumps({"data": playerName, "type": "newplayer"}))

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
                connection = next((player for player in connections if player["playerName"] == msg["remoteId"]), None)
                await connection["websocket"].send(message)
    finally:
        # Cleanup operations for disconnection
        existing_player = next((player for player in connections if player["playerName"] == playerName), None)
        del connections[connections.index(existing_player)]
        players = [connection["playerName"] for connection in connections]
        for connection in connections:
            await connection["websocket"].send(json.dumps({"data": players, "type": "players"}))
        print("disconnected")
        # await handle_disconnection(name)

async def main():
    async with serve(echo, "192.168.0.10", 8765):
        await asyncio.Future()  # run forever


asyncio.run(main())
