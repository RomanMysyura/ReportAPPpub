import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const nav = useNavigation();

  const handleLogin = () => {
    if (username === 'usuari' && password === '1234') {
      nav.navigate('Home');
    } else {
      alert('Usuario i/o contraseya incorrectes');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texttitol}>ReportAPP</Text>
      <View style={styles.loginform}>
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: isUsernameFocused ? '#52b69a' : '#0077b6' },
          ]}
          value={username}
          onChangeText={setUsername}
          placeholder="Nom del usuari"
          onFocus={() => setIsUsernameFocused(true)}
          onBlur={() => setIsUsernameFocused(false)}
        />
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: isPasswordFocused ? '#52b69a' : '#0077b6' },
          ]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contrasenya"
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <TouchableOpacity
          style={[styles.btnentrar, styles.btn]}
          onPress={handleLogin}
        >
          <Text style={styles.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 25,
    height: 40,
    width: 300,
    borderColor: 'transparent',
    borderBottomWidth: 2,
    marginBottom: 20,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  loginform: {

  },
  texttitol: {
    textAlign: 'center',
    fontSize: 70,
    marginBottom: 80,
    marginTop: -300,
    color: '#0077b6',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
  },
  btn: {
    width: 300,
    padding: 10,
    borderRadius: 8,
  },
  btnentrar: {
    backgroundColor: '#0077b6',
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
});

export default Login;
