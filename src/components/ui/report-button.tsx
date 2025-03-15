/**
 * Botão para gerar relatórios
 */
import React from 'react';
import { Inspection } from '../../types/inspection';
import { useReportGenerator } from '../../hooks/useReportGenerator';
import { ReportProgress } from './report-progress';

interface ReportButtonProps {
  inspection: Inspection;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Botão para gerar relatórios com feedback visual de progresso
 */
export function ReportButton({
  inspection,
  variant = 'primary',
  size = 'md',
  className = ''
}: ReportButtonProps) {
  const { generateReport, isGenerating, progress, error, reset } = useReportGenerator();

  // Classes base do botão
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Classes de variantes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500'
  };
  
  // Classes de tamanho
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  // Função para lidar com o clique no botão
  const handleClick = async () => {
    await generateReport(inspection);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isGenerating}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Gerando...
          </>
        ) : (
          <>
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Gerar Relatório
          </>
        )}
      </button>

      <ReportProgress
        isGenerating={isGenerating}
        progress={progress}
        error={error}
        onReset={reset}
      />
    </>
  );
} 