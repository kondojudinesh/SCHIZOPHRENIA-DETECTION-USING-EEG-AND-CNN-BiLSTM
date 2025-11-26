import React from 'react';
import { motion } from 'framer-motion';

const BrainwaveAnimation = () => {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Multiple brainwave lines */}
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0,${200 + i * 80} Q300,${150 + i * 80} 600,${200 + i * 80} T1200,${200 + i * 80}`}
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 0.6, 0.3, 0.8, 0.2],
            }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.2 },
              opacity: { 
                duration: 4, 
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BrainwaveAnimation;