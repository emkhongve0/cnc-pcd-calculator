import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Thêm dấu hỏi (?) vì không bắt buộc lúc nào cũng phải có class
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  // Sử dụng Template Literal để cộng dồn class mặc định và class tùy chỉnh
  <div className={`bg-white rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);