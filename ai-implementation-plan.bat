@echo off
setlocal enabledelayedexpansion

set "PROJECT_DIR=%cd%"
set "LOG_DIR=%PROJECT_DIR%\logs"
set "SUBTASKS_FILE=%PROJECT_DIR%\current-subtasks.json"
set "STATUS_FILE=%PROJECT_DIR%\implementation-status.json"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

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

if not exist "%SUBTASKS_FILE%" (
  echo {^
    "mainTask": null,^
    "subtasks": [],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
)

:analyze_code
set "timestamp=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "log_file=%LOG_DIR%\analysis_!timestamp!.log"

echo Data e hora: %date% %time% > "!log_file!"
echo. >> "!log_file!"
dir /s /b >> "!log_file!" 2>&1
echo !log_file!
exit /b 0

:break_into_subtasks
set "main_task=%~1"
if "%main_task%"=="" set "main_task=Gerador de Relatorios DOCX"

if "%main_task%"=="Gerador de Relatorios DOCX" (
  echo {^
    "mainTask": "Gerador de Relatorios DOCX",^
    "subtasks": [^
      "Implementar suporte para imagens no relatorio",^
      "Adicionar logo da BRASILIT no cabecalho do documento",^
      "Incluir informacoes de contato da empresa no rodape",^
      "Criar tabela de conteudo automatica no inicio do documento",^
      "Ajustar formatacao conforme especificacoes (Times New Roman, 12pt, espacamento 1.5)",^
      "Garantir que o resultado da analise seja sempre IMPROCEDENTE",^
      "Implementar sistema de nomeacao de arquivos seguindo padrao definido"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Funcionalidade Offline" (
  echo {^
    "mainTask": "Funcionalidade Offline",^
    "subtasks": [^
      "Implementar banco de dados local com Dexie.js para armazenamento de dados",^
      "Criar sistema de deteccao de conectividade",^
      "Desenvolver fila de operacoes pendentes",^
      "Implementar sincronizacao automatica quando conectividade for restaurada",^
      "Garantir que todas as funcionalidades principais funcionem sem internet"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Fluxo de Trabalho do Tecnico" (
  echo {^
    "mainTask": "Fluxo de Trabalho do Tecnico",^
    "subtasks": [^
      "Implementar recebimento do agendamento com notificacoes",^
      "Adicionar preparacao pre-vistoria com historico e checklist",^
      "Desenvolver deslocamento com orientacao GPS",^
      "Implementar chegada e check-in com geolocalizacao e cronometro",^
      "Aprimorar coleta de dados iniciais do cliente",^
      "Melhorar inspecao do telhado com checklist de nao conformidades",^
      "Otimizar medicao e selecao de produtos (telhas)",^
      "Implementar conclusao com assinatura digital",^
      "Desenvolver sincronizacao de dados automatica",^
      "Aprimorar geracao do relatorio DOCX formatado"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Dashboard Principal" (
  echo {^
    "mainTask": "Dashboard Principal",^
    "subtasks": [^
      "Implementar painel superior com informacoes do usuario e notificacoes",^
      "Desenvolver secao Meu Dia com vistorias agendadas para o dia",^
      "Criar secao Proximas Vistorias com calendario dos proximos 7 dias",^
      "Adicionar secao Relatorios Pendentes com lista de relatorios nao finalizados",^
      "Implementar botoes de acao rapida (Nova Vistoria, Criar Relatorio, etc.)"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Fluxo de Nova Vistoria" (
  echo {^
    "mainTask": "Fluxo de Nova Vistoria",^
    "subtasks": [^
      "Aprimorar tela de selecao de cliente com busca, filtros e opcao de novo cadastro",^
      "Melhorar tela de informacoes basicas com validacao em tempo real",^
      "Otimizar tela de selecao de telhas com interface unificada e calculo automatico",^
      "Aperfeicoar tela de nao conformidades com as 14 opcoes especificadas",^
      "Implementar tela de revisao e finalizacao com preview e opcoes de envio"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Design Responsivo" (
  echo {^
    "mainTask": "Design Responsivo",^
    "subtasks": [^
      "Otimizar layout para todos os tamanhos de tela",^
      "Manter todas as funcionalidades em qualquer dispositivo",^
      "Otimizar controles tacteis para dispositivos moveis",^
      "Implementar reorganizacao automatica de elementos",^
      "Priorizar informacoes criticas em visualizacoes compactas",^
      "Garantir suporte a orientacao retrato e paisagem"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Captura e Processamento de Fotos" (
  echo {^
    "mainTask": "Captura e Processamento de Fotos",^
    "subtasks": [^
      "Integrar com a API de camera do dispositivo",^
      "Implementar categorizacao de fotos",^
      "Adicionar associacao de fotos com nao conformidades especificas",^
      "Criar previsualizacoes e opcao de recaptura",^
      "Garantir que as fotos sejam armazenadas localmente quando offline",^
      "Implementar compressao e otimizacao para inclusao no relatorio"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
) else if "%main_task%"=="Assinatura Digital e Finalizacao" (
  echo {^
    "mainTask": "Assinatura Digital e Finalizacao",^
    "subtasks": [^
      "Implementar sistema de assinatura digital do responsavel presente no local",^
      "Desenvolver tela de finalizacao com resumo da vistoria",^
      "Adicionar opcoes para visualizar, baixar ou enviar relatorio por e-mail",^
      "Implementar confirmacao de conclusao da vistoria"^
    ],^
    "currentIndex": 0^
  } > "%SUBTASKS_FILE%"
)

type "%SUBTASKS_FILE%"
exit /b 0

:get_next_subtask
set "current_index=0"
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "mainTask"') do (
  set "main_task=%%b"
  set "main_task=!main_task:"=!"
  set "main_task=!main_task:,=!"
  set "main_task=!main_task: =!"
)

set "subtask_line=0"
for /f "tokens=1 delims=:" %%a in ('findstr /n "subtasks" "%SUBTASKS_FILE%"') do (
  set "subtask_line=%%a"
)

set /a "target_line=!subtask_line!+!current_index!+1"
set "subtask="
set "line_count=0"

for /f "tokens=* usebackq" %%a in ("%SUBTASKS_FILE%") do (
  set /a "line_count+=1"
  if !line_count! equ !target_line! (
    set "subtask=%%a"
    set "subtask=!subtask:~6,-1!"
  )
)

echo !subtask!
exit /b 0

:complete_current_subtask
set "current_index=0"
for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

set /a "next_index=!current_index!+1"

set "temp_file=%TEMP%\temp_subtasks.json"
type "%SUBTASKS_FILE%" | find /v "currentIndex" > "!temp_file!"
echo   "currentIndex": !next_index! >> "!temp_file!"
echo } >> "!temp_file!"
move /y "!temp_file!" "%SUBTASKS_FILE%" > nul

exit /b 0

:check_if_task_completed
set "current_index=0"
set "subtask_count=0"

for /f "tokens=1,2 delims=:" %%a in ('type "%SUBTASKS_FILE%" ^| findstr "currentIndex"') do (
  set "current_index=%%b"
  set "current_index=!current_index:"=!"
  set "current_index=!current_index:,=!"
  set "current_index=!current_index: =!"
)

for /f "tokens=1 delims=:" %%a in ('findstr /n "subtasks" "%SUBTASKS_FILE%"') do (
  set "subtask_line=%%a"
)

for /f "tokens=1 delims=:" %%a in ('findstr /n "currentIndex" "%SUBTASKS_FILE%"') do (
  set "current_index_line=%%a"
)

set /a "subtask_count=!current_index_line!-!subtask_line!-2"

if !current_index! GEQ !subtask_count! (
  exit /b 0
) else (
  exit /b 1
)

:run_subtask_cycle
call :analyze_code
call :get_next_subtask
call :check_if_task_completed
if %errorlevel% equ 0 (
  exit /b 0
)
call :complete_current_subtask
exit /b 0

:start_new_task
set "task_name=%~1"
if "%task_name%"=="" (
  set "task_name=Gerador de Relatorios DOCX"
)
call :break_into_subtasks "!task_name!"
exit /b 0

:main
if "%1"=="start-task" (
  if "%~2"=="" (
    call :start_new_task "Gerador de Relatorios DOCX"
  ) else (
    call :start_new_task "%~2"
  )
) else if "%1"=="analyze" (
  call :analyze_code
) else if "%1"=="next-subtask" (
  call :get_next_subtask
) else if "%1"=="complete-subtask" (
  call :complete_current_subtask
) else if "%1"=="check-completion" (
  call :check_if_task_completed
) else if "%1"=="run-cycle" (
  call :run_subtask_cycle
) else (
  exit /b 1
)

exit /b 0

call :main %* 