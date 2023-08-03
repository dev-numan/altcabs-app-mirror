import {useNavigation} from '@react-navigation/core';
import {Avatar, Center, Divider, HStack, Icon, VStack} from 'native-base';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';

import {USER_STATUS_LOG_OUT} from '../../../store/slices/auth.slice';
import colors from '../../../constants/colors';
import CustomButton from '../../common/CustomButton';
const Profile = () => {
  const {name} = useSelector(state => state.Auth.TOKEN);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const list = [
    {
      name: 'MyBookings',
      label: 'Confirmed Bookings',
      icon: (
        <MaterialCommunityIcons
          name="car-multiple"
          color={colors.SECONDARY}
          size={28}
          style={{marginBottom: -3}}
        />
      ),
    },
    {
      name: 'BiddingBookings',
      label: 'cabBid Bookings',
      icon: (
        <MaterialCommunityIcons
          name="hammer-wrench"
          color={colors.SECONDARY}
          size={28}
          style={{marginBottom: -3}}
        />
      ),
    },
    {
      name: 'Bookings History',
      label: 'History',
      icon: (
        <MaterialCommunityIcons
          name="history"
          color={colors.SECONDARY}
          size={28}
          style={{marginBottom: -3}}
        />
      ),
    },
    {
      name: 'MyDetails',
      label: 'My Details',
      icon: (
        <MaterialCommunityIcons
          name="account-circle"
          color={colors.SECONDARY}
          size={28}
          style={{marginBottom: -3}}
        />
      ),
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: colors.PRIMARY}}>
      <View>
        <VStack space={3} alignItems="center" style={{margin: 10}}>
          <Center shadow={3}>
            <Avatar
              size="2xl"
              style={{alignSelf: 'center', backgroundColor: colors.SECONDARY}}
              source={require(`../../../assets/images/icon.png`)}>
              FA
            </Avatar>
          </Center>
          <Center space={1}>
            <Text style={styles.title}>
              {name[0].toUpperCase() + name.substr(1)}
            </Text>
          </Center>
        </VStack>
      </View>
      <Divider />
      <View style={{margin: 10}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {list.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(item?.name)}>
              <HStack space={5} alignItems="center" my="2">
                <View style={styles.IconView}>{item.icon}</View>
                <Text style={{flexGrow: 1, color: colors.WHITE}}>
                  {item.label}
                </Text>
                <AntDesign name="right" color={colors.WHITE} size={28} />
              </HStack>
              <Divider />
            </TouchableOpacity>
          ))}
          <CustomButton
            rounded="full"
            colorScheme={colors.SECONDARY}
            _text={{color: colors.PRIMARY}}
            _pressed={{bg: colors.SECONDARY}}
            my="8"
            onPress={() => dispatch(USER_STATUS_LOG_OUT())}>
            Log Out
          </CustomButton>
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginTop: 7,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  IconView: {
    backgroundColor: '#1C2B39',
    borderRadius: 7,
    padding: 7,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
