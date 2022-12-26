import React from 'react';
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
const Login = () => {
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
