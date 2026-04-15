import React, { createContext, useContext } from 'react';

// Tạo "đường truyền dữ liệu" (Context)
const RadioGroupContext = createContext<{
  value: string;
  onValueChange: (val: string) => void;
} | null>(null);

interface RadioGroupProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, children, className }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`grid gap-2 ${className}`}>{children}</div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, id }) => {
  const context = useContext(RadioGroupContext);
  if (!context) return null;

  const isChecked = context.value === value;

  return (
    <div 
      onClick={() => context.onValueChange(value)}
      className={`h-4 w-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${
        isChecked ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'
      }`}
    >
      {isChecked && <div className="h-2 w-2 rounded-full bg-blue-600 animate-in zoom-in-50" />}
      <input
        type="radio"
        id={id}
        className="sr-only" // Ẩn input mặc định nhưng vẫn giữ id cho Label
        checked={isChecked}
        readOnly
      />
    </div>
  );
};