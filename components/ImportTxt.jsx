import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export const ImportTxt = ({ actualizarConfig, closeModal }) => {
  const [fileContent, setFileContent] = useState(null);

  const handleButtonClick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const content = await FileSystem.readAsStringAsync(selectedFile.uri, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        console.log('Contenido del archivo:', content);

        if (content) {
          setFileContent(content);

          // Procesar el contenido y actualizar la configuración
          const nuevaConfig = [];
          const lineas = content.split('\n');

          lineas.forEach((linea) => {
            const partes = linea.trim().split(/\s+/);
            if (partes.length === 2) {
              const [numero, nombre] = partes;
              const [indiceTitulo, indiceSubtitulo] = numero.split('.');

              if (!nuevaConfig[indiceTitulo - 1]) {
                nuevaConfig[indiceTitulo - 1] = {
                  titulo: nombre,
                  subtitulos: [],
                };
              } else {
                nuevaConfig[indiceTitulo - 1].subtitulos.push({
                  nombre: nombre,
                  descripcion: '',
                });
              }
            }
          });

          // Actualizar la configuración
          actualizarConfig(nuevaConfig);
        } else {
          console.log('Error al leer el contenido del archivo');
        }
      } else {
        console.log('No se seleccionó ningún archivo');
      }
    } catch (error) {
      console.error('Error al manejar el archivo:', error);
    } finally {
      // Cerrar el modal independientemente de si hay un error o no
      closeModal();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Importar desde un arxiu.txt</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0077b6',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    width: 250,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  fileContentContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  fileContentText: {
    fontSize: 14,
    color: '#333',
  },
});
