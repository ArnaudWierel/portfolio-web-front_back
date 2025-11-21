# Configuration du Formulaire de Contact

## Option 1 : Utiliser Supabase (Recommandé)

Pour que le formulaire de contact fonctionne avec Supabase, vous devez créer une table `contacts` dans votre base de données Supabase.

### 1. Créer la table dans Supabase

Exécutez cette requête SQL dans l'éditeur SQL de Supabase :

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  project_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion (lecture publique)
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Optionnel : Créer une politique pour permettre la lecture (si vous voulez voir les messages)
CREATE POLICY "Allow public read" ON contacts
  FOR SELECT
  USING (true);
```

### 2. Vérifier la configuration

Le formulaire utilisera automatiquement Supabase si :
- Les variables d'environnement `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont configurées
- La table `contacts` existe dans votre base de données

### 3. Tester le formulaire

Une fois la table créée, le formulaire enverra automatiquement les messages à Supabase. Vous pourrez les consulter dans l'interface Supabase.

## Option 2 : Utiliser une API personnalisée

Si vous préférez utiliser une API personnalisée, vous pouvez :

1. Créer un endpoint API dans `server/api/contact.ts`
2. Modifier la fonction `handleSubmit` dans `pages/contact.vue` pour utiliser cet endpoint

Exemple d'endpoint API :

```typescript
// server/api/contact.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Envoyer un email, sauvegarder dans une base de données, etc.
  // ...
  
  return { success: true };
});
```

## Note

Le formulaire fonctionne actuellement en mode "simulation" si Supabase n'est pas configuré ou si la table n'existe pas. Les messages seront affichés comme envoyés avec succès, mais ne seront pas réellement sauvegardés.

