import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreguntasRespuestasScreen = ({ route }) => {
  const { textos, materia } = route.params;
  const [preguntasRespuestas, setPreguntasRespuestas] = useState(textos);
  const [datosGuardados, setDatosGuardados] = useState([]);
  const [aviso, setAviso] = useState('');

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

  const guardarDatos = async () => {
    try {
      const preguntasRespuestasFiltradas = preguntasRespuestas.filter(texto =>
        !datosGuardados.some(dato => dato.pregunta === texto.pregunta && dato.respuesta === texto.respuesta)
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
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.textInput}
            value={texto.pregunta}
            onChangeText={value => modificarTexto(index, 'pregunta', value)}
            placeholder={`pregunta ${index + 1}`}
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.textInput}
            value={texto.respuesta}
            onChangeText={value => modificarTexto(index, 'respuesta', value)}
            placeholder={`respuesta ${index + 1}`}
            placeholderTextColor="grey"
          />
        </View>
      ))}

      <Button title="Guardar Datos" onPress={guardarDatos} />

      {aviso !== '' && <Text style={styles.aviso}>{aviso}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  aviso: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default PreguntasRespuestasScreen;
