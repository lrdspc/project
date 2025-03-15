# Guia Git Local - RealmDev

Este guia descreve como usar o controle de versão Git configurado neste projeto.

## Scripts Utilitários

Criamos dois scripts que facilitam o uso do Git:

### 1. Auto-Commit (auto-commit.bat)

Este script automatiza o processo de commit, salvando todas as mudanças com um timestamp.

**Como usar:**
- Simplesmente execute o arquivo `auto-commit.bat` clicando duas vezes ou pelo terminal
- O script adicionará todas as mudanças e fará um commit com a data e hora atuais
- Use regularmente durante o desenvolvimento para criar "pontos de restauração"

**Recomendação:** Execute a cada 30-60 minutos de trabalho ou após concluir uma funcionalidade.

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

1. **Commits Frequentes:** Faça commits pequenos e frequentes para facilitar a recuperação
2. **Mensagens Claras:** Use mensagens descritivas nos commits manuais
3. **Backups Externos:** Periodicamente, copie a pasta `.git` para outro local como backup adicional
4. **Teste Após Restauração:** Após restaurar uma versão, verifique se tudo funciona corretamente

---

Para mais informações sobre Git, consulte a [documentação oficial](https://git-scm.com/doc). 