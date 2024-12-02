const apiKey = '0447ee4eb499ae455b3283aeee4541ed'; // Substitua pela sua chave da API do The Movie DB

// Função para pegar o ID da série da URL
function getSerieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Pega o valor do parâmetro 'id' da URL
}

// Função para carregar os detalhes da série
async function carregarDetalhesSerie() {
    const serieId = getSerieIdFromUrl(); // Pega o ID da série da URL
    if (!serieId) {
        console.error("ID da série não encontrado na URL.");
        return;
    }

    const url = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=pt-BR`;
    const urlElenco = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=pt-BR`;
    const urlTemporadas = `https://api.themoviedb.org/3/tv/${serieId}/seasons?api_key=${apiKey}&language=pt-BR`;

    try {
        // Carregar detalhes da série
        const response = await fetch(url);
        const data = await response.json();

        // Preencher dados principais da série
        document.getElementById('serie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        document.getElementById('genero').textContent = `Gênero: ${data.genres.map(genre => genre.name).join(', ')}`;
        document.getElementById('onde-assistir').textContent = `Onde assistir: ${data.networks.map(network => network.name).join(', ')}`;
        document.getElementById('data-lancamento').textContent = `Data de lançamento: ${data.first_air_date}`;
        document.getElementById('descricao').textContent = data.overview;

        // Carregar elenco
        const elencoResponse = await fetch(urlElenco);
        const elencoData = await elencoResponse.json();
        const elencoContainer = document.getElementById('cards-elenco');

        elencoContainer.innerHTML = ''; // Limpar qualquer conteúdo antigo

        // Preencher elenco com 6 membros no máximo
        elencoData.cast.slice(0, 6).forEach(ator => {
            const cardElenco = document.createElement('div');
            cardElenco.classList.add('col');
            cardElenco.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${ator.profile_path}" class="card-img-top" alt="${ator.name}">
                    <div class="card-body">
                        <h5 class="card-title">${ator.name}</h5>
                        <p class="card-text">${ator.character}</p>
                    </div>
                </div>
            `;
            elencoContainer.appendChild(cardElenco);
        });

        // Carregar informações de temporadas e episódios
        const temporadasResponse = await fetch(urlTemporadas);
        const temporadasData = await temporadasResponse.json();

        document.getElementById('temporadas').textContent = `${temporadasData.length} Temporada(s)`;
        document.getElementById('episodios').textContent = temporadasData.reduce((acc, season) => acc + season.episode_count, 0) + ' Episódio(s)';
        document.getElementById('resumo').textContent = data.overview; // Resumo geral

    } catch (error) {
        console.error("Erro ao carregar os dados da série:", error);
    }
}

// Carregar os detalhes da série ao carregar a página
window.onload = carregarDetalhesSerie;
