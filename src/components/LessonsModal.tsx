import { X, Check } from 'lucide-react';
import devlingoCharImg from '../assets/images/devlingo-char.png';

export type Lesson = {
  id: string | number;
  title: string;
  description: string;
  xp: number;
  completed?: boolean;
  questions?: LessonQuestion[];
};

export type LessonQuestion = {
  id: string | number;
  title: string;
  options: string[];
  correctAnswer: number;
};

export type Unit = {
  id: string | number;
  title: string;
  level: string;
  status: 'locked' | 'available' | 'completed';
  lessons: Lesson[];
};

type LessonsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  onSelectLesson: (lessonId: Lesson['id']) => void;
};

export const LessonsModal = ({ isOpen, onClose, unit, onSelectLesson }: LessonsModalProps) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-purple-600 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-purple-200 transition-colors hover:text-white"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Escolha uma lição</h2>
          <p className="mt-1 text-sm text-purple-100">{unit.title}</p>
        </div>

        <div className="mt-6 space-y-4 pb-10">
          {unit.lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`cursor-pointer flex w-full items-center justify-between rounded-xl bg-purple-700 p-4 text-left transition-colors ${
                lesson.completed ? 'border-2 border-green-400' : 'border-2 border-transparent'
              }`}
            >
              <div>
                <p className="text-sm font-bold text-white">{lesson.title}</p>
                <p className="text-xs text-purple-100">{lesson.description}</p>
                <p className="mt-2 text-xs text-purple-100">+{lesson.xp} XP</p>
              </div>

              {lesson.completed && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <img
          src={devlingoCharImg}
          alt="Devlingo Character"
          className="absolute -bottom-6 -right-6 z-10 w-24"
        />
      </div>
    </div>
  );
};

export default LessonsModal;