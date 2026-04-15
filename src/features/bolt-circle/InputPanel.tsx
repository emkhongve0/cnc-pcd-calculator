import React from 'react';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { RadioGroup, RadioGroupItem } from '../../components/ui/RadioGroup';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Info, Target, MousePointer2 } from 'lucide-react';
import type { Origin, SnapPoint, Hole } from '../../App';

type InputPanelProps = {
  diameter: number;
  setDiameter: (v: number) => void;
  numberOfHoles: number;
  setNumberOfHoles: (v: number) => void;
  startAngle: number;
  setStartAngle: (v: number) => void;
  originMode: 'center' | 'custom';
  setOriginMode: (mode: 'center' | 'custom') => void;
  customOrigin: Origin;
  setCustomOrigin: (origin: Origin) => void;
  pickingOrigin: boolean;
  setPickingOrigin: (v: boolean) => void;
  snapPoints: SnapPoint[];
  holes: Hole[]; 
};

export function InputPanel({
  diameter, setDiameter, numberOfHoles, setNumberOfHoles, startAngle, setStartAngle,
  originMode, setOriginMode, customOrigin, setCustomOrigin, pickingOrigin, setPickingOrigin,
  holes
}: InputPanelProps) {

  // Hàm cập nhật Gốc tọa độ và tự động chuyển sang chế độ Custom
  const updateOrigin = (x: number, y: number) => {
    // Làm tròn 3 chữ số thập phân để tránh sai số hiển thị
    const roundedX = Math.round(x * 1000) / 1000;
    const roundedY = Math.round(y * 1000) / 1000;
    
    setCustomOrigin({ x: roundedX, y: roundedY });
    setOriginMode('custom');
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100 border-t-4 border-t-blue-600">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Thông số thiết lập</h2>
      </div>

      {/* 1. THÔNG SỐ HÌNH HỌC */}
      <div className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="diameter" className="text-xs font-bold text-gray-500 uppercase">
            Đường kính vòng chia PCD (mm)
          </Label>
          <Input
            id="diameter"
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="holes" className="text-xs font-bold text-gray-500 uppercase">Số lỗ</Label>
            <Input
              id="holes"
              type="number"
              value={numberOfHoles}
              onChange={(e) => setNumberOfHoles(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startAngle" className="text-xs font-bold text-gray-500 uppercase">Góc bắt đầu (°)</Label>
            <Input
              id="startAngle"
              type="number"
              value={startAngle}
              onChange={(e) => setStartAngle(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 2. HỆ TỌA ĐỘ & GỐC PHÔI (G54) */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Hệ tọa độ (Origin Point)</h3>

        <RadioGroup 
          value={originMode} 
          onValueChange={(val: string) => setOriginMode(val as 'center' | 'custom')}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center" className="flex-1 cursor-pointer text-sm text-gray-700">
              Mặc định tại Tâm vòng tròn (0,0)
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex-1 cursor-pointer text-sm text-gray-700">
              Tùy chỉnh Gốc phôi (G54)
            </Label>
          </div>
        </RadioGroup>

        {/* Cấu hình Gốc tùy chỉnh */}
        {originMode === 'custom' && (
          <div className="mt-4 pl-6 border-l-2 border-blue-500 space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
            
            {/* CHỌN LỖ LÀM GỐC 0,0 */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Đặt Gốc (0,0) vào tâm lỗ số:
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {holes.map((hole, idx) => {
                  const isActive = 
                    Math.abs(customOrigin.x - hole.x) < 0.01 && 
                    Math.abs(customOrigin.y - hole.y) < 0.01;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateOrigin(hole.x, hole.y)}
                      className={`h-9 rounded-md text-xs font-bold transition-all border flex items-center justify-center ${
                        isActive 
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-100' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NHẬP TỌA ĐỘ TAY */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Tọa độ X</Label>
                <Input 
                  type="number" 
                  value={customOrigin.x} 
                  onChange={(e) => updateOrigin(Number(e.target.value), customOrigin.y)}
                  className="h-9 font-mono bg-slate-50 text-blue-700 font-bold" 
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Tọa độ Y</Label>
                <Input 
                  type="number" 
                  value={customOrigin.y} 
                  onChange={(e) => updateOrigin(customOrigin.x, Number(e.target.value))}
                  className="h-9 font-mono bg-slate-50 text-blue-700 font-bold" 
                />
              </div>
            </div>

            {/* PICK TRÊN BẢN VẼ */}
            <Button 
              variant={pickingOrigin ? 'primary' : 'outline'} 
              className={`w-full text-xs gap-2 h-10 ${pickingOrigin ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setPickingOrigin(!pickingOrigin)}
            >
              <MousePointer2 size={14} />
              {pickingOrigin ? "Đang chờ click bản vẽ..." : "Pick tọa độ trực tiếp"}
            </Button>

            {/* CÁC ĐIỂM CỰC (QUICK PRESETS) */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Các vị trí đặc biệt:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-[10px] h-8 bg-slate-50" onClick={() => updateOrigin(diameter/2, 0)}>Cực Phải (3h)</Button>
                <Button variant="outline" className="text-[10px] h-8 bg-slate-50" onClick={() => updateOrigin(0, diameter/2)}>Cực Trên (12h)</Button>
                <Button variant="outline" className="text-[10px] h-8 bg-slate-50" onClick={() => updateOrigin(-diameter/2, 0)}>Cực Trái (9h)</Button>
                <Button variant="outline" className="text-[10px] h-8 bg-slate-50" onClick={() => updateOrigin(0, -diameter/2)}>Cực Dưới (6h)</Button>
              </div>
            </div>
          </div>
        )}

        {/* CHÚ THÍCH */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg flex gap-3 border border-blue-100 shadow-inner">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-blue-800 leading-normal font-medium">
            <p className="font-bold mb-1">Hướng dẫn nhanh:</p>
            Chọn số lỗ (1-{numberOfHoles}) ở trên để dời hệ trục tọa độ về tâm lỗ đó. Toàn bộ bảng số liệu sẽ tự động tính lại với lỗ đó là gốc <strong>(0,0)</strong>.
          </div>
        </div>
      </div>
    </Card>
  );
}