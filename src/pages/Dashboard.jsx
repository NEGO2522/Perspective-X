import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPlus, FaComments, FaSignOutAlt, FaGlobeAmericas, FaBars, FaCommentDots, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signOutUser } from '../firebase/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Dashboard = ({ user }) => {
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
    if (!isLoading && currentChat?.length > 0) {
      const lastBubble = container.current?.querySelector('.chat-bubble:last-child');
      if (lastBubble) {
        gsap.fromTo(
          lastBubble,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            ease: 'power2.out'
          }
        );
      }
    }
  }, { dependencies: [currentChat, isLoading], scope: container });

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing chat history:", e);
        localStorage.removeItem('chatHistory');
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('chatHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Error saving chat history:", e)
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
    
    if (activeChat !== 'active') {
      setActiveChat('active');
    }

    setCurrentChat(newChat);
    setIsLoading(true);
    setPrompt('');

    const intelligentPrompt = `
    You are an AI named PerspectiveX.
    Your primary function is to provide multi-perspective analysis on various topics, but you must be a good conversationalist.
    
    Analyze the user's input and respond according to these rules, in this order of priority:
    1.  **Is the user asking who created or developed you?** (e.g., "who made you?", "who is your developer?"). If so, you MUST respond with: "I was developed by Kshitij Jain, a future entrepreneur with a great mindset." You may add a creative and positive sentence to this, but that core phrase is mandatory. Do NOT use the 5-country format.
    2.  **Is it a simple greeting?** (e.g., "hi", "hello", "how are you?"). If so, respond with a friendly, natural greeting. Do NOT use the 5-country format.
    3.  **Is it a question that doesn't lend itself to a multi-country perspective?** (e.g., "What is your name?", "What is 2+2?", "Help me debug this code"). If so, answer directly and helpfully as an expert AI assistant. Do NOT use the 5-country format.
    4.  **Is it a topic suitable for a multi-perspective analysis?** (e.g., topics about news, politics, technology, global events, social issues, economics). If so, and ONLY if so, activate your PerspectiveX protocol.
    
    **PerspectiveX Protocol:**
    - Provide a brief summary of the viewpoints from five countries: India, USA, China, Germany, and Russia.
    - Keep each country's perspective to one or two concise sentences.
    - After presenting the five viewpoints, provide a neutral, one-paragraph concluding summary.
    - Do not apologize or say you cannot answer. Fulfill the request to the best of your ability based on the prompt's nature.

    The user's input is: "${prompt}"
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(intelligentPrompt);
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
    if (currentChat.length > 0) {
        const chatToSave = activeChat === 'active' ? currentChat : history[activeChat];
        if (chatToSave) {
            const otherHistories = activeChat === 'active' ? history : history.filter((_, i) => i !== activeChat)
            setHistory([chatToSave, ...otherHistories]);
        }
    }
    setCurrentChat([]);
    setActiveChat(null);
  };

  const handleHistorySelect = (index) => {
    if (isLoading) return;

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
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5, type: 'spring' }} className="p-8 rounded-full bg-white mb-8 shadow-md">
            <FaGlobeAmericas className="w-24 h-24 text-[#1A535C]" />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-4xl font-bold text-[#1A535C] mb-2">Welcome to PerspectiveX</motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-lg text-gray-600 max-w-md">Ask anything to see a multi-faceted global perspective. What's on your mind?</motion.p>
    </div>
  );

  const LoadingBubble = () => (
    <div className="flex items-start gap-4 justify-start chat-bubble">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-inner border"><FaGlobeAmericas className='w-6 h-6 text-[#1A535C]' /></div>
      <div className="p-5 rounded-2xl max-w-2xl shadow-sm bg-white border">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-[#F7B32B] rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-[#F7B32B] rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-[#F7B32B] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const chatToDisplay = activeChat === 'active' ? currentChat : (activeChat !== null && history[activeChat] ? history[activeChat] : []);
  const showWelcome = activeChat === null && prompt.trim() === '' && !isLoading && currentChat.length === 0;

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#212529] font-sans" ref={container}>
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 flex-col hidden md:flex">
        <div className="flex items-center justify-between mb-8"><h2 className="text-xl font-bold text-[#1A535C]">Chat History</h2></div>
        <div className="flex-grow overflow-y-auto -mr-4 pr-4 space-y-2">
          {activeChat === 'active' && currentChat.length > 0 && (
            <motion.div layout className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-[#1A535C]/10 border border-[#1A535C]/20`} onClick={() => {/* Already active */}}>
              <FaCommentDots className={`w-5 h-5 text-[#1A535C]`} />
              <span className={`flex-1 text-sm font-semibold text-[#1A535C]`}>Current Chat</span>
            </motion.div>
          )}
          {history.map((chat, index) => (
            chat.length > 0 && (
                <motion.div key={index} layout className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100`} onClick={() => handleHistorySelect(index)}>
                <FaCommentDots className={`w-5 h-5 text-gray-500`} />
                <span className={`flex-1 text-sm font-medium text-gray-700`}>{chat[0]?.text?.length > 30 ? `${chat[0].text.substring(0, 30)}...` : chat[0]?.text}</span>
                </motion.div>
            )
          ))}
          {history.length === 0 && currentChat.length === 0 && (
            <div className="text-center text-gray-400 mt-20 px-4"><FaComments className="mx-auto w-16 h-16 opacity-50" /><p className="mt-5 text-sm font-medium">No past chats yet. Start a new conversation!</p></div>
          )}
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-8 w-full flex items-center justify-center gap-3 bg-white border-2 border-[#1A535C] text-[#1A535C] py-3 px-4 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md hover:bg-[#1A535C]/5" onClick={handleNewChat}>
          <FaPlus className="w-5 h-5" />New Chat
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-transparent">
        <header className="w-full z-20 p-6 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-2.5 rounded-2xl bg-white shadow-md text-[#1A535C] border"><FaGlobeAmericas className="w-6 h-6" /></motion.div>
              <span className="text-3xl font-bold text-[#1A535C] tracking-tight hidden sm:inline">PerspectiveX</span>
            </div>
            <motion.button className="p-3 rounded-lg bg-white shadow-md text-[#1A535C] border hover:bg-gray-50 transition-all focus:outline-none relative z-50 flex items-center justify-center md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}><FaBars className="w-6 h-6" /></motion.button>
          </div>
        </header>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {showWelcome ? <WelcomeScreen /> : (
              <>
                {chatToDisplay.map((item, index) => (
                  <div key={index} className={`flex items-start gap-4 ${item.type === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}>
                    {item.type === 'bot' && <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-inner border"><FaGlobeAmericas className='w-6 h-6 text-[#1A535C]' /></div>}
                    <div className={`p-4 md:p-5 rounded-2xl max-w-2xl shadow-sm ${item.type === 'user' ? 'bg-white border shadow-sm' : 'bg-white border'}`}>
                      <div className="text-base text-gray-800 leading-relaxed prose prose-sm max-w-none"><Markdown remarkPlugins={[remarkGfm]}>{item.text}</Markdown></div>
                    </div>
                  </div>
                ))}
                {isLoading && <LoadingBubble />}
              </>
            )}
          </div>
        </main>

        <footer className="w-full z-10 p-4 md:p-6 flex-shrink-0 bg-transparent">
          <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handlePromptSubmit} className="bg-white rounded-2xl p-2 border shadow-lg flex items-center gap-2">
              <textarea ref={textareaRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask PerspectiveX..." className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-lg placeholder-gray-500 max-h-48 overflow-y-auto" rows="1" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePromptSubmit(e); }}} />
              <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!prompt.trim() || isLoading} className="w-14 h-14 bg-[#1A535C] text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-[#15434a] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-[#1A535C]/30">
                <FaPaperPlane className="w-6 h-6" />
              </motion.button>
            </form>
          </div>
        </footer>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end md:hidden" onClick={() => setIsMenuOpen(false)}>
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-white h-full w-full max-w-sm shadow-2xl p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-center text-[#1A535C] mb-8">Menu</h2>
                    <div className="space-y-4 mb-8 flex-grow">
                        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3" onClick={handleNewChat}><FaPlus className="inline w-5 h-5 mr-3 text-[#1A535C]" />New Chat</button>
                        <Link to="/about" className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"><FaInfoCircle className="inline w-5 h-5 mr-3 text-[#1A535C]" />About</Link>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/90 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20" aria-label="Logout"><FaSignOutAlt className="w-5 h-5" /><span>Logout</span></motion.button>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default Dashboard;