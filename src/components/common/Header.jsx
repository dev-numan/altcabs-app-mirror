import {Icon, IconButton} from 'native-base';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import HStack from './HStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';
import colors from '../../constants/colors';
const Header = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={{width: '100%', marginTop: '1%'}}>
      <HStack style={styles.header}>
        {/* <IconButton
          icon={<Icon size="lg" as={Ionicons} name="menu" />}
          style={{borderRadius: 25}}
          _icon={{color: colors.PRIMARY}}
          // _pressed={{bg: colors.PRIMARY, _icon: {color: colors.WHITE}}}
          onPress={() => navigation.openDrawer()}
        /> */}
        <HStack
          style={[styles.header, {width: '100%', justifyContent: 'center'}]}>
          {/* <Text style={[styles.headerTitle]}>Cab</Text> */}
          <Text style={[styles.headerTitle, {fontWeight: 'bold'}]}>
            {/* {title} */}
            altCABS
          </Text>
        </HStack>
      </HStack>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    margin: 2,
    color: colors.PRIMARY,
    // backgroundColor: colors.LightBg,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 600,
    color: colors.PRIMARY,
  },
});
