import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconButton, Icon} from 'native-base';
import colors from './colors';

export const light = {
  header: {
    backgroundColor: {
      primary: '#1C2B39',
    },
    drawer: {},
  },
};

export const BottomHeaderOption = ({navigation}) => {
  return {
    headerStyle: {
      backgroundColor: colors.PRIMARY,
    },
    headerTitleStyle: {color: colors.WHITE},
    headerTitleAlign: 'center',
    headerTintColor: colors.WHITE,
    headerLeftContainerStyle: {paddingLeft: 10},
    headerRightContainerStyle: {paddingRight: 10},
    headerShown: false,
    headerShadowVisible: false,
    headerLeft: () => (
      <IconButton
        icon={
          <Icon size="sm" as={Ionicons} name="menu" color={colors.SECONDARY} />
        }
        style={{borderRadius: 25}}
        _pressed={{bg: colors.SECONDARY, _icon: {color: colors.WHITE}}}
        onPress={() => navigation.openDrawer()}
      />
    ),
  };
};

export const TransparentStackHeaderOption = ({navigation}) => {
  return {
    headerTitleAlign: 'center',
    headerTransparent: true,
    headerShown: true,
  };
};

export const StackHeaderOption = ({navigation}) => {
  return {
    headerStyle: {
      backgroundColor: colors.PRIMARY,
    },
    headerTitleStyle: {color: colors.WHITE},
    headerTitleAlign: 'center',
    headerTintColor: colors.WHITE,
    headerLeftContainerStyle: {paddingLeft: 10},
    headerRightContainerStyle: {paddingRight: 10},
    headerBackTitle: '',
    headerShadowVisible: false,
  };
};

export const TabBarOptions = {
  tabBarActiveTintColor: colors.PRIMARY,
  headerShown: false,

  tabBarStyle: {
    backgroundColor: colors.WHITE,
  },
  tabBarInActiveTintColor: colors.IN_ACTIVE_TAB_BAR,
};
