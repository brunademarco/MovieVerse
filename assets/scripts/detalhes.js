
const apiKey = '0447ee4eb499ae455b3283aeee4541ed'; 

function getSerieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); 
}

async function carregarDetalhesSerie() {
    const serieId = getSerieIdFromUrl(); 
    if (!serieId) {
        console.error("ID da série não encontrado na URL.");
        return;
    }

    const url = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=pt-BR`;
    const urlElenco = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=pt-BR`;

    try {
        
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById('serie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        document.getElementById('genero').textContent = `Gênero: ${data.genres.map(genre => genre.name).join(', ')}`;
        document.getElementById('onde-assistir').textContent = `Onde assistir: ${data.networks.map(network => network.name).join(', ')}`;
        document.getElementById('data-lancamento').textContent = `Data de lançamento: ${data.first_air_date}`;
        document.getElementById('descricao').textContent = data.overview;

        const temporadas = data.seasons || [];
        document.getElementById('temporadas').textContent = `${temporadas.length} Temporada(s)`;
        document.getElementById('episodios').textContent = `${temporadas.reduce((acc, season) => acc + (season.episode_count || 0), 0)} Episódio(s)`;

        const elencoResponse = await fetch(urlElenco);
        const elencoData = await elencoResponse.json();
        const elencoContainer = document.getElementById('cards-elenco');

        elencoContainer.innerHTML = ''; 

        elencoData.cast.slice(0, 5).forEach(ator => {
            const cardElenco = document.createElement('div');
            cardElenco.classList.add('col');
            cardElenco.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${ator.profile_path || ''}" class="card-img-top" alt="${ator.name}">
                    <div class="card-body">
                        <h5 class="card-title">${ator.name}</h5>
                        <p class="card-text">${ator.character || 'Personagem não informado'}</p>
                    </div>
                </div>
            `;
            elencoContainer.appendChild(cardElenco);
        });

    } catch (error) {
        console.error("Erro ao carregar os dados da série:", error);
    }
}

window.onload = carregarDetalhesSerie;

document.getElementById('favoritarBtn').addEventListener('click', function() {
    const serieId = this.getAttribute('data-id');  
    const serieNome = 'Nome da Série'; 
    const serieDescricao = 'Descrição da Série'; 
    const serieImagem = 'URL da imagem'; 
    
    const novoFavorito = {
      id: serieId,
      nome: serieNome,
      descricao: serieDescricao,
      imagem: serieImagem
    };
 
    fetch('http://localhost:3000/favoritos', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoFavorito)  
    })
    .then(response => response.json())
    .then(data => {
      alert('Série adicionada aos favoritos!');
    })
    .catch(error => {
      console.error('Erro ao adicionar aos favoritos:', error);
      alert('Houve um erro ao adicionar a série aos favoritos.');
    });
  });
  
document.getElementById('favorite-button').addEventListener('click', function() {
    this.classList.toggle('favoritado'); 
});
