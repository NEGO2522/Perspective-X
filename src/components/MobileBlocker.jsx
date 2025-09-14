import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaDesktop, FaMobileAlt, FaArrowRight } from 'react-icons/fa';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
};

const MobileBlocker = ({ children }) => {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  // This ensures we don't render anything on the server
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (!isMobile) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <div className="relative p-6 bg-blue-600 rounded-full">
                <FaDesktop className="text-4xl text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Desktop Experience Required
          </h1>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Whoa there, digital explorer! 🌟<br />
            This experience is best enjoyed on a larger screen. The magic happens when you can see everything in all its glory!
          </p>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-8 border border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <FaMobileAlt className="text-2xl text-gray-400" />
              <FaArrowRight className="text-blue-400" />
              <FaDesktop className="text-2xl text-blue-400" />
            </div>
            <p className="mt-3 text-gray-300">
              Switch to your desktop for the full experience
            </p>
          </div>
          
          <p className="text-gray-400 text-sm">
            P.S. We promise it's worth the wait! Your future desktop self will thank you. 🚀
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileBlocker;
