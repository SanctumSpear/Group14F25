import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { deleteCurrentUserAccount } from "@/supabase/databaseHelpers";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // TODO: replace this with real login logic (API call, Firebase, etc.)
    alert(`Logging in with:\nEmail: ${email}\nPassword: ${password}`);
  };

  const handleDeleteAccount = async () => {
    try {
      // confirm deletion
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This cannot be undone.",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await deleteCurrentUserAccount();
                alert("Account deleted successfully");
                router.replace("/(auth)/login");
              } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete account");
              }
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Error deleting account");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Welcome Back 👋
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Log In
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDeleteAccount}
        >
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Delete Account (TEST)
          </ThemedText>
        </TouchableOpacity>

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
  deleteButton: {
    backgroundColor: "#FF3B30",
    marginTop: 12,
  },
});
