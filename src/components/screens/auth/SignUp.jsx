import {useNavigation} from '@react-navigation/native';

import React, {createRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import {REGISTRATION} from '../../../store/slices/auth.slice';
import {ERROR} from '../../../store/slices/message.slice';
import {Text, Input, HStack, Center, IconButton, Icon} from 'native-base';
import CustomButton from '../../common/CustomButton';
import SavingModal from '../../common/SavingModal';
import colors from '../../../constants/colors';
const SignUp = () => {
  // const initial = {
  //   name: 'Usman Akram Test User',
  //   email: 'usman.akram1@gmail.com',
  //   password: 'usman123',
  //   cPassword: 'usman123',
  // };
  const initial = {
    name: '',
    email: '',
    password: '',
    cPassword: '',
  };
  const [form, setForm] = useState(initial);
  const [model, setModel] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let schema = yup.object().shape({
    name: yup.string().required('Please Provide Your name!'),
    email: yup.string().email().required('Please Provide Your email!'),
    password: yup.string().min(8).required('Please Provide Your Password!'),
  });
  const list = [
    {
      name: `Your Name`,
      label: `Name`,
      value: form?.name,
      ref: createRef(),
      blur: false,
      submitType: 'next',
      change: text => setForm({...form, name: text}),
      show: true,
      secureTextEntry: false,
      nextIndex: 1,
    },
    {
      name: 'Email',
      label: 'Email',
      value: form.email,
      ref: createRef(),
      blur: false,
      submitType: 'next',
      change: text => setForm({...form, email: text}),
      show: true,
      secureTextEntry: false,
      nextIndex: 2,
    },
    {
      name: 'Password',
      value: form.password,
      label: 'Password',
      ref: createRef(),
      blur: false,
      submitType: 'next',
      change: text => setForm({...form, password: text}),
      show: true,
      secureTextEntry: true,
      nextIndex: 3,
    },
    {
      name: 'Confirm Password',
      value: form.cPassword,
      label: 'Confirm Password',
      ref: createRef(),
      blur: true,
      submitType: 'done',
      change: text => setForm({...form, cPassword: text}),
      show: true,
      secureTextEntry: true,
      nextIndex: -1,
    },
  ];
  const handelData = async () => {
    let data = {...form};
    data.email = data.email.toLowerCase();
    delete data.cPassword;

    if (form.name.length > 4) {
      if (form.cPassword === form.password) {
        try {
          await schema.validate(data);
          await dispatch(REGISTRATION({...data, is_google: false})).unwrap();
          navigation.navigate('Confirmation', {email: data.email});
        } catch (err) {
          console.log(err.message);
          dispatch(ERROR(err.message));
        }
      } else {
        dispatch(ERROR('Password not Matched!'));
      }
    }
    else{
      dispatch(ERROR('Name should contain atleast 5 characters'));

    }

    
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView
        style={{backgroundColor: 'white'}}
        contentContainerStyle={{display: 'flex'}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={{margin: 20}}>
          <Center>
            <Image
              source={require('../../../assets/images/altcabsNewLongLogo2.png')}
              style={styles.image}
            />
            <Text
              fontSize="sm"
              fontWeight="bold"
              marginVertical={7}
              color="gray">
              Sign Up to get started!
            </Text>
          </Center>
          <View style={{height: 40}}></View>

          {list.map(
            (item, i) =>
              item.show && (
                <View key={i} style={{marginVertical: 7}}>
                  <Input
                    label={item.label}
                    placeholder={item?.name}
                    value={item.value}
                    dense
                    _focus={{borderColor: '#1C2B39'}}
                    onChangeText={item.change}
                    ref={item.ref}
                    onSubmitEditing={() => {
                      item.nextIndex !== -1 &&
                        list[item.nextIndex].ref.current.focus();
                    }}
                    variant="filled"
                    borderRadius={8}
                    height={52}
                    borderWidth={1}
                    borderColor="#E5E7EB"
                    backgroundColor={colors.WHITE}
                    placeholderTextColor={colors.CAPTION}
                    my={2}
                    blurOnSubmit={item.blur}
                    returnKeyType={item.submitType}
                    secureTextEntry={item.secureTextEntry}
                    fontSize="lg"
                    autoCapitalize={
                      item.label === 'Email' ? 'none' : 'sentences'
                    }
                  />
                </View>
              ),
          )}
          <CustomButton
            rounded="full"
            my={3}
            disabled={model}
            onPress={handelData}>
            Register
          </CustomButton>
          <Text
            style={{
              margin: 12,
              textAlign: 'center',
              color: 'rgb(28, 43, 57)',
               fontSize: 14,fontWeight: '600'
            }}>
            Connect with us:
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <HStack alignItems="center" justifyContent="center" my={2}>
              <Text color="rgb(29, 128, 220)" fontSize= '15' fontWeight="600"  >
                Already signed up?
              </Text>
              <Text color="rgb(29, 128, 220)" fontWeight={600} underline fontSize={15}> Login</Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SavingModal visible={model} />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  brand: {
    backgroundColor: '#1C2B39',
    height: 400,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomStartRadius: 220,
    borderBottomEndRadius: 220,
    transform: [{scaleX: 1.5}],
  },
  image: {height: 80, width: 300, resizeMode: 'contain'},
});
