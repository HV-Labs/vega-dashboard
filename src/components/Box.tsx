// @ts-nocheck

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ReactThreeFiber, useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { BlockTransactionObject } from "web3-eth";
import * as THREE from "three";
import { Group, Mesh, Vector3, BufferGeometry } from "three";
import { a, useSpring } from "@react-spring/three";
import { config } from "@react-spring/core";
import { hash2Colors } from "../utils/hash2Colors";

type BoxProps = ReactThreeFiber.Object3DNode<Mesh, typeof Mesh> & {
  block: any;
  index: number;
  tick?: number;
  onHoverOver: () => void;
  onHoverOut: () => void;
  processedData: any;
  marketColors?: any;
  marketNames?: any;
};
type TxProps = {
  hash: string;
  marketColors?: any;
  marketNames?: any;
};
type TxLabelProps = {
  hash: string;
  position: THREE.Vector3;
};

let mousePosition = { x: 0, y: 0 };
let intersectedTx: any;

export default function Box(props: BoxProps) {
  const { camera } = useThree();

  const [hoverd, setHoverd] = useState(false);
  const [intersected, setIntersected] = useState(false);
  const [txLabel, setTxLabel] = useState<TxLabelProps>({
    hash: "",
    position: new THREE.Vector3(),
  });

  const [{ rotation }, rotationRef] = useSpring(() => ({
    rotation: 0,
  }));

  useEffect(() => {
    if (hoverd) return;
    const r = rotation.get() + Math.PI;
    rotationRef({
      rotation: Math.trunc(r),
      config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
    });
  }, [hoverd, rotationRef, rotation, props.tick]);

  const [{ scale }, scaleRef] = useSpring(() => ({
    scale: 1.5,
  }));

  useEffect(() => {
    //scaleRef({scale: 1.5})
    return () => {
      if (props.index === 0) {
        scaleRef({
          from: { scale: 0.1 },
          to: { scale: 1.5 },
          config: config.wobbly,
        });
      }
    };
  }, [props.block]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePosition = { x: x, y: y };
  }, []);

  const handleOnPointerOver = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation();

      setHoverd(true);
      setPointRendering(true);
      scaleRef({
        scale: 2,
        config: config.wobbly,
      });

      props.onHoverOver();

      window.addEventListener("mousemove", handleMouseMove);
    },
    [scaleRef]
  );

  const handleOnPointerOut = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation();

      setHoverd(false);
      setPointRendering(false);
      scaleRef({
        scale: 1.5,
        config: config.wobbly,
      });

      props.onHoverOut();

      window.removeEventListener("mousemove", handleMouseMove);
    },
    [scaleRef]
  );

  const geom = useMemo(() => {
    const geom = new THREE.BoxBufferGeometry(1, 1, 1);
    return geom;
  }, []);

  const [pointRendering, setPointRendering] = useState(false);
  const refTxPoints = useRef({} as Group);

  const raycaster = useMemo(() => {
    return new THREE.Raycaster();
  }, []);

  const txGeom = useMemo(() => {
    return new THREE.BoxBufferGeometry(0.02, 0.02, 0.02);
  }, []);

  const Tx = React.memo((props: TxProps) => {
    const SIZE = 15;
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const z = Math.random() - 0.5;

    // console.log("okok", props.marketColors[props.hash]);
    // console.log("mark", props.marketNames[props.hash]);
    const m = new THREE.MeshLambertMaterial({
      color: props.marketColors[props.hash] || 0xffffff,
    });

    const handleTxClick = useCallback(() => {
      window.location.href = `https://explorer.vega.xyz/markets/${props.hash}`;
    }, []);

    return (
      <mesh
        name={props.hash}
        position={[x, y, z]}
        args={[txGeom, m]}
        scale={[SIZE, SIZE, SIZE]}
        onClick={handleTxClick}
      />
    );
  });

  const TxPoints = useMemo(() => {
    if (!pointRendering) return;

    const uniqueIds = [
      ...new Set(
        props.processedData[props.block]
          .map((item) => item.market)
          .filter((id) => id !== undefined)
      ),
    ];

    return (
      <group ref={refTxPoints} position={props.position} visible={hoverd}>
        {/* {console.log("hehehehe", props.processedData[props.block])} */}
        {hoverd &&
          // props.processedData[props.block].map((tx, i) => {

          //   return (
          //     <Tx key={i} hash={tx.id} />
          //     // <Html>ok</Html>
          //   );
          // })

          uniqueIds.map((marketItem, i) => {
            return (
              <Tx
                key={i}
                hash={marketItem}
                marketColors={props.marketColors}
                marketNames={props.marketNames}
              />
            );
          })}
      </group>
    );
  }, [hoverd, pointRendering]);

  useFrame(() => {
    // raycast
    if (refTxPoints.current && Object.keys(refTxPoints.current).length) {
      if (hoverd) {
        raycaster.setFromCamera(mousePosition, camera);
        const intersects = raycaster.intersectObjects(
          refTxPoints.current.children,
          true
        );
        if (intersects.length > 0) {
          console.log("intersectedTx", intersectedTx);
          console.log("intersects[0].object", intersects[0].object);

          if (intersectedTx != intersects[0].object) {
            if (intersectedTx) {
              intersectedTx.material.color = new THREE.Color("#ffffff");
            }
            intersectedTx = intersects[0].object;
            intersectedTx.material.color = new THREE.Color("#ff3b00");

            if (props.position) {
              const pos = props.position as number[];
              const targetPos = new THREE.Vector3(
                pos[0] + intersectedTx.position.x,
                intersectedTx.position.y - 0.3,
                0
              );
              setIntersected(true);
              setTxLabel({
                hash: intersectedTx.name,
                position: targetPos,
              });
            }
          }
        } else {
          if (intersectedTx) {
            intersectedTx.material.color = new THREE.Color("#ffffff");
          }
          intersectedTx = null;
          setIntersected(false);
          setTxLabel({
            hash: "",
            position: new THREE.Vector3(-9999, -9999, -9999),
          });
        }
      }
    }
  });

  const LineSecmentContents = useMemo(() => {
    return (
      <a.lineSegments
        position={props.position}
        visible={hoverd}
        scale={scale}
        rotation-x={rotation}
      >
        <edgesGeometry attach="geometry" args={[geom]} />
        <lineBasicMaterial attach="material" color="#fff" />
      </a.lineSegments>
    );
  }, [hoverd, scale]);

  const Contents = useMemo(() => {
    return (
      <a.mesh
        {...props}
        visible={!hoverd}
        scale={scale}
        rotation-x={rotation}
        onPointerOver={handleOnPointerOver}
        onPointerOut={handleOnPointerOut}
      >
        <boxBufferGeometry attach="geometry" />
        <meshStandardMaterial attach="material" color="#ccc" roughness={0.4} />
      </a.mesh>
    );
  }, [hoverd, scale]);

  const refLine = useRef({} as BufferGeometry);
  useEffect(() => {
    const points = [];
    if (props.position) {
      const pos = props.position as number[];
      const x = pos[0];
      points.push(new Vector3(x - 1.0, 0, 0));
      points.push(new Vector3(x - 2.0, 0, 0));
      refLine.current.setFromPoints(points);
    }
  }, []);

  const Line = useMemo(() => {
    return (
      <lineSegments>
        <bufferGeometry ref={refLine} attach="geometry" />
        <lineBasicMaterial
          attach="material"
          color={"#ffffff"}
          linewidth={10}
          linecap={"round"}
          linejoin={"round"}
        />
      </lineSegments>
    );
  }, [scale]);

  const Label = useMemo(() => {
    const position = props.position as number[];

    const posX = position[0] != 0 ? position[0] : 0;
    const x = posX - 0.8;
    const y = position[1] + 1.6;

    if (!props.block) {
      return null;
    }

    return (
      <mesh position={[x, y, 0]}>
        <Html style={{ display: hoverd ? "none" : "block" }} distanceFactor={5}>
          <div className="block-content">
            <div className="number">{`#${props.block}`}</div>
            <div className="hexColor">
              <span className="label">blockHash</span>
              {props.processedData[props.block][0].blockId}
            </div>
          </div>
        </Html>
      </mesh>
    );
  }, [hoverd, props.block]);

  const TxLabel = useMemo(() => {
    return (
      <mesh position={txLabel.position}>
        <Html
          style={{ display: !intersected ? "none" : "block" }}
          distanceFactor={5}
        >
          <div className="tx-content">
            <div className="hexColor">
              <span className="label">Market</span>
              {props.marketNames[txLabel.hash] || "Oops"}
            </div>
          </div>
        </Html>
      </mesh>
    );
  }, [intersected, txLabel]);

  return (
    <group>
      {LineSecmentContents}
      {Contents}
      {TxPoints}
      {Line}
      {Label}
      {TxLabel}
    </group>
  );
}
