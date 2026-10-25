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

import { SkyboxType } from '../types/studio';

export interface SkyboxAtmosphere {
  fogColor: string;
  sunColor: string;
  ambientColor: string;
  sunIntensityMultiplier: number;
}

export function getSkyboxAtmosphere(type: SkyboxType, clockTime: number): SkyboxAtmosphere {
  switch (type) {
    case 'Night':
      return {
        fogColor: '#0A1124',
        sunColor: '#7895C9', // Soft pale blue moonlight
        ambientColor: '#1A233D',
        sunIntensityMultiplier: 0.35,
      };
    case 'Sunset':
      return {
        fogColor: '#D45D48',
        sunColor: '#FF7A45', // Radiant warm golden-orange
        ambientColor: '#6B2737',
        sunIntensityMultiplier: 0.9,
      };
    case 'Nebula':
      return {
        fogColor: '#2B104D',
        sunColor: '#E0AAFF', // Cosmic violet-magenta glow
        ambientColor: '#3C1266',
        sunIntensityMultiplier: 0.5,
      };
    case 'Cloudy':
      return {
        fogColor: '#94A3B8',
        sunColor: '#E2E8F0', // Soft diffused daylight
        ambientColor: '#64748B',
        sunIntensityMultiplier: 0.8,
      };
    case 'SciFiRed':
      return {
        fogColor: '#6B1616',
        sunColor: '#FF5733', // Atmospheric fiery crimson
        ambientColor: '#4A0E0E',
        sunIntensityMultiplier: 0.85,
      };
    case 'Clear':
    default:
      if (clockTime >= 5.2 && clockTime < 7.5) {
        return {
          fogColor: '#E58A67',
          sunColor: '#FFA366',
          ambientColor: '#FFD7BA',
          sunIntensityMultiplier: 0.85,
        };
      } else if (clockTime >= 7.5 && clockTime <= 16.5) {
        return {
          fogColor: '#97CEF2',
          sunColor: '#FFF8E7',
          ambientColor: '#E8F3FA',
          sunIntensityMultiplier: 1.25,
        };
      } else if (clockTime > 16.5 && clockTime <= 19.0) {
        return {
          fogColor: '#D45D48',
          sunColor: '#FF7A45',
          ambientColor: '#FFC8B8',
          sunIntensityMultiplier: 0.95,
        };
      } else if (clockTime > 19.0 && clockTime <= 20.5) {
        return {
          fogColor: '#243052',
          sunColor: '#5577AA',
          ambientColor: '#1E294B',
          sunIntensityMultiplier: 0.45,
        };
      } else {
        return {
          fogColor: '#0E172E',
          sunColor: '#446699',
          ambientColor: '#111827',
          sunIntensityMultiplier: 0.3,
        };
      }
  }
}

const skyboxCache = new Map<SkyboxType, THREE.CanvasTexture>();

/**
 * Returns a cached procedural 360-degree Equirectangular CanvasTexture for the specified Skybox.
 */
export function getSkyboxTexture(type: SkyboxType): THREE.CanvasTexture {
  if (skyboxCache.has(type)) {
    return skyboxCache.get(type)!;
  }
  const texture = createSkyboxEquirectangular(type);
  skyboxCache.set(type, texture);
  return texture;
}

function createSkyboxEquirectangular(type: SkyboxType): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const w = canvas.width;
  const h = canvas.height;
  const horizon = h * 0.5; // 256px = 0° eye-level horizon in equirectangular projection

  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  switch (type) {
    case 'Night': {
      // Sky (0 to horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#030611');
      skyGrad.addColorStop(0.5, '#070C1D');
      skyGrad.addColorStop(0.85, '#0D1429');
      skyGrad.addColorStop(1, '#131B33');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Ground (horizon to h)
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, h);
      groundGrad.addColorStop(0, '#10172B');
      groundGrad.addColorStop(0.4, '#0A0E1A');
      groundGrad.addColorStop(1, '#05070D');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, w, h - horizon);

      // Faint Milky Way ribbon in sky
      const milkyGrad = ctx.createLinearGradient(0, 0, w, horizon);
      milkyGrad.addColorStop(0.3, 'rgba(80, 100, 160, 0)');
      milkyGrad.addColorStop(0.55, 'rgba(120, 150, 220, 0.15)');
      milkyGrad.addColorStop(0.75, 'rgba(80, 100, 160, 0)');
      ctx.fillStyle = milkyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Procedural Stars strictly in sky hemisphere
      for (let i = 0; i < 350; i++) {
        const sx = random() * w;
        const sy = random() * (horizon - 16) + 6;
        const size = random() < 0.85 ? random() * 1.4 + 0.6 : random() * 2.4 + 1.2;
        const alpha = random() * 0.75 + 0.25;
        const isWarm = random() < 0.2;
        ctx.fillStyle = isWarm ? `rgba(255, 235, 190, ${alpha})` : `rgba(220, 238, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        if (size > 2.2) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(sx - 4, sy);
          ctx.lineTo(sx + 4, sy);
          ctx.moveTo(sx, sy - 4);
          ctx.lineTo(sx, sy + 4);
          ctx.stroke();
        }
      }

      // Crescent Moon in upper sky
      const mx = w * 0.68;
      const my = horizon * 0.38;
      const mr = 24;
      const moonGlow = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 3.5);
      moonGlow.addColorStop(0, 'rgba(190, 215, 255, 0.45)');
      moonGlow.addColorStop(1, 'rgba(190, 215, 255, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(mx, my, mr * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E8EEF8';
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#070C1D';
      ctx.beginPath();
      ctx.arc(mx + 10, my - 3, mr * 0.88, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Sunset': {
      // Sky (0 to horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#190A2E');    // Zenith deep twilight violet
      skyGrad.addColorStop(0.35, '#44164D'); // Purple
      skyGrad.addColorStop(0.6, '#932247');  // Magenta
      skyGrad.addColorStop(0.82, '#FF5226'); // Vibrant flame orange
      skyGrad.addColorStop(0.95, '#FF8A3D'); // Amber
      skyGrad.addColorStop(1, '#FFCB5A');    // Glowing golden horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Ground (horizon to h)
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, h);
      groundGrad.addColorStop(0, '#9E3F30');
      groundGrad.addColorStop(0.3, '#541F28');
      groundGrad.addColorStop(1, '#210C16');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, w, h - horizon);

      // Low sun touching the horizon
      const sunX = w * 0.5;
      const sunY = horizon * 0.94;
      const sunR = 30;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 4);
      sunGlow.addColorStop(0, 'rgba(255, 245, 180, 0.9)');
      sunGlow.addColorStop(0.3, 'rgba(255, 140, 50, 0.5)');
      sunGlow.addColorStop(1, 'rgba(255, 90, 30, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFF8E1';
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Sunset horizon clouds hovering above the horizon
      for (let i = 0; i < 9; i++) {
        const cx = ((i * 125 + 35) % w);
        const cy = horizon * (0.65 + (i % 3) * 0.08);
        const cw = 110 + (i % 4) * 35;
        const ch = 10 + (i % 3) * 5;
        ctx.fillStyle = `rgba(90, 20, 50, ${0.4 + (i % 3) * 0.1})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 200, 110, ${0.5 + (i % 2) * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy - ch * 0.35, cw * 0.85, ch * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'Nebula': {
      // Void background
      ctx.fillStyle = '#06010D';
      ctx.fillRect(0, 0, w, h);

      // Dynamic cosmic gas clouds in the sky
      const nebulas = [
        { x: w * 0.25, y: horizon * 0.45, r: 140, color: '147, 51, 234' },
        { x: w * 0.72, y: horizon * 0.52, r: 160, color: '217, 70, 239' },
        { x: w * 0.48, y: horizon * 0.32, r: 130, color: '6, 182, 212' },
        { x: w * 0.88, y: horizon * 0.4, r: 120, color: '59, 130, 246' },
        { x: w * 0.15, y: horizon * 0.65, r: 110, color: '244, 63, 94' },
      ];

      nebulas.forEach((neb) => {
        const nGrad = ctx.createRadialGradient(neb.x, neb.y, neb.r * 0.05, neb.x, neb.y, neb.r);
        nGrad.addColorStop(0, `rgba(${neb.color}, 0.55)`);
        nGrad.addColorStop(0.5, `rgba(${neb.color}, 0.25)`);
        nGrad.addColorStop(1, `rgba(${neb.color}, 0)`);
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.ellipse(neb.x, neb.y, neb.r * 1.3, neb.r * 0.75, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Stars in sky
      for (let i = 0; i < 400; i++) {
        const sx = random() * w;
        const sy = random() * (horizon - 12) + 6;
        const size = random() < 0.88 ? random() * 1.4 + 0.4 : random() * 2.6 + 1.2;
        const alpha = random() * 0.8 + 0.2;
        const colPicker = random();
        const color = colPicker < 0.4 ? '255, 255, 255' : colPicker < 0.7 ? '180, 240, 255' : '240, 190, 255';
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        if (size > 2.8) {
          ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(sx - 6, sy);
          ctx.lineTo(sx + 6, sy);
          ctx.moveTo(sx, sy - 6);
          ctx.lineTo(sx, sy + 6);
          ctx.stroke();
        }
      }
      break;
    }

    case 'Cloudy': {
      // Sky (0 to horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#4A5568');
      skyGrad.addColorStop(0.45, '#68778D');
      skyGrad.addColorStop(0.85, '#8D9CAE');
      skyGrad.addColorStop(1, '#B0BDCC');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Ground (horizon to h)
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, h);
      groundGrad.addColorStop(0, '#7A8899');
      groundGrad.addColorStop(0.5, '#475363');
      groundGrad.addColorStop(1, '#2D3748');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, w, h - horizon);

      // Diffused sun glow
      const sunX = w * 0.35;
      const sunY = horizon * 0.42;
      const sGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 130);
      sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
      ctx.fill();

      // Cloud banks in sky
      for (let i = 0; i < 16; i++) {
        const cx = (i * 85 + 20) % w;
        const cy = horizon * (0.25 + (i % 5) * 0.12);
        const cw = 140 + (i % 3) * 50;
        const ch = 24 + (i % 4) * 10;
        const isDark = i % 2 === 0;
        ctx.fillStyle = isDark ? 'rgba(65, 78, 94, 0.35)' : 'rgba(165, 178, 194, 0.4)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'SciFiRed': {
      // Sky (0 to horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#1B0404');
      skyGrad.addColorStop(0.35, '#4A0C0C');
      skyGrad.addColorStop(0.68, '#821616');
      skyGrad.addColorStop(0.9, '#B91C1C');
      skyGrad.addColorStop(1, '#EA580C');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Ground (horizon to h)
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, h);
      groundGrad.addColorStop(0, '#822416');
      groundGrad.addColorStop(0.5, '#420D0D');
      groundGrad.addColorStop(1, '#1A0404');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, w, h - horizon);

      // Giant Ringed Planetary Moon in sky
      const px = w * 0.3;
      const py = horizon * 0.42;
      const pr = 36;

      const pGlow = ctx.createRadialGradient(px, py, pr * 0.5, px, py, pr * 3);
      pGlow.addColorStop(0, 'rgba(255, 99, 71, 0.4)');
      pGlow.addColorStop(1, 'rgba(255, 99, 71, 0)');
      ctx.fillStyle = pGlow;
      ctx.beginPath();
      ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
      ctx.fill();

      const pGrad = ctx.createRadialGradient(px - 10, py - 10, 4, px, py, pr);
      pGrad.addColorStop(0, '#FFA07A');
      pGrad.addColorStop(0.7, '#B22222');
      pGrad.addColorStop(1, '#4A0808');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 180, 140, 0.65)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.2, pr * 0.45, -Math.PI / 8, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric red dust bands above horizon
      for (let i = 0; i < 8; i++) {
        const cx = (i * 125) % w;
        const cy = horizon * (0.8 + (i % 3) * 0.05);
        ctx.fillStyle = 'rgba(110, 18, 18, 0.45)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 120, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'Clear':
    default: {
      // Classic Roblox Azure Sky (0 to horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
      skyGrad.addColorStop(0, '#216FC9');   // Zenith deep blue
      skyGrad.addColorStop(0.4, '#4B95DF'); // Mid sky
      skyGrad.addColorStop(0.8, '#74B1E6'); // Classic Roblox Sky Blue
      skyGrad.addColorStop(0.96, '#B6DDF9'); // Low horizon
      skyGrad.addColorStop(1, '#D8EBFD');    // Crisp bright horizon line
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizon);

      // Ground (horizon to bottom) - baseplate ground reflection
      const groundGrad = ctx.createLinearGradient(0, horizon, 0, h);
      groundGrad.addColorStop(0, '#8EADC4');
      groundGrad.addColorStop(0.3, '#5D7385');
      groundGrad.addColorStop(1, '#3B4A56');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizon, w, h - horizon);

      // Fluffy white cumulus clouds floating in the sky above horizon
      for (let i = 0; i < 14; i++) {
        const cx = (i * 85 + 30) % w;
        const cy = horizon * (0.68 + (i % 4) * 0.06);
        const cw = 70 + (i % 3) * 35;
        const ch = 16 + (i % 3) * 6;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cloud puffs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(cx - cw * 0.3, cy - ch * 0.3, ch * 0.85, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.2, cy - ch * 0.4, ch * 0.95, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
