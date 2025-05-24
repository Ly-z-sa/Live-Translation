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
    // The flower animation is now controlled entirely by CSS
}
