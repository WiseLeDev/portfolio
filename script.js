document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling pour les liens de navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- LOGIQUE POUR CHARGER ET AFFICHER LES PROJETS DEPUIS projects.json ---
    const projectGrid = document.querySelector('#projects .project-grid');

    async function loadAndDisplayProjects() {
        try {
            // Récupère les données du fichier projects.json
            const response = await fetch('projets.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const projects = await response.json(); // Parse le JSON

            projectGrid.innerHTML = ''; // Vide la grille actuelle avant d'ajouter les projets

            if (projects.length === 0) {
                projectGrid.innerHTML = '<p style="text-align: center; color: var(--medium-text); margin-top: 30px;">Aucun projet n\'a été ajouté pour le moment.</p>';
                return;
            }

            // Génère le HTML pour chaque projet
            projects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item'; // La classe CSS pour le style des projets

                // Crée la liste des technologies (tech stack)
                const techStackList = project.techStack.map(tech => `<li>${tech}</li>`).join('');

                // Gère les liens optionnels
                let linksHtml = '';

                // Condition pour le lien GitHub
                if (project.githubLink) {
                    linksHtml += `<a href="${project.githubLink}" target="_blank" class="project-link">Voir sur GitHub</a>`;
                } else {
                    linksHtml += `<span class="project-info-unavailable">GitHub: Pas encore disponible</span>`; // Nouveau span pour le texte
                }

                // Condition pour la démo live
                if (project.liveDemoLink) {
                    linksHtml += `<a href="${project.liveDemoLink}" target="_blank" class="project-link" style="margin-left: 10px;">Démo Live</a>`;
                } else {
                    // Optionnel: Si vous voulez aussi afficher "Pas dispo" pour la démo live
                    // linksHtml += `<span class="project-info-unavailable" style="margin-left: 10px;">Démo Live: Pas encore disponible</span>`;
                }

                // Condition pour la démonstration vidéo
                if (project.videoDemonstration && project.videoDemonstration !== "Pas de démonstration vidéo pour le moment") { // Vérifie si le champ existe ET n'est pas le texte par défaut
                    linksHtml += `<a href="${project.videoDemonstration}" target="_blank" class="project-link" style="margin-left: 10px;">Voir la vidéo</a>`;
                } else {
                    linksHtml += `<span class="project-info-unavailable" style="margin-left: 10px;">Vidéo: Pas de démonstration vidéo pour le moment</span>`; // Nouveau span pour le texte
                }


                projectItem.innerHTML = `
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <ul class="project-tech-stack">
                        ${techStackList}
                    </ul>
                    <div class="project-actions"> ${linksHtml}
                    </div>
                `;
                projectGrid.appendChild(projectItem);
            });

        } catch (error) {
            console.error('Erreur lors du chargement des projets:', error);
            projectGrid.innerHTML = '<p style="text-align: center; color: var(--red-danger); margin-top: 30px;">Impossible de charger les projets. Veuillez réessayer plus tard.</p>';
        }
    }

    // Appelle la fonction pour charger et afficher les projets au chargement de la page
    loadAndDisplayProjects();
});
