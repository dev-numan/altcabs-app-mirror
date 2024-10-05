import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('NOTIFICATION AUTH STATUSSSSS::', authStatus, enabled);
    GetFCMToken();
  }
}

async function GetFCMToken() {
  const fcmtoken = await firebase.messaging().getToken();
  if (fcmtoken) {
    console.log('FCM TOKEN::', fcmtoken);
    await AsyncStorage.setItem('fcmtoken', fcmtoken);
  } else {
    console.warn('no token');
  }
}

export async function requestUserPermissionNotifee() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus === notifee.AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions granted.');
  } else if (
    settings.authorizationStatus === notifee.AuthorizationStatus.DENIED
  ) {
    console.log('Notification permissions denied.');
  }
}
