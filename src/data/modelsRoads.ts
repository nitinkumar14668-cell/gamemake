import { CatalogModelTemplate } from '../types/studio';

export const ROAD_MODELS: CatalogModelTemplate[] = [
  // 1. Straight 2-Lane Asphalt Road
  {
    id: 'road-straight-2lane',
    name: 'Straight 2-Lane Road with Sidewalks',
    category: 'roads',
    description: 'Modular straight asphalt road segment with yellow center dividing line, white shoulder lines, and raised concrete sidewalks.',
    badge: 'Modular',
    previewColor: '#263238',
    template: {
      name: 'StraightRoadSegment',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [16, 0.6, 24],
      color: '#263238',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main Dark Asphalt Deck
        { id: 'rd-deck', name: 'AsphaltPavement', shape: 'Block', offset: [0, 0.2, 0], rotation: [0, 0, 0], size: [12, 0.4, 24], color: '#212121', material: 'SmoothPlastic' },
        // Left Sidewalk
        { id: 'rd-sw-l', name: 'SidewalkLeft', shape: 'Block', offset: [-7, 0.4, 0], rotation: [0, 0, 0], size: [2, 0.8, 24], color: '#B0BEC5', material: 'Concrete' as any },
        // Right Sidewalk
        { id: 'rd-sw-r', name: 'SidewalkRight', shape: 'Block', offset: [7, 0.4, 0], rotation: [0, 0, 0], size: [2, 0.8, 24], color: '#B0BEC5', material: 'Concrete' as any },
        // Yellow Dashed Center Line (Strips)
        { id: 'rd-dash1', name: 'YellowDivider1', shape: 'Block', offset: [0, 0.42, 6], rotation: [0, 0, 0], size: [0.35, 0.05, 5], color: '#FFD600', material: 'SmoothPlastic' },
        { id: 'rd-dash2', name: 'YellowDivider2', shape: 'Block', offset: [0, 0.42, -6], rotation: [0, 0, 0], size: [0.35, 0.05, 5], color: '#FFD600', material: 'SmoothPlastic' },
        // White Shoulder Lines
        { id: 'rd-sh-l', name: 'WhiteLineLeft', shape: 'Block', offset: [-5.6, 0.42, 0], rotation: [0, 0, 0], size: [0.25, 0.05, 24], color: '#FAFAFA', material: 'SmoothPlastic' },
        { id: 'rd-sh-r', name: 'WhiteLineRight', shape: 'Block', offset: [5.6, 0.42, 0], rotation: [0, 0, 0], size: [0.25, 0.05, 24], color: '#FAFAFA', material: 'SmoothPlastic' },
      ],
    },
  },

  // 2. 4-Way Road Intersection with Crosswalks
  {
    id: 'road-intersection-4way',
    name: '4-Way Road Intersection',
    category: 'roads',
    description: 'Full 4-way city road intersection with zebra crosswalk stripes, corner sidewalk cutouts, and stop bars.',
    badge: 'Junction',
    previewColor: '#37474F',
    template: {
      name: 'FourWayIntersection',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [24, 0.6, 24],
      color: '#212121',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Central Asphalt Area
        { id: 'int-deck', name: 'IntersectionAsphalt', shape: 'Block', offset: [0, 0.2, 0], rotation: [0, 0, 0], size: [24, 0.4, 24], color: '#212121', material: 'SmoothPlastic' },
        // 4 Corner Sidewalk Blocks
        { id: 'int-c1', name: 'CornerSidewalkNW', shape: 'Block', offset: [-9.5, 0.4, -9.5], rotation: [0, 0, 0], size: [5, 0.8, 5], color: '#B0BEC5', material: 'SmoothPlastic' },
        { id: 'int-c2', name: 'CornerSidewalkNE', shape: 'Block', offset: [9.5, 0.4, -9.5], rotation: [0, 0, 0], size: [5, 0.8, 5], color: '#B0BEC5', material: 'SmoothPlastic' },
        { id: 'int-c3', name: 'CornerSidewalkSW', shape: 'Block', offset: [-9.5, 0.4, 9.5], rotation: [0, 0, 0], size: [5, 0.8, 5], color: '#B0BEC5', material: 'SmoothPlastic' },
        { id: 'int-c4', name: 'CornerSidewalkSE', shape: 'Block', offset: [9.5, 0.4, 9.5], rotation: [0, 0, 0], size: [5, 0.8, 5], color: '#B0BEC5', material: 'SmoothPlastic' },
        // Crosswalk Zebra Stripes North
        { id: 'int-zw-n1', name: 'ZebraN1', shape: 'Block', offset: [-3, 0.42, -7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-n2', name: 'ZebraN2', shape: 'Block', offset: [-1, 0.42, -7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-n3', name: 'ZebraN3', shape: 'Block', offset: [1, 0.42, -7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-n4', name: 'ZebraN4', shape: 'Block', offset: [3, 0.42, -7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        // Crosswalk Zebra Stripes South
        { id: 'int-zw-s1', name: 'ZebraS1', shape: 'Block', offset: [-3, 0.42, 7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-s2', name: 'ZebraS2', shape: 'Block', offset: [-1, 0.42, 7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-s3', name: 'ZebraS3', shape: 'Block', offset: [1, 0.42, 7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
        { id: 'int-zw-s4', name: 'ZebraS4', shape: 'Block', offset: [3, 0.42, 7], rotation: [0, 0, 0], size: [0.8, 0.05, 3], color: '#FFFFFF', material: 'SmoothPlastic' },
      ],
    },
  },

  // 3. 3-Way T-Junction Road
  {
    id: 'road-t-junction',
    name: '3-Way T-Junction Road',
    category: 'roads',
    description: 'T-junction connecting a perpendicular side street into a main avenue with turn markings and curbs.',
    badge: 'Modular',
    previewColor: '#263238',
    template: {
      name: 'TJunctionRoad',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [24, 0.6, 20],
      color: '#212121',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.05,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'tj-deck', name: 'PavementBase', shape: 'Block', offset: [0, 0.2, 0], rotation: [0, 0, 0], size: [24, 0.4, 20], color: '#212121', material: 'SmoothPlastic' },
        // Continuous Back Sidewalk
        { id: 'tj-sw-b', name: 'ContinuousBackSidewalk', shape: 'Block', offset: [0, 0.4, -9], rotation: [0, 0, 0], size: [24, 0.8, 2], color: '#B0BEC5', material: 'SmoothPlastic' },
        // Front Left Sidewalk Corner
        { id: 'tj-sw-fl', name: 'FrontCornerLeft', shape: 'Block', offset: [-9, 0.4, 7], rotation: [0, 0, 0], size: [6, 0.8, 6], color: '#B0BEC5', material: 'SmoothPlastic' },
        // Front Right Sidewalk Corner
        { id: 'tj-sw-fr', name: 'FrontCornerRight', shape: 'Block', offset: [9, 0.4, 7], rotation: [0, 0, 0], size: [6, 0.8, 6], color: '#B0BEC5', material: 'SmoothPlastic' },
        // Yellow Divider Main Road
        { id: 'tj-div-l', name: 'MainYellowLeft', shape: 'Block', offset: [-7, 0.42, -1], rotation: [0, 0, 0], size: [6, 0.05, 0.35], color: '#FFD600', material: 'SmoothPlastic' },
        { id: 'tj-div-r', name: 'MainYellowRight', shape: 'Block', offset: [7, 0.42, -1], rotation: [0, 0, 0], size: [6, 0.05, 0.35], color: '#FFD600', material: 'SmoothPlastic' },
      ],
    },
  },

  // 4. Elevated Highway Overpass / Bridge
  {
    id: 'road-highway-overpass',
    name: 'Elevated Highway Overpass Bridge',
    category: 'roads',
    description: 'High-speed elevated roadway supported by heavy concrete piers with reinforced steel crash barriers.',
    badge: 'Highway',
    previewColor: '#455A64',
    template: {
      name: 'HighwayOverpass',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [14, 10, 28],
      color: '#37474F',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Elevated Bridge Deck
        { id: 'hw-deck', name: 'ElevatedRoadDeck', shape: 'Block', offset: [0, 8.5, 0], rotation: [0, 0, 0], size: [12, 1, 28], color: '#263238', material: 'SmoothPlastic' },
        // Left Concrete Crash Guardrail
        { id: 'hw-gr-l', name: 'GuardRailL', shape: 'Block', offset: [-6.2, 9.4, 0], rotation: [0, 0, 0], size: [0.6, 1.4, 28], color: '#78909C', material: 'Metal' },
        // Right Concrete Crash Guardrail
        { id: 'hw-gr-r', name: 'GuardRailR', shape: 'Block', offset: [6.2, 9.4, 0], rotation: [0, 0, 0], size: [0.6, 1.4, 28], color: '#78909C', material: 'Metal' },
        // Center Solid Highway Divider
        { id: 'hw-div', name: 'CenterBarrierJersey', shape: 'Block', offset: [0, 9.3, 0], rotation: [0, 0, 0], size: [0.8, 1, 28], color: '#90A4AE', material: 'Concrete' as any },
        // Heavy Concrete Pier 1 (Front)
        { id: 'hw-p1', name: 'ConcretePillarFront', shape: 'Cylinder', offset: [0, 4, 8], rotation: [0, 0, 0], size: [2.5, 8, 2.5], color: '#B0BEC5', material: 'Concrete' as any },
        // Heavy Concrete Pier 2 (Back)
        { id: 'hw-p2', name: 'ConcretePillarBack', shape: 'Cylinder', offset: [0, 4, -8], rotation: [0, 0, 0], size: [2.5, 8, 2.5], color: '#B0BEC5', material: 'Concrete' as any },
      ],
    },
  },

  // 5. Pedestrian Crosswalk & Traffic Light Signal Gantry
  {
    id: 'road-crosswalk-traffic-light',
    name: 'Crosswalk & Traffic Signal Post',
    category: 'roads',
    description: 'Overhead street gantry with working red/yellow/green traffic signal lamps and crosswalk push-button post.',
    badge: 'Signals',
    previewColor: '#FBC02D',
    template: {
      name: 'TrafficSignalGantry',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [10, 10, 3],
      color: '#37474F',
      material: 'Metal',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.2,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Vertical Gantry Pole
        { id: 'ts-pole', name: 'VerticalPole', shape: 'Cylinder', offset: [-4, 4.8, 0], rotation: [0, 0, 0], size: [0.6, 9.6, 0.6], color: '#263238', material: 'Metal' },
        // Horizontal Arm
        { id: 'ts-arm', name: 'OverheadArm', shape: 'Cylinder', offset: [0, 8.8, 0], rotation: [0, 0, 90], size: [0.5, 8, 0.5], color: '#263238', material: 'Metal' },
        // Traffic Signal Housing Box
        { id: 'ts-box', name: 'SignalHousing', shape: 'Block', offset: [1.5, 7.8, 0], rotation: [0, 0, 0], size: [1.2, 2.8, 0.8], color: '#FBC02D', material: 'Metal' },
        // Red Signal Lamp
        { id: 'ts-red', name: 'RedLamp', shape: 'Ball', offset: [1.5, 8.6, 0.42], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FF1744', material: 'Neon' },
        // Amber Signal Lamp
        { id: 'ts-yellow', name: 'AmberLamp', shape: 'Ball', offset: [1.5, 7.8, 0.42], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#FFD600', material: 'Neon' },
        // Green Signal Lamp
        { id: 'ts-green', name: 'GreenLamp', shape: 'Ball', offset: [1.5, 7.0, 0.42], rotation: [0, 0, 0], size: [0.6, 0.6, 0.6], color: '#00E676', material: 'Neon' },
        // Pedestrian Push Button Box
        { id: 'ts-btn', name: 'PedestrianButton', shape: 'Block', offset: [-3.6, 3, 0], rotation: [0, 0, 0], size: [0.4, 0.6, 0.4], color: '#FBC02D', material: 'Metal' },
      ],
    },
  },
];
