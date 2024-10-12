
const apiKey = '8bb837b90c4a693b9eb5dd5b42d58c57'; // Tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Obtener y mostrar películas populares
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error al obtener las películas populares:', error);
    }
}

// Mostrar películas
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
            <button onclick="addToFavorites(${movie.id})">Agregar a Favoritos</button>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Mostrar detalles de la película
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const movie = await response.json();
        detailsContainer.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        `;
        movieDetails.classList.remove('hidden');
        selectedMovieId = movieId;
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
    }
}

// Agregar película a favoritos
function addToFavorites(movieId) {
    if (!favoriteMovies.includes(movieId)) {
        favoriteMovies.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
        updateFavoritesList();
    }
}

// Actualizar lista de favoritos
function updateFavoritesList() {
    favoritesList.innerHTML = '';
    favoriteMovies.forEach(async (movieId) => {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`);
        const movie = await response.json();
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        favoritesList.appendChild(li);
    });
}

// Buscar películas
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error al buscar películas:', error);
        }
    }
});

// Inicializar la aplicación cargando las películas populares y la lista de favoritos
fetchPopularMovies();
updateFavoritesList();
