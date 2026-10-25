import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RobloxObject, ToolMode, PartShape, LightingSettings } from '../types/studio';
import {
  createRobloxGridTexture,
  createSpawnDecalTexture,
  createSpeedArrowTexture,
  createRobloxFaceTexture,
  createRobloxShirtTexture,
  getSkyboxTexture,
  getSkyboxAtmosphere,
} from '../utils/textures';
import { sound } from '../utils/audio';
import { ArrowUp, ArrowDown, Compass, Hand, Maximize2 } from 'lucide-react';

interface Viewport3DProps {
  objects: RobloxObject[];
  selectedId: string | null;
  toolMode: ToolMode;
  moveSnap: number;
  rotateSnap: number;
  isPlayMode: boolean;
  activePlacementModel: RobloxObject | null;
  placementRotation?: number;
  isBreakMode?: boolean;
  onDeleteObject?: (id: string) => void;
  lightingSettings: LightingSettings;
  onSelectObject: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<RobloxObject>) => void;
  onPlaceObject: (pos: [number, number, number], rotY?: number) => void;
  onCancelPlacement: () => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error') => void;
  playerHealth: number;
  playerCoins: number;
  onPlayerHealthChange: (hp: number) => void;
  onPlayerCoinsChange: (coins: number) => void;
  mobileMoveVector: { x: number; y: number };
  mobileJumpTrigger: number;
  mobileEmoteTrigger: number;
  mobileSprint?: boolean;
  showEditTouchControls?: boolean;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  objects,
  selectedId,
  toolMode,
  moveSnap,
  rotateSnap,
  isPlayMode,
  activePlacementModel,
  placementRotation = 0,
  isBreakMode = false,
  onDeleteObject,
  lightingSettings,
  onSelectObject,
  onUpdateObject,
  onPlaceObject,
  onCancelPlacement,
  onLog,
  playerHealth,
  playerCoins,
  onPlayerHealthChange,
  onPlayerCoinsChange,
  mobileMoveVector,
  mobileJumpTrigger,
  mobileEmoteTrigger,
  mobileSprint = false,
  showEditTouchControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Lights refs for dynamic lighting updates
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Mesh registries
  const meshesMapRef = useRef<Map<string, THREE.Group | THREE.Mesh>>(new Map());
  const ghostMeshRef = useRef<THREE.Group | null>(null);
  const gizmoGroupRef = useRef<THREE.Group | null>(null);

  // Player character rig
  const playerRigRef = useRef<{
    root: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    velocity: THREE.Vector3;
    isGrounded: boolean;
    walkSpeed: number;
    jumpPower: number;
    rotationY: number;
    walkCycle: number;
    emoteTimer: number;
  } | null>(null);

  // Interactive mouse / touch state
  const isDraggingGizmoRef = useRef(false);
  const activeGizmoAxisRef = useRef<'x' | 'y' | 'z' | null>(null);
  const dragStartPointRef = useRef(new THREE.Vector3());
  const objectStartPosRef = useRef<[number, number, number]>([0, 0, 0]);
  const objectStartSizeRef = useRef<[number, number, number]>([1, 1, 1]);
  const objectStartRotRef = useRef<[number, number, number]>([0, 0, 0]);

  // Smooth Camera orbit & fly target state
  const isOrbitingRef = useRef(false);
  const isPanningRef = useRef(false);
  const mousePrevRef = useRef({ x: 0, y: 0 });

  // Current & target values for smooth interpolation
  const currentAngleRef = useRef({ phi: Math.PI / 4, theta: Math.PI / 4, distance: 30 });
  const targetAngleRef = useRef({ phi: Math.PI / 4, theta: Math.PI / 4, distance: 30 });
  const currentCenterRef = useRef(new THREE.Vector3(0, 2, 0));
  const targetCenterRef = useRef(new THREE.Vector3(0, 2, 0));

  // Edit Mode Touch Joystick
  const editJoystickBaseRef = useRef<HTMLDivElement>(null);
  const [editJoystickPos, setEditJoystickPos] = useState<{ x: number; y: number } | null>(null);
  const editMoveVectorRef = useRef({ x: 0, y: 0 });
  const isDraggingEditJoyRef = useRef(false);

  // Multi-Touch tracking
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchTargetDistRef = useRef<number>(30);
  const prevPinchMidpointRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard input
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // Trigger cache
  const touchedThrottleRef = useRef<Map<string, number>>(new Map());

  // Synchronous refs for props so requestAnimationFrame loop NEVER reads stale state
  const mobileMoveVectorRef = useRef(mobileMoveVector);
  mobileMoveVectorRef.current = mobileMoveVector;

  const mobileSprintRef = useRef(mobileSprint);
  mobileSprintRef.current = mobileSprint;

  const isPlayModeRef = useRef(isPlayMode);
  isPlayModeRef.current = isPlayMode;

  const objectsRef = useRef(objects);
  objectsRef.current = objects;

  // Play Mode Third-Person Orbit Camera
  const playCamAngleRef = useRef({ yaw: 0, pitch: 0.28, distance: 15 });
  const isOrbitingPlayCamRef = useRef(false);
  const camPointerIdRef = useRef<number | null>(null);

  // Cached textures
  const texturesRef = useRef<{
    grid?: THREE.CanvasTexture;
    spawnDecal?: THREE.CanvasTexture;
    speedArrow?: THREE.CanvasTexture;
    face?: THREE.CanvasTexture;
    shirt?: THREE.CanvasTexture;
  }>({});

  // 1. Initial Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#78B6E8'); // Roblox blue sky
    scene.fog = new THREE.FogExp2('#97CEF2', 0.005);
    sceneRef.current = scene;

    // Textures init
    texturesRef.current = {
      grid: createRobloxGridTexture(),
      spawnDecal: createSpawnDecalTexture(),
      speedArrow: createSpeedArrowTexture(),
      face: createRobloxFaceTexture(),
      shirt: createRobloxShirtTexture(),
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(20, 20, 25);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Warm directional sun with soft shadows + hemisphere ambient)
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#6C839B', 0.7);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight('#FFF9E6', 1.25);
    sunLight.position.set(50, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const shadowD = 60;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Roblox Baseplate
    const baseplateGeo = new THREE.BoxGeometry(400, 2, 400);
    const baseplateMat = new THREE.MeshStandardMaterial({
      map: texturesRef.current.grid,
      roughness: 0.8,
      metalness: 0.1,
    });
    const baseplate = new THREE.Mesh(baseplateGeo, baseplateMat);
    baseplate.position.set(0, -1, 0);
    baseplate.receiveShadow = true;
    baseplate.userData = { isBaseplate: true };
    scene.add(baseplate);

    // Gizmo container
    const gizmoGroup = new THREE.Group();
    scene.add(gizmoGroup);
    gizmoGroupRef.current = gizmoGroup;

    // Ghost preview container
    const ghostGroup = new THREE.Group();
    scene.add(ghostGroup);
    ghostMeshRef.current = ghostGroup;

    // Responsive Canvas Resize Observer (instantly handles sidebar open/close & orientation changes)
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w <= 0 || h <= 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    // Keyboard listener for Play mode & shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      keysPressedRef.current[key] = true;
      if (e.key === ' ' || e.code === 'Space') {
        keysPressedRef.current['space'] = true;
      }
      if (key === 'shift' || e.shiftKey) {
        keysPressedRef.current['shift'] = true;
      }

      // In Play mode, E key triggers wave emote, R key respawns character
      if (isPlayModeRef.current) {
        if (key === 'e' && playerRigRef.current) {
          playerRigRef.current.emoteTimer = 2.5;
        } else if (key === 'r' && playerRigRef.current) {
          respawnPlayer(playerRigRef.current);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressedRef.current[key] = false;
      if (e.key === ' ' || e.code === 'Space') {
        keysPressedRef.current['space'] = false;
      }
      if (key === 'shift' || !e.shiftKey) {
        keysPressedRef.current['shift'] = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation Loop with Smooth Interpolation
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update interactive moving platforms / spinners
      updateMovingParts(delta);

      // Update Player if in Play mode
      if (playerRigRef.current && cameraRef.current) {
        updatePlayerController(delta);
      } else {
        // Smoothly update camera in Edit mode
        updateSmoothEditCamera(delta);
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Smooth Camera in Edit Mode (with joystick, damping, fly pan)
  const updateSmoothEditCamera = (delta: number) => {
    if (!cameraRef.current) return;

    // Process Edit Joystick / Fly input
    const joy = editMoveVectorRef.current;
    if (joy.x !== 0 || joy.y !== 0) {
      const speed = 25 * delta;
      // Fly direction relative to camera
      const forward = new THREE.Vector3();
      cameraRef.current.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).negate();

      targetCenterRef.current.addScaledVector(forward, -joy.y * speed);
      targetCenterRef.current.addScaledVector(right, joy.x * speed);
    }

    // Smooth lerp for center
    currentCenterRef.current.lerp(targetCenterRef.current, Math.min(1, delta * 12));

    // Smooth lerp for angles and distance
    const cur = currentAngleRef.current;
    const tgt = targetAngleRef.current;

    cur.theta += (tgt.theta - cur.theta) * Math.min(1, delta * 14);
    cur.phi += (tgt.phi - cur.phi) * Math.min(1, delta * 14);
    cur.distance += (tgt.distance - cur.distance) * Math.min(1, delta * 12);

    const center = currentCenterRef.current;
    const x = center.x + cur.distance * Math.sin(cur.phi) * Math.sin(cur.theta);
    const y = center.y + cur.distance * Math.cos(cur.phi);
    const z = center.z + cur.distance * Math.sin(cur.phi) * Math.cos(cur.theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(center);
  };

  // Fly Camera Height adjustments (Elevate / Descend)
  const handleFlyHeight = (deltaY: number) => {
    targetCenterRef.current.y = Math.max(0.5, targetCenterRef.current.y + deltaY);
    sound.playClick();
  };

  const handleResetCamera = () => {
    targetAngleRef.current = { phi: Math.PI / 4, theta: Math.PI / 4, distance: 30 };
    targetCenterRef.current.set(0, 2, 0);
    sound.playClick();
  };

  // Update Moving Platforms & Spinners
  const updateMovingParts = (delta: number) => {
    const nowSec = performance.now() / 1000;
    objects.forEach((obj) => {
      const mesh = meshesMapRef.current.get(obj.id);
      if (!mesh) return;

      if (obj.behaviorType === 'spinner' || (obj.behaviorParams && obj.behaviorParams.spinSpeed)) {
        const speed = obj.behaviorParams?.spinSpeed || 2;
        mesh.rotation.y += speed * delta;
      } else if (obj.behaviorType === 'coin') {
        mesh.rotation.y += 3.5 * delta;
        mesh.position.y = obj.position[1] + Math.sin(nowSec * 3) * 0.25;
      } else if (obj.behaviorType === 'moving_platform') {
        const dist = obj.behaviorParams?.moveDistance || 10;
        const spd = obj.behaviorParams?.moveSpeed || 2;
        const axis = obj.behaviorParams?.moveAxis || 'x';
        const offset = Math.sin(nowSec * spd) * (dist / 2);
        if (axis === 'x') mesh.position.x = obj.position[0] + offset;
        else if (axis === 'y') mesh.position.y = obj.position[1] + offset;
        else mesh.position.z = obj.position[2] + offset;
      }
    });
  };

  // Dynamic Scene Lighting, Time of Day, Skybox, Ambient Color & Shadow Softness
  useEffect(() => {
    const scene = sceneRef.current;
    const sunLight = sunLightRef.current;
    const hemiLight = hemiLightRef.current;
    if (!scene || !sunLight || !hemiLight) return;

    const { clockTime, ambientColor, shadowSoftness, sunBrightness, skybox = 'Clear' } = lightingSettings;

    // 1. Time of Day Sun Trajectory (0:00 to 24:00)
    const timeAngle = ((clockTime - 6) / 24) * Math.PI * 2;
    const sunRadius = 110;
    const sunX = Math.cos(timeAngle) * sunRadius;
    const sunY = Math.sin(timeAngle) * sunRadius;
    const sunZ = 45;

    sunLight.position.set(sunX, Math.max(sunY, -80), sunZ);

    // 2. Skybox Environment Texture
    const skyTexture = getSkyboxTexture(skybox);
    scene.background = skyTexture;

    // 3. Atmosphere, Fog & Sun Lighting tuned to Skybox and ClockTime
    const atmosphere = getSkyboxAtmosphere(skybox, clockTime);

    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.set(atmosphere.fogColor);
    }

    sunLight.color.set(atmosphere.sunColor);
    sunLight.intensity = Math.max(0.08, sunBrightness * atmosphere.sunIntensityMultiplier);

    // 4. Ambient Light (Hemisphere)
    hemiLight.color.set(ambientColor || atmosphere.ambientColor);

    // 5. Shadow Softness
    sunLight.shadow.radius = 1 + shadowSoftness * 12;
    sunLight.shadow.bias = -0.0003 - (1 - shadowSoftness) * 0.0004;
  }, [lightingSettings]);

  // 2. Synchronize 3D Meshes with Objects list
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentIds = new Set(objects.map((o) => o.id));

    // Remove deleted meshes
    meshesMapRef.current.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        meshesMapRef.current.delete(id);
      }
    });

    // Add or update meshes
    objects.forEach((obj) => {
      let groupOrMesh = meshesMapRef.current.get(obj.id);

      if (!groupOrMesh) {
        groupOrMesh = create3DObject(obj, texturesRef.current);
        scene.add(groupOrMesh);
        meshesMapRef.current.set(obj.id, groupOrMesh);
      } else {
        update3DObject(groupOrMesh, obj, texturesRef.current);
      }
    });
  }, [objects]);

  // 3. Transform Gizmo Rendering for Selected Object
  useEffect(() => {
    const gizmoGroup = gizmoGroupRef.current;
    if (!gizmoGroup) return;

    while (gizmoGroup.children.length > 0) {
      gizmoGroup.remove(gizmoGroup.children[0]);
    }

    if (isPlayMode || !selectedId || toolMode === 'select') return;

    const selectedObj = objects.find((o) => o.id === selectedId);
    if (!selectedObj) return;

    gizmoGroup.position.set(...selectedObj.position);

    if (toolMode === 'move') {
      const arrowLen = 4;
      const arrowRad = 0.12;
      const xMesh = createAxisArrow(new THREE.Vector3(1, 0, 0), '#FF3344', arrowLen, arrowRad, 'x');
      const yMesh = createAxisArrow(new THREE.Vector3(0, 1, 0), '#33FF55', arrowLen, arrowRad, 'y');
      const zMesh = createAxisArrow(new THREE.Vector3(0, 0, 1), '#3388FF', arrowLen, arrowRad, 'z');
      gizmoGroup.add(xMesh, yMesh, zMesh);
    } else if (toolMode === 'scale') {
      const handleLen = 3.5;
      const xHandle = createScaleHandle(new THREE.Vector3(1, 0, 0), '#FF3344', handleLen, 'x');
      const yHandle = createScaleHandle(new THREE.Vector3(0, 1, 0), '#33FF55', handleLen, 'y');
      const zHandle = createScaleHandle(new THREE.Vector3(0, 0, 1), '#3388FF', handleLen, 'z');
      gizmoGroup.add(xHandle, yHandle, zHandle);
    } else if (toolMode === 'rotate') {
      const radius = 3.5;
      const xRing = createRotationRing('x', '#FF3344', radius);
      const yRing = createRotationRing('y', '#33FF55', radius);
      const zRing = createRotationRing('z', '#3388FF', radius);
      gizmoGroup.add(xRing, yRing, zRing);
    }
  }, [selectedId, toolMode, objects, isPlayMode]);

  // 4. Ghost Model for Placement Mode
  useEffect(() => {
    const ghostGroup = ghostMeshRef.current;
    if (!ghostGroup) return;

    while (ghostGroup.children.length > 0) {
      ghostGroup.remove(ghostGroup.children[0]);
    }

    if (activePlacementModel) {
      const preview = create3DObject(activePlacementModel, texturesRef.current, true);
      ghostGroup.add(preview);
      ghostGroup.rotation.y = (placementRotation * Math.PI) / 180;
      ghostGroup.visible = true;
    } else {
      ghostGroup.visible = false;
    }
  }, [activePlacementModel, placementRotation]);

  // 5. Play Mode Player Rig Initialization & Responsive Resize Trigger
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (isPlayMode) {
      const spawnObj = objects.find((o) => o.type === 'SpawnLocation' || o.behaviorType === 'spawn');
      const spawnPos = spawnObj ? [spawnObj.position[0], spawnObj.position[1] + 2, spawnObj.position[2]] : [0, 2, 0];

      const rig = createBaconHairRig(texturesRef.current);
      rig.root.position.set(spawnPos[0], spawnPos[1], spawnPos[2]);
      scene.add(rig.root);
      playerRigRef.current = rig;

      // Reset camera orientation in Play mode
      playCamAngleRef.current = { yaw: 0, pitch: 0.28, distance: 15 };

      onPlayerHealthChange(100);
      onLog('[Studio] Play mode started! Spawned character at SpawnLocation.', 'log');
      sound.playModeToggle(true);
    } else {
      if (playerRigRef.current) {
        scene.remove(playerRigRef.current.root);
        playerRigRef.current = null;
        onLog('[Studio] Play mode stopped. Returned to edit view.', 'log');
        sound.playModeToggle(false);
      }
    }

    // Force canvas resize when switching modes to prevent layout lag
    const resizeCheck = () => {
      if (containerRef.current && rendererRef.current && cameraRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w > 0 && h > 0) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h, false);
        }
      }
    };
    resizeCheck();
    const t1 = setTimeout(resizeCheck, 50);
    const t2 = setTimeout(resizeCheck, 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isPlayMode]);

  // Mobile Jump Trigger
  useEffect(() => {
    if (mobileJumpTrigger > 0 && playerRigRef.current && playerRigRef.current.isGrounded) {
      playerRigRef.current.velocity.y = playerRigRef.current.jumpPower;
      playerRigRef.current.isGrounded = false;
      sound.playJump();
    }
  }, [mobileJumpTrigger]);

  // Mobile Emote Trigger
  useEffect(() => {
    if (mobileEmoteTrigger > 0 && playerRigRef.current) {
      playerRigRef.current.emoteTimer = 2.5;
      onLog('[Emote] Bacon Hair waving arms! /e wave', 'log');
    }
  }, [mobileEmoteTrigger]);

  // Player Controller & Physics in Play Mode
  const updatePlayerController = (delta: number) => {
    const rig = playerRigRef.current;
    const camera = cameraRef.current;
    if (!rig || !camera) return;

    // Camera view orientation
    const yaw = playCamAngleRef.current.yaw;
    const pitch = playCamAngleRef.current.pitch;
    const camDist = playCamAngleRef.current.distance;

    // Horizontal forward & right vectors based on camera yaw
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

    let moveX = 0;
    let moveZ = 0;

    const keys = keysPressedRef.current;
    if (keys['w'] || keys['arrowup']) moveZ -= 1;
    if (keys['s'] || keys['arrowdown']) moveZ += 1;
    if (keys['a'] || keys['arrowleft']) moveX -= 1;
    if (keys['d'] || keys['arrowright']) moveX += 1;

    // Read live mobile joystick vector from synchronous ref
    const mobileMove = mobileMoveVectorRef.current;
    if (mobileMove && (mobileMove.x !== 0 || mobileMove.y !== 0)) {
      moveX += mobileMove.x;
      moveZ += mobileMove.y;
    }

    const inputLen = Math.hypot(moveX, moveZ);
    const isMoving = inputLen > 0.05;

    if ((keys['space'] || keys[' ']) && rig.isGrounded) {
      rig.velocity.y = rig.jumpPower;
      rig.isGrounded = false;
      sound.playJump();
    }

    if (isMoving) {
      const normX = moveX / inputLen;
      const normZ = moveZ / inputLen;

      // Desired direction relative to current camera viewing direction
      const targetDir = new THREE.Vector3()
        .addScaledVector(forward, -normZ)
        .addScaledVector(right, normX)
        .normalize();

      const currentAngle = rig.rotationY;
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);

      let diff = targetAngle - currentAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      rig.rotationY += diff * 18 * delta;
      rig.root.rotation.y = rig.rotationY;

      const speedFactor = Math.min(inputLen, 1.0);
      const isSprinting = Boolean(
        keys['shift'] || keys['shiftleft'] || keys['shiftright'] || mobileSprintRef.current
      );
      const currentWalkSpeed = isSprinting ? rig.walkSpeed * 1.5 : rig.walkSpeed;
      rig.velocity.x = targetDir.x * currentWalkSpeed * speedFactor;
      rig.velocity.z = targetDir.z * currentWalkSpeed * speedFactor;

      rig.walkCycle += delta * (rig.walkSpeed * 0.6);
      const swing = Math.sin(rig.walkCycle) * 0.7;
      rig.leftLeg.rotation.x = swing;
      rig.rightLeg.rotation.x = -swing;
      if (rig.emoteTimer <= 0) {
        rig.leftArm.rotation.x = -swing;
        rig.rightArm.rotation.x = swing;
        rig.leftArm.rotation.z = 0.1;
        rig.rightArm.rotation.z = -0.1;
      }
    } else {
      rig.velocity.x *= 0.7;
      rig.velocity.z *= 0.7;
      rig.leftLeg.rotation.x *= 0.8;
      rig.rightLeg.rotation.x *= 0.8;
      if (rig.emoteTimer <= 0) {
        rig.leftArm.rotation.x *= 0.8;
        rig.rightArm.rotation.x *= 0.8;
      }
    }

    if (rig.emoteTimer > 0) {
      rig.emoteTimer -= delta;
      const wave = Math.sin(performance.now() * 0.015) * 0.4;
      rig.leftArm.rotation.x = -Math.PI * 0.7;
      rig.rightArm.rotation.x = -Math.PI * 0.7;
      rig.leftArm.rotation.z = -0.4 + wave;
      rig.rightArm.rotation.z = 0.4 - wave;
    }

    if (!rig.isGrounded && rig.emoteTimer <= 0) {
      rig.leftArm.rotation.x = -Math.PI * 0.85;
      rig.rightArm.rotation.x = -Math.PI * 0.85;
      rig.leftLeg.rotation.x = 0.3;
      rig.rightLeg.rotation.x = -0.2;
    }

    rig.velocity.y -= 45 * delta;

    const nextX = rig.root.position.x + rig.velocity.x * delta;
    const nextY = rig.root.position.y + rig.velocity.y * delta;
    const nextZ = rig.root.position.z + rig.velocity.z * delta;

    let groundY = 0;
    rig.isGrounded = false;

    if (nextY <= groundY) {
      rig.root.position.y = groundY;
      rig.velocity.y = 0;
      rig.isGrounded = true;
    } else {
      rig.root.position.y = nextY;
    }

    const playerRadius = 0.9;
    const playerHeight = 4.8;
    const playerBox = new THREE.Box3(
      new THREE.Vector3(nextX - playerRadius, rig.root.position.y, nextZ - playerRadius),
      new THREE.Vector3(nextX + playerRadius, rig.root.position.y + playerHeight, nextZ + playerRadius)
    );

    const now = performance.now();

    for (const obj of objectsRef.current) {
      if (!obj.canCollide && obj.behaviorType !== 'coin') continue;

      const objMesh = meshesMapRef.current.get(obj.id);
      const objPos = objMesh ? [objMesh.position.x, objMesh.position.y, objMesh.position.z] : obj.position;

      const halfW = obj.size[0] / 2;
      const halfH = obj.size[1] / 2;
      const halfD = obj.size[2] / 2;

      const objBox = new THREE.Box3(
        new THREE.Vector3(objPos[0] - halfW, objPos[1] - halfH, objPos[2] - halfD),
        new THREE.Vector3(objPos[0] + halfW, objPos[1] + halfH, objPos[2] + halfD)
      );

      if (playerBox.intersectsBox(objBox)) {
        const lastTouched = touchedThrottleRef.current.get(obj.id) || 0;
        if (now - lastTouched > 350) {
          touchedThrottleRef.current.set(obj.id, now);
          handleObjectTouched(obj, rig);
        }

        if (obj.canCollide) {
          const playerFeetPrev = rig.root.position.y - rig.velocity.y * delta;
          const objTop = objPos[1] + halfH;
          if (playerFeetPrev >= objTop - 0.4 && rig.velocity.y <= 0) {
            rig.root.position.y = objTop;
            rig.velocity.y = 0;
            rig.isGrounded = true;
          }
        }
      }
    }

    rig.root.position.x = nextX;
    rig.root.position.z = nextZ;

    if (rig.root.position.y < -20) {
      respawnPlayer(rig);
    }

    // Third-person camera following avatar with smooth yaw/pitch orbit
    const camTargetPos = new THREE.Vector3(
      rig.root.position.x + camDist * Math.cos(pitch) * Math.sin(yaw),
      rig.root.position.y + 2.5 + camDist * Math.sin(pitch),
      rig.root.position.z + camDist * Math.cos(pitch) * Math.cos(yaw)
    );

    camera.position.lerp(camTargetPos, 0.2);
    camera.lookAt(rig.root.position.x, rig.root.position.y + 2.2, rig.root.position.z);
  };

  const handleObjectTouched = (obj: RobloxObject, rig: NonNullable<typeof playerRigRef.current>) => {
    if (obj.behaviorType === 'kill_brick' || (obj.behaviorParams && obj.behaviorParams.damage)) {
      sound.playOof();
      onPlayerHealthChange(0);
      onLog(`[Oof!] Player touched "${obj.name}"! Resetting...`, 'warn');
      respawnPlayer(rig);
    } else if (obj.behaviorType === 'speed_pad') {
      rig.walkSpeed = 32;
      sound.playBoost();
      onLog(`[Speed Pad] Turbo Boost Activated! (Speed: 32)`, 'log');
      setTimeout(() => {
        if (playerRigRef.current) playerRigRef.current.walkSpeed = 16;
      }, 3500);
    } else if (obj.behaviorType === 'jump_pad') {
      rig.velocity.y = 28;
      rig.isGrounded = false;
      sound.playJump();
      onLog(`[Jump Pad] Launched into the sky!`, 'log');
    } else if (obj.behaviorType === 'coin') {
      const coinVal = obj.behaviorParams?.coinValue || 10;
      onPlayerCoinsChange(playerCoins + coinVal);
      sound.playCoin();
      onLog(`[Coin] Collected ${obj.name}! +${coinVal} Coins`, 'log');
      onUpdateObject(obj.id, { transparency: 1, canCollide: false });
    } else if (obj.behaviorType === 'checkpoint') {
      sound.playCoin();
      onLog(`[Checkpoint] "${obj.name}" saved!`, 'log');
    } else if (obj.scriptCode && obj.scriptEnabled) {
      onLog(`[Script] Touched event triggered on "${obj.name}"`, 'log');
    }
  };

  const respawnPlayer = (rig: NonNullable<typeof playerRigRef.current>) => {
    const spawnObj = objects.find((o) => o.type === 'SpawnLocation' || o.behaviorType === 'spawn');
    const spawnPos = spawnObj ? [spawnObj.position[0], spawnObj.position[1] + 2, spawnObj.position[2]] : [0, 2, 0];
    rig.root.position.set(spawnPos[0], spawnPos[1], spawnPos[2]);
    rig.velocity.set(0, 0, 0);
    onPlayerHealthChange(100);
  };

  // 6. Raycasting & Mouse Interaction (Select, Placement, Gizmo Dragging)
  const getRaycaster = (clientX: number, clientY: number) => {
    if (!containerRef.current || !cameraRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    return raycaster;
  };

  // Surface-aware raycast placement position calculator (Minecraft block stacking & snapping)
  const calculatePlacementPosition = (
    raycaster: THREE.Raycaster,
    model: RobloxObject,
    rotYDeg: number = 0
  ): [number, number, number] => {
    const snap = moveSnap || 1;
    const selectableMeshes: THREE.Object3D[] = [];
    meshesMapRef.current.forEach((mesh) => selectableMeshes.push(mesh));

    // Determine dimensions taking Y rotation into account
    const isRotated90 = Math.abs(rotYDeg % 180) === 90;
    const width = isRotated90 ? model.size[2] : model.size[0];
    const height = model.size[1];
    const depth = isRotated90 ? model.size[0] : model.size[2];
    const halfH = height / 2;

    // Check intersection with any existing objects in scene (Minecraft placement on blocks, walls, floors, tables)
    const intersects = raycaster.intersectObjects(selectableMeshes, true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const normal = hit.face
        ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize()
        : new THREE.Vector3(0, 1, 0);

      let targetX = hit.point.x;
      let targetY = hit.point.y;
      let targetZ = hit.point.z;

      // 1. Top face hit (placing on top of a floor or wall or table)
      if (normal.y > 0.4) {
        targetY = hit.point.y + halfH;
        targetX = Math.round(hit.point.x / snap) * snap;
        targetZ = Math.round(hit.point.z / snap) * snap;
      }
      // 2. Bottom face hit (ceiling fixture)
      else if (normal.y < -0.4) {
        targetY = hit.point.y - halfH;
        targetX = Math.round(hit.point.x / snap) * snap;
        targetZ = Math.round(hit.point.z / snap) * snap;
      }
      // 3. Side face along X axis (placing next to a wall or block)
      else if (Math.abs(normal.x) > Math.abs(normal.z)) {
        const signX = normal.x > 0 ? 1 : -1;
        targetX = Math.round((hit.point.x + signX * (width / 2)) / snap) * snap;
        targetY = Math.round(hit.point.y / snap) * snap;
        targetZ = Math.round(hit.point.z / snap) * snap;
      }
      // 4. Side face along Z axis
      else {
        const signZ = normal.z > 0 ? 1 : -1;
        targetZ = Math.round((hit.point.z + signZ * (depth / 2)) / snap) * snap;
        targetY = Math.round(hit.point.y / snap) * snap;
        targetX = Math.round(hit.point.x / snap) * snap;
      }

      targetY = Math.max(halfH, targetY);
      return [targetX, targetY, targetZ];
    }

    // Fallback: ground plane y = 0
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hitPoint)) {
      const snapX = Math.round(hitPoint.x / snap) * snap;
      const snapZ = Math.round(hitPoint.z / snap) * snap;
      const snapY = halfH;
      return [snapX, snapY, snapZ];
    }

    return [0, halfH, 0];
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    mousePrevRef.current = { x: e.clientX, y: e.clientY };

    if (isPlayMode) {
      if (camPointerIdRef.current === null) {
        camPointerIdRef.current = e.pointerId;
        isOrbitingPlayCamRef.current = true;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {}
      }
      return;
    }

    if (e.button === 2) {
      isOrbitingRef.current = true;
      return;
    }
    if (e.button === 1) {
      isPanningRef.current = true;
      return;
    }

    const raycaster = getRaycaster(e.clientX, e.clientY);
    if (!raycaster || !sceneRef.current) return;

    // A0. Check Break Mode (Minecraft pickaxe tool)
    if (isBreakMode && onDeleteObject) {
      const selectableMeshes: THREE.Object3D[] = [];
      meshesMapRef.current.forEach((mesh) => selectableMeshes.push(mesh));
      const intersects = raycaster.intersectObjects(selectableMeshes, true);
      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && !curr.userData.robloxId) {
          curr = curr.parent;
        }
        if (curr && curr.userData.robloxId) {
          const targetId = curr.userData.robloxId;
          onDeleteObject(targetId);
          sound.playExplosion();
          return;
        }
      }
      return;
    }

    // A. Check Placement Mode (Minecraft block & furniture placement)
    if (activePlacementModel) {
      const targetPos = calculatePlacementPosition(raycaster, activePlacementModel, placementRotation);
      onPlaceObject(targetPos, placementRotation);
      sound.playPlace();
      return;
    }

    // B. Check Gizmo Handles
    if (selectedId && gizmoGroupRef.current && toolMode !== 'select') {
      const gizmoIntersects = raycaster.intersectObjects(gizmoGroupRef.current.children, true);
      if (gizmoIntersects.length > 0) {
        const topHit = gizmoIntersects[0].object;
        const axis = topHit.userData.axis as 'x' | 'y' | 'z';
        if (axis) {
          isDraggingGizmoRef.current = true;
          activeGizmoAxisRef.current = axis;
          dragStartPointRef.current.copy(gizmoIntersects[0].point);

          const selObj = objects.find((o) => o.id === selectedId);
          if (selObj) {
            objectStartPosRef.current = [...selObj.position];
            objectStartSizeRef.current = [...selObj.size];
            objectStartRotRef.current = [...selObj.rotation];
          }
          return;
        }
      }
    }

    // C. Check Object Selection
    const selectableMeshes: THREE.Object3D[] = [];
    meshesMapRef.current.forEach((mesh) => selectableMeshes.push(mesh));

    const intersects = raycaster.intersectObjects(selectableMeshes, true);
    if (intersects.length > 0) {
      let curr: THREE.Object3D | null = intersects[0].object;
      while (curr && !curr.userData.robloxId) {
        curr = curr.parent;
      }
      if (curr && curr.userData.robloxId) {
        onSelectObject(curr.userData.robloxId);
        sound.playClick();
        return;
      }
    }

    // D. Clicked on empty void -> start orbit
    if (e.button === 0) {
      isOrbitingRef.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - mousePrevRef.current.x;
    const dy = e.clientY - mousePrevRef.current.y;
    mousePrevRef.current = { x: e.clientX, y: e.clientY };

    // Play Mode Camera Orbit on Screen Drag
    if (isPlayMode) {
      if (isOrbitingPlayCamRef.current && (camPointerIdRef.current === null || camPointerIdRef.current === e.pointerId)) {
        playCamAngleRef.current.yaw -= dx * 0.007;
        playCamAngleRef.current.pitch = Math.max(
          -0.3,
          Math.min(0.85, playCamAngleRef.current.pitch + dy * 0.007)
        );
      }
      return;
    }

    // Placement Mode ghost tracking with surface snapping & rotation
    if (activePlacementModel && ghostMeshRef.current) {
      const raycaster = getRaycaster(e.clientX, e.clientY);
      if (raycaster) {
        const targetPos = calculatePlacementPosition(raycaster, activePlacementModel, placementRotation);
        ghostMeshRef.current.position.set(...targetPos);
        ghostMeshRef.current.rotation.y = (placementRotation * Math.PI) / 180;
      }
      return;
    }

    // Gizmo Dragging (Move, Scale, Rotate)
    if (isDraggingGizmoRef.current && selectedId && activeGizmoAxisRef.current) {
      const raycaster = getRaycaster(e.clientX, e.clientY);
      if (!raycaster) return;

      const axis = activeGizmoAxisRef.current;
      const snapM = moveSnap || 1;
      const snapR = rotateSnap || 5;

      const selObj = objects.find((o) => o.id === selectedId);
      if (!selObj) return;

      if (toolMode === 'move') {
        const planeNormal = new THREE.Vector3();
        if (axis === 'y') planeNormal.set(0, 0, 1);
        else planeNormal.set(0, 1, 0);

        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, dragStartPointRef.current);
        const currentHit = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, currentHit)) {
          const deltaVec = new THREE.Vector3().subVectors(currentHit, dragStartPointRef.current);
          const initialPos = objectStartPosRef.current;
          let newX = initialPos[0];
          let newY = initialPos[1];
          let newZ = initialPos[2];

          if (axis === 'x') newX += Math.round(deltaVec.x / snapM) * snapM;
          if (axis === 'y') newY += Math.round(deltaVec.y / snapM) * snapM;
          if (axis === 'z') newZ += Math.round(deltaVec.z / snapM) * snapM;

          onUpdateObject(selectedId, { position: [newX, newY, newZ] });
        }
      } else if (toolMode === 'scale') {
        const factor = (dx - dy) * 0.05;
        const initSize = objectStartSizeRef.current;
        let sx = initSize[0];
        let sy = initSize[1];
        let sz = initSize[2];

        if (axis === 'x') sx = Math.max(0.5, Math.round((sx + factor) / snapM) * snapM);
        if (axis === 'y') sy = Math.max(0.2, Math.round((sy + factor) / snapM) * snapM);
        if (axis === 'z') sz = Math.max(0.5, Math.round((sz + factor) / snapM) * snapM);

        onUpdateObject(selectedId, { size: [sx, sy, sz] });
      } else if (toolMode === 'rotate') {
        const factor = (dx - dy) * 0.8;
        const initRot = objectStartRotRef.current;
        let rx = initRot[0];
        let ry = initRot[1];
        let rz = initRot[2];

        if (axis === 'y') ry = Math.round((ry + factor) / snapR) * snapR;
        if (axis === 'x') rx = Math.round((rx + factor) / snapR) * snapR;
        if (axis === 'z') rz = Math.round((rz + factor) / snapR) * snapR;

        onUpdateObject(selectedId, { rotation: [rx, ry, rz] });
      }
      return;
    }

    // Camera Orbiting in Edit Mode
    if (isOrbitingRef.current) {
      targetAngleRef.current.theta -= dx * 0.007;
      targetAngleRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.02, targetAngleRef.current.phi - dy * 0.007)
      );
    }

    // Camera Panning in Edit Mode
    if (isPanningRef.current && cameraRef.current) {
      const panSpeed = 0.03 * (targetAngleRef.current.distance / 20);
      const right = new THREE.Vector3();
      cameraRef.current.getWorldDirection(new THREE.Vector3());
      right.crossVectors(cameraRef.current.up, cameraRef.current.getWorldDirection(new THREE.Vector3())).normalize();
      targetCenterRef.current.addScaledVector(right, -dx * panSpeed);
      targetCenterRef.current.y += dy * panSpeed;
    }
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    isDraggingGizmoRef.current = false;
    activeGizmoAxisRef.current = null;
    isOrbitingRef.current = false;
    isPanningRef.current = false;

    if (isPlayMode) {
      if (e && camPointerIdRef.current !== null && e.pointerId === camPointerIdRef.current) {
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
        camPointerIdRef.current = null;
        isOrbitingPlayCamRef.current = false;
      } else if (!e) {
        camPointerIdRef.current = null;
        isOrbitingPlayCamRef.current = false;
      }
      return;
    }
    camPointerIdRef.current = null;
    isOrbitingPlayCamRef.current = false;
  };

  // Multi-Touch Handlers (Pinch to Zoom, Two-finger Pan in Edit Mode)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPlayMode) {
      // In Play mode, pointer events manage camera orbiting with unique pointerId capture
      return;
    }

    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      initialPinchDistRef.current = dist;
      initialPinchTargetDistRef.current = targetAngleRef.current.distance;
      prevPinchMidpointRef.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPlayMode) {
      return;
    }

    if (e.touches.length === 2 && initialPinchDistRef.current !== null && prevPinchMidpointRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = initialPinchDistRef.current / Math.max(10, currentDist);

      targetAngleRef.current.distance = Math.max(
        3,
        Math.min(120, initialPinchTargetDistRef.current * ratio)
      );

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      const dx = midX - prevPinchMidpointRef.current.x;
      const dy = midY - prevPinchMidpointRef.current.y;
      prevPinchMidpointRef.current = { x: midX, y: midY };

      if (cameraRef.current) {
        const panSpeed = 0.04 * (targetAngleRef.current.distance / 20);
        const right = new THREE.Vector3();
        cameraRef.current.getWorldDirection(new THREE.Vector3());
        right.crossVectors(cameraRef.current.up, cameraRef.current.getWorldDirection(new THREE.Vector3())).normalize();
        targetCenterRef.current.addScaledVector(right, -dx * panSpeed);
        targetCenterRef.current.y += dy * panSpeed;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isPlayMode) {
      return;
    }

    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
      prevPinchMidpointRef.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDelta = e.deltaY * 0.02;
    if (isPlayMode) {
      playCamAngleRef.current.distance = Math.max(
        4,
        Math.min(40, playCamAngleRef.current.distance + zoomDelta)
      );
      return;
    }
    targetAngleRef.current.distance = Math.max(
      3,
      Math.min(120, targetAngleRef.current.distance + zoomDelta)
    );
  };

  // Edit Mode Touch Joystick Handlers
  const handleEditJoystickStart = (clientX: number, clientY: number) => {
    if (!editJoystickBaseRef.current) return;
    const rect = editJoystickBaseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const maxDist = 42;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setEditJoystickPos({ x: clampedX, y: clampedY });
    isDraggingEditJoyRef.current = true;
    editMoveVectorRef.current = { x: clampedX / maxDist, y: clampedY / maxDist };
  };

  const handleEditJoystickMove = (clientX: number, clientY: number) => {
    if (!isDraggingEditJoyRef.current || !editJoystickBaseRef.current) return;
    const rect = editJoystickBaseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const maxDist = 42;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setEditJoystickPos({ x: clampedX, y: clampedY });
    editMoveVectorRef.current = { x: clampedX / maxDist, y: clampedY / maxDist };
  };

  const handleEditJoystickEnd = () => {
    isDraggingEditJoyRef.current = false;
    setEditJoystickPos(null);
    editMoveVectorRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-default overflow-hidden bg-[#18181b] touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Placement Mode Notification Banner */}
      {activePlacementModel && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/95 text-white px-5 py-2 rounded-full shadow-xl border border-blue-400 backdrop-blur-md flex items-center gap-3 z-20 animate-pulse text-xs font-medium">
          <span>Click anywhere on the map grid to place <b>{activePlacementModel.name}</b></span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelPlacement();
            }}
            className="px-2.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Selected Object Indicator / Quick HUD */}
      {!isPlayMode && selectedId && (
        <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-lg border border-white/10 z-10 flex items-center gap-3 pointer-events-none">
          <span className="font-semibold text-sky-400">Selected:</span>
          <span>{objects.find((o) => o.id === selectedId)?.name || 'Object'}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300 capitalize">Tool: {toolMode}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">Snap: {moveSnap} stud</span>
        </div>
      )}

      {/* EDIT MODE CAMERA JOYSTICK & NAVIGATION CONTROLS (Multi-touch + Joystick in Edit Mode) */}
      {!isPlayMode && showEditTouchControls && (
        <>
          {/* Bottom Left: Edit Mode Camera Fly Joystick */}
          <div className="absolute bottom-4 left-4 z-20 flex items-end gap-3 select-none pointer-events-auto">
            <div
              ref={editJoystickBaseRef}
              onPointerDown={(e) => handleEditJoystickStart(e.clientX, e.clientY)}
              onPointerMove={(e) => handleEditJoystickMove(e.clientX, e.clientY)}
              onPointerUp={handleEditJoystickEnd}
              onPointerCancel={handleEditJoystickEnd}
              className="relative w-24 h-24 rounded-full bg-black/40 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing"
              title="Camera Fly Joystick (Drag to pan camera around map smoothly)"
            >
              {/* Center thumb stick */}
              <div
                className="w-10 h-10 rounded-full bg-white/80 shadow-md border border-white transform transition-transform duration-75 pointer-events-none"
                style={{
                  transform: editJoystickPos
                    ? `translate(${editJoystickPos.x}px, ${editJoystickPos.y}px)`
                    : 'translate(0px, 0px)',
                }}
              />
              <span className="absolute -bottom-4 text-[9px] text-white/80 font-bold tracking-wider uppercase pointer-events-none">
                Fly Pan
              </span>
            </div>

            {/* Camera Height Up / Down Buttons */}
            <div className="flex flex-col gap-1.5 mb-1">
              <button
                onClick={() => handleFlyHeight(4)}
                className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 active:scale-95 border border-white/30 text-white flex items-center justify-center shadow transition"
                title="Elevate Camera Height"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFlyHeight(-4)}
                className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 active:scale-95 border border-white/30 text-white flex items-center justify-center shadow transition"
                title="Descend Camera Height"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top Right Viewport Quick Camera Actions */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleResetCamera}
              className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg border border-white/20 backdrop-blur-md text-[10px] font-medium flex items-center gap-1 transition shadow-xs"
              title="Reset View to Center"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Reset View</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- HELPER 3D GENERATOR FUNCTIONS ---

function create3DObject(
  obj: RobloxObject,
  textures: { grid?: THREE.CanvasTexture; spawnDecal?: THREE.CanvasTexture; speedArrow?: THREE.CanvasTexture },
  isGhost = false
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(...obj.position);
  group.rotation.set(
    THREE.MathUtils.degToRad(obj.rotation[0]),
    THREE.MathUtils.degToRad(obj.rotation[1]),
    THREE.MathUtils.degToRad(obj.rotation[2])
  );
  group.userData = { robloxId: obj.id };

  const opacity = isGhost ? 0.45 : 1 - obj.transparency;
  const isTransparent = isGhost || obj.transparency > 0;

  let mainMat: THREE.Material;

  if (obj.type === 'SpawnLocation' && textures.spawnDecal) {
    const sideMat = new THREE.MeshStandardMaterial({ color: '#E0E0E0', roughness: 0.5 });
    const topMat = new THREE.MeshStandardMaterial({
      map: textures.spawnDecal,
      roughness: 0.4,
      metalness: 0.05,
      transparent: isTransparent,
      opacity,
    });
    mainMat = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat] as unknown as THREE.Material;
  } else if (obj.behaviorType === 'speed_pad' && textures.speedArrow) {
    const sideMat = new THREE.MeshStandardMaterial({ color: '#0055EE', roughness: 0.2 });
    const topMat = new THREE.MeshStandardMaterial({
      map: textures.speedArrow,
      emissive: new THREE.Color('#00E5FF'),
      emissiveIntensity: 0.6,
      transparent: isTransparent,
      opacity,
    });
    mainMat = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat] as unknown as THREE.Material;
  } else if (obj.material === 'Neon') {
    mainMat = new THREE.MeshStandardMaterial({
      color: obj.color,
      emissive: new THREE.Color(obj.color),
      emissiveIntensity: 0.85,
      roughness: 0.2,
      transparent: isTransparent,
      opacity,
    });
  } else {
    mainMat = new THREE.MeshStandardMaterial({
      color: obj.color,
      roughness: obj.material === 'Metal' ? 0.2 : obj.material === 'SmoothPlastic' ? 0.5 : 0.8,
      metalness: obj.material === 'Metal' ? 0.7 : 0.05,
      transparent: isTransparent,
      opacity,
    });
  }

  const mainGeo = createShapeGeometry(obj.shape || 'Block', obj.size);
  const mainMesh = new THREE.Mesh(mainGeo, mainMat);
  mainMesh.castShadow = obj.castShadow && !isGhost;
  mainMesh.receiveShadow = !isGhost;
  group.add(mainMesh);

  if (obj.subParts && obj.subParts.length > 0) {
    obj.subParts.forEach((sp) => {
      const spGeo = createShapeGeometry(sp.shape, sp.size);
      const spMat = new THREE.MeshStandardMaterial({
        color: sp.color,
        emissive: sp.material === 'Neon' ? new THREE.Color(sp.color) : new THREE.Color(0x000000),
        emissiveIntensity: sp.material === 'Neon' ? 0.8 : 0,
        roughness: 0.6,
        transparent: isGhost || (sp.transparency ?? 0) > 0,
        opacity: isGhost ? 0.45 : 1 - (sp.transparency ?? 0),
      });
      const spMesh = new THREE.Mesh(spGeo, spMat);
      spMesh.position.set(...sp.offset);
      spMesh.rotation.set(
        THREE.MathUtils.degToRad(sp.rotation[0]),
        THREE.MathUtils.degToRad(sp.rotation[1]),
        THREE.MathUtils.degToRad(sp.rotation[2])
      );
      spMesh.castShadow = !isGhost;
      spMesh.receiveShadow = !isGhost;
      group.add(spMesh);
    });
  }

  return group;
}

function update3DObject(
  group: THREE.Group | THREE.Mesh,
  obj: RobloxObject,
  textures: { spawnDecal?: THREE.CanvasTexture; speedArrow?: THREE.CanvasTexture }
) {
  group.position.set(...obj.position);
  group.rotation.set(
    THREE.MathUtils.degToRad(obj.rotation[0]),
    THREE.MathUtils.degToRad(obj.rotation[1]),
    THREE.MathUtils.degToRad(obj.rotation[2])
  );

  const mainMesh = group.children[0] as THREE.Mesh;
  if (mainMesh) {
    mainMesh.geometry.dispose();
    mainMesh.geometry = createShapeGeometry(obj.shape || 'Block', obj.size);

    if (Array.isArray(mainMesh.material)) {
      // multi material
    } else if (mainMesh.material instanceof THREE.MeshStandardMaterial) {
      mainMesh.material.color.set(obj.color);
      if (obj.material === 'Neon') {
        mainMesh.material.emissive.set(obj.color);
        mainMesh.material.emissiveIntensity = 0.85;
      } else {
        mainMesh.material.emissive.set(0x000000);
      }
      mainMesh.material.opacity = 1 - obj.transparency;
      mainMesh.material.transparent = obj.transparency > 0;
    }
  }
}

function createShapeGeometry(shape: PartShape, size: [number, number, number]): THREE.BufferGeometry {
  const [w, h, d] = size;
  switch (shape) {
    case 'Ball':
      return new THREE.SphereGeometry(Math.max(w, h, d) / 2, 24, 24);
    case 'Cylinder':
      return new THREE.CylinderGeometry(w / 2, w / 2, h, 24);
    case 'Wedge': {
      const geom = new THREE.BufferGeometry();
      const hw = w / 2, hh = h / 2, hd = d / 2;
      const vertices = new Float32Array([
        -hw, -hh, hd,   hw, -hh, hd,   hw, hh, -hd,
        -hw, -hh, hd,   hw, hh, -hd,  -hw, hh, -hd,
        -hw, -hh, -hd,  hw, -hh, -hd,  hw, -hh, hd,
        -hw, -hh, -hd,  hw, -hh, hd,  -hw, -hh, hd,
        -hw, -hh, -hd,  hw, -hh, -hd,  hw, hh, -hd,
        -hw, -hh, -hd,  hw, hh, -hd,  -hw, hh, -hd,
        -hw, -hh, -hd, -hw, -hh, hd,  -hw, hh, -hd,
        hw, -hh, hd,   hw, -hh, -hd,   hw, hh, -hd,
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();
      return geom;
    }
    case 'Block':
    default:
      return new THREE.BoxGeometry(w, h, d);
  }
}

function createAxisArrow(dir: THREE.Vector3, color: string, length: number, radius: number, axis: 'x' | 'y' | 'z') {
  const group = new THREE.Group();
  group.userData = { axis };

  const shaftGeo = new THREE.CylinderGeometry(radius, radius, length - 0.8, 12);
  const headGeo = new THREE.ConeGeometry(radius * 2.8, 0.8, 16);
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true });

  const shaft = new THREE.Mesh(shaftGeo, mat);
  shaft.position.y = (length - 0.8) / 2;
  shaft.userData = { axis };

  const head = new THREE.Mesh(headGeo, mat);
  head.position.y = length - 0.4;
  head.userData = { axis };

  group.add(shaft, head);

  if (axis === 'x') group.rotation.z = -Math.PI / 2;
  else if (axis === 'z') group.rotation.x = Math.PI / 2;

  group.renderOrder = 999;
  return group;
}

function createScaleHandle(dir: THREE.Vector3, color: string, length: number, axis: 'x' | 'y' | 'z') {
  const group = new THREE.Group();
  group.userData = { axis };

  const lineGeo = new THREE.CylinderGeometry(0.08, 0.08, length - 0.5, 12);
  const cubeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: false });

  const line = new THREE.Mesh(lineGeo, mat);
  line.position.y = (length - 0.5) / 2;
  line.userData = { axis };

  const cube = new THREE.Mesh(cubeGeo, mat);
  cube.position.y = length - 0.35;
  cube.userData = { axis };

  group.add(line, cube);

  if (axis === 'x') group.rotation.z = -Math.PI / 2;
  else if (axis === 'z') group.rotation.x = Math.PI / 2;

  group.renderOrder = 999;
  return group;
}

function createRotationRing(axis: 'x' | 'y' | 'z', color: string, radius: number) {
  const ringGeo = new THREE.TorusGeometry(radius, 0.08, 8, 48);
  const mat = new THREE.MeshBasicMaterial({ color, depthTest: false });
  const mesh = new THREE.Mesh(ringGeo, mat);
  mesh.userData = { axis };

  if (axis === 'x') mesh.rotation.y = Math.PI / 2;
  else if (axis === 'y') mesh.rotation.x = Math.PI / 2;

  mesh.renderOrder = 999;
  return mesh;
}

function createBaconHairRig(textures: { face?: THREE.CanvasTexture; shirt?: THREE.CanvasTexture }) {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: '#FFF5B8', roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: '#1A2329', roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#6A3E1B', roughness: 0.8 });

  const jacketMat = new THREE.MeshStandardMaterial({ color: '#1e2022', roughness: 0.7 });
  const shirtFrontMat = textures.shirt
    ? new THREE.MeshStandardMaterial({ map: textures.shirt, roughness: 0.6 })
    : new THREE.MeshStandardMaterial({ color: '#0066CC', roughness: 0.6 });

  const torsoMaterials: THREE.Material[] = [
    jacketMat, // +X right
    jacketMat, // -X left
    jacketMat, // +Y top
    pantsMat,  // -Y bottom
    shirtFrontMat, // +Z front (face side)
    jacketMat, // -Z back
  ];
  const torso = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), torsoMaterials);
  torso.position.y = 2.6;
  torso.castShadow = true;
  root.add(torso);

  const headMaterials: THREE.Material[] = [
    skinMat, skinMat, skinMat, skinMat,
    textures.face ? new THREE.MeshStandardMaterial({ map: textures.face, roughness: 0.6 }) : skinMat,
    skinMat,
  ];
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), headMaterials);
  head.position.y = 4.2;
  head.castShadow = true;
  root.add(head);

  const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.5), hairMat);
  hairMesh.position.set(0, 4.8, 0.1);
  hairMesh.castShadow = true;
  root.add(hairMesh);

  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-1.5, 3.5, 0);
  const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), skinMat);
  leftArmMesh.position.y = -0.9;
  leftArmMesh.castShadow = true;
  leftArmGroup.add(leftArmMesh);
  root.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(1.5, 3.5, 0);
  const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), skinMat);
  rightArmMesh.position.y = -0.9;
  rightArmMesh.castShadow = true;
  rightArmGroup.add(rightArmMesh);
  root.add(rightArmGroup);

  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.55, 1.6, 0);
  const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.6, 1), pantsMat);
  leftLegMesh.position.y = -0.8;
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);
  root.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.55, 1.6, 0);
  const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.6, 1), pantsMat);
  rightLegMesh.position.y = -0.8;
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);
  root.add(rightLegGroup);

  return {
    root,
    torso,
    head,
    leftArm: leftArmGroup,
    rightArm: rightArmGroup,
    leftLeg: leftLegGroup,
    rightLeg: rightLegGroup,
    velocity: new THREE.Vector3(0, 0, 0),
    isGrounded: true,
    walkSpeed: 16,
    jumpPower: 20,
    rotationY: 0,
    walkCycle: 0,
    emoteTimer: 0,
  };
}
