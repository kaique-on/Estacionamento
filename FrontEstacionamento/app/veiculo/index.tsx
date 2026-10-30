
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

type Veiculo = {
  id_veiculo: number;
  placa: string;
  ano: number;
  mensalidade: number;
  fk_proprietario: number;
};

export default function VeiculosScreen() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  async function listarVeiculos() {
    try {
      setCarregando(true);
      const resposta = await api.get("/veiculo");
      setVeiculos(resposta.data);
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Não foi possível carregar os veículos. Verifique se o backend está ligado.");
      } else {
        Alert.alert("Erro", "Não foi possível carregar os veículos.");
      }
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      listarVeiculos();
    }, [])
  );

  async function confirmarExclusao(id: number) {
    try {
      await api.delete(`/veiculo/${id}`);

      setVeiculos((listaAtual) =>
        listaAtual.filter((item) => item.id_veiculo !== id)
      );

      if (Platform.OS === "web") {
        window.alert("Veículo excluído com sucesso!");
      } else {
        Alert.alert("Sucesso", "Veículo excluído com sucesso!");
      }
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Não foi possível excluir o veículo.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir o veículo.");
      }
    }
  }

  function excluirVeiculo(id: number) {
    if (Platform.OS === "web") {
      const confirmado = window.confirm(
        "Tem certeza de que deseja excluir este veículo?"
      );

      if (confirmado) {
        confirmarExclusao(id);
      }
      return;
    }

    Alert.alert(
      "Excluir veículo",
      "Tem certeza de que deseja excluir este veículo?",
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

  function renderItem({ item }: { item: Veiculo }) {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.placa}>{item.placa}</Text>
          <Text style={styles.detalhe}>Ano: {item.ano}</Text>
          <Text style={styles.detalhe}>
            Mensalidade: R$ {Number(item.mensalidade).toFixed(2)}
          </Text>
          <Text style={styles.id}>
            Código do proprietário: {item.fk_proprietario}
          </Text>
          <Text style={styles.id}>Código do veículo: {item.id_veiculo}</Text>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() =>
              router.push({
                pathname: "/veiculo/edit",
                params: { id: String(item.id_veiculo) },
              })
            }
          >
            <Text style={styles.textoBotao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => excluirVeiculo(item.id_veiculo)}
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
        onPress={() => router.push("/veiculo/form")}
      >
        <Text style={styles.textoBotao}>+ Novo veículo</Text>
      </TouchableOpacity>

      {carregando ? (
        <Text style={styles.mensagem}>Carregando...</Text>
      ) : (
        <FlatList
          data={veiculos}
          keyExtractor={(item) => String(item.id_veiculo)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.mensagem}>Nenhum veículo cadastrado.</Text>
          }
          refreshing={carregando}
          onRefresh={listarVeiculos}
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
  placa: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#173B57",
  },
  detalhe: {
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
