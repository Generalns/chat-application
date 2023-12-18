from kafka import KafkaConsumer
import json
import mysql.connector


KAFKA_BROKER_URL = "kafka:9092"
KAFKA_TOPIC = "chat_messages"


def create_connection():
    connection = mysql.connector.connect(
        host="sql11.freesqldatabase.com",
        user="sql11671047",
        password="l61QTbA5zX",
        database="sql11671047",
    )
    return connection


def save_message(sender_id: int, receiver_id: int, content: str):
    connection = create_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO messages (sender_id, receiver_id, content)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (sender_id, receiver_id, content))
    connection.commit()

    cursor.execute("SELECT * FROM messages WHERE id = LAST_INSERT_ID()")
    inserted_message = cursor.fetchone()

    connection.close()

    return inserted_message



consumer = KafkaConsumer(
    KAFKA_TOPIC,
    bootstrap_servers=KAFKA_BROKER_URL,
    group_id="chat-consumer-group",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
)

for message in consumer:
    print(message.value)
    if "receiver_id" in message.value:
        save_message(
            message.value["sender_id"],
            message.value["receiver_id"],
            message.value["message"],
        )
   
