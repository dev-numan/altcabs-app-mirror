import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import webSocketService from '../../../api/WebSocketService';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {MessageBubble} from './MessageBubble';
import colors from '../../../constants/colors';
import Message from './Message';
import {color} from 'react-native-reanimated';
const ChatCanvas = ({chat}) => {
  const [newMessage, setNewMessage] = useState('New Message');
  const {_id, name, email} = useSelector(state => state.Auth.TOKEN);
  const [title, setTitle] = useState('Chat With AltCabs');
  //   console.log(token);
  const [messages, setMessages] = useState(chat.messages);
  useEffect(() => {
    webSocketService.setChatId(chat?._id);
    return () => {
      //   setMessages([]);
    };
  }, []);
  const sendMessage = () => {};
  console.log(`Messages Length: ${messages.length}`);
  return (
    <SafeAreaView style={{}}>
      <View style={{}}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomColor: '#BEBEBE',
            borderBottomWidth: 1,
            backgroundColor: colors.YELLOW,
          }}>
          <Text
            style={{fontSize: 20, fontWeight: 'bold', color: colors.PRIMARY}}>
            {title}
          </Text>
        </View>
        {messages.map(m => (
          <Message item={m} key={m?._id} />
        ))}
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={text => setNewMessage(text)}
          value={newMessage}
          style={{padding: 10}}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={styles.sendMessageButton}>
          <Text style={styles.sendButtonTitle}>Send message</Text>
        </TouchableOpacity>
        {/* <FlatList data={messages} inverted renderItem={Message} /> */}
      </View>
    </SafeAreaView>
  );
};

export default ChatCanvas;
const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold'},
  safeArea: {
    flex: 1,
  },
  sendMessageButton: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FF4500',
    alignItems: 'center',
  },
  sendButtonTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

<SafeAreaView style={{marginTop: 20}}>
  <FlatList
    data={messages}
    inverted
    onContentSizeChange={() => {}}
    renderItem={({item}) => {
      console.log(item.message);
      return (
        <View>
          {item.from.instrumentId.trim() != _id ? (
            <View style={styles.recevierContainer}>
              <View style={styles.recevierInnerContainer}>
                <Text style={[styles.senderTxt]}>{item.message}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.senderContainer}>
              <View style={styles.senderInnerContainer}>
                <Text style={styles.senderTxt}>{item.message}</Text>
              </View>
            </View>
          )}
        </View>
      );
    }}
  />
</SafeAreaView>;
