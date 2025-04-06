import { useState, useRef, useEffect } from 'react';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm SIBI. How can I assist you with your studies today? 📚", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Add user message
    const newMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const username = localStorage.getItem('username');
      if (!username) throw new Error('User not logged in');

      const formData = new URLSearchParams();
      formData.append('user', username);
      formData.append('user_message', inputText);

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();
      const botMessage = formatBotResponse(data.response);
      
      setMessages(prev => [...prev, { text: botMessage, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: `❌ Error: ${error.message}`, 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format bot responses with markdown
  const formatBotResponse = (text) => {
    return text
      .split('\n')
      .map(line => {
        if (line.startsWith('- ')) return `• ${line.substring(2)}`;
        if (line.match(/^\d+\./)) return `🔹 ${line}`;
        return line;
      })
      .join('\n');
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h1>📚 SIBI Study Assistant</h1>
        <p>Connected to your study plan</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`message ${msg.isBot ? 'bot' : 'user'}`}
          >
            {msg.isBot ? (
              <div className="bot-message">
                <div className="bot-avatar">🤖</div>
                <div className="message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ) : msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your study plan..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;