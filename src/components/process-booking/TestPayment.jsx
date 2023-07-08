import {Button, Text, View} from 'native-base';
import {Linking} from 'react-native';
import React from 'react';
const TestPayment = ({}) => {
  return (
    <View>
      <Button
        onPress={() => {
          Linking.openURL(
            'https://sandboxcheckout.rapyd.net/v2?token=checkout_e4e291b53e592c22885bfb1bf7e0ff7d',
          );
        }}>
        Test Payment
      </Button>
    </View>
  );
};

export default TestPayment;
