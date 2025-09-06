// Mock data for Codex AI Train Traffic Control Dashboard

export const mockTrains = [
  {
    trainId: "502",
    lat: 28.47,
    lng: 77.03,
    segment: "S1",
    speed: 48,
    eta: "2025-01-20T14:12:00Z",
    status: "on-time",
    priority: 2,
    origin: "New Delhi",
    destination: "Gurgaon",
    progress: 0.65,
    delay: 0
  },
  {
    trainId: "728",
    lat: 28.49,
    lng: 77.05,
    segment: "S2",
    speed: 22,
    eta: "2025-01-20T14:35:00Z",
    status: "delayed",
    priority: 1,
    origin: "Faridabad",
    destination: "Noida",
    progress: 0.42,
    delay: 12
  },
  {
    trainId: "901",
    lat: 28.52,
    lng: 77.08,
    segment: "S3",
    speed: 55,
    eta: "2025-01-20T14:18:00Z",
    status: "on-time",
    priority: 3,
    origin: "Ghaziabad",
    destination: "Dwarka",
    progress: 0.78,
    delay: 0
  },
  {
    trainId: "345",
    lat: 28.44,
    lng: 77.01,
    segment: "S4",
    speed: 35,
    eta: "2025-01-20T14:45:00Z",
    status: "ahead",
    priority: 2,
    origin: "Rohini",
    destination: "Badarpur",
    progress: 0.23,
    delay: -5
  },
  {
    trainId: "667",
    lat: 28.46,
    lng: 77.07,
    segment: "S5",
    speed: 0,
    eta: "2025-01-20T15:02:00Z",
    status: "stopped",
    priority: 1,
    origin: "Janakpuri",
    destination: "Lajpat Nagar",
    progress: 0.89,
    delay: 18
  }
];

export const mockKPIs = {
  throughput: 124,
  avgDelay: 8.5,
  utilization: 78
};

export const mockThroughputData = [
  { time: "10:00", value: 95 },
  { time: "10:30", value: 108 },
  { time: "11:00", value: 118 },
  { time: "11:30", value: 124 },
  { time: "12:00", value: 135 },
  { time: "12:30", value: 142 },
  { time: "13:00", value: 128 },
  { time: "13:30", value: 115 },
  { time: "14:00", value: 124 }
];

export const mockDelayHeatmap = [
  { segment: "S1", hour: "10", delay: 2 },
  { segment: "S1", hour: "11", delay: 5 },
  { segment: "S1", hour: "12", delay: 8 },
  { segment: "S1", hour: "13", delay: 12 },
  { segment: "S1", hour: "14", delay: 6 },
  { segment: "S2", hour: "10", delay: 0 },
  { segment: "S2", hour: "11", delay: 3 },
  { segment: "S2", hour: "12", delay: 15 },
  { segment: "S2", hour: "13", delay: 18 },
  { segment: "S2", hour: "14", delay: 12 },
  { segment: "S3", hour: "10", delay: 1 },
  { segment: "S3", hour: "11", delay: 0 },
  { segment: "S3", hour: "12", delay: 4 },
  { segment: "S3", hour: "13", delay: 7 },
  { segment: "S3", hour: "14", delay: 2 },
  { segment: "S4", hour: "10", delay: 8 },
  { segment: "S4", hour: "11", delay: 12 },
  { segment: "S4", hour: "12", delay: 20 },
  { segment: "S4", hour: "13", delay: 15 },
  { segment: "S4", hour: "14", delay: 9 },
  { segment: "S5", hour: "10", delay: 5 },
  { segment: "S5", hour: "11", delay: 8 },
  { segment: "S5", hour: "12", delay: 22 },
  { segment: "S5", hour: "13", delay: 25 },
  { segment: "S5", hour: "14", delay: 18 }
];

export const mockRailwaySegments = [
  {
    id: "S1",
    name: "New Delhi - Gurgaon",
    path: "M 50 150 Q 200 100 350 150",
    stations: [
      { name: "New Delhi", x: 50, y: 150 },
      { name: "Gurgaon", x: 350, y: 150 }
    ]
  },
  {
    id: "S2",
    name: "Faridabad - Noida",
    path: "M 100 200 Q 250 120 400 180",
    stations: [
      { name: "Faridabad", x: 100, y: 200 },
      { name: "Noida", x: 400, y: 180 }
    ]
  },
  {
    id: "S3",
    name: "Ghaziabad - Dwarka",
    path: "M 150 80 Q 300 50 450 100",
    stations: [
      { name: "Ghaziabad", x: 150, y: 80 },
      { name: "Dwarka", x: 450, y: 100 }
    ]
  },
  {
    id: "S4",
    name: "Rohini - Badarpur",
    path: "M 80 250 Q 220 180 380 240",
    stations: [
      { name: "Rohini", x: 80, y: 250 },
      { name: "Badarpur", x: 380, y: 240 }
    ]
  },
  {
    id: "S5",
    name: "Janakpuri - Lajpat Nagar",
    path: "M 120 120 Q 280 200 420 140",
    stations: [
      { name: "Janakpuri", x: 120, y: 120 },
      { name: "Lajpat Nagar", x: 420, y: 140 }
    ]
  }
];

// WebSocket mock simulation
export class MockWebSocket {
  constructor() {
    this.listeners = [];
    this.isConnected = false;
  }

  connect() {
    this.isConnected = true;
    // Simulate periodic updates
    setInterval(() => {
      if (this.isConnected) {
        this.broadcastUpdate();
      }
    }, 3000);
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  broadcastUpdate() {
    const updatedTrains = mockTrains.map(train => ({
      ...train,
      speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
      progress: Math.min(1, train.progress + Math.random() * 0.05),
      delay: Math.max(-10, train.delay + (Math.random() - 0.5) * 2)
    }));

    const message = {
      type: "positions",
      payload: updatedTrains,
      ts: new Date().toISOString()
    };

    this.listeners.forEach(callback => callback(message));
  }

  disconnect() {
    this.isConnected = false;
  }
}

export const mockWS = new MockWebSocket();