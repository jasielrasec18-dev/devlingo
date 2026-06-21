import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (animationDone && !loading) {
      navigate({ to: isAuthenticated ? '/home' : '/signin', replace: true });
    }
  }, [animationDone, loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#8a2be2]">
      <LoadingScreen onFinish={() => setAnimationDone(true)} />
    </div>
  );
}
