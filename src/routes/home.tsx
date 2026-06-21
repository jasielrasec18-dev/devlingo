import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from '../components/Header';
import { LearningPath } from '../components/LearningPath';
import { LessonsModal, type Unit } from '../components/LessonsModal';
import { getUnits } from '../services/unitsService';
import { useAuth } from '../contexts/AuthContext';

export const Route = createFileRoute('/home')({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      setUnitsLoading(true);
      if (!user?.id) {
        setUnits([]);
        setUnitsLoading(false);
        return;
      }

      const data = await getUnits(user.id);
      setUnits(data);
      setUnitsLoading(false);
    };

    if (!authLoading) {
      fetchUnits();
    }
  }, [authLoading, user?.id]);

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectLesson = (lessonId: Unit['lessons'][number]['id']) => {
    const lesson = selectedUnit?.lessons.find(
      (item) => String(item.id) === String(lessonId),
    );
    setIsModalOpen(false);
    navigate({
      to: '/lessons/$lessonId',
      params: { lessonId: String(lessonId) },
      state: { lesson },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {unitsLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600 font-medium">Carregando unidades...</p>
        </div>
      ) : (
        <>
          <LearningPath units={units} onSelectUnit={handleSelectUnit} />
          <LessonsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            unit={selectedUnit}
            onSelectLesson={handleSelectLesson}
          />
        </>
      )}
    </div>
  );
}
