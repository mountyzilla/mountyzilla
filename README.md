# What is MountyZilla ?

MountyZilla is a Firefox add-on providing extra features for
the on-line game [MountyHall](http://www.mountyhall.com/).
This game is avaliable in French only (actually, in Belgian only),
and the whole community around it is French speaking.
So sorry but the rest of this ReadMe file,
as well as every single file in this repo, will be in French.


# Notes à l'intention des développeurs

## Fonctionnement général de l'extension

MountyZilla est constitué d'un __module interne__ (add-on Firefox),
ainsi que d'une série de __scripts distants__.

Le __module interne__ doit être une simple base de travail,
qui doit être la plus fixe possible,
tout en contenant tout ce qui est nécessaire au bon fonctionnement
des scripts distants.

L'élément le plus susceptible de changer dans le module interne est
le __script maître__ : c'est lui qui décide,
en fonction de la page chargée dans le navigateur,
à quel script distant il doit confier le post-traitement de la page.

Les __scripts distants__ sont hébergés sur
un [serveur dédié](http://mountyzilla.tilk.info/),
et contiennent les actions à effectuer sur chaque page.
En général, chaque script n'est appelé que sur la page
pour laquelle il a été spécifiquement conçu.
(À quelques exceptions près : la bibliothèque de fonctions `libs_FF.js`
est par exemple appelée sur toutes les pages.)


## Participer au développement

Si vous souhaitez participer au développement, il suffit de suivre les étapes
décrites ci-dessous. Durant vos tests, pensez à vider votre cache
de temps en temps : que vos scripts soient locaux où en ligne,
votre navigateur rechignera à les mettre à jour si vous les sollicitez beaucoup.

### Si vous êtes un habitué de git / github :

Forkez ce repo et clonez-le sur votre machine.
Placez-vous sur la branche "dev".

Dans le répertoire de base du repo, vous trouverez un fichier
`script_principal_dev.js`. Éditez-le et indiquez comme variable `scriptsDev`
le répertoire où se trouve votre clone local.
(Laissez l'indication du sous-répertoire "scripts_online").

Dans les Préférences de l'add-on MountyZilla, changez le script principal
pour le `script_principal_dev.js` que vous venez d'éditer.

C'est terminé ! MountyZilla ira désormais lire vos scripts locaux au lieu
de ses scripts distants habituels.

Si vous ne souhaitez réaliser que de petits ajustements, vous pouvez travailler
directement sur la branche `dev` puis déposer un pull request.
Si au contraire vous souhaitez faire des modifications profondes,
ou développer des fonctionnalités inédites, travaillez plutôt dans une
sous-branche de feature de `dev`.

### Si vous voulez juste bidouiller du javascript :

Téléchargez
[l'archive](https://github.com/Mountyzilla/mountyzilla/archive/dev.zip)
de la version courante des scripts de développement, et décompressez-là.

Dans le répertoire général, vous trouverez un fichier
`script_principal_dev.js`. Éditez-le et indiquez comme variable `scriptsDev`
le répertoire où vous avez décompressé l'archive.
(Laissez l'indication du sous-répertoire "scripts_online").

Dans les Préférences de l'add-on MountyZilla, changez le script principal
pour le `script_principal_dev.js` que vous venez d'éditer. MountyZilla ira
désormais lire vos scripts locaux au lieu de ses scripts distants habituels.

Vous pouvez alors éditer les fichiers relatifs à chaque page, situés dans le
répertoire `scripts_online`. Une fois satisfait de votre travail,
contactez-moi IG pour que je puisse intégrer vos modifications au projet.

### Si vous souhaitez vous attaquer coeur de l'add-on :

Dans ce cas il est probable que vous soyez plus calé que moi sur la question.
N'hésitez pas à me contacter IG pour en disctuer.


## Quelques consignes avant de contribuer

Pour le moment, sont disponibles en ligne uniquement les scripts distants.
Voici quelques consignes que je tente de respecter lorsque je code.
Ce ne sont pas des règles absolues, mais tant qu'à faire
si on peut harmoniser la syntaxe, c'est pas plus mal...

1. _Soyez patient._
MountyZilla est un agglomérat de participations de codeurs d'origine et
de niveaux divers et variés.
Vous n'aurez donc pas affaire à un code suroptimisé écrit par
des professionnels du javascript.
Préparez-vous, vous n'êtes pas à l'abri de portions de code
perdurant depuis l'ère des dinosaures...
2. _Faites simple._
Ne cherchez pas à produire un code diaboliquement intelligent.
Il deviendra illisible et la moindre modification ultérieure
demandera de réécrire la totalité de votre contribution.
3. _Commentez._
Même si la notation `pdcdlcopf` est très claire pour vous
(portée-de-la-charge-dans-le-cas-où-il-n'y-a-pas-de-fatigue`),
dites-vous bien que ce ne sera pas le cas pour tout le monde.
Au besoin, créez une doc externe.
4. _Faites compact._
Pas de ligne de 200 caractères impossible à afficher et à décrypter.
Les règles de développement chez Mozilla sont :
 * des lignes de 80 caractères maximum,
 * avec des tabulations équivalant à 2 caractères.
Ce sont me semble-t-il des choix de limites raisonnables à se fixer.
5. _Codez en javascript._
Le langage Javascript, en particulier celui embarqué par les navigateurs,
fourmille d'un million de façons différentes d'effectuer une même action.
Si vous devez choisir entre diverses méthodes,
efforcez-vous de donner priorité à la syntaxe __javascript__.


## Licence

MountyZilla est distribué sous Licence GNU GPLv2.
Si vous comptiez en tirer profit, la sortie est par là --> [].
