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

  const updateOrigin = (x: number, y: number) => {
    const roundedX = Math.round(x * 1000) / 1000;
    const roundedY = Math.round(y * 1000) / 1000;
    setCustomOrigin({ x: roundedX, y: roundedY });
    setOriginMode('custom');
  };

  return (
    // Tối ưu Padding: p-4 cho mobile và p-6 cho desktop
    <Card className="p-4 sm:p-6 bg-white shadow-sm border border-gray-100 border-t-4 border-t-blue-600">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Target className="w-5 h-5 text-blue-600" />
        <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-tight">Thiết lập</h2>
      </div>

      {/* 1. THÔNG SỐ HÌNH HỌC */}
      <div className="space-y-4 sm:space-y-5">
        <div className="grid gap-1.5">
          <Label htmlFor="diameter" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">
            Đường kính PCD (mm)
          </Label>
          <Input
            id="diameter"
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="h-11 sm:h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base" // text-base ngăn iOS zoom input
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="holes" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Số lỗ</Label>
            <Input
              id="holes"
              type="number"
              value={numberOfHoles}
              onChange={(e) => setNumberOfHoles(Number(e.target.value))}
              className="h-11 sm:h-10 text-base"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="startAngle" className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Góc bắt đầu</Label>
            <Input
              id="startAngle"
              type="number"
              value={startAngle}
              onChange={(e) => setStartAngle(Number(e.target.value))}
              className="h-11 sm:h-10 text-base"
            />
          </div>
        </div>
      </div>

      {/* 2. HỆ TỌA ĐỘ & GỐC PHÔI (G54) */}
      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Gốc tọa độ (Origin)</h3>

        <RadioGroup 
          value={originMode} 
          onValueChange={(val: string) => setOriginMode(val as 'center' | 'custom')}
          className="space-y-1.5"
        >
          <div className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-gray-50 transition-colors border border-transparent active:border-blue-100">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center" className="flex-1 cursor-pointer text-sm text-gray-700 font-medium">
              Tâm vòng tròn (0,0)
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-gray-50 transition-colors border border-transparent active:border-blue-100">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex-1 cursor-pointer text-sm text-gray-700 font-medium">
              Gốc tùy chỉnh (G54)
            </Label>
          </div>
        </RadioGroup>

        {originMode === 'custom' && (
          <div className="mt-4 pl-3 sm:pl-6 border-l-2 border-blue-500 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
            
            {/* CHỌN LỖ LÀM GỐC 0,0 - Tối ưu lưới nút bấm cho ngón tay */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Chọn tâm lỗ số:
              </Label>
              {/* Mobile: 5 cột để nút không quá nhỏ, Tablet/Desktop: 4-6 cột */}
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                {holes.map((hole, idx) => {
                  const isActive = 
                    Math.abs(customOrigin.x - hole.x) < 0.01 && 
                    Math.abs(customOrigin.y - hole.y) < 0.01;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateOrigin(hole.x, hole.y)}
                      className={`h-11 sm:h-9 rounded-md text-xs font-bold transition-all border flex items-center justify-center touch-manipulation ${
                        isActive 
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-100' 
                        : 'bg-white text-gray-600 border-gray-200 active:bg-blue-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NHẬP TỌA ĐỘ TAY */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-1.5">
                <Label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Tọa độ X</Label>
                <Input 
                  type="number" 
                  value={customOrigin.x} 
                  onChange={(e) => updateOrigin(Number(e.target.value), customOrigin.y)}
                  className="h-10 sm:h-9 font-mono bg-slate-50 text-blue-700 font-bold text-sm" 
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Tọa độ Y</Label>
                <Input 
                  type="number" 
                  value={customOrigin.y} 
                  onChange={(e) => updateOrigin(customOrigin.x, Number(e.target.value))}
                  className="h-10 sm:h-9 font-mono bg-slate-50 text-blue-700 font-bold text-sm" 
                />
              </div>
            </div>

            {/* PICK TRÊN BẢN VẼ */}
            <Button 
              variant={pickingOrigin ? 'primary' : 'outline'} 
              className={`w-full text-xs gap-2 h-11 sm:h-10 font-bold uppercase tracking-wide ${pickingOrigin ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setPickingOrigin(!pickingOrigin)}
            >
              <MousePointer2 size={16} />
              {pickingOrigin ? "Đang chờ chọn..." : "Pick trên bản vẽ"}
            </Button>

            {/* CÁC ĐIỂM CỰC (QUICK PRESETS) */}
            <div className="grid gap-2">
              <Label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Vị trí đặc biệt:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-[9px] sm:text-[10px] h-9 sm:h-8 bg-slate-50 font-medium" onClick={() => updateOrigin(diameter/2, 0)}>3h (Phải)</Button>
                <Button variant="outline" className="text-[9px] sm:text-[10px] h-9 sm:h-8 bg-slate-50 font-medium" onClick={() => updateOrigin(0, diameter/2)}>12h (Trên)</Button>
                <Button variant="outline" className="text-[9px] sm:text-[10px] h-9 sm:h-8 bg-slate-50 font-medium" onClick={() => updateOrigin(-diameter/2, 0)}>9h (Trái)</Button>
                <Button variant="outline" className="text-[9px] sm:text-[10px] h-9 sm:h-8 bg-slate-50 font-medium" onClick={() => updateOrigin(0, -diameter/2)}>6h (Dưới)</Button>
              </div>
            </div>
          </div>
        )}

        {/* CHÚ THÍCH - Thu nhỏ font trên mobile */}
        <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg flex gap-2 sm:gap-3 border border-blue-100 shadow-inner">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-[10px] sm:text-[11px] text-blue-800 leading-snug font-medium">
            <span className="font-bold">Mẹo:</span> Chọn số lỗ (1-{numberOfHoles}) để dời hệ trục về tâm lỗ đó. Tọa độ sẽ tự động tính lại về <strong>X0 Y0</strong>.
          </div>
        </div>
      </div>
    </Card>
  );
}