"use strict";

const progressBar = document.querySelector(".swiper-progress-bar");

const selectorProjects = document.querySelector('.projects-row');
const selectorFilters = document.querySelector('.projects-filters ul');
const btnMore = document.querySelector('.btn-download-more');

const complexesList = fetch("https://test.smarto.agency/smarto_complexes_list.json").then(res => res.json());

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  on: {
    autoplayTimeLeft(s, time, progress) {
      progressBar.style.setProperty("--progress", 1 - progress);
    }
  }
});

complexesList.then(data => {
  const uniqueTypes = data.map(item => item.type).filter((type, index, arr) => type && arr.indexOf(type) === index);
  for (let i = 0; i < uniqueTypes.length; i++) {
    const nameType = uniqueTypes[i];
    selectorFilters.insertAdjacentHTML('beforeend', `<li>${nameType}</li>`);
  }

  selectorFilters.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', (e) => {
      selectorFilters.querySelector('.active')?.classList.remove('active');
      item.classList.add('active');

      const newCards = data.filter(card => card.type == item.innerText || item.innerText == 'Усі');
      selectorProjects.innerHTML = '';
      selectorProjects.insertAdjacentHTML('beforeend', renderCard(newCards));

      btnMore.classList.remove('hide');
      
    })
  })

  selectorProjects.insertAdjacentHTML('beforeend', renderCard(data));
})

const renderTag = (tags) => {
  return tags.map(item => {
    return `<div class="card-tag">${item}</div>`;
  }).join('');
}

const renderCard = (data) => {
  return data.map((item, index )=> {
    const {id, adress, img, name, tags, type, year} = item;

    return `
        <a href="#" class="projects-card card ${index > 2 ? 'hide' : ''}" data-id="${id}">
          <div class="card-pin">
            <svg class="icon icon-pin" fill="#0a0f13" width="34" height="34">
              <use xlink:href="img/sprite/sprite.svg#pin"></use>
            </svg>
          </div>
          <div class="card-top">
            <p class="card-year">${year}</p>
            <p class="card-type">${type}</p>
          </div>
          <img src="${img}" alt="${name}" class="card-img"/>
          
          <h3 href="#" class="title-h3 card-title">${name}</h3>
          <p class="card-location">${adress}</p>
          <div class="card-tags">
            <p class="card-tags--title">Види робіт:</p>
            <div class="card-tags-work">${renderTag(tags)}</div>
          </div>
        </a>`;
  }).join('');
}

btnMore.addEventListener('click', (e) => {
  const cards = document.querySelectorAll('.card');

  const hiddenCards = [...cards].filter(card => card.classList.contains('hide')).slice(0, 3);
  hiddenCards.forEach(card => card.classList.remove('hide'));

  if (!cards[cards.length - 1].classList.contains('hide')) {
    btnMore.classList.add('hide');
  } else {
    btnMore.classList.remove('hide');
  }
});
