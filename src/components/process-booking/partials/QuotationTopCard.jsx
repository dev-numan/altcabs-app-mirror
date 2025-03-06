import {Button, Text, View} from 'native-base';
import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

const QuotationTopCard = ({quotation, type, onQuotationSelect}) => {
  const getTitleFromType = () => {
    switch (type) {
      case 'lowest':
        return 'Lowest Price';
      case 'best-rated':
        return 'Best Rated';
      case 'top-executive':
        return 'Top Executive';
      default:
        return 'Recommended';
    }
  };

  const QuotationLoaderSkeletonOnCard = () => {
    return (
      <View style={styles.cardContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  };

  if (!quotation) return <QuotationLoaderSkeletonOnCard />;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{getTitleFromType()}</Text>
      </View>
      <Text style={styles.companyName}>{quotation.companyName}</Text>
      <Text style={styles.vehicleType}>{quotation.vehicle_type_name}</Text>
      <Button
        rounded="md"
        p="3"
        style={styles.buttonStyle}
        onPress={() => onQuotationSelect(quotation.index)}>
        <Text style={styles.buttonText}>
          £ {Number(quotation.totalPrice).toFixed(2)}
        </Text>
      </Button>
    </View>
  );
};

export default QuotationTopCard;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    marginBottom: 10,
  },
  titleText: {
    color: colors.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  companyName: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  vehicleType: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonStyle: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
});