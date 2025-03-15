/**
 * Tipos de dados para a inspeção
 */

export interface Client {
  id?: string;
  name: string;
  project?: string;
  city?: string;
  state?: string;
  address?: string;
  protocol?: string;
  subject?: string;
}

export interface TeamInfo {
  technician?: string;
  department?: string;
  unit?: string;
  coordinator?: string;
  manager?: string;
  region?: string;
}

export interface RoofTile {
  id: string;
  type: string;
  area: number;
  quantity: number;
}

export interface NonConformity {
  id: number;
  title: string;
  description: string;
  selected: boolean;
  notes?: string;
  photos?: string[];
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  category: string;
}

export interface Inspection {
  id?: string;
  date: string;
  client: Client;
  teamInfo?: TeamInfo;
  roofTiles: RoofTile[];
  nonConformities: NonConformity[];
  photos: Photo[];
  comments?: string;
} 