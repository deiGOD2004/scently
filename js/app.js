/* ==========================================================================
   ScentVault — Lógica de la aplicación
   Depende de: js/data.js (fragrancesDB) y Chart.js
   ========================================================================== */

// --- 1. CONFIGURACIÓN ---
// Crea una cuenta en openweathermap.org y pon tu API Key aquí para usar el clima real.
// Mientras sea 'TU_API_KEY_AQUI' se usa una temperatura simulada.
const WEATHER_API_KEY = 'TU_API_KEY_AQUI';
const SIMULATED_TEMP = 14; // Temperatura de ejemplo (Puebla)
const STORAGE_KEY = 'scently_collection';
const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#222"/>' +
    '<text x="50%" y="50%" fill="#666" font-family="sans-serif" font-size="28" text-anchor="middle">Sin imagen</text></svg>'
);

// --- 2. "MI COLECCIÓN" (LocalStorage) ---
let myCollection = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function toggleFavorite(id) {
    if (myCollection.includes(id)) {
        myCollection = myCollection.filter(favId => favId !== id);
    } else {
        myCollection.push(id);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myCollection));
    renderCards(fragrancesDB);
    closeModal('perfume-modal');
}

// --- 3. RENDERIZADO Y BÚSQUEDA ---
const container = document.getElementById('catalog-container');
const searchInput = document.getElementById('search-input');

function getAllNotes(f) {
    return [...f.notes.top, ...f.notes.heart, ...f.notes.base];
}

function createBadgesHTML(notesArray, cssClass) {
    return notesArray.map(note => `<span class="note-badge ${cssClass}">${note}</span>`).join('');
}

function renderCards(data) {
    container.innerHTML = '';
    if (data.length === 0) {
        container.innerHTML = '<p class="empty-msg">No encontramos nada, manito. Intenta otra búsqueda.</p>';
        return;
    }
    data.forEach(fragrance => {
        const isFav = myCollection.includes(fragrance.id);
        const card = document.createElement('div');
        card.className = 'fragrance-card';
        card.addEventListener('click', () => openModal(fragrance.id));

        card.innerHTML = `
            <div class="card-media">
                <img src="${fragrance.image}" alt="${fragrance.brand} ${fragrance.name}" class="fragrance-image" loading="lazy" onerror="this.src=PLACEHOLDER_IMG">
                ${isFav ? '<div class="fav-marker">❤️</div>' : ''}
            </div>
            <div class="card-content">
                <div class="brand-name">${fragrance.brand}</div>
                <h2 class="fragrance-name">${fragrance.name}</h2>
            </div>
        `;
        container.appendChild(card);
    });
}

function setActiveFilter(button) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
}

function handleSearch() {
    const query = searchInput.value.toLowerCase();
    setActiveFilter(null);

    const filtered = fragrancesDB.filter(f => {
        const inNameBrand = f.name.toLowerCase().includes(query) || f.brand.toLowerCase().includes(query);
        const inNotes = getAllNotes(f).join(' ').toLowerCase().includes(query);
        return inNameBrand || inNotes;
    });
    renderCards(filtered);
}

function filterCatalog(filterType, button) {
    setActiveFilter(button);
    searchInput.value = '';

    if (filterType === 'Todos') {
        renderCards(fragrancesDB);
    } else if (filterType === 'MiColeccion') {
        renderCards(fragrancesDB.filter(f => myCollection.includes(f.id)));
    } else {
        // "Todo clima" también cuenta para cualquier filtro de clima
        renderCards(fragrancesDB.filter(f =>
            f.contexts.weather.includes(filterType) ||
            f.contexts.weather.includes('Todo clima') && ['Frío', 'Cálido'].includes(filterType) ||
            f.contexts.events.includes(filterType)
        ));
    }
}

// --- 4. MODAL DE DETALLE ---
function openModal(id) {
    const f = fragrancesDB.find(item => item.id === id);
    const isFav = myCollection.includes(f.id);
    const searchUrl = `https://www.amazon.com.mx/s?k=${encodeURIComponent(f.brand + ' ' + f.name)}`;

    document.getElementById('modal-body').innerHTML = `
        <div class="modal-media">
            <img src="${f.image}" alt="${f.brand} ${f.name}" class="modal-image" onerror="this.src=PLACEHOLDER_IMG">
        </div>
        <div class="modal-info">
            <div class="brand-name">${f.brand}</div>
            <h2>${f.name}</h2>
            <p class="score">★ ${f.review.score}/5</p>

            <h3>Notas:</h3>
            ${createBadgesHTML(f.notes.top, 'top-note')}
            ${createBadgesHTML(f.notes.heart, 'heart-note')}
            ${createBadgesHTML(f.notes.base, 'base-note')}

            <p class="review-text">"${f.review.text}"</p>

            <button class="fav-btn" onclick="toggleFavorite(${f.id})">
                ${isFav ? '❌ Quitar de Mi Colección' : '❤️ Agregar a Mi Colección'}
            </button>
            <a href="${searchUrl}" target="_blank" rel="noopener" class="buy-btn">🛒 Buscar para Comprar</a>
        </div>
    `;
    document.getElementById('perfume-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- 5. DASHBOARD ESTADÍSTICO (Chart.js) ---
let myChartInstance = null;

function openStatsModal() {
    if (myCollection.length === 0) {
        alert('Manito, tu colección está vacía. Agrega perfumes primero usando el botón ❤️ en los detalles.');
        return;
    }

    // Contar cuántas veces aparece cada nota en la colección
    const noteCounts = {};
    myCollection.forEach(id => {
        const f = fragrancesDB.find(x => x.id === id);
        if (f) getAllNotes(f).forEach(note => { noteCounts[note] = (noteCounts[note] || 0) + 1; });
    });

    // Top 5 de notas
    const sortedNotes = Object.entries(noteCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sortedNotes.map(n => n[0]);
    const data = sortedNotes.map(n => n[1]);

    document.getElementById('stats-modal').style.display = 'flex';
    document.getElementById('stats-msg').innerText =
        `Tu colección tiene una fuerte tendencia hacia la nota de ${labels[0]}. ¡Excelente gusto!`;

    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChartInstance) myChartInstance.destroy();

    myChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#bb86fc', '#ffafcc', '#a2d2ff', '#cdb4db', '#ffd700'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { labels: { color: '#fff' } } } }
    });
}

// --- 6. CLIMA (OpenWeatherMap) ---
const banner = document.getElementById('weather-banner');

function getRecommendationByTemp(temp) {
    if (temp < 15) return '❄️ Hace frío. Sugerimos perfumes dulces.';
    if (temp < 25) return '⛅ Clima templado.';
    return '☀️ ¡Hace calor! Usa cítricos, acuáticos.';
}

function showWeather(place, temp, description = '') {
    banner.innerHTML = `📍 <strong>${place}</strong> | 🌡️ ${temp}°C ${description ? '- ' + description : ''}
        <br><span class="highlight">${getRecommendationByTemp(temp)}</span>`;
}

function fetchWeather() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        if (WEATHER_API_KEY === 'TU_API_KEY_AQUI') {
            showWeather('Clima Local Detectado', SIMULATED_TEMP);
            return;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${WEATHER_API_KEY}&lang=es`;
        fetch(url)
            .then(response => response.json())
            .then(data => showWeather(data.name, Math.round(data.main.temp), data.weather[0].description))
            .catch(() => { banner.innerHTML = 'No pudimos conectar con el satélite de clima.'; });
    }, () => {
        banner.innerHTML = 'Activa tu ubicación para darte recomendaciones olfativas basadas en el clima real.';
    });
}

// --- 7. EVENTOS E INICIALIZACIÓN ---
searchInput.addEventListener('input', handleSearch);
document.getElementById('stats-btn').addEventListener('click', openStatsModal);

document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => filterCatalog(btn.dataset.filter, btn))
);

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    // Cerrar al hacer clic fuera del contenido o en la ×
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
    overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay.id));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => closeModal(m.id));
});

renderCards(fragrancesDB);
fetchWeather();
