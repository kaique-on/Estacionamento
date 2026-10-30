
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
import { useRouter } from "expo-router";
import api from "../../constants/api";

type Proprietario = {
  id_proprietario: number;
  nome: string;
  cpf: string;
};

export default function FormVeiculo() {
  const router = useRouter();

  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [mensalidade, setMensalidade] = useState("");
  const [fkProprietario, setFkProprietario] = useState("");
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarProprietarios();
  }, []);

  async function carregarProprietarios() {
    try {
      const resposta = await api.get("/proprietario");
      setProprietarios(resposta.data);
    } catch (error) {
      mostrarMensagem("Erro", "Não foi possível carregar os proprietários.");
    }
  }

  function mostrarMensagem(titulo: string, mensagem: string) {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  async function cadastrarVeiculo() {
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

      await api.post("/veiculo", {
        placa: placa.trim().toUpperCase(),
        ano: anoNumero,
        mensalidade: mensalidadeNumero,
        fk_proprietario: Number(fkProprietario),
      });

      mostrarMensagem("Sucesso", "Veículo cadastrado com sucesso!");
      router.back();
    } catch (error) {
      mostrarMensagem("Erro", "Não foi possível cadastrar o veículo.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastrar veículo</Text>

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

      {proprietarios.length === 0 && (
        <Text style={styles.aviso}>
          Cadastre um proprietário antes de cadastrar um veículo.
        </Text>
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrarVeiculo}
        disabled={salvando || proprietarios.length === 0}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Cadastrar veículo"}
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
  aviso: {
    color: "#C0392B",
    marginBottom: 15,
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
});
