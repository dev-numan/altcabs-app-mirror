import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import colors from '../../constants/colors';
import googleService from '../../api/GoogleService';
import {useDispatch} from 'react-redux';
import {ERROR} from '../../store/slices/message.slice';

const LocationPickerModal = ({
  visible,
  onClose,
  onLocationSelect,
  placeholder = 'Search for a place, venue or postcode...',
  locationType = 'pickup', // 'pickup' or 'dropoff'
}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Clear search when modal opens/closes
  useEffect(() => {
    if (visible) {
      setSearchText('');
      setSearchResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (searchText.length > 2) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        performSearch(searchText);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS handles permissions automatically
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to provide better service.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const performSearch = async (query) => {
    if (query.length < 3) return;
    
    setIsSearching(true);
    try {
      const results = await googleService.autocomplete(query);
      setSearchResults(results || []);
    } catch (error) {
      dispatch(ERROR('Failed to search locations'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location permissions in your device settings to use this feature.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => {
            // This would typically open device settings
            // For now, we'll just show an alert
            Alert.alert('Settings', 'Please go to Settings > Apps > Altcabs > Permissions and enable Location access.');
          }},
        ]
      );
      return;
    }

    setIsGettingLocation(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        
        // Check if reverseGeocode method exists
        if (googleService.reverseGeocode) {
          // Try to get address from reverse geocoding, with fallback
          googleService
            .reverseGeocode(latitude, longitude)
            .then((address) => {
              setIsGettingLocation(false);
              onLocationSelect({
                description: address || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                place_id: 'current_location',
                latitude,
                longitude,
              });
              onClose();
            })
            .catch((error) => {
              setIsGettingLocation(false);
              console.log('Reverse geocoding failed, using coordinates:', error);
              // Fallback to coordinates if reverse geocoding fails
              onLocationSelect({
                description: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                place_id: 'current_location',
                latitude,
                longitude,
              });
              onClose();
            });
        } else {
          // Fallback if reverseGeocode method doesn't exist
          setIsGettingLocation(false);
          onLocationSelect({
            description: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            place_id: 'current_location',
            latitude,
            longitude,
          });
          onClose();
        }
      },
      (error) => {
        setIsGettingLocation(false);
        console.log('Geolocation error:', error);
        
        let errorMessage = 'Unable to get your current location. Please try searching manually.';
        
        if (error.code === 1) {
          errorMessage = 'Location permission denied. Please check your location permissions.';
        } else if (error.code === 2) {
          errorMessage = 'Location service unavailable. Please check your device settings.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }
        
        Alert.alert('Location Error', errorMessage, [{text: 'OK'}]);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    onClose();
  };

  const renderSearchResult = ({item}) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleLocationSelect(item)}>
      <MaterialCommunityIcons
        name="map-marker"
        size={20}
        color="#24AAE0"
        style={styles.resultIcon}
      />
      <Text style={styles.resultText}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {searchText.length > 0 
              ? `Searching for "${searchText}"` 
              : locationType === 'dropoff' ? 'Drop off location' : 'Pick up location'
            }
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#24AAE0"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            {isSearching && (
              <ActivityIndicator size="small" color="#24AAE0" />
            )}
          </View>
        </View>

        {/* Your Location Button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleUseCurrentLocation}
          disabled={isGettingLocation}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color="#10a9e8"
            style={styles.locationIcon}
          />
          <Text style={styles.locationButtonText}>
            {isGettingLocation ? 'Getting location...' : 'Your Location'}
          </Text>
          {isGettingLocation && (
            <ActivityIndicator size="small" color="white" style={styles.locationSpinner} />
          )}
        </TouchableOpacity>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          {isSearching && (
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="large" color="#24AAE0" />
              <Text style={styles.searchingText}>Searching locations...</Text>
            </View>
          )}
          
          {!isSearching && searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.resultsList}
            />
          )}
          
          {!isSearching && searchText.length > 0 && searchResults.length === 0 && searchText.length >= 3 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No locations found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          )}
          
          {!isSearching && searchText.length === 0 && (
            <View style={styles.initialStateContainer}>
              <MaterialCommunityIcons
                name="map-search"
                size={48}
                color="#ccc"
                style={styles.initialStateIcon}
              />
              <Text style={styles.initialStateText}>Search for a location</Text>
              <Text style={styles.initialStateSubtext}>
                Type to search for places, venues, or postcodes
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C2B39',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#1C2B39',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  locationSpinner: {
    marginLeft: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultIcon: {
    marginRight: 15,
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  initialStateIcon: {
    marginBottom: 15,
  },
  initialStateText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  initialStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default LocationPickerModal;
