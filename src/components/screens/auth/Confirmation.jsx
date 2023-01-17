import {useNavigation, useRoute} from '@react-navigation/core';
import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import CustomButton from '../../common/CustomButton';
import Center from '../../common/Center';
import colors from '../../../constants/colors';

const Confirmation = () => {
  const {
    params: {email},
  } = useRoute();
  const navigation = useNavigation();
  return (
    <View style={{margin: 20, flex: 1, backgroundColor: colors.WHITE}}>
      <ScrollView>
        <Center>
          <Image
            source={require('../../../assets/images/email.png')}
            style={{height: 350, width: '100%', resizeMode: 'contain'}}
          />
        </Center>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20,
            marginVertical: 14,
          }}>
          Confirm your email address
        </Text>
        <Text style={{textAlign: 'center', fontSize: 20, marginVertical: 14}}>
          We sent an email to:
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 20,
            marginVertical: 14,
          }}>
          {email}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 20, marginVertical: 14}}>
          Check your email and click on the link to confirm your account.
        </Text>
        <CustomButton my={4} onPress={() => navigation.navigate('Login')}>
          Go Back
        </CustomButton>
      </ScrollView>
    </View>
  );
};

export default Confirmation;

const styles = StyleSheet.create({});
