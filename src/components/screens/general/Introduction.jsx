import {useNavigation} from '@react-navigation/core';
import React, {createRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useDispatch} from 'react-redux';
import colors from '../../../constants/colors';
import {SET_APP_NEWLY_INSTALLED} from '../../../store/slices/introSlice';

const Introduction = () => {
  const appSlider = createRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const slides = [
    {
      key: 1,
      title: 'cabCOMPARE',
      text: `Compare the fares for your journey from different cab operators in your area. Simply enter your journey details and quotes will be generated. Fixed prices and free cancellations (subject to terms and conditions).`,
      text2: `Happy comparing!`,
      image: require('../../../assets/images/cabCompare.png'),
      bgColor: colors.SECONDARY,
    },
    {
      key: 2,
      title: 'cabMATCH',
      text: `If you are ready to travel, check out if any driver is heading your way. You can negotiate a discount directly with the operator in real-time chat via our platform.`,
      text2: `More savings for you!`,
      image: require('../../../assets/images/cabMatch.png'),
      bgColor: colors.CAB_MATCH,
    },
    {
      key: 3,
      title: 'cabBid',
      text: `Do you have some special requirements, not sure which vehicle type you need, it is a large group of people or you just want to see if you can save more on your journey? You can use our CabBid function to invite bids from different cab operators. You can select a bid to book your journey.`,
      text2: `More convenience for you!`,
      image: require('../../../assets/images/cabBid.png'),
      bgColor: colors.CAB_BID,
    },
  ];

  const _renderItem = ({item}) => {
    return (
      <View>
        <View
          style={{
            backgroundColor: item.bgColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: 500,
          }}>
          <Image
            source={item.image}
            style={{
              width: 300,
              height: 300,
              resizeMode: 'contain',
            }}
          />
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={[styles.text, {textAlign: 'center'}]}>{item.text2}</Text>
      </View>
    );
  };
  const _renderNextButton = i => {
    return (
      <TouchableOpacity
        onPress={() => appSlider.current.goToSlide(i + 1, true)}>
        <Text style={{fontSize: 12}}>NEXT</Text>
      </TouchableOpacity>
    );
  };
  const _renderPrevButton = i => {
    return (
      <TouchableOpacity
        onPress={() => appSlider.current.goToSlide(i - 1, true)}>
        <Text style={{fontSize: 12}}>PREV</Text>
      </TouchableOpacity>
    );
  };
  const _renderSkipButton = () => {
    return (
      <TouchableOpacity
        onPress={() => appSlider.current.goToSlide(slides.length - 1, true)}>
        <Text style={{color: colors.CAPTION, fontSize: 12}}>SKIP</Text>
      </TouchableOpacity>
    );
  };
  async function handleDone() {
    dispatch(SET_APP_NEWLY_INSTALLED('NO'));
    navigation.navigate('Login');
  }
  const _renderDoneButton = () => {
    return (
      <TouchableOpacity onPress={handleDone}>
        <Text style={{color: colors.PRIMARY, fontSize: 12, fontWeight: 'bold'}}>
          LOGIN
        </Text>
      </TouchableOpacity>
    );
  };

  const _renderPagination = activeIndex => {
    return (
      <View>
        <View
          style={[
            styles.row,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          {activeIndex === 0
            ? _renderSkipButton()
            : _renderPrevButton(activeIndex)}
          {/* <View
              style={[styles.row, {flexGrow: 0.5, justifyContent: 'center'}]}>
              {slides.length > 1 &&
                slides.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex
                        ? styles.activeDotStyle
                        : {backgroundColor: 'rgba(0, 0, 0, .2)'},
                    ]}
                    onPress={() => appSlider.current.goToSlide(i, true)}
                  />
                ))}
            </View> */}
          <View style={{flexGrow: 0.5}}>
            <ExpandingDot
              data={slides}
              expandingDotWidth={30}
              activeDotColor={colors.SECONDARY}
              scrollX={scrollX}
              inActiveDotOpacity={0.2}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 5,
              }}
              containerStyle={{
                position: 'relative',
                top: 0,
              }}
            />
          </View>

          {activeIndex === slides.length - 1
            ? _renderDoneButton(activeIndex)
            : _renderNextButton(activeIndex)}
        </View>
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              marginLeft: -2,
              height: Platform.OS === 'ios' ? 70 : 40,
              // borderWidth: 1,
            },
          ]}>
          {activeIndex === 1 && _renderSkipButton()}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        nextLabel="Next"
        doneLabel="Login"
        prevLabel="Prev"
        skipLabel="Skip"
        showPrevButton={true}
        showSkipButton={true}
        renderNextButton={_renderNextButton}
        renderPrevButton={_renderPrevButton}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
        renderPagination={_renderPagination}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        ref={appSlider}
      />
    </View>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  activeDotStyle: {
    backgroundColor: colors.SECONDARY,
    width: 35,
  },
  title: {
    color: colors.PRIMARY,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: '12%',
    marginBottom: 7,
  },
  text: {
    color: colors.BLACK,
    textAlign: 'justify',
    marginHorizontal: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
