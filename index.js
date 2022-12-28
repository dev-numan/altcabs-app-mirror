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

const AltCabsApp = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <App />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};
