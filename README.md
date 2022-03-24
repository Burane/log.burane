# log.burane

# Description
Plateformes de centralisations de logs avec des alertes en cas d'erreurs

## Liste des fonctionalités
- Authentification
- Mot de passe oublié
- création d'un "projet de logs"
- ajout d'autres utilisateurs a ce projet
- consultation de logs
- recherche de logs
- alertes e ncas d'erreurs (via webhook ou autres)
- Optionel (stats sur les logs)

## Technos utilisés
- Front
 -- React
 -- ChakraUI ou Mantine
- Back
 -- NestJs (API Rest, Typescript)
 -- Postgres
 -- Logstash (pipline de transformation de logs)
 -- ElasticSearch (recherche et stockage de logs)
 -- Prisma (ORM)
- Hebergement VPS (ou autre si besoin)
