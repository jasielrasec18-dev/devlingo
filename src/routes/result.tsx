import { createFileRoute } from '@tanstack/react-router';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Check, X } from 'lucide-react';
import { z } from 'zod';
import DevlingoChar from '../assets/images/devlingo-char.png';

const resultSearchSchema = z.object({
  correctAnswers: z.number().default(0),
  incorrectAnswers: z.number().default(0),
  lessonId: z.string().default(''),
});

type ResultSearch = z.infer<typeof resultSearchSchema>;

const ResultScreenComponent = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as ResultSearch;

  const correctAnswers = searchParams.correctAnswers || 0;
  const incorrectAnswers = searchParams.incorrectAnswers || 0;
  const lessonId = searchParams.lessonId || '';

  const totalAnswers = correctAnswers + incorrectAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const handleBackHome = () => {
    navigate({ to: '/home', replace: true });
  };

  const handleRetry = () => {
    // Redireciona para home para que o usuário possa selecionar a lição novamente
    // Isso garante que as questões sejam carregadas corretamente
    navigate({ to: '/', replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Imagem */}
          <img
            src={DevlingoChar}
            alt="Devlingo"
            className="w-32 h-32 mx-auto mb-6 object-contain"
          />

          {/* Título */}
          <h1 className="text-3xl font-bold text-slate-700 mb-2">
            Você quase conseguiu!
          </h1>

          {/* Subtítulo */}
          <p className="text-gray-500 mb-8">
            Continue praticando para melhorar
          </p>
        </div>

        {/* Card de Estatísticas */}
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          {/* Linha 1: Acertos */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-slate-700 font-medium">Respostas corretas</span>
            </div>
            <span className="text-green-500 font-bold text-lg">{correctAnswers}</span>
          </div>

          {/* Linha 2: Erros */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-slate-700 font-medium">Respostas incorretas</span>
            </div>
            <span className="text-red-500 font-bold text-lg">{incorrectAnswers}</span>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-100 my-4" />

          {/* Precisão */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-bold">Precisão</span>
            <span className="text-slate-700 font-bold">{accuracy}%</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handleBackHome}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-700 font-bold py-3 rounded-xl uppercase transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleRetry}
            className="flex-1 bg-[#58cc02] hover:bg-[#61e002] text-white font-bold py-3 rounded-xl uppercase border-b-4 border-[#46a302] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/result')({
  component: ResultScreenComponent,
  validateSearch: resultSearchSchema,
});
