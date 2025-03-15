/**
 * Web Worker para geração de relatórios
 * Este worker processa a geração de relatórios em segundo plano,
 * evitando o bloqueio da interface do usuário durante operações pesadas.
 */

// Importações necessárias para o worker
importScripts('/workers/docx.min.js'); // Carrega a biblioteca docx do diretório public/workers

// Referências para as classes do docx.js
const { Document, Paragraph, TextRun, Table, TableRow, TableCell, 
  BorderStyle, AlignmentType, HeadingLevel, Header, Footer, 
  Packer, ImageRun, TableOfContents } = docx;

// Função para formatar datas
const formatDate = (dateString, format) => {
  const date = new Date(dateString);
  // Implementação simplificada de formatação de data
  return date.toLocaleDateString('pt-BR');
};

// Função principal para gerar relatório
async function generateReport(inspection) {
  try {
    console.time('workerGenerateReport');
    
    // Notificar início do processamento
    self.postMessage({ type: 'progress', message: 'Iniciando geração do relatório...', progress: 10 });
    
    // Criar documento
    const doc = createDocument(inspection);
    
    self.postMessage({ type: 'progress', message: 'Documento criado, empacotando...', progress: 50 });
    
    // Empacotar documento
    const blob = await Packer.toBlob(doc);
    
    self.postMessage({ type: 'progress', message: 'Relatório gerado com sucesso!', progress: 100 });
    console.timeEnd('workerGenerateReport');
    
    // Retornar o blob do documento
    self.postMessage({ 
      type: 'complete', 
      blob: blob,
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

// Função para criar o documento
function createDocument(inspection) {
  // Implementação da criação do documento
  // Esta é uma versão simplificada, a implementação completa deve ser adaptada
  // do arquivo report-generator.ts
  
  return new Document({
    creator: inspection.teamInfo?.technician || "Técnico Brasilit",
    title: `Relatório de Inspeção - ${inspection.client.name}`,
    description: "Relatório de inspeção técnica Brasilit",
    sections: [
      {
        children: [
          new Paragraph({
            text: "RELATÓRIO DE INSPEÇÃO TÉCNICA",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
          }),
          // Adicione mais elementos conforme necessário
        ]
      }
    ]
  });
}

// Função para gerar nome do arquivo
function generateFileName(inspection) {
  const date = formatDate(inspection.date, 'yyyy-MM-dd');
  const clientName = inspection.client.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
  return `Relatorio_${clientName}_${date}.docx`;
}

// Listener para mensagens do thread principal
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'generate':
      generateReport(data);
      break;
      
    default:
      console.warn(`Tipo de mensagem desconhecido: ${type}`);
  }
});

// Notificar que o worker está pronto
self.postMessage({ type: 'ready' }); 