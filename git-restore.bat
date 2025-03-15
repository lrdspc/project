@echo off
echo === Git Restore Script ===
echo.

REM Mostrar os últimos 10 commits para escolha
echo Últimos 10 commits:
echo.
git log --oneline -10
echo.

REM Solicitar o hash do commit para restaurar
set /p commit_hash="Digite o hash do commit para restaurar (primeiros 7 caracteres): "

echo.
echo Restaurando para o commit: %commit_hash%
echo.

REM Verificar se há mudanças não commitadas
git status --porcelain > temp_status.txt
set /p has_changes=<temp_status.txt
del temp_status.txt

if not "%has_changes%"=="" (
    echo ATENÇÃO: Existem mudanças não commitadas. Você tem duas opções:
    echo 1. Salvar as mudanças atuais (stash)
    echo 2. Descartar as mudanças atuais
    echo.
    set /p option="Escolha uma opção (1 ou 2): "
    
    if "%option%"=="1" (
        echo Salvando mudanças...
        git stash save "Mudanças antes de restaurar para %commit_hash%"
    ) else (
        echo Descartando mudanças...
        git reset --hard HEAD
    )
)

REM Restaurar para o commit específico
git checkout %commit_hash%

echo.
echo === Restauração concluída! ===
echo.
echo Para voltar à versão mais recente, digite: git checkout master
echo.

REM Pause para verificar resultado
pause 