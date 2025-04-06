// src/components/AvatarModel.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";

export default function AvatarModel() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <Stage environment="city" intensity={0.6}>
        {/* Replace this with your actual 3D avatar */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Stage>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
