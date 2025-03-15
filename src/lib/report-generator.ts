/**
 * Serviço responsável pela geração de relatórios em formato DOCX
 * baseado nos dados coletados durante a inspeção.
 */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Header,
  Footer,
  Packer,
  ImageRun,
  TableOfContents
} from 'docx';

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

// Constantes para substituir as importações do assets.ts
const BRASILIT_LOGO_BASE64 = ""; // Placeholder - será substituído por uma URL de imagem real
const COMPANY_CONTACT_INFO = {
  name: "Brasilit - Saint-Gobain",
  address: "Av. Santa Marina, 482",
  city: "São Paulo - SP",
  phone: "(11) 2246-7000",
  website: "www.brasilit.com.br",
  email: "contato@brasilit.com.br"
};

/**
 * Classe responsável pela geração de relatórios em formato DOCX
 * Implementa todas as funcionalidades necessárias para criar relatórios
 * formatados conforme as especificações da BRASILIT.
 */
export class ReportGenerator {
  /**
   * Gera um documento DOCX a partir dos dados de inspeção
   * @param inspection - Dados completos da inspeção
   * @returns Promise com o Blob do documento gerado
   */
  public static async generateReport(inspection: Inspection): Promise<Blob> {
    console.time('createDocument');
    
    // Obter seções de não conformidades de forma assíncrona
    const nonConformitiesSections = await this.createNonConformitiesSection(inspection);
    
    const doc = new Document({
      creator: inspection.teamInfo?.technician || "Técnico Brasilit",
      title: `Relatório de Inspeção - ${inspection.client.name}`,
      description: "Relatório de inspeção técnica Brasilit",
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Times New Roman",
              size: 24, // 12pt
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 line spacing
              },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Times New Roman",
              size: 28,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: {
                after: 120,
              },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Times New Roman",
              size: 24,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
          {
            id: "TableHeader",
            name: "Table Header",
            basedOn: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              color: "FFFFFF",
              size: 22,
              font: "Times New Roman",
            },
          },
          {
            id: "TOC",
            name: "TOC",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Times New Roman",
              size: 24,
            },
          },
          {
            id: "TOCHeading",
            name: "TOC Heading",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Times New Roman",
              size: 28,
              bold: true,
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch (1440 twips) - espaço para o cabeçalho
                right: 1440, // 1 inch
                bottom: 1440, // 1 inch - espaço para o rodapé
                left: 1440, // 1 inch
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new ImageRun({
                      data: this.getLogoData(),
                      transformation: {
                        width: 150,
                        height: 60,
                      },
                      type: "png",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Relatório de Inspeção - ${format(new Date(inspection.date), 'dd/MM/yyyy', { locale: ptBR })}`,
                      font: "Times New Roman",
                      size: 20, // 10pt
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: COMPANY_CONTACT_INFO.name,
                      font: "Times New Roman",
                      size: 16, // 8pt
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${COMPANY_CONTACT_INFO.address}, ${COMPANY_CONTACT_INFO.city} | Tel: ${COMPANY_CONTACT_INFO.phone}`,
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${COMPANY_CONTACT_INFO.website} | ${COMPANY_CONTACT_INFO.email}`,
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: "Página ",
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                    // Campo automático de número de página
                    new TextRun({
                      children: ["PAGE"],
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                    new TextRun({
                      text: " de ",
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                    // Campo automático de total de páginas
                    new TextRun({
                      children: ["NUMPAGES"],
                      font: "Times New Roman",
                      size: 16, // 8pt
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // Título do relatório
            new Paragraph({
              text: `RELATÓRIO DE INSPEÇÃO TÉCNICA`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),
            
            // Tabela de conteúdo
            new Paragraph({
              text: "ÍNDICE",
              heading: HeadingLevel.HEADING_1,
              style: "TOCHeading",
              alignment: AlignmentType.CENTER,
            }),
            new TableOfContents("Sumário", {
              hyperlink: true,
              headingStyleRange: "1-3",
            }),
            
            // Quebra de página após o índice
            new Paragraph({
              pageBreakBefore: true,
            }),
            
            // Informações do cliente
            new Paragraph({
              text: "1. INFORMAÇÕES DO CLIENTE",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
            }),
            this.createClientInfoTable(inspection),
            
            // Equipe técnica
            new Paragraph({
              text: "2. EQUIPE TÉCNICA",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
            }),
            this.createTeamInfoTable(inspection),
            
            // Informações da cobertura
            new Paragraph({
              text: "3. INFORMAÇÕES DA COBERTURA",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
            }),
            this.createRoofTilesTable(inspection),
            
            // Não conformidades
            new Paragraph({
              text: "4. NÃO CONFORMIDADES IDENTIFICADAS",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
            }),
            ...nonConformitiesSections,
            
            // Comentários adicionais
            new Paragraph({
              text: "5. COMENTÁRIOS ADICIONAIS",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              text: inspection.comments || "Nenhum comentário adicional.",
              alignment: AlignmentType.LEFT,
            }),
          ],
        },
      ],
    });

    console.timeEnd('createDocument');
    console.time('packDocument');
    const blob = await Packer.toBlob(doc);
    console.timeEnd('packDocument');
    return blob;
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

  /**
   * Cria a tabela de informações do cliente
   * @param inspection - Dados da inspeção
   * @returns Tabela formatada
   */
  private static createClientInfoTable(inspection: Inspection): Table {
    const { client } = inspection;
    
    return new Table({
      width: {
        size: 100,
        type: "pct",
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph("Data da Vistoria")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              width: {
                size: 70,
                type: "pct",
              },
              children: [new Paragraph(inspection.date)],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Cliente")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(client.name)],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Empreendimento")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(client.project || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Cidade/Estado")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(`${client.city || ""} / ${client.state || ""}`)],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Endereço")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(client.address || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Protocolo")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(client.protocol || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Assunto")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(client.subject || "Vistoria Técnica")],
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Cria a tabela de informações da equipe
   * @param inspection - Dados da inspeção
   * @returns Tabela formatada
   */
  private static createTeamInfoTable(inspection: Inspection): Table {
    const { teamInfo } = inspection;
    
    if (!teamInfo) {
      return new Table({
        width: {
          size: 100,
          type: "pct",
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Informações não disponíveis")],
              }),
            ],
          }),
        ],
      });
    }
    
    return new Table({
      width: {
        size: 100,
        type: "pct",
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 30,
                type: "pct",
              },
              children: [new Paragraph("Técnico")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              width: {
                size: 70,
                type: "pct",
              },
              children: [new Paragraph(teamInfo.technician || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Departamento")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(teamInfo.department || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Unidade")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(teamInfo.unit || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Coordenador")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(teamInfo.coordinator || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Gerente")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(teamInfo.manager || "")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Regional")],
              shading: {
                fill: "CCCCCC",
              },
            }),
            new TableCell({
              children: [new Paragraph(teamInfo.region || "")],
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Cria a tabela de informações das telhas
   * @param inspection - Dados da inspeção
   * @returns Tabela formatada
   */
  private static createRoofTilesTable(inspection: Inspection): Table {
    const { roofTiles } = inspection;
    
    const rows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            children: [new Paragraph({
              text: "Tipo de Telha",
              style: "TableHeader",
            })],
            shading: {
              fill: "2F5496",
            },
          }),
          new TableCell({
            children: [new Paragraph({
              text: "Quantidade",
              style: "TableHeader",
            })],
            shading: {
              fill: "2F5496",
            },
          }),
          new TableCell({
            children: [new Paragraph({
              text: "Área (m²)",
              style: "TableHeader",
            })],
            shading: {
              fill: "2F5496",
            },
          }),
          new TableCell({
            children: [new Paragraph({
              text: "Área Total (m²)",
              style: "TableHeader",
            })],
            shading: {
              fill: "2F5496",
            },
          }),
        ],
      }),
    ];
    
    let totalArea = 0;
    
    roofTiles.forEach(tile => {
      const tileArea = tile.area * tile.quantity;
      totalArea += tileArea;
      
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(tile.type)],
            }),
            new TableCell({
              children: [new Paragraph(tile.quantity.toString())],
            }),
            new TableCell({
              children: [new Paragraph(tile.area.toString())],
            }),
            new TableCell({
              children: [new Paragraph(tileArea.toFixed(2))],
            }),
          ],
        })
      );
    });
    
    // Adicionar linha de total
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [
                new TextRun({
                  text: "TOTAL",
                  bold: true
                })
              ]
            })],
            columnSpan: 3,
            shading: {
              fill: "DDDDDD",
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [
                new TextRun({
                  text: totalArea.toFixed(2),
                  bold: true
                })
              ]
            })],
            shading: {
              fill: "DDDDDD",
            },
          }),
        ],
      })
    );
    
    return new Table({
      width: {
        size: 100,
        type: "pct",
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      },
      rows,
    });
  }

  /**
   * Cria a seção de não conformidades
   * @param inspection - Dados da inspeção
   * @returns Array de parágrafos
   */
  private static async createNonConformitiesSection(inspection: Inspection): Promise<Paragraph[]> {
    const { nonConformities, photos } = inspection;
    const selectedNonConformities = nonConformities.filter(nc => nc.selected);
    
    if (selectedNonConformities.length === 0) {
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: "Nenhuma não conformidade foi identificada durante a inspeção.",
              italics: true,
            }),
          ],
        }),
      ];
    }
    
    const paragraphs: Paragraph[] = [];
    
    for (const [index, nc] of selectedNonConformities.entries()) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `4.${index + 1}. ${nc.title}`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: {
            before: 200,
            after: 80,
          },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: nc.description,
            }),
          ],
          spacing: {
            after: 120,
          },
        })
      );
      
      if (nc.notes) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Observações: ",
                bold: true,
              }),
              new TextRun({
                text: nc.notes,
              }),
            ],
            spacing: {
              before: 80,
              after: 120,
            },
          })
        );
      }
      
      // Adicionar fotos relacionadas a esta não conformidade
      if (nc.photos && nc.photos.length > 0) {
        // Adicionar título para a seção de fotos
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Evidências fotográficas:",
                bold: true,
              }),
            ],
            spacing: {
              before: 120,
              after: 80,
            },
          })
        );
        
        // Encontrar as fotos correspondentes
        const ncPhotos = nc.photos
          .map(photoId => photos.find(p => p.id === photoId))
          .filter(photo => photo !== undefined) as Photo[];
        
        // Se houver fotos, adicionar cada uma delas
        if (ncPhotos.length > 0) {
          for (const [photoIndex, photo] of ncPhotos.entries()) {
            try {
              // Adicionar a legenda da foto
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Foto ${index + 1}.${photoIndex + 1}: `,
                      bold: true,
                    }),
                    new TextRun({
                      text: photo.caption || 'Sem descrição',
                    }),
                  ],
                  spacing: {
                    before: 80,
                    after: 40,
                  },
                })
              );
              
              // Adicionar a imagem se a URL for válida
              if (photo.url && photo.url.trim() !== '') {
                const imageBuffer = await this.convertImageUrlToBuffer(photo.url);
                
                if (imageBuffer.length > 0) {
                  paragraphs.push(
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageBuffer,
                          transformation: {
                            width: 400,
                            height: 300,
                          },
                          type: "png",
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: {
                        after: 120,
                      },
                    })
                  );
                } else {
                  // Fallback se não conseguir carregar a imagem
                  paragraphs.push(
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `[Não foi possível carregar a imagem: ${photo.caption || 'Sem descrição'}]`,
                          italics: true,
                          color: "FF0000",
                        }),
                      ],
                      spacing: {
                        after: 120,
                      },
                    })
                  );
                }
              }
            } catch (error) {
              console.error(`Erro ao adicionar imagem: ${error}`);
              // Adicionar mensagem de erro no documento
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `[Não foi possível carregar a imagem: ${photo.caption || 'Sem descrição'}]`,
                      italics: true,
                      color: "FF0000",
                    }),
                  ],
                  spacing: {
                    after: 120,
                  },
                })
              );
            }
          }
        } else {
          // Se não houver fotos, adicionar mensagem
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Nenhuma imagem disponível para esta não conformidade.",
                  italics: true,
                }),
              ],
              spacing: {
                after: 120,
              },
            })
          );
        }
      }
    }
    
    return paragraphs;
  }

  /**
   * Obtém os dados do logo da BRASILIT
   * @returns Buffer com os dados da imagem
   */
  private static getLogoData(): Buffer {
    // Carregará o logo a partir de um Buffer (dados binários)
    // Por enquanto, retorna um buffer vazio (ajustar posteriormente com dados reais)
    return Buffer.from(BRASILIT_LOGO_BASE64, 'base64');
  }
  
  /**
   * Converte uma URL de imagem em um Buffer
   * @param photoUrl URL da imagem a ser convertida
   * @returns Promise com o Buffer da imagem
   */
  private static async convertImageUrlToBuffer(photoUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(photoUrl);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Erro ao converter imagem:', error);
      // Retorna um buffer vazio em caso de erro
      return Buffer.from([]);
    }
  }
  
  /**
   * Cria parágrafo com imagem a partir da URL
   * @param photoUrl URL da imagem
   * @param caption Legenda da imagem
   * @returns Promise com o Paragraph contendo a imagem
   */
  private static async createImageParagraph(photoUrl: string, caption?: string): Promise<Paragraph[]> {
    try {
      const buffer = await this.convertImageUrlToBuffer(photoUrl);
      
      if (buffer.length === 0) {
        return [new Paragraph({ text: "[Erro ao carregar imagem]" })];
      }
      
      const paragraphs = [
        new Paragraph({
          children: [
            new ImageRun({
              data: buffer,
              transformation: {
                width: 400,
                height: 300,
              },
              type: "png",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ];
      
      if (caption) {
        paragraphs.push(
          new Paragraph({
            text: caption,
            alignment: AlignmentType.CENTER,
            style: "Normal",
          })
        );
      }
      
      return paragraphs;
    } catch (error) {
      console.error('Erro ao criar parágrafo com imagem:', error);
      return [new Paragraph({ text: "[Erro ao processar imagem]" })];
    }
  }
} 