import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { ImportTxt } from './ImportTxt';
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
export const Configuracio = () => {

  const actualizarConfig = (nuevaConfig) => {
    console.log(nuevaConfig.forEach((elemento) => {
      const subtitulos = elemento.subtitulos;
      console.log('Subtitulos para', elemento.titulo, ':', subtitulos);
    }))
    setConfig(nuevaConfig);
    try {
      AsyncStorage.setItem('config', JSON.stringify(nuevaConfig));
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
    }
  };

  const nav = useNavigation();
  const Guardar = () => {
    nav.navigate('Home')
  };



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



  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [subtituloNombre, setSubtituloNombre] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);


  const obtenerNumero = (indiceTitulo, indiceSubtitulo) => {
    if (indiceSubtitulo !== undefined) {
      return `${indiceTitulo + 1}.${indiceSubtitulo + 1}`;
    } else {
      return `${indiceTitulo + 1}`;
    }
  };

  const agregarTitulo = async () => {
    const nuevaConfig = [...config];
    nuevaConfig.push({ titulo: nuevoTitulo, subtitulos: [] });
    setConfig(nuevaConfig);
    setNuevoTitulo('');

    try {
      await AsyncStorage.setItem('config', JSON.stringify(nuevaConfig));
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
    }
  };



  const eliminarTitulo = (indiceTitulo) => {
    Alert.alert(
      'Eliminar apartat',
      'Segur que vols eliminar aquestapartat?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: async () => {
            const nuevaConfig = [...config];
            nuevaConfig.splice(indiceTitulo, 1);
            setConfig(nuevaConfig);

            try {
              await AsyncStorage.setItem('config', JSON.stringify(nuevaConfig));
            } catch (error) {
              console.error('Error al guardar la configuración:', error);
            }
          },
        },
      ]
    );
  };



  const openModal = () => {
    setShowModal(true);
  };



  const closeModal = () => {
    setShowModal(false);
  };
  const openNewModal = () => {
    setShowNewModal(true);
  };
  const closeNewModal = () => {
    setShowNewModal(false);
  };

  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const configGuardada = await AsyncStorage.getItem('config');
        if (configGuardada) {
          setConfig(JSON.parse(configGuardada));
        }
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
      }
    };
    cargarConfig();
  }, []);




  return (
    <View style={styles.container}>
  






      <ScrollView contentContainerStyle={styles.container}>
    
        {config.map((item, indiceTitulo) => (
          <View key={indiceTitulo} style={styles.tituloContainer}>



            <TouchableOpacity
              style={[styles.btnentrar]}
              onPress={() => {
                setSelectedTitle(item.titulo);
                nav.navigate('Configurar apartat', { selectedTitle: item.titulo });
              }}
            >
              <Text style={styles.btnTextTitle}>{`${obtenerNumero(indiceTitulo)}. ${item.titulo}`}</Text>
            </TouchableOpacity>


            {/* Boto per editar apartat */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setSelectedTitle(item.titulo);
                nav.navigate('Configurar apartat', { selectedTitle: item.titulo });
              }}
            >
              <Text style={styles.eliminarBtnText}>
                <MaterialIcons name="edit" size={21} color="white" />
              </Text>
            </TouchableOpacity>



            {/* Boto per eliminar apartat */}
            <TouchableOpacity
              style={styles.eliminarBtn}
              onPress={() => eliminarTitulo(indiceTitulo)}
            >
              <Text style={styles.eliminarBtnText}>
                <Icon name="trash" size={21} color="white" />
              </Text>
            </TouchableOpacity>



            {/* Mostra tots els subapartats dels apartats */}
            {item.subtitulos.map((subtitulo, indiceSubtitulo) => (
              <View key={indiceSubtitulo} style={styles.subtituloContainer}>
                <Text style={styles.subtituloText}>{`${obtenerNumero(indiceTitulo, indiceSubtitulo)} ${subtitulo.nombre}`}</Text>
              </View>
            ))}
          </View>
        ))}



        {/* Modal per crear nou apartat */}
        <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
            <TextInput
              placeholder="Nom del apartat"
              placeholderTextColor="gray"
              value={nuevoTitulo}
              onChangeText={(text) => setNuevoTitulo(text)}
              style={styles.inputNewTitle}
            />
            

            
            <TouchableOpacity style={styles.btnCrear} onPress={() => { agregarTitulo(); closeModal(); }}>
              <Text style={styles.btnCrearText}>Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => { closeModal(); closeNewModal(); }}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

          

          </View>

        </Modal>




        <Modal visible={showNewModal} animationType="fade" transparent>
        <TouchableOpacity style={styles.newModalContainerBack} onPress={closeNewModal} activeOpacity={1}>
        <View style={styles.newModalContainer}>
          
          {/* Contenido del nuevo modal */}

          <TouchableOpacity onPress={openModal}>
          <Text style={styles.closeButtonText}><MaterialIcons name="playlist-add" size={24} color="black" /></Text>
        </TouchableOpacity>
        <ImportTxt actualizarConfig={actualizarConfig} closeModal={closeModal} closeNewModal={closeNewModal} />

        <TouchableOpacity onPress={closeNewModal}>
            <Text style={styles.closeButtonText}><MaterialIcons name="cancel" size={24} color="black" /></Text>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      </Modal>
      </ScrollView>
      






      <View style={{ position: 'absolute', bottom: 30, right: 0, }}>
        {/* Boto per obrir el modal de crear nou apartat */}
        <TouchableOpacity style={styles.btnopenmodal} onPress={openNewModal}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>


        {/* Boto guardar, clicant ens obrira la pagina home */}
        <TouchableOpacity
          style={[styles.btnsave]}
          onPress={Guardar}
        >
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
    paddingBottom: 0,
  },
  newModalContainerBack: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Ajusta el último valor para cambiar la opacidad
  },
  
newModalContainer: {
    position: 'absolute',
    bottom: 38,
    right: 80,
    
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: 'black', 
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 11,
    fontSize: 17,
    borderWidth: 1,
    width: 120,
    textAlign: 'center',
    margin: 7,
    elevation: 5,
    marginLeft: 'auto',
  },
  
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    right: 0,
  },
  btnopenmodal: {
    marginLeft: 'auto',
    marginRight: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#0077b6',
  },
  btnsave: {
    marginLeft: 'auto',
    marginRight: 20,
    marginTop: 10,
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
  btnentrar: {
    backgroundColor: '#0077b6',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: '#0077b6',
    borderRadius: 5,
    width: 340,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, // Esta propiedad es específica para Android
  },

  btnTextTitle: {
    textAlign: 'left',
    color: 'white',
    fontSize: 22,
    marginBottom: 0,
    width: 275,
  },
  editBtn: {

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 30,
    top: 15,
  },
  eliminarBtn: {

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: 15,
  },
  eliminarBtnText: {
    color: 'red',

  },
  inputSubTitle: {
    width: 200,
    color: 'black',
    fontSize: 20,
  },
  subtituloContainer: {
    backgroundColor: '#fff',
    margin: 1,
    marginTop: 8,
    borderLeftWidth: 5,
    borderRadius: 5,
    borderColor: '#0077b6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, // Esta propiedad es específica para Android
  },

  subtituloText: {
    fontSize: 17,
    marginLeft: 13,
    margin: 5,
    width: 315,

  },
  tituloContainer: {
    position: 'relative',
    margin: 3,
  },
  inputNewTitle: {
    fontSize: 27,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
    width: 300,
    textAlign: 'center',
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
  modalContainer: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 10,
    marginTop: 0,
    color: '#0077b6',
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
  btnCancelar: {
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
  btnCrearText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  btnCancelarText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,

  },
  formatExample: {
    borderWidth: 0.2,
    borderColor: 'grey',
    width: 200,
    borderRadius: 5,
    marginTop: 30,
    backgroundColor: '#f8f9fa',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  formatExampleText: {
    padding: 3,
    paddingLeft: 10,
    fontSize: 18,

  },
  formatExampleView: {
    padding: 3,
    fontSize: 18,
    fontWeight: 'bold', // Agregamos esta propiedad para hacer el texto en negrita
    backgroundColor: 'black',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  formatExampleTextTitle: {

    color: 'white',

  },

});
