import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Input, FormControl, WarningOutlineIcon, Spinner} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import CustomButton from '../CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {ERROR} from '../../../store/slices/message.slice';
import googleService from '../../../api/GoogleService';
import colors from '../../../constants/colors';

const PlaceSelectorModal = ({label, value, onCancel, onChange}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]); // Stores autocomplete suggestions
  const [fetching, setFetching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (value.description && !value.place_id) {
      setData([]);
      setFetching(true);

      googleService
        .autocomplete(value.description)
        .then(res => {
          setData(res); // Expecting res to be an array of { description, place_id }
        })
        .catch(err => {
          dispatch(ERROR);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [value.description]);

  const handlePlaceSelect = async place => {
    try {
      // Fetch place details from your service
      //   const details = await googleService.getPlaceDetails(place.place_id);
      onChange(place);
      setModalVisible(false);
      //   if (details) {
      //     const location = {
      //       latitude: details.geometry.location.lat,
      //       longitude: details.geometry.location.lng,
      //       address: place.description,
      //     };
      //     setSelectedLocation(location);
      //     onChange({place_id: place.place_id, description: place.description});
      //     setModalVisible(false); // Close modal after selection
      //   }
    } catch (error) {
      console.log(error);
      dispatch(ERROR(error));
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Field to Open Modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputField}>
        <Text>{value.description || 'Select a location'}</Text>
      </TouchableOpacity>

      {/* Modal for Place Selection */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Input Field with Autocomplete */}
          <FormControl w="100%" maxW="400px">
            <FormControl.Label _text={{color: colors.BLACK}}>
              {label}
            </FormControl.Label>

            <Input
              w="100%"
              backgroundColor={'white'}
              value={value.description}
              onChangeText={text => onChange({place_id: '', description: text})}
              placeholder="Search for a place"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {fetching && <Spinner mt={2} />}

            {/* Autocomplete Suggestions List */}
            {data.length > 0 && (
              <FlatList
                data={data}
                keyExtractor={item => item.place_id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handlePlaceSelect(item)}>
                    <Text style={styles.suggestionText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              Required
            </FormControl.ErrorMessage>
          </FormControl>

          {/* Map View for Selected Location */}
          {selectedLocation && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={selectedLocation}
                title={selectedLocation.address}
              />
            </MapView>
          )}

          {/* Close Button */}
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={25} color="white" />
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputField: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PlaceSelectorModal;
