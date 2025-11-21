# Configuration Supabase - Permissions RLS

## Problème : Les projets ne s'affichent pas

Si vous avez des données dans votre table `projects` mais qu'elles ne s'affichent pas, c'est probablement un problème de **Row Level Security (RLS)**.

## Solution : Créer une politique RLS pour la lecture publique

### Option 1 : Via l'interface Supabase

1. Allez dans votre projet Supabase
2. Ouvrez la table `projects`
3. Cliquez sur l'onglet **"Policies"** (ou "Politiques")
4. Cliquez sur **"New Policy"** (Nouvelle politique)
5. Sélectionnez **"For SELECT"** (Pour la lecture)
6. Donnez un nom : `Allow public read access`
7. Dans la section "Policy definition", utilisez :
   ```sql
   USING (true)
   ```
8. Cliquez sur **"Save"**

### Option 2 : Via l'éditeur SQL

1. Allez dans **SQL Editor** dans Supabase
2. Exécutez cette requête :

```sql
-- Désactiver RLS temporairement (pour tester)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- OU créer une politique pour permettre la lecture publique
CREATE POLICY "Allow public read access" 
ON projects
FOR SELECT 
USING (true);
```

### Option 3 : Désactiver RLS complètement (déconseillé en production)

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

⚠️ **Attention** : Désactiver RLS permet à n'importe qui de lire vos données. En production, utilisez plutôt une politique RLS appropriée.

## Vérification

Après avoir créé la politique, rechargez la page `/test-supabase` et vous devriez voir votre projet s'afficher.

## Structure de la table attendue

Votre table `projects` doit avoir les colonnes suivantes :
- `id` (uuid)
- `slug` (text)
- `title` (text)
- `description` (text)
- `tags` (text[] ou text)
- `year` (int ou text)
- `role` (text)
- `cover` (text)
- `link` (text, nullable)

