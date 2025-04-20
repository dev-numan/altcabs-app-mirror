import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/colors';
import {useSelector} from 'react-redux';
import {selectFleetTypes} from '../../../store/selectors';
import FleetInfoLoaderSkeleton from '../../common/skeletons/FleetInfoLoaderSkeleton';
import {useMemo} from 'react';

const VechicleInfoPopUp = ({fleet_type_id}) => {
  const [modalVisible, setModalVisible] = useState(false);

  let fleetTypes = useSelector(selectFleetTypes);
  // console.log(fleetTypes);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const fleetType = useMemo(() => {
    return fleetTypes.find(ft => String(ft._id) === String(fleet_type_id));
  }, [fleetTypes, fleet_type_id]);
  let showLoading = !Boolean(fleetType);
  console.log(fleetType);
  let vehicleLogo = `https://www.altcabs.com/images/fleet-icons-pngs/${fleetType?._id}.png`;
  return (
    <View style={styles.container}>
      {/* Info Icon that triggers the modal */}
      <TouchableOpacity onPress={toggleModal}>
        <MaterialCommunityIcons
          name="information-outline"
          size={16}
          color={colors.PRIMARY}
        />
      </TouchableOpacity>

      {/* Modal to show the information */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <MaterialCommunityIcons name="close" size={20} color="white" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{fleetType?.name} Info</Text>
            {showLoading ? (
              <FleetInfoLoaderSkeleton />
            ) : (
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Image
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
                  />
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="car" size={16} color="black" />
                  <Text style={styles.infoText}>
                    Upto {fleetType?.capacity} Passengers
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="luggage"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.infoText}>
                    {fleetType?.large_capacity} Large Suitcase or
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="briefcase"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.infoText}>
                    {fleetType?.small_capacity} Small Briefcase
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.infoText}>Meet & Greet*</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="baby-carriage"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.infoText}>Child seats on demand*</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="clock"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.infoText}>Free waiting time*</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="door" size={16} color="black" />
                  <Text style={styles.infoText}>Private door to door</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.PRIMARY,
    borderRadius: 15,
    padding: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default VechicleInfoPopUp;
