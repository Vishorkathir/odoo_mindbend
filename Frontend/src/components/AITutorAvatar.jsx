// src/components/AITutorAvatar.jsx
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model(props) {
  const { scene } = useGLTF("/models/avatar.glb");
  return <primitive object={scene} {...props} />;
}

export default function AITutorAvatar() {
  // Replace with the logged-in user's name
  const username = "testuser";

  useEffect(() => {
    // Step 1: Fetch study plan from backend
    const fetchStudyPlan = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-user-study?user=${username}`);
        const data = await response.json();

        if (data.study_plan) {
          speakText(data.study_plan);
        } else {
          speakText({studyPlan});
        }
      } catch (err) {
        speakText("Error fetching study plan.");
        console.error(err);
      }
    };

    // Step 2: Speak using Web Speech API
    const speakText = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Optional: Add avatar animation trigger here
      speechSynthesis.speak(utterance);
    };

    fetchStudyPlan();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model scale={1.5} position={[0, -1, 0]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
