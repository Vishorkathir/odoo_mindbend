import { useEffect, useRef, useState } from "react";
import ARScene from "./ARScene";
import "../styles/ModelVis.css"; // Make sure this CSS file exists

const models = [
  { name: "Heart", file: "/heart1.glb" },
  { name: "Rocket Engine", file: "/rocket propulsion engine.glb" },
  { name: "Sci-Fi Robot", file: "/sci-fi-robot.glb" },
  { name: "Skeleton", file: "/skeleton.glb" },
  { name: "Suspension", file: "/suspension.glb" },
  { name: "Brain", file: "/brain.glb" },
  { name: "Engine", file: "/engine.glb" },
  { name: "Gearbox", file: "/gearbox.glb" },
  { name: "Gear 2", file: "/gear2.glb" },
  { name: "Model", file: "/model.glb" },
];

function Model() {
  const videoRef = useRef(null);
  const [modelPath, setModelPath] = useState(models[0].file);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));
  }, []);

  return (
    <div className="model-container">
      <video ref={videoRef} autoPlay muted playsInline className="fullscreen-video" />
      <div className="top-bar">
        {models.map((m) => (
          <button key={m.name} onClick={() => setModelPath(m.file)}>
            {m.name}
          </button>
        ))}
      </div>
      <div className="canvas-container" >
        <ARScene modelPath={modelPath} />
      </div>
    </div>
  );
}

export default Model;
