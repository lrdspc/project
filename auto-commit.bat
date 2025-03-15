@echo off
echo === Auto Commit Script ===
echo.

REM Obtendo a data e hora para o nome do commit
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

REM Verificando status do git
git status

REM Adicionando todos os arquivos modificados
git add .

REM Commit com timestamp
git commit -m "chore: auto-commit %timestamp%"

echo.
echo === Commit concluído! ===
echo.

REM Pause para verificar resultado
pause 