# What is MountyZilla ?

MountyZilla is a Firefox add-on providing extra features for
the on-line game [MountyHall](http://www.mountyhall.com/).
This game is avaliable in French only (actually, in Belgian only),
and the whole community around it is French speaking.
So sorry but the rest of this ReadMe file,
as well as every single file in this repo, will be in French.


# Notes à l'intention des développeurs

## Fonctionnement général de l'extension

MountyZilla est une __extension MountyHall__ qui est réalisé de façon à pourvoir
être utilisée via l'un des trois modes possibles : intégrée, via proxy injectant, via ViolentMonkey
(_voir plus loin_).

## Les extensions MountyHall

Il existe plusieurs façons d' utiliser une extension avec MountyHall.
Mountyzilla est compatible avec les trois méthodes suivantes :

### Extension intégrée

Cette méthode a été mise en place par l'équipe MH en juillet 2024.
Les explications et la documentation sont [disponibles ici](https://www.mountyhall.com/Forum/display_topic_threads.php?TopicID=184052).
Cette méthode est la méthode préférée. Il est possible que Mountyzilla perde la compatibilité avec les autres modes dans un avenir incertain.

### Injection par proxy

Les proxy [https://mh2.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php](https://mh2.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php)
et [https://mhp.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php](https://mhp.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php)
permettent de jouer à MountyHall des scripts paramétrables tout en injectant dans le code des pages WEB du jeu.
Le paramétrage des scripts à injecter est réalisé dans le jeu sous Options/Pack graphique.

Le paramétrage est stocké en Local Storage. Le deuxième lien active automatiquement le Poissotron, ce qui permet aux joueurs
qui ont fait le choix de vider automatiquement leur LoalStorage de jouer avec le Poissotron.

### ViolentMonkey

Montyzilla a été initialement conçu pour fonctionner sous [Greazemonkey](https://fr.wikipedia.org/wiki/Greasemonkey).
Lors du grosse évolution de Greasemonkey en 2016, il aurait été nécessaire de tout réécrire pour
continuer à utiliser Greasemonkey. Le choix a été de fondre l'ensemble des modules en un seul source (Tout_MZ)
et de continuer avec ViolentMonkey.

## Licence

MountyZilla est distribué sous Licence GNU GPLv2.
Si vous comptiez en tirer profit, la sortie est par là --> [].
