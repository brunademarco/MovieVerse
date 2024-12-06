const apiKey = '0447ee4eb499ae455b3283aeee4541ed'; 
const baseUrl = 'https://api.themoviedb.org/3';

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

const searchCache = {};
let debounceTimer;

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (query.length < 2) { 
        resultsContainer.innerHTML = ''; 
        return; 
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        searchSeries(query); 
    }, 300); 
});

async function searchSeries(query) {
    if (searchCache[query]) {
        renderSeries(searchCache[query]); 
        return;
    }

    const url = `${baseUrl}/search/tv?api_key=${apiKey}&query=${query}&language=pt-BR`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        searchCache[query] = data.results; 
        renderSeries(data.results);
    } catch (error) {
        resultsContainer.innerHTML = '<p>Erro ao buscar séries. Tente novamente.</p>';
        console.error('Erro ao buscar séries:', error);
    }
}

async function loadInitialSeries() {
    const url = `${baseUrl}/tv/popular?api_key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderSeries(data.results);
    } catch (error) {
        resultsContainer.innerHTML = '<p>Ocorreu um erro ao carregar séries populares. Tente novamente.</p>';
        console.error('Erro ao carregar séries populares:', error);
    }
}

function renderSeries(series) {
    resultsContainer.innerHTML = ''; 

    const filteredSeries = series.filter(serie => serie.overview && serie.overview.trim() !== '');

    if (filteredSeries.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhuma série encontrada com descrição disponível.</p>';
        return;
    }

    filteredSeries.forEach(serie => {
        const cardHTML = `
            <div class="col-md-4 mb-4">
                <div class="card card-pesquisa">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text">${serie.overview.slice(0, 100)}...</p>
                    </div>
                    <div class="botao">
                        <!-- Link para a página de detalhes -->
                        <a href="detalhesdaserie.html?id=${serie.id}" class="btn btn-primary">Ver detalhes</a>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML += cardHTML;
    });
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchSeries(query);
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

document.addEventListener('DOMContentLoaded', loadInitialSeries);

