import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAmericas, FaArrowRight, FaBars, FaTimes, FaGoogle, FaInfoCircle } from 'react-icons/fa';
import { signInWithGoogle, signOutUser, sendSignInLink, isSignInLinkUrl, completeSignInWithEmailLink } from '../firebase/firebase';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Landing = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const container = useRef();

  useGSAP(() => {
    gsap.from('.hero-element', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 });
    gsap.from('.logo', { y: -50, opacity: 0, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)' });
    gsap.from('.nav-link', { y: -30, opacity: 0, duration: 0.6, delay: 0.5, stagger: 0.1, ease: 'power2.out' });
    gsap.from('.menu-button', { x: 50, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });

    gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }, { scope: container });

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

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithGoogle();
      setIsMenuOpen(false);
    } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setIsMenuOpen(false);
    } catch (err) { setError(err.message); }
  };

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
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans" ref={container}>
      {/* Navigation */}
      <nav className="w-full py-5 bg-[#F8F9FA]/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 logo">
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-2 rounded-xl bg-[#1A535C] text-white">
                <FaGlobeAmericas className="w-5 h-5" />
              </motion.div>
              <span className="text-2xl font-bold text-[#1A535C] tracking-tight">PerspectiveX</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/about" className="nav-link text-gray-600 hover:text-[#1A535C] transition-colors font-medium">About</Link>
            </div>
            <div className="relative menu-button">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-lg bg-[#1A535C] text-white hover:bg-opacity-90 transition-all focus:outline-none relative z-50 shadow-md" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
                {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)}>
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl p-8 z-50" onClick={e => e.stopPropagation()}>
                      {user ? (
                        <div className="text-center flex flex-col h-full">
                           <h2 className="text-2xl font-bold text-[#1A535C] mb-8">Menu</h2>
                           <div className="space-y-4">
                            <Link to="/about" className="flex items-center justify-center gap-3 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"><FaInfoCircle/>About Us</Link>
                           </div>
                           <div className="mt-auto">
                            <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all">Logout</button>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-center mb-8"><h2 className="text-2xl font-bold text-[#1A535C] mb-2">Get Started</h2><p className="text-gray-500">Access your account</p></div>
                          {showEmailSent ? (
                            <div className="text-center space-y-4"><div className="text-green-700 bg-green-100 p-4 rounded-lg"><p>Link sent to <span className="font-medium">{email}</span></p></div><button type="button" onClick={() => { setShowEmailSent(false); setEmail(''); }} className="mt-2 text-[#1A535C] hover:underline">Go Back</button></div>
                          ) : (
                            <div className="space-y-5">
                              <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"><FaGoogle className="text-red-500" />Continue with Google</button>
                              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or with Email</span></div></div>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="email" placeholder="Email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent outline-none" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                                <button type="submit" disabled={isLoading} className="w-full bg-[#1A535C] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-70">{isLoading ? 'Sending...' : 'Send Sign-in Link'}</button>
                              </form>
                              {error && <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded-lg">{error}</div>}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-4xl mx-auto text-center overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: .1 }} className="hero-element mb-6 inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#F7B32B] text-black">
            The Future of News Is Perspective
          </motion.div>
          <h1 className="hero-element text-5xl md:text-7xl font-extrabold mb-6 text-[#1A535C] leading-tight">
            See the World from<br/>Every Angle
          </h1>
          <p className="hero-element text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-gray-600">Our platform analyzes global news to show you how different countries report on the same events. Break free from the echo chamber and gain a richer understanding of the world.</p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="hero-element flex flex-wrap justify-center gap-4">
            <Link to="/dashboard"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-[#1A535C] text-white rounded-lg font-semibold flex items-center space-x-2 shadow-lg shadow-[#1A535C]/30"><span>Get Started</span><FaArrowRight className="w-4 h-4" /></motion.button></Link>
          </motion.div>
        </div>
      </main>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-white section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A535C] mb-4">A Glimpse Inside the Dashboard</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Effortlessly compare global narratives and uncover the full story. Here's a preview of the clarity you can expect.</p>
            <div className="w-24 h-1.5 bg-[#F7B32B] mx-auto rounded-full mt-6"></div>
          </div>
          <div className="bg-[#F0F2F5] rounded-2xl p-4 lg:p-6 border border-gray-200/80 shadow-2xl flex flex-col md:flex-row h-auto md:h-[600px] gap-4 overflow-hidden">
            {/* Fake Sidebar */}
            <div className="w-full md:w-72 bg-white/50 backdrop-blur-lg p-6 rounded-2xl flex-col hidden sm:flex border border-gray-200/80">
              <div className="flex items-center justify-between mb-8"><h2 className="text-xl font-bold text-[#1A535C]">Recent Topics</h2></div>
              <div className="flex-grow space-y-3">
                <div className="p-3 rounded-lg bg-white shadow-md border border-gray-200/80"><p className="font-semibold text-sm text-[#1A535C]">Global Economic Policy</p></div>
                <div className="p-3 rounded-lg hover:bg-white/80"><p className="font-medium text-sm text-gray-600">Climate Change Summit</p></div>
                <div className="p-3 rounded-lg hover:bg-white/80"><p className="font-medium text-sm text-gray-600">Tech Regulation in Europe</p></div>
              </div>
            </div>
            {/* Fake Main Content */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200/80 p-4">
              <div className="flex-1 overflow-y-auto pr-2">
                 <div className="p-4 rounded-lg mb-4 text-right"><p className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-xl">What's the global take on the latest tariff implementations?</p></div>
                 <div className="p-4 rounded-lg mb-4 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#1A535C] text-white flex items-center justify-center flex-shrink-0 mt-1"><FaGlobeAmericas/></div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200/80">
                      <p className="font-bold text-gray-700">Here is the global perspective on recent tariff implementations:</p>
                      <ul className="mt-3 space-y-2 text-gray-600">
                        <li><span className="font-semibold">USA:</span> Focuses on protecting domestic industries.</li>
                        <li><span className="font-semibold">China:</span> Views tariffs as a negotiation tactic and responds in kind.</li>
                        <li><span className="font-semibold">Germany:</span> Expresses concern for its export-oriented economy.</li>
                      </ul>
                    </div>
                 </div>
              </div>
              <div className="mt-auto flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <input type="text" placeholder="Ask PerspectiveX..." className="w-full bg-transparent p-2 focus:outline-none" readOnly/>
                <button className="w-10 h-10 bg-[#F7B32B] rounded-lg flex items-center justify-center text-black"><FaArrowRight/></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
