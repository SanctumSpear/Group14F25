// import * as dbHelpers from "@/supabase/databaseHelpers";
// import { IUserTableFetchDTO, IUserTableInsertDTO } from "@/types/Interfaces/DTOs/IUserTableDTO";
// import { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";

// export default function DatabaseTestPage() {    
  
//   const [tableData, setData] = useState<IUserTableFetchDTO[]>([]);  
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(false);

//   const tableName = "app_user"; // Replace with your actual table name

//   //const Table = ({ data }: { data: IUserTableFetchDTO[] }) => {
//   //const headers = ["First Name", "Last Name", "Email", "Created At"];
 
//   // Function to fetch data from the database
//   const fetchData = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       // Replace with your Supabase or API fetch logic
//       const result = await dbHelpers.fetchAllRows<IUserTableFetchDTO>(tableName);
//       console.log("Fetched rows:", result);
//       setData(result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to add a new user to the database
//   const addUser = async (): Promise<void> => 
//   {
//     // Remove leading and trailing whitespace from the input value
//     const trimmedInput = inputValue.trim();

//     // Check if the trimmed input is empty
//     if (trimmedInput === "") {
//         return; // Exit the function if the input is empty
//     }

//     // Split the input into first and last name (simple example)
//     const [firstName, lastName] = trimmedInput.split(" ");

//     // Create a new email using the first letter of the first name and the entire last name
//     const email = `${firstName.charAt(0).toLowerCase()}${lastName ? lastName.toLowerCase() : ""}@example.com`;

//     try 
//     {
//       // IUserTableInsertDTO excludes auto-generated fields (user_id, user_createdAt)
//       const newUser: IUserTableInsertDTO = {
//           app_user_firstname: firstName,
//           app_user_lastname: lastName || "",
//           app_user_email: email,
//       };
  
//       // Replace with your Supabase or API POST logic
//       const result = await dbHelpers.addRows<IUserTableInsertDTO>(tableName, [newUser]);
      
//       if (result.length > 0) {
//           // Clear the input field
//           setInputValue("");

//           // Fetch updated data
//           const updatedData = await dbHelpers.fetchAllRows<IUserTableFetchDTO>(tableName);

//           setData(updatedData); // Refresh the data after adding
//       } 
//       else 
//       {
//       console.error("Error adding data: No rows were inserted.");
//       }
//     } 
//     catch (error) 
//     {
//       console.error("Error adding data:", error);
//     }
//   };

//   // Add the return statement here
//   return (
// }

// // Styles for the UI components
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 24,
//     gap: 16,
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   // input: {
//   //   height: 50,
//   //   borderWidth: 1,
//   //   borderColor: "#ccc",
//   //   borderRadius: 12,
//   //   paddingHorizontal: 16,
//   //   fontSize: 16,
//   // },
//   // button: {
//   //   backgroundColor: "#007AFF",
//   //   borderRadius: 12,
//   //   paddingVertical: 14,
//   //   alignItems: "center",
//   // },
//   // buttonText: {
//   //   color: "#fff",
//   // },
//   // item: {
//   //   padding: 10,
//   //   borderBottomWidth: 1,
//   //   borderBottomColor: "#ccc",
//   // },
//   // tableContainer: {
//   //   borderWidth: 1,
//   //   borderColor: "#ccc",
//   //   borderRadius: 8,
//   //   overflow: "hidden",
//   // },
//   // tableRow: {
//   //   flexDirection: "row",
//   //   borderBottomWidth: 1,
//   //   borderBottomColor: "#ccc",
//   // },
//   // tableCell: {
//   //   flex: 1,
//   //   padding: 8,
//   //   textAlign: "center",
//   // },
//   // headerCell: {
//   //   backgroundColor: "#f0f0f0",
//   //   fontWeight: "bold",
//   // },
//   // noDataText: {
//   //   textAlign: "center",
//   //   padding: 16,
//   //   color: "#999",
//   // },
// });
