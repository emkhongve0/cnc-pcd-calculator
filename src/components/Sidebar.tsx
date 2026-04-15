import { Link, useLocation } from "react-router-dom";
import {
  Circle,
  Divide,
  Gauge,
  Zap,
  Wrench,
  Calculator,
  Settings,
  Menu,
  X,
  ArrowLeftRight
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Toán học & Hình học",
    items: [
      { label: "Chia lỗ PCD", icon: Circle, path: "/" },
      { label: "Chia cung tròn", icon: Divide, path: "/arc-division" },
      { label: "Đổi đơn vị Inch/Metric", icon: ArrowLeftRight, path: "/converter" },
    ],
  },
  {
    title: "Chế độ cắt (CNC)",
    items: [
      { label: "Tốc độ cắt (Vc)", icon: Gauge, path: "/cutting-speed" },
      { label: "Bước tiến (Feed)", icon: Zap, path: "/feed-rate" },
    ],
  },
  {
    title: "Dữ liệu dao cụ",
    items: [
      { label: "Chọn dao & Mảnh chip", icon: Wrench, path: "/tool-selection" },
      { label: "Tra bảng khoan mồi", icon: Settings, path: "/tap-drill-chart" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* NÚT MENU CHO MOBILE - Tăng z-index lên 60 để luôn nằm trên cùng */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-blue-600 text-white rounded-md shadow-lg active:scale-95 transition-transform"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* LỚP PHỦ (OVERLAY) - Làm tối nền phía sau */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* THANH SIDEBAR CHÍNH */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[50]
        w-64 
        /* FIX CHÍNH: Ép màu nền đặc bg-white và dark:bg-slate-950 để không bị xuyên thấu */
        bg-white dark:bg-slate-950 
        border-r border-slate-200 dark:border-slate-800 
        flex flex-col transition-transform duration-300 ease-in-out
        /* Thêm bóng đổ mạnh trên mobile để tách biệt khối */
        shadow-[5px_0_25px_rgba(0,0,0,0.1)] lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Header - Giữ nguyên logic của bạn */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Calculator className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              CNC Master
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              Thịnh IT and machine
            </p>
          </div>
        </div>

        {/* Navigation - Đảm bảo màu chữ rõ ràng */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-slate-950">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 opacity-70">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <ThemeToggle />
          <div className="px-2">
             <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                <span>Trạng thái:</span>
                <span className="flex items-center gap-1 text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Sẵn sàng
                </span>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}