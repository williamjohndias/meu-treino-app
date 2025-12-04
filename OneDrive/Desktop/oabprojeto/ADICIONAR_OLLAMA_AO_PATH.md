# 🔧 Adicionar Ollama ao PATH do Windows

## ✅ Problema Resolvido!

O modelo **llama3.2** foi baixado com sucesso! 

Mas para usar o comando `ollama` diretamente no PowerShell, você precisa adicioná-lo ao PATH.

## 🚀 Solução Rápida (Temporária)

Para usar o Ollama nesta sessão do PowerShell, execute:

```powershell
$env:Path += ";$env:LOCALAPPDATA\Programs\Ollama"
```

Agora você pode usar:
```bash
ollama list
ollama pull mistral
ollama run llama3.2
```

## 🔧 Solução Permanente

Para adicionar o Ollama ao PATH permanentemente:

### Método 1: Via Interface Gráfica (Recomendado)

1. Pressione `Win + R`
2. Digite: `sysdm.cpl` e pressione Enter
3. Clique na aba **"Avançado"**
4. Clique em **"Variáveis de Ambiente"**
5. Na seção **"Variáveis do sistema"**, encontre **"Path"** e clique em **"Editar"**
6. Clique em **"Novo"**
7. Cole este caminho: `%LOCALAPPDATA%\Programs\Ollama`
8. Clique em **"OK"** em todas as janelas
9. **Feche e reabra o PowerShell** para aplicar as mudanças

### Método 2: Via PowerShell (Como Administrador)

1. Abra o PowerShell **como Administrador** (clique com botão direito → Executar como administrador)
2. Execute:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:LOCALAPPDATA\Programs\Ollama", [EnvironmentVariableTarget]::Machine)
```

3. Feche e reabra o PowerShell

## ✅ Verificar se Funcionou

Abra um **novo** PowerShell e execute:

```bash
ollama list
```

Se mostrar a lista de modelos, está funcionando! 🎉

## 📝 Comandos Úteis

Agora você pode usar diretamente:

```bash
# Listar modelos instalados
ollama list

# Baixar um novo modelo
ollama pull mistral
ollama pull phi3

# Executar um modelo
ollama run llama3.2

# Ver informações de um modelo
ollama show llama3.2
```

## 🆘 Se Não Funcionar

Se ainda não funcionar após adicionar ao PATH:

1. **Use o caminho completo temporariamente:**
   ```powershell
   & "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" list
   ```

2. **Ou adicione um alias no PowerShell:**
   ```powershell
   Set-Alias -Name ollama -Value "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
   ```
   (Isso funciona apenas na sessão atual)

---

**Pronto! Agora você pode usar o Ollama normalmente!** 🚀

