import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   Alert,
   Modal,
   TextInput,
   Animated, // Add this
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { router } from "expo-router";

const api_url =
   process.env.NODE_ENV === "development"
      ? "http://192.168.254.102:3000"
      : process.env.EXPO_PUBLIC_API_URL;

export default function InventoryScreen() {
   const { theme } = useTheme();
   const { authState, user } = useAuth();
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [fabOpen, setFabOpen] = useState(false);
   const fabAnimation = useState(new Animated.Value(0))[0]; // Add this

   useEffect(() => {
      fetchProducts();
   }, []);

   const fetchProducts = async () => {
      try {
         const response = await axios.get(`${api_url}/products`, {
            headers: { Authorization: `Bearer ${authState.token}` },
         });
         setProducts(response.data);
         console.log(response.data);
      } catch (error) {
         console.log("Error fetching products:", error);
         // Alert.alert("Error", "Failed to fetch products");
      } finally {
         setLoading(false);
      }
   };

   const getActions = () => {
      const role = user?.role?.toLowerCase();
      const actions = [];

      // Staff actions
      actions.push(
         {
            label: "Create Transaction",
            icon: "add-shopping-cart",
            onPress: () => {
               setFabOpen(false);
               router.push("/transaction");
            },
         },
         {
            label: "Update Stocks",
            icon: "inventory",
            onPress: () => {
               setFabOpen(false);
               Alert.alert("Coming Soon", "Stock update feature");
            },
         },
      );

      // Manager actions (inherit staff)
      if (role === "manager" || role === "admin") {
         actions.push({
            label: "Add Product",
            icon: "add-box",
            onPress: () => {
               setFabOpen(false);
               Alert.alert("Coming Soon", "Add product feature");
            },
         });
      }

      return actions;
   };

   const toggleFab = () => {
      const toValue = fabOpen ? 0 : 1;
      Animated.spring(fabAnimation, {
         toValue,
         friction: 5,
         useNativeDriver: true,
      }).start();
      setFabOpen(!fabOpen);
   };

   const styles = StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: theme.background,
      },
      header: {
         paddingTop: 10,
         paddingHorizontal: 20,
         paddingBottom: 20,
         backgroundColor: theme.primary,
      },
      headerTitle: {
         fontSize: 24,
         fontWeight: "bold",
         color: "#FFFFFF",
         marginBottom: 4,
      },
      headerSubtitle: {
         fontSize: 14,
         color: "#FFFFFF",
         opacity: 0.9,
      },
      productList: {
         padding: 20,
      },
      productCard: {
         backgroundColor: "#FFFFFF",
         borderRadius: 12,
         padding: 16,
         marginBottom: 12,
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 4,
         elevation: 3,
      },
      productCardDark: {
         backgroundColor: "#3A3A3A",
      },
      productName: {
         fontSize: 18,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 8,
      },
      productDetails: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
      },
      productPrice: {
         fontSize: 16,
         color: theme.success,
         fontWeight: "600",
      },
      productStock: {
         fontSize: 14,
         color: theme.textSecondary,
      },
      emptyState: {
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         paddingVertical: 60,
      },
      emptyText: {
         fontSize: 16,
         color: theme.textSecondary,
         textAlign: "center",
      },
      fab: {
         position: "absolute",
         bottom: 20,
         right: 20,
         backgroundColor: theme.primary,
         width: 56,
         height: 56,
         borderRadius: 28,
         alignItems: "center",
         justifyContent: "center",
         elevation: 6,
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: 0.3,
         shadowRadius: 4,
      },
      fabActions: {
         position: "absolute",
         bottom: 90,
         right: 20,
         gap: 12,
      },
      fabAction: {
         flexDirection: "row",
         alignItems: "center",
         justifyContent: "flex-end",
         gap: 12,
      },
      fabActionButton: {
         backgroundColor: theme.secondary,
         width: 48,
         height: 48,
         borderRadius: 24,
         alignItems: "center",
         justifyContent: "center",
         elevation: 4,
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.2,
         shadowRadius: 2,
      },
      fabActionLabel: {
         backgroundColor: theme.secondary,
         paddingHorizontal: 12,
         paddingVertical: 6,
         borderRadius: 4,
         elevation: 2,
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 1 },
         shadowOpacity: 0.2,
         shadowRadius: 1,
      },
      fabActionLabelDark: {
         backgroundColor: "#3A3A3A",
      },
      fabActionText: {
         fontSize: 14,
         color: theme.textPrimary,
         fontWeight: "600",
      },
   });

   if (loading) {
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.emptyState}>
               <Text style={styles.emptyText}>Loading products...</Text>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>📦 Inventory</Text>
            <Text style={styles.headerSubtitle}>
               {products.length} products in stock
            </Text>
         </View>

         <ScrollView style={styles.productList}>
            {products.length > 0 ? (
               products.map((product) => (
                  <View
                     key={product._id}
                     style={[
                        styles.productCard,
                        theme.background === "#2E2E2E" &&
                           styles.productCardDark,
                     ]}
                  >
                     <Text style={styles.productName}>{product.name}</Text>
                     <View style={styles.productDetails}>
                        <Text style={styles.productPrice}>
                           ₱{product.price.toFixed(2)}
                        </Text>
                        <Text style={styles.productStock}>
                           Stock: {product.stocks}
                        </Text>
                     </View>
                  </View>
               ))
            ) : (
               <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                     No products found.{"\n"}Add your first product to get
                     started.
                  </Text>
               </View>
            )}
         </ScrollView>

         {/* FAB Actions */}
         {fabOpen && (
            <View style={styles.fabActions}>
               {getActions().map((action, index) => {
                  const translateY = fabAnimation.interpolate({
                     inputRange: [0, 1],
                     outputRange: [50, 0],
                  });
                  const opacity = fabAnimation.interpolate({
                     inputRange: [0, 1],
                     outputRange: [0, 1],
                  });

                  return (
                     <Animated.View
                        key={index}
                        style={[
                           styles.fabAction,
                           {
                              transform: [{ translateY }],
                              opacity,
                           },
                        ]}
                     >
                        <View style={[styles.fabActionLabel]}>
                           <Text style={styles.fabActionText}>
                              {action.label}
                           </Text>
                        </View>
                        <TouchableOpacity
                           style={styles.fabActionButton}
                           onPress={action.onPress}
                        >
                           <MaterialIcons
                              name={action.icon}
                              style={{
                                 color: theme.textPrimary,
                              }}
                              size={24}
                           />
                        </TouchableOpacity>
                     </Animated.View>
                  );
               })}
            </View>
         )}

         {/* FAB */}
         <TouchableOpacity style={styles.fab} onPress={toggleFab}>
            <Animated.View
               style={{
                  transform: [
                     {
                        rotate: fabAnimation.interpolate({
                           inputRange: [0, 1],
                           outputRange: ["0deg", "45deg"],
                        }),
                     },
                  ],
               }}
            >
               <MaterialIcons name="add" size={24} color="#FFFFFF" />
            </Animated.View>
         </TouchableOpacity>
      </SafeAreaView>
   );
}
