# Script para configurar e fazer push para GitHub
# Execute: .\setup-github.ps1

Write-Host "🚀 Configuração do Repositório GitHub" -ForegroundColor Cyan
Write-Host ""

# Solicitar nome do repositório
$repoName = Read-Host "Digite o nome do repositório (ex: meu-treino)"
$username = Read-Host "Digite seu usuário do GitHub (ex: williamjohndias)"

# Remover remote antigo se existir
Write-Host "`n📝 Configurando remote..." -ForegroundColor Yellow
git remote remove origin 2>$null

# Adicionar novo remote
$repoUrl = "https://github.com/$username/$repoName.git"
git remote add origin $repoUrl

Write-Host "✅ Remote configurado: $repoUrl" -ForegroundColor Green
Write-Host ""

# Verificar se o repositório existe
Write-Host "⚠️  IMPORTANTE: Certifique-se de que o repositório '$repoName' já existe no GitHub!" -ForegroundColor Yellow
Write-Host "   Se ainda não criou, acesse: https://github.com/new" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "O repositório já foi criado no GitHub? (s/n)"

if ($confirm -eq "s" -or $confirm -eq "S") {
    Write-Host "`n📤 Fazendo push para GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Sucesso! Código enviado para GitHub!" -ForegroundColor Green
        Write-Host "`n🌐 Próximo passo: Deploy no Vercel" -ForegroundColor Cyan
        Write-Host "   1. Acesse: https://vercel.com" -ForegroundColor White
        Write-Host "   2. Faça login com GitHub" -ForegroundColor White
        Write-Host "   3. Clique em 'Add New Project'" -ForegroundColor White
        Write-Host "   4. Selecione o repositório '$repoName'" -ForegroundColor White
        Write-Host "   5. Clique em 'Deploy'" -ForegroundColor White
    } else {
        Write-Host "`n❌ Erro ao fazer push. Verifique se:" -ForegroundColor Red
        Write-Host "   - O repositório existe no GitHub" -ForegroundColor Red
        Write-Host "   - Você tem permissão para fazer push" -ForegroundColor Red
        Write-Host "   - Sua autenticação está configurada" -ForegroundColor Red
    }
} else {
    Write-Host "`n📋 Instruções para criar o repositório:" -ForegroundColor Cyan
    Write-Host "   1. Acesse: https://github.com/new" -ForegroundColor White
    Write-Host "   2. Nome: $repoName" -ForegroundColor White
    Write-Host "   3. Deixe como público ou privado" -ForegroundColor White
    Write-Host "   4. NÃO marque 'Initialize with README'" -ForegroundColor White
    Write-Host "   5. Clique em 'Create repository'" -ForegroundColor White
    Write-Host "   6. Execute este script novamente" -ForegroundColor White
}

