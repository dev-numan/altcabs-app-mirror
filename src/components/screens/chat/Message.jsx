import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
const Message = ({item}) => {
  const token = useSelector(state => state.Auth.TOKEN);
  //   const _id = '';
  const isMine = item.from.instrumentId.trim() == token?._id;
  console.log('item');
  console.log(item?.from.instrumentId);
  if (isMine)
    return (
      <View
        key={`${item?._id}`}
        style={[styles.messageBubble, styles.myMessageBubble]}>
        <Text style={styles.myMessageText}>{item.message}</Text>
      </View>
    );
  return (
    <View key={`${item?._id}`} style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
};

export default Message;
const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: 300,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F1F0F0',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3784FF',
  },
  messageText: {
    fontSize: 15,
  },
  myMessageText: {
    color: 'white',
    fontSize: 15,
  },
});
