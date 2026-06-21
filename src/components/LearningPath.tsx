import grayStarImg from '../assets/images/gray-star.png';
import greenStarImg from '../assets/images/green-star.png';
import devlingoCharImg from '../assets/images/devlingo-char.png';
import type { Unit } from './LessonsModal';

type LearningPathProps = {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
};

const getOffsetPixels = (index: number): number => {
  const offsets = [0, -40, -60, -40, -20];
  return offsets[index % offsets.length];
};

const getStarImage = (status: Unit['status']): string => {
  if (status === 'completed') {
    return greenStarImg;
  }
  return grayStarImg;
};

export const LearningPath = ({ units, onSelectUnit }: LearningPathProps) => {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      {units.map((unit, index) => (
        <div
          key={unit.id}
          className="relative"
          style={{ marginLeft: `${getOffsetPixels(index)}px` }}
        >
          <button
            disabled={unit.status === 'locked'}
            onClick={() => onSelectUnit(unit)}
            className="flex h-20 w-20 items-center justify-center transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            <img
              src={getStarImage(unit.status)}
              alt={`Unit ${unit.id}`}
            />
          </button>

          {/* Personagem aparece na terceira estrela (index 2) */}
          {index === 2 && (
            <img
              src={devlingoCharImg}
              alt="Devlingo Character"
              className="absolute -right-24 top-1/2 h-20 w-20 -translate-y-1/2 animate-bounce"
            />
          )}
        </div>
      ))}
    </div>
  );
};
