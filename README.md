# Comptabilité pour Micro-Entreprise

Logiciel de comptabilité et facturation minimal pour être **conforme à la réglementation française** des micro-entreprises.

# Quick start

## Package
Télécharger et exécuter l'installeur : ...

## Développement
```
npm run start
npm run electron
```

# Philosophie

Logiciel minimaliste mais méta-données et modèle de documents extensibles à volonté.

Logiciel standalone développé en Javascript (**reactjs** + **electron**), compatible Windows, Linux et Mac.

Ce qu'il a de plus que tous les autres ? Il est bien documenté, fonctionne sur la stack la plus populaire, comporte peu de code et complètement transparent. Il est donc facile de monter à bord et je vous encourage à le forker si vous souhaitez le personnaliser. 

N'hésitez pas soumettre toute demande d'évolution, bug ou contribution! 

Pensez à lui mettre une petite étoile si cette initiative vous plaît!

# Livre des comptes

1ère obligation : tenir un livre des comptes. Rien de plus simple, le fonctionnement reste très proche d'une feuille Excel avec :
- une aide à la saisie pour les clients / objets de prestation
- une sélection de facture pour remplir automatiquement les lignes de compte

# Facturation

2ème obligation : facture contenant les mentions légales minimales.
Le formulaire propose une aide à la saisie pour la plupart des champs.
L'export se fait sous forme d'un template .docx (Word, OpenOffice), donc modifiable par vos soins.

# Sauvegarde des données

Les données sont stockées sous forme de fichiers JSON, afin que vous restiez maîtres de vos données.
Vous pouvez les sauvegarder dans votre dropbox ou sur une clé USB très facilement.


