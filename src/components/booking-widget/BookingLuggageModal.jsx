import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import colors from '../../constants/colors';

const BookingLuggageModal = ({
  open,
  setOpen,
  luggageTypes,
  form,
  setForm,
  setTotalLuggage,
  totalLuggage,
  setLuggageQuantity
}) => {
  // Initialize selected luggage items with quantities
  const [selectedItems, setSelectedItems] = useState({});

  // Initialize selections when modal opens
  useEffect(() => {
    if (open) {
      // Pre-fill with existing selections from form
      const initialSelections = {};
      luggageTypes.forEach(item => {
        initialSelections[item._id] = form.luggage[item._id] ? parseInt(form.luggage[item._id]) : 0;
      });
      setSelectedItems(initialSelections);
    }
  }, [open, form.luggage, luggageTypes]);

  // Handle quantity change
  const handleQuantityChange = (id, increment) => {
    setSelectedItems(prev => {
      const currentValue = prev[id] || 0;
      const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
      return { ...prev, [id]: newValue };
    });
  };

  // Handle save
  const handleSave = () => {
    // Update form
    const updatedForm = { ...form };
    const updatedLuggage = [];
    let totalQuantity = 0;

    Object.entries(selectedItems).forEach(([id, quantity]) => {
      // Only add items with quantity > 0
      if (quantity > 0) {
        // Update form.luggage
        updatedForm.luggage[id] = quantity.toString();
        
        // Add to total quantity count
        totalQuantity += quantity;
        
        // Find luggage details
        const luggageItem = luggageTypes.find(item => item._id === id);
        if (luggageItem) {
          // Add to totalLuggage array
          const existingIndex = totalLuggage.findIndex(item => item.id === id);
          if (existingIndex >= 0) {
            // Update existing
            updatedLuggage.push({
              ...totalLuggage[existingIndex],
              quantity: quantity.toString()
            });
          } else {
            // Add new
            updatedLuggage.push({
              name: luggageItem.name,
              quantity: quantity.toString(),
              id: id
            });
          }
        }
      } else {
        // If quantity is 0, remove from form
        delete updatedForm.luggage[id];
      }
    });

    // Add items from totalLuggage that weren't modified
    totalLuggage.forEach(item => {
      if (!selectedItems.hasOwnProperty(item.id)) {
        updatedLuggage.push(item);
        // Add their quantities to the total
        totalQuantity += parseInt(item.quantity || 0);
      }
    });

    // Update all state
    setForm(updatedForm);
    setTotalLuggage(updatedLuggage);
    setLuggageQuantity(totalQuantity); // Set the total luggage quantity
    setOpen(false);
  };

  // Calculate total selected items for the header
  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  // Render luggage item
  const renderLuggageItem = ({ item }) => {
    const quantity = selectedItems[item._id] || 0;
    
    return (
      <View style={styles.luggageItem}>
        <Text style={styles.luggageName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item._id, false)}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item._id, true)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Select Luggage</Text>
          
          {/* Show current total selection */}
          <Text style={styles.totalSelected}>
            Selected: {getTotalSelectedItems()} items
          </Text>
          
          <FlatList
            data={luggageTypes}
            renderItem={renderLuggageItem}
            keyExtractor={item => item._id}
            style={styles.luggageList}
          />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setOpen(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black'
  },
  totalSelected: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: 'black'
  },
  luggageList: {
    maxHeight: 300,
    fontSize: 12
  },
  luggageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  luggageName: {
    fontSize: 14,
    flex: 1,
    color: 'black'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.PRIMARY,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
    color: 'black'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookingLuggageModal;