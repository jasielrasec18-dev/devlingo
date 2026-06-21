import { createFileRoute } from '@tanstack/react-router';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IoDiamond } from 'react-icons/io5';
import { Target } from 'lucide-react';
import DevLingoChar  from '../assets/images/devlingo-char.png';
import { useAuth } from '../contexts/AuthContext';

type SuccessSearch = {
  totalXp?: number;
};

const SuccessScreenComponent = () => {
  const navigate = useNavigate();
  const { refetchUserProfile } = useAuth();
  const { totalXp = 0 } = useSearch({ strict: false }) as SuccessSearch;

  const handleContinue = async () => {
    await refetchUserProfile();
    navigate({ to: '/home', replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center max-w-md w-full">
        {/* Personagem */}
        <img
          src={DevLingoChar}
          alt="Devlingo"
          className="w-40 h-40 mb-8 object-contain"
        />

        {/* Título */}
        <h1 className="text-3xl font-extrabold text-amber-500 mb-8 text-center">
          Lição concluída!
        </h1>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          {/* Card XP */}
          <div className="bg-amber-100 border-2 border-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-xs uppercase font-bold text-amber-700 mb-3">Total de XP</p>
            <div className="flex items-center gap-2">
              <IoDiamond className="h-6 w-6 text-blue-500" />
              <p className="text-2xl font-extrabold text-amber-700">{totalXp}</p>
            </div>
          </div>

          {/* Card Precisão */}
          <div className="bg-green-100 border-2 border-green-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <p className="text-xs uppercase font-bold text-green-600 mb-3">Ótima</p>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              <p className="text-2xl font-extrabold text-green-700">100%</p>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleContinue}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl uppercase tracking-wide border-b-4 border-green-600 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/success')({
  component: SuccessScreenComponent,
});
