import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const MyWebSocketComponent = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blockData, setBlockData] = useState({}); // Store data by block number

  useEffect(() => {
    const client = new W3CWebSocket(
      "wss://vega-mainnet-data.commodum.io/api/v2/stream/event/bus"
    );

    // Handle WebSocket errors
    client.onerror = (error: Error) => {
      console.error("WebSocket Error:", error);
    };

    // Handle WebSocket connection opened
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      const msg = {};
      client.send(JSON.stringify(msg));
    };

    // Handle WebSocket connection closed
    client.onclose = () => {
      console.log("WebSocket Client Closed");
    };

    // Handle received messages
    client.onmessage = (e) => {
      // console.log("Received message:", e.data);
      const newMessage = e.data as string;

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const newData = JSON.parse(e.data as string);
      console.log("newData", newData?.result?.events);

      // Extract block number from the data (assuming it's present)
      const blockNumber = newData?.result?.events[0]?.id;

      // console.log("blockNumber", blockNumber);

      if (blockNumber) {
        // Update the state with the new data
        setBlockData((prevBlockData) => ({
          ...prevBlockData,
          [blockNumber]: newData,
        }));
        setLoading(false);
      }
    };

    // Clean up WebSocket connection on unmount
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
          ok
          {/* {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))} */}
          {/* {Object.keys(blockData).map((blockNumber, index) => (
            <div key={index}>
              Block Number: {blockNumber}
              <br />
              {blockData[blockNumber].result.events[0].type}
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default MyWebSocketComponent;
