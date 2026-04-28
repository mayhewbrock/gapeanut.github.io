const PAGEANT_STORAGE_KEY = 'pageantApplicants';
const pageantForm = document.getElementById('pageant-form');
const applicationMessage = document.getElementById('application-message');

function loadApplicants() {
  try {
    return JSON.parse(localStorage.getItem(PAGEANT_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Failed to parse saved applicants', error);
    return [];
  }
}

function saveApplicants(applicants) {
  localStorage.setItem(PAGEANT_STORAGE_KEY, JSON.stringify(applicants));
}

function getFormData(form) {
  const formData = new FormData(form);
  return {
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    contestantName: formData.get('contestantName')?.toString().trim() || '',
    guardianName: formData.get('guardianName')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim() || '',
    phone: formData.get('phone')?.toString().trim() || '',
    address: formData.get('address')?.toString().trim() || '',
    city: formData.get('city')?.toString().trim() || '',
    state: formData.get('state')?.toString().trim() || '',
    zip: formData.get('zip')?.toString().trim() || '',
    dateOfBirth: formData.get('dateOfBirth')?.toString().trim() || '',
    age: formData.get('age')?.toString().trim() || '',
    school: formData.get('school')?.toString().trim() || '',
    grade: formData.get('grade')?.toString().trim() || '',
    hairColor: formData.get('hairColor')?.toString().trim() || '',
    eyeColor: formData.get('eyeColor')?.toString().trim() || '',
    favoriteFood: formData.get('favoriteFood')?.toString().trim() || '',
    favoriteColor: formData.get('favoriteColor')?.toString().trim() || '',
    favoriteShow: formData.get('favoriteShow')?.toString().trim() || '',
    hobbies: formData.get('hobbies')?.toString().trim() || '',
    honors: formData.get('honors')?.toString().trim() || '',
    futurePlans: formData.get('futurePlans')?.toString().trim() || '',
    bestQuality: formData.get('bestQuality')?.toString().trim() || '',
    interestingFact: formData.get('interestingFact')?.toString().trim() || '',
    sponsor: formData.get('sponsor')?.toString().trim() || '',
    programAd: formData.get('programAd')?.toString() || 'No',
    paymentMethod: formData.get('paymentMethod')?.toString().trim() || '',
    agreement: formData.get('agreement') === 'on',
  };
}

function resetForm() {
  pageantForm.reset();
  const firstInput = pageantForm.querySelector('input, textarea, select');
  firstInput?.focus();
}

pageantForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = getFormData(pageantForm);

  if (!data.contestantName || !data.guardianName || !data.email || !data.phone || !data.age || !data.paymentMethod || !data.agreement) {
    applicationMessage.textContent = 'Please complete all required fields and agree to the application terms.';
    applicationMessage.classList.add('text-rose-500');
    return;
  }

  const applicants = loadApplicants();
  applicants.push(data);
  saveApplicants(applicants);

  applicationMessage.textContent = 'Application submitted successfully! Your information is now saved for admin export.';
  applicationMessage.classList.remove('text-rose-500');
  applicationMessage.classList.add('text-emerald-500');

  resetForm();
});
