import React, {useEffect, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import webSocketService from '../../../api/WebSocketService';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {MessageBubble} from './MessageBubble';
import colors from '../../../constants/colors';
import Message from './Message';
import {color} from 'react-native-reanimated';
import styles from './utils/chatStyles';
import Colors from './utils/chatColors';
import chatService from '../../../api/ChatService';

const ChatCanvas = ({chat, chatTitle}) => {
  const [newMessage, setNewMessage] = useState('New Message');
  const [messageFromServer, setMEssageFromServer] = useState(null);

  const {_id, name, email} = useSelector(state => state.Auth.TOKEN);
  const [title, setTitle] = useState(
    chatTitle ? chatTitle : 'Chat With AltCabs',
  );
  //   console.log(token);
  const [messages, setMessages] = useState(chat.messages);
  useEffect(() => {
    webSocketService.setChatId(chat?._id);
    webSocketService.on('message_received', messageReceivedFromServer);
    return () => {
      console.log('Cleaning Chat Canvas...');
      setMessages([]);
      webSocketService.setChatId('');
      webSocketService.removeListener(
        'message_received',
        messageReceivedFromServer,
      );
    };
  }, []);
  useEffect(() => {
    if (messageFromServer) {
      if (messageFromServer.from.instrumentId != _id) {
        setMessages([...messages, messageFromServer]);
      }
    }
  }, [messageFromServer]);
  const messageReceivedFromServer = (chatId, message) => {
    if (chatId == chat?._id) setMEssageFromServer(message);
  };
  const sendMessage = () => {
    let data = {
      message: newMessage,
      sentAt: Date.now(),
      isSending: true,
    };
    setMessages([...messages, {...data, from: {instrumentId: _id}}]);
    data.userId = _id;
    data.userEmail = email;
    data.userName = name;
    chatService
      .sendMessage(chat?._id, data)
      .then(data => {
        console.log('____________');
        console.log(data);
        console.log('____________');
      })
      .catch(error => {
        console.log(error);
      });
  };
  console.log(`Messages Length: ${messages.length}`);
  return (
    <View style={{height: 400}}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent={false}
          hidden={false}
          barStyle={'dark-content'}
          backgroundColor={Colors.white}
        />
        <View style={styles.headerContainer}>
          <View style={styles.headerInnerContainer}>
            <View style={styles.headerMain}>
              {/* <Text style={styles.userNameTxt}>{chat._id}</Text> */}
              <Text style={styles.userNameTxt}>{title}</Text>
            </View>
          </View>
        </View>
        <SafeAreaView style={{marginTop: 20}}>
          <FlatList
            data={messages}
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
        </SafeAreaView>
        <KeyboardAvoidingView
          style={{flexDirection: 'row', alignItems: 'center'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={[styles.inputContainer]}>
            <TextInput
              placeholderTextColor={'rgba(255, 255, 255, 0.2)'}
              placeholder={'Send the message'}
              multiline={true}
              onChangeText={text => setNewMessage(text)}
              value={newMessage}
              maxLength={200}
              style={styles.inputField}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={{justifyContent: 'flex-end'}}>
              <FontAwesome name="paper-plane" size={28} />
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChatCanvas;
