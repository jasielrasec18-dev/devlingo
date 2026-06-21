import { createFileRoute } from '@tanstack/react-router';
import { SignUpScreen } from '../components/auth/SignUpScreen';

export const Route = createFileRoute('/signup')({
  component: SignUpScreen,
});
