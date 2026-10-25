import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RobloxObject,
  ToolMode,
  PartShape,
  CatalogModelTemplate,
  LogMessage,
  LightingSettings,
} from './types/studio';
import { STARTER_TEMPLATES } from './data/robloxCatalog';
import { Toolbar } from './components/Toolbar';
import { Viewport3D } from './components/Viewport3D';
import { ExplorerPanel } from './components/ExplorerPanel';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ToolboxModal } from './components/ToolboxModal';
import { CustomModelModal } from './components/CustomModelModal';
import { PublishModal } from './components/PublishModal';
import { ScriptEditorModal } from './components/ScriptEditorModal';
import { PlayOverlay } from './components/PlayOverlay';
import { OutputConsole } from './components/OutputConsole';
import { sound } from './utils/audio';

export default function App() {
  // Main Studio State
  const [objects, setObjects] = useState<RobloxObject[]>(() => {
    const saved = localStorage.getItem('roblox_studio_place_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return STARTER_TEMPLATES.baseplate.objects;
  });

  const [selectedId, setSelectedId] = useState<string | null>('spawn-default');
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [moveSnap, setMoveSnap] = useState<number>(1);
  const [rotateSnap, setRotateSnap] = useState<number>(5);
  const [isPlayMode, setIsPlayMode] = useState<boolean>(false);
  const [placeName, setPlaceName] = useState<string>('Back to Growing Up');

  // Scene Lighting Settings
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(() => {
    const saved = localStorage.getItem('roblox_lighting_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      clockTime: 14.0, // 2:00 PM
      ambientColor: '#FFFFFF',
      shadowSoftness: 0.65,
      sunBrightness: 1.25,
    };
  });

  // Custom Models Library (stored in localStorage)
  const [customModels, setCustomModels] = useState<CatalogModelTemplate[]>(() => {
    const saved = localStorage.getItem('roblox_custom_models_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Touch Nav in Edit Mode Toggle
  const [showEditTouchControls, setShowEditTouchControls] = useState<boolean>(true);

  // Placement Mode State (Module Section)
  const [activePlacementModel, setActivePlacementModel] = useState<RobloxObject | null>(null);

  // Modals & Panels
  const [isToolboxOpen, setIsToolboxOpen] = useState<boolean>(false);
  const [isCustomModelModalOpen, setIsCustomModelModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isScriptEditorOpen, setIsScriptEditorOpen] = useState<boolean>(false);
  const [editingScriptTargetId, setEditingScriptTargetId] = useState<string | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);

  // Logs & Console
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      message: 'Roblox Studio Web Engine v2.4 initialized. Baseplate loaded.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'log',
      message: 'Workspace: SpawnLocation ready. Smooth touch & multi-touch controls active.',
    },
  ]);

  // Player gameplay state
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [playerCoins, setPlayerCoins] = useState<number>(0);
  const [mobileMoveVector, setMobileMoveVector] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mobileJumpTrigger, setMobileJumpTrigger] = useState<number>(0);
  const [mobileEmoteTrigger, setMobileEmoteTrigger] = useState<number>(0);

  // Clipboard for copy/paste
  const clipboardRef = useRef<RobloxObject | null>(null);

  // Resizable Right Sidebar
  const [sidebarWidth, setSidebarWidth] = useState<number>(270);
  const isDraggingSidebarRef = useRef<boolean>(false);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('roblox_studio_place_v2', JSON.stringify(objects));
    } catch {}
  }, [objects]);

  useEffect(() => {
    try {
      localStorage.setItem('roblox_custom_models_v2', JSON.stringify(customModels));
    } catch {}
  }, [customModels]);

  useEffect(() => {
    try {
      localStorage.setItem('roblox_lighting_settings_v1', JSON.stringify(lightingSettings));
    } catch {}
  }, [lightingSettings]);

  const handleUpdateLighting = useCallback((updates: Partial<LightingSettings>) => {
    setLightingSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const addLog = useCallback((message: string, type: 'log' | 'warn' | 'error' | 'system' = 'log') => {
    const newLog: LogMessage = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev.slice(-100), newLog]);
  }, []);

  // Update an object in the workspace
  const handleUpdateObject = useCallback((id: string, updates: Partial<RobloxObject>) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }, []);

  // Delete selected object
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    const target = objects.find((o) => o.id === selectedId);
    if (target?.type === 'SpawnLocation' && objects.filter((o) => o.type === 'SpawnLocation').length <= 1) {
      addLog('Cannot delete primary SpawnLocation pad.', 'warn');
      return;
    }
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    addLog(`Deleted object: ${target?.name || selectedId}`, 'log');
    setSelectedId(null);
    sound.playPlace();
  }, [selectedId, objects, addLog]);

  // Duplicate selected object
  const handleDuplicateSelected = useCallback(() => {
    if (!selectedId) return;
    const orig = objects.find((o) => o.id === selectedId);
    if (!orig) return;

    const newObj: RobloxObject = {
      ...orig,
      id: 'part_' + Math.random().toString(36).substring(2, 9),
      name: orig.name + '_Copy',
      position: [orig.position[0] + moveSnap, orig.position[1], orig.position[2] + moveSnap],
    };

    setObjects((prev) => [...prev, newObj]);
    setSelectedId(newObj.id);
    addLog(`Duplicated "${orig.name}" as "${newObj.name}"`, 'log');
    sound.playPlace();
  }, [selectedId, objects, moveSnap, addLog]);

  // Copy
  const handleCopy = useCallback(() => {
    if (!selectedId) return;
    const target = objects.find((o) => o.id === selectedId);
    if (target) {
      clipboardRef.current = target;
      addLog(`Copied "${target.name}" to clipboard`, 'log');
      sound.playClick();
    }
  }, [selectedId, objects, addLog]);

  // Paste
  const handlePaste = useCallback(() => {
    if (!clipboardRef.current) return;
    const orig = clipboardRef.current;
    const newObj: RobloxObject = {
      ...orig,
      id: 'part_' + Math.random().toString(36).substring(2, 9),
      name: orig.name + '_Paste',
      position: [orig.position[0] + 2, orig.position[1], orig.position[2] + 2],
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedId(newObj.id);
    addLog(`Pasted "${newObj.name}" into Workspace`, 'log');
    sound.playPlace();
  }, [addLog]);

  // Insert standard part
  const handleInsertPart = useCallback((shape: PartShape) => {
    const newObj: RobloxObject = {
      id: 'part_' + Math.random().toString(36).substring(2, 9),
      name: `${shape}Part`,
      type: 'Part',
      shape,
      position: [0, shape === 'Cylinder' ? 2 : 1, 0],
      rotation: [0, 0, 0],
      size: shape === 'Ball' ? [3, 3, 3] : shape === 'Cylinder' ? [2, 4, 2] : [4, 1.2, 2],
      color: '#A0A0A0',
      material: 'SmoothPlastic',
      anchored: true,
      canCollide: true,
      transparency: 0,
      reflectance: 0,
      castShadow: true,
      behaviorType: 'none',
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedId(newObj.id);
    addLog(`Inserted new ${shape} part at origin`, 'log');
    sound.playPlace();
  }, [addLog]);

  // Select Model for Placement from Toolbox Module Section
  const handleSelectModelForPlacement = useCallback((template: CatalogModelTemplate) => {
    const newObj: RobloxObject = {
      ...template.template,
      id: 'model_' + Math.random().toString(36).substring(2, 9),
    };
    setActivePlacementModel(newObj);
    setIsToolboxOpen(false);
    addLog(`Placement mode: Click anywhere on map to drop "${newObj.name}"`, 'log');
    sound.playClick();
  }, [addLog]);

  // Direct insert model to origin
  const handleInsertModelDirect = useCallback((template: CatalogModelTemplate) => {
    const newObj: RobloxObject = {
      ...template.template,
      id: 'model_' + Math.random().toString(36).substring(2, 9),
      position: [0, template.template.size[1] / 2, 0],
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedId(newObj.id);
    addLog(`Inserted "${newObj.name}" into Workspace from Toolbox`, 'log');
    sound.playPlace();
  }, [addLog]);

  // Save new custom model into custom models list
  const handleSaveCustomModel = useCallback((model: CatalogModelTemplate) => {
    setCustomModels((prev) => [model, ...prev]);
    addLog(`Added "${model.name}" to Custom Models! Open Toolbox to place it.`, 'log');
  }, [addLog]);

  // Confirm placement at clicked point on map
  const handlePlaceObject = useCallback((pos: [number, number, number]) => {
    if (!activePlacementModel) return;
    const finalObj: RobloxObject = {
      ...activePlacementModel,
      position: pos,
    };
    setObjects((prev) => [...prev, finalObj]);
    setSelectedId(finalObj.id);
    setActivePlacementModel(null);
    addLog(`Placed "${finalObj.name}" at (${pos[0]}, ${pos[1].toFixed(1)}, ${pos[2]})`, 'log');
    sound.playPlace();
  }, [activePlacementModel, addLog]);

  const handleCancelPlacement = useCallback(() => {
    setActivePlacementModel(null);
    addLog('Placement mode canceled.', 'log');
  }, [addLog]);

  // Script Editor triggers
  const handleOpenScriptEditor = useCallback((objectId?: string) => {
    const target = objectId || selectedId;
    if (!target) {
      addLog('Select an object first to attach or edit Lua script.', 'warn');
      return;
    }
    setEditingScriptTargetId(target);
    setIsScriptEditorOpen(true);
    sound.playClick();
  }, [selectedId, addLog]);

  const handleSaveScript = useCallback((id: string, code: string) => {
    handleUpdateObject(id, { scriptCode: code, scriptEnabled: true });
    addLog(`Updated Lua script for object ID: ${id}`, 'log');
  }, [handleUpdateObject, addLog]);

  // Toggle Play / Edit mode
  const handleTogglePlayMode = useCallback(() => {
    setIsPlayMode((prev) => !prev);
    setActivePlacementModel(null);
  }, []);

  // Starter map loading
  const handleNewPlace = useCallback((type: 'baseplate' | 'obby') => {
    const map = STARTER_TEMPLATES[type];
    setObjects(map.objects);
    setSelectedId(map.objects[0]?.id || null);
    setPlaceName(type === 'obby' ? 'Classic Obby Course' : 'Baseplate');
    addLog(`Loaded template: ${map.name}`, 'log');
    sound.playPlace();
  }, [addLog]);

  // Export JSON
  const handleExportJSON = useCallback(() => {
    const data = JSON.stringify(objects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${placeName.replace(/\s+/g, '_')}_RobloxPlace.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Exported game data to JSON file.', 'log');
  }, [objects, placeName, addLog]);

  // Import JSON
  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setObjects(parsed);
            setSelectedId(parsed[0]?.id || null);
            addLog(`Imported ${parsed.length} objects from file.`, 'log');
            sound.playPlace();
          }
        } catch {
          addLog('Failed to parse map JSON file.', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [addLog]);

  // Execute console command
  const handleExecuteCommand = useCallback((cmd: string) => {
    addLog(`> ${cmd}`, 'log');
    if (cmd.startsWith('print(')) {
      const match = cmd.match(/print\((['"]?)(.*?)\1\)/);
      if (match) addLog(match[2], 'log');
    } else if (cmd.toLowerCase().includes('help')) {
      addLog('Available commands: print(...), spawn, clear, obby, baseplate, publish', 'log');
    } else if (cmd.toLowerCase() === 'publish') {
      setIsPublishModalOpen(true);
    } else if (cmd.toLowerCase() === 'clear') {
      setLogs([]);
    } else if (cmd.toLowerCase() === 'obby') {
      handleNewPlace('obby');
    } else {
      addLog(`[Console] Executed Lua expression: ${cmd}`, 'log');
    }
  }, [addLog, handleNewPlace]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === '1') {
        setToolMode('select');
      } else if (e.key === '2') {
        setToolMode('move');
      } else if (e.key === '3') {
        setToolMode('scale');
      } else if (e.key === '4') {
        setToolMode('rotate');
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleTogglePlayMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected, handleDuplicateSelected, handleCopy, handlePaste, handleTogglePlayMode]);

  // Resizable Sidebar Mouse Drag
  const handleSidebarMouseDown = () => {
    isDraggingSidebarRef.current = true;
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSidebarRef.current) return;
      const newWidth = Math.max(200, Math.min(500, window.innerWidth - e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      isDraggingSidebarRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const selectedObject = objects.find((o) => o.id === selectedId) || null;
  const editingTargetObject = objects.find((o) => o.id === editingScriptTargetId) || selectedObject;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#ECECEC] text-[#222222] font-sans select-none">
      {/* Top Toolbar */}
      <Toolbar
        toolMode={toolMode}
        onSetToolMode={setToolMode}
        isPlayMode={isPlayMode}
        onTogglePlayMode={handleTogglePlayMode}
        moveSnap={moveSnap}
        onSetMoveSnap={setMoveSnap}
        rotateSnap={rotateSnap}
        onSetRotateSnap={setRotateSnap}
        onOpenToolbox={() => setIsToolboxOpen(true)}
        onInsertPart={handleInsertPart}
        onDuplicate={handleDuplicateSelected}
        onDelete={handleDeleteSelected}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onOpenScriptEditor={() => handleOpenScriptEditor()}
        onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
        isConsoleOpen={isConsoleOpen}
        onNewPlace={handleNewPlace}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenCustomModelCreator={() => setIsCustomModelModalOpen(true)}
        showEditTouchControls={showEditTouchControls}
        onToggleEditTouchControls={() => setShowEditTouchControls((prev) => !prev)}
        placeName={placeName}
      />

      {/* Main Studio View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Center: 3D Viewport */}
        <div className="flex-1 h-full relative overflow-hidden">
          <Viewport3D
            objects={objects}
            selectedId={selectedId}
            toolMode={toolMode}
            moveSnap={moveSnap}
            rotateSnap={rotateSnap}
            isPlayMode={isPlayMode}
            activePlacementModel={activePlacementModel}
            lightingSettings={lightingSettings}
            onSelectObject={setSelectedId}
            onUpdateObject={handleUpdateObject}
            onPlaceObject={handlePlaceObject}
            onCancelPlacement={handleCancelPlacement}
            onLog={addLog}
            playerHealth={playerHealth}
            playerCoins={playerCoins}
            onPlayerHealthChange={setPlayerHealth}
            onPlayerCoinsChange={setPlayerCoins}
            mobileMoveVector={mobileMoveVector}
            mobileJumpTrigger={mobileJumpTrigger}
            mobileEmoteTrigger={mobileEmoteTrigger}
            showEditTouchControls={showEditTouchControls}
          />

          {/* In-Play Mode HUD Overlay */}
          <PlayOverlay
            isPlayMode={isPlayMode}
            onStopPlayMode={() => setIsPlayMode(false)}
            playerHealth={playerHealth}
            playerCoins={playerCoins}
            onMobileMove={setMobileMoveVector}
            onMobileJump={() => setMobileJumpTrigger((prev) => prev + 1)}
            onMobileEmote={() => setMobileEmoteTrigger((prev) => prev + 1)}
            onResetCharacter={() => {
              setPlayerHealth(100);
              addLog('Player respawned at SpawnLocation', 'log');
              sound.playOof();
            }}
          />

          {/* Bottom Output Console Drawer */}
          <OutputConsole
            isOpen={isConsoleOpen}
            onClose={() => setIsConsoleOpen(false)}
            logs={logs}
            onClearLogs={() => setLogs([])}
            onExecuteCommand={handleExecuteCommand}
          />
        </div>

        {/* Right Side Panels: Explorer & Properties */}
        {!isPlayMode && (
          <div
            style={{ width: `${sidebarWidth}px` }}
            className="h-full bg-white border-l border-[#C8C8C8] flex flex-row relative shrink-0 shadow-xs"
          >
            {/* Drag to resize handle */}
            <div
              onMouseDown={handleSidebarMouseDown}
              className="w-4.5 bg-[#EDEDED] hover:bg-[#D8D8D8] active:bg-[#B8B8B8] cursor-col-resize border-r border-[#C8C8C8] flex flex-col items-center justify-center shrink-0 group transition"
              title="Drag to resize panel"
            >
              <div className="transform -rotate-90 text-[9px] font-semibold text-gray-500 group-hover:text-gray-800 whitespace-nowrap tracking-wide select-none">
                Drag to resize
              </div>
            </div>

            {/* Split Explorer (Top) and Properties (Bottom) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-[48%] overflow-hidden">
                <ExplorerPanel
                  objects={objects}
                  selectedId={selectedId}
                  onSelectObject={setSelectedId}
                  onDeleteObject={handleDeleteSelected}
                  onOpenScriptForObject={(id) => handleOpenScriptEditor(id)}
                />
              </div>

              <div className="h-1 bg-[#D8D8D8] border-y border-[#C8C8C8] cursor-row-resize"></div>

              <div className="flex-1 overflow-hidden">
                <PropertiesPanel
                  selectedObject={selectedObject}
                  selectedId={selectedId}
                  lightingSettings={lightingSettings}
                  onUpdateObject={handleUpdateObject}
                  onUpdateLighting={handleUpdateLighting}
                  onOpenScriptEditor={(id) => handleOpenScriptEditor(id)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toolbox Modal (includes custom models) */}
      <ToolboxModal
        isOpen={isToolboxOpen}
        onClose={() => setIsToolboxOpen(false)}
        onSelectModelForPlacement={handleSelectModelForPlacement}
        onInsertModelDirect={handleInsertModelDirect}
        customModels={customModels}
        onOpenCustomModelCreator={() => {
          setIsToolboxOpen(false);
          setIsCustomModelModalOpen(true);
        }}
      />

      {/* Custom Model Creator Modal */}
      <CustomModelModal
        isOpen={isCustomModelModalOpen}
        onClose={() => setIsCustomModelModalOpen(false)}
        onSaveCustomModel={handleSaveCustomModel}
        onLog={addLog}
      />

      {/* Publish & Export Modal (.rbxmx & 1-Click Studio Script) */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        placeName={placeName}
        objects={objects}
        onLog={addLog}
      />

      {/* Script Editor Modal */}
      <ScriptEditorModal
        isOpen={isScriptEditorOpen}
        onClose={() => setIsScriptEditorOpen(false)}
        targetObjectName={editingTargetObject?.name || 'Object'}
        targetObjectId={editingTargetObject?.id || ''}
        initialCode={editingTargetObject?.scriptCode || ''}
        onSaveScript={handleSaveScript}
        onLog={addLog}
      />
    </div>
  );
}
