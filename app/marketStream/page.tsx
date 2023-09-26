"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

// import {getWsData} from './route/stream/index';
// pages/index.tsx
// import { useEffect } from 'react';
// import { useCustomWebSocket } from '@/hooks/useCustomWebSocket';

// const Home = () => {
//   const { lastMessage, sendMessage } = useCustomWebSocket();

//   useEffect(() => {
//     if (lastMessage) {
//       console.log('Received WebSocket message:', lastMessage);
//       // Add your logic to handle WebSocket messages here
//     }
//   }, [lastMessage]);

//   return (
//     <div>
//       <div>WebSocket Message</div>
//       {/* Your component content */}
//     </div>
//   );
// };

// export default Home;


// pages/index.tsx
// import React, { useState, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';

// const WebSocketDataDisplay = () => {
//   const [receivedMessages, setReceivedMessages] = useState([]);
//   const sendMessage = useWebSocket((message) => {
//     // Handle incoming WebSocket messages
//     setReceivedMessages((prevMessages) => [...prevMessages, message]);
//   });

//   // This effect sends a sample message to the WebSocket when the component mounts
//   useEffect(() => {
//     sendMessage('Hello, WebSocket!');
//   }, [sendMessage]);

//   return (
//     <div>
//       <h2>WebSocket Data Display</h2>
//       <ul>
//         {receivedMessages.map((message, index) => (
//           <li key={index}>{message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

//------------------------------------------------------------------------------

// const WebSocketDataDisplay = () => {

//     const [socketData, setSocketData] = useState([]);

//   useEffect(() => {
//     // Make a GET request to your WebSocket-based API
//     axios.get('/api/socket/')
//       .then((response) => {
//         // Assuming your API returns JSON data, you can access it using response.data
//         // console.log('res',response,'res')
//         setSocketData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching WebSocket data:', error);
//       });
//   }, []);
    

// // axios.get('/api/socket/').then((response) => {
// //     console.log(response);
// // })
// return (
//     <div>
//       {socketData.length > 0 ? (
//         <pre>{JSON.stringify(socketData, null, 2)}</pre>
//       ) : (
//         <p>Loading WebSocket data...</p>
//       )}
//     </div>
// )
// }

// export default WebSocketDataDisplay;

//---------------------------------------------------------------------------

const WebSocketDataDisplay = () => {
  const [socketData, setSocketData] = useState([]);

  useEffect(() => {
    // Create a WebSocket connection to the server
    const socket = new WebSocket(`wss://${window.location.host}/api/socket`);

    console.log(socket, 'dj');
    

    // WebSocket event handlers
    socket.onopen = () => {
      console.log('WebSocket connection opened.');
    };

    socket.onmessage = (event) => {
      // Handle incoming WebSocket messages and update the state
      const newMessage = JSON.parse(event.data);
      setSocketData((prevData) => [...prevData, newMessage]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      {socketData.length > 0 ? (
        <div>
          <h2>WebSocket Data:</h2>
          <ul>
            {socketData.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading WebSocket data...</p>
      )}
    </div>
  );
};

export default WebSocketDataDisplay;

