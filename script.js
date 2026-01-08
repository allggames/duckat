// --- CONFIGURACIÓN ---
const TOTAL_DUCKS = 20;
const WINNING_SCORE = 12;

let ducksRemaining = TOTAL_DUCKS;
let ducksHitCount = 0;
let isPlaying = false;
let spawnTimer = null;

// Elementos
const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const startBtn = document.getElementById('start-btn');
const counterElement = document.getElementById('duck-counter');
const progressFill = document.getElementById('progress-fill');
const bonusPopup = document.getElementById('bonus-popup');
const ducksLayer = document.getElementById('ducks-layer');

// --- FUNCIONES ---

function startGame() {
  // 1. Resetear variables
  ducksRemaining = TOTAL_DUCKS;
  ducksHitCount = 0;
  isPlaying = true;
  
  // 2. UI Reset
  counterElement.innerText = ducksRemaining;
  progressFill.style.width = '0%';
  
  // 3. Animaciones de entrada
  introScreen.style.opacity = '0';
  setTimeout(() => { introScreen.style.display = 'none'; }, 500);
  
  container.classList.add('curtains-open'); // Abrir cortinas
  container.classList.add('game-active');   // Mostrar UI y Rifles

  // 4. Iniciar ciclo de patos
  setTimeout(spawnDuck, 1000);
}

function endGame(result) {
  isPlaying = false;
  clearTimeout(spawnTimer);

  // Limpiar patos en pantalla
  ducksLayer.innerHTML = '';

  // Cerrar escenario
  container.classList.remove('curtains-open');
  container.classList.remove('game-active');

  // Mostrar pantalla final
  setTimeout(() => {
    introScreen.style.display = 'flex';
    setTimeout(() => introScreen.style.opacity = '1', 50);

    if (result === 'WIN') {
        startBtn.innerHTML = "¡GANASTE!<br><span style='font-size:1.5rem; color:white'>¡BONO COMPLETO!</span>";
        startBtn.style.background = "#76ff03"; // Verde victoria
    } else {
        startBtn.innerHTML = "FIN DEL JUEGO<br><span style='font-size:1.5rem; color:white'>INTENTAR DE NUEVO</span>";
        startBtn.style.background = "#ffca28"; // Dorado normal
    }
  }, 1000);
}

function updateProgress() {
  let percent = (ducksHitCount / WINNING_SCORE) * 100;
  if (percent > 100) percent = 100;
  progressFill.style.width = percent + '%';
}

function showBonus(text) {
  bonusPopup.innerText = text;
  bonusPopup.classList.remove('bonus-anim');
  void bonusPopup.offsetWidth; // Reiniciar animacion CSS
  bonusPopup.classList.add('bonus-anim');
}

function spawnDuck() {
  if (!isPlaying) return;

  // Lógica de fin por falta de patos
  if (ducksRemaining <= 0) {
    setTimeout(() => {
        if (isPlaying) endGame('LOSE'); // Si se acabaron los patos y no ganaste aun
    }, 2000);
    return;
  }

  ducksRemaining--;
  counterElement.innerText = ducksRemaining;

  // Crear HTML del Pato
  const duck = document.createElement('div');
  duck.className = 'duck-container';
  
  // Posición y velocidad aleatoria
  const speed = Math.random() * 3 + 3; // Entre 3 y 6 segundos
  duck.style.animationDuration = speed + 's';
  duck.style.bottom = (Math.floor(Math.random() * 50) + 160) + 'px';

  // Estructura interna del pato
  duck.innerHTML = `
    <div class="duck-stick"></div>
    <div class="duck-wrapper">
        <div class="duck-torso"><div class="duck-wing"></div></div>
        <div class="duck-head">
            <div class="duck-beak"></div>
            <div class="duck-eye"></div>
        </div>
    </div>
  `;

  // --- CLICK EN EL PATO ---
  const hitBox = duck.querySelector('.duck-wrapper');
  hitBox.addEventListener('mousedown', (e) => {
      e.stopPropagation(); // Evitar doble click
      if (hitBox.classList.contains('duck-hit')) return; // Ya fue golpeado

      // Acierto
      ducksHitCount++;
      hitBox.classList.add('duck-hit');
      updateProgress();
      
      // Efecto Visual
      createExplosion(e.clientX, e.clientY);

      // Chequeo de Bonos y Victoria
      if (ducksHitCount === 3) showBonus('¡BONO 50%!');
      if (ducksHitCount === 6) showBonus('¡BONO 100%!');
      if (ducksHitCount === 9) showBonus('¡BONO 150%!');
      
      // VICTORIA INSTANTÁNEA
      if (ducksHitCount >= WINNING_SCORE) {
          showBonus('¡BONO 200%!');
          setTimeout(() => { duck.remove(); }, 200);
          endGame('WIN');
          return;
      }

      setTimeout(() => { duck.remove(); }, 500);
  });

  ducksLayer.appendChild(duck);

  // Limpieza automática si sale de pantalla
  setTimeout(() => {
      if (duck.parentNode) duck.remove();
  }, speed * 1000 + 500);

  // Siguiente pato
  spawnTimer = setTimeout(spawnDuck, Math.random() * 1000 + 500);
}

function createExplosion(x, y) {
    const boom = document.createElement('div');
    boom.className = 'explosion';
    boom.innerText = '💥';
    boom.style.left = x + 'px';
    boom.style.top = y + 'px';
    document.body.appendChild(boom);
    setTimeout(() => boom.remove(), 500);
}
