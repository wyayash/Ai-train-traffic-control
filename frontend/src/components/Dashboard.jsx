import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import KPIColumn from './KPIStat';
import TrainMap from './TrainMap';
import ScheduleList from './ScheduleList';
import ChartThroughput from './ChartThroughput';
import DelayHeatmap from './DelayHeatmap';
import SimulationModal from './SimulationModal';
import ToastNotification from './ToastNotification';
import { mockTrains, mockKPIs, mockThroughputData, mockDelayHeatmap, mockWS } from '../data/mock';

const Dashboard = () => {
  const [trains, setTrains] = useState(mockTrains);
  const [kpis, setKPIs] = useState(mockKPIs);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to mock WebSocket
    mockWS.connect();
    
    const handleWebSocketMessage = (message) => {
      if (message.type === 'positions') {
        setTrains(message.payload);
        
        // Generate notifications for delayed trains
        const delayedTrains = message.payload.filter(train => train.delay > 10);
        delayedTrains.forEach(train => {
          if (Math.random() > 0.8) { // 20% chance to generate notification
            addNotification({
              type: 'delay',
              title: 'Delay Alert',
              message: `Predicted delay: ${train.delay} minutes`,
              trainId: train.trainId
            });
          }
        });
      }
    };

    mockWS.addListener(handleWebSocketMessage);

    // Add initial welcome notification
    setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'System Online',
        message: 'AI Train Traffic Control system is monitoring 5 active trains'
      });
    }, 2000);

    return () => {
      mockWS.removeListener(handleWebSocketMessage);
      mockWS.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now() + Math.random(),
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
  };

  const handleHold = (train) => {
    addNotification({
      type: 'warning',
      title: 'Train Hold Initiated',
      message: `Train ${train.trainId} will be held at current position`,
      trainId: train.trainId
    });
  };

  const handleReroute = (train) => {
    setSelectedTrain(train);
    setIsSimulationOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <motion.div
        className="container mx-auto px-6 py-6 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6 h-screen-minus-header">
          {/* Left Column - KPI Cards */}
          <motion.div className="col-span-2" variants={itemVariants}>
            <KPIColumn kpis={kpis} />
          </motion.div>

          {/* Center Column - Train Map */}
          <motion.div className="col-span-6" variants={itemVariants}>
            <TrainMap
              trains={trains}
              onTrainSelect={handleTrainSelect}
              selectedTrain={selectedTrain}
            />
          </motion.div>

          {/* Right Column - Schedule List */}
          <motion.div className="col-span-4" variants={itemVariants}>
            <ScheduleList
              trains={trains}
              onHold={handleHold}
              onReroute={handleReroute}
              onSimulationOpen={() => setIsSimulationOpen(true)}
            />
          </motion.div>
        </div>

        {/* Bottom Charts Row */}
        <motion.div
          className="grid grid-cols-2 gap-6 mt-6"
          variants={itemVariants}
        >
          <ChartThroughput data={mockThroughputData} />
          <DelayHeatmap data={mockDelayHeatmap} />
        </motion.div>
      </motion.div>

      {/* Modals and Notifications */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        selectedTrain={selectedTrain}
      />

      <ToastNotification
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <style jsx global>{`
        .h-screen-minus-header {
          height: calc(100vh - 8rem);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00E5FF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00E5FF;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;