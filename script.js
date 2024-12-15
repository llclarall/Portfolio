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
const moodboard = document.querySelector('.moodboard');
let initialRelativePositions = [];

// Fonction pour calculer et stocker les positions relatives des items
function calculateInitialRelativePositions() {
    const boardRect = moodboard.getBoundingClientRect();
    initialRelativePositions = Array.from(items).map(item => {
        const rect = item.getBoundingClientRect();
        return { 
            top: (rect.top - boardRect.top) / boardRect.height, 
            left: (rect.left - boardRect.left) / boardRect.width 
        };
    });
}

// Fonction pour réinitialiser les positions des items en fonction des proportions
function resetItemsToRelativePositions() {
    const boardRect = moodboard.getBoundingClientRect();
    items.forEach((item, index) => {
        const { top, left } = initialRelativePositions[index];
        item.style.position = 'absolute';
        item.style.top = `${top * boardRect.height}px`;
        item.style.left = `${left * boardRect.width}px`;
        item.style.zIndex = ''; 
    });
}

calculateInitialRelativePositions();

// Ajouter la logique de déplacement des items
let currentZIndex = 10; // pour gérer les niveaux des items
items.forEach(item => {
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - item.getBoundingClientRect().left;
        offsetY = e.clientY - item.getBoundingClientRect().top;

        item.style.zIndex = currentZIndex; // Mettre l'item au-dessus des autres

        const moveItem = (eMove) => {
            const boardRect = moodboard.getBoundingClientRect();

            let newX = eMove.clientX - offsetX - boardRect.left;
            let newY = eMove.clientY - offsetY - boardRect.top;

            // Garder les items dans les limites du moodboard
            newX = Math.max(0, Math.min(newX, boardRect.width - item.offsetWidth));
            newY = Math.max(0, Math.min(newY, boardRect.height - item.offsetHeight));

            item.style.left = `${newX}px`;
            item.style.top = `${newY}px`;
        };

        const stopMove = () => {
            document.removeEventListener('mousemove', moveItem);
            document.removeEventListener('mouseup', stopMove);

            currentZIndex++; 
        };

        document.addEventListener('mousemove', moveItem);
        document.addEventListener('mouseup', stopMove);
    });
});

resetButton.addEventListener('click', resetItemsToRelativePositions);

// Recalculer les positions relatives lors d'un redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    resetItemsToRelativePositions();
});




/* POP UP PROJETS */

const modal = document.getElementById('project-modal');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalDetails = document.querySelector('.modal-details');
const modalLink = document.querySelector('.modal-link');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next-project');
const prevBtn = document.querySelector('.prev-project');

const projects = [
  {
    id: 1,
    title: "Hommade Hommous",
    description: "Site de réservation pour un restaurant fictif spécialisé dans le houmous.",
    details: ["Technologies : PHP, MySQL, HTML, CSS", "Objectif : Simplifier la réservation"],
    link: "https://resaweb.moubarak.butmmi.o2switch.site/index.php",
    preview: "images/hh_vid2.mp4"
  },
  {
    id: 2,
    title: "Interview L. Baron",
    description: "Vidéo d'interview créative réalisée avec une approche documentaire.",
    details: ["Logiciels : Premiere Pro, After Effects", "Durée : 3 minutes"],
    link: "https://www.youtube.com/watch?v=0ndssbiE-y4",
    preview: "images/baron_vid2.mp4"
  },
  // Ajoute d'autres projets ici
];

let currentProjectIndex = 0;

// Ouvrir la modale
document.querySelectorAll('.open-modal').forEach((icon, index) => {
  icon.addEventListener('click', (e) => {
    e.preventDefault();
    currentProjectIndex = index;
    showProjectModal(index);
  });
});

// Afficher les détails d'un projet dans la modale
function showProjectModal(index) {
  const project = projects[index];
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalDetails.innerHTML = project.details.map(detail => `<li>${detail}</li>`).join('');
  modalLink.href = project.link;

  // Afficher la modale
  modal.style.display = 'block';
}

// Fermer la modale
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fermer en cliquant à l'extérieur
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Navigation entre projets
nextBtn.addEventListener('click', () => {
  currentProjectIndex = (currentProjectIndex + 1) % projects.length;
  showProjectModal(currentProjectIndex);
});

prevBtn.addEventListener('click', () => {
  currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
  showProjectModal(currentProjectIndex);
});




});