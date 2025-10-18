# Système d'Authentification Sandy Space

Ce projet utilise NextAuth.js avec un système d'authentification complet basé sur username/password.

## 🚀 Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sandy_space"
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Créer un utilisateur admin
npm run create-admin
```

### 4. Démarrage du serveur

```bash
npm run dev
```

## 🔐 Fonctionnalités d'authentification

### Pages disponibles

- **Connexion** : `/auth/login`
- **Inscription** : `/auth/register`
- **Erreur** : `/auth/error`
- **Profil** : `/profile` (nécessite une connexion)
- **Administration** : `/admin` (nécessite le rôle ADMIN)

### Rôles utilisateur

- `CUSTOMER` : Client standard
- `ADMIN` : Administrateur
- `MANAGER` : Gestionnaire
- `STAFF` : Personnel

### Compte administrateur par défaut

Après avoir exécuté `npm run create-admin`, vous pouvez vous connecter avec :

- **Username** : `admin`
- **Email** : `admin@sandyspace.com`
- **Password** : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 🛡️ Sécurité

### Protection des routes

Le système inclut plusieurs niveaux de protection :

1. **Middleware** : Protection automatique des routes `/admin/*` et `/dashboard/*`
2. **AuthGuard** : Composant pour protéger les pages côté client
3. **Vérification côté serveur** : Utilisation de `getServerSession()` dans les pages

### Validation des mots de passe

Les mots de passe doivent respecter les critères suivants :
- Minimum 8 caractères
- Au moins une lettre minuscule
- Au moins une lettre majuscule
- Au moins un chiffre

### Hachage des mots de passe

Les mots de passe sont hachés avec bcryptjs (12 rounds de salt).

## 📁 Structure des fichiers

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   └── error/page.js
│   ├── (admin)/
│   │   └── admin/page.js
│   ├── (dashboard)/
│   │   └── profile/page.js
│   └── api/
│       └── auth/
│           ├── [...nextauth]/route.js
│           └── register/route.js
├── components/
│   └── auth/
│       ├── auth-button.jsx
│       ├── auth-guard.jsx
│       ├── login-form.jsx
│       └── register-form.jsx
└── middleware.js
```

## 🔧 Utilisation

### Composants disponibles

#### AuthButton
Bouton d'authentification qui s'adapte selon l'état de connexion :

```jsx
import AuthButton from '@/components/auth/auth-button'

<AuthButton />
```

#### AuthGuard
Composant pour protéger les pages :

```jsx
import AuthGuard from '@/components/auth/auth-guard'

<AuthGuard requireAuth={true} requireRole="ADMIN">
  <AdminContent />
</AuthGuard>
```

### Hooks NextAuth

```jsx
import { useSession, signIn, signOut } from 'next-auth/react'

const { data: session, status } = useSession()

// Connexion
await signIn('credentials', {
  username: 'username',
  password: 'password'
})

// Déconnexion
await signOut()
```

### Vérification côté serveur

```jsx
import { getServerSession } from 'next-auth'

export default async function ProtectedPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Contenu protégé
}
```

## 🚨 Dépannage

### Erreurs courantes

1. **"NEXTAUTH_SECRET is not defined"**
   - Ajoutez `NEXTAUTH_SECRET` dans votre fichier `.env.local`

2. **"Database connection failed"**
   - Vérifiez votre `DATABASE_URL`
   - Assurez-vous que PostgreSQL est démarré

3. **"User not found"**
   - Vérifiez que l'utilisateur existe dans la base de données
   - Utilisez `npm run create-admin` pour créer un admin

### Logs de débogage

Activez les logs NextAuth en ajoutant dans `.env.local` :

```env
NEXTAUTH_DEBUG=true
```

## 📝 Notes importantes

- Le système utilise JWT pour les sessions
- Les sessions expirent après 30 jours
- Les utilisateurs inactifs ne peuvent pas se connecter
- Le système enregistre la dernière connexion de chaque utilisateur

## 🔄 Prochaines étapes

- [ ] Ajouter la réinitialisation de mot de passe
- [ ] Implémenter la vérification par email
- [ ] Ajouter l'authentification à deux facteurs
- [ ] Créer un système de permissions granulaire
- [ ] Ajouter la gestion des sessions actives
