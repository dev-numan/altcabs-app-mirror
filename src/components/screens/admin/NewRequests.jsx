import React from 'react';
import API from '../../../api';
import {useDispatch, useSelector} from 'react-redux';

import {TRIPDATA} from '../../../store/slices/auth.slice';

import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import colors from '../../../constants/colors';

import Header from '../../common/Header';
import TaxiCard from './component/Card'; // Adjust the import path based on your project structure
import {useEffect} from 'react';

const NewRequest = ({title, type}) => {
  // Replace these sample data with actual data from your system
  console.log(title);
  const dispatch = useDispatch();

  let Data = [];
  const Token = useSelector(state => state.Auth.JWT);
  const COMPANYID = useSelector(state => state.Auth.COMPANYID);
  const TRIPSDATA = useSelector(state => state.Auth.TRIPS);

  console.log('Token', Token);
  console.log('companyid', COMPANYID);
  // console.log('TRIPSDATA', TRIPSDATA[type]);
  if (TRIPSDATA) {
    Data = TRIPSDATA[type];
    console.log(Data[0]);
  }

  useEffect(() => {
    if (TRIPSDATA) {
    } else {
      getComapnies();
    }
  }, []);

  const getComapnies = async () => {
    try {
      API.defaults.headers.common['x-auth-token'] = Token;
      API.defaults.headers.common['companyId'] = COMPANYID;
      let company = await API.get('/company-bookings/trips');
      console.log('Getting TRIP Data', company.data);
      dispatch(TRIPDATA(company.data));
      // Data= useSelector(state => state.Auth.TRIPS);

      console.log('company', COMPANYID);
    } catch (e) {
      console.log('error in fetching', e);
    }
  };

  const taxiData = {
    referenceNo: 'TAXI12345',
    journeyInfo: 'From Airport to City Center',
    passengerDetails: 'John Doe, 2 adults, 2 suitcases',
    pickupLocation: 'Airport Terminal 2',
    paymentDetails: '$30.00',
    status: 'Pending',
  };

  const handleAccept = () => {
    // Handle the accept action here
    console.log('Accepted');
  };

  const handleReject = () => {
    // Handle the reject action here
    console.log('Rejected');
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.PRIMARY}}>
      <KeyboardAvoidingView>
        <ScrollView
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps={'always'}>
          <Header title={title} />
          <View style={styles.container}>
            {Data.length > 0 ? (
              Data?.map(val => {
                return (
                  <TaxiCard
                    referenceNo={val?.reference}
                    journeyInfo={val?.to_desc}
                    passengerDetails={`${val?.passanger?.name} `}
                    pickupLocation={val?.from_desc}
                    paymentDetails={val?.adminCut}
                    status={val?.status}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                );
              })
            ) : (
              <Text style={{color: 'white'}}>No Record Found</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default NewRequest;
