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
import TestPayment from '../components/process-booking/TestPayment';
import AdminHome from '../components/screens/admin/Home';
import NewRequest from '../components/screens/admin/NewRequests';

const Stack = createNativeStackNavigator();

const CustomerStackNavigation = () => {
  const Intro = useSelector(state => state.Intro);
  const User = useSelector(state => state.Auth.TOKEN);
  const role = useSelector(state => state.Auth.role);
  const {IS_NEWLY_INSTALLED} = Intro;
  console.log(Intro);
  return (
    <Stack.Navigator
      screenOptions={{headerBackTitle: '', headerShadowVisible: false}}
      // initialRouteName="ProcessBooking"
      // initialRouteName="HistoryBookings"
      // initialRouteName="BookingChat"
      // initialRouteName="TestPayment"
      initialRouteName={User.role=="admin"?"AdminHome":"Customer Landing"}
      // initialRouteName={"AdminHome"}
      >
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
      <Stack.Screen name="AdminHome" component={AdminHome}
       options={{headerShown: false}}

      />
       
      <Stack.Screen name="Urgent" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Urgent" type="urgent"/>}
      
        </Stack.Screen>

        <Stack.Screen name="NewRequest" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="New Request" type="new_requests"/>}
      
        </Stack.Screen>

        
        <Stack.Screen name="Upcoming" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Upcoming" type="upcoming"/>}
      
        </Stack.Screen>

        <Stack.Screen name="Completed" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Completed" type="completed"/>}
      
        </Stack.Screen>

        <Stack.Screen name="ActionRequired" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Action Required" type="action_required"/>}
      
        </Stack.Screen>


        <Stack.Screen name="DriverNoMarked" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Driver no marked" type="driver_no_show"/>}
      
        </Stack.Screen>

        <Stack.Screen name="CustomerNoMarked" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Customer no marked" type="customer_no_show"/>}
      
        </Stack.Screen>
        <Stack.Screen name="Cancelled" 
       options={{headerShown: false}}
      >
        {props =>   <NewRequest title="Cancelled" type="canceled"/>}
      
        </Stack.Screen>

      <Stack.Screen name="MyBookings" component={ConfirmedBookings} />
      <Stack.Screen name="Bookings History" component={HistoryBookings} />
      <Stack.Screen name="Booking Details" component={BookingDetails} />
      <Stack.Screen name="MyDetails" component={MyDetails} />
      <Stack.Screen name="BookingChat" component={CustomerBookingChat} />
      <Stack.Screen name="TestPayment" component={TestPayment} />

      <Stack.Screen
        name="Booking Cancellation Confirmation"
        component={CancelBookingConfirmation}
      />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigation;
