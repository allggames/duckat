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
    const randomHeight = Math.floor(Math.random() * 100) + 180;
    duckContainer.style.bottom = randomHeight + 'px';

    // Velocidad aleatoria
    const randomSpeed = (Math.random() * 4) + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    // Pato
    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-body');
    duckBody.innerText = '🦆'; 

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    // Click
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

    // Limpieza
    setTimeout(() => {
        if(duckContainer.parentNode) {
            duckContainer.remove();
        }
    }, (randomSpeed + 0.5) * 1000);

    // Siguiente pato
    const nextSpawnTime = Math.random() * 1500 + 500;
    setTimeout(spawnDuck, nextSpawnTime);
}
