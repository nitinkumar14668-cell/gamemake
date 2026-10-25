import { CatalogModelTemplate } from '../types/studio';

export const HOSPITAL_MODELS: CatalogModelTemplate[] = [
  // 1. Metro City General Hospital
  {
    id: 'hospital-metro-general',
    name: 'Metro City General Hospital',
    category: 'hospitals',
    description: 'Full-scale multi-level medical center with illuminated Red Cross signs, ambulance emergency bay, and trauma center entrance.',
    badge: 'Medical',
    previewColor: '#E53935',
    template: {
      name: 'CityGeneralHospital',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [24, 14, 18],
      color: '#FFFFFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main Central Building Core
        { id: 'hosp-core', name: 'MainHospitalCore', shape: 'Block', offset: [0, 6.5, 0], rotation: [0, 0, 0], size: [22, 13, 16], color: '#FAFAFA', material: 'SmoothPlastic' },
        // Architectural Red Stripe Band
        { id: 'hosp-stripe', name: 'EmergencyRedBand', shape: 'Block', offset: [0, 11.5, 0], rotation: [0, 0, 0], size: [22.2, 1.2, 16.2], color: '#D32F2F', material: 'SmoothPlastic' },
        // Glass curtain wall (Front)
        { id: 'hosp-glass', name: 'CurtainGlassFront', shape: 'Block', offset: [0, 6.5, 8.1], rotation: [0, 0, 0], size: [16, 9, 0.2], color: '#81D4FA', material: 'Glass', transparency: 0.35 },
        // Glowing Neon Red Cross (Front Center)
        { id: 'hosp-cross-v', name: 'RedCrossVert', shape: 'Block', offset: [0, 12, 8.2], rotation: [0, 0, 0], size: [1.2, 3.6, 0.3], color: '#FF1744', material: 'Neon' },
        { id: 'hosp-cross-h', name: 'RedCrossHoriz', shape: 'Block', offset: [0, 12, 8.2], rotation: [0, 0, 0], size: [3.6, 1.2, 0.3], color: '#FF1744', material: 'Neon' },
        // Emergency ER Ambulance Bay Drive-thru
        { id: 'hosp-er-canopy', name: 'AmbulanceBayCanopy', shape: 'Block', offset: [-6, 3.5, 11], rotation: [0, 0, 0], size: [8, 0.5, 6], color: '#C62828', material: 'Metal' },
        { id: 'hosp-er-p1', name: 'CanopyPillarL', shape: 'Cylinder', offset: [-9.5, 1.7, 13.5], rotation: [0, 0, 0], size: [0.4, 3.5, 0.4], color: '#455A64', material: 'Metal' },
        { id: 'hosp-er-p2', name: 'CanopyPillarR', shape: 'Cylinder', offset: [-2.5, 1.7, 13.5], rotation: [0, 0, 0], size: [0.4, 3.5, 0.4], color: '#455A64', material: 'Metal' },
        // ER Illuminated Sign
        { id: 'hosp-er-sign', name: 'EmergencySign', shape: 'Block', offset: [-6, 4.2, 14.1], rotation: [0, 0, 0], size: [5, 0.8, 0.2], color: '#FF1744', material: 'Neon' },
        // Main Lobby Sliding Glass Doors
        { id: 'hosp-doors', name: 'AutomaticDoors', shape: 'Block', offset: [4, 1.8, 8.15], rotation: [0, 0, 0], size: [3.5, 3.2, 0.2], color: '#E0F7FA', material: 'Glass', transparency: 0.2, canCollide: false },
      ],
    },
  },

  // 2. Urgent Care & Medical Clinic
  {
    id: 'hospital-urgent-care',
    name: 'Urgent Care Medical Clinic',
    category: 'hospitals',
    description: 'Single-story community medical clinic with glass reception, blue/white facade, and 24/7 emergency beacon.',
    badge: 'Clinic',
    previewColor: '#0288D1',
    template: {
      name: 'UrgentCareClinic',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [14, 5.5, 12],
      color: '#FFFFFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Clinic Main Block
        { id: 'cl-body', name: 'ClinicBody', shape: 'Block', offset: [0, 2.5, 0], rotation: [0, 0, 0], size: [13, 5, 11], color: '#FFFFFF', material: 'SmoothPlastic' },
        // Blue Top Header Parapet
        { id: 'cl-top', name: 'BlueAccentBand', shape: 'Block', offset: [0, 4.8, 0], rotation: [0, 0, 0], size: [13.2, 0.8, 11.2], color: '#0288D1', material: 'SmoothPlastic' },
        // Medical Green Cross Sign
        { id: 'cl-cross1', name: 'GreenCrossV', shape: 'Block', offset: [0, 4.8, 5.7], rotation: [0, 0, 0], size: [0.6, 1.8, 0.2], color: '#00E676', material: 'Neon' },
        { id: 'cl-cross2', name: 'GreenCrossH', shape: 'Block', offset: [0, 4.8, 5.7], rotation: [0, 0, 0], size: [1.8, 0.6, 0.2], color: '#00E676', material: 'Neon' },
        // Glass Windows Front
        { id: 'cl-win1', name: 'WindowLeft', shape: 'Block', offset: [-3.8, 2.3, 5.6], rotation: [0, 0, 0], size: [3.5, 2.8, 0.2], color: '#B3E5FC', material: 'Glass', transparency: 0.3 },
        { id: 'cl-win2', name: 'WindowRight', shape: 'Block', offset: [3.8, 2.3, 5.6], rotation: [0, 0, 0], size: [3.5, 2.8, 0.2], color: '#B3E5FC', material: 'Glass', transparency: 0.3 },
        // Entry Door
        { id: 'cl-door', name: 'GlassEntrance', shape: 'Block', offset: [0, 1.6, 5.6], rotation: [0, 0, 0], size: [2.4, 3, 0.2], color: '#E0F7FA', material: 'Glass', transparency: 0.2, canCollide: false },
      ],
    },
  },

  // 3. Hospital Rooftop Helipad
  {
    id: 'hospital-helipad',
    name: 'Hospital Medical Helipad',
    category: 'hospitals',
    description: 'Official octagonal helicopter landing pad with prominent white H emblem, yellow perimeter safety rim, and red night beacons.',
    badge: 'Helipad',
    previewColor: '#455A64',
    template: {
      name: 'HospitalHelipad',
      type: 'Model',
      shape: 'Cylinder',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [16, 1.2, 16],
      color: '#37474F',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Octagonal Base Slab
        { id: 'hp-pad', name: 'HelipadDeck', shape: 'Cylinder', offset: [0, 0.5, 0], rotation: [0, 0, 0], size: [15, 0.8, 15], color: '#37474F', material: 'SmoothPlastic' },
        // Outer Yellow Warning Circle
        { id: 'hp-ring', name: 'YellowBorderRim', shape: 'Cylinder', offset: [0, 0.95, 0], rotation: [0, 0, 0], size: [13.5, 0.1, 13.5], color: '#FFD600', material: 'SmoothPlastic' },
        // Inner Dark Disc
        { id: 'hp-disc', name: 'LandingInnerDisc', shape: 'Cylinder', offset: [0, 1.0, 0], rotation: [0, 0, 0], size: [11.5, 0.1, 11.5], color: '#263238', material: 'SmoothPlastic' },
        // 'H' Left Leg
        { id: 'hp-hl', name: 'H_LeftLeg', shape: 'Block', offset: [-1.8, 1.1, 0], rotation: [0, 0, 0], size: [0.8, 0.1, 5], color: '#FFFFFF', material: 'SmoothPlastic' },
        // 'H' Right Leg
        { id: 'hp-hr', name: 'H_RightLeg', shape: 'Block', offset: [1.8, 1.1, 0], rotation: [0, 0, 0], size: [0.8, 0.1, 5], color: '#FFFFFF', material: 'SmoothPlastic' },
        // 'H' Crossbar
        { id: 'hp-hc', name: 'H_Crossbar', shape: 'Block', offset: [0, 1.1, 0], rotation: [0, 0, 0], size: [2.8, 0.1, 0.8], color: '#FFFFFF', material: 'SmoothPlastic' },
        // Perimeter Safety Warning Beacons
        { id: 'hp-b1', name: 'BeaconN', shape: 'Ball', offset: [0, 1.2, 7.2], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        { id: 'hp-b2', name: 'BeaconS', shape: 'Ball', offset: [0, 1.2, -7.2], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        { id: 'hp-b3', name: 'BeaconE', shape: 'Ball', offset: [7.2, 1.2, 0], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        { id: 'hp-b4', name: 'BeaconW', shape: 'Ball', offset: [-7.2, 1.2, 0], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
      ],
    },
  },

  // 4. Emergency Ambulance Vehicle
  {
    id: 'hospital-ambulance-van',
    name: 'Emergency Ambulance Vehicle',
    category: 'hospitals',
    description: 'City emergency paramedic ambulance with dual emergency lightbar, red medical cross stripes, and detailed box chassis.',
    badge: 'Vehicle',
    previewColor: '#FFFFFF',
    template: {
      name: 'AmbulanceVehicle',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [5.5, 4.2, 10],
      color: '#FFFFFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main Boxy Cabin Body
        { id: 'amb-body', name: 'AmbulanceBox', shape: 'Block', offset: [0, 2.2, -1], rotation: [0, 0, 0], size: [4.6, 3, 7.5], color: '#FAFAFA', material: 'SmoothPlastic' },
        // Front Driver Hood
        { id: 'amb-hood', name: 'DriverCabHood', shape: 'Block', offset: [0, 1.6, 3.8], rotation: [0, 0, 0], size: [4.4, 1.8, 2.8], color: '#FAFAFA', material: 'SmoothPlastic' },
        // Windshield Glass
        { id: 'amb-wind', name: 'Windshield', shape: 'Block', offset: [0, 2.5, 2.8], rotation: [15, 0, 0], size: [4.2, 1.2, 0.2], color: '#1B242A', material: 'Glass', transparency: 0.3 },
        // Red Emergency Livery Stripes (Sides)
        { id: 'amb-str-l', name: 'RedStripeL', shape: 'Block', offset: [-2.35, 2.2, -1], rotation: [0, 0, 0], size: [0.1, 0.8, 7.2], color: '#D50000', material: 'SmoothPlastic' },
        { id: 'amb-str-r', name: 'RedStripeR', shape: 'Block', offset: [2.35, 2.2, -1], rotation: [0, 0, 0], size: [0.1, 0.8, 7.2], color: '#D50000', material: 'SmoothPlastic' },
        // Red Cross Decals (Sides)
        { id: 'amb-cr1', name: 'CrossL_V', shape: 'Block', offset: [-2.4, 2.5, -2], rotation: [0, 0, 0], size: [0.1, 1.4, 0.4], color: '#FF1744', material: 'Neon' },
        { id: 'amb-cr2', name: 'CrossL_H', shape: 'Block', offset: [-2.4, 2.5, -2], rotation: [0, 0, 0], size: [0.1, 0.4, 1.4], color: '#FF1744', material: 'Neon' },
        // Rooftop Emergency Lightbar (Red/Blue flashers)
        { id: 'amb-lb-r', name: 'RedEmergencyLight', shape: 'Block', offset: [-1, 3.9, 1.5], rotation: [0, 0, 0], size: [1.2, 0.4, 0.6], color: '#FF1744', material: 'Neon' },
        { id: 'amb-lb-b', name: 'BlueEmergencyLight', shape: 'Block', offset: [1, 3.9, 1.5], rotation: [0, 0, 0], size: [1.2, 0.4, 0.6], color: '#00B0FF', material: 'Neon' },
        // Wheels
        { id: 'amb-w1', name: 'WheelFL', shape: 'Cylinder', offset: [-2.4, 0.8, 3.2], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#212121', material: 'SmoothPlastic' },
        { id: 'amb-w2', name: 'WheelFR', shape: 'Cylinder', offset: [2.4, 0.8, 3.2], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#212121', material: 'SmoothPlastic' },
        { id: 'amb-w3', name: 'WheelBL', shape: 'Cylinder', offset: [-2.4, 0.8, -2.8], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#212121', material: 'SmoothPlastic' },
        { id: 'amb-w4', name: 'WheelBR', shape: 'Cylinder', offset: [2.4, 0.8, -2.8], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#212121', material: 'SmoothPlastic' },
      ],
    },
  },
];
