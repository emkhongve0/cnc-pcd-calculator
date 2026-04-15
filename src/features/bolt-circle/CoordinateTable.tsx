
// Import các component UI dùng chung
import { Card } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Copy, Download } from 'lucide-react';

// 1. Định nghĩa Kiểu dữ liệu (Interface)
export interface Hole {
  angle: number;
  x: number;          // Tọa độ tuyệt đối (để vẽ)
  y: number;          // Tọa độ tuyệt đối (để vẽ)
  relativeX: number; // Tọa độ tương đối (cho G-code)
  relativeY: number; // Tọa độ tương đối (cho G-code)
}

export interface Origin {
  x: number;
  y: number;
}

type CoordinateTableProps = {
  holes: Hole[];
  originMode: 'center' | 'custom';
  customOrigin: Origin;
};

// 2. Định nghĩa Component chính
export function CoordinateTable({ holes, originMode, customOrigin }: CoordinateTableProps) {
  
  // Hàm định dạng số để hiển thị đẹp (ví dụ: 20.000 -> 20)
  const formatNumber = (num: number): string => {
    if (Math.abs(num - Math.round(num)) < 0.001) {
      return Math.round(num).toString();
    }
    return parseFloat(num.toFixed(3)).toString();
  };

  // Tính khoảng cách từ lỗ đến gốc tọa độ hiện tại
  const calculateDistance = (rx: number, ry: number): number => {
    return Math.sqrt(rx ** 2 + ry ** 2);
  };

  // Hàm Copy dữ liệu để dán vào Excel hoặc Notepad
  const copyToClipboard = () => {
    let text = 'Hole\tAngle (°)\tX (mm)\tY (mm)\tDist (mm)\n';
    holes.forEach((h, i) => {
      const dist = calculateDistance(h.relativeX, h.relativeY);
      text += `${i + 1}\t${h.angle.toFixed(1)}\t${formatNumber(h.relativeX)}\t${formatNumber(h.relativeY)}\t${formatNumber(dist)}\n`;
    });
    navigator.clipboard.writeText(text);
    alert("Đã sao chép bảng tọa độ!");
  };

  // Hàm tải file CSV
  const downloadCSV = () => {
    let csv = 'Hole,Angle,X,Y,Distance\n';
    holes.forEach((h, i) => {
      const dist = calculateDistance(h.relativeX, h.relativeY);
      csv += `${i + 1},${h.angle.toFixed(2)},${h.relativeX},${h.relativeY},${dist}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toa-do-pcd.csv';
    a.click();
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Bảng tọa độ xuất (G-Code)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Gốc tọa độ hiện tại: <span className="font-mono font-bold text-blue-600">
              {originMode === 'center' ? 'Tâm (0,0)' : `X${formatNumber(customOrigin.x)}, Y${formatNumber(customOrigin.y)}`}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" /> Sao chép
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" /> Xuất CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Lỗ #</TableHead>
              <TableHead>Góc (°)</TableHead>
              <TableHead>Tọa độ X</TableHead>
              <TableHead>Tọa độ Y</TableHead>
              <TableHead>Khoảng cách</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holes.map((hole, index) => (
              <TableRow key={index}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>{hole.angle.toFixed(1)}°</TableCell>
                <TableCell className="font-mono text-blue-700">{formatNumber(hole.relativeX)}</TableCell>
                <TableCell className="font-mono text-blue-700">{formatNumber(hole.relativeY)}</TableCell>
                <TableCell className="text-gray-400">
                  {formatNumber(calculateDistance(hole.relativeX, hole.relativeY))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded border border-dashed border-gray-200">
        <p className="text-[10px] text-gray-500 italic">
          * Lưu ý: Tọa độ X, Y phía trên đã được tính toán dựa trên Gốc tọa độ bạn chọn. Bạn có thể nhập trực tiếp các giá trị này vào lệnh G01/G81 trên máy CNC.
        </p>
      </div>
    </Card>
  );
}