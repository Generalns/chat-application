from confluent_kafka import Producer
import json

KAFKA_BROKER_URL = "kafka:9092"
KAFKA_TOPIC = "chat_messages"


class KafkaProducer:
    def __init__(self):
        self.producer = Producer({"bootstrap.servers": KAFKA_BROKER_URL})

    def send_message(self, message):
        try:
            self.producer.produce(KAFKA_TOPIC, key="message", value=json.dumps(message))
            self.producer.flush()
            return True
        except Exception as e:
            print(f"Failed to send message to Kafka: {e}")
            return False
