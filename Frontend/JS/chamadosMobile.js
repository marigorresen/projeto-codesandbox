const toggleButton = document.getElementByClassName('toggle-button')[0];
const informacoes = document.getElementByClassName('informacoes')[0];

toggleButton.addEventListener('click', () => {
    informacoes.classList.toggle('active')


})

