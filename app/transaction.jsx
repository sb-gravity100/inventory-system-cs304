import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   Alert,
   TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../components/ThemeProvider";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";

const api_url =
   process.env.NODE_ENV === "development"
      ? "http://192.168.254.101:3000"
      : process.env.EXPO_PUBLIC_API_URL;

export default function TransactionScreen() {
   const { theme } = useTheme();
   const { authState } = useAuth();
   const [products, setProducts] = useState([]);
   const [selectedProducts, setSelectedProducts] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");

   useEffect(() => {
      fetchProducts();
   }, []);

   const fetchProducts = async () => {
      try {
         const response = await axios.get(`${api_url}/products`, {
            headers: { Authorization: `Bearer ${authState.token}` },
         });
         setProducts(response.data);
      } catch (error) {
         Alert.alert("Error", "Failed to fetch products");
      }
   };

   const addProduct = (product) => {
      const existing = selectedProducts.find(
         (p) => p.product._id === product._id,
      );
      if (existing) {
         setSelectedProducts(
            selectedProducts.map((p) =>
               p.product._id === product._id
                  ? { ...p, quantity: p.quantity + 1 }
                  : p,
            ),
         );
      } else {
         setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
      }
   };

   const updateQuantity = (productId, quantity) => {
      if (quantity <= 0) {
         setSelectedProducts(
            selectedProducts.filter((p) => p.product._id !== productId),
         );
      } else {
         setSelectedProducts(
            selectedProducts.map((p) =>
               p.product._id === productId ? { ...p, quantity } : p,
            ),
         );
      }
   };

   const createTransaction = async () => {
      if (selectedProducts.length === 0) {
         Alert.alert("Error", "Add at least one product");
         return;
      }

      try {
         const productsData = selectedProducts.map((p) => ({
            product: p.product._id,
            quantity: p.quantity,
         }));

         await axios.post(
            `${api_url}/sales/transaction`,
            { products: productsData },
            { headers: { Authorization: `Bearer ${authState.token}` } },
         );

         Alert.alert("Success", "Transaction created");
         setSelectedProducts([]);
      } catch (error) {
         Alert.alert(
            "Error",
            error.response?.data?.message || "Failed to create transaction",
         );
      }
   };

   const filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   const total = selectedProducts.reduce(
      (sum, p) => sum + p.product.price * p.quantity,
      0,
   );

   const styles = StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: theme.background,
      },
      header: {
         paddingTop: 10,
         paddingHorizontal: 20,
         paddingBottom: 10,
         backgroundColor: theme.primary,
      },
      headerTop: {
         flexDirection: "row",
         alignItems: "center",
         gap: 12,
      },
      backButton: {
         padding: 4,
      },
      headerTitle: {
         fontSize: 24,
         fontWeight: "bold",
         color: "#FFFFFF",
      },
      searchBar: {
         backgroundColor:
            theme.background === "#2E2E2E" ? "#3A3A3A" : "#F5F5F5",
         borderRadius: 8,
         paddingHorizontal: 16,
         paddingVertical: 12,
         margin: 20,
         fontSize: 16,
         color: theme.textPrimary,
      },
      content: {
         flex: 1,
      },
      section: {
         flex: 1,
      },
      sectionTitle: {
         fontSize: 18,
         fontWeight: "600",
         color: theme.textPrimary,
         paddingHorizontal: 20,
         marginBottom: 12,
      },
      productList: {
         paddingHorizontal: 20,
      },
      productCard: {
         backgroundColor: "#FFFFFF",
         borderRadius: 8,
         padding: 16,
         marginBottom: 12,
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
      },
      productCardDark: {
         backgroundColor: "#3A3A3A",
      },
      productInfo: {
         flex: 1,
      },
      productName: {
         fontSize: 16,
         fontWeight: "600",
         color: theme.textPrimary,
      },
      productPrice: {
         fontSize: 14,
         color: theme.textSecondary,
         marginTop: 4,
      },
      addButton: {
         backgroundColor: theme.success,
         paddingHorizontal: 16,
         paddingVertical: 8,
         borderRadius: 6,
      },
      addButtonText: {
         color: "#FFFFFF",
         fontWeight: "600",
      },
      selectedSection: {
         borderTopWidth: 1,
         borderTopColor: theme.border,
         paddingTop: 16,
      },
      selectedItem: {
         backgroundColor: "#FFFFFF",
         borderRadius: 8,
         padding: 16,
         marginBottom: 12,
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
      },
      selectedItemDark: {
         backgroundColor: "#3A3A3A",
      },
      quantityControl: {
         flexDirection: "row",
         alignItems: "center",
         gap: 12,
      },
      quantityButton: {
         backgroundColor: theme.accent,
         width: 32,
         height: 32,
         borderRadius: 16,
         alignItems: "center",
         justifyContent: "center",
      },
      quantityText: {
         fontSize: 16,
         fontWeight: "600",
         color: theme.textPrimary,
         minWidth: 30,
         textAlign: "center",
      },
      footer: {
         borderTopWidth: 1,
         borderTopColor: theme.border,
         padding: 20,
         backgroundColor: theme.background,
      },
      totalRow: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
         marginBottom: 16,
      },
      totalLabel: {
         fontSize: 18,
         fontWeight: "600",
         color: theme.textPrimary,
      },
      totalAmount: {
         fontSize: 24,
         fontWeight: "bold",
         color: theme.success,
      },
      createButton: {
         backgroundColor: theme.primary,
         paddingVertical: 16,
         borderRadius: 8,
         alignItems: "center",
      },
      createButtonText: {
         color: "#FFFFFF",
         fontSize: 16,
         fontWeight: "600",
      },
   });

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <View style={styles.headerTop}>
               <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
               >
                  <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>💰 New Transaction</Text>
            </View>
         </View>

         <TextInput
            style={styles.searchBar}
            placeholder="Search products..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
         />

         <View style={styles.content}>
            <ScrollView style={styles.section}>
               <Text style={styles.sectionTitle}>Available Products</Text>
               <View style={styles.productList}>
                  {filteredProducts.map((product) => (
                     <View
                        key={product._id}
                        style={[
                           styles.productCard,
                           theme.background === "#2E2E2E" &&
                              styles.productCardDark,
                        ]}
                     >
                        <View style={styles.productInfo}>
                           <Text style={styles.productName}>
                              {product.name}
                           </Text>
                           <Text style={styles.productPrice}>
                              ₱{product.price} • Stock: {product.stocks}
                           </Text>
                        </View>
                        <TouchableOpacity
                           style={styles.addButton}
                           onPress={() => addProduct(product)}
                        >
                           <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                     </View>
                  ))}
               </View>
            </ScrollView>

            {selectedProducts.length > 0 && (
               <View style={styles.selectedSection}>
                  <Text style={styles.sectionTitle}>Selected Items</Text>
                  <ScrollView style={styles.productList}>
                     {selectedProducts.map((item) => (
                        <View
                           key={item.product._id}
                           style={[
                              styles.selectedItem,
                              theme.background === "#2E2E2E" &&
                                 styles.selectedItemDark,
                           ]}
                        >
                           <View style={styles.productInfo}>
                              <Text style={styles.productName}>
                                 {item.product.name}
                              </Text>
                              <Text style={styles.productPrice}>
                                 ₱{item.product.price} each
                              </Text>
                           </View>
                           <View style={styles.quantityControl}>
                              <TouchableOpacity
                                 style={styles.quantityButton}
                                 onPress={() =>
                                    updateQuantity(
                                       item.product._id,
                                       item.quantity - 1,
                                    )
                                 }
                              >
                                 <MaterialIcons
                                    name="remove"
                                    size={20}
                                    color="#FFFFFF"
                                 />
                              </TouchableOpacity>
                              <Text style={styles.quantityText}>
                                 {item.quantity}
                              </Text>
                              <TouchableOpacity
                                 style={styles.quantityButton}
                                 onPress={() =>
                                    updateQuantity(
                                       item.product._id,
                                       item.quantity + 1,
                                    )
                                 }
                              >
                                 <MaterialIcons
                                    name="add"
                                    size={20}
                                    color="#FFFFFF"
                                 />
                              </TouchableOpacity>
                           </View>
                        </View>
                     ))}
                  </ScrollView>
               </View>
            )}
         </View>

         <View style={styles.footer}>
            <View style={styles.totalRow}>
               <Text style={styles.totalLabel}>Total:</Text>
               <Text style={styles.totalAmount}>₱{total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
               style={styles.createButton}
               onPress={createTransaction}
            >
               <Text style={styles.createButtonText}>Create Transaction</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
}
