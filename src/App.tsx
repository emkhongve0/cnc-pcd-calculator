import { Routes, Route } from "react-router-dom";
import BoltCircleCalc from './features/bolt-circle/BoltCircleCalc';
import { Sidebar } from './components/Sidebar'; // Nhớ import Sidebar
import './index.css';

// --- CÁC INTERFACE DÙNG CHUNG ---
export interface Origin {
  x: number;
  y: number;
}

export interface Hole {
  angle: number;
  x: number;
  y: number;
  relativeX: number;
  relativeY: number;
}

export interface SnapPoint {
  x: number;
  y: number;
  label: string;
  type: 'hole' | 'cardinal' | 'center';
}

function App() {
  return (
    // Bố cục Flex: Sidebar nằm ngang với Nội dung chính
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
      
      {/* 1. THANH SIDEBAR (Cố định bên trái trên PC, ẩn trên Mobile) */}
      <Sidebar />

      {/* 2. NỘI DUNG CHÍNH (Bên phải) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Khu vực hiển thị nội dung của từng chức năng */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {/* Trang chủ mặc định là máy tính PCD */}
            <Route path="/" element={<BoltCircleCalc />} />
            
            {/* Sau này bạn thêm các chức năng khác ở đây */}
            <Route path="/cutting-speed" element={<div className="p-8">Chức năng tính tốc độ cắt đang phát triển...</div>} />
            <Route path="/feed-rate" element={<div className="p-8">Chức năng tính bước tiến đang phát triển...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;