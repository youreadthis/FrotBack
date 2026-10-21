// Получаем модальное окно по id.
const orderDialog = document.getElementById('order-dialog');

// Получаем окно подробностей товара и его содержимое.
const productDialog = document.getElementById('product-dialog');
const productDialogTitle = document.getElementById('product-dialog-title');
const productDialogDescription = document.getElementById('product-dialog-description');
const productDialogImage = document.getElementById('product-dialog-image');
const detailButtons = document.querySelectorAll('.product-card__details-button');
const closeProductDialogButton = document.getElementById('close-product-dialog');
const orderFromDetailsButton = document.getElementById('order-from-details');
const productPlaceholderImage = 'images/product-placeholder.svg';

productDialogImage.addEventListener('error', () => {
  if (productDialogImage.getAttribute('src') !== productPlaceholderImage) {
    productDialogImage.src = productPlaceholderImage;
  }
});

// Получаем все кнопки заказа в карточках товаров.
const orderButtons = document.querySelectorAll('.product-card__order-button');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');
const orderNameInput = document.getElementById('order-name');
const orderEmailInput = document.getElementById('order-email');
const orderPhoneInput = document.getElementById('order-phone');
const profileStorageKey = 'shopProjectProfile';

function loadSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(profileStorageKey) || 'null');
  } catch {
    return null;
  }
}

function applySavedProfile() {
  const profile = loadSavedProfile();

  if (!profile) {
    return;
  }

  orderNameInput.value = [profile.lastName, profile.firstName, profile.middleName]
    .filter(Boolean)
    .join(' ');
  orderEmailInput.value = profile.email || '';
  orderPhoneInput.value = profile.phone || '';
}

const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

orderPhoneInput.addEventListener('input', () => {
  orderPhoneInput.setCustomValidity(
    orderPhoneInput.value && !phonePattern.test(orderPhoneInput.value)
      ? 'Введите телефон в формате +7 (900) 000-00-00.'
      : ''
  );
});

// Заполняем окно подробностей данными карточки.
detailButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');

    productCard.classList.add('product-card--viewed');
    productDialogTitle.textContent = productCard.querySelector('.product-card__title').textContent;
    productDialogDescription.textContent = productCard.querySelector('.product-card__description').textContent;
    productDialogImage.src = productCard.dataset.image || productPlaceholderImage;
    productDialogImage.alt = productDialogTitle.textContent;
    productDialog.showModal();
  });
});

// Открываем заказ для выбранного товара.
function openOrderDialog(productName) {
  selectedProductInput.value = productName;
  applySavedProfile();

  if (productDialog.open) {
    productDialog.close();
  }

  orderDialog.showModal();
}

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    productCard.classList.add('product-card--viewed');

    openOrderDialog(button.dataset.product);
  });
});

orderFromDetailsButton.addEventListener('click', () => {
  openOrderDialog(productDialogTitle.textContent);
});

closeProductDialogButton.addEventListener('click', () => {
  productDialog.close();
});

// Закрываем модальное окно по кнопке «Закрыть».
closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Показываем сообщение об успешной отправке.
  successMessage.hidden = false;

  // Очищаем форму.
  orderForm.reset();

  // Закрываем модальное окно.
  orderDialog.close();
});