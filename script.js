let score = 0;
let ducksHitCount = 0; 
let isPlaying = false;

const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('ducks-layer');
const startBtn = document.getElementById('start-btn');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');

// NUEVAS REFERENCIAS PARA EL CAMBIO
const topBanner = document.querySelector('.top-banner');
const progressWrapper = document.querySelector('.progress-wrapper');

function startGame() {
    startBtn.style.display = 'none';
    
    // --- AQUÍ OCURRE EL CAMBIO ---
    topBanner.style.display = 'none';       // Oculta el título DUCKAT
    progressWrapper.style.display = 'block'; // Muestra la barra de bonos
    // -----------------------------

    score = 0;
    ducksHitCount = 0; 
    scoreElement.innerText = score;
    updateProgressBar(); 
    isPlaying = true;
    spawnDuck();
}

function updateProgressBar() {
    let percentage = (ducksHitCount / 12) * 100;
    if (percentage > 100) percentage = 100; 
    progressFill.style.width = percentage + '%';
}

function showBonus(text) {
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim'); 
    void bonusPopup.offsetWidth; 
    bonusPopup.classList.add('bonus-anim');
}

function spawnDuck() {
    if (!isPlaying) return;

    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    
    const randomHeight = Math.floor(Math.random() * 40) + 160;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = (Math.random() * 4) + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-wrapper');

    const head = document.createElement('div'); head.classList.add('duck-head');
    const beak = document.createElement('div'); beak.classList.add('duck-beak');
    const eye = document.createElement('div'); eye.classList.add('duck-eye');
    const torso = document.createElement('div'); torso.classList.add('duck-torso');
    const wing = document.createElement('div'); wing.classList.add('duck-wing');

    head.appendChild(beak);
    head.appendChild(eye);
    torso.appendChild(wing);
    duckBody.appendChild(torso);
    duckBody.appendChild(head);

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    // --- AQUÍ ESTÁ EL CAMBIO PRINCIPAL ---
    duckBody.addEventListener('mousedown', function(e) {
        if (!duckBody.classList.contains('duck-hit')) {
            score += 10;
            scoreElement.innerText = score;
            
            ducksHitCount++;
            updateProgressBar();

            if (ducksHitCount === 3) showBonus("¡BONO 50%!");
            if (ducksHitCount === 6) showBonus("¡BONO 100%!");
            if (ducksHitCount === 9) showBonus("¡BONO 150%!");
            if (ducksHitCount === 12) showBonus("¡BONO 200%!");

            // 1. Crear el elemento de explosión
            const boom = document.createElement('div');
            boom.classList.add('explosion');
            boom.innerText = '💥';

            // 2. Posicionarlo exactamente donde se hizo clic
            // Usamos clientX y clientY que nos da la posición del mouse en la pantalla
            boom.style.left = e.clientX + 'px';
            boom.style.top = e.clientY + 'px';

            // 3. Agregarlo al cuerpo del documento (fuera del contenedor del juego para que no se mueva con el pato)
            document.body.appendChild(boom);

            // 4. Eliminarlo después de que termine la animación (0.5s = 500ms)
            setTimeout(() => {
                boom.remove();
            }, 500);

            // Animación de muerte del pato original
            duckBody.classList.add('duck-hit');
            setTimeout(() => { duckContainer.remove(); }, 300);
        }
        e.stopPropagation();
    });
    // ------------------------------------

    gameContainer.appendChild(duckContainer);

    setTimeout(() => {
        if(duckContainer.parentNode) {
            duckContainer.remove();
        }
    }, (randomSpeed + 0.5) * 1000);

    const nextSpawnTime = Math.random() * 1500 + 500;
    setTimeout(spawnDuck, nextSpawnTime);
}
