import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


export const CrearPartit = () => {
    const [nomPartida, setNomPartida] = useState('');
    const [categoria, setCategoria] = useState('Lliga Elit');
    const [date, setDate] = useState(new Date());
    const nav = useNavigation(); // Obtén la función de navegación



    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };



    const guardarPartido = async () => {
        try {
            const informesGuardados = await AsyncStorage.getItem('informespartits');
            let informespartits = informesGuardados ? JSON.parse(informesGuardados) : [];

            const nuevoPartido = {
                nomPartida,
                categoria,
                date,
            };
            informespartits.push(nuevoPartido);
            await AsyncStorage.setItem('informespartits', JSON.stringify(informespartits));
            setNomPartida('');
            setCategoria('3, Catalana');
            setDate(new Date());

            nav.navigate('Notes Partit', { nombrePartido: nuevoPartido.nomPartida });

        } catch (error) {
            console.error('Error al guardar el partido:', error);
        }
    };


    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                placeholder="Nom del partit"
                style={styles.input}
                value={nomPartida}
                onChangeText={(text) => setNomPartida(text)}
            />

            <Text style={styles.label}>Categoria:</Text>

            <Picker
                style={styles.picker}
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
            >
                <Picker.Item label="3, Catalana" value="3, Catalana" />
                <Picker.Item label="2, Catalana" value="2, Catalana" />
                <Picker.Item label="1, Catalana" value="1, Catalana" />
                <Picker.Item label="Lliga Elit" value="Lliga Elit" />
                <Picker.Item label="3, RFEF" value="3, RFEF" />
                <Picker.Item label="2, RFEF" value="2, RFEF" />
                <Picker.Item label="1, RFEF" value="1, RFEF" />
            </Picker>


            <View style={styles.dateContainer}>
                <Text style={styles.label}>Data del partit:</Text>
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={styles.datapicker}
                />
            </View>


            <TouchableOpacity style={styles.btn} onPress={guardarPartido}>
                <Text style={styles.btnText}>Crear partit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    input: {
        fontSize: 35,
        width: 300,
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    label: {
        fontSize: 30,
        marginBottom: 10,
    },
    picker: {
        width: 300,
        height: 200,
        marginBottom: 0,
        marginTop: -20,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 300,
        margin: 5,
    },
    datapicker: {
        width: '50%',
        marginLeft: -20,
        margin: 0,
        marginTop: -5,
    },
    btn: {
        width: 300,
        padding: 10,
        borderRadius: 8,
        margin: 10,
        backgroundColor: '#0077b6',
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
    guardadoExitoso: {
        color: 'green',
        fontSize: 18,
        marginBottom: 10,
    },
});
