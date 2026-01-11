# ⚡ Deploy Rápido - Meu Treino

## 🎯 Passo a Passo Simplificado

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `meu-treino` (ou outro nome)
3. Público ou Privado (sua escolha)
4. **NÃO** marque "Initialize with README"
5. Clique em "Create repository"

### 2️⃣ Configurar e Fazer Push

**Opção A: Usar o script automático (Windows PowerShell)**
```powershell
.\setup-github.ps1
```

**Opção B: Manual**
```bash
# Substitua SEU_USUARIO e NOME_REPO
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git
git push -u origin main
```

### 3️⃣ Deploy no Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `meu-treino`
5. Clique em **"Deploy"**
6. Aguarde ~30 segundos
7. ✅ Seu site estará no ar!

## 🔗 URLs

- **GitHub**: `https://github.com/SEU_USUARIO/meu-treino`
- **Vercel**: `https://meu-treino.vercel.app` (ou URL personalizada)

## 🔄 Deploy Automático

O Vercel fará deploy automático sempre que você fizer `git push`!

