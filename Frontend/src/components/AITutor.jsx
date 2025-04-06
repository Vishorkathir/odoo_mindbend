import React, { useState, useRef } from "react";
import axios from "axios";


export default function AITutor() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  const askSIBI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("user", "testuser"); // Replace with dynamic username
      formData.append("user_message", question);

      const response = await axios.post("http://localhost:8000/chat", formData);

      const reply = response.data.response;
      speak(reply); // Speak the AI's reply

    } catch (err) {
      console.error(err);
      speak("Sorry, I couldn’t get a response from the server.");
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      
      <h1 className="text-2xl font-bold text-center text-purple-700" style={{marginLeft:"35%"}}>
        📚 SIBI Study Assistant
      </h1>
      {/* Avatar */}
      <div className="h-[400px] border rounded-lg overflow-hidden">
        <img src="/public/image/SIBI AI.png" style={{marginLeft:"38%",width:"350px"}}/>
      </div>

      <p className="text-center text-gray-500" style={{marginLeft:"43%" , marginTop:"20px"}}>
        Ask your study-related questions!
      </p>

      {/* Chat Input */}
      <form onSubmit={askSIBI} className="flex gap-2" style={{marginLeft:"35%" ,marginTop:"20px"}}>
        <input style={{width:"50%"}}
          type="text"
          placeholder="Ask about your study plan..."
          className="flex-1 px-4 py-2 border rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        /><br></br>
        <button
          type="submit" style={{width:"30%",marginLeft:"9%",marginTop:"40px"}}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>

      {/* TTS Controls Above Avatar */}
      <div className="flex justify-center gap-4 mt-2" style={{width:"30%",marginLeft:"37%",marginTop:"20px"}}>
        <button style={{marginBottom:"5px"}}
          onClick={handleResume}
          disabled={isSpeaking || !isPaused}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          ▶️ Play
        </button>
        <button style={{marginBottom:"5px"}}
          onClick={handlePause}
          disabled={!isSpeaking || isPaused}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          ⏸ Pause
        </button>
        <button style={{marginBottom:"5px"}}
          onClick={handleStop}
          disabled={!isSpeaking && !isPaused}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          ⏹ Stop
        </button>
      </div>

    </div>
  );
}
