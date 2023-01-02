import {HStack, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import bookingService from '../../api/BookingService';

const QuotationSelector = ({booking}) => {
  console.log(booking._id);
  console.log(booking.quotations);
  console.log('Inside Quotations');
  const [state, setState] = useState({
    quotations: [],
    topCards: {},
    fetched: false,
  });
  const fetchBooking = () => {
    bookingService
      .getQuotationsById(booking._id)
      .then(data => {
        setState({...state, ...data, fetched: true});
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(fetchBooking, []);
  let quotations = state.quotations;
  const onQuotationSelect = index => {
    console.log(index);
  };
  return (
    <View style={{margin: 14}}>
      {!state.fetched ? (
        <Text style={{color: 'white'}}>Loading Quotations</Text>
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
              <Image
                source={require('../../assets/images/car.png')}
                style={{height: 80, width: 80, margin: 7}}
              />
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
