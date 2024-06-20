// ui/ButtonGroup/ButtonGroup.tsx
import React from "react";

interface ButtonGroupProps {
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};
