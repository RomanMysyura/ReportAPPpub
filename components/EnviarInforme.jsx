import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

export const EnviarInforme = ({ informe, config }) => {
  const enviarInformePorCorreo = () => {
    if (!informe || !config) {
      Alert.alert('Error', 'No hi ha informe per enviar');
      return;
    }

    let cosCorreu = `<h2>Partit: ${informe.nombrePartido}</h2><br/>`;
    


    Object.keys(informe.subtitulos).forEach((categoria) => {

      cosCorreu += `<strong style="text-decoration: underline; font-size: 16px;">${config[categoria].titulo}</strong>`;
      cosCorreu += `<p> `;

      informe.subtitulos[categoria].forEach((subtitulo, index, array) => {
        cosCorreu += `${config[categoria].subtitulos[subtitulo].descripcion}`;

        // Agregar una coma si no es el último subtitulo
        if (index < array.length - 1) {
          cosCorreu += ', ';
        }
      });

      cosCorreu += `</p>`;
    });



    const correoOptions = {
      subject: `Informe partit: ${informe.nombrePartido}`,
      body: cosCorreu,
      recipients: ['david@apliemporda.net'],
      isHtml: true,
    };

    MailComposer.composeAsync(correoOptions)
      .catch((error) => {
        console.error('Error al abrir el compositor de correo electrónico', error);
      });
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={enviarInformePorCorreo} style={styles.btnGuardar}>
        <MaterialIcons name="send" size={28} color="#0077b6" style={{ transform: [{ rotate: '270deg' }] }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  btnGuardar: {
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
    width: 350,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});
