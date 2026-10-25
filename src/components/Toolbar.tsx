import React, { useState } from 'react';
import {
  MousePointer,
  Move,
  Maximize2,
  RotateCw,
  Play,
  Square,
  Wrench,
  Box,
  Copy,
  Scissors,
  ClipboardPaste,
  FolderPlus,
  Code,
  Terminal,
  Volume2,
  VolumeX,
  Menu,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Download,
  Upload,
  Globe,
  Compass,
  Plus,
} from 'lucide-react';
import { ToolMode, PartShape } from '../types/studio';
import { sound } from '../utils/audio';

interface ToolbarProps {
  toolMode: ToolMode;
  onSetToolMode: (mode: ToolMode) => void;
  isPlayMode: boolean;
  onTogglePlayMode: () => void;
  moveSnap: number;
  onSetMoveSnap: (snap: number) => void;
  rotateSnap: number;
  onSetRotateSnap: (snap: number) => void;
  onOpenToolbox: () => void;
  onInsertPart: (shape: PartShape) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onOpenScriptEditor: () => void;
  onToggleConsole: () => void;
  isConsoleOpen: boolean;
  onNewPlace: (template: 'baseplate' | 'obby') => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onOpenPublishModal: () => void;
  onOpenCustomModelCreator: () => void;
  showEditTouchControls: boolean;
  onToggleEditTouchControls: () => void;
  placeName: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  toolMode,
  onSetToolMode,
  isPlayMode,
  onTogglePlayMode,
  moveSnap,
  onSetMoveSnap,
  rotateSnap,
  onSetRotateSnap,
  onOpenToolbox,
  onInsertPart,
  onDuplicate,
  onDelete,
  onCopy,
  onPaste,
  onOpenScriptEditor,
  onToggleConsole,
  isConsoleOpen,
  onNewPlace,
  onExportJSON,
  onImportJSON,
  onOpenPublishModal,
  onOpenCustomModelCreator,
  showEditTouchControls,
  onToggleEditTouchControls,
  placeName,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartDropdownOpen, setIsPartDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  return (
    <header className="relative bg-[#F4F4F4] border-b border-[#CCCCCC] select-none text-[#222222] text-xs shadow-xs z-30">
      {/* Top Menu Line */}
      <div className="flex items-center justify-between border-b border-[#D6D6D6] px-2 py-0.5 bg-[#EAEAEA]">
        <div className="flex items-center gap-1.5">
          {/* Roblox Hexagon Logo */}
          <div className="flex items-center justify-center w-7 h-7 bg-[#1A1A1A] rounded-md shadow-xs cursor-pointer hover:bg-black transition">
            <div className="w-3.5 h-3.5 bg-white transform rotate-12 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#1A1A1A]"></div>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-300 transition text-gray-700"
            title="Studio File Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Chat Button */}
          <button
            onClick={onToggleConsole}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-300 transition text-gray-700"
            title="Chat & Output Console"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* Studio Tabs */}
          <div className="flex items-center ml-2 border border-[#C5C5C5] rounded bg-[#FFFEE0] overflow-hidden text-[11px] font-medium">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="px-2.5 py-0.5 bg-[#FFF9BD] hover:bg-[#FFF399] border-r border-[#D8D8A0] font-semibold tracking-wide text-gray-800"
            >
              FILE
            </button>
            <button className="px-2.5 py-0.5 hover:bg-[#FFFCE0] border-r border-[#D8D8A0] text-gray-700">
              SPLASH
            </button>
            <span className="px-2.5 py-0.5 text-gray-800 truncate max-w-[160px] font-semibold">
              {placeName || 'Back to Growing Up'}
            </span>
          </div>
        </div>

        {/* Top Right Quick Controls */}
        <div className="flex items-center gap-2 text-[10px] text-gray-600">
          {/* Toggle Touch Joystick in Edit Mode */}
          <button
            onClick={onToggleEditTouchControls}
            className={`px-2 py-0.5 rounded flex items-center gap-1 border transition ${
              showEditTouchControls
                ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
            title="Toggle Edit Fly Joystick & Camera Controls"
          >
            <Compass className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">Touch Nav</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-gray-300 rounded text-gray-700"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-green-600" />}
          </button>

          {/* Publish Button in Top Bar */}
          <button
            onClick={() => {
              onOpenPublishModal();
              sound.playClick();
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 py-0.5 rounded font-bold shadow-xs transition"
          >
            <Globe className="w-3 h-3 text-white" />
            <span>Publish (.rbxmx)</span>
          </button>
        </div>
      </div>

      {/* Main Studio Toolbar Strip */}
      <div className="flex items-stretch justify-between px-2 py-1 gap-1 overflow-x-auto">
        {/* Left Primary Tools */}
        <div className="flex items-center gap-1">
          {/* Select Tool */}
          <button
            onClick={() => {
              onSetToolMode('select');
              sound.playClick();
            }}
            className={`flex flex-col items-center justify-center min-w-[50px] h-[52px] px-1 rounded border transition ${
              toolMode === 'select'
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xs'
                : 'bg-white border-[#C8C8C8] hover:bg-gray-100 text-gray-800'
            }`}
          >
            <MousePointer className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] mt-0.5 font-medium">Select</span>
          </button>

          {/* Move Tool */}
          <button
            onClick={() => {
              onSetToolMode('move');
              sound.playClick();
            }}
            className={`flex flex-col items-center justify-center min-w-[50px] h-[52px] px-1 rounded border transition ${
              toolMode === 'move'
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xs'
                : 'bg-white border-[#C8C8C8] hover:bg-gray-100 text-gray-800'
            }`}
          >
            <Move className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] mt-0.5 font-medium">Move</span>
          </button>

          {/* Scale Tool */}
          <button
            onClick={() => {
              onSetToolMode('scale');
              sound.playClick();
            }}
            className={`flex flex-col items-center justify-center min-w-[50px] h-[52px] px-1 rounded border transition ${
              toolMode === 'scale'
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xs'
                : 'bg-white border-[#C8C8C8] hover:bg-gray-100 text-gray-800'
            }`}
          >
            <Maximize2 className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] mt-0.5 font-medium">Scale</span>
          </button>

          {/* Rotate Tool */}
          <button
            onClick={() => {
              onSetToolMode('rotate');
              sound.playClick();
            }}
            className={`flex flex-col items-center justify-center min-w-[50px] h-[52px] px-1 rounded border transition ${
              toolMode === 'rotate'
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-xs'
                : 'bg-white border-[#C8C8C8] hover:bg-gray-100 text-gray-800'
            }`}
          >
            <RotateCw className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] mt-0.5 font-medium">Rotate</span>
          </button>

          <div className="w-[1px] h-9 bg-gray-300 mx-0.5"></div>

          {/* Play / Stop Button */}
          <button
            onClick={onTogglePlayMode}
            className={`flex flex-col items-center justify-center min-w-[54px] h-[52px] px-1.5 rounded border font-semibold transition ${
              isPlayMode
                ? 'bg-red-600 border-red-700 text-white animate-pulse'
                : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {isPlayMode ? (
              <>
                <Square className="w-5 h-5 fill-white" />
                <span className="text-[10px] mt-0.5 font-bold">Stop</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white text-white" />
                <span className="text-[10px] mt-0.5 font-bold">Play</span>
              </>
            )}
          </button>

          <div className="w-[1px] h-9 bg-gray-300 mx-0.5"></div>

          {/* Toolbox (Hammer & Wrench - Module Section) */}
          <button
            onClick={() => {
              onOpenToolbox();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[56px] h-[52px] px-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-amber-900 shadow-xs transition"
            title="Open Models & Modules Catalog"
          >
            <Wrench className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] mt-0.5 font-bold text-gray-800">Toolbox</span>
          </button>

          {/* Create Custom Model Button */}
          <button
            onClick={() => {
              onOpenCustomModelCreator();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[58px] h-[52px] px-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-emerald-900 shadow-xs transition"
            title="Create Custom 3D Model"
          >
            <Plus className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-bold text-emerald-900">+ Custom</span>
          </button>

          {/* Part Insert with dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPartDropdownOpen(!isPartDropdownOpen)}
              className="flex flex-col items-center justify-center min-w-[56px] h-[52px] px-1 bg-white border border-[#C8C8C8] hover:bg-gray-100 rounded text-gray-800 shadow-xs transition"
            >
              <div className="flex items-center">
                <Box className="w-5 h-5 text-blue-500" />
                <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium leading-none">Part Insert</span>
            </button>

            {isPartDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-300 rounded shadow-xl py-1 z-50">
                <button
                  onClick={() => {
                    onInsertPart('Block');
                    setIsPartDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-xs"></div> Block
                </button>
                <button
                  onClick={() => {
                    onInsertPart('Ball');
                    setIsPartDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Sphere (Ball)
                </button>
                <button
                  onClick={() => {
                    onInsertPart('Cylinder');
                    setIsPartDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2"
                >
                  <div className="w-2.5 h-3.5 bg-amber-500 rounded-xs"></div> Cylinder
                </button>
                <button
                  onClick={() => {
                    onInsertPart('Wedge');
                    setIsPartDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-purple-500 transform skew-x-12"></div> Wedge
                </button>
              </div>
            )}
          </div>

          {/* Snap Input Boxes */}
          <div className="flex flex-col justify-center gap-1 border border-[#D0D0D0] bg-white rounded p-1 h-[52px]">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={rotateSnap}
                onChange={(e) => onSetRotateSnap(Math.max(1, Number(e.target.value)))}
                className="w-8 text-center border border-gray-300 rounded text-[11px] font-mono py-0.5 bg-gray-50 focus:bg-white"
              />
              <span className="text-[10px] text-gray-600 font-medium">Rotate°</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={moveSnap}
                step="0.5"
                onChange={(e) => onSetMoveSnap(Math.max(0.1, Number(e.target.value)))}
                className="w-8 text-center border border-gray-300 rounded text-[11px] font-mono py-0.5 bg-gray-50 focus:bg-white"
              />
              <span className="text-[10px] text-gray-600 font-medium">Move stud</span>
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
          {/* Script Editor Button */}
          <button
            onClick={() => {
              onOpenScriptEditor();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[52px] h-[52px] px-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded text-indigo-900 transition"
            title="Open Lua Scripting Engine"
          >
            <Code className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] mt-0.5 font-bold">Script</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() => {
              onDuplicate();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[46px] h-[52px] px-1 bg-white border border-[#C8C8C8] hover:bg-gray-100 rounded text-gray-700 transition"
            title="Duplicate Selected Object (Ctrl+D)"
          >
            <FolderPlus className="w-4 h-4 text-gray-600" />
            <span className="text-[9px] mt-0.5">Dupli</span>
          </button>

          {/* Copy */}
          <button
            onClick={() => {
              onCopy();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[44px] h-[52px] px-1 bg-white border border-[#C8C8C8] hover:bg-gray-100 rounded text-gray-700 transition"
            title="Copy Object"
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span className="text-[9px] mt-0.5">Copy</span>
          </button>

          {/* Paste */}
          <button
            onClick={() => {
              onPaste();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[44px] h-[52px] px-1 bg-white border border-[#C8C8C8] hover:bg-gray-100 rounded text-gray-700 transition"
            title="Paste into Workspace"
          >
            <ClipboardPaste className="w-4 h-4 text-gray-600" />
            <span className="text-[9px] mt-0.5">Paste</span>
          </button>

          {/* Cut/Delete */}
          <button
            onClick={() => {
              onDelete();
              sound.playClick();
            }}
            className="flex flex-col items-center justify-center min-w-[46px] h-[52px] px-1 bg-white border border-[#C8C8C8] hover:bg-red-50 text-red-600 rounded transition"
            title="Delete Selected Object (Del)"
          >
            <Scissors className="w-4 h-4 text-red-500" />
            <span className="text-[9px] mt-0.5">Cut/del</span>
          </button>

          {/* Output Console Toggle */}
          <button
            onClick={() => {
              onToggleConsole();
              sound.playClick();
            }}
            className={`flex flex-col items-center justify-center min-w-[48px] h-[52px] px-1 rounded border transition ${
              isConsoleOpen
                ? 'bg-slate-800 text-green-400 border-slate-900'
                : 'bg-white border-[#C8C8C8] hover:bg-gray-100 text-gray-700'
            }`}
            title="Toggle Output Logs & Print Console"
          >
            <Terminal className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Output</span>
          </button>
        </div>
      </div>

      {/* File Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-2 w-64 bg-white border border-gray-300 rounded shadow-2xl py-2 z-50">
          <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">File & Maps</div>
          <button
            onClick={() => {
              onNewPlace('baseplate');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-800 flex items-center justify-between"
          >
            <span>New Classic Baseplate</span>
            <span className="text-gray-400 text-[10px]">Empty</span>
          </button>
          <button
            onClick={() => {
              onNewPlace('obby');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-800 flex items-center justify-between"
          >
            <span>Load Preset Obby Map</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Roblox Studio Publish</div>
          <button
            onClick={() => {
              onOpenPublishModal();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-800 flex items-center gap-2 font-semibold text-blue-600"
          >
            <Globe className="w-3.5 h-3.5" /> Publish to Roblox (.rbxmx)
          </button>
          <button
            onClick={() => {
              onExportJSON();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-800 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" /> Export JSON Backup
          </button>
          <button
            onClick={() => {
              onImportJSON();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-gray-800 flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" /> Import Map File
          </button>
        </div>
      )}
    </header>
  );
};
