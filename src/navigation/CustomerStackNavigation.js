import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../components/screens/auth/Login';
import SignUp from '../components/screens/auth/SignUp';
import {useSelector} from 'react-redux';
import Introduction from '../components/screens/general/Introduction';
import StarterScreen from '../components/screens/general/StartScreen';
import CustomerLanding from '../components/screens/customer/CustomerLanding';

const Stack = createNativeStackNavigator();

const CustomerStackNavigation = () => {
  const Intro = useSelector(state => state.Intro);
  const {IS_NEWLY_INSTALLED} = Intro;
  console.log(Intro);
  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      initialRouteName="Customer Landing">
      <Stack.Screen
        name="Customer Landing"
        component={CustomerLanding}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigation;
