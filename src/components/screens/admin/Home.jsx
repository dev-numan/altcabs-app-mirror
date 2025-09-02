import React, {useEffect, useState} from 'react';
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
import BookingWidget from '../../booking-widget/BookingWidget';
import {Center} from 'native-base';
import Header from '../../common/Header';
import {useDispatch, useSelector} from 'react-redux';
import API from '../../../api';

const AdminHome = () => {
  const [dashboard, setDashboard] = useState({});
  const User = useSelector(state => state.Auth.TOKEN);
  const Token = useSelector(state => state.Auth.JWT);
  const COMPANYID = useSelector(state => state.Auth.COMPANYID);
  const TRIPSDATA = useSelector(state => state.Auth.TRIPS);
  const getDashboard = async () => {
    try {
      API.defaults.headers.common['x-auth-token'] = Token;
      API.defaults.headers.common['companyId'] = COMPANYID;
      let company = await API.get('/company-dashboard/company');
      setDashboard(company.data);
      console.log('Getting Dashboard Data', company.data);
    } catch (e) {
      console.log('error in fetching', e);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.PRIMARY}}>
      <KeyboardAvoidingView>
        <ScrollView
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps={'always'}>
          <Header title="Dashboard" />
          <View>
            <Center space={1}>
              <Text style={styles.title}>
                Welcome Back
                {' ' + User?.name[0].toUpperCase() + User?.name.substr(1)}
              </Text>
            </Center>
            <Center space={1}>
              <Text style={styles.title}>
                @ {User?.role[0].toUpperCase() + User?.role.substr(1)}
              </Text>
            </Center>
          </View>
          {/* <Text style={styles.description}>Compare the cab fares online</Text> */}
          <BookingWidget booking_type="normal" />

          <View style={styles.card}>
            <View style={styles.cardView}>
              <Text style={styles.textTitle}>New Requests</Text>
            </View>
            <View style={styles.cardView}>
              <Text style={styles.textCount}>
                {TRIPSDATA?.new_requests?.length || 0}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardView}>
              <Text style={styles.textTitle}>Up Coming Trips</Text>
            </View>
            <View style={styles.cardView}>
              <Text style={styles.textCount}>
                {dashboard?.upComingCount || 0}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardView}>
              <Text style={styles.textTitle}>Your Ratings</Text>
            </View>
            <View style={styles.cardView}>
              <Text style={styles.textCount}>{dashboard?.ratings || 0}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardView}>
              <Text style={styles.textTitle}>Next Trip</Text>
            </View>
            <View style={styles.cardView}>
              <Text style={styles.textCount}>No Trip</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const getTitleTextByBookingType = booking_type => {
  switch (booking_type) {
    case 'client_bidding':
      return {
        title: 'Request Bids For Your Journey',
        header: 'Bid',
        bgColor: colors.PURPLE,
      };
    case 'cabmatch':
      return {
        title: 'Find out and book the cabs heading your way',
        header: 'Match',
        bgColor: colors.BLUE,
      };
    default:
      return {
        title: 'Compare the cab fares online',
        header: 'COMPARE',
        bgColor: colors.YELLOW,
      };
  }
};
export default AdminHome;
const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
    marginVertical: 7,
  },
  form: {
    borderRadius: 12,
    margin: 12,
    padding: 18,
    backgroundColor: colors.SECONDARY,
  },
  heading: {fontSize: 18, fontWeight: 'bold', color: 'white'},
  chip: {
    backgroundColor: colors.PRIMARY,
    padding: 4,
    borderRadius: 7,
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 7,
  },
  image: {
    height: 50,
    width: '88%',
    resizeMode: 'contain',
  },
  title: {
    color: colors.WHITE,
  },
  card: {
    height: 100,
    backgroundColor: colors.WHITE,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    color: colors.GRAY,
    fontSize: 20,
  },
  textCount: {
    color: colors.BLACK,
    fontSize: 20,
  },
  cardView: {
    marginBottom: 15,
  },
});
