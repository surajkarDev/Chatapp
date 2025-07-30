'use client';
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type
type Theme = "light" | "dark";

// Create context
const ThemeContext = createContext<Theme>("light");

// Export hook to consume
export function useTheme() {
  return useContext(ThemeContext);
}

// Export ThemeProvider to wrap app
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
