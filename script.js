// CONFIGURACIÓN DE LA RONDA
const TOTAL_DUCKS_PER_ROUND = 20;

let ducksRemaining = TOTAL_DUCKS_PER_ROUND; 
let ducksHitCount = 0; 
let isPlaying = false;

// Elementos del DOM
const counterElement = document.getElementById('duck-counter');
const gameContainer = document.getElementById('ducks-layer');
const startBtn = document.getElementById('start-btn');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');
const topBanner = document.querySelector('.top-banner');
const progressWrapper = document.querySelector('.progress-wrapper');

function startGame() {
    // 1. Preparar Interfaz
    startBtn.style.display = 'none';
    topBanner.style.display = 'none';
    progressWrapper.style.display = 'block';

    // 2. Reiniciar Valores
    ducksRemaining = TOTAL_DUCKS_PER_ROUND;
    ducksHitCount = 0;
    
    // 3. Actualizar visuales iniciales
    counterElement.innerText = ducksRemaining;
    updateProgressBar();
    
    // 4. Iniciar bucle
    isPlaying = true;
    spawnDuck();
}

function updateProgressBar() {
    // Calculamos porcentaje (meta: 12 patos)
    let percentage = (ducksHitCount / 12) * 100;
    if (percentage > 100) percentage = 100; 
    progressFill.style.width = percentage + '%';
}

function showBonus(text) {
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim'); 
    void bonusPopup.offsetWidth; // Reinicia la animación
    bonusPopup.classList.add('bonus-anim');
}

function endGame() {
    isPlaying = false;
    // Mostrar botón de reinicio
    setTimeout(() => {
        startBtn.innerHTML = "FIN DE RONDA<br><span style='font-size:1.5rem'>JUGAR OTRA</span>";
        startBtn.style.display = 'block';
    }, 2000);
}

function spawnDuck() {
    if (!isPlaying) return;

    // Si ya no quedan patos, terminamos
    if (ducksRemaining <= 0) {
        endGame();
        return;
    }

    // Descontar pato
    ducksRemaining--;
    counterElement.innerText = ducksRemaining;

    // --- CREAR EL PATO ---
    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    
    // Posición y velocidad aleatoria
    const randomHeight = Math.floor(Math.random() * 40) + 160;
    duckContainer.style.bottom = randomHeight + 'px';

    const randomSpeed = (Math.random() * 4) + 3;
    duckContainer.style.animationDuration = randomSpeed + 's';

    // Construcción visual del pato
    const stick = document.createElement('div');
    stick.classList.add('duck-stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-wrapper');

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

    // --- EVENTO CLIC (DISPARO) ---
    duckBody.addEventListener('mousedown', function(e) {
        // Evitamos doble hit
        if (!duckBody.classList.contains('duck-hit')) {
            
            // 1. Contar acierto
            ducksHitCount++;
            updateProgressBar();

            // 2. Verificar Bonos
            if (ducksHitCount === 3) showBonus("¡BONO 50%!");
            if (ducksHitCount === 6) showBonus("¡BONO 100%!");
            if (ducksHitCount === 9) showBonus("¡BONO 150%!");
            if (ducksHitCount === 12) showBonus("¡BONO 200%!");

            // 3. Crear Explosión Visual
            const boom = document.createElement('div');
            boom.classList.add('explosion');
            boom.innerText = '💥';
            boom.style.left = e.clientX + 'px';
            boom.style.top = e.clientY + 'px';
            document.body.appendChild(boom);
            
            // Borrar explosión después de un momento
            setTimeout(() => boom.remove(), 500);

            // 4. Animar caída del pato
            duckBody.classList.add('duck-hit');
            
            // Eliminar pato del DOM
            setTimeout(() => { duckContainer.remove(); }, 300);
        }
        e.stopPropagation();
    });

    // Agregar al escenario
    gameContainer.appendChild(duckContainer);

    // Limpieza automática si el pato se va de la pantalla sin ser golpeado
    setTimeout(() => {
        if(duckContainer.parentNode) duckContainer.remove();
    }, (randomSpeed + 0.5) * 1000);

    // Programar el siguiente pato
    if (ducksRemaining > 0) {
        const nextSpawnTime = Math.random() * 1000 + 500;
        setTimeout(spawnDuck, nextSpawnTime);
    } else {
        // Si era el último, esperar un poco antes de mostrar Fin del Juego
        setTimeout(endGame, 4000);
    }
}
