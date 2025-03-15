import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Loader, CheckCircle, XCircle } from 'lucide-react';

const VerifyToken: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verificando...');

  useEffect(() => {
    async function verifyToken() {
      try {
        // Extrair token e tipo da URL
        const params = new URLSearchParams(location.hash.substring(1));
        const accessToken = params.get('access_token');
        const tokenType = params.get('type');

        if (!accessToken) {
          setStatus('error');
          setMessage(
            'Token não encontrado na URL. Verifique se você usou o link correto.'
          );
          return;
        }

        // Verificar o tipo de token
        if (tokenType === 'recovery') {
          // Redirecionamento para redefinição de senha
          navigate('/redefinir-senha', { replace: true });
          return;
        }

        // Qualquer outro tipo (email verification, etc.)
        setStatus('success');
        setMessage('Verificação concluída com sucesso!');

        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login', {
            replace: true,
            state: {
              message:
                'Conta verificada com sucesso. Agora você pode fazer login.',
            },
          });
        }, 2000);
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setStatus('error');
        setMessage(
          `Ocorreu um erro ao processar sua solicitação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        );
      }
    }

    verifyToken();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">
              Brasi<span className="text-blue-600">lit</span>
            </span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verificação
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              {status === 'loading' && (
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              {status === 'loading'
                ? 'Processando'
                : status === 'success'
                  ? 'Sucesso'
                  : 'Erro'}
            </h3>
            <div className="mt-4 text-sm text-gray-500">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyToken;
