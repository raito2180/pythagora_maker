import supabase from "./supabaseClient";
import { State } from "utils/GameSetting";

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

// データベースから管理者に関連するステージデータを取得
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

// データベースから一般に関連するステージステージを取得
export const getUsersStagesRange = async ({ start, end }) => {
  try {
    const { data: userProfiles, error: profilesError } = await supabase.from('profiles').select('id, name').eq('role', '一般');
    if (profilesError) throw profilesError;
    const profileIds = userProfiles.map(profile => profile.id);

    const { data: stages, error: stagesError } = await supabase.from('stages').select('id, profile_id, title, image').in('profile_id', profileIds).eq('state', State.release).range(start, end);
    if (stagesError) throw stagesError;

    // ステージデータにユーザー名を合体！
    const stagesWithUserName = stages.map(stage => {
      const userProfile = userProfiles.find(profile => profile.id === stage.profile_id);
      return {
        ...stage,
        userName: userProfile ? userProfile.name : 'Unkonwn'
      };
    });

    return { result: Response.success, data: stagesWithUserName };
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

// データベースから管理者に紐づくステージ数をカウント
export const getStagesCountByAdmins = async () => {
  try {
    const { data: adminProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '管理者');
    if (profilesError) throw profilesError;
    const profileIds = adminProfiles.map(profile => profile.id);

    const { count, error: countError } = await supabase.from('stages').select('id', { count: 'exact' }).in('profile_id', profileIds);
    if (countError) throw countError;

    return { result: Response.success, count };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

// データベースから一般ユーザーに紐づくステージ数をカウント
export const getStagesCountByUsers = async () => {
  try {
    const { data: userProfiles, error: profilesError } = await supabase.from('profiles').select('id').eq('role', '一般');
    if (profilesError) throw profilesError;
    const profileIds = userProfiles.map(profile => profile.id);

    const { count, error: countError } = await supabase.from('stages').select('id', { count: 'exact' }).in('profile_id', profileIds);
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

// ステージの更新
// TODO : 後で統一
export const updateStageInTestPlay = async (stageId, stageData) => {
  try {
    let { error } = await supabase.from('stages').update(stageData).eq('id', stageId);
    if (error) throw error;
    return { result: Response.success };
  } catch (error) {
    return { result: Response.error, data: error.message };
  }
};

export const updateStage = async (stageId, stageData) => {
  let { data, error } = await supabase.from('stages').update({ content: stageData, state: State.untested, updated_at: new Date() }).eq('id', stageId);
  if (error) {
    return { result: Response.error, data: error };
  }
  return { result: Response.success, data: data };
}
