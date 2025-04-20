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
import CustomProgressSteps from '../common/ProgressSteps';
import CustomProgressStep from '../common/ProgressStep';
import BookingBidding from './BookingBidding';
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
    // console.log('booking', booking);
    if (!booking);
    dispatch(LOAD_PROCESS_BOOKING(bookingId));
  }, [bookingId]);
  const nextStep = () => setActiveStep(activeStep + 1);
  const previousStep = () => setActiveStep(activeStep - 1);
  // console.log('booking.hasReturnBooking', booking?.hasReturnBooking);
  // console.log(`Booking Type: ${booking?.booking_type}`);

  return (
    <View style={{flex: 1, backgroundColor: colors.BACKGROUND}}>
      {!booking ? (
        <QuotationLoaderSkeleton />
      ) : (
        <>
          {booking.hasReturnBooking ? (
            <CustomProgressSteps steps={5} activeStep={activeStep}>
              {activeStep == 0 && (
                <CustomProgressStep
                  label={
                    booking.hasReturnBooking
                      ? 'Outbound Quotations'
                      : 'Quotations'
                  }>
                  {booking?.booking_type == 'normal' && (
                    <QuotationSelector
                      nextStep={nextStep}
                      hasReturnBooking={booking.hasReturnBooking}
                      bookingId={booking?._id}
                    />
                  )}
                  {booking?.booking_type == 'client_bidding' && (
                    <BookingBidding
                      nextStep={nextStep}
                      hasReturnBooking={booking.hasReturnBooking}
                      bookingId={booking?._id}
                    />
                  )}
                </CustomProgressStep>
              )}
              {activeStep == 1 && (
                <CustomProgressStep label={'Inbound Quotations'}>
                  <QuotationSelector
                    nextStep={nextStep}
                    hasReturnBooking={booking.hasReturnBooking}
                    bookingId={booking.returnBooking?._id}
                  />
                </CustomProgressStep>
              )}

              {activeStep == 2 && (
                <CustomProgressStep label={'Passanger Details'}>
                  <QuotationDetails nextStep={nextStep} booking={booking} />
                </CustomProgressStep>
              )}
              {activeStep == 3 && (
                <CustomProgressStep label={'Payment'}>
                  <QuotationCheckout nextStep={nextStep} booking={booking} />
                </CustomProgressStep>
              )}
              {activeStep == 4 && (
                <CustomProgressStep label={'Confirmation'}>
                  <QuotationSuccess booking={booking} />
                </CustomProgressStep>
              )}

              {/* <Text>Text here</Text> */}
            </CustomProgressSteps>
          ) : (
            <CustomProgressSteps
              steps={4}
              activeStep={activeStep}
              nextStep={nextStep}
              previousStep={previousStep}>
              {activeStep == 0 && (
                <CustomProgressStep
                  label={
                    booking.booking_type == 'client_bidding'
                      ? 'Select Best Bid'
                      : booking.hasReturnBooking
                      ? 'Outbound Quotations'
                      : 'Quotations'
                  }>
                  {booking?.booking_type == 'normal' && (
                    <QuotationSelector
                      nextStep={nextStep}
                      hasReturnBooking={booking.hasReturnBooking}
                      bookingId={booking?._id}
                    />
                  )}
                  {booking?.booking_type == 'client_bidding' && (
                    <BookingBidding
                      nextStep={nextStep}
                      hasReturnBooking={booking.hasReturnBooking}
                      bookingId={booking?._id}
                      booking={booking}
                    />
                  )}
                </CustomProgressStep>
              )}
              {activeStep == 1 && (
                <CustomProgressStep label={'Passanger Details'}>
                  <QuotationDetails nextStep={nextStep} booking={booking} />
                </CustomProgressStep>
              )}
              {activeStep == 2 && (
                <CustomProgressStep label={'Payment'}>
                  <QuotationCheckout nextStep={nextStep} booking={booking} />
                </CustomProgressStep>
              )}
              {activeStep == 3 && (
                <CustomProgressStep label={'Confirmation'}>
                  <QuotationSuccess booking={booking} />
                </CustomProgressStep>
              )}

              {/* <Text>Text here</Text> */}
            </CustomProgressSteps>
          )}
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
