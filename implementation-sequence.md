# Sequência de Implementação para PWA de Relatórios de Vistoria Brasilit

Este documento define a sequência recomendada para implementação do Progressive Web App (PWA) especializado na geração automática de relatórios de vistoria técnica para telhas BRASILIT, conforme especificações técnicas.

## Implementações de Alta Prioridade

1. **Gerador de Relatórios DOCX**
   - Implementar suporte para imagens no relatório, convertendo as fotos capturadas
   - Adicionar logo da BRASILIT no cabeçalho do documento
   - Incluir informações de contato da empresa no rodapé
   - Criar tabela de conteúdo automática no início do documento
   - Ajustar formatação conforme especificações (Times New Roman, 12pt, espaçamento 1,5)
   - Garantir que o resultado da análise seja sempre "IMPROCEDENTE"
   - Implementar sistema de nomeação de arquivos seguindo padrão definido

2. **Funcionalidade Offline**
   - Implementar banco de dados local com Dexie.js para armazenamento de dados
   - Criar sistema de detecção de conectividade
   - Desenvolver fila de operações pendentes
   - Implementar sincronização automática quando conectividade for restaurada
   - Garantir que todas as funcionalidades principais funcionem sem internet

3. **Fluxo de Trabalho do Técnico**
   - Implementar as 10 etapas do fluxo de trabalho conforme especificado:
     1. Recebimento do Agendamento com notificações
     2. Preparação Pré-Vistoria com histórico e checklist
     3. Deslocamento com orientação GPS
     4. Chegada e Check-in com geolocalização e cronômetro
     5. Coleta de Dados Iniciais do cliente
     6. Inspeção do Telhado com checklist de não conformidades
     7. Medição e Seleção de Produtos (telhas)
     8. Conclusão com assinatura digital
     9. Sincronização de Dados automática
     10. Geração do Relatório DOCX formatado

## Implementações de Média Prioridade

4. **Dashboard Principal**
   - Implementar painel superior com informações do usuário e notificações
   - Desenvolver seção "Meu Dia" com vistorias agendadas para o dia
   - Criar seção "Próximas Vistorias" com calendário dos próximos 7 dias
   - Adicionar seção "Relatórios Pendentes" com lista de relatórios não finalizados
   - Implementar botões de ação rápida (Nova Vistoria, Criar Relatório, Buscar Cliente, etc.)

5. **Fluxo de Nova Vistoria**
   - Tela de Seleção de Cliente com busca, filtros e opção de novo cadastro
   - Tela de Informações Básicas com validação em tempo real
   - Tela de Seleção de Telhas com interface unificada e cálculo automático
   - Tela de Não Conformidades com as 14 opções especificadas
   - Tela de Revisão e Finalização com preview e opções de envio

6. **Formulário Principal e Campos Variáveis**
   - Implementar todos os campos obrigatórios conforme especificado:
     - Informações Básicas (cliente, empreendimento, cidade, etc.)
     - Informações da Equipe (técnico, departamento, unidade, etc.)
     - Seleção de Produtos com sistema unificado para múltiplos tipos
     - Não Conformidades com pelo menos uma opção obrigatória

## Implementações de Baixa Prioridade

7. **Design Responsivo**
   - Otimizar layout para todos os tamanhos de tela
   - Manter todas as funcionalidades em qualquer dispositivo
   - Otimizar controles tácteis para dispositivos móveis
   - Implementar reorganização automática de elementos
   - Priorizar informações críticas em visualizações compactas
   - Garantir suporte a orientação retrato e paisagem

8. **Captura e Processamento de Fotos**
   - Integrar com a API de câmera do dispositivo
   - Implementar categorização de fotos
   - Adicionar associação de fotos com não conformidades específicas
   - Criar previsualizações e opção de recaptura
   - Garantir que as fotos sejam armazenadas localmente quando offline
   - Implementar compressão e otimização para inclusão no relatório

9. **Assinatura Digital e Finalização**
   - Implementar sistema de assinatura digital do responsável presente no local
   - Desenvolver tela de finalização com resumo da vistoria
   - Adicionar opções para visualizar, baixar ou enviar relatório por e-mail
   - Implementar confirmação de conclusão da vistoria

## Testes e Validação

10. **Validação Final**
    - Testar fluxo completo de geração de relatórios
    - Validar funcionamento offline em diferentes cenários
    - Verificar responsividade em múltiplos dispositivos
    - Confirmar que todas as especificações do prompt técnico foram atendidas
    - Testar sincronização de dados após períodos offline
    - Validar formatação do documento DOCX gerado 