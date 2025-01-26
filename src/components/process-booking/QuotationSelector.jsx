import {
  Button,
  HStack,
  Text,
  View,
  CheckIcon,
  StatusBar,
  VStack,
  Input,
  IconButton,
  Icon,
  Center,
  Box,
  Divider,
  Heading,
} from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import bookingService from '../../api/BookingService';
import colors from '../../constants/colors';
import {selectFleetTypes} from '../../store/selectors';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
import CustomButton from '../common/CustomButton';
import QuotationLoaderSkeleton from '../common/skeletons/QuotationLoaderSkeleton';
import StarRating from 'react-native-star-rating-widget';
import QuotationLogo from './partials/QuotationLogo';
import QuotationTopCard from './partials/QuotationTopCard';
import webSocketService from '../../api/WebSocketService';
import {
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} from '../../store/slices/loading.slice';
import {Picker} from '@react-native-picker/picker';
import {sortBy, orderBy} from 'lodash';

const QuotationSelector = ({bookingId, nextStep, previousStep}) => {
  const dispatch = useDispatch();
  const {quotationCreated, quotationCreatedFor, newQuotations} = useSelector(
    state => state.booking,
  );
  const [open, setOpen] = useState(false);
  const fleetTypes = useSelector(selectFleetTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicle_type, setVehicleType] = useState('all');
  const [quotation_type, setQuotationType] = useState('all'); // all, standard, prestige
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [fromToLocation, setFromToLocation] = useState(null);
  const [state, setState] = useState({
    quotations: [],
    topCards: {},
    fetched: false,
  });
  let fleetOptions = [];
  useEffect(() => {
    webSocketService.setBookingId(bookingId);
  }, [bookingId]);
  fleetOptions = useMemo(
    () =>
      fleetTypes.map(ft => ({
        label: ft?.name || 'Unknown',
        value: ft?._id || '',
      })),
    [],
  );
  const addQuotationsToScreen = newQuotations => {
    let oldQuotations = [...state.quotations];
    for (let i = 0; i < newQuotations.length; i++) {
      let nquo = newQuotations[i];
      let quo = oldQuotations.find(q => q.index == nquo.index);
      if (!quo) {
        oldQuotations.push(nquo);
      }
    }
    oldQuotations = sortBy(oldQuotations, q => q.totalPrice);
    setState({...state, quotations: oldQuotations, fetched: true});
  };
  const fetchQuotations = () => {
    bookingService
      .getQuotationsById(bookingId)
      .then(data => {
        // console.log('DATA QUOTATIONS: ', data.quotations);

        addQuotationsToScreen(data.quotations);
        // setPage(data.page);
        // setPerPage(data.per_page);
        // setTotal(data.total);
      })
      .catch(err => {
        console.log('Error in Fetching Quotations');
        console.log(err);
      })
      .finally(() => {
        setFetching(false);
      });
  };
  const nextPageQuotations = () => {
    bookingService
      .getQuotationsById(bookingId, {
        vehicle_type,
        quotation_type,
        page,
        per_page,
      })
      .then(data => {
        // console.log('data?.quotations?.length', data?.quotations);
        // setNotificationData([...notificationData, ...responseJson?.data]);
        let prevQuotations = [...state.quotations];
        let newQuotations = [...prevQuotations, ...data.quotations];
        // console.log('newQuotations', newQuotations);
        setState({
          ...state,
          // quotations: [...state.quotations, data.quotations],
          quotations: newQuotations,
          topCards: data.topCards,
          fetched: true,
        });
        setPage(data.page);
        setPerPage(data.per_page);
        setTotal(data.total);
        setFetching(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getBookingsDetail = () => {
    bookingService.getById(bookingId).then(res => {
      setFromToLocation({
        from: res?.from,
        to: res?.to,
        via: res?.via,
        viaReturn: res?.viaReturn,
      });
    });
  };
  useEffect(() => fetchQuotations(), []);

  useEffect(() => {
    if (
      quotationCreatedFor &&
      quotationCreated &&
      bookingId &&
      quotationCreatedFor == bookingId
    ) {
      console.log('Quotations Created');
      if (quotationCreated) addQuotationsToScreen(newQuotations);
    }
  }, [quotationCreatedFor, quotationCreated, newQuotations]);
  let quotations = state.quotations;
  quotations = orderBy(quotations, ['totalPrice'], ['asc']);
  const onQuotationSelect = index => {
    // nextStep();
    // return;
    dispatch(SET_IS_PROCESSING('Assigning Quotation ...'));
    bookingService
      .bookNormal(bookingId, index)
      .then(() => {
        nextStep();
      })
      .catch(err => {
        dispatch(ERROR('Unable to Select Quotation'));
      })
      .finally(() => {
        dispatch(SET_IS_PROCESSING_FINISHED());
      });
  };

  if (fetching) {
    return <QuotationsLoader />;
  }
  let lowestQuote = quotations[0];

  let bestRatedQuotsOrderedArray = orderBy(
    quotations,
    ['companyRatings'],
    ['desc'],
  );
  // console.log('quotations');
  // console.log(quotations.map(q => q.index));
  let bestRatedQuote =
    quotations.length == 0
      ? null
      : quotations.reduce((max, curren) =>
          max.companyRatings > curren.companyRatings ? max : curren,
        );
  let topExecutiveQuote = quotations.find(q => q.executive);
  let recommendedQuote = lowestQuote;
  // console.log(`Fleet Types: ${fleetTypes.map(f => f.name)}`);
  if (searchTerm) {
    quotations = quotations.filter(
      q =>
        q.companyName.toLowerCase().search(searchTerm.toLowerCase()) >= 0 ||
        q.companyLocation.toLowerCase().search(searchTerm.toLowerCase()) >= 0 ||
        q.vehicle_type_name.toLowerCase().search(searchTerm.toLowerCase()) >= 0,
    );
  }

  if (quotation_type !== 'all') {
    let executive = quotation_type == 'prestige';
    quotations = quotations.filter(q => q.executive == executive);
  }
  if (vehicle_type !== 'all') {
    quotations = quotations.filter(q => q.vehicle_type == vehicle_type);
  }

  // console.log(`vehicle_type: ${vehicle_type}`);
  return (
    <ScrollView
    // scrollEnabled={false} // Disable scrolling
    >
      <View style={{marginBottom: 100, flex: 1}}>
        <HStack style={{marginTop: 10, marginRight: 10}}>
          <QuotationTopCard
            processing={process}
            onQuotationSelect={onQuotationSelect}
            type="lowest"
            quotation={lowestQuote}
          />
          <QuotationTopCard
            rocessing={process}
            onQuotationSelect={onQuotationSelect}
            type="best-rated"
            quotation={bestRatedQuote}
          />
        </HStack>
        {/* <Text>Lower Stack Start</Text> */}
        <HStack style={{marginRight: 10}}>
          <QuotationTopCard
            rocessing={process}
            onQuotationSelect={onQuotationSelect}
            type="top-executive"
            quotation={topExecutiveQuote}
          />
          <QuotationTopCard
            rocessing={process}
            onQuotationSelect={onQuotationSelect}
            type="recommended"
            quotation={recommendedQuote}
          />
        </HStack>
        <View style={{justifyContent: 'space-between', zIndex: 100}}>
          <HStack>
            <Button.Group
              isAttached={true}
              rounded="md"
              p="3"
              _text={{fontSize: 14, fontWeight: 'bold'}}
              colorScheme={colors.PRIMARY}
              _disabled={{bg: colors.YELLOW, color: colors.YELLOW}}
              my="2">
              <Button
                isDisabled={quotation_type == 'all' || processing}
                onPress={() => {
                  setQuotationType('all');
                }}>
                ALL
              </Button>
              <Button
                isDisabled={quotation_type == 'standard' || processing}
                onPress={() => {
                  setQuotationType('standard');
                }}>
                Standard
              </Button>
              <Button
                isDisabled={quotation_type == 'prestige' || processing}
                onPress={() => {
                  setQuotationType('prestige');
                }}>
                Prestige
              </Button>
            </Button.Group>
            {Platform.OS == 'android' ? (
              <View
                style={{
                  height: 35,
                  width: 130,
                  borderWidth: 0.5,
                  borderColor: colors.YELLOW,
                  backgroundColor: colors.PRIMARY,
                  color: colors.WHITE,
                  borderRadius: 12,
                  marginTop: 20,
                  left: '15%',
                  justifyContent: 'center',
                  // marginRight: 40,
                }}>
                <Picker
                  selectedValue={vehicle_type}
                  isDisabled={processing}
                  mode="dropdown" // Android only
                  dropdownIconColor={colors.WHITE}
                  placeholder={'#323F4B'}
                  onValueChange={itemValue => {
                    // console.log('itemValue', itemValue);
                    setVehicleType(itemValue);
                  }}
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
                  <Picker.Item label="All Fleet Types" value="all" />
                  {fleetTypes.map(ft => (
                    <Picker.Item
                      label={ft?.name}
                      value={ft?._id}
                      key={ft?._id}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={open}
                  setOpen={setOpen}
                  value={vehicle_type}
                  setValue={setVehicleType}
                  items={[
                    {label: 'All Fleet Types', value: 'all'},
                    ...fleetOptions,
                  ]}
                  // setItems={setItems}
                  disabled={processing}
                  placeholder="Select Fleet Type"
                  style={styles.pickerStyle}
                  dropDownContainerStyle={styles.dropDownStyle}
                  textStyle={styles.textStyle}
                  placeholderStyle={styles.placeholderStyle}
                  ArrowUpIconComponent={() => null} // Customize the arrow if needed
                  ArrowDownIconComponent={() => null} // Customize the arrow if needed
                />
              </View>
            )}
          </HStack>
        </View>
        <View>
          <Input
            placeholder="Search By Company or Fleet Type"
            variant="filled"
            width="100%"
            borderRadius="10"
            py="1"
            px="3"
            value={searchTerm}
            onChangeText={val => setSearchTerm(val)}
            InputLeftElement={
              <Icon
                ml="2"
                size="4"
                color="gray.400"
                as={<Ionicons name="ios-search" />}
              />
            }
          />
        </View>
        {quotations.map((item, index) => (
          <HStack
            key={index}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#27323D',
              borderRadius: 12,
              marginVertical: 12,
              paddingHorizontal: 12, // Adding some padding to give breathing room
              justifyContent: 'space-between',
            }}>
            {/* Left side content */}
            <View style={{flex: 1, paddingVertical: 12}}>
              <View>
                <Text style={{color: 'white', fontSize: 12}}>
                  {item.vehicle_type_name}
                </Text>
                <Text style={{color: 'white', fontSize: 18}}>
                  {item.companyName}
                </Text>
              </View>
              <View style={{marginTop: 8}}>
                <Text style={{color: 'white', fontSize: 12}}>
                  {item.companyLocation}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  <StarRating
                    rating={item.companyRatings}
                    onChange={() => {}}
                    starSize={18}
                  />
                </View>
              </View>
            </View>

            {/* Button container */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Button
                style={{margin: 15, paddingVertical: 8}}
                size="xs"
                colorScheme={colors.YELLOW}
                onPress={() => onQuotationSelect(index)}>
                <Text style={{textAlign: 'center'}}>
                  £ {item.totalPrice?.toFixed(2)} {'\n'} Book Now
                </Text>
              </Button>
            </View>
          </HStack>
        ))}
      </View>
    </ScrollView>
  );
};
const QuotationsLoader = () => (
  <View>
    {[0, 1, 2, 3, 4].map(i => (
      <QuotationLoaderSkeleton key={i} />
    ))}
  </View>
);
export default QuotationSelector;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
    padding: 3,
  },
  typeView: {
    margin: 7,
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
    width: 150,
  },
  typeTextView: {
    borderRadius: 12,
    padding: 4,
    alignSelf: 'center',
  },
  typeText: {
    color: 'white',
    fontSize: 10,
  },
  companyText: {
    color: 'white',
    marginTop: 14,
    textAlign: 'center',
  },
  companyVehicleText: {
    color: 'white',
    marginBottom: 14,
    fontSize: 9,
    textAlign: 'center',
  },
  priceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownContainer: {
    height: 35,
    width: 150, // Adjusted width
    borderWidth: 0.5,
    borderColor: colors.YELLOW,
    backgroundColor: colors.PRIMARY,
    borderRadius: 12,
    marginTop: 20,
    // left: '15%',
    justifyContent: 'center',
    zIndex: 100,
  },
  pickerStyle: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.YELLOW,
    height: 35,
  },
  dropDownStyle: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.YELLOW,
  },
  textStyle: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '400',
  },
  placeholderStyle: {
    color: '#323F4B',
  },
});
