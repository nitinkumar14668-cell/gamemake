import React, { useState, useEffect } from 'react';
import { CatalogModelTemplate, RobloxObject } from '../types/studio';
import {
  ALL_HOME_BUILDING_MODELS,
  WALL_MODELS,
  FLOOR_MODELS,
  FURNITURE_MODELS,
  KITCHEN_MODELS,
  DECOR_MODELS,
} from '../data/modelsHomeBuilding';
import {
  RotateCw,
  X,
  Hammer,
  Search,
  Sparkles,
  Layers,
  Building,
  Box,
  Home,
  Check,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

// Default 9 hotbar starter items for quick home building
export const DEFAULT_HOTBAR_ITEMS: CatalogModelTemplate[] = [
  WALL_MODELS[0], // Red Brick Wall
  WALL_MODELS[1], // Modern Wood Slat Wall
  WALL_MODELS[2], // Wall with Window
  WALL_MODELS[3], // Wall with Doorway
  FLOOR_MODELS[0], // Oak Parquet Floor
  FLOOR_MODELS[1], // Checkerboard Marble Floor
  FURNITURE_MODELS[0], // Modern 3-Seater Sofa
  FURNITURE_MODELS[1], // Queen Bed
  FURNITURE_MODELS[2], // TV & Media Console
];

interface MinecraftHotbarProps {
  activePlacementModel: RobloxObject | null;
  onSelectPlacementModel: (template: CatalogModelTemplate | null) => void;
  onRotatePlacement: () => void;
  placementRotation: number; // in degrees
  isBreakMode: boolean;
  onToggleBreakMode: () => void;
  isContinuousMode: boolean;
  onToggleContinuousMode: () => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error' | 'system') => void;
}

export const MinecraftHotbar: React.FC<MinecraftHotbarProps> = ({
  activePlacementModel,
  onSelectPlacementModel,
  onRotatePlacement,
  placementRotation,
  isBreakMode,
  onToggleBreakMode,
  isContinuousMode,
  onToggleContinuousMode,
  onLog,
}) => {
  const [hotbarItems, setHotbarItems] = useState<CatalogModelTemplate[]>(() => {
    const saved = localStorage.getItem('roblox_minecraft_hotbar_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 9) {
          return parsed;
        }
      } catch {}
    }
    return DEFAULT_HOTBAR_ITEMS;
  });

  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [inventoryCategory, setInventoryCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assigningSlotIndex, setAssigningSlotIndex] = useState<number | null>(null);

  // Sync active placement model with active hotbar slot
  useEffect(() => {
    if (!activePlacementModel) {
      if (!isBreakMode) {
        setActiveSlotIndex(null);
      }
    } else {
      const matchIdx = hotbarItems.findIndex((item) => item.name === activePlacementModel.name);
      if (matchIdx !== -1) {
        setActiveSlotIndex(matchIdx);
      }
    }
  }, [activePlacementModel, hotbarItems, isBreakMode]);

  // Save hotbar items
  useEffect(() => {
    try {
      localStorage.setItem('roblox_minecraft_hotbar_v1', JSON.stringify(hotbarItems));
    } catch {}
  }, [hotbarItems]);

  // Keyboard shortcut listener: 1-9 for slots, R/Q to rotate, X for break mode, E for inventory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key.toLowerCase();

      // Number keys 1-9
      if (key >= '1' && key <= '9') {
        e.preventDefault();
        const index = parseInt(key, 10) - 1;
        handleSelectSlot(index);
        return;
      }

      // R or Q to rotate
      if (key === 'r' || key === 'q') {
        if (activePlacementModel) {
          e.preventDefault();
          onRotatePlacement();
          sound.playClick();
        }
        return;
      }

      // X for break / pickaxe tool
      if (key === 'x') {
        e.preventDefault();
        onToggleBreakMode();
        sound.playClick();
        return;
      }

      // E to toggle Minecraft inventory
      if (key === 'e' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsInventoryOpen((prev) => !prev);
        sound.playClick();
        return;
      }

      // Escape to cancel placement / close inventory
      if (key === 'escape') {
        if (isInventoryOpen) {
          setIsInventoryOpen(false);
        } else if (activePlacementModel || isBreakMode) {
          onSelectPlacementModel(null);
          if (isBreakMode) onToggleBreakMode();
          setActiveSlotIndex(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    hotbarItems,
    activeSlotIndex,
    activePlacementModel,
    isBreakMode,
    isInventoryOpen,
    onRotatePlacement,
    onToggleBreakMode,
    onSelectPlacementModel,
  ]);

  const handleSelectSlot = (index: number) => {
    if (isBreakMode) {
      onToggleBreakMode();
    }

    if (activeSlotIndex === index && activePlacementModel) {
      // Deselect
      setActiveSlotIndex(null);
      onSelectPlacementModel(null);
      onLog('Deselected building item.', 'log');
      sound.playClick();
      return;
    }

    const item = hotbarItems[index];
    if (item) {
      setActiveSlotIndex(index);
      onSelectPlacementModel(item);
      onLog(`Selected [${index + 1}] "${item.name}". Click anywhere on floor/wall/ground to place!`, 'log');
      sound.playClick();
    }
  };

  const handleAssignItemToSlot = (item: CatalogModelTemplate, slotIdx: number) => {
    const updated = [...hotbarItems];
    updated[slotIdx] = item;
    setHotbarItems(updated);
    setAssigningSlotIndex(null);
    onLog(`Assigned "${item.name}" to Hotbar Slot ${slotIdx + 1}`, 'log');
    sound.playPlace();
  };

  const inventoryCategories = [
    { id: 'all', label: 'All Items', icon: Layers },
    { id: 'walls', label: 'Walls', icon: Building },
    { id: 'floors', label: 'Floors', icon: Box },
    { id: 'furniture', label: 'Furniture', icon: Home },
    { id: 'kitchen', label: 'Kitchen', icon: Sparkles },
    { id: 'decor', label: 'Decor & Lights', icon: Zap },
  ];

  const filteredInventoryItems = ALL_HOME_BUILDING_MODELS.filter((item) => {
    const matchesCat = inventoryCategory === 'all' || item.category === inventoryCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      {/* Minecraft Quick Build Hotbar Bar at Screen Bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none">
        {/* Active placement indicator / instruction bubble */}
        {(activePlacementModel || isBreakMode) && (
          <div className="mb-2 px-3 py-1 bg-black/85 backdrop-blur-md text-white border border-white/20 rounded-full shadow-xl flex items-center gap-2 pointer-events-auto text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
            {isBreakMode ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-semibold text-red-300">Minecraft Break Tool Active:</span>
                <span className="text-gray-300">Click any block in scene to destroy it. Press [X] or [Esc] to exit.</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">Placing: {activePlacementModel?.name}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">Angle: {placementRotation}°</span>
                <button
                  onClick={onRotatePlacement}
                  className="px-2 py-0.5 bg-blue-600/80 hover:bg-blue-500 active:scale-95 rounded text-[11px] font-medium text-white flex items-center gap-1 transition"
                  title="Rotate 90 degrees [R / Q]"
                >
                  <RotateCw className="w-3 h-3" /> Rotate [R]
                </button>
                <button
                  onClick={() => {
                    onSelectPlacementModel(null);
                    setActiveSlotIndex(null);
                  }}
                  className="p-1 hover:bg-white/20 rounded-full text-gray-400 hover:text-white transition"
                  title="Cancel Placement [Esc]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Hotbar Slots Container */}
        <div className="bg-[#18191B]/95 p-1.5 rounded-2xl border-2 border-[#3A3D45] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center gap-1.5 pointer-events-auto">
          {/* 9 Minecraft Slots */}
          <div className="flex items-center gap-1">
            {hotbarItems.map((item, index) => {
              const isSelected = activeSlotIndex === index && !isBreakMode;
              return (
                <button
                  key={`slot-${index}`}
                  onClick={() => handleSelectSlot(index)}
                  className={`relative group w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-100 ${
                    isSelected
                      ? 'bg-blue-600/40 border-2 border-white shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-105'
                      : 'bg-[#2A2D35]/80 hover:bg-[#343842] border border-[#444855]/70 active:scale-95'
                  }`}
                  title={`${item.name} (Press [${index + 1}])`}
                >
                  {/* Slot number badge */}
                  <span className="absolute top-0.5 left-1 text-[9px] font-bold text-gray-400 drop-shadow">
                    {index + 1}
                  </span>

                  {/* 3D Color Thumbnail / Preview */}
                  <div
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-md shadow-inner flex items-center justify-center border border-white/20 transition group-hover:scale-110"
                    style={{ backgroundColor: item.previewColor }}
                  >
                    <span className="text-[10px] font-black text-white/90 drop-shadow-md">
                      {item.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-100 shadow-lg border border-white/10 z-50">
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-8 bg-gray-700/60 mx-0.5" />

          {/* Quick Action Tools: Rotate, Break / Pickaxe, Continuous, and Inventory */}
          <div className="flex items-center gap-1">
            {/* Rotate Button */}
            <button
              onClick={() => {
                if (activePlacementModel) {
                  onRotatePlacement();
                  sound.playClick();
                } else if (activeSlotIndex !== null) {
                  onRotatePlacement();
                  sound.playClick();
                }
              }}
              disabled={!activePlacementModel}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center border transition ${
                activePlacementModel
                  ? 'bg-[#2A2D35] hover:bg-[#3E4350] border-[#444855] text-amber-400 active:scale-95'
                  : 'bg-[#202228] border-transparent text-gray-600 cursor-not-allowed'
              }`}
              title="Rotate Item 90° [R / Q]"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5 text-gray-300">ROT [R]</span>
            </button>

            {/* Break / Pickaxe Tool */}
            <button
              onClick={() => {
                onToggleBreakMode();
                sound.playClick();
              }}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center border transition ${
                isBreakMode
                  ? 'bg-red-600 border-2 border-white text-white shadow-[0_0_15px_rgba(239,68,68,0.8)] scale-105'
                  : 'bg-[#2A2D35] hover:bg-[#3E4350] border-[#444855] text-red-400 active:scale-95'
              }`}
              title="Minecraft Break / Delete Block Tool [X]"
            >
              <Hammer className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">BREAK [X]</span>
            </button>

            {/* Inventory Drawer Button */}
            <button
              onClick={() => {
                setIsInventoryOpen(true);
                sound.playClick();
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-600 hover:bg-blue-500 active:scale-95 border border-blue-400 rounded-xl flex flex-col items-center justify-center text-white shadow-md transition"
              title="All Home & Building Blocks [E]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[8px] font-bold mt-0.5">ITEMS [E]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minecraft Inventory / Block Catalog Drawer Modal */}
      {isInventoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
          <div className="w-full max-w-3xl max-h-[85vh] bg-[#1E2024] border-2 border-[#3F434D] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100">
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#151719] border-b border-[#2F323A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Minecraft Building & Furniture Inventory
                    <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 text-xs rounded-full border border-blue-700/50">
                      {ALL_HOME_BUILDING_MODELS.length} Items
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Click any item to place directly, or assign to your bottom 1-9 hotbar slots.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInventoryOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="px-5 py-3 bg-[#1A1C20] border-b border-[#2A2D35] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {inventoryCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = inventoryCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setInventoryCategory(cat.id);
                        sound.playClick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#26282E] text-gray-300 hover:bg-[#30333B]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search walls, sofa, bed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#121315] border border-[#3A3D46] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#151719]">
              {filteredInventoryItems.map((item) => {
                const isInHotbar = hotbarItems.some((h) => h.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="group bg-[#212328] hover:bg-[#282B32] border border-[#323640] hover:border-blue-500/60 rounded-xl p-3 flex flex-col justify-between transition shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition"
                          style={{ backgroundColor: item.previewColor }}
                        >
                          <span className="text-xs font-black text-white/90 drop-shadow">
                            {item.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-700/50 text-[10px] rounded font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-1.5 text-[10px] text-gray-500">
                        Size: {item.template.size[0]}x{item.template.size[1]}x{item.template.size[2]} studs
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#2F323A] flex items-center gap-1.5">
                      {/* Place Now Button */}
                      <button
                        onClick={() => {
                          onSelectPlacementModel(item);
                          setIsInventoryOpen(false);
                          sound.playClick();
                          onLog(`Selected "${item.name}" for placement! Click anywhere to drop.`, 'log');
                        }}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Place
                      </button>

                      {/* Hotbar assign dropdown / button */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            if (assigningSlotIndex === null) {
                              setAssigningSlotIndex(0);
                            } else {
                              setAssigningSlotIndex(null);
                            }
                          }}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isInHotbar
                              ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
                              : 'bg-[#2A2D34] hover:bg-[#343842] border-[#3F434E] text-gray-300'
                          }`}
                          title="Assign to Hotbar 1-9"
                        >
                          {isInHotbar ? <Check className="w-3.5 h-3.5" /> : '+Slot'}
                        </button>

                        {/* Slot Assign Popover */}
                        {assigningSlotIndex !== null && (
                          <div className="absolute right-0 bottom-full mb-1 p-2 bg-[#1B1D22] border border-[#3E424D] rounded-xl shadow-2xl flex flex-col gap-1 z-50 min-w-[130px]">
                            <span className="text-[10px] font-bold text-gray-400 px-1">Put in Hotbar:</span>
                            <div className="grid grid-cols-3 gap-1">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleAssignItemToSlot(item, sIdx)}
                                  className="py-1 px-1.5 bg-[#282B32] hover:bg-blue-600 text-white rounded text-[10px] font-bold text-center transition"
                                >
                                  Slot {sIdx + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-[#151719] border-t border-[#2F323A] flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Tip: Press <b>1-9</b> anytime to switch items</span>
                <span>Press <b>R</b> to rotate</span>
                <span>Press <b>X</b> for break mode</span>
              </div>
              <button
                onClick={() => {
                  setHotbarItems(DEFAULT_HOTBAR_ITEMS);
                  onLog('Reset Hotbar to default building blocks.', 'log');
                  sound.playClick();
                }}
                className="text-[11px] text-gray-400 hover:text-white underline underline-offset-2 transition"
              >
                Reset Default Hotbar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
