import React from 'react';
import {Image} from 'react-native';

const QuotationLogo = ({quotation}) => {
  console.log('http://altcabs.com/fleet-types-icons/' + quotation.vehicle_type);
  return (
    <Image
      //   source={require('../../../assets/images/car.png')}
      source={{
        //   uri: 'http://altcabs.com/fleet-types-icons/' + quotation.vehicle_type,
        url: 'http://reactnative.dev/img/tiny_logo.png',
      }}
      style={{
        height: 80,
        width: 80,
        margin: 7,
      }}
    />
  );
};

export default QuotationLogo;
