import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../lib/auth.context';

const Login: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();
  const { signIn, loading, error, session, clearError, resetPassword } = auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear error on component mount and location change
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [location.pathname, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      await signIn(email, password);
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
          message: `Email de recuperação enviado para ${forgotPasswordEmail}. Verifique sua caixa de entrada.`,
        });
      } else {
        setResetStatus({
          success: false,
          message: error || 'Erro ao enviar email de recuperação',
        });
      }
    } catch (err) {
      setResetStatus({
        success: false,
        message:
          err instanceof Error
            ? err.message
            : 'Erro ao enviar email de recuperação',
      });
    }
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Coluna de apresentação - visível apenas em telas maiores */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="h-10 w-10 text-white" />
            <span className="text-3xl font-bold">
              Brasi<span className="text-blue-300">lit</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold mt-12 leading-tight">
            Sistema de Vistorias Técnicas
          </h1>
          <p className="text-xl mt-6 text-blue-100">
            Gerencie todas as suas vistorias técnicas de coberturas em um só lugar,
            com facilidade e eficiência.
          </p>
        </div>
        
        <div className="bg-blue-700 p-6 rounded-lg mt-12">
          <h3 className="text-xl font-semibold mb-3">Recursos principais</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-blue-300" />
              <span>Cadastro completo de clientes</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-blue-300" />
              <span>Gestão de vistorias técnicas</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-blue-300" />
              <span>Relatórios detalhados</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-blue-300" />
              <span>Acesso em qualquer dispositivo</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Coluna de formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo - visível apenas em telas menores */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">
                Brasi<span className="text-blue-600">lit</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            {showForgotPassword ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recuperar Senha
                </h2>

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
                    <label
                      htmlFor="forgotPasswordEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                        onChange={e => setForgotPasswordEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Acesse sua conta
                </h2>

                {location.state?.message && (
                  <div
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6"
                    role="alert"
                  >
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

                {/* Mostrar erros apenas quando eles existirem */}
                {(error || localError) ? (
                  <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{localError || error}</p>
                        {(localError || error)?.includes(
                          'Email ou senha incorretos'
                        ) && (
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
                                setForgotPasswordEmail(email);
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
                ) : null}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                        onChange={e => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                        onChange={e => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loading
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        'Entrar no Sistema'
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <span className="text-sm text-gray-600 mr-2">
                      Novo por aqui?
                    </span>
                    <Link
                      to="/register"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Criar uma nova conta
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
