import { CatalogModelTemplate } from '../types/studio';

export const TRAIN_MODELS: CatalogModelTemplate[] = [
  // 1. High-Speed Express Bullet Train Locomotive
  {
    id: 'train-bullet-locomotive',
    name: 'High-Speed Express Train Locomotive',
    category: 'trains',
    description: 'Modern streamlined high-speed bullet train locomotive with aerodynamic nose cone, driver cabin windshield, and roof pantograph.',
    badge: 'Express',
    previewColor: '#0288D1',
    template: {
      name: 'BulletTrainLocomotive',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [5, 4.5, 18],
      color: '#FFFFFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.15,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main Train Body
        { id: 'bt-body', name: 'CarriageBody', shape: 'Block', offset: [0, 2.4, -2], rotation: [0, 0, 0], size: [4.4, 3.2, 13], color: '#FAFAFA', material: 'SmoothPlastic' },
        // Aerodynamic Nose Cone (Sloped front wedge)
        { id: 'bt-nose', name: 'AeroNose', shape: 'Wedge', offset: [0, 1.8, 6], rotation: [0, 180, 0], size: [4.4, 2.2, 5], color: '#0288D1', material: 'SmoothPlastic' },
        // Driver Windshield Glass
        { id: 'bt-cab', name: 'CabinWindshield', shape: 'Block', offset: [0, 2.8, 4.2], rotation: [25, 0, 0], size: [4, 1.2, 0.4], color: '#1B242A', material: 'Glass', transparency: 0.3 },
        // Blue Speed Stripe Band
        { id: 'bt-str-l', name: 'SpeedStripeL', shape: 'Block', offset: [-2.25, 2.2, -2], rotation: [0, 0, 0], size: [0.1, 0.8, 12.8], color: '#0288D1', material: 'SmoothPlastic' },
        { id: 'bt-str-r', name: 'SpeedStripeR', shape: 'Block', offset: [2.25, 2.2, -2], rotation: [0, 0, 0], size: [0.1, 0.8, 12.8], color: '#0288D1', material: 'SmoothPlastic' },
        // Passenger Tinted Window Strip
        { id: 'bt-win-l', name: 'WindowsL', shape: 'Block', offset: [-2.25, 2.9, -2], rotation: [0, 0, 0], size: [0.1, 0.9, 11], color: '#263238', material: 'Glass', transparency: 0.2 },
        { id: 'bt-win-r', name: 'WindowsR', shape: 'Block', offset: [2.25, 2.9, -2], rotation: [0, 0, 0], size: [0.1, 0.9, 11], color: '#263238', material: 'Glass', transparency: 0.2 },
        // Roof Pantograph (Electric Overhead Power Collector)
        { id: 'bt-panto', name: 'RoofPantograph', shape: 'Block', offset: [0, 4.3, -5], rotation: [0, 0, 0], size: [2, 0.8, 2], color: '#D32F2F', material: 'Metal' },
        // Front High-Beam Headlights
        { id: 'bt-hl1', name: 'HeadlightL', shape: 'Block', offset: [-1.4, 1.4, 8.2], rotation: [0, 0, 0], size: [0.6, 0.4, 0.2], color: '#FFF59D', material: 'Neon' },
        { id: 'bt-hl2', name: 'HeadlightR', shape: 'Block', offset: [1.4, 1.4, 8.2], rotation: [0, 0, 0], size: [0.6, 0.4, 0.2], color: '#FFF59D', material: 'Neon' },
        // Steel Bogie Wheels (Front & Rear trucks)
        { id: 'bt-w1', name: 'WheelFrontL', shape: 'Cylinder', offset: [-2.2, 0.7, 4], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        { id: 'bt-w2', name: 'WheelFrontR', shape: 'Cylinder', offset: [2.2, 0.7, 4], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        { id: 'bt-w3', name: 'WheelBackL', shape: 'Cylinder', offset: [-2.2, 0.7, -6], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        { id: 'bt-w4', name: 'WheelBackR', shape: 'Cylinder', offset: [2.2, 0.7, -6], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
      ],
    },
  },

  // 2. Modern Passenger Train Carriage / Bogie
  {
    id: 'train-passenger-coach',
    name: 'Modern Passenger Train Carriage',
    category: 'trains',
    description: 'Intercity passenger carriage with double doors, continuous window strip, roof vents, and rail bogies.',
    badge: 'Carriage',
    previewColor: '#ECEFF1',
    template: {
      name: 'PassengerTrainCarriage',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [5, 4.5, 20],
      color: '#ECEFF1',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main Coach Body
        { id: 'pc-body', name: 'CoachBody', shape: 'Block', offset: [0, 2.5, 0], rotation: [0, 0, 0], size: [4.4, 3.2, 19.5], color: '#FAFAFA', material: 'SmoothPlastic' },
        // Blue Lower Livery Skirt
        { id: 'pc-skirt', name: 'LowerBlueSkirt', shape: 'Block', offset: [0, 1.1, 0], rotation: [0, 0, 0], size: [4.5, 0.6, 19.6], color: '#0288D1', material: 'SmoothPlastic' },
        // Windows Left
        { id: 'pc-wl', name: 'WindowsLeft', shape: 'Block', offset: [-2.25, 2.8, 0], rotation: [0, 0, 0], size: [0.1, 1, 16], color: '#263238', material: 'Glass', transparency: 0.2 },
        // Windows Right
        { id: 'pc-wr', name: 'WindowsRight', shape: 'Block', offset: [2.25, 2.8, 0], rotation: [0, 0, 0], size: [0.1, 1, 16], color: '#263238', material: 'Glass', transparency: 0.2 },
        // Passenger Doors Left
        { id: 'pc-dl1', name: 'DoorL1', shape: 'Block', offset: [-2.26, 2.2, 7.5], rotation: [0, 0, 0], size: [0.1, 2.2, 1.6], color: '#78909C', material: 'Metal' },
        { id: 'pc-dl2', name: 'DoorL2', shape: 'Block', offset: [-2.26, 2.2, -7.5], rotation: [0, 0, 0], size: [0.1, 2.2, 1.6], color: '#78909C', material: 'Metal' },
        // Wheels Bogie 1
        { id: 'pc-w1', name: 'Bogie1_L', shape: 'Cylinder', offset: [-2.2, 0.7, 6.5], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        { id: 'pc-w2', name: 'Bogie1_R', shape: 'Cylinder', offset: [2.2, 0.7, 6.5], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        // Wheels Bogie 2
        { id: 'pc-w3', name: 'Bogie2_L', shape: 'Cylinder', offset: [-2.2, 0.7, -6.5], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
        { id: 'pc-w4', name: 'Bogie2_R', shape: 'Cylinder', offset: [2.2, 0.7, -6.5], rotation: [0, 0, 90], size: [0.6, 1.4, 1.4], color: '#37474F', material: 'Metal' },
      ],
    },
  },

  // 3. Straight Railroad Track Segment
  {
    id: 'train-rail-straight',
    name: 'Straight Railroad Track (Ballast & Rails)',
    category: 'trains',
    description: 'Standard gauge straight railway track with crushed stone gravel ballast, wooden cross-ties (sleepers), and parallel steel rails.',
    badge: 'Track',
    previewColor: '#78909C',
    template: {
      name: 'StraightRailwayTrack',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [6, 0.8, 20],
      color: '#546E7A',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Gravel Ballast Bed
        { id: 'rt-bed', name: 'GravelBallast', shape: 'Block', offset: [0, 0.2, 0], rotation: [0, 0, 0], size: [5.8, 0.4, 20], color: '#455A64', material: 'Concrete' as any },
        // Steel Rail Left
        { id: 'rt-rail-l', name: 'SteelRailLeft', shape: 'Block', offset: [-1.6, 0.65, 0], rotation: [0, 0, 0], size: [0.3, 0.4, 20], color: '#CFD8DC', material: 'Metal' },
        // Steel Rail Right
        { id: 'rt-rail-r', name: 'SteelRailRight', shape: 'Block', offset: [1.6, 0.65, 0], rotation: [0, 0, 0], size: [0.3, 0.4, 20], color: '#CFD8DC', material: 'Metal' },
        // Wooden Ties (Sleepers) along the length
        { id: 'rt-tie1', name: 'Sleeper1', shape: 'Block', offset: [0, 0.45, 8], rotation: [0, 0, 0], size: [4.6, 0.25, 0.8], color: '#3E2723', material: 'Wood' },
        { id: 'rt-tie2', name: 'Sleeper2', shape: 'Block', offset: [0, 0.45, 4], rotation: [0, 0, 0], size: [4.6, 0.25, 0.8], color: '#3E2723', material: 'Wood' },
        { id: 'rt-tie3', name: 'Sleeper3', shape: 'Block', offset: [0, 0.45, 0], rotation: [0, 0, 0], size: [4.6, 0.25, 0.8], color: '#3E2723', material: 'Wood' },
        { id: 'rt-tie4', name: 'Sleeper4', shape: 'Block', offset: [0, 0.45, -4], rotation: [0, 0, 0], size: [4.6, 0.25, 0.8], color: '#3E2723', material: 'Wood' },
        { id: 'rt-tie5', name: 'Sleeper5', shape: 'Block', offset: [0, 0.45, -8], rotation: [0, 0, 0], size: [4.6, 0.25, 0.8], color: '#3E2723', material: 'Wood' },
      ],
    },
  },

  // 4. Railroad Crossing Guard with Flashers & Barrier Arm
  {
    id: 'train-crossing-barrier',
    name: 'Railroad Crossing Signal & Barrier Gate',
    category: 'trains',
    description: 'Authentic train road crossing with X-crossbuck sign, alternating red flashers, and red-and-white striped barrier arm.',
    badge: 'Signals',
    previewColor: '#D32F2F',
    template: {
      name: 'RailroadCrossingGate',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [8, 8, 2],
      color: '#37474F',
      material: 'Metal',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Crossing Mast Post
        { id: 'cg-post', name: 'SignalMast', shape: 'Cylinder', offset: [-2.5, 3.5, 0], rotation: [0, 0, 0], size: [0.5, 7, 0.5], color: '#B0BEC5', material: 'Metal' },
        // Base Motor Box
        { id: 'cg-box', name: 'MotorCabinet', shape: 'Block', offset: [-2.5, 1.2, 0], rotation: [0, 0, 0], size: [1.2, 2.4, 1.2], color: '#78909C', material: 'Metal' },
        // Red Flashing Lamps
        { id: 'cg-lamp-l', name: 'RedFlasherL', shape: 'Ball', offset: [-3.2, 5.8, 0.3], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        { id: 'cg-lamp-r', name: 'RedFlasherR', shape: 'Ball', offset: [-1.8, 5.8, 0.3], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        // Crossbuck 'X' Signs
        { id: 'cg-x1', name: 'CrossbuckBar1', shape: 'Block', offset: [-2.5, 6.8, 0.3], rotation: [0, 0, 45], size: [2.5, 0.3, 0.1], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'cg-x2', name: 'CrossbuckBar2', shape: 'Block', offset: [-2.5, 6.8, 0.3], rotation: [0, 0, -45], size: [2.5, 0.3, 0.1], color: '#FFFFFF', material: 'SmoothPlastic' },
        // Barrier Gate Arm (Red and white stripes)
        { id: 'cg-arm', name: 'StripedBarrierArm', shape: 'Block', offset: [1.8, 1.8, 0], rotation: [0, 0, 0], size: [7.5, 0.35, 0.2], color: '#D32F2F', material: 'SmoothPlastic' },
      ],
    },
  },

  // 5. Train Passenger Station & Platform
  {
    id: 'train-station-platform',
    name: 'Train Passenger Station Platform',
    category: 'trains',
    description: 'Elevated railway passenger station boarding platform with overhead shelter roof, benches, and tactile safety yellow edge.',
    badge: 'Station',
    previewColor: '#455A64',
    template: {
      name: 'TrainStationPlatform',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [8, 6.5, 24],
      color: '#ECEFF1',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Raised Concrete Platform Deck
        { id: 'sp-deck', name: 'PlatformDeck', shape: 'Block', offset: [0, 0.6, 0], rotation: [0, 0, 0], size: [7.5, 1.2, 24], color: '#90A4AE', material: 'Concrete' as any },
        // Tactile Safety Yellow Edge (Track side)
        { id: 'sp-yellow', name: 'TactileSafetyEdge', shape: 'Block', offset: [3.4, 1.22, 0], rotation: [0, 0, 0], size: [0.6, 0.05, 24], color: '#FFD600', material: 'SmoothPlastic' },
        // Shelter Overhead Canopy Roof
        { id: 'sp-roof', name: 'StationCanopy', shape: 'Block', offset: [-1, 5.2, 0], rotation: [0, 0, 0], size: [6.5, 0.4, 20], color: '#37474F', material: 'Metal' },
        // Support Canopy Pillars
        { id: 'sp-col1', name: 'RoofSupport1', shape: 'Cylinder', offset: [-1, 3.1, 7], rotation: [0, 0, 0], size: [0.4, 3.8, 0.4], color: '#263238', material: 'Metal' },
        { id: 'sp-col2', name: 'RoofSupport2', shape: 'Cylinder', offset: [-1, 3.1, 0], rotation: [0, 0, 0], size: [0.4, 3.8, 0.4], color: '#263238', material: 'Metal' },
        { id: 'sp-col3', name: 'RoofSupport3', shape: 'Cylinder', offset: [-1, 3.1, -7], rotation: [0, 0, 0], size: [0.4, 3.8, 0.4], color: '#263238', material: 'Metal' },
        // Passenger Waiting Bench
        { id: 'sp-bench', name: 'WoodenBench', shape: 'Block', offset: [-1.5, 1.6, 0], rotation: [0, 0, 0], size: [1.2, 0.7, 4], color: '#6D4C41', material: 'Wood' },
        // Station Clock Post
        { id: 'sp-clock', name: 'StationClock', shape: 'Cylinder', offset: [-1, 4.2, -6], rotation: [90, 0, 0], size: [1, 0.3, 1], color: '#FFFFFF', material: 'Neon' },
      ],
    },
  },
];
