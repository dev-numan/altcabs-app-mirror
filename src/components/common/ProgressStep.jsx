import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const CustomProgressStep = ({label, children}) => {
  //   const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Text style={styles.heading}>{label}</Text>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  // stepContainer: {
  //   alignItems: 'center',
  // },
  // step: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   backgroundColor: '#ccc',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // activeStep: {
  //   backgroundColor: colors.YELLOW,
  // },
  // line: {
  //   width: 1,
  //   height: 25,
  //   backgroundColor: '#ccc',
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 25,
  // },
  heading: {
    color: colors.DARK_COLOR,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
  },
  stepContainer: {
    alignItems: 'center',
  },
  step: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: colors.SECONDRY_2,
  },
  // line: {
  //   width: 50,
  //   height: 1,
  //   backgroundColor: '#ccc',
  //   marginLeft: 10,
  //   marginRight: 10,
  // },
  line: {
    width: 50,
    height: 1,
    backgroundColor: '#ccc',
    position: 'absolute',
    top: 25,
    left: 0,
  },
});

export default CustomProgressStep;
