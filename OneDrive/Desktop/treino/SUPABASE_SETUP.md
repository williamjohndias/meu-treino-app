# 🗄️ Configuração do Supabase - Guia Rápido

## ✅ O que já foi configurado:

- ✅ Cliente Supabase adicionado ao projeto
- ✅ Credenciais configuradas
- ✅ JavaScript atualizado para usar Supabase
- ✅ Script SQL pronto

## 📋 Configurar o Banco de Dados (2 minutos):

### Passo 1: Acessar o SQL Editor

1. Acesse: https://supabase.com/dashboard/project/nkbwiyvrblvylwibaxoy/editor
2. Faça login no Supabase se necessário

### Passo 2: Executar o Script SQL

1. No SQL Editor, clique em **"New query"**
2. Copie TODO o conteúdo do arquivo `supabase-setup.sql`
3. Cole no editor
4. Clique em **"Run"** (ou pressione Ctrl+Enter)
5. Aguarde a mensagem de sucesso ✅

### Passo 3: Verificar a Tabela

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver a tabela **"workouts"** criada
3. A tabela deve ter as colunas:
   - `id` (bigint)
   - `exercise_name` (text)
   - `sets` (integer)
   - `reps` (integer)
   - `weight` (numeric)
   - `workout_date` (date)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## 🚀 Testar a Integração

1. Abra o arquivo `index.html` no navegador
2. Adicione um exercício de teste
3. Abra o Console do navegador (F12) e veja:
   ```
   ✅ Supabase conectado: https://nkbwiyvrblvylwibaxoy.supabase.co
   ✅ Dados carregados do Supabase: 0 treinos
   ✅ Treino salvo no Supabase: {...}
   ```
4. Volte ao Supabase Table Editor e veja o treino salvo!

## 🔄 Funcionalidades Implementadas

### ✅ Salvamento Automático na Nuvem
- Todos os treinos são salvos automaticamente no Supabase
- Backup local no localStorage como fallback

### ✅ Sincronização em Tempo Real
- Seus dados ficam sincronizados entre dispositivos
- Acesse de qualquer lugar!

### ✅ Modo Offline
- Se perder conexão, o app continua funcionando
- Usa dados salvos localmente como backup

### ✅ Loading Automático
- Indicador visual quando carrega/salva dados
- Notificações de sucesso/erro

## 🔐 Segurança

⚠️ **IMPORTANTE**: A tabela está configurada com acesso público para facilitar o desenvolvimento.

**Para produção, você deve:**
1. Implementar autenticação de usuários
2. Configurar RLS (Row Level Security) adequado
3. Criar políticas específicas por usuário

### Como adicionar autenticação (opcional):

```sql
-- Modificar política para aceitar apenas usuários autenticados
DROP POLICY IF EXISTS "Permitir acesso público completo aos treinos" ON workouts;

CREATE POLICY "Usuários podem ver apenas seus treinos"
ON workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios treinos"
ON workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 📊 Estrutura do Banco

```
workouts
├── id (PK)                 # ID único do treino
├── exercise_name           # Nome do exercício
├── sets                    # Número de séries
├── reps                    # Número de repetições
├── weight                  # Carga em kg
├── workout_date            # Data do treino
├── created_at              # Data de criação
└── updated_at              # Data de atualização
```

## 🐛 Solução de Problemas

### Erro: "relation workouts does not exist"
→ Execute o script SQL novamente

### Erro: "Invalid API key"
→ Verifique as credenciais em `supabase-config.js`

### Dados não aparecem
→ Abra o Console (F12) e verifique os logs
→ Verifique se a tabela foi criada no Supabase

### Modo offline aparece mesmo online
→ Verifique sua conexão com internet
→ Verifique o Console para erros

## 🎉 Pronto!

Seu app agora está conectado ao Supabase! 

Os treinos serão salvos na nuvem automaticamente. 🚀

