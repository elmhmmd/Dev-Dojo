
## Plateforme d'Apprentissage en Ligne (DevDojo)
📚 Aperçu du Projet

DevDojo est une plateforme web éducative permettant aux étudiants de suivre des parcours d'apprentissage structurés, appelés Roadmaps. Chaque Roadmap est composée de modules (nœuds) comprenant des quizzes et des projets. Les étudiants peuvent soumettre des projets, voter pour ceux de leurs pairs et suivre leur progression. Les Administrateurs créent et gèrent les contenus pédagogiques. Construite avec Laravel 12, la plateforme offre une expérience utilisateur fluide et sécurisée via une API RESTful.

Public Cible :

Étudiants : Accès aux feuilles de route et suivi de leur apprentissage.

Administrateurs : Gestion des feuilles de route, quizzes, projets et analyse des performances.

✨ Fonctionnalités Clés

Pour les Étudiants
📖 Catalogue des Roadmaps : Exploration des Roadmaps publiées, organisées par thématiques éducatives.

🎯 Accès direct aux contenus : Toutes les Roadmaps publiées sont accessibles sans inscription préalable.

📊 Suivi de la progression : Statistiques personnelles (quizzes réussis, projets complétés) et progression par Roadmap.

🔔 Notifications implicites : Suivi des soumissions de projets et des votes via l'interface.

📥 Soumission de projets : Envoi de liens URL (ex. GitHub) pour les projets.

🗳️ Vote pour les projets : Possibilité de voter pour les soumissions des autres étudiants (un vote par soumission, pas de vote pour soi).

🔍 Consultation des soumissions : Accès à toutes les soumissions pour un projet spécifique.

Pour Administrateurs
🛠️ Création et gestion des Roadmaps : Ajout, modification, publication ou suppression de Roadmaps et de leurs nœuds (modules).

📈 Statistiques d'engagement : Analyse du nombre d'étudiants, de Roadmaps publiées/non publiées et de la popularité des parcours.

✅ Gestion des contenus pédagogiques : Création de quizzes (10 questions, 4 options chacune), projets, objectifs d'apprentissage et ressources externes.



🛠️ Technologies Utilisées

Back-end :

PHP (Laravel 12) : Logique métier et API RESTful.

MySQL : Base de données relationnelle pour stocker les utilisateurs, feuilles de route, nœuds, quizzes, projets et soumissions.

Front-end : NextJS

Outils :

Serveur Apache : Hébergement de l'application.

phpMyAdmin : Gestion de la base de données.

Composer : Gestion des dépendances PHP.

JWT : Authentification sécurisée via tokens
