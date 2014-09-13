import asyncio
import json
import websockets

users = list()


class User(object):
    def __init__(self, name, websocket):
        self.name = name
        self.websocket = websocket


@asyncio.coroutine
def broadcast(message):
    for user in users:
        if user.websocket.open:
            yield from user.websocket.send(json.dumps(message))
        else:
            try:
                users.remove(user)
            except ValueError:
                pass


@asyncio.coroutine
def login(username, websocket):
    exists = False

    for user in users:
        if username == user.name:
            exists = True
            break

    if exists:
        yield from websocket.send('{ "action": "login", "status": "exists" }')
    else:
        user = User(username, websocket)
        users.append(user)
        yield from websocket.send('{ "action": "login", "status": "success" }')


@asyncio.coroutine
def handler(websocket, path):
    #connections.append(websocket)

    while True:
        message = yield from websocket.recv()
        if message is None:
            print("Remove connection")
            break

        message = json.loads(message)
        print(message)
        action = message.get('action')
        username = message.get('username')

        if action == 'login':
            yield from login(username, websocket)
        elif action == 'chat':
            yield from broadcast(message)


start_server = websockets.serve(handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
