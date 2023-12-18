# Distributed System Designed Chat Application

## System Design

The system design employed in the application is outlined below, comprising a total of 5 main components.

![System Design](https://github.com/Generalns/chat-application/blob/main/SystemDesign.jpg?raw=true)


### Clients
Users can interact with the application through the front end developed using React.js.
- A straightforward design involving two distinct components, AuthComponent and ChatComponent, has been implemented.
- Conditional rendering is utilized to determine which component will be displayed.
- For security purposes, no specific development, such as jwt, has been implemented; users only register, log in, and commence using the application.

### Backend
The backend incorporates Websocket Handler, Kafka Handler, and REST API, developed using Fastapi.
- The socket.io library is employed for efficient management of socket connections.
- Socket connections are tracked within the application using a dictionary in the form of {"user_id": "socket_id"}.
- The Kafka Handler acts as a producer within the application. Messages from users joining through socket connections are simultaneously sent to both the websocket and Kafka Handler.
- The Kafka Handler, in turn, pushes the received messages to a Kafka topic named "chat_messages."
- A separate service housing a Kafka consumer listens to the relevant topic and carries out the process of writing to the database.

### REST API
A backend-based REST API facilitates operations such as retrieving chat history between clients and the database, as well as handling registration and login processes.

## Reasons for Design Choices and Benefits

Several advantages arise from choosing to write data to the database via Kafka rather than directly through the backend during application development:

- Messages can be written to the database in bulk, reducing the number of connections between the database and the system, thereby enhancing application performance, especially in systems with a high user count.
- Through the use of Kafka, in the event of a database server failure, messages remain in Kafka, preventing data loss. This also serves as a backup, albeit for a short period.
- The backend server, responsible for critical tasks such as transmitting a large amount of real-time data via socket connections, is spared the additional burden of establishing a database connection and saving chat message data. This contributes to reducing server load and CPU consumption.

As a suggestion for further improvement, considering the implementation of a microservices architecture could be beneficial. Running the REST API as a separate component on another server could offer additional advantages.

## Getting Started

This section provides instructions on how to set up Docker on your machine for different operating systems.

### Windows

1. **Download Docker Desktop:**
   - Visit the [Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows) page.
   - Click on "Get Docker" to download the installer.
   - Double-click the downloaded file to run the installer.

2. **Install Docker Desktop:**
   - Follow the on-screen instructions to complete the installation.
   - Docker Desktop will start automatically upon successful installation.

3. **Verify Installation:**
   - Open a Command Prompt or PowerShell window.
   - Run the following command to verify Docker installation:
     ```sh
     docker --version
     ```

### Linux

1. **Update Package Repository:**
   - Open a terminal window.
   - Update the package repository information:
     ```sh
     sudo apt-get update
     ```

2. **Install Docker:**
   - Install Docker using the following command:
     ```sh
     sudo apt-get install docker-ce docker-ce-cli containerd.io
     ```

3. **Start Docker Service:**
   - Start the Docker service:
     ```sh
     sudo systemctl start docker
     ```

4. **Verify Installation:**
   - Run the following command to verify Docker installation:
     ```sh
     docker --version
     ```

### macOS

1. **Download Docker Desktop:**
   - Visit the [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) page.
   - Click on "Get Docker" to download the installer.
   - Double-click the downloaded file to run the installer.

2. **Install Docker Desktop:**
   - Drag the Docker icon to the Applications folder.
   - Open Docker from the Applications folder.

3. **Verify Installation:**
   - Open a terminal window.
   - Run the following command to verify Docker installation:
     ```sh
     docker --version
     ```

Now you have Docker installed on your machine. In order to run the app all you have to do is go into the projecr root directory and run the following command:
```sh
docker-compose -f docker-compose.yml up 
```

Alternatively you can run the each program on your machine without docker but in this case you will have to install the dependencies by hand and it is more time consuming. Also if you choose to go this path even though I advise you not, do not forget to install Kafka, Zookeeper and start them at relevant ports.

**Note:** In this project the database configurations are made for my personal account and they are not kept in an .env file which is not a good practice. The database used is a free mysql database which can only contain 5MBs of data and by the time that you are checking this project out it might be shut down. Please make your own database configurations accordingly in both /backend/database/database.py file and /kafka_consumer/kafka_consumer.py file.

