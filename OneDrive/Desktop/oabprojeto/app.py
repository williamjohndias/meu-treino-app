import os
from pathlib import Path
from typing import Dict, List, Optional, TypedDict
from dotenv import load_dotenv
import streamlit as st
import requests

# Carregar variáveis de ambiente
load_dotenv()

# Detectar se está rodando no Streamlit Cloud
# Verificar múltiplas formas de detecção
IS_STREAMLIT_CLOUD = (
    os.getenv("STREAMLIT_SHARING") is not None or 
    os.getenv("STREAMLIT_SHARING_MODE") is not None or
    "streamlit.app" in str(os.getenv("_", "")) or
    "streamlit.io" in str(os.getenv("_", "")) or
    os.path.exists("/mount/src")  # Streamlit Cloud monta em /mount/src
)

# Importações do LangChain
# Sempre importar ambos para evitar erros de importação
try:
    from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from langchain_community.chat_models import ChatOllama
    from langchain_community.embeddings import HuggingFaceEmbeddings
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel, Field
from typing import Literal

# Interface Streamlit
st.set_page_config(
    page_title="Consulta Vade Mecum",
    page_icon="📚",
    layout="wide"
)

st.title("📚 Consulta às Leis Orgânicas de Curitiba - PR")
st.markdown("---")

# Configuração da API Key (para Streamlit Cloud)
# Tentar obter de diferentes formas
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Se não encontrou, tentar ler do secrets do Streamlit (Streamlit Cloud usa secrets.toml)
if not GOOGLE_API_KEY or GOOGLE_API_KEY == "sua_chave_api_aqui":
    try:
        # Streamlit Cloud usa secrets
        if hasattr(st, 'secrets'):
            if 'GOOGLE_API_KEY' in st.secrets:
                GOOGLE_API_KEY = st.secrets['GOOGLE_API_KEY']
    except Exception as e:
        pass

# Verificar ambiente e configurar modelo
# Se estiver no Streamlit Cloud, SEMPRE usar Gemini (Ollama não funciona na nuvem)
# Se tiver chave válida, usar Gemini
HAS_VALID_GEMINI_KEY = GOOGLE_API_KEY and GOOGLE_API_KEY != "sua_chave_api_aqui" and len(str(GOOGLE_API_KEY).strip()) > 10

# No Streamlit Cloud, sempre tentar usar Gemini (mesmo sem chave, mostrará erro pedindo chave)
USE_GEMINI = IS_STREAMLIT_CLOUD or (HAS_VALID_GEMINI_KEY and GEMINI_AVAILABLE)

if USE_GEMINI:
    # Usar Google Gemini (funciona localmente e na nuvem)
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "sua_chave_api_aqui" or len(str(GOOGLE_API_KEY).strip()) <= 10:
        if IS_STREAMLIT_CLOUD:
            st.error("⚠️ **API Key não configurada no Streamlit Cloud!**")
            st.markdown("""
            **Você está no Streamlit Cloud. Ollama não funciona aqui - você precisa usar Google Gemini.**
            
            Para configurar:
            
            1. No Streamlit Cloud, vá em **Settings** → **Secrets**
            2. Adicione:
            ```toml
            GOOGLE_API_KEY = "sua_chave_aqui"
            ```
            3. Obtenha uma chave gratuita em: https://aistudio.google.com/app/apikey
            4. Clique em **Save** e aguarde alguns segundos
            5. Recarregue esta página
            
            **Limites Gratuitos:**
            - 15 requisições/minuto
            - 1.500 requisições/dia
            - Totalmente gratuito!
            
            Consulte `COMO_OBTER_API_KEY_GRATUITA.md` para mais detalhes.
            """)
        else:
            st.error("⚠️ **API Key não configurada!**")
            st.markdown("""
            Para usar Google Gemini, configure a variável de ambiente `GOOGLE_API_KEY`:
            
            1. Crie um arquivo `.env` na raiz do projeto
            2. Adicione:
            ```
            GOOGLE_API_KEY=sua_chave_aqui
            ```
            3. Obtenha uma chave gratuita em: https://aistudio.google.com/app/apikey
            
            **Limites Gratuitos:**
            - 15 requisições/minuto
            - 1.500 requisições/dia
            - Totalmente gratuito!
            
            Consulte `COMO_OBTER_API_KEY_GRATUITA.md` para mais detalhes.
            """)
        st.stop()
    ollama_available = False
    ollama_models = None
else:
    # Local - verificar Ollama
    @st.cache_resource
    def check_ollama():
        """Verifica se Ollama está disponível"""
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            if response.status_code == 200:
                return True, response.json()
            return False, None
        except:
            return False, None

    ollama_available, ollama_models = check_ollama()

# Se estiver no Streamlit Cloud, não verificar Ollama
if IS_STREAMLIT_CLOUD:
    ollama_available = False
    ollama_models = None

# Se localmente e Ollama não estiver disponível, mostrar mensagem
if not USE_GEMINI and not ollama_available:
    # Localmente, se Ollama não estiver disponível
    st.error("⚠️ **Ollama não está rodando!**")
    st.markdown("""
    **Ollama é 100% GRATUITO e SEM LIMITES DE TOKENS!**
    
    Para usar esta solução, você precisa:
    
    1. **Instalar Ollama:**
       - Acesse: https://ollama.com/download
       - Baixe e instale para Windows
       - Execute o instalador
    
    2. **Baixar um modelo (escolha um):**
       ```bash
       ollama pull llama3.2
       ```
       ou
       ```bash
       ollama pull mistral
       ```
       ou
       ```bash
       ollama pull phi3
       ```
    
    3. **Iniciar Ollama:**
       - Ollama inicia automaticamente após instalação
       - Ou execute: `ollama serve`
    
    4. **Recarregue esta página**
    
    **Vantagens:**
    - ✅ 100% Gratuito
    - ✅ Sem limites de tokens
    - ✅ Funciona offline
    - ✅ Sem necessidade de API Key
    - ✅ Privacidade total (tudo roda localmente)
    
    **Consulte o arquivo `INSTALAR_OLLAMA.md` para instruções detalhadas!**
    """)
    st.stop()

# Verificar se há modelos instalados
if ollama_models and 'models' in ollama_models and len(ollama_models['models']) == 0:
    st.warning("⚠️ Nenhum modelo instalado no Ollama!")
    st.markdown("""
    Instale um modelo executando no terminal:
    ```bash
    ollama pull llama3.2
    ```
    
    Consulte o arquivo `INSTALAR_OLLAMA.md` para mais detalhes!
    """)
    st.stop()

# Preparar o modelo LLM
# Usar versão no cache para forçar atualização
@st.cache_resource
def get_llm_models(_cache_version="v3"):
    """Carrega os modelos LLM com cache
    
    Args:
        _cache_version: Versão do cache para forçar atualização
    """
    if USE_GEMINI:
        # Usar Google Gemini
        if not GEMINI_AVAILABLE:
            raise ImportError("langchain-google-genai não está instalado. Adicione ao requirements.txt")
        
        # Usar gemini-pro que é garantido funcionar com API v1beta
        # Modelos como gemini-2.5-flash podem não estar disponíveis
        model_name = "gemini-pro"
        
        # Criar instâncias do modelo
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=1.0,
            google_api_key=GOOGLE_API_KEY
        )
        
        llm_triagem = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=0.0,
            google_api_key=GOOGLE_API_KEY
        )
        
        return llm, llm_triagem, model_name
    else:
        # Local - usar Ollama
        if not OLLAMA_AVAILABLE:
            raise ImportError("langchain-community não está instalado corretamente")
        
        model_name = "llama3.2"
        if ollama_models and 'models' in ollama_models:
            available_models = [m.get('name', '').split(':')[0] for m in ollama_models['models']]
            if 'llama3.2' in available_models:
                model_name = "llama3.2"
            elif 'mistral' in available_models:
                model_name = "mistral"
            elif 'phi3' in available_models:
                model_name = "phi3"
            elif len(available_models) > 0:
                model_name = available_models[0]
        
        llm = ChatOllama(
            model=model_name,
            temperature=1.0,
            base_url="http://localhost:11434"
        )
        
        llm_triagem = ChatOllama(
            model=model_name,
            temperature=0.0,
            base_url="http://localhost:11434"
        )
        return llm, llm_triagem, model_name

llm, llm_triagem, model_name = get_llm_models()
if USE_GEMINI:
    st.sidebar.success(f"🤖 **Modelo:** {model_name}\n\n☁️ Usando Google Gemini\n✅ Gratuito (15 req/min)")
else:
    st.sidebar.success(f"🤖 **Modelo:** {model_name}\n\n✅ 100% Gratuito\n✅ Sem limites de tokens\n✅ Funciona offline")

# Prompt de triagem
TRIAGEM_PROMPT = (
    "Você é um assistente especializado em consultar o Vade Mecum do Senado Federal. "
    "Dada a mensagem do usuário, retorne SOMENTE um JSON com:\n"
    "{\n"
    '  "decisao": "AUTO_RESOLVER" | "PEDIR_INFO" | "ABRIR_CHAMADO",\n'
    '  "urgencia": "BAIXA" | "MEDIA" | "ALTA",\n'
    '  "campos_faltantes": ["..."]\n'
    "}\n"
    "Regras:\n"
    '- **AUTO_RESOLVER**: Perguntas claras sobre leis, artigos, normas ou procedimentos descritos no Vade Mecum (Ex: "Qual o artigo sobre impeachment?", "Como funciona a política de alimentação?").\n'
    '- **PEDIR_INFO**: Mensagens vagas ou que faltam informações para identificar o tema ou contexto (Ex: "Preciso de ajuda", "Tenho uma dúvida geral").\n'
    '- **ABRIR_CHAMADO**: Pedidos de exceção, liberação, aprovação ou quando o usuário explicitamente pede para abrir um chamado.\n'
    "Analise a mensagem e decida a ação mais apropriada."
)

# Modelo Pydantic para triagem
class TriagemOut(BaseModel):
    decisao: Literal["AUTO_RESOLVER", "PEDIR_INFO", "ABRIR_CHAMADO"]
    urgencia: Literal["BAIXA", "MEDIA", "ALTA"]
  campos_faltantes: List[str] = Field(default_factory=list)

# Configurar chain de triagem - Ollama não suporta with_structured_output
# Vamos usar prompt estruturado e parsing manual
def get_triagem_prompt(mensagem: str) -> str:
    """Gera o prompt de triagem com a mensagem do usuário"""
    return (
        "Você é um assistente especializado em consultar as Leis Orgânicas de Curitiba, Paraná. "
        "Dada a mensagem do usuário, retorne SOMENTE um JSON válido com:\n"
        "{{\n"
        '  "decisao": "AUTO_RESOLVER" | "PEDIR_INFO" | "ABRIR_CHAMADO",\n'
        '  "urgencia": "BAIXA" | "MEDIA" | "ALTA",\n'
        '  "campos_faltantes": ["..."]\n'
        "}}\n"
        "Regras:\n"
        '- **AUTO_RESOLVER**: Perguntas ESPECÍFICAS e CLARAS sobre leis orgânicas, artigos, normas ou procedimentos de Curitiba. Exemplos: "Qual o artigo sobre zoneamento urbano?", "O que diz a lei orgânica sobre transporte público?", "Qual a norma sobre licenciamento ambiental?".\n'
        '- **PEDIR_INFO**: Mensagens VAGAS, genéricas ou que faltam informações específicas. Exemplos: "me retorne apenas uma lei", "preciso de ajuda", "tenho uma dúvida", "quero saber sobre leis", "me mostre algo".\n'
        '- **ABRIR_CHAMADO**: Pedidos de exceção, liberação, aprovação ou quando o usuário explicitamente pede para abrir um chamado.\n'
        "IMPORTANTE: Se a pergunta for genérica ou vaga (como 'me retorne uma lei', 'me mostre algo', 'quero saber sobre'), classifique como PEDIR_INFO.\n"
        "Analise a mensagem e retorne APENAS o JSON, sem texto adicional.\n"
        f"Mensagem do usuário: {mensagem}"
    )

import json
import re

def triagem(mensagem: str) -> Dict:
    """Função para realizar triagem da mensagem do usuário"""
    prompt = get_triagem_prompt(mensagem)
    
    # Invocar o modelo
    response = llm_triagem.invoke(prompt)
    
    # Extrair o conteúdo da resposta
    if hasattr(response, 'content'):
        content = response.content
    else:
        content = str(response)
    
    # Tentar extrair JSON da resposta
    # Procurar por JSON no texto
    json_match = re.search(r'\{[^{}]*"decisao"[^{}]*\}', content, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
    else:
        # Tentar encontrar qualquer JSON válido
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            # Fallback: retornar valores padrão
            return {
                "decisao": "PEDIR_INFO",
                "urgencia": "MEDIA",
                "campos_faltantes": ["contexto específico"]
            }
    
    try:
        # Limpar e parsear JSON
        json_str = json_str.strip()
        # Remover markdown code blocks se houver
        json_str = re.sub(r'```json\s*', '', json_str)
        json_str = re.sub(r'```\s*', '', json_str)
        
        data = json.loads(json_str)
        
        # Validar e garantir estrutura correta
        decisao = data.get("decisao", "PEDIR_INFO")
        if decisao not in ["AUTO_RESOLVER", "PEDIR_INFO", "ABRIR_CHAMADO"]:
            decisao = "PEDIR_INFO"
        
        urgencia = data.get("urgencia", "MEDIA")
        if urgencia not in ["BAIXA", "MEDIA", "ALTA"]:
            urgencia = "MEDIA"
        
        campos_faltantes = data.get("campos_faltantes", [])
        if not isinstance(campos_faltantes, list):
            campos_faltantes = []
        
        return {
            "decisao": decisao,
            "urgencia": urgencia,
            "campos_faltantes": campos_faltantes
        }
    except json.JSONDecodeError:
        # Se falhar ao parsear, retornar valores padrão
        return {
            "decisao": "PEDIR_INFO",
            "urgencia": "MEDIA",
            "campos_faltantes": ["contexto específico"]
        }

# Carregar PDFs e criar índice vetorial com cache
@st.cache_resource
def load_vectorstore():
    """Carrega o PDF e cria o índice vetorial com cache"""
    with st.spinner("Carregando PDF e criando índice... Isso pode levar alguns minutos na primeira vez."):
        # Carregar PDFs
docs = []

        # Tentar múltiplos caminhos possíveis
        possible_paths = [
            Path("."),  # Diretório atual
            Path(__file__).parent,  # Diretório do script
            Path.cwd(),  # Diretório de trabalho atual
        ]
        
        # Adicionar caminho específico do Streamlit Cloud se existir
        if os.path.exists("/mount/src"):
            possible_paths.append(Path("/mount/src"))
        
        pdf_files_found = []
        for workspace_path in possible_paths:
            try:
                pdf_files = list(workspace_path.glob("*.pdf"))
                if pdf_files:
                    pdf_files_found.extend(pdf_files)
            except Exception:
                continue
        
        # Remover duplicatas mantendo a ordem
        seen = set()
        unique_pdfs = []
        for pdf in pdf_files_found:
            if str(pdf.resolve()) not in seen:
                seen.add(str(pdf.resolve()))
                unique_pdfs.append(pdf)
        
        if not unique_pdfs:
            # Listar arquivos no diretório atual para debug
            current_dir = Path(".")
            all_files = list(current_dir.iterdir())
            error_msg = f"Nenhum PDF foi encontrado no workspace.\n\n"
            error_msg += f"Diretório atual: {current_dir.resolve()}\n"
            error_msg += f"Arquivos encontrados: {[f.name for f in all_files[:10]]}\n"
            if len(all_files) > 10:
                error_msg += f"... e mais {len(all_files) - 10} arquivos\n"
            raise ValueError(error_msg)
        
        # Carregar os PDFs encontrados
        for pdf_file in unique_pdfs:
            try:
                loader = PyMuPDFLoader(str(pdf_file))
                loaded_docs = loader.load()
                docs.extend(loaded_docs)
                st.success(f"✓ Carregado: {pdf_file.name} ({len(loaded_docs)} páginas)")
            except Exception as e:
                st.error(f"✗ Erro ao carregar {pdf_file.name}: {e}")
        
        if not docs:
            raise ValueError("Nenhum PDF foi encontrado no workspace.")
        
        # Dividir em chunks
        st.info("Dividindo documentos em chunks...")
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)
        st.success(f"✓ {len(chunks)} chunks criados")
        
        # Configurar embeddings
        if USE_GEMINI:
            # Usar Google Gemini embeddings
            st.info("Configurando embeddings...")
            if not GEMINI_AVAILABLE:
                raise ImportError("langchain-google-genai não está instalado")
embeddings = GoogleGenerativeAIEmbeddings(
                model="models/text-embedding-004",
                google_api_key=GOOGLE_API_KEY
            )
            st.success("✓ Embeddings configurados")
        else:
            # Local - usar HuggingFace
            st.info("Baixando modelo de embeddings (apenas na primeira vez)...")
            from langchain_community.embeddings import HuggingFaceEmbeddings
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            st.success("✓ Embeddings configurados (gratuito e sem limites!)")
        
        # Criar vector store
        progress_bar = st.progress(0)
        status_text = st.empty()
        status_text.text(f"Processando {len(chunks)} chunks e criando índice vetorial...")
        
        # Processar em lotes para mostrar progresso
        batch_size = 100
        vectorstore = None
        
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            progress = min((i + len(batch)) / len(chunks), 1.0)
            progress_bar.progress(progress)
            status_text.text(f"Processando chunks {i+1}-{min(i+batch_size, len(chunks))} de {len(chunks)}...")
            
            if vectorstore is None:
                vectorstore = FAISS.from_documents(batch, embeddings)
            else:
                vectorstore.add_documents(batch)
        
        progress_bar.progress(1.0)
        status_text.text("✓ Índice vetorial criado com sucesso!")
        
        # Configurar retriever - ajustado para ser mais permissivo
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}  # Aumentado para 5 resultados e removido threshold muito restritivo
        )
        
        return retriever, len(docs), len(chunks)

# Carregar vectorstore
try:
    retriever, num_docs, num_chunks = load_vectorstore()
    st.sidebar.success(f"✅ Sistema carregado!\n📄 {num_docs} documentos\n📝 {num_chunks} chunks")
except Exception as e:
    st.error(f"Erro ao carregar o sistema: {str(e)}")
    st.stop()

# Prompt RAG
prompt_rag = ChatPromptTemplate.from_messages([
    ("system",
     "Você é um assistente especializado em consultar as Leis Orgânicas de Curitiba, Paraná. "
     "Sua função é responder perguntas sobre leis, artigos e normas brasileiras usando APENAS as informações fornecidas no contexto abaixo. "
     "INSTRUÇÕES IMPORTANTES:\n"
     "1. Use APENAS as informações do contexto fornecido\n"
     "2. Se encontrar informações relevantes, responda de forma clara e completa\n"
     "3. Cite artigos, leis ou normas quando mencionados no contexto\n"
     "4. Se o contexto contém informações sobre o tema perguntado, mesmo que parciais, forneça essas informações\n"
     "5. Apenas diga 'Não encontrei informações' se o contexto realmente não tiver NADA relacionado à pergunta\n"
     "6. Seja útil e forneça o máximo de informações possível do contexto"),
    ("human", "Pergunta: {input}\n\nContexto das Leis Orgânicas de Curitiba:\n{context}\n\nCom base no contexto acima, responda a pergunta de forma completa e precisa.")
])

# Criar chain manualmente para evitar problemas de compatibilidade
def format_docs(docs):
    """Formata os documentos para o contexto"""
    return "\n\n".join(doc.page_content for doc in docs)

def create_rag_chain(llm, prompt):
    """Cria uma chain RAG manualmente"""
    def rag_chain(inputs):
        context = format_docs(inputs.get("context", []))
        formatted_prompt = prompt.format_messages(
            input=inputs.get("input", ""),
            context=context
        )
        response = llm.invoke(formatted_prompt)
        return response.content if hasattr(response, 'content') else str(response)
    return rag_chain

document_chain = create_rag_chain(llm_triagem, prompt_rag)

def perguntar_vade_mecum(pergunta: str) -> Dict:
    """Função principal para consultar o Vade Mecum"""
    try:
  docs_relacionados = retriever.invoke(pergunta)
    except Exception as e:
        return {
            "answer": f"Erro ao buscar informações: {str(e)}",
            "citacoes": [],
            "contexto_encontrado": False
        }
    
    if not docs_relacionados or len(docs_relacionados) == 0:
        return {
            "answer": "Não encontrei informações específicas nas Leis Orgânicas de Curitiba para sua pergunta. Por favor, tente reformular ou ser mais específico. Exemplos: 'Qual o artigo sobre zoneamento urbano?' ou 'O que diz a lei orgânica sobre transporte público?'",
            "citacoes": [],
            "contexto_encontrado": False
        }
    
    # Filtrar documentos muito curtos ou irrelevantes
    docs_filtrados = [doc for doc in docs_relacionados if doc.page_content and len(doc.page_content.strip()) > 50]
    
    if not docs_filtrados:
        return {
            "answer": "Não encontrei informações relevantes nas Leis Orgânicas de Curitiba para sua pergunta. Por favor, tente reformular ou ser mais específico.",
            "citacoes": [],
            "contexto_encontrado": False
        }
    
    try:
        answer = document_chain({
            "input": pergunta,
            "context": docs_filtrados
        })
        
        txt = (answer or "").strip()
        
        # Verificar se a resposta é válida
        if not txt or len(txt) < 30:
            return {
                "answer": "Não consegui gerar uma resposta adequada. Por favor, tente reformular sua pergunta de forma mais específica.",
                "citacoes": docs_filtrados,
                "contexto_encontrado": False
            }
        
        if "não encontrei" in txt.lower() or "não sei" in txt.lower() or "não tenho" in txt.lower():
            return {
                "answer": "Não encontrei informações específicas nas Leis Orgânicas de Curitiba para sua pergunta. Por favor, tente reformular ou ser mais específico.",
                "citacoes": docs_filtrados,
                "contexto_encontrado": False
            }
        
        return {
            "answer": txt,
            "citacoes": docs_filtrados,
            "contexto_encontrado": True
        }
    except Exception as e:
        return {
            "answer": f"Erro ao processar a resposta: {str(e)}. Por favor, tente novamente.",
            "citacoes": docs_filtrados if 'docs_filtrados' in locals() else [],
            "contexto_encontrado": False
        }

# Definir estado do agente
class AgentState(TypedDict, total=False):
  mensagem: str
  triagem: Dict
  resposta: Optional[str]
    citacoes: List
  rag_sucesso: bool
  acao_final: str

# Nós do grafo
def node_triagem(state: AgentState) -> AgentState:
  return {"triagem": triagem(state["mensagem"])}

def node_auto_resolver(state: AgentState) -> AgentState:
    resposta_RAG = perguntar_vade_mecum(state["mensagem"])

  update: AgentState = {
      "resposta": resposta_RAG["answer"],
        "citacoes": resposta_RAG.get("citacoes", []),
      "rag_sucesso": resposta_RAG["contexto_encontrado"]
  }
    if resposta_RAG["contexto_encontrado"]:
    update["acao_final"] = "AUTO_RESOLVER"

  return update

  def node_pedir_info(state: AgentState) -> AgentState:
    faltantes = state["triagem"].get("campos_faltantes", [])
    detalhe = ", ".join(faltantes) if faltantes else "tema e contexto específico"
  return {
        "resposta": f"Para avançar, preciso que você detalhe: {detalhe}",
      "citacoes": [],
      "acao_final": "PEDIR_INFO"
  }

def node_abrir_chamado(state: AgentState) -> AgentState:
    triagem_data = state["triagem"]
    return {
        "resposta": f"Abrindo chamado com urgência {triagem_data['urgencia']}. Descrição: {state['mensagem'][:140]}",
      "citacoes": [],
      "acao_final": "ABRIR_CHAMADO"
  }

# Funções de decisão
KEYWORDS_ABRIR_TICKET = ["aprovação", "exceção", "liberação", "abrir ticket", "acesso especial"]

def decidir_pos_triagem(state: AgentState) -> str:
  decisao = state["triagem"]["decisao"]

    if decisao == "AUTO_RESOLVER":
        return "auto_resolver"
    if decisao == "PEDIR_INFO":
        return "pedir_info"
    if decisao == "ABRIR_CHAMADO":
        return "abrir_chamado"
    
    return "pedir_info"

  def decidir_pos_auto_resolver(state: AgentState) -> str:
  if state["rag_sucesso"]:
    return "end"

  state_da_pergunta = (state["mensagem"] or "").lower()
  if any(k in state_da_pergunta for k in KEYWORDS_ABRIR_TICKET):
    return "abrir_chamado"

  return "pedir_info"

# Criar workflow
@st.cache_resource
def get_workflow():
    """Cria o workflow com cache"""
workflow = StateGraph(AgentState)

workflow.add_node("triagem", node_triagem)
workflow.add_node("auto_resolver", node_auto_resolver)
workflow.add_node("pedir_info", node_pedir_info)
workflow.add_node("abrir_chamado", node_abrir_chamado)

workflow.add_edge(START, "triagem")
    workflow.add_conditional_edges("triagem", decidir_pos_triagem, {
    "auto_resolver": "auto_resolver",
    "pedir_info": "pedir_info",
    "abrir_chamado": "abrir_chamado"
    })

workflow.add_conditional_edges("auto_resolver", decidir_pos_auto_resolver, {
    "pedir_info": "pedir_info",
    "abrir_chamado": "abrir_chamado",
    "end": END
    })
    
workflow.add_edge("pedir_info", END)
workflow.add_edge("abrir_chamado", END)

    return workflow.compile()

grafo = get_workflow()

# Input do usuário
pergunta = st.text_input(
    "Faça sua pergunta sobre as Leis Orgânicas de Curitiba:",
    placeholder="Ex: Qual o artigo sobre zoneamento urbano?",
    key="pergunta_input"
)

if st.button("Consultar", type="primary") or pergunta:
    if pergunta:
        with st.spinner("Processando sua consulta..."):
            try:
                resposta_final = grafo.invoke({"mensagem": pergunta})
                
                # Exibir resposta
                st.markdown("### Resposta:")
                st.info(resposta_final.get("resposta", "Sem resposta"))
                
                # Exibir informações da triagem
                triag = resposta_final.get("triagem", {})
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Decisão", triag.get("decisao", "N/A"))
                with col2:
                    st.metric("Urgência", triag.get("urgencia", "N/A"))
                with col3:
                    st.metric("Ação Final", resposta_final.get("acao_final", "N/A"))
                
                # Exibir citações
                citacoes = resposta_final.get("citacoes", [])
                if citacoes:
                    st.markdown("### 📄 Trechos Relacionados:")
                    for i, c in enumerate(citacoes, 1):
                        with st.expander(f"Trecho {i} - Página {c.metadata.get('page', 'N/A')}"):
                            st.text(c.page_content[:500] + "..." if len(c.page_content) > 500 else c.page_content)
                            st.caption(f"Fonte: {c.metadata.get('source', 'N/A')}")
                
            except Exception as e:
                st.error(f"Erro ao processar consulta: {str(e)}")
                st.exception(e)
    else:
        st.warning("Por favor, digite uma pergunta.")

st.markdown("---")
st.markdown("### 💡 Dicas:")
st.markdown("""
- Faça perguntas específicas sobre leis orgânicas, artigos ou normas de Curitiba
- O sistema busca informações relevantes nas Leis Orgânicas de Curitiba
- As respostas são baseadas apenas no conteúdo do documento
""")
