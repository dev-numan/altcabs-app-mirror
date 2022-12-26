import React, {useEffect} from 'react';
import {NativeBaseProvider, Box} from 'native-base';
import useCachedResources from './src/hooks/useCachedResource';
import SplashScreen from './src/components/SplashScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './src/store';
import {loadClientApp} from './src/store/slices/app.slice';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';
export default function App() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const {app, isLoadingComplete} = useSelector(state => state.app);
  const loadApp = () => {
    setTimeout(() => {
      dispatch(loadClientApp());
    }, 2000);
  };
  useEffect(loadApp, []);
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        {isLoadingComplete ? (
          <>
            <AuthStackNavigator />
          </>
        ) : (
          <>
            <SplashScreen />
          </>
        )}
        {/* <Box>Hello world</Box> */}
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
