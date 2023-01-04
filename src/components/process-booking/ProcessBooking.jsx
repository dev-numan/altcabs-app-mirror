import {useRoute} from '@react-navigation/native';
import {Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {LOAD_PROCESS_BOOKING} from '../../store/slices/booking.slice';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import QuotationSelector from './QuotationSelector';
import colors from '../../constants/colors';
import QuotationDetails from './QuotationDetails';
import QuotationCheckout from './QuotationCheckout';
import QuotationSuccess from './QuotationSuccess';
const ProcessBooking = () => {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const bookingId = '63b29c78b31c84727f5910f8';
  const booking = useSelector(
    state => state.booking.processBookings[bookingId],
  );
  // console.log('params');
  // console.log(params);
  useEffect(() => {
    if (!booking);
    dispatch(LOAD_PROCESS_BOOKING(bookingId));
  }, [bookingId]);
  const onSubmit = () => {};
  return (
    <View style={{flex: 1, backgroundColor: '#1C2B39'}}>
      {!booking ? (
        <Text>Loading ...</Text>
      ) : (
        <>
          <ProgressSteps
            activeStepIconBorderColor="#FB2681"
            activeStepIconColor="#FB2681"
            completedStepIconColor="#FB2681"
            completedProgressBarColor="#FB2681"
            progressBarColor="#405263"
            disabledStepIconColor="#405263"
            activeLabelColor="#FB2681"
            activeStep={activeStep}
            activeStepNumColor="#FFF">
            <ProgressStep
              onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.btn}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                pagingEnabled: false,
              }}
              // removeBtnRow={true}
              label="Quotations">
              <QuotationSelector booking={booking} />
            </ProgressStep>
            <ProgressStep
              onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.btn}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                // pagingEnabled: true,
              }}
              // removeBtnRow={true}
              label="Passanger Details">
              <QuotationDetails />
            </ProgressStep>
            <ProgressStep
              onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.btn}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                // pagingEnabled: true,
              }}
              removeBtnRow={true}
              label="Payment">
              <QuotationCheckout />
            </ProgressStep>
            <ProgressStep
              onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.btn}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                // pagingEnabled: true,
              }}
              removeBtnRow={true}
              label="Confirmation">
              <QuotationSuccess booking={booking} />
            </ProgressStep>
          </ProgressSteps>
        </>
      )}
    </View>
  );
};

export default ProcessBooking;
const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#FB2681',
    borderRadius: 7,
    padding: 8,
    width: 120,
  },
  btnText: {
    color: '#FFF',
    textAlign: 'center',
  },
});
