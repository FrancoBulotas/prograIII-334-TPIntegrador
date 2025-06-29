

window.addEventListener('DOMContentLoaded', async () => {
    const header = await fetch('./pages/components/header.html').then(response => response.text());
    document.getElementById('header').innerHTML = header;
});