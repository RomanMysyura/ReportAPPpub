

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import { SelectPartits } from './components/SelectPartits';
import { CrearPartit } from './components/CrearPartit';
import { Configuracio } from './components/Configuracio';
import { ConfigApartat } from './components/ConfigApartat';
import { NotesPartit } from './components/NotesPartit';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Escollir partit" component={SelectPartits} />
        <Stack.Screen name="Crear partit" component={CrearPartit}/>
        <Stack.Screen name="Apartats" component={Configuracio}/>
        <Stack.Screen name="Configurar apartat" component={ConfigApartat}/>
        <Stack.Screen name="Notes Partit" component={NotesPartit}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
