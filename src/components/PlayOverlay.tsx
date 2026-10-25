import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Square,
  ArrowUp,
  Heart,
  Coins,
  RefreshCw,
  Smile,
  Menu,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PlayOverlayProps {
  isPlayMode: boolean;
  onStopPlayMode: () => void;
  playerHealth: number;
  playerCoins: number;
  onMobileMove: (vec: { x: number; y: number }) => void;
  onMobileJump: () => void;
  onMobileEmote: () => void;
  onResetCharacter: () => void;
  isSprinting?: boolean;
  onToggleSprint?: () => void;
}

export const PlayOverlay: React.FC<PlayOverlayProps> = ({
  isPlayMode,
  onStopPlayMode,
  playerHealth,
  playerCoins,
  onMobileMove,
  onMobileJump,
  onMobileEmote,
  onResetCharacter,
  isSprinting = false,
  onToggleSprint,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);

  // Synchronous callback ref to avoid stale closures in window listeners
  const onMobileMoveRef = useRef(onMobileMove);
  onMobileMoveRef.current = onMobileMove;

  // Calculate clamped vector and pass to onMobileMove
  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxDist = 48;
    const dist = Math.hypot(dx, dy);

    if (dist < 3) {
      setTouchPos({ x: 0, y: 0 });
      onMobileMoveRef.current({ x: 0, y: 0 });
      return;
    }

    const clampedDist = Math.min(maxDist, dist);
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setTouchPos({ x: clampedX, y: clampedY });
    // Continuous 360-degree direction vector normalized -1 to 1
    onMobileMoveRef.current({
      x: clampedX / maxDist,
      y: clampedY / maxDist,
    });
  }, []);

  // Global window pointer listeners to guarantee zero dropped inputs even on fast finger sweeps
  useEffect(() => {
    if (!isPlayMode) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current && (activePointerIdRef.current === null || activePointerIdRef.current === e.pointerId)) {
        updateJoystick(e.clientX, e.clientY);
      }
    };

    const handleGlobalPointerEnd = (e: PointerEvent) => {
      if (isDraggingRef.current && (activePointerIdRef.current === null || activePointerIdRef.current === e.pointerId)) {
        isDraggingRef.current = false;
        activePointerIdRef.current = null;
        setTouchPos(null);
        onMobileMoveRef.current({ x: 0, y: 0 });
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleGlobalPointerEnd, { passive: true });
    window.addEventListener('pointercancel', handleGlobalPointerEnd, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerEnd);
      window.removeEventListener('pointercancel', handleGlobalPointerEnd);
    };
  }, [isPlayMode, updateJoystick]);

  if (!isPlayMode) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    activePointerIdRef.current = e.pointerId;
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    activePointerIdRef.current = null;
    setTouchPos(null);
    onMobileMoveRef.current({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      isDraggingRef.current = true;
      updateJoystick(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    if (touch) {
      updateJoystick(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    setTouchPos(null);
    onMobileMoveRef.current({ x: 0, y: 0 });
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden">
      {/* Top Left Menu (matching screenshots 1, 3, 4) */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-md rounded-lg shadow-md cursor-pointer hover:bg-black/90 transition">
          <div className="w-4.5 h-4.5 bg-white transform rotate-12 flex items-center justify-center">
            <div className="w-2 h-2 bg-black/70"></div>
          </div>
        </div>

        <button
          onClick={onStopPlayMode}
          className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-md rounded-lg text-white hover:bg-black/90 transition shadow-md"
          title="Return to Studio Editor"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 bg-black/70 backdrop-blur-md rounded-lg text-white hover:bg-black/90 transition shadow-md"
          title="In-Game Chat"
        >
          <MessageSquare className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Top Center: Iconic Red Box Stop Button (exact match from screenshots 1, 3, 4) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
        <button
          onClick={() => {
            sound.playClick();
            onStopPlayMode();
          }}
          className="group flex flex-col items-center border border-black/80 bg-white shadow-xl hover:scale-105 active:scale-95 transition"
          title="Stop Play Simulation"
        >
          {/* Red square */}
          <div className="w-9 h-9 bg-[#E00000] flex items-center justify-center">
            <Square className="w-5 h-5 fill-white text-white" />
          </div>
          {/* Stop label */}
          <div className="px-2 py-0.5 text-[11px] font-bold text-black bg-white tracking-wide border-t border-black/40">
            Stop
          </div>
        </button>
      </div>

      {/* Top Right: Player Stats HUD (Health & Coins) */}
      <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
        {/* Coins HUD */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 text-white shadow-md">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold text-xs">{playerCoins}</span>
        </div>

        {/* Health Bar HUD */}
        <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 text-white shadow-md">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <div className="w-20 h-2.5 bg-gray-700 rounded-full overflow-hidden border border-white/20">
            <div
              className={`h-full transition-all duration-300 ${
                playerHealth > 50 ? 'bg-emerald-500' : playerHealth > 20 ? 'bg-amber-500' : 'bg-red-600'
              }`}
              style={{ width: `${Math.max(0, playerHealth)}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-mono font-semibold">{playerHealth}%</span>
        </div>

        {/* Reset Character */}
        <button
          onClick={onResetCharacter}
          className="p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white shadow-md transition"
          title="Reset Character / Respawn"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center: Controls Hint for Desktop & Mobile */}
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-[11px] px-4 py-1.5 rounded-full border border-white/20 items-center gap-3 shadow-lg pointer-events-none">
        <span><b>WASD / Arrows</b> Walk</span>
        <span className="text-gray-400">•</span>
        <span><b>Shift</b> Sprint</span>
        <span className="text-gray-400">•</span>
        <span><b>Space</b> Jump</span>
        <span className="text-gray-400">•</span>
        <span><b>E</b> Wave Emote</span>
        <span className="text-gray-400">•</span>
        <span><b>Drag</b> Rotate Camera</span>
        <span className="text-gray-400">•</span>
        <span><b>Wheel</b> Zoom</span>
      </div>

      {/* Bottom Left: Touch Joystick (omnidirectional 360° controls) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto select-none">
        <div
          ref={joystickBaseRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-32 h-32 rounded-full bg-black/45 border-2 border-white/50 backdrop-blur-xs flex items-center justify-center shadow-2xl touch-none select-none cursor-pointer group active:border-white/80 transition-colors"
          title="Virtual Joystick (Drag in any direction to move avatar)"
        >
          {/* Cardinal Direction Indicators */}
          <span className="absolute top-1 text-[10px] text-white/50 font-bold select-none pointer-events-none">▲</span>
          <span className="absolute bottom-1 text-[10px] text-white/50 font-bold select-none pointer-events-none">▼</span>
          <span className="absolute left-1.5 text-[10px] text-white/50 font-bold select-none pointer-events-none">◄</span>
          <span className="absolute right-1.5 text-[10px] text-white/50 font-bold select-none pointer-events-none">►</span>

          {/* Inner boundary guide */}
          <div className="w-16 h-16 rounded-full border border-white/15 pointer-events-none absolute" />

          {/* Thumb stick with directional glow */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-xl border-2 border-white pointer-events-none transform transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: touchPos
                ? `translate(${touchPos.x}px, ${touchPos.y}px)`
                : 'translate(0px, 0px)',
              boxShadow: touchPos ? '0 0 16px rgba(255, 255, 255, 0.6)' : undefined,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-black/25 border border-white/40" />
          </div>

          <span className="absolute -bottom-5 text-[9px] text-white/70 font-semibold tracking-wider uppercase pointer-events-none">
            Move
          </span>
        </div>
      </div>

      {/* Bottom Right: Jump, Sprint & Emote Wave Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col items-center gap-2.5 pointer-events-auto select-none">
        {/* Sprint Toggle Button */}
        {onToggleSprint && (
          <button
            onClick={() => {
              sound.playClick();
              onToggleSprint();
            }}
            className={`w-11 h-11 rounded-full border-2 backdrop-blur-md flex items-center justify-center shadow-lg transition active:scale-95 ${
              isSprinting
                ? 'bg-amber-500/90 border-amber-300 text-white shadow-amber-500/40'
                : 'bg-black/50 hover:bg-black/70 border-white/50 text-white/90'
            }`}
            title="Toggle Sprint Run (Shift)"
          >
            <Zap className={`w-5 h-5 ${isSprinting ? 'fill-white text-white animate-pulse' : 'text-amber-300'}`} />
          </button>
        )}

        {/* Wave Emote Button */}
        <button
          onClick={onMobileEmote}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 active:scale-95 border-2 border-white/50 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition"
          title="Emote Wave (Arms Up! Key: E)"
        >
          <Smile className="w-6 h-6 text-amber-300" />
        </button>

        {/* Circular Jump Button */}
        <button
          onClick={onMobileJump}
          className="w-20 h-20 rounded-full bg-black/55 hover:bg-black/75 active:scale-90 border-3 border-white/70 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transition"
          title="Jump (Space)"
        >
          <ArrowUp className="w-10 h-10 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
