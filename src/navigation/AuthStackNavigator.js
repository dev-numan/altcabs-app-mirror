import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../components/screens/auth/Login';
import SignUp from '../components/screens/auth/SignUp';
import {useSelector} from 'react-redux';
import Introduction from '../components/screens/general/Introduction';
import StarterScreen from '../components/screens/general/StartScreen';
import ForgetPassword from '../components/screens/auth/ForgetPassword';
import Confirmation from '../components/screens/auth/Confirmation';
import ResendConfirmation from '../components/screens/auth/ResendConfirmation';

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  const Intro = useSelector(state => state.Intro);
  
  const {IS_NEWLY_INSTALLED} = Intro;

  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      initialRouteName={IS_NEWLY_INSTALLED ? 'Introduction' : 'Start'}>
        <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="Introduction"
        component={Introduction}
        options={{headerShown: false}}
      />
      
      <Stack.Screen name="Sign Up" component={SignUp} />
      <Stack.Screen name="Forget Password" component={ForgetPassword} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="Resend Confirmation" component={ResendConfirmation} />
      <Stack.Screen
        name="Start"
        component={StarterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
