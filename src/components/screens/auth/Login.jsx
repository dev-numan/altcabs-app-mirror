import React, {useState} from 'react';
import {
  Text,
  Input,
  HStack,
  Center,
  IconButton,
  Icon,
  Image,
} from 'native-base';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import CustomButton from '../../common/CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../constants/colors';
import {LOGIN} from '../../../store/slices/auth.slice';
import {useNavigation} from '@react-navigation/native';
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [login, setLogin] = useState({
    username: 'usman.akram@gmail.com',
    password: 'usman',
  });
  const handleLogin = async () => {
    let data = {
      email: login.username.toLowerCase(),
      password: login.password,
    };
    try {
      await dispatch(LOGIN(data)).unwrap();
    } catch (err) {
      if (err === 'Your Email is not verified!') {
        navigation.navigate('Resend Confirmation', {email: data.email});
      }
      console.log(err);
    }
  };
  const signIn = () => {};
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.WHITE,
      }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <HStack justifyContent="center" mt={5}>
          <View style={{width: 300, marginTop: 50}}>
            <Center>
              <Image
                source={require('../../../assets/images/altcabsNewLongLogo2.png')}
                style={styles.image}
                alt="altCabs"
              />
            </Center>
            <View style={{height: 80}}></View>
            <Input
              variant="filled"
              value={login.username}
              _focus={{borderColor: '#1C2B39'}}
              placeholder="Email Address"
              onChangeText={text => setLogin({...login, username: text})}
              autoCapitalize="none"
              style={{marginVertical: 7}}
              fontSize="lg"
            />
            <Input
              variant="filled"
              fontSize="lg"
              _focus={{borderColor: '#1C2B39'}}
              value={login.password}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={text => setLogin({...login, password: text})}
              autoCapitalize="none"
              style={{marginVertical: 7}}
            />
            <CustomButton rounded="full" onPress={handleLogin}>
              Login
            </CustomButton>
            <Text
              style={{
                margin: 12,
                textAlign: 'center',
                color: 'rgb(28, 43, 57)',
              }}>
              Connect with us:
            </Text>
            <HStack
              space={3}
              my={3}
              alignItems="center"
              justifyContent="center">
              <Center>
                <IconButton
                  onPress={signIn}
                  variant="solid"
                  rounded={25}
                  bg="#ea4335"
                  icon={
                    <Icon
                      size="md"
                      as={<AntDesign name="google" />}
                      color="white"
                    />
                  }
                />
              </Center>
            </HStack>
            <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
              <Text style={{color: 'rgb(28, 43, 57)', textAlign: 'center'}}>
                New to altCabs? Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginVertical: 12}}
              onPress={() => navigation.navigate('Forget Password')}>
              <Text
                style={{
                  color: 'rgb(28, 43, 57)',
                  textAlign: 'center',
                  fontSize: 11,
                }}>
                Forgott Password ?
              </Text>
            </TouchableOpacity>
          </View>
        </HStack>
      </ScrollView>
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  image: {
    height: 50,
    width: '88%',
    resizeMode: 'contain',
  },
});
