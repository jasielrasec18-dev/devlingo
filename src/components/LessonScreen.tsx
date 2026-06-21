import { useMemo, useState } from 'react';
import { X, Heart } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { Lesson, LessonQuestion } from './LessonsModal';
import { SuccessPopUp } from './SuccessPopUp';
import { ErrorPopUp } from './ErrorPopUp';
import { completeLesson } from '../services/lessonsService';
import { useAuth } from '../contexts/AuthContext';

export const LessonScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const lesson = useRouterState({
    select: (state) => (state.location.state as { lesson?: Lesson } | undefined)?.lesson,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [hearts, setHearts] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const questions: LessonQuestion[] = lesson?.questions ?? [];
  const question = questions[currentIndex];

  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      return;
    }

    navigate({ to: '/home', replace: true });
  };

  const handleVerify = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setFeedback(isCorrect ? 'success' : 'error');

    // Atualiza contadores
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      const newHearts = hearts - 1;
      setHearts(newHearts);

      // Se chegou a 0, redireciona para resultado após mostrar o popup
      if (newHearts === 0) {
        setTimeout(() => {
          navigate({
            to: '/result',
            search: {
              correctAnswers: correctAnswers,
              incorrectAnswers: incorrectAnswers + 1,
              lessonId: lesson?.id.toString() ?? '',
            },
            replace: true,
          });
        }, 2000);
      }
    }
  };

  const handleContinue = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      return;
    }

    // Última questão respondida
    const finalCorrectAnswers = correctAnswers + (feedback === 'success' ? 1 : 0);
    const finalIncorrectAnswers = incorrectAnswers;

    // Se todas as respostas foram corretas, vai para tela de sucesso
    if (finalIncorrectAnswers === 0 && user?.id && lesson?.id) {
      // Salva lição como completada no banco
      await completeLesson({
        userId: user.id,
        lessonId: lesson.id.toString(),
        xpEarned: lesson.xp ?? 0,
      });

      navigate({
        to: '/success',
        search: {
          totalXp: lesson?.xp ?? 0,
        },
        replace: true,
      });
    } else {
      // Se teve erros, vai para tela de resultado
      navigate({
        to: '/result',
        search: {
          correctAnswers: finalCorrectAnswers,
          incorrectAnswers: finalIncorrectAnswers,
          lessonId: lesson?.id.toString() ?? '',
        },
        replace: true,
      });
    }
  };

  if (!lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Lição indisponível</h1>
          <p className="mt-2 text-gray-500">Volte para a tela inicial e selecione uma lição.</p>
          <button
            onClick={() => navigate({ to: '/home', replace: true })}
            className="mt-6 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold uppercase text-white"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-2xl flex-col">
        <header className="flex items-center gap-4 p-6">
          <button
            onClick={() => navigate({ to: '/home', replace: true })}
            className="text-gray-400"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>

          <div className="h-4 flex-1 rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`h-5 w-5 ${
                  i < hearts ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 px-6">
          <h1 className="mt-6 text-3xl font-bold text-gray-800">{question.title}</h1>

          <div className="mt-6 space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={option}
                  onClick={() => setSelectedOption(index)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-blue-400 bg-blue-100'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-gray-800">{option}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border text-xs text-gray-500">
                    {index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <footer className="mt-8 flex items-center justify-between border-t border-gray-100 p-6">
          <button
            onClick={handleSkip}
            className="cursor-pointer not-only:rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold uppercase text-gray-700"
          >
            Pular
          </button>
          <button
            onClick={handleVerify}
            disabled={selectedOption === null}
            className="cursor-pointer rounded-xl bg-green-500 px-8 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-green-600"
          >
            Verificar
          </button>
        </footer>
      </div>

      {feedback === 'success' && <SuccessPopUp onContinue={handleContinue} />}
      {feedback === 'error' && <ErrorPopUp onContinue={handleContinue} />}
    </div>
  );
};

export default LessonScreen;