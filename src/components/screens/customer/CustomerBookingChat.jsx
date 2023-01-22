import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import chatService from '../../../api/ChatService';
import {ERROR} from '../../../store/slices/message.slice';
import CustomerBookingViewSkeleton from '../../common/skeletons/CustomerBookingViewSkeleton';
import ChatCanvas from '../chat/ChatCanvas';
const CustomerBookingChat = props => {
  const dispatch = useDispatch();
  const {params} = useRoute();
  // console.log(params);
  const [state, setState] = useState(null);
  useEffect(() => {
    if (params?.bookingId)
      chatService.getBookingChat(params.bookingId).then(({chat, booking}) => {
        setState({chat, booking});
        console.log(params.bookingId);
        console.log(`Chat Id: ${chat?._id}`);
        console.log(`Booking Id: ${booking?._id}`);
      });
    else {
      dispatch(ERROR('No Booking Specified'));
    }
  }, []);
  return (
    <View>
      {state?.chat ? (
        <ChatCanvas
          chat={state.chat}
          chatTitle={`Booking # ${state.booking.reference} Chat With Company ${state.booking.company?.name}`}
        />
      ) : (
        <CustomerBookingViewSkeleton />
      )}
    </View>
  );
};

export default CustomerBookingChat;
