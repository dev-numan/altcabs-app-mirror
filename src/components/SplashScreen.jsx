import React from 'react';
import {ImageBackground, ActivityIndicator} from 'react-native';
const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/splash.png')}
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#FFFFFF',
      }}
      resizeMode="cover">
      <ActivityIndicator
        color="#FFFFFF"
        size="large"
        style={{
          position: 'absolute',
          bottom: '32%',
          left: '45%',
          zIndex: 1,
        }}
      />
    </ImageBackground>
  );
};

export default SplashScreen;
