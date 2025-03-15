/**
 * Web Worker para geração de relatórios usando Docxtemplater
 * Este worker processa a geração de relatórios em segundo plano,
 * evitando o bloqueio da interface do usuário durante operações pesadas.
 */

// Importar as bibliotecas necessárias
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/pizzip/3.1.4/pizzip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.37.11/docxtemplater.min.js'
);

// Função para formatar datas
const formatDate = (dateString, formatStr) => {
  const date = new Date(dateString);
  // Implementação simplificada de formatação de data
  return date.toLocaleDateString('pt-BR');
};

// Função para preparar os dados para o template
function prepareTemplateData(inspection) {
  // Calcular área total das telhas
  const totalArea = inspection.roofTiles.reduce(
    (sum, tile) => sum + tile.area * tile.quantity, 
    0
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
  return {
    // Informações básicas
    reportId: inspection.id || `INS-${Date.now()}`,
    reportDate: formatDate(inspection.date, 'long'),
    currentDate: formatDate(new Date(), 'short'),
    
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
}

// Função para gerar o nome do arquivo
function generateFileName(inspection) {
  const date = formatDate(inspection.date, 'iso');
  const clientName = inspection.client.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
  return `Relatorio_${clientName}_${date}.docx`;
}

// Função principal para gerar relatório
async function generateReport(inspection) {
  try {
    self.postMessage({ 
      type: 'progress', 
      message: 'Carregando template...', 
      progress: 10 
    });
    
    // 1. Carregar o template
    const response = await fetch('/templates/report-template.docx');
    if (!response.ok) {
      throw new Error(`Falha ao carregar template: ${response.status} ${response.statusText}`);
    }
    
    const templateArrayBuffer = await response.arrayBuffer();
    
    self.postMessage({ 
      type: 'progress', 
      message: 'Preparando dados...', 
      progress: 30 
    });
    
    // 2. Criar um objeto PizZip a partir do template
    const zip = new PizZip(templateArrayBuffer);
    
    // 3. Criar um objeto Docxtemplater
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    
    // 4. Preparar e definir os dados no template
    const data = prepareTemplateData(inspection);
    doc.setData(data);
    
    self.postMessage({ 
      type: 'progress', 
      message: 'Gerando documento...', 
      progress: 60 
    });
    
    // 5. Renderizar o documento
    doc.render();
    
    // 6. Gerar o documento final
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      compression: 'DEFLATE'
    });
    
    self.postMessage({ 
      type: 'progress', 
      message: 'Documento gerado com sucesso!', 
      progress: 100 
    });
    
    // 7. Retornar o blob do documento
    self.postMessage({ 
      type: 'complete', 
      blob: output,
      fileName: generateFileName(inspection)
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    self.postMessage({ 
      type: 'error', 
      message: `Erro ao gerar relatório: ${error.message}` 
    });
  }
}

// Listener para mensagens do thread principal
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'generate': {
      generateReport(data);
      break;
    }
    
    default: {
      console.warn(`Tipo de mensagem desconhecido: ${type}`);
    }
  }
});

// Notificar que o worker está pronto
self.postMessage({ type: 'ready' }); 