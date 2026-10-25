import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Copy,
  Check,
  Play,
  X,
  Search,
  BookOpen,
  ArrowRight,
  Send,
  Loader2,
  Wand2,
  Layers,
  FileCode,
  Zap,
} from 'lucide-react';
import { OPENCODE_FREE_MODULES, OpenCodeModule, generateLocalLuauScript } from '../data/openCodeModules';
import { RobloxObject } from '../types/studio';
import { sound } from '../utils/audio';

interface OpenCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObject: RobloxObject | null;
  onAttachScriptToObject: (objectId: string, scriptCode: string) => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error' | 'system') => void;
}

export const OpenCodeModal: React.FC<OpenCodeModalProps> = ({
  isOpen,
  onClose,
  selectedObject,
  onAttachScriptToObject,
  onLog,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'ai_generator'>('modules');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<OpenCodeModule>(OPENCODE_FREE_MODULES[0]);

  // AI Generator state
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>(OPENCODE_FREE_MODULES[0].code);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    sound.playClick();
    onLog('Copied Luau script to clipboard!', 'log');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAttachToSelected = (code: string) => {
    if (!selectedObject) {
      onLog('Please select a Part in Workspace first to attach this script.', 'warn');
      return;
    }
    onAttachScriptToObject(selectedObject.id, code);
    sound.playPlace();
    onLog(`Attached script to "${selectedObject.name}"!`, 'log');
    onClose();
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    sound.playClick();

    try {
      // Call server backend proxy endpoint
      const res = await fetch('/api/opencode/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a complete, safe, production-ready Roblox Studio Luau script for: "${prompt}".
Target object in Workspace: "${selectedObject?.name || 'Part'}".
Return the script with clear comments.`,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        // Extract lua code from markdown if present
        let code = data.text;
        const match = data.text.match(/```(?:lua|luau)?([\s\S]*?)```/);
        if (match && match[1]) {
          code = match[1].trim();
        }
        setGeneratedCode(code);
        onLog('OpenCode AI successfully generated your script!', 'log');
      } else {
        // Fallback to intelligent local generator
        const localCode = generateLocalLuauScript(prompt, selectedObject?.name);
        setGeneratedCode(localCode);
        onLog('Generated Luau script using OpenCode Smart Engine.', 'log');
      }
    } catch {
      const localCode = generateLocalLuauScript(prompt, selectedObject?.name);
      setGeneratedCode(localCode);
      onLog('Generated Luau script using OpenCode Smart Engine.', 'log');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredModules = OPENCODE_FREE_MODULES.filter((m) => {
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[86vh] bg-[#16171A] border-2 border-[#333742] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100">
        {/* Header */}
        <div className="px-6 py-3.5 bg-[#121316] border-b border-[#292D36] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  OpenCode Free AI Studio Plugin
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold rounded-full border border-emerald-500/30">
                  FREE & UNLIMITED
                </span>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[11px] font-semibold rounded-full border border-purple-500/30">
                  Luau v5.1
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Powerful coding free modules, AI script generator, and instant 1-click part attachment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedObject ? (
              <div className="text-xs px-2.5 py-1 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Target: <b className="text-white">{selectedObject.name}</b>
              </div>
            ) : (
              <div className="text-xs text-gray-400">Target: None selected</div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#1A1C21] border-b border-[#292D36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'modules'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#262930] text-gray-300 hover:bg-[#30343D]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Free Code Modules ({OPENCODE_FREE_MODULES.length})
            </button>
            <button
              onClick={() => setActiveTab('ai_generator')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'ai_generator'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#262930] text-gray-300 hover:bg-[#30343D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Script Prompt Generator
            </button>
          </div>

          {activeTab === 'modules' && (
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules (lava, coin, tween)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-[#121316] border border-[#333742] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        {activeTab === 'modules' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Modules List */}
            <div className="w-72 bg-[#181A1F] border-r border-[#292D36] flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[#292D36] flex flex-wrap gap-1">
                {['all', 'gameplay', 'movement', 'currency', 'environment', 'effects'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#24272F] text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {filteredModules.map((mod) => {
                  const isSelected = selectedModule.id === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setSelectedModule(mod);
                        sound.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex flex-col gap-1 border ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500/80 shadow-xs'
                          : 'bg-[#20232B] hover:bg-[#282C35] border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white line-clamp-1">{mod.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 font-semibold border border-blue-700/40">
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Code Preview & Action Pane */}
            <div className="flex-1 flex flex-col bg-[#141518] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#292D36] flex items-center justify-between bg-[#181A1F]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    {selectedModule.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedModule.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(selectedModule.code)}
                    className="px-3 py-1.5 bg-[#252830] hover:bg-[#323642] active:scale-95 text-gray-200 border border-[#3A3F4D] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={() => handleAttachToSelected(selectedModule.code)}
                    disabled={!selectedObject}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition ${
                      selectedObject
                        ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white'
                        : 'bg-[#292D36] text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Attach to Selected ({selectedObject?.name || 'Select Part'})
                  </button>
                </div>
              </div>

              {/* Code Editor Preview */}
              <div className="flex-1 overflow-auto p-4 bg-[#0F1012] font-mono text-xs text-emerald-300 leading-relaxed selection:bg-blue-800">
                <pre>{selectedModule.code}</pre>
              </div>
            </div>
          </div>
        ) : (
          /* AI Generator Tab */
          <div className="flex-1 flex flex-col bg-[#141518] overflow-hidden p-6 gap-4">
            {/* Prompt bar */}
            <div className="bg-[#1C1E24] border border-[#2F333E] rounded-xl p-4 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  What Roblox Luau mechanic or script do you want to generate?
                </label>
                <div className="flex items-center gap-1.5">
                  {['Lava kill brick', 'Day-night cycle', 'Keycard door', 'Leaderstats coin', 'Pet follow'].map((sample) => (
                    <button
                      key={sample}
                      onClick={() => setPrompt(sample)}
                      className="px-2 py-0.5 rounded-full bg-[#272B35] hover:bg-purple-900/60 hover:text-purple-200 text-gray-400 text-[10px] transition"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Create a bouncing checkpoint pad that plays a sound and saves position..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
                  className="flex-1 px-4 py-2 bg-[#121316] border border-[#3A3F4D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-purple-500"
                />
                <button
                  onClick={handleGenerateScript}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-5 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Generate Luau Script
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Output */}
            <div className="flex-1 bg-[#0F1012] border border-[#2A2E38] rounded-xl overflow-hidden flex flex-col">
              <div className="px-4 py-2 bg-[#181A20] border-b border-[#2A2E38] flex items-center justify-between text-xs text-gray-400">
                <span>Luau Script Preview</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(generatedCode)}
                    className="px-2.5 py-1 bg-[#252830] hover:bg-[#323642] text-gray-300 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                  <button
                    onClick={() => handleAttachToSelected(generatedCode)}
                    disabled={!selectedObject}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                  >
                    <Zap className="w-3 h-3" />
                    Attach to {selectedObject?.name || 'Selected Part'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-purple-300 leading-relaxed">
                <pre>{generatedCode}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-2.5 bg-[#121316] border-t border-[#292D36] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OpenCode AI Engine Online & Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#282B33] hover:bg-[#343842] text-white rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
