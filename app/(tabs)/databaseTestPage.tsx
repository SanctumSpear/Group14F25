import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

type DataItem = {
  id: number;
  value: string;
};

export default function DatabaseTestPage() {
    
    // State to hold data from the database
  const [data, setData] = useState<DataItem[]>([]);

  // State to hold input value
  const [inputValue, setInputValue] = useState("");

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // Function to fetch data from the database
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with your Supabase or API fetch logic
      const response = await fetch("https://your-api-endpoint.com/data");
      const result: DataItem[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add data to the database
  const addData = async () => {
    if (!inputValue.trim()) return;

    try {
      // Replace with your Supabase or API POST logic
      const response = await fetch("https://your-api-endpoint.com/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      if (response.ok) {
        setInputValue("");
        fetchData(); // Refresh the data after adding
      } else {
        console.error("Error adding data:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

    // Setup the UI elements
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      // Main container
      <ThemedView style={styles.container}>

        // Page title
        <ThemedText type="title" style={styles.title}>
          Database Test Page
        </ThemedText>

        // Button to fetch data
        <TouchableOpacity style={styles.button} onPress={fetchData} disabled={loading}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {loading ? "Loading..." : "Fetch Data"}
          </ThemedText>
        </TouchableOpacity>

        // List to display fetched data
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ThemedText style={styles.item}>{item.value}</ThemedText>
          )}
        />

        // Input field to add new data
        <TextInput
          style={styles.input}
          placeholder="Enter new data"
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={setInputValue}
        />

        // Button to add data
        <TouchableOpacity style={styles.button} onPress={addData}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Add Data
          </ThemedText>
        </TouchableOpacity>
        
      </ThemedView>

    </TouchableWithoutFeedback>
  );
}

// Styles for the UI components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
