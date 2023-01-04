import {Text, View} from 'native-base';
import React from 'react';
import Surface from '../common/Surface';
import moment from 'moment';
import {Button, HStack} from 'native-base';

import {Image, ScrollView, StyleSheet} from 'react-native';
const QuotationSuccess = ({booking}) => {
  const color = 'rgba(118,75,162,1.0)';
  const darkShadeColor = '#472d61';
  const onNext = () => {};
  return (
    <View style={{margin: 14}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface style={styles.DetailsView}>
          <Text style={styles.title}>Journey Details</Text>
          <Text style={styles.heading}>Ref# {booking.reference}</Text>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Price</Text>
            <Text style={styles.rightText}>{booking.totalPrice}$</Text>
          </HStack>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Departure</Text>
            <Text style={styles.rightText}>
              {moment(booking.startTime).format('LLL')}
            </Text>
          </HStack>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Drop Off</Text>
            <Text style={styles.rightText}>{booking.to_desc}</Text>
          </HStack>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Pick Up</Text>
            <Text style={styles.rightText}> {booking.from_desc}</Text>
          </HStack>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Duration</Text>
            <Text style={styles.rightText}>{booking.durationText}</Text>
          </HStack>
        </Surface>
        <Surface style={styles.DetailsView}>
          <Text style={styles.title}>Vehicle Details</Text>
          <Text style={styles.heading}>{booking?.vehicle_type_name}</Text>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Company</Text>
            <Text style={styles.rightText}>{booking?.companyName}</Text>
          </HStack>
          <HStack style={styles.HStack}>
            <Text style={styles.leftText}>Vehicle Type</Text>
            <Text style={styles.rightText}>{booking?.type}</Text>
          </HStack>
        </Surface>
        <Image
          source={{uri: booking.staticmap}}
          style={{height: 250, borderRadius: 14, marginVertical: 14}}
        />
        <Button
          my="4"
          rounded="full"
          colorScheme={color}
          _text={{color: 'white'}}
          onPress={onNext}
          _pressed={{bg: darkShadeColor}}>
          Go Back
        </Button>
      </ScrollView>
    </View>
  );
};

export default QuotationSuccess;
const styles = StyleSheet.create({
  DetailsView: {
    backgroundColor: '#405263',
    padding: 7,
    marginVertical: 12,
  },
  HStack: {
    alignItems: 'center',
    margin: 12,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  leftText: {
    color: 'white',
    fontSize: 14,
    flexGrow: 1,
  },
  rightText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    width: '52%',
    textAlign: 'right',
  },
});
