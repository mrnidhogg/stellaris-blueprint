import { useState, useCallback } from 'react';
import { Stage, Layer, Rect, Group, Text, Line, Circle } from 'react-konva';
import { create } from 'zustand';

const GRID_SIZE = 100;
const CELL_SIZE = 30;

interface PlacedBuilding {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
}

interface Track {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface EditorState {
  buildings: PlacedBuilding[];
  tracks: Track[];
  selectedBuildingId: string | null;
  selectedTrackId: string | null;
  mode: 'select' | 'place' | 'track';
  currentBuilding: PlacedBuilding | null;
  addBuilding: (building: PlacedBuilding) => void;
  removeBuilding: (id: string) => void;
  addTrack: (track: Track) => void;
  removeTrack: (id: string) => void;
  setSelectedBuilding: (id: string | null) => void;
  setSelectedTrack: (id: string | null) => void;
  setMode: (mode: 'select' | 'place' | 'track') => void;
  setCurrentBuilding: (building: PlacedBuilding | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  buildings: [],
  tracks: [],
  selectedBuildingId: null,
  selectedTrackId: null,
  mode: 'select',
  currentBuilding: null,
  addBuilding: (building) => set((state) => ({ buildings: [...state.buildings, building] })),
  removeBuilding: (id) => set((state) => ({ 
    buildings: state.buildings.filter((b) => b.id !== id),
    selectedBuildingId: state.selectedBuildingId === id ? null : state.selectedBuildingId 
  })),
  addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
  removeTrack: (id) => set((state) => ({ 
    tracks: state.tracks.filter((t) => t.id !== id),
    selectedTrackId: state.selectedTrackId === id ? null : state.selectedTrackId
  })),
  setSelectedBuilding: (id) => set({ selectedBuildingId: id, selectedTrackId: null }),
  setSelectedTrack: (id) => set({ selectedTrackId: id, selectedBuildingId: null }),
  setMode: (mode) => set({ mode, selectedBuildingId: null, selectedTrackId: null }),
  setCurrentBuilding: (building) => set({ currentBuilding: building }),
}));

// 预置建筑
const PRESET_BUILDINGS = [
  { name: '发电厂', width: 2, height: 2, color: '#4ade80' },
  { name: '矿物精炼厂', width: 3, height: 2, color: '#60a5fa' },
  { name: '食品工厂', width: 2, height: 2, color: '#f472b6' },
  { name: '研究实验室', width: 3, height: 3, color: '#a78bfa' },
  { name: ' alloy 工厂', width: 2, height: 3, color: '#fb923c' },
  { name: '稀有资源站', width: 2, height: 2, color: '#facc15' },
];

function Grid() {
  const lines = [];
  for (let i = 0; i <= GRID_SIZE; i++) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i * CELL_SIZE, 0, i * CELL_SIZE, GRID_SIZE * CELL_SIZE]}
        stroke="#374151"
        strokeWidth={1}
      />,
      <Line
        key={`h${i}`}
        points={[0, i * CELL_SIZE, GRID_SIZE * CELL_SIZE, i * CELL_SIZE]}
        stroke="#374151"
        strokeWidth={1}
      />
    );
  }
  return <>{lines}</>;
}

function Building({ building, isSelected, onClick }: { 
  building: PlacedBuilding; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Group
      x={building.x * CELL_SIZE}
      y={building.y * CELL_SIZE}
      onClick={onClick}
      onTap={onClick}
    >
      <Rect
        width={building.width * CELL_SIZE}
        height={building.height * CELL_SIZE}
        fill={building.color}
        stroke={isSelected ? '#fff' : '#1f2937'}
        strokeWidth={isSelected ? 3 : 1}
        cornerRadius={4}
      />
      <Text
        text={building.name}
        fontSize={10}
        fill="#1f2937"
        width={building.width * CELL_SIZE}
        align="center"
        y={building.height * CELL_SIZE / 2 - 6}
      />
    </Group>
  );
}

function TrackLine({ track, isSelected, onClick }: {
  track: Track;
  isSelected: boolean;
  onClick: () => void;
}) {
  // 轨道居中对齐到格子中心
  const startX = track.startX * CELL_SIZE + CELL_SIZE / 2;
  const startY = track.startY * CELL_SIZE + CELL_SIZE / 2;
  const endX = track.endX * CELL_SIZE + CELL_SIZE / 2;
  const endY = track.endY * CELL_SIZE + CELL_SIZE / 2;
  
  return (
    <Line
      points={[startX, startY, endX, endY]}
      stroke={isSelected ? '#fff' : '#ef4444'}
      strokeWidth={isSelected ? 6 : 4}
      onClick={onClick}
      onTap={onClick}
      hitStrokeWidth={20}
    />
  );
}

export default function BlueprintEditor() {
  const {
    buildings,
    tracks,
    selectedBuildingId,
    selectedTrackId,
    mode,
    currentBuilding,
    addBuilding,
    removeBuilding,
    addTrack,
    removeTrack,
    setSelectedBuilding,
    setSelectedTrack,
    setMode,
    setCurrentBuilding,
  } = useEditorStore();

  const [trackStart, setTrackStart] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasClick = useCallback((e: any) => {
    const stage = e.target.getStage();
    const clickedOnEmpty = e.target === stage;
    
    if (clickedOnEmpty) {
      const pos = stage.getPointerPosition();
      const x = Math.floor(pos.x / CELL_SIZE);
      const y = Math.floor(pos.y / CELL_SIZE);
      
      if (mode === 'place' && currentBuilding) {
        const newBuilding: PlacedBuilding = {
          ...currentBuilding,
          id: crypto.randomUUID(),
          x,
          y,
        };
        addBuilding(newBuilding);
        setCurrentBuilding(null);
        setMode('select');
      } else if (mode === 'track' && trackStart) {
        const newTrack: Track = {
          id: crypto.randomUUID(),
          startX: trackStart.x,
          startY: trackStart.y,
          endX: x,
          endY: y,
        };
        addTrack(newTrack);
        setTrackStart(null);
      } else if (mode === 'track' && !trackStart) {
        setTrackStart({ x, y });
      } else if (mode === 'select') {
        setSelectedBuilding(null);
        setSelectedTrack(null);
      }
    }
  }, [mode, currentBuilding, trackStart, addBuilding, addTrack, setSelectedBuilding, setSelectedTrack, setMode, setCurrentBuilding]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBuildingId) {
      removeBuilding(selectedBuildingId);
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTrackId) {
      removeTrack(selectedTrackId);
    }
    if (e.key === 'Escape') {
      setMode('select');
      setTrackStart(null);
      setCurrentBuilding(null);
    }
  }, [selectedBuildingId, selectedTrackId, removeBuilding, removeTrack, setMode, setCurrentBuilding]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* 工具栏 */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold">星际裂变蓝图编辑器</h1>
        
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${mode === 'select' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setMode('select')}
          >
            选择
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'place' ? 'bg-green-600' : 'bg-gray-700'}`}
            onClick={() => setMode('place')}
          >
            放置建筑
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'track' ? 'bg-red-600' : 'bg-gray-700'}`}
            onClick={() => setMode('track')}
          >
            绘制轨道
          </button>
        </div>

        {mode === 'place' && (
          <div className="flex gap-2 ml-4">
            {PRESET_BUILDINGS.map((b) => (
              <button
                key={b.name}
                className={`px-3 py-1 rounded text-sm ${currentBuilding?.name === b.name ? 'bg-white text-gray-900' : 'bg-gray-700'}`}
                onClick={() => setCurrentBuilding({ ...b, id: '', x: 0, y: 0 })}
                style={{ borderLeft: `4px solid ${b.color}` }}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {mode === 'track' && trackStart && (
          <span className="ml-4 text-yellow-400">点击终点完成轨道绘制</span>
        )}
        
        {mode === 'track' && !trackStart && (
          <span className="ml-4 text-gray-400">点击起点开始绘制轨道</span>
        )}
      </div>

      {/* 主画布 */}
      <div className="flex-1 overflow-auto" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="inline-block m-4">
          <Stage
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            onClick={handleCanvasClick}
            style={{ background: '#111827' }}
          >
            <Layer>
              <Grid />
              {tracks.map((track) => (
                <TrackLine
                  key={track.id}
                  track={track}
                  isSelected={selectedTrackId === track.id}
                  onClick={() => {
                    if (mode === 'select') setSelectedTrack(track.id);
                  }}
                />
              ))}
              {buildings.map((building) => (
                <Building
                  key={building.id}
                  building={building}
                  isSelected={selectedBuildingId === building.id}
                  onClick={() => {
                    if (mode === 'select') setSelectedBuilding(building.id);
                  }}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="p-2 bg-gray-800 border-t border-gray-700 text-sm">
        <span>建筑数量: {buildings.length}</span>
        <span className="ml-4">轨道数量: {tracks.length}</span>
        <span className="ml-4">
          当前模式: 
          {mode === 'select' && ' 选择'}
          {mode === 'place' && ` 放置 (${currentBuilding?.name || '未选择'})`}
          {mode === 'track' && ' 绘制轨道'}
        </span>
      </div>
    </div>
  );
}
