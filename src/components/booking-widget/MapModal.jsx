// import {Input, Modal, Select} from 'native-base';
import {Picker} from '@react-native-picker/picker';
import {Button} from 'native-base';
import React, {useState, createRef} from 'react';
import {
  Pressable,
  Modal,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import colors from '../../constants/colors';
import CustomButton from '../common/CustomButton';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

const MapModal = ({
  open,
  setOpen,
  fromToLocation,
  direction,
  form,
  setForm,
}) => {
  console.log('Inside Map Modal');
  const [luggage, setLuggage] = useState('');
  const [quantity, setQuantity] = useState(null);
  const map = createRef();

  //   console.log(luggageTypes);
  return (
    // <Modal animationType="fade" transparent={true} visible={open}>
    //   <View style={styles.modalContainer}>
    //     <View style={styles.innerContainer}>
    //       <View style={styles.screen}>
    //         <Button onPress={() => setOpen(false)}>Back</Button>
    //       </View>
    //     </View>
    //   </View>
    // </Modal>
    <Modal animationType="fade" visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setOpen(false);
              /* handle cancel button press */
            }}>
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heading}>Map</Text>

        <View style={{height: '100%'}}>
          <MapView
            ref={map}
            // provider={PROVIDER_GOOGLE}
            style={{height: '80%'}}
            // showsUserLocation={true}
            // showsCompass={false}
            // showsMyLocationButton={false}
            // showsScale={true}
            //   onUserLocationChange={position => {
            //     setLocation({
            //       latitude: position.nativeEvent.coordinate.latitude,
            //       longitude: position.nativeEvent.coordinate.longitude,
            //       latitudeDelta: 0.0922,
            //       longitudeDelta: 0.0421,
            //     });
            //   }}
            initialCamera={{
              center: {
                // latitude: location?.latitude,
                // longitude: location?.longitude,
                // latitude: 51.5072,
                // longitude: 0.1276,
                latitude: fromToLocation?.from?.location?.lat,
                longitude: fromToLocation?.from?.location?.lng,
              },
              pitch: 0,
              heading: 0,
              altitude: 0,
              zoom: 10,
            }}
            // initialRegion={location}
            // userLocationUpdateInterval={1000}
            onPress={({nativeEvent: {coordinate}}) => {
              // console.log('PRINTING MAP VIEW COORDINATES::', coordinate);
            }}
            onMapReady={() => {
              // setCount(0);
            }}>
            {/* <Marker
                coordinate={{
                  // latitude: location.latitude,
                  // longitude: location.longitude,
                  latitude: 50.8229,
                  longitude: 0.1363,
                }}

                // image={require('../../assets/images/app/car.png')}
              >
                 <FontAwesome name={'car'} size={30} /> 
              </Marker>

              <Marker
                coordinate={{
                  // latitude: started_booking.to.location.lat,
                  // longitude: started_booking.to.location.lng,
                  latitude: 51.5072,
                  longitude: 0.1276,
                }}
                // image={{
                //   uri: 'https://image.flaticon.com/icons/png/64/3814/3814368.png',
                // }}
              /> */}
            {direction.length > 0 && (
              <>
                <Polyline
                  coordinates={direction}
                  strokeWidth={6}
                  strokeColor={colors.PRIMARY}
                  // lineDashPattern={lineDashPattern}
                />
                <Marker
                  coordinate={{
                    latitude: fromToLocation?.from?.location?.lat,
                    longitude: fromToLocation?.from?.location?.lng,
                  }}
                />
                <Marker
                  coordinate={{
                    latitude: fromToLocation?.to?.location?.lat,
                    longitude: fromToLocation?.to?.location?.lng,
                  }}
                />
              </>
            )}
          </MapView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapModal;
