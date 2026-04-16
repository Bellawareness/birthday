// Slideshow functionality
let currentSlideIndex = 1;
let slideShowTimeout;

function changeSlide(n) {
    clearTimeout(slideShowTimeout);
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    clearTimeout(slideShowTimeout);
    showSlide(currentSlideIndex = n);
}

function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const indicators = document.getElementsByClassName('indicator');

    if (n > slides.length) {
        currentSlideIndex = 1;
    }
    if (n < 1) {
        currentSlideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (let i = 0; i < indicators.length; i++) {
        indicators[i].classList.remove('active');
    }

    slides[currentSlideIndex - 1].classList.add('active');
    indicators[currentSlideIndex - 1].classList.add('active');

    // Auto-advance after 4 seconds
    slideShowTimeout = setTimeout(() => {
        showSlide(++currentSlideIndex);
    }, 4000);
}

// Initialize slideshow
function setupSlideshow() {
    showSlide(currentSlideIndex);
}

function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Handle envelope click to open card
function setupEnvelope() {
    const envelope = document.getElementById('envelope');
    envelope.addEventListener('click', function(e) {
        e.preventDefault();
        openCard();
    });
}

// Open the birthday card
function openCard() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.classList.add('active');
    createConfetti();
    playCelebration();
}

// Close the birthday card
function closeCard() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.classList.remove('active');
}

// Allow clicking outside the card to close it
document.addEventListener('click', function(e) {
    const cardContainer = document.getElementById('cardContainer');
    if (cardContainer.classList.contains('active') && e.target === cardContainer) {
        closeCard();
    }
});

// Allow pressing Escape to close the card
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCard();
    }
});

// Create confetti effect
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const confettiPieces = 80;

    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        const colors = ['#ff69b4', '#da70d6', '#87ceeb', '#ffb6c1', '#fff0f5'];
        confetti.style.position = 'absolute';
        confetti.style.width = (5 + Math.random() * 5) + 'px';
        confetti.style.height = (5 + Math.random() * 5) + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.boxShadow = `0 0 ${5 + Math.random() * 5}px ${colors[Math.floor(Math.random() * colors.length)]}`;
        confetti.style.animation = `fall ${3 + Math.random() * 3}s linear forwards`;
        confettiContainer.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 6500);
    }
}

// Add fall animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Trigger confetti periodically when on hero section
function setupPeriodicConfetti() {
    setInterval(() => {
        if (window.scrollY < window.innerHeight * 0.5) {
            createConfetti();
        }
    }, 3000);
}

// Smooth scroll animations on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.wish-card, .video-container').forEach(el => {
        observer.observe(el);
    });
}

// Save custom message to local storage
function setupCustomMessage() {
    const messageBox = document.querySelector('.custom-message');

    // Load saved message
    const savedMessage = localStorage.getItem('birthdayMessage');
    if (savedMessage) {
        messageBox.value = savedMessage;
    }

    // Save on input
    messageBox.addEventListener('input', (e) => {
        localStorage.setItem('birthdayMessage', e.target.value);
    });
}

// Play celebration sound
function playCelebration() {
    // Create a simple beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 700;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Audio context not supported, no error needed
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupEnvelope();
    setupScrollAnimations();
    setupCustomMessage();
    setupPeriodicConfetti();
    setupSlideshow();

    // Initial confetti burst
    setTimeout(() => {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 300);
        }
    }, 500);
});

// Prevent text selection on double-click for better UX
document.addEventListener('selectstart', (e) => {
    if (e.target.closest('.emoji-bounce') || e.target.closest('.candy-name')) {
        e.preventDefault();
    }
});
