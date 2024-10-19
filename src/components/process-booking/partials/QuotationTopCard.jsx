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
      <View style={styles.typeView}>
        <ActivityIndicator size="large" color={colors.YELLOW} />
      </View>
    );
  };
  if (!quotation) return <QuotationLoaderSkeletonOnCard />;

  return (
    <View style={[styles.typeView]}>
      <View style={[styles.typeTextView]}>
        <Text style={styles.typeText}>{getTitleFromType()}</Text>
      </View>
      <Text style={styles.companyText}>{quotation.companyName}</Text>
      <Text style={styles.companyVehicleText}>
        {quotation.vehicle_type_name}
      </Text>
      <Button
        rounded="md"
        p="3"
        _text={{fontSize: 20, fontWeight: 600}}
        bg={colors.YELLOW}
        onPress={() => onQuotationSelect(quotation.index)}>
        <Text _text={{fontSize: 20, fontWeight: 600}}>
          £ {Number(quotation.totalPrice).toFixed(2)}{' '}
        </Text>
      </Button>
    </View>
  );
};

export default QuotationTopCard;

const styles = StyleSheet.create({
  typeView: {
    margin: 3,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    width: '50%',
    backgroundColor: colors.PRIMARY_40_DARK,
    borderColor: colors.YELLOW,
    borderWidth: 1,
  },
  typeTextView: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  typeText: {
    color: colors.YELLOW,
    fontSize: 15,
  },
  companyText: {
    color: 'white',
    marginTop: 14,
    textAlign: 'center',
  },
  companyVehicleText: {
    color: 'white',
    marginBottom: 14,
    fontSize: 11,
    textAlign: 'center',
  },
  priceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnText: {
    fontWeight: 600,
    color: 'white',
  },
});
