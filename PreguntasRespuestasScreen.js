import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Alert, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

const PreguntasRespuestasScreen = ({ route }) => {
  const navigation = useNavigation();
  const { textos, materia } = route.params;
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [preguntasRespuestas, setPreguntasRespuestas] = React.useState(textos);
  const [datosCargados, setDatosCargados] = useState([]);
  const [datosGuardados, setDatosGuardados] = useState([]);
  const [aviso, setAviso] = React.useState("");
  const [foto, setFoto] = React.useState(null);

  useEffect(() => {
    if (!datosCargados) {
      obtenerDatosGuardados();
      setDatosCargados(true);
    }
  }, [datosCargados]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Estas seguro de regresar?",
          "Perderas todos los cambios que no hayas guardado",
          [
            { text: "Seguir aquí", style: "cancel", onPress: () => { } },
            {
              text: "Salir",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation]
  );

  const obtenerDatosGuardados = async () => {
    try {
      const datosExistentes = await AsyncStorage.getItem("datosFormulario");
      if (datosExistentes) {
        const datos = JSON.parse(datosExistentes);
        setDatosGuardados(datos);
      }
    } catch (error) {
      console.log("Error al obtener los datos guardados:", error);
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
        Alert.alert("Permiso denegado para acceder a la cámara");
        return;
      }

      let pickerResult = await ImagePicker.launchCameraAsync();

      if (pickerResult.canceled === true) {
        console.log("Selección de foto cancelada");
        return;
      }

      const nuevosTextos = [...preguntasRespuestas];
      nuevosTextos[index].foto = pickerResult.assets[0].uri;
      setPreguntasRespuestas(nuevosTextos);
    } catch (error) {
      console.log("Error al tomar la foto:", error);
    }
  };

  const guardarDatos = async () => {
    try {
      const preguntasRespuestasFiltradas = preguntasRespuestas.filter(
        (texto) =>
          !datosGuardados.some(
            (dato) =>
              dato.pregunta === texto.pregunta &&
              dato.respuesta === texto.respuesta
          )
      );

      if (preguntasRespuestasFiltradas.length > 0) {
        const nuevosDatos = [
          ...datosGuardados,
          ...preguntasRespuestasFiltradas,
        ];
        await AsyncStorage.setItem(
          "datosFormulario",
          JSON.stringify(nuevosDatos)
        );
        console.log("Datos guardados exitosamente");
        setAviso("Datos guardados exitosamente");
        setDatosGuardados(nuevosDatos);
      } else {
        setAviso("No se encontraron nuevos datos para guardar");
      }
    } catch (error) {
      console.log("Error al guardar los datos:", error);
      setAviso("Error al guardar los datos");
    }
  };

  const onSubmit = (data) => {
    guardarDatos(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido al formulario de {materia}</Text>

      <ScrollView keyboardShouldPersistTaps="handled">
        {preguntasRespuestas.map((texto, index) => (
          <View key={index} style={styles.questionContainer}>
            <View style={styles.row}>
              <Controller
                control={control}
                name={`pregunta[${index}]`}
                defaultValue={texto.pregunta}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="contained"
                    style={styles.textInput}
                    multiline={true}
                    value={value}
                    onChangeText={onChange}
                    placeholder={`Ingrese la pregunta ${index + 1}`}
                    placeholderTextColor="grey"
                  />
                )}
              />
              {errors.pregunta && (
                <Text style={styles.errorText}>Este campo es requerido</Text>
              )}
            </View>
            <View style={styles.row}>
              <Controller
                control={control}
                name={`respuesta[${index}]`}
                defaultValue={texto.respuesta}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="contained"
                    style={styles.textInput}
                    multiline={true}
                    value={value}
                    onChangeText={onChange}
                    placeholder={`Ingrese la respuesta ${index + 1}`}
                    placeholderTextColor="grey"
                  />
                )}
              />
              {errors.respuesta && (
                <Text style={styles.errorText}>Este campo es requerido</Text>
              )}
            </View>
            <Button mode="contained" onPress={() => tomarFoto(index)}>
              Tomar foto
            </Button>
            {texto.foto && (
              <Image source={{ uri: texto.foto }} style={styles.image} />
            )}
          </View>
        ))}
      </ScrollView>

      <Button title="Guardar" onPress={() => handleSubmit(guardarDatos)()} />
      {aviso !== "" && <Text style={styles.aviso}>{aviso}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  textInput: {
    width: "100%",
  },
  questionContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    marginBottom: 16,
  },
  aviso: {
    fontSize: 16,
    color: "red",
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default PreguntasRespuestasScreen;
