import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import type { CreateUserProfileInput, CreateUserProfileResult } from "../types/user";

type UserProfile = {
  id: string;
  email: string;
  name: string;
  total_xp: number;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; errorMessage?: string }>;
  signOut: () => Promise<void>;
  signUp: (input: CreateUserProfileInput) => Promise<CreateUserProfileResult>;
  refetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, name, total_xp')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const refetchUserProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = "Erro ao fazer login";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "E-mail ou senha incorretos";
      } else {
        errorMessage = error.message || "Erro ao fazer login";
      }

      return { success: false, errorMessage };
    }

    if (data.user) {
      return { success: true };
    }

    return { success: false, errorMessage: "Erro ao fazer login" };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (
    input: CreateUserProfileInput,
  ): Promise<CreateUserProfileResult> => {
    const { name, email, password } = input;

    // 1. Cria o usuário no sistema de autenticação do Supabase (auth.users)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Erro ao criar usuário" };
    }

    // 2. Insere dados adicionais na tabela user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        name,
        email,
      })
      .select()
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, data: profileData };
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAuthenticated, signIn, signOut, signUp, refetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
