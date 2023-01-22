// import {Input, Modal, Select} from 'native-base';
import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {
  Pressable,
  Modal,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import colors from '../../constants/colors';
import CustomButton from '../common/CustomButton';

const PassengerModal = ({open, setOpen, form, setForm}) => {
  console.log('Inside PassengerModal');
  const [luggage, setLuggage] = useState('');
  const [quantity, setQuantity] = useState(null);

  //   console.log(luggageTypes);
  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.screen}>
            <Text style={styles.text}>Select Passengers</Text>
            <Picker
              selectedValue={form.passangers}
              onValueChange={itemValue =>
                setForm({...form, passangers: itemValue})
              }
              mode="dropdown" // Android only
              style={styles.picker}>
              {[
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
              ].map((item, i) => (
                <Picker.Item label={item} value={item} key={i} />
              ))}
            </Picker>
          </View>
          <View style={styles.buttonsContainer}>
            {/* <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setOpen(false); 
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setOpen(false);
              }}>
              <Text style={styles.saveButtonText}>Done</Text>
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
    // backgroundColor: colors.PRIMARY,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    backgroundColor: 'white',
    // backgroundColor: colors.PRIMARY,
    padding: 20,
    borderRadius: 10,
    // alignItems: 'center',
    width: '80%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  screen: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  text: {
    fontSize: 24,
  },
  picker: {
    marginVertical: 10,
    width: 300,
    padding: 10,
    // borderWidth: 1,
    borderColor: '#666',
  },
});

export default PassengerModal;
