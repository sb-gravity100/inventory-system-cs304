import {
   View,
   Text,
   StyleSheet,
   FlatList,
   RefreshControl,
   Alert,
   ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/ui/Header";
import { Caption, Subtitle, Body, Loading } from "../../components/ui";
import Card from "../../components/ui/Card";
import StatCard from "../../components/home/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";

const api_url =
   process.env.NODE_ENV === "development"
      ? process.env.EXPO_PUBLIC_API_DEVURL
      : process.env.EXPO_PUBLIC_API_URL;

export default function SalesScreen() {
   const { theme } = useTheme();
   const { authState, user } = useAuth();
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [stats, setStats] = useState({
      totalItemsSold: 0,
      totalStocks: 0,
      todaysSales: 0,
   });
   const [loadingStats, setLoadingStats] = useState(true);

   useEffect(() => {
      fetchTransactions();
      fetchStats();
   }, []);

   const fetchTransactions = async () => {
      try {
         setLoading(true);
         const response = await axios.get(`${api_url}/sales/transactions`, {
            headers: { Authorization: `Bearer ${authState.token}` },
         });
         setTransactions(response.data);
      } catch (error) {
         console.error("Error fetching transactions:", error);
         Alert.alert("Error", "Failed to fetch transactions");
      } finally {
         setLoading(false);
      }
   };

   const fetchStats = async () => {
      try {
         setLoadingStats(true);
         const response = await axios.get(`${api_url}/sales/stats`, {
            headers: { Authorization: `Bearer ${authState.token}` },
         });
         setStats(response.data);
      } catch (error) {
         console.error("Error fetching stats:", error);
      } finally {
         setLoadingStats(false);
      }
   };

   const onRefresh = async () => {
      setRefreshing(true);
      await Promise.all([fetchTransactions(), fetchStats()]);
      setRefreshing(false);
   };

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const calculateTotal = (products) => {
      return products.reduce((sum, item) => {
         const price = item.product?.price || 0;
         const quantity = item.quantity || 0;
         return sum + price * quantity;
      }, 0);
   };

   const styles = StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: theme.background,
      },
      statsContainer: {
         flexDirection: "row",
         gap: 12,
         paddingHorizontal: 20,
         paddingVertical: 16,
      },
      transactionCard: {
         backgroundColor: theme.card,
         borderRadius: 12,
         padding: 16,
         marginHorizontal: 20,
         marginVertical: 8,
         borderLeftWidth: 4,
         borderLeftColor: theme.primary,
      },
      transactionHeader: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
         marginBottom: 12,
      },
      sellerName: {
         fontSize: 16,
         fontWeight: "600",
         color: theme.textPrimary,
      },
      transactionAmount: {
         fontSize: 16,
         fontWeight: "bold",
         color: theme.success,
      },
      transactionMeta: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
      },
      metaText: {
         fontSize: 13,
         color: theme.textSecondary,
      },
      statusBadge: {
         paddingHorizontal: 8,
         paddingVertical: 4,
         borderRadius: 4,
         backgroundColor: theme.primary,
      },
      statusText: {
         fontSize: 12,
         fontWeight: "600",
         color: theme.textPrimary,
      },
      emptyState: {
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
         paddingVertical: 60,
      },
      scrollContent: {
         paddingBottom: 40,
      },
   });

   const TransactionItem = ({ transaction }) => {
      const total = calculateTotal(transaction.products);
      const itemCount = transaction.products.reduce(
         (sum, item) => sum + (item.quantity || 0),
         0,
      );

      return (
         <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
               <Text style={styles.sellerName}>
                  {transaction.seller?.username || "Unknown"}
               </Text>
               <Text style={styles.transactionAmount}>₱{total.toFixed(2)}</Text>
            </View>
            <View style={styles.transactionMeta}>
               <Text style={styles.metaText}>
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
               </Text>
               <Text style={styles.metaText}>
                  {formatDate(transaction.createdAt)}
               </Text>
               <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                     {transaction.status?.toUpperCase() || "PENDING"}
                  </Text>
               </View>
            </View>
         </View>
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <Header title="🛒 Sales" subtitle="Transaction Management" />

         {loadingStats ? (
            <Card
               style={{
                  marginHorizontal: 20,
                  marginVertical: 16,
                  padding: 20,
                  backgroundColor: theme.secondary,
               }}
            >
               <Body style={{ textAlign: "center" }}>Loading stats...</Body>
            </Card>
         ) : (
            <View style={styles.statsContainer}>
               <StatCard
                  value={stats.totalItemsSold}
                  label="Items Sold"
                  backgroundColor={theme.bg2}
               />
               <StatCard
                  value={transactions.length}
                  label="Transactions"
                  backgroundColor={theme.card}
               />
               <StatCard
                  value={`₱${stats.todaysSales?.toLocaleString() || 0}`}
                  label="Today's Sales"
                  backgroundColor={theme.success}
               />
            </View>
         )}

         <Loading isLoading={loading} message="Loading transactions...">
            <FlatList
               data={transactions}
               keyExtractor={(item) => item._id}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     tintColor={theme.primary}
                  />
               }
               renderItem={({ item }) => <TransactionItem transaction={item} />}
               contentContainerStyle={styles.scrollContent}
               ListEmptyComponent={
                  <View style={styles.emptyState}>
                     <Caption style={{ textAlign: "center" }}>
                        No transactions yet.{"\n"}Start creating sales
                        transactions to see them here.
                     </Caption>
                  </View>
               }
            />
         </Loading>
      </SafeAreaView>
   );
}
