import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import { EnviarInforme } from './EnviarInforme';



export const NotesPartit = ({ route }) => {
  const { nombrePartido } = route.params;
  const [config, setConfig] = useState([]);
  const [selectedSubtitulos, setSelectedSubtitulos] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [informes, setInformes] = useState([]);



  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };



  useEffect(() => {
    const loadConfig = async () => {
      try {
        const storedConfig = await AsyncStorage.getItem('config');
        if (storedConfig) {
          setConfig(JSON.parse(storedConfig));
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };



    const loadInformes = async () => {
      try {
        const storedInformes = await AsyncStorage.getItem('informesPartits');
        if (storedInformes) {
          setInformes(JSON.parse(storedInformes));
        }
      } catch (error) {
        console.error('Error loading informes:', error);
      }
    };



    const loadSelectedSubtitulos = async () => {
      try {
        const storedSelectedSubtitulos = await AsyncStorage.getItem(`selectedSubtitulos_${nombrePartido}`);
        if (storedSelectedSubtitulos) {
          setSelectedSubtitulos(JSON.parse(storedSelectedSubtitulos));
        }
      } catch (error) {
        console.error('Error loading selected subtitulos:', error);
      }
    };



    loadConfig();
    loadInformes();
    loadSelectedSubtitulos();
  }, [nombrePartido]);



  const handleCheckboxChange = (indiceTitulo, indiceSubtitulo) => {
    setSelectedSubtitulos((prevSelected) => {
      const newSelected = { ...prevSelected };

      if (newSelected[indiceTitulo]) {
        const isSelected = newSelected[indiceTitulo].includes(indiceSubtitulo);

        if (isSelected) {
          newSelected[indiceTitulo] = newSelected[indiceTitulo].filter((item) => item !== indiceSubtitulo);

          if (newSelected[indiceTitulo].length === 0) {
            delete newSelected[indiceTitulo];
          }
        } else {
          newSelected[indiceTitulo].push(indiceSubtitulo);
        }
      } else {
        newSelected[indiceTitulo] = [indiceSubtitulo];
      }

      
      try {
        AsyncStorage.setItem(`selectedSubtitulos_${nombrePartido}`, JSON.stringify(newSelected));
      } catch (error) {
        console.error('Error saving selected subtitulos:', error);
      }

      return newSelected;
    });
  };



  const guardarInformes = async () => {
    try {
      const informeActual = informes.find((informe) => informe.nombrePartido === nombrePartido);

      if (informeActual) {
        informeActual.subtitulos = selectedSubtitulos;
      } else {
        const nuevoInforme = {
          nombrePartido,
          subtitulos: selectedSubtitulos,
        };

        informes.push(nuevoInforme);
      }

      await AsyncStorage.setItem('informesPartits', JSON.stringify(informes));
    } catch (error) {
      console.error('Error guardando informe:', error);
      Alert.alert('Error', 'Hubo un problema al intentar guardar el informe.');
    }
  };



  const renderInformeGuardado = () => {
    const informeActual = informes.find((informe) => informe.nombrePartido === nombrePartido);

    if (!informeActual) {
      return null;
    }

    return (
      <View style={styles.informeGuardadoContainer}>
        {Object.keys(informeActual.subtitulos).map((categoria, index) => (
          <View key={index}>
            <View style={styles.subtituloItem}>
            <Text style={styles.subtituloItemText}>{config[categoria].titulo}</Text>
            </View>
            {informeActual.subtitulos[categoria].map((subtitulo, subIndex) => (
              <View key={subIndex}  style={styles.partidoContainer}>
                <Text style={styles.selectedSubtitulosItem}>
                  {config[categoria].subtitulos[subtitulo].nombre}
                </Text>
                <Text style={styles.descripcionSubtitulo}>
                  {config[categoria].subtitulos[subtitulo].descripcion}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };



  return (

  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{nombrePartido}</Text>
      </View>



      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Selecciona:</Text>
          <ScrollView style={styles.modalContent}>
            {config.map((item, indiceTitulo) => (
              <View key={indiceTitulo}>
                <View style={styles.subtituloItem}>
                <Text style={styles.configTitle}>{item.titulo}</Text>
                </View>
                {item.subtitulos.map((subtitulo, indiceSubtitulo) => (
                  <TouchableOpacity
                    key={indiceSubtitulo}
                    onPress={() => handleCheckboxChange(indiceTitulo, indiceSubtitulo)}
                  >
                    <View style={styles.subtituloContainer}>
                      <Checkbox
                        style={styles.checkbox}
                        value={selectedSubtitulos[indiceTitulo]?.includes(indiceSubtitulo)}
                        onValueChange={() => handleCheckboxChange(indiceTitulo, indiceSubtitulo)}
                        color={selectedSubtitulos[indiceTitulo]?.includes(indiceSubtitulo) ? 'black' : undefined}
                      />
                      <Text style={styles.subtituloText}>{subtitulo.nombre}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.btnCerrar}
            onPress={() => {
              toggleModal();
              guardarInformes();
            }}
          >
            <Text style={styles.btnTextTencar}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Modal>



      {Object.keys(selectedSubtitulos).length > 0}
      {renderInformeGuardado()}



      
      
    </ScrollView>
    <View style={{ position: 'absolute', bottom: 15, right: 0, }}>
        <TouchableOpacity style={styles.btnEdit} onPress={toggleModal}>
          <MaterialIcons name="edit" size={30} color="#0077b6" />
        </TouchableOpacity>



        {/* Aixó es ele component per enviar el correu electronic*/}
      <EnviarInforme
        informe={
          informes.find((informe) => informe.nombrePartido === nombrePartido) || {
            nombrePartido,
            subtitulos: {},
          }
        }
        config={config}
      />
      </View>
    </View>
  );
};



{/* Estils*/}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 0,
  },
  
  subtituloItem: {
    backgroundColor: '#0077b6',
    marginVertical: 10,
    padding: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, 
    margin: 15,
    width: 'auto',
    
  },
  partidoContainer: {
    backgroundColor: 'white',
    margin: 5,
    padding: 3,
    borderLeftWidth: 5,
    borderColor: '#0077b6',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, 
    width: 320,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subtituloItemText: {
    fontSize: 20,
    color: 'white',
  },
  
  btnEdit: {
    marginLeft: 'auto',
    marginRight: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0077b6',
    margin: 3,
  },
  modalContent: {
    width: 380,
  },
  btnGuardar: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  btnTextTencar: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  btnCerrar: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    marginBottom: 30,
    width: 200,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginBottom: 1,
    
  },
  titleText: {
    fontSize: 24,
    color: 'black',
  },
  configTitle: {
    fontSize: 20,
    color: 'white',
    
  },
  subtituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginLeft: 25,
    marginRight: 10,
    
    
  },
  subtituloText: {
    fontSize: 20,
    marginRight: 20,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalText: {
    fontSize: 30,
    color: 'black',
    
  },
  checkbox: {
    
    height: 21,
    width: 21,
  },
  
  selectedSubtitulosItem: {
    fontSize: 19,
    marginLeft: 10,
    
  },
  
  descripcionSubtitulo: {
    marginLeft: 10,
    margin: 3,
    fontSize: 18,
    color: 'gray',
  },
});