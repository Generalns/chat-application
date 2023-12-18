import React, { useState, useEffect, useMemo, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaCircle, FaUserAlt } from "react-icons/fa";

const ChatComponent = ({ currentUser }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesContainerRef = useRef(null);

  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    const newSocket = io(
      `http://localhost:8000?username=${currentUser.username}`,
      {
        transports: ["websocket", "polling"],
        extraHeaders: { username: currentUser.username },
      }
    );

    setSocket(newSocket);

    axios.get("http://localhost:8000/users").then((data) => {
      setUserList(data.data);
    });

    newSocket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();

    });

    newSocket.on("online_users", (users) => {
      axios.get("http://localhost:8000/users").then((data) => {
        setUserList(data.data);
      });
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.username]);

  useEffect(() => {
    if (receiver) {
      fetchMessages();
    }
  }, [receiver]);

  const fetchMessages = () => {
    axios
      .get(
        `http://localhost:8000/messages/${currentUser.id}?other_user=${receiver[0]}`
      )
      .then((data) => {
        setMessages(data.data);
      })
      .catch((err) => {
        console.log(err);
      }).finally(()=>{
          scrollToBottom();

      });
  };

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      const messageData = {
        message: message,
        username: currentUser.username,
        sender_id: currentUser.id,
      };

      if (receiver != null) {
        messageData.receiver_id = receiver[0];
        messageData.receiver_username = receiver[1];
      }

      socket.emit("message", messageData);
      setMessage("");
    }
  };

  const memoizedUserList = useMemo(() => {
    return userList
      .filter((user) => user[1] !== currentUser.username)
      .map((user, index) => (
        <li
          key={user[0]}
          onClick={() => {
            setReceiver(user);
          }}
          className={`flex items-center border-b border-gray-400 p-4 ${
            index !== userList.length - 1 ? "" : ""
          }`}>
          <FaCircle
            className={`dot ${
              onlineUsers[user[1]] ? "text-green-500" : "text-red-500"
            }`}
          />
          <span className="ml-2">{user[1]}</span>
        </li>
      ));
  }, [userList, onlineUsers, currentUser, setReceiver]);

  const memoizedMessages = useMemo(() => {
    return messages.map((msg, index) => {
      if (
        (receiver && receiver[1] == msg.username) ||
        msg.username == currentUser.username
      )
        return (
          <div
            key={index}
            className={`${
              msg.sender ? "self" : "other"
            }-message p-2 m-8 my-2 rounded-lg w-fit text-white ${
              currentUser.username === msg.username
                ? "self-end bg-green-700"
                : "self-start bg-gray-600"
            }`}>
            
            {msg.content}
          </div>
        );
    });
  }, [messages, currentUser]);

  

  return (
    <div className="flex h-screen">
      {/* User List Section */}
      <div className="w-1/4 bg-gray-200 p-4 border-r">
        <h2 className="mb-4 text-lg font-bold">Users</h2>
        <ul>{memoizedUserList}</ul>
        <div className="absolute bottom-10 flex items-center justify-between">
          <FaUserAlt className="text-2xl" />
          <p className="m-4">{currentUser.username}</p>
        </div>
      </div>

      {/* Chat Screen Section */}
      <div className="w-3/4 pb-4">
        <div className="flex flex-col h-full">
          <div className="w-full bg-gray-300 p-4">
            {receiver ? receiver[1] : "Welcome to the chat app"}
          </div>
          <div
            ref={messagesContainerRef}
            className="flex-1 flex flex-col overflow-y-auto items-stretch mt-10">
            {receiver ? (
              memoizedMessages
            ) : (
              <div className="w-full h-full flex items-center justify-center ">
                <p>Please choose a person to start a chat with</p>
              </div>
            )}
          </div>
          {receiver ? (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="p-2 ml-2 bg-blue-500 text-white rounded">
                Send
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
