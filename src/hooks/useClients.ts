import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'];
type InsertClient = Database['public']['Tables']['clients']['Insert'];
type UpdateClient = Database['public']['Tables']['clients']['Update'];

export function useClients() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteClient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir cliente';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar clientes';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar cliente';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (client: InsertClient) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar cliente';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: UpdateClient) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchClients = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%, address.ilike.%${query}%`)
        .order('name');
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar clientes';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients
  };
}