import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane, FaGlobeAmericas } from 'react-icons/fa';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const container = useRef();

  useGSAP(() => {
    const sections = gsap.utils.toArray('.animated-section');
    sections.forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.2,
        ease: 'power3.out',
      });
    });
  }, { scope: container });

  const handleSubscribe = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  return (
    <div className="bg-[#ECEEDF] text-[#2D2D2D]" ref={container}>
      <header className="w-full py-4 bg-[#ECEEDF] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-center">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-2 rounded-xl bg-[#CFAB8D] text-white"
              >
                <FaGlobeAmericas className="w-5 h-5" />
              </motion.div>
              <span className="text-2xl font-bold text-[#2D2D2D] tracking-tight font-sans">
                PerspectiveX
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div
              className="bg-white/50 rounded-2xl p-8 border border-black/10 animated-section h-full"
            >
              <h2 className="text-3xl font-bold mb-4 text-[#2D2D2D]">
                Our Vision
              </h2>
              <p className="text-lg leading-relaxed text-[#2D2D2D]">
                At PerspectiveX, our vision is to create a more informed and empathetic world. We believe that by providing access to diverse perspectives on global events, we can empower individuals to break free from echo chambers and develop a more nuanced understanding of the world around them. Our platform is designed to be a tool for discovery, critical thinking, and connection.
              </p>
            </div>

            <div
              className="bg-white/50 rounded-2xl p-8 border border-black/10 animated-section h-full"
            >
              <h2 className="text-3xl font-bold mb-4 text-[#2D2D2D]">Why We Started</h2>
              <div className="space-y-4 text-lg text-[#2D2D2D]">
                <p>
                  In an increasingly polarized world, it's easy to get trapped in a single narrative. The news we consume is often tailored to our existing beliefs, reinforcing biases and limiting our exposure to different viewpoints. This creates a fragmented understanding of global events and hinders our ability to connect with people from other cultures and backgrounds.
                </p>
                <p>
                  We started PerspectiveX to challenge this trend. We wanted to create a platform that would make it easy for anyone to explore how the same event is reported in different countries, by different news organizations, with different cultural contexts. We believe that this is essential for fostering a more informed and empathetic global community.
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-[#CFAB8D]/20 rounded-2xl p-8 text-center animated-section mt-16"
          >
            <h2 className="text-3xl font-bold mb-4 text-[#2D2D2D]">
              Subscribe to Our Newsletter
            </h2>
            <p className="max-w-2xl mx-auto mb-6 text-[#2D2D2D]">
              Stay up-to-date with the latest trends in global news and get curated stories from around the world delivered straight to your inbox.
            </p>

            {submitSuccess ? (
              <div className="text-green-700 font-medium">
                <p>Thank you for subscribing! You'll hear from us soon.</p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubscribe} 
                className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4"
              >
                <div className="relative flex-grow">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CFAB8D] focus:border-transparent outline-none transition-all"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-[#CFAB8D] text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-opacity-90 disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
                  {!isSubmitting && <FaPaperPlane className="w-3.5 h-3.5" />}
                </motion.button>
              </form>
            )}
          </div>
        </div>
        <footer className="text-center py-6 mt-12 text-gray-500 animated-section">
          <p>&copy; {new Date().getFullYear()} PerspectiveX. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
