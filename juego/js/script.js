document.addEventListener('DOMContentLoaded', () => {
    
    let cardsArray = [
        { name: 'A' }, { name: 'B' }, { name: 'C' },
        { name: 'D' }, { name: 'E' }, { name: 'F' },
        { name: 'G' }, { name: 'H' }
    ];


    let gameGrid = [];
    let flippedCards = 0;
    let firstCard = '', secondCard = '';
    let firstCardEl, secondCardEl;
    let isPaused = false;
    let interval;
    let timeLeft = 180; // 3 minutos en segundos

    const grid = document.getElementById('game-grid');
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const dejarBtn = document.getElementById('dejar-btn');
    const exitBtn = document.getElementById('exit-btn');
    const gameOverOverlay = document.getElementById('game-over');
    const gameOverText = document.getElementById('game-over-text');
    const restartBtn = document.getElementById('restart-btn');
    const overlayExitBtn = document.getElementById('overlay-exit-btn');

    function startTimer() {
        interval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `Tiempo: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                endGame('¡Se acabó el tiempo!');
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(interval);
    }

    function shuffleCards() {
        gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());
        createBoard();
        const cards = document.querySelectorAll('.card');
        
        // Mostrar cartas al inicio con animación de mezcla
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100); // Mostrar cartas con un pequeño retraso
        });
        
        // Ocultar cartas después de la animación de mezcla para que el juego pueda empezar
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove('show');
            });
        }, 300000); // Después de 2 segundos, ocultar todas las cartas para que el jugador comience el juego
    }
    

    function createBoard() {
        grid.innerHTML = '';
        gameGrid.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.name = item.name;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.textContent = '?';

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = item.name;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            grid.appendChild(card);

            card.addEventListener('click', () => {
                if (!isPaused && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    if (firstCard === '') {
                        firstCard = item.name;
                        firstCardEl = card;
                    } else {
                        secondCard = item.name;
                        secondCardEl = card;
                        checkMatch();
                    }
                }
            });
        });
    }

    function checkMatch() {
        isPaused = true;
        if (firstCard === secondCard) {
            flippedCards += 2;

            firstCardEl.classList.add('correct-match');
            secondCardEl.classList.add('correct-match');
        
            setTimeout(() => {
                firstCardEl.classList.remove('correct-match');
                secondCardEl.classList.remove('correct-match');
                resetChoices();
                resetChoices();
                if (flippedCards === gameGrid.length) {
                    stopTimer();
                    endGame('¡Felicidades! Ganaste el juego.');
                }
            }, 1000);


        } else {
            setTimeout(() => {
                firstCardEl.classList.remove('flipped');
                secondCardEl.classList.remove('flipped');
                resetChoices();
            }, 1000);
        }
    }

    function resetChoices() {
        firstCard = '';
        secondCard = '';
        isPaused = false;
    }

    function startGame() {
        timeLeft = 180; // Resetear a 3 minutos
        flippedCards = 0;
        timerDisplay.textContent = 'Tiempo: 3:00';
        shuffleCards();
        startTimer();
    }

    function endGame(message) {
        stopTimer();
        gameOverOverlay.classList.remove('hidden');
        gameOverText.textContent = message;

    }

    startBtn.addEventListener('click', () => {
        gameOverOverlay.classList.add('hidden');
        startGame();
    });

    dejarBtn.addEventListener('click', () => {
        location.reload(); // Reinicia la página al presionar salir
    });
    
    restartBtn.addEventListener('click', () => {
        gameOverOverlay.classList.add('hidden');
        startGame();
    }); 

    exitBtn.addEventListener('click', () => {
        gameOverOverlay.classList.remove('hidden');
        window.location.href = 'index.html';
    });

    overlayExitBtn.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirigir a la página de inicio
    });
  
});
