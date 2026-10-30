
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import api from "../../constants/api";

type Proprietario = {
  id_proprietario: number;
  nome: string;
  cpf: string;
};

export default function ProprietariosScreen() {
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  async function listarProprietarios() {
    try {
      setCarregando(true);
      const resposta = await api.get("/proprietario");
      setProprietarios(resposta.data);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os proprietários. Verifique se o backend está ligado."
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      listarProprietarios();
    }, [])
  );

  async function confirmarExclusao(id: number) {
    try {
      await api.delete(`/proprietario/${id}`);

      setProprietarios((listaAtual) =>
        listaAtual.filter((item) => item.id_proprietario !== id)
      );

      if (Platform.OS === "web") {
        window.alert("Proprietário excluído com sucesso!");
      } else {
        Alert.alert("Sucesso", "Proprietário excluído com sucesso!");
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Não foi possível excluir o proprietário.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir o proprietário.");
      }
    }
  }

  function excluirProprietario(id: number) {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(
        "Tem certeza de que deseja excluir este proprietário?"
      );

      if (confirmado) {
        confirmarExclusao(id);
      }
      return;
    }

    Alert.alert(
      "Excluir proprietário",
      "Tem certeza de que deseja excluir este proprietário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmarExclusao(id),
        },
      ]
    );
  }

  function renderItem({ item }: { item: Proprietario }) {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.cpf}>CPF: {item.cpf}</Text>
          <Text style={styles.id}>Código: {item.id_proprietario}</Text>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() =>
              router.push({
                pathname: "/proprietario/edit",
                params: { id: String(item.id_proprietario) },
              })
            }
          >
            <Text style={styles.textoBotao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => excluirProprietario(item.id_proprietario)}
          >
            <Text style={styles.textoBotao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => router.push("/proprietario/form")}
      >
        <Text style={styles.textoBotao}>+ Novo proprietário</Text>
      </TouchableOpacity>

      {carregando ? (
        <Text style={styles.mensagem}>Carregando...</Text>
      ) : (
        <FlatList
          data={proprietarios}
          keyExtractor={(item) => String(item.id_proprietario)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.mensagem}>
              Nenhum proprietário cadastrado.
            </Text>
          }
          refreshing={carregando}
          onRefresh={listarProprietarios}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  info: {
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#173B57",
  },
  cpf: {
    fontSize: 15,
    color: "#555555",
    marginTop: 5,
  },
  id: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  acoes: {
    flexDirection: "row",
    gap: 10,
  },
  botaoAdicionar: {
    backgroundColor: "#173B57",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoEditar: {
    backgroundColor: "#2878A5",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  botaoExcluir: {
    backgroundColor: "#C0392B",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  mensagem: {
    textAlign: "center",
    marginTop: 25,
    color: "#555555",
  },
});
