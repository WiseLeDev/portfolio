document.addEventListener('DOMContentLoaded', () => {
    // Le smooth scrolling pour la navigation peut être retiré car il n'y a plus de header avec nav links.
    // Cependant, si tu as d'autres liens d'ancrage ailleurs, tu peux le laisser.
    // Pour ce cas précis, on va le laisser car le bouton "Voir mes projets" du Hero utilise un lien d'ancrage.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { // Cible tous les liens d'ancrage
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
            const response = await fetch('projets.json'); // Assure-toi que le nom du fichier est correct
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
                if (project.githubLink) {
                    linksHtml += `<a href="${project.githubLink}" target="_blank" class="project-link">Voir sur GitHub</a>`;
                }
                // Si tu as un déploiement live, tu peux ajouter ceci :
                if (project.liveDemoLink) {
                    linksHtml += `<a href="${project.liveDemoLink}" target="_blank" class="project-link" style="margin-left: 10px;">Démo Live</a>`;
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