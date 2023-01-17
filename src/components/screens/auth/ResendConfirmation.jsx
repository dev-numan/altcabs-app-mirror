import {useNavigation, useRoute} from '@react-navigation/core';
import {Button} from 'native-base';
import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import authService from '../../../api/authService';
import colors from '../../../constants/colors';
import Center from '../../common/Center';
import CustomButton from '../../common/CustomButton';

const ResendConfirmation = () => {
  const {
    params: {email},
  } = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleResend = async () => {
    await authService.resendVerificationEmail(email);
  };
  return (
    <View style={{margin: 20, flex: 1, backgroundColor: colors.WHITE}}>
      <ScrollView>
        <Center>
          <Image
            source={require('../../../assets/images/faliedemail.png')}
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
          Didn't Receive Email
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
          You can resend the verification Email.
        </Text>
        <Button
          rounded="full"
          variant="ghost"
          _text={{fontSize: 'lg'}}
          onPress={handleResend}
          colorScheme="red">
          Resend
        </Button>

        <CustomButton my={4} onPress={() => navigation.navigate('Login')}>
          Go Back
        </CustomButton>
      </ScrollView>
    </View>
  );
};

export default ResendConfirmation;

const styles = StyleSheet.create({});
