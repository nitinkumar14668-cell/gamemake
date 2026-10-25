import React, { useState } from 'react';
import { CATALOG_MODELS } from '../data/robloxCatalog';
import { CatalogModelTemplate } from '../types/studio';
import {
  Wrench,
  Search,
  X,
  Plus,
  Crosshair,
  Zap,
  Home,
  Trees,
  Car,
  Box,
  Layers,
  Sparkles,
  UserCheck,
  FolderPlus,
  HeartPulse,
  Building,
  Train,
  Milestone,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ToolboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModelForPlacement: (template: CatalogModelTemplate) => void;
  onInsertModelDirect: (template: CatalogModelTemplate) => void;
  customModels: CatalogModelTemplate[];
  onOpenCustomModelCreator: () => void;
}

export const ToolboxModal: React.FC<ToolboxModalProps> = ({
  isOpen,
  onClose,
  onSelectModelForPlacement,
  onInsertModelDirect,
  customModels,
  onOpenCustomModelCreator,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Modules', icon: Layers },
    { id: 'walls', label: 'Walls & Partitions', icon: Building },
    { id: 'floors', label: 'Floors & Tiles', icon: Box },
    { id: 'furniture', label: 'Home Furniture', icon: Home },
    { id: 'kitchen', label: 'Kitchen & Dining', icon: Sparkles },
    { id: 'decor', label: 'Home Decor & Lights', icon: Zap },
    { id: 'houses', label: 'Houses & Villas', icon: Home },
    { id: 'hospitals', label: 'Hospitals & Medical', icon: HeartPulse },
    { id: 'roads', label: 'Roads & Highways', icon: Milestone },
    { id: 'trains', label: 'Trains & Tracks', icon: Train },
    { id: 'custom', label: `My Custom (${customModels.length})`, icon: FolderPlus },
    { id: 'mechanics', label: 'Gameplay & Scripts', icon: Zap },
    { id: 'nature', label: 'Nature & Landscape', icon: Trees },
    { id: 'vehicles', label: 'Vehicles & NPCs', icon: Car },
    { id: 'basic', label: 'Basic Shapes', icon: Box },
  ];

  const allAvailableModels = [...customModels, ...CATALOG_MODELS];

  const filteredModels = allAvailableModels.filter((item) => {
    let matchesTab = true;
    if (activeTab === 'custom') {
      matchesTab = customModels.some((cm) => cm.id === item.id);
    } else if (activeTab !== 'all') {
      matchesTab = item.category === activeTab;
    }

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#F7F7F7] border border-[#CCCCCC] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#EDEDED] border-b border-[#D4D4D4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded text-white shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Roblox Studio Toolbox & Models Library</h2>
              <p className="text-[11px] text-gray-500">
                Select any model or module to place anywhere on the map grid or adjust its size.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Custom Model Button */}
            <button
              onClick={() => {
                onOpenCustomModelCreator();
                sound.playClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Custom Model</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    sound.playClick();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search models & parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Model Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F2F3F5]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredModels.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-200 hover:border-blue-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* 3D Model Preview Card Header */}
                <div
                  className="h-28 w-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${item.previewColor}22 0%, #EBF4FF 100%)`,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-lg shadow-md transform -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition flex items-center justify-center border border-white/60"
                    style={{ backgroundColor: item.previewColor }}
                  >
                    <Box className="w-8 h-8 text-white/90 drop-shadow-sm" />
                  </div>

                  {item.badge && (
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs ${
                        item.badge === 'Custom'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white/90 text-gray-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectModelForPlacement(item);
                        sound.playClick();
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition"
                      title="Click anywhere on the 3D map grid to place this model"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Place on Map</span>
                    </button>

                    <button
                      onClick={() => {
                        onInsertModelDirect(item);
                        sound.playPlace();
                      }}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                      title="Insert to map origin directly"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-center">
              <Box className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">No models found in this tab</p>
              {activeTab === 'custom' && (
                <button
                  onClick={onOpenCustomModelCreator}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                >
                  Create Your First Custom Model
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
