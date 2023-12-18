import socketio
from kafkahandler.kafka_handler import KafkaProducer  # Import the KafkaHandler
from contextlib import asynccontextmanager
from fastapi import FastAPI

kafka_producer = KafkaProducer()


sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
connected_users = {}


class ChatNamespace(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ):
        username = environ.get("QUERY_STRING")
        if username.startswith("username="):
            username = username[len("username=") :].split("&")[0]
            print("connected: ", username)
            connected_users[username] = sid
            await sio.emit("online_users", connected_users)

    async def on_message(self, sid, data):
        print("message ", data)
        if data["receiver_username"] in connected_users:
                print("sa: ", data)
                await sio.emit(
                    "message",
                    {
                        "sender_id": sid,
                        "content": data["message"],
                        "receiver_id": data["receiver_id"],
                        "receiver_username": data["receiver_username"],
                        "username": data["username"],
                    },
                    room=connected_users[data["receiver_username"]],
                )
                await sio.emit(
                    "message",
                    {
                        "sender_id": sid,
                        "content": data["message"],
                        "receiver_id": data["receiver_id"],
                        "receiver_username": data["receiver_username"],
                        "username": data["username"],
                    },
                    room=connected_users[data["username"]],
                )
                kafka_producer.send_message(data)
        else:
                await sio.emit(
                    "message",
                    {
                        "sender_id": sid,
                        "content": data["message"],
                        "receiver_id": data["receiver_id"],
                        "receiver_username": data["receiver_username"],
                        "username": data["username"],
                    },
                    room=connected_users[data["username"]],
                )
                kafka_producer.send_message(data)
        

    async def on_disconnect(self, sid):
        print("disconnect ", sid)
        if sid in connected_users.values():
            disconnected_user = next(
                (user for user, user_sid in connected_users.items() if user_sid == sid),
                None,
            )
            if disconnected_user:
                del connected_users[disconnected_user]
                await sio.emit("online_users", connected_users)


sio.register_namespace(ChatNamespace("/"))
