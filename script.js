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
const modalContext = document.querySelector('.modal-context');
const modalType = document.querySelector('.modal-type');
const modalLink = document.querySelector('.modal-link');
const modalGroup = document.querySelector('.modal-group');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next-project');
const prevBtn = document.querySelector('.prev-project');
const previewContainer = document.querySelector('.preview-container');
const previewImage = document.querySelector('.preview-image');

let projects = [];
let currentProjectIndex = 0;

// Charger les projets depuis le fichier JSON
fetch('projects.json')
  .then(response => {
    if (!response.ok) throw new Error('Erreur lors du chargement des projets.');
    return response.json();
  })
  .then(data => {
    projects = data;
    initializeModals();
  })
  .catch(error => console.error(error));

// Initialiser les modales après le chargement des projets
function initializeModals() {
  document.querySelectorAll('.open-modal').forEach((icon, index) => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      currentProjectIndex = index;
      showProjectModal(index);
    });
  });
}

// Afficher les détails d'un projet dans la modale
function showProjectModal(index) {
  const project = projects[index];
  modalTitle.textContent = project.title;
  modalContext.textContent = project.context;
  modalGroup.textContent = project.group;
  modalType.textContent = project.type;
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

// Fonction pour récupérer l'index suivant ou précédent
function getNextIndex(currentIndex, direction, total) {
  if (direction === "next") {
    return (currentIndex + 1) % total; // Retourne au début après le dernier projet
  } else if (direction === "prev") {
    return (currentIndex - 1 + total) % total; // Retourne à la fin après le premier projet
  }
  return currentIndex;
}

// Navigation entre projets
nextBtn.addEventListener('click', () => {
  currentProjectIndex = getNextIndex(currentProjectIndex, "next", projects.length);
  showProjectModal(currentProjectIndex);
});

prevBtn.addEventListener('click', () => {
  currentProjectIndex = getNextIndex(currentProjectIndex, "prev", projects.length);
  showProjectModal(currentProjectIndex);
});

// Fonction de mise à jour des prévisualisations d'image
function updatePreview(index, direction) {
  const project = projects[index];
  if (project && project.image) {
    previewImage.src = project.image;
  } else {
    previewImage.src = 'images/default.jpg'; // Image par défaut si l'image est manquante
  }

  // Positionner la prévisualisation en fonction du bouton hover
  if (direction === "next") {
    previewContainer.style.left = nextBtn.offsetLeft + nextBtn.offsetWidth + 'px'; 
  } else if (direction === "prev") {
    previewContainer.style.left = prevBtn.offsetLeft - previewContainer.offsetWidth - '0px'; 
  }

  previewContainer.style.display = 'block';
}

// Fonction de mise à jour des prévisualisations d'image
function updatePreview(index, direction) {
  const project = projects[index];
  if (project && project.image) {
    previewImage.src = project.image;
  } else {
    previewImage.src = 'images/default.jpg'; // Image par défaut si l'image est manquante
  }

  // Positionner la prévisualisation en fonction du bouton hover
  if (direction === "next") {
    // Position à droite du bouton "Suivant"
    previewContainer.style.left = (nextBtn.offsetLeft + nextBtn.offsetWidth - 263) + 'px';
    previewContainer.style.top = nextBtn.offsetTop + 'px'; // Aligner avec le bouton sur l'axe vertical
  } else if (direction === "prev") {
    // Position à gauche du bouton "Précédent"
    previewContainer.style.left = (prevBtn.offsetLeft - previewContainer.offsetWidth + 127) + 'px';
    previewContainer.style.top = prevBtn.offsetTop + 'px'; // Aligner avec le bouton sur l'axe vertical
  }

  previewContainer.style.display = 'block';
}

// Mettre à jour la prévisualisation lors du survol des boutons
nextBtn.addEventListener('mouseenter', () => {
  const nextIndex = getNextIndex(currentProjectIndex, "next", projects.length);
  updatePreview(nextIndex, "next");
});

nextBtn.addEventListener('mouseleave', () => {
  previewContainer.style.display = 'none';
});

prevBtn.addEventListener('mouseenter', () => {
  const prevIndex = getNextIndex(currentProjectIndex, "prev", projects.length);
  updatePreview(prevIndex, "prev");
});

prevBtn.addEventListener('mouseleave', () => {
  previewContainer.style.display = 'none';
});







});