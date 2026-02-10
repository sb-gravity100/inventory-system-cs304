import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   Alert,
} from "react-native";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
   const { theme } = useTheme();
   const { user, logout } = useAuth();

   // Role-based menu items
   const getMenuItems = () => {
      const role = user?.role?.toLowerCase();

      const allItems = {
         warehouse: [
            {
               title: "Update Stock",
               icon: "📦",
               route: "/inventory/update-stock",
               description: "Adjust inventory levels",
            },
            {
               title: "Record Delivery",
               icon: "🚚",
               route: "/inventory/record-delivery",
               description: "Add incoming stock",
            },
            {
               title: "View Inventory",
               icon: "📊",
               route: "/inventory",
               description: "Check stock levels",
            },
         ],
         sales: [
            {
               title: "New Sales Order",
               icon: "🛒",
               route: "/sales/new-order",
               description: "Create customer order",
            },
            {
               title: "Check Availability",
               icon: "🔍",
               route: "/sales/check-availability",
               description: "Verify stock status",
            },
            {
               title: "Process Returns",
               icon: "↩️",
               route: "/sales/process-returns",
               description: "Handle returns",
            },
            {
               title: "Sales History",
               icon: "📋",
               route: "/sales",
               description: "View transactions",
            },
         ],
         manager: [
            {
               title: "Sales Reports",
               icon: "📈",
               route: "/reports/sales",
               description: "Analyze performance",
            },
            {
               title: "Inventory Levels",
               icon: "📉",
               route: "/reports/inventory",
               description: "Stock overview",
            },
            {
               title: "Combined Reports",
               icon: "📊",
               route: "/reports",
               description: "Full analytics",
            },
            {
               title: "Manage Staff",
               icon: "👥",
               route: "/manage-staff",
               description: "View staff activity",
            },
         ],
         admin: [
            {
               title: "User Management",
               icon: "⚙️",
               route: "/admin/users",
               description: "Manage users",
            },
            {
               title: "System Settings",
               icon: "🔧",
               route: "/admin/settings",
               description: "Configure system",
            },
            {
               title: "All Reports",
               icon: "📑",
               route: "/reports",
               description: "Complete analytics",
            },
            {
               title: "Audit Logs",
               icon: "📝",
               route: "/admin/audit-logs",
               description: "View system activity",
            },
         ],
      };

      switch (role) {
         case "staff":
            return [...allItems.warehouse, ...allItems.sales];
         case "manager":
            return [
               ...allItems.manager,
               ...allItems.sales,
               ...allItems.warehouse,
            ];
         case "admin":
            return [
               ...allItems.admin,
               ...allItems.manager.filter((item) => {
                  // remove manage staffs
                  if (item.route === "/manage-staff") return false;
                  return item;
               }),
               ...allItems.sales,
               ...allItems.warehouse,
            ];
         default:
            return [];
      }
   };

   const menuItems = getMenuItems();

   const handleLogout = async () => {
      await logout();
      router.replace("/(auth)/login");
   };

   const handleNavigate = (route) => {
      try {
         router.push(route);
      } catch (error) {
         Alert.alert("Coming Soon", "This feature is not yet implemented.");
      }
   };

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
      headerContent: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
      },
      welcomeText: {
         fontSize: 24,
         fontWeight: "bold",
         color: "#FFFFFF",
         marginBottom: 4,
      },
      roleText: {
         fontSize: 14,
         color: "#FFFFFF",
         opacity: 0.9,
         textTransform: "capitalize",
      },
      logoutButton: {
         backgroundColor: theme.error,
         height: "135%",
         width: 80,
         marginRight: -20,
      },
      logoutText: {
         color: "#FFFFFF",
         fontWeight: "600",
         textAlign: "center",
         lineHeight: 40,
         paddingTop: 20,
         paddingLeft: 5,
      },
      scrollContent: {
         padding: 20,
      },
      sectionTitle: {
         fontSize: 18,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 16,
      },
      menuGrid: {
         gap: 16,
         paddingBottom: 40,
      },
      menuCard: {
         backgroundColor: "#FFFFFF",
         borderRadius: 12,
         padding: 20,
         flexDirection: "row",
         alignItems: "center",
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 4,
         elevation: 3,
         borderLeftWidth: 4,
         borderLeftColor: theme.secondary,
      },
      menuCardDark: {
         backgroundColor: "#3A3A3A",
      },
      menuIcon: {
         fontSize: 32,
         marginRight: 16,
      },
      menuContent: {
         flex: 1,
      },
      menuTitle: {
         fontSize: 16,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 4,
      },
      menuDescription: {
         fontSize: 13,
         color: theme.textSecondary,
      },
      statsContainer: {
         flexDirection: "row",
         gap: 12,
         marginBottom: 24,
      },
      statCard: {
         flex: 1,
         backgroundColor: theme.secondary,
         borderRadius: 12,
         padding: 16,
         alignItems: "center",
      },
      statValue: {
         fontSize: 24,
         fontWeight: "bold",
         color: "#FFFFFF",
         marginBottom: 4,
      },
      statLabel: {
         fontSize: 12,
         color: "#FFFFFF",
         opacity: 0.9,
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
   });

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <View>
                  <Text style={styles.welcomeText}>
                     Welcome, {user?.username || "User"}
                  </Text>
                  <Text style={styles.roleText}>
                     {user?.role || "Staff"} Dashboard
                  </Text>
               </View>
               <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
               >
                  <MaterialIcons
                     style={styles.logoutText}
                     name="logout"
                     size={50}
                     color="#FFFFFF"
                  />
               </TouchableOpacity>
            </View>
         </View>

         {/* Content */}
         <ScrollView style={styles.scrollContent}>
            {/* Quick Stats (for managers and admins) */}
            {(user?.role?.toLowerCase() === "manager" ||
               user?.role?.toLowerCase() === "admin") && (
               <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                     <Text style={styles.statValue}>247</Text>
                     <Text style={styles.statLabel}>Total Items</Text>
                  </View>
                  <View
                     style={[
                        styles.statCard,
                        { backgroundColor: theme.accent },
                     ]}
                  >
                     <Text style={styles.statValue}>12</Text>
                     <Text style={styles.statLabel}>Low Stock</Text>
                  </View>
                  <View
                     style={[
                        styles.statCard,
                        { backgroundColor: theme.success },
                     ]}
                  >
                     <Text style={styles.statValue}>₱45.2k</Text>
                     <Text style={styles.statLabel}>Today's Sales</Text>
                  </View>
               </View>
            )}

            {/* Menu Section */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.menuGrid}>
               {menuItems.length > 0 ? (
                  menuItems.map((item, index) => (
                     <TouchableOpacity
                        key={index}
                        style={[
                           styles.menuCard,
                           theme.background === "#2E2E2E" &&
                              styles.menuCardDark,
                        ]}
                        onPress={() => handleNavigate(item.route)}
                     >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <View style={styles.menuContent}>
                           <Text style={styles.menuTitle}>{item.title}</Text>
                           <Text style={styles.menuDescription}>
                              {item.description}
                           </Text>
                        </View>
                     </TouchableOpacity>
                  ))
               ) : (
                  <View style={styles.emptyState}>
                     <Text style={styles.emptyText}>
                        No actions available for your role.{"\n"}
                        Please contact your administrator.
                     </Text>
                  </View>
               )}
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}
