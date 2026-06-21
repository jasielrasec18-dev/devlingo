import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const signUpSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Digite um email válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'A confirmação deve ter no mínimo 6 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpScreen = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError(null);

    const result = await signUp({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    navigate({ to: '/home', replace: true });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#7c3aed] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-2 text-sm text-gray-500">Cadastre-se para começar sua jornada</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="........"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="........"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#7c3aed] text-sm font-bold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Criar conta'}
          </button>
        </form>

        {submitError && (
          <p className="mt-4 text-center text-sm text-red-500">{submitError}</p>
        )}

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/signin" className="font-semibold text-violet-600">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};
