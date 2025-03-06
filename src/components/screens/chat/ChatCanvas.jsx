import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';

import webSocketService from '../../../api/WebSocketService';
import chatService from '../../../api/ChatService';
import colors from '../../../constants/colors';

const {height, width} = Dimensions.get('window');

const ChatCanvas = ({chat, chatTitle}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messageFromServer, setMessageFromServer] = useState(null);

  const {_id, name, email} = useSelector(state => state.Auth.TOKEN);
  const [title, setTitle] = useState(chatTitle || 'Chat with AltCabs');
  const [messages, setMessages] = useState(chat.messages);

  useEffect(() => {
    webSocketService.setChatId(chat?._id);
    webSocketService.on('message_received', messageReceivedFromServer);

    return () => {
      setMessages([]);
      webSocketService.setChatId('');
      webSocketService.removeListener('message_received', messageReceivedFromServer);
    };
  }, []);

  useEffect(() => {
    if (messageFromServer) {
      if (messageFromServer.from.instrumentId !== _id) {
        setMessages(prevMessages => [...prevMessages, messageFromServer]);
      }
    }
  }, [messageFromServer]);

  const messageReceivedFromServer = (chatId, message) => {
    if (chatId === chat?._id) setMessageFromServer(message);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    let data = {
      message: newMessage,
      sentAt: Date.now(),
      isSending: true,
    };

    setMessages(prevMessages => [...prevMessages, {...data, from: {instrumentId: _id}}]);

    data.userId = _id;
    data.userEmail = email;
    data.userName = name;

    chatService.sendMessage(chat?._id, data)
      .then(() => setNewMessage(''))
      .catch(error => console.log(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Chat Messages */}
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                item.from.instrumentId !== _id
                  ? styles.receivedMessage
                  : styles.sentMessage,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  item.from.instrumentId !== _id
                    ? styles.receivedText
                    : styles.sentText,
                ]}>
                {item.message}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor={colors.GREY}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            style={styles.inputField}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <FontAwesome name="paper-plane" size={22} color={colors.WHITE} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatCanvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background for a modern look
  },

  /* HEADER */
  headerContainer: {
    backgroundColor: colors.WHITE,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.DARK_COLOR,
  },

  /* CHAT CONTAINER */
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  /* RECEIVED MESSAGE */
  receivedMessage: {
    maxWidth: '75%',
    backgroundColor: '#000000', // Black background for received messages
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 5,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  receivedText: {
    color: '#FFFFFF', // White text for received messages
  },

  /* SENT MESSAGE */
  sentMessage: {
    maxWidth: '75%',
    backgroundColor: '#FFFFFF', // White background for sent messages
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginVertical: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  sentText: {
    color: '#000000', // Black text for sent messages
  },

  /* MESSAGE INPUT */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    color: colors.BLACK,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.DARK_COLOR,
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});