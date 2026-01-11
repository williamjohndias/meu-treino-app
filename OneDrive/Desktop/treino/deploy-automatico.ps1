# Script de Deploy Automático para GitHub e Vercel
# Execute: .\deploy-automatico.ps1

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 DEPLOY AUTOMÁTICO - MEU TREINO                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configurações
$repoName = "meu-treino-app"
$username = "williamjohndias"

Write-Host "📋 Configurações:" -ForegroundColor Yellow
Write-Host "   Usuário: $username" -ForegroundColor White
Write-Host "   Repositório: $repoName" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Deseja continuar com estas configurações? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    $username = Read-Host "Digite seu usuário do GitHub"
    $repoName = Read-Host "Digite o nome do repositório"
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 1: Criando repositório no GitHub" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Abrindo GitHub no navegador..." -ForegroundColor Yellow
Write-Host "   Por favor, faça login e crie o repositório:" -ForegroundColor White
Write-Host "   1. Clique em 'Create repository'" -ForegroundColor White
Write-Host "   2. Nome: $repoName" -ForegroundColor Green
Write-Host "   3. Deixe como PÚBLICO ou PRIVADO" -ForegroundColor White
Write-Host "   4. NÃO marque 'Initialize with README'" -ForegroundColor Red
Write-Host "   5. Clique em 'Create repository'" -ForegroundColor White
Write-Host ""

Start-Process "https://github.com/new?name=$repoName&description=Aplicação+de+acompanhamento+de+treino+com+projeção+de+carga"

Read-Host "Pressione ENTER após criar o repositório..."

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 2: Configurando Git e fazendo Push" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Remover remote antigo
Write-Host "🔧 Configurando remote..." -ForegroundColor Yellow
git remote remove origin 2>$null

# Adicionar novo remote
$repoUrl = "https://github.com/$username/$repoName.git"
git remote add origin $repoUrl

Write-Host "✅ Remote configurado: $repoUrl" -ForegroundColor Green

# Push
Write-Host ""
Write-Host "📤 Enviando código para GitHub..." -ForegroundColor Yellow

try {
    git push -u origin main 2>&1 | Out-String | Write-Host
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCESSO! Código enviado para GitHub!" -ForegroundColor Green
        Write-Host "   URL: https://github.com/$username/$repoName" -ForegroundColor White
        Write-Host ""
        
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "PASSO 3: Deploy no Vercel" -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🌐 Abrindo Vercel no navegador..." -ForegroundColor Yellow
        Write-Host "   Por favor:" -ForegroundColor White
        Write-Host "   1. Faça login com GitHub" -ForegroundColor White
        Write-Host "   2. Clique em 'Add New Project'" -ForegroundColor White
        Write-Host "   3. Selecione o repositório '$repoName'" -ForegroundColor Green
        Write-Host "   4. Clique em 'Deploy'" -ForegroundColor White
        Write-Host "   5. Aguarde ~30 segundos" -ForegroundColor White
        Write-Host ""
        
        Start-Sleep -Seconds 2
        Start-Process "https://vercel.com/new"
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!                         ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Seu site estará disponível em alguns instantes em:" -ForegroundColor Cyan
        Write-Host "   https://$repoName.vercel.app" -ForegroundColor White
        Write-Host ""
        Write-Host "📝 Importante:" -ForegroundColor Yellow
        Write-Host "   - O Vercel fará deploy automático a cada git push" -ForegroundColor White
        Write-Host "   - Você pode acessar o dashboard em https://vercel.com" -ForegroundColor White
        Write-Host ""
        
    } else {
        throw "Erro ao fazer push"
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o repositório foi criado corretamente" -ForegroundColor White
    Write-Host "2. Você pode precisar fazer login no Git:" -ForegroundColor White
    Write-Host "   git config --global user.name `"Seu Nome`"" -ForegroundColor Gray
    Write-Host "   git config --global user.email `"seu@email.com`"" -ForegroundColor Gray
    Write-Host "3. Tente fazer push manualmente:" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Erro: $_" -ForegroundColor Red
}

