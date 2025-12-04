# 📝 Comandos Git para Subir no GitHub

## ⚠️ IMPORTANTE: Execute estes comandos no PowerShell dentro da pasta do projeto

Abra o PowerShell na pasta: `C:\Users\willi\OneDrive\Desktop\oabprojeto`

## 🚀 Passo a Passo

### 1. Verificar se está na pasta correta

```powershell
pwd
# Deve mostrar: C:\Users\willi\OneDrive\Desktop\oabprojeto
```

### 2. Adicionar arquivos ao Git

```powershell
git add .gitignore
git add README.md
git add DEPLOY.md
git add app.py
git add requirements.txt
git add .streamlit/config.toml
git add INSTALAR_OLLAMA.md
git add COMO_OBTER_API_KEY_GRATUITA.md
```

**OU adicionar tudo de uma vez (cuidado com arquivos grandes):**

```powershell
git add .
```

### 3. Verificar o que será commitado

```powershell
git status
```

### 4. Fazer o commit inicial

```powershell
git commit -m "Initial commit: Sistema de consulta às Leis Orgânicas de Curitiba"
```

### 5. Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `consulta-leis-organicas-curitiba` (ou outro nome)
3. **NÃO marque** "Add a README file" (já temos)
4. Clique em "Create repository"

### 6. Conectar ao GitHub e fazer push

**Substitua `SEU_USUARIO` pelo seu usuário do GitHub:**

```powershell
git remote add origin https://github.com/SEU_USUARIO/consulta-leis-organicas-curitiba.git
git branch -M main
git push -u origin main
```

Se pedir credenciais, use um **Personal Access Token** do GitHub (não sua senha).

---

## 🔑 Criar Personal Access Token (se necessário)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Marque: `repo` (acesso completo aos repositórios)
4. Copie o token gerado
5. Use o token como senha ao fazer push

---

## ✅ Verificar se funcionou

Acesse seu repositório no GitHub:
```
https://github.com/SEU_USUARIO/consulta-leis-organicas-curitiba
```

Você deve ver todos os arquivos lá!

---

## 📦 Próximo Passo: Deploy no Streamlit Cloud

Consulte o arquivo `DEPLOY.md` para instruções completas!

---

## 🆘 Problemas?

### "fatal: not a git repository"
- Execute: `git init` primeiro

### "fatal: remote origin already exists"
- Execute: `git remote remove origin` e tente novamente

### "Permission denied"
- Verifique suas credenciais do GitHub
- Use Personal Access Token ao invés de senha

---

**Pronto! Seu código estará no GitHub!** 🎉

