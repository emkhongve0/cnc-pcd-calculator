
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Target, Ruler } from 'lucide-react';
import type { SnapPoint } from '../../App'; // Điều chỉnh đường dẫn tùy nơi bạn để Interface

type PrecisionPanelProps = {
  snapPoints: SnapPoint[];
  originMode: 'center' | 'custom';
};

export function PrecisionPanel({ snapPoints }: PrecisionPanelProps) {
  // Đếm số lượng các điểm bắt dính theo loại
  const holeCount = snapPoints.filter((p) => p.type === 'hole').length;
  const cardinalCount = snapPoints.filter((p) => p.type === 'cardinal').length;
  const centerCount = snapPoints.filter((p) => p.type === 'center').length;

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h3 className="text-sm font-semibold text-gray-900">Chế độ Chính xác Đang bật</h3>
      </div>

      <div className="space-y-2 text-xs text-gray-700">
        <div className="flex items-start gap-2">
          <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Chỉ bắt dính điểm chuẩn</p>
            <p className="text-gray-600">
              Không cho phép tọa độ tự do. Hệ thống tự động nhảy về điểm hợp lệ gần nhất.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Ruler className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Tọa độ Sạch (Clean)</p>
            <p className="text-gray-600">
              Mọi giá trị được tính toán toán học chính xác, không có sai số trôi.
            </p>
          </div>
        </div>

        {/* Thống kê các điểm bắt dính */}
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="font-medium text-green-900 mb-1">Các điểm bắt dính khả dụng:</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-white/50 rounded px-2 py-1 flex flex-col items-center border border-green-100">
              <span className="font-bold text-blue-700 text-sm">{holeCount}</span>
              <span className="text-gray-500 uppercase">Lỗ</span>
            </div>
            <div className="bg-white/50 rounded px-2 py-1 flex flex-col items-center border border-green-100">
              <span className="font-bold text-slate-700 text-sm">{cardinalCount}</span>
              <span className="text-gray-500 uppercase">Cực</span>
            </div>
            <div className="bg-white/50 rounded px-2 py-1 flex flex-col items-center border border-green-100">
              <span className="font-bold text-slate-700 text-sm">{centerCount}</span>
              <span className="text-gray-500 uppercase">Tâm</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}