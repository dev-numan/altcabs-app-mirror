import {Button} from 'native-base';
import React from 'react';
import {View, Text} from 'react-native';
import colors from '../../constants/colors';

const CustomButton = props => {
  return (
    <Button
      rounded="md"
      p="3"
      _text={{fontSize: 14, fontWeight: 'bold'}}
      colorScheme={colors.YELLOW}
      _pressed={{bg: 'yellow.200'}}
      my="2"
      {...props}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
