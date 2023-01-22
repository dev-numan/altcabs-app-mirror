import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

/**
 * UI Component for message item, in message list (FlatList).
 */
export const MessageBubble = ({item}) => {
  // const {_id, name, email} = useSelector(state => state.Auth.TOKEN);
  console.log(item);
  const _id = '111';
  const isMine = item?.from?.instrumentId.trim() == _id;
  if (isMine) {
    // Align sent messages to right side of the screen, with a grey'ish background.
    return (
      <View
        key={`${item?._id}`}
        style={[styles.messageBubble, styles.myMessageBubble]}>
        <Text style={styles.myMessageText}>{item.message}</Text>
      </View>
    );
  }

  // Align received messages to left side of the screen, with blue background.
  return (
    <View key={`${item.id}`} style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
};

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
