export type ToolMode = 'select' | 'move' | 'scale' | 'rotate';

export type PartShape = 'Block' | 'Ball' | 'Cylinder' | 'Wedge' | 'CornerWedge' | 'Truss';

export type MaterialType =
  | 'SmoothPlastic'
  | 'Neon'
  | 'Wood'
  | 'Metal'
  | 'Grass'
  | 'Glass'
  | 'Forcefield'
  | 'Brick'
  | 'Foil'
  | 'Ice';

export interface RobloxSubPart {
  id: string;
  name: string;
  shape: PartShape;
  offset: [number, number, number]; // relative to parent
  rotation: [number, number, number];
  size: [number, number, number];
  color: string;
  material: MaterialType;
  transparency?: number;
  canCollide?: boolean;
}

export interface RobloxObject {
  id: string;
  name: string;
  type: 'Part' | 'SpawnLocation' | 'Model' | 'Script' | 'PointLight';
  shape?: PartShape;
  position: [number, number, number];
  rotation: [number, number, number]; // in degrees
  size: [number, number, number];
  color: string;
  material: MaterialType;
  anchored: boolean;
  canCollide: boolean;
  transparency: number;
  reflectance: number;
  castShadow: boolean;
  locked?: boolean;
  
  // Custom interactive & gameplay behavior
  behaviorType?:
    | 'none'
    | 'spawn'
    | 'kill_brick'
    | 'speed_pad'
    | 'jump_pad'
    | 'bouncy_pad'
    | 'coin'
    | 'checkpoint'
    | 'disappearing'
    | 'moving_platform'
    | 'teleporter'
    | 'spinner'
    | 'custom_script';

  // Scripting
  scriptCode?: string;
  scriptEnabled?: boolean;

  // Composite models (houses, cars, trees, NPCs, etc.)
  subParts?: RobloxSubPart[];

  // Custom data like target position for moving platform or teleport
  behaviorParams?: {
    damage?: number;
    speedBoost?: number;
    jumpBoost?: number;
    teleportX?: number;
    teleportY?: number;
    teleportZ?: number;
    moveAxis?: 'x' | 'y' | 'z';
    moveDistance?: number;
    moveSpeed?: number;
    spinSpeed?: number;
    disappearDelay?: number;
    respawnDelay?: number;
    coinValue?: number;
  };
}

export interface CatalogModelTemplate {
  id: string;
  name: string;
  category:
    | 'mechanics'
    | 'buildings'
    | 'nature'
    | 'vehicles'
    | 'basic'
    | 'houses'
    | 'hospitals'
    | 'roads'
    | 'trains'
    | 'walls'
    | 'floors'
    | 'furniture'
    | 'kitchen'
    | 'decor';
  description: string;
  badge?: string;
  previewColor: string;
  template: Omit<RobloxObject, 'id'>;
}

export interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  behaviorType: RobloxObject['behaviorType'];
  code: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: 'log' | 'warn' | 'error' | 'system';
  message: string;
}

export type SkyboxType = 'Clear' | 'Night' | 'Sunset' | 'Nebula' | 'Cloudy' | 'SciFiRed';

export interface LightingSettings {
  clockTime: number; // 0 to 24 (hours, e.g. 14.0 = 2 PM)
  ambientColor: string; // Hex color for hemisphere / ambient light
  shadowSoftness: number; // 0 (sharp) to 1 (very soft)
  sunBrightness: number; // 0 to 2
  skybox: SkyboxType;
}

