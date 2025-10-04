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
          const isCompleted = index < activeStep;
          const stepStyle = [
            styles.step,
            isActive && styles.activeStep,
            isCompleted && styles.completedStep,
          ];
          const textStyle = [
            styles.stepText,
            isActive && styles.activeStepText,
            isCompleted && styles.completedStepText,
          ];
          return (
            <View key={step.label} style={styles.stepContainer}>
              <View style={stepStyle}>
                <Text style={textStyle}>{step.label}</Text>
              </View>
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
    paddingHorizontal: 30,
  },
  stepContainer: {
    alignItems: 'center',
  },
  step: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.GRAY_LIGHT,
    borderWidth: 2,
    borderColor: colors.GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeStep: {
    backgroundColor: colors.YELLOW,
    borderColor: colors.SECONDARY,
    borderWidth: 3,
    shadowColor: colors.YELLOW,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
    transform: [{scale: 1.1}],
  },
  completedStep: {
    backgroundColor: colors.SECONDARY,
    borderColor: colors.SECONDARY,
    borderWidth: 2,
  },
  stepText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.GRAY,
  },
  activeStepText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.PRIMARY,
  },
  completedStepText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.PRIMARY,
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
