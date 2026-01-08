// --- CONFIGURACIÓN ---
const TOTAL_DUCKS_PER_ROUND = 20;
const WINNING_SCORE = 12;

// --- VARIABLES DE ESTADO ---
let ducksRemaining = TOTAL_DUCKS_PER_ROUND;
let ducksHitCount = 0;
let isPlaying = false;

// --- REFERENCIAS AL DOM ---
const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const gameUI = document.getElementById('game-ui');
const counterElement = document.getElementById('duck-counter');
const gameLayer = document.getElementById('ducks-layer'); // Capa de patos
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');
const startBtn = document.getElementById('start-btn');
const rifleContainer = document.querySelector('.rifle-container');

// 1. Inicializar rifles invisibles al cargar
if(rifleContainer) {
    rifleContainer.style.opacity = '0';
}

// 2. Función para iniciar el juego
function startGame() {
    // Ocultar Intro
    introScreen.style.opacity = '0';
    setTimeout(() => { introScreen.style.display = 'none'; }, 500);

    // Activar juego y abrir cortinas
    container.classList.add('curtains-open');
    container.classList.add('game-active'); // Esto hace visibles los rifles por CSS

    // Mostrar Interfaz
    gameUI.style.display = 'block';
    setTimeout(() => { gameUI.style.opacity = '1'; }, 100);

    // Reiniciar contadores
    ducksRemaining = TOTAL_DUCKS_PER_ROUND;
    ducksHitCount = 0;
    if(counterElement) counterElement.innerText = ducksRemaining;
    updateProgressBar();
    
    // Iniciar secuencia de patos
    isPlaying = true;
    setTimeout(spawnDuck, 1000);
}

// 3. Actualizar barra de progreso
function updateProgressBar() {
    let percentage = (ducksHitCount / WINNING_SCORE) * 100;
    if (percentage > 100) percentage = 100;
    if (progressFill) progressFill.style.width = percentage + '%';
}

// 4. Mostrar Popup de Bono
function showBonus(text) {
    if(!bonusPopup) return;
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim');
    void bonusPopup.offsetWidth; // Reiniciar animación
    bonusPopup.classList.add('bonus-anim');
}

// 5. Calcular texto final
function getResultText() {
    if (ducksHitCount >= 12) return "¡GANASTE!<br><span style='color:#76ff03'>BONO 200%</span>";
    if (ducksHitCount >= 9) return "CASI...<br><span style='color:#ffca28'>BONO 150%</span>";
    if (ducksHitCount >= 6) return "BIEN<br><span style='color:#ffca28'>BONO 100%</span>";
    if (ducksHitCount >= 3) return "REGULAR<br><span style='color:#ffca28'>BONO 50%</span>";
    return "¡INTENTA DE NUEVO!<br><span style='color:#ff5252'>SIN BONO</span>";
}

// 6. Terminar Juego
function endGame(customMessage) {
    isPlaying = false;
    
    // Limpiar patos restantes
    const remainingDucks = document.querySelectorAll('.duck-container');
    remainingDucks.forEach(duck => duck.remove());
    
    // Cerrar cortinas y ocultar rifles
    container.classList.remove('curtains-open');
    container.classList.remove('game-active');

    // Ocultar UI
    gameUI.style.opacity = '0';
    setTimeout(() => { gameUI.style.display = 'none'; }, 500);

    // Mostrar pantalla final
    setTimeout(() => {
        introScreen.style.display = 'flex';
        setTimeout(() => { introScreen.style.opacity = '1'; }, 50);
        
        const finalMsg = customMessage || getResultText();
        startBtn.innerHTML = `${finalMsg}<br><span style='font-size:1.2rem; margin-top:10px; display:block; color: white;'>JUGAR OTRA</span>`;
        startBtn.onclick = startGame; 
    }, 1500);
}

// 7. Generar Patos
function spawnDuck() {
    if (!isPlaying) return;

    // Si se acaban los patos y no has ganado
    if (ducksRemaining <= 0) {
        setTimeout(() => { if(isPlaying) endGame(); }, 2000);
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

    const stick = document.createElement('div'); stick.classList.add('duck-stick');
    const duckBody = document.createElement('div'); duckBody.classList.add('duck-wrapper');
    
    // Partes del pato
    const head = document.createElement('div'); head.classList.add('duck-head');
    const beak = document.createElement('div'); beak.classList.add('duck-beak');
    const eye = document.createElement('div'); eye.classList.add('duck-eye');
    const torso = document.createElement('div'); torso.classList.add('duck-torso');
    const wing = document.createElement('div'); wing.classList.add('duck-wing');

    head.appendChild(beak); head.appendChild(eye);
    torso.appendChild(wing);
    duckBody.appendChild(torso); duckBody.appendChild(head);
    duckContainer.appendChild(stick); duckContainer.appendChild(duckBody);

    // Evento de disparo
    duckBody.addEventListener('mousedown', function (e) {
        if (!duckBody.classList.contains('duck-hit')) {
            ducksHitCount++;
            updateProgressBar();

            if (ducksHitCount === 3) showBonus('¡BONO 50%!');
            if (ducksHitCount === 6) showBonus('¡BONO 100%!');
            if (ducksHitCount === 9) showBonus('¡BONO 150%!');

            // Condición de Victoria Inmediata
            if (ducksHitCount === 12) {
                showBonus('¡BONO 200%!');
                createExplosion(e.clientX, e.clientY);
                duckBody.classList.add('duck-hit');
                setTimeout(() => duckContainer.remove(), 300);
                endGame("¡GANASTE!<br><span style='color:#76ff03'>BONO 200%</span>");
                return;
            }

            createExplosion(e.clientX, e.clientY);
            duckBody.classList.add('duck-hit');
            setTimeout(() => { duckContainer.remove(); }, 300);
        }
        e.stopPropagation();
    });

    // Agregar al contenedor correcto
    if (gameLayer) gameLayer.appendChild(duckContainer);
    
    // Limpieza automática
    setTimeout(() => { if (duckContainer.parentNode) duckContainer.remove(); }, (randomSpeed + 0.5) * 1000);

    // Siguiente pato
    if (ducksRemaining > 0) {
        const nextSpawnTime = Math.random() * 1000 + 500;
        setTimeout(spawnDuck, nextSpawnTime);
    } 
}

// Helper: Explosión
function createExplosion(x, y) {
    const boom = document.createElement('div');
    boom.classList.add('explosion');
    boom.innerText = '💥';
    boom.style.left = x + 'px';
    boom.style.top = y + 'px';
    document.body.appendChild(boom);
    setTimeout(() => boom.remove(), 500);
}
