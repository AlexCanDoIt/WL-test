import usersData from '../users-data.js';

let users = [...usersData];

const refs = {
  table: document.querySelector('.table'),
  form: document.querySelector('.form'),
  nameInput: document.querySelector('input[name="name"]'),
  usernameInput: document.querySelector('input[name="username"]'),
  emailInput: document.querySelector('input[name="email"]'),
  websiteInput: document.querySelector('input[name="website"]'),
  modal: document.querySelector('.modal'),
  modalContent: document.querySelector('.js-modal__content'),
  modalOverlay: document.querySelector('.js-modal__overlay'),
  modalCloseBtn: document.querySelector('button[data-action="close-modal"]'),
};

refs.table.addEventListener('click', handleClick);
refs.modalOverlay.addEventListener('click', closeModal);
refs.modalCloseBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.code === 'Escape') closeModal();
});
refs.form.addEventListener('submit', addUser);

render();

function getTableMarkup(users) {
  const tableHeaderMarkup = `
  <tr>
      <th data-value="name">Name</th>
      <th data-value="username">Username</th>
      <th data-value="email">Email</th>
      <th data-value="website">Web Site</th>
      </tr>`;

  const tableContentMarkup = users
    .map(user => {
      return `
        <tr id="${user.id}">
        <td>${user.name}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.website}</td>
          <td><button class="button button__delete-user" data-action="delete-user">Delete User</button></td>
          </tr>`;
    })
    .join('');

  return tableHeaderMarkup + tableContentMarkup;
}

function render() {
  refs.table.innerHTML = getTableMarkup(users);
}

function handleClick(e) {
  const id = Number(e.path.find(({ nodeName }) => nodeName === 'TR').id);
  const { nodeName, dataset } = e.target;

  if (nodeName === 'TH') {
    userFilter(dataset.value);
    return;
  }

  if (nodeName === 'BUTTON') {
    dataset.action === 'delete-user' && deleteUser(id);
    dataset.action === 'add-user' && addUser(user);
  } else {
    openModal();
    setModalContent(id);
  }
}

function userFilter(filter) {
  const sortByFilter = (a, b) => ('' + a[filter]).localeCompare(b[filter]);

  users.sort(sortByFilter);
  render();
}

function openModal() {
  refs.modal.classList.add('is-open');
}

function setModalContent(id) {
  const user = users.find(user => user.id === id);
  const city = user?.address?.city
    ? user.address.city
    : 'No information available.';
  const street = user?.address?.street
    ? user.address.street
    : 'No information available.';
  const zipcode = user?.address?.zipcode
    ? user.address.zipcode
    : 'No information available.';
  const phone = user?.phone ? user.phone : 'No information available.';

  refs.modalContent.innerHTML = `
    <ul class="modal__list">
      <li class="modal__item">
        <span>City: </span> ${city}
      </li>
      <li class="modal__item">
        <span>Street: </span> ${street}
      </li>
      <li class="modal__item">
        <span>Zip Code: </span> ${zipcode}
      </li>
      <li class="modal__item">
        <span>Phone: </span> ${phone}
      </li>
    </ul>
  `;
}

function closeModal() {
  refs.modal.classList.remove('is-open');
  refs.modalContent.innerHTML = '';
}

function addUser(e) {
  e.preventDefault();

  const name = refs.nameInput.value.trim();
  const username = refs.usernameInput.value.trim();
  const email = refs.emailInput.value.trim();
  const website = refs.websiteInput.value.trim();

  if (name === '' || username === '' || email === '' || website === '') {
    return alert('Fill in all the fields!');
  }

  users.push({
    id: Date.now(),
    name,
    username,
    email,
    website,
  });

  render();
  refs.form.reset();
}

function deleteUser(id) {
  users = users.filter(user => {
    return user.id !== id;
  });

  render();
}
