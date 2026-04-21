const TOTAL_DUCKS_PER_ROUND = 20;
const WINNING_SCORE = 12;

let ducksRemaining = TOTAL_DUCKS_PER_ROUND;
let ducksHitCount = 0;
let isPlaying = false;
let gameCheckInterval = null; // Intervalo de seguridad

const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const gameUI = document.getElementById('game-ui');
const counterElement = document.getElementById('duck-counter');
const gameLayer = document.getElementById('ducks-layer');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');
const startBtn = document.getElementById('start-btn');
const rifleContainer = document.querySelector('.rifle-container');
const shotAudio = document.getElementById('shot-audio');

const flashes = [
    document.querySelector('.flash-1'),
    document.querySelector('.flash-2'),
    document.querySelector('.flash-3')
];
let flashIndex = 0;

function playShotSound() {
    if (!shotAudio) return;
    shotAudio.currentTime = 0;
    shotAudio.play().catch(() => {});
}

function triggerMuzzleFlash() {
    const el = flashes[flashIndex % flashes.length];
    flashIndex = (flashIndex + 1) % flashes.length;
    if (!el) return;
    el.classList.remove('flash-on');
    void el.offsetWidth;
    el.classList.add('flash-on');
}

function updateProgressBar() {
    let percentage = (ducksHitCount / WINNING_SCORE) * 100;
    if (percentage > 100) percentage = 100;
    if (progressFill) progressFill.style.width = percentage + '%';
}

function showBonus(text) {
    if (!bonusPopup) return;
    bonusPopup.innerText = text;
    bonusPopup.classList.remove('bonus-anim');
    void bonusPopup.offsetWidth;
    bonusPopup.classList.add('bonus-anim');
}

function getResult() {
    if (ducksHitCount >= 12) return { title: "¡GANASTE!", bonus: "BONO 200%", level: "win" };
    if (ducksHitCount >= 9)  return { title: "¡MUY BIEN!", bonus: "BONO 150%", level: "high" };
    if (ducksHitCount >= 6)  return { title: "BIEN", bonus: "BONO 100%", level: "mid" };
    if (ducksHitCount >= 3)  return { title: "REGULAR", bonus: "BONO 50%", level: "low" };
    return { title: "¡INTENTÁ DE NUEVO!", bonus: "SIN BONO", level: "none" };
}

function renderFinalPopup({ title, bonus, level }) {
    // Cambiamos la clase para que el diseño sepa que es el final
    startBtn.className = 'final-card ' + `lvl-${level}`;
    
    const isWinner = level !== 'none';
    const chatUrl = "https://www.casinoatenea.com/?open=true"; // URL de tu webchat

    startBtn.innerHTML = `
        <div class="final-title">${title}</div>
        <div class="final-bonus">${bonus}</div>
        
        <div class="final-actions">
            ${isWinner ? `
                <button class="btn-claim" onclick="window.location.href='${chatUrl}'">
                    <span>RECLAMAR PREMIO 📸</span>
                    <small>Capturá y enviá acá</small>
                </button>
                <button class="btn-retry secondary" onclick="startGame()">
                    INTENTAR MEJORAR
                </button>
            ` : `
                <button class="btn-retry" onclick="startGame()">
                    JUGAR OTRA VEZ
                </button>
            `}
        </div>
    `;
    
    // Anulamos el onclick del contenedor padre para que no interfiera con los botones hijos
    startBtn.onclick = null;
}

function startGame() {
    if (gameCheckInterval) clearInterval(gameCheckInterval);
    
    ducksRemaining = TOTAL_DUCKS_PER_ROUND;
    ducksHitCount = 0;
    isPlaying = true;

    introScreen.style.opacity = '0';
    setTimeout(() => { introScreen.style.display = 'none'; }, 500);

    container.classList.add('curtains-open');
    container.classList.add('game-active');
    gameUI.style.display = 'block';
    
    setTimeout(() => {
        gameUI.style.opacity = '1';
        if (rifleContainer) rifleContainer.style.opacity = '1';
    }, 100);

    if (counterElement) counterElement.innerText = ducksRemaining;
    updateProgressBar();
    
    // Iniciar el generador de patos
    setTimeout(spawnDuck, 1000);

    // SEGURIDAD: Revisa cada segundo si ya no quedan patos para terminar el juego
    gameCheckInterval = setInterval(() => {
        const activeDucks = document.querySelectorAll('.duck-container').length;
        if (ducksRemaining <= 0 && activeDucks === 0 && isPlaying) {
            endGame();
        }
    }, 1000);
}

function endGame(custom) {
    if (!isPlaying) return;
    isPlaying = false;
    if (gameCheckInterval) clearInterval(gameCheckInterval);

    // Limpiar patos
    document.querySelectorAll('.duck-container').forEach(d => d.remove());

    container.classList.remove('curtains-open');
    container.classList.remove('game-active');
    gameUI.style.opacity = '0';
    if (rifleContainer) rifleContainer.style.opacity = '0';

    setTimeout(() => { gameUI.style.display = 'none'; }, 500);

    setTimeout(() => {
        const result = custom || getResult();
        introScreen.style.display = 'flex';
        setTimeout(() => { introScreen.style.opacity = '1'; }, 50);
        renderFinalPopup(result);
    }, 1500);
}

function spawnDuck() {
    if (!isPlaying || ducksRemaining <= 0) return;

    ducksRemaining--;
    if (counterElement) counterElement.innerText = ducksRemaining;

    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    duckContainer.style.bottom = (Math.floor(Math.random() * 40) + 160) + 'px';
    const duration = Math.random() * 3 + 3;
    duckContainer.style.animationDuration = duration + 's';

    duckContainer.innerHTML = `
        <div class="duck-stick"></div>
        <div class="duck-wrapper">
            <div class="duck-torso"><div class="duck-wing"></div></div>
            <div class="duck-head"><div class="duck-beak"></div><div class="duck-eye"></div></div>
        </div>
    `;

    const duckBody = duckContainer.querySelector('.duck-wrapper');
    duckBody.addEventListener('mousedown', (e) => {
        if (duckBody.classList.contains('duck-hit')) return;
        
        ducksHitCount++;
        updateProgressBar();
        
        if (ducksHitCount === 3) showBonus('¡BONO 50%!');
        if (ducksHitCount === 6) showBonus('¡BONO 100%!');
        if (ducksHitCount === 9) showBonus('¡BONO 150%!');
        
        playShotSound();
        triggerMuzzleFlash();
        createExplosion(e.clientX, e.clientY);
        
        duckBody.classList.add('duck-hit');
        setTimeout(() => duckContainer.remove(), 300);

        if (ducksHitCount === 12) {
            showBonus('¡BONO 200%!');
            setTimeout(() => endGame(), 600);
        }
        e.stopPropagation();
    });

    gameLayer.appendChild(duckContainer);

    setTimeout(() => {
        if (duckContainer.parentNode) duckContainer.remove();
    }, duration * 1000);

    if (ducksRemaining > 0) {
        setTimeout(spawnDuck, Math.random() * 1000 + 600);
    }
}

function createExplosion(x, y) {
    const boom = document.createElement('div');
    boom.classList.add('explosion');
    boom.innerText = '💥';
    boom.style.left = x + 'px';
    boom.style.top = y + 'px';
    document.body.appendChild(boom);
    setTimeout(() => boom.remove(), 500);
}

// Disparo al aire
container.addEventListener('pointerdown', (e) => {
    if (!isPlaying || e.target.closest('.duck-wrapper') || e.target.closest('#start-btn')) return;
    playShotSound();
    triggerMuzzleFlash();
}, { passive: true });
