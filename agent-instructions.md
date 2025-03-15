# Instruções para o Agente

## IMPORTANTE: Siga estas instruções exatamente

Este projeto utiliza um script de automação chamado `ai-task.bat` que você deve usar para todas as tarefas. **NÃO tente analisar o código do projeto manualmente** - use apenas os comandos abaixo.

## Comandos Disponíveis

Execute os seguintes comandos conforme necessário:

### Comandos de Projeto
- `ai-task.bat analyze` - Analisa a estrutura do projeto (use este primeiro)
- `ai-task.bat dev` - Inicia o servidor de desenvolvimento
- `ai-task.bat build` - Constrói a aplicação para produção
- `ai-task.bat test` - Executa os testes
- `ai-task.bat lint` - Verifica o código com ESLint
- `ai-task.bat format` - Formata o código com Prettier
- `ai-task.bat offline` - Inicia o servidor em modo offline
- `ai-task.bat supabase` - Inicia o servidor Supabase local
- `ai-task.bat docx` - Gera um exemplo de documento DOCX

### Comandos MCP (Servidores de IA)
- `ai-task.bat mcp-thinking [tarefa]` - Aciona servidor de pensamento sequencial
- `ai-task.bat mcp-browser` - Aciona servidor de ferramentas de navegador
- `ai-task.bat mcp-docs [biblioteca]` - Aciona servidor de busca de documentação
- `ai-task.bat mcp-audit [tipo]` - Aciona servidor de auditoria
- `ai-task.bat mcp-debug` - Aciona servidor de depuração

## Plano de Implementação Atualizado

Trabalhe nas seguintes melhorias prioritárias:

### 1. Gerador de Relatórios DOCX
- Implementar suporte para imagens no relatório, convertendo as fotos capturadas
- Adicionar o logo da BRASILIT no cabeçalho do documento
- Incluir informações de contato da empresa no rodapé
- Criar uma tabela de conteúdo automática no início do documento
- Ajustar a formatação conforme especificações (Times New Roman, 12pt, espaçamento 1,5)

### 2. Funcionalidade Offline
- Implementar banco de dados local com Dexie.js para armazenamento de dados
- Desenvolver mecanismo de sincronização quando houver conexão disponível
- Garantir que todas as funcionalidades principais funcionem sem internet

### 3. Dashboard Principal
- Implementar painel completo com seções "Meu Dia", "Próximas Vistorias" e "Relatórios Pendentes"
- Adicionar botões de ação rápida conforme especificado no prompt técnico

### 4. Fluxo de Trabalho Completo
- Implementar sistema de agendamento e notificações
- Adicionar funcionalidade de histórico de vistorias anteriores
- Implementar navegação GPS até o local da vistoria
- Adicionar check-in com geolocalização e cronômetro
- Implementar assinatura digital na conclusão da vistoria

## Fluxo de Trabalho Recomendado

1. Comece com `ai-task.bat analyze` para entender a estrutura do projeto
2. Use os servidores MCP conforme necessário para tarefas específicas
3. Execute `ai-task.bat dev` para iniciar o servidor de desenvolvimento quando precisar testar
4. Use `ai-task.bat docx` para gerar documentos DOCX de exemplo

## Observações Importantes

- Todos os logs são salvos no diretório `logs/`
- Os logs dos servidores MCP são salvos em `logs/mcp/`
- Não tente modificar o script `ai-task.bat` - ele já está otimizado para uso por agentes IA
- Sempre use os comandos MCP em vez de tentar implementar essas funcionalidades manualmente

**LEMBRE-SE**: Não analise o código do projeto manualmente - use apenas os comandos fornecidos pelo script `ai-task.bat`. 