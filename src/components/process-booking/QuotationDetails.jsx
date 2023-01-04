import {Checkbox, HStack, Input, Text, View} from 'native-base';
import React, {createRef, useState} from 'react';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import CustomButton from '../common/CustomButton';
const QuotationDetails = ({booking}) => {
  const {name, email, phone} = useSelector(state => state.Auth.TOKEN);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [form, setForm] = useState({
    name,
    email,
    phone: '',
    dropOffFullAddress: '',
    pickUpFullAddress: '',
    flightNum: '',
    additionalInformation: '',
    departureTime: new Date(),
    forElse: false,
  });
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    List[7].ref.current.focus();
  };
  const handleConfirm = date => {
    console.log('A date has been picked: ', date);
    setForm({...form, departureTime: date});
    hideDatePicker();
  };
  const List = [
    {
      placeholder: 'Full Name',
      ref: createRef(),
      value: form.name,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, name: text}),
      nextIndex: 1,
      keyboardType: 'default',
      multiLine: false,
      noOfLines: 3,
      editable: form.forElse,
      onPressIn: () => {},
      onSubmitEditing: () => List[1].ref.current.focus(),
    },
    {
      placeholder: 'Email',
      ref: createRef(),
      value: form.email,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, email: text}),
      nextIndex: 2,
      keyboardType: 'default',
      multiLine: false,
      noOfLines: 3,
      editable: form.forElse,
      onPressIn: () => {},
      onSubmitEditing: () => List[2].ref.current.focus(),
    },
    {
      placeholder: 'Phone',
      ref: createRef(),
      value: form.phone,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, phone: text}),
      nextIndex: 3,
      keyboardType: 'numeric',
      multiLine: false,
      noOfLines: 3,
      editable: false,
      onPressIn: () => {},
      onSubmitEditing: () => List[3].ref.current.focus(),
    },
    {
      placeholder: 'Pick Up Address',
      ref: createRef(),
      value: form.pickUpFullAddress,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, pickUpFullAddress: text}),
      nextIndex: 4,
      keyboardType: 'default',
      multiLine: false,
      noOfLines: 3,
      editable: true,
      onPressIn: () => {},
      onSubmitEditing: () => {
        List[4].ref.current.focus();
      },
    },
    {
      placeholder: 'Drop Off Address',
      ref: createRef(),
      value: form.dropOffFullAddress,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, dropOffFullAddress: text}),
      nextIndex: 5,
      keyboardType: 'default',
      multiLine: false,
      noOfLines: 3,
      editable: true,
      onPressIn: () => {},
      onSubmitEditing: () => {
        List[6].ref.current.focus();
        showDatePicker();
      },
    },
    {
      placeholder: 'Departure Time',
      ref: createRef(),
      value: moment(form.departureTime).format('LLL'),
      blur: false,
      submitType: 'next',
      onChange: () => {},
      nextIndex: 6,
      keyboardType: 'default',
      multiLine: false,
      noOfLines: 3,
      editable: false,
      onPressIn: showDatePicker,
      onSubmitEditing: () => List[6].ref.current.focus(),
    },
    {
      placeholder: 'Flight Number',
      ref: createRef(),
      value: form.flightNum,
      blur: false,
      submitType: 'next',
      onChange: text => setForm({...form, flightNum: text}),
      nextIndex: 7,
      keyboardType: 'numeric',
      multiLine: false,
      noOfLines: 3,
      editable: true,
      onPressIn: () => {},
      onSubmitEditing: () => List[7].ref.current.focus(),
    },
    {
      placeholder: 'Additional Info',
      ref: createRef(),
      value: form.additionalInformation,
      blur: true,
      submitType: 'next',
      onChange: text => setForm({...form, additionalInformation: text}),
      nextIndex: -1,
      keyboardType: 'default',
      multiLine: true,
      noOfLines: 3,
      editable: true,
      onPressIn: () => {},
    },
  ];
  const color = 'rgba(118,75,162,1.0)';
  const darkShadeColor = '#472d61';
  return (
    <View style={{flex: 1, margin: 12}}>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={{fontSize: 24, color: 'white', marginVertical: 14}}>
        Booking Information
      </Text>

      <HStack
        style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
        <Checkbox
          accessibilityLabel="Terms and Condition"
          isChecked={form.forElse}
          // borderColor={color}
          // colorScheme={color}
          bg="#27323D"
          onChange={state => {
            if (!form.forElse) {
              setForm({
                ...form,
                forElse: state,
                name: '',
                email: '',
                phone: '',
              });
            } else {
              setForm({...form, forElse: state, name, email, phone});
            }
          }}
          my="2"
        />
        <Text style={{color: '#FFF', marginLeft: 7}}>
          Booking Ride
          <Text style={{color, fontWeight: 'bold'}}> For Some Else.</Text>
        </Text>
      </HStack>

      {List.map((item, index) => (
        <Input
          key={index}
          my={2}
          p="2"
          variant="filled"
          bgColor="#27323D"
          color="white"
          // placeholder="Full Name"
          _focus={{borderColor: '#14191f'}}
          autoCapitalize="none"
          autoCorrect={false}
          size="lg"
          ref={item.ref}
          editable={item.editable}
          onChangeText={item.onChange}
          value={item.value}
          placeholder={item.placeholder}
          keyboardType={item.keyboardType}
          onSubmitEditing={item.onSubmitEditing}
          blurOnSubmit={item.blur}
          returnKeyType={item.submitType}
          multiline={item.multiLine}
          numberOfLines={item.noOfLines}
          onPressIn={item.onPressIn}
        />
      ))}
      <HStack
        style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
        <Checkbox
          accessibilityLabel="Terms and Condition"
          isChecked={form.terms}
          borderColor={color}
          colorScheme={color}
          bg="#27323D"
          onChange={state => {
            setForm({...form, terms: state});
          }}
          my="2"
        />
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('Terms and Condition');
          }}>
          <Text style={{color: '#FFF', marginLeft: 7}}>
            I accept your
            <Text style={{color, fontWeight: 'bold'}}>
              {' '}
              Terms and Condition
            </Text>
          </Text>
        </TouchableOpacity>
      </HStack>
      <CustomButton
        colorScheme={color}
        onPress={() => onNext(form)}
        _pressed={{bg: darkShadeColor}}
        _text={{color: 'white'}}>
        Confirm Booking
      </CustomButton>
    </View>
  );
};

export default QuotationDetails;
