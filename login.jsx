import React, { useState } from 'react';
import '../styles/login.css';
import logo from '../styles/logo.png';
import './FAQ';

// Add your image imports here
import facebookLogo from '../styles/facebook-logo.webp';
import twitterLogo from '../styles/twitter-logo.png';
import instagramLogo from '../styles/instagram-logo.jpg';
import linkedinLogo from '../styles/linkedin-logo.webp';

const Login = () => {
  const [formType, setFormType] = useState('');

  const showForm = (type) => {
    setFormType(type);
  };

  return (
    <div className="login-page">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="subheading">Connecting people, one chat at a time</h2>
      <h2 className="join-today">Join today.</h2>
      
      <div className="buttons">
        <button onClick={() => showForm('login')}>Login</button>
        <button onClick={() => showForm('register')}>Register</button>
      </div>

      {formType === 'login' && (
        <div className="form-container">
          <h2>Login</h2>
          <form action="/login" method="POST">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {formType === 'register' && (
        <div className="form-container">
          <h2>Register</h2>
          <form action="/register" method="POST">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
        </div>
      )}

      <footer className="footer">
        <div className="footer-section">
          <h3>Quick Chat</h3>
          <p>Quick Chat is a chat platform with temporary rooms for real-time group conversations. Each room closes automatically once all users leave, ensuring privacy and a fresh start every time.</p>
          <a href="#">Read more...</a>
        </div>
        <div className="footer-section">
          <h3>FAQ</h3>
          <ul>
            <li><a href="#">Common Queries</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="#">Email Support</a></li>
            <li><a href="#">Call Center</a></li>
            <li><a href="#">Office Locations</a></li>
            <li><a href="#">Customer Service</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>More Information</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow our social media</h3>
          <div className="social-buttons">
            <a href="https://facebook.com" target="_blank" className="social-button facebook" title="Facebook">
              <img src={facebookLogo} alt="Facebook" className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" className="social-button twitter" title="Twitter">
              <img src={twitterLogo} alt="Twitter" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" className="social-button instagram" title="Instagram">
              <img src={instagramLogo} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" className="social-button linkedin" title="LinkedIn">
              <img src={linkedinLogo} alt="LinkedIn" className="social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; Quick Chat 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
