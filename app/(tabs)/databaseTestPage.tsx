import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as dbHelpers from "@/supabase/databaseHelpers"; // Import the helper functions
import { IUserTableInsertDTO } from "@/types/Interfaces/DTOs/IUserTableDTO";
import { IUserTableDTO } from "@/types/Interfaces/DTOs/IUserTableDTO";
import React, { useState } from "react";
import {
    FlatList,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from "react-native";



export default function DatabaseTestPage() {
    
    // State to hold data from the database
  const [data, setData] = useState<IUserTableDTO[]>([]);

  // State to hold input value
  const [inputValue, setInputValue] = useState("");

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  const app_user_tableName = "app_user"; // Replace with your actual table name

  // Function to fetch data from the database
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with your Supabase or API fetch logic
      const result = await dbHelpers.fetchAllRows<IUserTableDTO>(app_user_tableName);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

    // Function to add a new user to the database
    const addUser = async () => {
        // Remove leading and trailing whitespace from the input value
        const trimmedInput = inputValue.trim();

        // Check if the trimmed input is empty
        if (trimmedInput === "") {
            return; // Exit the function if the input is empty
        }

        // Split the input into first and last name (simple example)
        const [firstName, lastName] = trimmedInput.split(" ");

        // Create a new email using the first letter of the first name and the entire last name
        const email = `${firstName.charAt(0).toLowerCase()}${lastName ? lastName.toLowerCase() : ""}@example.com`;


        try {

            // IUserTableInsertDTO excludes auto-generated fields (user_id, user_createdAt)
            const newUser: IUserTableInsertDTO = {
                user_firstName: firstName,
                user_lastName: lastName || "",
                user_email: email,
            };
       
            // Replace with your Supabase or API POST logic
            const result = await dbHelpers.addRows<IUserTableInsertDTO>(app_user_tableName, [newUser]);
            

            if (result.length > 0) {
                // Clear the input field
                setInputValue("");

                // Fetch updated data
                const result = await dbHelpers.fetchAllRows<IUserTableDTO>(app_user_tableName);

                setData(result); // Refresh the data after adding
            } 
            else 
            {
            console.error("Error adding data: No rows were inserted.");
            }
        } 
        catch (error) 
        {
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
          keyExtractor={(item) => item.user_id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <ThemedText style={styles.item}>{`${item.user_firstName} ${item.user_lastName} (${item.user_email})`}</ThemedText>
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
        <TouchableOpacity style={styles.button} onPress={addUser}>
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
