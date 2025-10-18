# Script PowerShell pour exécuter le seed amélioré avec prix FCFA

Write-Host "🌱 Starting enhanced database seeding with FCFA prices..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Vérifier si Prisma est installé
try {
    $prismaVersion = npx prisma --version
    Write-Host "✅ Prisma CLI available" -ForegroundColor Green
} catch {
    Write-Host "❌ Prisma CLI not found. Installing..." -ForegroundColor Yellow
    npm install prisma @prisma/client
}

Write-Host "🔄 Step 1: Renaming images to match product IDs..." -ForegroundColor Blue
try {
    node scripts/rename-images-to-product-ids.js
    Write-Host "✅ Images renamed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Image renaming failed, continuing with seeding..." -ForegroundColor Yellow
}

Write-Host "🔄 Step 2: Running enhanced database seeding..." -ForegroundColor Blue
try {
    node prisma/seed-enhanced.js
    Write-Host "✅ Enhanced seeding completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Seeding failed. Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Step 3: Generating Prisma client..." -ForegroundColor Blue
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Prisma client generation failed" -ForegroundColor Yellow
}

Write-Host "🎉 Enhanced database seeding completed!" -ForegroundColor Green
Write-Host "📊 Features added:" -ForegroundColor Cyan
Write-Host "   • 16 products with FCFA prices" -ForegroundColor White
Write-Host "   • Images renamed to match product IDs" -ForegroundColor White
Write-Host "   • Enhanced categories and brands" -ForegroundColor White
Write-Host "   • Product variants with attributes" -ForegroundColor White
Write-Host "   • Currency set to FCFA" -ForegroundColor White

Write-Host "🚀 You can now start your application!" -ForegroundColor Green
