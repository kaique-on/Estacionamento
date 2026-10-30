
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../constants/api";

type Proprietario = {
  id_proprietario: number;
  nome: string;
  cpf: string;
};

export default function EditarVeiculo() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [mensalidade, setMensalidade] = useState("");
  const [fkProprietario, setFkProprietario] = useState("");
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [id]);

  function mostrarMensagem(titulo: string, mensagem: string) {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  async function carregarDados() {
    try {
      setCarregando(true);

      const [respostaVeiculo, respostaProprietarios] = await Promise.all([
        api.get(`/veiculo/${id}`),
        api.get("/proprietario"),
      ]);

      const veiculo = respostaVeiculo.data;

      setPlaca(veiculo.placa ?? "");
      setAno(String(veiculo.ano ?? ""));
      setMensalidade(String(veiculo.mensalidade ?? ""));
      setFkProprietario(String(veiculo.fk_proprietario ?? ""));
      setProprietarios(respostaProprietarios.data);
    } catch (error) {
      mostrarMensagem("Erro", "Não foi possível carregar os dados do veículo.");
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarVeiculo() {
    if (!placa.trim() || !ano.trim() || !mensalidade.trim() || !fkProprietario) {
      mostrarMensagem("Atenção", "Preencha todos os campos.");
      return;
    }

    const anoNumero = Number(ano);
    const mensalidadeNumero = Number(mensalidade.replace(",", "."));

    if (!Number.isInteger(anoNumero) || anoNumero <= 0) {
      mostrarMensagem("Atenção", "Informe um ano válido.");
      return;
    }

    if (!Number.isFinite(mensalidadeNumero) || mensalidadeNumero < 0) {
      mostrarMensagem("Atenção", "Informe uma mensalidade válida.");
      return;
    }

    try {
      setSalvando(true);

      await api.put(`/veiculo/${id}`, {
        placa: placa.trim().toUpperCase(),
        ano: anoNumero,
        mensalidade: mensalidadeNumero,
        fk_proprietario: Number(fkProprietario),
      });

      mostrarMensagem("Sucesso", "Veículo atualizado com sucesso!");
      router.back();
    } catch (error) {
      mostrarMensagem("Erro", "Não foi possível atualizar o veículo.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensagem}>Carregando dados do veículo...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar veículo</Text>

      <Text style={styles.label}>Placa</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: ABC1D23"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Ano</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 2022"
        value={ano}
        onChangeText={setAno}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Mensalidade (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 250,00"
        value={mensalidade}
        onChangeText={setMensalidade}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Proprietário</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fkProprietario}
          onValueChange={(valor) => setFkProprietario(String(valor))}
        >
          <Picker.Item label="Selecione um proprietário" value="" />
          {proprietarios.map((item) => (
            <Picker.Item
              key={item.id_proprietario}
              label={`${item.nome} - CPF: ${item.cpf}`}
              value={String(item.id_proprietario)}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={atualizarVeiculo}
        disabled={salvando || proprietarios.length === 0}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoVoltar}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#173B57",
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#173B57",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 13,
    marginBottom: 18,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    marginBottom: 18,
  },
  botao: {
    backgroundColor: "#173B57",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoVoltar: {
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  textoVoltar: {
    color: "#555555",
    fontWeight: "bold",
  },
  mensagem: {
    textAlign: "center",
    marginTop: 25,
    color: "#555555",
  },
});
