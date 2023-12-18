import mysql.connector
from database.database import create_connection


def create_user(username: str, hashed_password: bytes):
    connection = create_connection()
    cursor = connection.cursor()
    hashed_password_str = hashed_password.decode("utf-8")

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (%s, %s)",
        (username, hashed_password_str),
    )
    connection.commit()

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    connection.close()

    if user:
        return {"id": user[0], "username": user[1], "password": user[2]}
    else:
        return None


def get_user_by_username(username: str):
    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    connection.close()

    if user:
        return {"id": user[0], "username": user[1], "password": user[2]}
    else:
        return None


def get_users():
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    connection.close()
    return users
