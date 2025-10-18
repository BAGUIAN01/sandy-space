# Script PowerShell pour migrer les prix vers FCFA
# Ce script exécute la migration SQL sur la base de données PostgreSQL

Write-Host "🔄 Début de la migration des prix EUR vers FCFA..." -ForegroundColor Yellow

# Configuration de la base de données (à adapter selon votre configuration)
$DB_HOST = "localhost"
$DB_PORT = "51213"
$DB_NAME = "postgres"
$DB_USER = "postgres"

Write-Host "📊 Connexion à la base de données..." -ForegroundColor Blue

# Exécuter le script SQL
try {
    # Utiliser psql si disponible
    $sqlFile = "scripts/migrate-prices-to-fcfa.sql"
    
    if (Test-Path $sqlFile) {
        Write-Host "✅ Script SQL trouvé: $sqlFile" -ForegroundColor Green
        
        # Commande psql (à adapter selon votre installation)
        $psqlCommand = "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f `"$sqlFile`""
        
        Write-Host "🚀 Exécution de la migration..." -ForegroundColor Blue
        Write-Host "Commande: $psqlCommand" -ForegroundColor Gray
        
        # Exécuter la commande
        Invoke-Expression $psqlCommand
        
        Write-Host "✅ Migration terminée avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Script SQL non trouvé: $sqlFile" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de la migration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que PostgreSQL est installé et que psql est dans le PATH" -ForegroundColor Yellow
}

Write-Host "📝 Note: Vous pouvez aussi exécuter le script SQL manuellement dans votre client PostgreSQL" -ForegroundColor Cyan
