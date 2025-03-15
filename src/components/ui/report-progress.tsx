/**
 * Componente para exibir o progresso da geração de relatórios
 */
import React from 'react';

interface ReportProgressProps {
  isGenerating: boolean;
  progress: {
    message: string;
    progress: number;
  } | null;
  error: string | null;
  onReset: () => void;
}

/**
 * Componente que exibe o progresso da geração de relatórios
 * Mostra uma barra de progresso, mensagens de status e erros
 */
export function ReportProgress({
  isGenerating,
  progress,
  error,
  onReset
}: ReportProgressProps) {
  if (!isGenerating && !progress && !error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">
          {isGenerating ? 'Gerando relatório...' : error ? 'Erro' : 'Relatório gerado'}
        </h3>
        <button
          onClick={onReset}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Fechar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {progress && (
        <>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            {progress.message}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-500 dark:text-gray-400">
            {progress.progress}%
          </p>
        </>
      )}

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 mt-2">
          {error}
        </div>
      )}
    </div>
  );
} 