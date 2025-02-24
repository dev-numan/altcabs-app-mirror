import {
  Badge,
  Checkbox,
  CheckIcon,
  Select,
  Switch,
  Text,
  TextArea,
  View,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import colors from '../../constants/colors';
import PlaceSelector from '../common/PlaceSelector/PlaceSelector';
import moment from 'moment';
import googleService from '../../api/GoogleService';
import {ERROR} from '../../store/slices/message.slice';
import CustomButton from '../common/CustomButton';
import WidgetDatePicker from '../common/PlaceSelector/WidgetDatePicker';
import HStack from '../common/HStack';
import {useDispatch, useSelector} from 'react-redux';
import BookingLuggageModal from './BookingLuggageModal';
import {
  SET_IS_PROCESSING_FINISHED,
  SET_IS_PROCESSING,
} from '../../store/slices/loading.slice';
import {useNavigation} from '@react-navigation/native';
import {selectLuggageTypes} from '../../store/selectors';
import {POST_NEW_BOOKING} from '../../store/slices/booking.slice';
import bookingService from '../../api/BookingService';
import {Picker} from '@react-native-picker/picker';
import PassengerModal from './PassengerModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import PlaceSelectorModal from '../common/PlaceSelector/PlaceSelectorModal';
const check = require('../../assets/images/check.png');
const checked = require('../../assets/images/checked.png');

const BookingWidget = ({booking_type}) => {
  const Token = useSelector(state => state.Auth.JWT);
  console.log('Token......', Token);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [service, setService] = React.useState('');
  const [form, setForm] = useState({
    from_desc: 'Slough Station, Slough, UK',
    from_place_id: 'ChIJq1arfcp6dkgRYVocPLV6oDo',
    to_desc: 'Heathrow Airport (LHR), Longford, UK',
    to_place_id: 'ChIJ6W3FzTRydkgRZ0H2Q1VT548',
    startTime: moment().add(2, 'hours'),
    passangers: '1',
    special_requirements: '',
    luggage: {},
    via: [
      // {place_id: 'test', desc: 'Via 1'}
    ],
    oneWay: true,
    viareturn: [],
    booking_type,
    startTimeReturn: moment().add(3, 'hours'),
  });
  const [distance, setDistance] = useState({fetching: false, seconds: 1000});
  const [returnDistance, setReturnDistance] = useState({
    fetching: true,
    distance: 2000,
  });
  const luggageTypes = useSelector(selectLuggageTypes);

  const [showLuggageModal, setShowLuggageModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [totalLuggage, setTotalLuggage] = useState([]);
  const [prestige, setPrestige] = useState(false);
  const fetchDistance = () => {
    let data = {
      from_id: form.from_place_id,
      to_id: form.to_place_id,
      waypoints: [],
    };
    form.via.forEach(via => {
      if (via.place_id) data.waypoints.push(via.place_id);
    });
    if (data.from_id && data.to_id) {
      setDistance({fetching: true, seconds: 0});
      googleService
        .directions(data)
        .then(data => {
          var totalSeconds = data.legs.reduce(function (total, leg) {
            return total + Number(leg.duration.value);
          }, 0);
          // dispatch(SUCCESS('totalSeconds ' + totalSeconds));
          setDistance({fetching: false, seconds: totalSeconds});
        })
        .catch(err => {
          dispatch(ERROR('Error Fetching Forward Distances'));
          setDistance({fetching: false, seconds: 0});
        });
    }
    if (data.from_id && data.to_id && !form.oneWay) {
      let dataReturn = {
        to_id: form.from_place_id,
        from_id: form.to_place_id,
        waypoints: [],
      };
      form.viareturn.forEach(via => {
        if (via.place_id) dataReturn.waypoints.push(via.place_id);
      });
      setReturnDistance({fetching: true, seconds: 0});
      googleService
        .directions(dataReturn)
        .then(data => {
          var totalSeconds = data.legs.reduce(function (total, leg) {
            return total + Number(leg.duration.value);
          }, 0);
          // dispatch(SUCCESS('totalSeconds ' + totalSeconds));
          setReturnDistance({fetching: false, seconds: totalSeconds});
        })
        .catch(err => {
          dispatch(ERROR('Error Fetching Return Distances'));
          setReturnDistance({fetching: false, seconds: 0});
        });
    }
  };
  useEffect(fetchDistance, [
    form.via,
    form.viareturn,
    form.from_place_id,
    form.to_place_id,
  ]);

  const showProgressMessage = () => {
    switch (booking_type) {
      case 'cabmatch':
        dispatch(SET_IS_PROCESSING('Preparing Booking for cabMatch ...'));
        break;
      case 'client_bidding':
        dispatch(SET_IS_PROCESSING('Preparing Booking for cabBid ...'));
        break;

      default:
        dispatch(SET_IS_PROCESSING('Fetching Quotations ...'));
        break;
    }
  };
  const submitBooking = () => {
    showProgressMessage();
    // console.log('Submitting ...', form.oneWay);
    // dispatch(POST_NEW_BOOKING({booking: form, prestige}));
    bookingService
      .postNewBooking({booking: form, prestige}, booking_type)
      .then(data => {
        // dispatch(POST_NEW_BOOKING(data))

        // console.log(`New Booking: ${data}`);
        navigation.navigate('ProcessBooking', {
          bookingId: data,
        });
      })
      .catch(err => {
        console.log(err.response.data);
        if (err?.response?.data) dispatch(ERROR(err?.response?.data));
      })
      .finally(() => {
        dispatch(SET_IS_PROCESSING_FINISHED());
      });
  };
  const bgColor = getBgColorByType(booking_type);
  // console.log(state);
  // console.log(colors.YELLOW);
  return (
    <View style={{...styles.form, backgroundColor: bgColor}}>
      <BookingLuggageModal
        open={showLuggageModal}
        setOpen={setShowLuggageModal}
        luggageTypes={luggageTypes}
        form={form}
        setForm={setForm}
        totalLuggage={totalLuggage}
        setTotalLuggage={setTotalLuggage}
      />
      <PassengerModal
        open={showPassengerModal}
        setOpen={setShowPassengerModal}
        form={form}
        setForm={setForm}
      />
    
      <SafeAreaView>
      <PlaceSelectorModal
  value={{
    place_id: form.from_place_id,
    description: form.from_desc,
  }}
  label="From"
  onCancel={() => {
    setForm({...form, from_desc: '', from_place_id: ''});
  }}
  onChange={place => {
    setForm({
      ...form,
      from_desc: place.description,
      from_place_id: place.place_id,
    });
  }}
  style={{
    text: { color: colors.BLACK },
    // You can add more styles here if needed
  }}
/>
        {/* <PlaceSelector
          value={{
            place_id: form.from_place_id,
            description: form.from_desc,
          }}
          label="From"
          onCancel={() => {
            setForm({...form, from_desc: '', from_place_id: ''});
          }}
          onChange={place => {
            setForm({
              ...form,
              from_desc: place.description,
              from_place_id: place.place_id,
            });
          }}
        /> */}
      </SafeAreaView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <CustomButton
            alignSelf="flex-start"
            _text={{fontSize: 10, fontWeight: 'bold'}}
            size="sm"
            p="2"
            onPress={() => {
              let a = {...form};
              a.via.push({desc: '', place_id: ''});
              setForm(a);
            }}>
            Add Stop
          </CustomButton>
        </View>
        <View>
          <Text
            style={{
              color: colors.PRIMARY,
              paddingRight: 7,
              fontSize: 10,
              fontWeight: 'bold',
            }}>
            {distance.fetching ? (
              'Calculating Forward Distance ...'
            ) : (
              <>
                {distance.seconds && (
                  <SecondsToHoursMinutes seconds={distance.seconds} />
                )}
              </>
            )}
          </Text>
        </View>
      </View>
      {form.via.map((via, index) => (
        <SafeAreaView key={index}>
          <PlaceSelector
            value={{
              place_id: form.via[index].place_id,
              description: form.via[index].desc,
            }}
            label="Via"
            onCancel={() => {
              console.log('removing via');
              let vias = [...form.via];
              vias.splice(index, 1);
              setForm({...form, via: vias});
            }}
            onChange={place => {
              console.log('Changing Via');
              console.log(place);
              let vias = [...form.via];
              vias[index].place_id = place.place_id;
              vias[index].desc = place.description;
              setForm({
                ...form,
                vias: vias,
              });
            }}
          />
        </SafeAreaView>
      ))}
      <SafeAreaView>
      <PlaceSelectorModal
  value={{
    place_id: form.to_place_id,
    description: form.to_desc,
  }}
  label="To"
  onCancel={() => {
    setForm({...form, to_desc: '', to_place_id: ''});
  }}
  onChange={place => {
    setForm({
      ...form,
      to_desc: place.description,
      to_place_id: place.place_id,
    });
  }}
  style={{
    text: { color: colors.BLACK },
    // Add more styles if needed
  }}
/>

      </SafeAreaView>
      <WidgetDatePicker
        label="Pick Up Time"
        value={form.startTime}
        onChange={startTime => setForm({...form, startTime})}
      />

      {!form.oneWay && (
        <WidgetDatePicker
          label="Return Pick Up Time"
          value={form.startTimeReturn}
          onChange={startTimeReturn => setForm({...form, startTimeReturn})}
        />
      )}
      <HStack
        style={{
          alignItems: 'center',
          marginVertical: 9,
          justifyContent: 'space-between',
        }}>
        <CustomButton
          alignSelf="flex-start"
          _text={{fontSize: 10, fontWeight: 'bold'}}
          size="sm"
          p="2"
          onPress={() => setShowLuggageModal(true)}>
          Luggage
        </CustomButton>
        {Platform.OS === 'android' ? (
          <>
            <Text
              style={{
                flexGrow: 1,
                fontSize: 14,
                textAlign: 'right',
                color: 'white',
                marginRight: 7,
              }}>
              Passengers
            </Text>
            <View
              style={{
                height: 35,
                width: 102,
                borderWidth: 0.5,
                borderColor: colors.PRIMARY,
                backgroundColor: colors.PRIMARY,
                color: colors.WHITE,
                borderRadius: 12,
                marginTop: '1%',
                left: '15%',
                justifyContent: 'center',
              }}>
              <Picker
                selectedValue={form.passangers}
                mode="dropdown" // Android only
                dropdownIconColor={colors.WHITE}
                placeholder={'#323F4B'}
                // onValueChange={(itemValue, itemIndex) => setService(itemValue)}
                onValueChange={itemValue =>
                  setForm({...form, passangers: itemValue})
                }
                style={{
                  color: colors.WHITE,
                  alignSelf: 'center',
                  height: 35,
                  width: 150,
                  fontSize: 16,
                  fontWeight: '400',
                  paddingLeft: 20,
                  transform: [{scaleX: 0.7}, {scaleY: 0.7}],
                }}>
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
          </>
        ) : (
          <CustomButton
            alignSelf="flex-start"
            _text={{fontSize: 10, fontWeight: 'bold'}}
            size="sm"
            p="2"
            onPress={() => setShowPassengerModal(true)}>
            <HStack>
              <Text
                style={{
                  color: colors.WHITE,
                }}>{`Passengers: ${form.passangers}`}</Text>
              <MaterialCommunityIcons
                name="menu-down"
                color={colors.YELLOW}
                size={20}
                style={{marginBottom: -3}}
              />
            </HStack>
          </CustomButton>
        )}
      </HStack>

      <HStack style={{alignItems: 'center', flexWrap: 'wrap'}}>
        {totalLuggage.map((item, i) => (
          <Badge
            key={i}
            m="2"
            bg="#1C2B39"
            flexDirection="row"
            p={2}
            borderRadius="full">
            <Text style={{color: 'white'}}>
              {item?.name}({item?.quantity})
            </Text>
            <AntDesign
              name="close"
              color="white"
              size={18}
              onPress={() => {
                let a = totalLuggage;
                a = a.filter(luggage => luggage?.id != item?.id);
                setTotalLuggage(a);
                a = {...form};
                delete a.luggage[`${item?.id}`];
                setForm(a);
              }}
            />
          </Badge>
        ))}
      </HStack>

      <HStack style={{alignItems: 'center', marginVertical: 4}}></HStack>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.PRIMARY,
            width: 25,
            height: 25,
            borderRadius: 5,
          }}
          onPress={() => {
            setForm({
              ...form,
              oneWay: !form.oneWay,
            });
          }}>
          {!form.oneWay ? (
            <Icon
              name="check" // FontAwesome check icon
              size={16}
              color={colors.WHITE}
              // Change the icon color
            />
          ) : (
            <Icon
              name="check" // FontAwesome check icon (or any other you want)
              size={16}
              color={colors.PRIMARY} // White color when checked
            />
          )}
        </TouchableOpacity>
        <Text
          style={[
            {
              marginTop: 4,
              marginLeft: 4,
              fontSize: 14,

              fontWeight: '400',
              color: colors.YELLOW,
            },
            {marginTop: 0, color: colors.BLACK},
          ]}>
          One Way ?
        </Text>
      </View>
      {!form.oneWay && (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <CustomButton
                alignSelf="flex-start"
                _text={{fontSize: 10, fontWeight: 'bold'}}
                size="sm"
                p="2"
                onPress={() => {
                  let a = {...form};
                  a.viareturn.push({desc: '', place_id: ''});
                  setForm(a);
                }}>
                Add Return Journey Stop
              </CustomButton>
            </View>
            <View>
              <Text
                style={{
                  color: colors.PRIMARY,
                  paddingRight: 7,
                  fontSize: 10,
                  fontWeight: 'bold',
                }}>
                {returnDistance.fetching ? (
                  'Calculating Return Distance ...'
                ) : (
                  <>
                    {returnDistance.seconds && (
                      <SecondsToHoursMinutes seconds={returnDistance.seconds} />
                    )}
                  </>
                )}
              </Text>
            </View>
          </View>

          {form.viareturn.map((via, index) => (
            <SafeAreaView key={index}>
              <PlaceSelector
                value={{
                  place_id: form.viareturn[index].place_id,
                  description: form.viareturn[index].desc,
                }}
                label="Via"
                onCancel={() => {
                  console.log('removing via');
                  let vias = [...form.viareturn];
                  vias.splice(index, 1);
                  setForm({...form, viareturn: vias});
                }}
                onChange={place => {
                  console.log('Changing Via');
                  console.log(place);
                  let vias = [...form.viareturn];
                  vias[index].place_id = place.place_id;
                  vias[index].desc = place.description;
                  setForm({
                    ...form,
                    viareturn: vias,
                  });
                }}
              />
            </SafeAreaView>
          ))}
        </>
      )}
      {booking_type == 'client_bidding' && (
        <View style={{marginVertical: 10}}>
          <TextArea
            rowSpan={5}
            bordered
            placeholder="Any Special Requirements? "
            value={form.special_requirements}
            onChangeText={value =>
              setForm({...form, special_requirements: value})
            }
          />
        </View>
      )}
      <CustomButton onPress={submitBooking}>
        {booking_type == 'cabmatch'
          ? 'CHECK FOR CABMATCH'
          : booking_type == 'client_bidding'
          ? 'START BIDDING'
          : 'GET QUOTATIONS'}
      </CustomButton>
    </View>
  );
};
const getBgColorByType = booking_type => {
  switch (booking_type) {
    case 'client_bidding':
      return colors.PURPLE;
    case 'cabmatch':
      return colors.BLUE;
    default:
      return colors.YELLOW;
  }
};
const SecondsToHoursMinutes = ({seconds}) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  return (
    <Text>
      {hours} hours {minutes} mins
    </Text>
  );
};
export default BookingWidget;
const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
    marginVertical: 7,
  },
  form: {
    borderRadius: 12,
    margin: 12,
    padding: 18,
    backgroundColor: colors.SECONDARY,
  },
  heading: {fontSize: 18, fontWeight: 'bold', color: 'white'},
  chip: {
    backgroundColor: colors.PRIMARY,
    padding: 4,
    borderRadius: 7,
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 7,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  text: {
    fontSize: 12,
  },
  picker: {
    marginVertical: 30,
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    height: 35,
    // width: 102,
    borderWidth: 0.5,
    borderColor: colors.YELLOW,
    backgroundColor: colors.YELLOW,
    color: colors.WHITE,
    borderRadius: 12,
    marginTop: '1%',
    left: '15%',
    justifyContent: 'center',
  },
});
