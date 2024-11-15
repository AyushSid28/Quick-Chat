import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';       // Make sure this component is properly named "Login"
import JoinRoom from './components/joinroom';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';    // Ensure the filename is consistent with casing
import FAQ from './components/FAQ';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the Login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the JoinRoom page */}
        <Route path="/joinroom" element={<JoinRoom />} />

        {/* Route for the CreateRoom page */}
        <Route path="/createroom" element={<CreateRoom />} />

        {/* Route for the ChatRoom page */}
        <Route path="/chatroom" element={<ChatRoom />} />

        {/* Route for the FAQ page */}
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
};

export default App;

