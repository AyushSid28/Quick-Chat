import React from 'react';
import '../styles/CreateRoom.css'; // Adjust the path if needed
import logo from '../styles/logo.png'

const CreateRoom = () => {
  return (
    <div className="create-room-body">
      <img src={logo} alt="Logo" className="logo" />
      <div className="form-container">
        <h2>Create Chat Room</h2>
        <form action="/search-user" method="POST">
          <label htmlFor="email">Enter Email to Send Invite:</label>
          <input type="email" name="email" id="email" required />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
