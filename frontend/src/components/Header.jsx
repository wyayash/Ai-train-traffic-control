import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Settings, Bell } from 'lucide-react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.header
      className="w-full h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between relative z-50"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left - Logo & Title */}
      <motion.div className="flex items-center space-x-4" variants={itemVariants}>
        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">C</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Codex</h1>
          <p className="text-xs text-gray-400">Section Throughput — Live</p>
        </div>
      </motion.div>

      {/* Center - Live Clock */}
      <motion.div
        className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10"
        variants={itemVariants}
      >
        <Clock className="w-4 h-4 text-teal-400" />
        <div className="text-center">
          <div className="text-sm font-mono text-white">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              timeZone: 'Asia/Kolkata'
            })}
          </div>
          <div className="text-xs text-gray-400">IST</div>
        </div>
      </motion.div>

      {/* Right - User Actions */}
      <motion.div className="flex items-center space-x-3" variants={itemVariants}>
        <motion.button
          className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-gray-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </motion.button>
        
        <motion.button
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5 text-gray-300" />
        </motion.button>

        <motion.div
          className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-white font-medium">Admin</span>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;