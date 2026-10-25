import React, { useState } from 'react';
import { RobloxObject } from '../types/studio';
import { generateRobloxRbxmx, generateRobloxStudioCommandScript } from '../utils/robloxExporter';
import {
  Download,
  Copy,
  Check,
  Globe,
  Upload,
  FileCode,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  objects: RobloxObject[];
  onLog: (msg: string, type?: 'log' | 'warn' | 'error') => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  placeName,
  objects,
  onLog,
}) => {
  const [activeTab, setActiveTab] = useState<'rbxmx' | 'script' | 'guide'>('rbxmx');
  const [copiedScript, setCopiedScript] = useState(false);
  const [downloadedRbxmx, setDownloadedRbxmx] = useState(false);

  if (!isOpen) return null;

  const luaScript = generateRobloxStudioCommandScript(placeName, objects);

  const handleDownloadRbxmx = () => {
    const xml = generateRobloxRbxmx(placeName, objects);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${placeName.replace(/\s+/g, '_')}.rbxmx`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedRbxmx(true);
    sound.playCoin();
    onLog(`[Export] Generated official Roblox Studio .rbxmx file (${objects.length} objects)`, 'log');
  };

  const handleCopyLua = () => {
    navigator.clipboard.writeText(luaScript);
    setCopiedScript(true);
    sound.playClick();
    onLog('[Export] Copied Roblox Studio Command Bar Lua script to clipboard!', 'log');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-gray-300 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-gray-800 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Publish & Export to Roblox Studio</h2>
              <p className="text-[11px] text-blue-100">
                Official format export compatible with Roblox Studio for direct game publishing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('rbxmx')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 font-semibold text-xs transition ${
              activeTab === 'rbxmx'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Roblox Model File (.rbxmx)</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 font-semibold text-xs transition ${
              activeTab === 'script'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1-Click Studio Command Script</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 font-semibold text-xs transition ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Step-by-Step Publish Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'rbxmx' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 text-xs">Official Roblox Studio Model Format (.rbxmx)</h3>
                  <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                    This file contains all your parts, models, positions, orientations, colors (Color3), materials, and attached Lua scripts. Roblox Studio on Windows or Mac can directly open or drag & drop this file into Workspace!
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 text-xs">{placeName}.rbxmx</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {objects.length} total objects &bull; Roblox XML Format v4
                  </div>
                </div>

                <button
                  onClick={handleDownloadRbxmx}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .rbxmx File</span>
                </button>
              </div>

              {downloadedRbxmx && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Downloaded <b>{placeName}.rbxmx</b>! Drag this file into Roblox Studio or use <b>Workspace &gt; Insert from File...</b>
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-[11px]">
                  Paste this script into Roblox Studio's <b>Command Bar</b> (bottom of screen in Roblox Studio) and press <b>Enter</b> to generate your complete game instantly!
                </p>
                <button
                  onClick={handleCopyLua}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="relative bg-gray-900 rounded-xl p-3 border border-gray-800 font-mono text-[10px] text-gray-300 max-h-72 overflow-y-auto leading-5 select-text">
                <pre>{luaScript}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-gray-700 leading-relaxed text-[11px]">
              <div className="font-bold text-gray-900 text-xs">
                How to Publish Your Game to Roblox (Roblox par game kaise publish karein):
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-gray-900">Download or Copy</h4>
                  <p className="text-gray-500">
                    Download the <b>.rbxmx</b> file or copy the <b>1-Click Command Bar Script</b> above.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-gray-900">Open Roblox Studio</h4>
                  <p className="text-gray-500">
                    Open a new Baseplate in Roblox Studio. Drag the <b>.rbxmx</b> file directly into the viewport or paste the script into the Command Bar.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-gray-900">Publish to Roblox</h4>
                  <p className="text-gray-500">
                    Click <b>File &gt; Publish to Roblox As...</b>, choose a title, description, and genres, then click <b>Save / Publish</b>!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <div className="font-bold mb-1">💡 Pro-Tip for Roblox Creators:</div>
                <p>
                  All scripts created here (kill bricks, moving platforms, coins, speed pads) are fully compatible with Roblox's Luau engine and will execute automatically when published.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">
            {objects.length} Objects Ready for Roblox Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
