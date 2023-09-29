import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const MyWebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new W3CWebSocket('wss://vega-mainnet-data.commodum.io/api/v2/stream/event/bus');

    client.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    client.onopen = () => {
      console.log('WebSocket Client Connected');
      const msg = {};
      client.send(JSON.stringify(msg));
    };

    client.onclose = () => {
      console.log('WebSocket Client Closed');
    };

    client.onmessage = (e) => {
      console.log('Received message:', e.data);
      setMessages((prevMessages) => [...prevMessages, e.data]);
      
      setLoading(false);
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWebSocketComponent;
