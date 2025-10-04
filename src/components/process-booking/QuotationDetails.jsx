import {Button, Checkbox, HStack, Input, Text, View} from 'native-base';
import React, {createRef, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../common/CustomButton';
import DetailsViewInput from '../common/DetailsViewInput';
import VStack from '../common/VStack';
import {
  ADD_BOOKING_DETAILS,
  LOAD_BOOKING,
  APPLY_VOUCHER,
  REMOVE_VOUCHER,
} from '../../store/slices/booking.slice';
import colors from '../../constants/colors';
import bookingService from '../../api/BookingService';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
import {
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} from '../../store/slices/loading.slice';
import ContactTextInput from '../screens/general/ContactTextInput';
import DetailsScreenInput from '../common/DetailsScreenInput';
// import {check, checked} from '../../assets/images';
const check = require('../../assets/images/check.png');
const checked = require('../../assets/images/checked.png');

const QuotationDetails = ({booking, nextStep}) => {
  // console.log('Booking in QuotationDetails: ', booking);
  const dispatch = useDispatch();
  const flightNumRef = useRef('');
  const additionalInfoRef = useRef('');
  const minutesAfterLandingRef = useRef('');
  const {name, email, phone} = useSelector(state => state.Auth.TOKEN);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [interested, setInterested] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] =
    useState(true);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplying, setVoucherApplying] = useState(false);
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
      value: form?.name,
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

  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      dispatch(ERROR('Please enter a voucher code'));
      return;
    }
    
    setVoucherApplying(true);
    try {
      await dispatch(APPLY_VOUCHER({
        bookingId: booking._id,
        voucherCode: voucherCode.trim()
      })).unwrap();
      setVoucherCode(''); // Clear the input on success
    } catch (error) {
      // Error is already handled in Redux action
    } finally {
      setVoucherApplying(false);
    }
  };

  const removeVoucher = async () => {
    setVoucherApplying(true);
    try {
      await dispatch(REMOVE_VOUCHER(booking._id)).unwrap();
    } catch (error) {
      // Error is already handled in Redux action
    } finally {
      setVoucherApplying(false);
    }
  };

  const validatePassengerForm = () => {
    // Validate name
    if (!form.name || form.name.trim().length < 2) {
      dispatch(ERROR('Please enter a valid full name (at least 2 characters)'));
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      dispatch(ERROR('Please enter a valid email address'));
      return false;
    }

    // Validate phone
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!form.phone || !phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      dispatch(ERROR('Please enter a valid phone number (10-15 digits)'));
      return false;
    }

    // Validate pickup address
    if (!form.pickUpFullAddress || form.pickUpFullAddress.trim().length < 10) {
      dispatch(ERROR('Please provide a detailed pickup address (at least 10 characters)'));
      return false;
    }

    // Validate drop-off address
    if (!form.dropOffFullAddress || form.dropOffFullAddress.trim().length < 10) {
      dispatch(ERROR('Please provide a detailed drop-off address (at least 10 characters)'));
      return false;
    }

    // Validate flight number if provided
    if (form.flightNum && form.flightNum.trim().length > 0) {
      const flightRegex = /^[A-Z]{2,3}[0-9]{1,4}$/i;
      if (!flightRegex.test(form.flightNum.replace(/\s/g, ''))) {
        dispatch(ERROR('Please enter a valid flight number (e.g., BA123, EK456)'));
        return false;
      }
    }

    // Validate minutes after landing if flight number is provided
    if (form.flightNum && form.flightNum.trim().length > 0) {
      const minutes = parseInt(form.minutesAfterLanding, 10);
      if (isNaN(minutes) || minutes < 15 || minutes > 180) {
        dispatch(ERROR('Minutes after landing should be between 15 and 180'));
        return false;
      }
    }

    // Validate passenger details if booking for someone else
    if (form.forElse) {
      if (!form.pname || form.pname.trim().length < 2) {
        dispatch(ERROR('Please enter the passenger\'s full name'));
        return false;
      }

      if (!form.pemail || !emailRegex.test(form.pemail)) {
        dispatch(ERROR('Please enter the passenger\'s valid email address'));
        return false;
      }

      if (form.pphone && !phoneRegex.test(form.pphone.replace(/\s/g, ''))) {
        dispatch(ERROR('Please enter a valid passenger phone number'));
        return false;
      }
    }

    // Validate terms acceptance
    if (!termsAndConditionsAccepted) {
      dispatch(ERROR('Please accept the Terms and Conditions to continue'));
      return false;
    }

    return true;
  };

  const addDetails = () => {
    // Validate form before submission
    if (!validatePassengerForm()) {
      return;
    }

    // nextStep();
    // return;
    console.log('Add Detail');
    setFetching(true);
    dispatch(SET_IS_PROCESSING('Saving Passanger Details ...'));
    bookingService
      .addDetails(booking?._id, {interested, ...form})
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
      scrollEnabled={true}
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
          <DetailsScreenInput
            // refInner={emailRef}
            placeHolderColor={colors.WHITE}
            // placeHolder={'Name'}
            headingName={'Name'}
            multiline={false}
            value={form?.name}
            maxLength={50}
            // onChangeText={txt => setLogin({...login, password: txt})}
            onChangeText={name => setForm({...form, name})}
            keyboardType={'default'}
            autoCapitalize="none"
            returnKeyType={'next'}
            blurOnSubmit={false}
            editable={false}
            textColor={colors.WHITE}
            // onSubmitEditing={() => {
            //     passwordRef.current.focus();
            // }}
          />
          <DetailsScreenInput
            // refInner={emailRef}
            placeHolderColor={colors.YELLOW}
            // placeHolder={'Email'}
            headingName={'Email'}
            multiline={false}
            value={form.email}
            maxLength={50}
            // onChangeText={txt => setLogin({...login, password: txt})}
            onChangeText={email => setForm({...form, email})}
            keyboardType={'default'}
            autoCapitalize="none"
            returnKeyType={'next'}
            blurOnSubmit={false}
            editable={false}
            textColor={colors.WHITE}
            // onSubmitEditing={() => {
            //     passwordRef.current.focus();
            // }}
          />
          <DetailsScreenInput
            // refInner={emailRef}
            placeHolderColor={colors.WHITE}
            // placeHolder={'Phone'}
            headingName={'Phone'}
            multiline={false}
            value={form.phone}
            maxLength={50}
            // onChangeText={txt => setLogin({...login, password: txt})}
            onChangeText={phone => setForm({...form, phone})}
            keyboardType={'default'}
            autoCapitalize="none"
            returnKeyType={'next'}
            blurOnSubmit={false}
            style={{color: 'red'}}
            textColor={colors.WHITE}
            // editable={false}

            // onSubmitEditing={() => {
            //     passwordRef.current.focus();
            // }}
          />
          {/* <DetailsViewInput
            value={form?.name}
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
          /> */}
        </VStack>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{
              width: 25,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setForm({
                ...form,
                forElse: !form.forElse,
              });
            }}>
            {!form.forElse ? (
              <Image
                source={check}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: colors.BLUE,
                }}
              />
            ) : (
              <Image
                source={checked}
                style={[
                  {
                    width: 16,
                    height: 16,
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
                 fontSize: 14,
                 // fontFamily: 'Poppins',
                 fontWeight: '400',
                 color: colors.YELLOW,
               },
               // {marginTop: 0, color: colors.WHITE},
             ]}>
             Booking Ride For Some Else.
           </Text>
        </View>
        {/* <HStack
          style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
          <Checkbox
            value={form.forElse}
            onChange={e => {
              setForm({
                ...form,
                forElse: e,
              });
            }}
          />

          <Text style={{color: '#FFF', marginLeft: 7}}>
            Booking Ride For Some Else.
          </Text>
        </HStack> */}
        {form.forElse && (
          <VStack>
            <DetailsScreenInput
              // refInner={emailRef}
              placeHolderColor={colors.WHITE}
              // placeHolder={'Passanger Name'}
              headingName={'Passanger Name'}
              multiline={false}
              value={form.pname}
              maxLength={50}
              // onChangeText={txt => setLogin({...login, password: txt})}
              onChangeText={pname => setForm({...form, pname})}
              keyboardType={'default'}
              autoCapitalize="none"
              returnKeyType={'next'}
              blurOnSubmit={false}
              style={{color: 'red'}}
              textColor={colors.WHITE}
              // editable={false}

              // onSubmitEditing={() => {
              //     passwordRef.current.focus();
              // }}
            />
            <DetailsScreenInput
              // refInner={emailRef}
              placeHolderColor={colors.WHITE}
              // placeHolder={'Passanger Email'}
              headingName={'Passanger Email'}
              multiline={false}
              value={form.pemail}
              maxLength={50}
              // onChangeText={txt => setLogin({...login, password: txt})}
              onChangeText={pemail => setForm({...form, pemail})}
              keyboardType={'default'}
              autoCapitalize="none"
              returnKeyType={'next'}
              blurOnSubmit={false}
              style={{color: 'red'}}
              textColor={colors.WHITE}
              // editable={false}

              // onSubmitEditing={() => {
              //     passwordRef.current.focus();
              // }}
            />
            <DetailsScreenInput
              // refInner={emailRef}
              placeHolderColor={colors.WHITE}
              // placeHolder={'Passanger Phone'}
              headingName={'Passanger Phone'}
              multiline={false}
              value={form.pemail}
              maxLength={50}
              // onChangeText={txt => setLogin({...login, password: txt})}
              onChangeText={pphone => setForm({...form, pphone})}
              keyboardType={'default'}
              autoCapitalize="none"
              returnKeyType={'next'}
              blurOnSubmit={false}
              style={{color: 'red'}}
              textColor={colors.WHITE}
              // editable={false}

              // onSubmitEditing={() => {
              //     passwordRef.current.focus();
              // }}
            />

            {/* <DetailsViewInput
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
            /> */}
          </VStack>
        )}

        <DetailsScreenInput
          // refInner={emailRef}
          placeHolderColor={colors.WHITE}
          // placeHolder={'Phone'}
          headingName={'PickUp Full Address'}
          multiline={false}
          value={form.pickUpFullAddress}
          maxLength={50}
          // onChangeText={txt => setLogin({...login, password: txt})}
          onChangeText={pickUpFullAddress =>
            setForm({...form, pickUpFullAddress})
          }
          keyboardType={'default'}
          autoCapitalize="none"
          returnKeyType={'next'}
          blurOnSubmit={false}
          style={{color: 'red'}}
          textColor={colors.WHITE}
          // editable={false}

          // onSubmitEditing={() => {
          //     passwordRef.current.focus();
          // }}
        />
        <DetailsScreenInput
          // refInner={emailRef}
          placeHolderColor={colors.WHITE}
          // placeHolder={'Phone'}
          headingName={'Drop Off Full Address'}
          multiline={false}
          value={form.dropOffFullAddress}
          maxLength={50}
          // onChangeText={txt => setLogin({...login, password: txt})}
          onChangeText={dropOffFullAddress =>
            setForm({...form, dropOffFullAddress})
          }
          keyboardType={'default'}
          autoCapitalize="none"
          returnKeyType={'next'}
          blurOnSubmit={false}
          style={{color: 'red'}}
          textColor={colors.WHITE}
          // editable={false}

          // onSubmitEditing={() => {
          //     passwordRef.current.focus();
          // }}
        />
        <DetailsScreenInput
          // refInner={emailRef}
          placeHolderColor={colors.WHITE}
          // placeHolder={'Phone'}
          headingName={'Flight Number'}
          multiline={false}
          value={form.flightNum}
          maxLength={50}
          // onChangeText={txt => setLogin({...login, password: txt})}
          onChangeText={flightNum => setForm({...form, flightNum})}
          keyboardType={'default'}
          autoCapitalize="none"
          returnKeyType={'next'}
          blurOnSubmit={false}
          style={{color: 'red'}}
          textColor={colors.WHITE}
          // editable={false}

          // onSubmitEditing={() => {
          //     passwordRef.current.focus();
          // }}
        />
        <DetailsScreenInput
          refInner={minutesAfterLandingRef}
          placeHolderColor={colors.WHITE}
          // placeHolder={'Phone'}
          headingName={'How Many Minutes After Landing'}
          multiline={false}
          value={form.minutesAfterLanding}
          maxLength={50}
          // onChangeText={txt => setLogin({...login, password: txt})}
          onChangeText={minutesAfterLanding =>
            setForm({...form, minutesAfterLanding})
          }
          keyboardType={'default'}
          autoCapitalize="none"
          returnKeyType={'next'}
          blurOnSubmit={false}
          style={{color: 'red'}}
          textColor={colors.WHITE}
          // editable={false}

          onSubmitEditing={() => {
            additionalInfoRef.current.focus();
          }}
        />
        <DetailsScreenInput
          refInner={additionalInfoRef}
          placeHolderColor={colors.WHITE}
          // placeHolder={'Phone'}
          headingName={'Additional Info'}
          multiline={false}
          value={form.additionalInformation}
          maxLength={50}
          // onChangeText={txt => setLogin({...login, password: txt})}
          onChangeText={additionalInformation =>
            setForm({...form, additionalInformation})
          }
          keyboardType={'default'}
          autoCapitalize="none"
          returnKeyType={'next'}
          blurOnSubmit={false}
          style={{color: 'red'}}
          textColor={colors.WHITE}
          // editable={false}

          // onSubmitEditing={() => {
          //     passwordRef.current.focus();
          // }}
        />
        {/* <DetailsViewInput
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
        /> */}

        {/* Voucher Section */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          marginVertical: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)'
        }}>
          <Text style={{
            color: colors.WHITE,
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 12
          }}>
            Have a voucher code?
          </Text>
          
          {booking?.discount > 0 ? (
            // Show applied voucher
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(46, 204, 113, 0.2)',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(46, 204, 113, 0.5)'
            }}>
              <View>
                <Text style={{color: '#2ecc71', fontSize: 14, fontWeight: 'bold'}}>
                  ✓ Voucher Applied
                </Text>
                <Text style={{color: colors.WHITE, fontSize: 12}}>
                  Discount: £{booking.discount?.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={removeVoucher}
                disabled={voucherApplying}
                style={{
                  backgroundColor: 'rgba(231, 76, 60, 0.8)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6
                }}>
                <Text style={{color: colors.WHITE, fontSize: 12}}>
                  {voucherApplying ? 'Removing...' : 'Remove'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Show voucher input
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 12}}>
                <Input
                  placeholder="Enter voucher code"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={voucherCode}
                  onChangeText={setVoucherCode}
                  backgroundColor="rgba(255,255,255,0.1)"
                  borderColor="rgba(255,255,255,0.3)"
                  color={colors.WHITE}
                  fontSize={14}
                  autoCapitalize="characters"
                  _focus={{
                    borderColor: colors.PRIMARY,
                    backgroundColor: "rgba(255,255,255,0.15)"
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={applyVoucher}
                disabled={voucherApplying || !voucherCode.trim()}
                style={{
                  backgroundColor: voucherApplying || !voucherCode.trim() 
                    ? 'rgba(255,255,255,0.3)' 
                    : colors.PRIMARY,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  minWidth: 80,
                  alignItems: 'center'
                }}>
                <Text style={{
                  color: voucherApplying || !voucherCode.trim() 
                    ? 'rgba(255,255,255,0.6)' 
                    : colors.WHITE,
                  fontSize: 14,
                  fontWeight: 'bold'
                }}>
                  {voucherApplying ? 'Applying...' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{minHeight: 300, paddingBottom: 20}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setInterested(interested => !interested);
              }}>
                             {!interested ? (
                 <Image
                   source={check}
                   style={{
                     width: 16,
                     height: 16,
                     tintColor: colors.BLUE,
                   }}
                 />
               ) : (
                 <Image
                   source={checked}
                   style={[
                     {
                       width: 16,
                       height: 16,
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
                  fontSize: 14,
                  fontFamily: 'Poppins',
                  fontWeight: '400',
                  color: colors.YELLOW,
                },
                {marginTop: 0, color: colors.WHITE},
              ]}>
              I am interested in altCABS marketing and offers sent via email
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setTermsAndConditionsAccepted(
                  termsAndConditionsAccepted => !termsAndConditionsAccepted,
                );
              }}>
                             {!termsAndConditionsAccepted ? (
                 <Image
                   source={check}
                   style={{
                     width: 16,
                     height: 16,
                     tintColor: colors.BLUE,
                   }}
                 />
               ) : (
                 <Image
                   source={checked}
                   style={[
                     {
                       width: 16,
                       height: 16,
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
                  fontSize: 14,
                  fontFamily: 'Poppins',
                  fontWeight: '400',
                  color: colors.YELLOW,
                },
                {marginTop: 0, color: colors.WHITE},
              ]}>
              I accept your{' '}
              <Text style={{color: colors.YELLOW, fontWeight: 'bold'}}>
                Terms and Condition
              </Text>
            </Text>
          </View>
          {/* <HStack
            style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
            <Checkbox
              value={interested}
              onChange={e => {
                setInterested(e);
              }}
            />

            <Text style={{color: '#FFF', marginLeft: 7}}>
              I am interested in altCABS marketing and offers sent via email
            </Text>
          </HStack>
          <HStack
            style={{alignItems: 'center', marginLeft: 14, marginVertical: 12}}>
            <Checkbox
              value={termsAndConditionsAccepted}
              onChange={e => {
                setTermsAndConditionsAccepted(e);
              }}
            />
         

            <Text style={{color: '#FFF', marginLeft: 7}}>
              I accept your{' '}
              <Text style={{color: colors.YELLOW, fontWeight: 'bold'}}>
                Terms and Condition
              </Text>
            </Text>
          </HStack> */}
          <CustomButton
            isDisabled={!termsAndConditionsAccepted || fetching}
            bg={colors.YELLOW}
            onPress={addDetails}
            _pressed={{bg: darkShadeColor}}
            _text={{color: colors.PRIMARY, fontWeight: 'bold'}}
            style={{
              marginTop: 20,
              marginBottom: 20
            }}>
            Confirm Booking
          </CustomButton>
        </View>
      </View>
    </ScrollView>
    // </SafeArreaView>
  );
};

export default QuotationDetails;
