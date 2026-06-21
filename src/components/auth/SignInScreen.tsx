import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const signInSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: '/home', replace: true });
    }
  }, [isAuthenticated, loading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const onSubmit = async (_data: SignInFormData) => {
    const result = await signIn(_data.email, _data.password);

    if (result.success) {
      navigate({ to: "/home", replace: true });
    } else {
      setErrorMessage(result.errorMessage || "Erro ao fazer login");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#8B00FF]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#8B00FF] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo de volta!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Entre na sua conta para continuar
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="........"
              className={`h-12 w-full rounded-lg border px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#8B00FF] text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/signup" className="font-semibold text-[#8B00FF]">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};
