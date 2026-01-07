let score = 0;
let isPlaying = false;
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('ducks-layer');

function startGame() {
    document.getElementById('start-msg').style.display = 'none';
    score = 0;
    scoreElement.innerText = score;
    isPlaying = true;
    spawnDuck();
}

function spawnDuck() {
    if (!isPlaying) return;

    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    
    const randomHeight = Math.floor(Math.random() * 150) + 180;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = (Math.random() * 3) + 3; 
    duckContainer.style.animationDuration = randomSpeed + 's';

    const stick = document.createElement('div');
    stick.classList.add('stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-body');
    duckBody.innerHTML = '🦆'; 

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    duckContainer.addEventListener('mousedown', function() {
        score += 10;
        scoreElement.innerText = score;
        duckBody.classList.add('hit');
        setTimeout(() => {
            duckContainer.remove();
        }, 300);
    });

    gameContainer.appendChild(duckContainer);

    setTimeout(() => {
        if(duckContainer.parentNode) {
            duckContainer.remove();
        }
    }, randomSpeed * 1000);

    const nextSpawnTime = Math.random() * 1000 + 500; 
    setTimeout(spawnDuck, nextSpawnTime);
}
