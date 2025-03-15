@echo off
echo ===================================================
echo INICIALIZANDO AGENTE IA
echo ===================================================
echo.
echo Lendo instruções...
type agent-instructions.md
echo.
echo ===================================================
echo IMPORTANTE: Siga as instruções acima exatamente!
echo ===================================================
echo.
echo Executando análise inicial do projeto...
call ai-task.bat analyze
echo.
echo Análise concluída. Agora você pode usar os comandos do script ai-task.bat conforme as instruções.
echo. 