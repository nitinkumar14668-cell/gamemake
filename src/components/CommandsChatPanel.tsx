import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Terminal,
  Sparkles,
  Bot,
  User,
  Zap,
  Code2,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  RotateCcw,
} from 'lucide-react';
import { RobloxObject, LightingSettings, SkyboxType, PartShape } from '../types/studio';
import { ALL_HOME_BUILDING_MODELS } from '../data/modelsHomeBuilding';
import { generateLocalLuauScript } from '../data/openCodeModules';
import { sound } from '../utils/audio';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

interface CommandsChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObject: RobloxObject | null;
  onUpdateLighting: (updates: Partial<LightingSettings>) => void;
  onInsertPart: (shape: PartShape) => void;
  onPlaceObjectDirect: (object: RobloxObject) => void;
  onDeleteSelected: () => void;
  onClearWorkspace: () => void;
  onUpdatePlayerStats: (updates: { health?: number; coins?: number; speed?: number }) => void;
  onAttachScriptToObject: (objectId: string, code: string) => void;
  onLog: (msg: string, type?: 'log' | 'warn' | 'error' | 'system') => void;
}

export const CommandsChatPanel: React.FC<CommandsChatPanelProps> = ({
  isOpen,
  onClose,
  selectedObject,
  onUpdateLighting,
  onInsertPart,
  onPlaceObjectDirect,
  onDeleteSelected,
  onClearWorkspace,
  onUpdatePlayerStats,
  onAttachScriptToObject,
  onLog,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am OpenCode AI & Studio Command Assistant. You can chat with me, ask for Luau code, or run commands like `/time 0`, `/sky Night`, `/speed 36`, or `/spawn sofa`!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    sound.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAttachCode = (code: string) => {
    if (!selectedObject) {
      onLog('Select an object in Workspace first to attach this script.', 'warn');
      return;
    }
    onAttachScriptToObject(selectedObject.id, code);
    sound.playPlace();
    onLog(`Attached script to "${selectedObject.name}"!`, 'log');
  };

  // Execute in-studio command
  const executeStudioCommand = (cmd: string): { handled: boolean; replyText: string; code?: string } => {
    const trimmed = cmd.trim();
    if (!trimmed.startsWith('/')) return { handled: false, replyText: '' };

    const parts = trimmed.slice(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    sound.playClick();

    switch (command) {
      case 'help':
        return {
          handled: true,
          replyText: `**Supported Studio Commands:**
• \`/time <0-24>\` - Set clock time (e.g. \`/time 14\`, \`/time 0\` for night)
• \`/sky <Clear|Night|Sunset|Nebula|Cloudy|SciFiRed>\` - Change skybox
• \`/spawn <item>\` - Spawn wall, floor, sofa, bed, tv, table, fridge, block, sphere
• \`/speed <number>\` - Set player walk speed (default 16)
• \`/jump <number>\` - Launch boost
• \`/coins <amount>\` - Add coins to player
• \`/heal\` - Restore player health to 100
• \`/damage <amount>\` - Deal damage
• \`/delete\` or \`/break\` - Delete selected object
• \`/clear\` - Clear all non-spawn parts
• \`/code <description>\` - Generate Luau script for selected object`,
        };

      case 'time': {
        const val = parseFloat(arg);
        if (isNaN(val)) return { handled: true, replyText: 'Usage: `/time <0-24>` (e.g. `/time 18` for sunset)' };
        const clamped = Math.max(0, Math.min(24, val));
        onUpdateLighting({ clockTime: clamped });
        onLog(`Changed Lighting ClockTime to ${clamped}:00`, 'log');
        return { handled: true, replyText: `☀️ Set Scene ClockTime to **${clamped}:00**` };
      }

      case 'sky': {
        const allowed: SkyboxType[] = ['Clear', 'Night', 'Sunset', 'Nebula', 'Cloudy', 'SciFiRed'];
        const matched = allowed.find((s) => s.toLowerCase() === arg.toLowerCase());
        if (matched) {
          onUpdateLighting({ skybox: matched });
          onLog(`Changed Skybox to ${matched}`, 'log');
          return { handled: true, replyText: `🌌 Skybox environment switched to **${matched}**` };
        }
        return { handled: true, replyText: `Unknown skybox. Options: ${allowed.join(', ')}` };
      }

      case 'speed': {
        const spd = parseInt(arg, 10);
        if (isNaN(spd)) return { handled: true, replyText: 'Usage: `/speed <number>` (e.g. `/speed 36`)' };
        onUpdatePlayerStats({ speed: spd });
        onLog(`Player WalkSpeed updated to ${spd}`, 'log');
        return { handled: true, replyText: `⚡ Player WalkSpeed boosted to **${spd} studs/sec**!` };
      }

      case 'coins': {
        const val = parseInt(arg, 10) || 50;
        onUpdatePlayerStats({ coins: val });
        onLog(`Granted +${val} Coins to player`, 'log');
        sound.playCoin();
        return { handled: true, replyText: `💰 Granted **+${val} Coins** to player!` };
      }

      case 'heal': {
        onUpdatePlayerStats({ health: 100 });
        onLog('Player health fully restored to 100%', 'log');
        return { handled: true, replyText: '💖 Player health fully restored to **100%**!' };
      }

      case 'damage': {
        const dmg = parseInt(arg, 10) || 25;
        onUpdatePlayerStats({ health: Math.max(0, 100 - dmg) });
        onLog(`Dealt ${dmg} damage to player`, 'log');
        sound.playOof();
        return { handled: true, replyText: `💥 Dealt **${dmg} damage** to player.` };
      }

      case 'delete':
      case 'break': {
        if (!selectedObject) {
          return { handled: true, replyText: '⚠️ No object currently selected. Click an object first.' };
        }
        const name = selectedObject.name;
        onDeleteSelected();
        return { handled: true, replyText: `🗑️ Deleted selected object: **${name}**` };
      }

      case 'clear': {
        onClearWorkspace();
        return { handled: true, replyText: '🧹 Cleared non-essential objects in Workspace.' };
      }

      case 'spawn': {
        if (!arg) {
          return { handled: true, replyText: 'Usage: `/spawn <sofa|bed|tv|wall|floor|table|fridge|block|sphere>`' };
        }
        const lowerArg = arg.toLowerCase();

        // 1. Check basic shapes
        if (lowerArg === 'block' || lowerArg === 'sphere' || lowerArg === 'cylinder' || lowerArg === 'wedge') {
          const shapeMap: Record<string, PartShape> = {
            block: 'Block',
            sphere: 'Ball',
            cylinder: 'Cylinder',
            wedge: 'Wedge',
          };
          onInsertPart(shapeMap[lowerArg]);
          return { handled: true, replyText: `🧱 Spawned new **${shapeMap[lowerArg]}** Part at origin!` };
        }

        // 2. Check catalog models (walls, floors, furniture, etc.)
        const match = ALL_HOME_BUILDING_MODELS.find(
          (m) =>
            m.name.toLowerCase().includes(lowerArg) ||
            m.id.toLowerCase().includes(lowerArg) ||
            m.category.toLowerCase().includes(lowerArg)
        );

        if (match) {
          const newObj: RobloxObject = {
            ...match.template,
            id: 'obj_' + Math.random().toString(36).substring(2, 9),
            position: [0, match.template.size[1] / 2, 0],
          };
          onPlaceObjectDirect(newObj);
          sound.playPlace();
          return { handled: true, replyText: `✨ Spawned **${match.name}** directly into Workspace!` };
        }

        return { handled: true, replyText: `Could not find model matching "${arg}". Try \`/spawn sofa\`, \`/spawn wall\`, \`/spawn bed\`, or \`/spawn block\`.` };
      }

      case 'code': {
        const promptText = arg || 'Lava kill brick with sound and debounce';
        const code = generateLocalLuauScript(promptText, selectedObject?.name);
        return {
          handled: true,
          replyText: `💻 Generated Luau Script for **"${selectedObject?.name || 'Part'}"**:`,
          code,
        };
      }

      default:
        return { handled: false, replyText: '' };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Check if it is a studio command
    const cmdResult = executeStudioCommand(userText);
    if (cmdResult.handled) {
      const sysMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'system',
        text: cmdResult.replyText,
        codeSnippet: cmdResult.code,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sysMsg]);
      return;
    }

    // Otherwise, ask OpenCode AI
    setIsLoading(true);

    try {
      const res = await fetch('/api/opencode/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          selectedObject: selectedObject?.name,
        }),
      });

      const data = await res.json();
      let responseText = '';
      let codeSnippet: string | undefined = undefined;

      if (data.success && data.text) {
        responseText = data.text;
        const codeMatch = data.text.match(/```(?:lua|luau)?([\s\S]*?)```/);
        if (codeMatch && codeMatch[1]) {
          codeSnippet = codeMatch[1].trim();
        }
      } else {
        // Fallback to local intelligent response
        const generated = generateLocalLuauScript(userText, selectedObject?.name);
        responseText = `Here is the Luau code generated for your request:`;
        codeSnippet = generated;
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: responseText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      sound.playClick();
    } catch {
      const fallbackCode = generateLocalLuauScript(userText, selectedObject?.name);
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: `Generated Luau script via OpenCode engine:`,
        codeSnippet: fallbackCode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickCommands = [
    { label: '/time 0', cmd: '/time 0', title: 'Set Midnight' },
    { label: '/time 12', cmd: '/time 12', title: 'Set Midday' },
    { label: '/speed 36', cmd: '/speed 36', title: 'Sprint Speed' },
    { label: '/coins 100', cmd: '/coins 100', title: 'Give 100 Coins' },
    { label: '/spawn sofa', cmd: '/spawn sofa', title: 'Spawn Sofa' },
    { label: '/spawn wall', cmd: '/spawn wall', title: 'Spawn Brick Wall' },
    { label: '/code lava', cmd: '/code lava kill brick', title: 'Generate Lava Code' },
  ];

  return (
    <div className="w-80 h-full bg-[#18191D] border-l border-[#2E313A] flex flex-col overflow-hidden text-gray-200 select-none shadow-xl shrink-0">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#141518] border-b border-[#2A2D35] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Commands & AI Chat
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-gray-400">OpenCode Live Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Status bar */}
      <div className="px-3 py-1.5 bg-[#1F2127] border-b border-[#2B2E37] flex items-center justify-between text-[11px]">
        <span className="text-gray-400">Active Target:</span>
        <span className={`font-semibold ${selectedObject ? 'text-blue-300' : 'text-gray-500'}`}>
          {selectedObject ? selectedObject.name : 'None selected'}
        </span>
      </div>

      {/* Quick Command Chips */}
      <div className="p-2 border-b border-[#282B33] bg-[#16171B] flex items-center gap-1 overflow-x-auto scrollbar-none">
        {quickCommands.map((q) => (
          <button
            key={q.label}
            onClick={() => {
              setInput(q.cmd);
              sound.playClick();
            }}
            className="px-2 py-0.5 bg-[#252830] hover:bg-blue-600 hover:text-white rounded-md text-[10px] font-mono text-gray-300 border border-[#353945] whitespace-nowrap transition"
            title={q.title}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#131417]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          const isSystem = m.sender === 'system';

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} text-xs`}
            >
              <div className="flex items-center gap-1 mb-1 text-[10px] text-gray-400">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3 text-blue-400" />
                  </>
                ) : isSystem ? (
                  <>
                    <Terminal className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400 font-semibold">Studio Command</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300 font-semibold">OpenCode AI</span>
                  </>
                )}
                <span>• {m.timestamp}</span>
              </div>

              <div
                className={`max-w-[95%] p-2.5 rounded-xl leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : isSystem
                    ? 'bg-[#1E222A] text-gray-200 border border-amber-500/30 rounded-bl-xs'
                    : 'bg-[#1F2229] text-gray-200 border border-[#2E323D] rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* If message has attached code */}
                {m.codeSnippet && (
                  <div className="mt-2 pt-2 border-t border-white/10 font-mono text-[11px] bg-[#0E0F12] p-2 rounded-lg text-emerald-300 overflow-x-auto">
                    <pre>{m.codeSnippet}</pre>

                    <div className="mt-2 flex items-center justify-end gap-1.5 pt-1.5 border-t border-white/5">
                      <button
                        onClick={() => handleCopyCode(m.id, m.codeSnippet!)}
                        className="px-2 py-0.5 bg-[#252830] hover:bg-[#343842] text-gray-300 rounded text-[10px] flex items-center gap-1 transition"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === m.id ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        onClick={() => handleAttachCode(m.codeSnippet!)}
                        disabled={!selectedObject}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition ${
                          selectedObject
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : 'bg-[#292D36] text-gray-500 cursor-not-allowed'
                        }`}
                        title="Attach this script to selected part"
                      >
                        <Zap className="w-3 h-3" />
                        Attach to Part
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 italic py-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>OpenCode AI is thinking & writing script...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-2.5 bg-[#141518] border-t border-[#2A2D35]">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask AI or run command (e.g. /time 0, /speed 35)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full pl-3 pr-10 py-2 bg-[#0E0F12] border border-[#333742] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition active:scale-95 shadow-xs"
            title="Send (Enter)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 px-1">
          <span>Commands start with <b>/</b></span>
          <span>Press <b>Enter</b> to send</span>
        </div>
      </div>
    </div>
  );
};
