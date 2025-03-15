# Script de Fluxo de Trabalho para Agente IA

## Fase 1: Análise Inicial

1. **Análise de Requisitos**
   - Ler completamente o documento "Relatório de Análise Comparativa"
   - Identificar todas as funcionalidades esperadas vs implementadas
   - Criar lista de pendências organizadas por prioridade

2. **Revisão do Código Base**
   - Mapear a estrutura de diretórios e arquivos do projeto
   - Analisar arquitetura e padrões de design utilizados
   - Identificar componentes existentes e suas responsabilidades
   - Verificar consistência de estilo de código

3. **Verificação do Ambiente de Desenvolvimento**
   - Confirmar que o servidor de desenvolvimento está rodando (porta 5176)
   - Verificar dependências no package.json
   - Identificar potenciais problemas de configuração

4. **Análise de Bugs Existentes**
   - Procurar por erros de console no aplicativo
   - Identificar problemas de tipagem em TypeScript
   - Verificar casos de edge-case não tratados
   - Documentar todos os bugs encontrados para correção

## Fase 2: Planejamento de Implementação

1. **Priorização de Tarefas**
   - Utilizar o documento implementation-sequence.md como base
   - Organizar implementações por ordem de dependência técnica
   - Identificar componentes que podem ser desenvolvidos em paralelo

2. **Definição de Escopo por Iteração**
   - Dividir o trabalho em blocos lógicos e implementáveis
   - Estabelecer entregáveis mínimos para cada ciclo de desenvolvimento

3. **Preparação para Desenvolvimento**
   - Identificar bibliotecas necessárias para as implementações
   - Verificar se todas as dependências estão instaladas
   - Preparar estruturas de dados e interfaces necessárias

## Fase 3: Ciclo de Desenvolvimento

Para cada item da lista de implementação:

1. **Pré-Implementação**
   - Verificar estado atual do código relacionado à funcionalidade
   - Identificar arquivos que precisarão ser modificados
   - Definir claramente o escopo da alteração atual

2. **Implementação**
   - Desenvolver a funcionalidade seguindo as diretrizes de código
   - Adicionar comentários explicativos conforme necessário
   - Implementar tratamento de erros adequado
   - Garantir padrões de código consistentes

3. **Formatação de Código**
   - Formatar todo o código modificado usando Prettier
   - Executar comando: `npx prettier --write <arquivos_modificados>`
   - Verificar se a formatação está de acordo com as configurações do projeto

4. **Commit no Git**
   - Adicionar arquivos modificados ao stage: `git add <arquivos_modificados>`
   - Criar commit com mensagem descritiva: `git commit -m "feat: implementa <funcionalidade>"`
   - Seguir padrão de commit convencional (feat, fix, docs, style, etc.)
   - Incluir na mensagem qual item da lista de implementação foi concluído

5. **Validação Pós-Implementação**
   - Executar verificação estática de código
   - Testar a funcionalidade implementada
   - Verificar impacto em outras partes do sistema
   - Documentar quaisquer problemas encontrados

6. **Atualização de Status**
   - Marcar a tarefa como concluída no documento de sequência
   - Documentar quaisquer desvios do plano original
   - Atualizar a lista de pendências remanescentes

7. **Análise Completa do Código**
   - Realizar nova varredura em busca de bugs em todo o código
   - Verificar se a implementação introduziu problemas em outras áreas
   - Garantir que o aplicativo continua funcionando como esperado

## Fase 4: Integração e Validação Final

1. **Testes Integrados**
   - Verificar o fluxo completo do aplicativo
   - Testar todos os cenários de uso principais
   - Validar o comportamento offline e de sincronização

2. **Formatação Final**
   - Executar Prettier em todo o código-fonte: `npx prettier --write "src/**/*.{js,jsx,ts,tsx}"`
   - Garantir consistência de estilo em todo o projeto

3. **Commit Final**
   - Adicionar últimas alterações: `git add .`
   - Criar commit de finalização: `git commit -m "feat: finaliza implementação de requisitos pendentes"`
   - Verificar histórico de commits para garantir rastreabilidade

4. **Relatório de Desenvolvimento**
   - Documentar todas as funcionalidades implementadas
   - Listar quaisquer limitações ou problemas conhecidos
   - Recomendar melhorias futuras

## Regras Gerais

- **Integridade do Código**: Manter sempre a consistência e qualidade do código
- **Tratamento de Erros**: Implementar tratamento de exceções adequado em todas as operações
- **Documentação**: Comentar adequadamente código complexo ou não óbvio
- **Verificação Contínua**: Após cada alteração, verificar se causou efeitos colaterais
- **Limpeza**: Não deixar código comentado ou não utilizado
- **Logging**: Implementar logging adequado para facilitar diagnóstico de problemas
- **Formatação**: Sempre formatar o código com Prettier antes de cada commit
- **Controle de Versão**: Fazer commits pequenos e frequentes, com mensagens descritivas

## Ciclo de Verificação

Após cada implementação de funcionalidade:

1. Salvar todos os arquivos modificados
2. Formatar o código com Prettier
3. Verificar se o servidor de desenvolvimento continua funcionando (porta 5176)
4. Executar verificação estática de código
5. Testar a funcionalidade implementada
6. Realizar commit no Git com mensagem descritiva
7. Documentar o progresso e as observações
8. Iniciar nova análise de código completa antes da próxima implementação 