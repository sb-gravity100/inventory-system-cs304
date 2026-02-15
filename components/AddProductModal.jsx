import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   TextInput,
   StyleSheet,
} from "react-native";

export default function AddProductModal({
   visible,
   theme,
   newProductName,
   setNewProductName,
   newProductPrice,
   setNewProductPrice,
   newProductStock,
   setNewProductStock,
   onCancel,
   onSave,
}) {
   const styles = StyleSheet.create({
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
         backgroundColor: theme.bg2,
         borderWidth: 1,
         borderColor: theme.border,
         borderRadius: 8,
         paddingHorizontal: 16,
         paddingVertical: 12,
         fontSize: 16,
         color: theme.textPrimary,
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
   });

   return (
      <Modal
         visible={visible}
         transparent
         animationType="fade"
         onRequestClose={onCancel}
      >
         <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>Add New Product</Text>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Product Name</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="Enter product name"
                     placeholderTextColor={theme.textSecondary}
                     value={newProductName}
                     onChangeText={setNewProductName}
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="0.00"
                     placeholderTextColor={theme.textSecondary}
                     value={newProductPrice}
                     onChangeText={setNewProductPrice}
                     keyboardType="decimal-pad"
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Initial Stock</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="0"
                     placeholderTextColor={theme.textSecondary}
                     value={newProductStock}
                     onChangeText={(v) => setNewProductStock((s) => v)}
                     keyboardType="number-pad"
                  />
               </View>

               <View style={styles.modalActions}>
                  <TouchableOpacity
                     style={[styles.modalButton, styles.cancelButton]}
                     onPress={onCancel}
                  >
                     <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={[styles.modalButton, styles.saveButton]}
                     onPress={onSave}
                  >
                     <Text style={styles.buttonText}>Add Product</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
   );
}
