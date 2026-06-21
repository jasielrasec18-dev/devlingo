import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { IoDiamond, IoHeart } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: '/signin', replace: true });
  };

  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Idioma */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400">
          <span className="text-sm font-bold text-black">JS</span>
        </div>

        {/* Status e Ações */}
        <div className="flex items-center gap-6">
          {/* Gemas */}
          <div className="flex items-center gap-2">
            <IoDiamond className="h-5 w-5 text-cyan-500" />
            <span className="text-sm font-bold text-cyan-500">{userProfile?.total_xp ?? 0}</span>
          </div>

          {/* Vidas */}
          <div className="flex items-center gap-2">
            <IoHeart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-bold text-red-500">∞</span>
          </div>

          {/* Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-700 cursor-pointer"
          >
            <span className="text-sm font-medium">Sair</span>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Unit Banner */}
      <div className="mx-6 mb-6 rounded-2xl border-b-4 border-violet-800 bg-[#7c3aed] p-8">
        <p className="text-sm font-medium uppercase text-white">Começar Unidade</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Fundamentos de JavaScript</h1>
      </div>
    </div>
  );
};

export default Header;
