import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as dbHelpers from "@/supabase/databaseHelpers"; // Import the helper functions
import { IUserTableFetchDTO, IUserTableInsertDTO } from "@/types/Interfaces/DTOs/IUserTableDTO";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";





export default function DatabaseTestPage() {
    
    // State to hold data from the database
  const [data, setData] = useState<IUserTableFetchDTO[]>([]);

  // State to hold input value
  const [inputValue, setInputValue] = useState("");

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  const tableName = "app_user"; // Replace with your actual table name


  const Table = ({ data }: { data: IUserTableFetchDTO[] }) => {
  const headers = ["First Name", "Last Name", "Email", "Created At"];

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableRow}>
        {headers.map((header, index) => (
          <Text key={index} style={[styles.tableCell, styles.headerCell]}>
            {header}
          </Text>
        ))}
      </View>

      {/* Table Rows */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.app_user_id?.toString() || index.toString()}
        renderItem={({ item }) => {
          const utcDate = item.app_user_created_at ? new Date(item.app_user_created_at) : null;
          const formattedDate = utcDate
            ? utcDate.toLocaleString("en-US")
            : "N/A";

          return (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.app_user_firstname || "Unknown"}</Text>
              <Text style={styles.tableCell}>{item.app_user_lastname || "User"}</Text>
              <Text style={styles.tableCell}>{item.app_user_email || "No Email"}</Text>
              <Text style={styles.tableCell}>{formattedDate}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No data available</Text>
        }
      />
    </View>
  );
};

  // Function to fetch data from the database
  const fetchData = async () => {
    setLoading(true);
    try {
      // Replace with your Supabase or API fetch logic
      const result = await dbHelpers.fetchAllRows<IUserTableFetchDTO>(tableName);
      console.log("Fetched rows:", result);
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
                app_user_firstname: firstName,
                app_user_lastname: lastName || "",
                app_user_email: email,
            };
       
            // Replace with your Supabase or API POST logic
            const result = await dbHelpers.addRows<IUserTableInsertDTO>(tableName, [newUser]);
            

            if (result.length > 0) {
                // Clear the input field
                setInputValue("");

                // Fetch updated data
                const result = await dbHelpers.fetchAllRows<IUserTableFetchDTO>(tableName);

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

    {/* Setup the UI elements */}
    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={Keyboard.dismiss}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Database Test Page
          </ThemedText>

          {/* Button to fetch data */}
          <Pressable
            onPress={fetchData}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.7 }, 
              loading && { backgroundColor: "#ccc" },
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              {loading ? "Loading..." : "Fetch Data"}
            </ThemedText>
          </Pressable>

          {/* Table Component */}
          <Table data={data} />

          <TextInput
            style={styles.input}
            placeholder="Enter new data"
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
          />

          <Pressable
            onPress={addUser}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Add Data
            </ThemedText>
          </Pressable>
        </ThemedView>
      </Pressable>
    </KeyboardAvoidingView>
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
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    padding: 16,
    color: "#999",
  },
});
