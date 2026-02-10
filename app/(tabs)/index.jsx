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

   // Simplified role-based quick actions
   const getQuickActions = () => {
      const role = user?.role?.toLowerCase();

      // Core actions that link to existing tabs
      const coreActions = [
         {
            title: "View Inventory",
            icon: "📦",
            route: "/inventory",
            description: "Check current stock levels",
            roles: ["staff", "manager", "admin"],
         },
         {
            title: "Sales Transactions",
            icon: "🛒",
            route: "/sales",
            description: "Manage sales orders",
            roles: ["staff", "manager", "admin"],
         },
         {
            title: "View Reports",
            icon: "📊",
            route: "/reports",
            description: "Analytics and insights",
            roles: ["manager", "admin"],
         },
         {
            title: "User Management",
            icon: "👥",
            route: "/users",
            description: "Manage staff accounts",
            roles: ["admin"],
         },
      ];

      // Additional quick actions based on role
      const roleSpecificActions = {
         staff: [
            {
               title: "Start Transaction",
               icon: "💰",
               route: "/transaction",
               description: "Create new sale",
            },
            {
               title: "Quick Stock Check",
               icon: "🔍",
               action: () =>
                  Alert.alert("Quick Check", "Scan or search for items"),
               description: "Fast item lookup",
            },
         ],
         manager: [
            {
               title: "Low Stock Alert",
               icon: "⚠️",
               action: () => router.push("/inventory"),
               description: "Items need restocking",
            },
         ],
         admin: [
            {
               title: "System Settings",
               icon: "⚙️",
               action: () =>
                  Alert.alert("Coming Soon", "Admin settings in development"),
               description: "Configure system",
            },
         ],
      };

      // Filter core actions by role
      const allowedActions = coreActions.filter((action) =>
         action.roles.includes(role)
      );

      // Add role-specific actions
      const specificActions = roleSpecificActions[role] || [];

      return [...allowedActions, ...specificActions];
   };

   const quickActions = getQuickActions();

   const handleLogout = async () => {
      await logout();
      router.replace("/(auth)/login");
   };

   const handleActionPress = (action) => {
      if (action.route) {
         router.push(action.route);
      } else if (action.action) {
         action.action();
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
      infoCard: {
         backgroundColor: theme.accent,
         borderRadius: 12,
         padding: 16,
         marginBottom: 24,
         opacity: 0.9,
      },
      infoText: {
         fontSize: 14,
         color: "#FFFFFF",
         textAlign: "center",
         lineHeight: 20,
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

            {/* Info Card */}
            <View style={styles.infoCard}>
               <Text style={styles.infoText}>
                  💡 Use the tabs below to navigate between Inventory, Sales, and Reports
               </Text>
            </View>

            {/* Quick Actions Section */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.menuGrid}>
               {quickActions.length > 0 ? (
                  quickActions.map((action, index) => (
                     <TouchableOpacity
                        key={index}
                        style={[
                           styles.menuCard,
                           theme.background === "#2E2E2E" &&
                              styles.menuCardDark,
                        ]}
                        onPress={() => handleActionPress(action)}
                     >
                        <Text style={styles.menuIcon}>{action.icon}</Text>
                        <View style={styles.menuContent}>
                           <Text style={styles.menuTitle}>{action.title}</Text>
                           <Text style={styles.menuDescription}>
                              {action.description}
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