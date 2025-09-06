import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRailwaySegments } from '../data/mock';

const TrainMap = ({ trains, onTrainSelect, selectedTrain }) => {
  const [hoveredTrain, setHoveredTrain] = useState(null);
  const [timelinePosition, setTimelinePosition] = useState(1);
  const svgRef = useRef();

  // Calculate train positions along their segments
  const getTrainPosition = (train) => {
    const segment = mockRailwaySegments.find(s => s.id === train.segment);
    if (!segment) return { x: 0, y: 0 };

    // Parse the SVG path to get position based on progress
    const progress = train.progress;
    const pathLength = 400; // Approximate path length
    const x = segment.stations[0].x + (segment.stations[1].x - segment.stations[0].x) * progress;
    const y = segment.stations[0].y + (segment.stations[1].y - segment.stations[0].y) * progress;
    
    return { x, y };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return '#00D1B2';
      case 'delayed': return '#FF6B6B';
      case 'ahead': return '#4ECDC4';
      case 'stopped': return '#FFB86B';
      default: return '#00D1B2';
    }
  };

  const TrainTooltip = ({ train, position }) => (
    <motion.div
      className="absolute z-50 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 pointer-events-none"
      style={{
        left: position.x + 20,
        top: position.y - 10,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.12 }}
    >
      <div className="text-white text-sm space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold">Train {train.trainId}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium`} style={{ 
            backgroundColor: `${getStatusColor(train.status)}20`,
            color: getStatusColor(train.status)
          }}>
            {train.status}
          </span>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>{train.origin} → {train.destination}</div>
          <div>Speed: {train.speed} km/h</div>
          <div>ETA: {new Date(train.eta).toLocaleTimeString()}</div>
          {train.delay !== 0 && (
            <div className={train.delay > 0 ? 'text-red-400' : 'text-green-400'}>
              {train.delay > 0 ? '+' : ''}{train.delay} min
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Railway Network</h2>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>Stopped</span>
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative h-80 bg-black/30 rounded-lg border border-white/5">
        <svg
          ref={svgRef}
          viewBox="0 0 500 300"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 209, 178, 0.1))' }}
        >
          {/* Railway Segments */}
          {mockRailwaySegments.map((segment) => (
            <g key={segment.id}>
              {/* Track Path */}
              <path
                d={segment.path}
                stroke="url(#trackGradient)"
                strokeWidth="3"
                fill="none"
                className="opacity-60"
              />
              
              {/* Stations */}
              {segment.stations.map((station, idx) => (
                <g key={`${segment.id}-${idx}`}>
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#00D1B2"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={station.x}
                    y={station.y - 10}
                    textAnchor="middle"
                    className="fill-white text-xs font-medium"
                    style={{ fontSize: '10px' }}
                  >
                    {station.name}
                  </text>
                </g>
              ))}
            </g>
          ))}

          {/* Trains */}
          {trains.map((train) => {
            const position = getTrainPosition(train);
            const isSelected = selectedTrain?.trainId === train.trainId;
            
            return (
              <motion.g
                key={train.trainId}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Train Marker */}
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r={isSelected ? "8" : "6"}
                  fill={getStatusColor(train.status)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer"
                  style={{
                    filter: `drop-shadow(0 0 ${isSelected ? '12px' : '8px'} ${getStatusColor(train.status)}40)`,
                  }}
                  onClick={() => onTrainSelect(train)}
                  onMouseEnter={() => setHoveredTrain(train)}
                  onMouseLeave={() => setHoveredTrain(null)}
                  animate={isSelected ? {
                    scale: [1, 1.2, 1],
                    transition: { duration: 1.6, repeat: Infinity }
                  } : {}}
                  whileHover={{ scale: 1.2 }}
                />
                
                {/* Train ID Label */}
                <text
                  x={position.x}
                  y={position.y + 20}
                  textAnchor="middle"
                  className="fill-white text-xs font-bold pointer-events-none"
                  style={{ fontSize: '8px' }}
                >
                  {train.trainId}
                </text>

                {/* Direction Indicator */}
                {train.speed > 0 && (
                  <motion.path
                    d={`M ${position.x - 10} ${position.y} L ${position.x - 15} ${position.y - 3} L ${position.x - 15} ${position.y + 3} Z`}
                    fill={getStatusColor(train.status)}
                    className="opacity-70"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* SVG Gradients */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D1B2" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Train Tooltip */}
        <AnimatePresence>
          {hoveredTrain && (
            <TrainTooltip
              train={hoveredTrain}
              position={getTrainPosition(hoveredTrain)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Scrub Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Timeline Control</span>
          <span>Live</span>
        </div>
        <div className="relative">
          <div className="w-full h-2 bg-white/10 rounded-full">
            <motion.div
              className="h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
              style={{ width: `${timelinePosition * 100}%` }}
              animate={{ width: `${timelinePosition * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={timelinePosition}
            onChange={(e) => setTimelinePosition(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainMap;