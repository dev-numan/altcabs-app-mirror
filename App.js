import React, {useEffect} from 'react';
import {View, Button} from 'native-base';
import Toast from 'react-native-toast-message';
import SplashScreen from './src/components/SplashScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';

import {loadClientApp} from './src/store/slices/app.slice';

import AuthStackNavigator from './src/navigation/AuthStackNavigator';

import {GET_ALL_LUGGAGE} from './src/store/slices/luggage.slice';
import {USER_LOGIN_STATUS} from './src/store/slices/auth.slice';

import CustomerAppDrawerNavigation from './src/navigation/CustomerAppDrawerNavigation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MESSAGE_NULL} from './src/store/slices/message.slice';
import SavingModel from './src/components/common/SavingModal';

const Drawer = createDrawerNavigator();
export default function App() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const msg = useSelector(state => state.Message);
  const {app, isLoadingComplete} = useSelector(state => state.app);
  const IS_LOGGED = useSelector(state => state.Auth.IS_LOGGED);
  console.log(IS_LOGGED);
  const loadApp = async () => {
    await dispatch(GET_ALL_LUGGAGE());
    await dispatch(USER_LOGIN_STATUS());
    setTimeout(() => {
      dispatch(loadClientApp());
    }, 2000);
  };
  useEffect(() => {
    loadApp();
  }, []);
  useEffect(() => {
    if (msg?.message) {
      console.log(msg);
      Toast.show({
        text1: msg.message,
        type: msg.type,
        autoHide: true,
        visibilityTime: 3000,
        position: 'top',
      });
      setTimeout(() => {
        dispatch(MESSAGE_NULL());
      }, 3000);
    }
  }, [msg]);
  console.log(isLoadingComplete);
  if (!isLoadingComplete) return <SplashScreen />;
  if (!IS_LOGGED) return <AuthStackNavigator />;

  // return (
  //   <Drawer.Navigator initialRouteName="Home">
  //     <Drawer.Screen name="Home" component={HomeScreen} />
  //     <Drawer.Screen name="Notifications" component={NotificationsScreen} />
  //   </Drawer.Navigator>
  // );
  return (
    <>
      <CustomerAppDrawerNavigation />
      <SavingModel />
    </>
  );
}

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
