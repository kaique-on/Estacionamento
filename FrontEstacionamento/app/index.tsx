import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Estacionamento</Text>

      <Text style={styles.subtitle}>
        Gerencie proprietários e veículos cadastrados.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/proprietario")}
      >
        <Text style={styles.buttonText}>Proprietários</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/veiculo")}>
        <Text style={styles.buttonText}>Veículos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#173B57",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 35,
  },
  button: {
    backgroundColor: "#173B57",
    padding: 22,
    borderRadius: 12,
    marginBottom: 18,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: "#2878A5",
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },
  description: {
    color: "#DCE8F0",
    fontSize: 14,
    marginTop: 6,
  },
});
