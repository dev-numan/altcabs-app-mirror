import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const CustomProgressSteps = ({steps, activeStep, label, children}) => {
  //   const [activeStep, setActiveStep] = useState(0);
  // const [stepShow,setStepShow] = React.useState()
  const steps5 = [
    {
      label: 1,
    },
    {
      label: 2,
    },
    {
      label: 3,
    },
    {
      label: 4,
    },
    {
      label: 5,
    },
  ];
  const steps4 = [
    {
      label: 1,
    },
    {
      label: 2,
    },
    {
      label: 3,
    },
    {
      label: 4,
    },
  ];
  const stepsShow = steps == 4 ? steps4 : steps5;
  
  return (
    <View>
      <View style={styles.container}>
        {stepsShow.map((step, index) => {
          const isActive = index === activeStep;
          const stepStyle = [styles.step, isActive && styles.activeStep];
          return (
            // <View style={stepStyle}>
            //   <Text>{step.label}</Text>
            // </View>
            <View key={step.label} style={styles.stepContainer}>
              <View style={stepStyle}>
                <Text>{step.label}</Text>
              </View>
              {/* {index < steps.length - 1 && (
                <View style={[styles.line, {left: (index + 1) * 60}]} />
              )} */}
            </View>
          );
        })}
      </View>

      {/* <Text style={styles.heading}>{label}</Text> */}
      {children}
    </View>
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
    color: colors.YELLOW,
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
    backgroundColor: colors.YELLOW,
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

export default CustomProgressSteps;
