import React, { useEffect } from 'react';
import '../styles/Index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 data-aos="fade-right">SIBI: Your Smart 3D Study Companion</h1>
          <p data-aos="fade-right" data-aos-delay="200">Learn smarter, stay focused, and ace your studies with AI-powered assistance!</p>
          <div className="buttons">
            <a href="/signup" className="btn btn-alt" data-aos="zoom-in" data-aos-delay="400">Get Started</a>
            <a href="/login" className="btn btn-alt" data-aos="zoom-in" data-aos-delay="400">Login</a>
          </div>
        </div>
        <div className="hero-image" data-aos="fade-left">
          <img src="public/image/SIBI AI.png" alt="3D Avatar" className="floating"/>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2 data-aos="fade-up">Why Choose SIBI?</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <i className={feature.icon}></i>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer data-aos="fade-up" data-aos-delay="200">
        <p>&copy; 2025 SIBI Study Companion. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "fas fa-user-graduate pulse",
    title: "3D AI Study Friend",
    desc: "Interact with SIBI's lifelike avatar for an immersive learning experience."
  },
  {
    icon: "fas fa-calendar-alt",
    title: "Smart Study Plans",
    desc: "AI-generated schedules optimized for your learning patterns."
  },
  {
    icon: "fas fa-pen",
    title: "Adaptive Quizzes",
    desc: "Personalized assessments with real-time performance analysis."
  },
  {
    icon: "fas fa-eye",
    title: "Focus Assistant",
    desc: "Computer vision-powered distraction monitoring system."
  },
  {
    icon: "fas fa-magnifying-glass",
    title: "Answer Correction",
    desc: "AI-powered answer analysis with detailed feedback."
  },
  {
    icon: "fas fa-chart-line",
    title: "Progress Tracking",
    desc: "Detailed analytics and visual progress reports."
  }
];

export default LandingPage;