import React from 'react';
import '../styles/joinroom.css';

function JoinRoom() {
  return (
    <div className="join-room-container">
      <div className="form-container">
        <h2>Join Chat Room!</h2>
        <form action="/chat" method="POST">
          <label htmlFor="roomId">Room ID:</label>
          <input type="text" id="roomId" name="roomId" placeholder="Enter Room ID" required />
          
          <label htmlFor="username">Your Name:</label>
          <input type="text" id="username" name="username" placeholder="Enter Your Name" required />
          
          <button type="submit">Join Chat</button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;

