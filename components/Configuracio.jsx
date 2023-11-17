import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { ImportTxt } from './ImportTxt';



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
                <MaterialIcons name="edit" size={30} color="white" />
              </Text>
            </TouchableOpacity>



            {/* Boto per eliminar apartat */}
            <TouchableOpacity
              style={styles.eliminarBtn}
              onPress={() => eliminarTitulo(indiceTitulo)}
            >
              <Text style={styles.eliminarBtnText}>
                <Icon name="trash" size={30} color="white" />
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
            <Text style={styles.modalTitle}>Crear nou apartat</Text>
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
            <TouchableOpacity style={styles.btnCancelar} onPress={closeModal}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <ImportTxt actualizarConfig={actualizarConfig} closeModal={closeModal} />




            <View style={styles.formatExample}>
            <View style={styles.formatExampleView}>
            <Text style={styles.formatExampleTextTitle}>Exemple del format .txt</Text>
            </View>

              <Text style={styles.formatExampleText}>1. Apartat 1</Text>
              <Text style={styles.formatExampleText}>1.1 Sub-abartat 1 </Text>
              <Text style={styles.formatExampleText}>1.2 Sub-abartat 2</Text>
              <Text style={styles.formatExampleText}>2. Apartat 2</Text>
              <Text style={styles.formatExampleText}>2.1 Sub-abartat 1 </Text>
              <Text style={styles.formatExampleText}>2.2 Sub-abartat 2</Text>
              <Text style={styles.formatExampleText}>2.3 Sub-abartat 3</Text>
              <Text style={styles.formatExampleText}>...</Text>



            </View>



          </View>

        </Modal>
      </ScrollView>





      <View style={{ position: 'absolute', bottom: 30, right: 0, }}>
        {/* Boto per obrir el modal de crear nou apartat */}
        <TouchableOpacity style={styles.btnopenmodal} onPress={openModal}>
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
    paddingBottom: 20,
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
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: '#0077b6',
    borderRadius: 5,
    width: 340,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3, // Esta propiedad es específica para Android
  },


  btnTextTitle: {
    textAlign: 'left',
    color: 'white',
    fontSize: 34,
    marginBottom: 0,

  },
  editBtn: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 34,
    top: 15,
  },
  eliminarBtn: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 4,
    top: 15,
  },
  eliminarBtnText: {
    color: 'red',
    fontSize: 15,
  },
  inputSubTitle: {
    width: 200,
    color: 'black',
    fontSize: 20,
  },
  subtituloContainer: {
    backgroundColor: '#fff',
    margin: 4,
    marginLeft: 10,
    marginRight: 10,
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
    fontSize: 25,
    marginLeft: 13,
    margin: 5,

  },
  tituloContainer: {
    position: 'relative',
    margin: 3,
  },
  inputNewTitle: {
    fontSize: 37,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  modalContainer: {
    marginTop: 140,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 50,
    marginBottom: 80,
    marginTop: -200,
    color: '#0077b6',
  },
  btnCrear: {
    backgroundColor: 'green',
    width: 250,
    padding: 5,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    margin: 10,
  },
  btnCancelar: {
    backgroundColor: '#ae2012',
    width: 250,
    padding: 5,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    margin: 10,
  },
  btnCrearText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 32,
  },
  btnCancelarText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,

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
