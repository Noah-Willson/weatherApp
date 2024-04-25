
import { NavigationContainer } from '@react-navigation/native';
import Weather from './Components';
import Result from './Components/Result';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Weather"
          component={Weather}
          options={{ title: 'Weather App' }}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{ title: 'Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}