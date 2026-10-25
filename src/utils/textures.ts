import * as THREE from 'three';

/**
 * Creates the authentic Roblox SpawnLocation decal:
 * White base with the iconic black 8-pointed curved star / sun emblem
 */
export function createSpawnDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // White base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  // Outer border bevel
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 500);

  // Center sun/star emblem
  const cx = 256;
  const cy = 256;
  const points = 8;
  const outerRadius = 210;
  const innerRadius = 110;
  const centralCircleRadius = 78;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#111111';
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // White inner circle cutout
  ctx.beginPath();
  ctx.arc(0, 0, centralCircleRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Fine inner dark ring
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates the authentic classic Roblox Baseplate grid texture with studs
 */
export function createRobloxGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Baseplate gray
  ctx.fillStyle = '#63666A'; // Medium stone grey
  ctx.fillRect(0, 0, 256, 256);

  // Grid border
  ctx.strokeStyle = '#4a4d50';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 256, 256);

  // Studs (4x4 per grid tile)
  const step = 64;
  for (let x = 32; x < 256; x += step) {
    for (let y = 32; y < 256; y += step) {
      // Subtle stud circle with shadow highlight
      const grad = ctx.createRadialGradient(x - 2, y - 2, 2, x, y, 14);
      grad.addColorStop(0, '#82868b');
      grad.addColorStop(0.7, '#676b70');
      grad.addColorStop(1, '#4e5154');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Outer rim
      ctx.strokeStyle = '#3e4043';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tiny inner ring
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = '#575b60';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(40, 40);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Speed Boost Arrow Texture
 */
export function createSpeedArrowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0055ff';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#00e5ff';
  for (let y = 30; y < 240; y += 70) {
    ctx.beginPath();
    ctx.moveTo(128, y);
    ctx.lineTo(210, y + 45);
    ctx.lineTo(170, y + 45);
    ctx.lineTo(128, y + 20);
    ctx.lineTo(86, y + 45);
    ctx.lineTo(46, y + 45);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Classic Roblox Face texture (Smile face matching screenshot)
 */
export function createRobloxFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Skin yellow background matching user's avatar
  ctx.fillStyle = '#FFF5B8';
  ctx.fillRect(0, 0, 256, 256);

  // Black eyes
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.arc(76, 95, 14, 0, Math.PI * 2);
  ctx.arc(180, 95, 14, 0, Math.PI * 2);
  ctx.fill();

  // Eye shines
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(72, 91, 4, 0, Math.PI * 2);
  ctx.arc(176, 91, 4, 0, Math.PI * 2);
  ctx.fill();

  // Classic Smile
  ctx.beginPath();
  ctx.arc(128, 120, 52, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Classic Bacon Hair T-Shirt texture (black jacket over blue tee with motorcycle print)
 */
export function createRobloxShirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Black jacket
  ctx.fillStyle = '#1e2022';
  ctx.fillRect(0, 0, 256, 256);

  // Blue center undershirt
  ctx.fillStyle = '#0066cc';
  ctx.beginPath();
  ctx.moveTo(90, 0);
  ctx.lineTo(166, 0);
  ctx.lineTo(154, 256);
  ctx.lineTo(102, 256);
  ctx.closePath();
  ctx.fill();

  // Motorcycle/graphic silhouette on blue shirt
  ctx.fillStyle = '#0a2540';
  ctx.beginPath();
  ctx.arc(128, 130, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(116, 110, 24, 6);

  // Collar & zipper lines
  ctx.strokeStyle = '#44484d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 0);
  ctx.lineTo(102, 256);
  ctx.moveTo(166, 0);
  ctx.lineTo(154, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
