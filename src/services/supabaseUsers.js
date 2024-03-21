import supabase from "./supabaseClient";

export const getUserByAuthId = async (authId) => {
  const { data, error } = await supabase.from('users').select().eq('user_id', authId).single();
  if (error) {
    return { result: 'error', data: error };
  }
  return { result: 'success', data: data };
}