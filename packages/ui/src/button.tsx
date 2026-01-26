"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;

  appName: string;
}

export const Button = ({ children , appName }: ButtonProps) => {
  return (
    <button
      className='bg-yellow-500 text-9xl '
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
