const TRANSLATIONS = {
    en: {
        // Nav
        'nav.dashboard':    'Dashboard',
        'nav.saved':        'Saved Cities',
        'nav.about':        'About',
        'nav.logout':       'Logout',

        // Search form
        'search.title':               'Find Weather',
        'search.city.label':          'City Name',
        'search.city.placeholder':    'e.g. London, Tokyo',
        'search.location.btn':        '📍 My Location',
        'search.units.label':         'Units',
        'search.units.celsius':       'Celsius (°C)',
        'search.units.fahrenheit':    'Fahrenheit (°F)',
        'search.priority.label':      'Search Priority',
        'search.priority.normal':     'Normal',
        'search.priority.high':       'High',
        'search.save-recent':         'Save to recent',
        'search.notes.label':         'Notes (optional)',
        'search.notes.placeholder':   'Any notes for this search?',
        'search.button':              'Search',
        'search.recent.title':        'Recent Searches:',

        // Sections
        'map.title':           'Pick from Map',
        'weather.title':       'Current Weather',
        'weather.placeholder': 'Enter a city name above to see the current weather.',
        'weather.loading':     'Fetching weather data...',
        'forecast.title':      '5-Day Forecast',

        // Weather card detail labels
        'card.feels_like':   'Feels Like',
        'card.humidity':     'Humidity',
        'card.wind':         'Wind Speed',
        'card.pressure':     'Pressure',
        'card.visibility':   'Visibility',
        'card.clouds':       'Clouds',
        'card.sunrise':      'Sunrise',
        'card.sunset':       'Sunset',
        'card.save.title':   'Add to favorites',
        'card.saved.title':  'Saved to favorites',

        // Saved page
        'saved.title':  'Your Favorite Cities',
        'saved.empty':  "You haven't saved any cities yet.",
        'saved.remove': 'Remove',
        'saved.view':   'View',

        // About page
        'about.title':      'About Weather Explorer',
        'about.p1':         'Weather Explorer is a modern web application that provides real-time weather information for cities around the world. Built using the OpenWeather API, it offers detailed insights into current weather conditions, including temperature, humidity, wind speed, and more.',
        'about.p2':         'This project was developed as a final web engineering project, showcasing clean code practices, modular JavaScript, and responsive design.',
        'about.info.title': 'Project Information',
        'about.version':    'Version:',
        'about.tech':       'Technologies:',
        'about.api':        'API:',
        'about.storage':    'Storage:',

        // Login page
        'login.subtitle':         'Enter your name to get started',
        'login.name.label':       'Your Name',
        'login.name.placeholder': 'e.g. Alex',
        'login.button':           'Get Started',
        'login.error.required':   'Please enter your name.',

        // Footer
        'footer.text': '© 2026 Weather Explorer Project. All rights reserved.',

        // Dynamic messages (functions)
        'msg.saved':    (city) => `Saved ${city} to favorites`,
        'msg.removed':  (city) => `Removed ${city} from favorites`,
        'msg.location': () => 'Using your current location',
    },

    ka: {
        // Nav
        'nav.dashboard':    'სამუშაო დაფა',
        'nav.saved':        'შენახული ქალაქები',
        'nav.about':        'შესახებ',
        'nav.logout':       'გასვლა',

        // Search form
        'search.title':               'ამინდის ძიება',
        'search.city.label':          'ქალაქის სახელი',
        'search.city.placeholder':    'მაგ. თბილისი, ლონდონი',
        'search.location.btn':        '📍 ჩემი მდებარეობა',
        'search.units.label':         'ერთეული',
        'search.units.celsius':       'ცელსიუსი (°C)',
        'search.units.fahrenheit':    'ფარენჰეიტი (°F)',
        'search.priority.label':      'ძიების პრიორიტეტი',
        'search.priority.normal':     'ნორმალური',
        'search.priority.high':       'მაღალი',
        'search.save-recent':         'ბოლო ძიებაში შენახვა',
        'search.notes.label':         'შენიშვნები (სურვილისამებრ)',
        'search.notes.placeholder':   'შენიშვნები ამ ძიებისთვის?',
        'search.button':              'ძიება',
        'search.recent.title':        'ბოლო ძიებები:',

        // Sections
        'map.title':           'რუქაზე არჩევა',
        'weather.title':       'მიმდინარე ამინდი',
        'weather.placeholder': 'შეიყვანეთ ქალაქის სახელი ამინდის სანახავად.',
        'weather.loading':     'ამინდის მონაცემების მიღება...',
        'forecast.title':      '5-დღიანი პროგნოზი',

        // Weather card detail labels
        'card.feels_like':   'შეგრძნება',
        'card.humidity':     'ტენიანობა',
        'card.wind':         'ქარის სიჩქარე',
        'card.pressure':     'წნევა',
        'card.visibility':   'ხილვადობა',
        'card.clouds':       'ღრუბლიანობა',
        'card.sunrise':      'მზის ამოსვლა',
        'card.sunset':       'მზის ჩასვლა',
        'card.save.title':   'ფავორიტებში დამატება',
        'card.saved.title':  'შენახულია ფავორიტებში',

        // Saved page
        'saved.title':  'თქვენი საყვარელი ქალაქები',
        'saved.empty':  'ჯერ არ შეგინახავთ ქალაქები.',
        'saved.remove': 'წაშლა',
        'saved.view':   'ნახვა',

        // About page
        'about.title':      'ამინდის მკვლევარის შესახებ',
        'about.p1':         'ამინდის მკვლევარი არის თანამედროვე ვებ-აპლიკაცია, რომელიც უზრუნველყოფს მსოფლიოს ქალაქების რეალურ ამინდის ინფორმაციას. OpenWeather API-ზე დაყრდნობით, ის გთავაზობთ დეტალურ ინფორმაციას ამინდის პირობების შესახებ, მათ შორის ტემპერატურის, ტენიანობის, ქარის სიჩქარისა და სხვა მაჩვენებლებს.',
        'about.p2':         'ეს პროექტი შეიქმნა ვებ-ინჟინერიის საბოლოო სამუშაოდ, რომელიც წარმოაჩენს კოდის სუფთა პრაქტიკას, მოდულურ JavaScript-ს და რეაგირებად დიზაინს.',
        'about.info.title': 'პროექტის ინფორმაცია',
        'about.version':    'ვერსია:',
        'about.tech':       'ტექნოლოგიები:',
        'about.api':        'API:',
        'about.storage':    'შენახვა:',

        // Login page
        'login.subtitle':         'შეიყვანეთ სახელი დასაწყებად',
        'login.name.label':       'თქვენი სახელი',
        'login.name.placeholder': 'მაგ. გიორგი',
        'login.button':           'დაწყება',
        'login.error.required':   'გთხოვთ შეიყვანოთ სახელი.',

        // Footer
        'footer.text': '© 2026 ამინდის მკვლევარი. ყველა უფლება დაცულია.',

        // Dynamic messages (functions)
        'msg.saved':    (city) => `${city} შენახულია ფავორიტებში`,
        'msg.removed':  (city) => `${city} წაიშალა ფავორიტებიდან`,
        'msg.location': () => 'გამოიყენება თქვენი მდებარეობა',
    },
};

let currentLang = localStorage.getItem('wx_lang') || 'en';

/** Get a plain string translation */
export function t(key) {
    const val = TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key];
    if (typeof val === 'function') return key; // use tf() for function translations
    return val ?? key;
}

/** Get a translated string that requires arguments (e.g. city name) */
export function tf(key, ...args) {
    const fn = TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key];
    return typeof fn === 'function' ? fn(...args) : (fn ?? key);
}

export function getLang() {
    return currentLang;
}

/** Apply current language to all data-i18n elements on the page */
export function applyLang() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });

    // Update toggle button label
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
        btn.textContent  = currentLang === 'en' ? '🇬🇪 ქარ' : '🇬🇧 Eng';
        btn.title        = currentLang === 'en' ? 'Switch to Georgian' : 'Switch to English';
    }
}

/** Wire up the toggle button click handler */
export function initLangToggle() {
    const btn = document.getElementById('lang-toggle-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ka' : 'en';
        localStorage.setItem('wx_lang', currentLang);
        applyLang();
        // Dispatch event so page-level code can react (e.g. re-render weather card)
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
    });
    applyLang();
}
