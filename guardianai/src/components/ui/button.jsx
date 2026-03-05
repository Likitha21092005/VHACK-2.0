import React from "react";

export function Button({ 
  children, 
  className = "", 
  size = "md",
  variant = "default",
  ...props 
}) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "bg-cyan-500 hover:bg-cyan-600 text-white",
    outline: "border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800",
  };

  const baseClasses = "rounded-md font-medium transition-colors";
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}