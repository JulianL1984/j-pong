// Obtener el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let pelota = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radio: 30,
  dx: 4 * 1.5,  // Ajustar la velocidad horizontal de la pelota (1.2x la velocidad original)
  dy: 4 * 1.5,  // Ajustar la velocidad vertical de la pelota (1.2x la velocidad original)
  angulo: 0 // Nueva propiedad para controlar el ángulo de rotación
};

let paletaIzq = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 70,
  dy: 0
};

let paletaDer = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 70,
  dy: 4
};

// Puntuaciones y victorias
let puntajeIzq = 0, puntajeDer = 0;
let victoriasIzq = 0, victoriasDer = 0; // Contadores de victorias
let juegoPausado = true;
let finJuego = false; // Flag para verificar si el juego ha terminado

// Cargar imágenes y sonidos
const fondo = new Image();
fondo.src = 'assets/imagen2.jpg'; // Fondo de pantalla
const balonImg = new Image();
balonImg.src = 'assets/balon.png'; // Imagen del balón

const sonidoHit = new Audio('sounds/hit.mp3');
const sonidoPause = new Audio('sounds/pause.mp3');
const sonidoGol = new Audio('sounds/gol.mp3');
const sonidoWin = new Audio('sounds/win.mp3');

// Función para dibujar la pelota y aplicar la rotación
function dibujarPelota() {
  ctx.save(); // Guardar el estado actual del contexto

  // Mover el contexto al centro de la pelota
  ctx.translate(pelota.x, pelota.y);

  // Rotar el contexto basado en el ángulo de la pelota
  ctx.rotate(pelota.angulo);

  // Dibujar la imagen del balón, ajustando la posición ya que ahora el origen es el centro
  ctx.drawImage(balonImg, -pelota.radio, -pelota.radio, pelota.radio * 2, pelota.radio * 2);

  ctx.restore(); // Restaurar el contexto al estado original
}

// Función para dibujar las paletas
function dibujarPaletas() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(paletaIzq.x, paletaIzq.y, paletaIzq.width, paletaIzq.height);
  ctx.fillRect(paletaDer.x, paletaDer.y, paletaDer.width, paletaDer.height);
}

// Mover la pelota y hacerla girar
function moverPelota() {
  pelota.x += pelota.dx;
  pelota.y += pelota.dy;

  // Incrementar el ángulo de la pelota para que gire
  pelota.angulo += 0.2; // Ajusta este valor para que gire más rápido o más lento

  // Rebotar en los bordes superior e inferior
  if (pelota.y + pelota.dy < pelota.radio || pelota.y + pelota.dy > canvas.height - pelota.radio) {
    pelota.dy = -pelota.dy;
  }

  // Colisión con la paleta izquierda
  if (pelota.x - pelota.radio < paletaIzq.x + paletaIzq.width &&
      pelota.y > paletaIzq.y && pelota.y < paletaIzq.y + paletaIzq.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play(); // Reproducir sonido de colisión
  }

  // Colisión con la paleta derecha
  if (pelota.x + pelota.radio > paletaDer.x &&
      pelota.y > paletaDer.y && pelota.y < paletaDer.y + paletaDer.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play(); // Reproducir sonido de colisión
  }

  // Puntos para el jugador de la derecha
  if (pelota.x < 0) {  // Si la pelota pasa el borde izquierdo
    puntajeDer++; // El jugador de la derecha obtiene un punto
    sonidoGol.play(); // Reproducir sonido de gol
    resetPelota();
  }

  // Puntos para el jugador de la izquierda
  if (pelota.x > canvas.width) {  // Si la pelota pasa el borde derecho
    puntajeIzq++; // El jugador de la izquierda obtiene un punto
    sonidoGol.play(); // Reproducir sonido de gol
    resetPelota();
  }
}

// Restablecer la pelota en el centro
function resetPelota() {
  pelota.x = canvas.width / 2;
  pelota.y = canvas.height / 2;
  pelota.dx = -pelota.dx;

  // Comprobar si alguien alcanzó 10 puntos
  if (puntajeIzq >= 10) {
    victoriasIzq++; // El jugador de la izquierda ganó el set
    puntajeIzq = 0;  // Resetear el puntaje
    puntajeDer = 0;
  } else if (puntajeDer >= 10) {
    victoriasDer++; // El jugador de la derecha ganó el set
    puntajeIzq = 0;  // Resetear el puntaje
    puntajeDer = 0;
  }

  // Verificar si alguien llegó a 3 victorias
  if (victoriasIzq >= 3 || victoriasDer >= 3) {
    finJuego = true; // Fin del juego
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

  // Verificar si el juego está pausado o ha terminado
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

  // Lógica de movimiento de la computadora (paleta derecha)
  if (pelota.y < paletaDer.y + paletaDer.height / 2) {
    paletaDer.y -= paletaDer.dy;
  } else if (pelota.y > paletaDer.y + paletaDer.height / 2) {
    paletaDer.y += paletaDer.dy;
  }

  // Limitar el movimiento de las paletas dentro del canvas
  paletaIzq.y = Math.max(0, Math.min(canvas.height - paletaIzq.height, paletaIzq.y));
  paletaDer.y = Math.max(0, Math.min(canvas.height - paletaDer.height, paletaDer.y));
}

// Eventos de teclado para mover la paleta izquierda
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") paletaIzq.dy = -4;
  if (e.key === "ArrowDown") paletaIzq.dy = 4;
  if (e.key === " ") {
    juegoPausado = !juegoPausado;
    if (juegoPausado) {
      sonidoPause.play(); // Reproducir sonido de pausa
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") paletaIzq.dy = 0;
});

// Actualizar los marcadores en la pantalla
function actualizarMarcadores() {
  document.querySelector('.score').textContent = `${puntajeIzq} - ${puntajeDer}`;
  document.querySelector('.times-won').textContent = `Jugador: ${victoriasIzq} - Computadora: ${victoriasDer}`;

  // Si el juego ha terminado, mostrar mensaje final en HTML
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

// Iniciar el bucle del juego
loop();