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
import SingleQuotationSummary from './partials/SingleQuotationSummary';
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
    // webSocketService.setBookingId(bookingId); // do not connect socket to receive quotations
  }, [bookingId]);
  fleetOptions = useMemo(
    () =>
      fleetTypes.map(ft => ({
        label: ft?.name || 'Unknown',
        value: ft?._id || '',
      })),
    [fleetTypes],
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
    dispatch(
      SET_IS_PROCESSING('Searching Quotes from hundreds of cab operators ...'),
    );
    bookingService
      .getQuotationsById(bookingId)
      .then(data => {
        addQuotationsToScreen(data.quotations);
        // console.log('data.quotations.length');
        // console.log(data.quotations.length);
      })
      .catch(err => {
        console.log('Error in Fetching Quotations');
        console.log(err);
      })
      .finally(() => {
        setFetching(false);
        dispatch(SET_IS_PROCESSING_FINISHED());
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
        let prevQuotations = [...state.quotations];
        let newQuotations = [...prevQuotations, ...data.quotations];
        setState({
          ...state,
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
  useEffect(() => {
    fetchQuotations();
  }, []);

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
    dispatch(SET_IS_PROCESSING('Assigning Quotation ...'));
    bookingService
      .bookNormal(bookingId, index)
      .then(() => {
        nextStep();
      })
      .catch(err => {
        console.log(err);
        dispatch(ERROR('Unable to Select Quotation'));
      })
      .finally(() => {
        setFetching(false);
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
  let bestRatedQuote =
    quotations.length === 0
      ? null
      : quotations.reduce((max, current) =>
          max.companyRatings > current.companyRatings ? max : current,
        );
  let topExecutiveQuote = quotations.find(q => q.executive);
  let recommendedQuote = lowestQuote;

  if (searchTerm) {
    quotations = quotations.filter(
      q =>
        q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.companyLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.vehicle_type_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (quotation_type !== 'all') {
    let executive = quotation_type === 'prestige';
    quotations = quotations.filter(q => q.executive === executive);
  }
  if (vehicle_type !== 'all') {
    quotations = quotations.filter(q => q.vehicle_type === vehicle_type);
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <HStack style={styles.topCardsContainer}>
          {lowestQuote && (
            <SingleQuotationSummary
              processing={processing}
              onQuotationSelect={onQuotationSelect}
              type="lowest"
              quotation={lowestQuote}
              isTopCard={true}
            />
          )}

          <SingleQuotationSummary
            processing={processing}
            onQuotationSelect={onQuotationSelect}
            type="best-rated"
            quotation={bestRatedQuote}
            isTopCard={true}
          />
        </HStack>
        <HStack style={styles.topCardsContainer}>
          <SingleQuotationSummary
            processing={processing}
            onQuotationSelect={onQuotationSelect}
            type="top-executive"
            quotation={topExecutiveQuote}
            isTopCard={true}
          />
          <SingleQuotationSummary
            processing={processing}
            onQuotationSelect={onQuotationSelect}
            type="recommended"
            quotation={recommendedQuote}
            isTopCard={true}
          />
        </HStack>
        <View style={styles.filterContainer}>
          <HStack style={styles.buttonGroupContainer}>
            <Button.Group
              isAttached={true}
              rounded="md"
              p="1"
              _text={{fontSize: 14, fontWeight: 'bold'}}
              colorScheme={colors.PRIMARY}
              _disabled={{bg: colors.muted, color: colors.WHITE}}
              my="1">
              <Button
                isDisabled={quotation_type === 'all' || processing}
                onPress={() => {
                  setQuotationType('all');
                }}>
                ALL
              </Button>
              <Button
                isDisabled={quotation_type === 'standard' || processing}
                onPress={() => {
                  setQuotationType('standard');
                }}>
                Standard
              </Button>
              <Button
                isDisabled={quotation_type === 'prestige' || processing}
                onPress={() => {
                  setQuotationType('prestige');
                }}>
                Prestige
              </Button>
            </Button.Group>
            {Platform.OS === 'android' ? (
              <View style={styles.pickerContainerAndroid}>
                <Picker
                  selectedValue={vehicle_type}
                  enabled={!processing}
                  mode="dropdown"
                  dropdownIconColor="#4F8EF7"
                  onValueChange={itemValue => {
                    setVehicleType(itemValue);
                  }}
                  style={styles.pickerStyleAndroid}>
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
                  disabled={processing}
                  placeholder="Select Fleet Type"
                  style={styles.pickerStyle}
                  dropDownContainerStyle={styles.dropDownStyle}
                  textStyle={styles.textStyle}
                  placeholderStyle={styles.placeholderStyle}
                  ArrowUpIconComponent={() => null}
                  ArrowDownIconComponent={() => null}
                />
              </View>
            )}
          </HStack>
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search by Company or Fleet Type"
              placeholderTextColor="#555" // or any darker color you prefer
              variant="filled"
              width="100%"
              borderRadius="10"
              py="1"
              px="3"
              value={searchTerm}
              style={{
                backgroundColor: colors.WHITE,
                color: colors.DARK_COLOR,
                borderBlockColor: colors.PRIMARY,
              }}
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
        </View>
        {quotations.map((item, index) => (
          <SingleQuotationSummary
            key={index}
            processing={processing}
            onQuotationSelect={onQuotationSelect}
            quotation={item}
            isTopCard={false}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const QuotationsLoader = () => (
  <View style={styles.loaderContainer}>
    {[0, 1, 2, 3, 4].map(i => (
      <QuotationLoaderSkeleton key={i} />
    ))}
  </View>
);

export default QuotationSelector;

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.BACKGROUND,
  },
  mainContainer: {
    marginBottom: 100,
    flex: 1,
    padding: 5,
  },
  topCardsContainer: {
    marginTop: 10,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  filterContainer: {
    marginVertical: 15,
  },
  buttonGroupContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  pickerContainerAndroid: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 2,
    justifyContent: 'center',
    marginLeft: 20,
  },
  pickerStyleAndroid: {
    color: colors.PRIMARY,
    height: 40,
    width: 150,
  },
  dropdownContainer: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    marginLeft: 20,
    zIndex: 100,
  },
  pickerStyle: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    height: 40,
  },
  dropDownStyle: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  textStyle: {
    color: '#333',
    fontSize: 14,
    fontWeight: '400',
  },
  placeholderStyle: {
    color: '#999',
  },
  searchContainer: {
    marginTop: 5,
    // backgroundColor: colors.WHITE,
    paddingHorizontal: 15,
  },
  quotationCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 4,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 10,
  },
  vehicleTypeText: {
    color: '#555',
    fontSize: 12,
    marginBottom: 4,
  },
  companyNameText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '600',
  },
  companyInfoContainer: {
    marginTop: 8,
  },
  companyLocationText: {
    color: '#666',
    fontSize: 12,
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    margin: 10,
    paddingVertical: 8,
    backgroundColor: colors.DARK_COLOR,
  },
  bookButtonText: {
    textAlign: 'center',
    color: '#fff',
  },
  loaderContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },
});
