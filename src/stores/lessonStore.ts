import type { Lesson } from '../components/LessonsModal';

let _currentLesson: Lesson | undefined;

export const lessonStore = {
  get: (): Lesson | undefined => _currentLesson,
  set: (lesson: Lesson | undefined) => {
    _currentLesson = lesson;
  },
};
