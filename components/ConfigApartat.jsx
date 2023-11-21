import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export const ConfigApartat = ({ route }) => {
  const nav = useNavigation();
  const { selectedTitle } = route.params;
  const [textInputHeight, setTextInputHeight] = useState(40);
  const [subtituloNombre, setSubtituloNombre] = useState('');
  const [subtituloDescripcion, setSubtituloDescripcion] = useState('');
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);

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

  const agregarNuevoSubtitulo = () => {
    if (config) {
      const nuevaSubtitulo = { nombre: subtituloNombre, descripcion: subtituloDescripcion };

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
      setSubtituloDescripcion('');
    }
  };

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
              setSelectedSubtitleIndex(null);
            }
          },
        },
      ]
    );
  };
  const Guardar = () => {
    nav.replace('Apartats');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.selectedTitle}>{selectedTitle}</Text>
      <ScrollView>

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
                  <TouchableOpacity
                    style={styles.eliminarBtn}
                    onPress={() => eliminarSubtitulo(index)}
                  >
                    <Text style={styles.eliminarBtnText}>
                      <Icon name="trash" size={21} color="red" />
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.textSubTitleDescription}>{subtitulo.descripcion}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Nom del sub-apartat"
              placeholderTextColor="gray"
              value={subtituloNombre}
              onChangeText={(text) => setSubtituloNombre(text)}
              style={styles.inputNewSubtitulo}
            />
            <TextInput
              placeholder="Descripcio"
              value={subtituloDescripcion}
              onChangeText={(text) => setSubtituloDescripcion(text)}
              style={[styles.inputSubTitle, { height: Math.max(40, textInputHeight) }]}
              onContentSizeChange={(event) => {
                setTextInputHeight(event.nativeEvent.contentSize.height);
              }}
              multiline={true}
              numberOfLines={1}
            />
            <TouchableOpacity style={styles.btnCrear} onPress={agregarNuevoSubtitulo}>
              <Text style={styles.btnCrearText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancel} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

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
              style={[styles.inputSubTitle, { height: Math.max(40, textInputHeight) }]}
              onContentSizeChange={(event) => {
                setTextInputHeight(event.nativeEvent.contentSize.height);
              }}
              multiline={true}
              numberOfLines={1}
            />
            <TouchableOpacity
              style={styles.btnCrear}
              onPress={() => {
                if (selectedSubtitleIndex !== null) {
                  AsyncStorage.setItem('config', JSON.stringify(config), (error) => {
                    if (error) {
                      console.error('Error al guardar los cambios del subtítulo:', error);
                    }
                  });
                } else {
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
paddingBottom: 40,
  },

  btnCrear: {
    backgroundColor: 'green',
    width: 220,
    padding: 5,
    borderRadius: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    marginTop: 30,
    marginBottom: 10,
  },
  btnCrearText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  btnCancel: {
    backgroundColor: '#ae2012',
    width: 220,
    padding: 5,
    borderRadius: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    margin: 0,
  },
  btnCancelText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  modalDescription:{
    width: 300,
    color: 'black',
    fontSize: 23,
    marginTop: 4,
    backgroundColor: '#ced4da',
    padding: 10,
    borderBottomWidth: 1,
    
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


    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 30,
    top: -5,
  },
  eliminarBtnText: {
    color: 'red',
    fontSize: 13,
    marginTop: 8,
    marginRight: -30,
  },
  textSubTitleDescription: {
    fontSize: 18,
    color: 'grey',
  },
  inputSubTitle: {
    width: 300,
    color: 'black',
    fontSize: 23,
    marginTop: 4,
    backgroundColor: '#ced4da',
    padding: 10,
    borderBottomWidth: 1,
  },
  inputNewSubtitulo: {
    fontSize: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: 300,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtituloContainer: {
    width: 350,
    margin: 0,
  },
  subtituloText: {
    fontSize: 18,
    width: 320,
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
    fontSize: 25,
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
    fontSize: 30,
    marginBottom: 20,

    color: '#0077b6',
  },

  btnCancelar: {
    textAlign: 'center',
    color: 'black',
    fontSize: 32,
    marginTop: -30,
  },
});