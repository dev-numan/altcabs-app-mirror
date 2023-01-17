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
import QuotationLoaderSkeleton from '../common/skeletons/QuotationLoaderSkeleton';
const ProcessBooking = () => {
  const {params} = useRoute();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  // const bookingId = '63b29c78b31c84727f5910f8'; // for testing
  const bookingId = params.bookingId;
  const booking = useSelector(
    state => state.booking.processBookings[bookingId],
  );
  // console.log('params');
  // console.log(params);
  useEffect(() => {
    if (!booking);
    dispatch(LOAD_PROCESS_BOOKING(bookingId));
  }, [bookingId]);
  const nextStep = () => setActiveStep(activeStep + 1);
  const previousStep = () => setActiveStep(activeStep - 1);

  return (
    <View style={{flex: 1, backgroundColor: '#1C2B39'}}>
      {!booking ? (
        <QuotationLoaderSkeleton />
      ) : (
        <>
          <ProgressSteps
            activeStepIconBorderColor={colors.YELLOW}
            activeStepIconColor={colors.YELLOW}
            activeStepNumColor={colors.PRIMARY}
            completedStepIconColor={colors.YELLOW}
            completedProgressBarColor={colors.YELLOW}
            progressBarColor={colors.YELLOW}
            // progressBarColor="#405263"
            disabledStepIconColor="#405263"
            disabledStepIconBorderColor={colors.YELLOW}
            activeLabelColor={colors.YELLOW}
            activeStep={activeStep}>
            <ProgressStep
              // onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.nextBtnStyle}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                pagingEnabled: false,
              }}
              removeBtnRow={true}
              label={
                booking.hasReturnBooking ? 'Outbound Quotations' : 'Quotations'
              }>
              <QuotationSelector
                nextStep={nextStep}
                hasReturnBooking={booking.hasReturnBooking}
                bookingId={booking._id}
              />
            </ProgressStep>
            {booking.hasReturnBooking && (
              <ProgressStep
                onPrevious={previousStep}
                nextBtnTextStyle={styles.btnText}
                nextBtnStyle={styles.nextBtnStyle}
                previousBtnTextStyle={styles.btnText}
                previousBtnStyle={styles.btn}
                scrollable={true}
                previousBtnText="<- Outbound Quotations"
                scrollViewProps={{
                  showsVerticalScrollIndicator: false,
                  pagingEnabled: true,
                }}
                removeBtnRow={false}
                label="Inbound Quotations">
                <QuotationSelector
                  nextStep={nextStep}
                  hasReturnBooking={booking.hasReturnBooking}
                  bookingId={booking.returnBooking._id}
                />
              </ProgressStep>
            )}

            <ProgressStep
              // onSubmit={onSubmit}
              onPrevious={previousStep}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.nextBtnStyle}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                pagingEnabled: false,
              }}
              previousBtnText={
                booking.hasReturnBooking
                  ? '<- Inbound Quotations'
                  : 'Quotations'
              }
              removeBtnRow={false}
              label="Passanger Details">
              <QuotationDetails nextStep={nextStep} booking={booking} />
            </ProgressStep>
            <ProgressStep
              onPrevious={previousStep}
              // onSubmit={onSubmit}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.nextBtnStyle}
              previousBtnTextStyle={styles.btnText}
              previousBtnStyle={styles.btn}
              scrollable={true}
              scrollViewProps={{
                showsVerticalScrollIndicator: false,
                // pagingEnabled: true,
              }}
              removeBtnRow={false}
              previousBtnText="<- Passanger Details"
              label="Payment">
              <QuotationCheckout nextStep={nextStep} booking={booking} />
            </ProgressStep>
            <ProgressStep
              onPrevious={previousStep}
              nextBtnTextStyle={styles.btnText}
              nextBtnStyle={styles.nextBtnStyle}
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
    backgroundColor: colors.YELLOW,
    color: colors.PRIMARY,
    borderRadius: 7,
    padding: 8,
    // width: 120,
    fontSize: 8,
  },
  btnText: {
    color: colors.PRIMARY,
    textAlign: 'center',
  },
  nextBtnStyle: {
    display: 'none',
  },
});
