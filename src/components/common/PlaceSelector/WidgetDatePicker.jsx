import {Box, FormControl, Input, Pressable, Text, HStack} from 'native-base';
import React, {useState} from 'react';
import colors from '../../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
      <FormControl.Label _text={{color: colors.BLACK}}>
        {label}
      </FormControl.Label>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colors.PRIMARY,
        }}>
        <FontAwesome5 name="calendar-alt" size={20} color={colors.PRIMARY} style={{marginRight: 10}} />
        <Text style={{color: colors.PRIMARY, fontSize: 16}}>
          {value ? moment(value).format('LLL') : moment().format('LLL')}
        </Text>
      </TouchableOpacity>
    </FormControl>
  );
};

export default WidgetDatePicker;
