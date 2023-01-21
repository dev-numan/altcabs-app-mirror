import {Input} from 'native-base';
import React from 'react';
import {View, TextInput, Image, TouchableOpacity, Text} from 'react-native';
import styles from './styles';

const DetailsScreenInput = props => {
  return (
    <View style={[styles.container, props.container]}>
      {props.headingName ? (
        <Text style={[styles.headingTxt, props.headingTxt]}>
          {props.headingName}
        </Text>
      ) : null}
      <View style={[styles.innerContainer, props.innerContainer]}>
        <TextInput
          {...props}
          style={styles.inputContainer}
          placeholder={props.placeHolder}
          placeholderTextColor={props.placeHolderColor}
          multiline={props.multiline}
          value={props.value}
          editable={props.editable}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          textAlignVertical={props.textAlignVertical}
          color={props.textColor}
          maxLength={props.maxLength}
          autoCapitalize={props.autoCapitalize}
          returnKeyType={props.returnKeyType}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
          ref={props.refInner}
        />
      </View>
    </View>
  );
};

export default DetailsScreenInput;
