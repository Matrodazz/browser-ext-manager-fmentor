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

      // botão remover
      card.querySelector('.remove__button').addEventListener('click', () => {
        const realIndex = allData.findIndex(d => d.name === item.name);
        if (realIndex > -1) {
          allData.splice(realIndex, 1);
          localStorage.setItem('extensionsData', JSON.stringify(allData));
        }
        // reaplica filtro atual
        applyCurrentFilter();
      });


      // slider ativo/inativo
      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        const realIndex = allData.findIndex(d => d.name === item.name);
        if (realIndex > -1) {
          allData[realIndex].isActive = checkbox.checked;
          localStorage.setItem('extensionsData', JSON.stringify(allData));
        }

        // verifica filtro atual
        const activeFilterBtn = document.querySelector('.filter__button--selected');
        const currentFilter = activeFilterBtn?.dataset.filter || 'all';

        // se o card não pertence mais ao filtro atual, remove apenas ele
        const shouldBeVisible =
          currentFilter === 'all' ||
          (currentFilter === 'active' && checkbox.checked) ||
          (currentFilter === 'inactive' && !checkbox.checked);

        if (!shouldBeVisible) {
          card.remove();
        }
      });

    list.appendChild(card);
    });
  }

  // aplica o filtro que estiver selecionado
  function applyCurrentFilter() {
    const activeFilterBtn = document.querySelector('.filter__button--selected');
    const currentFilter = activeFilterBtn?.dataset.filter || 'all';
    let newData = [];
    switch (currentFilter) {
      case 'active':
        newData = allData.filter(d => d.isActive);
        break;
      case 'inactive':
        newData = allData.filter(d => !d.isActive);
        break;
      default:
        newData = allData;
    }
    renderCards(newData);
  }

  // eventos dos botões de filtro
  if (filters) {
    filters.addEventListener('click', (event) => {
      const btn = event.target.closest('.filter__button');
      if (!btn) return;

      // remove seleção de todos
      document.querySelectorAll('.filter__button').forEach(b => b.classList.remove('filter__button--selected'));
      btn.classList.add('filter__button--selected');

      // chama função que aplica filtro atual
      applyCurrentFilter();
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