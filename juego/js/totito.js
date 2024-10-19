// Selecciona todas las celdas del tablero
const cells = document.querySelectorAll('[data-cell]');
// Elemento que muestra el estado del juego
const gameStatus = document.getElementById('game-status');
// Botón para reiniciar el juego y regresar al menú principal
const restartButton = document.getElementById('restart-btn');
// Botón para finalizar la partida actual
const endButton = document.getElementById('end-btn');
// Botón para iniciar la partida
const startButton = document.getElementById('start-btn');
// Formulario para ingresar los nombres de los jugadores
const playerForm = document.getElementById('player-form');
// Tablero del juego
const gameBoard = document.getElementById('game-board');
// Marcador de puntaje
const scoreboard = document.getElementById('scoreboard');
// Elementos que muestran los nombres de los jugadores
const playerXNameDisplay = document.getElementById('playerX-name');
const playerONameDisplay = document.getElementById('playerO-name');
// Elementos que muestran los puntajes de los jugadores
const playerXScoreDisplay = document.getElementById('playerX-score');
const playerOScoreDisplay = document.getElementById('playerO-score');
// Elemento que contiene los botones de control del juego
const buttonsDiv = document.getElementById('buttons');

// Clases que representan los símbolos 'X' y 'O'
const X_CLASS = 'x';
const O_CLASS = 'o';
// Combinaciones ganadoras en el tablero
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let oTurn; // Variable que indica si es el turno de 'O'
let playerXName = ''; // Nombre del jugador 'X'
let playerOName = ''; // Nombre del jugador 'O'
let playerXScore = 0; // Puntuación del jugador 'X'
let playerOScore = 0; // Puntuación del jugador 'O'
let playerXTurnNext = true;  // Indica si el jugador 'X' comenzará la próxima partida
let totalGames = 0;  // Total de partidas jugadas

// Evento que inicia el juego cuando se hace clic en el botón de inicio
startButton.addEventListener('click', () => {
    // Obtener los nombres de los jugadores desde el formulario
    playerXName = document.getElementById('player1').value || 'Jugador X';
    playerOName = document.getElementById('player2').value || 'Jugador O';
    
    // Mostrar los nombres en el marcador
    playerXNameDisplay.textContent = playerXName;
    playerONameDisplay.textContent = playerOName;

    // Ocultar el formulario y mostrar el tablero y el marcador
    playerForm.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    scoreboard.classList.remove('hidden');
    buttonsDiv.classList.remove('hidden');

    // Iniciar el juego
    startGame();
});

// Evento que reinicia el juego y redirige al menú principal
document.getElementById('restart-btn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirigir al menú principal
});

// Evento que termina la partida actual y reinicia el juego
endButton.addEventListener('click', () => { 
    gameStatus.textContent = `Partida terminada. ${playerXName} ${playerXScore} - ${playerOName} ${playerOScore}`;
    resetGameBoard(); // Limpiar el tablero
    document.getElementById('game-board').classList.add('hidden'); // Ocultar tablero
    document.getElementById('scoreboard').classList.add('hidden'); // Ocultar marcador
    document.getElementById('player-form').classList.remove('hidden'); // Mostrar formulario de jugadores
    document.getElementById('player1').value = ''; // Limpiar campo de Jugador X
    document.getElementById('player2').value = ''; // Limpiar campo de Jugador O
    playerXScore = 0; // Reiniciar puntaje del Jugador X
    playerOScore = 0; // Reiniciar puntaje del Jugador O
    document.getElementById('playerX-score').textContent = playerXScore; // Actualizar marcador de X
    document.getElementById('playerO-score').textContent = playerOScore; // Actualizar marcador de O
});

// Función que inicia el juego y limpia las celdas del tablero
function startGame() {
    oTurn = !playerXTurnNext;  // Alterna quién comienza la partida
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerHTML = ''; 
        cell.classList.remove('win');  // Remueve la clase de victoria
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true }); // Añade evento click una vez por celda
    });
    setBoardHoverClass(); // Ajusta la clase de hover según el turno
    gameStatus.textContent = `Turno de ${oTurn ? playerOName + ' (O)' : playerXName + ' (X)'}`;
}

// Maneja los clicks en las celdas del tablero
function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    const currentPlayerName = oTurn ? playerOName : playerXName;

    placeMark(cell, currentClass); // Coloca la marca 'X' o 'O'
    if (checkWin(currentClass)) {
        drawWinningLine(currentClass);  // Dibujar línea de victoria
        setTimeout(() => {
            endGame(false, currentPlayerName);  // Termina el juego en caso de victoria
        }, 500);  // Retardo antes de terminar
    } else if (isDraw()) {
        setTimeout(() => {
            endGame(true);  // Termina el juego en caso de empate
        }, 500);  // Retardo antes de mostrar empate
    } else {
        swapTurns();  // Cambia de turno
        setBoardHoverClass();  // Cambia la clase de hover
        gameStatus.textContent = `Turno de ${oTurn ? playerOName + ' (O)' : playerXName + ' (X)'}`;
    }
}

// Termina el juego y muestra el resultado
function endGame(draw, winner = '') {
    if (draw) {
        gameStatus.textContent = '¡Empate!';
        playerXTurnNext = !playerXTurnNext;  // Cambia el turno para la próxima partida
        setTimeout(startGame, 2000);  // Reinicia el juego en 2 segundos
    } else {
        gameStatus.textContent = `${winner} ha ganado!`;
        alert(`¡Felicidades ${winner}, has ganado!`);  // Muestra mensaje de victoria
        updateScore(winner);  // Actualiza el puntaje del ganador
        playerXTurnNext = winner === playerXName;  // El ganador inicia el próximo juego
        setTimeout(startGame, 2000);  // Reinicia el juego en 2 segundos
    }
}

// Verifica si todas las celdas están llenas para determinar empate
function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Coloca una marca ('X' o 'O') en la celda
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerHTML = currentClass.toUpperCase();
}

// Alterna el turno entre jugadores
function swapTurns() {
    oTurn = !oTurn;
}

// Ajusta la clase de hover según el turno actual
function setBoardHoverClass() {
    gameBoard.classList.remove(X_CLASS);
    gameBoard.classList.remove(O_CLASS);
    if (oTurn) {
        gameBoard.classList.add(O_CLASS);
    } else {
        gameBoard.classList.add(X_CLASS);
    }
}

// Verifica si un jugador ha ganado
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

// Actualiza el puntaje del jugador ganador
function updateScore(winner) {
    if (winner === playerXName) {
        playerXScore++;
        playerXScoreDisplay.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreDisplay.textContent = playerOScore;
    }
}

// Dibuja una línea en las celdas ganadoras
function drawWinningLine(currentClass) {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });

    if (winningCombination) {
        winningCombination.forEach(index => {
            cells[index].classList.add('win');  // Añade la clase para resaltar la victoria
        });
    }
}

// Reinicia el tablero del juego
function resetGameBoard() {
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('win');  // Remueve la clase de victoria
        cell.innerHTML = '';  // Limpia el contenido de la celda
    });
    playerXTurnNext = true;  // Reinicia el jugador que comenzará
}
