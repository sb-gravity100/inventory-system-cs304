import { View, Text, StyleSheet } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
import { DropdownMenu } from "./ui";
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
            <DropdownMenu
               items={[
                  {
                     icon: "inventory",
                     label: "Update Stock",
                     onPress: () => {
                        setMenuOpen(false);
                        onUpdateStock(product);
                     },
                  },
               ]}
               onClose={() => setMenuOpen(false)}
            />
         </View>
      </View>
   );
}
