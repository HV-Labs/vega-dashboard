"use client"

import { useEffect, useState } from "react";
import { WebSocket } from "ws";

export function useVegaStream(): [any, boolean] {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = new WebSocket("https://vega-mainnet-data.commodum.io/api/v2/stream/event/bus");

    socket.on("message", (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    });

    socket.on("open", () => {
      setIsLoading(false);
    });

    socket.on("close", () => {
      setIsLoading(true);
    });

    return () => {
      socket.close();
    };
  }, []);

  return [data, isLoading];
}
