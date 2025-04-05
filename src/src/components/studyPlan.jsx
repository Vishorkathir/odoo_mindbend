import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// You can later import your real 3D avatar here
// import AITutor3D from "./Your3DComponent";

export default function StudyMode() {
  const [topic, setTopic] = useState("");
  const [username, setUsername] = useState("");
  const [studyPlan, setStudyPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic || !username) {
      alert("Please enter both topic and username.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("user", username);

      const response = await axios.post("http://localhost:8000/generate-study-plan", formData);
      if (response.data.message === "Study plan generated and saved!") {
        const studyRes = await axios.get(`http://localhost:8000/get-user-study?user=${username}`);
        const plan = studyRes.data.study_plan;
        setStudyPlan(plan);
        speak(plan); // Start TTS reading
      } else {
        alert("Error generating study plan.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error while fetching study plan.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    synthRef.current.speak(utterance);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-2xl mt-6 space-y-8">
      {/* Avatar Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">👩‍🏫 AI Tutor Avatar</h2>
        {/* Replace with your actual 3D avatar */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          <p className="text-gray-600">[3D Avatar Placeholder]</p>
        </div>
      </div>

      {/* Study Plan Input */}
      <div>
        <h1 className="text-2xl font-bold mb-4">🧠 Generate Study Plan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Enter topic (e.g. Java, AI)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </form>
      </div>

      {/* Study Plan Output */}
      {studyPlan && (
        <div className="mt-6 text-left whitespace-pre-wrap border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">📋 Your Study Plan:</h2>
          <p>{studyPlan}</p>
        </div>
      )}
    </div>
  );
}
