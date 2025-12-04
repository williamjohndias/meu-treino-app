# 🚀 Instalar Ollama - 100% Gratuito e Sem Limites!

## ✅ Por que Ollama?

- ✅ **100% Gratuito** - Sem custos, sem cartão de crédito
- ✅ **Sem limites de tokens** - Use quanto quiser!
- ✅ **Funciona offline** - Não precisa de internet após instalar os modelos
- ✅ **Privacidade total** - Tudo roda no seu computador
- ✅ **Sem API Key** - Não precisa de cadastros ou chaves
- ✅ **Sem limites de requisições** - Use à vontade!

---

## 📥 Passo 1: Instalar Ollama

1. Acesse: **https://ollama.com/download**
2. Baixe a versão para **Windows**
3. Execute o instalador (`OllamaSetup.exe`)
4. Siga as instruções de instalação
5. Ollama será instalado e iniciado automaticamente

**Tempo estimado**: 2-3 minutos

---

## 📦 Passo 2: Baixar um Modelo

Após instalar, abra o **PowerShell** ou **Prompt de Comando**.

**⚠️ IMPORTANTE:** Se o comando `ollama` não for reconhecido, use o caminho completo:

```powershell
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" pull llama3.2
```

Ou adicione ao PATH (veja o arquivo `ADICIONAR_OLLAMA_AO_PATH.md`).

Depois, execute um dos comandos abaixo:

### Opção 1: Llama 3.2 (Recomendado) ⭐

```bash
ollama pull llama3.2
```

**Características:**
- Tamanho: ~2GB
- Boa qualidade e velocidade
- Suporta português muito bem
- Equilíbrio perfeito entre qualidade e performance

**Tempo de download**: 5-10 minutos (dependendo da internet)

### Opção 2: Mistral (Mais Rápido)

```bash
ollama pull mistral
```

**Características:**
- Tamanho: ~4GB
- Muito rápido
- Excelente qualidade
- Ótimo para respostas rápidas

**Tempo de download**: 10-15 minutos

### Opção 3: Phi-3 (Mais Leve)

```bash
ollama pull phi3
```

**Características:**
- Tamanho: ~2GB
- Leve e eficiente
- Rápido
- Ideal para computadores com menos RAM

**Tempo de download**: 5-10 minutos

### Opção 4: Llama 3.1 (Mais Poderoso)

```bash
ollama pull llama3.1:8b
```

**Características:**
- Tamanho: ~4.7GB
- Melhor qualidade
- Mais lento, mas mais preciso
- Para tarefas mais complexas

**Tempo de download**: 10-15 minutos

---

## ▶️ Passo 3: Verificar Instalação

Execute no terminal para ver os modelos instalados:

```bash
ollama list
```

Você deve ver algo como:
```
NAME            ID              SIZE    MODIFIED
llama3.2        8fdf8c56f1...   2.0 GB  2 hours ago
```

---

## 🎯 Passo 4: Testar Ollama

Teste se está funcionando:

```bash
ollama run llama3.2
```

Digite uma pergunta e veja se responde. Digite `/bye` para sair.

---

## 🚀 Passo 5: Executar a Aplicação

Agora você pode executar:

```bash
python -m streamlit run app.py
```

**A aplicação detectará automaticamente o Ollama e usará o modelo instalado!**

Se você tiver múltiplos modelos, a aplicação tentará usar nesta ordem:
1. `llama3.2` (se disponível)
2. `mistral` (se disponível)
3. `phi3` (se disponível)
4. O primeiro modelo disponível na lista

---

## 💡 Dicas Importantes

### Primeira Execução
- Pode demorar um pouco na primeira vez que usar cada modelo
- O modelo é carregado na memória RAM
- Após carregar, fica mais rápido

### Uso de Memória
- **Llama 3.2**: Precisa de ~4GB de RAM livre
- **Mistral**: Precisa de ~8GB de RAM livre
- **Phi-3**: Precisa de ~4GB de RAM livre
- **Recomendado**: Ter pelo menos 8GB de RAM total no sistema

### Performance
- Funciona melhor com mais RAM disponível
- SSD ajuda no carregamento inicial
- Processador multi-core melhora a velocidade

### Múltiplos Modelos
- Você pode instalar vários modelos
- Cada modelo ocupa espaço no disco
- Escolha o que melhor se adapta às suas necessidades

---

## 🆘 Problemas Comuns

### "Ollama não está rodando"

**Solução:**
1. Procure por "Ollama" no menu Iniciar do Windows
2. Execute o aplicativo Ollama
3. Ou execute no terminal: `ollama serve`
4. Aguarde alguns segundos e tente novamente

### "Nenhum modelo instalado"

**Solução:**
1. Abra o PowerShell ou Prompt de Comando
2. Execute: `ollama pull llama3.2` (ou outro modelo)
3. Aguarde o download completar
4. Verifique com: `ollama list`

### "Erro de conexão" ou "Connection refused"

**Solução:**
1. Verifique se Ollama está rodando (procure no gerenciador de tarefas)
2. Certifique-se de que a porta 11434 não está bloqueada pelo firewall
3. Reinicie o Ollama
4. Tente executar: `ollama serve` manualmente

### "Out of memory" ou "Memória insuficiente"

**Solução:**
1. Feche outros programas que usam muita RAM
2. Use um modelo menor (phi3 ou llama3.2 ao invés de mistral)
3. Reinicie o computador para liberar memória
4. Considere adicionar mais RAM ao sistema

### "Modelo muito lento"

**Solução:**
1. Use um modelo menor (phi3 é o mais rápido)
2. Feche outros programas
3. Certifique-se de ter RAM suficiente
4. Primeira execução sempre é mais lenta (modelo carrega na memória)

---

## 📊 Comparação de Modelos

| Modelo | Tamanho | RAM Necessária | Velocidade | Qualidade | Português |
|--------|---------|----------------|------------|-----------|-----------|
| **llama3.2** | ~2GB | 4GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **mistral** | ~4GB | 8GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **phi3** | ~2GB | 4GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **llama3.1:8b** | ~4.7GB | 8GB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recomendação para este projeto**: **llama3.2** - Melhor equilíbrio!

---

## 🔄 Comandos Úteis

### Listar modelos instalados
```bash
ollama list
```

### Remover um modelo
```bash
ollama rm nome_do_modelo
```

### Ver informações de um modelo
```bash
ollama show llama3.2
```

### Atualizar Ollama
```bash
# Windows: Baixe e instale a versão mais recente do site
# https://ollama.com/download
```

### Parar Ollama
```bash
# Feche o aplicativo Ollama ou use o Gerenciador de Tarefas
```

---

## ✅ Checklist de Instalação

- [ ] Baixei e instalei o Ollama
- [ ] Ollama está rodando (aparece na bandeja do sistema)
- [ ] Baixei pelo menos um modelo (`ollama pull llama3.2`)
- [ ] Verifiquei com `ollama list` que o modelo está instalado
- [ ] Testei com `ollama run llama3.2`
- [ ] Executei `python -m streamlit run app.py`
- [ ] A aplicação detectou o Ollama automaticamente

---

## 🎉 Pronto!

Agora você tem uma solução **100% gratuita, sem limites de tokens e sem necessidade de API key**!

A aplicação detectará automaticamente o Ollama e usará o modelo instalado. Você pode usar à vontade sem se preocupar com limites ou custos!

---

## 📞 Precisa de Ajuda?

Se tiver problemas:
1. Verifique se Ollama está rodando
2. Verifique se há modelos instalados: `ollama list`
3. Consulte a documentação: https://ollama.com/docs
4. Reinicie o Ollama e tente novamente

**Boa sorte com seu projeto!** 🚀

