import { createFileRoute } from '@tanstack/react-router';
import { LessonScreen } from '../components/LessonScreen';

export const Route = createFileRoute('/lessons/$lessonId')({
  component: LessonScreen,
});