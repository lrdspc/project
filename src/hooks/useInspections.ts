import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Inspection = Database['public']['Tables']['inspections']['Row'];
type InsertInspection = Database['public']['Tables']['inspections']['Insert'];
type UpdateInspection = Database['public']['Tables']['inspections']['Update'];

export function useInspections() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          clients (
            id,
            name,
            address,
            city,
            state
          )
        `)
        .order('inspection_date', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar vistorias';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getInspectionById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          clients (
            id,
            name,
            address,
            city,
            state,
            contact_name,
            contact_phone,
            contact_email
          ),
          inspection_tiles (
            id,
            line,
            thickness,
            dimensions,
            quantity,
            area
          ),
          nonconformities (
            id,
            title,
            description,
            notes,
            inspection_photos (
              id,
              category,
              caption,
              photo_url
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar vistoria';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInspection = useCallback(async (inspection: InsertInspection) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inspections')
        .insert([inspection])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar vistoria';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInspection = useCallback(async (id: string, updates: UpdateInspection) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar vistoria';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInspectionsByClientId = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('client_id', clientId)
        .order('inspection_date', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar vistorias do cliente';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getInspections,
    getInspectionById,
    createInspection,
    updateInspection,
    getInspectionsByClientId
  };
}