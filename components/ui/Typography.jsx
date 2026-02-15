import { Text, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";

export function Title({ children, style, ...props }) {
   const { theme } = useTheme();
   return (
      <Text style={[{ fontSize: 24, fontWeight: "bold", color: theme.textPrimary }, style]} {...props}>
         {children}
      </Text>
   );
}

export function Subtitle({ children, style, ...props }) {
   const { theme } = useTheme();
   return (
      <Text style={[{ fontSize: 18, fontWeight: "600", color: theme.textPrimary }, style]} {...props}>
         {children}
      </Text>
   );
}

export function Body({ children, style, ...props }) {
   const { theme } = useTheme();
   return (
      <Text style={[{ fontSize: 16, color: theme.textPrimary }, style]} {...props}>
         {children}
      </Text>
   );
}

export function Caption({ children, style, ...props }) {
   const { theme } = useTheme();
   return (
      <Text style={[{ fontSize: 14, color: theme.textSecondary }, style]} {...props}>
         {children}
      </Text>
   );
}

export function Label({ children, style, ...props }) {
   const { theme } = useTheme();
   return (
      <Text style={[{ fontSize: 14, fontWeight: "600", color: theme.textPrimary }, style]} {...props}>
         {children}
      </Text>
   );
}