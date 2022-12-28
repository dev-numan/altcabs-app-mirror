import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const BottomTab = createBottomTabNavigator();
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, View} from 'native-base';
import {TabBarOptions} from '../constants/NavigationStyle';
const CustomerBottomTagNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Screen1"
      screenOptions={TabBarOptions}>
      <BottomTab.Screen
        name="Cab Compare"
        component={() => (
          <View>
            <Text>Cab Compare</Text>
          </View>
        )}
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
    </BottomTab.Navigator>
  );
};

export default CustomerBottomTagNavigator;
