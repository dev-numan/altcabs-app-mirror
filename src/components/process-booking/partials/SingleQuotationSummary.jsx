import {Button, Text, View} from 'native-base';
import React from 'react';
import {ActivityIndicator, StyleSheet, Image} from 'react-native';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import VechicleInfoPopUp from './VechicleInfoPopUp';
import {useSelector} from 'react-redux';
import {selectFleetTypes} from '../../../store/selectors';
import {useMemo} from 'react';
const SingleQuotationSummary = ({
  quotation,
  type,
  onQuotationSelect,
  isTopCard,
}) => {
  // console.log(quotation.vehicle_type);
  let fleetTypes = useSelector(selectFleetTypes);
  const fleetType = useMemo(() => {
    return fleetTypes.find(
      ft => String(ft._id) === String(quotation.vehicle_type),
    );
  }, [fleetTypes, quotation.vehicle_type]);
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
  const getIconByType = () => {
    switch (type) {
      case 'lowest':
        return 'sale';
      case 'best-rated':
        return 'star';
      case 'top-executive':
        return 'account-tie';
      default:
        return 'thumb-up';
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
  let vehicleLogo = `https://www.altcabs.com/images/fleet-icons-pngs/${quotation.vehicle_type}.png`;

  return (
    <View style={{width: '100%'}}>
      <View
        style={{
          width: '100%',
          margin: 5,
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 5,
        }}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}>
          {isTopCard && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                gap: 5,
              }}>
              <MaterialCommunityIcons
                name={getIconByType()}
                size={16}
                color="black"
              />
              {getTitleFromType()}
            </Text>
          )}

          <Text
            style={{
              color: colors.PRIMARY,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {quotation.vehicle_type_name}{' '}
            <Text
              style={{
                fontSize: 12,
                color: colors.PRIMARY,
                borderWidth: 1,
                borderColor: colors.PRIMARY,
              }}>
              {fleetType.slogan}
            </Text>
            <VechicleInfoPopUp fleet_type_id={quotation.vehicle_type} />{' '}
          </Text>
          {fleetType?.models && <Text>{fleetType?.models}</Text>}

          {/* <Image
            style={{
              width: 60,
              resizeMode: 'contain',
              aspectRatio: 1,
              // backgroundColor: 'yellow',
              alignSelf: 'center',
            }}
            source={{
              uri: vehicleLogo,
            }}
          /> */}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '600'}}>{quotation.companyName}</Text>
          <Text style={{}}>{quotation.companyLocation}</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: colors.GRAY,
          }}>
          <Text
            style={{
              fontSize: 20, // Slightly larger for emphasis
              fontWeight: 'bold', // Bold for prominence
              color: colors.PRIMARY, // Use primary theme color for branding
              textAlign: 'center', // Ensure it’s centered
              paddingVertical: 5, // Add some spacing
            }}>
            £ {Number(quotation.totalPrice).toFixed(2)}
          </Text>
          <Button
            rounded="md"
            style={{
              fontSize: 18,
              // fontWeight: '600',
              color: '#FFF',
              // textAlign: 'center',
              backgroundColor: colors.PRIMARY,
            }}
            onPress={() => onQuotationSelect(quotation.index)}>
            <Text style={{color: colors.WHITE, fontWeight: '600'}}>Select</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SingleQuotationSummary;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 5, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 5,
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
