import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { PaperProvider } from "react-native-paper";

function AppContent() {
   const { user, isLoading } = useAuth();
   const { theme } = useTheme();

   if (isLoading) {
      return (
         <View
            style={[
               styles.loadingContainer,
               { backgroundColor: theme.background },
            ]}
         >
            <ActivityIndicator size="large" color={theme.primary} />
         </View>
      );
   }

   return (
      <>
         {user ? <HomeScreen /> : <LoginScreen />}
         <StatusBar style="auto" />
      </>
   );
}

export default function App() {
   return (
      <PaperProvider>
         <ThemeProvider>
            <AuthProvider>
               <AppContent />
            </AuthProvider>
         </ThemeProvider>
      </PaperProvider>
   );
}

const styles = StyleSheet.create({
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});