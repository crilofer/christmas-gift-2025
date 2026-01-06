/* ========================================
   MEMORIA DE REYES MAGOS - LÓGICA DEL JUEGO
   Un regalo especial para Papá y Mamá
   ======================================== */

// ========================================
// CONFIGURACIÓN
// ========================================

const CONFIG = {
    totalPairs: 12,
    flipDelay: 1000,
};

// Iconos temáticos para el reverso de las cartas
const CARD_BACKS = [
    '⭐', // Estrella de Belén
    '🐪', // Camello
    '👑', // Corona
    '🎁', // Regalo
    '🌙', // Luna
    '🌴', // Palmera
    '✨', // Destellos
    '🔔', // Campana
    '🏜️', // Desierto
    '💫', // Estrella fugaz
    '🕯️', // Vela
    '📜', // Pergamino
    '🌟', // Estrella brillante
    '🎄', // Árbol navideño
    '❄️', // Copo de nieve
    '🪔', // Lámpara
    '🧭', // Brújula
    '⛺', // Tienda
    '🌠', // Cielo estrellado
    '🎊', // Confeti
    '🪙', // Moneda de oro
    '💎', // Diamante
    '🏺', // Vasija
    '🌿', // Mirra/Incienso
];

// ========================================
// ESTADO DEL JUEGO
// ========================================

let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    attempts: 0,
    isLocked: false,
};

// ========================================
// ELEMENTOS DEL DOM
// ========================================

const elements = {
    welcomeScreen: document.getElementById('welcome-screen'),
    gameScreen: document.getElementById('game-screen'),
    revealScreen: document.getElementById('reveal-screen'),
    startBtn: document.getElementById('start-btn'),
    replayBtn: document.getElementById('replay-btn'),
    memoryBoard: document.getElementById('memory-board'),
    attemptsDisplay: document.getElementById('attempts'),
    pairsDisplay: document.getElementById('pairs-found'),
    giftBox: document.getElementById('gift-box'),
    giftReveal: document.getElementById('gift-reveal'),
    starsContainer: document.getElementById('stars'),
    confettiCanvas: document.getElementById('confetti-canvas'),
};

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    setupEventListeners();
    preloadImages(); // Precargar imágenes al inicio
});

function setupEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.replayBtn.addEventListener('click', restartGame);
}

// Precargar todas las imágenes para evitar cartas en blanco
function preloadImages() {
    for (let i = 1; i <= CONFIG.totalPairs; i++) {
        const img = new Image();
        img.src = `assets/fotos/${i}.jpg`;
    }
    // También precargar la imagen del regalo
    const giftImg = new Image();
    giftImg.src = 'assets/regalo.png';
}

// ========================================
// ESTRELLAS DE FONDO
// ========================================

function createStars() {
    const numStars = 100;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            --duration: ${duration}s;
            --delay: ${delay}s;
        `;
        
        elements.starsContainer.appendChild(star);
    }
}

// ========================================
// CONTROL DE PANTALLAS
// ========================================

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startGame() {
    showScreen(elements.gameScreen);
    initializeGame();
}

function restartGame() {
    resetGameState();
    showScreen(elements.welcomeScreen);
}

// ========================================
// LÓGICA DEL JUEGO
// ========================================

function initializeGame() {
    resetGameState();
    createCards();
    renderBoard();
}

function resetGameState() {
    gameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        attempts: 0,
        isLocked: false,
    };
    updateStats();
    
    // Reset reveal screen
    elements.giftBox.classList.remove('opening');
    elements.giftReveal.classList.add('hidden');
    elements.giftBox.style.display = 'block';
}

function createCards() {
    const cards = [];
    
    // Crear parejas de cartas
    for (let i = 1; i <= CONFIG.totalPairs; i++) {
        const cardData = {
            id: i,
            image: `assets/fotos/${i}.jpg`,
            backIcon: CARD_BACKS[(i - 1) % CARD_BACKS.length],
        };
        
        // Añadir dos cartas iguales (la pareja)
        cards.push({ ...cardData, uniqueId: `${i}-a` });
        cards.push({ ...cardData, uniqueId: `${i}-b` });
    }
    
    // Asignar iconos de reverso variados a cada carta
    cards.forEach((card, index) => {
        card.backIcon = CARD_BACKS[index % CARD_BACKS.length];
    });
    
    // Barajar las cartas
    gameState.cards = shuffleArray(cards);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderBoard() {
    elements.memoryBoard.innerHTML = '';
    
    gameState.cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        elements.memoryBoard.appendChild(cardElement);
    });
}

function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;
    cardDiv.dataset.id = card.id;
    
    cardDiv.innerHTML = `
        <div class="card-face card-back">${card.backIcon}</div>
        <div class="card-face card-front">
            <img src="${card.image}" alt="Recuerdo ${card.id}" 
                 onerror="this.parentElement.innerHTML='❤️'">
        </div>
    `;
    
    cardDiv.addEventListener('click', () => handleCardClick(cardDiv, index));
    
    return cardDiv;
}

function handleCardClick(cardElement, index) {
    // Prevenir clicks si el juego está bloqueado o la carta ya está volteada
    if (gameState.isLocked) return;
    if (cardElement.classList.contains('flipped')) return;
    if (cardElement.classList.contains('matched')) return;
    
    // Voltear la carta
    cardElement.classList.add('flipped');
    gameState.flippedCards.push({ element: cardElement, index });
    
    // Si hay dos cartas volteadas, comprobar si son pareja
    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        updateStats();
        checkForMatch();
    }
}

function checkForMatch() {
    gameState.isLocked = true;
    
    const [card1, card2] = gameState.flippedCards;
    const id1 = card1.element.dataset.id;
    const id2 = card2.element.dataset.id;
    
    if (id1 === id2) {
        // ¡Es una pareja!
        handleMatch(card1.element, card2.element);
    } else {
        // No es pareja
        handleMismatch(card1.element, card2.element);
    }
}

function handleMatch(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    gameState.matchedPairs++;
    updateStats();
    
    // Limpiar cartas volteadas
    gameState.flippedCards = [];
    gameState.isLocked = false;
    
    // Comprobar si el juego ha terminado
    if (gameState.matchedPairs === CONFIG.totalPairs) {
        setTimeout(() => {
            showRevealScreen();
        }, 500);
    }
}

function handleMismatch(card1, card2) {
    // Esperar a que termine la animación de volteo (600ms) antes de hacer shake
    setTimeout(() => {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
    }, 600);
    
    // Voltear de nuevo después del shake
    setTimeout(() => {
        card1.classList.remove('flipped', 'wrong');
        card2.classList.remove('flipped', 'wrong');
        gameState.flippedCards = [];
        gameState.isLocked = false;
    }, CONFIG.flipDelay + 600);
}

function updateStats() {
    elements.attemptsDisplay.textContent = gameState.attempts;
    elements.pairsDisplay.textContent = gameState.matchedPairs;
}

// ========================================
// PANTALLA DE REVELACIÓN
// ========================================

function showRevealScreen() {
    showScreen(elements.revealScreen);
    
    // Paso 1: Pequeño temblor para crear suspense
    setTimeout(() => {
        elements.giftBox.classList.add('shaking');
    }, 800);
    
    // Paso 2: Quitar temblor y empezar a abrir
    setTimeout(() => {
        elements.giftBox.classList.remove('shaking');
        elements.giftBox.classList.add('opening');
    }, 2000);
    
    // Paso 3: Mostrar el regalo y lanzar confeti
    setTimeout(() => {
        elements.giftBox.style.display = 'none';
        elements.giftReveal.classList.remove('hidden');
        launchConfetti();
    }, 5000);
}

// ========================================
// CONFETI
// ========================================

function launchConfetti() {
    const canvas = elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ffd700', '#d4a574', '#b8860b', '#ff6b6b', '#4ecdc4', '#fff8e7'];
    const shapes = ['square', 'circle', 'star'];
    
    // Crear piezas de confeti
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            velocityX: Math.random() * 4 - 2,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
        });
    }
    
    let animationId;
    let startTime = Date.now();
    const duration = 5000;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > duration) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationId);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            
            if (piece.shape === 'square') {
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            } else if (piece.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (piece.shape === 'star') {
                drawStar(ctx, 0, 0, 5, piece.size / 2, piece.size / 4);
            }
            
            ctx.restore();
            
            // Actualizar posición
            piece.x += piece.velocityX;
            piece.y += piece.velocityY;
            piece.rotation += piece.rotationSpeed;
            piece.velocityY += 0.1; // Gravedad
            
            // Fricción del aire
            piece.velocityX *= 0.99;
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', () => {
    if (elements.confettiCanvas) {
        elements.confettiCanvas.width = window.innerWidth;
        elements.confettiCanvas.height = window.innerHeight;
    }
});

