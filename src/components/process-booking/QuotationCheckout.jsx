import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Button, Icon, Radio} from 'native-base';
import colors from '../../constants/colors';
import CustomButton from '../common/CustomButton';
import bookingService from '../../api/BookingService';
import {useDispatch} from 'react-redux';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
const QuotationCheckout = ({booking, nextStep}) => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState('one');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const color = colors.YELLOW;
  console.log(booking._id);
  const payment = () => {
    setFetching(true);
    if (value == 'one') {
      bookingService
        .payWithCash(booking._id)
        .then(() => {
          console.log('Request completed');
          dispatch(SUCCESS('Pay With Cash Selected...'));
          nextStep();
        })
        .catch(err => {
          console.log(err);
          dispatch(ERROR('Unable to Pay With Cash Selected...'));
        })
        .finally(() => {
          setFetching(false);
        });
    } else {
    }
  };
  return (
    <View style={styles.container}>
      <Radio.Group
        name="myPaymentRadioGroup"
        accessibilityLabel="Payment"
        my="4"
        value={value}
        icon={<Icon as={<Fontisto name="dollar" />} />}
        size="lg"
        onChange={nextValue => {
          setValue(nextValue);
        }}>
        <Radio
          _text={{color: 'white'}}
          // colorScheme={color}
          value="one"
          my={1}
          icon={<Icon as={<Fontisto name="money-symbol" />} />}
          onChange={nextValue => {
            setValue(nextValue);
          }}>
          Pay with Cash
        </Radio>
        <Radio
          onChange={nextValue => {
            setValue(nextValue);
          }}
          _text={{color: 'white'}}
          // colorScheme={color}
          icon={<Icon as={<Fontisto name="credit-card" />} />}
          value="two"
          my={1}>
          Pay with Card
        </Radio>
      </Radio.Group>
      {value == 'two' && (
        <View>
          <TextInput
            placeholderTextColor="white"
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            editable={false}
          />
          <TextInput
            placeholderTextColor="white"
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            editable={false}
          />
          <TextInput
            placeholderTextColor="white"
            style={styles.input}
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            editable={false}
          />
        </View>
      )}
      <CustomButton
        isDisabled={value == 'two' || fetching}
        colorScheme={color}
        onPress={payment}>
        {value == 'one'
          ? 'Payment And Confirmation'
          : 'Online Payment Feature is coming soon'}
      </CustomButton>
    </View>
  );
};

export default QuotationCheckout;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    // backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    color: 'white',
  },
});
