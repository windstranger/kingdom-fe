import json

class Info:
    def __init__(self, playerName, hasServer=False):
        self.playerName = playerName
        self.hasServer = hasServer


class Player:
    def __init__(self, connection, playerName, hasServer=False):
        self.websocket = connection  # WebSocket connection object
        self.info = {
            "playerName": playerName,
            "hasServer": hasServer
        }

    def getJSON(self):
        return json.dumps({"playerName": self.playerName, "hasServer": self.hasServer})
