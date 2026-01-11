# Script para configurar o Supabase automaticamente
# Execute: .\setup-supabase.ps1

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       🗄️  CONFIGURAÇÃO DO SUPABASE                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Etapas:" -ForegroundColor Yellow
Write-Host "   1. Abrir SQL Editor do Supabase" -ForegroundColor White
Write-Host "   2. Copiar e executar o script SQL" -ForegroundColor White
Write-Host "   3. Verificar a criação da tabela" -ForegroundColor White
Write-Host "   4. Testar a integração" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 1: Abrir SQL Editor" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 Abrindo SQL Editor do Supabase..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "https://supabase.com/dashboard/project/nkbwiyvrblvylwibaxoy/editor"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 2: Copiar Script SQL" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📄 Abrindo arquivo SQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
Start-Process "notepad.exe" -ArgumentList "supabase-setup.sql"

Write-Host ""
Write-Host "⚡ INSTRUÇÕES:" -ForegroundColor Red
Write-Host ""
Write-Host "   1. No SQL Editor que abriu:" -ForegroundColor White
Write-Host "      - Clique em 'New query'" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. No Notepad que abriu:" -ForegroundColor White
Write-Host "      - Selecione TODO o texto (Ctrl+A)" -ForegroundColor Gray
Write-Host "      - Copie (Ctrl+C)" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Volte ao SQL Editor:" -ForegroundColor White
Write-Host "      - Cole o código (Ctrl+V)" -ForegroundColor Gray
Write-Host "      - Clique em 'Run' ou pressione Ctrl+Enter" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Aguarde a mensagem 'Success' ✅" -ForegroundColor White
Write-Host ""

Read-Host "Pressione ENTER após executar o SQL no Supabase"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 3: Verificar Tabela" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Abrindo Table Editor..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
Start-Process "https://supabase.com/dashboard/project/nkbwiyvrblvylwibaxoy/editor"

Write-Host ""
Write-Host "✅ Verifique se a tabela 'workouts' foi criada" -ForegroundColor Yellow
Write-Host "   - No menu lateral, clique em 'Table Editor'" -ForegroundColor White
Write-Host "   - Você deve ver a tabela 'workouts'" -ForegroundColor White
Write-Host ""

Read-Host "Pressione ENTER se a tabela foi criada com sucesso"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 4: Testar Integração" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Abrindo aplicação..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
Start-Process "index.html"

Write-Host ""
Write-Host "📝 Para testar:" -ForegroundColor Yellow
Write-Host "   1. Adicione um exercício de teste" -ForegroundColor White
Write-Host "   2. Abra o Console do navegador (F12)" -ForegroundColor White
Write-Host "   3. Procure por mensagens como:" -ForegroundColor White
Write-Host "      ✅ Supabase conectado" -ForegroundColor Green
Write-Host "      ✅ Treino salvo no Supabase" -ForegroundColor Green
Write-Host ""
Write-Host "   4. Volte ao Supabase Table Editor" -ForegroundColor White
Write-Host "   5. Atualize a página (F5)" -ForegroundColor White
Write-Host "   6. Veja seu treino salvo na tabela!" -ForegroundColor White
Write-Host ""

Read-Host "Pressione ENTER quando terminar de testar"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           ✅ CONFIGURAÇÃO CONCLUÍDA!                     ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Seu app agora está conectado ao Supabase!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Próximos passos:" -ForegroundColor Yellow
Write-Host "   • Seus treinos serão salvos automaticamente na nuvem" -ForegroundColor White
Write-Host "   • Acesse de qualquer dispositivo" -ForegroundColor White
Write-Host "   • Dados sincronizados em tempo real" -ForegroundColor White
Write-Host ""
Write-Host "Mais informacoes: SUPABASE_SETUP.md" -ForegroundColor Gray
Write-Host ""

