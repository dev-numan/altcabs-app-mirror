/**
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import {store} from './src/store';
AppRegistry.registerComponent(appName, () => AltCabsApp);

const linking = {
  prefixes: ['altcabs://', 'altcabs.com://'],
  config: {
    screens: {
      // Profile: 'Profile',
      // MyBookings: 'MyBookings',
      // MyDetails: 'MyDetails',
      // SettingsScreen: 'settingsscreen',
    },
    // screens: {
    //   NoBottom: {
    //     screens: {
    //       profile: 'MyBookings',
    //       // MyBookings: 'MyBookings',
    //       MyDetails: 'MyDetails',
    //     },
    //   },
    //   App: 'MainStack',
    // },
  },
};

const AltCabsApp = () => {
  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <NativeBaseProvider>
          <App />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};
