
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

        // Preencher informações de temporadas e episódios
        const temporadas = data.seasons || [];
        document.getElementById('temporadas').textContent = `${temporadas.length} Temporada(s)`;
        document.getElementById('episodios').textContent = `${temporadas.reduce((acc, season) => acc + (season.episode_count || 0), 0)} Episódio(s)`;

        // Carregar elenco
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

// Carregar os detalhes da série ao carregar a página
window.onload = carregarDetalhesSerie;

document.getElementById('favoritarBtn').addEventListener('click', function() {
    const serieId = this.getAttribute('data-id');  // Pega o ID da série a partir do atributo data-id
    const serieNome = 'Nome da Série'; // Nome da série, isso pode ser dinamicamente extraído
    const serieDescricao = 'Descrição da Série'; // Descrição da série, também extraída dinamicamente
    const serieImagem = 'URL da imagem'; // A URL da imagem da série, extraída dinamicamente
    
    const novoFavorito = {
      id: serieId,
      nome: serieNome,
      descricao: serieDescricao,
      imagem: serieImagem
    };
  
    // Envia a série para o servidor (json-server)
    fetch('http://localhost:3000/favoritos', {
      method: 'POST',  // Envia como uma requisição POST
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoFavorito)  // Envia os dados da série como JSON
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
