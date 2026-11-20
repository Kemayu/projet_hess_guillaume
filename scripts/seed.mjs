// Remplit l'application avec des données de test en passant par l'API REST
// (inscription -> connexion -> ajout des pollutions avec le token JWT).
//
// Utilisation :
//   node scripts/seed.mjs                                            -> API locale (http://localhost:3000)
//   API_URL=https://sentinelle-back.onrender.com node scripts/seed.mjs -> API Render
//
// Variables optionnelles : SEED_EMAIL, SEED_PASSWORD
// Le script peut être relancé : il ne recrée ni le compte ni les pollutions déjà présentes.

const API_URL = (process.env.API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const EMAIL = process.env.SEED_EMAIL ?? 'test@exemple.fr';
const PASSWORD = process.env.SEED_PASSWORD ?? 'motdepasse';

const user = {
  email: EMAIL,
  lastName: 'Test',
  firstName: 'Jean',
  address: '1 rue du Port, 17000 La Rochelle',
  password: PASSWORD,
  confirmPassword: PASSWORD
};

// Photos génériques libres de droits (Picsum) : la même "seed" renvoie toujours la même image
const photo = (seed) => `https://picsum.photos/seed/sentinelle-${seed}/800/600.jpg`;

const pollutions = [
  {
    title: 'Sacs plastiques sur la plage',
    type: 'Plastique',
    description: 'Une dizaine de sacs plastiques et des bouteilles laissés après le week-end.',
    observationDate: '2026-11-02',
    location: 'Plage des Minimes',
    latitude: 46.1446,
    longitude: -1.166,
    dangerIndex: 10,
    photoUrl: photo('plage')
  },
  {
    title: 'Dépôt sauvage en lisière de bois',
    type: 'Dépôt sauvage',
    description: 'Gravats, pneus et un vieux matelas déposés le long du chemin forestier.',
    observationDate: '2026-11-04',
    location: 'Bois de la Pallice',
    latitude: 46.1621,
    longitude: -1.2102,
    dangerIndex: 18,
    photoUrl: photo('foret')
  },
  {
    title: 'Mousse suspecte dans le canal',
    type: 'Eau',
    description: 'Mousse blanche persistante à la surface du canal sur une centaine de mètres.',
    observationDate: '2026-11-05',
    location: 'Canal de Marans',
    latitude: 46.159,
    longitude: -1.152,
    dangerIndex: 35,
    photoUrl: photo('canal')
  },
  {
    title: "Odeur d'hydrocarbures au port",
    type: 'Eau',
    description: 'Irisations sur l’eau et forte odeur de carburant près des pontons.',
    observationDate: '2026-11-07',
    location: 'Vieux-Port de La Rochelle',
    latitude: 46.1558,
    longitude: -1.1517,
    dangerIndex: 48,
    photoUrl: photo('port')
  },
  {
    title: "Fumée noire d'usine",
    type: 'Air',
    description: 'Panache de fumée noire visible depuis la rocade pendant plusieurs heures.',
    observationDate: '2026-11-09',
    location: 'Zone industrielle de Périgny',
    latitude: 46.155,
    longitude: -1.095,
    dangerIndex: 80,
    photoUrl: photo('usine')
  },
  {
    title: 'Fuite de produits chimiques',
    type: 'Chimique',
    description: 'Fûts percés laissant s’écouler un liquide jaunâtre vers le bassin.',
    observationDate: '2026-11-10',
    location: 'Port de La Pallice',
    latitude: 46.158,
    longitude: -1.22,
    dangerIndex: 150,
    photoUrl: photo('chimique')
  }
];

const request = async (method, path, body, token) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  return { status: response.status, data };
};

const main = async () => {
  console.log(`API : ${API_URL}`);

  const health = await request('GET', '/health').catch(() => null);
  if (!health || health.status !== 200) {
    throw new Error("L'API ne répond pas. Vérifiez qu'elle est démarrée (sur Render, le premier appel peut prendre ~1 min).");
  }

  // 1. Inscription (409 = le compte existe déjà, on continue)
  const register = await request('POST', '/api/users', user);
  if (register.status === 201) {
    console.log(`✔ Compte créé : ${EMAIL}`);
  } else if (register.status === 409) {
    console.log(`• Compte déjà existant : ${EMAIL}`);
  } else {
    throw new Error(`Inscription impossible (${register.status}) : ${register.data?.message}`);
  }

  // 2. Connexion pour obtenir l'access token
  const login = await request('POST', '/api/auth/login', { email: EMAIL, password: PASSWORD });
  if (login.status !== 200) {
    throw new Error(`Connexion impossible (${login.status}) : ${login.data?.message}`);
  }
  const token = login.data.accessToken;
  console.log('✔ Connecté');

  // 3. Ajout des pollutions absentes (comparaison par titre)
  const existing = await request('GET', '/api/pollutions');
  const byTitle = new Map((existing.data ?? []).map((pollution) => [pollution.title, pollution]));

  let created = 0;
  let photosAdded = 0;
  for (const pollution of pollutions) {
    const current = byTitle.get(pollution.title);
    if (current) {
      // Déjà présente : on complète seulement la photo si elle manque
      if (!current.photoUrl) {
        const { id, ...fields } = current;
        const result = await request('PUT', `/api/pollutions/${id}`, { ...fields, photoUrl: pollution.photoUrl }, token);
        if (result.status !== 200) {
          throw new Error(`Ajout de photo impossible pour « ${pollution.title} » (${result.status}) : ${result.data?.message}`);
        }
        photosAdded++;
        console.log(`✔ Photo ajoutée : ${pollution.title}`);
      } else {
        console.log(`• Déjà présente : ${pollution.title}`);
      }
      continue;
    }
    const result = await request('POST', '/api/pollutions', pollution, token);
    if (result.status !== 201) {
      throw new Error(`Ajout impossible de « ${pollution.title} » (${result.status}) : ${result.data?.message}`);
    }
    created++;
    console.log(`✔ Ajoutée : ${pollution.title} (indice ${pollution.dangerIndex})`);
  }

  console.log(`\nTerminé : ${created} pollution(s) ajoutée(s), ${photosAdded} photo(s) complétée(s). Connexion : ${EMAIL} / ${PASSWORD}`);
};

main().catch((error) => {
  console.error(`✘ ${error.message}`);
  process.exit(1);
});
