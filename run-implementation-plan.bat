@echo off
setlocal enabledelayedexpansion

REM Script para automação do processo de desenvolvimento
REM Autor: Claude
REM Versão: 1.1 - Adaptado para implementação incremental

REM Configurações iniciais
set "PROJECT_DIR=%cd%"
set "LOG_DIR=%PROJECT_DIR%\logs"
set "WORKFLOW_FILE=%PROJECT_DIR%\agent-workflow.md"
set "SEQUENCE_FILE=%PROJECT_DIR%\implementation-sequence.md"
set "SUBTASKS_FILE=%PROJECT_DIR%\current-subtasks.json"
set "STATUS_FILE=%PROJECT_DIR%\implementation-status.json"

REM Configuração de cores
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

REM Cria diretório de logs se não existir
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Inicializa o arquivo de status se não existir
if not exist "%STATUS_FILE%" (
  echo {^
    "lastAnalysis": null,^
    "implementedFeatures": [],^
    "currentTask": null,^
    "currentSubtask": null,^
    "completedSubtasks": [],^
    "bugsFound": [],^
    "bugsFixed": [],^
    "lastCommit": null^
  } > "%STATUS_FILE%"
)

REM Inicializa o arquivo de subtarefas se não existir
if not exist "%SUBTASKS_FILE%" (
  echo {^
    "mainTask": null,^
    "subtasks": [],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
)

REM Função para exibir o banner
:show_banner
cls
echo %BLUE%================================================================%NC%
echo %BLUE%       SISTEMA DE IMPLEMENTACAO AUTOMATIZADA INCREMENTAL        %NC%
echo %BLUE%================================================================%NC%
echo.
echo Diretorio do projeto: %PROJECT_DIR%
echo Servidor em execucao: http://localhost:5176/
echo.
goto :eof

REM Função para verificar dependências
:check_dependencies
echo %YELLOW%Verificando dependencias necessarias...%NC%

REM Verifica se o Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
  echo %RED%Git nao encontrado. Por favor, instale o Git.%NC%
  exit /b 1
)

REM Verifica se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo %RED%Node.js nao encontrado. Por favor, instale o Node.js.%NC%
  exit /b 1
)

REM Verifica se o npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
  echo %RED%npm nao encontrado. Por favor, instale o npm.%NC%
  exit /b 1
)

REM Verifica se o Prettier está instalado
npx prettier --version >nul 2>&1
if %errorlevel% neq 0 (
  echo %YELLOW%Prettier nao encontrado. Instalando...%NC%
  npm install --save-dev prettier
)

echo %GREEN%Todas as dependencias estao instaladas.%NC%
goto :eof

REM Função para verificar o servidor de desenvolvimento
:check_dev_server
echo %YELLOW%Verificando servidor de desenvolvimento...%NC%

REM Tentativa de conexão com o servidor
curl -s http://localhost:5176/ >nul 2>&1
if %errorlevel% equ 0 (
  echo %GREEN%Servidor de desenvolvimento rodando na porta 5176.%NC%
  exit /b 0
) else (
  echo %RED%Servidor de desenvolvimento nao detectado na porta 5176.%NC%
  echo %YELLOW%Tentando iniciar o servidor...%NC%
  
  REM Inicia o servidor em segundo plano
  start /b npm run dev
  
  REM Espera alguns segundos para o servidor iniciar
  timeout /t 5 /nobreak >nul
  
  REM Verifica novamente
  curl -s http://localhost:5176/ >nul 2>&1
  if %errorlevel% equ 0 (
    echo %GREEN%Servidor de desenvolvimento iniciado com sucesso.%NC%
    exit /b 0
  ) else (
    echo %RED%Falha ao iniciar o servidor de desenvolvimento.%NC%
    exit /b 1
  )
)
goto :eof

REM Função para analisar o código (versão leve)
:analyze_code_lightweight
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%LOG_DIR%\analysis_lightweight_!timestamp!.log"

echo %YELLOW%Iniciando analise rapida de codigo...%NC%
echo Data e hora: %date% %time% > "!log_file!"
echo. >> "!log_file!"

REM Verifica os arquivos mais recentemente modificados (máximo 5)
echo Analisando arquivos recentemente modificados... >> "!log_file!"
git ls-files -m | head -5 >> "!log_file!" 2>&1

echo %GREEN%Analise rapida de codigo concluida. Log salvo em: !log_file!%NC%
exit /b 0

REM Função para dividir tarefa em subtarefas
:break_into_subtasks
echo %YELLOW%Dividindo a tarefa em partes menores...%NC%

set "main_task=%~1"
if "%main_task%"=="" set "main_task=Gerador de Relatorios DOCX"

REM Usar o ai-implementation-plan.bat para dividir as tarefas
call ai-implementation-plan.bat start-task "%main_task%"

echo %GREEN%Tarefa dividida em partes menores para implementacao incremental.%NC%
exit /b 0

REM Função para obter a próxima subtarefa
:get_next_subtask
echo %YELLOW%Obtendo proxima subtarefa a implementar...%NC%

REM Em uma implementação real, isso leria o arquivo JSON
REM Aqui estamos simulando com uma abordagem simples

for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "mainTask"') do (
  set "current_main_task=%%b"
  set "current_main_task=!current_main_task:"=!"
  set "current_main_task=!current_main_task:,=!"
  set "current_main_task=!current_main_task: =!"
)

REM Simular a obtenção do índice atual
set "current_index=0"
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

REM Simular a obtenção da subtarefa atual
set "subtask=Subtarefa #!current_index!"
if "!current_index!"=="0" set "subtask=Configurar estrutura inicial"
if "!current_index!"=="1" set "subtask=Implementar componentes principais"
if "!current_index!"=="2" set "subtask=Adicionar validacao"
if "!current_index!"=="3" set "subtask=Finalizar detalhes"
if "!current_index!"=="4" set "subtask=Implementar testes"

echo %GREEN%Proxima subtarefa a implementar: !subtask! (!current_index!/5) de !current_main_task!%NC%

REM Atualizar o arquivo de status com a subtarefa atual
REM Em uma implementação real, isso usaria um script JS para atualizar o JSON corretamente

exit /b 0

REM Função para marcar subtarefa como concluída e avançar para a próxima
:complete_current_subtask
echo %YELLOW%Marcando subtarefa atual como concluida...%NC%

REM Em uma implementação real, isso leria o arquivo JSON, atualizaria o índice
REM e salvaria de volta. Aqui estamos simulando.

REM Simular a obtenção do índice atual
set "current_index=0"
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

REM Incrementar o índice
set /a "next_index=!current_index!+1"

REM Atualizar o arquivo simulado (em uma implementação real, usaríamos um script JS)
set "temp_file=%TEMP%\temp_subtasks.json"
type "%SUBTASKS_FILE%" | find /v "currentIndex" > "!temp_file!"
echo   "currentIndex": !next_index! >> "!temp_file!"
echo } >> "!temp_file!"
move /y "!temp_file!" "%SUBTASKS_FILE%" > nul

echo %GREEN%Subtarefa concluida. Avancando para a proxima subtarefa (!next_index!/5).%NC%

exit /b 0

REM Função para verificar se a tarefa principal foi concluída
:check_if_task_completed
echo %YELLOW%Verificando se a tarefa principal foi concluida...%NC%

REM Simular a obtenção do índice atual
set "current_index=0"
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

REM Verificar se todas as subtarefas foram concluídas (índice = 5)
if "!current_index!"=="5" (
  echo %GREEN%Todas as subtarefas foram concluidas! Tarefa principal finalizada.%NC%
  exit /b 0
) else (
  echo %YELLOW%Ainda restam subtarefas a serem implementadas.%NC%
  exit /b 1
)

REM Função para ativar o agente IA para implementar subtarefa
:activate_agent_incremental
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%LOG_DIR%\agent_!timestamp!.log"

for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "mainTask"') do (
  set "main_task=%%b"
  set "main_task=!main_task:"=!"
  set "main_task=!main_task:,=!"
  set "main_task=!main_task: =!"
)

REM Obter a subtarefa atual
call :get_next_subtask

echo %YELLOW%Ativando agente IA para implementar: !subtask! (!current_index!/5) de !main_task!%NC%
echo Data e hora: %date% %time% > "!log_file!"
echo Tarefa principal: !main_task! >> "!log_file!"
echo Subtarefa: !subtask! >> "!log_file!"
echo. >> "!log_file!"

REM Aqui seria a chamada real para o agente IA
REM Neste script simulamos esse comportamento

echo Agente IA analisando codigo existente... | tee -a "!log_file!"
timeout /t 2 /nobreak >nul

echo Agente IA implementando a subtarefa... | tee -a "!log_file!"
timeout /t 3 /nobreak >nul

echo Agente IA formatando codigo com Prettier... | tee -a "!log_file!"
npx prettier --write "src/**/*.{js,jsx,ts,tsx}" >> "!log_file!" 2>&1

echo Agente IA preparando commit Git... | tee -a "!log_file!"

REM Simula um commit Git
set "commit_message=feat(!main_task!): implementa !subtask!"
echo git add . ^&^& git commit -m "!commit_message!" >> "!log_file!"

echo %GREEN%Agente IA concluiu a implementacao da subtarefa.%NC%

exit /b 0

REM Função para verificar o código após implementação
:verify_implementation_light
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%LOG_DIR%\verification_light_!timestamp!.log"

REM Obter a tarefa e subtarefa atual
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "mainTask"') do (
  set "main_task=%%b"
  set "main_task=!main_task:"=!"
  set "main_task=!main_task:,=!"
  set "main_task=!main_task: =!"
)
call :get_next_subtask

echo %YELLOW%Verificando implementacao de: !subtask! de !main_task!%NC%
echo Data e hora: %date% %time% > "!log_file!"
echo Tarefa principal: !main_task! >> "!log_file!"
echo Subtarefa verificada: !subtask! >> "!log_file!"
echo. >> "!log_file!"

REM Verifica se o servidor continua funcionando
curl -s http://localhost:5176/ >nul 2>&1
if %errorlevel% equ 0 (
  echo Servidor de desenvolvimento funcionando corretamente. >> "!log_file!"
) else (
  echo ALERTA: Servidor de desenvolvimento nao esta respondendo! >> "!log_file!"
)

REM Versão simplificada de verificação - examina apenas os arquivos modificados recentemente
echo Verificando arquivos modificados recentemente... >> "!log_file!"
git diff --name-only HEAD >> "!log_file!" 2>&1

echo %GREEN%Verificacao rapida concluida. Log salvo em: !log_file!%NC%

exit /b 0

REM Função para mostrar o menu principal
:show_menu
call :show_banner

echo %YELLOW%Menu Principal (Implementacao Incremental):%NC%
echo 1. Verificar ambiente de desenvolvimento
echo 2. Analisar codigo (verificacao rapida)
echo 3. Dividir tarefa em subtarefas menores
echo 4. Obter proxima subtarefa
echo 5. Ativar agente IA para implementar subtarefa atual
echo 6. Verificar implementacao (verificacao rapida)
echo 7. Marcar subtarefa como concluida
echo 8. Verificar se a tarefa principal foi concluida
echo 9. Executar ciclo completo para uma subtarefa
echo 10. Ver status atual
echo 11. Sair
echo.
echo %BLUE%Nota: Esta versao esta otimizada para implementacoes incrementais,%NC%
echo %BLUE%      dividindo tarefas grandes em partes menores para evitar sobrecarga%NC%
echo %BLUE%      do contexto do chat da IA.%NC%
echo.
set /p choice=Selecione uma opcao: 

exit /b 0

REM Função para mostrar o status atual
:show_status
call :show_banner

echo %YELLOW%Status Atual da Implementacao:%NC%
echo.

REM Em uma implementação real, leria o arquivo JSON
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "mainTask"') do (
  set "main_task=%%b"
  set "main_task=!main_task:"=!"
  set "main_task=!main_task:,=!"
  set "main_task=!main_task: =!"
)

call :get_next_subtask

echo Tarefa principal atual: !main_task!
echo.
echo Subtarefa atual: !subtask! (!current_index!/5)
echo.
echo Subtarefas completadas: !current_index! de 5
echo.
echo Progresso total: !current_index! subtarefas de 5 (aproximadamente !current_index!0%% completo)
echo.

pause
exit /b 0

REM Função para executar ciclo completo de uma subtarefa
:run_subtask_cycle
echo %GREEN%Executando ciclo completo para uma subtarefa...%NC%

REM 1. Análise rápida do código
call :analyze_code_lightweight

REM 2. Obter a próxima subtarefa
call :get_next_subtask

REM 3. Implementar a subtarefa
call :activate_agent_incremental

REM 4. Verificar a implementação
call :verify_implementation_light

REM 5. Marcar a subtarefa como concluída
call :complete_current_subtask

echo %GREEN%Ciclo completo de subtarefa concluido!%NC%
echo %BLUE%Implementacao incremental: 1 subtarefa completada.%NC%

pause
exit /b 0

REM Função principal
:main
REM Verifica dependências primeiro
call :check_dependencies

:menu_loop
call :show_menu
if "%choice%"=="1" (
  call :check_dev_server
  pause
  goto :menu_loop
) else if "%choice%"=="2" (
  call :analyze_code_lightweight
  pause
  goto :menu_loop
) else if "%choice%"=="3" (
  set /p main_task=Qual tarefa principal dividir em subtarefas? 
  call :break_into_subtasks "!main_task!"
  pause
  goto :menu_loop
) else if "%choice%"=="4" (
  call :get_next_subtask
  pause
  goto :menu_loop
) else if "%choice%"=="5" (
  call :activate_agent_incremental
  pause
  goto :menu_loop
) else if "%choice%"=="6" (
  call :verify_implementation_light
  pause
  goto :menu_loop
) else if "%choice%"=="7" (
  call :complete_current_subtask
  pause
  goto :menu_loop
) else if "%choice%"=="8" (
  call :check_if_task_completed
  pause
  goto :menu_loop
) else if "%choice%"=="9" (
  call :run_subtask_cycle
  goto :menu_loop
) else if "%choice%"=="10" (
  call :show_status
  goto :menu_loop
) else if "%choice%"=="11" (
  echo %GREEN%Saindo do sistema. Obrigado!%NC%
  exit /b 0
) else (
  echo %RED%Opcao invalida. Por favor, tente novamente.%NC%
  timeout /t 1 /nobreak >nul
  goto :menu_loop
)

REM Inicia o script
:start
call :main 