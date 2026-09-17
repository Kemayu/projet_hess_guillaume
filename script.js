const form = document.getElementById('signupForm');
const message = document.getElementById('message');
const summarySection = document.getElementById('summarySection');
const summaryContent = document.getElementById('summaryContent');

const fields = [
  { id: 'login', label: 'Login' },
  { id: 'password', label: 'Mot de passe' },
  { id: 'confirmPassword', label: 'Confirmation du mot de passe' },
  { id: 'lastName', label: 'Nom' },
  { id: 'firstName', label: 'Prénom' },
  { id: 'address', label: 'Adresse' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'birthDate', label: 'Date de naissance' },
];

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message message--${type}`;
}

function clearMessage() {
  message.textContent = '';
  message.className = 'message';
}

function getFieldValue(id) {
  return document.getElementById(id).value.trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSummaryItem(label, value) {
  const item = document.createElement('div');
  item.className = 'summary-item';

  const summaryLabel = document.createElement('span');
  summaryLabel.className = 'summary-label';
  summaryLabel.textContent = label;

  const summaryValue = document.createElement('span');
  summaryValue.className = 'summary-value';
  summaryValue.textContent = value;

  item.append(summaryLabel, summaryValue);
  return item;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessage();

  const missingField = fields.find(({ id }) => !getFieldValue(id));
  if (missingField) {
    showMessage(`Le champ « ${missingField.label} » est obligatoire.`, 'error');
    return;
  }

  const email = getFieldValue('email');
  if (!isValidEmail(email)) {
    showMessage('Veuillez saisir une adresse email valide.', 'error');
    return;
  }

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (password !== confirmPassword) {
    showMessage('Le mot de passe et sa confirmation ne correspondent pas.', 'error');
    return;
  }

  summaryContent.innerHTML = '';

  const summaryFields = [
    { label: 'Login', value: getFieldValue('login') },
    { label: 'Nom', value: getFieldValue('lastName') },
    { label: 'Prénom', value: getFieldValue('firstName') },
    { label: 'Adresse', value: getFieldValue('address') },
    { label: 'Email', value: email },
    { label: 'Téléphone', value: getFieldValue('phone') },
    { label: 'Date de naissance', value: getFieldValue('birthDate') },
  ];

  summaryFields.forEach(({ label, value }) => {
    summaryContent.appendChild(createSummaryItem(label, value));
  });

  form.classList.add('hidden');
  summarySection.classList.remove('hidden');
  showMessage('Inscription validée avec succès.', 'success');
});