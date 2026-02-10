import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   Alert,
   Modal,
   TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../components/ThemeProvider";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import PasswordInput from "../components/PasswordInput";

const api_url =
   process.env.NODE_ENV === "development"
      ? "http://192.168.254.101:3000"
      : process.env.EXPO_PUBLIC_API_URL;

export default function UsersScreen() {
   const { theme } = useTheme();
   const { authState, user } = useAuth();
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
   const [editModalVisible, setEditModalVisible] = useState(false);
   const [selectedUser, setSelectedUser] = useState(null);
   const [isModified, setIsModified] = useState(false);

   // Form states
   const [newUsername, setNewUsername] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [newRole, setNewRole] = useState("staff");

   // Edit form states
   const [editUsername, setEditUsername] = useState("");
   const [editRole, setEditRole] = useState("");
   const [editPassword, setEditPassword] = useState("");

   const fetchUsers = async () => {
      try {
         const response = await axios.get(`${api_url}/auth/admin/list-users`, {
            headers: { Authorization: `Bearer ${authState.token}` },
         });
         setUsers(response.data);
      } catch (error) {
         Alert.alert("Error", "Failed to fetch users");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   const handleCreateUser = async () => {
      if (!newUsername || !newPassword) {
         Alert.alert("Error", "Please fill in all fields");
         return;
      }

      try {
         await axios.post(
            `${api_url}/auth/admin-create-user`,
            {
               username: newUsername,
               password: newPassword,
               role: newRole,
            },
            {
               headers: { Authorization: `Bearer ${authState.token}` },
            },
         );
         Alert.alert("Success", "User created successfully");
         setModalVisible(false);
         setNewUsername("");
         setNewPassword("");
         setNewRole("staff");
         fetchUsers();
      } catch (error) {
         Alert.alert(
            "Error",
            error.response?.data?.message || "Failed to create user",
         );
      }
   };

   const handleUpdateUser = async () => {
      if (!editUsername) {
         Alert.alert("Error", "Username cannot be empty");
         return;
      }

      try {
         // Update user details
         await axios.post(
            `${api_url}/auth/admin-update-user`,
            {
               username: selectedUser.username,
               newUsername: editUsername,
               newRole: editRole,
            },
            {
               headers: { Authorization: `Bearer ${authState.token}` },
            },
         );

         // Update password if provided
         if (editPassword) {
            await axios.post(
               `${api_url}/auth/admin-change-password`,
               {
                  username: editUsername,
                  newPassword: editPassword,
               },
               {
                  headers: { Authorization: `Bearer ${authState.token}` },
               },
            );
         }

         Alert.alert("Success", "User updated successfully");
         setEditModalVisible(false);
         setSelectedUser(null);
         setEditUsername("");
         setEditRole("");
         setEditPassword("");
         fetchUsers();
      } catch (error) {
         Alert.alert(
            "Error",
            error.response?.data?.message || "Failed to update user",
         );
      }
   };

   const handleDeleteUser = async (username) => {
      Alert.alert(
         "Confirm Delete",
         `Are you sure you want to delete user "${username}"?`,
         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Delete",
               style: "destructive",
               onPress: async () => {
                  try {
                     await axios.post(
                        `${api_url}/auth/admin-delete-user`,
                        { username },
                        {
                           headers: {
                              Authorization: `Bearer ${authState.token}`,
                           },
                        },
                     );
                     Alert.alert("Success", "User deleted successfully");
                     fetchUsers();
                  } catch (error) {
                     Alert.alert(
                        "Error",
                        error.response?.data?.message ||
                           "Failed to delete user",
                     );
                  }
               },
            },
         ],
      );
   };

   const openEditModal = (userItem) => {
      setSelectedUser(userItem);
      setEditUsername(userItem.username);
      setEditRole(userItem.role);
      setEditPassword("");
      setIsModified(false); // Add this line
      setEditModalVisible(true);
   };

   useEffect(() => {
      if (selectedUser) {
         const hasChanges =
            editUsername !== selectedUser.username ||
            editRole !== selectedUser.role ||
            editPassword !== "";
         setIsModified(hasChanges);
      }
   }, [editUsername, editRole, editPassword, selectedUser]);

   const getRoleBadgeColor = (role) => {
      switch (role.toLowerCase()) {
         case "admin":
            return theme.error;
         case "manager":
            return theme.accent;
         default:
            return theme.secondary;
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
         paddingBottom: 20,
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
         marginBottom: 4,
      },
      headerSubtitle: {
         fontSize: 14,
         color: "#FFFFFF",
         opacity: 0.9,
      },
      addButton: {
         backgroundColor: theme.success,
         flexDirection: "row",
         alignItems: "center",
         justifyContent: "center",
         paddingVertical: 12,
         paddingHorizontal: 20,
         borderRadius: 8,
         margin: 20,
         gap: 8,
      },
      addButtonText: {
         color: "#FFFFFF",
         fontSize: 16,
         fontWeight: "600",
      },
      usersList: {
         paddingHorizontal: 20,
      },
      userCard: {
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
      userCardDark: {
         backgroundColor: "#3A3A3A",
      },
      userHeader: {
         flexDirection: "row",
         justifyContent: "space-between",
         alignItems: "center",
         marginBottom: 8,
      },
      userInfo: {
         flex: 1,
      },
      username: {
         fontSize: 18,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 4,
      },
      roleBadge: {
         paddingHorizontal: 12,
         paddingVertical: 4,
         borderRadius: 12,
         alignSelf: "flex-start",
      },
      roleText: {
         color: "#FFFFFF",
         fontSize: 12,
         fontWeight: "600",
         textTransform: "capitalize",
      },
      userActions: {
         flexDirection: "row",
         gap: 8,
      },
      actionButton: {
         padding: 8,
         borderRadius: 6,
      },
      editButton: {
         backgroundColor: theme.accent,
      },
      deleteButton: {
         backgroundColor: theme.error,
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
      modalOverlay: {
         flex: 1,
         backgroundColor: "rgba(0, 0, 0, 0.5)",
         justifyContent: "center",
         alignItems: "center",
      },
      modalContent: {
         backgroundColor: theme.background,
         borderRadius: 12,
         padding: 24,
         width: "90%",
         maxWidth: 400,
      },
      modalTitle: {
         fontSize: 20,
         fontWeight: "bold",
         color: theme.textPrimary,
         marginBottom: 20,
      },
      inputGroup: {
         marginBottom: 16,
      },
      label: {
         fontSize: 14,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 8,
      },
      input: {
         backgroundColor:
            theme.background === "#2E2E2E" ? "#3A3A3A" : "#F5F5F5",
         borderWidth: 1,
         borderColor: theme.border,
         borderRadius: 8,
         paddingHorizontal: 16,
         fontSize: 16,
         color: theme.textPrimary,
      },
      roleSelector: {
         flexDirection: "row",
         gap: 8,
      },
      roleOption: {
         flex: 1,
         paddingVertical: 10,
         paddingHorizontal: 12,
         borderRadius: 8,
         borderWidth: 1,
         borderColor: theme.border,
         alignItems: "center",
      },
      roleOptionActive: {
         backgroundColor: theme.primary,
         borderColor: theme.primary,
      },
      roleOptionText: {
         fontSize: 14,
         color: theme.textPrimary,
         textTransform: "capitalize",
      },
      roleOptionTextActive: {
         color: "#FFFFFF",
         fontWeight: "600",
      },
      modalActions: {
         flexDirection: "row",
         gap: 12,
         marginTop: 20,
      },
      modalButton: {
         flex: 1,
         paddingVertical: 12,
         borderRadius: 8,
         alignItems: "center",
      },
      cancelButton: {
         backgroundColor: theme.textSecondary,
      },
      saveButton: {
         backgroundColor: theme.success,
      },
      buttonText: {
         color: "#FFFFFF",
         fontSize: 16,
         fontWeight: "600",
      },
      loadingContainer: {
         flex: 1,
         justifyContent: "center",
         alignItems: "center",
      },
      loadingText: {
         marginTop: 12,
         fontSize: 16,
         color: theme.textSecondary,
      },
   });

   if (loading) {
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
               <MaterialIcons
                  name="people"
                  size={48}
                  color={theme.textSecondary}
               />
               <Text style={styles.loadingText}>Loading users...</Text>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerTop}>
               <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
               >
                  <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
               </TouchableOpacity>
               <View>
                  <Text style={styles.headerTitle}>👥 User Management</Text>
                  <Text style={styles.headerSubtitle}>
                     Manage staff accounts and permissions
                  </Text>
               </View>
            </View>
         </View>

         {/* Add User Button */}
         <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
         >
            <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New User</Text>
         </TouchableOpacity>

         {/* Users List */}
         <ScrollView style={styles.usersList}>
            {users.length > 0 ? (
               users.map((userItem) => (
                  <View
                     key={userItem._id}
                     style={[
                        styles.userCard,
                        theme.background === "#2E2E2E" && styles.userCardDark,
                     ]}
                  >
                     <View style={styles.userHeader}>
                        <View style={styles.userInfo}>
                           <Text style={styles.username}>
                              {userItem.username}
                           </Text>
                           <View
                              style={[
                                 styles.roleBadge,
                                 {
                                    backgroundColor: getRoleBadgeColor(
                                       userItem.role,
                                    ),
                                 },
                              ]}
                           >
                              <Text style={styles.roleText}>
                                 {userItem.role}
                              </Text>
                           </View>
                        </View>
                        <View style={styles.userActions}>
                           <TouchableOpacity
                              style={[styles.actionButton, styles.editButton]}
                              onPress={() => openEditModal(userItem)}
                           >
                              <MaterialIcons
                                 name="edit"
                                 size={20}
                                 color="#FFFFFF"
                              />
                           </TouchableOpacity>
                           {userItem.username !== user?.username && (
                              <TouchableOpacity
                                 style={[
                                    styles.actionButton,
                                    styles.deleteButton,
                                 ]}
                                 onPress={() =>
                                    handleDeleteUser(userItem.username)
                                 }
                              >
                                 <MaterialIcons
                                    name="delete"
                                    size={20}
                                    color="#FFFFFF"
                                 />
                              </TouchableOpacity>
                           )}
                        </View>
                     </View>
                  </View>
               ))
            ) : (
               <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                     No users found.{"\n"}Create your first user to get started.
                  </Text>
               </View>
            )}
         </ScrollView>

         {/* Create User Modal */}
         <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Create New User</Text>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Username</Text>
                     <RNTextInput
                        style={styles.input}
                        placeholder="Enter username"
                        placeholderTextColor={theme.textSecondary}
                        value={newUsername}
                        onChangeText={setNewUsername}
                        autoCapitalize="none"
                     />
                  </View>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Password</Text>
                     <PasswordInput
                        style={styles.input}
                        placeholder="Enter password"
                        placeholderTextColor={theme.textSecondary}
                        value={newPassword}
                        onChangeText={setNewPassword}
                     />
                  </View>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Role</Text>
                     <View style={styles.roleSelector}>
                        {["staff", "manager", "admin"].map((role) => (
                           <TouchableOpacity
                              key={role}
                              style={[
                                 styles.roleOption,
                                 newRole === role && styles.roleOptionActive,
                              ]}
                              onPress={() => setNewRole(role)}
                           >
                              <Text
                                 style={[
                                    styles.roleOptionText,
                                    newRole === role &&
                                       styles.roleOptionTextActive,
                                 ]}
                              >
                                 {role}
                              </Text>
                           </TouchableOpacity>
                        ))}
                     </View>
                  </View>

                  <View style={styles.modalActions}>
                     <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => {
                           setModalVisible(false);
                           setNewUsername("");
                           setNewPassword("");
                           setNewRole("staff");
                        }}
                     >
                        <Text style={styles.buttonText}>Cancel</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        style={[styles.modalButton, styles.saveButton]}
                        onPress={handleCreateUser}
                     >
                        <Text style={styles.buttonText}>Create</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>

         {/* Edit User Modal */}
         <Modal
            visible={editModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setEditModalVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit User</Text>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Username</Text>
                     <RNTextInput
                        style={styles.input}
                        placeholder="Enter username"
                        placeholderTextColor={theme.textSecondary}
                        value={editUsername}
                        onChangeText={setEditUsername}
                        autoCapitalize="none"
                     />
                  </View>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>New Password (optional)</Text>
                     <PasswordInput
                        style={styles.input}
                        placeholder="(Change password)"
                        placeholderTextColor={theme.textSecondary}
                        value={editPassword}
                        onChangeText={setEditPassword}
                     />
                  </View>

                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Role</Text>
                     <View style={styles.roleSelector}>
                        {["staff", "manager", "admin"].map((role) => (
                           <TouchableOpacity
                              key={role}
                              style={[
                                 styles.roleOption,
                                 editRole === role && styles.roleOptionActive,
                              ]}
                              onPress={() => setEditRole(role)}
                           >
                              <Text
                                 style={[
                                    styles.roleOptionText,
                                    editRole === role &&
                                       styles.roleOptionTextActive,
                                 ]}
                              >
                                 {role}
                              </Text>
                           </TouchableOpacity>
                        ))}
                     </View>
                  </View>

                  <View style={styles.modalActions}>
                     <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => {
                           setEditModalVisible(false);
                           setSelectedUser(null);
                           setEditUsername("");
                           setEditRole("");
                           setEditPassword("");
                        }}
                     >
                        <Text style={styles.buttonText}>Cancel</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        style={[
                           styles.modalButton,
                           styles.saveButton,
                           !isModified && { opacity: 0.5 },
                        ]}
                        onPress={handleUpdateUser}
                        disabled={!isModified}
                     >
                        <Text style={styles.buttonText}>Save</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   );
}
