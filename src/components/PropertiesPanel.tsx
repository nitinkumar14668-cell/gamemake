import React, { useState } from 'react';
import { RobloxObject, MaterialType, LightingSettings, SkyboxType } from '../types/studio';
import {
  Code,
  Sliders,
  CheckSquare,
  Square,
  Palette,
  Box,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Sparkles,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Globe,
  Cloud,
} from 'lucide-react';
import { sound } from '../utils/audio';

const SKYBOX_OPTIONS: { id: SkyboxType; label: string; desc: string; color: string }[] = [
  { id: 'Clear', label: 'Clear (Classic)', desc: 'Roblox blue sky with clouds', color: '#38BDF8' },
  { id: 'Night', label: 'Night Starfield', desc: 'Starry night sky with moonlight', color: '#6366F1' },
  { id: 'Sunset', label: 'Golden Sunset', desc: 'Warm orange twilight horizon', color: '#F97316' },
  { id: 'Nebula', label: 'Cosmic Nebula', desc: 'Deep violet space with stars', color: '#A855F7' },
  { id: 'Cloudy', label: 'Overcast Cloudy', desc: 'Muted slate & silver storm clouds', color: '#64748B' },
  { id: 'SciFiRed', label: 'Sci-Fi Crimson', desc: 'Martian red atmosphere & fog', color: '#EF4444' },
];

interface PropertiesPanelProps {
  selectedObject: RobloxObject | null;
  selectedId: string | null;
  lightingSettings: LightingSettings;
  onUpdateObject: (id: string, updates: Partial<RobloxObject>) => void;
  onUpdateLighting: (updates: Partial<LightingSettings>) => void;
  onOpenScriptEditor: (id: string) => void;
}

const ROBLOX_PALETTE = [
  { name: 'Institutional white', color: '#FFFFFF' },
  { name: 'Medium stone grey', color: '#A0A0A0' },
  { name: 'Dark stone grey', color: '#63666A' },
  { name: 'Really black', color: '#1B1B1E' },
  { name: 'Bright red', color: '#DA2C38' },
  { name: 'Really blue', color: '#0066FF' },
  { name: 'Bright blue', color: '#00A2FF' },
  { name: 'Bright yellow', color: '#FFD700' },
  { name: 'Lime green', color: '#2ECC71' },
  { name: 'Dark green', color: '#1E824C' },
  { name: 'Neon orange', color: '#FF6B00' },
  { name: 'Magenta', color: '#E056FD' },
  { name: 'Reddish brown', color: '#6A4A3A' },
  { name: 'Sand red', color: '#955251' },
];

const AMBIENT_PALETTE = [
  { name: 'Studio White', color: '#FFFFFF' },
  { name: 'Warm Daylight', color: '#FFEBD0' },
  { name: 'Roblox Blue Sky', color: '#8FB8E0' },
  { name: 'Golden Sunset', color: '#FF9E64' },
  { name: 'Midnight Blue', color: '#1E293B' },
  { name: 'Purple Dusk', color: '#A855F7' },
  { name: 'Neon Cyan', color: '#00E5FF' },
];

const MATERIALS: MaterialType[] = [
  'SmoothPlastic',
  'Neon',
  'Wood',
  'Metal',
  'Grass',
  'Glass',
  'Forcefield',
  'Brick',
  'Foil',
  'Ice',
];

function formatClockTime(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  const padH = h.toString().padStart(2, '0');
  const padM = m.toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${padH}:${padM} (${displayH}:${padM} ${ampm})`;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  selectedId,
  lightingSettings,
  onUpdateObject,
  onUpdateLighting,
  onOpenScriptEditor,
}) => {
  const [isLightingSectionOpen, setIsLightingSectionOpen] = useState(true);
  const [isObjectPropertiesOpen, setIsObjectPropertiesOpen] = useState(true);

  const isLightingSelected = selectedId === 'lighting';

  // Helper for shadow softness label
  const getSoftnessLabel = (val: number) => {
    if (val < 0.25) return 'Sharp (Hard)';
    if (val < 0.55) return 'Medium Soft';
    if (val < 0.85) return 'Soft (PBR)';
    return 'Ultra Soft';
  };

  const handleTimePreset = (time: number) => {
    onUpdateLighting({ clockTime: time });
    sound.playClick();
  };

  const renderLightingCategory = () => (
    <div className="border-b border-gray-200 bg-amber-50/40">
      {/* Category Header */}
      <div
        onClick={() => setIsLightingSectionOpen(!isLightingSectionOpen)}
        className="px-2 py-1.5 bg-[#E6EDF5] hover:bg-[#DCE6F2] border-y border-[#CCD8E6] flex items-center justify-between cursor-pointer text-gray-800 font-semibold text-[11px]"
      >
        <div className="flex items-center gap-1.5 text-amber-800">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Lighting (Scene Environment)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-amber-700 font-mono font-medium">
            {formatClockTime(lightingSettings.clockTime)}
          </span>
          {isLightingSectionOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>
      </div>

      {isLightingSectionOpen && (
        <div className="p-2 space-y-3 divide-y divide-amber-100 text-gray-700">
          {/* 1. Skybox Environment Dropdown */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Skybox (Environment)</span>
              </span>
              <span className="font-mono text-[10px] text-sky-900 bg-sky-100 px-1.5 py-0.5 rounded font-bold">
                {lightingSettings.skybox || 'Clear'}
              </span>
            </div>

            {/* Dropdown Select */}
            <select
              value={lightingSettings.skybox || 'Clear'}
              onChange={(e) => {
                onUpdateLighting({ skybox: e.target.value as SkyboxType });
                sound.playClick();
              }}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 focus:outline-hidden focus:border-blue-500 font-medium cursor-pointer shadow-2xs"
            >
              {SKYBOX_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} - {opt.desc}
                </option>
              ))}
            </select>

            {/* Quick Skybox Preview Chips (1-Click Switch) */}
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              {SKYBOX_OPTIONS.map((opt) => {
                const isActive = (lightingSettings.skybox || 'Clear') === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onUpdateLighting({ skybox: opt.id });
                      sound.playClick();
                    }}
                    title={`${opt.label}: ${opt.desc}`}
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px] font-medium transition text-left border cursor-pointer ${
                      isActive
                        ? 'bg-sky-100 border-sky-400 text-sky-900 ring-1 ring-sky-400 shadow-xs'
                        : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className="truncate">{opt.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Time of Day (ClockTime) */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-600" />
                <span>Time of Day (ClockTime)</span>
              </span>
              <span className="font-mono text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                {formatClockTime(lightingSettings.clockTime)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={lightingSettings.clockTime}
              onChange={(e) => onUpdateLighting({ clockTime: Number(e.target.value) })}
              className="w-full accent-amber-600 h-1.5 cursor-pointer"
            />

            {/* Quick Time Presets */}
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              <button
                onClick={() => handleTimePreset(6.0)}
                className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-medium text-amber-900 transition"
                title="Dawn Sunrise (06:00)"
              >
                <Sunrise className="w-3 h-3 text-orange-500" />
                <span>06:00</span>
              </button>
              <button
                onClick={() => handleTimePreset(12.0)}
                className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-medium text-amber-900 transition"
                title="Noon Bright Sun (12:00)"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>12:00</span>
              </button>
              <button
                onClick={() => handleTimePreset(18.0)}
                className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-medium text-amber-900 transition"
                title="Golden Sunset (18:00)"
              >
                <Sunset className="w-3 h-3 text-rose-500" />
                <span>18:00</span>
              </button>
              <button
                onClick={() => handleTimePreset(0.0)}
                className="flex items-center justify-center gap-1 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-medium text-amber-900 transition"
                title="Midnight Sky with Stars (00:00)"
              >
                <Moon className="w-3 h-3 text-indigo-500" />
                <span>00:00</span>
              </button>
            </div>
          </div>

          {/* 2. Ambient Color */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <Palette className="w-3 h-3 text-blue-600" />
                <span>Ambient Color</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={lightingSettings.ambientColor}
                  onChange={(e) => onUpdateLighting({ ambientColor: e.target.value })}
                  className="w-4 h-4 cursor-pointer rounded border border-gray-300"
                />
                <span className="font-mono text-[10px] text-gray-600">{lightingSettings.ambientColor}</span>
              </div>
            </div>

            {/* Quick Ambient Swatches */}
            <div className="grid grid-cols-7 gap-1">
              {AMBIENT_PALETTE.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={() => {
                    onUpdateLighting({ ambientColor: swatch.color });
                    sound.playClick();
                  }}
                  title={swatch.name}
                  style={{ backgroundColor: swatch.color }}
                  className={`h-4.5 rounded-xs border transition ${
                    lightingSettings.ambientColor.toLowerCase() === swatch.color.toLowerCase()
                      ? 'border-black ring-1 ring-amber-500 scale-105'
                      : 'border-gray-400/60 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 3. Shadow Softness */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-indigo-600" />
                <span>Shadow Softness</span>
              </span>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-semibold">
                {getSoftnessLabel(lightingSettings.shadowSoftness)} ({lightingSettings.shadowSoftness.toFixed(2)})
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={lightingSettings.shadowSoftness}
              onChange={(e) => onUpdateLighting({ shadowSoftness: Number(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-gray-500">
              <span>0.0 (Sharp)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Ultra Soft)</span>
            </div>
          </div>

          {/* 4. Sun Brightness / Exposure */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-800">Sun Brightness</span>
              <span className="font-mono text-[10px]">{lightingSettings.sunBrightness.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.05"
              value={lightingSettings.sunBrightness}
              onChange={(e) => onUpdateLighting({ sunBrightness: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );

  // If Lighting is directly selected in Explorer, show pure Lighting properties view
  if (isLightingSelected || !selectedObject) {
    return (
      <div className="flex flex-col h-full bg-white text-xs select-none overflow-y-auto">
        <div className="sticky top-0 z-10 px-2 py-1 bg-[#E8E8E8] border-b border-[#D0D0D0] font-semibold text-gray-800 text-[11px] flex items-center justify-between">
          <span>Properties - Lighting</span>
          <span className="text-[10px] text-amber-700 font-mono">Service: Lighting</span>
        </div>

        {renderLightingCategory()}

        {!selectedObject && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-400">
            <Box className="w-7 h-7 mb-1.5 opacity-30" />
            <p className="text-[11px]">
              Select any object in the 3D viewport to adjust its size, color, material, or Lua scripts.
            </p>
          </div>
        )}
      </div>
    );
  }

  const obj = selectedObject;

  const handleSizeChange = (axis: 0 | 1 | 2, val: number) => {
    const newSize = [...obj.size] as [number, number, number];
    newSize[axis] = Math.max(0.2, val);
    onUpdateObject(obj.id, { size: newSize });
  };

  const handleQuickScale = (factor: number) => {
    const newSize = [
      Math.max(0.2, Number((obj.size[0] * factor).toFixed(2))),
      Math.max(0.2, Number((obj.size[1] * factor).toFixed(2))),
      Math.max(0.2, Number((obj.size[2] * factor).toFixed(2))),
    ] as [number, number, number];
    onUpdateObject(obj.id, { size: newSize });
    sound.playClick();
  };

  const handlePositionChange = (axis: 0 | 1 | 2, val: number) => {
    const newPos = [...obj.position] as [number, number, number];
    newPos[axis] = val;
    onUpdateObject(obj.id, { position: newPos });
  };

  const handleRotationChange = (axis: 0 | 1 | 2, val: number) => {
    const newRot = [...obj.rotation] as [number, number, number];
    newRot[axis] = val;
    onUpdateObject(obj.id, { rotation: newRot });
  };

  return (
    <div className="flex flex-col h-full bg-white text-xs select-none overflow-y-auto">
      {/* Properties Header */}
      <div className="sticky top-0 z-10 px-2 py-1 bg-[#E8E8E8] border-b border-[#D0D0D0] font-semibold text-gray-800 text-[11px] flex items-center justify-between">
        <span>Properties - {obj.name}</span>
        <span className="text-[10px] text-gray-500 font-mono">Class: {obj.type}</span>
      </div>

      <div className="divide-y divide-gray-100 text-gray-700">
        {/* NEW LIGHTING CATEGORY (Available inside PropertiesPanel) */}
        {renderLightingCategory()}

        {/* SECTION: Identity */}
        <div className="p-2 space-y-1.5">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Identity</div>
          <div className="grid grid-cols-3 items-center gap-1">
            <label className="text-[11px] text-gray-500">Name</label>
            <input
              type="text"
              value={obj.name}
              onChange={(e) => onUpdateObject(obj.id, { name: e.target.value })}
              className="col-span-2 px-1.5 py-0.5 border border-gray-300 rounded text-[11px] bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* SECTION: Size & Transform */}
        <div className="p-2 space-y-2 bg-blue-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Size & Transform</span>
            <span className="text-[9px] text-blue-600 font-medium">Resize / Adjust Size</span>
          </div>

          {/* Size (X, Y, Z) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-700">Size (Studs)</span>
              <span className="font-mono text-[10px] text-gray-500">
                {obj.size[0].toFixed(1)}, {obj.size[1].toFixed(1)}, {obj.size[2].toFixed(1)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center border border-red-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-red-500 mr-1">X:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.2"
                  value={obj.size[0]}
                  onChange={(e) => handleSizeChange(0, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-green-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-green-600 mr-1">Y:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.2"
                  value={obj.size[1]}
                  onChange={(e) => handleSizeChange(1, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-blue-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-blue-500 mr-1">Z:</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.2"
                  value={obj.size[2]}
                  onChange={(e) => handleSizeChange(2, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
            </div>

            {/* Quick Scale Buttons */}
            <div className="flex items-center gap-1 pt-1">
              <span className="text-[10px] text-gray-500">Scale:</span>
              <button
                onClick={() => handleQuickScale(0.5)}
                className="px-1.5 py-0.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-[10px] font-medium"
              >
                0.5x
              </button>
              <button
                onClick={() => handleQuickScale(1.25)}
                className="px-1.5 py-0.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-[10px] font-medium"
              >
                1.25x
              </button>
              <button
                onClick={() => handleQuickScale(1.5)}
                className="px-1.5 py-0.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-[10px] font-medium"
              >
                1.5x
              </button>
              <button
                onClick={() => handleQuickScale(2.0)}
                className="px-1.5 py-0.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-[10px] font-medium"
              >
                2x
              </button>
            </div>
          </div>

          {/* Position (X, Y, Z) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-700">Position</span>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-red-500 mr-1">X:</span>
                <input
                  type="number"
                  step="1"
                  value={obj.position[0]}
                  onChange={(e) => handlePositionChange(0, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-green-600 mr-1">Y:</span>
                <input
                  type="number"
                  step="1"
                  value={obj.position[1]}
                  onChange={(e) => handlePositionChange(1, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] font-bold text-blue-500 mr-1">Z:</span>
                <input
                  type="number"
                  step="1"
                  value={obj.position[2]}
                  onChange={(e) => handlePositionChange(2, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Rotation (X, Y, Z) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-700">Orientation (Degrees)</span>
            <div className="grid grid-cols-3 gap-1">
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] text-gray-400 mr-1">X:</span>
                <input
                  type="number"
                  step="15"
                  value={obj.rotation[0]}
                  onChange={(e) => handleRotationChange(0, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] text-gray-400 mr-1">Y:</span>
                <input
                  type="number"
                  step="15"
                  value={obj.rotation[1]}
                  onChange={(e) => handleRotationChange(1, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded px-1 bg-white">
                <span className="text-[9px] text-gray-400 mr-1">Z:</span>
                <input
                  type="number"
                  step="15"
                  value={obj.rotation[2]}
                  onChange={(e) => handleRotationChange(2, Number(e.target.value))}
                  className="w-full text-[11px] font-mono py-0.5 outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Appearance & Materials */}
        <div className="p-2 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Appearance</div>

          {/* Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-gray-600">Color (BrickColor)</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={obj.color}
                  onChange={(e) => onUpdateObject(obj.id, { color: e.target.value })}
                  className="w-4 h-4 cursor-pointer rounded border border-gray-300"
                />
                <span className="font-mono text-[10px] text-gray-500">{obj.color}</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {ROBLOX_PALETTE.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={() => {
                    onUpdateObject(obj.id, { color: swatch.color });
                    sound.playClick();
                  }}
                  title={swatch.name}
                  style={{ backgroundColor: swatch.color }}
                  className={`h-4.5 rounded-xs border transition ${
                    obj.color.toLowerCase() === swatch.color.toLowerCase()
                      ? 'border-black ring-1 ring-blue-500 scale-105'
                      : 'border-gray-400/60 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="grid grid-cols-3 items-center gap-1">
            <label className="text-[11px] text-gray-600">Material</label>
            <select
              value={obj.material}
              onChange={(e) => onUpdateObject(obj.id, { material: e.target.value as MaterialType })}
              className="col-span-2 px-1.5 py-0.5 border border-gray-300 rounded text-[11px] bg-white"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Transparency Slider */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px] text-gray-600">
              <span>Transparency</span>
              <span className="font-mono text-[10px]">{obj.transparency.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={obj.transparency}
              onChange={(e) => onUpdateObject(obj.id, { transparency: Number(e.target.value) })}
              className="w-full accent-blue-600 h-1.5"
            />
          </div>
        </div>

        {/* SECTION: Physics & Collision */}
        <div className="p-2 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Physics & Behavior</div>

          <div className="flex items-center justify-between">
            <label className="text-[11px] text-gray-700 font-medium">Anchored</label>
            <input
              type="checkbox"
              checked={obj.anchored}
              onChange={(e) => onUpdateObject(obj.id, { anchored: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-[11px] text-gray-700 font-medium">CanCollide</label>
            <input
              type="checkbox"
              checked={obj.canCollide}
              onChange={(e) => onUpdateObject(obj.id, { canCollide: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-[11px] text-gray-700 font-medium">CastShadow</label>
            <input
              type="checkbox"
              checked={obj.castShadow}
              onChange={(e) => onUpdateObject(obj.id, { castShadow: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* SECTION: Lua Scripting */}
        <div className="p-2 space-y-2 bg-indigo-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              <Code className="w-3.5 h-3.5" />
              <span>Lua Scripting</span>
            </div>
            {obj.scriptCode && (
              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-mono">
                Script Active
              </span>
            )}
          </div>

          <p className="text-[10px] text-gray-600">
            Attach or edit Lua behaviors (Touched events, loops, tween movement, damage).
          </p>

          <button
            onClick={() => onOpenScriptEditor(obj.id)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-[11px] shadow-xs transition"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{obj.scriptCode ? 'Edit Attached Lua Script' : 'Add New Lua Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
