/**
 * Exemplo de uso do MCP Supabase
 * 
 * Este arquivo demonstra como utilizar a classe MCPSupabase
 * para interagir com o banco de dados Supabase.
 */

import { MCPSupabase } from './mcp-supabase';
import type { Database } from './database.types';

/**
 * Exemplo de como buscar registros de uma tabela
 * 
 * @param limit - Número máximo de registros a serem retornados
 * @returns Registros encontrados
 */
export async function getExampleClients(limit = 10) {
  try {
    const response = await MCPSupabase.fetchRecords(
      'clients',
      {
        limit,
        orderBy: {
          column: 'created_at',
          ascending: false
        }
      },
      {
        // Filtros opcionais
        type: 'corporate'
      }
    );

    if (response.error) {
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
}

/**
 * Exemplo de como inserir um novo registro
 * 
 * @param data - Dados do cliente a serem inseridos
 * @returns Cliente inserido
 */
export async function createClient(
  data: Database['public']['Tables']['clients']['Insert']
) {
  try {
    const response = await MCPSupabase.insertRecord(
      'clients',
      data
    );

    if (response.error) {
      throw response.error;
    }

    return response.data?.[0];
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

/**
 * Exemplo de como atualizar um registro existente
 * 
 * @param id - ID do cliente a ser atualizado
 * @param data - Dados do cliente a serem atualizados
 * @returns Cliente atualizado
 */
export async function updateClient(
  id: string,
  data: Partial<Database['public']['Tables']['clients']['Update']>
) {
  try {
    const response = await MCPSupabase.updateRecord(
      'clients',
      id,
      data
    );

    if (response.error) {
      throw response.error;
    }

    return response.data?.[0];
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
}

/**
 * Exemplo de como excluir um registro
 * 
 * @param id - ID do cliente a ser excluído
 * @returns Verdadeiro se a exclusão for bem-sucedida
 */
export async function deleteClient(id: string) {
  try {
    const response = await MCPSupabase.deleteRecord(
      'clients',
      id
    );

    if (response.error) {
      throw response.error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
}

/**
 * Exemplo de como assinar mudanças em tempo real em uma tabela
 * 
 * @param callback - Função a ser chamada quando houver mudanças
 * @returns Função para cancelar a assinatura
 */
export function subscribeToClientsChanges(
  callback: (payload: any) => void
) {
  return MCPSupabase.subscribeToTable(
    'clients',
    callback,
    ['INSERT', 'UPDATE'] // Opcional: especifique apenas os eventos desejados
  );
} 