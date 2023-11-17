import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';



export const ConfigApartat = ({ route }) => {
  const nav = useNavigation();

  {/* Si hem clicat el boto de guardar, tornara a la pantalla de Apartats 121111*/ }
  const Guardar = () => {
    nav.replace('Apartats');
  };
  const { selectedTitle } = route.params;
  const [subtituloNombre, setSubtituloNombre] = useState('');

  {/* Estructura del json config */ }
  const [config, setConfig] = useState([
    {
      titulo: 'Fisic',
      subtitulos: [
        { nombre: 'Altura', descripcion: '' },
        { nombre: 'Velocitat', descripcion: '' },
      ],
    },
    {
      titulo: 'Personalitat',
      subtitulos: [
        { nombre: 'Caracter', descripcion: '' },
        { nombre: 'Responsabilitat', descripcion: '' },
      ],
    },
  ]);


  {/* Lògica per defecte per els modals */ }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);



  {/* Lògica per obtenir els valors del config */ }
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const configGuardada = await AsyncStorage.getItem('config');
        if (configGuardada) {
          const configData = JSON.parse(configGuardada);
          setConfig(configData);
        }
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
      }
    };
    cargarConfig();
  }, []);



  {/* Lògica per crear nou sub-apartat */ }
  const agregarNuevoSubtitulo = () => {
    if (config) {
      const nuevaSubtitulo = { nombre: subtituloNombre, descripcion: '' };

      const nuevoConfig = config.map((item) => {
        if (item.titulo === selectedTitle) {
          item.subtitulos.push(nuevaSubtitulo);
        }
        return item;
      });
      setConfig(nuevoConfig);
      AsyncStorage.setItem('config', JSON.stringify(nuevoConfig), (error) => {
        if (!error) {
          console.log('Nuevo subtítulo agregado con éxito');
          setIsModalVisible(false);
        } else {
          console.error('Error al guardar el nuevo subtítulo:', error);
        }
      });

      setSubtituloNombre('');
    }
  };



  {/* Lògica per eliminar el subapartat del config*/ }
  const eliminarSubtitulo = (index) => {
    Alert.alert(
      'Eliminar sub-apartat',
      'Vols eliminar aquest sub-apartat?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: () => {
            if (config) {
              const nuevoConfig = config.map((item) => {
                if (item.titulo === selectedTitle) {
                  item.subtitulos.splice(index, 1);
                }
                return item;
              });

              setConfig(nuevoConfig);

              AsyncStorage.setItem('config', JSON.stringify(nuevoConfig), (error) => {
                if (!error) {
                  console.log('Subtítulo eliminado con éxito');
                } else {
                  console.error('Error al eliminar el subtítulo:', error);
                }
              });
              setSelectedSubtitleIndex(null); // Limpiar el índice seleccionado
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedTitle}>{selectedTitle}</Text>
      <ScrollView >
        
        {config.map((item, indiceTitulo) => (
          <View key={indiceTitulo} style={styles.subtituloContainer}>
            {item.titulo === selectedTitle &&
              item.subtitulos.map((subtitulo, index) => (
                <TouchableOpacity key={index} style={styles.subtituloItem}
                  onPress={() => {
                    setSelectedSubtitleIndex(index);
                    setIsEditModalVisible(true);
                  }}
                >



                  <Text style={styles.subtituloText}>{subtitulo.nombre}</Text>



                  {/* Boto per eliminar el subapartat */}
                  <TouchableOpacity
                    style={styles.eliminarBtn}
                    onPress={() => eliminarSubtitulo(index)}
                  >
                    <Text style={styles.eliminarBtnText}>
                      <Icon name="trash" size={28} color="red" />
                    </Text>
                  </TouchableOpacity>


                  {/* Descripcio del subapartat */}
                  <Text style={styles.textSubTitleDescription}>{subtitulo.descripcion}</Text>
                </TouchableOpacity>
              ))}

          </View>
        ))}



        {/* Modal per crear nou subapartat */}
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Crear sub-apartat</Text>
            <TextInput
              placeholder="Nom del sub-apartat"
              placeholderTextColor="gray"
              value={subtituloNombre}
              onChangeText={(text) => setSubtituloNombre(text)}
              style={styles.inputNewSubtitulo}
            />
            <TouchableOpacity style={styles.btnCrear} onPress={agregarNuevoSubtitulo}>
              <Text style={styles.btnCrearText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancel} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        {/* Modal per editar un subapartat existent*/}
        <Modal visible={isEditModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar sub-apartat</Text>
            <TextInput
              placeholder="Nom del sub-apartat"
              placeholderTextColor="gray"
              value={
                selectedSubtitleIndex !== null
                  ? config.find((item) => item.titulo === selectedTitle)?.subtitulos[selectedSubtitleIndex]?.nombre
                  : ''
              }
              onChangeText={(text) => {
                if (selectedSubtitleIndex !== null) {
                  const nuevoConfig = config.map((configItem) => {
                    if (configItem.titulo === selectedTitle) {
                      configItem.subtitulos[selectedSubtitleIndex].nombre = text;
                    }
                    return configItem;
                  });
                  setConfig(nuevoConfig);
                }
              }}
              style={styles.inputNewSubtitulo}
            />
            <TextInput
              placeholder="Descripció"
              value={
                selectedSubtitleIndex !== null
                  ? config.find((item) => item.titulo === selectedTitle)?.subtitulos[selectedSubtitleIndex]?.descripcion
                  : ''
              }
              onChangeText={(text) => {
                if (selectedSubtitleIndex !== null) {
                  const nuevoConfig = config.map((configItem) => {
                    if (configItem.titulo === selectedTitle) {
                      configItem.subtitulos[selectedSubtitleIndex].descripcion = text;
                    }
                    return configItem;
                  });
                  setConfig(nuevoConfig);
                }
              }}
              style={styles.inputSubTitle}
              multiline={true}
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.btnCrear}
              onPress={() => {
                if (selectedSubtitleIndex !== null) {
                  // Guardar cambios para el subtítulo editado
                  AsyncStorage.setItem('config', JSON.stringify(config), (error) => {
                    if (error) {
                      console.error('Error al guardar los cambios del subtítulo:', error);
                    }
                  });
                } else {
                  // Crear nuevo subtítulo
                  agregarNuevoSubtitulo();
                }

                setIsEditModalVisible(false);
                setSelectedSubtitleIndex(null);
              }}
            >
              <Text style={styles.btnCrearText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => {
                setIsEditModalVisible(false);
                setSelectedSubtitleIndex(null);
              }}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </ScrollView>

      {/* Botons per obrir el modal de crear nou subaparta i de guardar */}
      <View style={{ position: 'absolute', bottom: 60, right: 0, }}>

        <TouchableOpacity style={[styles.btnopenmodal]} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.btnsave]} onPress={Guardar}>
          <Icon name="save" size={28} color="#0077b6" />
        </TouchableOpacity>
      </View>
    </View>
  );


};





















{/* Estils */ }
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    
  },

  btnCrear: {
    margin: 20,
    width: 200,
    textAlign: 'center',
    backgroundColor: 'green',
    borderRadius: 3,
    padding: 5,
  },
  btnCrearText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  btnCancel: {
    width: 200,
    textAlign: 'center',
    backgroundColor: '#ae2012',
    borderRadius: 3,
    padding: 5,
  },
  btnCancelText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },






  btn: {
    width: 300,
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },

  viewbtn: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 30,
  },
  btnopenmodal: {
    marginLeft: 'auto',
    marginRight: 20,
    marginBottom: 10,
    width: 60,
    height: 60,
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0077b6',
  },
  btnsave: {
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
  },


  btnText: {
    textAlign: 'center',
    color: '#0077b6',
    fontSize: 32,
  },

  eliminarBtn: {
    width: 80,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -10,
    top: -4,
  },
  eliminarBtnText: {
    color: 'red',
    fontSize: 13,
    marginTop: 8,
    marginRight: -30,
  },
  textSubTitleDescription: {
    fontSize: 21,
  },
  inputSubTitle: {
    width: 300,
    color: 'black',
    fontSize: 25,
    height: 'auto',
    marginTop: 20,
    backgroundColor: '#ced4da',
    padding: 10,
    borderWidth: 0.6,
    borderRadius: 5,
  },
  inputNewSubtitulo: {
    fontSize: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  subtituloContainer: {
    width: 350,
    margin: 0,
  },
  subtituloText: {
    fontSize: 28,
  },
  subtituloItem: {
    backgroundColor: 'white',
    marginVertical: 10,
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderLeftWidth: 5,
    borderColor: '#0077b6',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, // Esta propiedad es específica para Android

  },

  selectedTitle: {
    fontSize: 45,
    backgroundColor: '#0077b6',
    
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 80,
    marginTop: -200,
    color: '#0077b6',
  },

  btnCancelar: {
    textAlign: 'center',
    color: 'black',
    fontSize: 32,
    marginTop: -30,
  },
});