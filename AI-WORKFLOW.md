# Guia de Automação de IA para o Projeto Brasitec

Este documento descreve como usar o sistema de automação de IA integrado ao GitHub Actions para simplificar o desenvolvimento.

## Visão Geral

O sistema permite:

1. Solicitar que a IA faça alterações no código automaticamente
2. Testar e validar essas alterações antes do deploy 
3. Manter um registro de todas as alterações feitas pela IA
4. Garantir que as mudanças só afetem o ambiente beta

## Como Usar

### Solicitar uma alteração da IA

1. Acesse o repositório no GitHub
2. Vá para a aba "Actions"
3. Selecione o workflow "Automação de Commits da IA"
4. Clique em "Run workflow"
5. Na caixa de diálogo que aparece:
   - Digite uma descrição clara da tarefa (por exemplo: "Adicionar validação de CPF")
   - Clique em "Run workflow"

### O que acontece depois

1. O GitHub Actions executa o script de IA
2. A IA analisa o código e faz as alterações necessárias
3. As alterações são registradas no arquivo `AI-CHANGES.md`
4. Um commit é criado automaticamente e enviado para a branch beta
5. O Vercel detecta as alterações e cria um novo deploy no ambiente beta

### Como verificar as alterações

1. Acesse o ambiente beta em:
   - https://brasitec-git-beta-lucas-silvas-projects-edcfffde.vercel.app
2. Teste as novas funcionalidades
3. Consulte o arquivo `AI-CHANGES.md` para ver o histórico de alterações

### Como promover para produção

Quando as alterações estiverem satisfatórias:

1. Crie um Pull Request da branch beta para a branch main
2. Revise as alterações
3. Aprove e faça o merge do PR
4. O Vercel automaticamente fará deploy no ambiente de produção

## Limitações

- A IA só pode fazer alterações na branch beta
- Alterações complexas podem exigir intervenção humana
- O sistema funciona melhor para tarefas bem definidas

## Solução de Problemas

Se a automação falhar:

1. Verifique os logs da execução no GitHub Actions
2. Consulte o arquivo `logs/ai-activity.log` para mais detalhes
3. Corrija manualmente quaisquer problemas e tente novamente

---

Para sugestões de melhorias neste sistema, adicione comentários ao arquivo `AI-WORKFLOW.md`. 