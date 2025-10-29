import { supabase } from "./supabaseClient";

export const fetchData = async (tableName: string) => {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) throw error;
  return data;
};

export const addData = async (tableName: string, newData: object) => {
  const { data, error } = await supabase.from(tableName).insert([newData]);
  if (error) throw error;
  return data;
};