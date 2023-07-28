import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
const TaxiCard = ({ referenceNo, journeyInfo, passengerDetails, pickupLocation, paymentDetails, status, onAccept, onReject }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Reference No:</Text>
        <Text style={styles.info}>{referenceNo}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Journey Info:</Text>
        <Text style={styles.info}>{journeyInfo}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Passenger/Luggage Details:</Text>
        <Text style={styles.info}>{passengerDetails}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Pickup Location:</Text>
        <Text style={styles.info}>{pickupLocation}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Payment Details:</Text>
        <Text style={styles.info}>{paymentDetails}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.info}>{status}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom:15
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  info: {
    fontSize: 16,
    color: '#666666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    flex: 1,
    backgroundColor:colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaxiCard;
