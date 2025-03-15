import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{
    error: string | null;
    user: User | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ error: string | null; success: boolean }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ error: string | null; success: boolean }>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login');
      setError(null);
      setLoading(true);

      // Validar dados de entrada
      if (!email || !password) {
        const errorMessage = 'Email e senha são obrigatórios';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Chamando supabase.auth.signInWithPassword');
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Resposta do Supabase recebida');
      const { data, error } = response;

      if (error) {
        console.error('Erro retornado pelo Supabase:', error);
        // Mapear o erro para uma mensagem amigável
        let errorMessage = 'Erro ao fazer login';

        if (
          error.message.includes('Invalid login credentials') ||
          error.message.includes('invalid login') ||
          error.message.includes('Invalid email') ||
          error.message.includes('Invalid password') ||
          error.message.includes('email/password')
        ) {
          errorMessage =
            'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage =
            'Este email ainda não foi confirmado. Verifique sua caixa de entrada.';
        } else if (error.message.includes('rate limit')) {
          errorMessage =
            'Muitas tentativas de login. Tente novamente mais tarde.';
        } else {
          errorMessage = error.message;
        }

        console.error('Erro de login mapeado:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        console.log('Login bem-sucedido! User:', data.user?.id);
        // Garantir que a sessão tenha sido definida
        if (!data.session) {
          console.error('Login aparentemente bem-sucedido, mas sem sessão');
          const errorMessage = 'Erro interno: sessão não iniciada corretamente';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      // Este catch só tratará erros que não foram tratados acima
      const errorMessage = 'Erro ao fazer login';

      if (err instanceof Error) {
        console.error('Erro detalhado:', err);
        // Apenas sobrescrever se não for um erro já tratado
        if (!error) {
          setError(err.message);
        }
      } else {
        console.error('Erro desconhecido durante login:', err);
        setError(errorMessage);
      }
      throw err; // Propagar o erro para que o componente possa tratá-lo
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setLoading(true);

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
            },
          },
        }
      );

      if (signUpError) throw signUpError;

      const result = { error: null as string | null, user: authData.user };

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users_profiles')
          .insert([
            {
              user_id: authData.user.id,
              full_name: fullName,
              role: 'technician',
            },
          ]);

        if (profileError) {
          result.error = profileError.message;
        }
      }

      return result;
    } catch (err) {
      let errorMessage = 'Erro ao criar conta';

      if (err instanceof Error) {
        console.error('Erro de autenticação:', err);

        // Tratamento de erros específicos
        if (err.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (err.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique e tente novamente.';
        } else if (err.message.includes('Password should be')) {
          errorMessage =
            'A senha não atende aos requisitos mínimos (mínimo 6 caracteres).';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      return { error: errorMessage, user: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;

      return { error: null, success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Erro ao enviar email de recuperação';
      setError(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { error: null, success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao atualizar senha';
      setError(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
