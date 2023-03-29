import React, {useState, useEffect, createRef} from 'react';
import {Modal, Text, View} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {DirectionApi} from '../../utils/MapAction';
import PolylineD from '@mapbox/polyline';
import {request, PERMISSIONS} from 'react-native-permissions';
import {GOOGLE_PLACES_API} from '../../config';
import axios from 'axios';
import colors from '../../constants/colors';
import bookingService from '../../api/BookingService';
import querystring from 'querystring';
import MapModal from '../booking-widget/MapModal';
import {Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DirectionMaps = ({bookingId, fromToLocation}) => {
  console.log('DirectionMaps', fromToLocation);
  const [direction, setDirection] = useState([]);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromLocation, setFromLocation] = useState(fromToLocation?.from);
  const [toLocation, setToLocation] = useState(fromToLocation?.to);
  const [open, setOpen] = useState(false);
  const map = createRef();

  React.useEffect(() => {
    setIsLoading(true);
    // bookingService.getById(bookingId).then(res => {
    //   console.log('RES: ', res.from?.location);
    //   console.log('To: ', res.to.location);
    //   setFromLocation(res?.from?.location);
    //   setToLocation(res?.to?.location);
    setRoute({fromLoc: fromToLocation.from, toLoc: fromToLocation.to});
    //   // console.log('To: ', res.via);
    // });
  }, []);
  //draw polyline
  const getDirections = data => {
    try {
      let points = PolylineD.decode(data);
      let coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      return coords;
    } catch (error) {
      return error;
    }
  };

  const setRoute = async () => {
    try {
      //   Geolocation.getCurrentPosition(
      //     position => {
      //       console.log('p', position);
      // let from = {
      //   latitude: 51.5072,
      //   longitude: 0.1276,
      // };
      // let to = {
      //   latitude: 50.8229,
      //   longitude: 0.1363,
      // };
      let from = {
        latitude: fromToLocation?.from?.location?.lat,
        longitude: fromToLocation?.from?.location?.lng,
      };
      let to = {
        latitude: fromToLocation?.to?.location?.lat,
        longitude: fromToLocation?.to?.location?.lng,
      };
      console.log('FROMTO', from);
      console.log('FROMTO', to);
      let requestObject = {
        key: GOOGLE_PLACES_API,
        origin: `place_id:${fromToLocation?.from?.place_id}`,
        destination: `place_id:${fromToLocation?.to?.place_id}`,
        units: 'imperial',
      };
      if (fromToLocation?.via && fromToLocation?.via?.length > 0) {
        requestObject.waypoints = `place_id:${fromToLocation?.via[0]?.place_id}`;
        for (var i = 1; i < fromToLocation?.via?.length; i++) {
          requestObject.waypoints +=
            '|place_id:' + fromToLocation?.via[i]?.place_id;
        }
      }
      // //console.log(requestObject);
      let params = querystring.stringify(requestObject);
      let endpoint =
        'https://maps.googleapis.com/maps/api/directions/json?' + params;

      axios
        .get(
          // `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&key=${GOOGLE_PLACES_API}`,
          endpoint,
        )
        .then(response => {
          //   console.log('response', response);
          if (response.data.status === 'OK');
          setDirection(
            getDirections(response.data.routes[0].overview_polyline.points),
          );
          setIsLoading(false);
        })
        .catch(error => {
          console.log('ERROR IN DIRECTION API::', error);
        });
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLocationPermission = async () => {
    try {
      console.log('INSIDE FUNCTION');
      // let granted = null;
      let granted = await request(
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      console.log('Granted: ', granted);

      if (granted) {
        Geolocation.getCurrentPosition(
          position => {
            console.log('position', position);
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            // See error code charts below.
            console.log(error.code + ': ' + error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );

        // console.log('INSIDE REQ PERM FUNC::');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      {/* <Text> Maps comes here </Text> */}
      <Button
        // style={{paddin}}
        style={{margin: 15}}
        size="xs"
        colorScheme={colors.YELLOW}
        onPress={() => setOpen(true)}>
        <Text style={{color: colors.PRIMARY, marginBottom: 5}}>
          {'View route map       '}
          <MaterialCommunityIcons
            name="directions"
            color={colors.PRIMARY}
            size={20}
            // style={{marginTop: 0, paddingTop: 30}}
          />
        </Text>
      </Button>
      {!isLoading && (
        <>
          <MapModal
            direction={direction}
            fromToLocation={fromToLocation}
            open={open}
            setOpen={setOpen}
          />
          <View style={{height: 100}}>
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
                zoom: 8,
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
        </>
      )}
    </View>
  );
};

export default DirectionMaps;
