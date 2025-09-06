import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const SimulationModal = ({ isOpen, onClose, selectedTrain }) => {
  const [selectedScenario, setSelectedScenario] = useState('hold');
  const [scenarioParams, setScenarioParams] = useState({
    holdDuration: 10,
    rerouteSegment: 'S2',
    priorityLevel: 2
  });

  const scenarios = [
    {
      id: 'hold',
      name: 'Hold Train',
      description: 'Temporarily stop the train at current position',
      icon: Play,
      color: 'orange'
    },
    {
      id: 'reroute',
      name: 'Reroute',
      description: 'Change train path to alternative segment',
      icon: RotateCcw,
      color: 'violet'
    },
    {
      id: 'priority',
      name: 'Priority Change',
      description: 'Adjust train priority level',
      icon: TrendingUp,
      color: 'cyan'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
      violet: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
      cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
    };
    return colors[color] || colors.cyan;
  };

  const calculateImpact = () => {
    switch (selectedScenario) {
      case 'hold':
        return {
          delayChange: +scenarioParams.holdDuration,
          throughputImpact: -8,
          affectedTrains: 3
        };
      case 'reroute':
        return {
          delayChange: -5,
          throughputImpact: +12,
          affectedTrains: 1
        };
      case 'priority':
        return {
          delayChange: scenarioParams.priorityLevel < 2 ? -8 : +3,
          throughputImpact: scenarioParams.priorityLevel < 2 ? +15 : -5,
          affectedTrains: 2
        };
      default:
        return { delayChange: 0, throughputImpact: 0, affectedTrains: 0 };
    }
  };

  const impact = calculateImpact();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">What-if Simulation</h2>
              {selectedTrain && (
                <p className="text-gray-400 mt-1">Train {selectedTrain.trainId} - {selectedTrain.origin} → {selectedTrain.destination}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            {/* Scenario Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Select Scenario</h3>
              <div className="grid grid-cols-3 gap-4">
                {scenarios.map((scenario) => {
                  const IconComponent = scenario.icon;
                  const isSelected = selectedScenario === scenario.id;
                  
                  return (
                    <motion.button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? getColorClasses(scenario.color)
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">{scenario.name}</div>
                      <div className="text-xs opacity-70 mt-1">{scenario.description}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Parameters */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Parameters</h3>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                {selectedScenario === 'hold' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hold Duration (minutes)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={scenarioParams.holdDuration}
                      onChange={(e) => setScenarioParams(prev => ({ ...prev, holdDuration: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 min</span>
                      <span className="text-orange-400 font-medium">{scenarioParams.holdDuration} min</span>
                      <span>30 min</span>
                    </div>
                  </div>
                )}

                {selectedScenario === 'reroute' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Alternative Segment
                    </label>
                    <select
                      value={scenarioParams.rerouteSegment}
                      onChange={(e) => setScenarioParams(prev => ({ ...prev, rerouteSegment: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-400"
                    >
                      <option value="S1">Segment S1 - New Delhi - Gurgaon</option>
                      <option value="S2">Segment S2 - Faridabad - Noida</option>
                      <option value="S3">Segment S3 - Ghaziabad - Dwarka</option>
                      <option value="S4">Segment S4 - Rohini - Badarpur</option>
                      <option value="S5">Segment S5 - Janakpuri - Lajpat Nagar</option>
                    </select>
                  </div>
                )}

                {selectedScenario === 'priority' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority Level
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((level) => (
                        <button
                          key={level}
                          onClick={() => setScenarioParams(prev => ({ ...prev, priorityLevel: level }))}
                          className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                            scenarioParams.priorityLevel === level
                              ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          Level {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Predicted Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Delay Change</span>
                    {impact.delayChange > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className={`text-xl font-bold ${impact.delayChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {impact.delayChange > 0 ? '+' : ''}{impact.delayChange} min
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Throughput</span>
                    {impact.throughputImpact > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className={`text-xl font-bold ${impact.throughputImpact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {impact.throughputImpact > 0 ? '+' : ''}{impact.throughputImpact}%
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Affected Trains</span>
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-xl font-bold text-orange-400">
                    {impact.affectedTrains}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Scenario
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimulationModal;