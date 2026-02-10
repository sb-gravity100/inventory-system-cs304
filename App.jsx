import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
   return (
      <ThemeProvider>
         <View>
            <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" />
         </View>
      </ThemeProvider>
   );
}
