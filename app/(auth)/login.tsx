import { getSupabase } from "@/supabase/supabaseClient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Handle login logic here
    if (!email || !password) {
      // check if email and password are provided
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase(); // get the supabase client
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      console.log("Logged in user:", user);
      router.replace("/(tabs)"); // navigate to app main screen after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/drivedownicon.png')} style={{ width: 320, height: 320 }} />
      </View>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <Pressable
  onPress={handleLogin}
  disabled={loading}
  style={({ pressed }) => [
    styles.loginButton,
    pressed && styles.loginButtonPressed,
  ]}
>
  <Text style={styles.loginButtonText}>
    {loading ? "Logging in..." : "Login"}
  </Text>
</Pressable>

      <Pressable onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: -200
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#1a1a1a",
    color: "#fff",

  },
  link: { marginTop: 20, textAlign: "center", color: "#007bff" },
  loginButton: {
  backgroundColor: "#007bff",
  padding: 15,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
},
loginButtonPressed: {
  backgroundColor: "#0056b3", // Darker shade when pressed
  transform: [{ scale: 0.98 }], // Slight shrink effect
},
loginButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},
});
