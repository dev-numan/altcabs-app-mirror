import React from 'react';
import {StyleSheet} from 'react-native';
import {Heading, Spinner, Modal, HStack} from 'native-base';
import {useSelector} from 'react-redux';
const SavingModel = () => {
  const {isModel, modelTitle} = useSelector(state => state.Loading);
  return (
    <Modal isOpen={isModel}>
      <Modal.Content>
        <Modal.Body>
          <HStack p={4} justifyContent="center" alignItems="center" space={3}>
            <Spinner color="rgb(28, 43, 57)" size={20} />
            <Heading fontSize="xl" color="rgb(28, 43, 57)">
              {modelTitle}...
            </Heading>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SavingModel;

const styles = StyleSheet.create({});
