"use client"
import React from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ value, onChange, children, className }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`border rounded p-2 ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;