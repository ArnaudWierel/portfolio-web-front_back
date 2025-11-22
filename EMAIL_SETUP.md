# Configuration de l'envoi d'emails

Le formulaire de contact envoie maintenant automatiquement un email à chaque soumission.

## Configuration avec Resend

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (100 emails/jour en version gratuite)
3. Récupérez votre clé API dans les paramètres

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
# Clé API Resend (obtenue sur resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email de destination (où vous recevrez les messages)
CONTACT_EMAIL=votre-email@exemple.com

# Variables Supabase (optionnel, pour sauvegarder aussi dans la base)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Vérifier l'expéditeur par défaut

Par défaut, l'email est envoyé depuis `onboarding@resend.dev`. 

**Pour utiliser votre propre domaine :**

1. Dans Resend, allez dans "Domains"
2. Ajoutez votre domaine et suivez les instructions de vérification DNS
3. Modifiez `server/api/contact.ts` ligne 47 :
   ```typescript
   from: 'Portfolio Contact <contact@votre-domaine.com>',
   ```

### 5. Tester le formulaire

1. Démarrez le serveur : `npm run dev`
2. Allez sur la page de contact
3. Remplissez et envoyez le formulaire
4. Vérifiez votre boîte email !

## Fonctionnalités

- ✅ Envoi d'email automatique à chaque soumission
- ✅ Email formaté en HTML avec toutes les informations
- ✅ Réponse directe possible (reply-to configuré avec l'email du visiteur)
- ✅ Sauvegarde optionnelle dans Supabase (si configuré)
- ✅ Gestion d'erreurs avec messages clairs

## Structure de l'email

L'email contient :
- Nom du contact
- Email (cliquable)
- Entreprise (si renseignée)
- Type de projet (si renseigné)
- Message complet

## Alternatives

Si vous préférez utiliser un autre service d'email :

- **SendGrid** : Modifiez `server/api/contact.ts` pour utiliser `@sendgrid/mail`
- **Nodemailer** : Pour utiliser SMTP directement (Gmail, OVH, etc.)
- **Mailgun** : Autre service populaire

## Dépannage

### L'email n'est pas envoyé

1. Vérifiez que `RESEND_API_KEY` est bien configurée
2. Vérifiez que `CONTACT_EMAIL` est bien configurée
3. Consultez les logs du serveur pour voir les erreurs
4. Vérifiez votre compte Resend pour les statistiques d'envoi

### Erreur "Configuration email manquante"

Assurez-vous que `RESEND_API_KEY` est bien définie dans votre fichier `.env`

### Erreur lors de l'envoi

- Vérifiez que votre clé API Resend est valide
- Vérifiez que vous n'avez pas dépassé la limite d'envois (100/jour en gratuit)
- Consultez les logs dans la console du serveur

