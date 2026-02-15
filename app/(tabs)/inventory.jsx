import {
   View,
   Text,
   StyleSheet,
   Alert,
   Animated,
   FlatList, // Add this
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { router } from "expo-router";
import ProductCard from "../../components/ProductCard";
import FloatingActionButton from "../../components/FloatingActionButton";
import AddProductModal from "../../components/AddProductModal";
import UpdateStockModal from "../../components/UpdateStockModal";

const api_url =
   process.env.NODE_ENV === "development"
      ? "http://192.168.254.102:3000"
      : process.env.EXPO_PUBLIC_API_URL;

export default function InventoryScreen() {
   const { theme } = useTheme();
   const { authState, user } = useAuth();
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loadingMore, setLoadingMore] = useState(false);
   const [fabOpen, setFabOpen] = useState(false);
   const fabAnimation = useState(new Animated.Value(0))[0];

   const [addProductModal, setAddProductModal] = useState(false);
   const [updateStockModal, setUpdateStockModal] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState(null);

   // Add Product form
   const [newProductName, setNewProductName] = useState("");
   const [newProductPrice, setNewProductPrice] = useState("");
   const [newProductStock, setNewProductStock] = useState("");

   // Update Stock form
   const [stockAction, setStockAction] = useState("add");
   const [stockQuantity, setStockQuantity] = useState("");

   useEffect(() => {
      fetchProducts(1);
   }, []);

   const fetchProducts = async (pageNum) => {
      try {
         if (pageNum === 1) {
            setLoading(true);
         } else {
            setLoadingMore(true);
         }

         const response = await axios.get(`${api_url}/products`, {
            headers: { Authorization: `Bearer ${authState.token}` },
            params: {
               page: pageNum,
               limit: 10,
            },
         });

         if (pageNum === 1) {
            setProducts(response.data);
         } else {
            setProducts((prev) => [...prev, ...response.data]);
         }

         setHasMore(response.data.length === 10);
         setPage(pageNum);
      } catch (error) {
         Alert.alert("Error", "Failed to fetch products");
      } finally {
         setLoading(false);
         setLoadingMore(false);
      }
   };

   const handleLoadMore = () => {
      if (!loadingMore && hasMore) {
         fetchProducts(page + 1);
      }
   };

   const handleUpdateStockFromCard = (product) => {
      setSelectedProduct(product);
      setUpdateStockModal(true);
   };

   const getActions = () => {
      const role = user?.role?.toLowerCase();
      const actions = [];

      // Staff action
      actions.push({
         label: "Create Transaction",
         icon: "add-shopping-cart",
         onPress: () => {
            setFabOpen(false);
            router.push("/transaction");
         },
      });

      // Manager actions
      if (role === "manager" || role === "admin") {
         actions.push({
            label: "Add Product",
            icon: "add-box",
            onPress: () => {
               setFabOpen(false);
               setAddProductModal(true);
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

   const handleAddProduct = () => {
      if (!newProductName || !newProductPrice || !newProductStock) {
         Alert.alert("Error", "Please fill all fields");
         return;
      }
      console.log(stockQuantity);
      axios
         .post(
            `${api_url}/products`,
            {
               name: newProductName,
               price: parseFloat(newProductPrice),
               stock: parseInt(newProductStock),
            },
            {
               headers: { Authorization: `Bearer ${authState.token}` },
            },
         )
         .then(() => {
            fetchProducts(1);
            Alert.alert("Success", "Product added successfully");
         })
         .catch((error) => {
            // Alert.alert("Error", "Failed to add product");
         });

      setAddProductModal(false);
      setNewProductName("");
      setNewProductPrice("");
      setNewProductStock("");
   };

   const handleUpdateStock = () => {
      if (!selectedProduct || !stockQuantity) {
         Alert.alert("Error", "Please select product and enter quantity");
         return;
      }

      // post to "/:id/update-stocks" or "/:id/increase-stock"
      const endpoint =
         stockAction === "add" ? "increase-stock" : "update-stocks";
      axios
         .post(
            `${api_url}/products/${selectedProduct._id}/${endpoint}`,
            {
               quantity: parseInt(stockQuantity),
            },
            {
               headers: { Authorization: `Bearer ${authState.token}` },
            },
         )
         .then(() => {
            fetchProducts(1);
         })
         .catch((error) => {
            Alert.alert("Error", "Failed to update stock");
         });
      setUpdateStockModal(false);
      setSelectedProduct(null);
      setStockQuantity("");
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
      loadingMore: {
         paddingVertical: 20,
         alignItems: "center",
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

         <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
               <ProductCard
                  product={item}
                  theme={theme}
                  onUpdateStock={handleUpdateStockFromCard}
               />
            )}
            contentContainerStyle={styles.productList}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
               !loading && (
                  <View style={styles.emptyState}>
                     <Text style={styles.emptyText}>
                        No products found.{"\n"}Add your first product to get
                        started.
                     </Text>
                  </View>
               )
            }
            ListFooterComponent={
               loadingMore && (
                  <View style={styles.loadingMore}>
                     <ActivityIndicator size="small" color={theme.primary} />
                  </View>
               )
            }
         />

         <FloatingActionButton
            theme={theme}
            fabOpen={fabOpen}
            fabAnimation={fabAnimation}
            actions={getActions()}
            onToggle={toggleFab}
         />

         <AddProductModal
            visible={addProductModal}
            theme={theme}
            newProductName={newProductName}
            setNewProductName={setNewProductName}
            newProductPrice={newProductPrice}
            setNewProductPrice={setNewProductPrice}
            newProductStock={newProductStock}
            setNewProductStock={setNewProductStock}
            onCancel={() => {
               setAddProductModal(false);
               setNewProductName("");
               setNewProductPrice("");
               setNewProductStock("");
            }}
            onSave={handleAddProduct}
         />

         <UpdateStockModal
            visible={updateStockModal}
            theme={theme}
            selectedProduct={selectedProduct}
            stockAction={stockAction}
            setStockAction={setStockAction}
            stockQuantity={stockQuantity}
            setStockQuantity={setStockQuantity}
            onCancel={() => {
               setUpdateStockModal(false);
               setSelectedProduct(null);
               setStockQuantity("");
               setStockAction("add");
            }}
            onSave={handleUpdateStock}
         />
      </SafeAreaView>
   );
}
