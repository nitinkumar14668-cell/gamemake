import React, { useState } from 'react';
import { RobloxObject, RobloxSubPart, PartShape, MaterialType, CatalogModelTemplate } from '../types/studio';
import {
  Box,
  Plus,
  Trash2,
  X,
  Save,
  Sparkles,
  Upload,
  Layers,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CustomModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomModel: (model: CatalogModelTemplate) => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error') => void;
}

const PRESET_CUSTOM_TEMPLATES: {
  title: string;
  description: string;
  color: string;
  parts: RobloxSubPart[];
}[] = [
  {
    title: 'Sci-Fi Teleport Portal',
    description: 'Futuristic arched portal gate with glowing neon energy vortex.',
    color: '#00E5FF',
    parts: [
      { id: 'p-base', name: 'PortalBase', shape: 'Cylinder', offset: [0, 0.4, 0], rotation: [0, 0, 0], size: [6, 0.8, 6], color: '#222226', material: 'Metal' },
      { id: 'p-left', name: 'PillarLeft', shape: 'Block', offset: [-2.5, 4, 0], rotation: [0, 0, 0], size: [1, 7, 1.2], color: '#33333A', material: 'Metal' },
      { id: 'p-right', name: 'PillarRight', shape: 'Block', offset: [2.5, 4, 0], rotation: [0, 0, 0], size: [1, 7, 1.2], color: '#33333A', material: 'Metal' },
      { id: 'p-top', name: 'TopArch', shape: 'Block', offset: [0, 7.5, 0], rotation: [0, 0, 0], size: [6, 1, 1.2], color: '#33333A', material: 'Metal' },
      { id: 'p-vortex', name: 'EnergyVortex', shape: 'Ball', offset: [0, 4, 0], rotation: [0, 0, 0], size: [3.5, 5, 0.4], color: '#00E5FF', material: 'Neon', canCollide: false },
    ],
  },
  {
    title: 'Hovercraft Speeder',
    description: 'Sleek aerodynamic hovercraft with dual thrusters and cockpit.',
    color: '#FF6B00',
    parts: [
      { id: 'h-hull', name: 'SpeederChassis', shape: 'Block', offset: [0, 1, 0], rotation: [0, 0, 0], size: [4, 1, 7], color: '#E04000', material: 'SmoothPlastic' },
      { id: 'h-nose', name: 'NoseWedge', shape: 'Wedge', offset: [0, 1, 4.5], rotation: [0, 180, 0], size: [4, 1, 2], color: '#FF7700', material: 'SmoothPlastic' },
      { id: 'h-glass', name: 'CockpitCanopy', shape: 'Block', offset: [0, 1.8, 0.5], rotation: [0, 0, 0], size: [2.8, 0.8, 3], color: '#00D4FF', material: 'Glass', transparency: 0.4 },
      { id: 'h-t1', name: 'ThrusterL', shape: 'Cylinder', offset: [-1.8, 1, -3.5], rotation: [90, 0, 0], size: [1, 2, 1], color: '#1B1B1E', material: 'Metal' },
      { id: 'h-t2', name: 'ThrusterR', shape: 'Cylinder', offset: [1.8, 1, -3.5], rotation: [90, 0, 0], size: [1, 2, 1], color: '#1B1B1E', material: 'Metal' },
      { id: 'h-glow1', name: 'GlowL', shape: 'Cylinder', offset: [-1.8, 1, -4.6], rotation: [90, 0, 0], size: [0.8, 0.2, 0.8], color: '#00E5FF', material: 'Neon' },
      { id: 'h-glow2', name: 'GlowR', shape: 'Cylinder', offset: [1.8, 1, -4.6], rotation: [90, 0, 0], size: [0.8, 0.2, 0.8], color: '#00E5FF', material: 'Neon' },
    ],
  },
  {
    title: 'Giant Golden Winner Trophy',
    description: 'Shining champion gold cup with stepped marble base.',
    color: '#FFD700',
    parts: [
      { id: 'tr-b1', name: 'PlinthBase', shape: 'Block', offset: [0, 0.4, 0], rotation: [0, 0, 0], size: [4, 0.8, 4], color: '#1E1E24', material: 'SmoothPlastic' },
      { id: 'tr-b2', name: 'Stem', shape: 'Cylinder', offset: [0, 1.8, 0], rotation: [0, 0, 0], size: [1.2, 2, 1.2], color: '#FFD700', material: 'Neon' },
      { id: 'tr-cup', name: 'GoldCup', shape: 'Cylinder', offset: [0, 4, 0], rotation: [0, 0, 0], size: [3.2, 2.5, 3.2], color: '#FFD700', material: 'Neon' },
      { id: 'tr-h1', name: 'HandleL', shape: 'Block', offset: [-2, 4, 0], rotation: [0, 0, 0], size: [0.6, 1.6, 0.6], color: '#FFB700', material: 'Metal' },
      { id: 'tr-h2', name: 'HandleR', shape: 'Block', offset: [2, 4, 0], rotation: [0, 0, 0], size: [0.6, 1.6, 0.6], color: '#FFB700', material: 'Metal' },
    ],
  },
];

export const CustomModelModal: React.FC<CustomModelModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomModel,
  onLog,
}) => {
  const [modelName, setModelName] = useState('MyCustomModel');
  const [category, setCategory] = useState<'mechanics' | 'buildings' | 'nature' | 'vehicles'>('buildings');
  const [description, setDescription] = useState('Custom compound model built in Roblox Studio Web.');
  const [subParts, setSubParts] = useState<RobloxSubPart[]>([
    {
      id: 'p-1',
      name: 'MainBody',
      shape: 'Block',
      offset: [0, 1, 0],
      rotation: [0, 0, 0],
      size: [4, 2, 4],
      color: '#0066CC',
      material: 'SmoothPlastic',
      canCollide: true,
    },
    {
      id: 'p-2',
      name: 'TopRoof',
      shape: 'Wedge',
      offset: [0, 2.6, 0],
      rotation: [0, 0, 0],
      size: [4, 1.2, 4],
      color: '#FF2200',
      material: 'SmoothPlastic',
      canCollide: true,
    },
  ]);

  if (!isOpen) return null;

  const handleAddPart = () => {
    const newPart: RobloxSubPart = {
      id: 'sub_' + Math.random().toString(36).substring(2, 8),
      name: `SubPart_${subParts.length + 1}`,
      shape: 'Block',
      offset: [0, 2 + subParts.length * 0.5, 0],
      rotation: [0, 0, 0],
      size: [2, 2, 2],
      color: '#FFD700',
      material: 'SmoothPlastic',
      canCollide: true,
    };
    setSubParts([...subParts, newPart]);
    sound.playPlace();
  };

  const handleRemovePart = (id: string) => {
    setSubParts(subParts.filter((p) => p.id !== id));
    sound.playClick();
  };

  const handleUpdatePart = (id: string, updates: Partial<RobloxSubPart>) => {
    setSubParts(subParts.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleLoadPreset = (preset: typeof PRESET_CUSTOM_TEMPLATES[0]) => {
    setModelName(preset.title);
    setDescription(preset.description);
    setSubParts(preset.parts);
    sound.playCoin();
    onLog(`[Custom Model] Loaded preset: ${preset.title}`, 'log');
  };

  const handleSave = () => {
    if (!modelName.trim()) return;

    // Calculate bounding box size from subparts
    let maxX = 2, maxY = 2, maxZ = 2;
    subParts.forEach((sp) => {
      maxX = Math.max(maxX, Math.abs(sp.offset[0]) * 2 + sp.size[0]);
      maxY = Math.max(maxY, sp.offset[1] + sp.size[1]);
      maxZ = Math.max(maxZ, Math.abs(sp.offset[2]) * 2 + sp.size[2]);
    });

    const newModel: CatalogModelTemplate = {
      id: 'custom_' + Date.now(),
      name: modelName,
      category,
      description,
      badge: 'Custom',
      previewColor: subParts[0]?.color || '#0066CC',
      template: {
        name: modelName,
        type: 'Model',
        shape: 'Block',
        position: [0, maxY / 2, 0],
        rotation: [0, 0, 0],
        size: [Number(maxX.toFixed(1)), Number(maxY.toFixed(1)), Number(maxZ.toFixed(1))],
        color: subParts[0]?.color || '#0066CC',
        material: subParts[0]?.material || 'SmoothPlastic',
        anchored: true,
        canCollide: true,
        transparency: 0,
        reflectance: 0,
        castShadow: true,
        subParts: subParts,
      },
    };

    onSaveCustomModel(newModel);
    sound.playCoin();
    onLog(`[Custom Model] Saved custom model "${modelName}" to Toolbox!`, 'log');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-gray-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-gray-800 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Box className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Custom Model Creator (Naya Model Banayein)</h2>
              <p className="text-[11px] text-emerald-100">
                Create composite models, add multiple sub-parts, or load generator presets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Starters */}
        <div className="px-5 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-emerald-800 uppercase shrink-0">Quick Presets:</span>
          {PRESET_CUSTOM_TEMPLATES.map((preset) => (
            <button
              key={preset.title}
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-900 font-medium text-[11px] flex items-center gap-1.5 transition shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Column: Model Settings */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Model Name</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                <option value="buildings">Buildings & Architecture</option>
                <option value="mechanics">Gameplay & Mechanics</option>
                <option value="vehicles">Vehicles & Props</option>
                <option value="nature">Nature & Decor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden resize-none"
              />
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <div className="font-semibold text-gray-800">Total Sub-Parts: {subParts.length}</div>
              <p className="text-[10px] text-gray-500">
                When saved, this model will be available in the <b>Toolbox &gt; My Custom Models</b> tab to place anywhere on your map!
              </p>
            </div>
          </div>

          {/* Right Columns: Sub-Parts List */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-xs">Compound Sub-Parts ({subParts.length})</span>
              <button
                onClick={handleAddPart}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sub-Part</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {subParts.map((sp, idx) => (
                <div
                  key={sp.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 hover:border-emerald-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={sp.name}
                        onChange={(e) => handleUpdatePart(sp.id, { name: e.target.value })}
                        className="px-2 py-0.5 border border-gray-300 rounded font-semibold text-xs bg-white w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Shape */}
                      <select
                        value={sp.shape}
                        onChange={(e) => handleUpdatePart(sp.id, { shape: e.target.value as PartShape })}
                        className="px-2 py-0.5 border border-gray-300 rounded bg-white text-[11px]"
                      >
                        <option value="Block">Block</option>
                        <option value="Ball">Sphere</option>
                        <option value="Cylinder">Cylinder</option>
                        <option value="Wedge">Wedge</option>
                      </select>

                      {/* Color */}
                      <input
                        type="color"
                        value={sp.color}
                        onChange={(e) => handleUpdatePart(sp.id, { color: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                        title="Part Color"
                      />

                      {/* Material */}
                      <select
                        value={sp.material}
                        onChange={(e) => handleUpdatePart(sp.id, { material: e.target.value as MaterialType })}
                        className="px-2 py-0.5 border border-gray-300 rounded bg-white text-[11px]"
                      >
                        <option value="SmoothPlastic">SmoothPlastic</option>
                        <option value="Neon">Neon</option>
                        <option value="Metal">Metal</option>
                        <option value="Wood">Wood</option>
                        <option value="Glass">Glass</option>
                      </select>

                      <button
                        onClick={() => handleRemovePart(sp.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Delete Sub-Part"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Size & Offset */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1 bg-white p-1 rounded border border-gray-200">
                      <span className="font-semibold text-gray-500">Size (X,Y,Z):</span>
                      <input
                        type="number"
                        step="0.5"
                        value={sp.size[0]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { size: [Number(e.target.value), sp.size[1], sp.size[2]] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={sp.size[1]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { size: [sp.size[0], Number(e.target.value), sp.size[2]] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={sp.size[2]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { size: [sp.size[0], sp.size[1], Number(e.target.value)] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded border border-gray-200">
                      <span className="font-semibold text-gray-500">Offset (X,Y,Z):</span>
                      <input
                        type="number"
                        step="0.5"
                        value={sp.offset[0]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { offset: [Number(e.target.value), sp.offset[1], sp.offset[2]] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={sp.offset[1]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { offset: [sp.offset[0], Number(e.target.value), sp.offset[2]] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={sp.offset[2]}
                        onChange={(e) =>
                          handleUpdatePart(sp.id, { offset: [sp.offset[0], sp.offset[1], Number(e.target.value)] })
                        }
                        className="w-10 border rounded px-1 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Custom Model to Toolbox</span>
          </button>
        </div>
      </div>
    </div>
  );
};
