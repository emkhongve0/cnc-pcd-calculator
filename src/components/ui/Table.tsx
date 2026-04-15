import React from 'react';

// Định nghĩa một interface dùng chung cho gọn
interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<BaseProps> = ({ children, className = "" }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader: React.FC<BaseProps> = ({ children, className = "" }) => (
  <thead className={`${className}`}>{children}</thead>
);

export const TableRow: React.FC<BaseProps> = ({ children, className = "" }) => (
  <tr className={`${className}`}>{children}</tr>
);

export const TableHead: React.FC<BaseProps> = ({ children, className = "" }) => (
  <th className={`font-semibold text-slate-900 ${className}`}>{children}</th>
);

export const TableBody: React.FC<BaseProps> = ({ children, className = "" }) => (
  <tbody className={`${className}`}>{children}</tbody>
);

export const TableCell: React.FC<BaseProps> = ({ children, className = "" }) => (
  <td className={`${className}`}>{children}</td>
);