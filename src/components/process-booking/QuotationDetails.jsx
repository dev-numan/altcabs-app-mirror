import {Button, Checkbox, HStack, Input, Text, View} from 'native-base';
import React, {createRef, useEffect, useState} from 'react';
import moment from 'moment';
import {SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../common/CustomButton';
import DetailsViewInput from '../common/DetailsViewInput';
import VStack from '../common/VStack';
import {
  ADD_BOOKING_DETAILS,
  LOAD_BOOKING,
} from '../../store/slices/booking.slice';
import colors from '../../constants/colors';
import bookingService from '../../api/BookingService';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
import {
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} from '../../store/slices/loading.slice';
const QuotationDetails = ({booking, nextStep}) => {
  console.log('Booking in QuotationDetails: ', booking);
  const dispatch = useDispatch();
  const {name, email, phone} = useSelector(state => state.Auth.TOKEN);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [interested, setInterested] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState(true);
  const [form, setForm] = useState({
    name,
    email,
    phone: '',
    dropOffFullAddress: '',
    pickUpFullAddress: '',
    flightNum: '',
    additionalInformation: '',
    departureTime: new Date(),
    minutesAfterLanding: 30,
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

  const darkShadeColor = '#472d61';
  const addDetails = () => {
    // nextStep();
    // return;
    console.log('Add Detail');
    setFetching(true);
    dispatch(SET_IS_PROCESSING('Saving Passanger Details ...'));
    bookingService
      .addDetails(booking._id, {interested, ...form})
      .then(updatedBooking => {
        console.log('Updated booking: ', updatedBooking);
        dispatch(LOAD_BOOKING(updatedBooking));
        dispatch(SUCCESS('Booking Details Saved'));
        nextStep();
      })
      .catch(err => {
        console.log(err);
        dispatch(
          ERROR(
            err?.response?.data ? err.response.data : 'Unable to save booking',
          ),
        );
      })
      .finally(() => {
        setFetching(false);
        dispatch(SET_IS_PROCESSING_FINISHED());
      });
  };

  return (
    // <SafeAreaView>
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{marginHorizontal: 20}}>
      <View style={{margin: 12}}>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Text
          style={{
            fontSize: 24,
            color: 'white',
            marginVertical: 16,
            paddingTop: 5,
          }}>
          Booking Information
        </Text>

        <VStack>
          <DetailsViewInput
            value={form.name}
            isReadOnly={true}
            onChange={name => setForm({...form, name})}
          />
          <DetailsViewInput
            value={form.email}
            isReadOnly={true}
            onChange={email => setForm({...form, email})}
          />
          <DetailsViewInput
            value={form.phone}
            onChange={phone => setForm({...form, phone})}
          />
        </VStack>
        <HStack
          style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
          <Checkbox
            accessibilityLabel="Terms and Condition"
            isChecked={form.forElse}
            bg="#27323D"
            onChange={state => {
              setForm({
                ...form,
                forElse: state,
              });
            }}
            my="1"
          />

          <Text style={{color: '#FFF', marginLeft: 7}}>
            Booking Ride For Some Else.
          </Text>
        </HStack>
        {form.forElse && (
          <VStack>
            <DetailsViewInput
              placeholder="Passanger Name"
              value={form.pname}
              // isReadOnly={true}
              onChange={pname => setForm({...form, pname})}
            />
            <DetailsViewInput
              placeholder="Passanger Email"
              value={form.pemail}
              // isReadOnly={true}
              onChange={pemail => setForm({...form, pemail})}
            />
            <DetailsViewInput
              placeholder="Passanger Phone"
              value={form.pphone}
              onChange={pphone => setForm({...form, pphone})}
            />
          </VStack>
        )}
        <DetailsViewInput
          placeholder="PickUp Full Address"
          value={form.pickUpFullAddress}
          onChange={pickUpFullAddress => {
            setForm({...form, pickUpFullAddress});
          }}
        />
        <DetailsViewInput
          placeholder="Drop Off Full Address"
          value={form.dropOffFullAddress}
          onChange={dropOffFullAddress => {
            setForm({...form, dropOffFullAddress});
          }}
        />
        <DetailsViewInput
          placeholder="Flight Number"
          value={form.flightNum}
          onChange={flightNum => {
            setForm({...form, flightNum});
          }}
        />
        <DetailsViewInput
          placeholder="How Many Minutes After Landing"
          value={form.minutesAfterLanding}
          onChange={minutesAfterLanding => {
            setForm({...form, minutesAfterLanding});
          }}
        />
        <DetailsViewInput
          placeholder="Additional Info"
          value={form.additionalInformation}
          onChange={additionalInformation => {
            setForm({...form, additionalInformation});
          }}
        />
        <View style={{height: 300}}>
          <HStack
            style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
            <Checkbox
              accessibilityLabel="Terms and ConditionI am interested in altCABS marketing and offers sent via email"
              isChecked={interested}
              bg="#27323D"
              onChange={state => {
                setInterested(state);
              }}
              my="1"
            />

            <Text style={{color: '#FFF', marginLeft: 7}}>
              I am interested in altCABS marketing and offers sent via email
            </Text>
          </HStack>
          <HStack
            style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
            <Checkbox
              accessibilityLabel="Terms and Condition"
              isChecked={termsAndConditionsAccepted}
              onChange={state => {
                setTermsAndConditionsAccepted(state);
              }}
              my="2"
            />

            <Text style={{color: '#FFF', marginLeft: 7}}>
              I accept your{' '}
              <Text style={{color: colors.YELLOW, fontWeight: 'bold'}}>
                Terms and Condition
              </Text>
            </Text>
          </HStack>
          <CustomButton
            isDisabled={!termsAndConditionsAccepted || fetching}
            colorScheme={colors.YELLOW}
            onPress={addDetails}
            _pressed={{bg: darkShadeColor}}
            _text={{color: colors.PRIMARY}}>
            Confirm Booking
          </CustomButton>
        </View>
        <Text style={{color: colors.YELLOW}}>Text hereee</Text>
      </View>
    </ScrollView>
    // </SafeArreaView>
  );
};

export default QuotationDetails;
