import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomerAppDrawer from './CustomerAppDrawer';
import CustomerStackNavigation from './CustomerStackNavigation';

const Drawer = createDrawerNavigator();
const CustomerAppDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        contentContainerStyle: {
          flex: 1,
        },
      }}
      defaultStatus="closed"
      drawerContent={props => <CustomerAppDrawer {...props} />}>
      <Drawer.Screen
        name="Main"
        component={CustomerStackNavigation}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
};

export default CustomerAppDrawerNavigation;
