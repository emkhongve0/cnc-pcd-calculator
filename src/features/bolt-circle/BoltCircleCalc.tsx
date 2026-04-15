import React, { useState, useMemo } from 'react';
import { InputPanel } from './InputPanel';
import { VisualizationPanel } from './VisualizationPanel';
import { CoordinateTable } from './CoordinateTable';
import { SummaryCard } from './SummaryCard';
import { PrecisionPanel } from './PrecisionPanel';
import { CoordinateExample } from './CoordinateExample';
import { mechanicalMath } from '../../utils/mathPhysics';
import type { Origin, SnapPoint } from '../../App';

const BoltCircleCalc: React.FC = () => {
  const [diameter, setDiameter] = useState(40);
  const [numberOfHoles, setNumberOfHoles] = useState(8);
  const [startAngle, setStartAngle] = useState(0);
  const [originMode, setOriginMode] = useState<'center' | 'custom'>('center');
  const [customOrigin, setCustomOrigin] = useState<Origin>({ x: 0, y: 0 });
  const [pickingOrigin, setPickingOrigin] = useState(false);

  const activeOrigin = useMemo(() => {
    return originMode === 'center' ? { x: 0, y: 0 } : customOrigin;
  }, [originMode, customOrigin]);

  const { holes, snapPoints } = useMemo(() => {
    const calculatedHoles = mechanicalMath.calculatePCD(
      diameter, 
      numberOfHoles, 
      startAngle, 
      activeOrigin 
    );

    const points: SnapPoint[] = [
      { x: 0, y: 0, label: 'Tâm vòng tròn', type: 'center' },
      ...calculatedHoles.map((h, i) => ({ 
        x: h.x, 
        y: h.y, 
        label: `Lỗ ${i + 1}`, 
        type: 'hole' as const 
      })),
      { x: diameter / 2, y: 0, label: 'Cực Phải (3h)', type: 'cardinal' as const },
      { x: 0, y: diameter / 2, label: 'Cực Trên (12h)', type: 'cardinal' as const },
      { x: -diameter / 2, y: 0, label: 'Cực Trái (9h)', type: 'cardinal' as const },
      { x: 0, y: -diameter / 2, label: 'Cực Dưới (6h)', type: 'cardinal' as const },
    ];

    return { holes: calculatedHoles, snapPoints: points };
  }, [diameter, numberOfHoles, startAngle, activeOrigin]);

  return (
    // Tối ưu padding: p-2 cho mobile cực nhỏ, p-4 cho mobile thường, p-8 cho desktop
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-8 space-y-4 sm:space-y-8 bg-gray-50 min-h-screen">
      
      {/* HEADER: Thu nhỏ font trên mobile để không chiếm hết màn hình đầu tiên */}
      <header className="border-b pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 uppercase tracking-tight leading-tight">
          Máy tính chia lỗ (PCD)
        </h1>
        <p className="text-[10px] sm:text-sm text-gray-500 mt-1 font-medium">
          Hỗ trợ Gốc phôi G54 tùy chỉnh cho gia công CNC
        </p>
      </header>

      {/* GRID: Giảm gap từ 8 xuống 4 trên mobile để tiết kiệm diện tích */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
        
        {/* CỘT NHẬP LIỆU: Luôn hiện lên đầu trên mobile */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <InputPanel 
            diameter={diameter} 
            setDiameter={setDiameter}
            numberOfHoles={numberOfHoles} 
            setNumberOfHoles={setNumberOfHoles}
            startAngle={startAngle} 
            setStartAngle={setStartAngle}
            originMode={originMode} 
            setOriginMode={setOriginMode}
            customOrigin={customOrigin} 
            setCustomOrigin={(newOrigin) => {
              setCustomOrigin(newOrigin);
              setOriginMode('custom');
            }}
            pickingOrigin={pickingOrigin} 
            setPickingOrigin={setPickingOrigin}
            snapPoints={snapPoints}
            holes={holes} 
          />
          
          {/* Trên mobile, các bảng bổ trợ này sẽ đẩy xuống dưới cùng để nhường chỗ cho Visualization */}
          <div className="hidden lg:block space-y-6">
            <SummaryCard 
              diameter={diameter} 
              numberOfHoles={numberOfHoles}
              startAngle={startAngle} 
              originMode={originMode}
              customOrigin={customOrigin}
            />
            <PrecisionPanel snapPoints={snapPoints} originMode={originMode} />
            <CoordinateExample />
          </div>
        </div>

        {/* CỘT HIỂN THỊ: Hình vẽ và Bảng tọa độ */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <VisualizationPanel 
            diameter={diameter} 
            holes={holes}
            originMode={originMode} 
            customOrigin={customOrigin}
            pickingOrigin={pickingOrigin}
            onOriginPick={(x, y) => {
              setCustomOrigin({ x, y });
              setOriginMode('custom');
              setPickingOrigin(false);
            }}
            snapPoints={snapPoints}
          />
          
          <CoordinateTable 
            holes={holes} 
            originMode={originMode} 
            customOrigin={customOrigin} 
          />

          {/* Hiện các bảng bổ trợ ở cuối danh sách khi xem trên mobile */}
          <div className="lg:hidden space-y-4">
            <SummaryCard 
              diameter={diameter} 
              numberOfHoles={numberOfHoles}
              startAngle={startAngle} 
              originMode={originMode}
              customOrigin={customOrigin}
            />
            <PrecisionPanel snapPoints={snapPoints} originMode={originMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoltCircleCalc;