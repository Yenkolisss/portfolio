// ===== Мобильное меню =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Закрываем меню после выбора пункта (прокрутка — через CSS scroll-behavior: smooth)
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Подсветка активного пункта меню при прокрутке
const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nav.querySelectorAll('a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => observer.observe(s));

// ===== Галерея: просмотр крупно =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    lightboxImg.src = item.getAttribute('href');
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.hidden = false;
  });
});
lightbox.addEventListener('click', () => { lightbox.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.hidden = true; });

// ===== Форма обратной связи и проверка email =====
const form = document.getElementById('feedback');
const emailError = document.getElementById('email-error');
const status = document.getElementById('form-status');

function checkEmail(value) {
  // Требование задания: в адресе должен быть символ @.
  // Дополнительно проверяем, что до и после @ есть текст, а после — точка (домен).
  if (!value.includes('@')) return 'В адресе нет символа «@»';
  const [user, domain] = value.split('@');
  if (!user || !domain || !domain.includes('.')) return 'Проверьте адрес: пример name@mail.ru';
  return '';
}

form.email.addEventListener('input', () => {
  emailError.textContent = '';
  form.email.classList.remove('invalid');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form__status';
  let ok = true;

  ['name', 'message'].forEach(field => {
    const empty = form[field].value.trim() === '';
    form[field].classList.toggle('invalid', empty);
    if (empty) ok = false;
  });

  const emailMsg = checkEmail(form.email.value.trim());
  emailError.textContent = emailMsg;
  form.email.classList.toggle('invalid', emailMsg !== '');
  if (emailMsg) ok = false;

  if (!ok) {
    status.textContent = 'Заполните все поля корректно.';
    status.classList.add('err');
    return;
  }

  // Сервера у статического сайта нет, поэтому сообщение не отправляется,
  // а пользователь видит подтверждение. Данные никуда не передаются.
  status.textContent = `Спасибо, ${form.name.value.trim()}! Сообщение проверено и готово к отправке.`;
  status.classList.add('ok');
  form.reset();
});
