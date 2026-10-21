const profileForm = document.getElementById('profile-form');
const profileSaveMessage = document.getElementById('profile-save-message');
const profileStorageKey = 'shopProjectProfile';
const profileFields = {
  firstName: document.getElementById('profile-first-name'),
  lastName: document.getElementById('profile-last-name'),
  middleName: document.getElementById('profile-middle-name'),
  email: document.getElementById('profile-email'),
  phone: document.getElementById('profile-phone'),
};

try {
  const savedProfile = JSON.parse(localStorage.getItem(profileStorageKey) || 'null');

  if (savedProfile) {
    profileFields.firstName.value = savedProfile.firstName || '';
    profileFields.lastName.value = savedProfile.lastName || '';
    profileFields.middleName.value = savedProfile.middleName || '';
    profileFields.email.value = savedProfile.email || '';
    profileFields.phone.value = savedProfile.phone || '';
  }
} catch {
  profileSaveMessage.textContent = 'Не удалось загрузить сохранённые данные.';
  profileSaveMessage.hidden = false;
}

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  profileSaveMessage.hidden = true;

  if (!profileForm.reportValidity()) {
    return;
  }

  const profile = Object.fromEntries(
    Object.entries(profileFields).map(([key, field]) => [key, field.value.trim()])
  );

  try {
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    profileSaveMessage.textContent = 'Данные профиля сохранены.';
  } catch {
    profileSaveMessage.textContent = 'Не удалось сохранить данные в этом браузере.';
  }

  profileSaveMessage.hidden = false;
});