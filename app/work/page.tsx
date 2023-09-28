"use client";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  SpringValue,
  SpringRef,
  useSpring,
  animated,
  config,
} from "react-spring";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { Effects } from "@react-three/drei";
import useYScroll from "../../hooks/useYScroll";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { Html } from "@react-three/drei";
import { a } from "@react-spring/three";
import useInterval from "use-interval";
import useListMarket from "@/hooks/market/useListMarket";

import "./page.css";

import Swarm from "@/components/Swarm";
import { Box } from "@/components/Box";
const BLOCK_NUM = 50;
extend({ GlitchPass });

export default function Work() {
  const [blocks, setBlocks] = useState([]);

  const [glitchEnabled, setGlitchEnabled] = useState(false);
  const { markets, loading, error } = useListMarket();

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

  // background coloring
  const [bgStyle, bgStyleRef] = useSpring(() => ({
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(ellipse at 50% -100%, #222222 0%, #a4a2a2 99%)",
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

  const handleOnRangeChange = useCallback((e) => {
    const p = e.target.value as number;
    const _y: number = Math.floor((-3800 * (100 - p)) / 100);

    (disRef as SpringRef<{ y: number }>)({ y: _y });
  }, []);

  const Contents = useMemo(() => {
    // if (blocks.length <= 0) {
    //   return (
    //     <Html center>
    //       <div className="loading">LOADING...</div>
    //     </Html>
    //   );
    // }
    // else
    {
      return (
        <a.group position-x={posX} position-y={0}>
          {blocks.slice(0, BLOCK_NUM).map((block, i) => {
            return (
              <>
                {/* <Box
                  block={block}
                  key={i}
                  index={i}
                  position={[-5 * i, 0, 0]}
                  tick={tick}
                  onHoverOver={onHoverOverBox}
                  onHoverOut={onHoverOutBox}
                /> */}
                <div>okokwwww</div>
                <Box />
              </>
            );
          })}
        </a.group>
      );
    }
  }, [tick, blocks]);

  // market content objects list
  const MarketContents = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="market">
        {markets?.markets?.edges.map((item: any, i) => (
          <>
            <div
              className="item_market"
              onClick={() => {
                // Construct the URL using item.node.id
                const marketUrl = `https://explorer.vega.xyz/markets/${item?.node?.id}`;

                // Redirect to the constructed URL
                window.location.href = marketUrl;
              }}
            >
              {item?.node?.tradableInstrument?.instrument?.code}
            </div>
          </>
        ))}
      </div>
    );
  };

  return (
    <>
      <animated.div style={bgStyle}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Effects>
            {/* <glitchPass enabled={glitchEnabled} attachArray="passes" /> */}
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
          <Swarm count={4000} />
        </Canvas>
        <div className="title">
          <span>Vega blockchain visualization</span>
          <span className="version">(beta)</span>
          <div className="desc">
            You are viewing the latest {BLOCK_NUM} blocks.
            <br />
          </div>
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
        <MarketContents />
      </animated.div>
    </>
  );
}
