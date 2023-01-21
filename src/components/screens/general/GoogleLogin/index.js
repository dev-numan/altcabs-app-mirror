import {GoogleSignin} from '@react-native-google-signin/google-signin';

const GoogleLogin = async () => {
  GoogleSignin.configure({
    // webClientId: '301749509191-0hhmpqujudd35vdg7cehrsesbulr8cmb.apps.googleusercontent.com',
    webClientId:
      '880987390955-7v838m7r1gj8fna0r06mh57m4r34cv59.apps.googleusercontent.com',
    offlineAccess: true,
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo !== '') {
      return {Data: {userInfo}};
    }
  } catch (error) {
    return {Error: {error}};
  }
};

export default GoogleLogin;

export const GoogleSignOut = async () => {
  try {
    const resp = await GoogleSignin.signOut();
    console.log('dada= > ', resp);
  } catch (error) {
    console.error(error);
  }
};
