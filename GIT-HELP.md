# Guia Git Local - RealmDev

Este guia descreve como usar o controle de versão Git configurado neste projeto.

## Sistema de Salvamento Automático

O projeto inclui um sistema de salvamento automático que monitora e salva suas mudanças sem necessidade de intervenção manual.

### Como usar o Salvamento Automático:

1. **Iniciar o monitoramento automático:**
   - Clique no atalho "Auto Save Git" na sua Área de Trabalho
   - Ou execute diretamente o arquivo `git-auto-save.bat`

2. **Funcionamento:**
   - O sistema verificará se existem mudanças a cada 15 minutos
   - Se houver mudanças, elas serão automaticamente salvas com um timestamp
   - O monitoramento continuará até você fechar a janela ou pressionar CTRL+C

3. **Criar atalho para a Área de Trabalho:**
   - Execute o arquivo `criar-atalho-autosave.bat` para criar o atalho

## Scripts Utilitários Adicionais

Além do salvamento automático, o projeto inclui scripts úteis para operações manuais:

### 1. Auto-Commit (auto-commit.bat)

Este script permite fazer um commit manual quando desejado.

**Como usar:**
- Execute o arquivo `auto-commit.bat` quando quiser salvar manualmente
- Útil para criar pontos de salvamento específicos antes de grandes mudanças

### 2. Restauração (git-restore.bat)

Este script facilita a restauração para uma versão anterior do código.

**Como usar:**
- Execute o arquivo `git-restore.bat`
- Escolha o commit para o qual deseja restaurar a partir da lista exibida
- Siga as instruções para lidar com mudanças não salvas

## Comandos Git Úteis (Manual)

Além dos scripts, você pode usar os seguintes comandos diretamente no terminal:

### Verificar Status

```
git status
```

### Ver Histórico de Mudanças

```
git log
```

### Ver Diferenças entre Versões

```
git diff
```

### Criar um Novo Ponto de Restauração (Commit)

```
git add .
git commit -m "descrição das mudanças"
```

### Restaurar um Arquivo Específico

```
git checkout [commit-hash] -- caminho/para/arquivo
```

### Criar um Backup Completo

```
git bundle create projeto-backup.bundle HEAD master
```

## Boas Práticas

1. **Salvamento Automático:** Mantenha o script de salvamento automático sempre ativo durante o desenvolvimento
2. **Salvamentos Manuais:** Antes de fazer mudanças drásticas, faça um commit manual adicional
3. **Verificação:** Após implementar funcionalidades importantes, verifique se tudo funciona antes de continuar
4. **Backups Externos:** Periodicamente, copie a pasta `.git` para outro local como backup adicional
5. **Teste Após Restauração:** Após restaurar uma versão, verifique se tudo funciona corretamente

---

Para mais informações sobre Git, consulte a [documentação oficial](https://git-scm.com/doc). 