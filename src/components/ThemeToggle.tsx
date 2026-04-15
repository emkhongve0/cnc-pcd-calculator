import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Logic chuyển đổi Dark Mode đơn giản
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium transition-all text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]"
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Chế độ sáng</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-blue-500" />
          <span>Chế độ tối</span>
        </>
      )}
    </button>
  );
}