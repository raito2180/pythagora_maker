import supabase from "./supabaseClient";

const Response = {
  success: "success",
  error: "error",
};

export const getStageById = async (stageId) => {
  let { data: stage, error } = await supabase.from('stages').select(`*,profiles(*)`).eq("id", stageId).single();
  if (error) {
    return { result: Response.error, data: error };
  }
  return { result: Response.success, data: stage };
}

export const getDefaultStagesRange = async ({ start, end }) => {
  try {
    const { data: userProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '管理者');

    if (profilesError) throw profilesError;

    const profileIds = userProfiles.map(profile => profile.id);

    const { data: stages, error: stagesError } = await supabase.from('stages').select().in('profile_id', profileIds).range(start, end);

    if (stagesError) throw stagesError;

    return { result: Response.success, data: stages };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

export const getUsersStagesRange = async ({ start, end }) => {
  try {
    const { data: userProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '一般');

    if (profilesError) throw profilesError;

    const profileIds = userProfiles.map(profile => profile.id);

    const { data: stages, error: stagesError } = await supabase.from('stages').select().in('profile_id', profileIds).range(start, end);

    if (stagesError) throw stagesError;

    return { result: Response.success, data: stages };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

export const getStagesRangeSortByDesc = async ({ start, end }) => {
  // NOTE : 追加順 = 制作日時が古い順になるはずなので、idでソートしています。
  //        制作日のほうが都合良ければorderのカラム名変更していただければ！
  let { data: stages, error } = await supabase.from('stages').select().range(start, end).order('id', { ascending: false });
  if (error) {
    return { result: Response.error, data: error };
  }
  return { result: Response.success, data: stages };
}

export const getStagesCount = async () => {
  let { error, count } = await supabase.from('stages').select('id', { count: 'exact' });
  if (error) {
    return { result: Response.error, data: error };
  }
  return { result: Response.success, count: count };
}

export const getStagesCountByAdmins = async () => {
  try {
    const { data: adminProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '管理者');

    if (profilesError) throw profilesError;

    const profileIds = adminProfiles.map(profile => profile.id);
    const { count, error: countError } = await supabase.from('stages').select('id',{ count: 'exact' }).in('profile_id', profileIds);

    if (countError) throw countError;

    return { result: Response.success, count };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

export const getStagesCountByUsers = async () => {
  try {
    const { data: userProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '一般');

    if (profilesError) throw profilesError;

    const profileIds = userProfiles.map(profile => profile.id);
    const { count, error: countError } = await supabase.from('stages').select('id',{ count: 'exact' }).in('profile_id', profileIds);

    if (countError) throw countError;

    return { result: Response.success, count };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

export const getStagesCountByUserId = async (userId) => {
  let { error, count } = await supabase.from('stages').select('id', { count: 'exact' }).eq('profile_id', userId);
  if (error) {
    return { result: Response.error, data: error };
  }
  return { result: Response.success, count: count };
}