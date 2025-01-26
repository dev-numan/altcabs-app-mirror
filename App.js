import React, {useEffect} from 'react';
import {View, Button} from 'native-base';
import Toast from 'react-native-toast-message';
import SplashScreen from './src/components/SplashScreen';
import {useDispatch, useSelector} from 'react-redux';

import {loadClientApp} from './src/store/slices/app.slice';

import AuthStackNavigator from './src/navigation/AuthStackNavigator';

import {GET_ALL_LUGGAGE} from './src/store/slices/luggage.slice';
import {USER_LOGIN_STATUS} from './src/store/slices/auth.slice';

import CustomerAppDrawerNavigation from './src/navigation/CustomerAppDrawerNavigation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MESSAGE_NULL, SUCCESS} from './src/store/slices/message.slice';
import SavingModel from './src/components/common/SavingModal';
import {GET_ALL_SETTINGS} from './src/store/slices/settings.slice';
import webSocketService from './src/api/WebSocketService';
import {QUOTATION_CREATED} from './src/store/slices/booking.slice';
import {Linking} from 'react-native';
import {
  requestUserPermission,
  requestUserPermissionNotifee,
} from './src/utils/PushNotificationHelper';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';
const Drawer = createDrawerNavigator();
export default function App() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const msg = useSelector(state => state.Message);
  const {app, isLoadingComplete} = useSelector(state => state.app);
  const IS_LOGGED = useSelector(state => state.Auth.IS_LOGGED);

  const loadApp = async () => {
    dispatch(GET_ALL_SETTINGS());
    // await dispatch(GET_ALL_LUGGAGE());
    dispatch(USER_LOGIN_STATUS());
    setTimeout(() => {
      dispatch(loadClientApp());
    }, 2000);
  };

  useEffect(() => {
    console.log('FCM PERMISSION IN USEEFFECt');
    requestUserPermission();
    requestUserPermissionNotifee();
  }, []);

  useEffect(() => {
    loadApp();
    Linking.addEventListener('url', function () {
      console.log('Open from link');
    });
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('URL: ', url);
      }
    });
    // dispatch(SUCCESS('App Loaded'));
  }, []);
  useEffect(() => {
    if (isLoadingComplete) {
      console.log('Attaching function to web socket event');
      webSocketService.on(
        'quotes-added-to-booking',
        (booking_id, quotations) => {
          // console.log('Quotations Received for booking id ' + booking_id);
          // console.log(quotations);
          dispatch(QUOTATION_CREATED({booking_id, quotations}));
        },
      );
    }
  }, [isLoadingComplete]);
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

  if (!isLoadingComplete) return <SplashScreen />;
  // if (!IS_LOGGED) return <AuthStackNavigator />;

  // return (
  //   <Drawer.Navigator initialRouteName="Home">
  //     <Drawer.Screen name="Home" component={HomeScreen} />
  //     <Drawer.Screen name="Notifications" component={NotificationsScreen} />
  //   </Drawer.Navigator>
  // );
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {IS_LOGGED ? <CustomerAppDrawerNavigation /> : <AuthStackNavigator />}

        <SavingModel />
        <Toast />
      </PersistGate>
    </Provider>
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
