document.addEventListener('DOMContentLoaded', () => {

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




/* Démarrer la vidéo pour projets */

const divsWork = document.querySelectorAll('.work');

divsWork.forEach(div => {
    const previewVideo = div.querySelector('.preview-video');
    
    if (previewVideo) {
        div.addEventListener('mouseenter', () => {
            previewVideo.play(); // Démarre la vidéo au survol
        });

        div.addEventListener('mouseleave', () => {
            previewVideo.pause(); // Met en pause la vidéo quand la souris quitte
            previewVideo.currentTime = 0; // Réinitialise la vidéo au début
        });
    }
});




/* MOUVEMENT DES ÉLÉMENTS DU MOODBOARD */

const items = document.querySelectorAll('.moodboard-item');
const resetButton = document.querySelector('.reset-button');
// Vérifiez que les positions initiales sont correctement enregistrées
const initialPositions = Array.from(items).map(item => {
    const rect = item.getBoundingClientRect();
    const parentRect = item.offsetParent.getBoundingClientRect();
    return { 
        top: rect.top - parentRect.top, 
        left: rect.left - parentRect.left 
    };
});let currentZIndex = 10;  // Start with a base z-index

// Store initial positions of items
items.forEach(item => {
    const rect = item.getBoundingClientRect();
    initialPositions.push({
        top: rect.top,
        left: rect.left
    });

    // Enable dragging with smooth movement
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - item.getBoundingClientRect().left;
        offsetY = e.clientY - item.getBoundingClientRect().top;

        // Set the dragged item on top of others initially
        item.style.zIndex = currentZIndex;

        const moveItem = (eMove) => {
            const moodboard = document.querySelector('.moodboard');
            const boardRect = moodboard.getBoundingClientRect();

            let newX = eMove.clientX - offsetX - boardRect.left;
            let newY = eMove.clientY - offsetY - boardRect.top;
            

            // Keep items within the moodboard boundary
            newX = Math.max(0, Math.min(newX, moodboard.offsetWidth - item.offsetWidth));
            newY = Math.max(0, Math.min(newY, moodboard.offsetHeight - item.offsetHeight));

            item.style.left = `${newX}px`;
            item.style.top = `${newY}px`;
        };

        const stopMove = () => {
            document.removeEventListener('mousemove', moveItem);
            document.removeEventListener('mouseup', stopMove);

            // Increment z-index after releasing
            currentZIndex++;  // Ensure the next item dragged is on top of the previous ones
            item.style.zIndex = currentZIndex;  // Update the item's z-index

        };

        document.addEventListener('mousemove', moveItem);
        document.addEventListener('mouseup', stopMove);
    });
});


// Fonction Reset
resetButton.addEventListener('click', () => {
    items.forEach((item, index) => { 
        const { top, left } = initialPositions[index];
        item.style.top = `${top}px`;  
        item.style.left = `${left}px`;
        item.style.zIndex = '';  // Réinitialiser le z-index
    });
    currentZIndex = 10;  // Réinitialiser le compteur
});




});