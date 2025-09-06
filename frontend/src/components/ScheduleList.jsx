import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, Play, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

const ScheduleCard = ({ train, onHold, onReroute, expanded, onToggleExpand }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'delayed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ahead': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'stopped': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-200"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(train.priority)}`}></div>
          <span className="text-white font-bold text-lg">Train {train.trainId}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(train.status)}`}>
            {train.status}
          </span>
        </div>
        
        <motion.button
          onClick={onToggleExpand}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </motion.button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>{train.origin} → {train.destination}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>ETA: {new Date(train.eta).toLocaleTimeString()}</span>
          </div>
          {train.delay !== 0 && (
            <div className={`flex items-center space-x-1 ${train.delay > 0 ? 'text-red-400' : 'text-green-400'}`}>
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">{train.delay > 0 ? '+' : ''}{train.delay}min</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(train.progress * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${train.progress * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-white ml-2">{train.speed} km/h</span>
                </div>
                <div>
                  <span className="text-gray-400">Segment:</span>
                  <span className="text-white ml-2">{train.segment}</span>
                </div>
                <div>
                  <span className="text-gray-400">Priority:</span>
                  <span className="text-white ml-2">Level {train.priority}</span>
                </div>
                <div>
                  <span className="text-gray-400">Next Stop:</span>
                  <span className="text-white ml-2">{train.destination}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <motion.button
          onClick={() => onHold(train)}
          className="flex-1 flex items-center justify-center space-x-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg py-2 px-3 transition-colors text-sm"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Play className="w-4 h-4" />
          <span>Hold</span>
        </motion.button>
        
        <motion.button
          onClick={() => onReroute(train)}
          className="flex-1 flex items-center justify-center space-x-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30 rounded-lg py-2 px-3 transition-colors text-sm"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reroute</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const ScheduleList = ({ trains, onHold, onReroute, onSimulationOpen }) => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (trainId) => {
    setExpandedCards(prev => ({
      ...prev,
      [trainId]: !prev[trainId]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sortedTrains = [...trains].sort((a, b) => {
    // Sort by priority first, then by ETA
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.eta) - new Date(b.eta);
  });

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Schedule</h2>
        <motion.button
          onClick={onSimulationOpen}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-teal-600 hover:to-cyan-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Simulation
        </motion.button>
      </div>

      <motion.div
        className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {sortedTrains.map((train) => (
            <ScheduleCard
              key={train.trainId}
              train={train}
              onHold={onHold}
              onReroute={onReroute}
              expanded={expandedCards[train.trainId]}
              onToggleExpand={() => toggleExpand(train.trainId)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 209, 178, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 209, 178, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ScheduleList;