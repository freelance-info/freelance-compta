A faire :
- packaging electron : 
  - test linux
  - test mac 
- capture d'écran dans doc
recettes: 
 - bug ouverture app avec fichier existant : aucune ligne ne s'affiche (parfois => console.log() tabFilesChange pour voir si 1er fichier poussé vide)
 - indicateur modifs non sauvegardées
 - annuler dernière action
 - pouvoir référencer un fichier facture normé pour pré-remplir la date, le client et le n°.
 - pouvoir afficher la liste de toutes les factures référencées.
achats:
 - idem ledger avec ajout facture scanné
timesheet:
 - calendrier avec type presta et client

# Comptabilité pour Micro-Entreprise

Logiciel de comptabilité minimal pour être **conforme à la réglementation française** des micro-entreprises.
Idéal pour les développeur freelance qui souhaitent une base simple (**React.js**) à customiser.

# Quick start

## Windows

Télécharger et décompresser la version portable electron-builder/dist/compta.exe

## MacOS

Télécharger et décompresser le zip 

## Linux

Télécharger et décompresser [l'AppImage](https://docs.appimage.org/introduction/quickstart.html#ref-quickstart)

# Documentation utilisateur

## 1ère obligation légale : le _Livre des recettes_

Le fonctionnement reste très proche d'une feuille Excel avec :
- une aide à la saisie pour les clients / objets de prestation / mode de règlement
- une sélection de facture émises pour remplir automatiquement les lignes de compte

## 2ème obligation légale : le _Registre des achats_

Obligatoire uniquement pour les micro-entreprise de vente et de location.
Il fonctionne de la même façon que le livre des recettes et comporte une sélection de facture reçue.

## 3ème obligation légale : les _Factures émises et reçues_ 

Ce logiciel est fait pour fonctionner avec des factures émises de façon externes, par tout type de logiciel et notamment son cousin :
https://github.com/freelance-info/factures

Pour plus de souplesse, il se base sur un nommage des factures normé pour déduire la date, le client et le n° de facture.
Chaque ligne comptable lié à une facture conservera une référence vers le chemin du fichier.

## Sauvegarde des données

Les données sont stockées sous forme de fichiers CSV, afin que vous puissiez les exploiter facilement avec un autre logiciel.
Vous pouvez aussi les sauvegarder très facilement sur le support de votre choix (dropbox, clé usb, etc.).
Selon votre volume d'activité, c'est vous qui choisissez comment découper vos fichiers : 1 fichier par mois, 1 fichier par année, etc.


# Développement

## En local

1. Installer [les pré-requis Python pour node-gyp](https://github.com/nodejs/node-gyp#Installation).

Exemple pour Windows : depuis un terminal en admin 

```
npm install --global --production windows-build-tools
```

2. Installer les dépendances : `npm install`

3. `npm run start` : lance en parallèle le front React (pour le livereload) et la fenêtre Electron 

## Packaging

1. `npm run build:electron`: création des fichiers javascript de production

2. `npm dist:win-linux` et `npm dist:mac` : création des exécutable d'installation

## Philosophie

Logiciel minimaliste mais méta-données et modèle de documents extensibles à volonté.

Logiciel standalone développé en Javascript (**reactjs** + **electron**), compatible Windows, Linux et Mac.

Ce qu'il a de plus que tous les autres ? Il est bien documenté, fonctionne sur la stack la plus populaire, comporte peu de code et complètement transparent. Il est donc facile de monter à bord et je vous encourage à le forker si vous souhaitez le personnaliser. 

N'hésitez pas soumettre toute demande d'évolution, bug ou contribution! 

Pensez à lui mettre une petite étoile si cette initiative vous plaît!



