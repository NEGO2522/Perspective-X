import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPlus, FaComments, FaSignOutAlt, FaGlobeAmericas, FaBars, FaTimes, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signOutUser } from '../firebase/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const container = useRef();

  useGSAP(() => {
    gsap.from('.chat-bubble', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
  }, { dependencies: [currentChat, activeChat], scope: container });

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing chat history:", e);
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat, isLoading]);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() === '' || isLoading) return;

    const userMessage = { type: 'user', text: prompt };
    const newChat = [...currentChat, userMessage];
    setCurrentChat(newChat);
    setIsLoading(true);
    setPrompt('');

    const fullPrompt = `Act as an AI named PerspectiveX. For the following topic, provide a brief summary of the viewpoints from five countries: India, USA, China, Germany, and Russia. Keep each country's perspective to one or two sentences. After presenting the five viewpoints, provide a neutral, one-paragraph concluding summary. The topic is: "${prompt}"`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      const botMessage = { type: 'bot', text: text };
      setCurrentChat([...newChat, botMessage]);
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = { type: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setCurrentChat([...newChat, errorMessage]);
    } finally {
      setIsLoading(false);
      if (activeChat === null) {
        setActiveChat('active');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNewChat = () => {
    if (currentChat.length > 0 && activeChat === 'active') {
      setHistory([currentChat, ...history]);
    }
    setCurrentChat([]);
    setActiveChat(null);
  };

  const handleHistorySelect = (index) => {
    if (currentChat.length > 0 && activeChat === 'active') {
      setHistory([currentChat, ...history]);
    }
    setCurrentChat(history[index]);
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    setActiveChat('active');
  };

  const handleLogoClick = () => navigate('/');

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5, type: 'spring' }} className="p-8 rounded-full bg-white/50 mb-8">
            <FaGlobeAmericas className="w-24 h-24 text-[#CFAB8D]" />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-4xl font-bold text-gray-700 mb-2">Welcome to PerspectiveX</motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-lg text-gray-600 max-w-md">Every opinion matters. What's on your mind today?</motion.p>
    </div>
  );

  const LoadingBubble = () => (
    <div className="flex items-start gap-4 justify-start chat-bubble">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-inner"><FaGlobeAmericas className='w-6 h-6 text-[#CFAB8D]' /></div>
      <div className="p-5 rounded-2xl max-w-2xl shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const chatToDisplay = activeChat === 'active' ? currentChat : (activeChat !== null ? history[activeChat] || [] : []);
  const showWelcome = chatToDisplay.length === 0 && prompt.trim() === '' && !isLoading;

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-gray-800" ref={container}>
      {/* Sidebar */}
      <div className="w-72 bg-black/10 backdrop-blur-xl p-6 flex-col hidden md:flex">
        <div className="flex items-center justify-between mb-10"><h2 className="text-xl font-bold text-gray-800">Chat History</h2></div>
        <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-2">
          {currentChat.length > 0 && (
            <motion.div layout className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-white/80 shadow-lg`} onClick={() => setActiveChat('active')}>
              <FaCommentDots className={`w-5 h-5 text-[#CFAB8D]`} />
              <span className={`flex-1 text-sm font-medium text-gray-900`}>Active Chat</span>
            </motion.div>
          )}
          {history.map((chat, index) => (
            <motion.div key={index} layout className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/50`} onClick={() => handleHistorySelect(index)}>
              <FaCommentDots className={`w-5 h-5 text-gray-600`} />
              <span className={`flex-1 text-sm font-medium text-gray-700`}>{chat[0]?.text.length > 30 ? `${chat[0].text.substring(0, 30)}...` : chat[0]?.text}</span>
            </motion.div>
          ))}
          {history.length === 0 && currentChat.length === 0 && (
            <div className="text-center text-gray-500/80 mt-20"><FaComments className="mx-auto w-16 h-16 opacity-50" /><p className="mt-5 text-sm font-medium">No past chats</p></div>
          )}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-8 w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md text-gray-800 py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg" onClick={handleNewChat}>
          <FaPlus className="w-5 h-5 text-[#CFAB8D]" />New Chat
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-transparent">
        <header className="w-full z-20 p-6 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-2.5 rounded-2xl bg-white shadow-md text-[#CFAB8D]"><FaGlobeAmericas className="w-6 h-6" /></motion.div>
              <span className="text-3xl font-bold text-gray-800 tracking-tight font-sans">PerspectiveX</span>
            </div>
            <motion.button className="p-3 rounded-lg bg-white/70 backdrop-blur-sm text-[#2D2D2D] hover:bg-white transition-all focus:outline-none relative z-50 shadow-md flex items-center justify-center md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}><FaBars className="w-6 h-6" /></motion.button>
          </div>
        </header>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {showWelcome ? <WelcomeScreen /> : (
              <> 
                {chatToDisplay.map((item, index) => (
                  <div key={index} className={`flex items-start gap-4 ${item.type === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}>
                    {item.type === 'bot' && <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-inner"><FaGlobeAmericas className='w-6 h-6 text-[#CFAB8D]' /></div>}
                    <div className={`p-5 rounded-2xl max-w-2xl shadow-sm ${item.type === 'user' ? 'bg-white' : 'bg-white'}`}><div className="text-base text-gray-700 leading-relaxed"><Markdown remarkPlugins={[remarkGfm]}>{item.text}</Markdown></div></div>
                  </div>
                ))}
                {isLoading && <LoadingBubble />}
              </>
            )}
          </div>
        </main>

        <footer className="w-full z-10 p-4 md:p-6 flex-shrink-0 bg-transparent">
          <div className="w-full max-w-5xl mx-auto">
            <form onSubmit={handlePromptSubmit} className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 border-black/5 shadow-xl flex items-center gap-2">
              <textarea ref={textareaRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask PerspectiveX anything..." className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-lg placeholder-gray-500 max-h-48 overflow-y-auto" rows="1" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePromptSubmit(e); }}} />
              <motion.button type="submit" whileHover={{ scale: 1.05, backgroundColor: '#BF9A7C' }} whileTap={{ scale: 0.95 }} disabled={!prompt.trim() || isLoading} className="w-14 h-14 bg-[#CFAB8D] text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-[#CFAB8D]/40">
                <FaPaperPlane className="w-6 h-6" />
              </motion.button>
            </form>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center md:hidden" onClick={() => setIsMenuOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xs mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-center text-[#2D2D2D] mb-8">Menu</h2>
              <div className="space-y-4 mb-8">
                <button className="w-full text-left p-3 rounded-lg hover:bg-black/10 transition-colors" onClick={handleNewChat}><FaPlus className="inline w-5 h-5 mr-3 text-[#CFAB8D]" />New Chat</button>
              </div>
              <motion.button whileHover={{ scale: 1.03, boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/90 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20" aria-label="Logout"><FaSignOutAlt className="w-5 h-5" /><span>Logout</span></motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
