import React, { useState } from 'react';
import { LogMessage } from '../types/studio';
import { Terminal, Trash2, X, Send, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface OutputConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogMessage[];
  onClearLogs: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  onExecuteCommand,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'log' | 'warn' | 'error'>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onExecuteCommand(commandInput.trim());
    setCommandInput('');
    sound.playClick();
  };

  const filteredLogs = logs.filter((l) => (filter === 'all' ? true : l.type === filter));

  return (
    <div className="absolute bottom-0 left-0 right-0 h-56 bg-[#181818] border-t-2 border-[#333333] shadow-2xl flex flex-col z-30 select-none font-mono text-xs">
      {/* Console Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-gray-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-[11px] tracking-wide">Studio Output Console</span>
          <span className="text-[10px] text-gray-500">({filteredLogs.length} events)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded ${
                filter === 'all' ? 'bg-gray-700 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('log')}
              className={`px-2 py-0.5 rounded ${
                filter === 'log' ? 'bg-blue-900 text-blue-200 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-2 py-0.5 rounded ${
                filter === 'warn' ? 'bg-amber-900 text-amber-200 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded ${
                filter === 'error' ? 'bg-red-900 text-red-200 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Errors
            </button>
          </div>

          <div className="w-[1px] h-4 bg-gray-600"></div>

          <button
            onClick={onClearLogs}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
            title="Close Console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Scroll List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono text-[11px] leading-relaxed">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-gray-500 text-[10px] shrink-0 font-mono">{log.timestamp}</span>
            {log.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            ) : log.type === 'warn' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            )}
            <span
              className={
                log.type === 'error'
                  ? 'text-red-400'
                  : log.type === 'warn'
                  ? 'text-amber-300'
                  : 'text-gray-300'
              }
            >
              {log.message}
            </span>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-gray-600 text-center py-6">Output log is clean. Run scripts or play to view logs.</div>
        )}
      </div>

      {/* Command Line Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1.5 bg-[#252526] border-t border-[#333333]">
        <span className="text-emerald-400 font-bold px-1">&gt;</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder='Run Lua command or print statement, e.g. print("Testing map!") or part.Size = Vector3.new(10,2,10)'
          className="flex-1 bg-[#1E1E1E] border border-gray-700 rounded px-2 py-1 text-gray-200 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden font-mono"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition"
        >
          <Send className="w-3 h-3" />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};
