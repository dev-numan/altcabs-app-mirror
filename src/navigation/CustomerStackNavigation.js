import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../components/screens/auth/Login';
import SignUp from '../components/screens/auth/SignUp';
import {useSelector} from 'react-redux';
import Introduction from '../components/screens/general/Introduction';
import StarterScreen from '../components/screens/general/StartScreen';
import CustomerLanding from '../components/screens/customer/CustomerLanding';
import CustomerBottomTabNavigator from './CustomerBottomTabNavigator';
import ProcessBooking from '../components/process-booking/ProcessBooking';
import MyBookings from '../components/screens/customer/MyBookings';
import BookingDetails from '../components/screens/customer/BookingDetails';
import MyDetails from '../components/screens/customer/MyDetails';
import {View} from 'native-base';
import ConfirmedBookings from '../components/screens/customer/account/ConfirmedBookings';
import HistoryBookings from '../components/screens/customer/account/HistoryBookings';
import CustomerBookingChat from '../components/screens/customer/CustomerBookingChat';
import CancelBookingConfirmation from '../components/screens/customer/account/CancelBookingConfirmation';

const Stack = createNativeStackNavigator();

const CustomerStackNavigation = () => {
  const Intro = useSelector(state => state.Intro);
  const {IS_NEWLY_INSTALLED} = Intro;
  console.log(Intro);
  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      // initialRouteName="ProcessBooking"
      // initialRouteName="HistoryBookings"
      // initialRouteName="BookingChat"
      initialRouteName="Customer Landing">
      <Stack.Screen
        name="Customer Landing"
        component={CustomerBottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProcessBooking"
        component={ProcessBooking}
        options={{title: 'Complete Booking'}}
      />
      <Stack.Screen name="MyBookings" component={ConfirmedBookings} />
      <Stack.Screen name="Bookings History" component={HistoryBookings} />
      <Stack.Screen name="Booking Details" component={BookingDetails} />
      <Stack.Screen name="MyDetails" component={MyDetails} />
      <Stack.Screen name="BookingChat" component={CustomerBookingChat} />
      <Stack.Screen
        name="Booking Cancellation Confirmation"
        component={CancelBookingConfirmation}
      />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigation;
