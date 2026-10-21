# 🌸 ScentVault (Scently)

> Catálogo web inteligente de fragancias: explora 30 perfumes, filtra por clima u ocasión, arma tu colección personal y descubre tu **perfil olfativo**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

---

## ✨ Funcionalidades

| Función | Descripción |
|---|---|
| 🔎 **Búsqueda avanzada** | Busca por nombre, marca o nota olfativa (ej. *vainilla*, *cuero*). |
| 🏷️ **Filtros rápidos** | Clima frío, clima cálido, citas o solo tu colección. |
| ❤️ **Mi Colección** | Guarda tus favoritos; se conservan en el navegador (`localStorage`). |
| 📊 **Perfil olfativo** | Gráfica con las 5 notas más presentes en tu colección (Chart.js). |
| 🌦️ **Recomendación por clima** | Usa tu ubicación y la temperatura para sugerir el tipo de perfume. |
| 🛒 **Buscar para comprar** | Enlace directo a la búsqueda del perfume en Amazon México. |

## 📁 Estructura del proyecto

```
scently/
├── index.html          # Estructura de la página
├── css/
│   └── styles.css      # Estilos (tema oscuro, tarjetas, modales)
├── js/
│   ├── data.js         # Base de datos de las 30 fragancias
│   └── app.js          # Lógica: render, búsqueda, filtros, colección, stats, clima
└── assets/
    └── img/            # Imágenes de los perfumes (1.jpg … 30.jpg)
```

## 🚀 Cómo ejecutarlo

No necesita instalación ni build. Opciones:

1. **Directo:** abre `index.html` en tu navegador.
2. **Servidor local** (recomendado para que funcione la geolocalización):
   ```bash
   python -m http.server 8000
   ```
   y entra a <http://localhost:8000>.

## 🌦️ Activar el clima real

Por defecto el banner usa una temperatura simulada. Para usar datos reales:

1. Crea una cuenta gratuita en [OpenWeatherMap](https://openweathermap.org/api) y copia tu API Key.
2. En `js/app.js`, reemplaza el valor de `WEATHER_API_KEY`:
   ```js
   const WEATHER_API_KEY = 'tu_api_key';
   ```

> ⚠️ No subas tu API Key real a un repositorio público.

## ➕ Agregar una fragancia

1. Guarda la imagen como `assets/img/31.jpg`.
2. Agrega un objeto al arreglo `fragrancesDB` en `js/data.js`:

```js
{
    id: 31,
    name: "Nombre",
    brand: "Marca",
    image: "assets/img/31.jpg",
    notes: { top: ["..."], heart: ["..."], base: ["..."] },
    contexts: { weather: ["Frío"], events: ["Citas"] },
    similarIds: [2, 5],
    review: { text: "Reseña breve.", score: 4.5 }
}
```

Climas usados: `Frío`, `Fresco`, `Templado`, `Cálido`, `Caluroso`, `Todo clima`.

## 👤 Autor

**Diego Rendón Santos** — [@deiGOD2004](https://github.com/deiGOD2004)
