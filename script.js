const card = document.querySelector('.card');
const cake = document.querySelector('.cake');
const flowers = document.querySelector('.flowers');

if (cake) {
    cake.addEventListener('mouseover', () => {
        cake.style.transform = 'translateX(-50%) translateY(-5px)';
        cake.style.transition = 'transform 0.3s ease-in-out';
    });

    cake.addEventListener('mouseout', () => {
        cake.style.transform = 'translateX(-50%) translateY(0)';
        cake.style.transition = 'transform 0.3s ease-in-out';
    });
}

if (flowers) {
    flowers.style.animation = 'bloom 5s infinite alternate, sway 3s infinite alternate';
}

if (card) {
    // Confetti on load
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
        createConfetti();
    }

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.animationDuration = `${Math.random() * 5 + 3}s`;
        card.appendChild(confetti);

        // Remove confetti after animation
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
