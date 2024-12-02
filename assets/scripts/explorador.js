const apiKey = '0447ee4eb499ae455b3283aeee4541ed'; 
const baseUrl = 'https://api.themoviedb.org/3';

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

// Função para buscar séries pela API
const searchCache = {};
let debounceTimer;

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    // Cancela buscas se o campo estiver vazio ou muito curto
    if (query.length < 2) { 
        resultsContainer.innerHTML = ''; // Limpa os resultados
        return; 
    }

    // Cancela chamadas anteriores
    clearTimeout(debounceTimer);

    // Executa a busca após um pequeno atraso
    debounceTimer = setTimeout(() => {
        searchSeries(query); // Chama a função de busca
    }, 300); // Tempo do debounce
});

// Função para buscar séries
async function searchSeries(query) {
    if (searchCache[query]) {
        renderSeries(searchCache[query]); // Usa os dados do cache
        return;
    }

    const url = `${baseUrl}/search/tv?api_key=${apiKey}&query=${query}&language=pt-BR`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        searchCache[query] = data.results; // Armazena no cache
        renderSeries(data.results);
    } catch (error) {
        resultsContainer.innerHTML = '<p>Erro ao buscar séries. Tente novamente.</p>';
        console.error('Erro ao buscar séries:', error);
    }
}

// Função para carregar séries populares ao carregar a página
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
    resultsContainer.innerHTML = ''; // Limpar resultados anteriores

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

// Evento para iniciar a busca
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchSeries(query);
    }
});

// Evento de pressionamento da tecla Enter para realizar a busca
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// Carregar as séries populares assim que a página for carregada
document.addEventListener('DOMContentLoaded', loadInitialSeries);

