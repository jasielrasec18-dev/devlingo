import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const handleLoadingFinish = () => {
    if (!loading) {
      if (isAuthenticated) {
        navigate({ to: '/home', replace: true });
      } else {
        navigate({ to: '/signin', replace: true });
      }
    }
  };

  // LoadingScreen gerencia seu próprio timing e chama onFinish ao terminar
  // Fundo roxo para não piscar branco enquanto o LoadingScreen carrega
  return (
    <div className="min-h-screen bg-[#8a2be2]">
      <LoadingScreen onFinish={handleLoadingFinish} />
    </div>
  );
}
