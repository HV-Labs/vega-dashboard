// @ts-nocheck

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { a } from "@react-spring/three";
import { Html } from "@react-three/drei";
import {
  SpringValue,
  SpringRef,
  useSpring,
  animated,
  config,
} from "react-spring";
import { Effects } from "@react-three/drei";
import useInterval from "use-interval";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import Box from "./components/Box";
import Swarm from "./components/Swarm";
import useYScroll from "./hooks/useYScroll";
import "./App.css";
import useListMarket from "./hooks/useListMarket";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import _ from "lodash";

const BLOCK_NUM = 32;

extend({ GlitchPass });

const MESSAGE_PROCESS_INTERVAL = 1000;

export default function App() {
  // glitch
  const [glitchEnabled, setGlitchEnabled] = useState(false);

  const { markets, loading, error } = useListMarket();
  const [marketColors, setMarketColors] = useState<string[]>([]);
  const [marketNames, setMarketNames] = useState<string[]>([]);

  const [processedData, setProcessedData] = useState([]);
  const [wsLoading, setwsLoading] = useState<boolean>(true);

  // Generate dummy processedData
  const generateDummyProcessedData = () => {
    const dummyData = {};
    const totalBlocks = BLOCK_NUM;
    const markets = [
      "9f6160f248afc373b9458ad03b0e6faf5e5b4cde8e4b7e093b571bb4a2d5b08b2",
      "f3f6c9c98e7f4e1a4d4b7c3e8b9f6a5c4e3d2b1a7e9f8c6d5a4e3b2f1a9e8d7c",
      "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d",
      "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v",
      "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d"
    ];

    for (let i = 0; i < totalBlocks; i++) {
      const blockNumber = (999968 + i).toString();
      dummyData[blockNumber] = [];

      const numEvents = Math.floor(Math.random() * 5) + 1; // 1 to 5 events per block

      for (let j = 0; j < numEvents; j++) {
        const eventId = `${blockNumber}-${j}`;
        const marketId = markets[Math.floor(Math.random() * markets.length)];
        const type = Math.random() > 0.5 ? "PositionStateEvent" : "MarginLevels";

        const event = {
          id: eventId,
          type: type,
          obj: {
            [type.toLowerCase()]: { marketId: marketId }
          },
          blockId: `hash-block-${blockNumber}`,
          market: marketId
        };

        dummyData[blockNumber].push(event);
      }
    }

    return dummyData;
  };

  // Use dummy data if WebSocket doesn't provide data within timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (wsLoading && Object.keys(processedData).length === 0) {
        const dummyData = generateDummyProcessedData();
        setProcessedData(dummyData);
        setwsLoading(false);
      }
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [wsLoading, processedData]);

  useEffect(() => {
    const client = new W3CWebSocket(
      "wss://vega-mainnet-data.commodum.io/api/v2/stream/event/bus"
    );

    let messageQueue = [];

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
      const newDataObj = JSON.parse(e.data as string);

      const events = newDataObj?.result?.events;

      if (events) {
        const consolidatedData = events.map((event) => ({
          id: event.id,
          type: event.type,
          obj: event,
          blockId: event.block,
          market:
            event?.positionStateEvent?.marketId ||
            event?.marginLevels?.marketId,
        }));

        messageQueue = messageQueue.concat(consolidatedData);

        setwsLoading(false);
      }
    };

    // Process messages at a controlled rate
    const processMessages = () => {
      if (messageQueue.length > 0) {
        setProcessedData((prevData) => {
          const newData = { ...prevData };
          messageQueue.forEach((event) => {
            const [blockNumber] = event.id.split("-");
            if (!newData[blockNumber]) {
              newData[blockNumber] = [];
            }
            newData[blockNumber].push(event);

            const blockNumbers = Object.keys(newData);

            if (blockNumbers.length > BLOCK_NUM) {
              const oldestBlockNumber = blockNumbers[0];
              delete newData[oldestBlockNumber];
            }
          });

          return newData;
        });

        messageQueue = [];
      }
    };

    const processMessagesThrottled = _.throttle(
      processMessages,
      MESSAGE_PROCESS_INTERVAL
    );

    // Process messages periodically
    const intervalId = setInterval(
      processMessagesThrottled,
      MESSAGE_PROCESS_INTERVAL
    );

    // Clean up WebSocket connection on unmount
    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, []);

  // disable glitch effect component
  setTimeout(() => {
    setGlitchEnabled(false);
  }, 5000);

  // tick
  const [tick, setTick] = useState(0);
  useInterval(() => {
    setTick(tick + 1);
  }, 1000);

  // scroll
  const [dis, disRef, delta] = useYScroll([-3800, 0], { domTarget: window });

  let posX = (dis as SpringValue<number>).to(
    (dis: number) => (dis / 1000) * 25 * -1
  );

  const [bgStyle, bgStyleRef] = useSpring(() => ({
    width: "100vw",
    height: "100vh",
    background: "radial-gradient( at 50% -100%, #CDBBBB 0%, #000000 99%)",
  }));

  function CameraPosition() {
    const { camera } = useThree();
    useEffect(() => {
      const angle = ((delta as number) / 2000) * -1;
      camera.rotation.x = angle;
      camera.rotation.y = angle;
      camera.rotation.z = angle;
    }, [delta]);

    return null;
  }

  const onHoverOverBox = useCallback(() => {
    bgStyleRef({
      background:
        "radial-gradient(ellipse at 50% -100%, #222222 0%, #2c2c2c 99%)",
      config: config.slow,
    });
  }, []);

  const onHoverOutBox = useCallback(() => {
    bgStyleRef({
      background: "radial-gradient(at 50% -100%, #CDBBBB 0%, #000000 99%)",
      config: config.slow,
    });
  }, []);

  const handleOnRangeChange = useCallback((e) => {
    const p = e.target.value as number;
    const _y: number = Math.floor((-3800 * (100 - p)) / 100);

    (disRef as SpringRef<{ y: number }>)({ y: _y });
  }, []);

  const Contents = useMemo(() => {
    if (Object.keys(processedData).length < BLOCK_NUM) {
      return (
        <Html center>
          <div className="loading">
            {" "}
            LOADING... {Object.keys(processedData).length} of {BLOCK_NUM}
          </div>
        </Html>
      );
    } else {
      return (
        <a.group position-x={posX} position-y={0}>
          {Object.keys(processedData).map((blockNumber, index) => {
            return (
              <Box
                processedData={processedData}
                tick={tick}
                key={index}
                block={blockNumber}
                index={index}
                position={[-3 * index, 0, 0]}
                onHoverOver={onHoverOverBox}
                onHoverOut={onHoverOutBox}
                marketColors={marketColors}
                marketNames={marketNames}
              />
            );
          })}
        </a.group>
      );
    }
  }, [processedData, tick]);

  useEffect(() => {
    if (markets && markets.markets && markets.markets.edges) {
      const newMarketColors = {};
      const newMartketNames = {};

      markets.markets.edges.map((e, index) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        newMarketColors[e.node.id] = `#${randomColor}`;
      });

      markets.markets.edges.map((items, i) => {
        newMartketNames[items.node.id] =
          items?.node?.tradableInstrument?.instrument?.code;
      });

      setMarketColors(newMarketColors);

      setMarketNames(newMartketNames);
    }
  }, [markets]);

  const MarketContents = () => {
    if (loading) {
      return <div className="loader_market">Markets Loading...</div>;
    }

    return (
      <div className="market">
        {markets?.markets?.edges.map((item: any, i: number) => (
          <div className="inner_market">
            <div
              style={{
                backgroundColor: marketColors[item.node.id],
                width: "20px",
                height: "20px",
              }}
            ></div>

            <div
              className="item_market"
              onClick={() => {
                const marketUrl = `https://explorer.vega.xyz/markets/${item?.node?.id}`;

                window.location.href = marketUrl;
              }}
            >
              {item?.node?.tradableInstrument?.instrument?.code}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <animated.div style={bgStyle}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, toneMapping: "NoToneMapping" }}
        linear
      >
        <Effects>
          <glitchPass enabled={glitchEnabled} attachArray="passes" />
        </Effects>
        <CameraPosition />
        <ambientLight />
        <pointLight
          distance={240}
          intensity={1}
          position={[0, -30, 10]}
          color="#ccc"
        />
        {Contents}
        <Swarm count={500} />
      </Canvas>
      <div className="title">
        <span>Vega Block Visualization</span>
        <span className="version"></span>
        <div className="desc">
          You are viewing the latest {BLOCK_NUM} blocks.
          <br />
        </div>
        <MarketContents />
      </div>
      {navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i) && (
        <div className="range">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            defaultValue="100"
            onChange={handleOnRangeChange}
          />
        </div>
      )}
    </animated.div>
  );
}
