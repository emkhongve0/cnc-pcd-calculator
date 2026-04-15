import React, { useState, useMemo } from 'react';
import { InputPanel } from './InputPanel';
import { VisualizationPanel } from './VisualizationPanel';
import { CoordinateTable } from './CoordinateTable';
import { SummaryCard } from './SummaryCard';
import { PrecisionPanel } from './PrecisionPanel';
import { CoordinateExample } from './CoordinateExample';
import { mechanicalMath } from '../../utils/mathPhysics';
import type {Origin, SnapPoint } from '../../App';

const BoltCircleCalc: React.FC = () => {
  // 1. Quản lý trạng thái (State)
  const [diameter, setDiameter] = useState(40);
  const [numberOfHoles, setNumberOfHoles] = useState(8);
  const [startAngle, setStartAngle] = useState(0);
  const [originMode, setOriginMode] = useState<'center' | 'custom'>('center');
  const [customOrigin, setCustomOrigin] = useState<Origin>({ x: 0, y: 0 });
  const [pickingOrigin, setPickingOrigin] = useState(false);

  // LOGIC: Xác định tọa độ gốc (0,0) đang được áp dụng
  const activeOrigin = useMemo(() => {
    return originMode === 'center' ? { x: 0, y: 0 } : customOrigin;
  }, [originMode, customOrigin]);

  // 2. Tính toán danh sách các lỗ và điểm bắt dính
  // Logic này sẽ chạy lại mỗi khi thông số hình học HOẶC điểm gốc thay đổi
  const { holes, snapPoints } = useMemo(() => {
    // Tính toán tọa độ lỗ (bao gồm cả tuyệt đối để vẽ và tương đối để làm G-code)
    const calculatedHoles = mechanicalMath.calculatePCD(
      diameter, 
      numberOfHoles, 
      startAngle, 
      activeOrigin 
    );

    // Tạo danh sách các điểm "hút" (Snap Points) cho giao diện trực quan
    const points: SnapPoint[] = [
      { x: 0, y: 0, label: 'Tâm vòng tròn', type: 'center' },
      ...calculatedHoles.map((h, i) => ({ 
        x: h.x, // Luôn dùng tọa độ tuyệt đối so với tâm để vẽ hình ổn định
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
          Máy tính chia lỗ vòng tròn (PCD)
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Hỗ trợ thiết lập Gốc phôi G54 tùy chỉnh cho gia công cơ khí
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: ĐIỀU KHIỂN */}
        <div className="lg:col-span-4 space-y-6">
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
              // Khi thay đổi tọa độ gốc, hệ thống tự hiểu là đang dùng mode 'custom'
              setCustomOrigin(newOrigin);
              setOriginMode('custom');
            }}
            pickingOrigin={pickingOrigin} 
            setPickingOrigin={setPickingOrigin}
            snapPoints={snapPoints}
            holes={holes} // THÊM MỚI: Truyền danh sách lỗ để tạo các nút chọn nhanh 1, 2, 3...
          />
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

        {/* CỘT PHẢI: HIỂN THỊ */}
        <div className="lg:col-span-8 space-y-6">
          <VisualizationPanel 
            diameter={diameter} 
            holes={holes}
            originMode={originMode} 
            customOrigin={customOrigin}
            pickingOrigin={pickingOrigin}
            onOriginPick={(x, y) => {
              // Logic khi người dùng click trực tiếp vào một điểm trên hình vẽ
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
        </div>
      </div>
    </div>
  );
};

export default BoltCircleCalc;