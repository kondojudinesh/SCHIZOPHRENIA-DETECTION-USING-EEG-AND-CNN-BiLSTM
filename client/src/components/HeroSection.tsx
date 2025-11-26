import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, TrendingUp, Clock, Users, Target } from 'lucide-react';
import BrainwaveAnimation from './BrainwaveAnimation';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced CNN-BiLSTM neural networks'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant EEG signal analysis'
    },
    {
      icon: Shield,
      title: 'Medical Grade',
      description: 'Clinical-level accuracy & reliability'
    },
    {
      icon: TrendingUp,
      title: 'Early Detection',
      description: 'Identify patterns before symptoms'
    }
  ];

  const stats = [
    {
      icon: Target,
      label: 'Model Accuracy',
      value: '90.7%'
    },
    {
      icon: Clock,
      label: 'Analysis Time',
      value: '< 30s'
    },
    {
      icon: Users,
      label: 'Patients Analyzed',
      value: '10,000+'
    }
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <BrainwaveAnimation />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 flex-1 flex flex-col justify-center">
        <div className="text-center">
          {/* Animated Brain Icon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 mt-8" // ✅ added margin-top so it moves down
          >
            {/* Central Brain Symbol */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 20px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Brain className="h-16 w-16 text-white" />
                </motion.div>
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: `${40 + i * 10}px 0px`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              AI-Powered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Schizophrenia
              </span>{' '}
              Detection Tool
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Analyze EEG brain signals using deep learning and get early predictions 
              with visual explanations and comprehensive medical insights.
            </p>

            {/* CTA Button → Navigates to Analysis page */}
            <motion.button
              onClick={() => onNavigate("analysis")} // ✅ added navigation
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Start Analysis</span>
              <Zap className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/50"
                whileHover={{ 
                  scale: 1.05,
                }}
              >
                <feature.icon className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-12 border-t border-gray-200/20 dark:border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-flex p-4 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm mb-4">
                  <stat.icon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
