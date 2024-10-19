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
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import CustomButton from '../../common/CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../constants/colors';
import {LOGIN} from '../../../store/slices/auth.slice';
import {useNavigation} from '@react-navigation/native';
import ContactTextInput from '../general/ContactTextInput';
import GoogleLogin from '../general/GoogleLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [displayPassword, setDisplayPassword] = useState(true);
  const [login, setLogin] = useState({
    username: 'almasakram777@gmail.com',
    password: 'almas',
  });
  const handleLogin = async () => {
    try {
      const fcmtoken = await AsyncStorage.getItem('fcmtoken');
      let data = {
        email: login.username.toLowerCase(),
        password: login.password,
        fcmtoken,
      };

      const resultAction = dispatch(LOGIN(data));

      if (LOGIN?.fulfilled?.match(resultAction)) {
        // The login was successful
        console.log('Login successful');
        // You can navigate to the next screen or perform any other action here
      } else {
        // The login failed
        const errorMessage = resultAction.payload || resultAction.error.message;
        if (errorMessage === 'Your Email is not verified!') {
          navigation.navigate('Resend Confirmation', {email: data.email});
        } else {
          console.log('Login error:', errorMessage);
          // Handle other error messages or display them to the user
        }
      }
    } catch (err) {
      // Handle any unexpected errors
      console.log('Unexpected error:', err);
    }
  };

  const signIn = () => {};
  const handleGoogleLogin = async () => {
    let info = await GoogleLogin();
    console.log('INFO: ', info);

    if (info.Error === undefined) {
      console.log('INFO: ', info);
    } else {
      console.log(JSON.stringify(info.Error));
    }
  };
  return (
    <SafeAreaView
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
            <View style={{marginBottom: 10}}>
              {/* <Input
                variant="filled"
                value={login.username}
                _focus={{borderColor: '#1C2B39'}}
                placeholder="Email Address"
                onChangeText={text => setLogin({...login, username: text})}
                autoCapitalize="none"
                style={{marginVertical: 7, marginBottom: 10}}
                fontSize="lg"
              /> */}
              <ContactTextInput
                // refInner={emailRef}
                placeHolderColor={colors.PRIMARY}
                placeHolder={'Email address'}
                headingName={'Email address'}
                multiline={false}
                value={login.username}
                maxLength={50}
                onChangeText={txt => setLogin({...login, username: txt})}
                keyboardType={'email-address'}
                autoCapitalize="none"
                returnKeyType={'next'}
                blurOnSubmit={false}
                // onSubmitEditing={() => {
                //     passwordRef.current.focus();
                // }}
              />
            </View>
            <View style={{marginBottom: 10}}>
              <ContactTextInput
                // refInner={emailRef}
                placeHolderColor={colors.PRIMARY}
                placeHolder={'Password'}
                headingName={'Password'}
                multiline={false}
                value={login.password}
                maxLength={50}
                onChangeText={txt => setLogin({...login, password: txt})}
                keyboardType={'default'}
                autoCapitalize="none"
                returnKeyType={'next'}
                blurOnSubmit={false}
                secureTextEntry={displayPassword}
                eyeOpen={displayPassword}
                onPress={() => setDisplayPassword(!displayPassword)}
                secureText
                // onSubmitEditing={() => {
                //     passwordRef.current.focus();
                // }}
              />
              {/* <Input
                variant="filled"
                fontSize="lg"
                _focus={{borderColor: '#1C2B39'}}
                value={login.password}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => setLogin({...login, password: text})}
                autoCapitalize="none"
                style={{marginVertical: 7}}
              /> */}
            </View>
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
                  onPress={handleGoogleLogin}
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
    </SafeAreaView>
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
