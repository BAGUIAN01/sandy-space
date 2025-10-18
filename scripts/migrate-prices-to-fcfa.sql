-- Script SQL pour migrer les prix de EUR vers FCFA
-- Conversion: 1 EUR = 655 FCFA

-- Mettre à jour la devise par défaut
UPDATE "Product" SET currency = 'FCFA' WHERE currency = 'EUR';

-- Convertir les prix de base (basePrice)
UPDATE "Product" 
SET basePrice = ROUND(basePrice * 655) 
WHERE currency = 'FCFA';

-- Convertir les prix de comparaison (compareAtPrice)
UPDATE "Product" 
SET compareAtPrice = ROUND(compareAtPrice * 655) 
WHERE currency = 'FCFA' AND compareAtPrice IS NOT NULL;

-- Convertir les prix de coût (costPrice)
UPDATE "Product" 
SET costPrice = ROUND(costPrice * 655) 
WHERE currency = 'FCFA' AND costPrice IS NOT NULL;

-- Vérifier les résultats
SELECT 
    name,
    basePrice,
    compareAtPrice,
    costPrice,
    currency
FROM "Product" 
LIMIT 10;
