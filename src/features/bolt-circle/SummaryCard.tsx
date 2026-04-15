
import { Card } from '../../components/ui/Card';
import { Circle, Hash, RotateCw, Target } from 'lucide-react';
import type { Origin } from '../../App'; // Đảm bảo import đúng từ App.tsx

type SummaryCardProps = {
  diameter: number;
  numberOfHoles: number;
  startAngle: number;
  originMode: 'center' | 'custom';
  customOrigin: Origin;
};

export function SummaryCard({
  diameter,
  numberOfHoles,
  startAngle,
  originMode,
  customOrigin,
}: SummaryCardProps) {
  // Tính toán các giá trị kỹ thuật nhanh
  const radius = diameter / 2;
  const angleStep = 360 / numberOfHoles;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
        Tổng quan cấu hình
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Đường kính & Bán kính */}
        <div className="flex items-start gap-2">
          <Circle className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-medium">Đường kính</p>
            <p className="text-sm font-bold text-gray-900">{diameter} mm</p>
            <p className="text-[10px] text-blue-600 font-mono italic">R: {radius} mm</p>
          </div>
        </div>

        {/* Số lỗ & Bước góc */}
        <div className="flex items-start gap-2">
          <Hash className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-medium">Số lượng lỗ</p>
            <p className="text-sm font-bold text-gray-900">{numberOfHoles}</p>
            <p className="text-[10px] text-blue-600 font-mono italic">Bước: {angleStep.toFixed(2)}°</p>
          </div>
        </div>

        {/* Góc bắt đầu */}
        <div className="flex items-start gap-2">
          <RotateCw className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-medium">Góc khởi đầu</p>
            <p className="text-sm font-bold text-gray-900">{startAngle}°</p>
            <p className="text-[10px] text-gray-500 italic">Vị trí lỗ số 1</p>
          </div>
        </div>

        {/* Gốc tọa độ */}
        <div className="flex items-start gap-2">
          <Target className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase text-gray-500 font-medium">Gốc tọa độ</p>
            <p className="text-sm font-bold text-gray-900">
              {originMode === 'center' ? 'Tại Tâm' : 'Tùy chỉnh'}
            </p>
            {originMode === 'custom' && (
              <p className="text-[10px] font-mono text-blue-600">
                X:{customOrigin.x.toFixed(2)}, Y:{customOrigin.y.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}