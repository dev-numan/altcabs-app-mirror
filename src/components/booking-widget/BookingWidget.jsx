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
const check = require('../../assets/images/check.png');
const checked = require('../../assets/images/checked.png');

const BookingWidget = ({booking_type}) => {
  const Token = useSelector(state => state.Auth.JWT);
  console.log('Token......', Token);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [service, setService] = React.useState('');
  const [form, setForm] = useState({
    from_desc: '',
    from_place_id: '',
    from_latitude: null,
    from_longitude: null,
    to_desc: '',
    to_place_id: '',
    to_latitude: null,
    to_longitude: null,
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
      from_latitude: form.from_latitude,
      from_longitude: form.from_longitude,
      to_latitude: form.to_latitude,
      to_longitude: form.to_longitude,
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
        console.log(`New Booking created with ID: ${data}`);
        
        // Validate booking ID
        if (!data || typeof data !== 'string' || data.length !== 24) {
          console.log(`Invalid booking ID received: ${data}`);
          dispatch(ERROR('Invalid booking ID received from server'));
          return;
        }

        // Store booking in Redux for immediate access
        const bookingData = {
          _id: data,
          ...form,
          prestige,
          booking_type,
          status: 'created',
          createdAt: new Date().toISOString(),
        };
        
        dispatch(POST_NEW_BOOKING(bookingData));
        
        // Navigate with a small delay to ensure Redux state is updated
        setTimeout(() => {
          navigation.navigate('ProcessBooking', {
            bookingId: data,
          });
        }, 100);
      })
      .catch(err => {
        console.log('Booking creation error:', err);
        const errorMessage = err?.response?.data || err.message || 'Failed to create booking';
        dispatch(ERROR(errorMessage));
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
      {/* Route card: From + To with right swap */}
      <View style={styles.routeCard}>
        {/* Blue dots and connecting line */}
        <View style={styles.routeRail} />
        <View style={styles.routeDotTop} />
        <View style={styles.routeDotBottom} />
        
        <TouchableOpacity
          onPress={() => {
            setForm({
              ...form,
              from_desc: form.to_desc,
              from_place_id: form.to_place_id,
              to_desc: form.from_desc,
              to_place_id: form.from_place_id,
            });
          }}
          style={styles.swapRightButton}>
          <View style={styles.swapArrowsContainer}>
            <MaterialCommunityIcons name="arrow-up" size={16} color={colors.PRIMARY_40_DARK} />
            <MaterialCommunityIcons name="arrow-down" size={16} color={colors.PRIMARY_40_DARK} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.fromSection}>
          <PlaceSelector
            value={{
              place_id: form.from_place_id,
              description: form.from_desc,
            }}
            label="From"
            placeholder={'Place, venue or postcode...'}
            onCancel={() => {
              setForm({...form, from_desc: '', from_place_id: '', from_latitude: null, from_longitude: null});
            }}
            onChange={place => {
              setForm({
                ...form,
                from_desc: place.description,
                from_place_id: place.place_id,
                from_latitude: place.latitude || null,
                from_longitude: place.longitude || null,
              });
            }}
          />
        </View>
        <View style={styles.dividerLine} />
        <View style={styles.toSection}>
          <PlaceSelector
            value={{
              place_id: form.to_place_id,
              description: form.to_desc,
            }}
            label="To"
            placeholder={'Place, venue or postcode...'}
            onCancel={() => {
              setForm({...form, to_desc: '', to_place_id: '', to_latitude: null, to_longitude: null});
            }}
            onChange={place => {
              setForm({
                ...form,
                to_desc: place.description,
                to_place_id: place.place_id,
                to_latitude: place.latitude || null,
                to_longitude: place.longitude || null,
              });
            }}
          />
        </View>
      </View>
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
             _text={{fontSize: 14, fontWeight: 'bold'}}
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
              fontSize: 14,
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
        <View key={index} style={styles.viaCard}>
          <View style={styles.viaHeader}>
            <View style={styles.viaNumberBadge}>
              <Text style={styles.viaNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.viaLabel}>Stop {index + 1}</Text>
            <TouchableOpacity
              style={styles.viaRemoveButton}
              onPress={() => {
                console.log('removing via');
                let vias = [...form.via];
                vias.splice(index, 1);
                setForm({...form, via: vias});
              }}>
              <AntDesign name="close" size={16} color={colors.PRIMARY} />
            </TouchableOpacity>
          </View>
          <PlaceSelector
            value={{
              place_id: form.via[index].place_id,
              description: form.via[index].desc,
            }}
            label=""
            placeholder="Place, venue or postcode..."
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
        </View>
      ))}
      
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
      {/* Passengers row */}
      <View style={styles.optionRow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name="account-outline" size={28} color={colors.PRIMARY_40_DARK} />
          <Text style={styles.optionLabel}>Passengers</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                     <TouchableOpacity
             onPress={() => {
               const next = Math.max(1, parseInt(form.passangers || '1', 10) - 1);
               setForm({...form, passangers: String(next)});
             }}
             style={[
               styles.counterMinus,
               {
                 backgroundColor: colors.PRIMARY_40_DARK,
               },
             ]}>
             <AntDesign name="minus" size={14} color="white" />
           </TouchableOpacity>
           <Text style={styles.counterValue}>{form.passangers}</Text>
           <TouchableOpacity
             onPress={() => {
               const next = Math.min(16, parseInt(form.passangers || '1', 10) + 1);
               setForm({...form, passangers: String(next)});
             }}
             style={[
               styles.counterPlus,
               {
                 backgroundColor: colors.PRIMARY_40_DARK,
               },
             ]}>
             <AntDesign name="plus" size={16} color="white" />
           </TouchableOpacity>
        </View>
      </View>

      {/* Luggage row */}
      <TouchableOpacity style={styles.optionRow} onPress={() => setShowLuggageModal(true)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name="briefcase-outline" size={28} color={colors.PRIMARY_40_DARK} />
          <Text style={styles.optionLabel}>Luggage</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.optionValue}>
            {totalLuggage.length ? `${totalLuggage.length} item(s)` : 'No Luggage'}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={25} color={colors.PRIMARY_40_DARK} />
        </View>
      </TouchableOpacity>

      {totalLuggage && totalLuggage.length > 0 && (
        <View style={styles.luggageContainer}>
          {totalLuggage.map((item, i) => (
            <View key={i} style={styles.luggageItem}>
              <Text style={styles.luggageText}>
                {item?.name}({item?.quantity})
              </Text>
              <TouchableOpacity
                style={styles.luggageRemoveButton}
                onPress={() => {
                  let a = totalLuggage.filter(luggage => luggage?.id !== item?.id);
                  setTotalLuggage(a);
                  let updatedForm = {...form};
                  delete updatedForm.luggage[`${item?.id}`];
                  setForm(updatedForm);
                }}>
                <AntDesign
                  name="close"
                  color={colors.PRIMARY}
                  size={16}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

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
            backgroundColor: colors.PRIMARY_40_DARK,
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
          {form.oneWay ? (
            <Icon
              name="check" // FontAwesome check icon
              size={16}
              color={colors.WHITE}
              // White tick mark when checked
            />
          ) : null}
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
            {marginTop: 0, color: colors.PRIMARY},
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
                _text={{fontSize: 12, fontWeight: 'bold'}}
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
            <View key={index} style={styles.viaCard}>
              <View style={styles.viaHeader}>
                <View style={styles.viaNumberBadge}>
                  <Text style={styles.viaNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.viaLabel}>Return Stop {index + 1}</Text>
                <TouchableOpacity
                  style={styles.viaRemoveButton}
                  onPress={() => {
                    console.log('removing via');
                    let vias = [...form.viareturn];
                    vias.splice(index, 1);
                    setForm({...form, viareturn: vias});
                  }}>
                  <AntDesign name="close" size={16} color={colors.PRIMARY} />
                </TouchableOpacity>
              </View>
              <PlaceSelector
                value={{
                  place_id: form.viareturn[index].place_id,
                  description: form.viareturn[index].desc,
                }}
                label=""
                placeholder="Place, venue or postcode..."
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
            </View>
          ))}
        </>
      )}
      {booking_type == 'client_bidding' && (
        <View style={{marginVertical: 10}}>
          <TextArea
            totalLines={2}
            h={12}
            bordered
            borderColor={colors.PRIMARY_40_DARK}
            fontSize={14}
            placeholder="Any Special Requirements?"
            placeholderTextColor={colors.PRIMARY_40_DARK}
            value={form.special_requirements}
            onChangeText={value =>
              setForm({...form, special_requirements: value})
            }
            color={colors.PRIMARY_40_DARK}
            py={2}
            textAlignVertical="center"
            multiline={true}
            backgroundColor="white"
            style={{
              textAlignVertical: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
      )}
      <CustomButton onPress={submitBooking} style={{marginTop: 15}}>
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
      return colors.YELLOW;
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
  routeCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    padding: 16,
    paddingTop: 13,
    marginVertical: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  routeRail: {
    position: 'absolute',
    left: 28,
    top: 16,
    height: 57,
    width: 2.5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.PRIMARY_40_DARK,
    borderRadius: 1,
    zIndex: 1,
  },
  routeDotTop: {
    position: 'absolute',
    left: 25,
    top: 16,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY_40_DARK,
    zIndex: 2,
  },
  routeDotBottom: {
    position: 'absolute',
    left: 25,
    top: 74,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY_40_DARK,
    zIndex: 2,
  },
  swapRightButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{translateY: -16}],
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
    swapArrowsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  optionLabel: {
    marginLeft: 8,
    color: colors.PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  optionValue: {
    color: colors.PRIMARY,
    fontSize: 14,
    marginRight: 4,
  },
  counterMinus: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterPlus: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    color: colors.PRIMARY,
    fontSize: 14,
    marginHorizontal: 10,
    minWidth: 12,
    textAlign: 'center',
  },
  luggageContainer: {
    backgroundColor: '#FEFCE8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 0,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  luggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
  luggageText: {
    color: colors.PRIMARY,
    fontSize: 14,
    fontWeight: '500',
  },
  luggageRemoveButton: {
    padding: 4,
  },
  fromSection: {
    paddingRight: 30,
  },
  toSection: {
    paddingRight: 30,
  },
  viaCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  viaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  viaNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  viaNumberText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  viaLabel: {
    flex: 1,
    color: colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  viaRemoveButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

