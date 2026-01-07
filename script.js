/* --- VARIABLES DEL JUEGO --- */
let score = 0;
let isPlaying = false;
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('ducks-layer');

/* --- FUNCIÓN DE INICIO --- */
function startGame() {
    // Ocultar mensaje de inicio
    const msg = document.getElementById('start-msg');
    msg.style.display = 'none';
    
    // Reiniciar valores
    score = 0;
    scoreElement.innerText = score;
    isPlaying = true;
    
    // Lanzar el primer pato
    spawnDuck();
}

/* --- GENERADOR DE PATOS --- */
function spawnDuck() {
    if (!isPlaying) return;

    // 1. Crear el contenedor del pato
    const duckContainer = document.createElement('div');
    duckContainer.classList.add('duck-container');
    
    // 2. Altura aleatoria (entre 180px y 330px desde abajo)
    const randomHeight = Math.floor(Math.random() * 150) + 180;
    duckContainer.style.bottom = randomHeight + 'px';

    // 3. Velocidad aleatoria (entre 3s y 6s para cruzar la pantalla)
    const randomSpeed = (Math.random() * 3) + 3; 
    duckContainer.style.animationDuration = randomSpeed + 's';

    // 4. Crear estructura interna (Palo + Cuerpo)
    const stick = document.createElement('div');
    stick.classList.add('stick');
    
    const duckBody = document.createElement('div');
    duckBody.classList.add('duck-body');
    duckBody.innerHTML = '🦆'; // Aquí puedes poner <img src="pato.png"> si tienes imagen

    duckContainer.appendChild(stick);
    duckContainer.appendChild(duckBody);

    // 5. DETECTAR CLIC (DISPARO)
    duckContainer.addEventListener('mousedown', function() {
        // Sumar puntos
        score += 10;
        scoreElement.innerText = score;

        // Efecto visual de golpe
        duckBody.classList.add('hit');
        
        // Eliminar pato del DOM poco después de la animación de muerte
        setTimeout(() => {
            duckContainer.remove();
        }, 300);
    });

    // 6. Añadir al escenario
    gameContainer.appendChild(duckContainer);

    // 7. LIMPIEZA AUTOMÁTICA
    // Si no lo matan, se borra al salir de la pantalla para no ocupar memoria
    setTimeout(() => {
        if(duckContainer.parentNode) {
            duckContainer.remove();
        }
    }, randomSpeed * 1000);

    // 8. GENERAR EL SIGUIENTE PATO
    // Tiempo aleatorio para el próximo pato (entre 0.5s y 1.5s)
    const nextSpawnTime = Math.random() * 1000 + 500; 
    setTimeout(spawnDuck, nextSpawnTime);
}
