/**
 * Hook para geração de relatórios usando Web Workers
 * Permite gerar relatórios em segundo plano sem bloquear a interface do usuário
 */
import { useState, useEffect, useCallback } from 'react';
import { Inspection } from '../types/inspection';

interface ReportProgress {
  message: string;
  progress: number;
}

interface UseReportGeneratorReturn {
  generateReport: (inspection: Inspection) => Promise<void>;
  isGenerating: boolean;
  progress: ReportProgress | null;
  error: string | null;
  reset: () => void;
}

/**
 * Hook para geração de relatórios usando Web Workers
 * @returns Funções e estados para controlar a geração de relatórios
 */
export function useReportGenerator(): UseReportGeneratorReturn {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<ReportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o worker
  useEffect(() => {
    // Verificar se Web Workers são suportados
    if (typeof Worker === 'undefined') {
      setError('Seu navegador não suporta Web Workers, necessários para a geração de relatórios.');
      return;
    }

    // Criar o worker
    const reportWorker = new Worker('/workers/template-report-worker.js');

    // Configurar os listeners
    reportWorker.addEventListener('message', (event) => {
      const { type, message, progress, blob, fileName } = event.data;

      switch (type) {
        case 'ready':
          console.log('Worker de relatórios pronto para uso');
          break;

        case 'progress':
          setProgress({ message, progress });
          break;

        case 'complete': {
          setIsGenerating(false);
          setProgress({ message: 'Relatório gerado com sucesso!', progress: 100 });
          
          // Salvar o arquivo
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
        }

        case 'error':
          setIsGenerating(false);
          setError(message);
          break;

        default:
          console.warn(`Tipo de mensagem desconhecido: ${type}`);
      }
    });

    reportWorker.addEventListener('error', (event) => {
      setIsGenerating(false);
      setError(`Erro no worker: ${event.message}`);
    });

    setWorker(reportWorker);

    // Limpar o worker quando o componente for desmontado
    return () => {
      reportWorker.terminate();
    };
  }, []);

  /**
   * Gera um relatório a partir dos dados da inspeção
   * @param inspection Dados da inspeção
   */
  const generateReport = useCallback(async (inspection: Inspection): Promise<void> => {
    if (!worker) {
      setError('Worker de relatórios não está disponível.');
      return;
    }

    try {
      setIsGenerating(true);
      setProgress({ message: 'Iniciando geração do relatório...', progress: 0 });
      setError(null);

      // Enviar os dados para o worker
      worker.postMessage({
        type: 'generate',
        data: inspection
      });
    } catch (err) {
      setIsGenerating(false);
      setError(`Erro ao iniciar a geração do relatório: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [worker]);

  /**
   * Reseta o estado do gerador de relatórios
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    generateReport,
    isGenerating,
    progress,
    error,
    reset
  };
} 