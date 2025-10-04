import {HStack, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import colors from '../../../../constants/colors';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookingSummaryView = ({booking, index}) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('Booking Details', {
          booking: booking,
        });
      }}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.refText}>Ref # {booking.reference}</Text>
            <Text style={styles.statusText}>
              {booking.status === 'upcoming' ? '🟢 Confirmed' : '⚪ ' + booking.status}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color={colors.YELLOW} />
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeRow}>
            <Icon name="map-marker" size={20} color={colors.YELLOW} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>From</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {booking.from_desc}
              </Text>
            </View>
          </View>

          <View style={styles.routeDivider}>
            <View style={styles.dottedLine} />
          </View>

          <View style={styles.routeRow}>
            <Icon name="map-marker-check" size={20} color="#4CAF50" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>To</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {booking.to_desc}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Icon name="clock-outline" size={16} color={colors.YELLOW} />
            <Text style={styles.footerText}>
              {moment(booking.startTime).format('MMM DD, HH:mm')}
            </Text>
          </View>
          {booking.totalPrice && (
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>£{booking.totalPrice?.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingSummaryView;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a2332',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2a3442',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: colors.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  refText: {
    color: colors.YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  routeContainer: {
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 2,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  routeDivider: {
    marginLeft: 10,
    marginVertical: 4,
  },
  dottedLine: {
    width: 2,
    height: 20,
    backgroundColor: '#3a4452',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a3442',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 6,
  },
  priceTag: {
    backgroundColor: colors.YELLOW,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: colors.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
