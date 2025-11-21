# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Configuration Supabase

Ce projet utilise Supabase pour gérer les projets dynamiquement. Pour configurer Supabase :

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos clés Supabase :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-clé-anon-publique
```

Vous pouvez trouver ces valeurs dans votre dashboard Supabase : https://app.supabase.com/project/[votre-projet]/settings/api

**Note :** Si Supabase n'est pas configuré, l'application utilisera automatiquement les données statiques en fallback.