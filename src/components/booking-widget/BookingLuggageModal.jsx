import React, {useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
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
  const [luggage, setLuggage] = useState('');
  const [quantity, setQuantity] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false); // Control dropdown visibility
  const [luggageItems, setLuggageItems] = useState(
    luggageTypes.map((item, i) => ({
      label: item.name,
      value: item.name,
      key: i,
    })),
  );

  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Enter Your Luggage</Text>
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Select Luggage :</Text>
          </View>
          <DropDownPicker
            open={openDropdown}
            listItemLabelStyle={{
              color: 'black',
            }}
            setOpen={setOpenDropdown}
            value={luggage}
            setValue={setLuggage}
            items={luggageItems}
            setItems={setLuggageItems}
            placeholder="Select Luggage"
            style={styles.pickerStyle}
            textStyle={styles.pickerTextStyle}
            dropDownContainerStyle={styles.dropDownStyle}
            onChangeValue={itemValue => {
              let luggage = luggageTypes.filter(
                item => item?.name === itemValue,
              )[0];
              setQuantity(form.luggage[luggage?._id]);
              setLuggage(itemValue);
            }}
          />

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
              onPress={() => setOpen(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                let lug = luggageTypes.filter(
                  item => item?.name === luggage,
                )[0];
                let a = {...form};
                a.luggage[`${lug?._id}`] = quantity;
                setForm(a);
                a = totalLuggage;
                let flag = true;
                for (var i in a) {
                  if (a[i].id === lug?._id) {
                    a[i].quantity = quantity;
                    flag = false;
                    break;
                  }
                }
                if (flag) {
                  a.push({
                    name: lug?.name,
                    quantity,
                    id: lug?._id,
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
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    zIndex: 100,
  },
  label: {
    marginTop: 10,
  },
  pickerStyle: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
    justifyContent: 'center',
    borderRadius: 7,
    marginBottom: 10,
  },
  pickerTextStyle: {
    color: colors.WHITE,
    fontSize: 14,
    numberOfLines: 1,
    ellipsizeMode: 'tail', // Ellipsis for long text
  },
  dropDownStyle: {
    backgroundColor: colors.SECONDARY,
    borderColor: colors.PRIMARY,
    color: 'red',
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
