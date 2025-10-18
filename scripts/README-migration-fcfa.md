# Migration des Prix EUR vers FCFA

## 📋 Vue d'ensemble

Ce dossier contient les scripts nécessaires pour migrer tous les prix de la base de données de EUR vers FCFA.

## 🔄 Conversion

- **Taux de conversion** : 1 EUR = 655 FCFA
- **Devise par défaut** : Changée de "EUR" vers "FCFA" dans le schéma Prisma

## 📁 Fichiers

### 1. `migrate-prices-to-fcfa.sql`
Script SQL pour exécuter la migration directement sur PostgreSQL.

```sql
-- Mettre à jour la devise par défaut
UPDATE "Product" SET currency = 'FCFA' WHERE currency = 'EUR';

-- Convertir les prix (1 EUR = 655 FCFA)
UPDATE "Product" SET basePrice = ROUND(basePrice * 655) WHERE currency = 'FCFA';
UPDATE "Product" SET compareAtPrice = ROUND(compareAtPrice * 655) WHERE currency = 'FCFA' AND compareAtPrice IS NOT NULL;
UPDATE "Product" SET costPrice = ROUND(costPrice * 655) WHERE currency = 'FCFA' AND costPrice IS NOT NULL;
```

### 2. `migrate-prices-to-fcfa.ps1`
Script PowerShell pour exécuter la migration automatiquement.

```powershell
.\scripts\migrate-prices-to-fcfa.ps1
```

### 3. `migrate-prices-to-fcfa.js`
Script Node.js alternatif pour la migration.

```bash
node scripts/migrate-prices-to-fcfa.js
```

### 4. `verify-fcfa-prices.js`
Script de vérification pour s'assurer que la migration s'est bien passée.

```bash
node scripts/verify-fcfa-prices.js
```

## 🚀 Instructions d'exécution

### Option 1: Script SQL direct
1. Ouvrir votre client PostgreSQL (pgAdmin, DBeaver, etc.)
2. Exécuter le contenu de `migrate-prices-to-fcfa.sql`

### Option 2: Script PowerShell
```powershell
cd "C:\Users\bagui\OneDrive\Desktop\web project\sandy-space"
.\scripts\migrate-prices-to-fcfa.ps1
```

### Option 3: Script Node.js
```bash
cd "C:\Users\bagui\OneDrive\Desktop\web project\sandy-space"
node scripts/migrate-prices-to-fcfa.js
```

## ✅ Vérification

Après la migration, exécutez le script de vérification :

```bash
node scripts/verify-fcfa-prices.js
```

## 📊 Exemples de conversion

| Produit | Prix EUR | Prix FCFA |
|---------|----------|-----------|
| Robe Décontractée | 45€ | 29 475 FCFA |
| Robe de Mariée | 150€ | 98 250 FCFA |
| Sac à Main | 35€ | 22 925 FCFA |

## ⚠️ Important

- **Sauvegarde** : Faites une sauvegarde de votre base de données avant la migration
- **Test** : Testez d'abord sur une copie de la base de données
- **Vérification** : Utilisez le script de vérification après la migration

## 🔧 Modifications du code

### Schéma Prisma (`prisma/schema.prisma`)
```prisma
currency String @default("FCFA") // Changé de "EUR" vers "FCFA"
```

### Store (`src/stores/cart-store.js`)
```javascript
// Plus de conversion nécessaire - les prix sont déjà en FCFA
price: basePrice, // Prix déjà en FCFA
originalPrice: originalPrice, // Prix déjà en FCFA
```

## 🎯 Résultat attendu

Après la migration :
- ✅ Tous les prix sont en FCFA
- ✅ Plus de conversion EUR → FCFA nécessaire
- ✅ Affichage cohérent dans toute l'application
- ✅ Panier fonctionnel avec prix corrects
