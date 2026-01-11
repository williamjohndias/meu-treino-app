# Script de Deploy Completo - Automatizado
# Execute: .\deploy-completo.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                 🚀 DEPLOY AUTOMÁTICO                        ║" -ForegroundColor Cyan
Write-Host "║              Meu Treino - Deploy Completo                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configurações
$username = "williamjohndias"
$repoName = "meu-treino-app"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "📋 Configurações do Deploy:" -ForegroundColor Yellow
Write-Host "   Usuário GitHub: $username" -ForegroundColor White
Write-Host "   Repositório: $repoName" -ForegroundColor White
Write-Host "   URL: $repoUrl" -ForegroundColor White
Write-Host ""

# PASSO 1: Criar repositório no GitHub
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "ETAPA 1/3: Criando Repositório no GitHub" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Abrindo GitHub no navegador..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   ⚡ AÇÃO NECESSÁRIA:" -ForegroundColor Red
Write-Host "   1. Uma página do GitHub vai abrir" -ForegroundColor White
Write-Host "   2. Faça login se necessário" -ForegroundColor White
Write-Host "   3. O nome já estará preenchido: $repoName" -ForegroundColor Green
Write-Host "   4. NÃO marque 'Initialize with README'" -ForegroundColor Red
Write-Host "   5. Clique no botão verde 'Create repository'" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 2
Start-Process "https://github.com/new?name=$repoName&description=Aplicação+de+acompanhamento+de+treino+com+projeção+de+carga+e+rotina+semanal"

Write-Host "⏳ Aguardando você criar o repositório..." -ForegroundColor Yellow
Read-Host "Pressione ENTER após criar o repositório no GitHub"

# PASSO 2: Configurar Git e fazer Push
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "ETAPA 2/3: Enviando Código para GitHub" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "🔧 Configurando remote do Git..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    Write-Host "✅ Remote configurado!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📤 Enviando código para GitHub..." -ForegroundColor Yellow
    $pushOutput = git push -u origin main 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Código enviado com sucesso!" -ForegroundColor Green
        Write-Host ""
        
        # PASSO 3: Deploy no Vercel
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "ETAPA 3/3: Deploy no Vercel" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🌐 Abrindo Vercel no navegador..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   ⚡ AÇÃO NECESSÁRIA:" -ForegroundColor Red
        Write-Host "   1. Faça login com GitHub" -ForegroundColor White
        Write-Host "   2. Clique em 'Add New Project'" -ForegroundColor White
        Write-Host "   3. Procure por '$repoName'" -ForegroundColor Green
        Write-Host "   4. Clique em 'Import' ao lado do repositório" -ForegroundColor White
        Write-Host "   5. Clique em 'Deploy' (não precisa mudar nada!)" -ForegroundColor Green
        Write-Host ""
        
        Start-Sleep -Seconds 2
        Start-Process "https://vercel.com/new"
        
        Write-Host "⏳ Aguardando você fazer deploy no Vercel..." -ForegroundColor Yellow
        Read-Host "Pressione ENTER após iniciar o deploy no Vercel"
        
        Write-Host ""
        Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                  ✅ DEPLOY CONCLUÍDO!                       ║" -ForegroundColor Green
        Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Parabéns! Seu site está sendo publicado!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📍 URLs:" -ForegroundColor Yellow
        Write-Host "   GitHub: https://github.com/$username/$repoName" -ForegroundColor White
        Write-Host "   Vercel: https://$repoName.vercel.app" -ForegroundColor White
        Write-Host "           (ou a URL que o Vercel mostrou)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "💡 Dica: O Vercel fará deploy automático sempre que você fizer 'git push'!" -ForegroundColor Cyan
        Write-Host ""
        
        # Abrir o site
        Write-Host "🌐 Abrindo seu repositório no GitHub..." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        Start-Process "https://github.com/$username/$repoName"
        
    } else {
        throw "Erro ao fazer push para o GitHub"
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erro durante o deploy!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalhes do erro:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "   1. Certifique-se de que criou o repositório no GitHub" -ForegroundColor White
    Write-Host "   2. Verifique se está logado no Git:" -ForegroundColor White
    Write-Host "      git config --global user.name `"Seu Nome`"" -ForegroundColor Gray
    Write-Host "      git config --global user.email `"seu@email.com`"" -ForegroundColor Gray
    Write-Host "   3. Verifique suas credenciais do GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Você pode tentar fazer push manualmente:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

