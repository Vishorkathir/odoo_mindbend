import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function StudyMode() {
    const [topic, setTopic] = useState("");
  const [username, setUsername] = useState("");
  const [studyPlan, setStudyPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

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
        speak(plan);
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

    if (synthRef.current.speaking) {
      synthRef.current.cancel(); // Stop if already speaking
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 ">
      
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Avatar Section */}
        <div data-aos="zoom-in" className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6" style={{width:"50%",marginLeft:"25%",fontSize:"50px"}}>👩🏫 SIBI Study Companion</h2>
          <div className="relative w-full h-96 bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-red-200 opacity-20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="floating-avatar " style={{display:"flex",justifyContent:"center"}}>
                <img 
                  src="/image/SIBI AI.png" 
                  alt="AI Tutor" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Study Plan Input */}
        <div 
          data-aos="fade-up" 
          className="bg-white backdrop-blur-lg rounded-3xl shadow-xl p-8 space-y-6 border border-opacity-10 border-white"
          style={{ background: 'rgba(255, 255, 255, 0.9)' }}
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center" style={{width:"50%",marginLeft:"25%"}}>📚 Generate Smart Study Plan</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="form-group" style={{width:"50%",marginLeft:"30%"}}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input peer"
                  placeholder=" "
                />
                <label className="form-label">Your Name</label>
                <div className="form-underline"></div>
              </div>

              <div className="form-group" style={{width:"50%",marginLeft:"30%"}}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-input peer"
                  placeholder=" "
                />
                <label className="form-label">Study Topic</label>
                <div className="form-underline"></div>
              </div>
            </div>

            <button
              type="submit" style={{width:"30%",marginLeft:"30%"}}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  <span>Generating Plan...</span>
                </div>
              ) : (
                "Generate Smart Plan 🚀"
              )}
            </button>
          </form>
        </div>

        {/* Study Plan Output */}
        {studyPlan && (
          <div 
            data-aos="fade-up"
            className="bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-slide-up"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">📋</span>
              <span>Your Personalized Study Plan</span>
            </h2>
            
            <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-200 whitespace-pre-wrap">
              {studyPlan.split('\n').map((line, i) => (
                <p key={i} className="text-gray-700 mb-3 animate-fade-in">
                  {line}
                </p>
              ))}
            </div>

            {/* TTS Controls */}
            <div className="flex flex-wrap gap-5 justify-center" style={{width:"20%",marginLeft:"30%",marginTop:"5%"}}>
              {['play', 'pause', 'resume', 'stop'].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    if (action === 'play') speak(studyPlan);
                    if (action === 'pause') handlePause();
                    if (action === 'resume') handleResume();
                    if (action === 'stop') handleStop();
                  }}
                  className={`tts-button ${action} ${
                    (action === 'pause' && (!isSpeaking || isPaused)) ||
                    (action === 'resume' && !isPaused) ||
                    (action === 'stop' && !isSpeaking)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <span className="button-icon">
                    {action === 'play' && '▶️'}
                    {action === 'pause' && '⏸️'}
                    {action === 'resume' && '⏯️'}
                    {action === 'stop' && '⏹️'}
                  </span>
                  <span className="button-text capitalize">{action}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add to your CSS file:
`
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.floating-avatar {
  animation: float 4s ease-in-out infinite;
}

.form-group {
  @apply relative z-0;
}

.form-input {
  @apply block w-full px-4 py-4 text-lg bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer;
}

.form-label {
  @apply absolute text-lg text-gray-500 duration-300 transform -translate-y-8 scale-75 top-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8;
}

.form-underline {
  @apply absolute bottom-0 left-0 w-0 h-1 bg-blue-500 transition-all duration-300;
}

.form-group:hover .form-underline {
  @apply w-full;
}

.tts-button {
  @apply flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105;
}

.tts-button.play {
  @apply bg-green-500 text-white hover:bg-green-600;
}

.tts-button.pause {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}

.tts-button.resume {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.tts-button.stop {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;


