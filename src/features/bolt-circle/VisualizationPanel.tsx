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

  // 1. ĐỊNH NGHĨA KÍCH THƯỚC LOGIC (KÍCH THƯỚC CHÚNG TA MUỐN HIỂN THỊ)
  const logicalWidth = 350;
  const logicalHeight = 350;
  const padding = 40; 
  const scale = (Math.min(logicalWidth, logicalHeight) - 2 * padding) / (diameter || 1);

  const SNAP_RADIUS_PX = 15;

  // Hàm chuyển đổi vẫn dùng kích thước logic
  const toCanvasX = (x: number) => logicalWidth / 2 + x * scale;
  const toCanvasY = (y: number) => logicalHeight / 2 - y * scale;

  const toWorldX = (canvasX: number) => (canvasX - logicalWidth / 2) / scale;
  const toWorldY = (canvasY: number) => -(canvasY - logicalHeight / 2) / scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- LOGIC MỚI: SỬ LÝ MÀN HÌNH SẮC NÉT (HIGH-DPI) ---
    
    // Lấy tỷ lệ mật độ điểm ảnh của thiết bị (thường là 2 hoặc 3 trên mobile)
    const dpr = window.devicePixelRatio || 1;

    // Thiết lập kích thước vẽ THỰC TẾ của Canvas (cao gấp dpr lần)
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    // Thu nhỏ Canvas lại bằng CSS về kích thước logic
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    // Quan trọng: Tự động nhân tỷ lệ cho tất cả các lệnh vẽ sau này
    // Giúp chúng ta vẫn dùng tọa độ logic (350x350) mà hình ảnh vẫn nét
    ctx.scale(dpr, dpr);

    // --- KẾT THÚC LOGIC HIGH-DPI ---

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Vẽ (Dùng các hàm vẽ như cũ, sử dụng kích thước logic)
    drawGrid(ctx, logicalWidth, logicalHeight, scale);
    drawAxes(ctx, logicalWidth, logicalHeight, originMode, customOrigin, toCanvasX, toCanvasY); 
    drawCircle(ctx, logicalWidth, logicalHeight, diameter, scale, toCanvasX, toCanvasY);
    drawSnapPointIndicators(ctx, pickingOrigin, snapPoints, toCanvasX, toCanvasY);
    drawHoles(ctx, holes, toCanvasX, toCanvasY);
    drawOrigin(ctx, originMode, customOrigin, toCanvasX, toCanvasY);

    if (pickingOrigin && hoveredSnapPoint) {
      drawHoverIndicator(ctx, hoveredSnapPoint.x, hoveredSnapPoint.y, toCanvasX, toCanvasY);
    }
    // Cập nhật dependency list để hàm useEffect chạy lại khi các thông số thay đổi
  }, [diameter, holes, originMode, customOrigin, pickingOrigin, hoveredSnapPoint, snapPoints, logicalWidth, logicalHeight, scale, toCanvasX, toCanvasY]);

  useEffect(() => {
    if (invalidClick) {
      const timer = setTimeout(() => setInvalidClick(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [invalidClick]);

  // --- CÁC HÀM VẼ (TÁCH BIỆT LOGIC, DÙNG THAM SỐ) ---

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, currentScale: number) => {
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    const gridSpacing = 10 * currentScale;
    for (let x = (width / 2) % gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = (height / 2) % gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  };

  const drawAxes = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentOriginMode: 'center' | 'custom',
    currentCustomOrigin: Origin,
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    const origin = currentOriginMode === 'center' ? { x: 0, y: 0 } : currentCustomOrigin;
    const ox = canvasX(origin.x);
    const oy = canvasY(origin.y);

    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';

    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(width, oy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, height);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px monospace';

    ctx.fillText('G54(0,0)', ox + 5, oy - 5);

    // Mũi tên X+
    ctx.beginPath();
    ctx.moveTo(width - 5, oy);
    ctx.lineTo(width - 12, oy - 3);
    ctx.lineTo(width - 12, oy + 3);
    ctx.fill();
    ctx.fillText('X+', width - 18, oy + 12);

    // Mũi tên Y+
    ctx.beginPath();
    ctx.moveTo(ox, 5);
    ctx.lineTo(ox - 3, 12);
    ctx.lineTo(ox + 3, 12);
    ctx.fill();
    ctx.fillText('Y+', ox + 8, 12);
  };

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentDiameter: number,
    currentScale: number,
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvasX(0), canvasY(0), (currentDiameter / 2) * currentScale, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawHoles = (
    ctx: CanvasRenderingContext2D,
    currentHoles: Hole[],
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    currentHoles.forEach((hole, index) => {
      const x = canvasX(hole.x);
      const y = canvasY(hole.y);

      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${index + 1}`, x, y + 3.5);

      ctx.fillStyle = '#0e7490';
      ctx.font = '8px sans-serif';
      ctx.fillText(`${hole.angle.toFixed(1)}°`, x, y - 10);
    });
  };

  const drawOrigin = (
    ctx: CanvasRenderingContext2D,
    currentOriginMode: 'center' | 'custom',
    currentCustomOrigin: Origin,
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    const origin = currentOriginMode === 'center' ? { x: 0, y: 0 } : currentCustomOrigin;
    const x = canvasX(origin.x);
    const y = canvasY(origin.y);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.stroke();
  };

  const drawSnapPointIndicators = (
    ctx: CanvasRenderingContext2D,
    isPicking: boolean,
    currentSnapPoints: SnapPoint[],
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    if (!isPicking) return;
    currentSnapPoints.forEach(p => {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.beginPath(); ctx.arc(canvasX(p.x), canvasY(p.y), 3, 0, 2 * Math.PI); ctx.fill();
    });
  };

  const drawHoverIndicator = (
    ctx: CanvasRenderingContext2D,
    worldX: number,
    worldY: number,
    canvasX: (x: number) => number,
    canvasY: (y: number) => number
  ) => {
    const x = canvasX(worldX);
    const y = canvasY(worldY);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 12, 0, 2 * Math.PI); ctx.stroke();
  };

  // --- XỬ LÝ SỰ KIỆN (MOBILE FRIENDLY, GIỮ NGUYÊN) ---

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!pickingOrigin) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Tỷ lệ được tính dựa trên KÍCH THƯỚC LOGIC
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;

    const x = toWorldX((clientX - rect.left) * scaleX);
    const y = toWorldY((clientY - rect.top) * scaleY);

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
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;
    
    const x = toWorldX((e.clientX - rect.left) * scaleX);
    const y = toWorldY((e.clientY - rect.top) * scaleY);
    setHoveredSnapPoint(findClosestSnapPoint(x, y));
  };

  return (
    <Card className="p-3 sm:p-6 bg-white shadow-lg overflow-hidden border-none sm:border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm sm:text-lg font-bold text-gray-900 uppercase">Mô phỏng 2D</h2>
        {pickingOrigin && (
          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full animate-pulse font-bold">
            CHỌN ĐIỂM GỐC
          </span>
        )}
      </div>

      <div className="relative flex justify-center bg-slate-50 rounded-xl p-2 sm:p-4 border border-dashed border-slate-200 w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          // Bỏ thuộc tính width/height cứng, dùng ref để set trong useEffect
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoveredSnapPoint(null)}
          className={`w-full h-auto max-w-[500px] aspect-square rounded-lg shadow-inner bg-white touch-none ${pickingOrigin ? 'cursor-crosshair' : ''}`}
        />
        
        {invalidClick && (
          <div className="absolute top-5 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-xl animate-bounce z-10">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold">Hãy chọn vào Lỗ hoặc Tâm!</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div> <span>Lỗ</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> <span>Gốc (0,0)</span>
        </div>
        <div className="flex items-center gap-1 border-l pl-3 border-gray-300">
          <span className="text-red-400">---</span> <span>Trục X/Y</span>
        </div>
      </div>
    </Card>
  );
}