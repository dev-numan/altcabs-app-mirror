import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Button, Icon, Radio} from 'native-base';
import colors from '../../constants/colors';
import CustomButton from '../common/CustomButton';
import bookingService from '../../api/BookingService';
import {useDispatch} from 'react-redux';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
const check = require('../../assets/images/check.png');
const checked = require('../../assets/images/checked.png');
const QuotationCheckout = ({booking, nextStep}) => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState('one');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const color = colors.YELLOW;
  console.log(booking?._id);
  const payment = () => {
    setFetching(true);
    if (value == 'one') {
      // Pay with cash
      payWithCash();
    } else {
      // Card payment not implemented yet
      dispatch(ERROR('Card payment feature is coming soon'));
      setFetching(false);
    }
  };
  const payWithCash = () => {
    bookingService
      .payWithCash(booking?._id)
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
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
        <TouchableOpacity
          style={{
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setValue('one');
          }}>
          {value !== 'one' ? (
            <Image
              source={check}
              style={{
                width: 20,
                height: 20,
                tintColor: colors.BLUE,
              }}
            />
          ) : (
            <Image
              source={checked}
              style={[
                {
                  width: 20,
                  height: 20,
                  tintColor: colors.BLUE,
                },
                {tintColor: colors.BLUE},
              ]}
            />
          )}
        </TouchableOpacity>
        <Text
          style={[
            {
              marginTop: 4,
              marginLeft: 10,
              fontSize: 17,
              fontWeight: '400',
              color: colors.YELLOW,
            },
            {marginTop: 0, color: colors.WHITE},
          ]}>
          Pay with Cash
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
        <TouchableOpacity
          style={{
            width: 25,
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setValue('two');
          }}>
          {value !== 'two' ? (
            <Image
              source={check}
              style={{
                width: 20,
                height: 20,
                tintColor: colors.BLUE,
              }}
            />
          ) : (
            <Image
              source={checked}
              style={[
                {
                  width: 20,
                  height: 20,
                  tintColor: colors.BLUE,
                },
                {tintColor: colors.BLUE},
              ]}
            />
          )}
        </TouchableOpacity>
        <Text
          style={[
            {
              marginTop: 4,
              marginLeft: 10,
              fontSize: 17,

              fontWeight: '400',
              color: colors.YELLOW,
            },
            {marginTop: 0, color: colors.WHITE},
          ]}>
          Pay with Card
        </Text>
      </View>
      {/* <Radio.Group
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
      </Radio.Group> */}
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
        bg={colors.YELLOW}
        onPress={payment}
        _pressed={{bg: colors.PRIMARY_40_DARK}}
        _text={{color: colors.PRIMARY, fontWeight: 'bold'}}
        style={{
          marginTop: 20,
          marginBottom: 20
        }}>
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
