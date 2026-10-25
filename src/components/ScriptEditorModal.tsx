import React, { useState, useEffect } from 'react';
import { SCRIPT_TEMPLATES } from '../data/robloxCatalog';
import { ScriptTemplate } from '../types/studio';
import {
  Code,
  Play,
  Save,
  X,
  FileCode,
  Sparkles,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ScriptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetObjectName: string;
  targetObjectId: string;
  initialCode: string;
  onSaveScript: (id: string, code: string) => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error') => void;
}

export const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
  isOpen,
  onClose,
  targetObjectName,
  targetObjectId,
  initialCode,
  onSaveScript,
  onLog,
}) => {
  const [code, setCode] = useState<string>('');
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setCode(
      initialCode ||
        `-- Roblox Lua Script for "${targetObjectName}"
local part = script.Parent

-- Touched Event Trigger
part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        print("Player touched " .. part.Name .. "!")
    end
end)`
    );
    setTestOutput([]);
    setStatusMessage(null);
  }, [initialCode, targetObjectName, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl: ScriptTemplate) => {
    setCode(tpl.code);
    sound.playClick();
    setStatusMessage(`Loaded template: ${tpl.title}`);
  };

  const handleSave = () => {
    onSaveScript(targetObjectId, code);
    sound.playClick();
    setStatusMessage('Script saved successfully!');
    onLog(`[Script Editor] Saved Lua script to "${targetObjectName}"`, 'log');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleTestRun = () => {
    const outputs: string[] = [];
    outputs.push(`[Script Runner] Validating Lua code for ${targetObjectName}...`);

    // Check syntax matching
    const openEnds = (code.match(/\bend\b/g) || []).length;
    const openBlocks = (code.match(/\b(function|then|do)\b/g) || []).length;

    if (openBlocks !== openEnds) {
      outputs.push(`[Syntax Warning] Block mismatch: ${openBlocks} block opens vs ${openEnds} ends!`);
      onLog(`[Script Warning] Syntax mismatch in "${targetObjectName}" script`, 'warn');
    } else {
      outputs.push(`[Syntax OK] Structure verified with ${openBlocks} matched code blocks.`);
    }

    // Extract print statements
    const printMatches = code.matchAll(/print\((['"]?)(.*?)\1\)/g);
    for (const match of printMatches) {
      outputs.push(`> ${match[2]}`);
      onLog(`> ${match[2]}`, 'log');
    }

    outputs.push(`[Ready] Script will activate during Play mode!`);
    setTestOutput(outputs);
    sound.playPlace();
  };

  const lines = code.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#1E1E1E] text-gray-200 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Editor Top Bar (Roblox Studio Script Tab) */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1E1E1E] border-t-2 border-blue-500 rounded-t text-xs font-mono text-white">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{targetObjectName}.Script.lua</span>
            </div>
            <span className="text-[11px] text-gray-400">Roblox Lua 5.1 / Luau Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition"
              title="Test execute script in sandbox"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Test Syntax</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs transition"
              title="Save script to object"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Close</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Editor Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Textarea with Line Numbers */}
          <div className="flex-1 flex bg-[#1E1E1E] overflow-hidden">
            {/* Line numbers */}
            <div className="w-12 py-3 bg-[#1E1E1E] border-r border-[#2D2D2D] select-none text-right pr-3 font-mono text-xs text-gray-600 leading-6">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent font-mono text-xs text-gray-200 resize-none outline-hidden leading-6 selection:bg-blue-800"
              placeholder="Write your Roblox Lua code here..."
            />
          </div>

          {/* Script Templates Sidebar */}
          <div className="w-72 bg-[#252526] border-l border-[#333333] flex flex-col">
            <div className="p-3 border-b border-[#333333]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Script Templates</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Insert prebuilt gameplay behaviors with 1-click.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {SCRIPT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="w-full text-left p-2.5 bg-[#2D2D2D] hover:bg-[#37373D] border border-gray-700 hover:border-blue-500 rounded-lg transition group"
                >
                  <div className="text-xs font-semibold text-gray-200 group-hover:text-blue-400">
                    {tpl.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">
                    {tpl.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Test Console */}
        {testOutput.length > 0 && (
          <div className="h-28 bg-[#181818] border-t border-[#333333] p-2.5 font-mono text-[11px] overflow-y-auto">
            <div className="flex items-center gap-1 text-gray-400 mb-1 text-[10px] font-bold uppercase">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>Sandbox Test Console</span>
            </div>
            {testOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.includes('Warning')
                    ? 'text-amber-400'
                    : line.includes('OK')
                    ? 'text-emerald-400'
                    : 'text-gray-300'
                }
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Status Notification */}
        {statusMessage && (
          <div className="px-4 py-1.5 bg-blue-900/50 border-t border-blue-700/50 text-[11px] text-blue-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
