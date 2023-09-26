"use client";

import React, { useState, useEffect } from 'react';

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('/api/socket/');
      const messages = await response.json();

      setMessages(messages);
    };

    fetchMessages();
  }, []);

  return (
    <ul>
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
};

export default MessageList;