import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

const ToastNotification = ({ notifications, onDismiss }) => {
  const getToastIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'delay': return Clock;
      default: return Info;
    }
  };

  const getToastColors = (type) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'warning': return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'info': return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
      case 'delay': return 'border-red-500/30 bg-red-500/10 text-red-400';
      default: return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const IconComponent = getToastIcon(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              className={`backdrop-blur-xl border rounded-lg p-4 ${getToastColors(notification.type)}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              layout
            >
              <div className="flex items-start space-x-3">
                <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">
                    {notification.title}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {notification.message}
                  </div>
                  {notification.trainId && (
                    <div className="text-xs mt-2 opacity-70">
                      Train {notification.trainId}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;