import React from 'react';
import '../styles/FAQ.css';
import logo from '../styles/logo.png';

const FAQ = () => {
  return (
    <div className="faq-container">
      <img src={logo} alt="Logo" className="logo" />
      <main>
        <section id="faq-section">
          <h1>Frequently Asked Questions</h1>

          <div className="faq-item">
            <h2>What is this chat room website for?</h2>
            <p>It’s a platform for people to chat, share ideas, and connect in real-time.</p>
          </div>

          <div className="faq-item">
            <h2>How do I join a chat room?</h2>
            <p>Simply sign up or log in, and then choose a chat room from the list.</p>
          </div>

          <div className="faq-item">
            <h2>Can I create my own chat room?</h2>
            <p>Yes, you can create a chat room by clicking the “Create Room” button and following the setup instructions.</p>
          </div>

          <div className="faq-item">
            <h2>Is my data secure?</h2>
            <p>Yes, we use industry-standard encryption to ensure your data is safe and secure.</p>
          </div>

          <div className="faq-item">
            <h2>Can I use the chat room without an internet connection?</h2>
            <p>No, an active internet connection is required to use the chat room.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-bottom">
          <p>&copy; Quick Chat 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
