import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../lib/auth.context';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();
  const { signIn, loading, error, session, clearError, resetPassword } = auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear error on component mount and location change
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [location.pathname, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Adicionar log detalhado do que está sendo enviado
    console.log('Tentando login com:', { email, password: '***' });
    
    try {
      console.log('Antes de chamar signIn');
      await signIn(email, password);
      console.log('Após chamar signIn, verificando session:', session);
    } catch (err) {
      console.error('Erro capturado no componente Login:', err);
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError('Erro ao fazer login');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error, success } = await resetPassword(forgotPasswordEmail);
      
      if (success) {
        setResetStatus({
          success: true,
          message: `Email de recuperação enviado para ${forgotPasswordEmail}. Verifique sua caixa de entrada.`
        });
      } else {
        setResetStatus({
          success: false,
          message: error || 'Erro ao enviar email de recuperação'
        });
      }
    } catch (err) {
      setResetStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Erro ao enviar email de recuperação'
      });
    }
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Brasi<span className="text-blue-600">lit</span></span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Vistorias
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showForgotPassword ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recuperar Senha</h2>
              
              {resetStatus && (
                <div 
                  className={`mb-6 p-4 rounded-md ${
                    resetStatus.success 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {resetStatus.success ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p>{resetStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700">
                    Seu Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="forgotPasswordEmail"
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enviaremos um link para recuperar sua senha.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Voltar para login
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Enviar email
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {location.state?.message && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{location.state.message}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {(error || localError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{localError || error}</p>
                        {(localError || error)?.includes('Email ou senha incorretos') && (
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Esqueceu sua senha?
                          </button>
                        )}
                        {error?.includes('não foi confirmado') && (
                          <p className="mt-2 text-sm">
                            <button
                              type="button"
                              onClick={() => {
                                // Armazenar o email para autopreenchimento
                                setForgotPasswordEmail(email);
                                // Mostrar formulário de recuperação de senha
                                setShowForgotPassword(true);
                              }}
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              Reenviar email de confirmação
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </div>

                {/* Botão de login alternativo diretamente com Supabase */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        console.log('Tentando login direto com Supabase');
                        const { data, error } = await supabase.auth.signInWithPassword({
                          email,
                          password,
                        });
                        
                        console.log('Resposta direta do Supabase:', { data, error });
                        
                        if (error) {
                          setLocalError(error.message);
                        } else {
                          console.log('Login bem-sucedido direto!', data);
                        }
                      } catch (err) {
                        console.error('Erro no login direto:', err);
                        setLocalError('Erro no login direto: ' + (err instanceof Error ? err.message : String(err)));
                      }
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Tentar Login Direto
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Não tem uma conta?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/register"
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Criar Nova Conta
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;