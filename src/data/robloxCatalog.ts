import { CatalogModelTemplate, ScriptTemplate, RobloxObject } from '../types/studio';
import { HOUSE_MODELS } from './modelsHouses';
import { HOSPITAL_MODELS } from './modelsHospitals';
import { ROAD_MODELS } from './modelsRoads';
import { TRAIN_MODELS } from './modelsTrains';
import { ALL_HOME_BUILDING_MODELS } from './modelsHomeBuilding';

export const CATALOG_MODELS: CatalogModelTemplate[] = [
  ...ALL_HOME_BUILDING_MODELS,
  ...HOUSE_MODELS,
  ...HOSPITAL_MODELS,
  ...ROAD_MODELS,
  ...TRAIN_MODELS,
  // --- BASIC PARTS ---
  {
    id: 'basic-block',
    name: 'Block Part',
    category: 'basic',
    description: 'Standard 4x1x2 stud building block. Fully resizable and scriptable.',
    badge: 'Core',
    previewColor: '#9A9A9A',
    template: {
      name: 'Part',
      type: 'Part',
      shape: 'Block',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      size: [4, 1.2, 2],
      color: '#9A9A9A',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
    },
  },
  {
    id: 'basic-sphere',
    name: 'Sphere (Ball)',
    category: 'basic',
    description: 'Smooth round spherical part. Great for bouncy balls or rounded decor.',
    badge: 'Core',
    previewColor: '#00A2FF',
    template: {
      name: 'SpherePart',
      type: 'Part',
      shape: 'Ball',
      position: [0, 1.5, 0],
      rotation: [0, 0, 0],
      size: [3, 3, 3],
      color: '#00A2FF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'none',
    },
  },
  {
    id: 'basic-cylinder',
    name: 'Cylinder',
    category: 'basic',
    description: 'Pillar or wheel cylinder part. Useful for columns and wheels.',
    badge: 'Core',
    previewColor: '#F5CD30',
    template: {
      name: 'CylinderPart',
      type: 'Part',
      shape: 'Cylinder',
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      size: [2, 4, 2],
      color: '#F5CD30',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
    },
  },
  {
    id: 'basic-wedge',
    name: 'Wedge Ramp',
    category: 'basic',
    description: 'Sloped wedge block. Perfect for ramps, skate ramps, and roofs.',
    badge: 'Core',
    previewColor: '#28A745',
    template: {
      name: 'WedgePart',
      type: 'Part',
      shape: 'Wedge',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      size: [4, 2, 6],
      color: '#28A745',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
    },
  },

  // --- MECHANICS & GAMEPLAY MODULES ---
  {
    id: 'module-spawn-location',
    name: 'SpawnLocation',
    category: 'mechanics',
    description: 'Authentic Roblox spawn tile with decal emblem. Sets where players spawn and respawn.',
    badge: 'Essential',
    previewColor: '#FFFFFF',
    template: {
      name: 'SpawnLocation',
      type: 'SpawnLocation',
      shape: 'Block',
      position: [0, 0.4, 0],
      rotation: [0, 0, 0],
      size: [6, 0.8, 6],
      color: '#FFFFFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'spawn',
    },
  },
  {
    id: 'module-kill-brick',
    name: 'Lava / Kill Brick',
    category: 'mechanics',
    description: 'Glowing Neon red hazard brick with built-in Touched script. Kills player with Roblox "Oof" on contact!',
    badge: 'Scripted',
    previewColor: '#FF2200',
    template: {
      name: 'LavaKillBrick',
      type: 'Part',
      shape: 'Block',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      size: [6, 1, 6],
      color: '#FF2200',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.5,
      castShadow: false,
      behaviorType: 'kill_brick',
      behaviorParams: { damage: 100 },
      scriptCode: `-- Lava Kill Brick Script
local part = script.Parent

part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid:TakeDamage(100) -- Instant Oof!
        print("Player touched Lava! Health reduced to 0.")
    end
end)`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-speed-pad',
    name: 'Speed Boost Pad',
    category: 'mechanics',
    description: 'Neon blue turbo pad with arrow decal that gives the player a super speed rush for 4 seconds!',
    badge: 'Scripted',
    previewColor: '#00E5FF',
    template: {
      name: 'SpeedBoostPad',
      type: 'Part',
      shape: 'Block',
      position: [0, 0.2, 0],
      rotation: [0, 0, 0],
      size: [4, 0.4, 6],
      color: '#0066FF',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.2,
      castShadow: true,
      behaviorType: 'speed_pad',
      behaviorParams: { speedBoost: 2.2 },
      scriptCode: `-- Speed Boost Pad Script
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = 32 -- Default is 16
        print("Super Speed Activated! (WalkSpeed = 32)")
        wait(4)
        humanoid.WalkSpeed = 16
    end
end)`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-jump-pad',
    name: 'Super Jump Spring',
    category: 'mechanics',
    description: 'Neon green spring pad that launches the player high up into the air with a jump boost.',
    badge: 'Scripted',
    previewColor: '#00FF66',
    template: {
      name: 'SuperJumpPad',
      type: 'Part',
      shape: 'Block',
      position: [0, 0.3, 0],
      rotation: [0, 0, 0],
      size: [4, 0.6, 4],
      color: '#00FF66',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.3,
      castShadow: true,
      behaviorType: 'jump_pad',
      behaviorParams: { jumpBoost: 2.4 },
      scriptCode: `-- Super Jump Pad Script
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.JumpPower = 90
        print("Super Jump Launched!")
        wait(2)
        humanoid.JumpPower = 50
    end
end)`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-gold-coin',
    name: 'Collectible Gold Coin',
    category: 'mechanics',
    description: 'Spinning 3D gold coin that plays a sparkly chime and adds +10 to player coins when collected.',
    badge: 'Scripted',
    previewColor: '#FFD700',
    template: {
      name: 'GoldCoin',
      type: 'Part',
      shape: 'Cylinder',
      position: [0, 2, 0],
      rotation: [0, 0, 90],
      size: [0.4, 1.8, 1.8],
      color: '#FFD700',
      material: 'Neon',
      anchored: true,
      canCollide: false,
      transparency: 0,
      reflectance: 0.8,
      castShadow: true,
      behaviorType: 'coin',
      behaviorParams: { coinValue: 10, spinSpeed: 3 },
      scriptCode: `-- Collectible Coin Script
local coin = script.Parent

coin.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        player.leaderstats.Coins.Value = player.leaderstats.Coins.Value + 10
        print("Collected Gold Coin! +10 Coins")
        coin:Destroy()
    end
end)`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-spinning-laser',
    name: 'Spinning Laser Hazard',
    category: 'mechanics',
    description: 'Continuously rotating neon red obstacle bar. Classic obby challenge to jump over!',
    badge: 'Scripted',
    previewColor: '#FF0055',
    template: {
      name: 'SpinningLaser',
      type: 'Part',
      shape: 'Block',
      position: [0, 1.2, 0],
      rotation: [0, 0, 0],
      size: [12, 0.8, 1],
      color: '#FF0055',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.5,
      castShadow: true,
      behaviorType: 'spinner',
      behaviorParams: { damage: 100, spinSpeed: 2.5 },
      scriptCode: `-- Continuously Spinning Laser Bar
local part = script.Parent

while true do
    part.CFrame = part.CFrame * CFrame.Angles(0, math.rad(3), 0)
    wait(0.03)
end`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-moving-platform',
    name: 'Moving Platform / Elevator',
    category: 'mechanics',
    description: 'Smoothly gliding platform that moves back and forth along an axis.',
    badge: 'Scripted',
    previewColor: '#00BBFF',
    template: {
      name: 'MovingPlatform',
      type: 'Part',
      shape: 'Block',
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      size: [6, 1, 6],
      color: '#00BBFF',
      material: 'Metal',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.2,
      castShadow: true,
      behaviorType: 'moving_platform',
      behaviorParams: { moveAxis: 'x', moveDistance: 12, moveSpeed: 2 },
      scriptCode: `-- Tween Moving Platform
local TweenService = game:GetService("TweenService")
local part = script.Parent

local tweenInfo = TweenInfo.new(3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, true)
local goal = { Position = part.Position + Vector3.new(12, 0, 0) }
local tween = TweenService:Create(part, tweenInfo, goal)
tween:Play()`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-disappearing-tile',
    name: 'Disappearing Tile',
    category: 'mechanics',
    description: 'Stepping on this platform turns it semi-transparent, drops collision after 0.7s, and respawns in 3s!',
    badge: 'Scripted',
    previewColor: '#E0AAFF',
    template: {
      name: 'DisappearingTile',
      type: 'Part',
      shape: 'Block',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      size: [4, 0.8, 4],
      color: '#E0AAFF',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.1,
      castShadow: true,
      behaviorType: 'disappearing',
      behaviorParams: { disappearDelay: 0.7, respawnDelay: 3 },
      scriptCode: `-- Disappearing Block Script
local part = script.Parent
local debounce = false

part.Touched:Connect(function()
    if not debounce then
        debounce = true
        wait(0.7)
        part.Transparency = 0.8
        part.CanCollide = false
        wait(3)
        part.Transparency = 0
        part.CanCollide = true
        debounce = false
    end
end)`,
      scriptEnabled: true,
    },
  },
  {
    id: 'module-checkpoint',
    name: 'Obby Checkpoint',
    category: 'mechanics',
    description: 'Stage checkpoint pad. Turns bright neon green when touched and updates respawn point.',
    badge: 'Scripted',
    previewColor: '#FFDD00',
    template: {
      name: 'Checkpoint',
      type: 'Part',
      shape: 'Block',
      position: [0, 0.3, 0],
      rotation: [0, 0, 0],
      size: [5, 0.6, 5],
      color: '#FFDD00',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.3,
      castShadow: true,
      behaviorType: 'checkpoint',
      scriptCode: `-- Obby Stage Checkpoint
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        pad.BrickColor = BrickColor.new("Lime green")
        print("Checkpoint saved! Stage updated.")
    end
end)`,
      scriptEnabled: true,
    },
  },

  // --- BUILDINGS & ARCHITECTURE ---
  {
    id: 'module-roblox-house',
    name: 'Classic Roblox House',
    category: 'buildings',
    description: 'Full composite structure with brick walls, pitched red roof, doorway, and glass window.',
    badge: 'Composite',
    previewColor: '#C43224',
    template: {
      name: 'RobloxHouse',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [10, 6, 12],
      color: '#E0D0B8',
      material: 'Brick',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Floor
        { id: 'h-floor', name: 'Floor', shape: 'Block', offset: [0, 0.2, 0], rotation: [0, 0, 0], size: [10, 0.4, 12], color: '#6A4A3A', material: 'Wood' },
        // Back wall
        { id: 'h-bwall', name: 'BackWall', shape: 'Block', offset: [0, 3, -5.8], rotation: [0, 0, 0], size: [10, 6, 0.4], color: '#C03020', material: 'Brick' },
        // Left wall
        { id: 'h-lwall', name: 'LeftWall', shape: 'Block', offset: [-4.8, 3, 0], rotation: [0, 0, 0], size: [0.4, 6, 12], color: '#C03020', material: 'Brick' },
        // Right wall
        { id: 'h-rwall', name: 'RightWall', shape: 'Block', offset: [4.8, 3, 0], rotation: [0, 0, 0], size: [0.4, 6, 12], color: '#C03020', material: 'Brick' },
        // Front wall left
        { id: 'h-fwall1', name: 'FrontWallLeft', shape: 'Block', offset: [-3, 3, 5.8], rotation: [0, 0, 0], size: [4, 6, 0.4], color: '#C03020', material: 'Brick' },
        // Front wall right
        { id: 'h-fwall2', name: 'FrontWallRight', shape: 'Block', offset: [3, 3, 5.8], rotation: [0, 0, 0], size: [4, 6, 0.4], color: '#C03020', material: 'Brick' },
        // Roof
        { id: 'h-roof', name: 'PitchedRoof', shape: 'Wedge', offset: [0, 7.5, 0], rotation: [0, 0, 0], size: [11, 3, 13], color: '#2B2B2B', material: 'SmoothPlastic' },
        // Door
        { id: 'h-door', name: 'Door', shape: 'Block', offset: [0, 2, 5.8], rotation: [0, 0, 0], size: [2, 4, 0.2], color: '#5C381E', material: 'Wood', canCollide: false },
      ],
    },
  },
  {
    id: 'module-castle-tower',
    name: 'Castle Battlement Tower',
    category: 'buildings',
    description: 'Medieval stone tower with crenelated battlements and lookout deck.',
    badge: 'Composite',
    previewColor: '#787878',
    template: {
      name: 'CastleTower',
      type: 'Model',
      shape: 'Cylinder',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [8, 16, 8],
      color: '#6E7072',
      material: 'Brick',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'ct-body', name: 'TowerCylinder', shape: 'Cylinder', offset: [0, 7, 0], rotation: [0, 0, 0], size: [7, 14, 7], color: '#6E7072', material: 'Brick' },
        { id: 'ct-deck', name: 'TopDeck', shape: 'Cylinder', offset: [0, 14.2, 0], rotation: [0, 0, 0], size: [8.5, 0.6, 8.5], color: '#4E5052', material: 'Brick' },
        { id: 'ct-m1', name: 'Crenel1', shape: 'Block', offset: [0, 15, 3.8], rotation: [0, 0, 0], size: [2, 1.4, 0.8], color: '#5E6062', material: 'Brick' },
        { id: 'ct-m2', name: 'Crenel2', shape: 'Block', offset: [0, 15, -3.8], rotation: [0, 0, 0], size: [2, 1.4, 0.8], color: '#5E6062', material: 'Brick' },
        { id: 'ct-m3', name: 'Crenel3', shape: 'Block', offset: [3.8, 15, 0], rotation: [0, 0, 0], size: [0.8, 1.4, 2], color: '#5E6062', material: 'Brick' },
        { id: 'ct-m4', name: 'Crenel4', shape: 'Block', offset: [-3.8, 15, 0], rotation: [0, 0, 0], size: [0.8, 1.4, 2], color: '#5E6062', material: 'Brick' },
      ],
    },
  },
  {
    id: 'module-spiral-stairs',
    name: 'Modular Stairs Set',
    category: 'buildings',
    description: 'Set of clean steps to connect elevated platforms in your map.',
    badge: 'Modular',
    previewColor: '#B0B0B0',
    template: {
      name: 'Stairs',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [6, 4, 8],
      color: '#A0A0A0',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'st-1', name: 'Step1', shape: 'Block', offset: [0, 0.4, 3], rotation: [0, 0, 0], size: [5, 0.8, 2], color: '#909090', material: 'SmoothPlastic' },
        { id: 'st-2', name: 'Step2', shape: 'Block', offset: [0, 1.2, 1], rotation: [0, 0, 0], size: [5, 0.8, 2], color: '#989898', material: 'SmoothPlastic' },
        { id: 'st-3', name: 'Step3', shape: 'Block', offset: [0, 2.0, -1], rotation: [0, 0, 0], size: [5, 0.8, 2], color: '#A0A0A0', material: 'SmoothPlastic' },
        { id: 'st-4', name: 'Step4', shape: 'Block', offset: [0, 2.8, -3], rotation: [0, 0, 0], size: [5, 0.8, 2], color: '#A8A8A8', material: 'SmoothPlastic' },
      ],
    },
  },

  // --- NATURE & ENVIRONMENT ---
  {
    id: 'module-roblox-tree',
    name: 'Classic Stud Tree',
    category: 'nature',
    description: 'Iconic Roblox tree with brown trunk and tiered block foliage clusters.',
    badge: 'Popular',
    previewColor: '#28883B',
    template: {
      name: 'RobloxTree',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [7, 12, 7],
      color: '#28883B',
      material: 'Wood',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 't-trunk', name: 'Trunk', shape: 'Block', offset: [0, 3, 0], rotation: [0, 0, 0], size: [2, 6, 2], color: '#5A3825', material: 'Wood' },
        { id: 't-f1', name: 'FoliageBase', shape: 'Block', offset: [0, 6.5, 0], rotation: [0, 0, 0], size: [6.5, 2.5, 6.5], color: '#2E8B3A', material: 'Grass' },
        { id: 't-f2', name: 'FoliageMid', shape: 'Block', offset: [0, 8.5, 0], rotation: [0, 0, 0], size: [5, 2.5, 5], color: '#3BA047', material: 'Grass' },
        { id: 't-f3', name: 'FoliageTop', shape: 'Block', offset: [0, 10.5, 0], rotation: [0, 0, 0], size: [3.5, 2, 3.5], color: '#4CB557', material: 'Grass' },
      ],
    },
  },
  {
    id: 'module-street-light',
    name: 'Street Lamp Post',
    category: 'nature',
    description: 'Working urban street lamp with glowing neon lantern and cast light.',
    badge: 'Lighting',
    previewColor: '#FFF275',
    template: {
      name: 'StreetLamp',
      type: 'Model',
      shape: 'Cylinder',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [2, 9, 2],
      color: '#333333',
      material: 'Metal',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.2,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'sl-post', name: 'Post', shape: 'Cylinder', offset: [0, 4, 0], rotation: [0, 0, 0], size: [0.6, 8, 0.6], color: '#2B2D2F', material: 'Metal' },
        { id: 'sl-arm', name: 'Arm', shape: 'Block', offset: [0.8, 7.8, 0], rotation: [0, 0, 0], size: [1.6, 0.4, 0.4], color: '#2B2D2F', material: 'Metal' },
        { id: 'sl-glow', name: 'LampGlow', shape: 'Block', offset: [1.5, 7.2, 0], rotation: [0, 0, 0], size: [1, 1, 1], color: '#FFF888', material: 'Neon' },
      ],
    },
  },
  {
    id: 'module-campfire',
    name: 'Campfire',
    category: 'nature',
    description: 'Cozy stone circle with logs and glowing fire core.',
    badge: 'Decor',
    previewColor: '#FF6B00',
    template: {
      name: 'Campfire',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [4, 2, 4],
      color: '#FF6B00',
      material: 'Neon',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'cf-r1', name: 'StoneRing', shape: 'Cylinder', offset: [0, 0.3, 0], rotation: [0, 0, 0], size: [3.8, 0.6, 3.8], color: '#555555', material: 'Brick' },
        { id: 'cf-l1', name: 'Log1', shape: 'Cylinder', offset: [0, 0.6, 0], rotation: [0, 45, 0], size: [0.5, 2.8, 0.5], color: '#4A2A1A', material: 'Wood' },
        { id: 'cf-l2', name: 'Log2', shape: 'Cylinder', offset: [0, 0.6, 0], rotation: [0, -45, 0], size: [0.5, 2.8, 0.5], color: '#4A2A1A', material: 'Wood' },
        { id: 'cf-fire', name: 'FireCore', shape: 'Ball', offset: [0, 1.2, 0], rotation: [0, 0, 0], size: [1.4, 1.8, 1.4], color: '#FF7700', material: 'Neon' },
      ],
    },
  },

  // --- VEHICLES & CHARACTERS ---
  {
    id: 'module-roblox-car',
    name: 'Roblox Classic Car',
    category: 'vehicles',
    description: 'Chunky blocky retro Roblox cruiser with tires, bumper, and headlights.',
    badge: 'Vehicle',
    previewColor: '#FF2A2A',
    template: {
      name: 'RobloxCar',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [6, 3, 10],
      color: '#E61E2A',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0.2,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Chassis
        { id: 'c-body', name: 'Chassis', shape: 'Block', offset: [0, 1.2, 0], rotation: [0, 0, 0], size: [5, 1.4, 9], color: '#E61E2A', material: 'SmoothPlastic' },
        // Cabin
        { id: 'c-cabin', name: 'Cabin', shape: 'Block', offset: [0, 2.3, -0.6], rotation: [0, 0, 0], size: [4.4, 1.2, 4.5], color: '#1B1B1E', material: 'Glass', transparency: 0.3 },
        // Wheels
        { id: 'c-w1', name: 'WheelFL', shape: 'Cylinder', offset: [-2.6, 0.8, 2.5], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#181818', material: 'SmoothPlastic' },
        { id: 'c-w2', name: 'WheelFR', shape: 'Cylinder', offset: [2.6, 0.8, 2.5], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#181818', material: 'SmoothPlastic' },
        { id: 'c-w3', name: 'WheelBL', shape: 'Cylinder', offset: [-2.6, 0.8, -2.5], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#181818', material: 'SmoothPlastic' },
        { id: 'c-w4', name: 'WheelBR', shape: 'Cylinder', offset: [2.6, 0.8, -2.5], rotation: [0, 0, 90], size: [0.8, 1.6, 1.6], color: '#181818', material: 'SmoothPlastic' },
        // Headlights
        { id: 'c-hl1', name: 'HeadlightL', shape: 'Block', offset: [-1.6, 1.2, 4.5], rotation: [0, 0, 0], size: [0.8, 0.5, 0.2], color: '#FFF466', material: 'Neon' },
        { id: 'c-hl2', name: 'HeadlightR', shape: 'Block', offset: [1.6, 1.2, 4.5], rotation: [0, 0, 0], size: [0.8, 0.5, 0.2], color: '#FFF466', material: 'Neon' },
      ],
    },
  },
  {
    id: 'module-bacon-npc',
    name: 'Bacon Hair NPC',
    category: 'vehicles',
    description: 'OP_NitinGamer style Roblox avatar NPC as seen in your screenshots! Ready to populate your world.',
    badge: 'NPC',
    previewColor: '#5C381E',
    template: {
      name: 'OP_NitinGamer_NPC',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [3, 5, 1.5],
      color: '#1A1A1A',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        // Head
        { id: 'npc-head', name: 'Head', shape: 'Block', offset: [0, 4.2, 0], rotation: [0, 0, 0], size: [1.2, 1.2, 1.2], color: '#FFF5B8', material: 'SmoothPlastic' },
        // Hair
        { id: 'npc-hair', name: 'BaconHair', shape: 'Block', offset: [0, 4.8, 0.1], rotation: [0, 0, 0], size: [1.5, 0.6, 1.5], color: '#6A3D18', material: 'SmoothPlastic' },
        // Torso
        { id: 'npc-torso', name: 'Torso', shape: 'Block', offset: [0, 2.6, 0], rotation: [0, 0, 0], size: [2, 2, 1], color: '#0066CC', material: 'SmoothPlastic' },
        // Left Arm
        { id: 'npc-larm', name: 'LeftArm', shape: 'Block', offset: [-1.5, 2.6, 0], rotation: [0, 0, 0], size: [1, 2, 1], color: '#FFF5B8', material: 'SmoothPlastic' },
        // Right Arm
        { id: 'npc-rarm', name: 'RightArm', shape: 'Block', offset: [1.5, 2.6, 0], rotation: [0, 0, 0], size: [1, 2, 1], color: '#FFF5B8', material: 'SmoothPlastic' },
        // Left Leg
        { id: 'npc-lleg', name: 'LeftLeg', shape: 'Block', offset: [-0.5, 0.8, 0], rotation: [0, 0, 0], size: [1, 1.6, 1], color: '#1B242A', material: 'SmoothPlastic' },
        // Right Leg
        { id: 'npc-rleg', name: 'RightLeg', shape: 'Block', offset: [0.5, 0.8, 0], rotation: [0, 0, 0], size: [1, 1.6, 1], color: '#1B242A', material: 'SmoothPlastic' },
      ],
    },
  },
  {
    id: 'module-noob-npc',
    name: 'Classic Noob Character',
    category: 'vehicles',
    description: 'The legendary Roblox Noob (Yellow head/arms, Blue torso, Green legs).',
    badge: 'NPC',
    previewColor: '#0055FF',
    template: {
      name: 'ClassicNoob',
      type: 'Model',
      shape: 'Block',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      size: [3, 5, 1.5],
      color: '#FFDE00',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
      subParts: [
        { id: 'nb-head', name: 'Head', shape: 'Block', offset: [0, 4.2, 0], rotation: [0, 0, 0], size: [1.2, 1.2, 1.2], color: '#FFDE00', material: 'SmoothPlastic' },
        { id: 'nb-torso', name: 'Torso', shape: 'Block', offset: [0, 2.6, 0], rotation: [0, 0, 0], size: [2, 2, 1], color: '#0055FF', material: 'SmoothPlastic' },
        { id: 'nb-larm', name: 'LeftArm', shape: 'Block', offset: [-1.5, 2.6, 0], rotation: [0, 0, 0], size: [1, 2, 1], color: '#FFDE00', material: 'SmoothPlastic' },
        { id: 'nb-rarm', name: 'RightArm', shape: 'Block', offset: [1.5, 2.6, 0], rotation: [0, 0, 0], size: [1, 2, 1], color: '#FFDE00', material: 'SmoothPlastic' },
        { id: 'nb-lleg', name: 'LeftLeg', shape: 'Block', offset: [-0.5, 0.8, 0], rotation: [0, 0, 0], size: [1, 1.6, 1], color: '#27B836', material: 'SmoothPlastic' },
        { id: 'nb-rleg', name: 'RightLeg', shape: 'Block', offset: [0.5, 0.8, 0], rotation: [0, 0, 0], size: [1, 1.6, 1], color: '#27B836', material: 'SmoothPlastic' },
      ],
    },
  },
];

// Pre-packaged Lua script templates
export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'template-kill-brick',
    title: 'Lava / Kill Brick on Touch',
    description: 'Instantly damages or resets player when stepped on',
    behaviorType: 'kill_brick',
    code: `-- Kill Brick (Lava) Script
local part = script.Parent

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
        print("Player touched Lava! Resetting...")
    end
end

part.Touched:Connect(onTouched)`,
  },
  {
    id: 'template-rotator',
    title: 'Spinning Object (Rotator)',
    description: 'Continuously spins an object in 3D around its Y axis',
    behaviorType: 'spinner',
    code: `-- Continuous Spinner Script
local part = script.Parent
local rotationSpeed = 3 -- degrees per frame

while true do
    part.Orientation = part.Orientation + Vector3.new(0, rotationSpeed, 0)
    wait(0.02)
end`,
  },
  {
    id: 'template-moving-platform',
    title: 'Moving Platform / Elevator',
    description: 'Smoothly moves a platform back and forth between two positions',
    behaviorType: 'moving_platform',
    code: `-- Moving Platform Script
local part = script.Parent
local startPos = part.Position
local distance = 16
local speed = 2

while true do
    -- Move forward
    for i = 0, distance, 0.5 do
        part.Position = startPos + Vector3.new(i, 0, 0)
        wait(0.03)
    end
    wait(0.5)
    -- Move backward
    for i = distance, 0, -0.5 do
        part.Position = startPos + Vector3.new(i, 0, 0)
        wait(0.03)
    end
    wait(0.5)
end`,
  },
  {
    id: 'template-speed-pad',
    title: 'Speed Boost Pad',
    description: 'Increases player movement speed for a short duration',
    behaviorType: 'speed_pad',
    code: `-- Speed Boost Pad Script
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid and humanoid.WalkSpeed == 16 then
        humanoid.WalkSpeed = 36 -- Boosted speed!
        print("Speed Boost Activated!")
        wait(3.5)
        humanoid.WalkSpeed = 16 -- Normal speed
        print("Speed returned to normal.")
    end
end)`,
  },
  {
    id: 'template-jump-pad',
    title: 'High Jump Pad',
    description: 'Launches player upward with intense spring bounce',
    behaviorType: 'jump_pad',
    code: `-- High Jump Spring Pad Script
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.JumpPower = 100 -- Super jump!
        print("Super Jump Launched!")
        wait(2)
        humanoid.JumpPower = 50 -- Reset
    end
end)`,
  },
  {
    id: 'template-coin',
    title: 'Coin Collector with Score',
    description: 'Awards coins, plays sound, and vanishes on touch',
    behaviorType: 'coin',
    code: `-- Coin Pickup Script
local coin = script.Parent

coin.Touched:Connect(function(hit)
    local character = hit.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    if player then
        player.leaderstats.Coins.Value = player.leaderstats.Coins.Value + 10
        print("Awarded 10 Coins to " .. player.Name)
        coin:Destroy()
    end
end)`,
  },
  {
    id: 'template-rainbow',
    title: 'Rainbow Color Shift',
    description: 'Cycles object color smoothly through the RGB rainbow',
    behaviorType: 'custom_script',
    code: `-- Rainbow Color Cycle Script
local part = script.Parent

while true do
    for hue = 0, 1, 0.01 do
        part.Color = Color3.fromHSV(hue, 1, 1)
        wait(0.05)
    end
end`,
  },
];

// Preset Starter Maps
export const STARTER_TEMPLATES: Record<string, { name: string; description: string; objects: RobloxObject[] }> = {
  baseplate: {
    name: 'Classic Baseplate',
    description: 'Clean Roblox baseplate with standard SpawnLocation.',
    objects: [
      {
        id: 'spawn-default',
        name: 'SpawnLocation',
        type: 'SpawnLocation' as const,
        shape: 'Block' as const,
        position: [0, 0.4, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [6, 0.8, 6] as [number, number, number],
        color: '#FFFFFF',
        material: 'SmoothPlastic' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0,
        castShadow: true,
        behaviorType: 'spawn' as const,
      },
    ],
  },
  obby: {
    name: 'Classic Obby Course',
    description: 'Ready-to-play obstacle course with lava jumps, speed boost, moving platform, and coins!',
    objects: [
      {
        id: 'spawn-obby',
        name: 'SpawnLocation',
        type: 'SpawnLocation' as const,
        shape: 'Block' as const,
        position: [0, 0.4, -20] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [6, 0.8, 6] as [number, number, number],
        color: '#FFFFFF',
        material: 'SmoothPlastic' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0,
        castShadow: true,
        behaviorType: 'spawn' as const,
      },
      // First jumps
      {
        id: 'plat-1',
        name: 'JumpPlatform1',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 1, -12] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [4, 1, 4] as [number, number, number],
        color: '#00A2FF',
        material: 'SmoothPlastic' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0,
        castShadow: true,
        behaviorType: 'none' as const,
      },
      {
        id: 'plat-2',
        name: 'JumpPlatform2',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 2, -4] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [4, 1, 4] as [number, number, number],
        color: '#28A745',
        material: 'SmoothPlastic' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0,
        castShadow: true,
        behaviorType: 'none' as const,
      },
      // Lava brick in between
      {
        id: 'lava-1',
        name: 'LavaHazard',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 0.5, 4] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [10, 1, 6] as [number, number, number],
        color: '#FF2200',
        material: 'Neon' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0.5,
        castShadow: true,
        behaviorType: 'kill_brick' as const,
        behaviorParams: { damage: 100 },
      },
      // Speed Boost Pad
      {
        id: 'speed-1',
        name: 'SpeedBoostPad',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 2.5, 12] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [4, 0.4, 6] as [number, number, number],
        color: '#00E5FF',
        material: 'Neon' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0.3,
        castShadow: true,
        behaviorType: 'speed_pad' as const,
        behaviorParams: { speedBoost: 2.2 },
      },
      // Moving Platform
      {
        id: 'moving-1',
        name: 'MovingPlatform',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 4, 22] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [5, 0.8, 5] as [number, number, number],
        color: '#FFC107',
        material: 'Metal' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0.2,
        castShadow: true,
        behaviorType: 'moving_platform' as const,
        behaviorParams: { moveAxis: 'x' as const, moveDistance: 10, moveSpeed: 2 },
      },
      // Super Jump Pad
      {
        id: 'jump-pad-1',
        name: 'SuperJumpPad',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 4, 32] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [4, 0.6, 4] as [number, number, number],
        color: '#00FF66',
        material: 'Neon' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0.3,
        castShadow: true,
        behaviorType: 'jump_pad' as const,
        behaviorParams: { jumpBoost: 2.5 },
      },
      // Finish platform with Coins
      {
        id: 'finish-plat',
        name: 'WinnerPodium',
        type: 'Part' as const,
        shape: 'Block' as const,
        position: [0, 9, 44] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        size: [10, 1.2, 10] as [number, number, number],
        color: '#9C27B0',
        material: 'SmoothPlastic' as const,
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0.2,
        castShadow: true,
        behaviorType: 'checkpoint' as const,
      },
      {
        id: 'coin-1',
        name: 'GoldCoinTrophy',
        type: 'Part' as const,
        shape: 'Cylinder' as const,
        position: [0, 11, 44] as [number, number, number],
        rotation: [0, 0, 90] as [number, number, number],
        size: [0.5, 2.5, 2.5] as [number, number, number],
        color: '#FFD700',
        material: 'Neon' as const,
        anchored: true,
        canCollide: false,
        transparency: 0,
        reflectance: 0.8,
        castShadow: true,
        behaviorType: 'coin' as const,
        behaviorParams: { coinValue: 50, spinSpeed: 3 },
      },
    ],
  },
};
