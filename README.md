# 🌦️ Weather Explorer

A static, framework-free weather dashboard built with **Vanilla JavaScript (ES Modules)**.

Search any city, explore weather using an interactive map, save favorite locations, and switch the entire interface between **English and Georgian**.

---

## ✨ Features

### 🌍 Weather Search
- Search any city
- View current weather conditions
- Get a 5-day forecast
- Powered by OpenWeatherMap API

### 📍 Geolocation
- Automatically loads weather for your current location on first visit
- Manual **My Location** button
- Uses browser Geolocation API

### 🗺️ Interactive Map
- Built with Leaflet.js
- Click anywhere on the map to fetch weather for that location
- Explore weather conditions around the world

### 🎨 Dynamic Weather Themes

The interface changes depending on the weather:

- ☀️ Clear
- ☁️ Clouds
- 🌧️ Rain
- ⛈️ Thunderstorm
- ❄️ Snow
- 🌫️ Mist

### ⭐ Saved Cities
- Save favorite cities
- Remove saved locations
- Quickly open saved cities from the dashboard

### 🔎 Recent Searches
- Stores recent searches
- Quick access to previously searched cities

### 🔐 Authentication
Includes a local authentication system:

- Sign up / Sign in
- SHA-256 password hashing
- Random salt generation
- Data stored in browser localStorage

Demo account:

| Username | Password |
|---|---|
| demo | demo123 |

### 🌐 Language Support
Full English ↔ Georgian translation:

- UI translations
- Weather descriptions translated using OpenWeatherMap language support

---

# 🛠️ Tech Stack

| Feature | Technology |
|---|---|
| Programming | Vanilla JavaScript (ES Modules) |
| Styling | CSS Custom Properties + BEM |
| Map | Leaflet.js |
| Weather Data | OpenWeatherMap API |
| Authentication | Web Crypto API (SHA-256) |
| Storage | localStorage |
| Translations | Custom i18n module |

---

# 📁 Project Structure

```
Weather Explorer
│
├── index.html              # Main dashboard
├── login.html              # Login / signup page
├── saved.html              # Saved cities page
├── about.html              # About page
│
├── css
│   └── style.css           # Main styling and themes
│
├── js
│   ├── main.js             # Dashboard logic
│   ├── api.js              # Weather API requests
│   ├── ui.js               # UI rendering functions
│   ├── storage.js          # localStorage helpers
│   ├── i18n.js             # Language system
│   ├── login.js            # Authentication logic
│   ├── saved.js            # Saved cities logic
│   └── about.js             # About page logic
│
└── assets
```

---

# 🚀 Running Locally

No framework, build tool, or installation required.

Clone the repository:

```bash
git clone <repository-url>
```

Open:

```
index.html
```

in a modern browser.

---

# ⚠️ Notes

Some browser features require a secure environment:

- Geolocation API
- Web Crypto API

Supported:

✅ localhost  
✅ HTTPS  

Opening the project directly using:

```
file://
```

may disable some browser security features.

---
NETLIFY LINK : https://weatherexplorerx.netlify.app/login.html
