/**
 * Hook para gerenciar o perfil do usuário
 * Fornece acesso aos dados do usuário logado e funções para atualização
 */
import { useState, useEffect } from 'react';

/**
 * Interface para o perfil do usuário
 */
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hook para acessar e gerenciar o perfil do usuário
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar perfil do usuário do localStorage ou API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Verificar se há um token de autenticação
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setProfile(null);
          return;
        }
        
        // Tentar carregar do localStorage primeiro (para modo offline)
        const storedProfile = localStorage.getItem('user_profile');
        
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          // Em um cenário real, aqui faria uma chamada à API
          // para obter os dados mais recentes do usuário
          
          // Simulação de chamada à API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Perfil simulado
          const mockProfile: UserProfile = {
            id: '1',
            full_name: 'Técnico Demonstração',
            email: 'tecnico@exemplo.com',
            role: 'technician'
          };
          
          setProfile(mockProfile);
          
          // Salvar no localStorage para uso offline
          localStorage.setItem('user_profile', JSON.stringify(mockProfile));
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  /**
   * Atualiza o perfil do usuário
   */
  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      // Em um cenário real, aqui faria uma chamada à API
      // para atualizar os dados do usuário
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar o perfil local
      const updatedProfile = { ...profile, ...updatedData, updated_at: new Date().toISOString() };
      setProfile(updatedProfile as UserProfile);
      
      // Atualizar no localStorage
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err instanceof Error ? err : new Error('Erro ao atualizar perfil'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    setProfile(null);
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    logout
  };
}
