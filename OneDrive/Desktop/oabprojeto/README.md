# 📚 Consulta às Leis Orgânicas de Curitiba - PR

Sistema de consulta inteligente às Leis Orgânicas de Curitiba usando RAG (Retrieval-Augmented Generation) com Ollama (100% gratuito e sem limites!).

## 🚀 Como usar

### Opção 1: Executar Localmente

#### 1. Instalar dependências

```bash
pip install -r requirements.txt
```

#### 2. Instalar Ollama

1. Baixe e instale o Ollama: https://ollama.com/download
2. Baixe um modelo:
   ```bash
   ollama pull llama3.2
   ```

Consulte o arquivo `INSTALAR_OLLAMA.md` para instruções detalhadas.

#### 3. Executar a aplicação

```bash
streamlit run app.py
```

A aplicação será aberta automaticamente no seu navegador em `http://localhost:8501`

### Opção 2: Deploy no Streamlit Cloud

1. Faça push deste repositório para o GitHub
2. Acesse: https://share.streamlit.io
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente (se necessário)
5. Deploy automático!

**Nota**: Para Streamlit Cloud, você precisará usar uma API externa (Google Gemini) ao invés de Ollama, pois o Ollama precisa rodar localmente.

## 📋 Funcionalidades

- ✅ Consulta inteligente ao PDF das Leis Orgânicas
- ✅ Busca semântica usando embeddings
- ✅ Respostas baseadas no contexto do documento
- ✅ Exibição de trechos relacionados
- ✅ Interface web moderna e intuitiva
- ✅ 100% gratuito (usando Ollama local)
- ✅ Sem limites de tokens ou requisições

## 📁 Estrutura do Projeto

```
oabprojeto/
├── app.py                              # Aplicação principal
├── requirements.txt                    # Dependências Python
├── .env                                # Variáveis de ambiente (criar localmente)
├── .gitignore                          # Arquivos ignorados pelo Git
├── README.md                           # Este arquivo
├── INSTALAR_OLLAMA.md                  # Guia de instalação do Ollama
├── COMO_OBTER_API_KEY_GRATUITA.md      # Guia para API gratuita (alternativa)
└── *.pdf                               # PDFs das Leis Orgânicas
```

## 🔧 Requisitos

- Python 3.8 ou superior
- Ollama instalado (para uso local)
- PDF das Leis Orgânicas no diretório do projeto
- 4-8GB de RAM livre (para rodar os modelos)

## 💡 Exemplos de Perguntas

- "Qual o artigo sobre zoneamento urbano?"
- "O que diz a lei orgânica sobre transporte público?"
- "Qual a norma sobre licenciamento ambiental?"
- "O que estabelece a lei sobre uso do solo?"

## ⚠️ Notas

- O sistema carrega automaticamente todos os PDFs do diretório atual
- A primeira execução pode demorar alguns minutos para processar o PDF e criar o índice
- As respostas são baseadas exclusivamente no conteúdo do documento
- Para melhor performance, use perguntas específicas

## 🆘 Problemas Comuns

### Ollama não encontrado
- Verifique se o Ollama está instalado e rodando
- Consulte `INSTALAR_OLLAMA.md` para instruções

### Modelo não encontrado
- Execute: `ollama pull llama3.2`
- Verifique com: `ollama list`

### Erro ao processar PDF
- Certifique-se de que o PDF está no diretório do projeto
- Verifique se o arquivo não está corrompido

## 📝 Licença

Este projeto é de código aberto. Sinta-se livre para usar e modificar.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.
