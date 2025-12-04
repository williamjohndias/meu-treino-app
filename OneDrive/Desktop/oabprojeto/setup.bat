@echo off
echo ========================================
echo Configuracao do Projeto Vade Mecum
echo ========================================
echo.

echo [1/3] Instalando dependencias...
pip install -r requirements.txt

echo.
echo [2/3] Verificando arquivo .env...
if not exist .env (
    echo Criando arquivo .env...
    echo GOOGLE_API_KEY=sua_chave_api_aqui > .env
    echo.
    echo IMPORTANTE: Edite o arquivo .env e adicione sua chave de API do Google Gemini
    echo Obtenha sua chave em: https://aistudio.google.com/app/apikey
) else (
    echo Arquivo .env ja existe.
)

echo.
echo [3/3] Verificando PDF...
if exist "Vade_mecum_Senado_Federal_1ed.pdf" (
    echo PDF encontrado!
) else (
    echo AVISO: PDF nao encontrado no diretorio atual.
)

echo.
echo ========================================
echo Configuracao concluida!
echo ========================================
echo.
echo Para executar a aplicacao, use:
echo   streamlit run app.py
echo.
pause

