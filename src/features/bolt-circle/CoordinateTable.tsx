// src/features/bolt-circle/CoordinateTable.tsx

import { Card } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Copy, Download } from 'lucide-react';
import type { Hole, Origin } from '../../App';

type CoordinateTableProps = {
  holes: Hole[];
  originMode: 'center' | 'custom';
  customOrigin: Origin;
};

export function CoordinateTable({ holes, originMode, customOrigin }: CoordinateTableProps) {
  
  const formatNumber = (num: number): string => {
    if (Math.abs(num - Math.round(num)) < 0.001) {
      return Math.round(num).toString();
    }
    return parseFloat(num.toFixed(3)).toString();
  };

  const calculateDistance = (rx: number, ry: number): number => {
    return Math.sqrt(rx ** 2 + ry ** 2);
  };

  const copyToClipboard = () => {
    let text = 'Hole\tAngle\tX\tY\n';
    holes.forEach((h, i) => {
      text += `${i + 1}\t${h.angle.toFixed(1)}\t${formatNumber(h.relativeX)}\t${formatNumber(h.relativeY)}\n`;
    });
    navigator.clipboard.writeText(text);
    alert("Đã sao chép!");
  };

  const downloadCSV = () => {
    let csv = 'Hole,Angle,X,Y\n';
    holes.forEach((h, i) => {
      csv += `${i + 1},${h.angle.toFixed(2)},${h.relativeX},${h.relativeY}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pcd-coords.csv';
    a.click();
  };

  return (
    // p-3 cho mobile, p-6 cho desktop
    <Card className="p-3 sm:p-6 bg-white shadow-md border-none sm:border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Bảng tọa độ (G-Code)</h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
            Gốc: <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded">
              {originMode === 'center' ? 'Tâm (0,0)' : `X${formatNumber(customOrigin.x)}, Y${formatNumber(customOrigin.y)}`}
            </span>
          </p>
        </div>
        
        {/* Nút bấm dàn hàng ngang trên mobile bằng grid để tiết kiệm diện tích */}
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-xs h-9">
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Sao chép
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCSV} className="text-xs h-9">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Xuất CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {/* Giảm padding của các ô header trên mobile */}
              <TableHead className="px-2 py-2 text-[10px] sm:text-xs w-10">#</TableHead>
              <TableHead className="px-2 py-2 text-[10px] sm:text-xs">Góc</TableHead>
              <TableHead className="px-2 py-2 text-[10px] sm:text-xs text-blue-600">X (G54)</TableHead>
              <TableHead className="px-2 py-2 text-[10px] sm:text-xs text-blue-600">Y (G54)</TableHead>
              {/* Ẩn cột khoảng cách trên màn hình cực nhỏ nếu cần, hoặc giữ lại với text nhỏ */}
              <TableHead className="px-2 py-2 text-[10px] sm:text-xs hidden xs:table-cell text-right">Cự ly</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holes.map((hole, index) => {
              const isOrigin = Math.abs(hole.relativeX) < 0.001 && Math.abs(hole.relativeY) < 0.001;
              return (
                <TableRow key={index} className={isOrigin ? "bg-blue-50/50" : ""}>
                  <TableCell className="px-2 py-2.5 font-bold text-xs">{index + 1}</TableCell>
                  <TableCell className="px-2 py-2.5 text-xs text-gray-600">{hole.angle.toFixed(1)}°</TableCell>
                  <TableCell className={`px-2 py-2.5 font-mono text-xs ${isOrigin ? 'text-blue-700 font-bold' : 'text-blue-600'}`}>
                    {formatNumber(hole.relativeX)}
                  </TableCell>
                  <TableCell className={`px-2 py-2.5 font-mono text-xs ${isOrigin ? 'text-blue-700 font-bold' : 'text-blue-600'}`}>
                    {formatNumber(hole.relativeY)}
                  </TableCell>
                  <TableCell className="px-2 py-2.5 text-[10px] text-gray-400 text-right hidden xs:table-cell">
                    {formatNumber(calculateDistance(hole.relativeX, hole.relativeY))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 p-2 bg-slate-50 rounded border border-dashed border-slate-200">
        <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed">
          * Dữ liệu trên dùng để nhập trực tiếp vào máy CNC. 
          {originMode === 'custom' && " Tọa độ X0 Y0 đã được dời về điểm bạn chọn."}
        </p>
      </div>
    </Card>
  );
}