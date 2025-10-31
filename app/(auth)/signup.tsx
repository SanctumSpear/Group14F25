// app/(auth)/signup.js
import { StyleSheet, Text, View } from "react-native";

export default function Signup() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup page coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, color: "#555" },
});
