/**
 * Serviço responsável pela geração de relatórios em formato DOCX
 * baseado em templates e nos dados coletados durante a inspeção.
 * Utiliza Docxtemplater e PizZip para melhor desempenho.
 */
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos de dados para a inspeção
interface Client {
  id?: string;
  name: string;
  project?: string;
  city?: string;
  state?: string;
  address?: string;
  protocol?: string;
  subject?: string;
}

interface TeamInfo {
  technician?: string;
  department?: string;
  unit?: string;
  coordinator?: string;
  manager?: string;
  region?: string;
}

interface RoofTile {
  id: string;
  type: string;
  area: number;
  quantity: number;
}

interface NonConformity {
  id: number;
  title: string;
  description: string;
  selected: boolean;
  notes?: string;
  photos?: string[];
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
  category: string;
}

interface Inspection {
  id?: string;
  date: string;
  client: Client;
  teamInfo?: TeamInfo;
  roofTiles: RoofTile[];
  nonConformities: NonConformity[];
  photos: Photo[];
  comments?: string;
}

/**
 * Classe responsável pela geração de relatórios em formato DOCX
 * usando templates e Docxtemplater para melhor desempenho.
 */
export class TemplateReportGenerator {
  private static templateUrl = '/templates/report-template.docx';

  /**
   * Carrega o template do relatório
   * @returns Promise com o ArrayBuffer do template
   */
  private static async loadTemplate(): Promise<ArrayBuffer> {
    console.time('loadTemplate');
    try {
      const response = await fetch(this.templateUrl);
      if (!response.ok) {
        throw new Error(`Falha ao carregar template: ${response.status} ${response.statusText}`);
      }
      const templateBuffer = await response.arrayBuffer();
      console.timeEnd('loadTemplate');
      return templateBuffer;
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      throw error;
    }
  }

  /**
   * Prepara os dados para o template
   * @param inspection Dados da inspeção
   * @returns Objeto com dados formatados para o template
   */
  private static prepareTemplateData(inspection: Inspection): Record<string, unknown> {
    console.time('prepareData');
    
    // Calcular área total das telhas
    const totalArea = inspection.roofTiles.reduce(
      (sum, tile) => sum + tile.area * tile.quantity, 
      0
    );
    
    // Formatar data da inspeção
    const formattedDate = format(
      new Date(inspection.date), 
      "dd 'de' MMMM 'de' yyyy", 
      { locale: ptBR }
    );
    
    // Preparar dados das não conformidades
    const selectedNonConformities = inspection.nonConformities
      .filter(nc => nc.selected)
      .map(nc => ({
        title: nc.title,
        description: nc.description,
        notes: nc.notes || '',
        hasNotes: !!nc.notes
      }));
    
    // Preparar dados das fotos
    const categorizedPhotos = {
      overview: inspection.photos.filter(p => p.category === 'overview'),
      nonconformity: inspection.photos.filter(p => p.category === 'nonconformity'),
      other: inspection.photos.filter(p => !['overview', 'nonconformity'].includes(p.category))
    };
    
    // Dados para o template
    const templateData = {
      // Informações básicas
      reportId: inspection.id || `INS-${Date.now()}`,
      reportDate: formattedDate,
      currentDate: format(new Date(), "dd/MM/yyyy", { locale: ptBR }),
      
      // Cliente
      clientName: inspection.client.name,
      clientProject: inspection.client.project || '',
      clientAddress: inspection.client.address || '',
      clientCity: inspection.client.city || '',
      clientState: inspection.client.state || '',
      clientProtocol: inspection.client.protocol || '',
      clientSubject: inspection.client.subject || '',
      
      // Equipe
      technicianName: inspection.teamInfo?.technician || '',
      department: inspection.teamInfo?.department || '',
      unit: inspection.teamInfo?.unit || '',
      coordinator: inspection.teamInfo?.coordinator || '',
      manager: inspection.teamInfo?.manager || '',
      region: inspection.teamInfo?.region || '',
      
      // Telhas
      roofTiles: inspection.roofTiles.map(tile => ({
        type: tile.type,
        quantity: tile.quantity,
        area: tile.area,
        totalArea: (tile.area * tile.quantity).toFixed(2)
      })),
      totalRoofArea: totalArea.toFixed(2),
      
      // Não conformidades
      hasNonConformities: selectedNonConformities.length > 0,
      nonConformities: selectedNonConformities,
      nonConformityCount: selectedNonConformities.length,
      
      // Fotos
      hasPhotos: inspection.photos.length > 0,
      photoCount: inspection.photos.length,
      overviewPhotos: categorizedPhotos.overview,
      nonconformityPhotos: categorizedPhotos.nonconformity,
      otherPhotos: categorizedPhotos.other,
      
      // Comentários
      hasComments: !!inspection.comments,
      comments: inspection.comments || ''
    };
    
    console.timeEnd('prepareData');
    return templateData;
  }

  /**
   * Gera um documento DOCX a partir dos dados de inspeção
   * @param inspection - Dados completos da inspeção
   * @returns Promise com o Blob do documento gerado
   */
  public static async generateReport(inspection: Inspection): Promise<Blob> {
    try {
      console.time('generateReport');
      
      // 1. Carregar o template
      const templateBuffer = await this.loadTemplate();
      
      // 2. Criar um objeto PizZip a partir do template
      const zip = new PizZip(templateBuffer);
      
      // 3. Criar um objeto Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      
      // 4. Preparar os dados para o template
      const data = this.prepareTemplateData(inspection);
      
      // 5. Definir os dados no template
      doc.setData(data);
      
      // 6. Renderizar o documento
      console.time('render');
      doc.render();
      console.timeEnd('render');
      
      // 7. Gerar o documento final
      console.time('generateOutput');
      const output = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE'
      });
      console.timeEnd('generateOutput');
      
      console.timeEnd('generateReport');
      return output;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }
  
  /**
   * Salva o documento gerado no dispositivo do usuário
   * @param inspection - Dados da inspeção
   */
  public static async saveReport(inspection: Inspection): Promise<void> {
    const blob = await this.generateReport(inspection);
    const fileName = this.generateFileName(inspection);
    saveAs(blob, fileName);
  }

  /**
   * Gera o nome do arquivo seguindo o padrão especificado
   * @param inspection - Dados da inspeção
   * @returns Nome do arquivo formatado
   */
  private static generateFileName(inspection: Inspection): string {
    const date = format(new Date(inspection.date), 'yyyy-MM-dd', { locale: ptBR });
    const clientName = inspection.client.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    return `Relatorio_${clientName}_${date}.docx`;
  }
} 