import { useState } from 'react';
import '../styles/Answer.css';

const AnswerAnalysis = () => {
  const [extractedText, setExtractedText] = useState('No text extracted yet.');
  const [aiFeedback, setAiFeedback] = useState('No feedback available yet.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to format text with proper line breaks
  const formatText = (text) => {
    if (!text) return text;
    
    // Split text into lines and remove empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Group lines into paragraphs
    return lines.map((line, index) => {
      // Check if line starts with number or bullet point
      if (/^\d+\.|^-/.test(line)) {
        return <div key={index} className="bullet-point">{line}</div>;
      }
      return <p key={index} className="analysis-paragraph">{line}</p>;
    });
  };

  const analyzeAnswer = async () => {
    const fileInput = document.getElementById('answerSheetUpload');
    const file = fileInput.files[0];
    
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/analyze-answer-sheet', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      // Process extracted text
      const cleanExtractedText = data.extracted_text 
        ? data.extracted_text.replace(/(\r\n|\n|\r)/gm, ' ') 
        : 'No text extracted';
      
      setExtractedText(cleanExtractedText);

      // Process AI feedback
      const formattedFeedback = data.feedback 
        ? data.feedback.replace(/(\d+\.)/g, '\n$1') // Add line breaks before numbered items
                       .replace(/- /g, '\n- ')      // Add line breaks before bullet points
        : 'No feedback available';
      
      setAiFeedback(formattedFeedback);

    } catch (err) {
      setError(err.message || 'Error analyzing answer sheet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="answer-analysis-container">
      {/* Sidebar */} 
      <div className="sidebar">
         <h2>SIBI</h2>
         <ul>
           <li><a href="/dashboard"><i className="fas fa-home"></i> Home</a></li>
           <li><a href="/studyPlan"><i className="fas fa-book"></i> Study Plan</a></li>
           <li><a href="/AITutor"><i className="fas fa-comments"></i> AI Tutor</a></li>
           <li><a href="/AIquiz"><i className="fas fa-question-circle"></i> AI Quiz</a></li>
           <li><a href="/Answer" className="active"><i className="fas fa-chart-line"></i> Answer Analysis</a></li>
           <li><a href="/3dmodel"><i className="fas fa-chart-line"></i> Model Visualization</a></li>
           <li><a href="/" id="logoutBtn"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
         </ul>
       </div>

      {/* Main Content */}
      <div className="container">
        <h2>Upload Your Answer Sheet for Analysis</h2>
        <input 
          type="file" 
          id="answerSheetUpload" 
          accept=".pdf, .png, .jpg, .jpeg, .txt"
          className="file-input"
        />
        <button 
          onClick={analyzeAnswer}
          disabled={isLoading}
          className="analyze-button"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>

        {error && <div className="error-message">{error}</div>}

        <h3>Extracted Text:</h3>
        <div className="analysis-result">
          {extractedText.split('. ').map((sentence, index) => (
            <p key={index} className="text-paragraph">
              {sentence.trim()}.
            </p>
          ))}
        </div>

        <h3>AI Feedback:</h3>
        <div className="analysis-result feedback-container">
          {formatText(aiFeedback)}
        </div>
      </div>
    </div>
  );
};

export default AnswerAnalysis;



// import { useState } from 'react';
// import '../styles/Answer.css';

// const AnswerAnalysis = () => {
//   const [extractedText, setExtractedText] = useState('No text extracted yet.');
//   const [aiFeedback, setAiFeedback] = useState('No feedback available yet.');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const analyzeAnswer = async () => {
//     const fileInput = document.getElementById('answerSheetUpload');
//     const file = fileInput.files[0];
    
//     if (!file) {
//       setError('Please select a file first');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch('http://localhost:8000/analyze-answer-sheet', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Analysis failed');
//       }

//       const data = await response.json();
//       setExtractedText(data.extracted_text || 'No text extracted');
//       setAiFeedback(data.feedback || 'No feedback available');

//     } catch (err) {
//       setError(err.message || 'Error analyzing answer sheet');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="answer-analysis-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>SIBI</h2>
//         <ul>
//           <li><a href="/dashboard"><i className="fas fa-home"></i> Home</a></li>
//           <li><a href="/study"><i className="fas fa-book"></i> Study Plan</a></li>
//           <li><a href="/chat"><i className="fas fa-comments"></i> AI Chat</a></li>
//           <li><a href="/quiz"><i className="fas fa-question-circle"></i> AI Quiz</a></li>
//           <li><a href="/analysis" className="active"><i className="fas fa-chart-line"></i> Answer Analysis</a></li>
//           <li><a href="/" id="logoutBtn"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="container">
//         <h2>Upload Your Answer Sheet for Analysis</h2>
//         <input 
//           type="file" 
//           id="answerSheetUpload" 
//           accept=".pdf, .png, .jpg, .jpeg, .txt"
//           className="file-input"
//         />
//         <button 
//           onClick={analyzeAnswer}
//           disabled={isLoading}
//           className="analyze-button"
//         >
//           {isLoading ? 'Analyzing...' : 'Analyze'}
//         </button>

//         {error && <div className="error-message">{error}</div>}

//         <h3>Extracted Text:</h3>
//         <pre className="analysis-result" id="extractedText">{extractedText}</pre>

//         <h3>AI Feedback:</h3>
//         <pre className="analysis-result" id="aiFeedback">{aiFeedback}</pre>
//       </div>
//     </div>
//   );
// };

// export default AnswerAnalysis;