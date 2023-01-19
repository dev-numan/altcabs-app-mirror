import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Heading, Spinner, Modal, HStack, Text} from 'native-base';
import {useSelector} from 'react-redux';
const SavingModel = () => {
  const {isModel, modelTitle} = useSelector(state => state.Loading);
  console.log(modelTitle);
  return (
    <Modal isOpen={isModel}>
      <Modal.Content>
        <Modal.Body>
          <HStack p={4} justifyContent="center" alignItems="center" space={3}>
            <Spinner color="rgb(28, 43, 57)" size={20} />
            <Heading fontSize="xl" color="rgb(28, 43, 57)">
              <Text>{modelTitle}...</Text>
            </Heading>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
    // <View>{/* <Text></Text> */}</View>
  );
};

export default SavingModel;

const styles = StyleSheet.create({});
