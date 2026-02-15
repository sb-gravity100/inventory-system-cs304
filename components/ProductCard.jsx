import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function ProductCard({ product, theme, onUpdateStock }) {
   const [menuOpen, setMenuOpen] = useState(false);

   const styles = StyleSheet.create({
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
      productHeader: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "flex-start",
         marginBottom: 8,
      },
      productInfo: {
         flex: 1,
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
      menuButton: {
         padding: 4,
      },
      menuDropdown: {
         position: "absolute",
         right: 8,
         top: 40,
         backgroundColor: theme.background,
         borderRadius: 8,
         borderWidth: 1,
         borderColor: theme.border,
         minWidth: 150,
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.2,
         shadowRadius: 4,
         elevation: 5,
         zIndex: 1000,
      },
      menuItem: {
         flexDirection: "row",
         alignItems: "center",
         paddingVertical: 12,
         paddingHorizontal: 16,
         gap: 12,
      },
      menuItemText: {
         fontSize: 14,
         color: theme.textPrimary,
      },
   });

   return (
      <View
         style={[styles.productCard, theme.isDark && styles.productCardDark]}
      >
         <View style={styles.productHeader}>
            <View style={styles.productInfo}>
               <Text style={styles.productName}>{product.name}</Text>
               <View style={styles.productDetails}>
                  <Text style={styles.productPrice}>
                     ₱{product.price.toFixed(2)}
                  </Text>
                  <Text style={styles.productStock}>
                     Stock: {product.stock}
                  </Text>
               </View>
            </View>
            <TouchableOpacity
               style={styles.menuButton}
               onPress={() => setMenuOpen(!menuOpen)}
            >
               <MaterialIcons
                  name="more-vert"
                  size={24}
                  color={theme.textPrimary}
               />
            </TouchableOpacity>
         </View>

         {menuOpen && (
            <View style={styles.menuDropdown}>
               <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                     setMenuOpen(false);
                     onUpdateStock(product);
                  }}
               >
                  <MaterialIcons
                     name="inventory"
                     size={20}
                     color={theme.textPrimary}
                  />
                  <Text style={styles.menuItemText}>Update Stock</Text>
               </TouchableOpacity>
            </View>
         )}
      </View>
   );
}
