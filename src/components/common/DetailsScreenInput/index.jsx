import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

const DetailsScreenInput = props => {
  return (
    <View style={[styles.container, props.container]}>
      {props.headingName && (
        <Text style={[styles.label, props.headingTxt]}>
          {props.headingName}
        </Text>
      )}

      <View style={[styles.inputWrapper, props.innerContainer]}>
        <TextInput
          {...props}
          style={[styles.input, props.inputStyle]}
          placeholder={props.placeHolder}
          placeholderTextColor={props.placeHolderColor || '#999'}
          multiline={props.multiline}
          value={props.value}
          editable={props.editable}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          textAlignVertical={props.textAlignVertical}
          color={props.textColor || '#000'}
          maxLength={props.maxLength}
          autoCapitalize={props.autoCapitalize || 'none'}
          returnKeyType={props.returnKeyType}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
          ref={props.refInner}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 0, // removes iOS default padding
  },
});

export default DetailsScreenInput;
