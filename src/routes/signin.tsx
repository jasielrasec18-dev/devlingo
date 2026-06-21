import { createFileRoute } from '@tanstack/react-router';
import { SignInScreen } from '../components/auth/SignInScreen';

export const Route = createFileRoute('/signin')({
  component: SignInScreen,
});
