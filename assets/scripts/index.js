const url = "http://localhost:3000";

const API_KEY = '0447ee4eb499ae455b3283aeee4541ed';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w1280/';
const URL_POPULAR_SERIES = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
const URL_NEW_SERIES = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=first_air_date.desc&language=pt-BR&page=1`;

const carouselInner = document.querySelector('.carousel-inner');
const indicators = document.querySelector('.carousel-indicators');

fetch(URL_POPULAR_SERIES)
    .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        return response.json();
    })
    .then(data => {
        data.results.forEach((serie, index) => {
            const isActive = index === 0 ? 'active' : '';

            const slide = `
                <div class="carousel-item ${isActive}">
                    <img src="${IMG_BASE_URL}${serie.backdrop_path}" class="d-block w-100" alt="${serie.name}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${serie.name}</h5>
                        <p>${serie.overview || 'Descrição não disponível.'}</p>
                    </div>
                </div>
            `;
            carouselInner.innerHTML += slide;

            const indicator = `
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>
            `;
            indicators.innerHTML += indicator;
        });
    })
    .catch(error => console.error('Erro ao carregar séries:', error));


fetch(URL_NEW_SERIES)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados das séries novas');
        }
        return response.json();
    })
    .then(data => {
        if (!data || !data.results) {
            throw new Error('Dados inválidos ou série não encontrada');
        }
        const series = data.results.slice(0, 5); 
        const cardsContainer = document.getElementById('series-cards');
        cardsContainer.innerHTML = ''; 
        
        series.forEach(serie => {
            
            if (!serie.poster_path) return;

            
            const col = document.createElement('div');
            col.classList.add('col'); 

            col.innerHTML = `
                <div class="card h-100">
                <a href=""../public/detalhesdaserie.html?id=${serie.id}">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text text-truncate" style="max-height: 4rem; overflow: hidden;">
                            ${serie.overview || "Descrição indisponível."}
                        </p>
                        
                    </div>
                </div></a>
            `;

            cardsContainer.appendChild(col);
        });
    })
    .catch(error => console.error('Erro:', error));

fetch(`${url}/autor`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("autor-nome").textContent = data.nome;
        document.getElementById("autor-avatar").src = data.avatar;
        document.getElementById("autor-curso").textContent = `${data.curso}`;
        document.getElementById("autor-turma").textContent = `${data.turma}`;
        document.getElementById("autor-biografia").textContent = `${data.biografia}`;

        document.querySelector(".github-link").href = data.redes.github;
        document.querySelector(".linkedin-link").href = data.redes.linkedin;
        document.querySelector(".instagram-link").href = data.redes.instagram;
    })
    .catch(error => console.error("Erro ao buscar dados do autor:", error));

fetch(`${url}/favoritos`)
    .then(response => response.json())
    .then(data => {
        const favoritosDiv = document.getElementById("favoritos");
        data.forEach(favorito => {
            const favoritoDiv = document.createElement("div");
            favoritoDiv.innerHTML = `
                <h2>${favorito.nome}</h2>
                <img src="${favorito.imagem}" alt="${favorito.nome}" style="width:100px;">
                <p>${favorito.descricao}</p>
            `;
            favoritosDiv.appendChild(favoritoDiv);
        });
    })
    .catch(error => console.error("Erro ao buscar favoritos:", error));

const URL_FAVORITE_SERIES = "http://localhost:3000/favoritos";

fetch('http://localhost:3000/favoritos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar favoritos');
    }
    return response.json();  
  })
  .then(data => {
    const container = document.getElementById('favorite-series-container');
    container.innerHTML = ""; 

    data.forEach(item => {

      const card = `
        <div class="col">
          <div class="card h-100">
            <img src="${item.imagem}" alt="${item.nome}" class="card-img-top" />
            <a href="detalhesdaserie.html?id=${item.id}">
              <div class="card-overlay">
                <h5 class="card-title">${item.nome || "Nome não disponível"}</h5>
                <p class="card-text">${item.descricao || "Descrição não disponível"}</p>
              </div>
            </a>
          </div>
        </div>
      `;
      container.innerHTML += card; 
    });
  })
  .catch(error => console.error("Erro ao carregar favoritos:", error));
