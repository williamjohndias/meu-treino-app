# 🚀 Deploy Rápido - GitHub + Streamlit Cloud

## ✅ Código Ajustado!

O código agora detecta automaticamente:
- **Localmente**: Usa Ollama (gratuito, sem limites)
- **Streamlit Cloud**: Usa Google Gemini (gratuito, com limites)

## 📝 Passos para Deploy

### 1. Fazer Push para GitHub

```powershell
# Verificar status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Ajusta código para funcionar no Streamlit Cloud"

# Se ainda não tem remote, adicionar (SUBSTITUA SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/consulta-leis-organicas-curitiba.git

# Push
git push -u origin main
```

### 2. Deploy no Streamlit Cloud

1. **Acesse:** https://share.streamlit.io
2. **Login** com GitHub
3. **New app:**
   - Repository: Seu repositório
   - Branch: `main`
   - Main file: `app.py`
4. **Advanced settings:**
   - Adicione secret:
     - Key: `GOOGLE_API_KEY`
     - Value: Sua chave do Google Gemini
5. **Deploy!**

### 3. Obter Chave do Google Gemini (Gratuita)

1. Acesse: https://aistudio.google.com/app/apikey
2. Crie uma chave
3. Copie e cole no Streamlit Cloud

**Limites Gratuitos:**
- 15 requisições/minuto
- 1.500 requisições/dia

---

## 🎯 Seu App Estará Online!

URL será algo como:
```
https://consulta-leis-organicas-curitiba.streamlit.app
```

---

## ✅ Pronto!

Agora é só fazer push e deploy! 🚀

