import {Button, HStack, Select, Text, View, CheckIcon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import bookingService from '../../api/BookingService';
import colors from '../../constants/colors';
import {selectFleetTypes} from '../../store/selectors';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
import CustomButton from '../common/CustomButton';
import QuotationLoaderSkeleton from '../common/skeletons/QuotationLoaderSkeleton';
import QuotationLogo from './partials/QuotationLogo';
import QuotationTopCard from './partials/QuotationTopCard';
import webSocketService from '../../api/WebSocketService';
import {
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} from '../../store/slices/loading.slice';
const QuotationSelector = ({bookingId, nextStep, previousStep}) => {
  const dispatch = useDispatch();
  const {quotationCreated, quotationCreatedFor} = useSelector(
    state => state.booking,
  );
  const fleetTypes = useSelector(selectFleetTypes);
  const [vehicle_type, setVehicleType] = useState('all');
  const [quotation_type, setQuotationType] = useState('all'); // all, standard, prestige
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [state, setState] = useState({
    quotations: [],
    topCards: {},
    fetched: false,
  });
  const fetchQuotations = () => {
    bookingService
      .getQuotationsById(bookingId, {
        vehicle_type,
        quotation_type,
        page,
        per_page,
      })
      .then(data => {
        setState({
          ...state,
          quotations: data.quotations,
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
  useEffect(() => fetchQuotations, []);
  useEffect(() => {
    setFetching(true);
    fetchQuotations();
  }, [page, per_page, vehicle_type, quotation_type, bookingId]);
  useEffect(() => {
    //set booking id to socket
    if (bookingId) webSocketService.setBookingId(bookingId);
  }, []);
  useEffect(() => {
    if (
      quotationCreatedFor &&
      quotationCreated &&
      bookingId &&
      quotationCreatedFor == bookingId
    ) {
      fetchQuotations();
    }
  }, [quotationCreatedFor, quotationCreated]);
  let quotations = state.quotations;
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

  return (
    <View style={{margin: 14}}>
      <View style={{display: 'flex', justifyContent: 'space-between'}}>
        {/* <Text style={{color: 'white', padding: 5}}>
          Booking: {bookingId} Total: {total}
        </Text> */}
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
          <Select
            selectedValue={vehicle_type}
            isDisabled={processing}
            minWidth="150"
            size="xs"
            accessibilityLabel="Filter By Fleet Type"
            placeholder="Filter By Fleet Type"
            variant="underlined"
            _focus={{borderColor: colors.PRIMARY}}
            _selectedItem={{
              bg: colors.PRIMARY,
              _text: {color: 'white'},
              endIcon: <CheckIcon size={1} />,
            }}
            color="white"
            mt={1}
            onValueChange={itemValue => setVehicleType(itemValue)}>
            <Select.Item label="All Fleet Types" value="all" />
            {fleetTypes.map(ft => (
              <Select.Item label={ft.name} value={ft._id} key={ft._id} />
            ))}
          </Select>
        </HStack>
      </View>
      {!state.fetched || fetching ? (
        <QuotationsLoader />
      ) : (
        <>
          <HStack>
            <QuotationTopCard
              processing={process}
              onQuotationSelect={onQuotationSelect}
              type="lowest"
              quotation={state.topCards.lowestQuote}
            />
            <QuotationTopCard
              rocessing={process}
              onQuotationSelect={onQuotationSelect}
              type="best-rated"
              quotation={state.topCards.bestRatedQuote}
            />
          </HStack>
          <HStack>
            <QuotationTopCard
              rocessing={process}
              onQuotationSelect={onQuotationSelect}
              type="top-executive"
              quotation={state.topCards.topExecutiveQuote}
            />
            <QuotationTopCard
              rocessing={process}
              onQuotationSelect={onQuotationSelect}
              type="recommended"
              quotation={state.topCards.recommendedQuote}
            />
          </HStack>
          {quotations.map(item => (
            <HStack
              key={item.index}
              style={{
                alignItems: 'center',
                backgroundColor: '#27323D',
                borderRadius: 12,
                marginVertical: 12,
              }}>
              {/* <QuotationLogo quotation={item} /> */}
              <View style={{marginLeft: 12, flexGrow: 1}}>
                <Text style={{color: 'white', fontSize: 12}}>
                  {item.vehicle_type_name}
                </Text>
                <Text style={{color: 'white', fontSize: 18}}>
                  {item.companyName}
                </Text>
              </View>
              <View style={{marginRight: 12}}>
                <Button
                  size="xs"
                  colorScheme={colors.YELLOW}
                  onPress={() => onQuotationSelect(item.index)}>
                  <Text>
                    £ {item.priceToCharge.toFixed(2)} {'\n'} Book Now
                  </Text>
                </Button>
              </View>
            </HStack>
          ))}
        </>
      )}
    </View>
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
});
