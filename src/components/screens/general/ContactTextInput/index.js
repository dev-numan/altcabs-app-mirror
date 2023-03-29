import React from 'react';
import {View, TextInput, Image, TouchableOpacity, Text} from 'react-native';
import EyeOpen from '../../../../assets/images/EyeOpen.png';
import PasswordEye from '../../../../assets/images/PasswordEye.png';
import styles from './styles';

const ContactTextInput = props => {
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
          // color={props.textColor}
          maxLength={props.maxLength}
          autoCapitalize={props.autoCapitalize}
          returnKeyType={props.returnKeyType}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
          ref={props.refInner}
        />
        {props.secureText && (
          <TouchableOpacity
            onPress={props.onPress}
            style={styles.iconContainer}>
            <Image
              source={props.eyeOpen ? EyeOpen : PasswordEye}
              style={styles.eyeOpenIcon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
        {props.verfiyImage && (
          <Image
            source={props.verfiyImage}
            style={styles.calendarIcon}
            resizeMode={'contain'}
          />
        )}
      </View>
    </View>
    // <View style ={styles.container}>
    //         {props.birthday && (
    //             <TouchableOpacity onPress={props.onPress} style={styles.iconContainer}>
    //              <Image source ={Images.Calendar} style={styles.calendarIcon}  resizeMode={"contain"}/>
    //             </TouchableOpacity>
    //         )}
    //         {props.Verify && (
    //             <TouchableOpacity onPress={props.onPress} style={styles.iconContainer}>
    //              <Image source ={Images.Verify} style={styles.calendarIcon}  resizeMode={"contain"}/>
    //             </TouchableOpacity>
    //         )}
    //     </View>

    // </View>
  );
};

export default ContactTextInput;
