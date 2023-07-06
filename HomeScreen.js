import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  const [numPreguntas, setNumPreguntas] = useState("");
  const [materia, setMateria] = useState("");

  const generarTextos = () => {
    const cantidadPreguntas = parseInt(numPreguntas);
    if (!isNaN(cantidadPreguntas) && materia !== "") {
      const nuevosTextos = Array.from({ length: cantidadPreguntas }, () => ({
        pregunta: "",
        respuesta: "",
        foto: null,
      }));

      navigation.navigate("PreguntasRespuestas", {
        textos: nuevosTextos,
        materia: materia,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/mate.png")} style={styles.logo} />
      <TextInput
        mode="outlined"
        style={styles.input}
        value={materia}
        onChangeText={(text) => setMateria(text)}
        placeholder="Elige la materia"
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        value={numPreguntas}
        onChangeText={(text) => setNumPreguntas(text)}
        placeholder="Cantidad de preguntas"
      />
      <Button style={{ width: "60%" }} mode="contained" onPress={generarTextos}>
        Generar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  input: {
    height: 40,
    width: "70%",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default HomeScreen;
