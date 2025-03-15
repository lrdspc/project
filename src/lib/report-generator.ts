/**
 * Serviço responsável pela geração de relatórios em formato DOCX
 * baseado nos dados coletados durante a inspeção.
 */
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
} from 'docx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { saveAs } from 'file-saver';

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

export class ReportGenerator {
  /**
   * Gera um documento DOCX a partir dos dados de inspeção
   * @param inspection - Dados completos da inspeção
   * @returns Promise com o Blob do documento gerado
   */
  public static async generateReport(inspection: Inspection): Promise<Blob> {
    const doc = new Document({
      creator: inspection.teamInfo?.technician || "Técnico Brasilit",
      title: `Relatório de Inspeção - ${inspection.client.name}`,
      description: "Relatório de inspeção técnica Brasilit",
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
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
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 700,
                right: 700,
                bottom: 700,
                left: 700,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: "BRASILIT - SAINT-GOBAIN",
                      bold: true,
                      size: 20,
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
                      text: "Relatório gerado em " + 
                        format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // Título do Relatório
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "RELATÓRIO DE INSPEÇÃO TÉCNICA",
                  bold: true,
                  size: 32,
                }),
              ],
            }),

            // Resultado
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "RESULTADO DA ANÁLISE: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: "IMPROCEDENTE",
                  bold: true,
                  color: "FF0000",
                  size: 24,
                }),
              ],
              spacing: {
                before: 200,
                after: 400,
              },
            }),

            // Informações Básicas
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "1. INFORMAÇÕES BÁSICAS",
                  bold: true,
                }),
              ],
            }),

            this.createClientInfoTable(inspection),

            // Informações da Equipe
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "2. INFORMAÇÕES DA EQUIPE",
                  bold: true,
                }),
              ],
            }),

            this.createTeamInfoTable(inspection),

            // Informações das Telhas
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "3. INFORMAÇÕES DAS TELHAS",
                  bold: true,
                }),
              ],
            }),

            this.createRoofTilesTable(inspection),

            // Não Conformidades
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "4. NÃO CONFORMIDADES IDENTIFICADAS",
                  bold: true,
                }),
              ],
            }),

            ...this.createNonConformitiesSection(inspection),

            // Registro Fotográfico
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "5. REGISTRO FOTOGRÁFICO",
                  bold: true,
                }),
              ],
            }),

            // Aqui seriam incluídas as fotos, mas como isso depende de conversão de imagens
            // isso será implementado posteriormente
            new Paragraph({
              children: [
                new TextRun({
                  text: "As fotos registradas durante a inspeção estão disponíveis no aplicativo.",
                  italics: true,
                }),
              ],
            }),

            // Conclusão
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "6. CONCLUSÃO",
                  bold: true,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Após análise técnica detalhada, foi constatado que as não conformidades " +
                    "identificadas não estão em conformidade com as especificações técnicas da " +
                    "Brasilit. Portanto, o resultado da análise é IMPROCEDENTE.",
                }),
              ],
            }),

            // Observações Finais
            ...(inspection.comments ? 
            [
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [
                  new TextRun({
                    text: "7. OBSERVAÇÕES FINAIS",
                    bold: true,
                  }),
                ],
              }),
              
              new Paragraph({
                children: [
                  new TextRun({
                    text: inspection.comments,
                  }),
                ],
              }),
            ] : []),
          ],
        },
      ],
    });

    // Gerar documento com nome padronizado
    return await Packer.toBlob(doc);
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
  private static createNonConformitiesSection(inspection: Inspection): Paragraph[] {
    const { nonConformities } = inspection;
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
    
    selectedNonConformities.forEach((nc, index) => {
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
      
      // Aqui seriam incluídas as fotos dessa não conformidade,
      // mas isso será implementado posteriormente
    });
    
    return paragraphs;
  }
} 