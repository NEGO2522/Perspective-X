import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaArrowRight, FaSearch, FaNewspaper, FaChartLine, FaUsers, FaClock, FaEye, FaBars, FaTimes, FaGoogle, FaPaperPlane, FaPlus, FaCommentDots } from 'react-icons/fa';
import { signInWithGoogle, signOutUser, sendSignInLink, isSignInLinkUrl, completeSignInWithEmailLink } from '../firebase/firebase';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Landing = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const container = useRef();
  const heroRef = useRef();
  const dashboardRef = useRef();

  // GSAP Animations
  useGSAP(() => {
    gsap.from(heroRef.current, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.logo', { y: -50, opacity: 0, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)' });
    gsap.from('.menu-button', { x: 50, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.to('.hero-text', { backgroundPosition: '200% 0%', duration: 10, ease: 'linear', repeat: -1 });

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

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOutUser();
      setIsMenuOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Check for email sign-in link on component mount
  useEffect(() => {
    if (isSignInLinkUrl(window.location.href)) {
      const emailFromStorage = window.localStorage.getItem('emailForSignIn');
      if (emailFromStorage) {
        completeSignInWithEmailLink(emailFromStorage, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.location.href = '/';
          })
          .catch((err) => setError(err.message));
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#ECEEDF] text-[#2D2D2D]" ref={container}>
      {/* Navigation */}
      <nav className="w-full py-4 bg-[#ECEEDF] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 logo">
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-2 rounded-xl bg-[#CFAB8D] text-white">
                <FaGlobeAmericas className="w-5 h-5" />
              </motion.div>
              <span className="text-2xl font-bold text-[#2D2D2D] tracking-tight font-sans">PerspectiveX</span>
            </div>
            <div className="relative menu-button">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-lg bg-[#CFAB8D] text-white hover:bg-opacity-90 transition-all focus:outline-none relative z-50 shadow-md" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
              {isMenuOpen && <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />}
              <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                  {user ? (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">You are logged in</h2>
                      <p className="text-gray-500 mb-6">You can now access the dashboard.</p>
                      <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Logout</button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-8"><h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Welcome Back</h2><p className="text-gray-500">Sign in to access your account</p></div>
                      {showEmailSent ? (
                        <div className="text-center space-y-4">
                          <div className="text-green-600 bg-green-50 p-4 rounded-lg"><p>We've sent a sign-in link to your email.</p><p className="font-medium">{email}</p></div>
                          <p className="text-sm text-gray-500">Check your email and click the link to sign in.</p>
                          <button type="button" onClick={() => { setShowEmailSent(false); setEmail(''); }} className="mt-4 text-[#CFAB8D] hover:underline">Back to sign in</button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAB8D]"><FaGoogle className="text-red-500" />Continue with Google</button>
                          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with email</span></div></div>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="email" placeholder="Email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CFAB8D] focus:border-transparent outline-none transition-all" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                            <button type="submit" disabled={isLoading} className="w-full bg-[#CFAB8D] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAB8D] disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Sending link...' : 'Get sign-in link'}</button>
                          </form>
                          {error && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{error}</div>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 mt-16" ref={heroRef}>
        <div className="max-w-4xl mx-auto text-center overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: .1 }} className="mb-6 inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#CFAB8D] text-white">The Future of News Consumption</motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#2D2D2D] leading-tight">
            <span className="hero-text bg-clip-text text-transparent bg-gradient-to-r from-[#2D2D2D] via-[#CFAB8D] to-[#2D2D2D] bg-[length:200%_auto] inline-block">Discover News from <span className="block mt-2">Every Angle</span></span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-[#2D2D2D]">Break free from the single-narrative trap. Discover how different cultures and regions report the same global events through our comprehensive news analysis platform.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-[#CFAB8D] text-white rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 hover:bg-opacity-90"><span>Get Started</span><FaArrowRight className="w-3.5 h-3.5" /></motion.button></Link>
            <Link to="/about"><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 rounded-lg font-medium border border-[#CFAB8D] text-[#2D2D2D] hover:bg-[#CFAB8D] hover:bg-opacity-10 transition-all">About Us</motion.button></Link>
          </motion.div>
        </div>
      </main>

      {/* Dashboard Preview */}
      <section className="py-16 bg-[#ECEEDF] dashboard-item" ref={dashboardRef}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">Experience the Dashboard</h2>
            <div className="w-20 h-1 bg-[#CFAB8D] mx-auto rounded-full"></div>
          </div>
          <div className="bg-[#F0F2F5] rounded-2xl p-4 border border-gray-300 shadow-2xl flex h-[600px] gap-4 overflow-hidden">
            {/* Sidebar Preview */}
            <div className="w-72 bg-black/10 backdrop-blur-xl p-6 rounded-2xl flex-col hidden sm:flex dashboard-item">
              <div className="flex items-center justify-between mb-10"><h2 className="text-xl font-bold text-gray-800">Chat History</h2></div>
              <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/80 shadow-lg"><FaCommentDots className="w-5 h-5 text-[#CFAB8D]" /><span className="flex-1 text-sm font-medium text-gray-900">Active Chat</span></div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50"><FaCommentDots className="w-5 h-5 text-gray-600" /><span className="flex-1 text-sm font-medium text-gray-700">How news covers climate...</span></div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50"><FaCommentDots className="w-5 h-5 text-gray-600" /><span className="flex-1 text-sm font-medium text-gray-700">Global election insights</span></div>
              </div>
              <button className="mt-8 w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md text-gray-800 py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"><FaPlus className="w-5 h-5 text-[#CFAB8D]" />New Chat</button>
            </div>

            {/* Main Content Preview */}
            <div className="flex-1 flex flex-col bg-transparent dashboard-item">
              <header className="w-full z-20 p-4 flex-shrink-0">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-2xl bg-white shadow-md text-[#CFAB8D]"><FaGlobeAmericas className="w-5 h-5" /></div>
                    <span className="text-2xl font-bold text-gray-800 tracking-tight font-sans hidden md:inline">PerspectiveX</span>
                  </div>
                  <div className="relative"><button className="p-3 rounded-lg bg-white/70 backdrop-blur-sm text-[#2D2D2D] hover:bg-white transition-all focus:outline-none relative z-10 shadow-md flex items-center justify-center"><FaBars className="w-5 h-5" /></button></div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-start gap-4 justify-end">
                        <div className="p-5 rounded-2xl max-w-2xl shadow-sm bg-white">
                            <div className="text-base text-gray-700 leading-relaxed">Compare the latest news about the US election from CNN and Fox News.</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 justify-start">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-inner"><FaGlobeAmericas className="w-6 h-6 text-[#CFAB8D]" /></div>
                        <div className="p-5 rounded-2xl max-w-2xl shadow-sm bg-white animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
              </main>

              <footer className="w-full z-10 p-4 flex-shrink-0 bg-transparent">
                <div className="w-full max-w-5xl mx-auto">
                  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 border-black/5 shadow-xl flex items-center gap-2">
                    <textarea placeholder="Ask PerspectiveX anything..." className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-base placeholder-gray-500 max-h-48 overflow-y-auto" rows="1" readOnly />
                    <button className="w-12 h-12 bg-[#CFAB8D] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#CFAB8D]/40"><FaPaperPlane className="w-5 h-5" /></button>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;