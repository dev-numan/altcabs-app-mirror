import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import chatService from '../../../api/ChatService';
import CustomerBookingViewSkeleton from '../../common/skeletons/CustomerBookingViewSkeleton';
import ChatCanvas from '../chat/ChatCanvas';
const FrontCustomerChat = () => {
  const [chat, setChat] = useState(null);
  useEffect(() => {
    chatService.getFrontChat().then(data => {
      setChat(data);
    });
  }, []);
  return (
    <>{chat ? <ChatCanvas chat={chat} /> : <CustomerBookingViewSkeleton />}</>
  );
};

export default FrontCustomerChat;
