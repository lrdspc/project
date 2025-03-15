/**
 * MCP Supabase Configuration
 * 
 * Este arquivo configura a integração do MCP com o Supabase.
 * Ele fornece funções utilitárias para interagir com o Supabase de forma
 * mais eficiente, seguindo padrões do MCP.
 */

import { supabase } from './supabase';
import type { Database } from './database.types';

/**
 * Interface para opções de consulta genéricas
 */
interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
}

/**
 * Classe utilitária para operações do MCP Supabase
 */
export class MCPSupabase {
  /**
   * Busca registros de uma tabela com opções de filtragem
   * 
   * @param table - Nome da tabela no Supabase
   * @param options - Opções de consulta (limite, offset, ordenação)
   * @param filters - Objeto contendo filtros no formato {coluna: valor}
   * @returns Promessa com os registros encontrados
   */
  static async fetchRecords<
    T extends keyof Database['public']['Tables']
  >(
    table: T,
    options: QueryOptions = {},
    filters: Record<string, any> = {}
  ) {
    let query = supabase
      .from(table)
      .select('*');

    // Aplicar filtros
    Object.entries(filters).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    // Aplicar opções de consulta
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    if (options.orderBy) {
      query = query.order(
        options.orderBy.column,
        { ascending: options.orderBy.ascending ?? true }
      );
    }

    return query;
  }

  /**
   * Insere um novo registro em uma tabela
   * 
   * @param table - Nome da tabela no Supabase
   * @param data - Dados a serem inseridos
   * @returns Promessa com o resultado da inserção
   */
  static async insertRecord<
    T extends keyof Database['public']['Tables']
  >(
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ) {
    return supabase
      .from(table)
      .insert(data)
      .select();
  }

  /**
   * Atualiza um registro existente em uma tabela
   * 
   * @param table - Nome da tabela no Supabase
   * @param id - ID do registro a ser atualizado
   * @param data - Dados a serem atualizados
   * @returns Promessa com o resultado da atualização
   */
  static async updateRecord<
    T extends keyof Database['public']['Tables']
  >(
    table: T,
    id: string | number,
    data: Partial<Database['public']['Tables'][T]['Update']>
  ) {
    return supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
  }

  /**
   * Remove um registro de uma tabela
   * 
   * @param table - Nome da tabela no Supabase
   * @param id - ID do registro a ser removido
   * @returns Promessa com o resultado da remoção
   */
  static async deleteRecord<
    T extends keyof Database['public']['Tables']
  >(
    table: T,
    id: string | number
  ) {
    return supabase
      .from(table)
      .delete()
      .eq('id', id);
  }

  /**
   * Configura uma assinatura em tempo real para mudanças em uma tabela
   * 
   * @param table - Nome da tabela no Supabase
   * @param callback - Função a ser chamada quando houver mudanças
   * @param eventTypes - Tipos de eventos a serem observados
   * @returns Função para cancelar a assinatura
   */
  static subscribeToTable<
    T extends keyof Database['public']['Tables']
  >(
    table: T,
    callback: (payload: any) => void,
    eventTypes: ('INSERT' | 'UPDATE' | 'DELETE')[] = ['INSERT', 'UPDATE', 'DELETE']
  ) {
    const subscription = supabase
      .channel(`table-changes-${table}`)
      .on(
        'postgres_changes',
        { 
          event: eventTypes,
          schema: 'public',
          table
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
} 