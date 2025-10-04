import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const BottomTab = createBottomTabNavigator();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, View} from 'native-base';
import {TabBarOptions} from '../constants/NavigationStyle';
import CabCompare from '../components/screens/customer/CabCompare';
import Profile from '../components/screens/customer/Profile';

const CustomerBottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Cab Compare"
      screenOptions={TabBarOptions}>
      <BottomTab.Screen
        name="Cab Compare"
        component={CabCompare}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="car-multiple"
              color={color}
              size={20}
              style={{marginBottom: -3}}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesome
              name="user"
              color={color}
              size={20}
              style={{marginBottom: -3}}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default CustomerBottomTabNavigator;
