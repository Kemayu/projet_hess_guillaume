# TP03 — Gestion des pollutions

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.24.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## API PostgreSQL

L'application utilise `PollutionService` pour appeler les routes CRUD suivantes :

- `GET /pollutions`
- `GET /pollutions/:id`
- `POST /pollutions`
- `PUT /pollutions/:id`
- `DELETE /pollutions/:id`

En développement, l'API est disponible sur `http://localhost:3000` et utilise
PostgreSQL avec `DATABASE_URL` (ou les variables `DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD` et `DB_NAME`). Pour démarrer le front et l'API :

```bash
# terminal 1
cd api && npm install && npm run dev

# terminal 2
npm start
```

L'API expose les routes CRUD `GET`, `POST`, `PUT` et `DELETE` sous
`/pollutions`. Les données sont stockées dans PostgreSQL.

## Déploiement Render

Le fichier `render.yaml` définit les trois ressources Render :

- `tp02-db` : base PostgreSQL ;
- `tp02-back` : API Node/Express ;
- `tp02-front` : site statique Angular.

Dans Render, créer un Blueprint à partir du dépôt contenant `render.yaml`.
L'API reçoit automatiquement la chaîne de connexion de la base et le front
utilise `https://tp02-back.onrender.com` en production.

Les réponses `Observable` du service sont converties en signaux avec
`toSignal` dans les pages de liste et de détail. La page principale propose la
création, la recherche et deux filtres (type et lieu). Chaque élément permet
d'accéder au détail/modifier ou de supprimer la pollution.
