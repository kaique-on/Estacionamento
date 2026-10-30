import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#173B57",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#F4F6F8",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Estacionamento" }}
      />

      <Stack.Screen
        name="proprietario/index"
        options={{ title: "Proprietários" }}
      />

      <Stack.Screen
        name="veiculo/index"
        options={{ title: "Veículos" }}
      />
    </Stack>
  );
}