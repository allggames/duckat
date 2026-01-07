let score = 0;
let ducksHitCount = 0; // Nuevo contador para la barra
let isPlaying = false;

const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('ducks-layer');
const startBtn = document.getElementById('start-btn');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');

function startGame() {
    startBtn.style.display = 'none';
    score = 0;
    ducksHitCount = 0; // Reiniciar contador de patos
    scoreElement.innerText = score;
    updateProgressBar(); // Resetear barra
    isPlaying = true;
    spawnDuck();
}

// Función para actualizar la barra visualmente
function updateProgressBar() {
    // Calculamos el porcentaje (máximo 12 patos = 100%)
    let percentage = (ducksHitCount / 12) * 100;
    if (percentage > 100) percentage = 100; // Tope en 100%
    progressFill.style.width = percentage + '%';
}

// Función para mostrar el cartel de bono
function showBonus(text) {
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim'); // Reiniciar animación
    void bonusPopup.offsetWidth; // Truco para reiniciar el reflow
    bonusPopup.classList.add('bonus-anim');
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

    // 1. Palo
    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    // 2. Pato (Wrapper)
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-wrapper');

    // Construcción del pato CSS
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

    // --- EVENTO DE DISPARO ACTUALIZADO ---
    duckBody.addEventListener('mousedown', function(e) {
        if (!duckBody.classList.contains('duck-hit')) {
            // 1. Sumar Puntos
            score += 10;
            scoreElement.innerText = score;
            
            // 2. Sumar al contador de la barra
            ducksHitCount++;
            updateProgressBar();

            // 3. Chequear Bonos
            if (ducksHitCount === 3) showBonus("¡BONO 50%!");
            if (ducksHitCount === 6) showBonus("¡BONO 100%!");
            if (ducksHitCount === 9) showBonus("¡BONO 150%!");
            if (ducksHitCount === 12) {
                showBonus("¡BONO 200%!");
                // Opcional: ¿Quieres que se reinicie la barra después de 12?
                // ducksHitCount = 0; 
                // setTimeout(updateProgressBar, 1000);
            }

            // 4. Animación de muerte del pato
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
