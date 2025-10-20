document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const button = document.getElementById("theme__toggle");
  const icon = document.getElementById("theme__icon");
  const list = document.getElementById('cardList');
  let allData = [];

  // alternar tema claro/escuro
  if (button && icon) {
    button.addEventListener("click", () => {
      const isDark = body.getAttribute("data-theme") === "dark";
      body.setAttribute("data-theme", isDark ? "light" : "dark");
      icon.src = isDark ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
    });
  }



  // cria e adiciona os cards
  function renderCards(data) {
    list.innerHTML = '';

    data.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('extension__card');

      card.innerHTML = `
        <div class="extension__card__top">
          <img src="${item.logo}" alt="${item.name}"/>
          <div class="extension__card__details">
            <h3>${item.name}</h3>
            <p class="extension__description">${item.description}</p>
          </div>
        </div>
        <div class="extension__card__buttons">
          <button class="remove__button">Remover</button>
          <label class="switch">
            <input type="checkbox" ${item.isActive ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      `;

    list.appendChild(card);
    });
  }

  // carrega JSON com os dados
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      const saved = JSON.parse(localStorage.getItem('extensionsData'));
      allData = saved && Array.isArray(saved) ? saved : data;
      renderCards(allData);
    })
    .catch(error => console.error('Erro ao carregar data.json:', error));


});