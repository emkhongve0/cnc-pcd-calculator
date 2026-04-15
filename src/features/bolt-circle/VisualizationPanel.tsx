import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { AlertCircle } from 'lucide-react';
import type { Hole, Origin, SnapPoint } from '../../App';

type VisualizationPanelProps = {
  diameter: number;
  holes: Hole[];
  originMode: 'center' | 'custom';
  customOrigin: Origin;
  pickingOrigin: boolean;
  onOriginPick: (x: number, y: number) => void;
  snapPoints: SnapPoint[];
};

export function VisualizationPanel({
  diameter,
  holes,
  originMode,
  customOrigin,
  pickingOrigin,
  onOriginPick,
  snapPoints,
}: VisualizationPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSnapPoint, setHoveredSnapPoint] = useState<SnapPoint | null>(null);
  const [invalidClick, setInvalidClick] = useState(false);

  const canvasWidth = 600;
  const canvasHeight = 600;
  const padding = 60;
  const scale = (Math.min(canvasWidth, canvasHeight) - 2 * padding) / (diameter || 1);

  const SNAP_RADIUS_PX = 15;

  const toCanvasX = (x: number) => canvasWidth / 2 + x * scale;
  const toCanvasY = (y: number) => canvasHeight / 2 - y * scale;

  const toWorldX = (canvasX: number) => (canvasX - canvasWidth / 2) / scale;
  const toWorldY = (canvasY: number) => -(canvasY - canvasHeight / 2) / scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    drawGrid(ctx);
    drawAxes(ctx); // Hàm này đã được nâng cấp logic bên dưới
    drawCircle(ctx);
    drawSnapPointIndicators(ctx);
    drawHoles(ctx);
    drawOrigin(ctx);

    if (pickingOrigin && hoveredSnapPoint) {
      drawHoverIndicator(ctx, hoveredSnapPoint.x, hoveredSnapPoint.y);
    }
  }, [diameter, holes, originMode, customOrigin, pickingOrigin, hoveredSnapPoint, snapPoints]);

  useEffect(() => {
    if (invalidClick) {
      const timer = setTimeout(() => setInvalidClick(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [invalidClick]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    const gridSpacing = 10 * scale;
    for (let x = (canvasWidth / 2) % gridSpacing; x < canvasWidth; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    }
    for (let y = (canvasHeight / 2) % gridSpacing; y < canvasHeight; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); ctx.stroke();
    }
  };

  // --- LOGIC MỚI: VẼ TRỤC TỌA ĐỘ XUYÊN SUỐT ---
  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    const origin = originMode === 'center' ? { x: 0, y: 0 } : customOrigin;
    const ox = toCanvasX(origin.x);
    const oy = toCanvasY(origin.y);

    // Thiết lập nét đứt mảnh cho trục tọa độ
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; // Màu đỏ nhạt

    // Vẽ trục X chạy ngang toàn bộ Canvas
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(canvasWidth, oy);
    ctx.stroke();

    // Vẽ trục Y chạy dọc toàn bộ Canvas
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, canvasHeight);
    ctx.stroke();

    // Reset nét liền để vẽ mũi tên và nhãn
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';

    // Nhãn nhắm vào điểm gốc
    ctx.fillText('G54 (0,0)', ox + 8, oy - 8);

    // Mũi tên hướng X+
    ctx.beginPath();
    ctx.moveTo(canvasWidth - 5, oy);
    ctx.lineTo(canvasWidth - 15, oy - 4);
    ctx.lineTo(canvasWidth - 15, oy + 4);
    ctx.fill();
    ctx.fillText('X+', canvasWidth - 20, oy + 15);

    // Mũi tên hướng Y+
    ctx.beginPath();
    ctx.moveTo(ox, 5);
    ctx.lineTo(ox - 4, 15);
    ctx.lineTo(ox + 4, 15);
    ctx.fill();
    ctx.fillText('Y+', ox + 10, 15);
  };

  const drawCircle = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(toCanvasX(0), toCanvasY(0), (diameter / 2) * scale, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawHoles = (ctx: CanvasRenderingContext2D) => {
    holes.forEach((hole, index) => {
      const x = toCanvasX(hole.x);
      const y = toCanvasY(hole.y);

      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${index + 1}`, x, y + 3.5);

      ctx.fillStyle = '#0e7490';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${hole.angle.toFixed(1)}°`, x, y - 12);
    });
  };

  const drawOrigin = (ctx: CanvasRenderingContext2D) => {
    const origin = originMode === 'center' ? { x: 0, y: 0 } : customOrigin;
    const x = toCanvasX(origin.x);
    const y = toCanvasY(origin.y);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, 2 * Math.PI); ctx.stroke();
  };

  const drawSnapPointIndicators = (ctx: CanvasRenderingContext2D) => {
    if (!pickingOrigin) return;
    snapPoints.forEach(p => {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.beginPath(); ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 4, 0, 2 * Math.PI); ctx.fill();
    });
  };

  const drawHoverIndicator = (ctx: CanvasRenderingContext2D, worldX: number, worldY: number) => {
    const x = toCanvasX(worldX);
    const y = toCanvasY(worldY);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 15, 0, 2 * Math.PI); ctx.stroke();
  };

  const findClosestSnapPoint = (x: number, y: number): SnapPoint | null => {
    const threshold = SNAP_RADIUS_PX / scale;
    let closest = null;
    let minIdx = Infinity;

    for (const p of snapPoints) {
      const dist = Math.sqrt((p.x - x)**2 + (p.y - y)**2);
      if (dist < threshold && dist < minIdx) {
        minIdx = dist;
        closest = p;
      }
    }
    return closest;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pickingOrigin) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = toWorldX(e.clientX - rect.left);
    const y = toWorldY(e.clientY - rect.top);

    const snapped = findClosestSnapPoint(x, y);
    if (snapped) {
      onOriginPick(snapped.x, snapped.y);
    } else {
      setInvalidClick(true);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pickingOrigin) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = toWorldX(e.clientX - rect.left);
    const y = toWorldY(e.clientY - rect.top);
    setHoveredSnapPoint(findClosestSnapPoint(x, y));
  };

  return (
    <Card className="p-6 bg-white shadow-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Mô phỏng 2D Trực quan</h2>
        {pickingOrigin && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full animate-pulse">
            Chế độ chọn điểm gốc đang bật
          </span>
        )}
      </div>

      <div className="relative flex justify-center bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoveredSnapPoint(null)}
          className={`max-w-full h-auto rounded-lg shadow-inner bg-white ${pickingOrigin ? 'cursor-crosshair' : ''}`}
        />
        
        {invalidClick && (
          <div className="absolute top-10 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl animate-bounce">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Vui lòng chọn vào các điểm chuẩn (Lỗ, Tâm, Cực)!</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div> <span>Vị trí lỗ</span>
        </div>
        <div className="flex items-center gap-2 border-l pl-6">
          <div className="w-4 h-4 border border-red-500 border-dashed"></div> <span>Hệ trục G54 (0,0)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold">X+ / Y+</span> <span>Hướng trục dương</span>
        </div>
      </div>
    </Card>
  );
}