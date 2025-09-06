import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Activity } from 'lucide-react';

const KPIStat = ({ title, value, unit, icon: Icon, trend, color = "teal", delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = parseFloat(value);
      const duration = 1500;
      const increment = end / (duration / 16);

      const animate = () => {
        start += increment;
        if (start < end) {
          setAnimatedValue(Math.floor(start * 10) / 10);
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(end);
        }
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay / 1000,
        type: "spring",
        stiffness: 360,
        damping: 28
      }
    }
  };

  const colorClasses = {
    teal: "from-teal-400/20 to-teal-600/20 border-teal-400/30 text-teal-400",
    cyan: "from-cyan-400/20 to-cyan-600/20 border-cyan-400/30 text-cyan-400",
    violet: "from-violet-400/20 to-violet-600/20 border-violet-400/30 text-violet-400",
    orange: "from-orange-400/20 to-orange-600/20 border-orange-400/30 text-orange-400"
  };

  return (
    <motion.div
      className={`relative p-6 rounded-lg backdrop-blur-xl border bg-gradient-to-br ${colorClasses[color]} hover:scale-105 transition-transform duration-200`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-lg blur-xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[3]}`} />
          {trend && (
            <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-white font-mono">
              {animatedValue}
            </span>
            <span className="text-sm text-gray-400">{unit}</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
        </div>

        {/* Utilization Progress Bar for Utilization KPI */}
        {title.toLowerCase().includes('utilization') && (
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className={`h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${animatedValue}%` }}
                transition={{ duration: 1.5, delay: delay / 1000 + 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const KPIColumn = ({ kpis }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <KPIStat
        title="Throughput"
        value={kpis.throughput}
        unit="tr/hr"
        icon={Activity}
        trend={8.5}
        color="teal"
        delay={100}
      />
      <KPIStat
        title="Avg Delay"
        value={kpis.avgDelay}
        unit="mins"
        icon={Clock}
        trend={-12.3}
        color="orange"
        delay={200}
      />
      <KPIStat
        title="Utilization"
        value={kpis.utilization}
        unit="%"
        icon={TrendingUp}
        trend={5.7}
        color="violet"
        delay={300}
      />
    </motion.div>
  );
};

export default KPIColumn;