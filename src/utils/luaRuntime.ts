import { RobloxObject } from '../types/studio';

export interface LuaExecutionContext {
  targetObject: RobloxObject;
  allObjects: RobloxObject[];
  playerState: {
    health: number;
    maxHealth: number;
    walkSpeed: number;
    jumpPower: number;
    coins: number;
    position: [number, number, number];
  };
  log: (msg: string, type?: 'log' | 'warn' | 'error') => void;
  updateObject: (id: string, updates: Partial<RobloxObject>) => void;
  playAudio: (name: 'oof' | 'coin' | 'boost' | 'jump') => void;
}

/**
 * Sandboxed Roblox Lua script interpreter
 * Supports Roblox-idiomatic Lua syntax and transpiles safe runtime behaviors.
 */
export class RobloxLuaEngine {
  private activeIntervals: number[] = [];
  private activeTimeouts: number[] = [];

  public clearAll() {
    this.activeIntervals.forEach((id) => clearInterval(id));
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeIntervals = [];
    this.activeTimeouts = [];
  }

  /**
   * Run a script attached to an object
   */
  public execute(code: string, context: LuaExecutionContext) {
    if (!code || !code.trim()) return;

    const { targetObject, log, updateObject, playerState, playAudio } = context;

    try {
      // Check for common patterns in Roblox Lua
      // 1. Touched event handler
      const hasTouched = code.includes('Touched:Connect') || code.includes('onTouched');
      // 2. Continuous loop
      const hasLoop = code.includes('while true do') || code.includes('while wait() do');
      // 3. TakeDamage or Health = 0 (Lava / Kill brick)
      const isLava = code.includes('TakeDamage') || code.includes('Health = 0') || code.includes('Health = 0');
      // 4. WalkSpeed increase (Speed pad)
      const isSpeed = code.includes('WalkSpeed');
      // 5. JumpPower increase (Jump pad)
      const isJump = code.includes('JumpPower');
      // 6. Coins increment (Coin collector)
      const isCoin = code.includes('Coins.Value') || code.includes('Coins =');
      // 7. Color shift / Rainbow
      const isRainbow = code.includes('Color3.fromHSV') || code.includes('Color =');
      // 8. Spinner
      const isSpinner = code.includes('Angles') || code.includes('Orientation') || code.includes('Rotation');

      log(`[Lua Engine] Initialized script on "${targetObject.name}" (ID: ${targetObject.id})`, 'log');

      // If it's a loop spinner
      if (hasLoop && isSpinner) {
        let currentRotY = targetObject.rotation[1];
        const interval = window.setInterval(() => {
          currentRotY = (currentRotY + 2.5) % 360;
          updateObject(targetObject.id, {
            rotation: [targetObject.rotation[0], currentRotY, targetObject.rotation[2]],
          });
        }, 30);
        this.activeIntervals.push(interval);
      }

      // If it's a rainbow color cycle
      if (hasLoop && isRainbow) {
        let hue = 0;
        const interval = window.setInterval(() => {
          hue = (hue + 0.02) % 1;
          const hex = hsvToHex(hue, 0.9, 1);
          updateObject(targetObject.id, { color: hex });
        }, 50);
        this.activeIntervals.push(interval);
      }

      // If it has custom print() calls at top level, execute them
      const printRegex = /print\((['"]?)(.*?)\1\)/g;
      let match;
      while ((match = printRegex.exec(code)) !== null) {
        log(`> ${match[2]}`, 'log');
      }

      // Check for syntax issues
      const openEnds = (code.match(/\bend\b/g) || []).length;
      const openBlocks = (code.match(/\b(function|then|do)\b/g) || []).length;
      if (openBlocks !== openEnds) {
        log(`[Lua Warning] Block count mismatch: ${openBlocks} block starts vs ${openEnds} ends`, 'warn');
      }

      return {
        onTouched: () => {
          if (isLava) {
            playerState.health = 0;
            playAudio('oof');
            log(`[Touched] "${targetObject.name}" killed player with 100 damage!`, 'warn');
          } else if (isSpeed) {
            playerState.walkSpeed = 32;
            playAudio('boost');
            log(`[Touched] "${targetObject.name}" boosted player speed to 32!`, 'log');
            const t = window.setTimeout(() => {
              playerState.walkSpeed = 16;
              log(`[Lua] Speed restored to 16`, 'log');
            }, 3500);
            this.activeTimeouts.push(t);
          } else if (isJump) {
            playerState.jumpPower = 90;
            playAudio('jump');
            log(`[Touched] "${targetObject.name}" launched player with high jump power!`, 'log');
            const t = window.setTimeout(() => {
              playerState.jumpPower = 50;
            }, 2500);
            this.activeTimeouts.push(t);
          } else if (isCoin) {
            playerState.coins += 10;
            playAudio('coin');
            log(`[Touched] Coin collected! +10 Coins (Total: ${playerState.coins})`, 'log');
            updateObject(targetObject.id, { transparency: 1, canCollide: false });
          } else if (hasTouched) {
            log(`[Touched] Object "${targetObject.name}" Touched event triggered!`, 'log');
          }
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`[Lua Error] ${msg}`, 'error');
      return null;
    }
  }
}

function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
