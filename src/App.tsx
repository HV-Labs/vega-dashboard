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
