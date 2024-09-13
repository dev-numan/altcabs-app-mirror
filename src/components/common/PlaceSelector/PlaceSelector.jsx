import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {
  Input,
  Spinner,
  FormControl,
  WarningOutlineIcon,
  Box,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HStack from '../HStack';
import VStack from '../VStack';

import colors from '../../../constants/colors';
import CustomButton from '../CustomButton';
import {useDispatch} from 'react-redux';
import {ERROR} from '../../../store/slices/message.slice';
import googleService from '../../../api/GoogleService';

const PlaceSelector = ({value, onChange, label, onCancel}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([
    // {description: 'Brighton', place_id: 'brighton'},
    // {description: 'Lahore', place_id: 'whoala'},
  ]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (value.description && !value.place_id) {
      setData([]);
      setFetching(true);
      console.log('fetching AutoComplete');
      googleService
        .autocomplete(value.description)
        .then(res => setData(res))
        .catch(err => {
          dispatch(ERROR);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <VStack>
        <FormControl w="100%" maxW="400px" bg={'red'}>
          <FormControl.Label>{label}</FormControl.Label>
          <Input
            w="100%"
            backgroundColor={"white"}
            bg="white"
            value={value.description}
            onChangeText={text => {
              onChange({place_id: '', description: text});
            }}
            InputRightElement={
              <CustomButton
                size="xs"
                rounded="none"
                
                _text={{fontSize: 10, fontWeight: 'bold'}}
                p="0"
                bg="white"
                
                w="1/6"
                h="full"
                variant="solid"
                my="1"
                onPress={onCancel}>
                <MaterialCommunityIcons
                  name="delete-forever"
                  style={{marginLeft: 0, paddingLeft: 0}}
                  size={25}
                  color={colors.PRIMARY}
                />
              </CustomButton>
            }
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Required
          </FormControl.ErrorMessage>
        </FormControl>
        {fetching && (
          <View
            style={{
              display: 'flex',
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{}}>Loading ...</Text>
            </View>
            <View>
              <Spinner color="#1C2B39" size={20} />
            </View>
          </View>
        )}
        {data.length > 0 && (
          <Box bg="white" p={5}>
            {data.map((d, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onChange(d);
                  setData([]);
                }}>
                <HStack>
                  <MaterialCommunityIcons
                    name="map-marker"
                    style={{marginLeft: 0, paddingLeft: 0, paddingTop: 9}}
                    size={20}
                    color={colors.PRIMARY}
                  />
                  <Text style={{padding: 5}}>{d.description}</Text>
                </HStack>
              </TouchableOpacity>
            ))}
          </Box>
        )}
      </VStack>
    </View>
  );
};

export default PlaceSelector;

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    width: '100%',
    overflow: 'visible',
  },
  container: {
    flex: 1,
    // backgroundColor: 'red',
    // marginTop: StatusBar.currentHeight || 0,
  },
  inputLabel: {},
  item: {
    padding: 2,
    marginVertical: 1,
    // marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
