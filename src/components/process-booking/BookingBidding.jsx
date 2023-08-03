import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {orderBy} from 'lodash';
import QuotationLoaderSkeleton from '../common/skeletons/QuotationLoaderSkeleton';
import {Button, HStack, VStack, View} from 'native-base';
import StarRating from 'react-native-star-rating-widget';
import colors from '../../constants/colors';
import {useDispatch} from 'react-redux';

import {
  LOAD_BOOKING,
  SET_BIDDING_QUOTATION,
} from '../../store/slices/booking.slice';
import bookingService from '../../api/BookingService';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';
const BookingBidding = ({nextStep, hasReturnBooking, bookingId, booking}) => {
  const dispatch = useDispatch();
  if (!booking) return <QuotationLoaderSkeleton />;
  let bids = orderBy(booking.bids, ['offer'], ['asc']);
  return (
    <SafeAreaView style={styles.container}>
      <VStack>
        {bids.map(b => (
          <View
            key={b.created_at}
            style={{borderBottomColor: 'white', borderBottomWidth: 2}}>
            <HStack>
              <View>
                <VStack>
                  <Text style={{color: 'white'}}>{b.companyName}</Text>
                  <StarRating
                    rating={b.companyRating}
                    onChange={() => {}}
                    starSize={18}
                  />
                </VStack>
              </View>
              <View>
                <Text style={{color: 'white'}}>
                  £ {Number(b.offer).toFixed(2)}
                </Text>
              </View>
              <View>
                <Button
                  // style={{paddin}}
                  style={{margin: 15}}
                  size="xs"
                  colorScheme={colors.YELLOW}
                  onPress={() => {
                    bookingService
                      .setBidQuotation(booking._id, b._id)
                      .then(data => {
                        dispatch(LOAD_BOOKING(data.booking));
                        dispatch(SUCCESS('Bid Selected Successfully'));
                        nextStep();
                      })
                      .catch(err => {
                        dispatch(ERROR('Unable to Select Bid'));
                      });
                  }}>
                  <Text>Select</Text>
                </Button>
              </View>
            </HStack>
          </View>
        ))}
      </VStack>
    </SafeAreaView>
  );
};

export default BookingBidding;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
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
});
