
/* MOUVEMENT DU TITRE */

const title = document.getElementById('moving-title');

// Écoute l'événement de mouvement de la souris
document.addEventListener('mousemove', (event) => {
    // Obtiens la largeur et la hauteur de la fenêtre
    const { innerWidth, innerHeight } = window;

    // Obtiens les coordonnées de la souris
    const x = event.clientX;
    const y = event.clientY;

    // Calcule les coordonnées du centre de la fenêtre
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;

    // Calcule l'angle d'inclinaison en fonction des coordonnées de la souris
    const deltaX = x - centerX;
    const deltaY = y - centerY;

    // Inclinaison maximale en degrés
    const maxTilt = 15; 

    // Calcule les inclinaisons sur les axes X et Y
    const tiltX = (deltaY / (innerHeight / 2)) * maxTilt;
    const tiltY = (deltaX / (innerWidth / 2)) * maxTilt; 

    // Applique uniquement la rotation au titre
    title.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
});


/* // Sélectionne la div et la vidéo
const div = document.getElementById('hh');
const video = document.getElementById('video-element');

// Écoute l'événement de survol de la souris sur la div
div.addEventListener('mouseenter', () => {
    video.play();
});

// Écoute l'événement de sortie de la souris de la div
div.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // Réinitialise la vidéo au début
}); */




/* Démarrer la vidéo pour projets */

const divsWork = document.querySelectorAll('.work');

divsWork.forEach(div => {
    const previewVideo = div.querySelector('.preview-video');
    
    div.addEventListener('mouseenter', () => {
        previewVideo.play(); // Démarre la vidéo au survol
    });

    div.addEventListener('mouseleave', () => {
        previewVideo.pause(); // Met en pause la vidéo quand la souris quitte
        previewVideo.currentTime = 0; // Réinitialise la vidéo au début
    });
});