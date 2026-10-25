import React, { useRef, useState, useEffect } from 'react';
import {
  Square,
  ArrowUp,
  Heart,
  Coins,
  RefreshCw,
  Smile,
  Menu,
  MessageSquare,
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
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingTouch, setIsDraggingTouch] = useState(false);

  if (!isPlayMode) return null;

  // Joystick touch/mouse event handling
  const handleJoystickStart = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxDist = 45;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setTouchPos({ x: clampedX, y: clampedY });
    setIsDraggingTouch(true);
    onMobileMove({ x: clampedX / maxDist, y: clampedY / maxDist });
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!isDraggingTouch || !joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxDist = 45;
    const dist = Math.min(maxDist, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    setTouchPos({ x: clampedX, y: clampedY });
    onMobileMove({ x: clampedX / maxDist, y: clampedY / maxDist });
  };

  const handleJoystickEnd = () => {
    setIsDraggingTouch(false);
    setTouchPos(null);
    onMobileMove({ x: 0, y: 0 });
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

      {/* Bottom Center: Controls Hint for Desktop */}
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[11px] px-4 py-1.5 rounded-full border border-white/20 items-center gap-3">
        <span><b>WASD</b> or <b>Arrow Keys</b> to Walk</span>
        <span className="text-gray-400">•</span>
        <span><b>Space</b> to Jump</span>
        <span className="text-gray-400">•</span>
        <span><b>Right Click + Drag</b> to Rotate Camera</span>
      </div>

      {/* Bottom Left: Touch Joystick (matching screenshots 1, 3, 4) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickBaseRef}
          onPointerDown={(e) => handleJoystickStart(e.clientX, e.clientY)}
          onPointerMove={(e) => handleJoystickMove(e.clientX, e.clientY)}
          onPointerUp={handleJoystickEnd}
          onPointerCancel={handleJoystickEnd}
          className="relative w-28 h-28 rounded-full bg-black/40 border-2 border-white/40 backdrop-blur-xs flex items-center justify-center shadow-lg touch-none"
        >
          {/* Thumb stick */}
          <div
            className="w-12 h-12 rounded-full bg-white/70 shadow-md border-2 border-white pointer-events-none transform transition-transform duration-75"
            style={{
              transform: touchPos
                ? `translate(${touchPos.x}px, ${touchPos.y}px)`
                : 'translate(0px, 0px)',
            }}
          />
        </div>
      </div>

      {/* Bottom Right: Jump Button & Emote Wave Button (exact match from screenshots 1, 3, 4!) */}
      <div className="absolute bottom-6 right-6 flex flex-col items-center gap-3 pointer-events-auto">
        {/* Wave Emote Button (screenshots 3 & 4 show avatar waving arms!) */}
        <button
          onClick={onMobileEmote}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 active:scale-95 border-2 border-white/50 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition"
          title="Emote Wave (Arms Up like screenshots 3 & 4!)"
        >
          <Smile className="w-6 h-6 text-amber-300" />
        </button>

        {/* Circular Jump Button (Screenshot 1, 3, 4: circle with up arrow) */}
        <button
          onClick={onMobileJump}
          className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 active:scale-90 border-3 border-white/60 backdrop-blur-md flex items-center justify-center text-white shadow-xl transition"
          title="Jump (Space)"
        >
          <ArrowUp className="w-10 h-10 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
