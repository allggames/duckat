const TOTAL_DUCKS_PER_ROUND = 20;
const WINNING_SCORE = 12;
 
let ducksRemaining = TOTAL_DUCKS_PER_ROUND;
let ducksHitCount = 0;
let isPlaying = false;

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

if (rifleContainer) rifleContainer.style.opacity = '0';

function playShotSound(){
  if (!shotAudio) return;
  try{
    shotAudio.currentTime = 0;
    shotAudio.play();
  }catch(e){}
}

function triggerMuzzleFlash(){
  const el = flashes[flashIndex % flashes.length];
  flashIndex = (flashIndex + 1) % flashes.length;
  if (!el) return;
  el.classList.remove('flash-on');
  void el.offsetWidth;
  el.classList.add('flash-on');
}

function handleShot(){
  if (!isPlaying) return;
  playShotSound();
  triggerMuzzleFlash();
}

if (container){
  container.addEventListener('pointerdown', (e) => {
    if (!isPlaying) return;
    if (e.target && e.target.closest && e.target.closest('#start-btn')) return;
    if (e.target && e.target.closest && e.target.closest('.duck-wrapper')) return;
    handleShot();
  }, { passive:true });
}

function startGame() {
  introScreen.style.opacity = '0';
  setTimeout(() => { introScreen.style.display = 'none'; }, 500);

  container.classList.add('curtains-open');
  container.classList.add('game-active');

  gameUI.style.display = 'block';
  setTimeout(() => {
    gameUI.style.opacity = '1';
    if (rifleContainer) rifleContainer.style.opacity = '1';
  }, 100);

  ducksRemaining = TOTAL_DUCKS_PER_ROUND;
  ducksHitCount = 0;
  if (counterElement) counterElement.innerText = ducksRemaining;
  updateProgressBar();

  isPlaying = true;
  setTimeout(spawnDuck, 1000);
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
  startBtn.className = '';
  startBtn.classList.add('final-btn', `lvl-${level}`);
  
  // Si el nivel es 'none' (0-2 patos), podemos cambiar el texto
  const subText = (level === 'none') ? "INTÉNTALO DE NUEVO" : "¡FELICIDADES!";

  startBtn.innerHTML = `
    <div class="final-title">${title}</div>
    <div style="font-size: 1rem; color: #fff; margin-top: 5px;">${subText}</div>
    <div class="final-bonus">${bonus}</div>
    <div class="final-cta">JUGAR OTRA VEZ</div>
  `;
  startBtn.onclick = startGame;
}

function endGame(custom) {
  isPlaying = false;

  const remainingDucks = document.querySelectorAll('.duck-container');
  remainingDucks.forEach(d => d.remove());

  container.classList.remove('curtains-open');
  container.classList.remove('game-active');

  gameUI.style.opacity = '0';
  if (rifleContainer) rifleContainer.style.opacity = '0';

  setTimeout(() => { gameUI.style.display = 'none'; }, 500);

  setTimeout(() => {
    introScreen.style.display = 'flex';
    setTimeout(() => { introScreen.style.opacity = '1'; }, 50);

    const result = custom || getResult();
    renderFinalPopup(result);
  }, 1500);
}

function spawnDuck() {
  if (!isPlaying) return;

  if (ducksRemaining <= 0) {
    setTimeout(() => { 
        if (isPlaying) {
            const finalResult = getResult(); // Obtenemos el bono según ducksHitCount
            endGame(finalResult); 
        } 
    }, 2000);
    return;
}

  ducksRemaining--;
  if (counterElement) counterElement.innerText = ducksRemaining;

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

  const head = document.createElement('div'); head.classList.add('duck-head');
  const beak = document.createElement('div'); beak.classList.add('duck-beak');
  const eye  = document.createElement('div'); eye.classList.add('duck-eye');
  const torso= document.createElement('div'); torso.classList.add('duck-torso');
  const wing = document.createElement('div'); wing.classList.add('duck-wing');

  head.appendChild(beak); head.appendChild(eye);
  torso.appendChild(wing);
  duckBody.appendChild(torso); duckBody.appendChild(head);

  duckContainer.appendChild(stick);
  duckContainer.appendChild(duckBody);

  duckBody.addEventListener('mousedown', function (e) {
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
      endGame({ title: "¡GANASTE!", bonus: "BONO 200%", level: "win" });
    }

    e.stopPropagation();
  });

  if (gameLayer) gameLayer.appendChild(duckContainer);

  setTimeout(() => {
    if (duckContainer.parentNode) duckContainer.remove();
  }, (randomSpeed + 0.5) * 1000);

  if (ducksRemaining > 0) {
    const nextSpawnTime = Math.random() * 1000 + 500;
    setTimeout(spawnDuck, nextSpawnTime);
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
