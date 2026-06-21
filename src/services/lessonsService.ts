import { supabase } from './supabaseClient';

type CompleteLessonInput = {
  userId: string;
  lessonId: string;
  xpEarned: number;
};

export const completeLesson = async ({ userId, lessonId, xpEarned }: CompleteLessonInput) => {
  try {
    // Insere ou atualiza user_lessons
    const { data: lessonData, error: lessonError } = await supabase
      .from('user_lessons')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          is_completed: true,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,lesson_id',
        }
      )
      .select()
      .single();

    if (lessonError) throw lessonError;

    // Atualiza o total_xp do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase
        .from('user_profiles')
        .update({ total_xp: (profile.total_xp || 0) + xpEarned })
        .eq('id', userId);
    }

    return { success: true, data: lessonData };
  } catch (error) {
    console.error('Erro ao completar lição:', error);
    return { success: false, error };
  }
};
