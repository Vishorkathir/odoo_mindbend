import React from 'react';
import AITutorAvatar from './components/AITutorAvatar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

import StudyMode from './components/studyPlan';
import ChatBot from './components/Chatbot';
import {Router, Routes,Route } from 'react-router-dom';
import Answer from './components/Answer';
import Login from './components/LoginPage';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AnswerAnalysis from './components/Answer';
import Quiz from './components/AIquiz';
import Index from './components/Index';
import AITutor from './components/AITutor';
import Model from './components/ModelVis';
export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
  
     <Routes>
      <Route path='/' element={<Index/>}/>
<Route path='/studyplan' element={<StudyMode/>}/>
<Route path='/Chatbot' element={<ChatBot/>}/>
<Route path='/Answer' element={<Answer/>}/>
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path='/Dashboard' element={<Dashboard/>}/>
<Route path='/Answer' element={<AnswerAnalysis/>}/>
<Route path='/AIquiz' element={<Quiz/>}/>
<Route path='/AItutor' element={<AITutor/>}/>
<Route path='/3dmodel' element={<Model/>}/>
     </Routes>  
     
  
     
   
  );
}
