/**
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AuthorizationStatus,
  EventType,
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory,
} from '@notifee/react-native';

import App from './App';
import {name as appName} from './app.json';
import {store} from './src/store';

AppRegistry.registerComponent(appName, () => AltCabsApp);

const linking = {
  prefixes: ['altcabs://', 'altcabs.com://'],
  config: {
    screens: {
      // Profile: 'Profile',
      // MyBookings: 'MyBookings',
      // MyDetails: 'MyDetails',
      // SettingsScreen: 'settingsscreen',
    },
    // screens: {
    //   NoBottom: {
    //     screens: {
    //       profile: 'MyBookings',
    //       // MyBookings: 'MyBookings',
    //       MyDetails: 'MyDetails',
    //     },
    //   },
    //   App: 'MainStack',
    // },
  },
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('MESSAGE HANDLED IN BACKGROUND::', remoteMessage);
  onDisplayNotification(remoteMessage?.notification);
});

messaging().onMessage(async remoteMessage => {
  console.log('MESSAGE HANDLED IN Foreground::', remoteMessage);
  onDisplayNotification(remoteMessage?.notification);
});

async function onDisplayNotification(data) {
  // console.log('onDisplayNotification', data);
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'ringtone',
    badge: false,
    vibration: true,
    vibrationPattern: [300, 500],
    visibility: AndroidVisibility.PUBLIC,
  });

  // Display a notification
  await notifee.displayNotification({
    title: data.title,
    body: data.body,
    ongoing: true,

    android: {
      channelId,
      color: '#4caf50',
      showTimestamp: true,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
      timestamp: Date.now(),
      // smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

const AltCabsApp = () => {
  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <NativeBaseProvider>
          <App />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};
