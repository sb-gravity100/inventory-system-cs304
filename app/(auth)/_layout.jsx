import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../components/ThemeProvider";

export default function AuthLayout() {
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

   // If user is authenticated, redirect to tabs
   if (user) {
      return <Redirect href="/(tabs)" />;
   }

   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="login" />
      </Stack>
   );
}

const styles = StyleSheet.create({
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});
