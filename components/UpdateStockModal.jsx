import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   TextInput,
   ScrollView,
   StyleSheet,
} from "react-native";
import { Input } from "./ui";

export default function UpdateStockModal({
   visible,
   theme,
   selectedProduct,
   stockAction,
   setStockAction,
   stockQuantity,
   setStockQuantity,
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
      stockActionSelector: {
         flexDirection: "row",
         gap: 8,
         marginBottom: 16,
      },
      stockActionButton: {
         flex: 1,
         paddingVertical: 10,
         borderRadius: 8,
         borderWidth: 1,
         borderColor: theme.border,
         alignItems: "center",
      },
      stockActionButtonActive: {
         backgroundColor: theme.primary,
         borderColor: theme.primary,
      },
      stockActionText: {
         fontSize: 14,
         color: theme.textPrimary,
      },
      stockActionTextActive: {
         color: "#FFFFFF",
         fontWeight: "600",
      },
      productSelector: {
         maxHeight: 200,
         borderWidth: 1,
         borderColor: theme.border,
         borderRadius: 8,
         marginBottom: 16,
      },
      productOption: {
         paddingVertical: 12,
         paddingHorizontal: 16,
         borderBottomWidth: 1,
         borderBottomColor: theme.border,
      },
      productOptionActive: {
         backgroundColor: theme.secondary,
      },
      productOptionText: {
         fontSize: 16,
         color: theme.textPrimary,
      },
      selectedProductDisplay: {
         backgroundColor: theme.bg2,
         borderWidth: 1,
         borderColor: theme.border,
         borderRadius: 8,
         padding: 12,
      },
      selectedProductText: {
         fontSize: 16,
         fontWeight: "600",
         color: theme.textPrimary,
         marginBottom: 4,
      },
      selectedProductStock: {
         fontSize: 14,
         color: theme.textSecondary,
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
               <Text style={styles.modalTitle}>Update Stock</Text>

               {selectedProduct && (
                  <View style={styles.inputGroup}>
                     <Text style={styles.label}>Product</Text>
                     <View style={styles.selectedProductDisplay}>
                        <Text style={styles.selectedProductText}>
                           {selectedProduct.name}
                        </Text>
                        <Text style={styles.selectedProductStock}>
                           Current Stock: {selectedProduct.stocks}
                        </Text>
                     </View>
                  </View>
               )}

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Action</Text>
                  <View style={styles.stockActionSelector}>
                     <TouchableOpacity
                        style={[
                           styles.stockActionButton,
                           stockAction === "add" &&
                              styles.stockActionButtonActive,
                        ]}
                        onPress={() => setStockAction("add")}
                     >
                        <Text
                           style={[
                              styles.stockActionText,
                              stockAction === "add" &&
                                 styles.stockActionTextActive,
                           ]}
                        >
                           Add Stock
                        </Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        style={[
                           styles.stockActionButton,
                           stockAction === "set" &&
                              styles.stockActionButtonActive,
                        ]}
                        onPress={() => setStockAction("set")}
                     >
                        <Text
                           style={[
                              styles.stockActionText,
                              stockAction === "set" &&
                                 styles.stockActionTextActive,
                           ]}
                        >
                           Set Stock
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.label}>Quantity</Text>
                  <Input
                     placeholder="Enter quantity"
                     value={stockQuantity}
                     onChangeText={setStockQuantity}
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
                     <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
   );
}
