document.addEventListener('DOMContentLoaded', () => {

/* MOUVEMENT DU TITRE */

const title = document.getElementById('moving-title');

// Délai pour synchroniser avec la fin de l'animation fade-in
setTimeout(() => {
    // Ajoute une classe pour indiquer que l'effet de rotation peut commencer
    title.classList.add('moving');

    // Écoute les mouvements de la souris
    document.addEventListener('mousemove', (event) => {
        const { innerWidth, innerHeight } = window;
        const x = event.clientX;
        const y = event.clientY;
        const centerX = innerWidth / 2;
        const centerY = innerHeight / 2;

        // Calcul de l'inclinaison
        const maxTilt = 15;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const tiltX = (deltaY / (innerHeight / 2)) * maxTilt;
        const tiltY = (deltaX / (innerWidth / 2)) * maxTilt;

        // Applique les transformations
        title.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
    });
}, 3000); // Correspond à la durée de l'animation fade-in



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

    // Gestion du déplacement avec la souris (pour les ordinateurs)
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

    // Gestion du déplacement avec le toucher (pour les téléphones)
    item.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        offsetX = touch.clientX - item.getBoundingClientRect().left;
        offsetY = touch.clientY - item.getBoundingClientRect().top;

        item.style.zIndex = currentZIndex; // Mettre l'item au-dessus des autres

        const moveItem = (eMove) => {
            const touch = eMove.touches[0];
            const boardRect = moodboard.getBoundingClientRect();

            let newX = touch.clientX - offsetX - boardRect.left;
            let newY = touch.clientY - offsetY - boardRect.top;

            // Garder les items dans les limites du moodboard
            newX = Math.max(0, Math.min(newX, boardRect.width - item.offsetWidth));
            newY = Math.max(0, Math.min(newY, boardRect.height - item.offsetHeight));

            item.style.left = `${newX}px`;
            item.style.top = `${newY}px`;

            // Empêcher le défilement de la page lors du mouvement tactile
            eMove.preventDefault();
        };

        const stopMove = () => {
            document.removeEventListener('touchmove', moveItem);
            document.removeEventListener('touchend', stopMove);

            currentZIndex++; 
        };

        // Ajouter l'option passive: false pour permettre preventDefault
        document.addEventListener('touchmove', moveItem, { passive: false });
        document.addEventListener('touchend', stopMove);
    });
});

resetButton.addEventListener('click', resetItemsToRelativePositions);

// Recalculer les positions relatives lors d'un redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    resetItemsToRelativePositions();
});





/* POP UP PROJETS */

// Initialisation des variables
const modal = document.getElementById('project-modal');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalDetails = document.querySelector('.modal-details');
const modalContext = document.querySelector('.modal-context');
const modalType = document.querySelector('.modal-type');
const modalLink = document.querySelector('.modal-link');
const modalGroup = document.querySelector('.modal-group');
const modalImage = document.querySelector('.modal-image');
const modalImage2 = document.querySelector('.modal-image2');
const closeBtn = document.querySelector('.close');
const nextBtn = document.querySelector('.next-project');
const prevBtn = document.querySelector('.prev-project');
const previewContainer = document.querySelector('.preview-container');
const previewImage = document.querySelector('.preview-image');

let projects = [];
let currentProjectIndex = 0;
let currentLang = 'fr'; // Langue par défaut

// Charger les projets depuis le fichier JSON
fetch('projects2.json')
  .then(response => {
    if (!response.ok) throw new Error('Erreur lors du chargement des projets.');
    return response.json();
  })
  .then(data => {
    projects = data;  // Charger les projets dans les deux langues
    initializeModals();  // Initialiser les modales
  })
  .catch(error => console.error(error));

// Gestion des boutons de sélection de langue
document.querySelectorAll(".language-selector button").forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLang = button.getAttribute("data-lang");
    changeLanguage(selectedLang); // Changer la langue
  });
});

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("preferredLanguage", lang);

  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");

    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    } else {
      console.warn(`Traduction manquante : ${key} pour la langue ${lang}`);
    }
  });

  document.title = translations[lang]?.title || "Clara Moubarak | Portfolio";
  loadProjectsForLang(lang); // Recharger les projets si nécessaire
}

// Charger les projets dans la langue choisie
function loadProjectsForLang(lang) {
  fetch('projects2.json')
    .then(response => response.json())
    .then(data => {
      projects = data[lang];  // Charger les projets dans la langue choisie
      initializeModals();  // Réinitialiser les modales
    })
    .catch(error => console.error(error));
}

// Initialiser les modales
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
  modalImage.src = project.image;
  if (project.image2) {
    modalImage2.src = project.image2;
    modalImage2.style.display = '';
  } else {
    modalImage2.src = '';
    modalImage2.style.display = 'none';
  }
  modalDescription.innerHTML = project.description;
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
    previewContainer.style.left = (nextBtn.offsetLeft + nextBtn.offsetWidth - 245) + 'px';
    previewContainer.style.top = nextBtn.offsetTop + 'px'; // Aligner avec le bouton sur l'axe vertical
  } else if (direction === "prev") {
    previewContainer.style.left = (prevBtn.offsetLeft - previewContainer.offsetWidth + 110) + 'px';
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

const savedLang = localStorage.getItem("preferredLanguage") || "fr";
  changeLanguage(savedLang);
});



  




/* BOUTONS LANGUE */

document.addEventListener("DOMContentLoaded", function() {
  const frButton = document.getElementById('btn-fr');
  const enButton = document.getElementById('btn-en');
  const htmlElement = document.documentElement;

  
  // Initialisation de la langue par défaut (Français)
  let currentLanguage = 'fr'; // Par défaut, le site est en français
  
  // Fonction pour changer de langue
  function changeLanguage(language) {
      if (language === 'fr') {
          currentLanguage = 'fr';
          htmlElement.lang = 'fr';
          frButton.style.display = 'none';
          enButton.style.display = 'inline-block';
      } else if (language === 'en') {
          currentLanguage = 'en';
          htmlElement.lang = 'en';
          frButton.style.display = 'inline-block';
          enButton.style.display = 'none';
      }
  }

  // Par défaut, afficher le français et masquer l'anglais
  changeLanguage(currentLanguage);

  // Événements pour les boutons de langue
  frButton.addEventListener('click', () => changeLanguage('fr'));
  enButton.addEventListener('click', () => changeLanguage('en'));
});






/* MODE SOMBRE */

document.addEventListener("DOMContentLoaded", function() {
  const darkModeButton = document.getElementById('toggle-dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  const body = document.body;
  const logoImage = document.getElementById('logo-image');  // Cibler l'image du logo

  // Vérifier si le mode sombre est déjà activé dans le localStorage
  if (localStorage.getItem('dark-mode') === 'enabled') {
      body.classList.add('dark-mode');
      modeIcon.classList.remove('fa-moon');
      modeIcon.classList.add('fa-sun');
      logoImage.src = 'images/logo-beige.png';  // Changer le logo pour le mode sombre
  }

  // Fonction pour activer/désactiver le mode sombre
  function toggleDarkMode() {
      if (body.classList.contains('dark-mode')) {
          body.classList.remove('dark-mode');
          modeIcon.classList.remove('fa-sun');
          modeIcon.classList.add('fa-moon');
          localStorage.setItem('dark-mode', 'disabled');
          logoImage.src = 'images/logo.png';  // Revenir au logo original en mode clair
      } else {
          body.classList.add('dark-mode');
          modeIcon.classList.remove('fa-moon');
          modeIcon.classList.add('fa-sun');
          localStorage.setItem('dark-mode', 'enabled');
          logoImage.src = 'images/logo-beige.png';  // Changer le logo pour le mode sombre
      }
  }

  // Ajouter un événement de clic au bouton
  darkModeButton.addEventListener('click', toggleDarkMode);
});




// LOADER

const loaderContainer = document.querySelector('.loader-container');

loaderContainer.addEventListener('animationend', () => {
    setTimeout(() => {
        loaderContainer.style.display = 'none'; 
    }, 500); 
});





// Sélectionne tous les éléments qui doivent s'animer (droite ou gauche)
const fadeInElements = document.querySelectorAll('.fade-in-right, .fade-in-left');

// Fonction pour observer les éléments
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Arrête d'observer l'élément après l'animation
        }
    });
}, {
    threshold: 0.2, // L'élément doit être à 20% visible pour déclencher l'animation
});

// Observe chaque élément sélectionné
fadeInElements.forEach(element => observer.observe(element));





// PARTICULES ACCUEIL

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.particles-container');
  const numParticles = 100; // Nombre de particules

  function getWindowSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  const { width, height } = getWindowSize();

  // Fonction pour générer une particule
  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Position aléatoire initiale
    const initialX = Math.random() * width;
    const initialY = Math.random() * height;

    // Mouvement aléatoire
    const moveX = (Math.random() - 0.5) * 200; 
    const moveY = (Math.random() - 0.5) * 200; 

    // Appliquer les styles de mouvement
    particle.style.left = `${initialX}px`;
    particle.style.top = `${initialY}px`;
    particle.style.setProperty('--move-x', `${moveX}px`);
    particle.style.setProperty('--move-y', `${moveY}px`);

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 3000); 
  }

  setInterval(createParticle, 200); 

  // Réajuster les tailles lorsque la fenêtre est redimensionnée
  window.addEventListener('resize', () => {
    const { width, height } = getWindowSize();
  });
});





// Fonction pour ajouter la classe 'active' à l'élément de navigation correspondant
function setActiveLink() {
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.side-nav .nav-icon');
  const offset = 80; // Décalage pour compenser un header fixe ou autre espacement

  let index = -1;
  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    // Vérifie si la section est dans la vue de l'utilisateur, en prenant en compte l'offset
    if (rect.top <= window.innerHeight / 2 + offset && rect.bottom >= window.innerHeight / 2 + offset) {
      index = i;
    }
  });

  links.forEach((link, i) => {
    if (i === index) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Gestion du clic sur les liens
document.querySelectorAll('.side-nav .nav-icon').forEach(link => {
  link.addEventListener('click', function(e) {
    // Empêche le comportement par défaut du lien
    e.preventDefault();

    // Scroll jusqu'à la section
    const targetId = this.getAttribute('href').substring(1);  // Récupère l'ID sans '#'
    const targetSection = document.getElementById(targetId);
    window.scrollTo({
      top: targetSection.offsetTop - 80, // Ajuste pour le décalage de l'offset
      behavior: 'smooth',
    });

    // Déclenche également le changement de classe 'active'
    setActiveLink();
  });
});

// Détection du scroll pour gérer la classe active
window.addEventListener('scroll', setActiveLink);

// Initialisation pour la page qui charge
setActiveLink();
