// ui/Button/Button.tsx
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, loading }) => {
  return (
    <button className={`px-4 py-2 rounded bg-blue-500 text-black hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 ${loading ? "cursor-wait" : ""}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? "Loading..." : children}
    </button>
  );
};
