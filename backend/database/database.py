import mysql.connector


def create_connection():
    connection = mysql.connector.connect(
        host="sql7.freesqldatabase.com",
        user="sql7754121",
        password="DsWmVtM63h",
        database="sql7754121",
    )
    return connection


def create_table():
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL)
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT,
        receiver_id INT,
        content VARCHAR(255) NOT NULL,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
        )
        """
    )

    connection.commit()
    connection.close()
