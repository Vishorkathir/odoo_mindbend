import { useState } from 'react';
import '../styles/AIquiz.css';

const Quiz = () => {
  const [quizData, setQuizData] = useState({
    content: [],
    answers: [],
    showResults: false,
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const username = localStorage.getItem('username');

      if (!username) {
        setError("User not logged in.");
        return;
      }

      const response = await fetch(`http://localhost:8000/generate-quiz?user=${username}`);
      const data = await response.json();

      if (!response.ok || !data.quiz) {
        throw new Error(data.error || 'Invalid quiz data received from API');
      }

      const { questions, answers } = parseQuizData(data.quiz);

      setQuizData({
        content: questions,
        answers,
        showResults: false,
      });

      setSelectedAnswers({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseQuizData = (quizText) => {
    const lines = quizText.trim().split('\n');
    const questions = [];
    const answers = [];
    let currentQuestion = null;

    lines.forEach((line) => {
      if (/^Q\d+:/.test(line)) {
        currentQuestion = line.replace(/^Q\d+:\s*/, '');
        questions.push({ text: currentQuestion, options: [] });
      } else if (/^[A-D]\)/.test(line)) {
        questions[questions.length - 1].options.push(line.trim());
      } else if (/^Answer/.test(line)) {
        answers.push(line.split(':')[1].trim());
      }
    });

    return { questions, answers };
  };

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option[0],
    }));
  };

  const submitQuiz = () => {
    setQuizData((prev) => ({
      ...prev,
      showResults: true,
    }));
  };

  const calculateScore = () => {
  return quizData.answers.reduce((score, correctAnswer, i) => {
    return selectedAnswers[i] === correctAnswer ? score + 1 : score;
  }, 0);
};

  
  return (
    <div className="quiz-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>SIBI</h2>
        <ul>
          <li><a href="/dashboard"><i className="fas fa-home"></i> Dashboard</a></li>
          <li><a href="/studyPlan"><i className="fas fa-book-open"></i> StudyPlan</a></li>
          <li><a href="/AITutor"><i className="fas fa-comments"></i> AITutor</a></li>
          <li><a href="#" className="active"><i className="fas fa-question-circle"></i> AI Quizzes</a></li>
          <li><a href="/Answer"><i className="fas fa-chart-line"></i> Answer Analysis</a></li>
          <li><a href="/3dmodel"><i className="fas fa-cube"></i> Model Visualization</a></li>
          <li><a href="/" id="logoutBtn"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>📝 AI-Powered Quiz</h1>

        <div className="quiz-generator">
          <h2>📌 Click Below to Start Your Quiz</h2>
          <button
            style={{ width: "30%", marginTop: "3%" }}
            className="btn"
            onClick={generateQuiz}
            disabled={loading}
          >
            {loading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="quiz-section">
          {quizData.content.length > 0 && (
            <>
              <h2>🤖 AI-Generated Questions</h2>
              <div id="quizContent">
                {quizData.content.map((question, index) => (
                  <div key={index} className="question-container">
                    <div className="question-header">
                      <span className="question-number">Question {index + 1}</span>
                      {quizData.showResults && (
                        <span
                          className={`result-indicator ${
                            selectedAnswers[index] === quizData.answers[index]
                              ? 'correct'
                              : 'incorrect'
                          }`}
                        >
                          {selectedAnswers[index] === quizData.answers[index]
                            ? '✓ Correct'
                            : `✗ Incorrect (Answer: ${quizData.answers[index]})`}
                        </span>
                      )}
                    </div>
                    <p className="question-text">{question.text}</p>
                    <div className="options-container">
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedAnswers[index] === option[0];
                        const isCorrect = quizData.answers[index] === option[0];

                        return (
                          <label
                            key={optIndex}
                            className={`option-label ${
                              quizData.showResults ? 'disabled' : ''
                            } ${isSelected ? 'selected' : ''} ${
                              quizData.showResults && isCorrect ? 'correct-answer' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option[0]}
                              onChange={() => handleAnswerSelect(index, option)}
                              disabled={quizData.showResults}
                            />
                            {option}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizData.showResults && (
                <button
                  id="submitQuiz"
                  className="btn submit-btn"
                  onClick={submitQuiz}
                 
                >
                  Submit Quiz
                </button>
              )}

              {quizData.showResults && (
                <div className="score">
                  <h3>
                    🎯 Your Score: {calculateScore()} / {quizData.content.length}
                  </h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
