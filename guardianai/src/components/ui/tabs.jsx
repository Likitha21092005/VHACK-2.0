import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ value, onValueChange, children, defaultValue }) {
  const [internalValue, setInternalValue] = useState(defaultValue || value || "");
  const activeValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (value === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeValue, onValueChange: handleValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, className }) {
  const { activeValue, onValueChange } = useContext(TabsContext);
  return (
    <button 
      onClick={() => onValueChange(value)}
      data-state={activeValue === value ? "active" : "inactive"}
      className={className}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeValue } = useContext(TabsContext);
  return activeValue === value ? <div className={className}>{children}</div> : null;
}