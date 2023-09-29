// import React, {
//   useMemo,
//   useEffect,
//   useState,
//   useCallback,
//   useRef,
// } from "react";
// import { ReactThreeFiber, useThree, useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";
// import { a, useSpring } from "@react-spring/three";
// import { config } from "@react-spring/core";
// import { hash2Colors } from "../lib/hash2Colors";

// type SphereProps = ReactThreeFiber.Object3DNode<
//   THREE.Mesh,
//   typeof THREE.Mesh
// > & {
//   position: [number, number, number];
//   onHoverOver: () => void;
//   onHoverOut: () => void;
//   tick?: number;
// };

// export default function Sphere(props: SphereProps) {
//   const { camera } = useThree();

//   const [hovered, setHovered] = useState(false);
//   const [pointRendering, setPointRendering] = useState(false);
//   const [txLabel, setTxLabel] = useState<TxLabelProps>({
//     hash: "",
//     position: new THREE.Vector3(),
//   });

//   const [{ rotation }, rotationRef] = useSpring(() => ({
//     rotation: 0,
//   }));

//   useEffect(() => {
//     if (hovered) return;
//     const r = rotation.get() + Math.PI;
//     rotationRef({
//       rotation: Math.trunc(r),
//       config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
//     });
//   }, [hovered, rotationRef, rotation, props.tick]);

//   const [{ scale }, scaleRef] = useSpring(() => ({
//     scale: 1.5,
//   }));

//   useEffect(() => {
//     return () => {
//       scaleRef({
//         from: { scale: 0.1 },
//         to: { scale: 1.5 },
//         config: config.wobbly,
//       });
//     };
//   }, [props.position]);

//   const handleMouseMove = useCallback((e: MouseEvent) => {
//     // Handle mouse movement here if needed.
//   }, []);

//   const handleOnPointerOver = useCallback(
//     (e: PointerEvent) => {
//       e.stopPropagation();

//       setHovered(true);
//       setPointRendering(true);
//       scaleRef({
//         scale: 2,
//         config: config.wobbly,
//       });

//       props.onHoverOver();

//       window.addEventListener("mousemove", handleMouseMove);
//     },
//     [scaleRef]
//   );

//   const handleOnPointerOut = useCallback(
//     (e: PointerEvent) => {
//       e.stopPropagation();

//       setHovered(false);
//       setPointRendering(false);
//       scaleRef({
//         scale: 1.5,
//         config: config.wobbly,
//       });

//       props.onHoverOut();

//       window.removeEventListener("mousemove", handleMouseMove);
//     },
//     [scaleRef]
//   );

//   // Customize the sphere's appearance and behavior here.
//   const sphereGeometry = useMemo(() => {
//     const sphereGeom = new THREE.SphereBufferGeometry(1, 32, 32);
//     return sphereGeom;
//   }, []);

//   // Customize the sphere's material here.
//   const sphereMaterial = useMemo(() => {
//     const material = new THREE.MeshStandardMaterial({
//       color: "#ccc",
//       roughness: 0.4,
//     });
//     return material;
//   }, []);

//   // Customize the sphere's position here.
//   const spherePosition: [number, number, number] = props.position;

//   // The rest of the component's logic can remain similar to your Box component.

//   return (
//     <a.mesh
//       position={spherePosition}
//       visible={!hovered}
//       scale={scale}
//       rotation-x={rotation}
//       onPointerOver={handleOnPointerOver}
//       onPointerOut={handleOnPointerOut}
//     >
//       <bufferGeometry attach="geometry" args={[sphereGeometry]} />
//       <meshStandardMaterial attach="material" {...sphereMaterial} />
//     </a.mesh>
//   );
// }

// import React, { useMemo, useCallback } from "react";
// import { a, useSpring } from "@react-spring/three";
// import * as THREE from "three";

// type SphereProps = {
//   position: [number, number, number];
//   onHoverOver: () => void;
//   onHoverOut: () => void;
//   color: string; // Color prop
// };

// export default function Sphere(props: SphereProps) {
//   const [{ scale }, scaleRef] = useSpring(() => ({
//     scale: 1,
//   }));

//   const handleOnPointerOver = useCallback(() => {
//     scaleRef({
//       scale: 1.2,
//       config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
//     });

//     props.onHoverOver();
//   }, [scaleRef, props.onHoverOver]);

//   const handleOnPointerOut = useCallback(() => {
//     scaleRef({
//       scale: 1,
//       config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
//     });

//     props.onHoverOut();
//   }, [scaleRef, props.onHoverOut]);

//   const sphereGeometry = useMemo(() => {
//     const sphereGeom = new THREE.SphereBufferGeometry(1, 32, 32);
//     return sphereGeom;
//   }, []);

//   return (
//     <a.mesh
//       position={props.position}
//       scale={scale}
//       onPointerOver={handleOnPointerOver}
//       onPointerOut={handleOnPointerOut}
//     >
//       <bufferGeometry attach="geometry" args={[sphereGeometry]} />
//       <meshStandardMaterial attach="material" color={props.color} />
//     </a.mesh>
//   );
// }
