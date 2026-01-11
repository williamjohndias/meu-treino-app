# 🚀 Guia de Deploy - Meu Treino

## Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Nome do repositório: `meu-treino` (ou o nome que preferir)
5. Deixe como **público** ou **privado** (sua escolha)
6. **NÃO** marque "Initialize with README" (já temos um)
7. Clique em "Create repository"

## Passo 2: Conectar Repositório Local ao GitHub

Execute no terminal (substitua `SEU_USUARIO` pelo seu usuário do GitHub):

```bash
git remote set-url origin https://github.com/SEU_USUARIO/meu-treino.git
git push -u origin main
```

Ou se preferir criar um novo remote:

```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/meu-treino.git
git push -u origin main
```

## Passo 3: Deploy no Vercel

### Opção A: Via Interface Web (Recomendado)

1. Acesse [Vercel](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Selecione o repositório `meu-treino`
4. Vercel detectará automaticamente as configurações
5. Clique em "Deploy"
6. Aguarde alguns segundos e seu site estará no ar! 🎉

### Opção B: Via CLI

```bash
npm i -g vercel
vercel login
vercel
```

Siga as instruções na tela.

## ✅ Pronto!

Seu site estará disponível em uma URL como: `https://meu-treino.vercel.app`

O Vercel fará deploy automático sempre que você fizer push no GitHub!

