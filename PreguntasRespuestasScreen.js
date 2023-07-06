import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Button, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const PreguntasRespuestasScreen = ({ route }) => {
  const { textos, materia } = route.params;
  const [preguntasRespuestas, setPreguntasRespuestas] = useState(textos);

    const [datosGuardados, setDatosGuardados] = useState([]);
  const [aviso, setAviso] = useState('');
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    obtenerDatosGuardados();
  }, []);

  const obtenerDatosGuardados = async () => {
    try {
      const datosExistentes = await AsyncStorage.getItem('datosFormulario');
      if (datosExistentes) {
        const datos = JSON.parse(datosExistentes);
        setDatosGuardados(datos);
      }
    } catch (error) {
      console.log('Error al obtener los datos guardados:', error);
    }
  };

  const modificarTexto = (index, campo, value) => {
    const nuevosTextos = [...preguntasRespuestas];
    nuevosTextos[index][campo] = value;
    setPreguntasRespuestas(nuevosTextos);
  };

  const tomarFoto = async (index) => {
    try {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permiso denegado para acceder a la cámara');
        return;
      }

      let pickerResult = await ImagePicker.launchCameraAsync();

      if (pickerResult.canceled === true) {
        console.log('Selección de foto cancelada');
        return;
      }

      const nuevosTextos = [...preguntasRespuestas];
      nuevosTextos[index].foto = pickerResult.assets[0].uri;
      setPreguntasRespuestas(nuevosTextos);
    } catch (error) {
      console.log('Error al tomar la foto:', error);
    }
  };

  const guardarDatos = async () => {
    try {
      const preguntasRespuestasFiltradas = preguntasRespuestas.filter(
        (texto) => !datosGuardados.some((dato) => dato.pregunta === texto.pregunta && dato.respuesta === texto.respuesta)
      );

      if (preguntasRespuestasFiltradas.length > 0) {
        const nuevosDatos = [...datosGuardados, ...preguntasRespuestasFiltradas];
        await AsyncStorage.setItem('datosFormulario', JSON.stringify(nuevosDatos));
        console.log('Datos guardados exitosamente');
        setDatosGuardados(nuevosDatos);
        setAviso('Datos guardados exitosamente');
      } else {
        setAviso('No se encontraron nuevos datos para guardar');
      }
    } catch (error) {
      console.log('Error al guardar los datos:', error);
      setAviso('Error al guardar los datos');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido al formulario de {materia}</Text>

      {preguntasRespuestas.map((texto, index) => (
        <View key={index} style={styles.questionContainer}>
          <View style={styles.row}>
            <TextInput
              style={styles.textInput}
              multiline={true}
              value={texto.pregunta}
              onChangeText={(value) => modificarTexto(index, 'pregunta', value)}
              placeholder={`Ingrese la pregunta ${index + 1}`}
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.textInput}
              multiline={true}
              value={texto.respuesta}
              onChangeText={(value) => modificarTexto(index, 'respuesta', value)}
              placeholder={`Ingrese la respuesta ${index + 1}`}
              placeholderTextColor="grey"
            />
          </View>
          <Button title="Tomar Foto" onPress={() => tomarFoto(index)} />
          {texto.foto && <Image source={{ uri: texto.foto }} style={styles.image} />}
        </View>
      ))}
      <Button title="Guardar" onPress={guardarDatos} />
      {aviso !== '' && <Text style={styles.aviso}>{aviso}</Text>}
    </ScrollView>
  ); 
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  textInput: {
 
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    marginBottom: 16,
  },
  aviso: {
    fontSize: 16,
    color: 'red',
    marginTop: 16,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
  },
});

export default PreguntasRespuestasScreen;
