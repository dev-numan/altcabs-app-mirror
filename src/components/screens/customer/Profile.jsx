import {useNavigation} from '@react-navigation/core';
import {Avatar, Center, Divider, HStack, VStack} from 'native-base';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {USER_STATUS_LOG_OUT} from '../../../store/slices/auth.slice';
import colors from '../../../constants/colors';
import CustomButton from '../../common/CustomButton';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Pull the user's name from Redux
  const {name} = useSelector(state => state.Auth.TOKEN);

  // The list of items for the user's booking screens
  const list = [
    {
      name: 'MyBookings',
      label: 'Confirmed Bookings',
      icon: (
        <MaterialCommunityIcons
          name="car-multiple"
          color={colors.DARK_COLOR}
          size={24}
        />
      ),
    },
    {
      name: 'BiddingBookings',
      label: 'cabBid Bookings',
      icon: (
        <MaterialCommunityIcons
          name="hammer-wrench"
          color={colors.DARK_COLOR}
          size={24}
        />
      ),
    },
    {
      name: 'Bookings History',
      label: 'History',
      icon: (
        <MaterialCommunityIcons
          name="history"
          color={colors.DARK_COLOR}
          size={24}
        />
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={{paddingHorizontal: 16}}>
        {/* Top Card with user avatar & name */}
        <View style={styles.userCard}>
          <Center>
            <Avatar
              size="xl"
              bg="#64B5F6" // Light bluish background for avatar
              source={require('../../../assets/images/icon.png')}
            >
              {/* Fallback letters if no image */}
              {name?.[0]?.toUpperCase() || ''}
            </Avatar>
            <Text style={styles.userName}>
              {name ? name[0].toUpperCase() + name.substr(1) : 'User'}
            </Text>
          </Center>
        </View>

        {/* The booking items in a white card */}
        <View style={styles.listCard}>
          {list.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.listItem}
              onPress={() => navigation.navigate(item.name)}
            >
              <HStack alignItems="center" space={3}>
                <View style={styles.iconCircle}>{item.icon}</View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <AntDesign
                  name="right"
                  color="#757575"
                  size={20}
                  style={{marginLeft: 'auto'}}
                />
              </HStack>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider before the logout button */}
        <Divider my="4" />

        {/* Logout button */}
        <View style={{marginTop: 12}}>
          <CustomButton
            bg={colors.DARK_COLOR}
            _text={{color: '#fff', fontSize: 16, fontWeight: '600'}}
            _pressed={{bg: colors.DARK_COLOR}}
            onPress={() => dispatch(USER_STATUS_LOG_OUT())}
          >
            Log Out
          </CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND, // Light blue background
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 24,
    marginTop: 16,
    marginBottom: 16,
    // Optional shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    // Optional shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    paddingVertical: 8,
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: '#E0E0E0',
    // borderBottomWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});