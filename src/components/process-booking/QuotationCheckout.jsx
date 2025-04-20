import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {WebView} from 'react-native-webview';
import colors from '../../constants/colors';
import CustomButton from '../common/CustomButton';
import bookingService from '../../api/BookingService';
import {useDispatch} from 'react-redux';
import {ERROR, SUCCESS} from '../../store/slices/message.slice';

const check = require('../../assets/images/check.png');
const checked = require('../../assets/images/checked.png');

const QuotationCheckout = ({booking, nextStep}) => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [value, setValue] = useState('one');
  const [priceData, setPriceData] = useState({fetched: false, booking: null});
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const color = colors.PRIMARY;

  useEffect(() => {
    if (booking?._id) {
      bookingService.getPriceByBookingId(booking._id).then(data => {
        setPriceData({fetched: true, booking: data});
        setFetching(false);
      });
    }
  }, [booking]);

  const applyVoucher = () => {
    if (voucherCode.trim().length === 0) return;
    setVoucherApplied(true);
    dispatch(SUCCESS('Voucher applied successfully'));
  };

  const payWithCash = () => {
    setFetching(true);
    bookingService
      .payWithCash(booking?._id)
      .then(() => {
        dispatch(SUCCESS('Pay With Cash Selected...'));
        nextStep();
      })
      .catch(err => {
        console.log(err);
        dispatch(ERROR('Unable to Pay With Cash'));
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const redeemPointsAndBook = () => {
    dispatch(SUCCESS('Redeemed 5716 points and booked successfully.'));
    nextStep();
  };

  if (!priceData.fetched) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={styles.loadingText}>Fetching Price...</Text>
      </View>
    );
  }

  const price = parseFloat(priceData.booking?.price || 0);
  const discountedPrice = voucherApplied
    ? (price * 0.9).toFixed(2)
    : price.toFixed(2);

  return (
    <View style={styles.container}>
      {/* Invoice View */}
      <View style={styles.invoiceContainer}>
        <Text style={styles.invoiceHeading}>Order Total</Text>

        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Outbound Journey</Text>
          <Text style={styles.invoiceValue}>£ {price.toFixed(2)}</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Voucher</Text>
          <Text style={styles.invoiceValue}>
            {voucherApplied ? '10% Applied' : 'N/A'}
          </Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabelTotal}>Total:</Text>
          <Text style={styles.invoiceValueTotal}>£ {discountedPrice}</Text>
        </View>

        {/* Voucher Input */}
        <View style={styles.voucherInputContainer}>
          <TextInput
            placeholder="Enter Voucher Code"
            placeholderTextColor="#aaa"
            style={styles.voucherInput}
            value={voucherCode}
            onChangeText={setVoucherCode}
          />
          <TouchableOpacity style={styles.applyButton} onPress={applyVoucher}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instructional Note */}
      <Text style={styles.noteText}>
        You can either pay with cash or use your reward points to complete the
        booking.
      </Text>

      {/* Payment Method Selection */}
      {/* <View style={styles.paymentMethodContainer}>
        <TouchableOpacity style={styles.radio} onPress={() => setValue('one')}>
          <Image
            source={value === 'one' ? checked : check}
            style={styles.radioIcon}
          />
          <Text style={styles.radioLabel}>Pay with Cash</Text>
        </TouchableOpacity>
      </View> */}

      {/* Redeem Points Button */}
      <CustomButton
        isDisabled={fetching}
        colorScheme={color}
        onPress={redeemPointsAndBook}>
        Redeem 5716 points and book
      </CustomButton>

      {/* Confirm & Pay Button */}
      <CustomButton
        isDisabled={fetching}
        colorScheme={color}
        onPress={payWithCash}>
        Confirm & Pay
      </CustomButton>

      {/* Online Payment - Pay Now */}
      <CustomButton
        isDisabled={fetching}
        colorScheme={color}
        onPress={() => setShowWebView(true)}>
        Pay Now
      </CustomButton>

      {/* Modal with WebView for Payment */}
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}>
        <View style={{flex: 1}}>
          <View
            style={{
              padding: 12,
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Close</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{
              uri: `https://yourdomain.com/booking/process/checkout/make-payment/${booking?._id}`,
            }}
            onNavigationStateChange={navState => {
              if (navState.url.includes('/success')) {
                setShowWebView(false);
                dispatch(SUCCESS('Payment successful'));
                nextStep();
              } else if (navState.url.includes('/cancel')) {
                setShowWebView(false);
                dispatch(ERROR('Payment was cancelled'));
              }
            }}
            startInLoadingState
          />
        </View>
      </Modal>
    </View>
  );
};

export default QuotationCheckout;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.GRAY,
  },
  invoiceContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  invoiceHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.PRIMARY,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 16,
    color: '#555',
  },
  invoiceValue: {
    fontSize: 16,
    color: '#111',
  },
  invoiceLabelTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  invoiceValueTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  voucherInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  applyButton: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noteText: {
    fontSize: 15,
    color: colors.PRIMARY,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 7,
    marginBottom: 7,
    elevation: 2,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIcon: {
    width: 20,
    height: 20,
    tintColor: colors.PRIMARY,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.PRIMARY,
  },
});
