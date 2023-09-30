// import { useMemo, useEffect, useState, useCallback, useRef } from "react";
// import {
//   SpringValue,
//   SpringRef,
//   useSpring,
//   animated,
//   config,
// } from "react-spring";
// import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
// import { Effects, useProgress } from "@react-three/drei";
// // import useYScroll from "../hooks/useYScroll";
// import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
// import { Html } from "@react-three/drei";
// // import { a } from "@react-spring/three";
// // import useInterval from "use-interval";
// import useListMarket from "../hooks/useListMarket";
// // import Block from "@/assets/Block";
// // import Art from "@/assets/Art";
// import "../styles/page.css";

// // import Sphere from "@/components/Sphere";

// import Swarm from "./Swarm";

// import { useGesture } from "react-use-gesture";
// import clamp from "lodash/clamp";
// // import { Box } from "@/components/Box";
// // import { Ball } from "@/components/Ball";

// const BLOCK_NUM = 40;
// extend({ GlitchPass });

// export default function Work() {
//   function useYScroll(bounds, props) {
//     const [delta, setDelta] = useState(0);
//     const [{ y }, api] = useSpring(() => ({
//       to: { y: 0 },
//       config: config.stiff,
//     }));
//     const fn = useCallback(
//       ({ xy: [, cy], previous: [, py], memo = y.get(), delta: [, d] }) => {
//         const newY = clamp(memo + cy - py, ...bounds);
//         api({ y: newY });
//         setDelta(d);
//         return newY;
//       },
//       [bounds, y, api]
//     );
//     const bind = useGesture({ onWheel: fn }, { ...props, useTouch: true });
//     return [y, api, delta, bind];
//   }

//   const [blocks, setBlocks] = useState([]);

//   const [glitchEnabled, setGlitchEnabled] = useState(false);
//   const { markets, loading, error } = useListMarket();

//   // tick
//   //   const [tick, setTick] = useState(0);
//   //   useInterval(() => {
//   //     setTick(tick + 1);
//   //   }, 1000);

//   // scroll
//   const [dis, disRef, delta] = useYScroll([-3800, 0], { domTarget: window });

//   let posX = dis.to((dis) => (dis / 1000) * 25 * -1);

//   // background coloring
//   const [bgStyle, bgStyleRef] = useSpring(() => ({
//     width: "100vw",
//     height: "100vh",
//     background:
//       "radial-gradient(ellipse at 50% -100%, #222222 0%, #a4a2a2 99%)",
//   }));

//   function CameraPosition() {
//     const { camera } = useThree();
//     useEffect(() => {
//       const angle = (delta / 2000) * -1;
//       camera.rotation.x = angle;
//       camera.rotation.y = angle;
//       camera.rotation.z = angle;
//     }, [delta]);

//     return null;
//   }

//   const onHoverOverBox = useCallback(() => {
//     bgStyleRef({
//       background:
//         "radial-gradient(ellipse at 50% -100%, #222222 0%, #2c2c2c 99%)",
//       config: config.slow,
//     });
//   }, []);

//   const onHoverOutBox = useCallback(() => {
//     bgStyleRef({
//       background:
//         "radial-gradient(ellipse at 50% -100%, #222222 0%, #a4a2a2 99%)",
//       config: config.slow,
//     });
//   }, []);

//   const handleOnRangeChange = (e) => {
//     const p = e.target.value;
//     const _y = Math.floor((-3800 * (100 - p)) / 100);

//     disRef({ y: _y });
//   };

//   //   const Contents = useMemo(() => {
//   //     // if (blocks.length <= 0) {
//   //     //   return (
//   //     //     <Html center>
//   //     //       <div className="loading">LOADING...</div>
//   //     //     </Html>
//   //     //   );
//   //     // }
//   //     // else
//   //     {
//   //       return (
//   //         <a.group position-x={posX} position-y={0}>
//   //           {blocks.slice(0, BLOCK_NUM).map((block, i) => {
//   //             return (
//   //               <>
//   //                 {/* <Box
//   //                   block={block}
//   //                   key={i}
//   //                   index={i}
//   //                   position={[-5 * i, 0, 0]}
//   //                   tick={tick}
//   //                   onHoverOver={onHoverOverBox}
//   //                   onHoverOut={onHoverOutBox}
//   //                 /> */}
//   //                 {/* <div>okokwwww</div> */}
//   //                 {/* <Box /> */}
//   //               </>
//   //             );
//   //           })}
//   //         </a.group>
//   //       );
//   //     }
//   //   }, [tick, blocks]);

//   function Loader() {
//     const { progress } = useProgress();
//     return <Html center>{progress} % Markets loaded</Html>;
//   }

//   // market content objects list
//   const MarketContents = () => {
//     // if (loading) {
//     //   return <div>Loading...</div>;
//     // }

//     if (loading) {
//       return <Loader />;
//     }

//     const marketColors = markets?.markets?.edges.map(() => {
//       // Generate a random color for each market
//       const randomColor = Math.floor(Math.random() * 16777215).toString(16);
//       return `#${randomColor}`;
//     });

//     return (
//       <Html fullscreen>
//         <div className="market">
//           {markets?.markets?.edges.map((item, i) => (
//             <>
//               {/* <Sphere
//                 position={[2, 0, 0]}
//                 onHoverOver={() => console.log("hahaah")}
//                 onHoverOut={() => console.log("okok")}
//                 color={marketColors[i]}
//               /> */}

//               {/* <Html fullscreen> */}
//               <div
//                 className="item_market"
//                 onClick={() => {
//                   // Construct the URL using item.node.id
//                   const marketUrl = `https://explorer.vega.xyz/markets/${item?.node?.id}`;

//                   // Redirect to the constructed URL
//                   window.location.href = marketUrl;
//                 }}
//               >
//                 {item?.node?.tradableInstrument?.instrument?.code}
//               </div>

//               {/* </Html> */}
//             </>
//           ))}
//         </div>
//       </Html>
//     );
//   };

//   return (
//     <>
//       <animated.div style={bgStyle}>
//         <Canvas className="canvas" camera={{ position: [0, 0, 5], fov: 60 }}>
//           <Effects>
//             <glitchPass enabled={glitchEnabled} attachArray="passes" />
//           </Effects>

//           <CameraPosition />
//           <ambientLight />
//           <pointLight
//             distance={240}
//             intensity={1}
//             position={[0, -30, 10]}
//             color="#ccc"
//           />
//           {/* {Contents} */}
//           <Swarm count={3000} />
//           <MarketContents />
//         </Canvas>
//         <div className="title">
//           <span>Vega blockchain visualization</span>
//           <span className="version">(beta)</span>
//           <div className="desc">
//             You are viewing the latest {BLOCK_NUM} blocks.
//             <br />
//           </div>
//         </div>
//         <div className="range">
//           <input
//             type="range"
//             min="0"
//             max="100"
//             step="1"
//             defaultValue="100"
//             onChange={handleOnRangeChange}
//           />
//         </div>
//       </animated.div>
//     </>
//   );
// }
