import BoltCircleCalc from './features/bolt-circle/BoltCircleCalc';
import './index.css'; // Đảm bảo bạn có Tailwind CSS

// Khai báo các Interface dùng chung cho toàn bộ ứng dụng
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
    <div className="min-h-screen bg-gray-100">
      <BoltCircleCalc />
    </div>
  );
}

export default App;