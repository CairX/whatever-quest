import asyncio
import json
import websockets

users = dict()


class User(object):
    def __init__(self, name, websocket):
        self.name = name
        self.websocket = websocket


@asyncio.coroutine
def broadcast(message):
    disconnected = list()

    for username, user in users.items():
        if user.websocket.open:
            yield from user.websocket.send(json.dumps(message))
        else:
            disconnected.append(username)

    for username in disconnected:
        try:
            del users[username]
            print('Connection removed: ' + username)
        except KeyError:
            pass


@asyncio.coroutine
def broadcast_except_self(message):
    disconnected = list()

    for username, user in users.items():
        if user.websocket.open:
            if username != message['username']:
                yield from user.websocket.send(json.dumps(message))
        else:
            disconnected.append(username)

    for username in disconnected:
        try:
            del users[username]
            print('Connection removed: ' + username)
        except KeyError:
            pass


@asyncio.coroutine
def login(username, websocket):
    if username in users:
        yield from websocket.send('{"action": "login", "status": "exists"}')
    else:
        user = User(username, websocket)
        users[username] = user
        yield from websocket.send('{"action": "login", "status": "success"}')
        yield from broadcast({'action': 'connected', 'username': username})


@asyncio.coroutine
def disconnected(websocket):
    for username, user in users.items():
        if user.websocket == websocket:
            print('Disconnected: ' + username)
            del users[username]
            break


@asyncio.coroutine
def handler(websocket, path):
    while True:
        message = yield from websocket.recv()

        # Connection lost
        if message is None:
            yield from disconnected(websocket)
            break

        message = json.loads(message)
        print(message)
        action = message['action']
        username = message['username']

        if action == 'move':
            yield from broadcast_except_self(message)
        elif action == 'chat':
            yield from broadcast(message)
        elif action == 'login':
            yield from login(username, websocket)


start_server = websockets.serve(handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
