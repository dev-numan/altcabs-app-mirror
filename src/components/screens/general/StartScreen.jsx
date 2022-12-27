import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, Center, Icon, Button} from 'native-base';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../common/CustomButton';
import colors from '../../../constants/colors';

const StarterScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <View style={styles.brand}>
        <Image
          source={require('../../../assets/images/altcabsNewLongLogo.png')}
          style={styles.image}
          resizeMode="stretch"
          alt="logo"
        />
      </View>
      <Center my={3}>
        <Text fontSize="2xl" fontWeight="bold">
          Ride a Cab
        </Text>
      </Center>
      <Center my={3}>
        <Text fontSize="sm" style={{textAlign: 'center', width: '70%'}}>
          Become a member at <Text style={{color: '#1C2B39'}}>Altcabs</Text> and
          book your car with ease.
        </Text>
      </Center>
      <Button
        variant="outline"
        m={5}
        borderColor="#1C2B39"
        _text={{color: '#1C2B39'}}
        _pressed={{bg: '#141e28', _text: {color: 'white'}}}
        rounded={80}
        onPress={() => navigation.navigate('Login')}
        startIcon={
          <Icon
            as={MaterialCommunityIcons}
            name="email"
            size={8}
            color="rose.500"
            style={{flexGrow: 0.5}}
          />
        }>
        LOGIN
      </Button>
      <Center>
        <Text fontSize="lg">or</Text>
      </Center>
      <CustomButton
        mx={4}
        rounded="full"
        onPress={() => navigation.navigate('Sign Up')}>
        Create Account
      </CustomButton>
    </View>
  );
};

export default StarterScreen;

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
  image: {height: 70, width: '50%'},
});
