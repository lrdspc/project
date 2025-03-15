/**
 * Utilitário para combinar nomes de classes, adaptado do clsx/tailwind-merge
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina múltiplas classes em uma única string, otimizadas para Tailwind CSS
 * @param inputs Classes a serem combinadas
 * @returns String de classes combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extrai o primeiro nome de um nome completo
 * @param fullName Nome completo
 * @returns Primeiro nome
 */
export function getFirstName(fullName?: string): string {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

/**
 * Formata um número para exibição de dinheiro em BRL
 * @param value Valor a ser formatado
 * @returns String formatada
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Trunca um texto se ele for maior que o tamanho máximo
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo (padrão: 50)
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Gera um ID único baseado em timestamp e número aleatório
 * Útil para IDs temporários antes de salvar no servidor
 * @returns String de ID único
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Verifica se o dispositivo está online
 * @returns Boolean indicando status online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Retorna o status de conexão atual e adiciona listeners de eventos
 * @param onStatusChange Callback executado quando o status de conexão muda
 */
export function monitorConnectionStatus(
  onStatusChange: (isOnline: boolean) => void
): () => void {
  const handleOnline = () => onStatusChange(true);
  const handleOffline = () => onStatusChange(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Retorna função para remover os listeners
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Arredonda um número para o número especificado de casas decimais
 * @param value Valor a ser arredondado
 * @param decimals Número de casas decimais
 * @returns Número arredondado
 */
export function roundNumber(value: number, decimals: number = 2): number {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * Normaliza uma string removendo acentos, convertendo para minúsculo
 * e removendo caracteres especiais. Útil para busca.
 * @param text Texto a ser normalizado
 * @returns Texto normalizado
 */
export function normalizeString(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/gi, "");
} 