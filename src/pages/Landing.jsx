import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaArrowRight, FaSearch, FaNewspaper, FaChartLine, FaUsers, FaClock, FaEye, FaBars, FaTimes, FaGoogle } from 'react-icons/fa';
import { signInWithGoogle, sendSignInLink, isSignInLinkUrl, completeSignInWithEmailLink } from '../firebase/firebase';
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
  const container = useRef();
  const heroRef = useRef();
  const dashboardRef = useRef();
  const footerRef = useRef();

  // GSAP Animations
  useGSAP(() => {
    // Hero section animation
    gsap.from(heroRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Logo animation
    gsap.from('.logo', {
      y: -50,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'back.out(1.7)',
    });

    // Menu button animation
    gsap.from('.menu-button', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out',
    });

    // Dashboard section animations
    const dashboardItems = gsap.utils.toArray('.dashboard-item');
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

    // Footer animation
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

    // Text animation for hero section
    gsap.to('.hero-text', {
      backgroundPosition: '200% 0%',
      duration: 10,
      ease: 'linear',
      repeat: -1,
    });
  }, { scope: container });

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
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to access your account</p>
                  </div>
                  
                  {showEmailSent ? (
                    <div className="text-center space-y-4">
                      <div className="text-green-600 bg-green-50 p-4 rounded-lg">
                        <p>We've sent a sign-in link to your email.</p>
                        <p className="font-medium">{email}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Check your email and click the link to sign in.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmailSent(false);
                          setEmail('');
                        }}
                        className="mt-4 text-[#CFAB8D] hover:underline"
                      >
                        Back to sign in
                      </button>
                    </div>
                  ) : (
                    <>
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

                        {error && (
                          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                            {error}
                          </div>
                        )}
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
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#CFAB8D] text-white rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 hover:bg-opacity-90"
              >
                <span>Get Started</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
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
      <section className="py-16 bg-[#ECEEDF]" ref={dashboardRef}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">Experience the Dashboard</h2>
            <div className="w-20 h-1 bg-[#CFAB8D] mx-auto rounded-full"></div>
          </div>
          
          {/* Dashboard Preview Container */}
          <div className="bg-[#ECEEDF] rounded-2xl p-6 border border-[#CFAB8D] border-opacity-30">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6 p-4 bg-[#ECEEDF] rounded-lg border border-[#CFAB8D] border-opacity-30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#CFAB8D] flex items-center justify-center">
                  <FaChartLine className="text-white w-4 h-4" />
                </div>
                <span className="font-semibold text-[#2D2D2D]">Dashboard</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm rounded-md bg-[#ECEEDF] text-[#2D2D2D]">Day</button>
                <button className="px-3 py-1 text-sm rounded-md bg-[#CFAB8D] text-white">Week</button>
                <button className="px-3 py-1 text-sm rounded-md bg-[#ECEEDF] text-[#2D2D2D]">Month</button>
              </div>
            </div>
            
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Stats Cards */}
              <div className="bg-[#ECEEDF] p-6 rounded-xl border border-[#CFAB8D] border-opacity-30 dashboard-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">24,531</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <span>↑ 12% from last week</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#ECEEDF]">
                    <FaEye className="text-[#CFAB8D] w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#ECEEDF] p-6 rounded-xl border border-[#CFAB8D] border-opacity-30 dashboard-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">68%</p>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <span>↑ 5% from last week</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#ECEEDF]">
                    <FaUsers className="text-[#CFAB8D] w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="bg-[#ECEEDF] p-6 rounded-xl border border-[#CFAB8D] border-opacity-30 dashboard-item">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Time</p>
                    <p className="text-2xl font-bold text-[#2D2D2D]">4m 23s</p>
                    <p className="text-xs text-red-500 flex items-center mt-1">
                      <span>↓ 2% from last week</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#ECEEDF]">
                    <FaClock className="text-[#CFAB8D] w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="bg-[#ECEEDF] p-6 rounded-xl border border-[#CFAB8D] border-opacity-30 h-64 flex items-center justify-center dashboard-item">
              <div className="text-center">
                <FaChartLine className="w-10 h-10 text-[#CFAB8D] mx-auto mb-3 opacity-40" />
                <p className="text-gray-400">Interactive analytics chart</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#CFAB8D] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                Explore Full Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
