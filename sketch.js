// Obtener el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let pelota = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radio: 30,
  dx: 4 * 1.5,
  dy: 4 * 1.5,
  angulo: 30
};

let paletaIzq = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 90,
  dy: 0
};

let paletaDer = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 90,
  dy: 5
};

// Puntuaciones y victorias
let puntajeIzq = 0, puntajeDer = 0;
let victoriasIzq = 0, victoriasDer = 0;
let juegoPausado = true;
let finJuego = false;

// Cargar imágenes y sonidos
const fondo = new Image();
fondo.src = 'assets/imagen2.jpg';
const balonImg = new Image();
balonImg.src = 'assets/balon.png';

const sonidoHit = new Audio('sounds/hit.mp3');
const sonidoPause = new Audio('sounds/pause.mp3');
const sonidoGol = new Audio('sounds/gol.mp3');
const sonidoWin = new Audio('sounds/win.mp3');

// Función para dibujar la pelota
function dibujarPelota() {
  ctx.save();
  ctx.translate(pelota.x, pelota.y);
  ctx.rotate(pelota.angulo);
  ctx.drawImage(balonImg, -pelota.radio, -pelota.radio, pelota.radio * 2, pelota.radio * 2);
  ctx.restore();
}

// Función para dibujar las paletas
function dibujarPaletas() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(paletaIzq.x, paletaIzq.y, paletaIzq.width, paletaIzq.height);
  ctx.fillRect(paletaDer.x, paletaDer.y, paletaDer.width, paletaDer.height);
}

// Mover la pelota
function moverPelota() {
  pelota.x += pelota.dx;
  pelota.y += pelota.dy;
  pelota.angulo += 0.2;

  if (pelota.y + pelota.dy < pelota.radio || pelota.y + pelota.dy > canvas.height - pelota.radio) {
    pelota.dy = -pelota.dy;
  }

  if (pelota.x - pelota.radio < paletaIzq.x + paletaIzq.width &&
      pelota.y > paletaIzq.y && pelota.y < paletaIzq.y + paletaIzq.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play();
  }

  if (pelota.x + pelota.radio > paletaDer.x &&
      pelota.y > paletaDer.y && pelota.y < paletaDer.y + paletaDer.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play();
  }

  if (pelota.x < 0) {
    puntajeDer++;
    sonidoGol.play();
    resetPelota();
  }

  if (pelota.x > canvas.width) {
    puntajeIzq++;
    sonidoGol.play();
    resetPelota();
  }
}

// Restablecer la pelota
function resetPelota() {
  pelota.x = canvas.width / 2;
  pelota.y = canvas.height / 2;
  pelota.dx = -pelota.dx;

  if (puntajeIzq >= 10) {
    victoriasIzq++;
    puntajeIzq = 0;
    puntajeDer = 0;
  } else if (puntajeDer >= 10) {
    victoriasDer++;
    puntajeIzq = 0;
    puntajeDer = 0;
  }

  if (victoriasIzq >= 3 || victoriasDer >= 3) {
    finJuego = true;
  }
}

// Dibujar el fondo
function dibujarFondo() {
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
}

// Función principal de dibujar
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarFondo();
  dibujarPelota();
  dibujarPaletas();

  if (!finJuego) {
    if (!juegoPausado) {
      moverPelota();
      moverPaletas();
    }
  }
}

// Mover las paletas
function moverPaletas() {
  paletaIzq.y += paletaIzq.dy;

  if (pelota.y < paletaDer.y + paletaDer.height / 2) {
    paletaDer.y -= paletaDer.dy;
  } else if (pelota.y > paletaDer.y + paletaDer.height / 2) {
    paletaDer.y += paletaDer.dy;
  }

  paletaIzq.y = Math.max(0, Math.min(canvas.height - paletaIzq.height, paletaIzq.y));
  paletaDer.y = Math.max(0, Math.min(canvas.height - paletaDer.height, paletaDer.y));
}

// Controles táctiles y virtuales
document.querySelector('.btn-up').addEventListener('touchstart', () => {
  paletaIzq.dy = -4;
});
document.querySelector('.btn-up').addEventListener('touchend', () => {
  paletaIzq.dy = 0;
});
document.querySelector('.btn-down').addEventListener('touchstart', () => {
  paletaIzq.dy = 4;
});
document.querySelector('.btn-down').addEventListener('touchend', () => {
  paletaIzq.dy = 0;
});

// Controles del teclado (solo para escritorio)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") paletaIzq.dy = -4;
  if (e.key === "ArrowDown") paletaIzq.dy = 4;
  if (e.key === " ") {
    juegoPausado = !juegoPausado;
    if (juegoPausado) {
      sonidoPause.play();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") paletaIzq.dy = 0;
});

// Actualizar marcadores
function actualizarMarcadores() {
  document.querySelector('.score').textContent = `${puntajeIzq} - ${puntajeDer}`;
  document.querySelector('.times-won').textContent = `Jugador: ${victoriasIzq} - Computadora: ${victoriasDer}`;

  if (finJuego) {
    document.querySelector('.score').textContent = "Juego Finalizado";
    document.querySelector('.times-won').textContent = `Ganador: ${victoriasIzq > victoriasDer ? 'Jugador' : 'Computadora'}`;
  }
}

// Bucle principal del juego
function loop() {
  dibujar();
  actualizarMarcadores();
  requestAnimationFrame(loop);
}

loop();