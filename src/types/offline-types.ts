/**
 * Tipos para o banco de dados offline
 * Define as interfaces para as tabelas do banco de dados local
 */

/**
 * Interface para a tabela de clientes
 */
export interface Client {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

/**
 * Interface para a tabela de inspeções
 */
export interface Inspection {
  id: string;
  client_id: string;
  status: string;
  inspection_date: string;
  building_type: string;
  construction_year?: number | null;
  roof_area: number;
  last_maintenance?: string | null;
  main_issue?: string | null;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

/**
 * Interface para a tabela de telhas de inspeção
 */
export interface InspectionTile {
  id: string;
  inspection_id: string;
  line: string;
  thickness: string;
  dimensions: string;
  quantity: number;
  area: number;
  synced: boolean;
}

/**
 * Interface para a tabela de não conformidades
 */
export interface Nonconformity {
  id: string;
  inspection_id: string;
  title: string;
  description: string;
  notes?: string | null;
  created_at: string;
  synced: boolean;
}

/**
 * Interface para a tabela de fotos de inspeção
 */
export interface InspectionPhoto {
  id: string;
  inspection_id: string;
  nonconformity_id?: string | null;
  category: string;
  caption: string;
  photo_url: string;
  photo_data?: string; // Base64 da imagem para armazenamento offline
  created_at: string;
  synced: boolean;
}

/**
 * Interface para a tabela de fila de sincronização
 */
export interface SyncQueue {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  table: string;
  record_id: string;
  data: string; // JSON stringificado
  created_at: string;
  attempts: number;
  last_attempt?: string | null;
  error?: string | null;
} 