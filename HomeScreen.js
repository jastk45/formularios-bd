import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';


const HomeScreen = ({ navigation }) => {
  const [numPreguntas, setNumPreguntas] = useState('');
  const [materia, setMateria] = useState('');

  const generarTextos = () => {
    const cantidadPreguntas = parseInt(numPreguntas);
    if (!isNaN(cantidadPreguntas) && materia !== '') {
      const nuevosTextos = Array.from({ length: cantidadPreguntas }, () => ({
        pregunta: '',
        respuesta: '',
        foto: null
      }));
  
      navigation.navigate('PreguntasRespuestas', { textos: nuevosTextos, materia: materia });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={materia}
        onChangeText={text => setMateria(text)}
        placeholder="Elige la materia"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numPreguntas}
        onChangeText={text => setNumPreguntas(text)}
        placeholder="Cantidad de preguntas"
      />
      <Button title="Generar" onPress={generarTextos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  input: {
    height: 40,
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
