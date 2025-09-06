# Codex — AI Train Traffic Control Dashboard

A cinematic, production-ready React dashboard for AI-powered train traffic monitoring and control. Built with modern web technologies and designed for real-time operational excellence.

![Dashboard Screenshot](file:///C:/Users/admin/Downloads/SIH/ai-train-traffic-control.pdf
)

## 🚀 Features

### Core Functionality
- **Real-time Train Monitoring**: Live tracking of 5+ trains with position updates
- **Interactive Railway Map**: Custom SVG schematic with animated train movements
- **KPI Dashboard**: Real-time throughput, delay metrics, and utilization tracking
- **Smart Scheduling**: Priority-based train list with ETA predictions
- **What-if Simulation**: Scenario planning with impact predictions
- **Intelligent Alerts**: Proactive notifications for delays and system events

### Visual Design
- **Cinematic Theme**: Dark gradient background with neon accent palette
- **Glassmorphism UI**: 8px rounded corners, 12px blur, subtle borders
- **Smooth Animations**: Framer Motion with spring physics (stiffness: 360, damping: 28)
- **Responsive Layout**: 3-column grid optimized for 1920px+ displays
- **Color Palette**: Teal (#00D1B2), Cyan (#00E5FF), Violet (#7C4DFF), Orange (#FFB86B)

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Framer Motion 12** - Advanced animations and transitions
- **D3.js 7** - Data visualization and interactive charts
- **Tailwind CSS 3** - Utility-first styling with custom design tokens
- **Lucide React** - Modern icon library (1000+ icons)

### Data & State
- **Mock WebSockets** - Simulated real-time data updates
- **React Hooks** - Modern state management
- **Custom Data Layer** - Structured mock data with realistic patterns

## 📦 Component Architecture

### Exportable Components

```javascript
// Core Dashboard Components
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import KPIColumn from './components/KPIStat';

// Map & Visualization
import TrainMap from './components/TrainMap';
import ChartThroughput from './components/ChartThroughput';
import DelayHeatmap from './components/DelayHeatmap';

// Interactive Components
import ScheduleList from './components/ScheduleList';
import SimulationModal from './components/SimulationModal';
import ToastNotification from './components/ToastNotification';
```

### Component Details

#### `TrainMap`
- **SVG-based railway schematic** with 5 segments
- **Animated train markers** with status-based colors
- **Interactive tooltips** on hover with train details
- **Timeline scrub control** for historical replay
- **Station markers** with labels

#### `KPIStat`
- **Animated counters** with spring physics
- **Progress indicators** for utilization metrics
- **Trend arrows** showing performance changes
- **Staggered entrance animations** (100ms, 200ms, 300ms delays)

#### `ScheduleList`
- **Priority-sorted train cards** with expandable details
- **Progress bars** showing journey completion
- **Action buttons** for Hold/Reroute operations
- **Real-time status updates** with color coding

#### `ChartThroughput`
- **D3.js line chart** with animated stroke drawing
- **Gradient area fill** with teal-to-cyan colors
- **Interactive tooltips** with hover effects
- **Responsive scaling** and grid lines

#### `DelayHeatmap`
- **Color-coded cells** showing delay intensity
- **Animated entrance** with staggered timing
- **Interactive tooltips** with segment/time details
- **Color legend** with scale indicators

#### `SimulationModal`
- **3-scenario selection**: Hold, Reroute, Priority Change
- **Parameter controls** with sliders and dropdowns
- **Impact prediction** showing delay/throughput changes
- **Modal animations** with backdrop blur

## 🎯 Key Interactions

### Train Operations
1. **Select Train**: Click any train marker on the map
2. **Hold Train**: Use Hold button in schedule cards
3. **Reroute Train**: Opens simulation modal for path planning
4. **Priority Management**: Adjust train priority levels

### Data Visualization
1. **Timeline Control**: Scrub bar for historical data replay
2. **Chart Tooltips**: Hover over data points for details
3. **Expandable Cards**: Click chevron to show/hide details
4. **Notification Management**: Auto-dismiss or manual close

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Modern browser with ES2020 support

### Installation
```bash
# Install dependencies
cd frontend
yarn install

# Start development server
yarn start

# Open http://localhost:3000
```

### Available Scripts
```bash
yarn start    # Development server with hot reload
yarn build    # Production build
yarn test     # Run test suite
```

## 📊 Mock Data Structure

### Train Data Format
```json
{
  "trainId": "502",
  "lat": 28.47,
  "lng": 77.03,
  "segment": "S1",
  "speed": 48,
  "eta": "2025-01-20T14:12:00Z",
  "status": "on-time|delayed|ahead|stopped",
  "priority": 1,
  "origin": "New Delhi",
  "destination": "Gurgaon",
  "progress": 0.65,
  "delay": 0
}
```

### WebSocket Message Format
```json
{
  "type": "positions",
  "payload": [/* array of train objects */],
  "ts": "2025-01-20T14:10:12Z"
}
```

## 🔄 Real-time Updates

The dashboard simulates real-time updates using:
1. **Mock WebSocket**: Updates every 3 seconds
2. **Data Randomization**: Realistic train movement patterns
3. **Notification System**: Smart alerts for delays
4. **State Synchronization**: Consistent data across components

---
