import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const nav = useNavigation();

  const navigateToScreen = (screenName) => {
    nav.navigate(screenName, { options: { headerTitle: null } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texttitol}>ReportAPP</Text>
      <View style={styles.containerButtons}>
        <TouchableOpacity
          style={[styles.btnentrar, styles.btn]}
          onPress={() => navigateToScreen('Escollir partit')}
        >
          <Text style={styles.btnText}>Escollir partit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnentrar, styles.btn]}
          onPress={() => navigateToScreen('Crear partit')}
        >
          <Text style={styles.btnText}>Crear nou partit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnentrar, styles.btn]}
          onPress={() => navigateToScreen('Apartats')}
        >
          <Text style={styles.btnText}>Configuració</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  texttitol: {
    textAlign: 'center',
    fontSize: 70,
    marginTop: 70,
    color: '#0077b6',
  },
  containerButtons: {
    marginTop: 70,
  },
  btn: {
    width: 350,
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center', // Centra los elementos horizontalmente
  },
  btnentrar: {
    backgroundColor: '#0077b6',
    margin: 7,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
  },
});

export default HomeScreen;
