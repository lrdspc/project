import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, AlertTriangle } from 'lucide-react';

const EmailConfirmation: React.FC = () => {
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
          Verifique seu Email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              Confirme seu email
            </h3>
            <div className="mt-4 text-sm text-gray-500">
              <p>Enviamos um link de confirmação para o seu email.</p>
              <p className="mt-2">
                Por favor, verifique sua caixa de entrada e clique no link para
                ativar sua conta.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Modo Desenvolvimento
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Em ambientes de desenvolvimento, os emails podem não ser
                        enviados automaticamente.
                      </p>
                      <p className="mt-2">
                        Você pode testar a confirmação de email visitando
                        manualmente:
                      </p>
                      <p className="mt-1">{`${window.location.origin}/auth/callback?type=signup`}</p>
                      <p className="mt-2">
                        OU configurar um serviço SMTP no painel do Supabase em:
                      </p>
                      <p className="mt-1">
                        Authentication &gt; Email Templates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-6">
              <p className="text-sm">
                Não recebeu o email? Verifique sua pasta de spam ou
              </p>
              <Link
                to="/login"
                className="mt-2 flex justify-center items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Voltar para Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
