import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Pressable } from "react-native";

export default function newDBTest() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  return (

    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Welcome to the Database Test Page!
        </ThemedText>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Log in to continue
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Link href="/test" style={styles.link}>
          <ThemedText type="link">Don’t have an account? Sign up</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
  link: {
    marginTop: 12,
    alignSelf: "center",
  },
});