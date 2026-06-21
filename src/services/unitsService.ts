import { supabase } from './supabaseClient';
import type { Unit, Lesson, LessonQuestion } from '../components/LessonsModal';

type UnitRow = {
  id: string;
  title: string | null;
  level: string | null;
};

type LessonRow = {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number | null;
  unit_id: string;
};

type UserLessonRow = {
  lesson_id: string;
  is_completed: boolean;
};

type LessonQuestionRow = {
  id: string;
  lesson_id: string;
  question_text: string;
  position: number;
};

type LessonQuestionOptionRow = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  position: number;
};

export const getUnits = async (userId: string): Promise<Unit[]> => {
  const [
    { data: unitsData, error: unitsError },
    { data: lessonsData, error: lessonsError },
    { data: userLessonsData, error: userLessonsError },
    { data: questionsData, error: questionsError },
    { data: optionsData, error: optionsError },
  ] = await Promise.all([
    supabase.from('units').select('id,title,level').order('created_at'),
    supabase.from('lessons').select('id,title,description,xp_reward,unit_id').order('created_at'),
    supabase.from('user_lessons').select('lesson_id,is_completed').eq('user_id', userId),
    supabase.from('lesson_questions').select('id,lesson_id,question_text,position').order('position'),
    supabase.from('lesson_question_options').select('id,question_id,option_text,is_correct,position').order('position'),
  ]);

  if (unitsError || lessonsError || userLessonsError || questionsError || optionsError) {
    console.error(
      'Erro ao buscar unidades:',
      unitsError?.message ||
        lessonsError?.message ||
        userLessonsError?.message ||
        questionsError?.message ||
        optionsError?.message,
    );
    return [];
  }

  const lessonsByUnit = new Map<string, LessonRow[]>();
  (lessonsData ?? []).forEach((lesson: LessonRow) => {
    const list = lessonsByUnit.get(lesson.unit_id) ?? [];
    list.push(lesson);
    lessonsByUnit.set(lesson.unit_id, list);
  });

  const completedLessonIds = new Set(
    (userLessonsData ?? []).filter((item: UserLessonRow) => item.is_completed).map((item: UserLessonRow) => item.lesson_id),
  );

  const optionsByQuestion = new Map<string, LessonQuestionOptionRow[]>();
  (optionsData ?? []).forEach((option: LessonQuestionOptionRow) => {
    const list = optionsByQuestion.get(option.question_id) ?? [];
    list.push(option);
    optionsByQuestion.set(option.question_id, list);
  });

  const questionsByLesson = new Map<string, LessonQuestion[]>();
  (questionsData ?? []).forEach((question: LessonQuestionRow) => {
    const options = (optionsByQuestion.get(question.id) ?? []).sort(
      (a, b) => a.position - b.position,
    );

    const optionTexts = options.map((option) => option.option_text);
    const correctIndex = options.findIndex((option) => option.is_correct);

    const mappedQuestion: LessonQuestion = {
      id: question.id,
      title: question.question_text,
      options: optionTexts,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    };

    const list = questionsByLesson.get(question.lesson_id) ?? [];
    list.push(mappedQuestion);
    questionsByLesson.set(question.lesson_id, list);
  });

  const mappedUnits = (unitsData ?? []).map((unit: UnitRow) => {
    const lessons = (lessonsByUnit.get(unit.id) ?? []).map((lesson): Lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? '',
      xp: lesson.xp_reward ?? 0,
      completed: completedLessonIds.has(lesson.id),
      questions: questionsByLesson.get(lesson.id) ?? [],
    }));

    const unitCompleted = lessons.length > 0 && lessons.every((lesson) => lesson.completed);

    return {
      id: unit.id,
      title: unit.title ?? 'Unidade',
      level: unit.level ?? `Unidade ${unit.id}`,
      status: unitCompleted ? 'completed' : 'locked',
      lessons,
    } as Unit;
  });

  // Garantir que a primeira unidade não completada seja available
  const firstLockedIndex = mappedUnits.findIndex((unit) => unit.status !== 'completed');
  if (firstLockedIndex >= 0) {
    mappedUnits[firstLockedIndex] = {
      ...mappedUnits[firstLockedIndex],
      status: 'available',
    };
  }

  return mappedUnits;
};