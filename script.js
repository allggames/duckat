let score = 0;
let isPlaying = false;
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('ducks-layer');
const startBtn = document.getElementById('start-btn');

function startGame() {
    startBtn.style.display = 'none';
    score = 0;
    scoreElement.innerText = score;
    isPlaying = true;
    spawnDuck();
}

function spawnDuck() {
    if (!isPlaying) return;

    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    
    // Altura aleatoria
    const randomHeight = Math.floor(Math.random() * 40) + 160;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = (Math.random() * 4) + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    // 1. El Palo
    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    // 2. El Pato (Contenedor principal del cuerpo)
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-wrapper');

    // Construimos el pato con CSS
    const head = document.createElement('div');
    head.classList.add('duck-head');
    
    const beak = document.createElement('div');
    beak.classList.add('duck-beak');
    
    const eye = document.createElement('div');
    eye.classList.add('duck-eye');
    
    const torso = document.createElement('div');
    torso.classList.add('duck-torso');
    
    const wing = document.createElement('div');
    wing.classList.add('duck-wing');

    // Armamos el rompecabezas
    head.appendChild(beak); // El pico va en la cabeza
    head.appendChild(eye);  // El ojo va en la cabeza
    torso.appendChild(wing); // El ala va en el cuerpo
    duckBody.appendChild(torso);
    duckBody.appendChild(head);

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    // Evento de disparo
    duckBody.addEventListener('mousedown', function(e) {
        if (!duckBody.classList.contains('duck-hit')) {
            score += 10;
            scoreElement.innerText = score;
            duckBody.classList.add('duck-hit');
            setTimeout(() => { duckContainer.remove(); }, 300);
        }
        e.stopPropagation();
    });

    gameContainer.appendChild(duckContainer);

    setTimeout(() => {
        if(duckContainer.parentNode) {
            duckContainer.remove();
        }
    }, (randomSpeed + 0.5) * 1000);

    const nextSpawnTime = Math.random() * 1500 + 500;
    setTimeout(spawnDuck, nextSpawnTime);
}
