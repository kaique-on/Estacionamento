
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../constants/api";

export default function EditarProprietario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function buscarProprietario() {
      try {
        const resposta = await api.get(`/proprietario/${id}`);
        setNome(resposta.data.nome);
        setCpf(resposta.data.cpf);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o proprietário.");
      } finally {
        setCarregando(false);
      }
    }

    if (id) buscarProprietario();
  }, [id]);

  async function atualizar() {
    if (!nome.trim() || !cpf.trim()) {
      Alert.alert("Atenção", "Preencha o nome e o CPF.");
      return;
    }

    try {
      setSalvando(true);

      await api.put(`/proprietario/${id}`, {
        nome: nome.trim(),
        cpf: cpf.trim(),
      });

      Alert.alert("Sucesso", "Proprietário atualizado!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o proprietário.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text>Carregando proprietário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        maxLength={14}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={atualizar}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Salvar alterações"}
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
