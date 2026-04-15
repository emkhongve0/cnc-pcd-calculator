import { Card } from '../../components/ui/Card'; // Sửa lại đường dẫn cho đúng cấu trúc thư mục
import { CheckCircle2, XCircle } from 'lucide-react';

export function CoordinateExample() {
  return (
    <Card className="p-4 bg-white border-l-4 border-l-blue-500">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <span className="text-blue-600">ℹ️</span>
        Ví dụ: Vòng 4 lỗ (Đường kính 40mm)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Bên trái: Gốc tại Tâm */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Gốc tọa độ tại Tâm (0,0)
          </p>
          <div className="bg-gray-50 rounded p-2 space-y-1 font-mono">
            <div>Lỗ 1: (20, 0)</div>
            <div>Lỗ 2: (0, 20)</div>
            <div>Lỗ 3: (-20, 0)</div>
            <div>Lỗ 4: (0, -20)</div>
          </div>
        </div>

        {/* Bên phải: Gốc tại Lỗ 1 */}
        <div className="space-y-2">
          <p className="font-medium text-gray-700 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Gốc tọa độ tại Lỗ 1 (Tuyệt đối)
          </p>
          <div className="bg-gray-50 rounded p-2 space-y-1 font-mono">
            <div className="text-green-700 font-semibold">Lỗ 1: (0, 0) ✓</div>
            <div>Lỗ 2: (-20, 20)</div>
            <div>Lỗ 3: (-40, 0)</div>
            <div>Lỗ 4: (-20, -20)</div>
          </div>
        </div>
      </div>

      {/* Các lưu ý quan trọng */}
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>Hình học không đổi:</strong> Các lỗ vẫn giữ nguyên vị trí vật lý.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>Giá trị sạch:</strong> Tránh các sai số lẻ như 19.999.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <XCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>Không hợp lệ:</strong> Không thể chọn các điểm bắt dính tùy tiện.
          </p>
        </div>
      </div>
    </Card>
  );
}