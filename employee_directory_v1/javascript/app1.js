let employees;
const url = `https://randomuser.me/api/?results=75&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const search = document.querySelector('input');
const searchBtn = document.querySelector('.search-btn');
const gridContainer = document.querySelector('.content-wrapper');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const modalCard = document.querySelector('.model-content');

// Display all employees =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function displayEmployees(response) {
  employees = response;

  let employeeHTML = '';

  employees.forEach((employee, index) => {
    const { name } = employee;
    const { email } = employee;
    const { city } = employee.location;
    const { picture } = employee;
    const emailSplit = email.split('@');
    employeeHTML += `
  <div class="employee-card" data-index="${index}">
  <img class="profile-pic" src="${picture.large}" />
  <div class="employee-details">
  <h2 class="employee-name">${name.first} ${name.last}</h2>
  <p class="employee-email-address">${emailSplit[0]}</p> 
<p class="employee-email-address">@${emailSplit[1]}</p>
  <p class="employee-city">${city}</p>
  </div>
  </div>
  `;
  });

  gridContainer.innerHTML = employeeHTML;
}

// Display modal employee =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

function displayModal(index) {
  // use object destructuring to make template literal cleaner
  const {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];
  const date = new Date(dob.date);
  const modalHTML = `
 
    <button class="prev-employee-btn" type="button" >&#60;</button>
    <img class="profile-pic" src="${picture.large}" />
    <button class="next-employee-btn" type="button" >&#62;</button>
    <div class="text-container" data-index="${index}" >
    <h2 class="employee-name-modal">${name.first} ${name.last}</h2>
    <p class="employee-email-address employee-email-address-modal">${email}</p>
    <p class="employee-city">${city}</p>
    <hr class="hr-break"/>
    <p class="employee-phone">${phone}</p>
    <p class="employee-address">${street}, ${state} ${postcode}</p>
    <p class="employee-birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>

`;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
  document.querySelector('.prev-employee-btn').addEventListener('click', () => {
    prevEmployeeBtn();
  });
  document.querySelector('.next-employee-btn').addEventListener('click', () => {
    nextEmployeeBtn();
  });
}

// Search Input Functionality =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const searchFunction = () => {
  const employeesNameArr = document.querySelectorAll('.employee-name');
  const searchValue = search.value.toLowerCase();

  for (let i = 0; i < employeesNameArr.length; i += 1) {
    const employeeCard = employeesNameArr[i].parentNode.parentNode;
    const employeeName = employeesNameArr[i].textContent.toLowerCase();
    const searchMatch = employeeName.includes(searchValue);
    if (searchMatch === false) {
      employeeCard.style.display = 'none';
    }
  }
};

fetch(url)
  .then(response => response.json())
  .then(response => response.results)
  .then(response => displayEmployees(response))
  .catch(err => alert(err));

// EVENT LISTENERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

searchBtn.addEventListener('click', () => {
  searchFunction();
});

search.addEventListener('click', () => {
  const employeeCard = document.querySelectorAll('.employee-card');
  for (let i = 0; i < employeeCard.length; i += 1) {
    employeeCard[i].style.display = 'flex';
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

gridContainer.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    const card = e.target.closest('.employee-card');
    const index = card.getAttribute('data-index');
    displayModal(index);
    if (index === '0') {
      document.querySelector('.prev-employee-btn').style.display = 'none';
    } else if (index === '74')
      document.querySelector('.next-employee-btn').style.display = 'none';
  }
});

function prevEmployeeBtn() {
  const currentModalEmployeeIndexAsString = document
    .querySelector('.text-container ')
    .getAttribute('data-index');
  const currentModalEmployeeIndexAsNumber = parseInt(
    currentModalEmployeeIndexAsString
  );
  displayModal(currentModalEmployeeIndexAsNumber - 1);
  if (currentModalEmployeeIndexAsString === '1') {
    document.querySelector('.prev-employee-btn').style.display = 'none';
  } else {
    document.querySelector('.prev-employee-btn').style.display = 'block';
  }
}

function nextEmployeeBtn() {
  const currentModalEmployeeIndexAsString = document
    .querySelector('.text-container ')
    .getAttribute('data-index');
  const currentModalEmployeeIndexAsNumber = parseInt(
    currentModalEmployeeIndexAsString
  );
  displayModal(currentModalEmployeeIndexAsNumber + 1);
  if (currentModalEmployeeIndexAsString === '73') {
    document.querySelector('.next-employee-btn').style.display = 'none';
  } else {
    document.querySelector('.next-employee-btn').style.display = 'block';
  }
}
