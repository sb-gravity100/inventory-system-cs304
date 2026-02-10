import { Stack } from "expo-router";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
   return (
      <PaperProvider>
         <ThemeProvider>
            <AuthProvider>
               <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
               </Stack>
            </AuthProvider>
         </ThemeProvider>
      </PaperProvider>
   );
}
