import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "./theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const systemScheme = useColorScheme(); // 'light' or 'dark'
   const [overrideScheme, setOverrideScheme] = useState(null);

   const theme = useMemo(() => {
      const scheme = overrideScheme || systemScheme;
      return scheme === "dark" ? DarkTheme : LightTheme;
   }, [systemScheme, overrideScheme]);

   return (
      <ThemeContext.Provider value={{ theme, setOverrideScheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);
