import { CatalogModelTemplate } from '../types/studio';

export const HOUSE_MODELS: CatalogModelTemplate[] = [
  // 1. Modern Luxury Villa
  {
    id: 'house-modern-villa',
    name: 'Modern Luxury Villa',
    category: 'houses',
    description: 'Ultra-modern 2-story architectural residence with glass walls, concrete pillars, timber balcony, and flat roof.',
    badge: 'Realistic',
    previewColor: '#ECEFF1',
    template: {
      name: 'ModernVilla',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [18, 9, 14],
      color: '#ECEFF1',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Foundation
        { id: 'mv-pad', name: 'TerraceFoundation', shape: 'Block', offset: [0, 0.25, 0], rotation: [0, 0, 0], size: [20, 0.5, 16], color: '#CFD8DC', material: 'SmoothPlastic' },
        // Ground floor main slab
        { id: 'mv-gf', name: 'GroundFloorCore', shape: 'Block', offset: [-1.5, 2.5, 0], rotation: [0, 0, 0], size: [13, 4, 12], color: '#FFFFFF', material: 'SmoothPlastic' },
        // Floor divider slab
        { id: 'mv-mid', name: 'FloorDividerSlab', shape: 'Block', offset: [0, 4.7, 0], rotation: [0, 0, 0], size: [19, 0.5, 15], color: '#37474F', material: 'Metal' },
        // 2nd floor cantilever suite
        { id: 'mv-uf', name: 'UpperFloorSuite', shape: 'Block', offset: [1.5, 6.8, -1], rotation: [0, 0, 0], size: [14, 3.8, 11], color: '#ECEFF1', material: 'SmoothPlastic' },
        // Wood feature accent wall
        { id: 'mv-wood', name: 'CedarWoodAccent', shape: 'Block', offset: [6.5, 6.8, -1], rotation: [0, 0, 0], size: [0.3, 3.8, 10.5], color: '#8D6E63', material: 'Wood' },
        // Large glass panoramic window front
        { id: 'mv-glass1', name: 'PanoramicGlassFront', shape: 'Block', offset: [-1.5, 2.5, 6.05], rotation: [0, 0, 0], size: [9, 3.5, 0.2], color: '#81D4FA', material: 'Glass', transparency: 0.4 },
        // Upper floor balcony glass
        { id: 'mv-glass2', name: 'BalconyRailing', shape: 'Block', offset: [-4.5, 5.3, 3], rotation: [0, 0, 0], size: [8, 0.8, 0.2], color: '#B3E5FC', material: 'Glass', transparency: 0.3 },
        // Steel support columns
        { id: 'mv-c1', name: 'SupportPillar1', shape: 'Cylinder', offset: [-8, 2.5, 6], rotation: [0, 0, 0], size: [0.5, 4.5, 0.5], color: '#263238', material: 'Metal' },
        { id: 'mv-c2', name: 'SupportPillar2', shape: 'Cylinder', offset: [-8, 2.5, -6], rotation: [0, 0, 0], size: [0.5, 4.5, 0.5], color: '#263238', material: 'Metal' },
        // Modern entry door
        { id: 'mv-door', name: 'PivotFrontDoor', shape: 'Block', offset: [4, 2, 6.05], rotation: [0, 0, 0], size: [2, 3.5, 0.2], color: '#212121', material: 'Wood', canCollide: false },
      ],
    },
  },

  // 2. Suburban Family House
  {
    id: 'house-suburban-family',
    name: 'Suburban Two-Story House',
    category: 'houses',
    description: 'Classic American suburban home with brick chimney, pitched gables, front porch, and 2-car garage.',
    badge: 'Detailed',
    previewColor: '#6D4C41',
    template: {
      name: 'SuburbanHouse',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [16, 10, 14],
      color: '#EFEBE9',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Main House Body
        { id: 'sh-body', name: 'MainBuilding', shape: 'Block', offset: [-2, 3.5, 0], rotation: [0, 0, 0], size: [10, 7, 12], color: '#F5F5F5', material: 'SmoothPlastic' },
        // Garage Wing
        { id: 'sh-gar', name: 'GarageWing', shape: 'Block', offset: [5, 2.5, 0], rotation: [0, 0, 0], size: [6, 5, 11], color: '#E0E0E0', material: 'SmoothPlastic' },
        // Garage Doors
        { id: 'sh-gd', name: 'GarageDoor', shape: 'Block', offset: [5, 2.2, 5.6], rotation: [0, 0, 0], size: [5, 3.8, 0.2], color: '#FAFAFA', material: 'Metal' },
        // Main Pitched Roof
        { id: 'sh-roof', name: 'PitchedRoof', shape: 'Wedge', offset: [-2, 8.5, 0], rotation: [0, 0, 0], size: [11, 3.5, 13], color: '#37474F', material: 'SmoothPlastic' },
        // Garage Roof
        { id: 'sh-groof', name: 'GarageRoof', shape: 'Wedge', offset: [5, 5.8, 0], rotation: [0, 0, 0], size: [7, 2, 12], color: '#37474F', material: 'SmoothPlastic' },
        // Red Brick Chimney
        { id: 'sh-chim', name: 'BrickChimney', shape: 'Block', offset: [-5.5, 8.5, 2], rotation: [0, 0, 0], size: [1.6, 6, 1.6], color: '#A03020', material: 'Brick' },
        // Front Porch Overhang
        { id: 'sh-porch', name: 'PorchRoof', shape: 'Block', offset: [-2, 3.6, 6.8], rotation: [0, 0, 0], size: [5, 0.3, 2], color: '#455A64', material: 'SmoothPlastic' },
        // Porch Columns
        { id: 'sh-pc1', name: 'PorchColumnL', shape: 'Cylinder', offset: [-4.2, 1.8, 7.6], rotation: [0, 0, 0], size: [0.3, 3.4, 0.3], color: '#FFFFFF', material: 'Wood' },
        { id: 'sh-pc2', name: 'PorchColumnR', shape: 'Cylinder', offset: [0.2, 1.8, 7.6], rotation: [0, 0, 0], size: [0.3, 3.4, 0.3], color: '#FFFFFF', material: 'Wood' },
        // Front Entry Door
        { id: 'sh-door', name: 'WoodDoor', shape: 'Block', offset: [-2, 1.8, 6.05], rotation: [0, 0, 0], size: [1.8, 3.2, 0.2], color: '#5D4037', material: 'Wood', canCollide: false },
      ],
    },
  },

  // 3. Mountain Log Cabin / Cottage
  {
    id: 'house-log-cabin',
    name: 'Mountain Log Cabin',
    category: 'houses',
    description: 'Rustic wooden log cabin with heavy stone fireplace, wood beam porch, and warm mountain style.',
    badge: 'Cozy',
    previewColor: '#5D4037',
    template: {
      name: 'LogCabin',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [12, 8, 12],
      color: '#5D4037',
      material: 'Wood',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Stone foundation
        { id: 'lc-base', name: 'StoneFoundation', shape: 'Block', offset: [0, 0.6, 0], rotation: [0, 0, 0], size: [13, 1.2, 13], color: '#616161', material: 'Brick' },
        // Timber Log Walls
        { id: 'lc-walls', name: 'LogWalls', shape: 'Block', offset: [0, 3.2, 0], rotation: [0, 0, 0], size: [11, 4.2, 11], color: '#6D4C41', material: 'Wood' },
        // Steep Gable Overhang Roof
        { id: 'lc-roof', name: 'TimberShingleRoof', shape: 'Wedge', offset: [0, 6.8, 0], rotation: [0, 0, 0], size: [13, 3.5, 13], color: '#3E2723', material: 'Wood' },
        // Stone Fireplace stack
        { id: 'lc-fp', name: 'StoneChimney', shape: 'Block', offset: [5, 4.8, -2], rotation: [0, 0, 0], size: [2, 7.5, 2], color: '#546E7A', material: 'Brick' },
        // Front Porch Deck
        { id: 'lc-deck', name: 'PorchDeck', shape: 'Block', offset: [0, 0.6, 6.8], rotation: [0, 0, 0], size: [9, 0.4, 3], color: '#795548', material: 'Wood' },
        // Porch Beams
        { id: 'lc-pb1', name: 'PostLeft', shape: 'Cylinder', offset: [-4, 2.2, 7.8], rotation: [0, 0, 0], size: [0.4, 3.2, 0.4], color: '#4E342E', material: 'Wood' },
        { id: 'lc-pb2', name: 'PostRight', shape: 'Cylinder', offset: [4, 2.2, 7.8], rotation: [0, 0, 0], size: [0.4, 3.2, 0.4], color: '#4E342E', material: 'Wood' },
        // Windows with warm light glow
        { id: 'lc-w1', name: 'GlowingWindowL', shape: 'Block', offset: [-2.8, 3.2, 5.55], rotation: [0, 0, 0], size: [1.8, 1.8, 0.2], color: '#FFE082', material: 'Neon' },
        { id: 'lc-w2', name: 'GlowingWindowR', shape: 'Block', offset: [2.8, 3.2, 5.55], rotation: [0, 0, 0], size: [1.8, 1.8, 0.2], color: '#FFE082', material: 'Neon' },
        // Doorway
        { id: 'lc-door', name: 'PlankDoor', shape: 'Block', offset: [0, 2.2, 5.55], rotation: [0, 0, 0], size: [1.8, 3, 0.2], color: '#3E2723', material: 'Wood', canCollide: false },
      ],
    },
  },

  // 4. Modern High-Rise Apartment Tower / Skyscraper
  {
    id: 'house-apartment-skyscraper',
    name: 'City High-Rise Apartment Complex',
    category: 'houses',
    description: 'Tall multi-unit city apartment block with glass window grid, entrance lobby, and rooftop terrace.',
    badge: 'Skyscraper',
    previewColor: '#455A64',
    template: {
      name: 'ApartmentTower',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [14, 28, 14],
      color: '#37474F',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Ground Lobby
        { id: 'apt-lobby', name: 'GlassEntranceLobby', shape: 'Block', offset: [0, 2.5, 0], rotation: [0, 0, 0], size: [14, 5, 14], color: '#263238', material: 'Glass', transparency: 0.2 },
        // Main Tower Core
        { id: 'apt-core', name: 'TowerBody', shape: 'Block', offset: [0, 15, 0], rotation: [0, 0, 0], size: [13, 20, 13], color: '#455A64', material: 'SmoothPlastic' },
        // Window Grid Facade (Front)
        { id: 'apt-win-f', name: 'WindowGridFront', shape: 'Block', offset: [0, 15, 6.6], rotation: [0, 0, 0], size: [11.5, 18, 0.2], color: '#81D4FA', material: 'Glass', transparency: 0.3 },
        // Window Grid Facade (Back)
        { id: 'apt-win-b', name: 'WindowGridBack', shape: 'Block', offset: [0, 15, -6.6], rotation: [0, 0, 0], size: [11.5, 18, 0.2], color: '#81D4FA', material: 'Glass', transparency: 0.3 },
        // Window Grid Facade (Left)
        { id: 'apt-win-l', name: 'WindowGridLeft', shape: 'Block', offset: [-6.6, 15, 0], rotation: [0, 0, 0], size: [0.2, 18, 11.5], color: '#81D4FA', material: 'Glass', transparency: 0.3 },
        // Window Grid Facade (Right)
        { id: 'apt-win-r', name: 'WindowGridRight', shape: 'Block', offset: [6.6, 15, 0], rotation: [0, 0, 0], size: [0.2, 18, 11.5], color: '#81D4FA', material: 'Glass', transparency: 0.3 },
        // Roof Cap / Parapet
        { id: 'apt-roof', name: 'RooftopTerrace', shape: 'Block', offset: [0, 25.5, 0], rotation: [0, 0, 0], size: [13.5, 1, 13.5], color: '#263238', material: 'Concrete' as any },
        // Rooftop AC Equipment Box
        { id: 'apt-ac', name: 'RooftopVentUnit', shape: 'Block', offset: [2, 26.8, -2], rotation: [0, 0, 0], size: [4, 1.8, 3], color: '#78909C', material: 'Metal' },
        // Entrance Canopy
        { id: 'apt-canopy', name: 'StreetCanopy', shape: 'Block', offset: [0, 4.2, 7.8], rotation: [0, 0, 0], size: [6, 0.4, 2.5], color: '#1E88E5', material: 'Metal' },
      ],
    },
  },
];
