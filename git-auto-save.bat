@echo off
echo === Auto Save Git - Iniciando Monitoramento ===
echo.
echo Este script monitora e salva suas alterações automaticamente a cada 15 minutos.
echo Iniciado em: %TIME% - %DATE%
echo.
echo Pressione CTRL+C para encerrar o monitoramento quando desejar.
echo.

:loop
REM Obtendo a data e hora para o nome do commit
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

REM Verificando se há mudanças para salvar
git status --porcelain > temp_status.txt
set /p has_changes=<temp_status.txt
del temp_status.txt

if not "%has_changes%"=="" (
    echo [%timestamp%] Salvando alterações...
    
    REM Adicionando todos os arquivos modificados
    git add .
    
    REM Commit com timestamp
    git commit -m "auto: salvamento automático %timestamp%"
    
    echo [%timestamp%] Alterações salvas com sucesso!
) else (
    echo [%timestamp%] Nenhuma alteração detectada.
)

echo Próximo salvamento em 15 minutos. Trabalhando em segundo plano...
echo.

REM Aguarda 15 minutos (900 segundos)
timeout /t 900 /nobreak > nul

goto loop 