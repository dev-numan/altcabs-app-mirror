import {Box, FormControl, Input, Pressable, Text} from 'native-base';
import React, {useState} from 'react';

import colors from '../../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {marginBottom} from 'styled-system';
import {TouchableOpacity} from 'react-native';
const WidgetDatePicker = ({label, value, onChange}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = date => {
    console.log('A date has been picked: ', date);
    onChange(date);
    hideDatePicker();
  };
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
      <TouchableOpacity
        onPress={() => {
          showDatePicker();
        }}>
        <Text
          style={{
            color: colors.PRIMARY,
            backgroundColor: 'white',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}>
          {value ? moment(value).format('LLL') : moment().format('LLL')}
        </Text>
      </TouchableOpacity>
    </FormControl>
  );
};

export default WidgetDatePicker;
