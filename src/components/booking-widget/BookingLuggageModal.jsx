import {Input, Modal, Select} from 'native-base';
import React, {useState} from 'react';
import {Text} from 'react-native';
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
  const [luggage, setLuggage] = useState('');
  const [quantity, setQuantity] = useState(null);

  //   console.log(luggageTypes);
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Enter Your Luggage</Modal.Header>
        <Modal.Body>
          <Text style={{}}>Luggage Type</Text>
          <Select
            selectedValue={luggage}
            accessibilityLabel="Select Luggage"
            placeholder="Select Luggage"
            variant="filled"
            _focus={{borderColor: colors.PRIMARY}}
            _selectedItem={{
              bg: colors.PRIMARY,
              _text: {color: 'white'},
            }}
            my={4}
            onValueChange={itemValue => {
              let luggage = luggageTypes.filter(
                item => item.name === itemValue,
              )[0];

              setQuantity(form.luggage[luggage._id]);
              setLuggage(itemValue);
            }}>
            {luggageTypes.map((item, i) => (
              <Select.Item label={item.name} value={item.name} key={i} />
            ))}
          </Select>
          <Text style={{}}>Quantity</Text>
          <Input
            my="2"
            placeholder="Quantity"
            value={quantity}
            onChangeText={text => setQuantity(text)}
            size="md"
            variant="filled"
            _focus={{borderColor: colors.PRIMARY}}
            keyboardType="number-pad"
          />
        </Modal.Body>
        <Modal.Footer bg="white">
          <CustomButton
            variant="ghost"
            _pressed={{_text: {color: 'white'}, bg: colors.PRIMARY}}
            mx={2}
            onPress={() => {
              setOpen(false);
            }}>
            Cancel
          </CustomButton>
          <CustomButton
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
            Save
          </CustomButton>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default BookingLuggageModal;
