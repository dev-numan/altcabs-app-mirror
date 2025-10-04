import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

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
  try {
    // Check if notifee is available
    if (!notifee || !notifee.requestPermission) {
      console.log('Notifee not available, skipping notification setup');
      return;
    }

    const settings = await notifee.requestPermission();

    // Check if AuthorizationStatus enum is available
    if (notifee.AuthorizationStatus) {
      if (settings.authorizationStatus === notifee.AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permissions granted.');
      } else if (
        settings.authorizationStatus === notifee.AuthorizationStatus.DENIED
      ) {
        console.log('Notification permissions denied.');
      }
    } else {
      // Fallback: check settings directly
      console.log('Notifee permission settings:', settings);
    }
  } catch (error) {
    console.log('Error requesting notifee permissions:', error);
  }
}
