import Notiflix from 'notiflix';

const axios = require('axios').default;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

let searchQuery = '';
let page = 1;
const perPage = 40;

function handleSubmit(event) {
  event.preventDefault();
  searchQuery = form.searchQuery.value.trim();
  if (searchQuery === '') return;

  clearGallery();
  performSearch();
}

function clearGallery() {
  gallery.innerHTML = '';
  page = 1;
  loadMoreBtn.style.display = 'none';
}

async function performSearch() {
  const APIKEY = '37351481-6ed7b9f731a9010946918b10b';
  const apiUrl = `https://pixabay.com/api/?key=${APIKEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.hits.length === 0) {
      showNoResultsMessage();
    } else {
      displayImages(data.hits);
      if (data.totalHits <= page * perPage) {
        showEndOfResultsMessage();
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

function displayImages(images) {
  const cardsHTML = images.map(image => createImageCard(image)).join('');
  gallery.insertAdjacentHTML('beforeend', cardsHTML);
}

function createImageCard(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
}

function showNoResultsMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function loadMoreImages() {
  page++;
  performSearch();
}
