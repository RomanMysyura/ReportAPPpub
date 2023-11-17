import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export const SelectPartits = () => {
  const [selectedPartit, setSelectedPartit] = useState(null);
  const [searchText, setSearchText] = useState('');

  const nav = useNavigation();

  const NotesPartit = (nombrePartido) => {
    nav.navigate('Notes Partit', { nombrePartido });
  };

  const [partits, setPartits] = useState([]);
  useEffect(() => {
    const cargarPartits = async () => {
      try {
        const informesGuardados = await AsyncStorage.getItem(
          'informespartits'
        );
        if (informesGuardados) {
          const informespartits = JSON.parse(informesGuardados);
          setPartits(informespartits);
        }
      } catch (error) {
        console.error('Error al cargar los partidos:', error);
      }
    };
    cargarPartits();
  }, []);

  const eliminarPartido = (index) => {
    Alert.alert(
      'Eliminar partido',
      '¿Quieres eliminar este partido?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => {
            const nuevosPartits = [...partits];
            nuevosPartits.splice(index, 1);
            setPartits(nuevosPartits);

            AsyncStorage.setItem(
              'informespartits',
              JSON.stringify(nuevosPartits),
              (error) => {
                if (!error) {
                  console.log('Partido eliminado');
                } else {
                  console.error('Error al eliminar el partido:', error);
                }
              }
            );
          },
        },
      ]
    );
  };

  const searchPartidos = () => {
    return partits.filter((partido) =>
      partido.nomPartida.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar partits"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {searchPartidos().map((partido, index) => (
        <View key={index} style={styles.partidoContainer}>
          <TouchableOpacity
            style={styles.btnPartit}
            onPress={() => NotesPartit(partido.nomPartida)}
          >
            <Text style={styles.nomParit}>{partido.nomPartida}{'\n'}</Text>
            <Text style={styles.textCategoria}>{partido.categoria}{'\n'}</Text>
            <Text style={styles.btnText}>
              Data: {new Date(partido.date).toDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eliminarBtn}
            onPress={() => eliminarPartido(index)}
          >
            <Text style={styles.eliminarBtnText}>
              <Icon name="trash" size={28} color="red" />
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      {searchPartidos().length === 0 && partits.length === 0 && (
        <Text style={styles.emptyText}>No tienes partidos creados</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  partidoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: 'black',
    margin: 5,
    borderLeftWidth: 5,
    borderColor: '#0077b6',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, // Esta propiedad es específica para Android
  
  },
  btnPartit: {
    width: 320,
    justifyContent: 'center',
    margin: 8,
  },
  eliminarBtn: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -10,
    top: 56,
  },
  btnText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  nomParit: {
    textAlign: 'center',
    color: 'black',
    fontSize: 33,
    marginTop: 0,
    marginBottom: -30,
  },
  textCategoria: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    marginBottom: -15,
  },
  eliminarBtnText: {
    color: 'red',
    fontSize: 15,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  searchInput: {
    fontSize: 20,
    height: 45,
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 0,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    backgroundColor: 'white',
  },
});
