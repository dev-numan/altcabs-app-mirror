import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../components/screens/auth/Login';
import SignUp from '../components/screens/auth/SignUp';
import {useSelector} from 'react-redux';
import Introduction from '../components/screens/general/Introduction';
import StarterScreen from '../components/screens/general/StartScreen';
import CustomerLanding from '../components/screens/customer/CustomerLanding';
import CustomerBottomTagNavigator from './CustomerBottonTabNavigator';
import ProcessBooking from '../components/process-booking/ProcessBooking';
import MyBookings from '../components/screens/customer/MyBookings';
import BookingDetails from '../components/screens/customer/BookingDetails';
import MyDetails from '../components/screens/customer/MyDetails';
import {View} from 'native-base';

const Stack = createNativeStackNavigator();

const CustomerStackNavigation = () => {
  const Intro = useSelector(state => state.Intro);
  const {IS_NEWLY_INSTALLED} = Intro;
  console.log(Intro);
  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      initialRouteName="ProcessBooking"
      initialParams={{bookingId: '63b29c78b31c84727f5910f8'}}>
      <Stack.Screen
        name="Customer Landing"
        component={CustomerBottomTagNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcessBooking"
        component={ProcessBooking}
        options={{title: 'Complete Booking'}}
      />
      <Stack.Screen name="My Bookings" component={MyBookings} />
      <Stack.Screen name="Booking Details" component={BookingDetails} />
      <Stack.Screen name="My Details" component={MyDetails} />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigation;
