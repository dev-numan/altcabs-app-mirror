import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../components/screens/auth/Login';
import SignUp from '../components/screens/auth/SignUp';
import {useSelector} from 'react-redux';
import Introduction from '../components/screens/general/Introduction';

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  const {IS_NEWLY_INSTALLED} = useSelector(state => state.Intro);
  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      initialRouteName={IS_NEWLY_INSTALLED ? 'Introduction' : 'Start'}>
      <Stack.Screen
        name="Introduction"
        component={Introduction}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
