import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaArrowRight, FaSearch, FaNewspaper, FaChartLine, FaUsers, FaClock, FaEye, FaBars, FaTimes, FaGoogle, FaPaperPlane } from 'react-icons/fa';
import { signInWithGoogle, sendSignInLink, isSignInLinkUrl, completeSignInWithEmailLink, auth } from '../firebase/firebase';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <FaGlobeAmericas className="w-6 h-6" />,
    title: 'Global Perspectives',
    desc: 'See how different countries report the same event',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <FaSearch className="w-6 h-6" />,
    title: 'Deep Analysis',
    desc: 'Uncover hidden biases and narratives',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <FaChartLine className="w-6 h-6" />,
    title: 'Trend Tracking',
    desc: 'Watch how stories evolve across borders',
    color: 'from-amber-500 to-red-500'
  },
  {
    icon: <FaNewspaper className="w-6 h-6" />,
    title: 'Trusted Sources',
    desc: 'Curated selection of reliable news outlets',
    color: 'from-emerald-500 to-teal-500'
  }
];

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const container = useRef();
  const heroRef = useRef();
  const dashboardRef = useRef();
  const footerRef = useRef();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    // Only run animations if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Hero section animation
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    }

    // Logo animation - using refs instead of class selectors
    const logoElements = document.querySelectorAll('.logo');
    if (logoElements.length > 0) {
      gsap.from(logoElements, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'back.out(1.7)',
      });
    }

    // Menu button animation - using refs instead of class selectors
    const menuButtons = document.querySelectorAll('.menu-button');
    if (menuButtons.length > 0) {
      gsap.from(menuButtons, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });
    }

    // Dashboard section animations
    if (dashboardRef.current) {
      const dashboardItems = gsap.utils.toArray('.dashboard-item');
      if (dashboardItems.length > 0) {
        dashboardItems.forEach((item, i) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: dashboardRef.current,
              start: 'top center+=100',
              toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
          });
        });
      }
    }

    // Footer animation
    if (footerRef.current) {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Text animation for hero section
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
      gsap.to(heroText, {
        backgroundPosition: '200% 0%',
        duration: 10,
        ease: 'linear',
        repeat: -1,
      });
    }
  }, { scope: container.current });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await sendSignInLink(email);
      setShowEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithGoogle();
      setIsMenuOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for email sign-in link on component mount
  useEffect(() => {
    if (isSignInLinkUrl(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        completeSignInWithEmailLink(email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.location.href = '/';
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#ECEEDF] text-[#2D2D2D]" ref={container}>
      {/* Navigation */}
      <nav className="w-full py-4 bg-[#ECEEDF] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-2 rounded-xl bg-[#CFAB8D] text-white"
              >
                <FaGlobeAmericas className="w-5 h-5" />
              </motion.div>
              <span className="text-2xl font-bold text-[#2D2D2D] tracking-tight font-sans">
                PerspectiveX
              </span>
            </div>
            <div className="relative">
              <button 
                className="p-3 rounded-lg bg-[#CFAB8D] text-white hover:bg-opacity-90 transition-all focus:outline-none relative z-50 shadow-md flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
              {/* Backdrop */}
              {isMenuOpen && (
                <div 
                  className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm z-40 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                />
              )}
              
              {/* Modal */}
              <div 
                className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div 
                  className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300"
                  onClick={e => e.stopPropagation()}
                >
                  {user ? (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Welcome, {user.displayName || 'User'}</h2>
                      <p className="text-gray-600 mb-6">You're signed in to your account</p>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Welcome Back</h2>
                      <p className="text-gray-500">Sign in to access your account</p>
                    </div>
                    <div className="space-y-5">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAB8D]"
                      >
                        <FaGoogle className="text-red-500" />
                        Continue with Google
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm mb-4">
                          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CFAB8D] focus:border-transparent outline-none transition-all"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#CFAB8D] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAB8D] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Sending link...' : 'Get sign-in link'}
                        </button>
                      </form>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <input
                              type="email"
                              placeholder="Email address"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CFAB8D] focus:border-transparent outline-none transition-all"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#CFAB8D] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAB8D] disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Sending link...' : 'Get sign-in link'}
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-5 pb-20 px-4 sm:px-6 lg:px-8 mt-16" ref={heroRef}>
        <div className="max-w-4xl mx-auto text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#CFAB8D] text-white"
          >
            The Future of News Consumption
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#2D2D2D] leading-tight">
            <div className="hero-text bg-clip-text text-transparent bg-gradient-to-r from-[#2D2D2D] via-[#CFAB8D] to-[#2D2D2D] bg-[length:200%_auto] inline-block">
              Discover News from
              <span className="block mt-2">Every Angle</span>
            </div>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-[#2D2D2D]"
          >
            Break free from the single-narrative trap. Discover how different cultures and regions report the same global events through our comprehensive news analysis platform.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                if (user) {
                  navigate('/dashboard');
                } else {
                  setShowSignInModal(true);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-[#CFAB8D] text-white rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 hover:bg-opacity-90"
            >
              <span>Get Started</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </motion.button>
            <Link to="/about">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg font-medium border border-[#CFAB8D] text-[#2D2D2D] hover:bg-[#CFAB8D] hover:bg-opacity-10 transition-all"
              >
                About Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Dashboard Preview */}
      <section className="py-12 bg-[#ECEEDF]" ref={dashboardRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#CFAB8D] mb-2">Experience PerspectiveX</h2>
            <div className="w-16 h-1 bg-[#1A535C] mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Preview Header */}
            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-[#CFAB8D] text-white">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                  <FaGlobeAmericas className="w-3 h-3" />
                </div>
                <span className="font-medium text-sm">PerspectiveX</span>
              </div>
              <button className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors">
                New Chat
              </button>
            </div>
            
            {/* Preview Content */}
            <div className="flex h-[300px] overflow-hidden">
              {/* Sidebar - Hidden on mobile */}
              <div className="w-48 bg-gray-50 border-r border-gray-100 p-3 hidden sm:block">
                <div className="space-y-1.5">
                  <div className="p-1.5 rounded bg-[#CFAB8D] text-white text-xs font-medium">
                    Current Chat
                  </div>
                  <div className="p-1.5 rounded hover:bg-gray-100 cursor-pointer">
                    <p className="text-xs text-gray-600 truncate">Latest in AI trends</p>
                  </div>
                  <div className="p-1.5 rounded hover:bg-gray-100 cursor-pointer">
                    <p className="text-xs text-gray-600 truncate">Climate change views</p>
                  </div>
                </div>
              </div>
              
              {/* Main Chat */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                  {/* Bot Message */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#CFAB8D] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaGlobeAmericas className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl max-w-xs text-sm">
                      <p>Hello! I'm PerspectiveX, your AI assistant. What would you like to know?</p>
                    </div>
                  </div>
                  
                  {/* User Message */}
                  <div className="flex items-start gap-2 mb-3 justify-end">
                    <div className="bg-[#CFAB8D] text-white p-2 rounded-xl max-w-xs text-sm">
                      <p>Latest in renewable energy?</p>
                    </div>
                  </div>
                  
                  {/* Bot Response */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#CFAB8D] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaGlobeAmericas className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl max-w-xs text-sm">
                      <p className="font-medium text-[#1A535C] text-xs">🌍 Global Overview</p>
                      <p className="text-xs">Renewable energy grew 10% in 2023.</p>
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="p-2 border-t border-gray-100 bg-white">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      className="w-full p-2 pr-8 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#1A535C] focus:border-transparent"
                      disabled
                    />
                    <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400" disabled>
                      <FaPaperPlane className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-3">Ready to explore more perspectives?</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-[#CFAB8D] text-white rounded-lg text-sm font-medium hover:bg-[#15434a] transition-colors shadow"
              >
                Get Started with PerspectiveX
              </motion.button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;