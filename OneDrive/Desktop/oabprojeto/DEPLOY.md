# 🚀 Guia de Deploy - GitHub e Streamlit Cloud

## 📦 Preparar para GitHub

### 1. Inicializar Git (se ainda não foi feito)

```bash
git init
```

### 2. Adicionar arquivos

```bash
git add .
```

### 3. Fazer commit inicial

```bash
git commit -m "Initial commit: Sistema de consulta às Leis Orgânicas de Curitiba"
```

### 4. Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Crie um novo repositório (ex: `consulta-leis-organicas-curitiba`)
3. **NÃO** inicialize com README (já temos um)

### 5. Conectar e fazer push

```bash
git remote add origin https://github.com/SEU_USUARIO/consulta-leis-organicas-curitiba.git
git branch -M main
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

---

## ☁️ Deploy no Streamlit Cloud

### Opção 1: Deploy Automático (Recomendado)

1. **Faça push do código para GitHub** (siga os passos acima)

2. **Acesse Streamlit Cloud:**
   - Vá para: https://share.streamlit.io
   - Faça login com sua conta GitHub

3. **Conectar Repositório:**
   - Clique em "New app"
   - Selecione seu repositório
   - Escolha o branch (geralmente `main`)
   - Defina o arquivo principal: `app.py`

4. **Configurar (se necessário):**
   - Se usar API externa, adicione variáveis de ambiente:
     - `GOOGLE_API_KEY` (se usar Gemini)
     - Ou outras conforme necessário

5. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build e deploy automático

### ⚠️ Importante para Streamlit Cloud

**O Ollama não funciona no Streamlit Cloud** (precisa rodar localmente). 

**Opções:**

1. **Usar Google Gemini** (gratuito):
   - Altere o código para usar `ChatGoogleGenerativeAI`
   - Adicione `GOOGLE_API_KEY` nas variáveis de ambiente do Streamlit
   - Consulte `COMO_OBTER_API_KEY_GRATUITA.md`

2. **Manter local com Ollama:**
   - Use apenas localmente
   - Não faça deploy no Streamlit Cloud

3. **Usar outro serviço:**
   - HuggingFace Inference API
   - OpenAI (pago)
   - Outras APIs compatíveis

---

## 🔄 Atualizar o Repositório

Após fazer mudanças:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

O Streamlit Cloud atualiza automaticamente!

---

## 📝 Checklist de Deploy

- [ ] Código commitado no Git
- [ ] Repositório criado no GitHub
- [ ] Push realizado com sucesso
- [ ] Streamlit Cloud conectado ao repositório
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Deploy realizado com sucesso
- [ ] Aplicação funcionando online

---

## 🆘 Problemas Comuns

### "Build failed"
- Verifique se `requirements.txt` está correto
- Verifique se todas as dependências estão listadas
- Veja os logs de build no Streamlit Cloud

### "App not found"
- Verifique se o arquivo principal está correto (`app.py`)
- Verifique se o branch está correto

### "Module not found"
- Adicione a dependência faltante no `requirements.txt`
- Faça novo commit e push

---

**Pronto! Seu app estará online!** 🎉

