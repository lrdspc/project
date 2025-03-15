@echo off
setlocal enabledelayedexpansion

set "PROJECT_DIR=%cd%"
set "LOG_DIR=%PROJECT_DIR%\logs"
set "MCP_LOG_DIR=%PROJECT_DIR%\logs\mcp"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%MCP_LOG_DIR%" mkdir "%MCP_LOG_DIR%"

:analyze
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%LOG_DIR%\analysis_!timestamp!.log"

echo Data e hora: %date% %time% > "!log_file!"
echo. >> "!log_file!"
dir /s /b >> "!log_file!" 2>&1
echo !log_file!
exit /b 0

:dev
echo Iniciando servidor de desenvolvimento...
npm run dev
exit /b 0

:build
echo Construindo aplicação para produção...
npm run build
exit /b 0

:test
echo Executando testes...
npm test
exit /b 0

:lint
echo Verificando código com ESLint...
npm run lint
exit /b 0

:format
echo Formatando código com Prettier...
npm run format
exit /b 0

:offline
echo Iniciando servidor em modo offline...
node test-server.js
exit /b 0

:supabase
echo Iniciando servidor Supabase local...
cd supabase
supabase start
cd ..
exit /b 0

:docx
echo Gerando exemplo de documento DOCX...
node scripts/generate-docx-example.js
exit /b 0

:mcp-thinking
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%MCP_LOG_DIR%\thinking_!timestamp!.log"

echo Acionando servidor MCP de pensamento sequencial...
echo Data e hora: %date% %time% > "!log_file!"
echo Tarefa: %2 >> "!log_file!"
echo. >> "!log_file!"
echo Servidor MCP de pensamento sequencial acionado. Log: !log_file!
exit /b 0

:mcp-browser
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%MCP_LOG_DIR%\browser_!timestamp!.log"

echo Acionando servidor MCP de ferramentas de navegador...
echo Data e hora: %date% %time% > "!log_file!"
echo. >> "!log_file!"
echo Servidor MCP de ferramentas de navegador acionado. Log: !log_file!
exit /b 0

:mcp-docs
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%MCP_LOG_DIR%\docs_!timestamp!.log"

echo Acionando servidor MCP de busca de documentação...
echo Data e hora: %date% %time% > "!log_file!"
echo Biblioteca: %2 >> "!log_file!"
echo. >> "!log_file!"
echo Servidor MCP de busca de documentação acionado. Log: !log_file!
exit /b 0

:mcp-audit
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%MCP_LOG_DIR%\audit_!timestamp!.log"

echo Acionando servidor MCP de auditoria...
echo Data e hora: %date% %time% > "!log_file!"
echo Tipo de auditoria: %2 >> "!log_file!"
echo. >> "!log_file!"
echo Servidor MCP de auditoria acionado. Log: !log_file!
exit /b 0

:mcp-debug
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%MCP_LOG_DIR%\debug_!timestamp!.log"

echo Acionando servidor MCP de depuração...
echo Data e hora: %date% %time% > "!log_file!"
echo. >> "!log_file!"
echo Servidor MCP de depuração acionado. Log: !log_file!
exit /b 0

:help
echo Uso: ai-task.bat [comando] [argumentos]
echo.
echo Comandos de projeto:
echo   analyze  - Analisa a estrutura do projeto
echo   dev      - Inicia o servidor de desenvolvimento
echo   build    - Constrói a aplicação para produção
echo   test     - Executa os testes
echo   lint     - Verifica o código com ESLint
echo   format   - Formata o código com Prettier
echo   offline  - Inicia o servidor em modo offline
echo   supabase - Inicia o servidor Supabase local
echo   docx     - Gera um exemplo de documento DOCX
echo.
echo Comandos MCP:
echo   mcp-thinking [tarefa] - Aciona servidor de pensamento sequencial
echo   mcp-browser           - Aciona servidor de ferramentas de navegador
echo   mcp-docs [biblioteca] - Aciona servidor de busca de documentação
echo   mcp-audit [tipo]      - Aciona servidor de auditoria
echo   mcp-debug             - Aciona servidor de depuração
exit /b 0

:main
if "%1"=="" (
  call :help
) else if "%1"=="analyze" (
  call :analyze
) else if "%1"=="dev" (
  call :dev
) else if "%1"=="build" (
  call :build
) else if "%1"=="test" (
  call :test
) else if "%1"=="lint" (
  call :lint
) else if "%1"=="format" (
  call :format
) else if "%1"=="offline" (
  call :offline
) else if "%1"=="supabase" (
  call :supabase
) else if "%1"=="docx" (
  call :docx
) else if "%1"=="mcp-thinking" (
  call :mcp-thinking %2
) else if "%1"=="mcp-browser" (
  call :mcp-browser
) else if "%1"=="mcp-docs" (
  call :mcp-docs %2
) else if "%1"=="mcp-audit" (
  call :mcp-audit %2
) else if "%1"=="mcp-debug" (
  call :mcp-debug
) else if "%1"=="help" (
  call :help
) else (
  echo Comando desconhecido: %1
  echo.
  call :help
  exit /b 1
)

exit /b 0

call :main %* 