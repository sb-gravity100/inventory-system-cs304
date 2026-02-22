import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../components/ThemeProvider";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/ui/Header";
import { Body, Caption, Subtitle } from "../../../components/ui";
import Card from "../../../components/ui/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   ActivityIndicator,
   Alert,
} from "react-native";

const api_url =
   process.env.NODE_ENV === "development"
      ? process.env.EXPO_PUBLIC_API_DEVURL
      : process.env.EXPO_PUBLIC_API_URL;

export default function TransactionDetail() {
   const { theme } = useTheme();
   const { authState } = useAuth();
   const { transactionId } = useLocalSearchParams();
   const [transaction, setTransaction] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchTransaction();
   }, [transactionId]);

   const fetchTransaction = async () => {
      try {
         setLoading(true);
         const response = await axios.get(
            `${api_url}/sales/transaction/${transactionId}`,
            { headers: { Authorization: `Bearer ${authState.token}` } },
         );
         setTransaction(response.data);
      } catch (error) {
         console.error("Error fetching transaction:", error);
         Alert.alert("Error", "Failed to fetch transaction details");
      } finally {
         setLoading(false);
      }
   };

   const styles = StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: theme.background,
      },
      content: {
         paddingHorizontal: 20,
         paddingVertical: 16,
      },
      section: {
         marginBottom: 16,
      },
      sectionTitle: {
         fontSize: 14,
         fontWeight: "600",
         color: theme.textSecondary,
         marginBottom: 8,
      },
      detailCard: {
         backgroundColor: theme.bg2,
         borderRadius: 12,
         padding: 16,
         marginBottom: 12,
      },
      row: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
         paddingVertical: 8,
         borderBottomWidth: 1,
         borderBottomColor: theme.border,
      },
      label: {
         fontSize: 13,
         color: theme.textSecondary,
      },
      value: {
         fontSize: 14,
         fontWeight: "600",
         color: theme.textPrimary,
      },
      productItem: {
         paddingVertical: 12,
         borderBottomWidth: 1,
         borderBottomColor: theme.border,
      },
      productName: {
         fontSize: 14,
         fontWeight: "500",
         color: theme.textPrimary,
         marginBottom: 4,
      },
      productMeta: {
         flexDirection: "row",
         justifyContent: "space-between",
      },
      totalAmount: {
         fontSize: 18,
         fontWeight: "bold",
         color: theme.success,
      },
   });

   if (loading) {
      return (
         <SafeAreaView style={styles.container}>
            <Header title="Transaction Details" />
            <View
               style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <ActivityIndicator size="large" color={theme.primary} />
            </View>
         </SafeAreaView>
      );
   }

   if (!transaction) {
      return (
         <SafeAreaView style={styles.container}>
            <Header title="Transaction Details" />
            <View
               style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <Caption>Transaction not found</Caption>
            </View>
         </SafeAreaView>
      );
   }

   const total = transaction.products.reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
      0,
   );

   return (
      <SafeAreaView style={styles.container}>
         <Header title="Transaction Details" />
         <ScrollView style={styles.content}>
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>TRANSACTION INFO</Text>
               <View style={styles.detailCard}>
                  <View style={styles.row}>
                     <Text style={styles.label}>Transaction ID</Text>
                     <Text style={styles.value}>{transaction._id}</Text>
                  </View>
                  <View style={styles.row}>
                     <Text style={styles.label}>Seller</Text>
                     <Text style={styles.value}>
                        {transaction.seller?.username || "Unknown"}
                     </Text>
                  </View>
                  <View style={styles.row}>
                     <Text style={styles.label}>Status</Text>
                     <Text style={[styles.value, { color: theme.success }]}>
                        {transaction.status?.toUpperCase() || "PENDING"}
                     </Text>
                  </View>
                  <View style={[styles.row, { borderBottomWidth: 0 }]}>
                     <Text style={styles.label}>Date</Text>
                     <Text style={styles.value}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                     </Text>
                  </View>
               </View>
            </View>

            <View style={styles.section}>
               <View style={styles.detailCard}>
                  <View style={[styles.row, { borderBottomWidth: 0 }]}>
                     <Subtitle>Total Amount</Subtitle>
                     <Text style={styles.totalAmount}>₱{total.toFixed(2)}</Text>
                  </View>
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>PRODUCTS</Text>
               <View style={styles.detailCard}>
                  {transaction.products.map((item, index) => (
                     <View key={index} style={styles.productItem}>
                        <Text style={styles.productName}>
                           {item.product?.name || "Unknown Product"}
                        </Text>
                        <View style={styles.productMeta}>
                           <Text style={styles.label}>
                              Qty: {item.quantity}
                           </Text>
                           <Text style={styles.label}>
                              ₱{(item.product?.price || 0).toFixed(2)}
                           </Text>
                           <Text
                              style={[styles.value, { color: theme.success }]}
                           >
                              ₱
                              {(
                                 (item.product?.price || 0) *
                                 (item.quantity || 0)
                              ).toFixed(2)}
                           </Text>
                        </View>
                     </View>
                  ))}
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
