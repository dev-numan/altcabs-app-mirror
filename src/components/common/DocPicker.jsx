import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import HStack from './HStack';
import AntDesign from 'react-native-vector-icons/AntDesign';
const DocPicker = ({docUrl}) => {
  const documentPicker = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: 'application/pdf',
      });
      docUrl({uri: file.uri, name: file.name, type: file.type});
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={documentPicker}
        style={{marginTop: 12}}
        activeOpacity={0.5}>
        <HStack style={styles.docView}>
          <AntDesign name="file1" size={18} color="rgba(0,0,0,0.4)" />
          <Text style={{color: 'rgba(0,0,0,0.4)', marginLeft: 7}}>
            UPLOAD FILE
          </Text>
        </HStack>
      </TouchableOpacity>
    </View>
  );
};

export default DocPicker;

const styles = StyleSheet.create({
  docView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C4C4C4',
    borderRadius: 8,
  },
});
