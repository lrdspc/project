@echo off
echo === Criando Atalho para Auto Save ===
echo.

REM Obtém o caminho atual
set "current_dir=%CD%"
set "target_script=%current_dir%\git-auto-save.bat"

REM Caminho para a Área de Trabalho
set "desktop=%USERPROFILE%\Desktop"

REM Criar o arquivo de atalho VBS
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\createShortcut.vbs"
echo sLinkFile = "%desktop%\Auto Save Git.lnk" >> "%temp%\createShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\createShortcut.vbs"
echo oLink.TargetPath = "%target_script%" >> "%temp%\createShortcut.vbs"
echo oLink.WorkingDirectory = "%current_dir%" >> "%temp%\createShortcut.vbs"
echo oLink.Description = "Inicia o salvamento automático do projeto" >> "%temp%\createShortcut.vbs"
echo oLink.IconLocation = "%SystemRoot%\System32\shell32.dll,46" >> "%temp%\createShortcut.vbs"
echo oLink.Save >> "%temp%\createShortcut.vbs"

REM Executar o script VBS
cscript //nologo "%temp%\createShortcut.vbs"
del "%temp%\createShortcut.vbs"

echo.
echo Atalho criado com sucesso na sua Área de Trabalho!
echo Basta clicar em "Auto Save Git" para iniciar o monitoramento automático.
echo.
echo IMPORTANTE: O monitoramento ficará ativo até você fechar a janela ou pressionar CTRL+C.
echo.
pause 