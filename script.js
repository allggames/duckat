// CONFIGURACIÓN DE LA RONDA
const TOTAL_DUCKS_PER_ROUND = 20;

// Variables de Estado
let ducksRemaining = TOTAL_DUCKS_PER_ROUND;
let ducksHitCount = 0;
let isPlaying = false;

// Elementos del DOM
const counterElement = document.getElementById('duck-counter');
const gameContainer = document.getElementById('ducks-layer');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');

// Referencias de Contenedores y Pantallas
const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const gameUI = document.getElementById('game-ui');
const startBtn = document.getElementById('start-btn'); 

// --- FUNCIÓN DE INICIO ---
function startGame() {
    // 1. Ocultar Título y Botón (Desvanecer)
    introScreen.style.opacity = '0';
    setTimeout(() => { 
        introScreen.style.display = 'none'; 
    }, 500);

    // 2. Activar Animación (Abre cortinas, sube rifles)
    container.classList.add('curtains-open');
    container.classList.add('game-active');
    
    // 3. Mostrar Interfaz de Juego
    gameUI.style.display = 'block';
    // Pequeño delay para que la transición de opacidad funcione
    setTimeout(() => {
        gameUI.style.opacity = '1';
    }, 100);

    // 4. Reiniciar Lógica de Juego
    ducksRemaining = TOTAL_DUCKS_PER_ROUND;
    ducksHitCount = 0;
    if(counterElement) counterElement.innerText = ducksRemaining;
    updateProgressBar();
    
    // 5. Empezar a sacar patos (con un pequeño retraso para que se abran las cortinas)
    isPlaying = true;
    setTimeout(spawnDuck, 1000);
}

// --- ACTUALIZAR BARRA ---
function updateProgressBar() {
    let percentage = (ducksHitCount / 12) * 100;
    if (percentage > 100) percentage = 100;
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
}

// --- MOSTRAR BONO ---
function showBonus(text) {
    if(!bonusPopup) return;
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim');
    void bonusPopup.offsetWidth; // Reiniciar animación
    bonusPopup.classList.add('bonus-anim');
}

// --- FIN DE RONDA (LO QUE FALTABA) ---
function endGame() {
    isPlaying = false;
    
    // 1. Cerrar Cortinas y bajar rifles (Quitando las clases)
    container.classList.remove('curtains-open');
    container.classList.remove('game-active');

    // 2. Ocultar Interfaz de Juego
    gameUI.style.opacity = '0';
    setTimeout(() => {
        gameUI.style.display = 'none';
    }, 500);

    // 3. Mostrar Pantalla de Intro nuevamente
    setTimeout(() => {
        introScreen.style.display = 'flex';
        // Animación suave de aparición
        setTimeout(() => { introScreen.style.opacity = '1'; }, 50);

        // Actualizar texto del botón para invitar a jugar de nuevo
        startBtn.innerHTML = "FIN DE RONDA<br><span style='font-size:1.5rem'>JUGAR OTRA</span>";
    }, 1500); // Esperamos a que cierren las cortinas
}

// --- GENERAR PATOS ---
function spawnDuck() {
    if (!isPlaying) return;

    // Verificar límite
    if (ducksRemaining <= 0) {
        // Esperamos un poco para que el último pato termine su recorrido
        setTimeout(endGame, 2000);
        return;
    }

    ducksRemaining--;
    if(counterElement) counterElement.innerText = ducksRemaining;

    // Crear elementos del pato
    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');

    const randomHeight = Math.floor(Math.random() * 40) + 160;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = Math.random() * 4 + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    const stick = document.createElement('div');
    stick.classList.add('duck-stick');

    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-wrapper');

    // Construcción del pato CSS
    const head = document.createElement('div'); head.classList.add('duck-head');
    const beak = document.createElement('div'); beak.classList.add('duck-beak');
    const eye = document.createElement('div'); eye.classList.add('duck-eye');
    const torso = document.createElement('div'); torso.classList.add('duck-torso');
    const wing = document.createElement('div'); wing.classList.add('duck-wing');

    head.appendChild(beak); head.appendChild(eye);
    torso.appendChild(wing);
    duckBody.appendChild(torso); duckBody.appendChild(head);

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    // Evento de disparo
    duckBody.addEventListener('mousedown', function (e) {
        if (!duckBody.classList.contains('duck-hit')) {
            ducksHitCount++;
            updateProgressBar();

            if (ducksHitCount === 3) showBonus('¡BONO 50%!');
            if (ducksHitCount === 6) showBonus('¡BONO 100%!');
            if (ducksHitCount === 9) showBonus('¡BONO 150%!');
            if (ducksHitCount === 12) showBonus('¡BONO 200%!');

            // Explosión
            const boom = document.createElement('div');
            boom.classList.add('explosion');
            boom.innerText = '💥';
            boom.style.left = e.clientX + 'px';
            boom.style.top = e.clientY + 'px';
            document.body.appendChild(boom);
            setTimeout(() => boom.remove(), 500);

            // Muerte del pato
            duckBody.classList.add('duck-hit');
            setTimeout(() => { duckContainer.remove(); }, 300);
        }
        e.stopPropagation();
    });

    gameContainer.appendChild(duckContainer);

    // Limpieza
    setTimeout(() => {
        if (duckContainer.parentNode) duckContainer.remove();
    }, (randomSpeed + 0.5) * 1000);

    // Siguiente pato
    if (ducksRemaining > 0) {
        const nextSpawnTime = Math.random() * 1000 + 500;
        setTimeout(spawnDuck, nextSpawnTime);
    } else {
        // Si ya no quedan patos por salir, esperamos a que termine la ronda
        setTimeout(endGame, 4000);
    }
}
