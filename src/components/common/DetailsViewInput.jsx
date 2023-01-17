import {Input} from 'native-base';
import React from 'react';

const DetailsViewInput = props => {
  return (
    <Input
      my={2}
      p="2"
      variant="filled"
      keyboardType="default"
      bgColor="#27323D"
      color="white"
      _focus={{borderColor: '#14191f'}}
      autoCapitalize="none"
      autoCorrect={false}
      size="xs"
      {...props}
    />
  );
};

export default DetailsViewInput;
