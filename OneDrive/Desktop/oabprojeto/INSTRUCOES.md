# 🚀 Instruções Rápidas de Uso

## Passo 1: Instalar Dependências

Abra o PowerShell ou Prompt de Comando no diretório do projeto e execute:

```bash
pip install -r requirements.txt
```

Ou use o script de configuração:

```bash
.\setup.bat
```

## Passo 2: Configurar API Key

1. **Obter chave de API:**
   - Acesse: https://aistudio.google.com/app/apikey
   - Faça login com sua conta Google
   - Clique em "Criar chave"
   - Copie a chave gerada

2. **Criar arquivo .env:**
   - Crie um arquivo chamado `.env` na raiz do projeto
   - Adicione a seguinte linha (substitua pela sua chave):
   ```
   GOOGLE_API_KEY=sua_chave_aqui
   ```

## Passo 3: Executar a Aplicação

No terminal, execute:

```bash
streamlit run app.py
```

A aplicação abrirá automaticamente no seu navegador em `http://localhost:8501`

## ✅ Pronto!

Agora você pode fazer perguntas sobre o Vade Mecum na interface web.

### Exemplos de perguntas:
- "Qual o artigo sobre impeachment do presidente?"
- "Em quais situações o presidente pode permitir a entrada de forças armadas estrangeiras?"
- "Quais são os tipos de crime que podem levar ao impeachment?"

## ⚠️ Problemas Comuns

**Erro: "GOOGLE_API_KEY não encontrada"**
- Verifique se o arquivo `.env` existe e contém a chave correta
- Certifique-se de que o arquivo está na raiz do projeto

**Erro ao instalar dependências**
- Certifique-se de ter Python 3.8 ou superior instalado
- Tente atualizar o pip: `python -m pip install --upgrade pip`

**PDF não encontrado**
- Certifique-se de que o arquivo `Vade_mecum_Senado_Federal_1ed.pdf` está no mesmo diretório do `app.py`

