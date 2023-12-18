import mysql.connector
from database.database import create_connection


def get_messages(sender_id: int, receiver_id: int):
    connection = create_connection()
    cursor = connection.cursor()

    query = """
        SELECT m.id, m.sender_id, m.receiver_id, m.content, u.username AS sender_username, u2.username AS receiver_username
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        JOIN users u2 ON m.receiver_id = u2.id
        WHERE 
          (m.sender_id = %s AND m.receiver_id = %s)
          OR
          (m.sender_id = %s AND m.receiver_id = %s)
    """
    cursor.execute(query, (sender_id, receiver_id, receiver_id, sender_id))
    rows = cursor.fetchall()

    messages = []
    for row in rows:
        message = {
            "message_id": row[0],
            "sender_id": row[1],
            "receiver_id": row[2],
            "content": row[3],
            "username": row[4],
            "receiver_username": row[5],
        }
        messages.append(message)

    connection.close()

    return messages
