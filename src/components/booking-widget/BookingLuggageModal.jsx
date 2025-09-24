import React, {useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../constants/colors';

const BookingLuggageModal = ({
  open,
  setOpen,
  luggageTypes,
  form,
  setForm,
  setTotalLuggage,
  totalLuggage,
}) => {
  const [luggageCounts, setLuggageCounts] = useState({});
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'subcategory'
  const [currentCategory, setCurrentCategory] = useState(null);

  const luggageItems = [
    { id: 'suitcase', name: 'Suitcase', icon: 'briefcase-outline' },
    { id: 'hand-luggage', name: 'Hand luggage', icon: 'briefcase-outline' },
    { id: 'luggage', name: 'Luggage', icon: 'briefcase-outline' },
    { id: 'boxes', name: 'Boxes', icon: 'package-variant' },
    { id: 'child-items', name: 'Child items', icon: 'baby-buggy' },
    { id: 'folded-wheelchair', name: 'Folded wheelchair', icon: 'wheelchair-accessibility' },
    { id: 'household-items', name: 'Household items', icon: 'home-outline' },
    { id: 'outdoor-items', name: 'Outdoor items', icon: 'tree' },
    { id: 'pets', name: 'Pets', icon: 'paw' },
  ];

  const subcategoryItems = {
    luggage: [
      { id: 'backpack', name: 'Backpack', icon: 'bag-personal' },
    ],
    boxes: [
      { id: 'small-box', name: 'Small box (14 x 12 x 15 inches)', icon: 'package-variant' },
      { id: 'medium-box', name: 'Medium box (16 x 16 x 16 inches)', icon: 'package-variant' },
      { id: 'large-box', name: 'Large box (20 x 20 x 20 inches)', icon: 'package-variant' },
      { id: 'xl-box', name: 'XL box (24 x 24 x 33 inche)', icon: 'package-variant' },
    ],
    'child-items': [
      { id: 'stroller', name: 'Stroller', icon: 'baby-buggy' },
      { id: 'car-seat', name: 'Car Seat', icon: 'car-seat' },
      { id: 'high-chair', name: 'High Chair', icon: 'seat' },
    ],
    'folded-wheelchair': [
      { id: 'wheelchair', name: 'Folded Wheelchair', icon: 'wheelchair-accessibility' },
    ],
    'household-items': [
      { id: 'furniture', name: 'Furniture', icon: 'sofa' },
      { id: 'appliances', name: 'Appliances', icon: 'washing-machine' },
      { id: 'electronics', name: 'Electronics', icon: 'television' },
    ],
    'outdoor-items': [
      { id: 'bicycle', name: 'Bicycle', icon: 'bike' },
      { id: 'camping-gear', name: 'Camping Gear', icon: 'tent' },
      { id: 'sports-equipment', name: 'Sports Equipment', icon: 'basketball' },
    ],
    pets: [
      { id: 'dog', name: 'Dog', icon: 'dog' },
      { id: 'cat', name: 'Cat', icon: 'cat' },
      { id: 'bird', name: 'Bird', icon: 'bird' },
    ],
  };

  const updateLuggageCount = (itemId, increment) => {
    const currentCount = luggageCounts[itemId] || 0;
    const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
    
    if (newCount === 0) {
      const newCounts = {...luggageCounts};
      delete newCounts[itemId];
      setLuggageCounts(newCounts);
    } else {
      setLuggageCounts({...luggageCounts, [itemId]: newCount});
    }
  };

  const getTotalItems = () => {
    return Object.values(luggageCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleCategoryClick = (category) => {
    if (subcategoryItems[category.id]) {
      setCurrentCategory(category);
      setCurrentView('subcategory');
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setCurrentCategory(null);
  };

  const handleSave = () => {
    // Convert luggage counts to the format expected by the form
    const luggageData = {};
    Object.keys(luggageCounts).forEach(itemId => {
      const item = luggageTypes.find(lt => lt.name === itemId);
      if (item) {
        luggageData[item._id] = luggageCounts[itemId];
      }
    });

    // Update form
    let updatedForm = {...form};
    updatedForm.luggage = luggageData;
    setForm(updatedForm);

    // Update total luggage display
    const newTotalLuggage = Object.keys(luggageCounts).map(itemId => {
      const luggageType = luggageTypes.find(lt => lt.name === itemId);
      return {
        name: itemId,
        quantity: luggageCounts[itemId],
        id: luggageType?._id || itemId,
      };
    }).filter(item => item.quantity > 0);

    setTotalLuggage(newTotalLuggage);
    setOpen(false);
  };

  const handleRemoveAll = () => {
    setLuggageCounts({});
  };

  const renderMainView = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setOpen(false)} style={styles.headerButton}>
          <AntDesign name="arrowleft" size={24} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Luggage</Text>
        <TouchableOpacity onPress={() => setOpen(false)} style={styles.headerButton}>
          <AntDesign name="close" size={24} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {luggageItems.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={colors.BLUE} 
                style={styles.itemIcon}
              />
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            
            {item.id === 'suitcase' || item.id === 'hand-luggage' ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: (luggageCounts[item.id] || 0) > 0 ? colors.PRIMARY_40_DARK : colors.PRIMARY_40_DARK }
                  ]}
                  onPress={() => updateLuggageCount(item.id, false)}
                  disabled={(luggageCounts[item.id] || 0) === 0}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{luggageCounts[item.id] || 0}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: colors.PRIMARY_40_DARK }]}
                  onPress={() => updateLuggageCount(item.id, true)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => handleCategoryClick(item)}>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.PRIMARY_40_DARK} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );

  const renderSubcategoryView = () => {
    if (!currentCategory || !subcategoryItems[currentCategory.id]) return null;
    
    const items = subcategoryItems[currentCategory.id];
    
    return (
      <>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToMain} style={styles.headerButton}>
            <AntDesign name="arrowleft" size={24} color={colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentCategory.name}</Text>
          <TouchableOpacity onPress={() => setOpen(false)} style={styles.headerButton}>
            <AntDesign name="close" size={24} color={colors.PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={24} 
                  color={colors.BLUE} 
                  style={styles.itemIcon}
                />
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: (luggageCounts[item.name] || 0) > 0 ? colors.PRIMARY_40_DARK : colors.PRIMARY_40_DARK }
                  ]}
                  onPress={() => updateLuggageCount(item.name, false)}
                  disabled={(luggageCounts[item.name] || 0) === 0}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{luggageCounts[item.name] || 0}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: colors.PRIMARY_40_DARK }]}
                  onPress={() => updateLuggageCount(item.name, true)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={open}>
      <View style={styles.container}>
        {currentView === 'main' ? renderMainView() : renderSubcategoryView()}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={handleSave}>
            <Text style={styles.addButtonText}>
              Add {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeAllButton} onPress={handleRemoveAll}>
            <Text style={styles.removeAllText}>Remove all</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.PRIMARY,
  },
  content: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 20,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    color: colors.PRIMARY,
    fontWeight: '500',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.PRIMARY_40_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    color: colors.PRIMARY,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: colors.YELLOW,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeAllButton: {
    alignItems: 'center',
  },
  removeAllText: {
    color: colors.BLUE,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BookingLuggageModal;
