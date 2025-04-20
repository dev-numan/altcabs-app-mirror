import colors from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    paddingStart: 10,
    marginTop: 10,
    borderRadius: 5,
    height: 55,
  },
  innerContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  headingTxt: {
    color: colors.PRIMARY,
    fontSize: 11,
    letterSpacing: 0.75,
    fontWeight: '400',
    marginTop: 5,
    fontFamily: fonts.Regular,
  },
  inputContainer: {
    flex: 1,
    // fontFamily: fonts.Regular,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,

    // backgroundColor: 'red',
    color: 'white',
  },
  eyeOpenIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
  },
  calendarIcon: {height: 16, width: 14, alignSelf: 'center', marginRight: 10},
});

export default styles;
