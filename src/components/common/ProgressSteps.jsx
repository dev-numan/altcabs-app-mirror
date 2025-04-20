import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';

const CustomProgressSteps = ({
  steps,
  activeStep,
  children,
  nextStep,
  previousStep,
}) => {
  const steps5 = [
    {label: 1, secondaryLabel: 'Fwd Quotes'},
    {label: 2, secondaryLabel: 'Return Quotes'},
    {label: 3, secondaryLabel: 'Passenger'},
    {label: 4, secondaryLabel: 'Checkout'},
    {label: 5, secondaryLabel: 'Success'},
  ];

  const steps4 = [
    {label: 1, secondaryLabel: 'Quotes'},
    {label: 2, secondaryLabel: 'Passenger'},
    {label: 3, secondaryLabel: 'Checkout'},
    {label: 4, secondaryLabel: 'Success'},
  ];

  const stepsShow = steps === 4 ? steps4 : steps5;

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        {stepsShow.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          const StepCircle = () => (
            <View
              style={[
                styles.circle,
                isCompleted
                  ? styles.completedCircle
                  : isActive
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}>
              <Icon
                name={
                  isCompleted
                    ? 'check'
                    : isActive
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={20}
                color="#fff"
              />
            </View>
          );

          return (
            <React.Fragment key={index}>
              <View style={styles.step}>
                {isCompleted ? (
                  <TouchableOpacity onPress={() => previousStep(index)}>
                    <StepCircle />
                  </TouchableOpacity>
                ) : (
                  <StepCircle />
                )}
                <Text style={styles.label}>{step.secondaryLabel}</Text>
              </View>

              {/* Line between steps (not after last) */}
              {index !== stepsShow.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index < activeStep ? colors.black : '#ccc',
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexWrap: 'nowrap',
  },
  step: {
    alignItems: 'center',
    width: 70,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedCircle: {
    backgroundColor: 'green',
  },
  activeCircle: {
    backgroundColor: colors.PRIMARY,
  },
  inactiveCircle: {
    backgroundColor: colors.GRAY,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.PRIMARY,
  },
  line: {
    height: 2,
    flex: 1,
    marginHorizontal: 4,
    marginTop: -16,
  },
  contentContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});

export default CustomProgressSteps;
