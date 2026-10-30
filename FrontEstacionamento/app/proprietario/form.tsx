
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../constants/api";

export default function FormProprietario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [salvando, setSalvando] = useState(false);
  const router = useRouter();

  async function cadastrar() {
    if (!nome.trim() || !cpf.trim()) {
      Alert.alert("Atenção", "Preencha o nome e o CPF.");
      return;
    }

    try {
      setSalvando(true);

      await api.post("/proprietario", {
        nome: nome.trim(),
        cpf: cpf.trim(),
      });

      Alert.alert("Sucesso", "Proprietário cadastrado!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o proprietário.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        maxLength={14}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Cadastrar proprietário"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#173B57",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 13,
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#173B57",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
