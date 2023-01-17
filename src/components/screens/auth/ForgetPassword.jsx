import {useNavigation} from '@react-navigation/native';
import {Center, HStack, Input} from 'native-base';
import React from 'react';
import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import CustomButton from '../../common/CustomButton';
import colors from '../../../constants/colors';

import authService from '../../../api/authService';
import {
  SET_IS_PROCESSING,
  SET_IS_PROCESSING_FINISHED,
} from '../../../store/slices/loading.slice';
import {ERROR, SUCCESS} from '../../../store/slices/message.slice';

const ForgetPassword = () => {
  const [email, setEmail] = useState('usman.akram@gmail.com');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      dispatch(SET_IS_PROCESSING('Sending'));
      let res = await authService.forgetPassword(email);
      dispatch(SUCCESS(res.message));
      setEmail('');
      dispatch(SET_IS_PROCESSING_FINISHED());
    } catch (error) {
      console.log(error);
      dispatch(ERROR(error));
      dispatch(SET_IS_PROCESSING_FINISHED());
    }
  };
  return (
    <View style={{flex: 1, padding: 20, backgroundColor: colors.WHITE}}>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'justify',
          color: colors.PRIMARY,
        }}>
        Provide us with your email, where we can send you instructions
      </Text>

      <Input
        variant="filled"
        value={email}
        _focus={{borderColor: colors.PRIMARY}}
        placeholder="Email Address"
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        style={{marginVertical: 7}}
        fontSize="lg"
      />
      <CustomButton width="full" rounded="full" onPress={handleLogin}>
        Send
      </CustomButton>

      <HStack alignItems="center" justifyContent="center" my={2}>
        <Text color="#5d7280" fontSize="md">
          Already signed up?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text _text={{fontSize: 16, color: colors.PRIMARY}}> Login</Text>
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({});
