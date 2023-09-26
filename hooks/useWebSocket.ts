// // src/hooks/useWebSocket.ts
// import useWebSocket from "react-use-websocket";

// const apiUrl = 'wss://vega-mainnet-data.commodum.io/api/v2/stream/event/bus';

// export const useCustomWebSocket = () => {
//   const { lastMessage, sendMessage } = useWebSocket(apiUrl);

//   return { lastMessage, sendMessage };
// };


// src/hooks/useWebSocket.ts
// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

const apiUrl = 'wss://vega-mainnet-data.commodum.io/api/v2/stream/event/bus';

type WebSocketMessage = string;

export const useWebSocket = (onMessage: (message: WebSocketMessage) => void) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize the WebSocket connection
    socket.current = new WebSocket(apiUrl);

    // WebSocket event handlers
    socket.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.current.onmessage = (event) => {
      const message: WebSocketMessage = event.data as WebSocketMessage;
      console.log(message);
      
      onMessage(message);
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function to close the WebSocket when the component unmounts
    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, [onMessage]);

  const sendMessage = (message: WebSocketMessage) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
    }
  };


  return sendMessage;
};
