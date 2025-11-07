# Rapport de Correction - Erreur HTTP 400 Supabase
**Date :** 7 novembre 2025, 18:58 UTC  
**Problème :** Erreur HTTP 400 avec code PGRST200 lors des requêtes vers Supabase

## 🔍 Diagnostic

### Problème Principal
L'erreur `HTTP 400 - PGRST200` était causée par une **requête Supabase malformée** dans le système de récupération des données. Le problème venait du fichier `lib/supabaseFetcher.js` qui utilisait une requête codée en dur avec des jointures spécifiques à la table `projects` même pour d'autres tables comme `messages`.

### Causes Identifiées

1. **supabaseFetcher.js** - Requête statique incorrecte
   ```javascript
   // AVANT : Requête codée en dur pour toutes les tables
   .select(`
     id, slug, title, excerpt, image, categories, start_date,
     location, people_helped, status, content, goals,
     created_at, updated_at,
     project_images (id, image_url, alt_text)  // ← Jointure problématique
   `)
   ```

2. **dashboard.js** - Colonnes inexistantes
   - Utilisait `read` au lieu de `status` pour les messages
   - Incohérence avec le modèle de données réel

3. **messages/page.jsx** - Propriétés inexistantes
   - Références à `message.name`, `message.subject`, `message.isRead`, `message.createdAt`
   - Structure différente de la table `messages` réelle

## ✅ Corrections Apportées

### 1. SupabaseFetcher Dynamique (`lib/supabaseFetcher.js`)
- **Configurateur par table** : Chaque table a maintenant sa propre configuration de requête
- **Spécificité** : 
  - `projects` : Avec jointure `project_images`
  - `blog_posts` : Champs spécifiques aux articles
  - `messages`, `admins` : SELECT * par défaut

### 2. Dashboard Controller (`lib/controllers/dashboard.js`)
```javascript
// AVANT
.eq("read", false)  // ❌ Colonne inexistante

// APRÈS  
.eq("status", "unread")  // ✅ Colonne correcte
```

### 3. Interface Messages (`app/admin/messages/page.jsx`)
```javascript
// AVANT : Propriétés inexistantes
message.name                    // ❌
message.subject                 // ❌  
message.isRead                  // ❌
message.createdAt               // ❌

// APRÈS : Structure réelle
`${message.first_name} ${message.last_name}`  // ✅
message.message.substring(0, 100)             // ✅
message.status === "unread"                   // ✅
message.created_at                            // ✅
```

## 🧪 Script de Test

Créé `debug-supabase-query.js` pour valider les corrections :
- Test des requêtes sur `messages` (sans jointure)
- Test des requêtes sur `projects` (avec jointure)
- Test des requêtes sur `blog_posts`
- Validation de la structure des données

## 🎯 Résultat Attendu

Après ces corrections :
- ❌ **Avant** : Erreur HTTP 400 sur toutes les requêtes
- ✅ **Après** : Requêtes fonctionnelles avec les bonnes structures de données

## 📋 Prochaines Étapes

1. Tester les corrections avec le script `debug-supabase-query.js`
2. Vérifier le fonctionnement des pages admin :
   - `/admin/messages`
   - `/admin/dashboard` (statistiques)
   - `/admin/projects`
3. Surveiller les logs pour d'éventuelles erreurs résiduelles

## 🔧 Fichiers Modifiés

- `lib/supabaseFetcher.js` - Fetcher dynamique par table
- `lib/controllers/dashboard.js` - Correction des colonnes messages
- `app/admin/messages/page.jsx` - Interface adaptée au modèle réel
- `debug-supabase-query.js` - Script de test (nouveau)

---
**Status :** ✅ Corrigé et prêt pour test