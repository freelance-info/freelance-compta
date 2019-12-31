A faire :
recettes:
- tri par défaut
- par défaut scroll bottom
- header footer fixes
- recherche
- total
- liste déroulante encaissement
- paramétrage TVA

# Comptabilité pour Micro-Entreprise

Logiciel de comptabilité et facturation minimal pour être **conforme à la réglementation française** des micro-entreprises.
Idéal pour les développeur freelance qui souhaitent une base simple (**React.js**) à customiser.

# Quick start

Télécharger et exécuter l'installeur : ...
Le logiciel est préchargé avec un exemple de facture et de client, à supprimer bien sûr.

# Documentation utilisateur

## 1ère obligation légale : le _Livre des recettes_

Le fonctionnement reste très proche d'une feuille Excel avec :
- une aide à la saisie pour les clients / objets de prestation / mode de règlement
- une sélection de facture émises pour remplir automatiquement les lignes de compte

## 2ème obligation légale : le _Registre des achats_

Obligatoire uniquement pour les micro-entreprise de vente et de location.
Il fonctionne de la même façon que le livre des recettes et comporte une sélection de facture reçue.

## 3ème obligation légale : les _Factures émises et reçues_ 

Le modèle contient toutes les mentions légales minimales.
Le formulaire propose une aide à la saisie pour la plupart des champs.
L'export se fait sous forme d'un template .docx (Word, OpenOffice), donc modifiable par vos soins.
Vous pouvez également joindre le scan d'une facture ou d'un ticket de caisse.

## Sauvegarde des données

Les données sont stockées sous forme de fichiers CSV, afin que vous puissiez les exploiter facilement avec un autre logiciel.
Vous pouvez aussi les sauvegarder très facilement sur le support de votre choix (dropbox, clé usb, etc.).
Selon votre volume d'activité, c'est vous qui choisissez comment découper vos fichiers : 1 fichier par mois, 1 fichier par année, etc.


# Développement
```
npm run start
npm run electron
```

## Philosophie

Logiciel minimaliste mais méta-données et modèle de documents extensibles à volonté.

Logiciel standalone développé en Javascript (**reactjs** + **electron**), compatible Windows, Linux et Mac.

Ce qu'il a de plus que tous les autres ? Il est bien documenté, fonctionne sur la stack la plus populaire, comporte peu de code et complètement transparent. Il est donc facile de monter à bord et je vous encourage à le forker si vous souhaitez le personnaliser. 

N'hésitez pas soumettre toute demande d'évolution, bug ou contribution! 

Pensez à lui mettre une petite étoile si cette initiative vous plaît!



