# Sentinelle Pollution — projet_hess_guillaume

Application de déclaration et de suivi des pollutions : une API Node/Express +
PostgreSQL et un front Angular 21.

```
├── api/          API REST Node/Express + Sequelize (PostgreSQL)
├── front/        Application Angular
├── scripts/      Scripts utilitaires (données de test)
└── render.yaml   Déploiement Render (Blueprint)
```

## Démarrage en local

Prérequis : Node 22 et une base PostgreSQL. Par défaut l'API se connecte à
`postgres://postgres:postgres@localhost:5432/pollution` (ou à `DATABASE_URL`,
ou aux variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

Une base locale peut être lancée avec Docker :

```bash
docker run -d --name pollution-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pollution -p 5432:5432 postgres:16
```

Puis, dans deux terminaux :

```bash
# terminal 1 — API sur http://localhost:3000
cd api && npm install && npm run dev

# terminal 2 — front sur http://localhost:4200
cd front && npm install && npm start
```

Les tables sont créées et mises à jour automatiquement au démarrage de l'API
(`sequelize.sync({ alter: true })`).

### Données de test

Le script `scripts/seed.mjs` remplit l'application en passant par l'API
(inscription, connexion, puis ajout de pollutions avec photos). Il peut être
relancé sans créer de doublons.

```bash
node scripts/seed.mjs                                               # API locale
API_URL=https://sentinelle-back.onrender.com node scripts/seed.mjs  # API Render
```

Compte créé par défaut : `test@exemple.fr` / `motdepasse`
(modifiable avec `SEED_EMAIL` et `SEED_PASSWORD`).

### Tests

```bash
cd front && npm test
```

## API REST

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| `GET` | `/api/pollutions` | public | Liste des pollutions |
| `GET` | `/api/pollutions/:id` | public | Détail d'une pollution |
| `POST` | `/api/pollutions` | connecté | Déclarer une pollution |
| `PUT` | `/api/pollutions/:id` | connecté | Modifier une pollution |
| `DELETE` | `/api/pollutions/:id` | connecté | Supprimer une pollution |
| `POST` | `/api/users` | public | Inscription |
| `GET` | `/api/users` | connecté | Liste des utilisateurs |
| `POST` | `/api/auth/login` | public | Connexion (renvoie les tokens) |
| `POST` | `/api/auth/refresh` | public | Nouveau couple de tokens à partir du refresh token |
| `POST` | `/api/auth/logout` | public | Révoque le refresh token |
| `GET` | `/api/auth/me` | connecté | Profil de l'utilisateur connecté |

**Authentification JWT** : un *access token* (15 min) est envoyé dans l'en-tête
`Authorization: Bearer <token>` ; un *refresh token* (7 jours) permet d'en
obtenir un nouveau. Le refresh token est à usage unique (rotation) et seul son
hash est stocké en base. Les mots de passe sont hachés avec scrypt et ne sont
jamais renvoyés par l'API.

## Front Angular

### Architecture

```
front/src/app/
├── core/       Services singletons : auth, intercepteur JWT, guards, modèles partagés
├── shared/     Éléments réutilisables : pipe, directive, utilitaires
└── features/   Domaines fonctionnels chargés en lazy loading
    ├── auth/        Connexion, inscription
    ├── pollutions/  Liste, détail, déclaration
    └── users/       Liste des utilisateurs
```

### Routes

| URL | Accès | Page |
|---|---|---|
| `/pollutions` | public | Liste, recherche et filtres |
| `/pollutions/new` | connecté (`authGuard`) | Déclarer une pollution |
| `/pollutions/:id` | public | Fiche ; modification si connecté |
| `/users` | connecté (`authGuard`) | Liste des utilisateurs |
| `/auth/login` | non connecté (`guestGuard`) | Connexion |
| `/auth/register` | non connecté (`guestGuard`) | Inscription |

- **Lazy loading** : chaque feature est chargée avec `loadChildren` et n'est
  téléchargée qu'à l'accès à son URL.
- **Guards** : `authGuard` (`canMatch`) redirige vers `/auth/login?returnUrl=…`
  sans télécharger la feature ; `guestGuard` (`canActivate`) renvoie un
  utilisateur déjà connecté vers `/pollutions`.
- **OnPush** : les composants des features utilisent
  `ChangeDetectionStrategy.OnPush` ; l'état passe par des signaux.
- **Pipe / directive** : `PollutionLevelPipe` transforme l'indice de dangerosité
  en niveau (Faible, Modérée, Élevée, Dangereuse) et
  `HighlightPollutionDirective` colore le badge selon ce niveau.

## Déploiement Render

Le fichier `render.yaml` définit trois ressources :

- `sentinelle-db` : base PostgreSQL ;
- `sentinelle-back` : API Node/Express (secrets JWT générés par Render) ;
- `sentinelle-front` : site statique Angular.

Dans Render, créer un Blueprint à partir du dépôt. L'API reçoit la chaîne de
connexion de la base et le front appelle `https://sentinelle-back.onrender.com`.
Si Render attribue une autre URL, mettre à jour
`front/src/environments/environment.prod.ts` et `CORS_ORIGIN`.

## Idées / à faire

- ✅ mettre la page d'inscription
- mettre un logo et une DA et des couleur ensemble de l'app , un fond d'ecran sur la pp car c'st une SPA
- ✅ pour la position on peut mettre un lien vers le site "open street map"
- ✅ rearanger les composant et page / ergonomie de l'application
