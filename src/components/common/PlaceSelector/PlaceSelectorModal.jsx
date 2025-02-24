import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Input, FormControl, WarningOutlineIcon, Spinner, IconButton} from 'native-base';
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

  const handleClearText = () => {
    onChange({place_id: '', description: ''});
  };

  return (
    <View style={styles.container}>
      <Text  style={{ color: 'black', flex: 1,fontWeight:'600' }}>{label}</Text>
      {/* Input Field to Open Modal */}
      <TouchableOpacity 
  onPress={() => setModalVisible(true)} 
  style={[styles.inputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
  <Text 
    style={{ color: 'black', flex: 1 }} 
    numberOfLines={1} 
    ellipsizeMode="tail">
    {value.description || 'Select a location'}
  </Text>
  {value.description ? (
    <TouchableOpacity 
      onPress={() => onChange({ place_id: '', description: '' })} 
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <MaterialCommunityIcons name="close-circle" size={20} color="gray" />
    </TouchableOpacity>
  ) : null}
</TouchableOpacity>

      {/* Modal for Place Selection */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{label}</Text>
            <TouchableOpacity
  onPress={() => {
    setModalVisible(false);
    // Removed the onCancel call
  }}
              style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={25} color={colors.BLACK} />
            </TouchableOpacity>
          </View>

          {/* Input Field with Autocomplete */}
          <FormControl w="100%" maxW="400px">
            <FormControl.Label _text={{color: colors.BLACK}}>
              Search Location
            </FormControl.Label>

            <View style={styles.inputContainer}>
              <Input
                w="100%"
                backgroundColor={'white'}
                value={value.description}
                onChangeText={text => onChange({place_id: '', description: text})}
                placeholder="Search for a place"
                autoCapitalize="none"
                autoCorrect={false}
                InputRightElement={
                  value.description ? (
                    <IconButton
                      icon={<MaterialCommunityIcons name="close" size={20} color={colors.BLACK} />}
                      onPress={handleClearText}
                      style={styles.clearButton}
                    />
                  ) : null
                }
              />
            </View>

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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  inputField: {
    padding: 12,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  backButton: {
    padding: 8,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  clearButton: {
    borderRadius: 20,
    padding: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
    color: colors.BLACK, // Explicitly setting suggestion text color to black
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
});

export default PlaceSelectorModal;