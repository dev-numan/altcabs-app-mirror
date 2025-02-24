import React, {useState} from 'react';
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
const PlaceSelectorModal = ({}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [data, setData] = useState([
    // {description: 'Brighton', place_id: 'brighton'},
    // {description: 'Lahore', place_id: 'whoala'},
  ]);
  const [fetching, setFetching] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputField}>
        <Text>
          {selectedLocation ? selectedLocation.address : 'Select a location'}
        </Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}></View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputField: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  textInput: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  listView: {
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PlaceSelectorModal;
