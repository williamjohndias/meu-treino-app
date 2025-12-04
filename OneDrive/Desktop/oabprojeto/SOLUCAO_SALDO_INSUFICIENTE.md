# 💰 Problema: Saldo Insuficiente no DeepSeek

## ❌ Erro Encontrado

```
Error code: 402 - Insufficient Balance
```

Isso significa que sua conta DeepSeek não tem crédito suficiente para usar a API.

## ✅ Soluções

### Opção 1: Adicionar Crédito ao DeepSeek (Recomendado se quiser usar DeepSeek)

1. Acesse: https://platform.deepseek.com/billing
2. Clique em "Top Up" ou "Adicionar Crédito"
3. Adicione pelo menos **US$ 2** (ou equivalente)
4. Complete o pagamento

**Vantagens do DeepSeek:**
- Preços muito baixos (~$0.14 por 1M tokens)
- Boa qualidade
- Suporte a português

---

### Opção 2: Usar Google Gemini (Gratuito)

O Google Gemini oferece um plano gratuito generoso:

1. Obtenha uma chave em: https://aistudio.google.com/app/apikey
2. Edite o arquivo `.env`:
   ```
   GOOGLE_API_KEY=sua_chave_gemini_aqui
   ```
3. O código precisa ser ajustado para usar Gemini novamente

**Limites Gratuitos:**
- Gemini 1.5 Flash: 15 requisições/minuto, 1.500/dia
- Suficiente para este projeto!

---

### Opção 3: Usar Modelo Local (Completamente Gratuito)

Podemos configurar para usar modelos locais gratuitos como:
- Ollama (com modelos como Llama, Mistral, etc.)
- Modelos do HuggingFace rodando localmente

**Vantagens:**
- 100% gratuito
- Funciona offline
- Sem limites de uso

**Desvantagens:**
- Requer mais recursos do computador
- Pode ser mais lento

---

## 🚀 Qual Opção Escolher?

- **Quer algo rápido e fácil?** → Opção 2 (Google Gemini gratuito)
- **Quer o melhor custo-benefício?** → Opção 1 (Adicionar crédito DeepSeek)
- **Quer 100% gratuito sem limites?** → Opção 3 (Modelo local)

Qual opção você prefere? Posso ajudar a configurar qualquer uma delas!

