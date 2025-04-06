import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.5} position={[0, 0, 0]} />;
}

export default function ARScene({ modelPath }) {
  return (
    <Canvas>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} />
      <Model modelPath={modelPath} />
      <OrbitControls />
    </Canvas>
  );
}