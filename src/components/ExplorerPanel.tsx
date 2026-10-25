import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Sun,
  Users,
  User,
  Lightbulb,
  Box,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Code,
  Eye,
  EyeOff,
} from 'lucide-react';
import { RobloxObject } from '../types/studio';
import { sound } from '../utils/audio';

interface ExplorerPanelProps {
  objects: RobloxObject[];
  selectedId: string | null;
  onSelectObject: (id: string | null) => void;
  onDeleteObject: (id: string) => void;
  onOpenScriptForObject: (id: string) => void;
}

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  objects,
  selectedId,
  onSelectObject,
  onDeleteObject,
  onOpenScriptForObject,
}) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [playersOpen, setPlayersOpen] = useState(true);
  const [lightingOpen, setLightingOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredObjects = objects.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white select-none text-xs border-b border-[#CCCCCC]">
      {/* Explorer Header (matching screenshot 2) */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#E8E8E8] border-b border-[#D0D0D0] font-semibold text-gray-800">
        <span className="text-[11px]">Explorer</span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-24 text-[10px] px-1 py-0.5 border border-gray-300 rounded bg-white font-normal"
          />
        </div>
      </div>

      {/* Explorer Hierarchy Tree */}
      <div className="flex-1 overflow-y-auto py-1 font-sans text-gray-700">
        {/* Workspace Node */}
        <div>
          <div
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
          >
            {workspaceOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Workspace</span>
            <span className="text-[10px] text-gray-400 ml-auto font-mono">({objects.length + 1})</span>
          </div>

          {workspaceOpen && (
            <div className="pl-4">
              {/* Static Baseplate */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 text-gray-600 text-[11px]">
                <Box className="w-3 h-3 text-gray-500" />
                <span>Baseplate</span>
                <span className="text-[9px] text-gray-400 ml-auto font-mono">Locked</span>
              </div>

              {/* Dynamic Workspace Objects */}
              {filteredObjects.map((obj) => {
                const isSelected = obj.id === selectedId;
                return (
                  <div
                    key={obj.id}
                    onClick={() => {
                      onSelectObject(obj.id);
                      sound.playClick();
                    }}
                    className={`group flex items-center gap-1.5 px-2 py-0.5 cursor-pointer text-[11px] rounded transition ${
                      isSelected
                        ? 'bg-blue-500 text-white font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {obj.type === 'SpawnLocation' ? (
                      <Sun className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    ) : obj.type === 'Model' ? (
                      <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                    ) : (
                      <Box
                        className={`w-3 h-3 ${
                          isSelected
                            ? 'text-white'
                            : obj.behaviorType === 'kill_brick'
                            ? 'text-red-500'
                            : obj.behaviorType === 'speed_pad'
                            ? 'text-cyan-500'
                            : 'text-blue-500'
                        }`}
                      />
                    )}

                    <span className="truncate flex-1">{obj.name}</span>

                    {/* Has script indicator */}
                    {obj.scriptCode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenScriptForObject(obj.id);
                        }}
                        className={`p-0.5 rounded hover:bg-black/20 ${isSelected ? 'text-white' : 'text-blue-600'}`}
                        title="Edit Lua Script"
                      >
                        <Code className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteObject(obj.id);
                        sound.playPlace();
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5"
                      title="Delete Object"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Players Node (matching screenshot 2) */}
        <div className="mt-1">
          <div
            onClick={() => setPlayersOpen(!playersOpen)}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
          >
            {playersOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Players</span>
          </div>

          {playersOpen && (
            <div className="pl-4">
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-100">
                <User className="w-3 h-3 text-amber-600" />
                <span className="font-semibold text-gray-800">OP_NitinGamer</span>
                <span className="text-[9px] text-green-600 ml-auto font-mono">Bacon Hair</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-gray-600 hover:bg-gray-100">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Sparkles</span>
              </div>
            </div>
          )}
        </div>

        {/* Lighting Node (matching screenshot 2) */}
        <div className="mt-1">
          <div
            onClick={() => {
              setLightingOpen(!lightingOpen);
              onSelectObject('lighting');
              sound.playClick();
            }}
            className={`flex items-center gap-1 px-1.5 py-0.5 cursor-pointer rounded transition font-medium ${
              selectedId === 'lighting'
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            {lightingOpen ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Lighting</span>
            <span className="text-[9px] text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded ml-auto font-mono">
              Service
            </span>
          </div>

          {lightingOpen && (
            <div className="pl-6 text-[10px] text-gray-500 py-1 space-y-0.5">
              <div className="hover:text-amber-700 cursor-pointer" onClick={() => onSelectObject('lighting')}>
                • Time of Day (ClockTime)
              </div>
              <div className="hover:text-amber-700 cursor-pointer" onClick={() => onSelectObject('lighting')}>
                • Ambient & Shadow Softness
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
