# 🔑 Como Obter Chave API Gratuita do Google Gemini

## ✅ Passo a Passo Completo

### 1️⃣ Acesse o Google AI Studio

Abra seu navegador e acesse:
**https://aistudio.google.com/app/apikey**

### 2️⃣ Faça Login

1. Clique em **"Entrar"** ou **"Sign in"**
2. Use sua conta Google (Gmail)
3. Se não tiver conta, crie uma gratuitamente em: https://accounts.google.com/signup

### 3️⃣ Criar Nova Chave de API

1. Após fazer login, você verá a página do Google AI Studio
2. Clique no botão **"Criar chave"** ou **"Get API key"** 
   - Geralmente aparece no canto superior direito ou no centro da página
3. Se for a primeira vez, pode pedir para criar um projeto Google Cloud (é gratuito)
   - Clique em **"Criar projeto"** ou **"Create project"**
   - Dê um nome ao projeto (ex: "VadeMecum")
   - Clique em **"Criar"**
4. A chave será gerada automaticamente e exibida na tela

### 4️⃣ Copiar a Chave

⚠️ **IMPORTANTE**: Copie a chave imediatamente! Ela só será mostrada uma vez.

A chave terá um formato similar a:
```
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### 5️⃣ Configurar no Projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Cole a chave substituindo o texto `sua_chave_api_aqui`:

```
GOOGLE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

3. **Salve o arquivo** (Ctrl+S)

### 6️⃣ Executar a Aplicação

No terminal, execute:
```bash
python -m streamlit run app.py
```

A aplicação abrirá automaticamente no seu navegador em `http://localhost:8501`

---

## 💰 Limites Gratuitos do Google Gemini

O plano gratuito oferece limites generosos:

### Gemini 1.5 Flash (Recomendado para este projeto)
- ✅ **15 requisições por minuto**
- ✅ **1.500 requisições por dia**
- ✅ **Totalmente gratuito!**
- ✅ **Sem necessidade de cartão de crédito**

### Gemini 1.5 Pro
- ✅ **2 requisições por minuto**
- ✅ **50 requisições por dia**
- ✅ **Totalmente gratuito!**

**Para este projeto, o Gemini 1.5 Flash é mais que suficiente!**

---

## 🔒 Segurança

⚠️ **NUNCA compartilhe sua chave de API publicamente!**

- ❌ Não faça commit do arquivo `.env` no Git
- ❌ Não compartilhe a chave em fóruns ou redes sociais
- ❌ Não publique a chave em repositórios públicos
- ✅ Se sua chave for exposta, revogue-a imediatamente no Google AI Studio e crie uma nova

### Como Revogar uma Chave

1. Acesse: https://aistudio.google.com/app/apikey
2. Encontre a chave que deseja revogar
3. Clique em **"Excluir"** ou **"Delete"**
4. Confirme a exclusão
5. Crie uma nova chave se necessário

---

## 🆘 Problemas Comuns

### "Não consigo criar a chave"
- ✅ Certifique-se de estar logado com uma conta Google válida
- ✅ Tente usar outro navegador (Chrome, Firefox, Edge)
- ✅ Limpe o cache do navegador
- ✅ Desative temporariamente extensões do navegador

### "Erro: API key not valid"
- ✅ Verifique se copiou a chave completa (sem espaços no início ou fim)
- ✅ Certifique-se de que o arquivo `.env` está na raiz do projeto (mesmo diretório do `app.py`)
- ✅ Verifique se não há aspas extras na chave no arquivo `.env`
- ✅ Certifique-se de que salvou o arquivo após editar

### "Limite de requisições excedido"
- ✅ Você atingiu o limite diário/mensal gratuito
- ✅ Aguarde algumas horas (os limites são resetados)
- ✅ Considere usar o Gemini 1.5 Flash que tem limites mais generosos
- ✅ Se precisar de mais, considere o plano pago (mas o gratuito é suficiente para testes)

### "Erro 429: Too Many Requests"
- ✅ Você está fazendo muitas requisições muito rápido
- ✅ Aguarde alguns segundos entre requisições
- ✅ O limite é 15 requisições por minuto para Flash

---

## 📊 Comparação de Modelos

| Modelo | Requisições/Min | Requisições/Dia | Uso Recomendado |
|--------|----------------|-----------------|-----------------|
| **Gemini 1.5 Flash** | 15 | 1.500 | ✅ **Recomendado para este projeto** |
| Gemini 1.5 Pro | 2 | 50 | Para tarefas mais complexas |

---

## 💡 Dicas

1. **Use Gemini 1.5 Flash**: É mais rápido e tem limites mais generosos
2. **Monitore seu uso**: Acompanhe quantas requisições você está fazendo
3. **Cache**: O Streamlit usa cache, então consultas repetidas não consomem tokens
4. **Otimize perguntas**: Faça perguntas específicas para obter melhores respostas

---

## 📞 Suporte

Se tiver problemas, consulte:
- **Documentação oficial**: https://ai.google.dev/docs
- **Status da API**: https://status.cloud.google.com/
- **Fórum da comunidade**: https://developers.googleblog.com/

---

## ✅ Checklist Rápido

- [ ] Acessei https://aistudio.google.com/app/apikey
- [ ] Fiz login com minha conta Google
- [ ] Criei uma nova chave de API
- [ ] Copiei a chave imediatamente
- [ ] Editei o arquivo `.env` na raiz do projeto
- [ ] Adicionei: `GOOGLE_API_KEY=minha_chave_aqui`
- [ ] Salvei o arquivo `.env`
- [ ] Executei: `python -m streamlit run app.py`
- [ ] A aplicação abriu no navegador

---

**Pronto! Agora você tem acesso gratuito ao Google Gemini!** 🎉

