import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

interface LoadingAnimationProps {
  progress: number;
}

const LoadingAnimation = ({ progress }: LoadingAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
    >
      <div className="space-y-6">
        {/* Animated Brain Icon */}
        <motion.div
          className="relative mx-auto w-20 h-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Brain className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          
          {/* Pulsing rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-blue-300 dark:border-blue-600 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Status Text */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing EEG Signal Using AI Model
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Processing neural patterns with CNN-BiLSTM architecture...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Upload Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3">
          {[
            { step: 'Uploading file', icon: Zap },
            { step: 'Preprocessing signals', icon: Brain },
            { step: 'Running AI analysis', icon: Brain },
            { step: 'Generating explanations', icon: Brain },
          ].map(({ step, icon: Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300"
            >
              <motion.div
                animate={progress > (index + 1) * 25 ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
                className={`p-1 rounded-full ${
                  progress > (index + 1) * 25
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${
                  progress > (index + 1) * 25
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`} />
              </motion.div>
              <span className={progress > (index + 1) * 25 ? 'text-green-600 dark:text-green-400' : ''}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;