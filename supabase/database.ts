import { supabase } from "./supabaseClient";
import { IUserTableDTO } from "@/types/Interfaces/DTOs/IUserTableDTO";

/**
 * Fetches data from a specified table in the database.
 *
 * @param {string} tableName - The name of the table to fetch data from.
 * @returns {Promise<DataItem[]>} A promise that resolves to an array of data items.
 * @throws {Error} If the database query fails.
 * @example
 * const users = await fetchData("users");
 */
export const fetchData = async (tableName: string) => {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) throw error;
  return data;
};

/**
 * Inserts a new record into a specified table in the database.
 *
 * @param {string} tableName - The name of the table to insert data into.
 * @param {T} newData - The data to insert into the table, matching the table's schema.
 * @returns {Promise<T>} A promise that resolves to the inserted data.
 * @throws {Error} If the database insertion fails.
 * @example
 * const newUser = await addData<IUserTableDTO>("users", { name: "John Doe", age: 30 });
 */
export const addData = async <T>(tableName: string, newData: T): Promise<T> => {
  const { data, error } = await supabase.from(tableName).insert([newData]);
  if (error) {
    throw new Error(`Error inserting data into table "${tableName}": ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`No data was returned after inserting into table "${tableName}".`);
  }

  return data[0]; // Safely return the first inserted row
};

/**
 * Fetches a single row from a specified table by its ID.
 *
 * @param {string} tableName - The name of the table to fetch data from.
 * @param {number} id - The ID of the row to fetch.
 * @returns {Promise<IUserTableDTO | null>} A promise that resolves to the row data or null if not found.
 * @throws {Error} If the database query fails.
 */
export const fetchRowById = async (
  tableName: string,
  id: number
): Promise<IUserTableDTO | null> => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", id) // Filter by the "id" column
    .single(); // Ensure only one row is returned

  if (error) throw error;
  return data;
};