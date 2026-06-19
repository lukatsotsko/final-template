const burger = document.getElementById('nav-burger');
const nav    = burger?.closest('.nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav--open');
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav--open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Open navigation');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('nav--open')) {
            nav.classList.remove('nav--open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Open navigation');
        }
    });
}
