# ☁️ Deploy no Streamlit Cloud (Recomendado para Streamlit)

## 🚀 Passo a Passo Completo

### 1. Fazer Push para GitHub

Se ainda não fez push, execute:

```powershell
# Verificar se já tem remote
git remote -v

# Se não tiver, adicionar (SUBSTITUA SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/consulta-leis-organicas-curitiba.git

# Fazer push
git push -u origin main
```

### 2. Deploy no Streamlit Cloud

1. **Acesse Streamlit Cloud:**
   - Vá para: https://share.streamlit.io
   - Faça login com sua conta **GitHub**

2. **Conectar Repositório:**
   - Clique em **"New app"**
   - Selecione seu repositório: `consulta-leis-organicas-curitiba`
   - Escolha o branch: `main`
   - Arquivo principal: `app.py`

3. **Configurar (IMPORTANTE):**
   
   ⚠️ **O Ollama não funciona no Streamlit Cloud** (precisa rodar localmente)
   
   **Opções:**
   
   **Opção A: Usar Google Gemini (Gratuito)**
   - Vá em "Advanced settings"
   - Adicione variável de ambiente:
     - Key: `GOOGLE_API_KEY`
     - Value: Sua chave do Google Gemini
   - Consulte `COMO_OBTER_API_KEY_GRATUITA.md` para obter a chave
   
   **Opção B: Modificar código para usar Gemini**
   - O código precisa ser ajustado para usar Gemini ao invés de Ollama
   - Posso ajudar a fazer isso se quiser

4. **Deploy:**
   - Clique em **"Deploy"**
   - Aguarde o build (pode levar alguns minutos)
   - Seu app estará online em: `https://consulta-leis-organicas-curitiba.streamlit.app`

### 3. Atualizar o Código (Se necessário)

Se quiser usar Google Gemini no Streamlit Cloud, preciso ajustar o código para detectar se está rodando na nuvem e usar Gemini automaticamente.

---

## 🔄 Atualizar o App

Após fazer mudanças:

```powershell
git add .
git commit -m "Descrição das mudanças"
git push
```

O Streamlit Cloud atualiza automaticamente!

---

## 📝 Checklist

- [ ] Código no GitHub
- [ ] Login no Streamlit Cloud
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas (se usar API)
- [ ] Deploy realizado
- [ ] App funcionando online

---

## 🆘 Problemas Comuns

### "Build failed"
- Verifique `requirements.txt`
- Veja os logs de build no Streamlit Cloud

### "Module not found"
- Adicione a dependência no `requirements.txt`
- Faça commit e push novamente

### "Ollama not found" (no Streamlit Cloud)
- Normal! Ollama não funciona na nuvem
- Use Google Gemini ou outra API

---

**Seu app estará online em minutos!** 🎉

