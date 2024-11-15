import React, { useState, useEffect } from 'react';
import '../styles/ChatRoom.css';
import io from 'socket.io-client';

const ChatRoom = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const socket = io();
    socket.emit('joinRoom', { roomId, username });

    // Set the current date
    setDate(new Date().toLocaleDateString());

    // Listen for incoming messages
    socket.on('message', (data) => {
      const timestamp = new Date(data.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
          timestamp,
          isMine: data.username === username,
        },
      ]);
    });

    // Return the cleanup function
    return () => {
      socket.emit('leaveRoom', { roomId, username });
      socket.disconnect();
    };
  }, [roomId, username]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const socket = io();
    socket.emit('chatMessage', { roomId, username, message });
    setMessage('');
  };

  const handleLeave = () => {
    const socket = io();
    socket.emit('leaveRoom', { roomId, username });
    window.location.href = '/';
  };

  return (
    <div className="chatroom">
      <button id="leaveButton" onClick={handleLeave}>
        Leave Room
      </button>
      <h1>Chat Room</h1>
      <h2>
        Date: <span id="chatDate">{date}</span>
      </h2>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index} className={msg.isMine ? 'my-message' : 'other-message'}>
            {msg.isMine
              ? `${msg.timestamp} - ${msg.message}`
              : `${msg.username}: ${msg.message} [${msg.timestamp}]`}
          </li>
        ))}
      </ul>
      <form id="chatForm" onSubmit={handleSubmit}>
        <input
          id="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
