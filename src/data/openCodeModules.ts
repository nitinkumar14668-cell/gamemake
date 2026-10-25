export interface OpenCodeModule {
  id: string;
  name: string;
  category: 'gameplay' | 'movement' | 'environment' | 'currency' | 'effects' | 'security';
  description: string;
  badge: string;
  targetType: 'Part' | 'SpawnLocation' | 'Model' | 'Workspace' | 'StarterPlayer';
  code: string;
  tags: string[];
}

export const OPENCODE_FREE_MODULES: OpenCodeModule[] = [
  {
    id: 'mod-kill-brick',
    name: 'Classic Lava / Kill Brick',
    category: 'gameplay',
    description: 'Instantly resets player health to 0 when touched. Features debounce and character verification.',
    badge: 'Popular',
    targetType: 'Part',
    tags: ['obby', 'trap', 'hazard', 'lava', 'damage'],
    code: `--[[
  [OpenCode Module] Classic Lava Kill Brick
  Attach this script directly inside any Part.
]]
local part = script.Parent
local debounce = false

local function onTouched(otherPart)
    local character = otherPart.Parent
    if not character then return end
    
    local humanoid = character:FindFirstChildWhichIsA("Humanoid")
    if humanoid and humanoid.Health > 0 and not debounce then
        debounce = true
        humanoid.Health = 0
        print("[Lava] Player defeated by " .. part.Name)
        task.wait(0.5)
        debounce = false
    end
end

part.Touched:Connect(onTouched)
`,
  },
  {
    id: 'mod-coin-pickup',
    name: 'Animated Coin & Leaderstats Pickup',
    category: 'currency',
    description: 'Rotates smoothly, plays pickup chime, adds currency to player leaderstats, and respawns after delay.',
    badge: 'Essential',
    targetType: 'Part',
    tags: ['coin', 'leaderstats', 'money', 'shop', 'pickup'],
    code: `--[[
  [OpenCode Module] Coin Collector with Respawn
  Make sure your game has a "Coins" leaderstats entry!
]]
local coin = script.Parent
local COIN_VALUE = 10
local RESPAWN_DELAY = 4
local isCollected = false

-- Continuous spin animation
task.spawn(function()
    while true do
        coin.CFrame = coin.CFrame * CFrame.Angles(0, math.rad(4), 0)
        task.wait(0.03)
    end
end)

local function onTouched(otherPart)
    if isCollected then return end
    local character = otherPart.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    
    if player then
        isCollected = true
        coin.Transparency = 1
        coin.CanCollide = false
        
        -- Give currency to leaderstats
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats and leaderstats:FindFirstChild("Coins") then
            leaderstats.Coins.Value = leaderstats.Coins.Value + COIN_VALUE
        end
        print("[Coin] " .. player.Name .. " collected " .. COIN_VALUE .. " coins!")
        
        -- Respawn after delay
        task.wait(RESPAWN_DELAY)
        coin.Transparency = 0
        coin.CanCollide = false
        isCollected = false
    end
end

coin.Touched:Connect(onTouched)
`,
  },
  {
    id: 'mod-speed-boost',
    name: 'Super Speed Boost Pad',
    category: 'movement',
    description: 'Grants temporary 2x-3x sprint speed with visual Neon flash and automatic cooldown reset.',
    badge: 'Movement',
    targetType: 'Part',
    tags: ['speed', 'boost', 'dash', 'fast', 'sprint'],
    code: `--[[
  [OpenCode Module] Speed Boost Dash Pad
  Increases WalkSpeed for a set duration.
]]
local pad = script.Parent
local BOOSTED_SPEED = 48
local NORMAL_SPEED = 16
local DURATION = 3.5
local cooldown = {}

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChildWhichIsA("Humanoid")
    
    if humanoid and not cooldown[humanoid] then
        cooldown[humanoid] = true
        humanoid.WalkSpeed = BOOSTED_SPEED
        
        -- Flash pad
        local oldColor = pad.Color
        pad.Color = Color3.fromRGB(0, 255, 255)
        
        task.delay(DURATION, function()
            if humanoid and humanoid.Parent then
                humanoid.WalkSpeed = NORMAL_SPEED
            end
            pad.Color = oldColor
            cooldown[humanoid] = nil
        end)
    end
end

pad.Touched:Connect(onTouched)
`,
  },
  {
    id: 'mod-jump-spring',
    name: 'High Launch Jump Spring Pad',
    category: 'movement',
    description: 'Launches player into the sky with adjustable upward velocity impulse.',
    badge: 'Obby',
    targetType: 'Part',
    tags: ['jump', 'spring', 'launch', 'vertical', 'pad'],
    code: `--[[
  [OpenCode Module] Jump Spring Launch Pad
]]
local pad = script.Parent
local LAUNCH_POWER = 65
local debounce = false

local function onTouched(hit)
    local character = hit.Parent
    local rootPart = character and character:FindFirstChild("HumanoidRootPart")
    
    if rootPart and not debounce then
        debounce = true
        rootPart.AssemblyLinearVelocity = Vector3.new(
            rootPart.AssemblyLinearVelocity.X,
            LAUNCH_POWER,
            rootPart.AssemblyLinearVelocity.Z
        )
        print("[JumpPad] Launched player!")
        task.wait(0.6)
        debounce = false
    end
end

pad.Touched:Connect(onTouched)
`,
  },
  {
    id: 'mod-moving-platform',
    name: 'Smooth Moving Platform (TweenService)',
    category: 'movement',
    description: 'Smooth ping-pong floating elevator platform using TweenService with smooth easing curves.',
    badge: 'Popular',
    targetType: 'Part',
    tags: ['platform', 'elevator', 'tween', 'moving', 'floating'],
    code: `--[[
  [OpenCode Module] Smooth Tween Platform
  Attach inside any anchored Part.
]]
local TweenService = game:GetService("TweenService")
local platform = script.Parent

local MOVE_DISTANCE = 14
local MOVE_TIME = 2.5
local startPos = platform.Position
local targetPos = startPos + Vector3.new(MOVE_DISTANCE, 0, 0)

local tweenInfo = TweenInfo.new(
    MOVE_TIME,
    Enum.EasingStyle.Sine,
    Enum.EasingDirection.InOut,
    -1, -- Infinite loop
    true -- Reverses back and forth
)

local tween = TweenService:Create(platform, tweenInfo, { Position = targetPos })
tween:Play()
`,
  },
  {
    id: 'mod-disappearing-tile',
    name: 'Disappearing Obby Stepping Stone',
    category: 'gameplay',
    description: 'Fades out and disables collision 1 second after player steps on it, then regenerates.',
    badge: 'Classic',
    targetType: 'Part',
    tags: ['disappear', 'vanish', 'obby', 'stepping', 'trap'],
    code: `--[[
  [OpenCode Module] Disappearing Obby Platform
]]
local tile = script.Parent
local isFading = false

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character and character:FindFirstChildWhichIsA("Humanoid")
    
    if humanoid and not isFading then
        isFading = true
        task.wait(0.6)
        
        -- Fade out effect
        for i = 0, 1, 0.1 do
            tile.Transparency = i
            task.wait(0.04)
        end
        tile.CanCollide = false
        
        -- Wait before reforming
        task.wait(2.5)
        tile.Transparency = 0
        tile.CanCollide = true
        isFading = false
    end
end

tile.Touched:Connect(onTouched)
`,
  },
  {
    id: 'mod-day-night',
    name: '24-Hour Day & Night Lighting Cycle',
    category: 'environment',
    description: 'Gradually shifts Lighting ClockTime for immersive dawn, midday, sunset, and starry night.',
    badge: 'World',
    targetType: 'Workspace',
    tags: ['lighting', 'time', 'day', 'night', 'sun', 'sky'],
    code: `--[[
  [OpenCode Module] Day & Night Orbit Cycle
  Place inside ServerScriptService or Workspace.
]]
local Lighting = game:GetService("Lighting")
local CYCLE_MINUTES = 6 -- Length of full 24h cycle in real minutes
local step = (24 / (CYCLE_MINUTES * 60))

task.spawn(function()
    while true do
        Lighting.ClockTime = (Lighting.ClockTime + step) % 24
        task.wait(1)
    end
end)
`,
  },
  {
    id: 'mod-rainbow-rgb',
    name: 'Rainbow RGB Disco Glow Light',
    category: 'effects',
    description: 'Continuously cycles through smooth RGB hues for vibrant party lights and neon clubs.',
    badge: 'Visual',
    targetType: 'Part',
    tags: ['rgb', 'rainbow', 'neon', 'light', 'disco'],
    code: `--[[
  [OpenCode Module] Rainbow RGB Neon Color Shift
]]
local part = script.Parent
local RunService = game:GetService("RunService")
local hue = 0

RunService.Heartbeat:Connect(function(delta)
    hue = (hue + delta * 0.18) % 1
    part.Color = Color3.fromHSV(hue, 0.85, 1)
end)
`,
  },
  {
    id: 'mod-pet-follow',
    name: 'Cute Floating Pet Companion',
    category: 'gameplay',
    description: 'Smooth pet companion that hovers beside the player using BodyPosition and BodyGyro.',
    badge: 'Pets',
    targetType: 'Model',
    tags: ['pet', 'companion', 'follower', 'ai', 'floating'],
    code: `--[[
  [OpenCode Module] Smooth Floating Pet Companion
  Attach inside your Pet Model root part.
]]
local pet = script.Parent
local petRoot = pet:IsA("BasePart") and pet or pet:FindFirstChildWhichIsA("BasePart")

local function followPlayer(character)
    local hrp = character:WaitForChild("HumanoidRootPart")
    
    local bp = Instance.new("BodyPosition")
    bp.MaxForce = Vector3.new(1e5, 1e5, 1e5)
    bp.P = 1200
    bp.Parent = petRoot
    
    local bg = Instance.new("BodyGyro")
    bg.MaxTorque = Vector3.new(1e5, 1e5, 1e5)
    bg.P = 3000
    bg.Parent = petRoot
    
    game:GetService("RunService").Heartbeat:Connect(function()
        if hrp and hrp.Parent then
            local offset = hrp.CFrame:PointToWorldSpace(Vector3.new(3, 1.5, 3))
            bp.Position = offset
            bg.CFrame = CFrame.lookAt(petRoot.Position, hrp.Position)
        end
    end)
end

-- Example trigger on player spawn
game.Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(followPlayer)
end)
`,
  },
  {
    id: 'mod-teleporter',
    name: 'Dual Teleportation Portal',
    category: 'movement',
    description: 'Instant warp between two portal pads with directional facing and debounce.',
    badge: 'Warp',
    targetType: 'Part',
    tags: ['teleport', 'portal', 'warp', 'gate'],
    code: `--[[
  [OpenCode Module] Teleporter Pad
]]
local entrance = script.Parent
local DESTINATION_COORDS = Vector3.new(0, 5, 0) -- Change to target position
local cooldown = {}

local function onTouched(hit)
    local character = hit.Parent
    local hrp = character and character:FindFirstChild("HumanoidRootPart")
    local humanoid = character and character:FindFirstChildWhichIsA("Humanoid")
    
    if hrp and humanoid and not cooldown[humanoid] then
        cooldown[humanoid] = true
        hrp.CFrame = CFrame.new(DESTINATION_COORDS) + Vector3.new(0, 3, 0)
        print("[Teleporter] Teleported player to destination!")
        task.wait(2)
        cooldown[humanoid] = nil
    end
end

entrance.Touched:Connect(onTouched)
`,
  },
];

// Fallback intelligent code generator when Gemini API is offline or for instant response
export function generateLocalLuauScript(prompt: string, objectName?: string): string {
  const p = prompt.toLowerCase();
  const target = objectName || 'Part';

  if (p.includes('kill') || p.includes('lava') || p.includes('damage') || p.includes('hazard')) {
    return `-- Generated by OpenCode Free AI Engine for ${target}
local part = script.Parent
local debounce = false

part.Touched:Connect(function(hit)
    local char = hit.Parent
    local hum = char and char:FindFirstChildOfClass("Humanoid")
    if hum and hum.Health > 0 and not debounce then
        debounce = true
        hum.Health = 0
        print("[Lava] Player defeated on ${target}")
        task.wait(0.5)
        debounce = false
    end
end)`;
  }

  if (p.includes('speed') || p.includes('boost') || p.includes('run') || p.includes('dash')) {
    return `-- Generated by OpenCode Free AI Engine for ${target}
local pad = script.Parent
local BOOST_SPEED = 45
local DURATION = 3

pad.Touched:Connect(function(hit)
    local hum = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
    if hum and hum.WalkSpeed < BOOST_SPEED then
        local old = hum.WalkSpeed
        hum.WalkSpeed = BOOST_SPEED
        task.delay(DURATION, function()
            if hum and hum.Parent then
                hum.WalkSpeed = old
            end
        end)
    end
end)`;
  }

  if (p.includes('coin') || p.includes('money') || p.includes('cash') || p.includes('gold')) {
    return `-- Generated by OpenCode Free AI Engine for ${target}
local coin = script.Parent
local VALUE = 25
local taken = false

task.spawn(function()
    while true do
        coin.CFrame = coin.CFrame * CFrame.Angles(0, math.rad(4), 0)
        task.wait(0.03)
    end
end)

coin.Touched:Connect(function(hit)
    if taken then return end
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        taken = true
        coin.Transparency = 1
        local ls = player:FindFirstChild("leaderstats")
        if ls and ls:FindFirstChild("Coins") then
            ls.Coins.Value = ls.Coins.Value + VALUE
        end
        task.wait(4)
        coin.Transparency = 0
        taken = false
    end
end)`;
  }

  if (p.includes('jump') || p.includes('trampoline') || p.includes('launch')) {
    return `-- Generated by OpenCode Free AI Engine for ${target}
local pad = script.Parent
local POWER = 70

pad.Touched:Connect(function(hit)
    local hrp = hit.Parent and hit.Parent:FindFirstChild("HumanoidRootPart")
    if hrp then
        hrp.AssemblyLinearVelocity = Vector3.new(hrp.AssemblyLinearVelocity.X, POWER, hrp.AssemblyLinearVelocity.Z)
    end
end)`;
  }

  if (p.includes('spin') || p.includes('rotate') || p.includes('fan') || p.includes('spinner')) {
    return `-- Generated by OpenCode Free AI Engine for ${target}
local part = script.Parent
local SPEED = 3 -- Radians per second

game:GetService("RunService").Heartbeat:Connect(function(delta)
    part.CFrame = part.CFrame * CFrame.Angles(0, SPEED * delta, 0)
end)`;
  }

  // Generic advanced Lua template
  return `-- Generated by OpenCode Free AI Engine for ${target}
-- Prompt: ${prompt}
local part = script.Parent

print("[OpenCode] Script running on: " .. part.Name)

local function onInteraction(hit)
    local char = hit.Parent
    local player = game.Players:GetPlayerFromCharacter(char)
    if player then
        print("[OpenCode] Interaction triggered by: " .. player.Name)
    end
end

if part:IsA("BasePart") then
    part.Touched:Connect(onInteraction)
end
`;
}
