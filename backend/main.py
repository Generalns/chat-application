import socketio
import bcrypt
from fastapi import FastAPI, WebSocket, HTTPException, Path, Query, Request
from fastapi.staticfiles import StaticFiles
from sockethandler.socket_io import sio, ChatNamespace
from fastapi.middleware.cors import CORSMiddleware
from database.database import create_table
from models.User import User
from controllers.User import get_user_by_username, get_users, create_user
from controllers.Message import get_messages

salt = bcrypt.gensalt()

create_table()

app = FastAPI()


sio.register_namespace(ChatNamespace("/"))
sio_asgi_app = socketio.ASGIApp(socketio_server=sio, other_asgi_app=app)

app.add_route("/socket.io/", route=sio_asgi_app, methods=["GET", "POST"])
app.add_websocket_route("/socket.io/", sio_asgi_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register")
async def register(request: User):
    username = request.username
    password = request.password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    user = create_user(username, hashed_password)
    if user:
        return {"username": user}
    else:
        raise HTTPException(status_code=500, detail="Failed to create user")


@app.post("/login")
async def login(request: User):
    username = request.username
    password = request.password
    user = get_user_by_username(username)
    if user and bcrypt.checkpw(
        password.encode("utf-8"), user["password"].encode("utf-8")
    ):
        return user
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/users")
async def getUsers():
    return get_users()


@app.get("/messages/{user_id}/")
async def getMessages(
    user_id: int,
    request: Request,
):
    return get_messages(user_id, (int)(request.query_params["other_user"]))


@app.get("/health")
async def getHealth():
    return "I am healthy"


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    print("sasa")
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(data)
        await sio.emit("message", {"sender": client_id, "text": data})
