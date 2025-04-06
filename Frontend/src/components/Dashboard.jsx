import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullQuiz, setShowFullQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) {
          navigate('/login');
          return;
        }

        // Simulated API calls
        const userData = {
          current_topic: "Advanced Calculus",
          study_plan: "",
        };

        const quizData = {
          quiz:  `Week 1: Differentiation
          - Basic differentiation rules
          - Chain rule practice
          - Implicit differentiation
          
          Week 2: Integration
          - Indefinite integrals
          - Definite integrals
          - Integration techniques
          
          Week 3: Series
          - Sequences and series
          - Convergence tests
          - Power series
          
          Week 4: Applications
          - Area between curves
          - Volume of revolution
          - Real-world applications`,
        };

        setUserData({
          username,
          currentTopic: userData.current_topic,
          studyPlan: userData.study_plan,
          recentQuiz: quizData.quiz
        });

      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatQuizContent = (content) => {
    if (!content || content === 'No recent quiz') return content;
    
    const lines = content.split('\n');
    const previewLines = lines.slice(0, 4);
    const fullLines = lines;

    return (
      <div className="quiz-content">
        {(showFullQuiz ? fullLines : previewLines).map((line, index) => (
          <div key={index} className={`quiz-line ${line.startsWith('Q') ? 'question' : 'option'}`}>
            {line}
          </div>
        ))}
        {lines.length > 4 && (
          <button 
            className="quiz-toggle hover-scale"
            onClick={() => setShowFullQuiz(!showFullQuiz)}
          >
            {showFullQuiz ? '▲ Show Less' : '▼ Show More'}
          </button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="dashboard-loading">📚 Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Animated Sidebar */}
      <div className="sidebar" data-aos="fade-right">
        <h2 className="logo-glow">SIBI</h2>
        <ul>
          <li data-aos="fade-right" data-aos-delay="150">
            <a href="/dashboard" className="active">
              <i className="fas fa-home"></i> Dashboard
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="200">
            <a href="/studyplan">
              <i className="fas fa-book"></i> Study Plan
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="250">
            <a href="/AITutor">
              <i className="fas fa-robot"></i> AI Tutor
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="300">
            <a href="/AIquiz">
              <i className="fas fa-question-circle"></i> AI Quiz
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="350">
            <a href="/Answer">
              <i className="fas fa-chart-line"></i>Answer Analysis
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="350">
            <a href="/3dmodel">
              <i className="fas fa-chart-line"></i>Model Visualization
            </a>
          </li>
          <li data-aos="fade-right" data-aos-delay="400">
            <a href="/" onClick={() => localStorage.clear()}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 data-aos="fade-up" data-aos-delay="100">📊 Welcome back, {userData.username}!</h1>
        
        <div className="dashboard-grid">
          {/* Study Plan Card */}
          <div className="dashboard-card" data-aos="zoom-in" data-aos-delay="200">
            <h2>📚 Current Study Plan</h2>
            <div className="study-plan-preview">
              <h3>{userData.currentTopic}</h3>
              <pre>{userData.studyPlan?.split('\n').slice(0, 5).join('\n')}</pre>
            </div>
            <button 
              onClick={() => navigate('/studyPlan')} 
              className="dashboard-button hover-scale"
            >
              View Full Plan →
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card" data-aos="zoom-in" data-aos-delay="250">
            <h2>⚡ Quick Actions</h2>
            <div className="quick-actions">
              <button 
                onClick={() => navigate('/AIquiz')} 
                className="action-btn hover-scale"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <i className="fas fa-question-circle"></i>
                Generate Quiz
              </button>
              <button 
                onClick={() => navigate('/Answer')} 
                className="action-btn hover-scale"
                data-aos="fade-up"
                data-aos-delay="350"
              >
                <i className="fas fa-file-upload"></i>
                Analyze Answers
              </button>
              <button 
                onClick={() => navigate('/chatbot')} 
                className="action-btn hover-scale"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <i className="fas fa-comments"></i>
                Ask SIBI
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card" data-aos="zoom-in" data-aos-delay="300">
            <h2>📅 Recent Activity</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {userData.recentQuiz}
            </pre>
            <div className="activity-item">
              <h3>Last Quiz Result</h3>
              <div className="quiz-container">
                {formatQuizContent(userData.recentQuiz)}
              </div>
            </div>
            <div className="activity-item">
              <h3>Study Progress</h3>
              <div className="progress-bar">
                <div className="progress" style={{ width: '65%' }}></div>
              </div>
              <span>65% Completed</span>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="dashboard-card stats-card" data-aos="zoom-in" data-aos-delay="350">
            <h2>📈 Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item hover-scale">
                <i className="fas fa-book-open"></i>
                <span>5 Topics</span>
                <small>Completed</small>
              </div>
              <div className="stat-item hover-scale">
                <i className="fas fa-check-circle"></i>
                <span>23 Quizzes</span>
                <small>Attempted</small>
              </div>
              <div className="stat-item hover-scale">
                <i className="fas fa-clock"></i>
                <span>15h 30m</span>
                <small>Study Time</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;