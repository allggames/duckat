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
    
    // ALTURA AJUSTADA: Rango más pequeño para que siempre estén "en el agua"
    // Entre 130px y 170px desde abajo
    const randomHeight = Math.floor(Math.random() * 40) + 130;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = (Math.random() * 4) + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-body');
    duckBody.innerText = '🦆'; 

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

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
