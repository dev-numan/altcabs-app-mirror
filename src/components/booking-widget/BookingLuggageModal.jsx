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

const BookingLuggageModal = ({
  open,
  setOpen,
  luggageTypes,
  form,
  setForm,
  setTotalLuggage,
  totalLuggage,
}) => {
  console.log('Inside BookingLuggageModal');
  const [luggage, setLuggage] = useState('');
  const [quantity, setQuantity] = useState(null);

  //   console.log(luggageTypes);
  return (
    // <Modal isOpen={open} onClose={() => setOpen(false)}>
    //   <Modal.Content maxWidth="400px">
    //     <Modal.CloseButton />
    //     <Modal.Header>Enter Your Luggage</Modal.Header>
    //     <Modal.Body>
    //       <Text style={{}}>Luggage Type</Text>
    //       {/* <Select
    //         selectedValue={luggage}
    //         accessibilityLabel="Select Luggage"
    //         placeholder="Select Luggage"
    //         variant="filled"
    //         _focus={{borderColor: colors.PRIMARY}}
    //         _selectedItem={{
    //           bg: colors.PRIMARY,
    //           _text: {color: 'white'},
    //         }}
    //         my={4}
    //         onValueChange={itemValue => {
    //           let luggage = luggageTypes.filter(
    //             item => item.name === itemValue,
    //           )[0];

    //           setQuantity(form.luggage[luggage._id]);
    //           setLuggage(itemValue);
    //         }}>
    //         {luggageTypes.map((item, i) => (
    //           <Select.Item label={item.name} value={item.name} key={i} />
    //         ))}
    //       </Select> */}
    //       <Text style={{}}>Quantity</Text>
    //       <Input
    //         my="2"
    //         placeholder="Quantity"
    //         value={quantity}
    //         onChangeText={text => setQuantity(text)}
    //         size="md"
    //         variant="filled"
    //         _focus={{borderColor: colors.PRIMARY}}
    //         keyboardType="number-pad"
    //       />
    //     </Modal.Body>
    //     <Modal.Footer bg="white">
    //       <CustomButton
    //         variant="ghost"
    //         _pressed={{_text: {color: 'white'}, bg: colors.PRIMARY}}
    //         mx={2}
    //         onPress={() => {
    //           setOpen(false);
    //         }}>
    //         Cancel
    //       </CustomButton>
    //       <CustomButton
    //         onPress={() => {
    //           let lug = luggageTypes.filter(item => item.name === luggage)[0];

    //           let a = {...form};
    //           a.luggage[`${lug._id}`] = quantity;
    //           setForm(a);
    //           a = totalLuggage;
    //           let flag = true;
    //           for (var i in a) {
    //             if (a[i].id === lug._id) {
    //               a[i].quantity = quantity;
    //               flag = false;
    //               break;
    //             }
    //           }
    //           if (flag) {
    //             a.push({
    //               name: lug.name,
    //               quantity,
    //               id: lug._id,
    //             });
    //           }
    //           setTotalLuggage(a);
    //           setQuantity(null);
    //           setLuggage('');
    //           setOpen(false);
    //         }}>
    //         Save
    //       </CustomButton>
    //     </Modal.Footer>
    //   </Modal.Content>
    // </Modal>
    // <Modal
    //   animationType="slide"
    //   transparent={true}
    //   visible={open}
    //   onRequestClose={() => {
    //     Alert.alert('Modal has been closed.');
    //     // setModalVisible(!open);
    //     setOpen(false);
    //   }}>
    //   <View style={styles.centeredView}>
    //     <View style={styles.modalView}>
    //       <Text style={styles.modalText}>Hello World!</Text>
    //       <Pressable
    //         style={[styles.button, styles.buttonClose]}
    //         onPress={() => setOpen(false)}>
    //         <Text style={styles.textStyle}>Hide Modal</Text>
    //       </Pressable>
    //     </View>
    //   </View>
    // </Modal>
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Enter Your Luggage</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={{marginTop: 10}}>Select Luggage</Text>
            <View
              style={{
                height: 35,
                width: 152,
                borderWidth: 0.5,
                borderColor: colors.PRIMARY,
                backgroundColor: colors.PRIMARY,
                color: colors.WHITE,
                borderRadius: 7,
                marginTop: '1%',
                left: '15%',
                justifyContent: 'center',
              }}>
              <Picker
                selectedValue={luggage}
                mode="dropdown" // Android only
                dropdownIconColor={colors.WHITE}
                placeholder={colors.WHITE}
                onValueChange={itemValue => {
                  let luggage = luggageTypes.filter(
                    item => item.name === itemValue,
                  )[0];

                  setQuantity(form.luggage[luggage._id]);
                  setLuggage(itemValue);
                }}
                style={{
                  color: colors.WHITE,
                  alignSelf: 'center',
                  height: 35,
                  width: 150,
                  fontSize: 16,
                  fontWeight: '400',
                  paddingLeft: 20,
                  transform: [{scaleX: 1.0}, {scaleY: 0.9}],
                }}>
                {luggageTypes.map((item, i) => (
                  <Picker.Item label={item.name} value={item.name} key={i} />
                ))}
              </Picker>
            </View>
          </View>

          <TextInput
            keyboardType="number-pad"
            value={quantity}
            onChangeText={text => setQuantity(text)}
            style={styles.input}
            placeholder="Luggage Quantity"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setOpen(false); /* handle cancel button press */
              }}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                let lug = luggageTypes.filter(item => item.name === luggage)[0];

                let a = {...form};
                a.luggage[`${lug._id}`] = quantity;
                setForm(a);
                a = totalLuggage;
                let flag = true;
                for (var i in a) {
                  if (a[i].id === lug._id) {
                    a[i].quantity = quantity;
                    flag = false;
                    break;
                  }
                }
                if (flag) {
                  a.push({
                    name: lug.name,
                    quantity,
                    id: lug._id,
                  });
                }
                setTotalLuggage(a);
                setQuantity(null);
                setLuggage('');
                setOpen(false);
              }}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  // buttonClose: {
  //   backgroundColor: '#2196F3',
  // },
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
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
});

export default BookingLuggageModal;
