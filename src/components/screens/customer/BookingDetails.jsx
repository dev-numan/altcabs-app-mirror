import {Text, View} from 'native-base';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import moment from 'moment';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const BookingDetails = ({route}) => {
  const navigation = useNavigation();
  const {booking} = route.params;

  const InfoRow = ({icon, label, value, iconColor = colors.YELLOW}) => (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color={iconColor} style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const ActionButton = ({icon, label, onPress, bgColor = colors.YELLOW}) => (
    <TouchableOpacity
      style={[styles.actionButton, {backgroundColor: bgColor}]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Icon name={icon} size={20} color={colors.PRIMARY} />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Icon
              name={
                booking.status === 'upcoming'
                  ? 'check-circle'
                  : 'clock-outline'
              }
              size={32}
              color={colors.YELLOW}
            />
          </View>
          <Text style={styles.statusTitle}>
            {booking.status === 'upcoming' ? 'Booking Confirmed' : 'Pending'}
          </Text>
          <Text style={styles.refNumber}>Reference: #{booking.reference}</Text>
        </View>

        {/* Journey Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey Details</Text>
          <View style={styles.card}>
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={styles.routeIconContainer}>
                  <Icon name="map-marker" size={24} color={colors.YELLOW} />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Pick Up Location</Text>
                  <Text style={styles.routeAddress}>{booking.from_desc}</Text>
                </View>
              </View>

              <View style={styles.routeLine} />

              <View style={styles.routePoint}>
                <View style={styles.routeIconContainer}>
                  <Icon
                    name="map-marker-check"
                    size={24}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeLabel}>Drop Off Location</Text>
                  <Text style={styles.routeAddress}>{booking.to_desc}</Text>
                </View>
              </View>
            </View>

            {(booking.hasReturnBooking || booking.returnBooking) && (
              <>
                <View style={styles.divider} />
                <View style={styles.returnJourneyBadge}>
                  <Icon name="swap-horizontal" size={16} color={colors.YELLOW} />
                  <Text style={styles.returnJourneyText}>Return Journey Included</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          <View style={styles.card}>
            <InfoRow
              icon="calendar-clock"
              label="Pickup Date & Time"
              value={moment(booking.startTime).format('dddd, MMMM DD, YYYY - HH:mm')}
            />
            {booking.quotation?.vehicle_type && (
              <InfoRow
                icon="car"
                label="Vehicle Type"
                value={booking.quotation.vehicle_type}
              />
            )}
            {booking.quotation?.company_name && (
              <InfoRow
                icon="office-building"
                label="Company"
                value={booking.quotation.company_name}
              />
            )}
            {booking.flightNum && (
              <InfoRow
                icon="airplane"
                label="Flight Number"
                value={booking.flightNum}
              />
            )}
            {booking.distance && (
              <InfoRow
                icon="map-marker-distance"
                label="Distance"
                value={booking.distanceText || `${(booking.distance / 1000).toFixed(1)} km`}
              />
            )}
            {booking.duration && (
              <InfoRow
                icon="timer-outline"
                label="Duration"
                value={booking.durationText || `${Math.round(booking.duration / 60)} mins`}
              />
            )}
          </View>
        </View>

        {/* Passenger Information */}
        {booking.passanger && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passenger Information</Text>
            <View style={styles.card}>
              {booking.passanger.name && (
                <InfoRow
                  icon="account"
                  label="Name"
                  value={booking.passanger.name}
                />
              )}
              {booking.passanger.email && (
                <InfoRow
                  icon="email"
                  label="Email"
                  value={booking.passanger.email}
                />
              )}
              {booking.passanger.phone && (
                <InfoRow
                  icon="phone"
                  label="Phone"
                  value={booking.passanger.phone}
                />
              )}
            </View>
          </View>
        )}

        {/* Additional Information */}
        {booking.additionalInformation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={styles.card}>
              <Text style={styles.additionalInfo}>
                {booking.additionalInformation}
              </Text>
            </View>
          </View>
        )}

        {/* Price Details */}
        {booking.totalPrice && (
          <View style={[styles.section]}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.card}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Amount</Text>
                <Text style={styles.priceValue}>
                  £{booking.totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.paymentStatusRow}>
                <Icon
                  name={booking.isPaid ? 'check-circle' : 'clock-outline'}
                  size={16}
                  color={booking.isPaid ? '#4CAF50' : colors.YELLOW}
                />
                <Text style={styles.paymentStatusText}>
                  {booking.isPaid ? 'Paid' : 'Payment Pending'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {moment(booking.cancellationTime).diff(moment(), 'minutes') > 0 && (
            <ActionButton
              icon="close-circle"
              label="Cancel Booking"
              bgColor="#EF4444"
              onPress={() => {
                navigation.navigate('Booking Cancellation Confirmation', {
                  booking,
                });
              }}
            />
          )}

          {!booking.isConfirmed && booking.booking_type === 'client_bidding' && (
            <ActionButton
              icon="gavel"
              label="View Bids"
              onPress={() => {
                navigation.navigate('ProcessBooking', {
                  bookingId: booking._id,
                });
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statusCard: {
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  statusBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    color: colors.YELLOW,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  refNumber: {
    color: '#94a3b8',
    fontSize: 14,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    color: colors.YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  routeContainer: {
    paddingVertical: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 8,
  },
  routeLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  routeAddress: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#3a4452',
    marginLeft: 19,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a3442',
    marginVertical: 12,
  },
  returnJourneyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  returnJourneyText: {
    color: colors.YELLOW,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  additionalInfo: {
    color: 'white',
    fontSize: 14,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  priceValue: {
    color: colors.YELLOW,
    fontSize: 20,
    fontWeight: '500',
  },
  paymentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentStatusText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  actionsSection: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    color: colors.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
