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
import LocationPickerModal from '../../booking-widget/LocationPickerModal';

const PlaceSelector = ({value, onChange, label, onCancel, placeholder}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([
    // {description: 'Brighton', place_id: 'brighton'},
    // {description: 'Lahore', place_id: 'whoala'},
  ]);
  const [fetching, setFetching] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

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

  const handleLocationSelect = (location) => {
    onChange(location);
    setShowLocationModal(false);
  };

  return (
    <View style={styles.container}>
      <VStack>
        <FormControl w="100%" maxW="400px">
          {/* From Section - Label and Input on same line */}
          <View style={[styles.labelInputRow, !label && styles.noLabelRow]}>
            <Text style={styles.labelText}>
              {label}
            </Text>
            
            {/* Clickable Placeholder Text */}
            {!value.description && (
              <TouchableOpacity
                style={styles.placeholderContainer}
                onPress={() => setShowLocationModal(true)}>
                <Text style={styles.placeholderText} numberOfLines={1}>
                  {placeholder || 'Place, venue or postcode...'}
                </Text>
              </TouchableOpacity>
            )}
            
            {/* Regular Input when there's a value */}
            {value.description && (
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowLocationModal(true)}>
                <View style={styles.inputContent}>
                  <Text style={styles.inputText} numberOfLines={1}>
                    {value.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
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

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        placeholder={placeholder || 'Search for a place, venue or postcode...'}
        locationType={label === 'To' ? 'dropoff' : 'pickup'}
      />
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
  placeholderContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderWidth: 0,
    minHeight: 28,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    flexShrink: 1,
    flexWrap: 'nowrap',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderWidth: 0,
    minHeight: 28,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  labelInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    paddingLeft: 40,
  },
  labelText: {
    fontSize: 16,
    color: colors.PRIMARY, 
    fontWeight: '700',
    minWidth: 40,
    marginRight: 2,
  },
  noLabelRow: {
    paddingLeft: 0,
  },
});
