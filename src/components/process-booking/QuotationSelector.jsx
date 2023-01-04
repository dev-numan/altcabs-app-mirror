import {Button, HStack, Select, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import bookingService from '../../api/BookingService';
import colors from '../../constants/colors';
import {selectFleetTypes} from '../../store/selectors';
import {SUCCESS} from '../../store/slices/message.slice';
import CustomButton from '../common/CustomButton';
import QuotationLoaderSkeleton from '../common/skeletons/QuotationLoaderSkeleton';
import QuotationLogo from './partials/QuotationLogo';

const QuotationSelector = ({booking}) => {
  const dispatch = useDispatch();
  const fleetTypes = useSelector(selectFleetTypes);
  const [vehicle_type, setVehicleType] = useState('all');
  const [quotation_type, setQuotationType] = useState('all'); // all, standard, prestige
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [state, setState] = useState({
    quotations: [],
    topCards: {},
    fetched: false,
  });
  const fetchBooking = () => {
    bookingService
      .getQuotationsById(booking._id, {
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
        setFetching(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    //enable in production as this component will be loaded even when the new quotations are being calculated
    // setTimeout(fetchBooking, 1000);
    // setTimeout(fetchBooking, 2000);
    // setTimeout(fetchBooking, 3000);
    // setTimeout(fetchBooking, 4000);
    // setTimeout(fetchBooking, 5000);
  }, []);
  useEffect(() => {
    setFetching(true);
    fetchBooking();
  }, [page, per_page, vehicle_type, quotation_type]);
  let quotations = state.quotations;
  const onQuotationSelect = index => {
    console.log(index);
  };
  //   console.log(
  //     quotations
  //       .slice(0, 1)
  //       .map(q => 'http://altcabs.com/fleet-types-icons/' + q.vehicle_type),
  //   );
  return (
    <View style={{margin: 14}}>
      <View style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button.Group isAttached={true}>
          <CustomButton
            size={'xs'}
            isDisabled={quotation_type == 'all'}
            onPress={() => {
              setQuotationType('all');
            }}>
            ALL
          </CustomButton>
          <CustomButton
            size={'xs'}
            isDisabled={quotation_type == 'standard'}
            onPress={() => {
              setQuotationType('standard');
            }}>
            Standard
          </CustomButton>
          <CustomButton
            size={'xs'}
            isDisabled={quotation_type == 'prestige'}
            onPress={() => {
              setQuotationType('prestige');
            }}>
            Prestige
          </CustomButton>
        </Button.Group>
        <Select
          selectedValue={vehicle_type}
          // minWidth="100"
          accessibilityLabel="Filter By Fleet Type"
          placeholder="Filter By Fleet Type"
          variant="filled"
          _focus={{borderColor: colors.PRIMARY}}
          _selectedItem={{
            bg: colors.PRIMARY,
            _text: {color: 'white'},
          }}
          mt={1}
          onValueChange={itemValue => setVehicleType(itemValue)}>
          <Select.Item label="all" value="all" />
          {fleetTypes.map(ft => (
            <Select.Item label={ft.name} value={ft._id} key={ft._id} />
          ))}
        </Select>
      </View>
      {!state.fetched || fetching ? (
        <QuotationsLoader />
      ) : (
        <>
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
                <Text style={styles.priceText}>
                  {item.priceToCharge.toFixed(2)}$
                </Text>
                <TouchableOpacity
                  onPress={() => onQuotationSelect(item.index)}
                  style={[
                    styles.typeTextView,
                    {backgroundColor: '#FB2681', padding: 8, borderRadius: 7},
                  ]}>
                  <Text style={styles.typeText}>Book Now</Text>
                </TouchableOpacity>
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
