const ADMIN_CREDENTIALS_URL = 'assets/admin-credentials.json';
const PAGEANT_STORAGE_KEY = 'pageantApplicants';
const INLINE_CREDENTIALS = {
  user: 'dGVzdA==',
  pass: 'MTIzNA=='
};

const loginForm = document.getElementById('admin-login-form');
const adminPanel = document.getElementById('admin-panel');
const loginError = document.getElementById('login-error');
const entriesContainer = document.getElementById('entries-container');
const exportButton = document.getElementById('export-csv');
const logoutButton = document.getElementById('logout-button');

let credentials = INLINE_CREDENTIALS;

function decodeBase64(value) {
  try {
    return atob(value);
  } catch (error) {
    console.error('Failed to decode credential value', error);
    return '';
  }
}

async function loadCredentials() {
  try {
    const response = await fetch(ADMIN_CREDENTIALS_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load credentials file.');
    }
    credentials = await response.json();
  } catch (error) {
    console.warn('Credential file load failed, falling back to inline credentials.', error);
    credentials = INLINE_CREDENTIALS;
  }
}

function getApplicants() {
  try {
    return JSON.parse(localStorage.getItem(PAGEANT_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Failed to parse applicant storage', error);
    return [];
  }
}

function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function renderApplicants() {
  const applicants = getApplicants();
  if (!applicants.length) {
    entriesContainer.innerHTML = '<p class="text-sm text-muted-foreground">No applications stored yet.</p>';
    exportButton.disabled = true;
    return;
  }

  exportButton.disabled = false;
  const rows = applicants.map((applicant) => {
    return `
      <div class="bg-secondary rounded-3xl border border-border p-5 space-y-3">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Submitted</p>
            <p class="font-semibold">${formatDateTime(applicant.submittedAt)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-muted-foreground">Contestant</p>
            <p class="font-semibold">${applicant.contestantName}</p>
          </div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 text-sm text-foreground/80">
          <div><span class="font-semibold">Guardian:</span> ${applicant.guardianName}</div>
          <div><span class="font-semibold">Email:</span> ${applicant.email}</div>
          <div><span class="font-semibold">Phone:</span> ${applicant.phone}</div>
          <div><span class="font-semibold">Age:</span> ${applicant.age}</div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 text-sm text-foreground/80">
          <div><span class="font-semibold">Payment:</span> ${applicant.paymentMethod}</div>
          <div><span class="font-semibold">Program Ad:</span> ${applicant.programAd}</div>
          <div><span class="font-semibold">Sponsor:</span> ${applicant.sponsor || 'None'}</div>
        </div>
      </div>
    `;
  });

  entriesContainer.innerHTML = rows.join('');
}

function convertToCsv(applicants) {
  const headers = [
    'Submitted At',
    'Contestant Name',
    'Guardian Name',
    'Email',
    'Phone',
    'Address',
    'City',
    'State',
    'Zip',
    'Date of Birth',
    'Age',
    'School',
    'Grade',
    'Hair Color',
    'Eye Color',
    'Favorite Food',
    'Favorite Color',
    'Favorite Show or Movie',
    'Hobbies / Interests',
    'Honors / Awards',
    'Future Plans / Goals',
    'Best Quality',
    'Interesting Fact',
    'Sponsor',
    'Program Ad',
    'Payment Method'
  ];

  const rows = applicants.map((applicant) => [
    applicant.submittedAt,
    applicant.contestantName,
    applicant.guardianName,
    applicant.email,
    applicant.phone,
    applicant.address,
    applicant.city,
    applicant.state,
    applicant.zip,
    applicant.dateOfBirth,
    applicant.age,
    applicant.school,
    applicant.grade,
    applicant.hairColor,
    applicant.eyeColor,
    applicant.favoriteFood,
    applicant.favoriteColor,
    applicant.favoriteShow,
    applicant.hobbies,
    applicant.honors,
    applicant.futurePlans,
    applicant.bestQuality,
    applicant.interestingFact,
    applicant.sponsor,
    applicant.programAd,
    applicant.paymentMethod
  ]);

  const escapeCsv = (value) => `"${String(value || '').replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
}

function downloadCsv() {
  const applicants = getApplicants();
  if (!applicants.length) return;

  const csv = convertToCsv(applicants);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'pageant-applications.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function showAdminPanel() {
  loginForm.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  renderApplicants();
}

function hideAdminPanel() {
  adminPanel.classList.add('hidden');
  loginForm.classList.remove('hidden');
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';

  if (!credentials) {
    loginError.textContent = 'Admin configuration not loaded yet.';
    return;
  }

  const formData = new FormData(loginForm);
  const username = formData.get('username')?.toString().trim() || '';
  const password = formData.get('password')?.toString() || '';
  const expectedUser = decodeBase64(credentials.user);
  const expectedPass = decodeBase64(credentials.pass);

  if (username === expectedUser && password === expectedPass) {
    showAdminPanel();
    loginForm.reset();
    return;
  }

  loginError.textContent = 'Invalid username or password.';
});

exportButton?.addEventListener('click', downloadCsv);
logoutButton?.addEventListener('click', () => {
  hideAdminPanel();
});

window.addEventListener('DOMContentLoaded', loadCredentials);
