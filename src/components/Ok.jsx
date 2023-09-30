import { useState, useCallback } from "react";
import { animated, useSpring, config } from "react-spring";
import clamp from "lodash/clamp";
import { useGesture } from "react-use-gesture";

const BLOCK_NUM = 20;

export default function Ok() {
  // background coloring
  const [bgStyle, bgStyleRef] = useSpring(() => ({
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(ellipse at 50% -100%, #222222 0%, #a4a2a2 99%)",
  }));

  return (
    <>
      <div className="title">
        <span>Vega blockchain visualization</span>
        <span className="version">(beta)</span>
        <div className="desc">
          You are viewing the latest {BLOCK_NUM} blocks.
          <br />
        </div>
      </div>
    </>
  );
}
