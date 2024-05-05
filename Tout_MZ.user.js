// ==UserScript==
// @name        Tout_MZ
// @namespace   MH
// @description Client MountyZilla
// @include     */mountyhall/*
// @exclude     *trolls.ratibus.net*
// @exclude     *it.mh.raistlin.fr*
// @exclude     *mh2.mh.raistlin.fr*
// @exclude     *mhp.mh.raistlin.fr*
// @exclude     *mzdev.mh.raistlin.fr*
// @version     1.4.10.1
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setValue
// ==/UserScript==

// vérif UTF-8 ş

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

var MZ_latest = '1.4.10';
var MZ_changeLog = [
	"V1.4.10 \t\t 05/05/2024",
	"	- Compte à rebours aussi pour la DLA suivante",
	"V1.4.8 \t\t 02/05/2024",
	"	- remise en route de l'avertissement pour les DE et TP près d'un trou",
	"V1.4.7 \t\t 28/04/2024",
	"	- Possibilité d'afficher le compte à rebours dans le titre (voir dans les options)",
	"V1.4.4 \t\t 25/04/2024",
	"	- Affiche les infos MZ dans la page profil mobile",
	"V1.4.3 \t\t 14/04/2024",
	"	- Corrige l'affichage des trolls hors-vue",
	"	- Permet le scroll des options Mountyzilla en affichage vertical (et accel pour les kastars)",
	"	- N'essaie plus d'afficher les infos trolls en vue spécifique (monstre, trésors, etc.)",
	"	- Affiche directement les derniers changements sur la page de nouvelles",
	"V1.4.2 \t\t 10/04/2024",
	"	- Ajoute la possibilité d'afficher les rapports d'erreurs directement en jeu",
	"V1.4.1 \t\t 09/04/2024",
	"	- Affichage de version hors Greasemonkey",
	"	- Meilleur gestion des popup et diverses insertions en version smartphone",
	"V1.4.0 \t\t 05/04/2024",
	"	- Refonte générale du script tout MZ",
	"	- Meilleur support de MH en mode smartphone",
	"V1.3.1.41 \t 27/03/2024",
	"	- Meilleur affichage des trolls hors-vue (interface tactique)",
	"V1.3.1.40 \t 26/03/2024",
	"	- Affichage des fatigues optimales dans le profil",
	"V1.3.1.27 \t 07/12/2023",
	"	- Adaptation don de PX",
	"V1.3.1.24 \t 04/11/2023",
	"	- Fix effet armure de pierre",
	"V1.3.1.23 \t 21/10/2023",
	"	- Fix vue externe avec emoticone dans un nom de Gowap",
	"V1.3.1.20 \t 17/08/2023",
	"	- NOM_TROLL en LocalStorage",
	"V1.3.1.19 \t 13/08/2023",
	"	- NOM_TROLL en LocalStorage",
	"V1.3.1.18 \t 18/06/2023",
	"	- modif ID HTML titre2",
	"V1.3.1.17 \t 18/04/2023",
	"	- Fix le N de sortie de TP",
	"V1.3.1.16 \t 16/04/2023",
	"	- Ajustement modif MH",
	"V1.3.1.15 \t 28/03/2023",
	"	- Remise en route analyse résultat CdM",
	"V1.3.1.14 \t 26/03/2023",
	"	- Correction attaque Rotobaffe",
	"V1.3.1.11 \t 03/03/2023",
	"	- Préparation pour l'affichage des couleurs du pogo'",
	"V1.3.1.10 \t 06/02/2023",
	"	- Adaptation à un changement de présentation MH (recherche de compo en tanière)",
	"V1.3.1.9 \t 19/12/2022",
	"	- Ajout de l'affichage des compos sur l'équipement d'un suivant et traitement de la limitation à 100 réponses",
	"V1.3.1.7 \t 17/12/2022",
	"	- Ajout de l'affichage des compos en tanière à l'historique d'un compo",
	"V1.3.1.6 \t 28/11/2022",
	"	- Nouvelles caractéristiques de l'équipement",
	"V1.3.1.5 \t 16/11/2022",
	"	- Correction vue externe, troll manquant",
	"V1.3.1.4 \t 07/11/2022",
	"	- Correction appel Anatrolliseur si DLA nombre exact d'heures",
	"V1.3.1.3 \t 20/08/2022",
	"	- Pilotage externe de certaines options",
	"V1.3.1.2 \t 18/08/2022",
	"	- Enrichissement de la page des suivants",
	"V1.3.0.99 \t 23/07/2022",
	"	- Mémorise si on veut la vue SCIZ ou pas dans les Events",
	"V1.3.0.98 \t 28/06/2022",
	"	- Fix pb suite à changement de présentation de la vue",
	"V1.3.0.97 \t 18/06/2022",
	"	- Fix tableau de Fatigue et AM dans certains cas",
	"V1.3.0.96 \t 18/04/2022",
	"	- Ajout de la gestion des portails pour SCIZ",
	"V1.3.0.95 \t 16/04/2022",
	"	- Corrections du cas de soit-même dans la vue pour SCIZ",
	"V1.3.0.94 \t 22/03/2022",
	"	- Fix message quand la réserve de temps de tour est exactement 0",
	"V1.3.0.93 \t 20/02/2022",
	"	- Ajout guilde et mention 'HORS VUE' pour les trolls de la coterie SCIZ",
	"V1.3.0.92 \t 29/01/2022",
	"	- modif suite à changement MH sur les CdM",
	"V1.3.0.91 \t 16/01/2022",
	"	- Correction BM vue, PVMax en %",
	"V1.3.0.89 \t 05/01/2022",
	"	- Corrections variées pour SCIZ",
	"V1.3.0.88 \t 01/01/2022",
	"	- Fix cacher les gowaps au même niveau",
	"V1.3.0.87 \t 01/01/2022",
	"	- Adaptation aux modifs MH pages des suivants",
	"V1.3.0.86 \t 31/12/2021",
	"	- Corrections pour SCIZ",
	"V1.3.0.85 \t 31/12/2021",
	"	- Amélioration du support SCIZ (trolls cachés ou hors-vue)",
	"V1.3.0.84 \t 29/12/2021",
	"	- Corrections pour SCIZ",
	"V1.3.0.83 \t 29/12/2021",
	"	- Amélioration du support SCIZ (bestiaire, champignons et pièges)",
	"V1.3.0.82 \t 14/11/2021",
	"	- fix nom monstre marqué avec un nombre",
	"V1.3.0.81 \t 14/11/2021",
	"	- fix CdM sans date dans les messages du bot",
	"V1.3.0.80 \t 20/10/2021",
	"	- fix plantage à l'affichage du profil publique en cas de CSS avancé",
	"V1.3.0.79 \t 14/07/2021",
	"	- Correction effet venin GdS",
	"V1.3.0.78 \t 17/06/2021",
	"	- Correction affichage des trésors en vue externe",
	"V1.3.0.77 \t 23/04/2021",
	"	- Ajout d'une icône pour les monstres qui volent (=lévitent)",
	"V1.3.0.76 \t 23/03/2021",
	"	- Correction pour SCIZ (surcharge des événements)",
	"V1.3.0.75 \t 11/03/2021",
	"	- Masquer en vue externe les monstres masqués dans la vue",
	"V1.3.0.74 \t 18/01/2021",
	"	- Support ancien Firefox",
	"V1.3.0.73 \t 15/01/2021",
	"	- Adaptation à Dist H/V MH",
	"V1.3.0.72 \t 11/01/2021",
	"	- Correction de la vue des trolls avec SCIZ",
	"V1.3.0.71 \t 11/01/2021",
	"	- Amélioration du support SCIZ (Vue trolls)",
	"V1.3.0.70 \t 08/01/2021",
	"	- adaptation vue externe dist H/V",
	"V1.3.0.69 \t 25/12/2020",
	"	- Fix (tentative) message d'erreur sur armM_phy dans la vue",
	"V1.3.0.68 \t 10/12/2020",
	"	- Limitation vue externe",
	"V1.3.0.66 \t 07/12/2020",
	"	- Options en mode smartphone",
	"V1.3.0.65 \t 30/11/2020",
	"	- Fix mémorisation des missions (donc cibles plus affichées) + fix filtre en mode smartphone",
	"V1.3.0.63 \t 20/11/2020",
	"	- Ajout du calcul de la marge de temps de tour dans le profil (nommé marge ou augmentation)",
	"V1.3.0.60 \t 16/11/2020",
	"	- Vue externe en mode smartphone",
	"V1.3.0.59 \t 08/11/2020",
	"	- Adaptation page Bonus-Malus",
	"V1.3.0.58 \t 01/11/2020",
	"	- Remplacement CONST par VAR dans SCIZ",
	"V1.3.0.57 \t 30/10/2020",
	"	- Fix mouches présentes",
	"V1.3.0.56 \t 08/10/2020",
	"	- Retour de la carte des suivants",
	"V1.3.0.55 \t 05/09/2020",
	"	- Ajout compte à rebours de DLA",
	"V1.3.0.54 \t 28/08/2020",
	"	- Supprime le déplacement de la page de vue au survol de la souris du titre \"INFORMATIONS\"",
	"V1.3.0.53 \t 20/07/2020",
	"	- Correction de la vue smartphone",
	"V1.3.0.51 \t 23/06/2020",
	"	- Correction de la vue",
	"V1.3.0.47 \t 23/06/2020",
	"	- Correction blessure",
	"V1.3.0.46 \t 23/06/2020",
	"	- Adaptation réserve de temps",
	"V1.3.0.45 \t 17/06/2020",
	"	- Pas de reset (erroné ?) fatigue en affichage profil",
	"V1.3.0.44 \t 13/06/2020",
	"	- Remplacement CONST par VAR à cause de IOS (bug ?)",	// voir https://stackoverflow.com/questions/37228892/why-is-my-javascript-not-working-correctly-in-strict-mode-on-safari
	"V1.3.0.43 \t 11/06/2020",
	"	- Affichage callstack en erreur profil",
	"V1.3.0.42 \t 18/05/2020",
	"	- Amélioration du support SCIZ (Mise en option des fonctionnalités)",
	"V1.3.0.41 \t 15/05/2020",
	"	- Amélioration du support SCIZ (Vie des trolls de la coterie)",
	"V1.3.0.40 \t 13/05/2020",
	"	- Correction ARM dans le cas d'un grosse perte pour le tour",
	"V1.3.0.39 \t 08/05/2020",
	"	- Correction erreur sur le profil en mode smartphone",
	"V1.3.0.38 \t 25/04/2020",
	"	- Amélioration du support SCIZ (Gestion des trésors cachés)",
	"V1.3.0.37 \t 19/04/2020",
	"	- Suite travail sur l'envoi de CdM en mode smartphone",
	"V1.3.0.36 \t 20/04/2020",
	"	- Amélioration du support SCIZ (Icônes pour les événements !)",
	"V1.3.0.35 \t 19/04/2020",
	"	- Ignorer l'absence de date/heure des CdM et gestion smartphone",
	"V1.3.0.33 \t 14/04/2020",
	"	- Correction fausse reconnaissance de CdM sur les autres compétences",
	"V1.3.0.32 \t 14/04/2020",
	"	- Adaptation page des ordres des suivant + [état et callback] pour les",
	"	  scripts tiers (voir doc sur le mot clef MZ_callback_init)",
	"V1.3.0.31 \t 22/03/2020",
	"	- Envoi des CdM à partir du message du Bot",
	"V1.3.0.30 \t 22/03/2020",
	"	- Amélioration du support SCIZ (Trésors dans la vue !)",
	"V1.3.0.29 \t 14/03/2020",
	"	- Fix calcul PV après blessure en cas de maxPV inconnu",
	"V1.3.0.28 \t 13/03/2020",
	"	- Fix la détection incohérence CdM et affichage en rouge",
	"V1.3.0.27 \t 20/02/2020",
	"	- Ajout de la probabilité de toucher avec Lancer de Potion dans la Vue",
	"V1.3.0.26 \t 08/02/2020",
	"	- Lisibilité CdM en mode smartphone",
	"V1.3.0.25 \t 07/02/2020",
	"	- Adaptation basique au profil modifié",
	"V1.3.0.23 \t 30/01/2020",
	"	- Correction affichage filtre monstre",
	"V1.3.0.22 \t 23/01/2020",
	"	- Re-adaptation re-modif MH (affichage des durées négatives)",
	"V1.3.0.21 \t 21/01/2020",
	"	- Adaptation à une modif MH dans la page des suivants",
	"V1.3.0.20 \t 21/01/2020",
	"	- Adaptation modif MH (affichage des durées négatives)",
	"V1.3.0.19 \t 19/01/2020",
	"	- Centralisation des éléments tactiques",
	"V1.3.0.18 \t 19/01/2020",
	"	- Correctif pour les icônes d'action à distance dans la vue",
	"V1.3.0.17 \t 16/01/2020",
	"	- Correctif pour le recall du filtre des Monstres",
	"V1.3.0.16 \t 10/01/2020",
	"	- Amélioration du support SCIZ (Fix sur le prettyprint)",
	"V1.3.0.15 \t 10/01/2020",
	"	- Amélioration du support SCIZ (Fix sur les événements de zone)",
	"V1.3.0.14 \t 06/01/2020",
	"	- Correction filtre par famille pour les monstres variables et sans cdm",
	"V1.3.0.13 \t 06/01/2020",
	"	- Ajout du filtre sur la famille des monstres",
	"V1.3.0.12 \t 28/12/2019",
	"	- Fixed bug fix pour SCIZ (JWT)",
	"V1.3.0.11 \t 28/12/2019",
	"	- Bug fix pour SCIZ (JWT)",
	"V1.3.0.10 \t 22/12/2019",
	"	- Corrections mineures pour SCIZ",
	"V1.3.0.9 \t 19/12/2019",
	"	- Amélioration du support SCIZ (Fixes + AdvancedCSS + SwitchEvent)",
	"V1.3.0.8 \t 16/12/2019",
	"	- Amélioration du support SCIZ (Fixes + Play_evenement + PJView_Events)",
	"V1.3.0.7 \t 12/12/2019",
	"	- correction cibles des missions 'famille', 'pouvoir' et cas particulier de 'race'",
	"V1.3.0.6 \t 11/12/2019",
	"	- suppression infobulle sur l'intervalle de confiance s'il n'y en a pas,",
	"	  correction affiche de l'heure dernière CdM, plus de debug en profil de monstre",
	"V1.3.0.5 \t 11/12/2019",
	"	- Première interconnexion avec SCIZ (Options + MonsterView)",
	"V1.3.0.4 \t 29/11/2019",
	"	- Ajout des déciles",
	"V1.3.0.3 \t 29/11/2019",
	"	- Affichage d'une icône pour les Phœnix dont la génération est connue",
	"V1.3.0.2 \t 24/11/2019",
	"	- Réduction taille info CdM",
	"V1.3.0.1 \t 22/11/2019",
	"	- Ajustements sur les infos tactiques",
	"V1.3.0 \t\t 15/11/2019",
	"	- Refonte calculs tactiques de la vue - beta",
	"V1.2.20.6 \t 09/11/2019",
	"	- Correction de la formule d'AdD dans le profil",
	"V1.2.20.5 \t 16/10/2019",
	"	- Mutualisation analyse ordres suivants MZ_analyse_page_ordre_suivant",
	"V1.2.20.4 \t 03/10/2019",
	"	- Adaptation modif MH de la page des suivants",
	"V1.2.20.3 \t 02/09/2019",
	"	- Compétence golem vers l'anatroliseur",
	"V1.2.20.2 \t 25/05/2019",
	"	- Gestion des Parasitus pour les missions",
	"V1.2.20.1 \t 25/05/2019",
	"	- Correction de la cible en cas de mission demandant un kill de Crasc + message d'alerte en cas de fumeux",
	"V1.2.20.0 \t 25/05/2019",
	"	- Adaptation aux modifications des CdM par MH",
	"V1.2.19.2 \t 16/04/2019",
	"	- Correction majuscules dans les talents",
	"V1.2.19.1 \t 14/04/2019",
	"	- Prise en compte des nouvelles AdX dans profil2",
	"V1.2.18.15 \t 29/03/2019",
	"	- Correction simple quote dans toutes les missions",
	"V1.2.18.14 \t 09/03/2019",
	"	- Correction affichage vues 2D externes suite à une modif MH",
	"V1.2.18.13 \t 27/02/2019",
	"	- Correction simple quote dans les familles de monstre des missions",
	"V1.2.18.12 \t 23/12/2018",
	"	- Message si \"Menu d'actions contextuelles\" est décoché",
	"V1.2.18.11 \t 21/11/2018",
	"	- Correction it bricol'troll, login avec accent",
	"V1.2.18.10 \t 08/08/2018",
	"	- Correction boulette sDiplo",
	"V1.2.18.09 \t 04/08/2018",
	"	- Protection contre diplomatie mal initialisée",
	"V1.2.18.08 \t 11/07/2018",
	"	- Correction pour fonctionnement hors GM",
	"V1.2.18.07 \t 18/05/2018",
	"	- prise en compte bonus magique d'esquive dans le profil, correction",
	"	  gestion de la souris dans la page d'équipement [Dabihul, welcome back]",
	"V1.2.18.06 \t 28/01/2018",
	"	- Protection malus Crasc sans durée",
	"V1.2.18.05 \t 18/11/2017",
	"	- Désactivation MZ V2 en mode dev pour les tests d'adaptation violentmonkey",
	"V1.2.18.04 \t 04/09/2017",
	"	- retour version 1.2.18.02 avec GM 3.17",
	"V1.2.18.03 \t 01/09/2017",
	"	- Désactivation de GM_setValue/getValue à cause d'une lenteur sur GM 3.16",
	"V1.2.18.02 \t 26/08/2017",
	"	- correction boulette sur le compos d'enchantement",
	"V1.2.18.01 \t 25/08/2017",
	"	- Suppression des messages sur les certificats en https",
	"	- Protection contre des erreurs dans le stockage des compos d'enchantement",
	"V1.2.17.19 \t 23/08/2017",
	"	- Possibilité de plusieurs IT Bricol'Troll",
	"V1.2.17.18 \t 22/08/2017",
	"	- Adaptation compétence 'travail de la pierre' (dont anatrolliseur)",
	"	- Accélération de l'affichage des niveaux si plus de 500 monstres",
	"V1.2.17.17 \t 16/07/2017",
	"	- modification du mécanisme de filtrage pour contourner un pb",
	"V1.2.17.16 \t 16/07/2017",
	"	- Ajout de messages de debug sur les retours AJAX",
	"V1.2.17.15 \t 15/07/2017",
	"	- modification du mécanisme de filtrage pour contourner un pb",
	"V1.2.17.14 \t 14/07/2017",
	"	- correction dans la gestion des étapes de mission",
	"V1.2.17.13 \t 12/07/2017",
	"	- Adaptation au déplacement des colonnes dans la vue des Trõlls",
	"V1.2.17.12 \t 16/06/2017",
	"	- Correction mauvais compte de PX quand on change de Trõll",
	"V1.2.17.11 \t 01/05/2017",
	"	- Travail sur le fonctionnement hors Greasemonkey",
	"V1.2.17.10 \t 30/04/2017",
	"	- Protection dans la récupération d'erreur",
	"V1.2.17.9 \t 30/04/2017",
	"	- Correction récupération d'erreur IT Bricol'Troll",
	"V1.2.17.8 \t 29/04/2017",
	"	- Correction Bonus/Malus cas +0\+10 (AE)",
	"	- Correction portée IdC",
	"	- Prise en compte du bonus de portée PM dans le calcul tactique",
	"V1.2.17.7 \t 26/04/2017",
	"	- Version compatible hors GreaseMonkey",
	"V1.2.17.6 \t 23/04/2017",
	"	- Correction gestion des missions en cas de réinstallation",
	"V1.2.17.5 \t 20/04/2017",
	"	- Correction de la récupération du niveau du Trõll pour le calcul des PX",
	"V1.2.17.4 \t 08/04/2017",
	"	- Affichage triangle camou/invi pour les Trõlls de l'IT vus (sous VlC)",
	"	- Adaptation de la diplomatie à une modification de la page MH",
	"V1.2.17.3 \t 04/04/2017",
	"	- Messages console en cas de cadre d'erreur",
	"	- Trolls de l'IT mais pas dans le vue en orange",
	"V1.2.17.2 \t 20/03/2017",
	"	- Correction des PV restants",
	"V1.2.17.1 \t 20/03/2017",
	"	- Blocage des PV restants en attendant résolution de bug",
	"V1.2.17 \t 19/03/2017",
	"	- Refonte de l'envoi des CdM",
	"	- Modification de l'analyse de la frame de gauche (suite modification MH)",
	"V1.2.16.4 \t 08/03/2017",
	"	- correction ID de troll en envoi de PX/MP",
	"V1.2.16.3 \t 27/02/2017",
	"	- correction bonus/malus FP",
	"V1.2.16.2 \t 24/02/2017",
	"	- corrige bug des cases à cocher qui n'étaient plus mémorisées",
	"V1.2.16.1 \t 21/02/2017",
	"	- corrige bug sur Fx 38.8 ESR",
	"V1.2.16 \t 21/02/2017",
	"	- double stockage GM + localStorage version Vapulabehemot en préparation du passage HTTPS",
	"	- possibilité de masquer les Gowaps Sauvages dans la vue",
	"	- calcul des caractéristiques du siphon des âmes",
	"V1.2.15.2 \t 02/02/2017",
	"	- adaptation décumul VlC (page des bonus/malus)",
	"V1.2.15.1 \t 29/01/2017",
	"	- carte sur la page de description du lieu TP",
	"V1.2.15 \t 25/01/2017",
	"	- mise en place des nouvelles cartes (suivants, TP)",
	"V1.2.14.3 \t 25/01/2017",
	"	- résumé dans l'export des données Trõlligion",
	"V1.2.14.2 \t 20/01/2017",
	"	- forcer filtrage après le chargement des niveaux des monstres dans la vue",
	"V1.2.14.1 \t 20/01/2017",
	"	- réécriture filtrage des monstres par niveau dans la vue",
	"	- Changelog dans la page des news MZ",
	"V1.2.14 \t 20/01/2017",
	"	- Ajout de l'export des données Trõlligion",
	"V1.2.13.7 \t 10/01/2017",
	"	- Exclusion Bricoll'troll dans l'entête GM",
	"V1.2.13.6 \t 08/01/2017",
	"	- Réécriture analyse des étapes de mission sur monstre de niveau...",
	"V1.2.13.5 \t 07/01/2017",
	"	- Correction bug qui se manisfestait sous LINUX",
	"V1.2.13.4 \t 07/01/2017",
	"	- Plus de traces en mode debug pour l'analyse des étapes de mission",
	"V1.2.13.3 \t 07/01/2017",
	"	- Correction erreur sur un commentaire qui bloquait la compilation javascript",
	"V1.2.13.2 \t 07/01/2017",
	"	- Correction missions, recherche troogle (familles et types de monstres)",
	"V1.2.13.1 \t 06/01/2017",
	"	- Suppression oldSchoolProfile qui n'existe plus",
	"	- Ajout du 'refresh' du cadre de gauche",
	"V1.2.13 \t 01/01/2017",
	"	- homogénéisation des messages d'erreur",
	"	- Ajout du lien Troogle sur les étapes de mission monstre",
	"V1.2.12.2 \t 30/12/2016",
	"	- retour en mode normal (http si jeu en http)",
	"V1.2.12.1 \t 27/12/2016",
	"	- Correction mode IP",
	"	- Version patch pour forcer https sur /mz.mh.raistlin.fr (http en panne)",
	"V1.2.12 \t 24/12/2016",
	"	- Nettoyage des URL",
	"	- Mode dev (Shift+Click sur le mot 'Crédits' dans Options/Pack Graphique) qui se branche sur le site de dev",
	"	- Interface bricoll'Troll en https",
	"	- Remise en marche des cartes des trajets des gowaps",
	"V1.2.11.5 à 7 20 \t 21/12/2016",
	"	- Trace et protection sur plantage remonté par Marsak (lié à la diplo dans la vue)",
	"V1.2.11.4 \t 19/12/2016",
	"	- Changement des couleurs de la barre de vie Interface Bricol'Troll",
	"V1.2.11.3 \t 19/12/2016",
	"	- Correction de la récupération des PI totaux (du coup la portée de TP était NaN)",
	"	- Interface Bricol'Troll : suppression Trõlls pas mis à jour depuis plus d'un mois et grisé ceux depuis plus de 7 jours",
	"V1.2.11.2 \t 18/12/2016",
	"	- Correction bug interface Bricoll'Troll, n n'était pas affiché pour les Potrolls au soleil",
	"V1.2.11.1 \t 17/12/2016",
	"	- Correction bug interface Bricoll'Troll, les potrolls n'étaient pas affichés s'il n'y en avait pas au moins un",
	"V1.2.11 \t 13/12/2016",
	"	- Passage sur BdD Raistlin \\o/",
	"V1.2.10.4 \t 12/12/2016",
	"	- Correction bug à la récupération d'une erreur interface Bricoll'Troll",
	"V1.2.10.3 \t 09/12/2016",
	"	- Adaptation à une modification du HTML MH (voir set2DViewSystem)",
	"V1.2.10.2 \t 09/12/2016",
	"	- positionnement des Trõlls camou/invi à la bonne position par rapport à la distance",
	"V1.2.10.1 \t 08/12/2016",
	"	- option pour affichage des Trõlls {invi/camou/hors vue} avec Bricol'Troll + peaufinage affichage",
	"V1.2.10 \t 07/12/2016",
	"	- correction décumul des bonus/malus",
	"	- affichage des Trõlls {invi/camou/hors vue} avec Bricol'Troll",
	"V1.2.9 \t\t 16/11/2016",
	"	- adaptation Firefox 50 (comportement différent sur échec Ajax https)",
	"V1.2.8 \t\t 10/11/2016",
	"	- gestion des messages d'erreur de l'interface avec l'IT bricol'Troll",
	"	- déplacement des images sur l'infra raistlin + meilleure gestion HTTPS",
	"V1.2.7 \t\t 07/11/2016",
	"	- remise en route de l'interface avec l'IT bricol'Troll",
	"V1.2.6 \t\t 19/10/2016",
	"	- affichage d'un message en cas de certificat raistlin non accepté pour la vue sous https",
	"	- stockage idguilde et nomguilde",
	"V1.2.5 \t\t 17/10/2016",
	"	- correction doublon do_cdm qui bloquait l'envoi des CdMs lors de la compétence",
	"	- remise en route de la gestion des options avec intégration md5 dans ce script",
	"V1.2.4 \t\t 14/10/2016",
	"	- utilisation du relai raistlin pour l'envoi des CdM",
	"V1.2.3",
	"	- suppression ancien profil",
	"	- nettoyage doublon sur getPortee",
	"	- adaptation portee TP basée sur les PI",
	"	- repository sur greasyfork.org (pour être en https et avoir la mise à jour automatique active par défaut)",
	"V1.2.2",
	"	- correction bug sur les 2 URL raistlin qui avaient été confondues",
	"V1.2.1",
	"	- include des URLs MH alternatives",
	"	- regroupement des URLs externes en tête de fichier pour pouvoir contempler l'horreur de la diversité de la chose",
	"	- Ajout d'un message d'alerte en cas de HTTPS sans avoir débloqué le contenu mixte",
	"V1.2",
	"	- toujours un gros paquet sale, passage sous Greasemonkey",
	"V1.1",
	"	- regroupement en un gros paquet sale",
];

/** ********************************************************
	À faire / propositions d'évolutions

	H2P 08/07/2020
*		dans la vue des minerais, ça devrait a priori afficher, sur base des formules de mountypedia, le nombre de carats de chaque pépite de minerai
	Bireli-Gravos 08/12/2018
		FAIT faire un warning si l'utilisateur a désactivé la case "Menu d'actions contextuelles" dans la fenêtre "limiter la vue"
	breizhou13 20/12/2016
		envoyer les données à l'IT (Bricol'Trolls) aussi
			(Roule') Ça me semble difficile vis à vis de Bricol'Troll. Un bouton pour demander le rafraichissement ?
		partage de l'identification des tresors au sol. Ca c'etait cool mais ca implique une BDD
		partage des CDM avec seulement son groupe. Perso je prefere le partage general
	Akkila le boeuf le 26-03-2017 à 15:56
		- bouton pour rafraîchir les infos des trolls de son groupe
	Roule'
		FAIT corriger la façon dont les cibles de mission sont stockées (JSON très grosse table)
		Réactiver les jubilaires
		À supprimer : traces marquées [MZd] (mises pour analyser pb Tcherno Bill)
		06/01/2017 toute la partie tabcompo ne fonctionne plus (sans doute suite à la modification de l'affichage des objets en tanière)
			- voir l'intérêt de refaire fonctionner
			- gestion des compos d'enchantement, EM (!), mois des champignons, autre (?)
		FAIT : ambiguité sur le nom de monstres de mission : Shai, Ombre, Geck'oo et Boujd'la
		Sans doute à corriger, la compétence Baroufle pour le lien vers l'anatroliseur
		Prévision des DLA de monstre
		FAIT Niveau des monstres à la méthode Roule'
	Raistlin
*		et si la popup des compétences s'affichait aussi au survol des raccourcis ?
		FAIT? pages des Bonus/malus, erreur sur l'effet total, tours suivants, attaque
		FAIT Les cibles de mission ont disparu dans la vue (remonté par Hera)
	80117 - Héra
*		Il semble que l'icône de LdP n'apparait que pour les Tom
		FAIT l'infobulle de sacrifice donne des info erronées maintenant (dues aux changement d'affichage des gains/bm de temps probablement). pour moi, ça me dit "vous ne pouvez pas compenser de blessures dues à un sacrifice" alors que clairement, je peux
		Ajout dans le vue d'un pseudo-lieu pour la caverne où le meneur d'un mission doit se rendre
		FAIT Pour la portée IdC, l'arrondi est par défaut et MZ le fait par excès (1 fois en horizontal + 1 fois en vertical)
		FAIT Possibilité de plusieurs systèmes Bricol'troll
		en 1.2.17.18 SyntaxError: expected expression, got end of script[En savoir plus] Tout_MZ.user.js:12731:6
	?
		FAIT Tenir compte de la distance pour le PM (calculatrice de combat)
	Alanae/Gnu/Pen-Hiss
*		l'infobulle du lancer de potion pourrait donner le % du jet de toucher en fonction de la distance
*		popup d'erreur js en mode smartphone sur un TP (pb trajet_canvas)
		Dans https://mhp.mh.raistlin.fr/mountyhall/View/View_closed.php, le lien pour se connecter à son troll est games.mountyhall.com Est-ce que ça peut être modifié par MZ ?
		a de temps en temps un popup "Error: Permission denied to access property Symbol:toPrimitive"
		est-ce que l'infobulle de charger pourrait calculer la portée pour les tours suivants en fonction de la diminution de fatigue (ce serait plus compliqué d'estimer quand on est blessé en fonction de la reg)
	Kali
		MASQUÉ "TyperError: InfoComposant[4] is undefined" à l'affichage de la vue
**********************************************************/

/** ********************************************************
Doc État et Callback pour l'utilisation par les scripts tiers
	MZ met à jour la propriété document.body.dataset.MZ_Etat
		1 à la fin de l'initialisation (tout le code MZ s'est déroulé mais il peut y avoir des appels AJAX en cours)
		2 (uniquement sur l'onglet de la vue) quand l'onglet a été mis à jour avec les niveaux, etc.
			ATTENTION, l'utilisateur peut demander un complément de CdM s'il voit plus de 500 monstres
	MZ appelle les callback définies dans les tableaux suivants, si ces tableaux existent
		document.body.MZ_Callback_init: fonctions que MZ appellera quand MZ aura fini sont initialisation
			ATTENTION, si MZ est chargé avant le script tiers, cette fonction ne sera jamais appelée. Le script tiers doit donc tester l'état document.body.dataset.MZ_Etat et faire l'appel à la callback lui-même si l'état est déjà défini, ce qui signifie que MZ est déjà initialisé.
		document.body.MZ_Callback_fin_vue: fonctions que MZ appellera quand MZ aura fini son premier traitement des CdM dans la vue
		ATTENTION document.body.MZ_Callback_init et document.body.MZ_Callback_fin_vue sont des tableaux.
			Vous n'êtes pas seuls au monde. Un autre script externe peut s'être déjà enregistré en callback
			Voici un exemple de code pour enregistrer une callback
			if (document.body.MZ_Callback_init === undefined) {
				document.body.MZ_Callback_init = [myCallback];
			} else {
				document.body.MZ_Callback_init.push(myCallback);
			}
**********************************************************/

/** x~x Logging/debugging MZ ------------------------------------------- */
var MY_DEBUG = false, MY_LOG = true;

function printMZ(print, check, obj, exc = undefined) {
	// Wrapper logging MZ avec injection d'exception pour les devs.
	// Utiliser : logMZ(..), warnMZ(..), debugMZ(..), avertissement(..)
	if (!check) {
		return;
	}
	let msg = typeof obj === "object" ? JSON.stringify(obj) : obj;
	let lv = GM_info && GM_info.script && GM_info.script.version ? `|${GM_info.script.version}` : '';
	if (exc) {
		// Source l'exception directement dans le logger.
		// Les navigateurs modernes injectent directement
		// une stacktrace interactive (support large cf MDN) :
		// https://developer.mozilla.org/fr/docs/Web/API/console/error_static
		print(`[MZ${lv}] ${msg}\n---\n`, exc);
		return;
	}
	print(`[MZ${lv}] ${msg}`);
}

function logMZ(obj, exc = undefined) {
	if (exc) {
		// Comme logMZ est le logger "par défaut"
		// -> upgrade en _error_ si exception présente.
		printMZ(window.console.error, MY_LOG, obj, exc);
		return;
	}
	printMZ(window.console.info, MY_LOG, obj);
}

function warnMZ(obj, exc = undefined) {
	printMZ(window.console.warn, MY_LOG, obj, exc);
}

function debugMZ(obj, exc = undefined) {
	if (exc) {
		// Comme debugMZ est le debugger "par défaut"
		// -> upgrade en _trace_ si exception présente.
		printMZ(window.console.trace, MY_DEBUG, obj, exc);
		return;
	}
	printMZ(window.console.log, MY_DEBUG, obj);
	// printMZ(window.console.debug, MY_DEBUG, obj);
}

// WARNING (gath) - non utilisé (refonte logging) -> commenté
// function traceStack(e, sModule) {
// 	let version = '';
// 	if (GM_info && GM_info.script && GM_info.script.version) {
// 		version = `${GM_info.script.version}`;
// 	}
// 	let sRet = `[MZ_TRACE|${version}]`;
// 	if (sModule) {
// 		sRet = `${sRet} \{${sModule}\}`;
// 	}
// 	try {
// 		if (e.message) {
// 			sRet = `${sRet} ${e.message}`;
// 		}
// 	} catch (e2) {
// 		sRet = `${sRet} <exception acces message>`; // + e2.message;
// 	}
// 	try {
// 		if (e.stack) {
// 			let sStack = e.stack;
// 			// enlever les infos confidentielles
// 			sRet = `${sRet}\n${sStack.replace(/file\:\/\/.*gm_scripts/ig, '...')}`;
// 		}
// 	} catch (e2) {
// 		sRet = `${sRet} <exception acces stack>`; // + e2.message;
// 	}
// 	return sRet;
// }

/** ********************************************************
**** Début de zone à déplacer dans une bibli commune ******
**********************************************************/

// URL de base serveur MZ
var URL_MZ = 'http://mz.mh.raistlin.fr/mz';
// pour passer en mode IP, commenter la ligne précédente et décommenter la suivante
// let URL_MZ = 'http://192.99.225.92/mz';

// URLs externes images (pas de souci CORS mais pas de HTTPS)
// On dirait qu'il n'y en a plus...

// URLs externes redirection (pas de souci CORS)
var URL_pageNiv = 'http://mountypedia.ratibus.net/mz/niveau_monstre_combat.php';
var URL_AnatrolDispas = 'http://mountyhall.dispas.net/dynamic/';
var URL_vue_CCM = 'http://clancentremonde.free.fr/Vue2/RecupVue.php';
var URL_vue_Gloumfs2D = 'http://gloumf.free.fr/vue2d.php';
var URL_vue_Gloumfs3D = 'http://gloumf.free.fr/vue3d.php';
var URL_vue_Grouky = 'http://mh.ythogtha.org/grouky.py/grouky';
var URL_vue_cube = 'vueCube/vueCube.html';
var URL_troc_mh = 'http://troc.mountyhall.com/search.php';
var URL_cyclotrolls = 'http://www.cyclotrolls.be/';
var URL_troogle = 'http://troogle.iktomi.eu/entities/';

// URLs de test HTTPS
var URL_CertifRaistlin1 = `${URL_MZ.replace(/http:\/\//, 'https://')}/img/1.gif`;	// s'adapte si mode IP
var URL_CertifRaistlin2 = 'https://it.mh.raistlin.fr/vilya/mz_json.php';

// ceux-ci rendent bien les 2 entêtes CORS (mais pas de HTTPS)
var URL_bricol = 'http://trolls.ratibus.net/';	// recupération des infos des trolls dans l'IT bricol'troll
var URL_bricol_https = 'https://it.mh.raistlin.fr/';	// IT bricol'troll en https via relai Raistlin

/** x~x	marque pour s'y retrouver sous l'éditeur (longueur: 80 chars) -- */
/** x~x Libs ----------------------------------------------------------- */

/* ancien TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

// Roule 04/09/2016 switch extern URLs to https if available
var isHTTPS = false;
if (window.location.protocol.indexOf('https') === 0) {
	URL_MZ = URL_MZ.replace(/http:\/\//, 'https://');
	URL_bricol = URL_bricol_https;
	isHTTPS = true;
}

// Roule 23/12/2016 mode dev
var isDEV = false;
if (window.localStorage.getItem('MZ_dev') ||
	window.location.href.indexOf('rouletabille.mh.free.fr') > 0 ||
	window.location.href.indexOf('mzdev.mh') >= 0) {
	URL_MZ = URL_MZ.replace(/$/, 'dev');
	isDEV = true;
}

// Images (pas de souci CORS)
var URL_MZimg = `${URL_MZ}/img/`;
// URLs externes ajax (CORS OK)
var URL_MZinfoMonstre = `${URL_MZ}/monstres_0.9_FF.php`;
var URL_MZgetCaracMonstre = `${URL_MZ}/getCaracMonstre.php`;
var URL_pageDispatcherV2 = `${URL_MZ}/cdmdispatcherV2.php`;

// liens externes déduits
var URL_bricol_mountyhall = `${URL_bricol}mountyhall/`;
var MHicons = '/mountyhall/Images/Icones/';

/** x~x Compatibilité Greasemonkey/ViolentMonkey ----------------------- */
try {	// à partir du 11/07/2018, (GM_getValue === undefined) provoque une exception
	GM_getValue === undefined;
	logMZ('Fonctionnement dans Greasemonkey');
} catch (exc) {
	GM_getValue = function (key) { };
	GM_setValue = function (key, val) { };
	GM_deleteValue = function (key) { };
	GM_info = { script: { version: MZ_latest } };	// GM_info.script.version
	logMZ('Fonctionnement hors Greasemonkey');
}

/* Utilisation de la gestion de l'enregistrement des données de
GreaseMonkey, avec partage entre scripts via le localStorage, par
Vapulabehemot (82169) 07/02/2017 */
// Correction Roule' pour les boolean, le JSON decode pose problème car MZ utilise JSON
// Nécessite la présence de @grant GM_getValue, @grant GM_deleteValue et @grant GM_setValue
function MY_getValue(key) {
	let v = window.localStorage.getItem(key);
	let vGM = GM_getValue(key);
	if (vGM == null || v != null && v != vGM) {
		GM_setValue(key, v);
	} else if (v == null && vGM != null) {
		v = vGM;
		window.localStorage[key] = vGM;
	}
	return v;
}
function MY_removeValue(key) {
	GM_deleteValue(key);
	window.localStorage.removeItem(key);
}
function MY_setValue(key, val) {
	// conversion des booléens en 0 ou 1 à cause du localStorage infoutu de gérer les booléens
	if (val === true) {
		val = 1;
	} else if (val === false) {
		val = 0;
	}
	try {
		GM_setValue(key, val);
	} catch (exc) {
		logMZ(`MY_setValue echec GM_setValue(${key}, ${val})`, exc);
	}
	try {
		window.localStorage[key] = val;
	} catch (exc) {
		logMZ(`MY_setValue echec localStorage[${key}] = ${val}]`, exc);
	}
}
function MZ_setOrRemoveValue(key, val) {
	if (val === true) {
		val = 'true';
	} else if (val === false || val === undefined || val === '') {
		val = null;
	}
	if (val === null) {
		MY_removeValue(key);
	} else {
		MY_setValue(key, val);
	}
}
function MZ_getValueBoolean(key) {
	let val = MY_getValue(key);
	if (val == 'true' || val == 1) {
		return true;
	}
	return false;
}

/** x~x Variables globales utiles -------------------------------------- */
// utilisé pour accès bdd (un peu partout) :
var numTroll = MY_getValue('NUM_TROLL');
// utilisé dans vue pour PX :
// Roule 16/06/2017 on ne peut pas prendre le dernier niveau vu ! on a peut-être changé de Troll
var nivTroll; // = MY_getValue('NIV_TROLL');
// Roule 20/04/2017 le niveau n'est plus dans la frame de gauche, on récupère dans <numtroll>.niveau
if (nivTroll == undefined) {
	nivTroll = MY_getValue(`${numTroll}.niveau`);
}
// utilisés dans actions et vue (calculs SR) :
var mmTroll = MY_getValue(`${numTroll}.caracs.mm`);
var rmTroll = MY_getValue(`${numTroll}.caracs.rm`);
var currentURL = window.location.href;

/** x~x Durée script --------------------------------------------------- */
var date_debut = null;
var jour_en_ms = 864e5;

function start_script(nbJours_exp, texte) {
	debugMZ(`Script ${texte} début sur ${window.location.pathname}`);
	if (date_debut) {
		return;
	}
	date_debut = new Date();
	// Créé la variable expdate si demandé
	if (!nbJours_exp) {
		return;
	}
	let expdate = new Date();
	expdate.setTime(expdate.getTime() + nbJours_exp * jour_en_ms);
}

function displayScriptTime(duree, texte) {
	debugMZ(`Script ${texte} fin sur ${window.location.pathname}`);
	let footerNode = getFooter();
	if (!footerNode) {
		return;
	}
	let node;
	try {
		node = document.evaluate(".//text()[contains(.,'Page générée en')]/../br", footerNode, null, 9, null).singleNodeValue;
	} catch (e) {
		return;
	}
	if (!node) {
		return;
	}
	if (duree) {
		insertText(node, ` - [${texte} en ${duree / 1000} sec.]`);
		return;
	}
	insertText(node, ` - [Script MZ exécuté en ${(new Date().getTime() - date_debut.getTime()) / 1000} sec.]`);
}

/** x~x Communication serveurs ----------------------------------------- */
function FF_XMLHttpRequest(MY_XHR_Ob) {
	let request = new XMLHttpRequest();
	request.open(MY_XHR_Ob.method, MY_XHR_Ob.url);
	for (let head in MY_XHR_Ob.headers) {
		request.setRequestHeader(head, MY_XHR_Ob.headers[head]);
	}
	request.onreadystatechange = function () {
		if (request.readyState != 4) {
			return;
		}
		if (request.error) {
			if (MY_XHR_Ob.onerror) {
				MY_XHR_Ob.onerror(request);
			}
			return;
		}
		if (request.status == 0) {
			if (isDEV) {
				let grandCadre = createOrGetGrandCadre();
				let sousCadre = document.createElement('div');
				sousCadre.innerHTML = 'AJAX status = 0, voir console';
				sousCadre.style.width = 'auto';
				sousCadre.style.fontSize = 'large';
				sousCadre.style.border = 'solid 1px black';
				grandCadre.appendChild(sousCadre);
			}
			if (MY_XHR_Ob.onerror) {
				MY_XHR_Ob.onerror(request);
			}
			// showHttpsErrorContenuMixte();
			return;
		}
		if (MY_XHR_Ob.onload) {
			if (MY_XHR_Ob.trace) {
				logMZ(`XMLHttp.onload ${MZ_formatDateMS()} début traitement retour AJAX ${MY_XHR_Ob.trace}`);
			}

			/* DEBUG: Ajouter à request les pptés de MY_XHR_Ob à transmettre */
			MY_XHR_Ob.onload(request);
			if (MY_XHR_Ob.trace) {
				logMZ(`XMLHttp.onload ${MZ_formatDateMS()} fin traitement retour AJAX ${MY_XHR_Ob.trace}`);
			}
		}
	};
	if (MY_XHR_Ob.HTML) {
		request.responseType = 'document';
	}
	request.send(MY_XHR_Ob.data);
}

// rend une chaine affichant date et heure et milliseconds (maintenant si le paramètre est absent)
function MZ_formatDateMS(d = new Date(), avec_ms = true) {
	let date_fmt = d.toLocaleString('fr-FR');
	if (avec_ms) {
		date_fmt = `${date_fmt}.${d.getMilliseconds()}`;
	}
	return date_fmt;
}

/** x~x Interface utilisateur ------------------------------------------ */
function isDesktopView() {
	return document.getElementsByClassName('ui-mobile').length == 0;
}

function replaceLinkMHtoMZ() {
	let aList = document.getElementsByTagName('a');
	for(let i = 0; i < aList.length; i++) {
		if (aList[i].href.includes('games.mountyhall')) {
			aList[i].href = 'https://mhp.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php';
			return;
		} else if (aList[i].href.includes('smartphone.mountyhall')) {
			aList[i].href = 'https://szp.mh.raistlin.fr/mountyhall/MH_Play/PlayStart2.php';
			return;
		}
	}
}

// http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
	let textArea = document.createElement('textarea');

	//
	// *** This styling is an extra step which is likely not required. ***
	//
	// Why is it here? To ensure:
	// 1. the element is able to have focus and selection.
	// 2. if element was to flash render it has minimal visual impact.
	// 3. less flakyness with selection and copying which **might** occur if
	//    the textarea element is not visible.
	//
	// The likelihood is the element won't even render, not even a flash,
	// so some of these are just precautions. However in IE the element
	// is visible whilst the popup box asking the user for permission for
	// the web page to copy to the clipboard.
	//

	// Place in top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';

	// Avoid flash of white box if rendered for any reason.
	textArea.style.background = 'transparent';

	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();

	let successful = document.execCommand('copy');
	document.body.removeChild(textArea);
	return successful;
}

function avertissement(txt, duree, bBloque, exc = undefined) {
	let d = duree ? ` pour (${duree} ms)` : '';
	let print_stack = MY_getValue('PRINTSTACK') == 'true';
	let excDetails = (exc && !print_stack) ? ' - Plus de détails en console (F12)' : '';
	logMZ(`Avertissement: ${txt}${d}`, exc);
	if (!duree) {
		duree = 15000;
	}
	let div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	let num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name', 'avertissement');
	div.className = 'mh_textbox ui-content';
	div.style.position = 'fixed';
	div.style.top = `${10 + 45 * num}px`;
	div.style.left = `${10 + 0 * num}px`;
	div.style.border = '4px solid red';
	div.style.borderRadius = '4px';
	div.style.backgroundColor = 'rgb(229, 222, 203)';
	div.style.zIndex = 2 + num;
	div.style.cursor = 'pointer';
	div.style.fontSize = 'large';
	div.innerHTML = `${txt}${excDetails}`;
	if (!bBloque) {
		div.onclick = function () {
			tueAvertissement(this.num);
		};
	}
	if (exc && print_stack) {
		let pre = document.createElement('pre');
		appendText(pre, `---\n${exc.message}\n${exc.stack}`);
		pre.style.whiteSpace = "pre-wrap";
		div.appendChild(pre);
	}

	// un croix en haut à droite pour signifier à l'utilisateur qu'il peut cliquer pour fermer ce popup
	let divcroix = document.createElement('div');
	divcroix.style.position = 'absolute';
	divcroix.style.top = 0;
	divcroix.style.right = 0;
	divcroix.style.color = 'black';
	divcroix.style.fontSize = 'inherit';
	divcroix.style.cursor = 'pointer';
	divcroix.style.zIndex = 2 + num;
	divcroix.innerHTML = 'X';
	div.appendChild(divcroix);

	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après "un certain temps"
	window.setTimeout(() => {
		tueAvertissement(num);
	}, duree);
}

function tueAvertissement(num) {
	let divs = document.getElementsByName('avertissement');
	for (let i = 0; i < divs.length; i++) {
		if (divs[i].num == num) {
			divs[i].parentNode.removeChild(divs[i]);
			return;
		}
	}
}

/** x~x Modifications du DOM ------------------------------------------- */
function getFooter() {
	// retourne le footer sur mobile ou non
	return document.getElementById('footer') || document.getElementById('footer1') || document.getElementById('footer2');
}

function insertBefore(node, child) {
	node.parentNode.insertBefore(child, node);
}

function appendTr(tbody, cls_name) {
	let tr = document.createElement('tr');
	if (cls_name) {
		tr.className = cls_name;
	}
	tbody.appendChild(tr);
	return tr;
}

function appendTrDetail(tr_node, th_txt, td_txt, pre = undefined) {
	let tr = document.createElement('tr');
	tr.className = 'detail';
	let th = document.createElement('th');
	appendText(th, th_txt);
	tr.appendChild(th);
	let td = document.createElement('td');
	if (pre) {
		let p = document.createElement('pre');
		appendText(p, td_txt);
		td.appendChild(p);
	} else {
		appendText(td, td_txt);
	}
	tr.appendChild(td);
	insertAfter(tr_node, tr);
	return tr;
}

function insertTr(node, cls_name) {
	let tr = document.createElement('tr');
	if (cls_name) {
		tr.className = cls_name;
	}
	insertBefore(node, tr);
	return tr;
}

function appendTd(tr) {
	let td = document.createElement('td');
	if (tr) {
		tr.appendChild(td);
	}
	return td;
}

function insertTd(node) {
	let td = document.createElement('td');
	insertBefore(node, td);
	return td;
}

function insertTh(node) {
	let th = document.createElement('th');
	insertBefore(node, th);
	return th;
}

// handle when eTd is the last (in this case eTd.nextSibling is null, which is fine for insertBefore)
function insertAfterTd(eTd) {
	let newTd = document.createElement('td');
	eTd.parentNode.insertBefore(newTd, eTd.nextSibling);
	return newTd;
}

function appendTdCenter(tr, colspan) {
	let td = appendTd(tr);
	td.align = 'center'; // WARNING - Obsolete
	if (colspan) {
		td.colSpan = colspan;
	}
	return td;
}

function insertTdElement(node, child) {
	let td = insertTd(node);
	if (child) {
		td.appendChild(child);
	}
	return td;
}

function appendA(node, href, cssClass, text) {
	let a = document.createElement('a');
	if (href) {
		a.href = href;
	}
	if (cssClass) {
		a.className = cssClass;
	}
	if (text) {
		a.appendChild(document.createTextNode(text));
	}
	node.appendChild(a);
	return a;
}

function appendText(node, text, bold, color = undefined) {
	let t = document.createTextNode(text);
	if (!bold) {
		node.appendChild(t);
		return t;
	}
	let b = document.createElement('b');
	if (color) {
		b.style.color = color;
	}
	b.appendChild(t);
	node.appendChild(b);
	return t;
}

function insertText(node, text, bold) {
	if (!bold) {
		insertBefore(node, document.createTextNode(text));
		return;
	}
	let b = document.createElement('span');
	appendText(b, text, bold);
	insertBefore(node, b);
	return b;
}

function insertTextDiv(node, text, bold) {
	let b = document.createElement('div');
	appendText(b, text);
	if (bold) b.style.fontWeight = 'bold';
	insertBefore(node, b);
	return b;
}

function appendTextDiv(node, text, bold) {
	let b = document.createElement('div');
	appendText(b, text);
	if (bold) b.style.fontWeight = 'bold';
	node.appendChild(b);
	return b;
}

function appendThText(tr, text, bold) {
	let th = document.createElement('th');
	if (tr) {
		tr.appendChild(th);
	}
	th.appendChild(document.createTextNode(text));
	if (bold) {
		th.style.fontWeight = 'bold';
	}
	return th;
}

function appendTdText(tr, text, bold) {
	let td = appendTd(tr);
	td.appendChild(document.createTextNode(text));
	if (bold) {
		td.style.fontWeight = 'bold';
	}
	return td;
}

function insertThText(node, text, bold) {
	let th = insertTh(node);
	appendText(th, text, bold);
	return th;
}

function insertTdText(node, text, bold) {
	let td = insertTd(node);
	appendText(td, text, bold);
	return td;
}

function appendHr(node) {
	node.appendChild(document.createElement('hr'));
}

function appendBr(node) {
	node.appendChild(document.createElement('br'));
}

function insertBr(node) {
	insertBefore(node, document.createElement('br'));
}

function appendLi(ul, text) {
	// uniquement utilisé dans les options (crédits)
	let li = document.createElement('li');
	appendText(li, text);
	ul.appendChild(li);
	return li;
}

function appendTextbox(node, type, name, size, maxlength, value, sId) {
	let input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = name;
	input.id = sId === undefined ? name : sId;
	input.size = size;
	input.maxLength = maxlength;
	if (value) {
		input.value = value;
	}
	node.appendChild(input);
	return input;
}

function appendTextboxBlock(node, type, name, text, size, maxlength, value, sId, bTextRight) {
	let label = document.createElement('label');
	label.style.display = 'inline-block';
	label.style.marginRight = '10px';
	if (!bTextRight) {
		label.appendChild(document.createTextNode(text));
	}
	let i = appendTextbox(label, type, name, size, maxlength, value, sId);
	i.style.marginRight = '5px';
	if (bTextRight) {
		label.appendChild(document.createTextNode(text));
	}
	node.appendChild(label);
	return label;
}

function appendCheckBox(node, name, checked, onClick) {
	let input = document.createElement('input');
	input.type = 'checkbox';
	input.name = name;
	input.id = name;
	if (checked) {
		input.checked = true;
	}
	if (onClick) {
		input.onclick = onClick;
	}
	node.appendChild(input);
	return input;
}

function appendCheckBoxBlock(node, name, text, checked, onClick) {
	let label = document.createElement('label');
	label.style.display = 'inline-block';
	label.style.marginRight = '10px';
	let input = document.createElement('input');
	input.type = 'checkbox';
	input.name = name;
	input.id = name;
	if (checked) {
		input.checked = true;
	}
	if (onClick) {
		input.onclick = onClick;
	}
	input.style.marginRight = '5px;';
	label.appendChild(input);
	label.appendChild(document.createTextNode(text));
	node.appendChild(label);
	return label;
}

function appendCheckBoxSpan(node, id, onClick, text) {
	let span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	appendCheckBox(span, id, false, onClick);
	let label = document.createElement('label');
	appendText(label, text);
	label.htmlFor = id;
	label.style.marginLeft = '-5px';
	span.appendChild(label);
	span.style.marginRight = '3px';
	node.appendChild(span);
	appendText(node, ' ');
	return span;
}

function appendOption(select, value, text) {
	let option = document.createElement('option');
	option.value = value;
	appendText(option, text);
	select.appendChild(option);
	return option;
}

function appendHidden(form, nam, value) {
	let input = document.createElement('input');
	input.type = 'hidden';
	input.name = nam;
	input.id = nam;
	input.value = value;
	form.appendChild(input);
}

function appendButton(node, value, onClick) {
	let input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function () {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		input.onclick = onClick;
	}
	node.appendChild(input);
	return input;
}

function insertButton(node, value, onClick) {
	let input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function () {
		this.style.cursor = 'pointer';
	};
	input.onclick = onClick;
	insertBefore(node, input);
	return input;
}

function appendSubmit(node, value, onClick) {
	let input = document.createElement('input');
	input.type = 'submit';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function () {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		input.onclick = onClick;
	}
	node.appendChild(input);
	return input;
}

function createImage(url, title, style) {
	let img = document.createElement('img');
	img.src = url;
	img.title = title;
	img.alt = `[${title}]`;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	if (style) {
		img.style = style;
	}
	return img;
}

function createAltImage(url, alt, title) {
	let img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	if (title) {
		img.title = title;
	}
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
}

function createImageSpan(url, alt, title, text, bold) {
	let span = document.createElement('span');
	span.title = title;
	let img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	span.appendChild(img);
	appendText(span, text, bold);
	return span;
}

// WARNING (gath) - non utilisé -> commenté
// function createCase(titre, table, width = 120) {
// 	let tr = appendTr(table, 'mh_tdpage');
// 	let td = appendTdText(tr, titre, true);
// 	td.className = 'mh_tdtitre';
// 	td.width = width;

// 	td = appendTdText(tr, '');
// 	td.className = 'mh_tdpage';
// 	return td;
// }

function getMyID(elt) {
	let parent = elt.parentNode;
	for (let i = 0; i < parent.childNodes.length; i++) {
		if (elt == parent.childNodes[i]) {
			return i;
		}
	}
	return -1;
}

function insertAfter(elt, newElt) {
	let id = getMyID(elt);
	if (id == -1) {
		return;
	}
	if (id < elt.parentNode.childNodes.length - 1) {
		insertBefore(elt.nextSibling, newElt);
	} else {
		elt.parentNode.appendChild(newElt);
	}
}

/** x~x Fonctions de mise en forme du texte ---------------------------- */
function aff(nb) {
	return nb >= 0 ? `+${nb}` : nb;
}

function getNumber(str) {
	let nbr = str.match(/\d+/);
	return nbr ? Number(nbr[0]) : Number.NaN;
}

function getNumbers(str) {
	let nbrs = str.match(/\d+/g);
	if (!nbrs) {
		return [];
	}
	for (let i = 0; i < nbrs.length; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function getIntegers(str) {
	let nbrs = str.match(/-?\d+/g);
	if (!nbrs) {
		return [];
	}
	for (let i = 0; i < nbrs.length; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

if (typeof String.prototype.trim != 'function') {
	// Intégré depuis ES5, pour rétrocompatibilité
	String.prototype.trim = function () {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}

function epure(texte) {
	return texte
		.replace(/[àâä]/g, 'a')
		.replace(/Â/g, 'A')
		.replace(/[ç]/g, 'c')
		.replace(/[éêèë]/g, 'e')
		.replace(/[ïî]/g, 'i')
		.replace(/[ôöõ]/g, 'o')
		.replace(/[ùûü]/g, 'u');
}

// WARNING Modifier des constantes, c'est mal
String.prototype.epure = function () {
	return this
		.replace(/[àâä]/g, 'a').replace(/Â/g, 'A')
		.replace(/[ç]/g, 'c')
		.replace(/[éêèë]/g, 'e')
		.replace(/[ïî]/g, 'i')
		.replace(/[ôöõ]/g, 'o')
		.replace(/[ùûü]/g, 'u');
};

function bbcode(texte) {
	return texte
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#146;')
		.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
		.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
		.replace(/\[img\]([^"]*?)\[\/img\]/g, '<img src="$1" />');
}

/** x~x Gestion/transformation des Dates ------------------------------- */
function addZero(i) {
	return i < 10 ? `0${i}` : i;
}

// WARNING - remplacé par MZ_formatDateMS()
// function DateToString(date) {
// 	return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1)
// 		+ '/' + date.getFullYear() + ' ' + addZero(date.getHours())
// 		+ ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
// }

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/, '$2/$1');
}

// fonctionne aussi avec datetime
function SQLDateToFrench(str) {
	return str.replace(/([0-9]+)\-([0-9]+)\-([0-9]+)/, '$3/$2/$1');
}

// ... et ajoute un 'à' du plus bel effet
function SQLDateToFrenchTime(str) {
	return str.replace(/([0-9]+)\-([0-9]+)\-([0-9]+) /, '$3/$2/$1 à ');
}

// SQLDate vers objet date Javascript
function SQLDateToObject(str) {
	let t = str.split(/[- :]/);
	return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
}

var mz_ie = Boolean(window.attachEvent);
if (typeof addEvent !== 'function') {
	if (mz_ie) {
		function addEvent(obj, typ, fn, sens) {
			obj[`e${typ}${fn}`] = fn; obj[typ + fn] = function () {
				obj[`e${typ}${fn}`](window.event);
			};
			obj.attachEvent(`on${typ}`, obj[typ + fn]);
		}
	} else {
		function addEvent(obj, typ, fn, sens) {
			obj.addEventListener(typ, fn, sens);
		}
	}
}

/** ********************
* glissière en mode objet
* Roule 29/12/2016 à partir du code des trajets gowap doCallback_glissiere et Vapulabehemot
* Une glissière est un curseur permettant, par exemple de changer le zoom des cartes
*
* Usage:
*	gliss = new glissiere_MZ(ref, labelHTML, target, bDynamic);
*		ref : utilisé pour diversifier les IDs HTML
*		labelHTML : le label qui apparaît devant la glissière (peut contenir des balises HTML)
*		target : peut être de 3 types
*			- élément HTML : l'élément HTML à zoomer
*			- string : l'ID de l'élément à zoomer (qui doit exister au moment de la création de la glissière
*			- function : callback quand le curseur bouge
*		bDynamic : par défaut, le fonctionnement n'est pas dynamique (la callback est appellé au click)
*					dans le mode dynamique, la callback est appelée sur mouseMove
*		valDef : valeur par défaut si l'outil n'a jamais été utilisé
*		valMin, valMax : les valeurs entre lesquelles le curseur varie
*	autres méthodes
*		gliss.getElt();			// rend la div de la glissière (par exemple pour la positionner)
**********************/

function glissiere_MZ(ref, labelHTML, paramTarget, bDynamic, valDef, valMin, valMax) {
	try {
		let mouseDown = false;
		let div_gliss = document.createElement('div');	// la DIV mère
		div_gliss.id = `MZ_gliss_${ref}`;
		let div_label = document.createElement('span');	// le label
		div_label.innerHTML = labelHTML;
		div_gliss.appendChild(div_label);
		div_gliss.className = 'choix_zoom';
		let dessin = document.createElement('canvas');	// le dessin lui-même
		dessin.id = `MZ_gliss_dessin_${ref}`;
		dessin.style.cursor = 'pointer';
		dessin.width = 104;
		dessin.height = 12;
		dessin.style.marginLeft = '2px';
		dessin.style.marginRight = '2px';
		div_gliss.appendChild(dessin);
		let pourcent = document.createElement('span');	// le pourcentage
		pourcent.id = `MZ_gliss_pourcent_${ref}`;
		let pourcent_text = document.createTextNode('');
		let previousVal;
		let flouPourCurseurDoubleFleche = (valMax - valMin) / 40;

		// alignement vertical
		dessin.style.verticalAlign = 'middle';
		div_label.style.verticalAlign = 'middle';
		pourcent.style.verticalAlign = 'middle';

		pourcent.appendChild(pourcent_text);
		div_gliss.appendChild(pourcent);

		let bulle_pourcent = document.createElement('div');	// la bulle
		bulle_pourcent.id = `MZ_gliss_bulle_${ref}`;
		bulle_pourcent.style.display = 'block';
		bulle_pourcent.style.visibility = 'hidden';
		bulle_pourcent.style.position = 'absolute';
		bulle_pourcent.style.zIndex = 3500;
		bulle_pourcent.style.border = '1px solid #a1927f';
		let bulle_pourcent_text = document.createTextNode('');
		bulle_pourcent.appendChild(bulle_pourcent_text);
		document.body.appendChild(bulle_pourcent);

		this.getElt = function () {
			return div_gliss;
		};

		// //////////////////////////////////
		// dessine et redessine le curseur
		// //////////////////////////////////
		let dessine_glissiere = function (val) {
			let pos_0_100 = (val - valMin) * 100 / (valMax - valMin);
			let ctx = dessin.getContext('2d');
			ctx.clearRect(0, 0, 104, 12);
			ctx.fillStyle = 'rgb(0,0,0)';
			ctx.fillRect(0, 0, 2, 12);
			ctx.fillRect(102, 0, 2, 12);
			ctx.fillRect(0, 5, 104, 2);

			ctx.fillStyle = 'rgb(80,80,80)';
			ctx.fillRect(pos_0_100, 0, 5, 12);
			ctx.fillStyle = 'rgb(200,200,200)';
			ctx.fillRect(pos_0_100 + 1, 1, 3, 10);
			pourcent_text.nodeValue = `${val}%`;
			previousVal = parseInt(val);
		};

		// //////////////////////////////////
		// action sur mousedown et mousemove
		//		stocker la nouvelle valeur
		//		redessiner
		//		afficher la nouvelle valeur
		//		action selon ce qui a été demandé
		// //////////////////////////////////
		let doCallback_glissiere = function (evt) {
			try {
				let xsouris = evt.offsetX ? evt.offsetX : evt.layerX;
				let xpos = evt.offsetX ? evt.clientX : evt.pageX;
				let ypos = evt.offsetX ? evt.clientY + document.body.scrollTop : evt.pageY;
				if (evt.type === 'mousedown') {
					mouseDown = true;
				}
				let val = Math.floor(Math.min(valMax, Math.max(valMin, (xsouris - 1) * (valMax - valMin) / 100 + valMin)));
				dessin.style.cursor = val <= previousVal + flouPourCurseurDoubleFleche && val >= previousVal - flouPourCurseurDoubleFleche ? 'e-resize' : 'pointer';
				//		afficher la nouvelle valeur dans la bulle
				bulle_pourcent_text.nodeValue = `${val}%`;
				bulle_pourcent.style.top = `${ypos + 3}px`;
				bulle_pourcent.style.left = `${xpos + 16}px`;
				if (evt.buttons === undefined) {
					// mode utilisant les evt mouseup/down (mauvaise méthode, utilisé si on ne peut pas faire autrement)
					if (!mouseDown) {
						return;
					}	// simple survol, on ne fait rien de plus
				} else {
					if (!(evt.buttons & 1)) {
						return;
					}	// simple survol, on ne fait rien de plus
				}
				//		stocker la nouvelle valeur
				MY_setValue(`MZ_glissiere_${ref}`, val);
				//		redessiner la glissière avec le curseur où il faut
				dessine_glissiere(val);
				//		action selon ce qui a été demandé
				// for(let key in evt) logMZ(`evt key ${key} => ${evt[key]}`);
				if (!bDynamic && evt.type !== 'mousedown') {
					return;
				}
				let elt;
				if (typeof paramTarget === 'object') {
					elt = paramTarget;
				} else if (typeof paramTarget === 'string') {
					elt = document.getElementById(paramTarget);
				} else if (typeof paramTarget === 'function') {
					paramTarget(val);
					return;
				}
				if (elt && elt.setZoom != undefined) {
					elt.setZoom(val);
				}
			} catch (exc) {
				logMZ('glissiere_MZ.doCallback', exc);
			}
		};

		// //////////////////////////////////
		// event mousedown et mousemove : redessiner et callback
		// //////////////////////////////////
		addEvent(dessin, 'mousedown', doCallback_glissiere, true);
		addEvent(dessin, 'mousemove', doCallback_glissiere, true);
		// //////////////////////////////////
		// event mouseup : mémoriser mouseup (utile seulement si le navigateur ne supporte pas evt.buttons
		// //////////////////////////////////
		addEvent(dessin, 'mouseup', () => {
			mouseDown = false;
		}, true);
		// //////////////////////////////////
		// event mouseout & mouseover : afficher/cacher la bulle
		// //////////////////////////////////
		addEvent(dessin, 'mouseout', () => {
			bulle_pourcent.style.visibility = 'hidden';
		}, true);
		addEvent(dessin, 'mouseover', () => {
			bulle_pourcent.style.visibility = 'visible';
		}, true);

		// //////////////////////////////////
		// dessiner la première fois
		// //////////////////////////////////
		let val_init = MY_getValue(`MZ_glissiere_${ref}`);
		if (val_init === undefined) {
			val_init = valDef;
		}
		dessine_glissiere(val_init);
	} catch (exc) {
		logMZ('glissiere_MZ', exc);
	}
}

// calcul du point intermédiaire de déplacement gowap (x et y uniquement)
// reçoit 2 objets avec des propriétés x et y
// rend un objet avec x et y (rend undefined si le trajet est direct)
function pointIntermediaireMonstre2D(locDepart, locArrivee) {
	let deltaX = locArrivee.x - locDepart.x;
	if (deltaX == 0) {
		return;
	} // pas de point intermédiaire
	let deltaY = locArrivee.y - locDepart.y;
	if (deltaY == 0) {
		return;
	} // pas de point intermédiaire
	let absDeltaX = Math.abs(deltaX), absDeltaY = Math.abs(deltaY);
	if (absDeltaX > absDeltaY) {
		return { x: locDepart.x + Math.sign(deltaX) * Math.sign(deltaY) * deltaY, y: locArrivee.y };
	} else if (absDeltaY > absDeltaX) {
		return { x: locArrivee.x, y: locDepart.y + Math.sign(deltaX) * Math.sign(deltaY) * deltaX };
	}
	return;	// égalité, pas de point intermédiaire
}

/** ********************
* carte en mode objet
* Roule 14/01/2017 à partir du code des trajets gowap de Vapulabehemot
*
* Usage:
*	carte = new carte_MZ(ref, tabDepl);
*		ref : utilisé pour diversifier les IDs HTML
*		tabDepl : table de tables d'objets contenant x, y et n (positions successives des différents suivants)
*		          pour l'affichage, le premier objet doit contenir nom et id (et typ pour des cibles particulières)
*	autres méthodes
*		carte.getElt();			// rend la div de la carte (par exemple pour la positioner dans la page)
**********************/

function carte_MZ(ref, tabDepl) {
	try {
		let div1_carte = document.createElement('div');	// la DIV mère. Elle prend toute la largeur
		div1_carte.id = `MZ_carte_${ref}`;
		div1_carte.className = 'mh_tdpage';	// le mh_tdpage sert à faire cacher la carte par les scripts trajet_gowap
		div1_carte.style.backgroundImage = 'none';
		div1_carte.style.backgroundColor = 'transparent';
		let div2_carte = document.createElement('div');	// la DIV mère. Elle prend toute la largeur
		div2_carte.className = 'carte_MZ';
		div2_carte.style.display = 'inline-block';	// pour que la div ait la taille du contenu
		let dessin = document.createElement('canvas');	// le dessin lui-même
		dessin.id = `MZ_carte_dessin_${ref}`;
		dessin.style.backgroundImage = "url('/mountyhall/MH_Packs/packMH_parchemin/tableau/tableau1.jpg')";
		div1_carte.appendChild(div2_carte);
		div2_carte.appendChild(dessin);

		let position_trous_MZ = [
			[-70.5, -7.5, 2, 1.5, -69],	// x, y, ?, rayon du cercle, profondeur
			[-66.5, -37.5, 2, 1.5, -69],
			[-63.5, 8.5, 2, 1.5, -69],
			[-59.5, -32.5, 2, 1.5, -69],
			[-52, 57, 0.25, 0.8, -59],
			[-50.5, -22.5, 2, 1.5, -69],
			[-35.5, -51.5, 2, 1.5, -69],
			[-34.5, 14.5, 2, 1.5, -69],
			[-34.5, 64.5, 2, 1.5, -69],
			[-11.5, 72.5, 2, 1.5, -69],
			[5.5, -49.5, 2, 1.5, -69],
			[5.5, 31.5, 2, 1.5, -69],
			[10.5, 63.5, 2, 1.5, -69],
			[12, -15, 0.25, 0.8, -59],
			[21.5, 35.5, 2, 1.5, -69],
			[30, -52, 0.25, 0.8, -59],
			[46.5, 51.5, 2, 1.5, -69],
			[48, -39, 0.25, 0.8, -59],
			[55, 70, 0.25, 0.8, -59],	// correction Roule 10/10/2016 -59 au lieu de -69
			[56.5, 23.5, 75, 8.7, -99],
			[64, 70, 0.25, 0.8, -59],
			[74.5, 31.5, 2, 1.5, -69]];

		let couleur_depl_normal = 'rgba(0,0,200,0.5)';
		let couleur_cible = 'rgba(0,0,0,0.5)';
		let couleur_depl_collision_trou = 'rgba(150,0,0, 0.5)';
		let couleur_trou = 'rgb(200,0,0)';

		let coord_x = function (val) {
			return decalh + coeff * (val + 100);
		};
		let coord_y = function (val) {
			return decalv + coeff * (100 - val);
		};

		let ctx = dessin.getContext('2d');
		let coeff = MY_getValue(`MZ_glissiere_${ref}`);	// ce qui a été sauvé précédement par la glissiere
		if (coeff) {
			coeff = coeff / 50;
		} else {
			coeff = 2;
		}
		let decalv = 30, decalh = 30;

		let detecteCollisionTrou = function (pos0, pos1) {	// fonction volée à feldspath et Vapulabehemot, merci à eux (voir calc_inter dans Trajet_Gowap)
			// let res = false
			let x0 = pos0.x, y0 = pos0.x;
			let tmax = Math.max(Math.abs(pos1.x - pos0.x), Math.abs(pos1.y - pos0.y));
			let px = Math.sign(pos1.x - pos0.x), py = Math.sign(pos1.y - pos0.y);
			let a = 0, b = 0, c = 0, delta = 0, t0 = 0, t1 = 0;
			// logMZ(`verif collision gowap-trou [x0=${x0},y0=${y0}, px=${px}, py=${py}, tmax=${tmax}]`);

			for (let k in position_trous_MZ) {
				a = parseFloat(px * px + py * py);
				b = parseFloat((x0 - position_trous_MZ[k][0]) * px + (y0 - position_trous_MZ[k][1]) * py);
				c = parseFloat((x0 - position_trous_MZ[k][0]) * (x0 - position_trous_MZ[k][0]) + (y0 - position_trous_MZ[k][1]) * (y0 - position_trous_MZ[k][1]) - position_trous_MZ[k][2]);
				delta = b * b - a * c;
				if (delta >= 0) {
					t0 = Math.ceil(-b / a - Math.sqrt(delta) / a);
					t1 = Math.floor(-b / a + Math.sqrt(delta) / a);
					if (t0 <= tmax && t1 >= 0) {
						// Roule' 10/10/2016 J'ai déplacé le flag res=true à l'intérieur de la boucle for ci-dessous car il y avait de fausses détections
						// res = true;
						// logMZ(`***** collision gowap-trou [x0=${x0},y0=${y0}, px=${px}, py=${py}, tmax=${tmax}]`);
						for (let l = Math.max(0, t0); l <= Math.min(tmax, t1); l++) {
							// logMZ(`***** collision gowap-trou en ${(x0+l*px)}, ${(y0+l*py)}`);
							// Roule : pas utile pour nous
							// res = true;
							// chute.push([x0+l*px, y0+l*py]);
							return true;
						}
					}
				}
			}
			return false;
		};

		let dessine_carte = function () {
			dessin.width = 200 * coeff + 2 * decalh;
			dessin.height = 200 * coeff + 2 * decalv;

			// repere
			ctx.beginPath();
			ctx.moveTo(coord_x(0), coord_y(100));
			ctx.lineTo(coord_x(0), coord_y(-100));
			ctx.moveTo(coord_x(-100), coord_y(0));
			ctx.lineTo(coord_x(100), coord_y(0));
			ctx.stroke();
			ctx.strokeRect(coord_x(-100), coord_y(100), coord_x(100) - coord_x(-100), coord_y(-100) - coord_y(100));

			// trous
			ctx.fillStyle = couleur_trou;
			for (let i in position_trous_MZ) {
				ctx.beginPath();
				ctx.arc(coord_x(position_trous_MZ[i][0]), coord_y(position_trous_MZ[i][1]), coeff * position_trous_MZ[i][3], 0, Math.PI * 2, true);
				ctx.fill();
			}
			// trajets
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			for (let iSuivant in tabDepl) {
				// logMZ(`carte_MZ, suivant n°${iSuivant}`);
				let tabDeplOneSuivant = tabDepl[iSuivant];
				let x0 = coord_x(tabDeplOneSuivant[0].x), y0 = coord_y(tabDeplOneSuivant[0].y);
				let typeDepart = tabDeplOneSuivant[0].typ; // La "cible" au départ
				switch (typeDepart) {
					case 'tp':
						ctx.beginPath();
						ctx.lineWidth = 2;
						ctx.strokeStyle = couleur_cible;
						ctx.fillStyle = couleur_cible;
						ctx.moveTo(x0 + coeff * 3, y0 + coeff * 3);
						ctx.lineTo(x0 + coeff * 3, y0 - coeff * 3);
						ctx.lineTo(x0 - coeff * 3, y0 - coeff * 3);
						ctx.lineTo(x0 - coeff * 3, y0 + coeff * 3);
						ctx.lineTo(x0 + coeff * 3, y0 + coeff * 3);
						ctx.moveTo(x0 + coeff * 3, y0);
						ctx.lineTo(x0 - coeff * 3, y0);
						ctx.moveTo(x0, y0 + coeff * 3);
						ctx.lineTo(x0, y0 - coeff * 3);
						ctx.stroke();
						break;
					default:
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.strokeStyle = couleur_cible;
						ctx.fillStyle = couleur_cible;
						ctx.arc(x0, y0, coeff * 4, 0, Math.PI * 2, true);
						ctx.moveTo(x0 + coeff * 4, y0);
						ctx.lineTo(x0 - coeff * 4, y0);
						ctx.moveTo(x0, y0 + coeff * 4);
						ctx.lineTo(x0, y0 - coeff * 4);
						ctx.stroke();
						break;
				}
				// les segments
				let nb_pts = tabDeplOneSuivant.length;
				let pointPrecedent = tabDeplOneSuivant[0];
				for (let i = 1; i < nb_pts; i++) {
					ctx.beginPath();
					ctx.lineWidth = coeff;
					ctx.moveTo(coord_x(pointPrecedent.x), coord_y(pointPrecedent.y));
					ctx.strokeStyle = couleur_depl_normal;
					let pointIntermediaire = pointIntermediaireMonstre2D(pointPrecedent, tabDeplOneSuivant[i]);
					if (pointIntermediaire === undefined) {
						if (detecteCollisionTrou(pointPrecedent, tabDeplOneSuivant[i])) {
							ctx.strokeStyle = couleur_depl_collision_trou;
						} else {
							ctx.strokeStyle = couleur_depl_normal;
						}
						ctx.lineTo(coord_x(tabDeplOneSuivant[i].x), coord_y(tabDeplOneSuivant[i].y));
					} else {
						if (detecteCollisionTrou(pointPrecedent, pointIntermediaire) ||
							detecteCollisionTrou(pointIntermediaire, tabDeplOneSuivant[i])) {
							ctx.strokeStyle = couleur_depl_collision_trou;
						} else {
							ctx.strokeStyle = couleur_depl_normal;
						}
						ctx.lineTo(coord_x(pointIntermediaire.x), coord_y(pointIntermediaire.y));
						ctx.lineTo(coord_x(tabDeplOneSuivant[i].x), coord_y(tabDeplOneSuivant[i].y));
					}
					pointPrecedent = tabDeplOneSuivant[i];
					ctx.stroke();
				}
				// Les points à chaque étape
				ctx.fillStyle = couleur_depl_normal;
				for (let i = 1; i < nb_pts; i++) {
					ctx.beginPath();
					let x = coord_x(tabDeplOneSuivant[i].x), y = coord_y(tabDeplOneSuivant[i].y);
					ctx.arc(x, y, coeff, 0, Math.PI * 2, true);
					ctx.fill();
				}
			}
		};

		this.setZoom = function (val) {
			ctx.clearRect(0, 0, dessin.width, dessin.height);
			coeff = val / 50;
			dessine_carte();
		};

		// glissiere
		let gliss = new glissiere_MZ(ref, 'Zoom\u00A0:', this, true, 100, 50, 200);
		let eGliss = gliss.getElt();
		eGliss.style.position = 'absolute';
		eGliss.style.top = `${coeff * 2}px`;
		eGliss.style.left = `${decalh}px`;
		dessin.style.position = 'relative';
		div2_carte.style.position = 'relative';
		eGliss.style.zIndex = 9000;
		div2_carte.appendChild(eGliss);

		// affichage au survol de la souris
		let bulle = document.createElement('div');
		bulle.style.visibility = 'hidden';
		bulle.style.position = 'absolute';
		bulle.style.zIndex = 3100;
		bulle.style.border = 'solid 1px #a1927f';
		bulle.className = 'mh_tdpage';
		bulle.style.display = 'block';	// ATTENTION, display doit être après className pour forcer le display
		let bulleHaut = document.createElement('div');
		bulleHaut.style.display = 'block';
		bulleHaut.style.paddingRight = '3px';
		bulleHaut.className = 'mh_tdtitre';
		bulleHaut.appendChild(document.createTextNode(' '));	// prépare texte
		bulle.appendChild(bulleHaut);
		let bulleBas = document.createElement('div');
		bulleBas.style.display = 'block';
		bulleBas.style.whiteSpace = "nowrap";
		bulleBas.style.paddingRight = '3px';

		// bulleBas.appendChild(document.createTextNode(' '));	// prépare texte
		bulle.appendChild(bulleBas);
		div2_carte.appendChild(bulle);
		let affichePosition = function (evt) {
			let xsouris = evt.offsetX ? evt.offsetX : evt.layerX;
			let ysouris = evt.offsetX ? evt.offsetY : evt.layerY;
			let xpos = evt.offsetX ? evt.clientX : evt.pageX;
			let ypos = evt.offsetX ? evt.clientY + document.body.scrollTop : evt.pageY;
			let xUser = Math.round((xsouris - decalh) / coeff - 100); // l'inverse de decalh+coeff*(val+100);
			let yUser = Math.round(100 - (ysouris - decalv) / coeff); // l'inverse de decalv+coeff*(100-val);
			bulleHaut.firstChild.nodeValue = `x=${xUser}, y=${yUser}`;
			let tabHTMLbas = []; // message pour les trous
			for (let i in position_trous_MZ) {
				let ceTrou = position_trous_MZ[i];
				let dist = (xUser - ceTrou[0]) * (xUser - ceTrou[0]) + (yUser - ceTrou[1]) * (yUser - ceTrou[1]) - ceTrou[2];
				if (dist <= 0) {
					tabHTMLbas.push(`Trous de Météorite : n=-1 -> n=${ceTrou[4]}`);
					break;
				}
			}
			for (let i in tabDepl) { // messages pour les suivants
				let ceGowap = tabDepl[i][0];	// position courante du suivant
				if (Math.abs(xUser - ceGowap.x) < 3 && Math.abs(yUser - ceGowap.y) < 3) {
					tabHTMLbas.push(`(${ceGowap.x}, ${ceGowap.y}, ${ceGowap.n}) ${ceGowap.id} ${ceGowap.nom}`);
				}
			}
			bulleBas.innerHTML = tabHTMLbas.join('<br />');
			bulle.style.top = `${ysouris + 8}px`;
			bulle.style.left = `${xsouris + 16}px`;
		};
		addEvent(dessin, 'mousemove', affichePosition, true);
		addEvent(dessin, 'mouseout', () => {
			bulle.style.visibility = 'hidden';
		}, true);
		addEvent(dessin, 'mouseover', () => {
			bulle.style.visibility = 'visible';
		}, true);

		dessine_carte(); // dessin initial

		this.getElt = function () {
			return div1_carte;
		};
	} catch (exc) {
		logMZ('glissiere_MZ.carte_MZ', exc);
	}
}

/** ********************
* analyse de la vue pour produire un objet
* Raistlin 25/09/2020, intégré par Roule
*
* en mode objet car ça permet d'isoler les noms
/**********************/

var MZ_AnalyseVue = {	// ceci est un OBJET stocké comme une variable globale
	sectionList: {
		Monstre: "VueMONSTRE",
		Troll: "VueTROLL",
		Tresor: "VueTRESOR",
		Champignon: "VueCHAMPIGNON",
		Lieu: "VueLIEU",
		Cenotaphe: "VueCADAVRE"
	},
	columnTranslation: {
		"Dist.": "distance",
		"Actions": "actions",
		"Réf.": "Id",
		"Nom": "nom",
		"X": "x",
		"Y": "y",
		"N": "n",
		"Niv.": "niveau",
		"Type": "nom",
		"Race": "race",
		"Champignon": "nom",
	},

	getSectionVueColsHeader: function (section) {
		let colList = [];
		for (let col of document.getElementById(section).childNodes[0].childNodes[0].childNodes) {
			if (typeof col.innerText !== 'undefined') {
				colList.push(col.innerText);
			}
		}
		return colList;
	},

	getSectionVueLines: function (section) {
		let sectionArray = [];
		for (let line of document.getElementById(section).childNodes[1].childNodes) {
			let lineArray = [];
			for (let field of line.childNodes) {
				lineArray.push(field.innerText);
			}
			sectionArray.push(lineArray);
		}
		return sectionArray;
	},

	htmlToObj: function () {
		this.oVue = {};
		for (let section in this.sectionList) {
			let sectionColList = this.getSectionVueColsHeader(this.sectionList[section]);
			let sectionLineList = this.getSectionVueLines(this.sectionList[section]);
			let oSection = [];
			for (let line in sectionLineList) {
				let oElement = {};
				for (let col in sectionColList) {
					let colTranslated = this.columnTranslation[sectionColList[col]];
					if (!colTranslated) {
						continue;
					}
					oElement[colTranslated] = sectionLineList[line][col];
				}
				oSection.push(oElement);
			}
			this.oVue[section] = oSection;
		}
		this.oVue.caseOrigine = { x: MY_getValue(`${numTroll}.position.X`), y: MY_getValue(`${numTroll}.position.Y`), n: MY_getValue(`${numTroll}.position.N`) };
	},

	messageHandler: function (event) {
		debugMZ(`get event, origin=${event.origin}`);
		debugMZ(`get event, data=${event.data}`);
		debugMZ(`sendVueExterne, domaine=${MZ_AnalyseVue.domaine}`);
		MZ_AnalyseVue.otherTab.postMessage(MZ_AnalyseVue.oVue, MZ_AnalyseVue.domaine);
	},

	openVueExterne: function (url) {
		window.addEventListener("message", this.messageHandler);
		let oURL = new URL(url); // extraire le hostname, on en aura besoin dans sendVueExterne
		this.htmlToObj();
		// debugMZ(JSON.stringify(this.oVue));
		this.url = url;
		this.domaine = `${oURL.protocol}//${oURL.hostname}`;
		this.otherTab = window.open(url, 'vueExtnMZ');
		// l'onglet (ou fenêtre) va envoyer un message quand il sera prêt et on lui enevrra la vue alors (fonction messageHandler)
	},
};


/** ********************************************************
**** Fin de zone à déplacer dans une bibli commune ********
**********************************************************/

/* DEBUG: NETTOYAGE TAGS */
if (MY_getValue(`${numTroll}.TAGSURL`)) {
	MY_removeValue(`${numTroll}.TAGSURL`);
}

// Alerte si mode dev
if (isDEV) {
	let divpopup = document.createElement('div');
	divpopup.id = 'divDEV';
	divpopup.style =
		'position: fixed;' +
		'border: 15px solid red;' +
		'top: 10px;right: 10px;' +
		'background-color: white;' +
		'color: black;' +
		'font-size: large;' +
		'padding: 5px' +
		'z-index: 200;';
	appendText(divpopup, '[MZ] Mode DEV');
	divpopup.title = 'Pour revenir en mode normal, \nshift-click sur le mot "Crédits" dans Options/Pack Graphique';
	document.body.appendChild(divpopup);
}

/** x~x regroupement des getPortee() ----------------------------------- */
function getPortee(param) {
	let p = Math.max(0, Number(param));
	return Math.ceil(Math.sqrt(2 * p + 10.75) - 3.5);
	// ça devrait être floor, +10.25, -2.5
}

/** x~x Calculs expérience / niveau ------------------------------------ */
function isLetter(c) {
	return c.toLowerCase() != c.toUpperCase();
}

function getPXKill(niv) {
	if (nivTroll == undefined) {
		return '? (visitez le profil privé)';
	}
	return Math.max(0, 10 + 3 * niv - 2 * nivTroll);
}

function getPXDeath(niv) {
	if (nivTroll == undefined) {
		return '? (visitez le profil privé)';
	}
	return Math.max(0, 10 + 3 * nivTroll - 2 * niv);
}

function analysePX(niv) {
	niv = `${niv}`;
	let i = niv.indexOf('+');
	if (i != -1) { // si niv = 'XX+' ??
		return ` \u2192 \u2265 <b>${getPXKill(niv.slice(0, i))}</b> PX`; // \u2192 = '→'
	}
	i = niv.slice(1).indexOf('-'); // si niv = 'XX-YY' ??
	if (i != -1) {
		let max = getPXKill(niv.slice(i + 2));
		if (max == 0) {
			return ' \u2192 <b>0</b> PX';
		} // \u2192 = '→'
		return ` \u2192 <b>${getPXKill(niv.slice(0, i + 1))}</b> \u2264 PX \u2264 <b>${max}</b>`;
	}
	i = niv.indexOf('='); // ???
	if (i != -1) {
		let max = getPXKill(niv.slice(i + 1));
		return max == 0 ? ' \u2192 <b>0</b> PX' : ` \u2192 \u2264 <b>${max}</b> PX`;
	}
	return ` \u2192 <b>${getPXKill(niv)}</b> PX`;
}

function analysePXTroll(niv) {
	let str = analysePX(niv);
	str = `${str}<br/>Vous lui rapportez <b>${getPXDeath(niv)}</b> PX.`;
	return str;
}

/** x~x Gestion compos / champis --------------------------------------- */
// Refonte totale du code de Zorya
// Elements à implémenter en dur dans MZ2.0
var numQualite = {
	'Très Mauvaise': 1,
	'Mauvaise': 2,
	'Moyenne': 3,
	'Bonne': 4,
	'Très Bonne': 5
};

var qualiteNum = [
	'_dummy_',
	'Très Mauvaise',
	'Mauvaise',
	'Moyenne',
	'Bonne',
	'Très Bonne'
];

// WARNING (gath) - non utilisé -> commenté
// let nival = {
// 	'Abishaii Bleu': 19,
// 	'Abishaii Noir': 10,
// 	'Abishaii Rouge': 23,
// 	'Abishaii Vert': 15,
// 	'Ame-en-peine': 8,
// 	'Amibe Geante': 9,
// 	'Anaconda des Catacombes': 8,
// 	'Ankheg': 10,
// 	'Anoploure Purpurin': 36,
// 	'Araignee Geante': 2,
// 	'Ashashin': 35,
// 	'Balrog': 50,
// 	'Banshee': 16,
// 	'Barghest': 36,
// 	'Basilisk': 11,
// 	'Behemoth': 34,
// 	'Behir': 14,
// 	'Beholder': 50,
// 	'Boggart': 3,
// 	'Bondin': 9,
// 	"Bouj'Dla Placide": 37,
// 	"Bouj'Dla": 19,
// 	'Bulette': 19,
// 	'Caillouteux': 1,
// 	'Capitan': 35,
// 	'Carnosaure': 25,
// 	'Champi-Glouton': 3,
// 	'Chauve-Souris Geante': 4,
// 	'Cheval a Dents de Sabre': 23,
// 	'Chevalier du Chaos': 20,
// 	'Chimere': 13,
// 	'Chonchon': 24,
// 	'Coccicruelle': 22,
// 	'Cockatrice': 5,
// 	'Crasc Medius': 17,
// 	'Crasc Maexus': 25,
// 	'Crasc': 10,
// 	'Croquemitaine': 6,
// 	'Cube Gelatineux': 32,
// 	'Daemonite': 27,
// 	'Diablotin': 5,
// 	'Dindon du Chaos': 1,
// 	'Djinn': 29,
// 	'Ectoplasme': 18,
// 	'Effrit': 27,
// 	"Elementaire d'Air": 23,
// 	"Elementaire d'Eau": 17,
// 	'Elementaire de Feu': 21,
// 	'Elementaire de Terre': 21,
// 	'Elementaire du Chaos': 26,
// 	'Erinyes': 7,
// 	'Esprit-Follet': 16,
// 	'Essaim Craterien': 30,
// 	'Essaim Sanguinaire': 25,
// 	'Ettin': 8,
// 	'Familier': 1,
// 	'Fantome': 24,
// 	'Feu Follet': 20,
// 	'Flagelleur Mental': 33,
// 	'Foudroyeur': 38,
// 	'Fumeux': 22,
// 	'Fungus Geant': 9,
// 	'Fungus Violet': 4,
// 	'Furgolin': 10,
// 	'Gargouille': 3,
// 	'Geant de Pierre': 13,
// 	'Geant des Gouffres': 22,
// 	"Geck'oo Majestueux": 40,
// 	"Geck'oo": 15,
// 	'Glouton': 20,
// 	'Gnoll': 5,
// 	'Gnu Domestique': 1,
// 	'Gnu Sauvage': 1,
// 	'Goblin': 4,
// 	'Goblours': 4,
// 	"Golem d'Argile": 15,
// 	'Golem de cuir': 1,
// 	'Golem de Chair': 8,
// 	'Golem de Fer': 31,
// 	'Golem de mithril': 1,
// 	'Golem de metal': 1,
// 	'Golem de papier': 1,
// 	'Golem de Pierre': 23,
// 	'Gorgone': 11,
// 	'Goule': 4,
// 	'Gowap Apprivoise': 1,
// 	'Gowap Sauvage': 1,
// 	'Gremlins': 3,
// 	'Gritche': 39,
// 	'Grouilleux': 4,
// 	'Grylle': 31,
// 	'Harpie': 4,
// 	'Hellrot': 18,
// 	'Homme-Lezard': 4,
// 	'Hurleur': 8,
// 	'Hydre': 50,
// 	'Incube': 13,
// 	'Kobold': 2,
// 	'Labeilleux': 26,
// 	'Lezard Geant': 5,
// 	'Liche': 50,
// 	'Limace Geante': 10,
// 	'Loup-Garou': 8,
// 	'Lutin': 4,
// 	'Mante Fulcreuse': 30,
// 	'Manticore': 9,
// 	'Marilith': 33,
// 	'Meduse': 6,
// 	'Megacephale': 38,
// 	'Mille-Pattes Geant': 14,
// 	'Mimique': 6,
// 	'Minotaure': 7,
// 	'Molosse Satanique': 8,
// 	'Momie': 4,
// 	'Monstre Rouilleur': 3,
// 	"Mouch'oo Domestique": 14,
// 	"Mouch'oo Majestueux Sauvage": 33,
// 	"Mouch'oo Sauvage": 14,
// 	'Na-Haniym-Heee': 0,
// 	'Necrochore': 37,
// 	'Necromant': 39,
// 	'Necrophage': 8,
// 	'Naga': 10,
// 	'Nuee de Vermine': 13,
// 	"Nuage d'Insectes": 7,
// 	'Ogre': 7,
// 	'Ombre de Roches': 13,
// 	'Ombre': 2,
// 	'Orque': 3,
// 	'Ours-Garou': 18,
// 	'Palefroi Infernal': 29,
// 	'Phoenix': 32,
// 	'Pititabeille': 0,
// 	'Plante Carnivore': 4,
// 	'Pseudo-Dragon': 5,
// 	'Rat Geant': 2,
// 	'Rat-Garou': 3,
// 	'Rocketeux': 5,
// 	'Sagouin': 3,
// 	'Scarabee Geant': 4,
// 	'Scorpion Geant': 10,
// 	'Shai': 28,
// 	'Sirene': 8,
// 	'Slaad': 5,
// 	'Sorciere': 17,
// 	'Spectre': 14,
// 	'Sphinx': 30,
// 	'Squelette': 1,
// 	'Strige': 2,
// 	'Succube': 13,
// 	'Tertre Errant': 20,
// 	'Thri-kreen': 10,
// 	'Tigre-Garou': 12,
// 	'Titan': 26,
// 	'Trancheur': 35,
// 	'Tubercule Tueur': 14,
// 	'Tutoki': 4,
// 	'Vampire': 29,
// 	'Ver Carnivore Geant': 12,
// 	'Ver Carnivore': 11,
// 	'Veskan Du Chaos': 14,
// 	'Vouivre': 33,
// 	'Worg': 5,
// 	'Xorn': 14,
// 	'Yeti': 8,
// 	'Yuan-ti': 15,
// 	'Zombie': 2
// }

var tabEM = {
	// Monstre: [Compo exact, Sort, Position, Localisation]
	// AA
	'Basilisk': ["Œil d'un ", "Analyse Anatomique", 3, "Tête"],
	// AE
	'Ankheg': ["Carapace d'un", "Armure Ethérée", 3, "Spécial"],
	'Rocketeux': ["Tripes d'un", "Armure Ethérée", 4, "Corps"],
	// AdA
	'Loup-Garou': ["Bras d'un", "Augmentation de l'Attaque", 3, "Membre"],
	'Titan': ["Griffe d'un", "Augmentation de l'Attaque", 4, "Membre"],
	// AdE
	'Erinyes': ["Plume d'une", "Augmentation de l'Esquive", 3, "Membre"],
	'Palefroi Infernal': ["Sabot d'un", "Augmentation de l'Esquive", 4, "Membre"],
	// AdD
	'Manticore': ["Patte d'une", "Augmentation des Dégâts", 3, "Membre"],
	'Trancheur': ["Griffe d'un", "Augmentation des Dégâts", 4, "Membre"],
	// BAM
	'Banshee': ["Peau d'une", "Bulle Anti-Magie", 3, "Corps"],
	// BuM
	'Essaim Sanguinaire': ["Pattes d'un", "Bulle Magique", 3, "Membre"],
	'Sagouin': ["Patte d'un", "Bulle Magique", 4, "Membre"],
	'Effrit': ["Cervelle d'un", "Bulle Magique", 5, "Tête"],
	// Explo
	'Diablotin': ["Cœur d'un", "Explosion", 3, "Corps"],
	'Chimère': ["Sang d'une", "Explosion", 4, "Corps"],
	'Barghest': ["Bave d'un", "Explosion", 5, "Spécial"],
	// FP
	'Nécrophage': ["Tête d'un", "Faiblesse Passagère", 3, "Tête"],
	'Vampire': ["Canine d'un", "Faiblesse Passagère", 4, "Spécial"],
	// FA
	'Gorgone': ["Chevelure d'une", "Flash Aveuglant", 3, "Tête"],
	'Géant des Gouffres': ["Cervelle d'un", "Flash Aveuglant", 4, "Tête"],
	// Glue
	'Limace Géante': ["Mucus d'une", "Glue", 3, "Spécial"],
	'Grylle': ["Gueule d'un", "Glue", 4, "Tête"],
	// GdS
	'Abishaii Noir': ["Serre d'un", "Griffe du Sorcier", 3, "Membre"],
	'Vouivre': ["Venin d'une", "Griffe du Sorcier", 4, "Spécial"],
	'Araignée Géante': ["Mandibule d'une", "Griffe du Sorcier", 5, "Spécial"],
	// Invi
	"Nuage d'Insectes": ["Chitine d'un", "Invisibilité", 3, "Spécial"],
	'Yuan-ti': ["Cervelle d'un", "Invisibilité", 4, "Tête"],
	'Gritche': ["Epine d'un", "Invisibilité", 5, "Spécial"],
	// Lévitation
	// ???
	// PréM :
	'Ashashin': ["Œil d'un ", "Précision Magique", 3, "Tête"],
	'Crasc': ["Œil Rougeoyant d'un ", "Précision Magique", 4, "Tête"],
	// Proj
	'Yéti': ["Jambe d'un", "Projection", 3, "Membre"],
	'Djinn': ["Tête d'un", "Projection", 4, "Tête"],
	// PuM :
	'Incube': ["Épaule musclée d'un", "Puissance Magique", 3, "Membre"],
	'Capitan': ["Tripes Puantes d'un", "Puissance Magique", 4, "Corps"],
	// Sacro
	'Sorcière': ["Verrue d'une", "Sacrifice", 3, "Spécial"],
	// Télék
	'Plante Carnivore': ["Racine d'une", "Télékinésie", 3, "Spécial"],
	'Tertre Errant': ["Cervelle d'un", "Télékinésie", 4, "Tête"],
	// TP
	'Boggart': ["Main d'un", "Téléportation", 3, "Membre"],
	'Succube': ["Téton Aguicheur d'une", "Téléportation", 4, "Corps"],
	'Nécrochore': ["Os d'un", "Téléportation", 5, "Corps"],
	// VA
	'Abishaii Vert': ["Œil d'un", "Vision Accrue", 3, "Tête"],
	// VL
	'Fungus Géant': ["Spore d'un", "Vision Lointaine", 3, "Spécial"],
	'Abishaii Rouge': ["Aile d'un", "Vision Lointaine", 4, "Membre"],
	// VlC
	'Zombie': ["Cervelle Putréfiée d'un", "Voir le Caché", 3, "Tête"],
	'Shai': ["Tripes d'un", "Voir le Caché", 4, "Corps"],
	'Phoenix': ["Œil d'un", "Voir le Caché", 5, "Tête"],
	// VT
	'Naga': ["Ecaille d'un", "Vue Troublée", 3, "Corps"],
	'Marilith': ["Ecaille d'une", "Vue Troublée", 4, "Membre"],
	// Variables
	'Rat': ["d'un"],
	'Rat Géant': ["d'un"],
	'Dindon': ["d'un"],
	'Goblin': ["d'un"],
	'Limace': ["d'une"],
	'Limace Géante': ["d'une"],
	'Ver': ["d'un"],
	'Ver Carnivore': ["d'un"],
	'Ver Carnivore Géant': ["d'un"],
	'Fungus': ["d'un"],
	'Vouivre': ["d'une"],
	'Gnu': ["d'un"],
	'Scarabée': ["d'un"]
};

var mundiChampi = {
	'Préscientus Reguis': 'du Phoenix',
	'Amanite Trolloïde': 'de la Mouche',
	'Girolle Sanglante': 'du Dindon',
	'Horreur Des Prés': 'du Gobelin',
	'Bolet Péteur': 'du Démon',
	'Pied Jaune': 'de la Limace',
	'Agaric Sous-Terrain': 'du Rat',
	'Suinte Cadavre': "de l'Hydre",
	'Cèpe Lumineux': 'du Ver',
	'Fungus Rampant': 'du Fungus',
	'Nez Noir': 'de la Vouivre',
	'Pleurote Pleureuse': 'du Gnu',
	'Phytomassus Xilénique': 'du Scarabée'
};

// WARNING (gath) - non utilisé -> commenté
// function addInfoMM(node, mob, niv, qualite, effetQ) {
// 	appendText(node, ' ');
// 	let urlImg = URL_MZimg + 'Competences/melangeMagique.png';
// 	let text = ' [-' + (niv + effetQ) + ' %]';
// 	let str = '';
// 	switch (mob[0]) {
// 		case 'A':
// 		case 'E':
// 		case 'I':
// 		case 'O':
// 		case 'U':
// 			str = "Compo d'";
// 			break;
// 		default:
// 			str = 'Compo de ';
// 	}
// 	let title = str + mob + ' : -' + niv + '\nQualité ' + qualite + ' : -' + effetQ;
// 	let span = createImageSpan(urlImg, 'MM:', title, text);
// 	node.appendChild(span);
// }

function addInfoEM(node, mob, compo, qualite, localisation) {
	if (!tabEM[mob]) {
		return;
	}
	let title = 'Composant variable', texte = 'Variable', bold = false;
	if (tabEM[mob].length > 1) {
		let pc = 5 * (numQualite[qualite] - tabEM[mob][2]);
		if (tabEM[mob][0].indexOf(compo) == -1) {
			pc = pc - 20;
		}
		if (localisation.indexOf(tabEM[mob][3]) == -1) {
			pc = pc - 5;
		}
		if (pc < -20) {
			return;
		}
		if (pc >= 0) {
			bold = true;
		}
		texte = `${aff(pc)}%`;
		title = `${texte} pour l'écriture de ${tabEM[mob][1]}`;
	}
	let urlImg = `${URL_MZimg}Competences/ecritureMagique.png`;
	let span = createImageSpan(urlImg, 'EM:', title, ` [${texte}]`, bold);
	node.appendChild(span);
}

function insererInfosEM(tbody) {
	// lancé par equip, equipgowap
	let trCompos = document.evaluate("./tr[not(starts-with(td[2]/img/@alt,'Pas'))]", tbody, null, 7, null);
	// let strCompos = '';
	for (let i = 0; i < trCompos.snapshotLength; i++) {
		let node = trCompos.snapshotItem(i).childNodes[7];
		let str = node.firstChild.textContent;
		let compo = trim(str.slice(0, str.indexOf(" d'un")));
		let mob = trim(str.slice(str.indexOf("d'un") + 5));
		// Si non-EM on stoppe le traitement
		if (!tabEM[mob]) {
			continue;
		}
		str = trCompos.snapshotItem(i).childNodes[9].textContent;
		let qualite = trim(str.slice(str.indexOf('Qualit') + 9));
		let localisation = trim(str.slice(0, str.indexOf(' |')));
		addInfoEM(node, mob, compo, qualite, localisation);
	}
}

function getQualite(qualite) {
	let nb = numQualite[qualite];
	return nb ? nb - 1 : -1;
}

function getEM(nom) {
	if (nom.indexOf('[') != -1) {
		nom = trim(nom.substring(0, nom.indexOf('[')));
	}
	if (tabEM[nom]) {
		return nom;
	}
	return '';
}

// DEBUG ex-fonction composantEM
function compoMobEM(mob) {
	if (!tabEM[mob]) {
		return '';
	}
	if (tabEM[mob].length == 1) {
		return `Divers composants ${tabEM[mob][0]} ${mob} (Composant Variable)`;
	}
	return `${tabEM[mob][0]} ${mob} (Qualité ${qualiteNum[tabEM[mob][2]]}) pour l'écriture de ${mob}`;
}

// DEBUG ex-fonction compoEM
function titreCompoEM(mob, compo, localisation, qualite) {
	if (!tabEM[mob]) {
		return '';
	}
	if (tabEM[mob].length == 1) {
		return 'Composant variable';
	}

	let pc = 5 * (tabEM[mob][2] - numQualite[qualite]);
	if (compo.indexOf(tabEM[mob][0]) == -1) {
		pc = pc - 20;
	}
	if (localisation.indexOf(tabEM[mob][3]) == -1) {
		pc = pc - 5;
	}

	if (pc >= -20) {
		return `${pc}% pour l'écriture de ${tabEM[mob][2]}`;
	}
	return '';
}

// DEBUG - rétrocompatibilité
function compoEM(mob) {
	// appelé dans libs, vue
	return compoMobEM(mob);
}
function composantEM(mob, compo, localisation, qualite) {
	// appelé dans libs, tancompo
	return titreCompoEM(mob, compo, localisation, qualite);
}

/** x~x Stockage des Talents ------------------------------------------- */
var arrayTalents = {
	/* Compétences */
	'Acceleration du Metabolisme': 'AM',
	'Attaque Precise': 'AP',
	'Balayage': 'Balayage',
	// 'Balluchonnage':'Ballu',
	'Baroufle': 'Baroufle',
	'Bidouille': 'Bidouille',
	'Botte Secrete': 'BS',
	'Camouflage': 'Camou',
	'Charger': 'Charger',
	'Connaissance des Monstres': 'CdM',
	'Construire un Piege': 'Piege',
	'Piege a Feu': 'PiegeFeu',
	'Piege a Glue': 'PiegeGlue',
	'Contre-Attaquer': 'CA',
	'Coup de Butoir': 'CdB',
	'Course': 'Course',
	'Deplacement Eclair': 'DE',
	'Dressage': 'Dressage',
	'Ecriture Magique': 'EM',
	'Frenesie': 'Frenesie',
	'Golemologie': 'Golemo',
	'Golem de cuir': 'GolemCuir',
	'Golem de metal': 'GolemMetal',
	'Golem de mithril': 'GolemMithril',
	'Golem de papier': 'GolemPapier',
	'Grattage': 'Grattage',
	'Hurlement Effrayant': 'HE',
	'Identification des Champignons': 'IdC',
	'Insultes': 'Insultes',
	'Lancer de Potions': 'LdP',
	'Marquage': 'Marquage',
	'Melange Magique': 'Melange',
	'Miner': 'Miner',
	'Travail de la Pierre': 'Pierre',
	'Necromancie': 'Necro',
	'Painthure de Guerre': 'PG',
	'Parer': 'Parer',
	'Pistage': 'Pistage',
	'Planter un Champignon': 'PuC',
	'Regeneration Accrue': 'RA',
	'Reparation': 'Reparation',
	'Retraite': 'Retraite',
	'RotoBaffe': 'RB',
	'Shamaner': 'Shamaner',
	"S'interposer": 'SInterposer',
	'Tailler': 'Tailler',
	// 'Vol':'Vol',
	/* Sortilèges */
	'Analyse Anatomique': 'AA',
	'Armure Etheree': 'AE',
	'Augmentation de l´Attaque': 'AdA', // obsolète?
	"Augmentation de l'Attaque": 'AdA',
	'Augmentation de l´Esquive': 'AdE',
	'Augmentation des Degats': 'AdD',
	'Bulle Anti-Magie': 'BAM',
	'Bulle Magique': 'BuM',
	'Explosion': 'Explo',
	'Faiblesse Passagere': 'FP',
	'Flash Aveuglant': 'FA',
	'Glue': 'Glue',
	'Griffe du Sorcier': 'GdS',
	'Hypnotisme': 'Hypno',
	'Identification des Tresors': 'IdT',
	'Invisibilite': 'Invi',
	'Levitation': 'Levitation',
	'Precision Magique': 'PreM',
	'Projectile Magique': 'Projo',
	'Projection': 'Proj',
	'Puissance Magique': 'PuM',
	'Rafale Psychique': 'Rafale',
	'Sacrifice': 'Sacro',
	'Siphon des ames': 'Siphon',
	'Telekinesie': 'Telek',
	'Teleportation': 'TP',
	'Vampirisme': 'Vampi',
	'Vision Accrue': 'VA',
	'Vision lointaine': 'VL',
	'Voir le Cache': 'VlC',
	'Vue Troublee': 'VT'
	// '':''
};

// DEBUG - Pour rétrocompatibilité
function getSortComp(nom, niveau) {
	return getTalent(nom, niveau);
}

function getTalent(nom, niveau = '') {
	if (nom === true) {
		return true;
	}
	let nomEnBase = arrayTalents[epure(nom)];
	if (!nomEnBase) {
		nomEnBase = nom;
	}
	if (MY_getValue(`${numTroll}.talent.${nomEnBase}${niveau}`)) {
		return Number(MY_getValue(`${numTroll}.talent.${nomEnBase}${niveau}`));
	}
	return 0;
}

function removeAllTalents() {
	for (let talent in arrayTalents) {
		let nomEnBase = arrayTalents[talent];
		if (MY_getValue(`${numTroll}.talent.${nomEnBase}`)) {
			MY_removeValue(`${numTroll}.talent.${nomEnBase}`);
			continue;
		}
		let niveau = 1;
		while (MY_getValue(`${numTroll}.talent.${nomEnBase}${niveau}`)) {
			MY_removeValue(`${numTroll}.talent.${nomEnBase}${niveau}`);
			niveau++;
		}
	}
}

function isProfilActif() { // DEBUG: Réfléchir à l'utilité de cette fonction
	try {	// Roule 07/06/2017 protection, ça plante si on est dans une callback de XMLHTTPREQUEST
		let att = MY_getValue(`${numTroll}.caracs.attaque`);
		let attbmp = MY_getValue(`${numTroll}.caracs.attaque.bmp`);
		let attbmm = MY_getValue(`${numTroll}.caracs.attaque.bmm`);
		let mm = MY_getValue(`${numTroll}.caracs.mm`);
		let deg = MY_getValue(`${numTroll}.caracs.degats`);
		let degbmp = MY_getValue(`${numTroll}.caracs.degats.bmp`);
		let degbmm = MY_getValue(`${numTroll}.caracs.degats.bmm`);
		let vue = parseInt(MY_getValue(`${numTroll}.caracs.vue`));
		let bmvue = parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`));
		if (att == null || attbmp == null || attbmm == null || mm == null || deg == null ||
			degbmp == null || degbmm == null || vue == null || bmvue == null) {
			return false;
		}
		return true;
	} catch (e) {
		return false;
	}
}

/** x~x Gestion des CDMs ----------------------------------------------- */
function getPVsRestants(pv, bless, vue) {
	bless = Number(bless.match(/\d+/)[0]);
	if (bless == 0) {
		return null;
	}
	let pvminmax = pv.match(/\d+/g);
	let oMinMaxPV = { min: pvminmax[0], max: pvminmax[1] };
	let oMinMaxPVRestant = MZ_getPVsRestants(oMinMaxPV, bless);
	if (vue) {
		if (!oMinMaxPVRestant.min) {
			return oMinMaxPVRestant.max ? ` (\u2A7D${oMinMaxPVRestant.max})` : '';	// U+2A7D 'LESS-THAN OR SLANTED EQUAL TO'
		}
		return oMinMaxPVRestant.max ? ` (${oMinMaxPVRestant.min}-${oMinMaxPVRestant.max})` : ` (\u2A7E${oMinMaxPVRestant.min})`;	// U+2A7E 'GREATER-THAN OR SLANTED EQUAL TO'
	}
	let oRet = ['Points de Vie restants : '];
	if (oMinMaxPVRestant.min) {
		oRet[1] = oMinMaxPVRestant.max ? `Entre ${oMinMaxPVRestant.min} et ${oMinMaxPVRestant.max}` : `\u2A7E${oMinMaxPVRestant.min}`;	// U+2A7E 'GREATER-THAN OR SLANTED EQUAL TO'
	} else {
		oRet[1] = oMinMaxPVRestant.max ? `\u2A7D${oMinMaxPVRestant.max}` : 'inconnu';	// U+2A7D 'LESS-THAN OR SLANTED EQUAL TO'
	}
	return oRet;
}

function MZ_getPVsRestants(oMinMaxPV, bless) {	// rend un objet minmax
	if (bless == 95) {
		return { min: 1, max: Math.floor(oMinMaxPV.max / 20) };
	}
	if (bless == 5) {
		return { min: Math.floor(oMinMaxPV.min * 19 / 20), max: oMinMaxPV.max };
	}
	return { min: Math.ceil(oMinMaxPV.min * (95 - bless) / 100), max: Math.floor(oMinMaxPV.max * (105 - bless) / 100) };
}

function insertButtonCdmSmartphone(nextName, onClick, texte) {
	let tabInput = document.getElementsByName(nextName);
	if (!tabInput) {
		return false;
	}
	let eInput = tabInput[0];
	if (!eInput) {
		return false;
	}
	let eDiv = eInput.parentNode;
	if (!eDiv) {
		return false;
	}
	let eNewDiv = eDiv.cloneNode(true);
	let tabNewSpan = eNewDiv.getElementsByTagName('span');
	if (!tabNewSpan || tabNewSpan.length == 0) {
		return false;
	}
	Array.from(tabNewSpan).forEach((pSpan) => {
		if (pSpan.getElementsByTagName('span').length > 0) {
			return false;
		}
		while (pSpan.firstChild) {
			pSpan.removeChild(pSpan.firstChild);
		}	// vider
		pSpan.appendChild(document.createTextNode(texte));
	});
	let tabNewInput = eNewDiv.getElementsByTagName('input');
	if (!tabNewInput) {
		return false;
	}
	let eNewInput = tabNewInput[0];
	if (!eNewInput) {
		return false;
	}
	eNewInput.onclick = onClick;
	eNewInput.value = texte;
	eNewInput.type = "button";
	insertBefore(eDiv, eNewDiv);
	return true;
}

function insertButtonCdm(nextName, onClick, texte) {
	if (texte == null) {
		texte = 'Participer au bestiaire';
	}
	if (insertButtonCdmSmartphone(nextName, onClick, texte)) {
		return;
	}

	let nextNode = document.getElementsByName(nextName)[0];
	let espace = document.createTextNode('\t');
	insertBefore(nextNode, espace);

	let button = document.createElement('input');
	button.type = 'button';
	button.className = 'mh_form_submit';
	button.value = texte;
	button.onmouseover = function () {
		this.style.cursor = 'pointer';
	};
	if (onClick) {
		button.onclick = onClick;
	}
	insertBefore(espace, button);
	return button;
}

function createCDMTable(id, nom, donneesMonstre, closeFunct) {	// rend un Élément Table
	try {
		let table = document.createElement('table');
		let profilActif = isProfilActif();
		let desk_classes = isPage("MH_Play/Play_vue") ? 'mh_textbox ' : '';
		let ui_classes = isDesktopView() ? `${desk_classes}mh_tdborder` : 'ui-body-c ui-corner-all';
		table.className = ui_classes;
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 4;
		if (!isDesktopView() && isPage("MH_Play/Play_vue")) {
			table.style.fontSize = 'smaller';
		}

		let thead = document.createElement('thead');
		let tr = appendTr(thead, 'mh_tdtitre ui-bar-c');
		let td = appendTdText(tr, `CDM de ${nom} (N° ${id})`, false);
		td.style.fontWeight = 'bold';
		if (closeFunct) {
			td.colSpan = 2;
			td.style.borderRight = 'none';
			td = appendTdText(tr, 'X', false);
			td.style.cursor = 'pointer';
			td.style.textAlign = 'right';
			td.style.fontWeight = 'bold';
			td.style.width = '1%';
			td.style.borderLeft = 'none';
			td.onclick = closeFunct;
		} else {
			td.colSpan = 3;
		}
		table.appendChild(thead);
		let tbody = document.createElement('tbody');
		table.appendChild(tbody);

		// calcul des PX gagnés
		let ominmaxPX = {};
		if (donneesMonstre.niv) {
			if (donneesMonstre.niv.min) {
				ominmaxPX.min = getPXKill(donneesMonstre.niv.min);
			}
			if (donneesMonstre.niv.max) {
				ominmaxPX.max = getPXKill(donneesMonstre.niv.max);
			}
		}

		MZ_tab_carac_add_tr_minmax2(tbody, 'Niveau', donneesMonstre.niv, 'PX', ominmaxPX);
		MZ_tab_carac_add_tr_texte(tbody, 'Famille', donneesMonstre.fam, '');
		// MZ_tab_carac_add_tr_texte(tbody, 'Génération', donneesMonstre.gen == 23 ? '2 ou 3' : donneesMonstre.gen, '');	// remplacé par une icône
		MZ_tab_carac_add_tr_texte(tbody, 'Blessure', MZ_tab_carac_mkBlessureTexte(donneesMonstre), '');
		MZ_tab_carac_add_tr_minmax(tbody, 'Points de Vie', donneesMonstre.pv, 'PV');
		MZ_tab_carac_add_tr_minmax(tbody, 'Attaque', donneesMonstre.att, 'D6');
		MZ_tab_carac_add_tr_minmax(tbody, 'Esquive', donneesMonstre.esq, 'D6');
		MZ_tab_carac_add_tr_minmax(tbody, 'Dégâts', donneesMonstre.deg, 'D3');
		MZ_tab_carac_add_tr_minmax(tbody, 'Régénération', donneesMonstre.reg, 'D3');
		MZ_tab_carac_add_tr_minmax(tbody, 'Armure physique', donneesMonstre.armP, '');
		MZ_tab_carac_add_tr_minmax(tbody, 'Armure magique', donneesMonstre.armM, '');
		MZ_tab_carac_add_tr_minmax(tbody, 'Armure totale', donneesMonstre.arm, '');
		MZ_tab_carac_add_tr_minmax(tbody, 'Vue', donneesMonstre.vue, 'Case(s)');
		MZ_tab_carac_add_tr_minmax(tbody, 'MM', donneesMonstre.MM, '');
		MZ_tab_carac_add_tr_minmax(tbody, 'RM', donneesMonstre.RM, '');
		MZ_tab_carac_add_tr_minmax(tbody, 'Durée du tour', donneesMonstre.duree, ' heures');
		MZ_tab_carac_add_tr_pouvoir(tbody, donneesMonstre);
		MZ_tab_carac_add_tr_autres(tbody, donneesMonstre, id, nom);

		/* à supprimer, remplacé par un "title" sur le 3e td de "autres"
		let msgInfo = MZ_carac_build_nb_cmd_msg(donneesMonstre);
		if (msgInfo) MZ_tab_carac_add_tr_sansTitre(tbody, msgInfo, 0, true);
		*/
		return table;
	} catch (exc) {
		avertissement('Une erreur est survenue (createCDMTable)', null, null, exc);
	}
}

function MZ_tab_carac_mkBlessureTexte(donneesMonstre) {
	if (donneesMonstre.bless === undefined) {
		return;
	}
	let texte = `${donneesMonstre.bless}%`;
	if (donneesMonstre.bless > 0 && donneesMonstre.pv && donneesMonstre.pv.min && donneesMonstre.pv.max) {
		let ominmax = MZ_getPVsRestants(donneesMonstre.pv, donneesMonstre.bless);
		texte = `${texte} (${ominmax.min}-${ominmax.max})`;
	}
	if (donneesMonstre.timegmt) {
		texte = `${texte} le ${MZ_formatDateMS(new Date(donneesMonstre.timegmt * 1000), false)}`;
	}
	return texte;
}

// function MZ_tab_carac_add_tr_sansTitre(table, msg, bItalic) {
// 	if (!msg) { return; }
// 	let tr = appendTr(table, 'mh_tdpage');
// 	td = appendTdText(tr, msg);
// 	td.colSpan = 3;
// 	if (bItalic) { td.style.fontStyle = 'italic'; }
// 	td.className = 'mh_tdpage';
// 	return td;
// }

function MZ_tab_carac_add_tr_pouvoir(tbody, donneesMonstre) {
	if (!donneesMonstre.pouv) {
		return;
	}
	let td = MZ_tab_carac_add_tr_texte(tbody, 'Pouvoir', `${donneesMonstre.pouv} `, '', 0);
	let tabImg = [];
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.portpouv, {
		'de zone': ["zone.gif", "Pouvoir de zone"],
		'automatique': ["automatique.gif", "Pouvoir automatique"],
		'au toucher': ["toucher.gif", "Pouvoir au toucher"]
	});
	for (let iImg = 0; iImg < tabImg.length; iImg++) {
		let thisImg = tabImg[iImg];
		td.appendChild(createImage(URL_MZimg + thisImg[0], thisImg[1]));
	}
}

function MZ_tab_carac_add_tr_autres(table, donneesMonstre, id, nom) {
	let tabImg = [];
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.attd, {
		'1': ['distance.gif', 'Attaque à distance'],
		'~': ['cac.gif', 'Corps à corps']
	});	// si absent
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.nb_att, {
		1: ['1.gif', '1 attaque par tour'],
		2: ['2.gif', '2 attaques par tour'],
		3: ['3.gif', '3 attaques par tour'],
		4: ['4.gif', '4 attaques par tour'],
		5: ['5.gif', '5 attaques par tour'],
		6: ['6.gif', '6 attaques par tour'],
		999: ['plus.gif', "Beaucoup d'attaques par tour"]
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.attm, {
		1: ['magic-wand.png', 'Attaque magique']
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vole, {
		1: ['levite.png', 'Lévite']
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vit, {
		lente: ['lent.gif', 'Lent à se déplacer'],
		normale: ['normal.gif', 'Vitesse normale de déplacement'],
		rapide: ['rapide.gif', 'Déplacement rapide']
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.charg, {
		'vide': [null, null],
		'~': ['charge2.gif', `Possède de l'équipement (${donneesMonstre.charg})`]
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.vlc, {
		1: ['oeil.gif', 'Voit le caché']
	});
	MZ_tab_carac_add_tr_one_img(tabImg, donneesMonstre.gen, {
		1: ['Phoenix1.png', 'Phœnix de première génération'],
		2: ['Phoenix2.png', 'Phœnix de deuxième génération'],
		3: ['Phoenix3.png', 'Phœnix de troisième génération'],
		23: ['Phoenix23.png', 'Phœnix de deuxième ou troisième génération'],
	});

	let tr = appendTr(table, 'mh_tdpage');
	let td = appendTdText(tr, 'Autres', true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	td = appendTd(tr);
	td.className = 'mh_tdpage';
	for (let iImg = 0; iImg < tabImg.length; iImg++) {
		let thisImg = tabImg[iImg];
		td.appendChild(createImage(URL_MZimg + thisImg[0], thisImg[1]));
	}
	if (donneesMonstre.esq != undefined) {
		td.appendChild(MZ_Tactique.createImage(id, nom));
	}

	let txt = String.fromCharCode(160);	// blanc insécable
	if (donneesMonstre.nCdM) {
		txt = donneesMonstre.nCdM;
	}
	let td2 = appendTdText(tr, txt);
	td2.title = MZ_carac_build_nb_cmd_msg(donneesMonstre);
	td2.style.width = '1%';
	let myColor = MZ_CdMColorFromMode(donneesMonstre);
	if (myColor) {
		td2.style.backgroundColor = myColor;
		td2.style.color = 'white';
	}

	return td;
}

function MZ_tab_carac_add_tr_one_img(tabImg, val, listCas) {
	if (val == undefined) {
		return;
	}
	// logMZ('MZ_tab_carac_add_tr_one_img: val=' + val);
	let lVal = `${val}`.toLowerCase();	// astuce : transformer le nombre en string (beurk !)
	if (listCas[lVal]) {
		let t = listCas[lVal];
		if (t[0] == null) {
			return;
		}
		tabImg.push(t);
	} else if (listCas['~']) {
		tabImg.push(listCas['~']);
	}
}

function MZ_tab_carac_add_tr_texte(table, titre, msg, unit) {
	if (!msg) {
		return;
	}
	let tr = appendTr(table, 'mh_tdpage');

	let td = appendTdText(tr, titre, true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	let texte = msg;
	if (unit) {
		texte = `${texte} ${unit}`;
	}
	td = appendTdText(tr, texte);
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}

function MZ_tab_carac_add_tr_minmax(table, titre, ominmax, unit) {
	if (!ominmax) {
		return;
	}
	if (!(ominmax.min || ominmax.max)) {
		return;
	}

	let tr = appendTr(table, 'mh_tdpage');
	let td = appendTdText(tr, titre, true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	let texte = '';
	if (!ominmax.min || ominmax.min == 0) {
		texte = `\u2A7D${ominmax.max}\u00A0${unit}`; // <= (mais plus beau)
	} else if (!ominmax.max) {
		texte = `\u2A7E${ominmax.min}\u00A0${unit}`;	// >=
	} else {
		if (ominmax.min != ominmax.max) {
			texte = `${ominmax.min}-${ominmax.max}\u00A0→\u00A0`;
			if (ominmax.min > ominmax.max) {
				td.style.color = 'red';
				unit = `${unit} *** erreur ***`;
			}
		}
		texte = `${texte}${(ominmax.min + ominmax.max) / 2}\u00A0${unit}`;
	}
	td = appendTdText(tr, texte);
	let texte2 = '';
	if (ominmax.min2 || ominmax.max2) {	// affichage de l'intervalle de confiance à 80%
		if (!ominmax.min2) {
			texte2 = `\u2A7D${ominmax.max2}`; // <= (mais plus beau)
		} else if (!ominmax.max2) {
			texte2 = `\u2A7E${ominmax.min2}`;	// >=
		} else {
			texte2 = `${ominmax.min2}-${ominmax.max2}`;
		}
		let span = document.createElement('span');
		span.appendChild(document.createTextNode(texte2));
		span.style.float = 'right';
		span.style.textAlign = 'right';
		span.style.background = 'yellow';
		td.insertBefore(span, td.firstChild);
		table.title = 'En jaune : intervalle de confiance à 80%';
	}
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}

function MZ_tab_carac_add_tr_minmax2(table, titre, ominmax, unit, ominmaxUnit) {
	if (!ominmax) {
		return;
	}
	if (!(ominmax.min || ominmax.max)) {
		return;
	}

	let tr = appendTr(table, 'mh_tdpage');
	let td = appendTdText(tr, titre, true);
	td.className = 'mh_tdtitre';
	td.width = MZ_EtatCdMs.tdWitdh;

	let texte = '';
	if (!ominmax.min || ominmax.min == 0) {
		texte = `\u2A7D${ominmax.max}`;
	} else if (!ominmax.max) {
		texte = `\u2A7E${ominmax.min}`;
	} else if (ominmax.min != ominmax.max) {
		texte = `${ominmax.min}-${ominmax.max}`;
		if (ominmax.min > ominmax.max) {
			td.style.color = 'red';
			texte = `${texte} *** erreur ***`;
		}
	} else {
		texte = ominmax.min;
	}

	if (ominmaxUnit.min === undefined) {
		if (ominmaxUnit.max === undefined) {
			// ignore (ne devrait pas arriver)
		} else {
			texte = `${texte} \u2192 ${unit}\u2A7D${ominmaxUnit.max}`;
		}
	} else if (ominmaxUnit.max === undefined) {
		texte = `${texte} \u2192 ${unit}\u2A7E${ominmaxUnit.min}`;
	} else if (ominmaxUnit.min != ominmaxUnit.max) {
		texte = `${texte} \u2192 ${ominmaxUnit.min}\u2A7D${unit}\u2A7D${ominmaxUnit.max}`;
		if (ominmaxUnit.min > ominmaxUnit.max) {
			td.style.color = 'red';
			texte = `${texte} *** erreur ***`;
		}
	} else if (isNaN(ominmaxUnit.min)) {
		texte = `${texte} \u2192 ${ominmaxUnit.min}`;
	} else {
		texte = `${texte} \u2192 ${ominmaxUnit.max}\u00A0${unit}`;
	}

	td = appendTdText(tr, texte);
	td.colSpan = 2;
	td.className = 'mh_tdpage';
	return td;
}


/** x~x Gestion des enchantements -------------------------------------- */
var listeMonstreEnchantement = null,
	listeEquipementEnchantement = null,
	listeInfoEnchantement = null;

function computeCompoEnchantement() {
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	let liste = MY_getValue(`${numTroll}.enchantement.liste`).split(';');
	for (let i = 0; i < liste.length; i++) {
		let idEquipement = Number(liste[i]);
		let nomEquipement = MY_getValue(`${numTroll}.enchantement.${idEquipement}.objet`);
		let infoEnchanteur = MY_getValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`);
		if (nomEquipement == null || infoEnchanteur == null) {
			continue;
		}
		infoEnchanteur = infoEnchanteur.split(';');
		let texteGlobal = '';
		for (let j = 0; j < 3; j++) {
			let k = `${numTroll}.enchantement.${idEquipement}.composant.${j}`;
			let v = MY_getValue(k);
			let infoComposant = MY_getValue().split(';');
			if (infoComposant.length < 5) {	// protection Roule 25/08/2017
				logMZ(`err infoComposant k=${k}, v=${v}`);
				continue;
			}
			listeMonstreEnchantement[infoComposant[2]] = 1;
			let array = new Array();
			array[0] = infoComposant[0].replace("Ril", "Œil");
			array[1] = infoComposant[1];
			array[2] = infoComposant[2];
			array[3] = getQualite(infoComposant[3]);
			let texte = infoComposant[4].replace("Ril", "Œil");
			for (let jj = 5; jj < infoComposant.length; jj++) {
				texte = `${texte};${infoComposant[jj].replace("Ril", "Œil")}`;
			}
			texteGlobal = `${texteGlobal}${texte}\n`;
			texte = `${texte} pour l'enchantement d'un(e) ${nomEquipement} chez l'enchanteur n°${infoEnchanteur[0]} (${infoEnchanteur[1]}|${infoEnchanteur[2]}|${infoEnchanteur[3]})`;
			array[4] = texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal = `${texteGlobal}chez l'enchanteur n°${infoEnchanteur[0]} (${infoEnchanteur[1]}|${infoEnchanteur[2]}|${infoEnchanteur[3]})`;
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
}

function isEnchant(nom) {
	let monstreEnchant = '';
	for (let j in listeInfoEnchantement) {
		let monstre = listeInfoEnchantement[j][2].toLowerCase();
		if (`${nom} `.toLowerCase().indexOf(`${monstre} `) >= 0) {
			monstreEnchant = monstre;
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		let infosEnchant = '';
		for (let j in listeInfoEnchantement) {
			let monstre = listeInfoEnchantement[j][2].toLowerCase();
			if (`${nom} `.toLowerCase().indexOf(`${monstre} `) < 0) {
				continue;
			}
			if (infosEnchant == '') {
				infosEnchant = listeInfoEnchantement[j][4];
			} else {
				infosEnchant = `${infosEnchant}\n${listeInfoEnchantement[j][4]}`;
			}
		}
		return trim(infosEnchant);
	} catch (exc) {
		avertissement('Une erreur est survenue (getInfoEnchantementFromMonstre)', null, null, exc);
	}
}

function composantEnchant(Monstre, composant, localisation, qualite) {
	let compo = '';
	for (let i = 0; i < listeInfoEnchantement.length; i++) {
		if (listeInfoEnchantement[i][2].toLowerCase() == Monstre.toLowerCase() &&
			listeInfoEnchantement[i][0].toLowerCase() == composant.toLowerCase() &&
			listeInfoEnchantement[i][1].toLowerCase() == localisation.toLowerCase() &&
			listeInfoEnchantement[i][3] <= qualite
		) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;
}

function insertEnchantInfos(tbody) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		let nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']", tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0) {
			return false;
		}
		let urlImg = `${URL_MZimg}enchant.png`;
		for (let i = 0; i < nodes.snapshotLength; i++) {
			let link = nodes.snapshotItem(i).nextSibling.nextSibling;
			let nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g, ' ');
			let nomCompo = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"), nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ') + 1, nomCompoTotal.length);
			let nomMonstre = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" de Qualité"));
			let qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité") + 11, nomCompoTotal.indexOf(' ['));
			let localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[') + 1, nomCompoTotal.indexOf(']'));
			if (isEnchant(nomMonstre).length <= 0) {
				continue;
			}
			let infos = composantEnchant(nomMonstre, nomCompo, localisation, getQualite(qualite));
			if (infos.length <= 0) {
				continue;
			}
			if (link.parentNode == link.nextSibling.parentNode) {
				link.parentNode.insertBefore(createImage(urlImg, infos), link.nextSibling);
			} else {
				link.parentNode.appendChild(createImage(urlImg, infos));
			}
		}
	} catch (exc) {
		avertissement('Une erreur est survenue (insertEnchantInfos)', null, null, exc);
	}
}

function computeEnchantementEquipement(fontionTexte, fontionFormateTexte) {
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		let nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0) {
			return false;
		}
		let urlImg = `${URL_MZimg}enchant.png`;
		for (let i = 0; i < nodes.snapshotLength; i++) {
			let link = nodes.snapshotItem(i);
			let idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=') + 12);
			idEquipement = parseInt(idEquipement.substring(0, idEquipement.indexOf("'")));
			let nomEquipement = trim(link.firstChild.nodeValue);
			let enchanteur = MY_getValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`);
			if (!enchanteur || enchanteur == '') {
				continue;
			}
			let infos = listeEquipementEnchantement[idEquipement];
			infos = fontionFormateTexte(infos);
			if (infos.length <= 0) {
				continue;
			}
			if (link.parentNode == link.nextSibling.parentNode) {
				link.parentNode.insertBefore(fontionTexte(urlImg, infos), link.nextSibling);
			} else {
				link.parentNode.appendChild(fontionTexte(urlImg, infos));
			}
			MY_setValue(`${numTroll}.enchantement.${idEquipement}.objet`, `${nomEquipement} (${idEquipement})`);
		}
	} catch (exc) {
		avertissement('Une erreur est survenue (computeEnchantementEquipement)', null, null, exc);
	}
}

/** x~x Analyse Tactique ----------------------------------------------- */
if (typeof isPage != "function") {
	function isPage(url) {
		return window.location.pathname.indexOf(`/mountyhall/${url}`) == 0;
	}
}
function isPageWithParam(filters) {
	if (filters.url && window.location.pathname.indexOf(`/mountyhall/${filters.url}`) != 0) return false;
	if (filters.body_id && document.body.id != filters.body_id) return false;
	if (filters.params) {
		let paramsGET = new URLSearchParams(window.location.search);
		for (let param in filters.params)
			if (paramsGET.get(param) != filters.params[param]) return false;
	}
	if (filters.ids)
		for (let id of filters.ids)
			if (!document.getElementById(id)) return false
	if (filters.names)
		for (let name of filters.names)
			if (document.getElementsByName(name).length == 0) return false
	return true;
}
// Cette section est commune à InfoMonstre et Vue

var MZ_Tactique = {
	// --- Variables
	popup: null,

	// --- Méthodes
	// Création de l'image portant le popup tactique
	createImage: function (id, nom) {
		let img = document.createElement('img');
		img.src = URL_MZimg + (isPage('View/MonsterView') ? 'calc.png' : 'calc2.png');
		img.id = id;
		img.nom = nom;
		img.style.verticalAlign = 'middle';
		img.onmouseover = MZ_Tactique.showPopup;
		img.onmouseout = MZ_Tactique.hidePopup;
		return img;
	},

	// Masquage du popup tactique
	hidePopup: function () {
		MZ_Tactique.popup.style.display = 'none';
	},

	initPopup: function () {
		/** @mandatory Initialisation du popup tactique */
		MZ_Tactique.popup = document.createElement('div');
		MZ_Tactique.popup.id = 'MZ_Tactique.popup';
		MZ_Tactique.popup.className = 'mh_textbox';
		MZ_Tactique.popup.style =
			'position: absolute;' +
			'display: none;' +
			'z-index: 3;' +
			'max-width: 400px;';
		document.body.appendChild(MZ_Tactique.popup);
	},

	// Affichage du popup tactique
	showPopup: function (evt) {
		let id, nom;
		try {
			id = this.id;
			nom = this.nom;
			let texte = getAnalyseTactique(id, nom);
			if (texte == undefined || texte == '') {
				return;
			}
			MZ_Tactique.popup.innerHTML = texte;
			// roule 16/03/2016 déclage horizontal différent suivant la page qu'on traite
			if (isPage('View/MonsterView')) {
				MZ_Tactique.popup.style.left = `${Math.min(evt.pageX - 120, window.innerWidth - 300)}px`;
			} else {
				MZ_Tactique.popup.style.left = `${Math.min(evt.pageX + 15, window.innerWidth - 400)}px`;
			}
			MZ_Tactique.popup.style.top = `${evt.pageY + 15}px`;
			MZ_Tactique.popup.style.display = 'block';
		} catch (exc) {
			logMZ(`showPopup() exception pour id=${id}, nom=${nom}`, exc);
		}
	}
};

var g_cnp = new Array(); // Les % de toucher
// coefficients binomiaux
function cnp(n, k) {
	if (g_cnp[n] != null && g_cnp[n][k] != null) {
		return g_cnp[n][k];
	}
	if (g_cnp[n] == null) {
		g_cnp[n] = new Array();
	}
	if (k == 0) {
		g_cnp[n][k] = 1;
		return 1;
	}
	let result = cnp(n - 1, k - 1) * n / k; // mouais... k mul+k div
	g_cnp[n][k] = result;
	// logMZ('cnp(' + n + ',' + k + ')=' + result); // Roule debug
	return result;
}

// by Dab, à comparer
function binom(n, p) {
	if (p < 0 || p > n) {
		return 0;
	}

	if (g_cnp[n]) {
		if (g_cnp[n][p]) {
			return g_cnp[n][p];
		}

		g_cnp[n] = [1];
		g_cnp[n][n] = 1;
		if (p == 0 || p == n) {
			return 1;
		}
	}

	if (2 * p > n) {
		g_cnp[n][p] = binom(n, n - p);
	} else {
		g_cnp[n][p] = binom(n - 1, p - 1) + binom(n - 1, p);
	} // k(k-1)/2 additions

	return g_cnp[n][p];
}

var g_coeff = new Array();
function coef_np(n, p) {
	if (n == 0 && p == 0) {
		return 1;
	}
	if (p > n * 3.5) {
		p = 7 * n - p;
	}
	// roule désactive cache
	if (g_coeff[n] != null && g_coeff[n][p] != null) {
		return g_coeff[n][p];
	}
	if (g_coeff[n] == null) {
		g_coeff[n] = new Array();
	}
	let kmax = Math.floor((p - n) / 6);
	let x = 0;
	for (let k = 0; k <= kmax; k++) {
		x = x + (1 - 2 * (k % 2)) * cnp(n, k) * cnp(p - 6 * k - 1, n - 1);
	}
	g_coeff[n][p] = x;
	// logMZ('cnk(' + n + ',' + p + ')=' + x); // Roule debug
	return x;
}

function chanceEsquiveParfaite(a, d, ba = 0, bd = 0) {
	let win = 0, los = 0;
	// if(6*a+ba<2*(d+bd)) { return 100; }
	// if(a+ba>2*(6*d+bd)) { return 0; }
	for (let dd = d; dd <= 6 * d; dd++) {
		let cd = coef_np(d, dd);
		for (let aa = a; aa <= 6 * a; aa++) {
			if (2 * Math.max(aa + ba, 0) < Math.max(dd + bd, 0)) {
				win = win + cd * coef_np(a, aa);
			} else {
				los = los + cd * coef_np(a, aa);
			}
		}
	}
	// logMZ('chanceEsquiveParfaite, att=' + a + ', esq=' + d + ', ba=' + ba + ', bd=' + bd + ', win=' + win + ', los=' + los); // roule debug
	return Math.round(100 * win / (win + los));
}

function chanceTouche(a, d, ba = 0, bd = 0) {
	let win = 0, los = 0;
	if (a + ba > 6 * d + bd) {
		return 100;
	}
	if (6 * a + ba < d + bd) {
		return 0;
	}
	for (let dd = d; dd <= 6 * d; dd++) {
		let cd = coef_np(d, dd);
		for (let aa = a; aa <= 6 * a; aa++) {
			if (Math.max(aa + ba, 0) > Math.max(dd + bd, 0)) {
				win = win + cd * coef_np(a, aa);
			} else {
				los = los + cd * coef_np(a, aa);
			}
		}
	}
	return Math.round(100 * win / (win + los));
}

function chanceCritique(a, d, ba = 0, bd = 0) {
	let win = 0, los = 0;
	if (a + ba > 2 * (6 * d + bd)) {
		return 100;
	}
	if (6 * a + ba < 2 * (d + bd)) {
		return 0;
	}
	for (let dd = d; dd <= 6 * d; dd++) {
		let cd = coef_np(d, dd);
		for (let aa = a; aa <= 6 * a; aa++) {
			if (Math.max(aa + ba, 0) > 2 * Math.max(dd + bd, 0)) {
				win = win + cd * coef_np(a, aa);
			} else {
				los = los + cd * coef_np(a, aa);
			}
		}
	}
	return Math.round(100 * win / (win + los));
}

/** *********************************************
Analyse tactique
***********************************************/

function getTexteAnalyse(modificateur, chiffre) {
	if (chiffre == 0) {
		return chiffre;
	}
	return modificateur + chiffre;
}

// rend le HTML pour le tableau de la "calculette"
function getAnalyseTactique(id, nom) {
	let donneesMonstre = MZ_EtatCdMs.listeCDM[id];
	let needAutres = false;
	if (donneesMonstre == null) {
		return;
	}
	let array = analyseTactique(donneesMonstre, nom);	// rend tableau de tableaux avec  NomAttaque,chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure
	// logMZ('getAnalyseTactique ' + JSON.stringify(array));
	if (array == null) {
		return "";
	}
	let ui_table = isDesktopView() ? 'mh_tdborder' : 'ui-body-c ui-corner-all';
	let ui_tr = isDesktopView() ? 'mh_tdtitre' : ' ui-bar-c';
	let ui_size = isDesktopView() ? '' : ' font-size: smaller;';
	let str = `<table class='${ui_table}' border='0' cellspacing='1' cellpadding='4' style='background-color:rgb(229, 222, 203);${ui_size}'><tr class='${ui_tr}'><td>Attaque</td><td>Esq. Parfaite</td><td>Touché</td><td>Critique</td><td>Dégâts</td></tr>`;
	let i;
	for (i = 0; i < array.length; i++) {
		if (array[i][1] == 100 && i > 0) {	// si esquive parfaite du Trõll sur le Monstre est assurée pour cette frappe
			needAutres = true;
			break;
		}
		if (i == 1 && array[i][4] > 0) {	// l'attaque normale du Trõll sur le monstre fait des dégâts => gras
			str = `${str}<tr class=mh_tdpage><td><b>${array[i][0]}</b></td><td><b>${getTexteAnalyse(array[i][5], array[i][1])}%</b></td><td><b>${getTexteAnalyse(array[i][5], array[i][2])}%</b></td><td><b>${getTexteAnalyse(array[i][5], array[i][3])}%</b></td><td><b>${getTexteAnalyse(array[i][6], array[i][4])}</b></td></tr>`;
		} else if (i == 0) {	// attaque du monstre sur le Trõll => italique
			str = `${str}<tr class=mh_tdpage><td><i>${array[i][0]}</i></td><td><i>${getTexteAnalyse(array[i][5], array[i][1])}%</i></td><td><i>${getTexteAnalyse(array[i][5], array[i][2])}%</i></td><td><i>${getTexteAnalyse(array[i][5], array[i][3])}%<i></td><td><b><i>${getTexteAnalyse(array[i][6], array[i][4])}<i></b></td></tr>`;
		} else {	// autre, pas de décoration
			str = `${str}<tr class=mh_tdpage><td>${array[i][0]}</td><td>${getTexteAnalyse(array[i][5], array[i][1])}%</td><td>${getTexteAnalyse(array[i][5], array[i][2])}%</td><td>${getTexteAnalyse(array[i][5], array[i][3])}%</td><td><b>${getTexteAnalyse(array[i][6], array[i][4])}</b></td></tr>`;
		}
	}
	if (needAutres) {
		if (i == array.length - 1) {
			str = `${str}<tr class=mh_tdpage><td>${array[i][0]}</td><td>${getTexteAnalyse(array[i][5], array[i][1])}%</td><td>${getTexteAnalyse(array[i][5], array[i][2])}%</td><td>${getTexteAnalyse(array[i][5], array[i][3])}%</td><td><b>${getTexteAnalyse(array[i][6], array[i][4])}</b></td></tr>`;
		} else if (i == 1) {
			str = `${str}<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>`;
		} else {
			str = `${str}<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>`;
		}
	}
	let txtCdM = MZ_carac_build_nb_cmd_msg(donneesMonstre);
	if (txtCdM) {
		str = `${str}<tr class="mh_tdpage"><td colspan="5" style="font-style: italic;">${txtCdM}</td></tr>`;
	}
	return `${str}</table>`;
}

function MZ_carac_build_nb_cmd_msg(donneesMonstre) {
	if (!donneesMonstre) {
		return;
	}
	if (!donneesMonstre.Mode) {
		return;
	}
	switch (donneesMonstre.Mode) {
		case 'cdm':
			return `fondé sur ${Number(donneesMonstre.nCdM)} CdM${donneesMonstre.nCdM > 1 ? 's' : ''} de ce monstre à cet âge`;
		case 'stat':
			return `fondé sur les statistiques de ${Number(donneesMonstre.nCdM)} CdM${donneesMonstre.nCdM > 1 ? 's' : ''} de ce type de monstre (même type, même âge, même template)`;
		case 'statV1':
			return 'fondé sur les statistiques anciennes (MZ V1)';
		case 'nom':
			return 'fondé sur le nom du monstre, pas de CdM';
	}
	return `Mode ${donneesMonstre.Mode}`;
}

// rend un tableau (un par attaque du Trõll ou du monstre) de tableaux contenant:
//	NomAttaque,chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure
function analyseTactique(donneesMonstre, nom) {
	try {
		let listeAttaques = [];
		// Roule 16/03/2016 ajout des ParseInt car je récupérais parfois une chaine non numérique :(
		let att = parseInt(MY_getValue(`${numTroll}.caracs.attaque`), 10);
		let reg = parseInt(MY_getValue(`${numTroll}.caracs.regeneration`), 10);
		let attbmp = parseInt(MY_getValue(`${numTroll}.caracs.attaque.bmp`), 10);
		let attbmm = parseInt(MY_getValue(`${numTroll}.caracs.attaque.bmm`), 10);
		let mm = parseInt(MY_getValue(`${numTroll}.caracs.mm`), 10);
		let deg = parseInt(MY_getValue(`${numTroll}.caracs.degats`), 10);
		let degbmp = parseInt(MY_getValue(`${numTroll}.caracs.degats.bmp`), 10);
		let degbmm = parseInt(MY_getValue(`${numTroll}.caracs.degats.bmm`), 10);
		let vue = parseInt(MY_getValue(`${numTroll}.caracs.vue`), 10);
		let pv = parseInt(MY_getValue(`${numTroll}.caracs.pv`), 10);
		let pvbase = parseInt(MY_getValue(`${numTroll}.caracs.pv.base`), 10);
		let esq = parseInt(Math.max(MY_getValue(`${numTroll}.caracs.esquive`), 10) - parseInt(MY_getValue(`${numTroll}.caracs.esquive.nbattaques`), 0), 10);
		let esqbonus = parseInt(MY_getValue(`${numTroll}.caracs.esquive.bm`), 10);
		let arm = parseInt(MY_getValue(`${numTroll}.caracs.armure`), 10);
		let armbmp = parseInt(MY_getValue(`${numTroll}.caracs.armure.bmp`), 10);
		let armbmm = parseInt(MY_getValue(`${numTroll}.caracs.armure.bmm`), 10);
		let modificateurEsquive = '';
		let modificateurArmure = '';
		let modificateurMagie = '';
		let modificateurEsquiveM = '';
		let modificateurArmureM = '';
		let pasDeSR = false;
		let esqM = 0, attM = 0, armM_mag = 0, armM_phy = 0, armM_tot = 0, degM = 0;
		if (donneesMonstre == null || att == null || attbmp == null || attbmm == null || mm == null || deg == null || degbmp == null || degbmm == null || vue == null || pv == null || esq == null || arm == null) {
			return null;
		}

		debugMZ(`analyseTactique nom=${nom} ${JSON.stringify(donneesMonstre)}`);
		let coeffSeuil = 0.95;
		if (donneesMonstre.index == undefined) {
			// à supprimer
			let td = document.createElement('td');
			td.innerHTML = bbcode(donneesMonstre[4]); // sans déconner ? C'est quoi cette histoire ?
			esqM = 0;
			try {
				esqM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			} catch (exc) {
				debugMZ(`analyseTactique, exception calcul esqM`, exc);
				esqM = Math.ceil(parseInt(td.firstChild.nodeValue));
				modificateurEsquive = '<';
				modificateurArmure = '<';
				modificateurMagie = '<';
			}

			td.innerHTML = bbcode(donneesMonstre[3]);
			attM = 0;
			try {
				attM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			} catch (exc) {
				debugMZ(`analyseTactique, exeception calcul attM`, exc);
				attM = Math.ceil(parseInt(td.firstChild.nodeValue));
				modificateurEsquiveM = '>';
				modificateurArmureM = '>';
			}

			td.innerHTML = bbcode(donneesMonstre[5]);
			degM = 0;
			try {
				degM = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
			} catch (exc) {
				debugMZ(`analyseTactique, exeception calcul degM`, exc);
				degM = Math.ceil(parseInt(td.firstChild.nodeValue));
				modificateurArmureM = '>';
			}

			td.innerHTML = bbcode(donneesMonstre[7]);
			try {
				armM_tot = Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
				armM_mag = armM_tot;	// compatibilité avec ancien calcul
			} catch (exc) {
				debugMZ(`analyseTactique, exeception calcul armM`, exc);
				armM_tot = Math.ceil(parseInt(td.firstChild.nodeValue));
				armM_mag = armM_tot;
				modificateurArmure = '<';
			}

			try {
				td.innerHTML = bbcode(donneesMonstre[9]);
				// debugMZ('analyseTactique, calcul SR, donnessMonstre=' + donneesMonstre[9] + ', bbcode=' + bbcode(donneesMonstre[9]));
				let rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
				let v = rm / mm;
				let seuil = rm < mm ? Math.max(10, Math.floor(v * 50)) : Math.min(90, Math.floor(100 - 50 / v));
				coeffSeuil = (200 - seuil) / 200;
			} catch (exc) {
				debugMZ(`analyseTactique, exeception calcul SR`, exc);
				modificateurMagie = '<';
				pasDeSR = true;
			}
		} else {
			// calcul de modificateurEsquive, modificateurArmure, modificateurMagie, modificateurEsquiveM, modificateurArmureM, pasDeSR, esqM, attM, armM_mag, armM_tot, degM;
			if (donneesMonstre.esq) {
				if (donneesMonstre.esq.min && donneesMonstre.esq.max) {
					esqM = Math.ceil((donneesMonstre.esq.min + donneesMonstre.esq.max) / 2);
				} else if (donneesMonstre.esq.max) {
					esqM = donneesMonstre.esq.max;
					modificateurEsquive = '<';
					modificateurArmure = '<';
					modificateurMagie = '<';
				}
			}

			if (donneesMonstre.att) {
				if (donneesMonstre.att.min && donneesMonstre.att.max) {
					attM = Math.ceil((donneesMonstre.att.min + donneesMonstre.att.max) / 2);
				} else if (donneesMonstre.att.max) {
					attM = donneesMonstre.att.max;
					modificateurEsquiveM = '>';
					modificateurArmureM = '>';
				}
			}

			if (donneesMonstre.armM) {
				if (donneesMonstre.armM.min && donneesMonstre.armM.max) {
					armM_mag = Math.ceil((donneesMonstre.armM.min + donneesMonstre.armM.max) / 2);
				} else if (donneesMonstre.armM.max) {
					armM_mag = donneesMonstre.armM.max;
					modificateurArmure = '<';
				}
				if (donneesMonstre.armP) {
					if (donneesMonstre.armP.min && donneesMonstre.armP.max) {
						armM_phy = Math.ceil((donneesMonstre.armP.min + donneesMonstre.armP.max) / 2);
					} else if (donneesMonstre.armP.max) {
						armM_phy = donneesMonstre.armP.max;
						modificateurArmure = '<';
					}
					armM_tot = armM_mag + armM_phy;
				} else {	// ça ne devrait pas arriver
					armM_tot = armM_mag;
				}
			} else if (donneesMonstre.arm) {
				if (donneesMonstre.arm.min && donneesMonstre.arm.max) {
					armM_tot = Math.ceil((donneesMonstre.arm.min + donneesMonstre.arm.max) / 2);
					armM_mag = armM_tot;	// worst case
				} else if (donneesMonstre.arm.max) {
					armM_tot = donneesMonstre.arm.max;
					armM_mag = armM_tot;
					modificateurArmure = '<';
				}
			}

			if (donneesMonstre.deg) {
				if (donneesMonstre.deg.min && donneesMonstre.deg.max) {
					degM = Math.ceil((donneesMonstre.deg.min + donneesMonstre.deg.max) / 2);
				} else if (donneesMonstre.deg.max) {
					degM = donneesMonstre.deg.max;
					modificateurArmureM = '>';
				}
			}

			if (donneesMonstre.RM) {
				if (donneesMonstre.RM.min && donneesMonstre.RM.max) {
					let rmM = Math.ceil((donneesMonstre.RM.min + donneesMonstre.RM.max) / 2);
					let v = rmM / mm;
					let seuil = rmM < mm ? Math.max(10, Math.floor(v * 50)) : Math.min(90, Math.floor(100 - 50 / v));
					coeffSeuil = (200 - seuil) / 200;
				} else if (donneesMonstre.deg.max) {
					// gath: vide ici, rien a faire ?
				}
				modificateurMagie = '<';
				pasDeSR = true;
			}
		}
		debugMZ(`modificateurEsquive=${modificateurEsquive}, modificateurArmure=${modificateurArmure}, modificateurMagie=${modificateurMagie}, modificateurEsquiveM=${modificateurEsquiveM}, modificateurArmureM=${modificateurArmureM}, pasDeSR=${pasDeSR}, esqM=${esqM}, attM=${attM}, armM_tot=${armM_tot}, armM_mag=${armM_mag}, degM=${degM}, coeffSeuil=${coeffSeuil}`);

		let chanceDEsquiveParfaite = chanceEsquiveParfaite(att, esqM, attbmp + attbmm, 0);
		let chanceDeTouche = chanceTouche(att, esqM, attbmp + attbmm, 0);
		let chanceDeCritique = chanceCritique(att, esqM, attbmp + attbmm, 0);
		// roule debug
		// logMZ('Attaque normale troll sur monstre, att=' + att + ', esqM=' + esqM + ', attbmp=' + attbmp + ', attbmm=' + attbmm
		//	+ ', chanceDEsquiveParfaite=' + chanceDEsquiveParfaite + ', chanceDeTouche=' + chanceDeTouche + ', chanceDeCritique=' + chanceDeCritique);
		let degats = ((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmp + degbmm - armM_tot, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmp + degbmm - armM_tot, 1)) / 100;
		// str += "Attaque normale : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);
		listeAttaques.push(new Array("Attaque normale", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		if (getSortComp("Vampirisme") > 0) {
			let pour = getSortComp("Vampirisme");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(Math.floor(deg * 2 / 3), esqM, attbmm, 0) * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm - armM_mag, 1))) / 100;
			// str += "\nVampirisme : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Vampirisme", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Siphon des âmes") > 0) {
			let pour = getSortComp("Siphon des âmes");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm, 0) * pour / 100);
			degats = ((chanceDeTouche - chanceDeCritique) * Math.max(reg * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(reg * 1.5) * 2 + degbmm - armM_mag, 1)) / 100;
			listeAttaques.push(new Array("Siphon des âmes", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Botte Secrète") > 0) {
			let pour = getSortComp("Botte Secrète");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(Math.floor(2 * att / 3), esqM, Math.floor((attbmp + attbmm) / 2), 0) * pour / 100);
			degats = Math.round((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(deg / 2) * 2 + Math.floor((degbmp + degbmm) / 2) - Math.floor(armM_tot / 2), 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5 / 2) * 2 + Math.floor((degbmp + degbmm) / 2) - Math.floor(armM_tot / 2), 1)) / 100;
			// str += "\nBotte Secrète : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Botte Secrète", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Rafale Psychique") > 0) {
			let pour = getSortComp("Rafale Psychique");
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = Math.round(100 * pour / 100);
			chanceDeCritique = Math.round(0 * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm - armM_mag, 1))) / 100;
			// str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Rafale Psychique", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, '', pasDeSR ? modificateurMagie : ''));
		}
		if (getSortComp("Explosion") > 0) {
			let pour = getSortComp("Explosion");
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = Math.round(100 * pour / 100);
			chanceDeCritique = Math.round(0 * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(1 + deg / 2 + pvbase / 20) * 2, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(1 + deg / 2 + pvbase / 20) * 1.5) * 2, 1))) / 100;
			// str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Explosion", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, '', pasDeSR ? modificateurMagie : ''));
		}
		if (getSortComp("Projectile Magique") > 0) {
			let pour = getSortComp("Projectile Magique");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue, esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(vue, esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(vue, esqM, attbmm, 0) * pour / 100);
			// distance troll - monstre
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(vue / 2) * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(vue / 2) * 1.5) * 2 + degbmm - armM_mag, 1))) / 100;
			// str += "\nProjectile Magique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			if (donneesMonstre.index !== undefined && MZ_EtatCdMs.tr_monstres !== undefined && MZ_EtatCdMs.tr_monstres[donneesMonstre.index] !== undefined) {
				let dist = getMonstreDistance(donneesMonstre.index);
				// if (isDEV) log:W('Dist pour PM=' + dist);
				let vue_bm = parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`), 10);
				let portee = getPortee(vue + vue_bm);
				if (dist <= portee) {
					degats = Math.round((degats + 2 * (portee - dist)) * 100) / 100;
				} else {
					degats = `${degats} (plus bonus de portée)`;
				}
				debugMZ(`analyseTactique, iTR= ${donneesMonstre.index}, dist=${dist}, porteePM=${portee}`);
			} else {
				degats = `${degats} (plus bonus de portée)`;
			}
			listeAttaques.push(new Array("Projectile Magique", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Frénésie") > 0) {
			let pour = getSortComp("Frénésie");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm + attbmp, 0) * pour / 100);
			degats = Math.round((chanceDeTouche - chanceDeCritique) * 2 * Math.max(deg * 2 + degbmp + degbmm - armM_tot, 1) + chanceDeCritique * 2 * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM_tot, 1)) / 100;
			// str += "\nFrénésie : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Frénésie", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Charger") > 0) {
			let pour = getSortComp("Charger");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm + attbmp, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm + attbmp, 0) * pour / 100);
			degats = Math.round((chanceDeTouche - chanceDeCritique) * Math.max(deg * 2 + degbmp + degbmm - armM_tot, 1) + chanceDeCritique * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM_tot, 1)) / 100;
			// str += "\nCharge : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Charger", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Griffe du Sorcier") > 0) {
			let pour = getSortComp("Griffe du Sorcier");
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att, esqM, attbmm, 0) * pour / 100);
			chanceDeTouche = Math.round(chanceTouche(att, esqM, attbmm, 0) * pour / 100);
			chanceDeCritique = Math.round(chanceCritique(att, esqM, attbmm, 0) * pour / 100);
			degats = Math.round(coeffSeuil * ((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(deg / 2) * 2 + degbmm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(deg / 2) * 1.5) * 2 + degbmm, 1))) / 100;
			// str += "\nGriffe du Sorcier : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
			listeAttaques.push(new Array("Griffe du Sorcier", chanceDEsquiveParfaite, chanceDeTouche, chanceDeCritique, degats, modificateurEsquive, modificateurMagie));
		}
		if (getSortComp("Attaque Précise", 1) > 0) {
			let niveau = 5;
			let oldPour = 0;
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = 0;
			chanceDeCritique = 0;
			degats = 0;
			while (niveau > 0) {
				let pour = getSortComp("Attaque Précise", niveau);
				if (pour > oldPour) {
					let chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					let chanceDeToucheNiveau = chanceTouche(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					let chanceDeCritiqueNiveau = chanceCritique(Math.min(att + 3 * niveau, Math.floor(att * 1.5)), esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					chanceDEsquiveParfaite = chanceDEsquiveParfaite + chanceDEsquiveParfaiteNiveau;
					chanceDeTouche = chanceDeTouche + chanceDeToucheNiveau;
					chanceDeCritique = chanceDeCritique + chanceDeCritiqueNiveau;
					degats = degats + ((chanceDeToucheNiveau - chanceDeCritiqueNiveau) * Math.max(deg * 2 + degbmp + degbmm - armM_tot, 1) + chanceDeCritiqueNiveau * Math.max(Math.floor(deg * 1.5) * 2 + degbmm + degbmp - armM_tot, 1)) / 100;
					oldPour = pour;
				}
				niveau--;
			}
			// str += "\nAttaque Précise : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
			listeAttaques.push(new Array("Attaque Précise", chanceDEsquiveParfaite, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		}
		if (getSortComp("Coup de Butoir", 1) > 0) {
			let niveau = 5;
			let oldPour = 0;
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = 0;
			chanceDeCritique = 0;
			degats = 0;
			while (niveau > 0) {
				let pour = getSortComp("Coup de Butoir", niveau);
				if (pour > oldPour) {
					let chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					let chanceDeToucheNiveau = chanceTouche(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					let chanceDeCritiqueNiveau = chanceCritique(att, esqM, attbmm + attbmp, 0) * (pour - oldPour) / 100;
					chanceDEsquiveParfaite = chanceDEsquiveParfaite + chanceDEsquiveParfaiteNiveau;
					chanceDeTouche = chanceDeTouche + chanceDeToucheNiveau;
					chanceDeCritique = chanceDeCritique + chanceDeCritiqueNiveau;
					degats = degats + ((chanceDeToucheNiveau - chanceDeCritiqueNiveau) * Math.max(Math.min(Math.floor(deg * 1.5), deg + 3 * niveau) * 2 + degbmp + degbmm - armM_tot, 1) + chanceDeCritiqueNiveau * Math.max(Math.floor(Math.min(Math.floor(deg * 1.5), deg + 3 * niveau) * 1.5) * 2 + degbmm + degbmp - armM_tot, 1)) / 100;
					oldPour = pour;
				}
				niveau--;
			}
			// str += "\nCoup de Butoir : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
			listeAttaques.push(new Array("Coup de Butoir", chanceDEsquiveParfaite, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		}
		listeAttaques.sort((a, b) => {
			let diff = parseInt(100 * b[4]) - parseInt(100 * a[4]); if (diff == 0) {
				return parseInt(b[1]) - parseInt(a[1]);
			} return diff;
		});
		if (nom.toLowerCase().indexOf("mégacéphale") == -1) {
			chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM, esq, 0, esqbonus));
			chanceDeTouche = Math.round(chanceTouche(attM, esq, 0, esqbonus));
			chanceDeCritique = Math.round(chanceCritique(attM, esq, 0, esqbonus));
		} else {
			chanceDEsquiveParfaite = 0;
			chanceDeTouche = 100;
			chanceDeCritique = 0;
		}
		degats = Math.round((chanceDeTouche - chanceDeCritique) * Math.max(Math.floor(degM) * 2 - arm, 1) + chanceDeCritique * Math.max(Math.floor(Math.floor(degM) * 1.5) * 2 - arm * 2 - armbmm - armbmp, 1)) / 100;

		listeAttaques.unshift(new Array("Monstre", Math.round(chanceDEsquiveParfaite * 100) / 100, Math.round(chanceDeTouche * 100) / 100, Math.round(chanceDeCritique * 100) / 100, Math.round(degats * 100) / 100, modificateurEsquive, modificateurArmure));
		return listeAttaques;
	} catch (exc) {
		let msgid = '';
		try {
			msgid = ` du monstre ${donneesMonstre.id}`;
		} catch (exc2) {
			// pass
		}
		avertissement(`Échec de l'analyse tactique${msgid}`, null, null, exc);
	}
}

/** x~x Gestion des missions ------------------------------------------- */

/*
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Patch :
 * gestion des missions terminées
 */

function checkLesMimis() {	// supprimer les missions finie de numTroll.MISSIONS
	let titresMimis, obMissions;
	try {
		titresMimis = document.evaluate(
			"//b[@class='mh_titre3']/a[contains(@href,'Mission_')]", document, null, 7, null
		);
		obMissions = JSON.parse(MY_getValue(`${numTroll}.MISSIONS`));
	} catch (exc) {
		logMZ('mission_liste initialisation', exc);
		return;
	}

	let enCours = {};
	debugMZ(`checkLesMimis nb=${titresMimis.snapshotLength}`);
	for (let i = 0; i < titresMimis.snapshotLength; i++) {
		debugMZ(`checkLesMimis text=${titresMimis.snapshotItem(i).textContent}`);
		let num = titresMimis.snapshotItem(i).textContent.match(/\d+/)[0];
		enCours[num] = true;
	}

	for (let numMimi in obMissions) {
		if (!enCours[numMimi]) {
			delete obMissions[numMimi];
		}
	}
	MY_setValue(`${numTroll}.MISSIONS`, JSON.stringify(obMissions));
}

function do_mission_liste() {
	checkLesMimis();
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Gestion des actions -------------------------------------------- */

/* TODO
 * getLvl pour Explo, Rotobaffe et cie
 */

/*                             Page de combat                             */

function getLevel() {
	let divList = document.getElementsByTagName('div');
	if (divList.length <= 2) {
		return;
	}

	// On essaie de voir si cette action était une attaque
	let pList = document.getElementsByTagName('p');
	let nomM = '';
	// Modification pour Frénésie by TetDure
	let numAtt = 0;
	for (let i = 0; i < pList.length; i++) {
		if (pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if (nomM && nomM.indexOf('Vous avez attaqué un') == 0) {
				numAtt++;
			}
		}
	}

	if (nomM == '') {
		return;
	}

	// Si c'est une attaque normale, un seul PX
	let comPX = 1;
	if (divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2) {
		comPX++;
	}

	// Extraction des infos du monstre attaqué
	let idM, male;
	if (nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
	} else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
	}
	if (idM == '') {
		return;
	}

	let bList = document.getElementsByTagName('b');
	let niveau = '';
	for (let i = 0; i < bList.length; i++) {
		let b = bList[i];
		if (b.childNodes[0].nodeValue != "TUÉ") {
			continue;
		}
		let nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			if (bList[i].childNodes[0].nodeValue == "TUÉ") {
				return;
			}
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == '') {
			return;
		}
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX) {
			nbPX = 0;
		}
		let chaine = `${male ? "Il" : "Elle"} était de niveau `;
		niveau = (Number(nbPX) + 2 * nivTroll - 10 - comPX) / 3;
		if (comPX > nbPX) {
			chaine = `${chaine}inférieur ou égal à ${Math.floor(niveau)}.`;
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine = `${chaine}${niveau}.`;
		} else {
			chaine = "Mountyzilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if (niveau != '') {
		let button = insertButtonCdm('as_Action');
		button.setAttribute("onClick", `window.open('${URL_pageNiv}?id=${Number(idM)}&monstre=${escape(nomM)}&niveau=${escape(niveau)
			}', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); ` +
			`this.value = 'Merci de votre participation'; this.disabled = true;`);
	}
}

/** x~x Messages du bot : MM/RM ---------------------------------------- */
function insertInfoMagie(node, intitule, magie) {
	if (node.nextSibling) {
		node = node.nextSibling;
		insertBr(node);
		insertText(node, intitule);
		insertText(node, magie, true);
	} else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
	}
}

function getMM(sr) {
	if (rmTroll <= 0) {
		return `Inconnue (quelle idée d'avoir une RM valant${rmTroll} !)`;
	}
	let nsr = Number(sr.match(/\d+/)[0]);
	if (nsr == 10) {
		return `\u2265 ${5 * rmTroll}`;
	}
	if (nsr <= 50) {
		return Math.round(50 * rmTroll / nsr);
	}
	if (nsr < 90) {
		return Math.round((100 - nsr) * rmTroll / 50);
	}
	return `\u2264 ${Math.round(rmTroll / 5)}`;
}

function traiteMM() {
	let mm, node = document.evaluate(
		"//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]", document, null, 9, null
	).singleNodeValue;

	if (node) {
		mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
	} else {
		node = document.evaluate(
			"//p/text()[contains(., 'Seuil de Résistance')]", document, null, 9, null
		).singleNodeValue;
		if (!node) {
			return;
		}
		mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
	}
	insertInfoMagie(node, 'MM approximative de l\'Attaquant...: ', mm);
}

function getRM(sr) {
	if (mmTroll <= 0) {
		return `Inconnue (quelle idée d'avoir une MM valant ${mmTroll} !)`;
	}
	let nsr = Number(sr.match(/\d+/)[0]);
	if (nsr == 10) {
		return `\u2264 ${Math.round(mmTroll / 5)}`;
	}
	if (nsr <= 50) {
		return Math.round(nsr * mmTroll / 50);
	}
	if (nsr < 90) {
		return Math.round(50 * mmTroll / (100 - nsr));
	}
	return `\u2265 ${5 * mmTroll}`;
}

function traiteRM() {
	let nodes = document.evaluate(
		"//b[contains(preceding::text()[1],'Seuil de Résistance')]/text()[1]", document, null, 7, null
	);
	if (nodes.snapshotLength == 0) {
		return;
	}

	for (let i = 0; i < nodes.snapshotLength; i++) {
		let node = nodes.snapshotItem(i);
		let rm = getRM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
	}
}

/** x~x Stats IdT par Raistlin ----------------------------------------- */

/* function getIdt() {
	if(MY_getValue("SEND_IDT") == "non")
		return false;

	let regExpBeginning = /^\s+/;
	let regExpEnd       = /\s+$/;

	let nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donné le résultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if(!nomIdt)
		return false;

	let caracIdt;
	if(nomIdt.indexOf("Malédiction !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(nomIdt.indexOf(" - ")+3);
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
		nomIdt = nomIdt.replace(regExpBeginning, "").replace(regExpEnd, "");
	}
	FF_XMLHttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/


/** x~x Décalage DLA --------------------------------------------------- */
var oldDLA;
function confirmeDecalage() {
	// On vérifie que MH n'excluera pas déjà la demande (validNumeric)
	let nbMinutes = document.getElementById('ai_NbMinutes').value;
	if (!nbMinutes || isNaN(nbMinutes) || nbMinutes < 1) {
		return false;
	}

	let newDLA = new Date(oldDLA);
	newDLA.setMinutes(newDLA.getMinutes() + Number(nbMinutes));
	return window.confirm(
		`Votre DLA sera décalée au : ${MZ_formatDateMS(newDLA, false)
		}\nConfirmez-vous ce décalage ?`
	);
}

function newsubmitDLA(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (confirmeDecalage()) {
		this.submit();
	}
}

function changeActionDecalage() {
	if (MY_getValue('CONFIRMEDECALAGE') != 'true') {
		return;
	}
	try {
		// On récupère le contenu du script JS MH de calcul du décalage
		let scriptTxt = document.evaluate(
			".//script[ not(@src) ]", document, null, 9, null
		).singleNodeValue.textContent;
		// On en extrait la DLA courante
		scriptTxt = scriptTxt.slice(scriptTxt.indexOf('new Date(') + 9);
		scriptTxt = scriptTxt.split('\n')[0];
		let nbs = scriptTxt.match(/\d+/g);
		oldDLA = new Date(nbs[0], nbs[1], nbs[2], nbs[3], nbs[4], nbs[5]);
	} catch (exc) {
		avertissement('Erreur de parsage : confirmation de décalage impossible', null, null, exc);
		logMZ('changeActionDecalage DLA non trouvée');
		return;
	}

	let form = document.getElementsByName('ActionForm')[0];
	if (form) {
		form.addEventListener('submit', newsubmitDLA, true);
	} else {
		avertissement('Erreur de parsage : confirmation de décalage impossible', null, null, '[changeActionDecalage] ActionForm non trouvé');
	}
}

/** x~x Compte à rebours de DLA ---------------------------------------- */
function DMYHMSToDate(t) {
	return new Date(t.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/, "$2/$1/$3 $4:$5:$6"));
}

function DateDiff(d1, d2) {
	let diff = {},
		tmp = Math.floor((d2 - d1) / 1000); // on s'affranchit des 1000e de s

	diff.sec = tmp % 60; tmp = Math.floor((tmp - diff.sec) / 60);
	diff.min = tmp % 60; tmp = Math.floor((tmp - diff.min) / 60);
	diff.hour = tmp % 24; tmp = Math.floor((tmp - diff.hour) / 24);
	diff.day = tmp;

	return diff.day > 5 ? "> 5j" : [
		diff.day > 0 ? `${diff.day}j` : null,
		diff.hour > 0 ? `${diff.hour}h` : null,
		diff.min > 0 ? `${diff.min}m` : null,
		diff.sec > 0 ? `${diff.sec}s` : null
	].filter((o) => {
		return o;
	}).join(" ");
}

function initCompteAreboursDLA() {
	if (MY_getValue('COMPTEAREBOURSDLA') != 'true') {
		return;
	}
	let mhTitle = window.top.document.body.mz_initial_title;
	if (mhTitle === undefined) {
		// mémoriser le titre initial dans le document lui-même
		mhTitle = window.top.document.title;
		window.top.document.body.mz_initial_title = mhTitle;
	}
	let inTitleAlso = (MY_getValue('COMPTEAREBOURSTITRE') == 'true');
	let dlaFavicon = '/favicon.ico';
	let div = document.getElementById('DLA_xyn');
	div.style.marginTop = '10px';
	let br = div.getElementsByTagName('br')[0];
	// logMZ('initCompteAreboursDLA_log' + div.innerHTML);

	let dlaDate = DMYHMSToDate((/DLA:\s+([^<]+)</).exec(div.innerHTML)[1]);
	let cnt = document.createElement('div');

	div.insertBefore(cnt, br);
	div.removeChild(br);
	
	let diff2color = function(diff) {
		if (diff > 20 * 60 * 1000) return;
		if (diff > 5 * 60 * 1000) return 'yellow';
		else if (diff > 0) return 'orange';
		else if (diff > -5 * 60 * 1000) return 'red';
		else return;
	}
	
	let diff2icon = function(diff) {
		if (diff > 20 * 60 * 1000) return dlaFavicon;
		if (diff > 5 * 60 * 1000) return URL_MZimg + 'dangerJaune.ico';
		else if (diff > 0) return URL_MZimg + 'dangerOrange.ico';
		else if (diff > -6 * 60 * 1000) return URL_MZimg + 'dangerRouge.ico';
		else return dlaFavicon;
	}

	let funcTimer = function() {
		let mhDiff = MY_getValue('MZ_rebours_diff_time');
		if (mhDiff == undefined) mhDiff = 0;
		let dlaDiff = dlaDate.getTime() - (new Date()).getTime() - mhDiff;
		//console.log('initCompteAreboursDLA_log : dlaDate=' + dlaDate + ', date=' + (new Date()) + ', mhDiff=' + mhDiff + ', dlaDiff=' + dlaDiff);
		/*
		let dlaTitleString = '';
		let tabEltCnt = [];
		let dlaColor = undefined;
		*/
		let paRestant = parseInt(MY_getValue(`${numTroll}.PA`), 10);
		let showLienActiver = true;
		let showCompteARebours = undefined;	// 1 avec gestion couleur, 2 mode Over-DLA, 3 sans couleur
		let showTitre = undefined;	// 1 pour le mode compte à rebours, 2 pour le mode Over-DLA"
		let clearInterval = false;
		let dlaNext = undefined;
		let showPAPerdus = false;
		//debugMZ('initCompteAreboursDLA_log paRestant=' + paRestant);
		if (dlaDiff > 0) {
			if (paRestant === 0) {
				// affichage compte à rebours sans couleur
				// titre : rien
				showLienActiver = false;
				showCompteARebours = 3;
			} else {
				// affichage compte à rebours avec couleur si besoin
				// affichage lien activer
				// titre :  compte à rebours et icone d'alerte si besoin
				showCompteARebours = 1;
				showTitre = 1;
			}
		} else if (dlaDiff > -(5 * 60 * 1000) && paRestant !== 0) {
			// over-dla
				// affichage compte à rebours en rouge, texte "over-DLA"
				// titre : (Over-DLA) + compte (minutes uniquement) et icone rouge
				showLienActiver = false;
				showCompteARebours = 2;
				showTitre = 2;
		} else {
			let dureeNext = parseInt(MY_getValue(`${numTroll}.caracs.dureeProchainTour`), 10);
			dlaNext = new Date(dlaDate);
			dlaNext.setMinutes(dlaDate.getMinutes() + dureeNext);
			if (!isNaN(dureeNext)) {
				dlaDiff = dlaDiff + dureeNext * 60 * 1000;
			} else {
				dlaDiff = undefined;
			}
			if (dlaDiff === undefined) {
				// affichage lien activer
				// titre : rien
				// stop timer
				clearInterval = true;
			} else if (dlaDiff > 0) {
				// on est avant la DLA suivante
				// affichage compte à rebours avec couleur
				// affichage lien activer
				// titre :  compte à rebours et icone d'alerte si besoin
				showCompteARebours = 1;
				showTitre = 1;
				// arrêt du timer si au moins 20 min avant la DLA
				if (dlaDiff > 20 * 60 * 1000) {
					let d = new Date();
					d.setSeconds(d.getSeconds() + dlaDiff / 1000 - 20 * 60);
					debugMZ('initCompteAreboursDLA_log reveil ' + MZ_formatDateMS(d));
					window.setTimeout(funcTimer, dlaDiff - 20 * 60 * 1000);
					clearInterval = true;
				}
			} else {
				// on est après la DLA suivante
				// affichage lien activer
				// titre : rien
				// stop timer
				clearInterval = true;
				// bricoler dlaDiff pour forcer pas de couleur
				dlaDiff += 3600 * 1000;
			}
			// et, dans tous les cas, on affiche les PA perdus
			showPAPerdus = true;
		}
		
		if (timer && clearInterval) {
			window.clearInterval(timer);
			debugMZ('initCompteAreboursDLA_log kill timer');
			timer = undefined;
		}
		
		while (cnt.firstChild) cnt.removeChild(cnt.lastChild);
		
		if (dlaNext !== undefined) appendTextDiv(cnt, 'suiv : ' + MZ_formatDateMS(dlaNext, false));
				
		let dlaTime, dlaHours, dlaMinutes, dlaSeconds, dlaCompteReboursTexte;
		switch (showCompteARebours) {	// 1 avec gestion couleur, 2 mode Over-DLA, 3 sans couleur
			case 1:
			case 3:
				dlaTime = new Date(dlaDiff);
				dlaHours = Math.floor(dlaDiff / 60 / 60 / 1000);
				dlaMinutes = dlaTime.getUTCMinutes();
				if (dlaMinutes < 10) {
					dlaMinutes = '0' + dlaMinutes;
				}
				dlaSeconds = dlaTime.getUTCSeconds();
				if (dlaSeconds < 10) {
					dlaSeconds = '0' + dlaSeconds;
				}
				dlaCompteReboursTexte = dlaHours + ':' + dlaMinutes + ':' + dlaSeconds;
				appendTextDiv(cnt, 'DLA dans : ' + dlaCompteReboursTexte);
				break;
			case 2:
				dlaTime = new Date(-dlaDiff);
				dlaMinutes = dlaTime.getUTCMinutes();
				dlaSeconds = dlaTime.getUTCSeconds();
				if (dlaSeconds < 10) {
					dlaSeconds = '0' + dlaSeconds;
				}
				dlaCompteReboursTexte = dlaMinutes + ':' + dlaSeconds;
				appendTextDiv(cnt, 'Over-DLA : ' + dlaCompteReboursTexte);
				break;
		}
		
		if (showLienActiver) {
			let ea = appendA(cnt, '/mountyhall/MH_Play/Activate_DLA.php', undefined, 'Vous pouvez réactiver');
			ea.target = '_top';
			ea.style.color = '#AEFFAE';
		}
		
		let dlaColor = diff2color(dlaDiff);
		//debugMZ('initCompteAreboursDLA_log dlaDiff=' + dlaDiff + ', color=' + dlaColor + ', showCompteARebours=' + showCompteARebours + ', paRestant=' + paRestant);
		if (dlaColor === undefined || showCompteARebours == 3) {
			cnt.style.removeProperty("color");
			//debugMZ('initCompteAreboursDLA_log remove color');
		} else {
			cnt.style.color = dlaColor;
			//debugMZ('initCompteAreboursDLA_log set color ' + dlaColor);
		}
		
		if (showPAPerdus && paRestant > 0) appendTextDiv(cnt, 'Vous pourez concentrer ' + paRestant + ' PA');

		if (inTitleAlso) {
			let dlaTitleString = '';
			let icon = dlaFavicon;
			switch (showTitre) {	// 1 pour le mode compte à rebours, 2 pour le mode Over-DLA"
				case 1:
					dlaTitleString = dlaCompteReboursTexte + ' - ';
					icon = diff2icon(dlaDiff);
					break;
				case 2:
					dlaTitleString = 'Over-DLA: ' + dlaCompteReboursTexte + ' - ';
					icon = diff2icon(dlaDiff);
					break;					
			}
			window.top.document.title = dlaTitleString + mhTitle;
			
			let done = false;
			for (let elt of window.top.document.head.children) {
				if (elt.tagName != 'LINK' || elt.rel != 'icon') continue;
				if (elt.href != icon) elt.href = icon;
				done = true;
				break;
			}
			if (!done) {
				let elt = window.top.document.createElement('link');
				elt.rel = 'icon';
				elt.href = icon;
				window.top.document.head.appendChild(elt);
			}
		}
	};

	let timer = setInterval(funcTimer, 1000);
}

/** x~x Alerte Mundi --------------------------------------------------- */
function prochainMundi() {
	let node;
	try {
		node = document.evaluate(
			"//div[@class='dateAction']/b", document, null, 9, null
		).singleNodeValue;
		if (!node) {
			logMZ('skip mundi');
			return;
		}
	} catch (exc) {
		logMZ('prochainMundi Date introuvable', exc);
		return;
	}

	let longueurMois = node.textContent.indexOf('Saison du Hum') == -1 ? 28 : 14;
	let jour = longueurMois + 1 - getNumber(node.textContent);
	if (node.textContent.indexOf('Mundidey') != -1) {
		jour = longueurMois;
	}
	let txt = '[MZ : Prochain Mundidey ';
	if (jour > 1) {
		txt = `${txt}dans ${jour} jours]`;
	} else {
		txt = `${txt}demain]`;
	}
	let br = node.parentNode.nextSibling;
	if (br.nodeName == '#text') br = br.nextSibling;
	let div = insertTextDiv(br, txt, true);
	div.style.textAlign = 'center';
	div.style.marginBottom = '-5px';
	if (br.nodeName == 'BR') br.parentNode.removeChild(br);
}

/*                            Fonction principale                             */

function dispatch() {
	if (isPage('MH_Play/Play_action')) {
		prochainMundi();
	} else if (isPage('MH_Play/Play_a_Decaler.php')) {
		changeActionDecalage();
	} else if (isPage('MH_Play/Actions')) {
		if (document.evaluate(
			"//form/descendant::p/text()[contains(., 'Zone Piégée')]", document, null, 2, null
		).stringValue) {
			traiteMM();
		} else if (document.evaluate(
			"//tr/td/descendant::p/text()[contains(., 'identification a donné')]", document, null, 2, null
		).stringValue) {
			// getIdt();
			traiteRM();
		} /* else {
			// Est censé se lancer sur quoi *précisément* ?
			traiteRM();
			getLevel();
		}*/
	} else {
		/* Traitement des messages du bot */
		let messageTitle = document.evaluate(
			"//form/table/tbody/tr[1]/td[1]/descendant::text()[contains(.,'[MountyHall]')]", document, null, 2, null
		).stringValue;
		if (messageTitle.indexOf('Attaquant') != -1 && messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
		} else if (messageTitle.indexOf('Résultat du pouvoir') != -1 || messageTitle.indexOf('Défenseur') != -1) {
			traiteMM();
		} else if (messageTitle.indexOf('Identification des trésors') != -1 ||
			// à replacer avec Attaque après révision getLvl :
			messageTitle.indexOf('Explosion') != -1 ||
			messageTitle.indexOf('Insulte') != -1) {
			traiteRM();
		}
	}
}

function do_actions() {
	start_script(31, 'do_actions_log');
	dispatch();
	do_memoPA();
	displayScriptTime(undefined, 'do_actions_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x Pré-enchantement ----------------------------------------------- */
/* 2013-08-19 : correction auto syntaxe alert */

var combobox = null;

function changeObject() {
	if (!combobox) {
		return;
	}
	let id = combobox.options[combobox.selectedIndex].value;
	let texte = combobox.options[combobox.selectedIndex].firstChild.nodeValue;
	if (!id || id == "") {
		MY_removeValue(`${numTroll}.enchantement.lastEquipement`);
		return;
	}
	MY_setValue(`${numTroll}.enchantement.lastEquipement`, `${id};${texte}`);
}

function treatePreEnchantement() {
	let input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!input || input.getAttribute("type") == "hidden") {
		return false;
	}
	MY_setValue(`${numTroll}.enchantement.lastEnchanteur`, input.getAttribute("value"));
	combobox = document.evaluate("//select[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!combobox) {
		return true;
	}
	combobox.addEventListener('change', changeObject, true);
	return true;
}

function treateEnchantement_pre() {
	let input = document.evaluate("//input[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!input || input.getAttribute("type") != "hidden") {
		return false;
	}
	let idEquipement = input.getAttribute("value");
	let nomEquipement = `Equipement inconnu (${idEquipement})`;
	let enchanteur = MY_getValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`);
	if (enchanteur && enchanteur != null) {
		return true;
	}
	input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!input || input.getAttribute("type") != "hidden") {
		return false;
	}
	let idEnchanteur = input.getAttribute("value");

	let nodes = document.evaluate("//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3) {
		return;
	}
	for (let i = 0; i < 3; i++) {
		let texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une ", " d'un ");
		let compo = texte.substring(0, texte.indexOf(" d'un "));
		let monstre = texte.substring(texte.indexOf(" d'un ") + 6, texte.indexOf(" d'au minimum"));
		let qualite = texte.substring(texte.indexOf("Qualité ") + 8, texte.indexOf(" ["));
		let localisation = texte.substring(texte.indexOf("[") + 1, texte.indexOf("]"));
		// avertissement(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(`${numTroll}.enchantement.${idEquipement}.composant.${i}`, `${compo};${localisation};${monstre.replace(/ Géante?/, "")};${qualite};${trim(nodes.snapshotItem(i).nodeValue)}`);
	}
	MY_setValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`, `${idEnchanteur};${MY_getValue(`${numTroll}.position.X`)};${MY_getValue(`${numTroll}.position.Y`)};${MY_getValue(`${numTroll}.position.N`)}`);
	MY_setValue(`${numTroll}.enchantement.${idEquipement}.objet`, nomEquipement);
	let liste = MY_getValue(`${numTroll}.enchantement.liste`);
	if (!liste || liste == "") {
		MY_setValue(`${numTroll}.enchantement.liste`, idEquipement);
	} else {
		MY_setValue(`${numTroll}.enchantement.liste`, `${liste};${idEquipement}`);
	}
}

function do_pre_enchant() {
	start_script(60, 'do_pre_enchant_log');
	if (!treatePreEnchantement()) {
		treateEnchantement_pre();
	}
	displayScriptTime(undefined, 'do_pre_enchant_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x Enchantement --------------------------------------------------- */
/* 2013-08-19 : correction auto syntaxe alert */

function treateEnchantement() {
	let idEnchanteur = MY_getValue(`${numTroll}.enchantement.lastEnchanteur`);
	let infoEquipement = MY_getValue(`${numTroll}.enchantement.lastEquipement`);
	if (!idEnchanteur || idEnchanteur == "" || !infoEquipement || infoEquipement == "") {
		return;
	}
	let tab = infoEquipement.split(";");
	if (tab.length < 2) {
		return;
	}
	let idEquipement = tab[0];
	let nomEquipement = tab[1];
	for (let i = 2; i < tab.length; i++) {
		nomEquipement = `${nomEquipement};${tab[i]}`;
	}

	let nodes = document.evaluate("//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3) {
		return;
	}
	for (let i = 0; i < 3; i++) {
		let texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une ", " d'un ");
		let compo = texte.substring(0, texte.indexOf(" d'un "));
		let monstre = texte.substring(texte.indexOf(" d'un ") + 6, texte.indexOf(" d'au minimum"));
		monstre = monstre.replace(/ Géante?/, "");
		let qualite = texte.substring(texte.indexOf("Qualité ") + 8, texte.indexOf(" ["));
		let localisation = texte.substring(texte.indexOf("[") + 1, texte.indexOf("]"));
		// avertissement(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(`${numTroll}.enchantement.${idEquipement}.composant.${i}`, `${compo};${localisation};${monstre.replace(/ Géante?/, "")};${qualite};${trim(nodes.snapshotItem(i).nodeValue)}`);
	}
	MY_setValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`, `${idEnchanteur};${MY_getValue(`${numTroll}.position.X`)};${MY_getValue(`${numTroll}.position.Y`)};${MY_getValue(`${numTroll}.position.N`)}`);
	MY_setValue(`${numTroll}.enchantement.${idEquipement}.objet`, nomEquipement);
	let liste = MY_getValue(`${numTroll}.enchantement.liste`);
	if (!liste || liste == "") {
		MY_setValue(`${numTroll}.enchantement.liste`, idEquipement);
	} else {
		MY_setValue(`${numTroll}.enchantement.liste`, `${liste};${idEquipement}`);
	}
}

function do_enchant() {
	start_script(60, 'do_enchant_log');

	treateEnchantement();
	MY_removeValue(`${numTroll}.enchantement.lastEquipement`);
	MY_removeValue(`${numTroll}.enchantement.lastEnchanteur`);
	displayScriptTime(undefined, 'do_enchant_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x MyEvent -------------------------------------------------------- */
// Script désactivé en attendant la màj vers le nouveau système de missions.
function do_myevent() { }

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x Malus ---------------------------------------------------------- */
/* v1.4 - 2014-01-06
 * - Gestion des sorts double composante
 * v1.4.1 - 2014-01-22
 * - Correction décumul
 * TODO
 * - Identifier la position de "PV" dans l'ordre MH
 */

var listeBM;

/** x~x Utilitaires ---------------------------------------------------- */
function decumul(bmt, nbr) {
	let bmr;
	if (!nbr || nbr < 2) {
		bmr = bmt;
	} else if (nbr == 2) {
		bmr = parseInt(0.67 * bmt);
	} else if (nbr == 3) {
		bmr = parseInt(0.40 * bmt);
	} else if (nbr == 4) {
		bmr = parseInt(0.25 * bmt);
	} else if (nbr == 5) {
		bmr = parseInt(0.15 * bmt);
	} else {
		bmr = parseInt(0.1 * bmt);
	}
	if (bmt < 0) {
		return Math.min(-1, bmr);
	}
	return Math.max(1, bmr);
}

function triecaracs(a, b) { // version Yoyor, mod by Dab
	// Roule 23/11/2016 ajout PV
	switch (a) {
		case 'ATT':
			return -1;
		case 'ESQ':
			if (b == 'ATT') {
				return 1;
			}
			return -1;
		case 'DEG':
			switch (b) {
				case 'ATT':
				case 'ESQ':
					return 1;
				default:
					return -1;
			}
		case 'REG':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
					return 1;
				default:
					return -1;
			}
		case 'Vue':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
					return 1;
				default:
					return -1;
			}
		case 'TOUR':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
					return 1;
				default:
					return -1;
			}
		case 'PV':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
					return 1;
				default:
					return -1;
			}
		case 'Armure':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
					return 1;
				default:
					return -1;
			}
		case 'RM':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
					return 1;
				default:
					return -1;
			}
		case 'MM':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
					return 1;
				default:
					return -1;
			}
		case 'Concentration':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
				case 'MM':
					return 1;
				default:
					return -1;
			}
		case 'Fatigue':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
				case 'MM':
				case 'Concentration':
					return 1;
				default:
					return -1;
			}
		case "Dés d'attaque":
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
				case 'MM':
				case 'Concentration':
				case 'Fatigue':
					return 1;
				default:
					return -1;
			}
		case 'Dés de dégâts':
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
				case 'MM':
				case 'Concentration':
				case 'Fatigue':
				case "Dés d'attaque":
					return 1;
				default:
					return -1;
			}
		default:
			switch (b) {
				case 'ATT':
				case 'ESQ':
				case 'DEG':
				case 'REG':
				case 'Vue':
				case 'TOUR':
				case 'PV':
				case 'Armure':
				case 'RM':
				case 'MM':
				case 'Concentration':
				case 'Fatigue':
				case "Dés d'attaque":
				case 'Dés de dégâts':
					return 1;
				default:
					return -1;
			}
	}
}

/** x~x Fonctions hide / display --------------------------------------- */
function toggleDetailsBM() {
	if (MY_getValue('BMDETAIL') != 'false') {
		MY_setValue('BMDETAIL', 'false');
		let trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for (let i = 0; i < trlist.length; i++) {
			trlist[i].style.display = 'none';
		}
		trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for (let i = 0; i < trlist.length; i++) {
			trlist[i].style = '';
		}
	} else {
		MY_setValue('BMDETAIL', 'true');
		let trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for (let i = 0; i < trlist.length; i++) {
			trlist[i].style.display = 'none';
		}
		trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for (let i = 0; i < trlist.length; i++) {
			trlist[i].style = '';
		}
	}
}

function toggleBMList() {
	if (MY_getValue('BMHIDELIST') == 'true') {
		MY_setValue('BMHIDELIST', 'false');
		for (let i = 0; i < listeBM.snapshotLength; i++) {
			listeBM.snapshotItem(i).style = '';
		}
		document.getElementsByTagName('thead')[0].style = '';
		document.getElementById('trhelp').style = '';
	} else {
		MY_setValue('BMHIDELIST', 'true');
		for (let i = 0; i < listeBM.snapshotLength; i++) {
			listeBM.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
		document.getElementById('trhelp').style.display = 'none';
	}
}

function setDisplayBM() {
	if (!listeBM) {
		return;
	}

	let titre = document.getElementById('MHTitreH2');
	if (titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleBMList;
	}

	let tfoot = document.getElementsByTagName('tfoot')[0];
	let tr = document.evaluate(
		"./tr/td/text()[contains(.,'décumul')]/../..", tfoot, null, 9, null
	).singleNodeValue;
	tr.id = 'trhelp';

	if (MY_getValue('BMHIDELIST') == 'true') {
		for (let i = 0; i < listeBM.snapshotLength; i++) {
			listeBM.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
		tr.style.display = 'none';
	}
}

/** x~x Traitement Malus --------------------------------------- */
function traiteMalus() {
	let mainTab = document.getElementById('bmm');
	if (!mainTab) {
		logMZ('traiteMalus: pas de table bmm');
		return;
	}
	let tbody = mainTab.tBodies[0];
	if (!tbody) {
		logMZ('traiteMalus: pas de BM (pas de tbody)');
		return;
	}

	/* Suppression des BM de fatigue stockés */
	if (MY_getValue(`${numTroll}.bm.fatigue`)) {
		MY_removeValue(`${numTroll}.bm.fatigue`);
	}

	/* Extraction des données */
	let uniListe = [], listeDurees = {}, listeDecumuls = {};
	let nb = 0;
	for (let tr of tbody.rows) {
		nb++;
		let effetsT = tr.cells[1].textContent.split(' | ');
		let phymag = tr.cells[3].textContent;
		let duree = tr.cells[4].textContent.match(/\d+/);
		if (duree == null) {	// Roule 28/01/2018 protection malus Crasc sans durée
			duree = 1;
		} else {
			duree = Number(duree[0]);
		}
		// Roule 23/11/2016 tout semble être soumis à décumul (vérifié pour Charme, Drain de vie)
		// si c'est un type à décumul
		/*
		let type = tr.childNodes[3].textContent;
		switch(type) {
			case 'Potion':
			case 'Parchemin':
			case 'Sortilège':
			case 'Capacité Spéciale':
				nom = tr.childNodes[1].textContent+phymag;
				break;
			default:
				nom = 'pasdedecumul';
		}
		*/
		let nom = tr.childNodes[1].textContent + phymag;
		// !! Amnésie = Capa, mais pas décumulée
		if (nom.indexOf('Amnésie') != -1) {
			nom = 'pasdedecumul';
		}

		uniListe[nb] = {
			duree: duree,
			nom: nom, // permet de gérer le non décumul des sorts à double composante
			caracs: {}
		};
		for (let i = 0; i < effetsT.length; i++) {
			if (effetsT[i].indexOf(':') == -1) {
				continue;
			}
			// structure : liste[nb]=[duree , nom , [type ,] Array[caracs] ]
			// nom = 'pasdedecumul' si pas de décumul
			let carac = trim(effetsT[i].substring(0, effetsT[i].indexOf(':')));
			if (carac == 'ATT' || carac == 'DEG' || carac == 'Armure') {
				uniListe[nb].type = phymag;
			}
			let tmatch = effetsT[i].match(/(-?\d+)(\\([+-]?\d+))?/);	// un numérique et exceptionnellement un autre numérique précédé d'un antislash
			let bm;
			if (tmatch[2] == undefined) {
				bm = Number(tmatch[1]);
			}	// cas DEG : -6
			else {
				bm = Number(tmatch[3]);
			}	// cas DEG : +0\-5
			uniListe[nb].caracs[carac] = bm;
			debugMZ(`effetsT[${i}]=${effetsT[i]}, uniListe[${nb}]['caracs'][${carac}] = ${bm}, durée=${duree} tmatch=${JSON.stringify(tmatch)}`);
			listeDurees[duree] = true;
		}
	}	// fin boucle sur les lignes de bonus/malus

	/* Gestion des décumuls et cumuls des durées */
	let toursGeres = [];
	for (let d in listeDurees) {
		toursGeres.push(d);
	}
	toursGeres.sort((a, b) => {
		return b - a;
	});
	debugMZ(`toursGeres=${JSON.stringify(toursGeres)}\nuniListe=${JSON.stringify(uniListe)}`);
	let strfat = ''; // pour sauvegarder les bm de fatigue
	// Pour affichage & adpatation à footable.js (statique)
	let thead = document.getElementsByTagName('thead')[0];
	let nbHidden = document.evaluate(
		"./tr/th[@style='display: none;']", thead, null, 7, null
	).snapshotLength;
	let tfoot = document.getElementsByTagName('tfoot')[0];

	for (let i = 0; i < toursGeres.length; i++) {
		let tour = toursGeres[i];
		let effetsCeTour = {}, decumulsCeTour = {};
		for (let nbb = 1; nbb < uniListe.length; nbb++) {
			if (uniListe[nbb].duree < toursGeres[i]) {
				continue;
			} // si durée pvr < durée analysée, on passe
			let nom = uniListe[nbb].nom;
			if (nom != 'pasdedecumul') {
				if (decumulsCeTour[nom] == null) {
					decumulsCeTour[nom] = 0;
				}
				decumulsCeTour[nom]++;
			}
			for (let carac in uniListe[nbb].caracs) {
				let bm = uniListe[nbb].caracs[carac];
				if (carac == 'ATT' || carac == 'DEG' || carac == 'Armure') {
					let type = uniListe[nbb].type;
					if (!effetsCeTour[carac]) {
						effetsCeTour[carac] = { Physique: 0, Magique: 0 };
					}
					let thisBm;
					if (nom == 'pasdedecumul') {
						thisBm = bm;
					} else {
						thisBm = decumul(bm, decumulsCeTour[nom]);
					}
					effetsCeTour[carac][type] += thisBm;
					debugMZ(`calcul décumul tour=${tour}, nom=${nom}, carac=${carac}, bm=${bm}, type=${type}, decumulsCeTour[nom]=${decumulsCeTour[nom]} : ${thisBm} => ${effetsCeTour[carac][type]}`);
				} else {
					if (!effetsCeTour[carac]) {
						effetsCeTour[carac] = 0;
					}
					let thisBm;
					if (nom == 'pasdedecumul' || carac == 'Fatigue') {
						thisBm = bm;
					} else if (carac == 'TOUR') {
						thisBm = decumul(2 * bm, decumulsCeTour[nom]) / 2;
					} // les durees se comptent en demi-minutes dans MH
					else {
						thisBm = decumul(bm, decumulsCeTour[nom]);
					}
					effetsCeTour[carac] += thisBm;
					debugMZ(`calcul décumul tour=${tour}, nom=${nom}, carac=${carac}, bm=${bm}, decumulsCeTour[nom]=${decumulsCeTour[nom]} : ${thisBm} => ${effetsCeTour[carac]}`);
				}
			}	// fin boucle sur les caractéristiques
		}	// fin boucle sur les bonus/malus

		/* Création du bilan du tour */
		let texteD = '', texteS = '';
		let caracGerees = [];
		for (let k in effetsCeTour) {
			caracGerees.push(k);
		}
		caracGerees.sort(triecaracs);

		for (let j = 0; j < caracGerees.length; j++) {
			let carac = caracGerees[j], str = '';
			debugMZ(`traiteMalus, j=${j}, carac=${carac}, effetsCeTour=${effetsCeTour[carac]}, toursGeres=${toursGeres[i]}`);

			switch (carac) {
				case 'ATT':
				case 'DEG':
				case 'Armure':
					let phy = effetsCeTour[carac].Physique;
					let mag = effetsCeTour[carac].Magique;
					texteD = texteD + (phy || mag ? ` | ${carac} : ${aff(phy)}\\${aff(mag)}` : '');
					texteS = texteS + (phy + mag ? ` | ${carac} : ${aff(phy + mag)}` : '');
					break;
				case 'TOUR':
					str = effetsCeTour[carac] ? ` | TOUR : ${aff(effetsCeTour[carac])} min` : '';
					break;
				case 'Fatigue':
					strfat = `${strfat}${toursGeres[i]}-${effetsCeTour[carac]};`;
				case 'PV':
				case 'PVMax':
				case 'ESQ':
				case 'REG':
				case 'Vue':
				case 'VUE':
				case 'Voir le Caché':
					str = effetsCeTour[carac] ? ` | ${carac} : ${aff(effetsCeTour[carac])}` : '';
					break;
				default:
					str = effetsCeTour[carac] ? ` | ${carac} : ${aff(effetsCeTour[carac])} %` : '';
			}
			if (str) {
				texteD = texteD + str;
				texteS = texteS + str;
			}
			debugMZ(`traiteMalus, j=${j}, strfat=${strfat}`);
		}	// fin boucle sur les caractéristiques

		/* Affichage */
		// Si rien à afficher on passe
		if (!texteD) {
			continue;
		}
		// Si BMM+BMP=0
		texteS = texteS ? texteS.substring(3) : 'Aucun effet';
		let tr = insertTr(tfoot.childNodes[2], 'mh_tdpage BilanDetail');
		if (MY_getValue('BMDETAIL') == 'false') {
			tr.style.display = 'none';
		}
		let td = appendTdText(tr, texteD.substring(3));
		td.colSpan = 4 - nbHidden;
		let txttour = `${toursGeres[i]} Tour`;
		if (toursGeres[i] > 1) {
			txttour = `${txttour}s`;
		}
		appendTdText(tr, txttour);

		tr = insertTr(tfoot.childNodes[2], 'mh_tdpage BilanSomme');
		if (MY_getValue('BMDETAIL') != 'false') {
			tr.style.display = 'none';
		}
		td = appendTdText(tr, texteS);
		td.colSpan = 4 - nbHidden;
		appendTdText(tr, txttour);
	}	// fin boucle sur les tours générés

	/* mise en place toggleDetails */
	tfoot.style.cursor = 'pointer';
	tfoot.onclick = toggleDetailsBM;

	/* Stockage fatigue : tour-fatigue;tour-fatigue;... */
	if (strfat) {
		MY_setValue(`${numTroll}.bm.fatigue`, strfat);
	}
}

function do_malus() {
	try {
		start_script(undefined, 'do_malus_log');
		traiteMalus();
		setDisplayBM();
		displayScriptTime(undefined, 'do_malus_log');
	} catch (exc) {
		avertissement('Une erreur est survenue (do_malus)', null, null, exc);
	}
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Mouches -------------------------------------------------------- */
var mainTab, tr_mouches;

function initialiseMouches() {
	// Lanceur global
	try {
		mainTab = document.getElementById('mouches');
		tr_mouches = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	} catch (exc) {
		avertissement('Une erreur est survenue (mouches)', null, null, exc);
		return;
	}
	if (mainTab === void 0 || tr_mouches.snapshotLength == 0) {
		return;
	}

	setDisplayMouches();
	traiteMouches();
}

function setDisplayMouches() {
	// Initialise l'affichage / l'effacement du détail des mouches
	let titre = document.getElementById('MHTitreH2');
	if (titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleMouches;
	}

	let tfoot = document.getElementsByTagName('tfoot')[0];
	if (tfoot) {
		tfoot.style.cursor = 'pointer';
		tfoot.onclick = toggleMouches;
	}

	if (MY_getValue('HIDEMOUCHES') == 'true') {
		for (let i = 0; i < tr_mouches.snapshotLength; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function toggleMouches() {
	// Handler pour afficher / masquer les détails
	if (MY_getValue('HIDEMOUCHES') == 'true') {
		MY_setValue('HIDEMOUCHES', 'false');
		for (let i = 0; i < tr_mouches.snapshotLength; i++) {
			tr_mouches.snapshotItem(i).style.display = '';
		}
		document.getElementsByTagName('thead')[0].style.display = '';
	} else {
		MY_setValue('HIDEMOUCHES', 'true');
		for (let i = 0; i < tr_mouches.snapshotLength; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function traiteMouches() {
	// Traitement complet: présence et effets des mouches
	let listeTypes = {}, effetsActifs = {};
	debugMZ(`traiteMouches, tr_mouches.length=${tr_mouches.snapshotLength}`);

	for (let i = 0; i < tr_mouches.snapshotLength; i++) {
		let tr = tr_mouches.snapshotItem(i);

		// La mouche est-elle présente?
		let etat = document.evaluate(
			'./img', tr.cells[6], null, 9, null
		).singleNodeValue.alt;
		// debugMZ('traiteMouches, i=' + i + ', etat=' + etat + ', type=' + trim(tr.cells[3].textContent));
		if (etat != 'La Mouche est là') {
			continue;
		}
		// Extraction du type de mouche
		let type = trim(tr.cells[3].textContent);
		if (!listeTypes[type]) {
			listeTypes[type] = 1;
		} else {
			listeTypes[type]++;
		}
		// debugMZ('traiteMouches, i=' + i + ', etat=' + etat + ', type=' + type + ', nb=' + listeTypes[type]);

		// La mouche a-t-elle un effet?
		let effet = trim(tr.cells[2].textContent);
		if (etat != 'La Mouche est là' || !effet) {
			continue;
		}
		// Si oui, extraction des effets (multiples pour pogées)
		let caracs = effet.split(' | ');
		for (let j = 0; j < caracs.length; j++) {
			let carac = caracs[j].substring(0, caracs[j].indexOf(':') - 1);
			let valeur = Number(caracs[j].match(/-?\d+/)[0]);
			if (effetsActifs[carac] === void 0) {
				effetsActifs[carac] = valeur;
			} else {
				effetsActifs[carac] += valeur;
			}
		}
	}

	// Extraction Effet total et affichage des différences à la normale
	let tfoot = document.getElementsByTagName('tfoot')[0];
	if (!tfoot) {
		debugMZ('traiteMouches, pas de tfoot');
		return;
	}
	let nodeTotal = document.evaluate(
		".//b[contains(./text(),'Effet total')]", tfoot, null, 9, null
	).singleNodeValue.nextSibling;
	let effetsTheoriques = nodeTotal.nodeValue.split('|');
	let texte = ' ';
	for (let i = 0; i < effetsTheoriques.length; i++) {
		if (texte.length > 1) {
			texte = `${texte} | `;
		}
		let carac = trim(
			effetsTheoriques[i].substring(0, effetsTheoriques[i].indexOf(':') - 1)
		);
		let valeur = effetsTheoriques[i].match(/-?\d+/)[0];
		if (effetsActifs[carac] !== void 0 && effetsActifs[carac] == valeur) {
			texte = texte + effetsTheoriques[i];
		} else {
			texte = `${texte}<b>${carac} : ${aff(effetsActifs[carac])}`;
			if (carac == 'TOUR') {
				texte = `${texte} min`;
			}
			texte = `${texte}</b>`;
		}
	}
	let span = document.createElement('span');
	span.innerHTML = texte;
	nodeTotal.parentNode.replaceChild(span, nodeTotal);

	// Affichage des différences du nombre de mouches de chaque type
	let mouchesParType = document.evaluate("./tr/td/ul/li/text()", tfoot, null, 7, null);
	for (let i = 0; i < mouchesParType.snapshotLength; i++) {
		let node = mouchesParType.snapshotItem(i);
		// let mots = node.nodeValue.split(' ');
		// let type = mots.pop();
		let tMatch = node.nodeValue.match(/([0-9]+) .*à *([^ ]+)/);
		if (!tMatch) {
			continue;
		}
		let nMouche = tMatch[1];
		let type = tMatch[2];
		debugMZ(`traiteMouches, texte=${node.nodeValue}, tMatch=${JSON.stringify(tMatch)}, type=${type}`);
		if (!listeTypes[type]) {
			node.nodeValue = `${node.nodeValue} (0 présente)`;
		} else if (nMouche != listeTypes[type]) {
			if (listeTypes[type] == 1) {
				node.nodeValue = `${node.nodeValue} (1 présente)`;
			} else {
				node.nodeValue = `${node.nodeValue} (${listeTypes[type]} présentes)`;
			}
		}
	}
}

function do_mouches() {
	start_script(undefined, 'do_mouches_log');
	initialiseMouches();
	displayScriptTime(undefined, 'do_mouches_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x Equipement Gowap ----------------------------------------------- */

function initPopupEquipgowap() {
	let popup = document.createElement('div');
	popup.setAttribute('id', 'popupGwp');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; visibility: hidden;' +
		'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopupGwp(evt) {
	let texte = this.getAttribute("texteinfo");
	let popup = document.getElementById('popupGwp');
	popup.innerHTML = texte;
	popup.style.left = `${evt.pageX + 15}px`;
	popup.style.top = `${evt.pageY}px`;
	popup.style.visibility = "visible";
}

function hidePopupGwp() {
	let popup = document.getElementById('popupGwp');
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text) {
	let img = document.createElement('img');
	img.setAttribute('src', url);
	img.setAttribute('align', 'ABSMIDDLE');
	img.setAttribute("texteinfo", text);
	img.addEventListener("mouseover", showPopupGwp, true);
	img.addEventListener("mouseout", hidePopupGwp, true);
	return img;
}

function formateTexte(texte) {
	texte = texte.replace(/\n/g, "<br/>");
	texte = texte.replace(/^([^<]*) d'un/g, "<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g, "<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g, "$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g, "$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g, "[<b>$1</b>]");
	return texte;
}


function treateGowaps() {
	// On récupère les gowaps possédants des composants
	let tbodys = document.evaluate(
		"//tr[@class='mh_tdpage_fo']/descendant::img[@alt = 'Composant - Spécial']/../../..",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (let j = 0; j < tbodys.snapshotLength; j++) {
		let tbody = tbodys.snapshotItem(j);
		// let id_gowap = currentURL.substring(currentURL.indexOf("?ai_IdFollower=") + 15) * 1;
		// insertButtonComboDB(tbody, 'gowap', id_gowap,'mh_tdpage_fo');
		// if (MY_getValue("NOINFOEM") != "true") { insertEMInfos(tbody); }
		if (MY_getValue(`${numTroll}.enchantement.liste`) && MY_getValue(`${numTroll}.enchantement.liste`) != "") {
			insertEnchantInfos(tbody);
		}
	}
}

function treateChampi() {
	if (MY_getValue("NOINFOEM") == "true") {
		return false;
	}
	let nodes = document.evaluate(
		"//img[@alt = 'Champignon - Spécial']/../a/text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
	);
	if (nodes.snapshotLength == 0) {
		return false;
	}

	for (let i = 0; i < nodes.snapshotLength; i++) {
		let node = nodes.snapshotItem(i);
		let texte = trim(node.nodeValue.replace(/\240/g, " "));
		if (texte.indexOf("*") != -1) {
			texte = texte.substring(0, texte.lastIndexOf(" "));
		}
		let nomChampi = texte.substring(0, texte.lastIndexOf(" "));
		if (moisChampi[nomChampi]) { // gath: 'moisChampi' is not defined
			appendText(node.parentNode.parentNode, ` [Mois ${moisChampi[nomChampi]}]`);
		}
	}
}

function do_equipgowap() {
	start_script(undefined, 'do_equipgowap');

	treateGowaps();
	treateChampi();
	if (MY_getValue(`${numTroll}.enchantement.liste`) && MY_getValue(`${numTroll}.enchantement.liste`) != "") {
		initPopupEquipgowap();
		computeEnchantementEquipement(createPopupImage, formateTexte);
	}

	displayScriptTime(undefined, 'do_equipgowap');
}

/** *******************************************************************************
*   This file is part of zoryazilla & mountyzilla, published under GNU License   *
*********************************************************************************/

/** x~x Ordres Gowap --------------------------------------------------- */

var MZ_analyse_page_ordre_suivant;
var MZ_fo_ordres = isPageWithParam({url: 'MH_Play/Play_a_Action', ids:['t_fo_ordre']});
if (MZ_analyse_page_ordre_suivant === undefined && MZ_fo_ordres) {
	// objet réutilisé dans MZ, dans Trajet_canvas et dans une extension perso ☺
	MZ_analyse_page_ordre_suivant = {
		result: { ordres: [] },
		init: function () {
			// façon blindée de tester la variable MY_DEBUG
			debugMZ('start MZ_analyse_page_ordre_suivant.init');
			try {
				let e_t_ordres = document.getElementById('t_fo_ordre');
				for (let ligne of e_t_ordres.getElementsByTagName('caption')) {
					//debugMZ('MZ_analyse_page_ordre_suivant_log ' + ligne.innerText);
					for (let div of ligne.getElementsByTagName('div')) {
						//debugMZ('MZ_analyse_page_ordre_suivant_log div ' + j + ' ' + div.innerText);
						let tabmatch = div.innerText.match(/(\d+) *\.* *(.*\[.*\].*)$/);
						if (tabmatch) {
							// ID, Nom
							this.result.id = tabmatch[1].trim();
							this.result.nom = tabmatch[2].trim();
						}
						tabmatch = div.innerText.match(/(\d+) *PA.*X = (-?\d+).*Y = (-?\d+).*N = (-?\d+)/i);
						if (tabmatch) {
							// PA, x, y, n
							this.result.PA = parseInt(tabmatch[1]);
							this.result.x = parseInt(tabmatch[2]);
							this.result.y = parseInt(tabmatch[3]);
							this.result.n = parseInt(tabmatch[4]);
							// Trajet_canvas a besoin d'un pointeur vers cette div
							this.result.eltPos = div;
						}
					}
				}
				for (let ligne of e_t_ordres.rows) {
					//debugMZ(`MZ_analyse_page_ordre_suivant td[0]=${ligne.textContent}`);
					for (let td of ligne.getElementsByTagName('td')) {
						let tabmatch = td.textContent.match(/^(.*)X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/i);
						if (tabmatch) {
							this.result.ordres.push({ ordre: tabmatch[1].trim(), x: parseInt(tabmatch[2]), y: parseInt(tabmatch[3]), n: parseInt(tabmatch[4]) });
						} else {
							tabmatch = td.textContent.match(/^\s*Aller\s*chercher\s*le\s*trésor\s*\[\s*(\d+)\s*\](.*)$/i);
							if (tabmatch) {
								this.result.ordres.push({ ordre: tabmatch[0].trim(), idtresor: parseInt(tabmatch[1]), nomtresor: trim(tabmatch[2]) });
							} else {
								this.result.ordres.push({ ordre: td.textContent.trim() });
							}
						}
					}
				}
				debugMZ(`fin MZ_analyse_page_ordre_suivant ${JSON.stringify(this.result)}`);
			} catch (exc) {
				logMZ('Exception dans MZ_analyse_page_ordre_suivant.init', exc);
			}
		}
	};
	MZ_analyse_page_ordre_suivant.init();
}

var MZ_analyse_page_suivants;
if (isPage("MH_Play/Play_e_follo")) {
	if (MZ_analyse_page_suivants === undefined) {
		// Roule 26/07/2021
		// Fonction réutilisée dans MZ, dans Trajet_canvas et dans une extension perso ☺
		// rend un object, par exemple
		MZ_analyse_page_suivants = {
			suivants: [],	// objet de type oMZ_TrSuivant
			eTabSuivant: undefined,
			init: function () {
				this.eTabSuivant = document.getElementById('suivants');
				if (!this.eTabSuivant) {
					logMZ("MZ_analyse_page_suivants : pas d'élément 'suivants' dans la page");
					return;
				}
				for (let eTr of this.eTabSuivant.rows) {
					let oSuivant = new this.oMZ_TrSuivant(eTr);
					if (oSuivant.oJSON) {
						this.suivants.push(oSuivant);
					} else {
						// logMZ('MZ_analyse_page_suivants ignore tr ' + eTr.innerHTML);
					}
				}
			},
			oMZ_getTrTresorSuivant: function (eTrTitre) {
				let eTr2 = eTrTitre.nextElementSibling;
				if (!eTr2) {
					return;
				}
				if (eTr2.tagName != 'TR') {
					return;
				}
				let eTd = eTr2.cells[0];
				if (!eTd) {
					return;
				}
				if (!eTd.classList.contains('mh_tdpage')) {
					return;
				}
				return eTr2;
			},
			oMZ_TrSuivant: function (eTr) {	// ceci est un objet
				// .eTrTi   : le TR HTML de titre
				// .eTrTr   : le TR HTML des trésors
				// .oJSON : l'objet reçu en JSON dans le data-json
				// .nom   : le nom complet
				// .categories : tableau d'objets de type oMz_categorieTresorSuivant
				// .bVide : true si le suivant est vide
				// .loc : objet avec x, y, n
				this.eTrTi = eTr;
				this.eTrTr = MZ_analyse_page_suivants.oMZ_getTrTresorSuivant(eTr);
				for (let eDiv of this.eTrTi.cells[0].getElementsByTagName('div')) {
					let sTextDiv = eDiv.textContent.trim();
					if (eDiv.classList.contains('mh_titre3')) {
						this.nom = sTextDiv;
						if (this.loc) {
							break;
						}
					}
					let m = sTextDiv.match(/(\d+) *PA *-* *X *= *(-?\d+) \| Y\n* *= *(-?\d+) \| N\n* *= *(-?\d+)/i);
					if (m && m.length >= 5) {
						this.loc = new Object();
						this.loc.x = parseInt(m[2], 10);
						this.loc.y = parseInt(m[3], 10);
						this.loc.n = parseInt(m[4], 10);
						if (this.nom) {
							break;
						}
					}
				}

				this.oMZ_categorieSuivant = function (oSuivant, eTable, eDiv) {	// object
					this.oMZ_tresor = function (row) {	// objet
						this.id = parseInt(row.id.substring(3, 999));
					};

					this.eTableCategorie = eTable;
					this.eDivTresors = eDiv;
					this.eTableTresors = eDiv.children[0];
					this.tresors = [];
					if (this.eTableTresors.nodeName == 'TABLE') {
						for (let row of this.eTableTresors.rows) {
							this.tresors.push(new this.oMZ_tresor(row));
						}
					}
				};

				// lecture des infos des trésors et valorisation de this.categories
				this.initTresors = function () {
					let eTd = this.eTrTr.cells[0];
					if (!eTd) {
						return;
					}
					let eContenu = eTd.children[0];
					if (!eContenu || eContenu.tagName == "DIV") {	// no equipement
						this.bVide = true;
						return;
					}
					// énumération des catégories. 2 éléments pour chaque
					this.categories = [];
					for (let i = 0, l = eTd.children.length; i < l; i++) {
						let eTable = eTd.children[i];
						let sTag = eTable.tagName;
						if (sTag == 'SCRIPT') {
							continue;
						}	// c'est le cas pour le premier suivant qui porte du matos
						if (sTag == 'STYLE') {
							continue;
						}	// ça pourrait bien se produire aussi...
						if (sTag != 'TABLE') {	// ce n'est pas normal
							logMZ(`oMZ_TrSuivant.initTresors id=${this.oJSON.id}, élément de type non attendu : ${sTag}`);
							continue;
						}
						// le suivant doit être une DIV
						if (++i >= l) {
							logMZ(`oMZ_TrSuivant.initTresors id=${this.oJSON.id}, pas d'élément suivant`);
							continue;
						}
						let eDiv = eTd.children[i];
						if (eDiv.tagName != 'DIV') {
							logMZ(`oMZ_TrSuivant.initTresors id=${this.oJSON.id}, élément suivant de type non attendu : ${eDiv.tagName}`);
							continue;
						}
						let oCategorie = new this.oMZ_categorieSuivant(this, eTable, eDiv);
						// logMZ('oMZ_TrSuivant.initTresors oCategorie=' + oCategorie);
						this.categories.push(oCategorie);
					}
				};

				for (let eTd of eTr.cells) {
					if (eTd.hasAttribute('data-json')) {
						// logMZ('oMZ_TrSuivant json=' + eTd.getAttribute('data-json'));
						this.oJSON = JSON.parse(eTd.getAttribute('data-json'));
						break;
					}
					for (let eDiv of eTd.getElementsByTagName('div')) {
						if (eDiv.hasAttribute('data-json')) {
							// logMZ('oMZ_TrSuivant json=' + eDiv.getAttribute('data-json'));
							this.oJSON = JSON.parse(eDiv.getAttribute('data-json'));
						}
					}
					if (this.oJSON) {
						break;
					}
				}
			},
			autoTest: function () {
				logMZ(`MZ_analyse_page_suivants.autoTest : nb suivants=${this.suivants.length}`);
				for (let oSuivant of this.suivants) {
					logMZ(JSON.stringify(oSuivant));
				}
			},
		};
		MZ_analyse_page_suivants.init();
	}
	//MZ_analyse_page_suivants.autoTest();
}

// version Roule' janvier 2017
function MZ_setCarteUnGogoHTML5() {
	// fabriquer la liste des positions successives
	let listeDepl = [];	// ce sera un tableau d'objets
	listeDepl = MZ_analyse_page_ordre_suivant.result.ordres.slice(0);	// clone array
	listeDepl.unshift(MZ_analyse_page_ordre_suivant.result);	// le result de MZ_analyse_page_ordre_suivant a déjà juste les bonne propriétés

	MZ_showCarteBottom([listeDepl]);	// L'arg est un tableau de tableaux d'objets
}

// L'arg est un tableau de tableaux d'objets (trajets des suivants)
function MZ_showCarteBottom(listeSuiv) {
	// générer la carte
	let carte = new carte_MZ('cartegogo', listeSuiv);
	// positionner la carte
	let eCarte = carte.getElt();
	eCarte.style.textAlign = 'left';
	eCarte.style.marginTop = '2px';
	let footer = getFooter();
	if (footer) {
		insertBefore(footer, eCarte);
	} else {
		document.body.appendChild(eCarte);
	}
}

function MZ_setCarteTousGogoHTML5() {
	// partie récupérée de "trajet gowaps" de feldspath et Vapulabehemot
	let ligne, tabForm = document.getElementsByTagName("form");
	if (tabForm.length < 0) {
		ligne = [0].getElementsByTagName("tbody")[0].childNodes;
	}	// ancienne version
	else {
		ligne = document.getElementById("mhPlay").getElementsByTagName("tbody")[0].childNodes;
	}
	let suivants = [];
	for (let i = 0; i < ligne.length; i++) {
		if (ligne[i].nodeName != "TR" || !ligne[i].getElementsByTagName('a')[0]) {
			continue;
		}
		let cas = ligne[i].getElementsByTagName("td")[0];
		// if (cas.className == "mh_tdtitre") {
		if (cas.className == "mh_tdtitre_fo") { // correction par Vapulabehemot (82169) le 10/07/2015
			let oGogo = {};
			oGogo.id = parseInt(cas.getElementsByTagName('a')[0].href.split("=")[1]);
			oGogo.nom = trim(cas.getElementsByTagName('a')[0].firstChild.nodeValue);
			let point = cas.innerHTML.match(/X[ \n\r]+=[ \n\r]+(-?\d+)[ \n\r]+\|[ \n\r]+Y[ \n\r]+=[ \n\r]+(-?\d+)[ \n\r]+\|[ \n\r]+N =[ \n\r]+(-?\d+)/);	// Roule 21/01/2020 des espaces multiples et un saut de ligne sont apparus entre "Y" et "="
			oGogo.x = parseInt(point[1]);
			oGogo.y = parseInt(point[2]);
			oGogo.n = parseInt(point[3]);
			suivants.push([oGogo]);	// un suivant ayant un trajet d'une seule étape
		}
	}
	if (suivants.length == 0) {
		return;
	}
	MZ_showCarteBottom(suivants);	// L'arg est un tableau de tableaux d'objets
}

function MZ_setCarteTP() {
	// regexp compliquée par le fait que MH met une rupture de ligne dans les coord dans la page Lieu_Description.php
	let pos = window.document.getElementsByTagName("body")[0].innerHTML.match(/X[\n\r\t ]*=[\n\r\t ]*(-?\d+)[\n\r\t ]*\|[\n\r\t ]*Y[\n\r\t ]*=[\n\r\t ]*(-?\d+) *\|[\n\r\t ]*N[\n\r\t ]*=[\n\r\t ]*(-?\d+)/i);
	let sortie = { x: parseInt(pos[1]), y: parseInt(pos[2]), n: parseInt(pos[3]), id: '', nom: 'Sortie TP', typ: 'tp' };
	MZ_showCarteBottom([[sortie]]);	// L'arg est un tableau de tableaux d'objets
}

function testeGlissiere() {
	try {
		let gliss = new glissiere_MZ('test', 'Test glissière', 'xxx', false, 100, 50, 250);
		let footer = getFooter();
		insertBefore(footer, gliss.getElt());
	} catch (exc) {
		logMZ('testeGlissiere', exc);
	}
}

function MZ_testsUnitairesCalculIntermediaire(x0, y0, x1, y1) {
	if (x0 !== undefined) {
		// ouais, récursif une fois
		let PtInterm = pointIntermediaireMonstre2D({ x: x0, y: y0 }, { x: x1, y: y1 });
		if (PtInterm === undefined) {
			logMZ(`pt interm(${x0},${y0})(${x1},${y1}) => rien`);
		} else {
			logMZ(`pt interm(${x0},${y0})(${x1},${y1}) => (${PtInterm.x},${PtInterm.y})`);
		}
		return;
	}
	// MZ_testsUnitairesCalculIntermediaire(10, 10, 100, 100);
	// MZ_testsUnitairesCalculIntermediaire(10, 100, 100, 10);
	// MZ_testsUnitairesCalculIntermediaire(100, 10, 10, 100);
	// MZ_testsUnitairesCalculIntermediaire(100, 100, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(10, 10, 100, 80);
	MZ_testsUnitairesCalculIntermediaire(10, 10, 80, 100);
	MZ_testsUnitairesCalculIntermediaire(10, 100, 80, 10);
	MZ_testsUnitairesCalculIntermediaire(10, 80, 100, 10);
	MZ_testsUnitairesCalculIntermediaire(100, 10, 10, 80);
	MZ_testsUnitairesCalculIntermediaire(80, 10, 10, 100);
	MZ_testsUnitairesCalculIntermediaire(100, 80, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(80, 100, 10, 10);
	MZ_testsUnitairesCalculIntermediaire(-80, 100, -10, 10);
	MZ_testsUnitairesCalculIntermediaire(80, -100, 10, -10);
	MZ_testsUnitairesCalculIntermediaire(-80, -100, -10, -10);
	MZ_testsUnitairesCalculIntermediaire(35, -87, 45, -87);
	MZ_testsUnitairesCalculIntermediaire(45, -87, 45, -77);
}

function do_ordresgowap() {
	MZ_setCarteUnGogoHTML5();		// Version Roule janvier 2017
	// testeGlissiere();
	// MZ_testsUnitairesCalculIntermediaire();
}

function do_listegowap() {
	if (MY_getValue('MZ_upgradeVueSuivants') !== undefined) {
		MZ_upgradeVueSuivants();
	}
	MZ_setCarteTousGogoHTML5();
}

function MZ_upgradeVueSuivants() {
	if (MZ_analyse_page_suivants == undefined) {
		logMZ('MZ_upgradeVueSuivants impossible, pas de MZ_analyse_page_suivants');
		return;
	}
	let bVueCompressee = MZ_getValueBoolean('MZ_SuivantsCompress');
	let bTresorUnique = MZ_getValueBoolean('MZ_SuivantsTresUnique');
	let nMaxOrdres = MY_getValue('MZ_SuivantsOrdres');
	if (bVueCompressee && MZ_analyse_page_suivants.eTabSuivant) {
		// reduce padding of all TD
		let e = MZ_analyse_page_suivants.eTabSuivant.getElementsByTagName('TD');
		for (let iRow = 0; iRow < e.length; iRow++) {
			e[iRow].style.paddingTop = '0';
			e[iRow].style.paddingBottom = '0';
		}
	}
	for (let oSuivant of MZ_analyse_page_suivants.suivants) {
		if (nMaxOrdres != undefined) {
			let tabTxtOrdre = [];
			let nDisplayOrdre = 0;
			let lastSecouerAllerChercher = undefined;
			if (oSuivant.oJSON.ordres) {
				for (let oOrdre of oSuivant.oJSON.ordres) {
					tabTxtOrdre.push(oOrdre.ordre);
					if (nMaxOrdres > 0 && nDisplayOrdre >= nMaxOrdres - 1) {
						break;
					}
					if (nMaxOrdres < 0) {
						if (oOrdre.ordre.indexOf('rrêt') >= 0) {
							break;
						}
						if (oOrdre.ordre.indexOf('ller chercher') >= 0) {
							lastSecouerAllerChercher = nDisplayOrdre;
						}
						if (oOrdre.ordre.indexOf('secouer') >= 0) {
							lastSecouerAllerChercher = nDisplayOrdre;
						}
						if (oOrdre.ordre.indexOf('uivre') >= 0) {
							break;
						}
					}
					nDisplayOrdre++;
				}
			}
			if (lastSecouerAllerChercher != undefined) {
				tabTxtOrdre = tabTxtOrdre.slice(0, lastSecouerAllerChercher + 1);
			}
			let eOuterDiv = document.createElement('div');
			eOuterDiv.id = `MZ_suiv_outer_${oSuivant.oJSON.id}`;
			eOuterDiv.style.width = "100%";
			eOuterDiv.style.fontSize = '12px';
			eOuterDiv.style.display = 'inline-block';

			let eDLA = document.createElement('div');
			eDLA.id = `MZ_suiv_dla_${oSuivant.oJSON.id}`;
			eDLA.style.whiteSpace = 'nowrap';
			let d = new Date(oSuivant.oJSON.dla);
			eDLA.appendChild(document.createTextNode(`DLA : ${MZ_formatDateMS(d, false)}`));
			eDLA.style.display = 'inline-block';
			eOuterDiv.appendChild(eDLA);

			if (tabTxtOrdre.length > 0) {
				let eA = document.createElement('a');
				eA.id = `MZ_suiv_ordres_${oSuivant.oJSON.id}`;
				eA.style.display = 'inline-block';
				eA.style.cssFloat = 'right';
				eA.style.whiteSpace = 'nowrap';
				eA.href = `/mountyhall/MH_Play/Play_a_Action.php?type=F&id=-4&sub=ordres&id_target=${oSuivant.oJSON.id}`;
				eA.title = 'Accès direct aux ordres';
				eA.appendChild(document.createTextNode(tabTxtOrdre.join(' / ')));
				eOuterDiv.appendChild(eA);
			} else {
				eOuterDiv.style.display = 'none';
			}

			oSuivant.eTrTi.cells[0].appendChild(eOuterDiv);
		}
		if (!bVueCompressee && !bTresorUnique) {
			continue;
		}
		oSuivant.initTresors();
		if (oSuivant.bVide) {	// no equipement
			if (bVueCompressee) {
				oSuivant.eTrTr.style.display = 'none';
			}
			continue;
		}
		if (!bTresorUnique) {
			continue;
		}	// la suite ne concerne que l'affichage des trésors uniques

		for (let oCategorie of oSuivant.categories) {
			if (oCategorie.eTableTresors.rows.length != 1) {
				continue;
			}
			oCategorie.eTableCategorie.style.display = 'none';
			oCategorie.eDivTresors.style.display = '';
			// copy weight from category to single trésor
			try {	// ignore error
				let e = oCategorie.eTableCategorie.rows[0].cells[3];	// cell containing total weight
				let s = e.textContent.match(/poids total *\u00A0*: *(.*)$/i)[1];
				e = oCategorie.eTableTresors.rows[0].cells[4];	// cell for weight of first trésor
				e.innerHTML = s;
				oCategorie.eTableTresors.rows[0].cells[3].style.whiteSpace = 'nowrap';
			} catch (exc) {
				logMZ('Erreur dans copie poids', exc);
			}
		}
	}
}

function do_lieuDescription() {
	if (window.document.getElementsByTagName("body")[0].innerHTML.indexOf("Portail : Portail de T") != -1) {
		MZ_setCarteTP();
	}
}

function do_lieuTeleport() {
	changeButtonValidate();
	MZ_setCarteTP();
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Infomonstre ---------------------------------------------------- */

// DEBUG
var g_nomMonstre = '', g_idMonstre = -1;
// let tbody;

function traiteMonstre() {
	let texte;
	try {
		let nodeTitre = document.evaluate(
			"//div[@class='titre2' and contains(text(),'(')]", document, null, 9, null
		).singleNodeValue;
		if (nodeTitre != null) {
			texte = nodeTitre.firstChild.nodeValue;
		} else {
			let tabEventDescription = document.getElementsByClassName('mh_monstres');
			if (tabEventDescription[0] != undefined) {
				let eltNom = tabEventDescription[0];
				texte = eltNom.textContent;
				// logMZ('traiteMonstre, nom sans id=' + texte);
				// find next textElement
				let eCurrent = eltNom;
				while (eCurrent = eCurrent.parentNode) {
					// logMZ('traiteMonstre, eCurrent.nodeName=' + eCurrent.nodeName);
					let eSibling = eCurrent.nextSibling;
					if (!eSibling) {
						// logMZ('traiteMonstre, pas de sibling');
						continue;
					}
					// logMZ('traiteMonstre, eSibling.nodeName=' + eSibling.nodeName + ', texte=' + eSibling.textContent);
					if (eSibling.nodeType != 3) {
						continue;
					}
					texte = `${texte} ${eSibling.textContent.replace(/[ .]/g, '')}`;
					break;
				}
			} else {
				logMZ('traiteMonstre, impossible de trouver le nom du monstre');
				return;
			}
		}
		// logMZ('traiteMonstre, nom=' + texte);
	} catch (exc) {
		logMZ('traiteMonstre', exc);
		return;
	}

	g_nomMonstre = texte.slice(0, texte.indexOf('(') - 1);
	if (g_nomMonstre.indexOf(']') != -1) {
		g_nomMonstre = g_nomMonstre.slice(0, g_nomMonstre.indexOf(']') + 1);
	}
	g_idMonstre = texte.match(/[^\]]\].*\((\d+)\)/)[1];
	let tReq = [{ index: 1, id: Number(g_idMonstre), nom: g_nomMonstre }];	// "+" pour forcer du numérique
	FF_XMLHttpRequest({
		method: 'POST',
		url: URL_MZgetCaracMonstre,
		headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		data: `l=${JSON.stringify(tReq)}`,
		trace: 'demande niveaux monstres V2, MonsterView',
		onload: function (responseDetails) {
			try {
				// logMZ('retrieveCDMs readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
				if (responseDetails.status == 0) {
					return;
				}
				// logMZ('[MZd] ' + (+new Date) + ' ajax niv monstres début');
				texte = responseDetails.responseText;
				let infosRet = JSON.parse(texte);
				if (infosRet.length == 0) {
					return;
				}
				let info = infosRet[0];
				// QUESTION Quelle est l'utilité de ceci?
				// Roule 19/01/2020 Il doit y avoir un endroit "au fond du trou" où le code va chercher les infos à partir de l'ID. Est-ce que c'est propre ? : non
				MZ_EtatCdMs.listeCDM[g_idMonstre] = info;
				let nodeInsert;
				try {
					nodeInsert = document.evaluate(
						"//div[@class = 'titre3']", document, null, 9, null
					).singleNodeValue;
				} catch (exc) {
					logMZ('recherche node pour info CdM', exc);
					return;
				}
				let table = createCDMTable(g_idMonstre, g_nomMonstre, info);
				table.align = 'center';
				let tbody = table.childNodes[1];
				let thead = table.childNodes[0];
				let tdEntete = thead.firstChild.firstChild;
				tdEntete.onclick = toggleTableau;
				tdEntete.style.cursor = 'pointer';
				thead.firstChild.style = 'mh_tdpage';
				tbody.style.display = 'none';
				table.style.width = '350px';
				insertBefore(nodeInsert, table);
			} catch (exc) {
				logMZ('traiteMonstre onload', exc);
			}
		},
	});
}

function toggleTableau() {	// click sur un td de thead
	let tbody = this.parentNode.parentNode.parentNode.childNodes[1];
	tbody.style.display = tbody.style.display == 'none' ? '' : 'none';
}

function do_infomonstre() {
	start_script(undefined, 'do_infomonstre_log');
	try {
		MZ_Tactique.initPopup();
		traiteMonstre();
	} catch (exc) {
		avertissement(`Une erreur est survenue (do_infomonstre)`, null, null, exc);
	}
	displayScriptTime(undefined, 'do_infomonstre_log');
}

/** x~x SCIZ ----------------------------------------------------------- */

var scizSetup = {
	eventsMaxMatchingInterval: 5000, // Maximum interval (seconds) for matching some events
	viewMaxEnhancedTreasure: 100, // Maximum number of treasures to enhanced in the view
	viewMaxEnhancedMushroom: 100 // Maximum number of treasures to enhanced in the view
};

var scizGlobal = {
	events: [],
	trolls: [],
	treasures: [],
	monsters: [],
	traps: [],
	mushrooms: [],
	portals: []
};

function scizAddCSS() {
	// SCIZ style
	let scizStyle = `
		.sciz-progress-bar-wrapper {
			width: 75px;
			margin-right: 5px;
			display: inline-block;
		}
		.sciz-progress-bar {
			width: 100%;
			background-color: #e0e0e0;
			padding: 1px;
			border-radius: 1px;
			box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
		}
		.sciz-progress-bar-fill {
			display: block;
			height: 5px;
			border-radius: 1px;
			transition: width 500ms ease-in-out;
		}
		.sciz-troll-view-block {
			display: inline-block;
			padding-left: 10px;
			margin-left: 10px;
			border-left: 1px solid black;
			white-space: pre-wrap;
		}
		`;
	// Actually add the SCIZ style
	let scizStyleSheet = document.createElement('style');
	scizStyleSheet.type = 'text/css';
	if (scizStyleSheet.styleSheet) {
		scizStyleSheet.styleSheet.cssText = scizStyle;
	} else {
		scizStyleSheet.appendChild(document.createTextNode(scizStyle));
	}
	document.getElementsByTagName('head')[0].appendChild(scizStyleSheet);
}

function scizCreateHoverable(height, display, callbackOnHover) {
	let img = document.createElement('img');
	img.src = 'https://www.sciz.fr/static/sciz-logo-quarter.png';
	img.alt = 'SCIZ logo';
	img.style = `height: ${height}px; cursor: pointer;`;
	img.onmouseover = callbackOnHover;
	let div = document.createElement('div');
	div.style = `text-align: center;display: ${display}`;
	div.appendChild(img);
	return div;
}

function scizCreateClickable(height, display, callbackOnClick) {
	let img = document.createElement('img');
	img.src = 'https://www.sciz.fr/static/sciz-logo-quarter.png';
	img.alt = 'SCIZ logo';
	img.style = `height: ${height}px; cursor: pointer;`;
	img.onclick = callbackOnClick;
	let div = document.createElement('div');
	div.style = `text-align: center;display: ${display}`;
	div.appendChild(img);
	return div;
}

function scizCreateIcon(height, display, icon) {
	let img = document.createElement('img');
	img.src = `https://www.sciz.fr/static/${icon}`;
	img.alt = 'SCIZ icon';
	img.style = `height: ${height}px;`;
	let div = document.createElement('div');
	div.style = `text-align: center;display: ${display}`;
	div.appendChild(img);
	return div;
}

/* SCIZ - View */

function scizPrettyPrintTroll(t) {
	let res = '<div style="float:right;margin-right:10px">';
	// Life progress bar
	let pbPercent = t.pdv !== null && t.pdv_max !== null ? Math.min(100, t.pdv / t.pdv_max * 100) : -1;
	let pbColor = pbPercent === -1 ? '#424242' : pbPercent < 40 ? '#ff5252' : pbPercent < 80 ? '#fb8c00' : '#4caf50';
	t.pdv_max = t.pdv_max === null ? '?' : t.pdv_max;
	res = `${res}<div class="sciz-progress-bar-wrapper"><div class="sciz-progress-bar"><span class="sciz-progress-bar-fill" style="background-color: ${pbColor};;width: ${pbPercent}%;"></span></div></div>`;
	res = `${res}${t.pdv} / ${t.pdv_max}`;
	res = `${res}<div class="sciz-troll-view-block">DLA ${t.dla}</div>`; // DLA
	res = `${res}<div class="sciz-troll-view-block"><= ${t.pa} PA</div>`; // PA
	res = `${res}<div class="sciz-troll-view-block">Fatigue ${`  ${t.fatigue}`.slice(-3)}</div>`; // Fatigue
	res = `${res}<div class="sciz-troll-view-block">Conc ${` ${t.concentration}`.slice(-2)}%</div>`; // Concentration
	res = `${res}</div>`;
	return res;
}

function scizPrettyPrintTreasure(t) {
	let res = '';
	res = res + /* t.type + ' - ' + */ t.nom;
	if (t.templates) {
		res = `${res} <b>${t.templates}</b>`;
	}
	if (t.mithril) {
		res = `${res} <b>en Mithril</b>`;
	}
	if (t.effet) {
		res = `${res} (${t.effet})`;
	}
	return res;
}

function scizPrettyPrintTrap(t) {
	let res = '<span style="color:#990000">';
	res = `${res}Piège à ${t.type} `;
	if (t.mm) {
		res = `${res}(MM ${t.mm}) `;
	}
	if (t.creation_datetime) {
		res = `${res} - ${t.creation_datetime} `;
	}
	res = `${res}</span>`;
	return res;
}

function scizPrettyPrintMushroom(m) {
	let res = '';
	res = res + m.nom;
	if (m.qualite) {
		res = `${res} <b>${m.qualite}</b>`;
	}
	return res;
}

function scizPrettyPrintPortal(p) {
	let res = '';
	let html_nom = `<a href="javascript:EPV(${p.owner_id})" class="mh_trolls_1">${p.owner_nom}</a>`;
	res = `${res}Portail de Téléportaion de ${html_nom} vers X = ${p.pos_x_dst} | Y = ${p.pos_y_dst} | N = ${p.pos_n_dst}`;
	return res;
}

function do_scizEnhanceView() {
	scizGlobal.treasures = [];

	// Ensure we have a JWT setup for the current user
	let jwt = MY_getValue(`${numTroll}.SCIZJWT`);
	if (jwt === null || jwt === undefined || jwt.trim() === '') {
		return;
	}

	// Add our CSS
	scizAddCSS();

	// Retrieve position and view
	let pos = document.body.innerHTML.match(/X\s*=\s*(-?\d+)\s*,\s*Y\s*=\s*(-?\d+)\s*,\s*N\s*=\s*(-?\d+)/);
	let posX = parseInt(pos[1]);
	let posY = parseInt(pos[2]);
	let posN = parseInt(pos[3]);
	let viewH = parseInt(document.body.innerHTML.match(/(\d+)\s*cases?\s*horizontalement/)[1]);
	let viewV = parseInt(document.body.innerHTML.match(/(\d+)\s*verticalement/)[1]);

	/* SCIZ View - TROLLS */
	let cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TROLLS`);
	if (cbx !== '0') {
		// Retrieve trolls
		let xPathTrollQuery = "//*/table[@id='VueTROLL']/tbody/tr";
		let xPathTrolls = document.evaluate(xPathTrollQuery, document, null, 0, null);
		let xPathTroll;
		while (xPathTroll = xPathTrolls.iterateNext()) {
			scizGlobal.trolls.push({
				id: parseInt(xPathTroll.children[2].innerHTML),
				name: xPathTroll.children[3].innerHTML,
				sciz_desc: null,
				node: xPathTroll,
				displayed: false,
				caracs: null,
			});
		}

		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/hook/trolls';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					let trolls = JSON.parse(responseDetails.responseText);
					if (trolls.trolls.length < 1) {
						// logMZ('DEBUG - MZ/SCIZ - Aucun événement trouvé dans la base SCIZ...');
						return;
					}
					// Look for trolls to enhanced
					let found = false;
					trolls.trolls.forEach((t) => {
						for (let i = 0; i < scizGlobal.trolls.length; i++) {
							found = false;
							if (scizGlobal.trolls[i].id === t.id) {
								// PrettyPrint
								scizGlobal.trolls[i].sciz_desc = scizGlobal.trolls[i].node.children[3].innerHTML + scizPrettyPrintTroll(t);
								// Store caracs
								scizGlobal.trolls[i].caracs = t.caracs;
								found = true;
								break;
							}
						}
						if (!found) {
							// Special case of itself
							let is_self = false;
							if (parseInt(numTroll) === t.id) {
								is_self = true;
								t.pos_x = posX;
								t.pos_y = posY;
								t.pos_n = posN;
								// Don't display the user itself if he does not want to
								cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_USER`);
								if (cbx === '0') {
									return;
								}
							}
							// Find the right index
							let distance = Math.max(Math.abs(t.pos_x - posX), Math.abs(t.pos_y - posY), Math.abs(t.pos_n - posN));
							xPathTrolls = document.evaluate(xPathTrollQuery, document, null, 0, null);
							while (xPathTroll = xPathTrolls.iterateNext()) {
								if (is_self) {
									break;
								}
								if (parseInt(xPathTroll.children[0].innerHTML) > distance) {
									break;
								}
							}
							// Create the troll
							let template = document.createElement('template');
							let html_nom = `<a href="javascript:EPV(${t.id})" class="mh_trolls_1">${t.nom}</a>`;
							if (!is_self) {
								html_nom = `${html_nom} (HORS VUE)`;
							}
							let html_guilde = `<a href="javascript:EAV(${t.guilde_id},750,550)" class="mh_links">${t.guilde_nom}</a>`;
							template.innerHTML = `<tr class="mh_tdpage"><td>${distance}</td><td></td><td>${t.id}</td><td title="">${html_nom}</td><td>${html_guilde}</td><td>${t.niv}</td><td>${t.race}</td><td>${t.pos_x}</td><td>${t.pos_y}</td><td>${t.pos_n}</td></tr>`;
							let troll = template.content.firstChild;
							// Add the troll
							scizGlobal.trolls.push({
								id: t.id, name: html_nom, sciz_desc: html_nom + scizPrettyPrintTroll(t), node: troll, displayed: false, caracs: t.caracs
							});
							if (xPathTroll !== null) {
								xPathTroll.parentNode.insertBefore(troll, xPathTroll);
							} else {
								document.evaluate("//*/table[@id='VueTROLL']/tbody", document, null, 0, null).iterateNext().appendChild(troll);
							}
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTrolls();
			}
		});
	}

	/* SCIZ View - TREASURES */
	cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TREASURES`);
	if (cbx !== '0') {
		// Retrieve treasures
		let ids = [];
		let xPathTreasureQuery = "//*/table[@id='VueTRESOR']/tbody/tr";
		let xPathTreasures = document.evaluate(xPathTreasureQuery, document, null, 0, null);
		let xPathTreasure;
		while (xPathTreasure = xPathTreasures.iterateNext()) {
			scizGlobal.treasures.push({
				id: parseInt(xPathTreasure.children[2].innerHTML),
				type: xPathTreasure.children[3].innerHTML,
				sciz_desc: null,
				buried: xPathTreasure.children[3].innerHTML.includes('Enterré'),
				node: xPathTreasure,
			});
			ids.push(xPathTreasure.children[2].innerHTML);
			if (scizGlobal.treasures.length >= scizSetup.viewMaxEnhancedTreasure) {
				break;
			}
		}

		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/hook/treasures';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ ids: ids }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					let treasures = JSON.parse(responseDetails.responseText);
					if (treasures.treasures.length < 1) {
						// logMZ('DEBUG - MZ/SCIZ - Aucun trésor trouvé dans la base SCIZ...');
						return;
					}
					// Look for treasures to enhanced
					treasures.treasures.forEach((t) => {
						for (let i = 0; i < scizGlobal.treasures.length; i++) {
							if (scizGlobal.treasures[i].id === t.id) {
								// PrettyPrint
								t = scizPrettyPrintTreasure(t);
								// Store the SCIZ treasure desc
								scizGlobal.treasures[i].sciz_desc = t;
								// Adapt the sciz type (delete the buried marker, the do_scizSwitchTreasures will handle it)
								scizGlobal.treasures[i].type = scizGlobal.treasures[i].node.children[3].firstChild.textContent;
								break;
							}
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTreasures();
			}
		});
	}


	/* SCIZ View - MUSHROOMS */
	cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_MUSHROOMS`);
	if (cbx !== '0') {
		// Retrieve mushrooms
		let ids = [];
		let xPathMushroomQuery = "//*/table[@id='VueCHAMPIGNON']/tbody/tr";
		let xPathMushrooms = document.evaluate(xPathMushroomQuery, document, null, 0, null);
		let xPathMushroom;
		while (xPathMushroom = xPathMushrooms.iterateNext()) {
			scizGlobal.mushrooms.push({
				id: parseInt(xPathMushroom.children[2].innerHTML),
				type: xPathMushroom.children[3].innerHTML,
				sciz_desc: null,
				node: xPathMushroom,
			});
			ids.push(xPathMushroom.children[2].innerHTML);
			if (scizGlobal.mushrooms.length >= scizSetup.viewMaxEnhancedMushroom) {
				break;
			}
		}

		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/hook/mushrooms';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ ids: ids }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					let mushrooms = JSON.parse(responseDetails.responseText);
					if (mushrooms.mushrooms.length < 1) {
						// logMZ('DEBUG - MZ/SCIZ - Aucun champignon trouvé dans la base SCIZ...');
						return;
					}
					// Look for mushrooms to enhanced
					mushrooms.mushrooms.forEach((m) => {
						for (let i = 0; i < scizGlobal.mushrooms.length; i++) {
							if (scizGlobal.mushrooms[i].id === m.id) {
								// PrettyPrint
								m = scizPrettyPrintMushroom(m);
								// Store the SCIZ mushroom desc
								scizGlobal.mushrooms[i].sciz_desc = m;
								break;
							}
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchMushrooms();
			}
		});
	}

	/* SCIZ View - BESTIAIRE */
	cbx = MY_getValue(`${numTroll}.SCIZ_CB_BESTIAIRE`);
	if (cbx !== '0') {
		// Retrieve monsters
		let mobs = [];
		let xPathMonsterQuery = "//*/table[@id='VueMONSTRE']/tbody/tr";
		let xPathMonsters = document.evaluate(xPathMonsterQuery, document, null, 0, null);
		let xPathMonster;
		while (xPathMonster = xPathMonsters.iterateNext()) {
			let mob = xPathMonster.children[4].innerHTML.match(/([^<>]+?)\s*\[\s*(.+)\s*]/);
			scizGlobal.monsters.push({
				id: parseInt(xPathMonster.children[2].innerHTML),
				name: mob[1],
				age: mob[2],
				sciz_desc: null,
				icon: null,
				node: xPathMonster
			});
			mobs.push({ name: mob[1], age: mob[2] });
		}
		// Check the list against the SCIZ bestiaire
		let sciz_url = 'https://www.sciz.fr/api/bestiaire/check';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ mobs: mobs }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					mobs = JSON.parse(responseDetails.responseText);
					// Add the SCIZ icons
					scizGlobal.monsters.forEach((m) => {
						if (mobs.bestiaire.includes(`${m.name} ${m.age}`)) {
							let icon = scizCreateHoverable('15', 'inline', () => {
								do_scizBestiaire(m);
							});
							m.icon = icon;
							m.node.children[4].appendChild(icon);
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
			}
		});
	}

	/* SCIZ View - TRAPS */
	cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TRAPS`);
	if (cbx !== '0') {
		// Retrieve traps
		let ids = [];
		let xPathPlaceQuery = "//*/table[@id='VueLIEU']/tbody/tr";
		let xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
		let xPathPlace;
		while (xPathPlace = xPathPlaces.iterateNext()) {
			let trap = xPathPlace.children[3].innerHTML.match(/Piège\s+à\s+/);
			if (trap === null) {
				continue;
			}
			scizGlobal.traps.push({
				id: parseInt(xPathPlace.children[2].innerHTML),
				type: xPathPlace.children[3].innerHTML,
				hidden: xPathPlace.children[3].innerHTML.includes('Caché'),
				sciz_desc: null,
				node: xPathPlace
			});
			ids.push(xPathPlace.children[2].innerHTML);
		}

		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/hook/traps';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ pos_x: posX, pos_y: posY, pos_n: posN, view_h: viewH, view_v: viewV }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					let traps = JSON.parse(responseDetails.responseText);
					if (traps.traps.length < 1) {
						return;
					}
					// Look for traps to enhanced
					traps.traps.forEach((t) => {
						let found = false;
						for (let i = 0; i < scizGlobal.traps.length; i++) {
							if (scizGlobal.traps[i].id === t.id) {
								scizGlobal.traps[i].sciz_desc = scizPrettyPrintTrap(t);
								// Adapt the sciz type (delete the hidden marker, the do_scizSwitchTraps will handle it)
								scizGlobal.traps[i].type = scizGlobal.traps[i].node.children[3].firstChild.textContent;
								found = true;
								break;
							}
						}
						if (!found) {
							// Find the right index
							let distance = Math.max(Math.abs(t.pos_x - posX), Math.abs(t.pos_y - posY), Math.abs(t.pos_n - posN));
							xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
							while (xPathPlace = xPathPlaces.iterateNext()) {
								if (parseInt(xPathPlace.children[0].innerHTML) > distance) {
									break;
								}
							}
							// Create the trap
							let template = document.createElement('template');
							template.innerHTML = `<tr class="mh_tdpage"><td>${distance}</td><td></td><td>${t.id}</td><td>Piège à ${t.type
								}</td><td>${t.pos_x}</td><td>${t.pos_y}</td><td>${t.pos_n}</td></tr>`;
							let trap = template.content.firstChild;
							// Add the hidden trap
							scizGlobal.traps.push({
								id: t.id, type: `Piège à ${t.type}`, hidden: true, sciz_desc: scizPrettyPrintTrap(t), node: trap
							});
							if (xPathPlace !== null) {
								xPathPlace.parentNode.insertBefore(trap, xPathPlace);
							} else {
								document.evaluate("//*/table[@id='VueLIEU']/tbody", document, null, 0, null).iterateNext().appendChild(trap);
							}
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchTraps();
			}
		});
	}

	/* SCIZ View - PORTALS */
	cbx = MY_getValue(`${numTroll}.SCIZ_CB_VIEW_PORTALS`);
	if (cbx !== '0') {
		// Retrieve portals
		let ids = [];
		let xPathPlaceQuery = "//*/table[@id='VueLIEU']/tbody/tr";
		let xPathPlaces = document.evaluate(xPathPlaceQuery, document, null, 0, null);
		let xPathPlace;
		while (xPathPlace = xPathPlaces.iterateNext()) {
			let portal = xPathPlace.children[3].innerHTML.match(/Portail/);
			if (portal === null) {
				continue;
			}
			scizGlobal.portals.push({
				id: parseInt(xPathPlace.children[2].innerHTML),
				type: xPathPlace.children[3].innerHTML,
				sciz_desc: null,
				node: xPathPlace
			});
			ids.push(xPathPlace.children[2].innerHTML);
		}
		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/hook/portals';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ ids: ids }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
						return;
					}
					let portals = JSON.parse(responseDetails.responseText);
					if (portals.portals.length < 1) {
						// logMZ('DEBUG - MZ/SCIZ - Aucun portail trouvé dans la base SCIZ...');
						return;
					}
					// Look for treasures to enhanced
					portals.portals.forEach((t) => {
						for (let i = 0; i < scizGlobal.portals.length; i++) {
							if (scizGlobal.portals[i].id === t.id) {
								scizGlobal.portals[i].sciz_desc = scizPrettyPrintPortal(t);
								break;
							}
						}
					});
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
				// Do the display overwrite and add the switches
				do_scizSwitchPortals();
			}
		});
	}
}

function do_scizSwitchTrolls() {
	scizGlobal.trolls.forEach((t) => {
		if (t.sciz_desc !== null) {
			let icon = scizCreateClickable('15', 'inline', do_scizSwitchTrolls);
			t.displayed = !t.displayed;
			// Do the switch
			if (t.displayed) {
				t.node.children[3].innerHTML = t.sciz_desc;
				if (t.caracs !== null) {
					icon.title = t.caracs;
				}
			} else {
				t.node.children[3].innerHTML = t.name;
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(icon);
		}
	});
}

function do_scizSwitchTreasures() {
	scizGlobal.treasures.forEach((t) => {
		if (t.sciz_desc !== null) {
			// Do the switch
			let currentDesc = t.node.children[3].firstChild.textContent;
			t.node.children[3].innerHTML = currentDesc === t.type ? t.sciz_desc !== null ? t.sciz_desc : t.type : t.type;
			if (t.buried) {
				t.node.children[3].innerHTML += '<img src="/mountyhall/Images/hidden.png" alt="[Enterré]" title="Enterré" width="15" height="15">';
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchTreasures));
		}
	});
}

function do_scizSwitchMushrooms() {
	scizGlobal.mushrooms.forEach((m) => {
		if (m.sciz_desc !== null) {
			// Do the switch
			let currentDesc = m.node.children[3].firstChild.textContent;
			m.node.children[3].innerHTML = currentDesc === m.type ? m.sciz_desc !== null ? m.sciz_desc : m.type : m.type;
			// Add the SCIZ switcher
			m.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchMushrooms));
		}
	});
}

function do_scizSwitchTraps() {
	scizGlobal.traps.forEach((t) => {
		if (t.sciz_desc !== null) {
			// Do the switch
			let currentDesc = t.node.children[3].firstChild.textContent;
			t.node.children[3].innerHTML = currentDesc === t.type ? t.sciz_desc !== null ? t.sciz_desc : t.type : t.type;
			if (t.hidden) {
				t.node.children[3].innerHTML += '<img src="/mountyhall/Images/hidden.png" alt="[Caché]" title="Caché" width="15" height="15">';
			}
			// Add the SCIZ switcher
			t.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchTraps));
		}
	});
}

function do_scizSwitchPortals() {
	scizGlobal.portals.forEach((m) => {
		if (m.sciz_desc !== null) {
			// Do the switch
			let currentDesc = m.node.children[3].firstChild.textContent;
			m.node.children[3].innerHTML = currentDesc === m.type ? m.sciz_desc !== null ? m.sciz_desc : m.type : m.type;
			// Add the SCIZ switcher
			m.node.children[3].appendChild(scizCreateClickable('15', 'inline', do_scizSwitchPortals));
		}
	});
}

function do_scizBestiaire(monster) {
	// Ensure we have a JWT setup for the current user
	let jwt = MY_getValue(`${numTroll}.SCIZJWT`);
	if (jwt === null || jwt === undefined || jwt.trim() === '') {
		return;
	}
	// Don't do anything if we already called the bestiary for this monster
	if (monster.sciz_desc === null) {
		// Call SCIZ
		let sciz_url = 'https://www.sciz.fr/api/bestiaire';
		FF_XMLHttpRequest({
			method: 'POST',
			url: sciz_url,
			headers: { 'Authorization': jwt, 'Content-type': 'application/json' },
			data: JSON.stringify({ name: monster.name, age: monster.age }),
			onload: function (responseDetails) {
				try {
					if (responseDetails.status !== 200) {
						monster.sciz_desc = "Problème de JWT SCIZ, désactiver l'option Mountyzilla si non utilisée.";
						logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
					}
					monster.sciz_desc = JSON.parse(responseDetails.responseText).bestiaire;
					// Add the tooltip (kind of)
					if (monster.sciz_desc !== null && monster.sciz_desc !== undefined) {
						let abbr = document.createElement('abbr');
						abbr.title = monster.sciz_desc.replace(/Blason.*/, '');
						monster.icon.parentNode.replaceChild(abbr, monster.icon);
						abbr.appendChild(monster.icon);
					}
				} catch (exc) {
					logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
				}
			}
		});
	}
}

/* SCIZ - Events */

function scizPrettyPrintEvent(e) {
	e.message = e.message.replace(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s[0-9]{2}h[0-9]{2}:[0-9]{2}/g, ''); // Delete date
	e.message = e.message.replace(/\n\s*\n*/g, '<br/>');
	let beings = [[e.att_id, e.att_nom], [e.def_id, e.def_nom], [e.mob_id, e.mob_nom], [e.owner_id, e.owner_nom], [e.troll_id, e.troll_nom]];
	beings.forEach((b) => {
		if (b[0] && b[1]) {
			b[1] = b[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			if (b[0].toString().length > 6) {
				// Mob
				b[1] = b[1].replace(/^une?\s/g, '');
				e.message = e.message.replace(new RegExp(`(${b[1]})`, 'gi'), `<b><a href="/mountyhall/View/MonsterView.php?ai_IDPJ=${b[0]}" rel="modal:open" class="mh_monstres">\$1</a></b>`);
			} else {
				// Troll
				e.message = e.message.replace(new RegExp(`(${b[1]})`, 'gi'), `<b><a href="javascript:EPV('${b[0]}')" class="mh_trolls_1">\$1</a></b>`);
			}
		}
	});
	return e;
}

function do_scizOverwriteEvents() {
	scizGlobal.events = [];
	let eventTableNode = null;

	// Ensure we have a JWT setup for the current user
	let jwt = MY_getValue(`${numTroll}.SCIZJWT`);
	let cbx = MY_getValue(`${numTroll}.SCIZ_CB_EVENTS`);
	if (jwt === null || jwt === undefined || jwt.trim() === '' || cbx === '0') {
		return;
	}

	// Retrieve being ID
	let url = new URL(window.location.href);
	let id = url.searchParams.get('ai_IDPJ');
	id = !id ? numTroll : id;

	// Check for advanced profil
	let advanced = document.querySelector("[href*='MH_Style_ProfilAvance.css']") !== null;
	let xPathQuery = advanced ? "//*/table[@id='events']/tbody/tr" : "//*/tr[contains(@class, 'mh_tdpage')]";

	// Retrieve local events
	let xPathEvents = document.evaluate(xPathQuery, document, null, 0, null);
	let xPathEvent;
	while (xPathEvent = xPathEvents.iterateNext()) {
		scizGlobal.events.push({
			time: Date.parse(StringToDate(xPathEvent.children[0].innerHTML)),
			type: xPathEvent.children[1].innerHTML,
			desc: xPathEvent.children[2].innerHTML,
			sciz_type: null,
			sciz_desc: null,
			node: xPathEvent,
		});
		if (eventTableNode === null) {
			eventTableNode = xPathEvent.parentNode.parentNode;
		}
	}

	let startTime = Math.min.apply(Math, scizGlobal.events.map((e) => {
		return e.time;
	})) - scizSetup.eventsMaxMatchingInterval;
	let endTime = Math.max.apply(Math, scizGlobal.events.map((e) => {
		return e.time;
	})) + scizSetup.eventsMaxMatchingInterval;

	// Check if events have been found in the page
	if (scizGlobal.events.length < 1) {
		logMZ('ERREUR - MZ/SCIZ - Aucun événement trouvé sur la page...');
		return;
	}

	// Call SCIZ
	let sciz_url = `https://www.sciz.fr/api/hook/events/${id}/${startTime}/${endTime}`;
	let eventType = url.searchParams.get('as_EventType'); // Retrieve event type filter
	sciz_url = sciz_url + (eventType !== null && eventType !== '' ? `/${eventType.split(' ')[0]}` : ''); // Only the first word used for filtering ("MORT par monstre" => "MORT");
	FF_XMLHttpRequest({
		method: 'GET',
		url: sciz_url,
		headers: { Authorization: jwt },
		// trace: 'Appel à SCIZ pour l'entité ' + id,
		onload: function (responseDetails) {
			try {
				if (responseDetails.status == 0) {
					logMZ('ERREUR - MZ/SCIZ - Appel à SCIZ en échec...', responseDetails);
					return;
				}
				let events = JSON.parse(responseDetails.responseText);
				if (events.events.length < 1) {
					// logMZ('DEBUG - MZ/SCIZ - Aucun événement trouvé dans la base SCIZ...');
					return;
				}
				// Read if switch to SCIZ view or not
				let bViewSCIZ = MY_getValue('SCIZ_view') !== 'no';
				// Look for events to overwrite (based on timestamps)
				events.events.forEach((e) => {
					if (e.message.includes(id)) { // Exclude any event we were not looking for...
						let t = Date.parse(StringToDate(e.time));
						// Look for the best event matching and not already replaced
						let i = -1;
						let lastDelta = Infinity;
						for (let j = 0; j < scizGlobal.events.length; j++) {
							if (scizGlobal.events[j].sciz_desc === null) {
								let delta = Math.abs(t - scizGlobal.events[j].time);
								if (delta <= scizSetup.eventsMaxMatchingInterval && delta < lastDelta) {
									lastDelta = delta;
									i = j;
								}
							}
						}
						if (i > -1) {
							// PrettyPrint
							e = scizPrettyPrintEvent(e);
							// Store the SCIZ event and icon
							let div = scizCreateIcon('25', 'block', e.icon);
							scizGlobal.events[i].sciz_type = div.outerHTML;
							scizGlobal.events[i].sciz_desc = e.message;
							// Actual display overwrite
							scizGlobal.events[i].node.children[1].setAttribute("valign", "middle");
							scizGlobal.events[i].node.children[2].setAttribute("valign", "middle");
							if (bViewSCIZ) {
								scizGlobal.events[i].node.children[1].innerHTML = scizGlobal.events[i].sciz_type;
								scizGlobal.events[i].node.children[2].innerHTML = scizGlobal.events[i].sciz_desc;
							}
						}
					}
				});
				// Add the switch button
				if (eventTableNode !== null) {
					let div = scizCreateClickable('50', 'block', do_scizSwitchEvents);
					eventTableNode.parentNode.insertBefore(div, eventTableNode.nextSibling);
				}
			} catch (exc) {
				logMZ('ERREUR - MZ/SCIZ - Stacktrace', exc);
			}
		}
	});
}

function do_scizSwitchEvents() {
	let bMaskSCIZ = false;
	scizGlobal.events.forEach((e) => {
		let currentType = e.node.children[1].innerHTML;
		if (currentType === e.type) {
			e.node.children[1].innerHTML = e.sciz_type !== null ? e.sciz_type : e.type;
		} else {
			e.node.children[1].innerHTML = e.type;
			bMaskSCIZ = true;
		}
		let currentDesc = e.node.children[2].innerHTML;
		e.node.children[2].innerHTML = currentDesc === e.desc ? e.sciz_desc !== null ? e.sciz_desc : e.desc : e.desc;
	});
	if (bMaskSCIZ) {
		MY_setValue('SCIZ_view', 'no');
	} else {
		MY_removeValue('SCIZ_view');
	}
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Missions ------------------------------------------------------- */

/* TODO
 * MZ2.0 : gérer le nettoyage des missions terminées via script principal
 *		Roule 01/01/2017 : c'est fait dans do_mission_liste
 *
 * Note: nbKills n'est pas géré pour l'instant (voir avec Actions?)
 */
function isArray(a) {
	return Boolean(a) && a.constructor === Array;
}

function saveMission(num, obEtape) {
	let obMissions;
	if (MY_getValue(`${numTroll}.MISSIONS`)) {
		try {
			// logMZ('JSON MISSION (before) = ' + MY_getValue(numTroll+'.MISSIONS'));
			obMissions = JSON.parse(MY_getValue(`${numTroll}.MISSIONS`));
		} catch (exc) {
			logMZ('Mission parsage', exc);
			return;
		}
	}
	if (isArray(obMissions)) {
		obMissions = new Object();
	}	// corrige certains cas issus d'anciennes versions MZ
	if (obMissions == undefined) {
		obMissions = new Object();
	}	// protection
	// logMZ('saveMission, obEtape=' + obEtape);	// debug roule
	if (obEtape) {
		obMissions[num] = obEtape;
	} else if (obMissions[num]) {
		delete obMissions[num];
	}
	MY_setValue(`${numTroll}.MISSIONS`, JSON.stringify(obMissions));
	// logMZ('JSON MISSION (after) = ' + MY_getValue(numTroll+'.MISSIONS'));
}

function addtroogle(tdLibelle, sRestrict) {
	let img = document.createElement('img');
	img.src = `${URL_MZimg}troogle.ico`;
	img.alt = 'Troogle logo';
	let a = document.createElement('a');
	let url = `${URL_troogle}?utf8=${encodeURIComponent('✓')}`;	// hé oui, ce source est unicode
	url = `${url}&entity_search[search]=${encodeURIComponent(sRestrict)}`;
	url = `${url}&entity_search[position_x]=${MY_getValue(`${numTroll}.position.X`)}`;
	url = `${url}&entity_search[position_y]=${MY_getValue(`${numTroll}.position.Y`)}`;
	url = `${url}&entity_search[position_z]=${MY_getValue(`${numTroll}.position.N`)}`;
	a.href = url;
	a.title = 'Chercher sur Troogle';
	a.target = 'troogle';
	a.appendChild(img);
	tdLibelle.appendChild(a);
	tdLibelle.parentNode.style.verticalAlign = 'bottom';
}

function traiteMission() {
	let numMission, tdLibelle;
	try {
		let titreMission = document.getElementsByClassName('titre2')[0];
		let missionForm = document.getElementsByName('ActionForm')[0];
		numMission = titreMission.textContent.match(/\d+/)[0];
		tdLibelle = document.evaluate(
			"./table/tbody/tr/td/input[starts-with(@value,'Valider')]/../../td[2]", missionForm, null, 9, null
		).singleNodeValue;
	} catch (exc) {
		logMZ('récupération mission', exc);
		return;
	}
	if (!numMission) {
		debugMZ('traiteMission pas de numMission, titreMission='.titreMission.outerHTML.replace(/</g, '‹')); return;
	}
	try {
		if (!tdLibelle) {
			// S'il n'y a plus d'étape en cours (=mission finie), on supprime
			debugMZ('traiteMission, la mission semble terminée');
			saveMission(numMission, false);
			return;
		}

		let libelle = trim(tdLibelle.textContent.replace(/\n/g, ''));
		let siMundidey = libelle.indexOf('Mundidey') != -1;
		// debug Roule'
		if (MY_DEBUG) {
			for (let i = 0; i < tdLibelle.childNodes.length; i++) {
				debugMZ(`traiteMission, tdLibelle.childNodes[${i}]=${tdLibelle.childNodes[i].textContent}`);
			}
		}
		// let nbKills = 1;
		if (libelle.indexOf('niveau égal à') != -1) {
			let niveau, mod;
			// exemples :
			// L'équipe doit tuer 3 petits monstres (d'un niveau égal à 27 + ou - 1)
			// L'équipe doit tuer 2 gros monstres (chaque monstre devant être d'un niveau égal à 44 au moins)
			// L'équipe doit tuer un petit monstre (chaque monstre devant être d'un niveau égal à 29 + ou - 1) un Mundidey
			// L'équipe doit tuer un monstre (ce monstre doit être d'un niveau égal à 44 au moins) un Mundidey
			if (tdLibelle.childNodes.length == 1) {
				// Roule' 08/01/52017 il n'y a plus de mise en forme. Un seul childNode
				let m = libelle.match(/niveau égal à *(\d+) * au moins/);
				if (m) {
					niveau = Number(m[1]);
					mod = 'plus';
				} else {
					m = libelle.match(/niveau égal à *(\d+) *\+.*- *(\d+)/);
					if (m) {
						niveau = Number(m[1]);
						mod = Number(m[2]);
					} else {
						logMZ(`traiteMission, échec analyse de ${libelle}`);
						return;
					}
				}
			} else {
				// ancienne méthode (multi childnode)
				// à supprimer un jour peut-être
				if (tdLibelle.firstChild.nodeValue.indexOf('niveau égal à') == -1) {
					// Étape de kill multiple de niveau donné
					// nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
					if (tdLibelle.childNodes.length <= 3) {	// Roule' 14/07/2016 le niveau n'est plus en gras, on n'a que 3 zones de texte
						mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
						niveau = Number(mod[0]);
						// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
						mod = mod.length > 1 ? Number(mod[1]) : 'plus';
					} else {
						niveau = Number(tdLibelle.childNodes[3].firstChild.nodeValue);
						// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
						mod = tdLibelle.childNodes[4].nodeValue.match(/\d+/);
						mod = mod ? Number(mod[0]) : 'plus';
					}
				} else {
					// Étape de kill unique de niveau donné
					niveau = Number(tdLibelle.childNodes[1].firstChild.nodeValue);
					mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
					mod = mod ? Number(mod[0]) : 'plus';
				}
			}
			// if (isDEV) {
			// niveau = 35;	// pour les tests Roule
			// window.alert('niveau forcé à 35 pour test');
			// }
			// debug Roule'
			debugMZ(`traiteMission, save niveau=${niveau}, mod=${mod}, siMundidey=${siMundidey}, libelle=${libelle}`);
			saveMission(numMission, {
				type: 'Niveau',
				niveau: niveau,
				mod: mod,
				mundidey: siMundidey,
				libelle: libelle
			});
			if (mod == 'plus') {
				addtroogle(tdLibelle, `@monstre level:${niveau}..${niveau + 99}`);
			} else {
				addtroogle(tdLibelle, `@monstre level:${niveau - mod}..${niveau + mod}`);
			}
		} else if (libelle.indexOf('de la race') != -1) {
			let race;
			if (tdLibelle.firstChild.nodeValue.indexOf('de la race') == -1) {
				// Étape de kill multiple de race donnée
				// nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
				race = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
			} else {
				// Étape de kill unique de race donnée
				race = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			}
			race = race.replace(/\"/g, '');
			race = removeEnclosingSimpleCote(race);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission, {
				type: 'Race',
				race: race,
				mundidey: siMundidey,
				libelle: libelle
			});
			addtroogle(tdLibelle, `@monstre ${race}`);
		} else if (libelle.indexOf('de la famille') != -1) {
			let famille;
			if (tdLibelle.firstChild.nodeValue.indexOf('de la famille') == -1) {
				// Étape de kill multiple de famille donnée
				// nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
				famille = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
			} else {
				// Étape de kill unique de famille donnée
				famille = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			}
			famille = famille.replace(/\"/g, '');
			famille = removeEnclosingSimpleCote(famille);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission, {
				type: 'Famille',
				famille: famille,
				mundidey: siMundidey,
				libelle: libelle
			});
			// Roule' 07/01/2017 À ce jour, pour les familles, Troogle a besoin de minuscules sans accent
			addtroogle(tdLibelle, `@monstre:${famille.toLowerCase().replace(/é/g, 'e').replace(/ï/g, 'i')}`);
		} else if (libelle.indexOf('capacité spéciale') != -1) {
			let pouvoir = epure(trim(tdLibelle.childNodes[1].firstChild.nodeValue));
			debugMZ('traiteMission étape capacité spéciale');
			pouvoir = removeEnclosingSimpleCote(pouvoir);	// Roule 29/03/2019 Maintenant, on a des '
			saveMission(numMission, {
				type: 'Pouvoir',
				pouvoir: pouvoir,
				libelle: libelle
			});
		} else {
			debugMZ('traiteMission étape pas pour troogle');
			saveMission(numMission, false);
		}
	} catch (exc) {
		logMZ('récupération étape mission', exc);
		return;
	}
}

function removeEnclosingSimpleCote(x) {	// Roule 29/03/2019
	return x.replace(/'$/, '').replace(/^'/, '');
}

function do_mission() {
	start_script(60, 'do_mission_log');
	traiteMission();
	displayScriptTime(undefined, 'do_mission_log');
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Données sur les trous de météorites ---------------------------- */

var petitsTrous = {
	'-52;57': true,
	'55;70': true,
	'64;70': true,
	'12;-15': true,
	'30;-52': true,
	'48;-39': true
};

var grosTrous = {
	'-35;65': true,
	'-13;73': true,
	'-64;9': true,
	'-35;15': true,
	'5;32': true,
	'10;64': true,
	'21;36': true,
	'46;52': true,
	'74;32': true,
	'-71;-7': true,
	'-67;-37': true,
	'-60;-32': true,
	'-51;-22': true,
	'-36;-51': true,
	'5;-49': true
};

var centreCarmine_X = 56.5;
var centreCarmine_Y = 23.5;
var rayonCarmine = 8.7;

function isTrou(x, y, n) {
	if (petitsTrous[`${x};${y}`]) {
		return n < 0 && n > -60;
	}
	if (grosTrous[`${x};${y}`] ||
		grosTrous[`${x - 1};${y}`] ||
		grosTrous[`${x};${y}${1}`] ||
		grosTrous[`${x - 1};${y}${1}`]) {
		return n < 0 && n > -70;
	}
	if (Math.sqrt(
		Math.pow(x - centreCarmine_X, 2) + Math.pow(y - centreCarmine_Y, 2)
	) <= rayonCarmine) {
		return n < 0 && n > -100;
	}
	return false;
}

/** x~x Gestion des DEs ------------------------------------------------ */

function validateDestination() {
	let dx = undefined, dy = undefined, dn = undefined;
	for (let form of document.getElementsByTagName('form')) {
		for (let eInput of form.getElementsByTagName('input')) {
			if (eInput.name == 'depl_2D') {
				if (!eInput.value) continue;
				tDepl = eInput.value.split('_');
				dx = parseInt(tDepl[0], 10);
				dy = parseInt(tDepl[1], 10);
				dn = parseInt(tDepl[2], 10);
				break;
			}
			if (eInput.name == 'depl_x' && eInput.checked) dx = parseInt(eInput.value, 10);
			if (eInput.name == 'depl_y' && eInput.checked) dy = parseInt(eInput.value, 10);
			if (eInput.name == 'depl_n' && eInput.checked) dn = parseInt(eInput.value, 10);
		}
	}
	if (dx === undefined || dy === undefined || dn == undefined ||
		isNaN(dx) || isNaN(dy) || isNaN(dn)) {
		window.console.log('validateDestination_log, impossible de retrouver les paramètres de Déplacement');
		return true;	// tant pis pour le pauvre Trõll
	}
	let sx = dx < 0 ? -1 : +1;
	dx = Math.abs(dx);
	let sy = dy < 0 ? -1 : +1;
	dy = Math.abs(dy);
	let sn = dn < 0 ? -1 : +1;
	dn = Math.abs(dn);
	let x = parseInt(MY_getValue(`${numTroll}.position.X`), 10);
	let y = parseInt(MY_getValue(`${numTroll}.position.Y`), 10);
	let n = parseInt(MY_getValue(`${numTroll}.position.N`), 10);
	debugMZ(`validateDestination_log ${x}, ${y}, ${n} DE ${sx*dx}, ${sy*dy}, ${sn*dn}`);
	let dmax = Math.max(dx, dy, dn);
	for (let i = 1; i <= dmax; i++) {
		let this_dx = Math.min(dx, i);
		let this_dy = Math.min(dy, i);
		let this_dn = Math.min(dn, i);
		if (isTrou(x + sx * this_dx, y + sy * this_dy, n + sn * this_dn)) {
			return window.confirm(
				`La voix de  mini TilK (n°36216) résonne dans votre tête :
Vous allez tomber dans un trou de météorite.
Êtes vous sûr de vouloir effectuer ce déplacement ?`);
		}
	}
	return true;
}

function newsubmitDE(event) {
	event.stopPropagation();
	event.preventDefault();
	debugMZ('newsubmitDE_log : vérification trou')
	if (validateDestination()) {
		this.submit();
	}
}

function changeValidation() {
	let forms = document.getElementsByTagName('form');
	for (form of forms) {
		for (input of form.getElementsByTagName('input')) {
			if (input.name != 'depl_2D' && input.name != 'depl_x') continue;
				form.addEventListener('submit', newsubmitDE, true);
				debugMZ('changeValidation_log : activation de la détection des TP dangereux')
				return;
			}
	}
	console.log('changeValidation_log : pas de form compatible avec la détection des TP dangereux')
}

/** x~x Gestion des TPs ------------------------------------------------ */

function validateTPDestination() {
	try {
		let text = document.getElementsByTagName('B')[0];
		let a = text.firstChild.nodeValue.split('|');
		let pos_x = Number(a[0].substring(4, a[0].length - 1));
		let pos_y = Number(a[1].substring(5, a[1].length - 1));
		let pos_n = Number(a[2].substring(5, a[2].length));

		let nbtrous = 0;
		for (let signX = -1; signX <= 1; signX = signX + 2) {
			for (let x = 0; x <= 2; x++) {
				for (let signY = -1; signY <= 1; signY = signY + 2) {
					for (let y = 0; y <= 2; y++) {
						for (let signN = -1; signN <= 1; signN = signN + 2) {
							for (let n = 0; n <= 1; n++) {
								if (isTrou(
									pos_x + signX * x, pos_y + signY * y, Math.min(-1, pos_n + signN * n)
								)) {
									nbtrous++;
								}
							}
						}
					}
				}
			}
		}
		if (nbtrous > 0 && nbtrous < 72) {
			return window.confirm(
				`La voix de  mini TilK (n°36216) résonne dans votre tête :
Vous avez ${Math.floor(100 * nbtrous / 144)
}% de risque de tomber dans un trou de météorite.
Êtes-vous sûr de vouloir prendre ce portail ?`
			);
		} else if (nbtrous >= 72) {
			return window.confirm(
				`La voix de  mini TilK (n°36216) tonne dans votre tête :
Malheureux, vous avez ${Math.floor(100 * nbtrous / 144)
}% de risque de tomber dans un trou de météorite !
Êtes-vous bien certain de vouloir prendre ce portail ?`
			);
		}
		return true;
	} catch (exc) {
		avertissement(`Une erreur est survenue (validateTPDestination)`, null, null, exc);
	}
}

function newsubmitTP(event) {
	/*
	event.stopPropagation();
	event.preventDefault();
	if (validateTPDestination()) {
		this.submit();
	}
	*/
	return validateTPDestination();
}

function changeButtonValidate() {
	let forms = document.getElementsByTagName('form');
	for (form of forms) {
		for (input of form.getElementsByTagName('input')) {
			if (input.name != 'portail') continue;
			//form.addEventListener('submit', newsubmitTP, true);
			form.onsubmit = newsubmitTP;
			debugMZ('changeButtonValidate : activation de la détection des TP dangereux')
			return;
		}
	}
	console.log('changeButtonValidate_log : pas de form compatible avec la détection des TP dangereux')
}

/** x~x Partie Principale ---------------------------------------------- */

function do_move() {
	debugMZ('do_move_log');
	// Roule', vérification du risque de tomber dans un trou déplacée dans do_lieuTeleport pour le cas des TP
	// if(isPage('MH_Play/Play_a_Move.php')) {
	changeValidation();
	// }
	// else if(isPage('MH_Lieux/Lieu_Teleport.php')) {
	//	changeButtonValidate();
	// }
}

/** *****************************************************************************
* This file is part of Mountyzilla (http://mountyzilla.tilk.info/)             *
* Mountyzilla is free software; provided under the GNU General Public License  *
*******************************************************************************/

/** x~x News ----------------------------------------------------------- */

// Nombre de news à afficher & nb max de caractères par news:
// let nbItems = 5;              // WARNING (gath) - non utilisé -> commenté
// let maxCarDescription = 300;  // WARNING (gath) - non utilisé -> commenté

/** x~x Utilitaires ---------------------------------------------------- */

// Ne semble avoir strictement aucun effet:
String.prototype.epureDescription = function () {
	return this.replace(/\\(.)/g, "$1");
};

function appendTitledTable(node, titre, description) {
	// Crée les tables contenant les infos (avec titre)
	let table = document.createElement('table');
	table.border = 0;
	let ui_table = isDesktopView() ? 'mh_tdborder' : 'ui-body-c ui-corner-all';
	table.className = ui_table;
	table.cellSpacing = 1;
	table.cellPadding = 1;
	isDesktopView() ? table.style.maxWidth = '98%': table.style.width = '100%';
	table.style.marginLeft = 'auto';
	table.style.marginRight = 'auto';
	let tbody = document.createElement('tbody');
	table.appendChild(tbody);
	let ui_tr = isDesktopView() ? 'mh_tdtitre' : 'ui-bar-b ui-corner-top';
	let tr = appendTr(tbody, ui_tr);
	let td = appendTdCenter(tr, 2);
	let span = document.createElement('span');
	appendText(span, titre, true);
	if (description) {
		span.title = description;
	}
	td.appendChild(span);
	node.appendChild(table);
	return tbody;
}

function testCertif(paramURL, callbackOnError) {
	try {
		FF_XMLHttpRequest({
			method: 'GET',
			url: paramURL,
			onload: function (responseDetails) {
				// logMZ('testCertif(' + paramURL + '), callback, status=' + responseDetails.status);
				if (responseDetails.status == 0) {
					callbackOnError();
				}	// FAIL si status == 0
			}
		});
	} catch (exc) {
		logMZ(`erreur testCertif(${paramURL})`, exc);
		callbackOnError();
	}
}

function createOrGetGrandCadre() {
	let rappels, grandCadre = document.getElementById('grandCadre');
	if (grandCadre) {
		return grandCadre;
	}
	try {
		rappels = document.evaluate(
			"//p[contains(a/text(),'messagerie')]", document, null, 9, null
		).singleNodeValue;
	} catch (exc) {
		avertissement('Tu es en HTTPS. Pour bénéficier de MoutyZilla, tu devrais débloquer le contenu mixte');
		grandCadre = document.createElement('div');
		return grandCadre;
	}
	grandCadre = document.createElement('div');
	grandCadre.id = 'grandCadre';
	let sousCadre = document.createElement('div');
	sousCadre.innerHTML = 'Tu es en <span style="color:blue">HTTPS</span>.';
	sousCadre.style.textAlign = 'center';
	sousCadre.style.fontSize = 'xx-large';
	grandCadre.appendChild(sousCadre);

	grandCadre.style.border = 'solid 5px red';
	grandCadre.style.width = 'auto';
	insertBefore(rappels, grandCadre);
	return grandCadre;
}

function showHttpsErrorCadre1() {
	logMZ('showHttpsErrorCadre1');
	let grandCadre = createOrGetGrandCadre();
	let sousCadre = document.createElement('div');
	sousCadre.innerHTML = `${'<b>Tu n\'as pas accepté le certificat1 de Raistlin.</b>' +
		'<br />Cela empêchera Moutyzilla de fonctionner' +
		'<br /><a style="color:blue;font-size: inherits;" href="'}${URL_CertifRaistlin1
		}" target="raistlin">clique ici</a>` +
		`<br />puis « Avancé » ... « Ajouter une exception » ...` +
		` « Confirmer l'exception de sécurité »` +
		`<br /><i>Il suffit de faire ceci une seule fois jusqu'à ce que Raistlin change son certificat</i>`;
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	sousCadre.style.backgroundColor = 'red';
	grandCadre.appendChild(sousCadre);
}

function showHttpsErrorCadre2() {
	logMZ('showHttpsErrorCadre2');
	let grandCadre = createOrGetGrandCadre();
	let sousCadre = document.createElement('div');
	sousCadre.innerHTML = `${'<b>Tu n\'as pas accepté le certificat2 de Raistlin.</b>' +
		'<br />Cela empêchera le fonctionnement de l\'affichage des Potrõlls dans la vue<br />' +
		'<a style="color:blue;font-size: inherits;" href="'}${URL_CertifRaistlin2
		}" target="raistlin">clique ici</a>` +
		`<br />puis « Avancé » ... « Ajouter une exception » ...` +
		` « Confirmer l'exception de sécurité »` +
		`<br />(Ignorer ensuite le message sur l'erreur de mot de passe)` +
		`<br /><i>Il suffit de faire ceci une seule fois jusqu'à ce que Raistlin change son certificat</i>`;
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	sousCadre.style.backgroundColor = 'red';
	grandCadre.appendChild(sousCadre);
}

function showHttpsErrorContenuMixte() {
	logMZ('showHttpsErrorContenuMixte');
	let grandCadre = createOrGetGrandCadre();
	let sousCadre = document.createElement('div');
	sousCadre.innerHTML = '<b>Tu n\'as pas autorisé le contenu mixte.</b><br />' +
		'Cela interdit le fonctionnement des <b>services suivants</b> de Mountyzilla (le reste, dont l\'enrichissement de la vue, fonctionne à condition d\'accepter les certificats)' +
		'<ul>' +
		'<li>Interface Bricol\'Troll</li>' +
		'<li>Nouveautés de Mountyzilla</li>' +
		'</ul>' +
		'Pour autoriser le contenu mixte, regarde <a href="https://support.mozilla.org/fr/kb/blocage-du-contenu-mixte-avec-firefox#w_daebloquer-le-contenu-mixte" target="_blank">cette page</a><br />' +
		'<i>Il faudra malheureusement le faire à chaque nouvelle connexion</i>';
	sousCadre.style.width = 'auto';
	sousCadre.style.fontSize = 'large';
	sousCadre.style.border = 'solid 1px black';
	grandCadre.appendChild(sousCadre);
}

/** x~x Jubilaires ----------------------------------------------------- */

function traiterJubilaires() {
	// à faire
}

function traiterJubilaires_a_supprimer() {	// ancienne méthode
	try {
		let URL_anniv = '';
		FF_XMLHttpRequest({
			method: 'GET',
			url: URL_anniv,
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				'Accept': 'application/xml,text/xml',
			},
			onload: function (responseDetails) {
				if (responseDetails.status == 0 && isHTTPS) {
					logMZ(`status=0 à l'appel jubilaires, réponse=${responseDetails.responseText}`);
					// showHttpsErrorContenuMixte();
					return;
				}
				let listeTrolls = responseDetails.responseText.split('\n');
				if (!listeTrolls || listeTrolls.length == 0) {
					return;
				}
				afficherJubilaires(listeTrolls);
			},
		});
	} catch (exc) {
		if (isHTTPS) {
			logMZ('appel jubilaires', exc);
			showHttpsErrorContenuMixte();
		} else {
			avertissement(`Une erreur est survenue (Jubilaires)`, null, null, exc);
		}
	}
}

function afficherJubilaires(listeTrolls) {
	let rappels;
	try {
		rappels = document.evaluate(
			"//p[contains(a/text(),'messagerie')]",
			document, null, 9, null).singleNodeValue;
	} catch (e) {
		return;
	}
	let p = document.createElement('p');
	let tbody = appendTitledTable(p,
		"Les Trõlls qui fêtent leur anniversaire aujourd'hui:",
		'Envoyez leur un message ou un cadeau !'
	);
	let tr = appendTr(tbody, 'mh_tdpage');
	let td = appendTdCenter(tr);
	let small = document.createElement('small');
	td.appendChild(small);
	let first = true;
	for (let i = 0; i < listeTrolls.length; i++) {
		let infos = listeTrolls[i].split(';');
		if (infos.length != 3 || infos[2] === '0') {
			continue;
		}
		if (first) {
			first = false;
		} else {
			appendText(small, ', ');
		}
		let a = document.createElement('a');
		a.href = `javascript:EPV(${infos[0]})`;
		appendText(a, infos[1]);
		small.appendChild(a);
		appendText(small, ` (${infos[2]}${infos[2] === '1' ? ' an)' : ' ans)'}`);
	}
	insertBefore(rappels, p);
}

/** x~x News MZ -------------------------------------------------------- */

function traiterNouvelles() {
	let news = new Array();
	news.push(['2022-12-17', "Ajout de l'affichage des composants de même monstre en tanière sur le détail d'un composant."]);
	news.push(['2022-11-28', 'Mise à jour des nouvelles caractéristiques des équipements. Merci à ceux qui ont saisi les corrections. Prévenir Rouletabille si vous trouvez une erreur.']);
	news.push(['2022-08-16', 'Enrichissement de la page des suivants (voir les options).']);
	news.push([null, 'Les jubilaires ont disparu de Mountyzilla depuis un moment. Ils reviendront peut-être. Patience et espoir sont les maître qualités de l\'utilisateur MZ (et du joueur MH ;).']);
	let d2 = new Date();
	if (d2.getMonth() == 0 && d2.getDate() < 10) {
		news.push([new Date(d2.getFullYear(), 0, 1), `MZ vous souhaite bonne chasse pour ${d2.getFullYear()}`]);
	}
	afficherNouvelles(news);
}

function getLatestChanges() {
	let changes = new Array();
	for (let i = 0; i == 0 || MZ_changeLog[i].startsWith('\t- '); i++) {
		changes.push(MZ_changeLog[i]);
	}
	return changes.join('\n');
}

function afficherNouvelles(items) {
	let footer = getFooter();
	if (!footer) {
		logMZ('afficherNouvelles, impossible de retrouver le footer');
		return;
	}
	let p = document.createElement('p');
	let tbody = appendTitledTable(p, 'Les nouvelles de Mountyzilla');
	let div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.right = 0;
	div.style.top = 0;
	div.style.paddingRight = '3px';
	div.style.whiteSpace = 'nowrap';
	appendText(div, `(version ${GM_info.script.version})`);
	tbody.rows[0].cells[0].style.position = 'relative';
	tbody.rows[0].cells[0].appendChild(div);
	for (let i = 0; i < items.length; i++) {
		let color = undefined;
		let d = undefined;
		if (items[i][0] != null) {
			d = new Date(items[i][0]);
			// plus vieux que 2 mois => ne pas afficher
			let d2 = new Date();
			d2.setMonth(d2.getMonth() - 3);
			if (d < d2) {
				continue;
			}
			// afficher en rouge si moins de 15 jours
			d2 = new Date();
			d2.setDate(d2.getDate() - 15);
			if (d > d2) {
				color = 'red';
			}
		}
		let tr = appendTr(tbody, 'mh_tdpage');
		if (color) {
			tr.style.color = color;
		}
		let td = appendTdCenter(tr);
		td.style.verticalAlign = 'top'; // semble sans effet
		if (d) {
			td.appendChild(document.createTextNode(d.toLocaleDateString('fr-FR')));
		}
		td = appendTd(tr);
		td.appendChild(document.createTextNode(items[i][1]));
	}
	insertBefore(footer, p);

	// changelog
	p = document.createElement('p');
	tbody = appendTitledTable(p, 'Changelog de Mountyzilla');
	tbody.rows[0].cells[0].style.cursor = 'pointer';
	let tr = appendTr(tbody, 'mh_tdpage');
	let td = appendTd(tr);
	td.colSpan = 2;
	let pre = document.createElement('pre');
	appendText(pre, getLatestChanges());
	pre.id = 'mz_changelog'
	pre.style.whiteSpace = 'pre-wrap';
	td.appendChild(pre);
	tbody.rows[0].cells[0].onclick = function () {
		try {
			tbody.rows[0].cells[0].onclick = undefined;
			tbody.rows[0].cells[0].style.cursor = '';
			let pre = document.getElementById('mz_changelog');
			pre.innerText = MZ_changeLog.join('\n');
		} catch (exc) {
			logMZ('affichage changeLog', exc);
		}
	};
	insertBefore(footer, p);

	if (isDEV) {	// Roule 02/02/2017 copie de la conf vers https
		if (false) {	// essai avorté via sessionStorage (ne fonctionne pas)
			if (isHTTPS) {
				logMZ(`[test] sessionStorage.getItem(xxx)=${window.sessionStorage.getItem('xxx')}`);
				logMZ(`[test] window.parent.xxx=${window.parent.xxx}`);
			} else {
				logMZ('[test] début switch to https');
				window.sessionStorage.setItem('xxx', "test session trans https");
				window.parent.xxx = "autre test";
				let url = document.location.href;
				logMZ(`[test] url=${url}`);
				url = url.replace(/http:\/\//i, 'https://');
				logMZ(`[test] switched url=${url}`);
				document.location.href = url;
			}
		}
		if (false) {	// version par utilisation d'un IFrame en https
			if (isHTTPS) {
				// logMZ('[test] window.xxx=' + window.xxx);
				// logMZ('[test] window.name=' + window.name);
				// logMZ('[test] window.document.xxx=' + window.document.xxx);
				// logMZ('[test] window.parent.xxx=' + window.parent.xxx);
				let txt = window.name;
				let tabtxt = txt.split(/µ/);
				for (let i = 0; i < tabtxt.length; i++) {
					logMZ(`[test] config https ${tabtxt[i]}`);
				}
			} else {
				let txt = '';
				for (let i = 0, len = localStorage.length; i < len; ++i) {
					let k = localStorage.key(i);
					// if (k.match(/INFOSIT$/i)) continue;	// masquer le mdp Bricol'Troll
					txt = `${txt}${k}£${localStorage.getItem(k)}µ`;
				}
				let iframe = document.createElement('iframe');
				let url = document.location.href;
				// logMZ('[test] url=' + url);
				url = url.replace(/http:\/\//i, 'https://');
				// logMZ('[test] switched url=' + url);
				// iframe.xxx = "truc en plume";
				iframe.name = txt;
				// window.xxx = "machin";
				iframe.src = url;
				// iframe.document.xxx = "truc en plume";
				document.body.appendChild(iframe);
				iframe.style.display = 'none';
			}
		}
	}
}

/** x~x Main -------------------------------------------------------- */

function do_news() {
	start_script(undefined, 'do_news_log');

	// mémorisation de décalage entre l'heure locale de ce PC/smartphone et l'heure du serveur MH
	let eHServer = document.getElementById("hserveur");
	//console.log('eHServer=' + eHServer);
	if (eHServer) {
		let mhInfo = eHServer.innerText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
		let mhDate = new Date(mhInfo[3], mhInfo[2]-1, mhInfo[1], mhInfo[4], mhInfo[5], mhInfo[6]);
		MY_setValue('MZ_rebours_diff_time', mhDate.getTime() - (new Date()).getTime());
		//console.log('do_news_log MH:' + eHServer.innerText + ', delta=' + MY_getValue('MZ_rebours_diff_time'));
	}

	traiterJubilaires();
	traiterNouvelles();

	displayScriptTime(undefined, 'do_news_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x Tabcompo ------------------------------------------------------- */

function initPopupTabcompo() {
	let popup = document.createElement('div');
	popup.setAttribute('id', 'popupCompo');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; visibility: hidden;' +
		'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopupCompo(evt) {
	let texte = this.getAttribute("texteinfo");
	let popup = document.getElementById('popupCompo');
	popup.innerHTML = texte;
	popup.style.left = `${evt.pageX + 15}px`;
	popup.style.top = `${evt.pageY}px`;
	popup.style.visibility = "visible";
}

function hidePopupCompo() {
	let popup = document.getElementById('popupCompo');
	popup.style.visibility = 'hidden';
}

function createPopupImage_tabcompo(url, text) {
	let img = document.createElement('img');
	img.setAttribute('src', url);
	img.setAttribute('align', 'ABSMIDDLE');
	img.setAttribute("texteinfo", text);
	img.addEventListener("mouseover", showPopupCompo, true);
	img.addEventListener("mouseout", hidePopupCompo, true);
	return img;
}

function formateTexte_tabcompo(texte) {
	texte = texte.replace(/\n/g, "<br/>");
	texte = texte.replace(/^([^<]*) d'un/g, "<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g, "<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g, "$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g, "$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g, "[<b>$1</b>]");
	return texte;
}

function arrondi(x) {
	return Math.ceil(x - 0.5); // arrondi à l'entier le plus proche, valeurs inf
}

function traiteMinerai_tabcompo() {
	if (currentURL.indexOf("as_type=Divers") == -1) {
		return;
	}
	let node;
	try {
		node = document.evaluate("//form/table/tbody[@class='tablesorter-no-sort'" +
			" and contains(./tr/th/text(),'Minerai')]", document, null, 9, null
		).singleNodeValue;
		node = node.nextSibling.nextSibling;
	} catch (e) {
		return;
	}

	let trlist = document.evaluate('./tr', node, null, 7, null);
	for (let i = 0; i < trlist.snapshotLength; i++) {
		node = trlist.snapshotItem(i);
		let nature = node.childNodes[5].textContent;
		let caracs = node.childNodes[7].textContent;
		let taille = caracs.match(/\d+/)[0];
		let coef = 1;
		if (caracs.indexOf('Moyen') != -1) {
			coef = 2;
		} else if (caracs.indexOf('Normale') != -1) {
			coef = 3;
		} else if (caracs.indexOf('Bonne') != -1) {
			coef = 4;
		} else if (caracs.indexOf('Exceptionnelle') != -1) {
			coef = 5;
		}
		if (nature.indexOf('Mithril') != -1) {
			coef = 0.2 * coef;
			appendText(node.childNodes[7], ` | UM: ${arrondi(taille * coef)}`);
		} else {
			coef = 0.75 * coef + 1.25;
			if (nature.indexOf('Taill') != -1) {
				coef = 1.15 * coef;
			}
			appendText(node.childNodes[7], ` | Carats: ${arrondi(taille * coef)}`);
		}
	}
}

// Roule' 06/01/2017 ne fonctionne plus, la récupération des nodes ne donne rien
function treateComposants() {
	if (currentURL.indexOf("as_type=Compo") == -1) {
		return;
	}
	// On récupère les composants
	let nodes = document.evaluate(
		"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]" +
		"/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') " +
		"and (contains(td[3]/text()[2],'Tous les trolls') or contains(td[3]/text()[1],'Tous les trolls') ) " +
		"and td[1]/img/@alt = 'Identifié']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
		// logMZ('treateComposants DOWN');
		return;
	}
	// logMZ('treateComposants nbnodes=' + nodes.snapshotLength);

	let texte = "";
	for (let i = 0; i < nodes.snapshotLength; i++) {
		let n1 = nodes.snapshotItem(i).childNodes[1];
		let n3 = nodes.snapshotItem(i).childNodes[3];
		let debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		let prix = n3.childNodes[0].nodeValue;
		if (!prix) {
			prix = `${n3.childNodes[3].getAttribute('value')} GG'`;
		}
		texte = `${texte}${debut.substring(debut.indexOf('[') + 1, debut.indexOf(']'))};${n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
			}${n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '')};${prix.replace(/\n/g, '')}\n`;
	}

	let c = document.evaluate("//div[@class = 'titre2']/text()",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	let id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.lastIndexOf('(') + 1, id_taniere.lastIndexOf(')'));

	// gath: 'getFormComboDB' is not defined
	let form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
		texte.replace(/\240/g, " ").replace(/d'un/g, "d un"));
	if (form) {
		if (document.getElementsByTagName('form').length > 0) {
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		} else {
			let thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateAllComposants() {
	if (currentURL.indexOf("as_type=Compo") == -1) {
		return;
	}

	// On récupère les composants
	let categ = document.evaluate("count(//table/descendant::text()[contains(.,'Sans catégorie')])",
		document, null, 0, null).numberValue;
	let cat = categ == 0 ? 3 : 4;
	let nodes = document.evaluate(`${"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') " +
		"or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]/following::table[@width = '100%']" +
		"/descendant::tr[contains(td[1]/a/b/text(),']') and (" +
		"td["}${cat}]/text()[1] = '\u0040-\u0040' ` +
		`or contains(td[${cat}]/text()[2],'Tous les trolls') ` +
		`or contains(td[${cat}]/text()[1],'Tous les trolls') ` +
		`or (count(td[${cat}]/text()) = 1 and td[${cat}]/text()[1]='n°') ) ` +
		`and td[1]/img/@alt = 'Identifié']`,
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
		//		 avertissement('treateAllComposants DOWN');
		return;
	}

	let texte = "";
	for (let i = 0; i < nodes.snapshotLength; i++) {
		let n1 = nodes.snapshotItem(i).childNodes[1];
		let n3 = nodes.snapshotItem(i).childNodes[3];
		let debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		let prix = n3.childNodes[0].nodeValue;
		if (!prix) {
			if (n3.childNodes[3].getAttribute('value') && n3.childNodes[3].getAttribute('value') != "") {
				prix = `${n3.childNodes[3].getAttribute('value')} GG'`;
			}
		} else {
			prix = prix.replace(/[\240 ]/g, "");
			if (prix == "-") {
				prix = null;
			}
		}
		if (prix) {
			texte = `${texte}${debut.substring(debut.indexOf('[') + 1, debut.indexOf(']'))};${n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				}${n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '')};${prix.replace(/\n/g, '')}\n`;
		} else {
			texte = `${texte}${debut.substring(debut.indexOf('[') + 1, debut.indexOf(']'))};${n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				}${n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '')};pas défini\n`;
		}
	}

	let t2 = document.evaluate("//div[@class = 'titre2']/text()",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	let id_taniere = t2.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.indexOf('(') + 1, id_taniere.indexOf(')'));

	// gath: 'getFormComboDB' is not defined
	let form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
		texte.replace(/\240/g, " ").replace(/d'un/g, "d un"), "Vendre tous les composants non réservés sur le Troc de l\'Hydre");
	if (form) {
		if (document.getElementsByTagName('form').length > 0) {
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		} else {
			let thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateEM() {
	if (1) {
		return;
	}	// Roule' 06/01/2017 ne fonctionne plus depuis.... longtemps
	if (currentURL.indexOf("as_type=Compo") == -1) {
		return false;
	}
	let urlImg = `${URL_MZimg}Competences/ecritureMagique.png`;
	let nodes = document.evaluate("//tr[@class='mh_tdpage']"
		, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
		return false;
	}
	for (let i = 0; i < nodes.snapshotLength; i++) {
		let desc = nodes.snapshotItem(i).getElementsByTagName('td');
		let link = desc[2].firstChild;
		let nomCompoTotal = desc[2].textContent;
		let nomCompo = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"), nomCompoTotal.length);
		let nomMonstre = trim(nomCompoTotal.substring(nomCompoTotal.indexOf(" ") + 1, nomCompoTotal.length - 1));
		let locqual = desc[3].textContent;
		let qualite = trim(locqual.substring(locqual.indexOf("Qualité:") + 9));
		let localisation = trim(locqual.substring(0, locqual.indexOf("|") - 1));
		// gath: 'isEM' is not defined
		if (isEM(nomMonstre).length > 0) {
			let infos = composantEM(nomMonstre, trim(nomCompo), localisation, getQualite(qualite));
			if (infos.length > 0) {
				let shortDescr = "Variable";
				let bold = 0;
				if (infos != "Composant variable") {
					shortDescr = infos.substring(0, infos.indexOf(" "));
					if (parseInt(shortDescr) >= 0) {
						bold = 1;
					}
				}
				link.parentNode.appendChild(createImage(urlImg, infos));
				appendText(link.parentNode, ` [${shortDescr}]`, bold);
			}
		}
	}
}

function treateChampi_tabcompo() {
	if (currentURL.indexOf('as_type=Champi') == -1) {
		return false;
	}
	let nodes = document.evaluate("//img[@alt = 'Identifié']/../a/text()[1]",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
		return false;
	}

	for (let i = 0; i < nodes.snapshotLength; i++) {
		let node = nodes.snapshotItem(i);
		let nomChampi = trim(node.nodeValue.replace(/\240/g, ' '));
		if (moisChampi[nomChampi]) { // gath: 'moisChampi' is not defined
			appendText(node.parentNode.parentNode, ` [Mois ${moisChampi[nomChampi]}]`);
		}
	}
}

function treateEnchant() {
	if (currentURL.indexOf("as_type=Compo") == -1) {
		return false;
	}
	try {
		if (!listeMonstreEnchantement) {
			computeCompoEnchantement();
		}
		let nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]" +
			"/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') " +
			"and td[1]/img/@alt = 'Identifié']/td[1]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0) {
			return false;
		}
		let urlImg = `${URL_MZimg}enchant.png`;
		for (let i = 0; i < nodes.snapshotLength; i++) {
			let link = nodes.snapshotItem(i);
			let nomCompoTotal = link.firstChild.nodeValue;
			let nomCompo = nomCompoTotal.substring(0, nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"), nomCompoTotal.length);
			let nomMonstre = nomCompoTotal.substring(nomCompoTotal.indexOf(" ") + 1, nomCompoTotal.length);
			nomCompoTotal = link.childNodes[1].childNodes[0].nodeValue;
			let qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité") + 11, nomCompoTotal.indexOf(" ["));
			let localisation = nomCompoTotal.substring(nomCompoTotal.indexOf("[") + 1, nomCompoTotal.indexOf("]"));
			if (isEnchant(nomMonstre).length > 0) {
				let infos = composantEnchant(nomMonstre, nomCompo, localisation, getQualite(qualite));
				if (infos.length > 0) {
					link.parentNode.appendChild(createImage(urlImg, infos));
				}
			}
		}
	} catch (exc) {
		avertissement(`Une erreur est survenue (treateEnchant)`, null, null, exc);
	}
}

function treateEquipEnchant() {
	if (currentURL.indexOf('as_type=Arme') == -1 && currentURL.indexOf('as_type=Armure') == -1) {
		return false;
	}
	initPopupTabcompo();
	computeEnchantementEquipement(createPopupImage_tabcompo, formateTexte_tabcompo);
}

function do_tancompo() {
	start_script(undefined, 'do_tancompo_log');

	treateAllComposants();
	treateComposants();
	traiteMinerai_tabcompo();
	if (MY_getValue('NOINFOEM') != 'true') {
		treateChampi_tabcompo();
		treateEM();
	}
	if (MY_getValue(`${numTroll}.enchantement.liste`) && MY_getValue(`${numTroll}.enchantement.liste`) != '') {
		treateEnchant();
		treateEquipEnchant();
	}

	displayScriptTime(undefined, 'do_tancompo_log');
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x pjView --------------------------------------------------------- */

/* TODO
 * - MZ2.0 : Implémenter les BDD en dur dans le module interne
 */

var DivInfo; // Bulle d'infos
var freezed = false; // Booléen stockant l'état de freezing de la bulle

// liste du matos
// mh_caracs ['Nom'] = [ 'Type', 'AttP', 'AttM', 'DegP','DegM', 'Esq',
// 'ArmP','ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max' ];
var mh_caracs = {
	'anneau de protection':
		['anneau', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 3.00, 3.00],
	"armure d'anneaux":
		['armure', 0, 0, 0, 0, -4, 8, 0, 0, 0, 90, 180, 0, 0, 0, 0.00, 50.00, 50.00],
	'armure de bois':
		['armure', 0, 0, 0, 0, -3, 6, 0, 0, 0, 50, 100, 0, 0, 15, 0.00, 40.00, 40.00],
	'armure de cuir':
		['armure', 0, 0, 0, 0, 3, 4, 0, 0, 0, 40, 80, 0, 0, 0, 0.00, 10.00, 10.00],
	'armure de peaux':
		['armure', 0, 0, 0, 0, -3, 9, 0, 0, 0, 70, 140, 0, 0, 0, 0.00, 45.00, 45.00],
	'armure de pierre':
		['armure', 0, 0, 0, 0, -6, 12, 0, 0, 3, 75, 150, 0, 0, 0, 0.00, 75.00, 75.00],
	'armure de plates':
		['armure', 0, 0, 0, 0, -2, 10, 0, 0, 0, 50, 100, 0, 0, 0, 0.00, 62.50, 62.50],
	'baton lesté':
		['arme', 10, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 10.00, 10.00],
	'bâtons de parade':
		['arme', 0, -3, 0, -2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 10.00, 10.00],
	'bottes':
		['bottes', 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 5.00, 5.00],
	'bouclier à pointes':
		['bouclier', 1, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 20.00, 20.00],
	'boulet et chaîne':
		['arme', -1, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 7.50, 7.50],
	'cagoule':
		['casque', 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 5, 10, 0, 0.00, 2.50, 2.50],
	'casque à cornes':
		['casque', 0, 0, 1, 0, 0, 3, 0, -1, 0, 5, 10, 0, 0, 0, 0.00, 5.00, 5.00],
	'casque à pointes':
		['casque', 1, 0, 1, 0, 0, 3, 0, -1, 0, 0, 0, 0, 0, 0, 0.00, 6.00, 6.00],
	'casque en cuir':
		['casque', 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 5.00, 5.00],
	'casque en métal':
		['casque', 0, 0, 0, 0, 0, 2, 0, -1, 0, 5, 10, 0, 0, 0, 0.00, 5.00, 5.00],
	'chaîne cloutée':
		['arme', -2, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 35.00, 35.00],
	'chapeau pointu':
		['casque', 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 5, 10, 0, 0.00, 5.00, 5.00],
	'collier de dents':
		['talisman', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5.00, 1.00, 1.00],
	'collier de pierre':
		['talisman', 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 5, 10, 0, 0.00, 2.50, 2.50],
	'collier à pointes':
		['talisman', 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 1.00, 1.00],
	'cotte de mailles':
		['armure', 0, 0, 0, 0, -1, 7, 0, 0, 0, 30, 60, 0, 0, 0, 0.00, 42.50, 42.50],
	'couronne de cristal':
		['casque', 0, 0, 0, 1, -1, 0, -1, 3, 0, 0, 0, 0, 0, 0, 0.00, 10.00, 10.00],
	"couronne d'obsidienne":
		['casque', 0, 0, 0, 0, 0, 1, 2, 0, -1, 0, 0, 0, 0, 0, 0.00, 10.00, 10.00],
	"coutelas d'obsidienne":
		['arme', 2, 0, 3, 0, 2, 0, 0, 0, -2, -10, -5, -30, -15, 0, 0.00, 5.00, 5.00],
	'coutelas en os':
		['arme', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 4.00, 4.00],
	'crochet':
		['arme', -1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 6.50, 6.50],
	'cuir bouilli':
		['armure', 0, 0, 0, 0, 1, 8, 0, 0, 0, 20, 40, 0, 0, 0, 0.00, 20.00, 20.00],
	"cuirasse d'ossements":
		['armure', 0, 0, 0, 0, -3, 6, 0, 0, 0, 50, 100, 20, 40, 0, 0.00, 40.00, 40.00],
	"cuirasse d'écailles":
		['armure', 0, 0, 0, 0, -1, 6, 0, 0, 0, 38, 70, 0, 0, 0, 0.00, 37.50, 37.50],
	'culotte en cuir':
		['armure', 0, 0, 0, 0, 5, 0, 0, 0, 0, 60, 120, 0, 0, 0, 0.00, 2.50, 2.50],
	'dague':
		['arme', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 2.50, 2.50],
	'epée courte':
		['arme', 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 5.00, 5.00],
	'epée longue':
		['arme', -1, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 12.50, 12.50],
	'espadon':
		['arme', -6, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 40.00, 40.00],
	'fouet':
		['arme', 7, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 7.50, 7.50],
	'fourrures':
		['armure', 0, 0, 0, 0, 2, 6, 0, 0, 0, 30, 60, 0, 0, 0, 0.00, 15.00, 15.00],
	'gantelet':
		['arme', -1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 4.00, 4.00],
	'gorgeron en cuir':
		['talisman', 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 2.50, 2.50],
	'gorgeron en métal':
		['talisman', 0, 0, 0, 0, 0, 3, 0, 0, -1, 10, 20, 0, 0, 0, 0.00, 2.50, 2.50],
	'gourdin':
		['arme', 2, 0, 5, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 12.50, 12.50],
	'gourdin clouté':
		['arme', -1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 15.00, 15.00],
	'grimoire':
		['bouclier', 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 5, 10, 0, 15.00, 10.00, 10.00],
	"gros'porte":
		['bouclier', 0, 0, 0, 0, 0, 5, 0, 0, 0, 10, 20, 0, 0, 0, 0.00, 30.00, 30.00],
	'grosse racine':
		['arme', 0, 0, 0, 0, -1, 2, 0, 0, 0, 5, 10, 0, 0, 5, 0.00, 20.00, 20.00],
	'grosse stalagmite':
		['arme', -20, 0, 28, 0, -15, 0, 0, -4, 0, 0, 0, 0, 0, 0, 0.00, 90.00, 90.00],
	'hache de bataille':
		['arme', -2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 18.00, 18.00],
	'hache de guerre en os':
		['arme', 0, -2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 15, 30, 0, 0.00, 25.00, 25.00],
	'hache de guerre en pierre':
		['arme', -10, 0, 14, 0, 0, 0, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 60.00, 60.00],
	"hache à deux mains d'obsidienne":
		['arme', -8, 0, 16, 0, 0, 0, 0, 0, -4, -90, -45, -30, -15, 0, 0.00, 75.00, 75.00],
	'hallebarde':
		['arme', -5, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 37.50, 37.50],
	"haubert d'écailles":
		['armure', 0, 0, 0, 0, -2, 8, 0, 0, 0, 40, 80, 0, 0, 0, 0.00, 25.00, 25.00],
	'haubert de mailles':
		['armure', 0, 0, 0, 0, -3, 9, 0, 0, 0, 70, 140, 0, 0, 0, 0.00, 55.00, 55.00],
	'heaume':
		['casque', -1, 0, 0, 0, 0, 4, 0, -2, 0, 10, 20, 0, 0, 0, 0.00, 13.00, 13.00],
	'jambières en cuir':
		['bottes', 0, 0, 0, 0, 1, 2, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 10.00, 10.00],
	'jambières en fourrure':
		['bottes', 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 2.50, 2.50],
	'jambières en maille':
		['bottes', 0, 0, 0, 0, 0, 3, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 13.00, 13.00],
	'jambières en métal':
		['bottes', 0, 0, 0, 0, -1, 4, 0, 0, 0, 5, 10, 0, 0, 0, 0.00, 15.00, 15.00],
	'jambières en os':
		['bottes', 0, 0, 0, 0, -1, 2, 0, 0, 0, 5, 10, 5, 10, 0, 0.00, 10.00, 10.00],
	"lame d'obsidienne":
		['arme', 3, 0, 7, 0, 0, 0, 0, 0, -3, -60, -30, -20, -10, 0, 0.00, 20.00, 20.00],
	'lame en os':
		['arme', 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 5, 10, 0, 0.00, 8.00, 8.00],
	'lame en pierre':
		['arme', -1, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0.00, 20.00, 20.00],
	'lorgnons':
		['casque', 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 10, 0, 0.00, 1.00, 1.00],
	'machette':
		['arme', 1, 0, 2, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 13.00, 13.00],
	"masse d'arme":
		['arme', 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 8.00, 8.00],
	'pagne de mailles':
		['armure', 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 4, 4],
	'pagne en cuir':
		['armure', 0, 0, 0, 0, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 5.00, 5.00],
	'robe de mage':
		['armure', 0, 0, 0, 0, 2, 1, 3, 0, 0, 10, 20, 10, 20, 0, 0.00, 20.00, 20.00],
	'rondache en bois':
		['bouclier', 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 5, 0.00, 15.00, 15.00],
	'rondache en métal':
		['bouclier', 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 18.00, 18.00],
	'sandales':
		['bottes', 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 2.50, 2.50],
	'souliers dorés':
		['bottes', 0, 0, 0, 0, -1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0.00, 10.00, 10.00],
	"talisman d'obsidienne":
		['talisman', 1, 0, 2, 0, 0, 0, 0, 0, -4, 20, 40, 20, 40, 0, 0.00, 2.50, 2.50],
	'talisman de pierre':
		['talisman', 0, 0, 0, 0, 0, 0, 0, 0, 2, 10, 20, 10, 20, 0, 0.00, 2.50, 2.50],
	'targe':
		['bouclier', 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.00, 3.00, 3.00],
	'torche':
		['arme', 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0.00, 8.00, 8.00],
	'torque de pierre':
		['talisman', 0, 0, 0, 0, 0, 0, 0, 0, -2, 20, 40, 20, 40, 0, 0.00, 2.50, 2.50],
	'tunique':
		['armure', 0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 10, 5, 10, 0, 0.00, 2.50, 2.50],
	"tunique d'écailles":
		['armure', 0, 0, 0, 0, 0, 3, 0, 0, 0, 15, 30, 0, 0, 0, 0.00, 8.00, 8.00],
	'turban':
		['casque', 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 30, 15, 30, 0, 0.00, 2.50, 2.50],
	'Couronne de ronces':
		['casque', 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -5, 0, 5, 5],
	'Oeil de sang':
		['talisman', 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 10, 20, -5, 0, 3, 3],
	'Pendentif incandescent':
		['talisman', 0, -1, 0, -1, 3, 0, 0, 0, 0, 10, 20, 10, 20, 0, 0, 3, 3],
	'Filet':
		['arme', 0, -1, 0, -1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
	'Menhir':
		['arme', -4, 0, 0, 0, -5, 10, 0, -3, 0, 20, 40, 0, 0, 0, 0, 50, 50],
	'Baton de mage':
		['arme', 0, 8, 0, -2, 0, 0, 0, 0, 0, 0, 0, 15, 30, 0, 0, 10, 10],
};

// liste des templates
// mh_templates['Nom'] = [ 'AttP', 'AttM', 'DegP', 'DegM', 'Esq',
// 'ArmP', 'ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
var mh_templates = {
	'de Feu':
		[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'de Résistance':
		[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"de l'Aigle":
		[0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'de la Salamandre':
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Cyclopes':
		[0, 1, 0, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Enragés':
		[0, 1, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Tortues':
		[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0],
	'des Vampires':
		[0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	'du Glacier':
		[0, 1, 0, 0, 0, 0, 1, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0],
	'du Rat':
		[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'du Roc':
		[0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'du Temps':
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -30, 0, 0],
	'du Vent':
		[0, 0, 0, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'en Mithril':
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Anciens':
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Champions':
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'des Duellistes':
		[0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'de la Terre':
		[0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 5, 30, 0, 0],
	"de l'Orage":
		[0, 0, 0, -1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"de l'Ours":
		[0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 30, 0, 0],
	'des Béhémoths':
		[0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0],
	'des Mages':
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0],
	'du Pic':
		[0, 0, 0, 0, -1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'du Sable':
		[0, 0, 0, 0, 3, 0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'acéré':
		[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'acérée':
		[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'équilibré':
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'équilibrée':
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'léger':
		[0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	'légère':
		[0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	'renforcé':
		[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 0, 0],
	'renforcée':
		[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 0, 0],
	'robuste':
		[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 0, 0],
};

function clone(arr) {
	// Clonage rapide
	return arr.slice(0);
}

function addArray(arr1, arr2) {
	// Somme matricielle
	let res = clone(arr1);
	for (let i = res.length - 1; i >= 0; i--) {
		res[i] += arr2[i];
	}
	return res;
}

function getTemplates(nomItem) {
	// Déstructure le nom de l'item en array [nom, template1, ...]
	let tempFound = true;
	let str = nomItem.trim();
	let arr = [];
	while (tempFound) {
		tempFound = false;
		for (let temp in mh_templates) {
			// on teste la fin du nom contre chaque template
			if (str.slice(-temp.length) != temp) {
				continue;
			}
			tempFound = true;
			str = str.slice(0, -temp.length - 1);
			arr.unshift(temp);
			if (str.slice(-3) == ' et') {
				str = str.slice(0, -3);
			}
		}
	}
	arr.unshift(str);
	return arr;
}

function addMithril(arrayCaracs, typeItem) {
	// Ajoute l'effet du Mithril sur les caracs
	return arrayCaracs;	// il n'y a plus de modif des caracs
	// on garde la suite, si jamais ça revenait
	if (typeItem == 'arme') {
		if (arrayCaracs[0] < 0) {
			arrayCaracs[0] = Math.ceil(arrayCaracs[0] / 2);
		}
	} else if (arrayCaracs[4] < 0) {
		arrayCaracs[4] = Math.ceil(arrayCaracs[4] / 2);
	}
	arrayCaracs[15] = arrayCaracs[15] / 2;
	arrayCaracs[16] = arrayCaracs[16] / 2;
	return arrayCaracs;
}

function addRenfort(arrayCaracs, template) {
	// Ajoute l'effet des pseudo-templates sur les caracs
	// S'applique APRÈS le mithril
	// WARNING - Cette formule n'a rien d'officiel, gare !
	let coef = 0;
	if ((/^lég[e,è]re?$/).test(template)) {
		coef = -1;
	} else if ((/^renforcée?$/).test(template) ||
		template === 'robuste') {
		coef = 1;
	}
	if (coef) {
		arrayCaracs[15] = arrayCaracs[15] + coef * Math.floor(arrayCaracs[15] / 10);
		arrayCaracs[16] = arrayCaracs[16] + coef * Math.floor(arrayCaracs[16] / 10);
	}
	arrayCaracs = addArray(arrayCaracs, mh_templates[template]);
	return arrayCaracs;
}

function getCaracs(item) {
	// Calcule les caractéristiques de l'item
	let templates = getTemplates(item);
	if (!mh_caracs[templates[0]]) {
		// Si l'item est inconnu
		return [];
	}
	let caracs = clone(mh_caracs[templates[0]]);
	let typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if (templates[templates.length - 1] == 'en Mithril') {
		caracs = addMithril(caracs, typeItem);
		templates.pop();
	}
	if ((/^acérée?$/).test(templates[0]) ||
		(/^équilibrée?$/).test(templates[0]) ||
		(/^lég[e,è]re?$/).test(templates[0]) ||
		(/^renforcée?$/).test(templates[0]) ||
		templates[0] == 'robuste') {
		caracs = addRenfort(caracs, templates[0]);
		templates.shift();
	}
	for (let i = templates.length - 1; i >= 0; i--) {
		caracs = addArray(caracs, mh_templates[templates[i]]);
	}
	return caracs;
}

function getLine(tab) {
	// Préparation de la ligne à afficher lors d'un mouseover
	let str = '';
	if (tab[0] != 0 || tab[1] != 0) {
		str = `${str}<b>Att : </b>${aff(tab[0])}`;
		if (tab[1] != 0) {
			str = `${str}/${aff(tab[1])}`;
		}
		str = `${str} | `;
	}
	if (tab[4] != 0) {
		str = `${str}<b>Esq : </b>${aff(tab[4])} | `;
	}
	if (tab[2] != 0 || tab[3] != 0) {
		str = `${str}<b>Deg : </b>${aff(tab[2])}`;
		if (tab[3] != 0) {
			str = `${str}/${aff(tab[3])}`;
		}
		str = `${str} | `;
	}
	if (tab[8] != 0) {
		str = `${str}<b>Reg : </b>${aff(tab[8])} | `;
	}
	if (tab[7] != 0) {
		str = `${str}<b>Vue : </b>${aff(tab[7])} | `;
	}
	if (tab[5] != 0 || tab[6] != 0) {
		str = `${str}<b>Arm : </b>${aff(tab[5])}`;
		if (tab[6] != 0) {
			str = `${str}/${aff(tab[6])}`;
		}
		str = `${str} | `;
	}
	if (tab[9] != 0 || tab[10] != 0) {
		str = `${str}<b>RM : </b>${aff(tab[9])}%`;
		if (tab[9] != tab[10]) {
			str = `${str}/${aff(tab[10])}%`;
		}
		str = `${str} | `;
	}
	if (tab[11] != 0 || tab[12] != 0) {
		str = `${str}<b>MM : </b>${aff(tab[11])}%`;
		if (tab[11] != tab[12]) {
			str = `${str}/${aff(tab[12])}%`;
		}
		str = `${str} | `;
	}
	if (tab[13] != 0) {
		str = `${str}<b>PV : </b>${aff(tab[13])} | `;
	}
	if (tab[14] != 0) {
		str = `${str}<b>DLA : </b>${aff(tab[14])} min | `;
	}
	str = `${str}<b>Poids : </b>${tab[15]} min`;
	if (tab[15] != tab[16]) {
		str = `${str} / ${tab[16]} min`;
	}
	return str;
}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.id = 'infosVue';
	DivInfo.className = 'mh_textbox';
	DivInfo.style =
		'position: absolute;' +
		'visibility:hidden;' +
		'display:inline;' +
		'z-index:99;';
	document.body.appendChild(DivInfo);
	document.onmousemove = getXY;
	document.onclick = changeFreezeStatus;
}

function getXY(evt) {
	if (!freezed && DivInfo.style.visibility == 'visible') {
		DivInfo.style.left = `${evt.pageX}px`;
		DivInfo.style.top = `${evt.pageY + 10}px`;
	}
}

function changeFreezeStatus() {
	if (DivInfo.style.visibility == 'visible') {
		freezed = !freezed;
		if (!freezed) {
			hideInfos();
		}
	}
}

function showInfos() {
	if (freezed) {
		return;
	}
	let currentInfos = this.infos;
	DivInfo.innerHTML = currentInfos;
	DivInfo.style.visibility = 'visible';
	let compStyles = window.getComputedStyle(DivInfo);
	if (compStyles.getPropertyValue('background-color') == 'rgba(0, 0, 0, 0)') {
		DivInfo.style.backgroundColor = 'rgb(255, 255, 238)';
	}
}

function hideInfos() {
	if (!freezed) {
		DivInfo.style.visibility = 'hidden';
	}
}

function treateEquipement() {
	// Extrait les données du matos et réinjecte les infos déduites
	if (MY_getValue('INFOCARAC') == 'false') {
		return;
	}

	let faireLigne = false;
	let caracs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	let nodes = document.evaluate(
		"//td/b[text()='Equipement Utilisé']/../../" +
		"td[2]/img[contains(@src,bullet)]",
		document, null, 7, null);
	if (nodes.snapshotLength > 0) {
		// Si CSS de base
		for (let i = 0; i < nodes.snapshotLength; i++) {
			let node = nodes.snapshotItem(i);
			let next = node.nextSibling;
			let nnext = next.nextSibling;
			let nom = next.nodeValue.toLowerCase();
			if (nnext.childNodes.length == 1) {
				nom = nom + nnext.firstChild.nodeValue;
			}
			nom = nom.trim();
			// gestion winpostrophe
			let c = String.fromCharCode(180);
			while (nom.indexOf(c) != -1) {
				nom = nom.replace(c, "'");
			}
			let arr = getCaracs(nom);
			if (arr.length > 0) {
				faireLigne = true;
				caracs = addArray(caracs, arr);
				let span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.infos = getLine(arr);
				span.onmouseover = showInfos;
				span.onmouseout = hideInfos;
				insertBefore(node.nextSibling, span);
			}
		}

		if (faireLigne) {
			let node = document.evaluate("//td/b[text()='Equipement Utilisé']",
				document, null, 9, null).singleNodeValue;
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	} else {
		// Si CSS avancée
		nodes = document.evaluate("//dd[@class='equipement']/ul/li",
			document, null, 7, null);
		if (nodes.snapshotLength > 0) {
			for (let i = 0; i < nodes.snapshotLength; i++) {
				let node = nodes.snapshotItem(i);
				let nom = node.firstChild.nodeValue.toLowerCase();
				if (node.childNodes.length > 1 && node.childNodes[1].firstChild) {
					nom = nom + node.childNodes[1].firstChild.nodeValue;
				}
				nom = nom.trim();
				// gestion winpostrophe
				let c = String.fromCharCode(180);
				while (nom.indexOf(c) != -1) {
					nom = nom.replace(c, "'");
				}
				let arr = getCaracs(nom);
				if (arr.length != 0) {
					caracs = addArray(caracs, arr);
					node.infos = getLine(arr);
					node.onmouseover = showInfos;
					node.onmouseout = hideInfos;
				}
			}
			nodes = document.evaluate("//dt[@class='equipement']",
				document, null, 7, null);
			let node = nodes.snapshotItem(0);
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	}
}

function do_pjview() {
	treateEquipement();
	toolTipInit();
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Option --------------------------------------------------------- */

/* TODO
 * Passer le HTML injecté aux conventions HTML5
 */


/** x~x Fonctions de sauvegarde ---------------------------------------- */
function saveITData() {
	let IT = document.getElementById('itSelect').value;
	let nBricol = 1;
	if (IT == 'bricol') {
		for (let iBricol = 0; ; iBricol++) {
			let extClef = nBricol == 1 ? '' : nBricol;
			let eltSystem = document.getElementById(`urlbricol${iBricol}`);
			if (eltSystem == undefined) {
				break;
			}
			let system = eltSystem.value;
			let login = document.getElementById(`loginbricol${iBricol}`).value;
			let pass = document.getElementById(`passbricol${iBricol}`).value;
			let affhv = document.getElementById('affhvbricol').checked ? 1 : 0;
			if (system && login) {
				if (pass) {
					let v = `bricol$${system}$${login}$${hex_md5(pass)}$${affhv}`;
					MY_setValue(`${numTroll}.INFOSIT${extClef}`, v);
					logMZ(`saveITData() save ${numTroll}.INFOSIT${extClef}`);
				} else {
					// vérif que rien n'a changé
					let str = MY_getValue(`${numTroll}.INFOSIT${extClef}`);
					if (str) {
						let arr = str.split('$');
						if (system != arr[1] || login != arr[2] || affhv != arr[4]) {
							window.alert(`Attention, système tactique Bricol'Trolls ${system} sans mot de passe => non modifié`);
						}
					}
				}
				nBricol++;
			}
		}
	} else {
		for (let iBricol = 1; ; iBricol++) {
			let extClef = nBricol == 1 ? '' : iBricol;
			let sInfo = MY_getValue(`${numTroll}.INFOSIT${extClef}`);
			if (!sInfo) {
				break;
			}
			MY_removeValue(`${numTroll}.INFOSIT${extClef}`);
			logMZ(`saveITData() remove ${numTroll}.INFOSIT${extClef}`);
			nBricol++;
		}
	}
}

function saveLinks() {
	let numLinks = document.getElementById('linksBody').childNodes.length;
	let data = [[]];

	/* Récupération et tri des liens */
	for (let i = 1; i <= numLinks; i++) {
		MY_removeValue(`URL${i}`);
		MY_removeValue(`URL${i}.nom`);
		MY_removeValue(`URL${i}.ico`);
		let url = document.getElementById(`url${i}`).value;
		let nom = document.getElementById(`nom${i}`).value;
		let ico = document.getElementById(`ico${i}`).value;
		if (url && (nom || ico)) {
			data.push([url, nom ? nom : '', ico ? ico : '']);
		}
	}

	/* Sauvegarde */
	for (let i = 1; i < data.length; i++) {
		MY_setValue(`URL${i}`, data[i][0]);
		MY_setValue(`URL${i}.nom`, data[i][1]);
		MY_setValue(`URL${i}.ico`, data[i][2]);
	}
}

function saveAll() {
	try {
		let urlIco = document.getElementById('icoMenuIco').value;
		if (urlIco) {
			MY_setValue(`${numTroll}.ICOMENU`, urlIco);
		} else {
			MY_removeValue(`${numTroll}.ICOMENU`, urlIco);
			document.getElementById('icoMenuIco').value = '';
		}
		saveLinks();
		refreshLinks();

		MZ_setOrRemoveValue('VUEEXT', document.getElementById('vueext').value);

		let maxcdm = parseInt(document.getElementById('maxcdm').value);
		if (maxcdm) {
			MZ_setOrRemoveValue(`${numTroll}.MAXCDM`, maxcdm);
		} else {
			MY_removeValue(`${numTroll}.MAXCDM`);
			document.getElementById('maxcdm').value = '';
		}

		MZ_setOrRemoveValue('NOINFOEM', document.getElementById('noInfoEM').checked);

		// Pourquoi Tilk stockait-il tout en str ?
		// -> parce que les booléens c'est foireux (vérifié)
		MZ_setOrRemoveValue(`${numTroll}.USECSS`, document.getElementById('usecss').checked);
		MZ_setOrRemoveValue('INFOCARAC', document.getElementById('infocarac').checked);
		// MY_setValue(numTroll+'.SEND_IDT', document.getElementById('send_idt').checked);
		// Fonctionnalité désactivée

		MZ_setOrRemoveValue(`${numTroll}.AUTOCDM`, document.getElementById('autoCdM').checked);
		// MY_setValue('VUECARAC',	// Roule 12/12/2019 ça ne fait plus rien
		// document.getElementById('vueCarac').checked ? 'true' : 'false');
		MZ_setOrRemoveValue('PRINTSTACK', document.getElementById('printstack').checked);
		MZ_setOrRemoveValue('CONFIRMEDECALAGE', document.getElementById('confirmeDecalage').checked);

		MZ_setOrRemoveValue('COMPTEAREBOURSDLA', document.getElementById('compteAreboursDLA').checked);
		MZ_setOrRemoveValue('COMPTEAREBOURSTITRE', document.getElementById('compteAreboursTitre').checked);
		//MZ_setOrRemoveValue('COMPTEAREBOURSSUIVANTE', document.getElementById('compteAreboursSuivante').checked);

		MZ_setOrRemoveValue('MZ_SuivantsOrdres', document.getElementById('MZ_SuivantsOrdres').value);
		MZ_setOrRemoveValue('MZ_SuivantsCompress', document.getElementById('MZ_SuivantsCompress').checked);
		MZ_setOrRemoveValue('MZ_SuivantsTresUnique', document.getElementById('MZ_SuivantsTresUnique').checked);

		/* SCIZ */
		let sciz_jwt = document.getElementById('sciz_jwt').value;
		if (sciz_jwt !== null && sciz_jwt !== undefined) {
			sciz_jwt = sciz_jwt.replace(new RegExp('[^a-zA-Z0-9\._\-]', 'g'), '');
			MY_setValue(`${numTroll}.SCIZJWT`, sciz_jwt);
		}
		let sciz_cb_events = document.getElementById('sciz_cb_events').checked;
		sciz_cb_events = sciz_cb_events !== null ? sciz_cb_events : true;
		MY_setValue(`${numTroll}.SCIZ_CB_EVENTS`, sciz_cb_events);
		let sciz_cb_view_treasures = document.getElementById('sciz_cb_view_treasures').checked;
		sciz_cb_view_treasures = sciz_cb_view_treasures !== null ? sciz_cb_view_treasures : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_TREASURES`, sciz_cb_view_treasures);
		let sciz_cb_view_mushrooms = document.getElementById('sciz_cb_view_mushrooms').checked;
		sciz_cb_view_mushrooms = sciz_cb_view_mushrooms !== null ? sciz_cb_view_mushrooms : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_MUSHROOMS`, sciz_cb_view_mushrooms);
		let sciz_cb_bestiaire = document.getElementById('sciz_cb_bestiaire').checked;
		sciz_cb_bestiaire = sciz_cb_bestiaire !== null ? sciz_cb_bestiaire : true;
		MY_setValue(`${numTroll}.SCIZ_CB_BESTIAIRE`, sciz_cb_bestiaire);
		let sciz_cb_view_trolls = document.getElementById('sciz_cb_view_trolls').checked;
		sciz_cb_view_trolls = sciz_cb_view_trolls !== null ? sciz_cb_view_trolls : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_TROLLS`, sciz_cb_view_trolls);
		let sciz_cb_view_user = document.getElementById('sciz_cb_view_user').checked;
		sciz_cb_view_user = sciz_cb_view_user !== null ? sciz_cb_view_user : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_USER`, sciz_cb_view_user);
		let sciz_cb_view_traps = document.getElementById('sciz_cb_view_traps').checked;
		sciz_cb_view_traps = sciz_cb_view_traps !== null ? sciz_cb_view_traps : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_TRAPS`, sciz_cb_view_traps);
		let sciz_cb_view_portals = document.getElementById('sciz_cb_view_portals').checked;
		sciz_cb_view_portals = sciz_cb_view_portals !== null ? sciz_cb_view_portals : true;
		MY_setValue(`${numTroll}.SCIZ_CB_VIEW_PORTALS`, sciz_cb_view_portals);
		saveITData();
	} catch (exc) {
		let bouton = document.getElementById('saveAll');
		logMZ('saveAll()', exc);
		bouton.value = "il y a eu une erreur";
		return;
	}

	let bouton = document.getElementById('saveAll');
	bouton.value = bouton.value == 'Sauvegardé !' ? 'Re-sauvegardé !' : 'Sauvegardé !';
}

/** x~x EventListeners ------------------------------------------------- */
function addBricolIT(sSystem, sLogin, nAffhv, bFirst, bLast) {
	let itBody = document.getElementById('itBody');
	let nTr = itBody.rows.length;
	// enlever tous les "+" des lignes précédentes
	for (let iTr = 0; iTr < nTr; iTr++) {
		let td = itBody.rows[iTr].cells[0];
		td.innerHTML = '';
		td.title = '';
		td.style.cursor = 'default';
	}
	// ajouter une ligne
	let tr = appendTr(itBody, 'mh_tdpage');
	let td = appendTd(tr);
	if (bLast) {
		td.style.whiteSpace = 'nowrap';
		appendText(td, '(+)');
		td.style.cursor = 'pointer';
		td.title = 'Cliquer ici pour ajouter un autre système Bricol\'Troll';
		td.onclick = function (e) {
			addBricolIT(undefined, undefined, undefined, false, true);
		};
	}
	td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td, 'Nom du système : ');
	appendTextbox(td, 'text', 'urlbricol', 20, 50, sSystem, `urlbricol${nTr}`);
	td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td, 'Login du compte : ');
	appendTextbox(td, 'text', 'loginbricol', 20, 50, sLogin, `loginbricol${nTr}`);
	td = appendTd(tr);
	td.style.whiteSpace = 'nowrap';
	appendText(td, 'Mot de passe du compte : ');
	appendTextbox(td, 'password', 'passbricol', 20, 50, undefined, `passbricol${nTr}`);
	td = appendTd(tr);
	if (bFirst) {
		td.style.whiteSpace = 'nowrap';
		appendText(td, 'Affichage des Trõlls hors vue : ');
		appendCheckBox(td, 'affhvbricol', nAffhv > 0);
	}
}

function onChangeIT() {
	let IT = document.getElementById('itSelect').value;
	let itBody = document.getElementById('itBody');
	itBody.innerHTML = '';
	let tabStr = new Array();
	if (IT == 'bricol') {
		for (let iBricol = 1; ; iBricol++) {
			let str = MY_getValue(`${numTroll}.INFOSIT${iBricol == 1 ? '' : iBricol}`);
			// logMZ('onChangeIT str=' + str);
			if (!str) {
				break;
			}
			tabStr.push(str);
		}
		if (tabStr.length == 0) {
			addBricolIT('', '', 0, true, true);
		} else {
			for (let iBricol = 0; iBricol < tabStr.length; iBricol++) {
				let arr = tabStr[iBricol].split('$');
				let system = arr[1];
				let login = arr[2];
				let affhv = arr[4];
				addBricolIT(system, login, affhv, iBricol == 0, iBricol == tabStr.length - 1);
			}
		}
	}
}

function refreshLinks() {
	document.getElementById('linksBody').innerHTML = '';
	let anotherURL = MY_getValue('URL1');
	if (!anotherURL) {
		addLinkField();
	}
	let i = 1;
	while (anotherURL && i < 99) {
		addLinkField(i, anotherURL,
			MY_getValue(`URL${i}.nom`), MY_getValue(`URL${i}.ico`));
		i++;
		anotherURL = MY_getValue(`URL${i}`);
	}
}

function addLinkField(i, url, nom, ico) {
	let linksBody = document.getElementById('linksBody');
	if (!(i > 0)) {
		i = linksBody.childNodes.length + 1;
	}
	let tr = appendTr(linksBody);
	let td = appendTdCenter(tr);
	appendText(td, `Lien ${i} : `);
	appendTextbox(td, 'text', `url${i}`, 40, 150, url);
	td = appendTdCenter(tr);
	appendText(td, 'Nom : ');
	appendTextbox(td, 'text', `nom${i}`, 20, 150, nom);
	td = appendTdCenter(tr);
	appendText(td, 'Icône : ');
	appendTextbox(td, 'text', `ico${i}`, 40, 150, ico);
}

function removeLinkField() {
	let linksBody = document.getElementById('linksBody');
	let i = linksBody.childNodes.length;
	MY_removeValue(`URL${i}`);
	MY_removeValue(`URL${i}.nom`);
	MY_removeValue(`URL${i}.ico`);
	linksBody.removeChild(linksBody.lastChild);
	if (linksBody.childNodes.length == 0) {
		addLinkField();
	}
}

function resetMainIco() {
	document.getElementById('icoMenuIco').value = `${URL_MZimg}mz_logo_small.png`;
}

/** x~x Fonctions d'insertion ------------------------------------------ */

function insertTitle(next, txt) {
	let div = document.createElement('div');
	div.className = isDesktopView() ? 'titre2' : 'ui-bar-b ui-corner-top';
	appendText(div, txt);
	insertBefore(next, div);
	return div;
}

function insertMainTable(next) {
	let table = document.createElement('table');
	table.border = 0;
	table.align = 'center';
	table.cellPadding = 2;
	table.cellSpacing = 1;
	table.className = isDesktopView() ? 'mh_tdborder' : 'ui-body-d ui-corner-bottom';
	let tbody = document.createElement('tbody');
	table.appendChild(tbody);

	if (isDesktopView()) {
		table.style.maxWidth = '98%'
		insertBefore(next, table);
	} else {
		let div = document.createElement('div');
		div.style.overflowX = "scroll";
		div.appendChild(table);
		insertBefore(next, div);
	}
	return tbody;
}

function appendSubTable(node) {
	let table = document.createElement('table');
	table.width = '100%';
	let tbody = document.createElement('tbody');
	table.appendChild(tbody);
	node.appendChild(table);
	return tbody;
}

function insertOptionTable(insertPt) {
	let mainBody = insertMainTable(insertPt);

	/* Liens dans le Menu */
	let tr = appendTr(mainBody, 'mh_tdtitre');
	let td = appendTdText(tr, 'Hyperliens ajoutés dans le Menu :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendText(td, 'Icône du Menu: ');
	let url = MY_getValue(`${numTroll}.ICOMENU`);
	if (!url || url.indexOf('mountyzilla.tilk.info/scripts_0.9/images/MY_logo_small') > 0) {
		url = `${URL_MZimg}mz_logo_small.png`;
	}
	appendTextbox(td, 'text', 'icoMenuIco', 50, 200, url);
	appendButton(td, 'Réinitialiser', resetMainIco);

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	let tbody = appendSubTable(td);
	tbody.id = 'linksBody';
	refreshLinks();

	td = appendTdCenter(appendTr(mainBody, 'mh_tdpage'));
	appendButton(td, 'Ajouter', addLinkField);
	appendButton(td, 'Supprimer', removeLinkField);

	/* Options de la Vue : vue externe, nb de CdM, etc */
	tr = appendTr(mainBody, 'mh_tdtitre');
	appendTdText(tr, 'Options de la Vue :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);

	tr = appendTr(tbody);
	td = appendTdText(tr, 'Vue externe : ');
	let select = document.createElement('select');
	select.id = 'vueext';
	td.appendChild(select);
	let listeVues2D = [
		'Bricol\' Vue',
		'Vue du CCM',
		'Vue Gloumfs 2D',
		'Vue Gloumfs 3D',
		'Grouky Vue!'
	];
	for (let i = 0; i < listeVues2D.length; i++) {
		appendOption(select, listeVues2D[i], listeVues2D[i]);
	}
	if (MY_getValue('VUEEXT')) {
		select.value = MY_getValue('VUEEXT');
	}

	td = appendTd(tr);
	appendCheckBox(td, 'noInfoEM', MY_getValue('NOINFOEM') == 'true');
	appendText(td, ' Masquer les informations à propos de l\'écriture magique');

	tr = appendTr(tbody);
	td = appendTdText(tr, 'Nombre de CdM automatiquement récupérées : ');
	appendTextbox(td, 'text', 'maxcdm', 5, 10, MY_getValue(`${numTroll}.MAXCDM`));

	td = appendTd(tr);
	appendCheckBox(td, 'usecss', MY_getValue(`${numTroll}.USECSS`) == 'true');
	appendText(td, ' Utiliser la CSS pour les couleurs de la diplomatie');

	/* Interface Tactique */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Interface Tactique : ', true);
	select = document.createElement('select');
	select.id = 'itSelect';
	appendOption(select, 'none', 'Aucune');
	appendOption(select, 'bricol', 'Système Tactique des Bricol\'Trolls');
	// seule interface supportée !
	td.appendChild(select);

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	tbody.id = 'itBody';
	select.onchange = onChangeIT;
	let str = MY_getValue(`${numTroll}.INFOSIT`);
	if (str) {
		select.value = str.slice(0, str.indexOf('$'));
		onChangeIT();
	}

	/* SCIZ */
	// JWT
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'SCIZ :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	td = appendTdText(td, 'JWT : ');
	appendTextbox(td, 'text', 'sciz_jwt', 150, 500, MY_getValue(`${numTroll}.SCIZJWT`));
	// Event checkbox
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	tbody = appendSubTable(td);
	tr = appendTr(tbody);
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_events', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_EVENTS`)));
	appendText(td, ' Surcharger les événements');
	// Bestiaire checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_bestiaire', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_BESTIAIRE`)));
	appendText(td, ' Afficher les données du bestiaire');
	// Treasures checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_treasures', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TREASURES`)));
	appendText(td, ' Afficher les trésors identifiés');
	// Mushrooms checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_mushrooms', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_MUSHROOMS`)));
	appendText(td, ' Afficher les champignons identifiés');
	// Trolls data checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_trolls', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TROLLS`)));
	appendText(td, ' Afficher les données des trolls');
	// User data checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_user', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_USER`)));
	appendText(td, ' S\'afficher soi-même');
	// Traps checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_traps', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_TRAPS`)));
	appendText(td, ' Afficher les pièges');
	// Portals checkbox
	td = appendTd(tr);
	td.setAttribute('align', 'center');
	appendCheckBox(td, 'sciz_cb_view_portals', [null, '1'].includes(MY_getValue(`${numTroll}.SCIZ_CB_VIEW_PORTALS`)));
	appendText(td, ' Afficher les destinations de portails');

	/* Options diverses */
	td = appendTd(appendTr(mainBody, 'mh_tdtitre'));
	appendText(td, 'Options diverses :', true);
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBoxBlock(td, 'infocarac', 'Afficher les caractéristiques des équipements des autres Trõlls', MY_getValue('INFOCARAC') != 'false');

	/* td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'send_idt',MY_getValue(numTroll+'.SEND_IDT') != 'non')
	appendText(td,' Envoyer les objets identifiés au système de stats');*/

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBoxBlock(td, 'autoCdM', 'Envoyer automatiquement les CdM vers la base MountyZilla', MY_getValue(`${numTroll}.AUTOCDM`) == 'true');

	// td = appendTd(appendTr(mainBody,'mh_tdpage'));	// Roule 12/12/2019 ça ne fait plus rien
	// appendCheckBox(td,'vueCarac',MY_getValue('VUECARAC')=='true');
	// appendText(td,' Afficher la Vue avec les caractéristiques dans le Profil');

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBoxBlock(td, 'printstack', "Joindre les rapports d'erreurs aux avertissements", MY_getValue('PRINTSTACK') == 'true');

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBoxBlock(td, 'confirmeDecalage', "Demander confirmation lors d'un décalage de DLA", MY_getValue('CONFIRMEDECALAGE') == 'true');
	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendCheckBoxBlock(td, 'compteAreboursDLA', 'Compte à rebours de DLA', MY_getValue('COMPTEAREBOURSDLA') == 'true');
	appendCheckBoxBlock(td, 'compteAreboursTitre', 'Aussi dans le titre (pas sur smartphone)', MY_getValue('COMPTEAREBOURSTITRE') == 'true');
	//appendCheckBoxBlock(td, 'compteAreboursSuivante', 'Aussi pour la DLA suivante', MY_getValue('COMPTEAREBOURSSUIVANTE') == 'true');

	td = appendTd(appendTr(mainBody, 'mh_tdpage'));
	appendText(td, 'Page des suivants : ');
	let e = appendTextboxBlock(td, 'text', 'MZ_SuivantsOrdres', 'Ordres', 3, 3, MY_getValue('MZ_SuivantsOrdres'), undefined, true);
	e.setAttribute('Title', "Permet de voir les ordres des Gowaps dans la page des suivants\n" +
		"Vide : pas d'affichage\n" +
		"0 : tous les ordres\n" +
		"1 à 99 : limité à ce nombre\n" +
		"-1 : jusqu'à Arrêt, Ramassage, Ébrouage, Suivre");
	e = appendCheckBoxBlock(td, 'MZ_SuivantsCompress', 'Vue compressée', MY_getValue('MZ_SuivantsCompress') == 'true');
	e.setAttribute('Title', 'Permet de réduire la longueur de la page pour beaucoup de suivants\nSupprime "Aucune équipement sur ce suivant"');
	e = appendCheckBoxBlock(td, 'MZ_SuivantsTresUnique', 'Aff. trésors uniques', MY_getValue('MZ_SuivantsTresUnique') == 'true');
	e.setAttribute('Title', "Permet de rémplacer la liste par le trésor unique s'il n'y en a qu'un dans une catégorie\nTrès pratique pour les Gowaps qui ne portent qu'un trésor");

	/* Bouton SaveAll */
	td = appendTdCenter(appendTr(mainBody, 'mh_tdtitre'));
	let input = appendButton(td, 'Sauvegarder', saveAll);
	input.id = 'saveAll';
}

function insertCreditsTable(insertPt) {
	let tbody = insertMainTable(insertPt);

	let td = appendTdText(appendTr(tbody, 'mh_tdtitre'),
		'Depuis son origine, nombreux sont ceux qui ont contribué à faire ' +
		'de MountyZilla ce qu\'il est aujourd\'hui. Merci à eux !');

	let ul = document.createElement('ul');
	td.appendChild(ul);
	appendLi(ul, 'Tilk (36216), puis Dabihul (79738) pour avoir créé puis maintenu à bout de bras MZ pendant des années');
	appendLi(ul, 'Fine fille (6465) pour les popup javascript');
	appendLi(ul, 'Reivax (4234) pour les infos bulles');
	appendLi(ul, 'Noc (2770) pour les moyennes des caracs');
	appendLi(ul, 'Endymion (12820) pour les infos sur les comp/sorts');
	appendLi(ul, 'Ratibus (15916) pour l\'envoi de CdM');
	appendLi(ul, 'TetDure (41931) pour les PVs restants dans les CdM');
	appendLi(ul, 'Les Teubreux pour leur bestiaire !');
	appendLi(ul, 'Les développeurs de vue qui font des efforts pour s\'intégrer à Mountyzilla');
	appendLi(ul, 'Gros Kéké (233) qui permet de tester le script aux limites du raisonnable avec sa vue de barbare');
	appendLi(ul, 'Ashitaka (9485) pour le gros nettoyage de l\'extension, des scripts, et beaucoup de choses à venir');
	appendLi(ul, 'Tous ceux de l\'ancienne génération oubliés par Tilk');
	appendLi(ul, 'Zorya (28468), Vapulabehemot (82169), Breizhou13 (50233) et tous les participants au projet ZoryaZilla');
	appendLi(ul, 'Yoyor (87818) pour diverses améliorations de code');
	appendLi(ul, 'Rokü Menton-brûlant (108387) pour avoir incité à passer sur GitHub');
	appendLi(ul, 'Marmotte (93138) pour son support technique récurrent');
	appendLi(ul, 'Hennet (74092) pour le script du nouveau profil');
	appendLi(ul, 'Raistlin (61214, 109327) pour le script sur les caracs de l\'équipement et maintenant pour l\'hébergement');
	appendLi(ul, 'Markotroll (27637) pour les tests sous LINUX');
	appendLi(ul, 'Tous les testeurs de la nouvelle génération oubliés par Dabihul puis Rouletabille');
}


/* [functions]                     Obsolètes                                  */
function deleteEnchantement() {
	try {
		let idEquipement = this.getAttribute('name');
		MY_removeValue(`${numTroll}.enchantement.${idEquipement}.objet`);
		MY_removeValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`);
		MY_removeValue(`${numTroll}.enchantement.${idEquipement}.composant.0`);
		MY_removeValue(`${numTroll}.enchantement.${idEquipement}.composant.1`);
		MY_removeValue(`${numTroll}.enchantement.${idEquipement}.composant.2`);
		let listeEquipement = MY_getValue(`${numTroll}.enchantement.liste`).split(";");
		let string = "";
		for (let i = 0; i < listeEquipement.length; i++) {
			if (listeEquipement[i] != idEquipement) {
				if (string == "") {
					string = listeEquipement[i];
				} else {
					string = `${string};${listeEquipement[i]}`;
				}
			}
		}
		if (string == "") {
			MY_removeValue(`${numTroll}.enchantement.liste`);
			let table = this.parentNode.parentNode.parentNode.parentNode;
			let parent = table.parentNode;
			for (let i = 0; i < parent.childNodes.length; i++) {
				if (parent.childNodes[i] == table) {
					parent.removeChild(parent.childNodes[i - 1]);
					parent.removeChild(parent.childNodes[i - 1]);
					parent.removeChild(parent.childNodes[i - 1]);
					break;
				}
			}
		} else {
			MY_getValue(`${numTroll}.enchantement.liste`, string);
			this.parentNode.parentNode.parentNode
				.removeChild(this.parentNode.parentNode);
		}
	} catch (exc) {
		avertissement(`Une erreur est survenue (deleteEnchantement)`, null, null, exc);
	}
}

/* [functions]                     fin Obsolètes                                  */

/** x~x Partie principale ---------------------------------------------- */

function do_option() {
	start_script(712, 'do_option_log');
	let insertPoint = getFooter();
	insertBefore(insertPoint, document.createElement('p'));
	let ti = insertTitle(insertPoint, 'Mountyzilla : Options');	// 02/02/2017 SHIFT-Click pour copier la conf
	ti.onclick = function (e) {
		let evt = e || window.event;
		if (evt.shiftKey) {
			let tabVal = [];
			for (let i = 0, len = localStorage.length; i < len; ++i) {
				let k = localStorage.key(i);
				if (k.match(/INFOSIT/i)) {
					continue;
				}	// masquer le mdp Bricol'Troll
				if (k.match(/SCIZJWT/i)) {
					continue;
				}	// masquer le jeton SCIZ
				tabVal.unshift(`${k}\t${localStorage.getItem(k)}`);
			}
			tabVal = tabVal.sort(function (a, b) {
				let ta = a.split('.');
				let ia = parseInt(ta[0]);
				let tb = b.split('.');
				let ib = parseInt(tb[0]);
				if (isNaN(ia)) {
					if (isNaN(ib)) {
						return (a < b) ? -1 : ((a > b) ? +1 : 0);
					} else {
						return 1;
					}
				} else {
					if (isNaN(ib)) {
						return -1;
					} else if (ia == ib) {
						return (a < b) ? -1 : ((a > b) ? +1 : 0);
					} else {
						return ia - ib;
					}
				}
			})
			copyTextToClipboard(tabVal.join("\n"));
			avertissement('La configuration MZ a été copiée dans le presse-papier (sauf le mot de passe Bricol\'Trõll)');
		} else if (evt.ctrlKey) {
			let tabK = [];
			let sMatch = `${numTroll}.`;
			let lMatch = sMatch.length;
			for (let i = 0, len = localStorage.length; i < len; ++i) {
				let k = localStorage.key(i);
				if (k.substring(0, lMatch) == sMatch) {
					tabK.push(k);
				}
			}
			for (let i = 0; i < tabK.length; ++i) {
				MY_removeValue(tabK[i]);
			}
			avertissement(`${tabK.length} informations locales du Trõll ${numTroll} ont été effacées-${sMatch}-${lMatch}`);
		}
	};
	ti.title = `Version ${GM_info.script.version}`;
	insertOptionTable(insertPoint);

	/* insertion enchantements ici
	if(...)
	insertEnchantementTable();
	*/
	insertBefore(insertPoint, document.createElement('p'));
	ti = insertTitle(insertPoint, 'Mountyzilla : Crédits');	// 23/12/2016 SHIFT-Click pour passer en mode dev
	ti.onclick = function (e) {
		let evt = e || window.event;
		if (!evt.shiftKey) {
			return;
		}
		let oldDev = MY_getValue('MZ_dev');
		if (oldDev) {
			MY_removeValue('MZ_dev');
		} else {
			window.alert('passage en mode DEV, shift-click sur le mot "Crédits" pour revenir en mode normal');
			MY_setValue('MZ_dev', 1);
		}
		document.location.href = document.location.href;
	};
	insertCreditsTable(insertPoint);
	insertBefore(insertPoint, document.createElement('p'));

	/* [zone]                     Obsolète ??                                  */
	if (MY_getValue(`${numTroll}.enchantement.liste`) &&
		MY_getValue(`${numTroll}.enchantement.liste`) != "") {
		insertTitle(insertPoint, 'Les Enchantements en cours');
		let table = document.createElement('table');
		table.setAttribute('width', '98%');
		table.setAttribute('border', '0');
		table.setAttribute('align', 'center');
		table.setAttribute('cellpadding', '2');
		table.setAttribute('cellspacing', '1');
		table.setAttribute('class', 'mh_tdborder');

		let tbody = document.createElement('tbody');
		table.appendChild(tbody);

		let tr = appendTr(tbody, 'mh_tdtitre');
		appendTdText(tr, 'Equipement', 1);
		appendTdText(tr, 'Composants', 1);
		appendTdText(tr, 'Enchanteur', 1);
		appendTdText(tr, 'Action', 1);

		let listeEquipement = MY_getValue(`${numTroll}.enchantement.liste`).split(";");
		for (let i = 0; i < listeEquipement.length; i++) {
			try {
				let idEquipement = listeEquipement[i];
				let nomEquipement = MY_getValue(`${numTroll}.enchantement.${idEquipement}.objet`);
				let infoEnchanteur = MY_getValue(`${numTroll}.enchantement.${idEquipement}.enchanteur`).split(";");
				let ul = document.createElement('UL');
				for (let j = 0; j < 3; j++) {
					let k = `${numTroll}.enchantement.${idEquipement}.composant.${j}`;
					let v = MY_getValue(k);
					if (v == null) { 	// protection Roule 26/08/2017
						logMZ(`err infoComposant k=${k}, v is null`);
						continue;
					}
					let infoComposant = v.split(';');
					if (infoComposant.length < 5) {	// protection Roule 25/08/2017
						logMZ(`err infoComposant k=${k}, v=${v}`);
						continue;
					}
					let texte = infoComposant[4].replace("Ril ", "Œil ");
					for (let kk = 5; kk < infoComposant.length; kk++) {
						texte = `${texte};${infoComposant[kk].replace("Ril ", "Œil ")}`;
					}
					let li = appendLi(ul, texte);
					let string = `<form action="${URL_troc_mh}" method="post" TARGET = "_blank">`;
					string = `${string}<input type="hidden" name="monster" value="${infoComposant[2]}" />`;
					string = `${string}<input type="hidden" name="part" value="${infoComposant[0]}" />`;
					string = `${string}<input type="hidden" name="qualite" value="${getQualite(infoComposant[3]) + 1}" />`;
					string = `${string}<input type="hidden" name="q" value="min" />`;
					string = `${string}<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor='hand';" name="enter" value="Rechercher sur le Troc de l'Hydre" />`;
					string = `${string} &nbsp; <input type="button" class="mh_form_submit" onMouseOver="this.style.cursor='hand';" onClick="javascript:window.open(&quot;${URL_cyclotrolls}wakka.php?wiki=TroOGle&trooglephr=base%3Amonstres+tag%3Anom+%22${infoComposant[2]}%22&quot;)" value="Localiser le monstre grâce à Troogle" /></form>`;

					string = `${string}</form>`;
					// string += '<form action="http://www.cyclotrolls.be/wakka.php" method="get" TARGET = "_blank">';
					// string+= '<input type="hidden" name="wiki" value="TroOGle" />';
					// string+= '<input type="hidden" name="trooglephr" value="base:monstres tag:nom &quot;'+infoComposant[2]+'&quot;" />';
					// string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Localiser grâce à Troogle" /></form>';
					li.innerHTML = li.innerHTML + string;
				}
				tr = appendTr(tbody, 'mh_tdpage');

				let td = appendTdText(tr, nomEquipement);
				td.setAttribute('valign', 'center');

				td = document.createElement('td');
				td.appendChild(ul);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');

				td = appendTdText(tr, `Enchanteur n°${infoEnchanteur[0]} (${infoEnchanteur[1]}|${infoEnchanteur[2]}|${infoEnchanteur[3]})`);
				td.setAttribute('valign', 'center');

				td = document.createElement('td');
				input = appendButton(td, 'Supprimer l\'enchantement', deleteEnchantement);
				input.setAttribute('name', idEquipement);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');
			} catch (exc) {
				avertissement(`Une erreur est survenue (do_option)`, null, null, exc);
			}
		}
		insertBefore(insertPoint, table);
		insertBefore(insertPoint, document.createElement('p'));
	}

	/* [zone]                     fin Obsolète ??                                  */
	displayScriptTime(undefined, 'do_option_log');
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Equip ---------------------------------------------------------- */

/**
 * 2014-02-08 - v2.0a (from scratch)
 * 2014-02-18 - v2.0a0
 * - ajout calcul Carats / UM des minerais + totaux
 * 2014-03-06 - v2.0a1
 * - retour Infos EM des Champis
 * TODO
 * Ces fonctions sont dev ici en test, à terme elles seront à intégrer dans libs
 */

function traiteChampis() {
	let trlist;
	try {
		let tr = document.getElementById('mh_objet_hidden_Champignon');
		trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
	} catch (e) {
		return;
	}
	if (trlist.length <= 0) {
		return;
	}
	for (let i = 0; i < trlist.snapshotLength; i++) {
		let node = trlist.snapshotItem(i).childNodes[7];
		let str = node.textContent.trim();
		let type = str.slice(0, str.lastIndexOf(' '));
		let mundi = mundiChampi[type];
		if (!mundi) {
			continue;
		}
		let urlImg = `${URL_MZimg}Competences/ecritureMagique.png`;
		let img = createAltImage(urlImg, 'EM', `Mundidey ${mundi}`);
		appendText(node, ' ');
		node.appendChild(img);
	}
}

function traiteCompos() {
	let tbody;
	try {
		let tr = document.getElementById('mh_objet_hidden_Composant');
		tbody = document.evaluate("./td/table/tbody", tr, null, 9, null).singleNodeValue;
	} catch (e) {
		return;
	}
	insererInfosEM(tbody);
}

function traiteMinerai() {
	let trlist;
	try {
		let tr = document.getElementById('mh_objet_hidden_Minerai');
		trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
	} catch (e) {
		return;
	}
	if (trlist.length <= 0) {
		return;
	}
	let totaux = {};
	let str;
	for (let i = 0; i < trlist.snapshotLength; i++) {
		let node = trlist.snapshotItem(i);
		let nature = node.childNodes[7].textContent,
			caracs = node.childNodes[9].textContent;
		let taille = Number(caracs.match(/\d+/)[0]);
		let coef = 1;
		if (caracs.indexOf('Moyen') != -1) {
			coef = 2;
		} else if (caracs.indexOf('Normale') != -1) {
			coef = 3;
		} else if (caracs.indexOf('Bonne') != -1) {
			coef = 4;
		} else if (caracs.indexOf('Exceptionnelle') != -1) {
			coef = 5;
		}
		if (nature.indexOf('Mithril') != -1) {
			coef = 0.2 * coef;
			str = ' | UM: ';
		} else {
			coef = 0.75 * coef + 1.25;
			if (nature.indexOf('Taill') != -1) {
				coef = 1.15 * coef;
			}
			str = ' | Carats: ';
		}
		let carats = Math.round(taille * coef);
		appendText(node.childNodes[9], str + carats);
		if (!totaux[nature]) {
			totaux[nature] = [taille, carats];
		} else {
			totaux[nature][0] += taille;
			totaux[nature][1] += carats;
		}
	}
	str = 'Total : ';
	for (let nature in totaux) {
		if (str.length > 8) {
			str = `${str}, `;
		}
		if (nature.indexOf('Mithril') != -1) {
			str = `${str}${nature + totaux[nature][1]} UM`;
		} else {
			str = `${str}${nature + totaux[nature][0]}U/${totaux[nature][1]}c`;
		}
	}

	/* let node = document.getElementById('mh_plus_Minerai');
	let titre = document.evaluate("./td[contains(./b/text(),'Minerai')]",
		node.parentNode.parentNode.parentNode, null, 9, null).singleNodeValue;
	if(!titre) return;*/
	// Il faut préalablement injecter du CSS pour ne pas hériter de 'mh_titre3'
	let td = appendTdText(trlist.snapshotItem(0).parentNode, `(${str})`);
	td.colSpan = 7;
}

function do_equip() {
	start_script(undefined, 'do_equip_log');

	traiteChampis();
	traiteCompos();
	traiteMinerai();

	displayScriptTime(undefined, 'do_equip_log');
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Diplo ---------------------------------------------------------- */

/*
TODO:
 V Étape 1: Gestion comme actuellement, avec 2 couleurs (amis/ennemis)
 V Étape 2: Gestion couleurs par catégorie (10 couleurs)
 V Étape 3: Ajout de la diplo perso
 X Étape 4: Gestion distante (sécurisée par mdp) de cette option
 V Étape 5: Ajout des fioritures (preview de la couleur...)

 Options Globales:
 Actuelles:
	  numTroll.USECSS,
	  numTroll.NODIPLO
	  NOMYTH
 Nouvelles:
	  TODO numTroll.USECSS
	  numTroll.diplo.off (remplace NODIPLO)
	  numTroll.diplo.guilde
	  numTroll.diplo.perso

 Structure de diplo.guilde:
 isOn: 'true' ou 'false'
 isDetailOn: 'true' ou 'false'
 guilde
	  > id
	  > couleur
 AllAmis,AllEnnemis: couleur
 Amis0,...,Ennemis5
	  > Troll: idTroll1;...;
	  > Guilde: idGuilde1;...;
	  > titre
	  > couleur

 Structure de diplo.perso:
 isOn: 'true' ou 'false'
 mythiques: couleur
 Troll,Guilde,Monstre:
	  > id
	  > couleur
	  > description
*/

/** x~x Fonctions utilitaires ------------------------------------------ */

function couleurAleatoire() {
	let alph = '0123456789ABCDEF'.split('');
	let clr = '#';
	for (let i = 0; i < 6; i++) {
		clr = clr + alph[Math.floor(16 * Math.random())];
	}
	return clr;
}

function isCouleur(str) {
	return (/^#[0-9A-F]{6}$/i).test(str);
}

/** x~x Analyse de la page --------------------------------------------- */

function appendChoixCouleur(node, id) {
	let span = document.createElement('span');
	span.id = `span${id}`;
	if (isDetailOn) {
		span.style.display = 'none';
	}
	let couleur = id == 'AllAmis' ? '#AAFFAA' : '#FFAAAA';
	if (diploGuilde[id]) {
		couleur = diploGuilde[id];
	}
	appendText(span, ' - Couleur HTML: ');
	let input = appendTextbox(span, 'text', id, 7, 7, couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	node.appendChild(span);
}

function insertChoixCouleur(node, id) {
	let span = document.createElement('span');
	span.id = `span${id}`;
	// La couleur détaillée passera à une valeur aléatoire
	// si toggle vers isDetailOn
	let couleur = couleurAleatoire();
	if (!isDetailOn) {
		span.style.display = 'none';
	} else if (diploGuilde[id]) {
		couleur = diploGuilde[id].couleur;
	}
	appendText(span, ' - Couleur HTML: ');
	let input = appendTextbox(span, 'text', id, 7, 7, couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	insertBefore(node, span);
}

function setChoixCouleurs() {
	let nodesAE, nodes;
	try {
		// let form = document.getElementsByName('ActionForm')[0];
		let form = document.getElementById('mhPlay');
		nodesAE = document.evaluate(
			// "./table/tbody/tr/td[@class='mh_tdtitre']",
			"./table/tbody/tr/th[@class='mh_tdtitre']",
			// "./table/tbody/tr[@class='mh_tdtitre']/th",
			form, null, 7, null
		);
		nodes = document.evaluate(
			// "./table/tbody/tr/td[not(@class='mh_tdtitre')]",
			"./table/tbody/tr[not(@class='mh_tdtitre')]/td",
			form, null, 7, null
		);
	} catch (exc) {
		logMZ('Diplomatie Structure de la page non reconnue', exc);
		return false;
	}
	nodesAE.snapshotItem(0).parentNode.id = 'insertPt';
	appendChoixCouleur(nodesAE.snapshotItem(0), 'AllAmis');
	appendChoixCouleur(nodesAE.snapshotItem(1), 'AllEnnemis');
	for (let i = 0; i < 5; i++) {
		nodes.snapshotItem(i).id = `tdAmis${i}`;
		insertChoixCouleur(nodes.snapshotItem(i).childNodes[1], `Amis${i}`);
		nodes.snapshotItem(i + 5).id = `tdEnnemis${i}`;
		insertChoixCouleur(nodes.snapshotItem(i + 5).childNodes[1], `Ennemis${i}`);
	}
	return true;
}

function fetchDiploGuilde() {
	try {
		for (let AE in { Amis: 0, Ennemis: 0 }) {
			for (let i = 0; i < 5; i++) {
				/* Récup des A/E de rang i */
				let td = document.getElementById(`td${AE}${i}`);
				let ligne = td.getElementsByTagName('table')[0].rows;
				let titre = trim(td.firstChild.textContent);
				// On laisse la gestion des couleurs à setChoixCouleurs:
				let couleur = document.getElementById(AE + i).value;
				diploGuilde[AE + i] = {
					Troll: '',
					Guilde: '',
					titre: titre,
					couleur: couleur
				};
				for (let j = 1; j < ligne.length; j++) {
					let str = trim(ligne[j].cells[0].textContent);
					let idx = str.lastIndexOf('(');
					let num = str.slice(idx + 1, -1);
					let type = trim(ligne[j].cells[1].textContent);
					diploGuilde[AE + i][type] += `${num};`;
				}
			}
		}
	} catch (exc) {
		logMZ('Diplomatie récupération de la diplo', exc);
		return false;
	}
	return true;
}


/** x~x Handlers ------------------------------------------------------- */

function toggleDetails() {
	isDetailOn = !isDetailOn;
	for (let AE in { Amis: 0, Ennemis: 0 }) {
		document.getElementById(`spanAll${AE}`).style.display = isDetailOn ? 'none' : '';
		for (let i = 0; i < 5; i++) {
			document.getElementById(`span${AE}${i}`).style.display = isDetailOn ? '' : 'none';
		}
	}
}

function toggleMythiques() {
	isMythiquesOn = !isMythiquesOn;
	document.getElementById('spanMythiques').style.display = isMythiquesOn ? '' : 'none';
}

function previewCouleur() {
	let value = this.value;
	if (isCouleur(value)) {
		this.style.backgroundColor = value;
		this.title = '';
	} else {
		this.style.backgroundColor = '';
		this.title = 'Entrez une couleur au format #789ABC pour prévisualiser';
	}
}

function appendMenuType(node, duType) {
	let select = document.createElement('select');
	select.className = 'SelectboxV2';
	let type = ['Guilde', 'Troll', 'Monstre'];
	for (let i = 0; i < 3; i++) {
		appendOption(select, type[i], type[i]);
		if (type[i] == duType) {
			select.selectedIndex = i;
		}
	}
	node.appendChild(select);
}

function ajouteChamp(type, num, couleur, descr) {
	let champs = document.getElementById('diploPerso');
	let nb = champs.rows.length;
	let tr = champs.insertRow(-1);
	let td = appendTd(tr);
	appendMenuType(td, type);
	td = appendTd(tr);
	appendText(td, ' n°');
	appendTextbox(td, 'text', `num${nb}`, 6, 15, num);
	td = appendTd(tr);
	appendText(td, ' couleur HTML:');
	let input = appendTextbox(td, 'text', `couleur${nb}`, 7, 7, couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td = appendTd(tr);
	appendText(td, ' Description:');
	appendTextbox(td, 'text', `descr${nb}`, 30, 150, descr);
	td = appendTd(tr);
	let span = document.createElement('span');
	appendText(span, '[ok!]', true);
	span.style.visibility = 'hidden';
	td.appendChild(span);
	td = appendTd(tr);
	appendButton(td, 'Suppr.', retireCeChamp); // let bouton = appendButton(..)
}

function retireCeChamp() {
	let thisTr = this.parentNode.parentNode;
	thisTr.parentNode.removeChild(thisTr);
	let champs = document.getElementById('diploPerso');
	if (champs.rows.length == 0) {
		ajouteChamp();
	}
}

function valideChamp(champ) {
	let isValide = (/^\d+$/).test(champ.cells[1].childNodes[1].value) &&
		isCouleur(champ.cells[2].childNodes[1].value);
	if (isValide) {
		champ.cells[4].firstChild.style.visibility = 'visible';
	} else {
		champ.cells[4].firstChild.style.visibility = 'hidden';
	}
	return isValide;
}

function sauvegarderTout() {
	/* Diplo de guilde */
	diploGuilde.isOn = document.getElementById('isGuildeOn').checked ? 'true' : 'false';
	diploGuilde.isDetailOn = isDetailOn ? 'true' : 'false';
	let numGuilde = Number(document.getElementById('numGuilde').value);
	let couleur = document.getElementById('couleurGuilde').value;
	if (numGuilde) {
		diploGuilde.guilde = {
			id: numGuilde,
			couleur: couleur
		};
	} else {
		delete diploGuilde.guilde;
	}
	for (let AE in { Amis: 0, Ennemis: 0 }) {
		diploGuilde[`All${AE}`] = document.getElementById(`All${AE}`).value;
		for (let i = 0; i < 5; i++) {
			if (isDetailOn) {
				diploGuilde[AE + i].couleur = document.getElementById(AE + i).value;
			} else {
				diploGuilde[AE + i].couleur = diploGuilde[`All${AE}`];
			}
		}
	}
	MY_setValue(`${numTroll}.diplo.guilde`, JSON.stringify(diploGuilde));

	/* Diplo personnelle (ex-fonction saveChamps) */
	let champs = document.getElementById('diploPerso');
	diploPerso = {
		isOn: document.getElementById('isPersoOn').checked ? 'true' : 'false',
		Guilde: {},
		Troll: {},
		Monstre: {}
	};
	if (isMythiquesOn &&
		isCouleur(document.getElementById('couleurMythiques').value)) {
		diploPerso.mythiques = document.getElementById('couleurMythiques').value;
	}
	for (let i = 0; i < champs.rows.length; i++) {
		if (valideChamp(champs.rows[i])) {
			let type = champs.rows[i].cells[0].firstChild.value;
			let num = champs.rows[i].cells[1].childNodes[1].value;
			couleur = champs.rows[i].cells[2].childNodes[1].value;
			let descr = champs.rows[i].cells[3].childNodes[1].value;
			diploPerso[type][num] = {
				couleur: couleur
			};
			if (descr) {
				diploPerso[type][num].titre = descr;
			}
		}
	}
	MY_setValue(`${numTroll}.diplo.perso`, JSON.stringify(diploPerso));
	avertissement('Données sauvegardées');
}

/** x~x Modifications de la page --------------------------------------- */

function creeTablePrincipale() {
	let insertPt = document.getElementById('insertPt');

	/* Titre + bouton de Sauvegarde */
	let tr = insertTr(insertPt, 'mh_tdtitre');
	let td = appendTdText(tr, '[Mountyzilla] Options de Diplomatie ', true);
	appendButton(td, 'Sauvegarder', sauvegarderTout);

	/* Options fixes */
	tr = insertTr(insertPt, 'mh_tdpage');
	td = appendTdText(tr, 'Diplomatie de guilde:', true);
	appendBr(td);
	appendCheckBox(td, 'isGuildeOn', diploGuilde.isOn != 'false');
	appendText(td, 'Afficher la diplomatie de guilde dans la Vue');
	appendBr(td);
	appendCheckBox(td, 'detailOn', isDetailOn, toggleDetails);
	appendText(td, 'Utiliser des couleurs détaillées (10)');

	/* Diplo personnelle */
	tr = insertTr(insertPt, 'mh_tdpage');
	td = appendTdText(tr, 'Diplomatie personnelle:', true);
	appendBr(td);
	// Diplo Mythiques
	appendCheckBox(td, 'isMythiquesOn', isMythiquesOn, toggleMythiques);
	appendText(td, 'Ajouter les monstres Mythiques à la Diplomatie');
	let span = document.createElement('span');
	span.id = 'spanMythiques';
	if (!isMythiquesOn) {
		span.style.display = 'none';
	}
	let couleur = '#FFAAAA';
	if (diploPerso.mythiques) {
		couleur = diploPerso.mythiques;
	}
	appendText(span, ' - couleur HTML:');
	let input = appendTextbox(span, 'text', 'couleurMythiques', 7, 7, couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td.appendChild(span);
	appendBr(td);
	// Diplo éditable
	appendCheckBox(td, 'isPersoOn', diploPerso.isOn != 'false');
	appendText(td, 'Afficher la diplomatie personnelle dans la Vue:');
	appendBr(td);
	let table = document.createElement('table');
	table.id = 'diploPerso';
	td.appendChild(table);
	for (let type in { Guilde: 0, Troll: 0, Monstre: 0 }) {
		for (let num in diploPerso[type]) {
			ajouteChamp(
				type,
				num,
				diploPerso[type][num].couleur,
				diploPerso[type][num].titre
			);
		}
	}
	if (table.rows.length == 0) {
		ajouteChamp();
	}
	appendButton(td, 'Ajouter', ajouteChamp);
	// Prévisualisation couleurs (merci à Vys d'avoir implémenté ça xD)
	appendText(td, ' ');
	appendButton(td,
		'Exemples de couleur',
		() => {
			let fenetre = window.open(
				'/mountyhall/MH_Play/Options/Play_o_Color.php',
				'Divers',
				'width=500,height=550,toolbar=0,location=0,directories=0,' +
				'status=0,menubar=0,resizable=1,scrollbars=1'
			);
			fenetre.focus();
		}
	);

	/* Couleur de Guilde */
	tr = insertTr(insertPt, 'mh_tdtitre');
	td = appendTdText(tr, 'GUILDE', true);
	appendText(td, ' - n°');
	appendTextbox(td, 'text', 'numGuilde', 5, 10,
		diploGuilde.guilde && diploGuilde.guilde.id ?
			diploGuilde.guilde.id : ''
	);
	appendText(td, ' - Couleur HTML: ');
	input = appendTextbox(td, 'text', 'couleurGuilde', 7, 7,
		diploGuilde.guilde && diploGuilde.guilde.couleur ?
			diploGuilde.guilde.couleur : '#BBBBFF'
	);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
}

/** x~x Main ----------------------------------------------------------- */

function initDiplo(sType) {
	let sDiplo = MY_getValue(`${numTroll}.diplo.${sType}`);
	// logMZ('sDiplo' + sType + '=' + sDiplo);
	if (sDiplo && sDiplo != 'null') {	// le stockage JSON nous donne parfois 'null'
		return JSON.parse(sDiplo);
	}
	return {};
}

var diploGuilde = initDiplo('guilde');
var diploPerso = initDiplo('perso');
var isDetailOn = diploGuilde.isDetailOn == 'true';
var isMythiquesOn = diploPerso.mythiques != undefined;

function do_diplo() {
	if (setChoixCouleurs() && fetchDiploGuilde()) {
		creeTablePrincipale();
	}
}

/** *****************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

/** x~x CdmComp -------------------------------------------------------- */
// let cdm = '';	// Roule 11/03/2017 une variable globale de moins \o/

function getNonNegInts(str) {
	let nbrs = str.match(/\d+/g);
	for (let i = 0; i < nbrs.length; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function MZ_comp_traiteCdMcomp() {
	// envoi au serveur (PHP) d'un objet avec
	//	cmd:	un tableau de chaines (éléments HTML <p>) ou de tableaux (les <TD> des lignes des tableaux HTML)
	//	tstamp:	l'horodatage
	let oContexteCdM = MZ_analyseCdM('msgEffet', true);	// analyse de la CdM, prépare l'envoi, prépare l'ajout de PV min/max selon blessure
	oContexteCdM.nameBut = 'as_Action';	// nom du bouton avant lequel insérer le bouton ou les textes
	if (!oContexteCdM.ok) {
		if (!oContexteCdM.error) {
			oContexteCdM = MZ_analyseCdM('msgDiv', true);
		}
		if (!oContexteCdM.ok) {
			if (oContexteCdM.error) {
				logMZ(`MZ_comp_traiteCdMcomp, ${oContexteCdM.error}`);
				MZ_comp_addMessage(oContexteCdM, `Erreur MZ, ${oContexteCdM.error}`);
			}
			return;
		}
	}
	debugMZ(`oData=${JSON.stringify(oContexteCdM.oData)}`);

	MZ_comp_addPvRestant(oContexteCdM);

	let tstamp, etimestamp = document.getElementById('hserveur');
	if (etimestamp != undefined) {
		tstamp = etimestamp.innerText || etimestamp.textContent;
	}
	if (tstamp == undefined) {

		/* dans le cas de la comp, le serveur se repliera sur la date/heure courante
		logMZ('MZ_comp_traiteCdMcomp, pas de date/heure');
		MZ_comp_addMessage(oContexteCdM, 'Impossible d\'envoyer la CdM à MZ, pas de date/heure');
		return;
		*/
	} else {
		oContexteCdM.oData.tstamp = tstamp.replace(/\]/, '').trim();
	}

	// Envoi auto ou insertion bouton envoi (suivant option)
	if (MY_getValue(`${numTroll}.AUTOCDM`) == 'true') {
		oContexteCdM.sendInfoCDM();
		MZ_comp_addMessage(oContexteCdM, 'CdM envoyée vers la base MountyZilla !');
	} else {
		insertButtonCdm('as_Action', oContexteCdM.sendInfoCDM);
	}
}

function MZ_comp_addMessage(oContexteCdM, msg) {
	let eBefore = document.getElementsByName(oContexteCdM.nameBut)[0].parentNode;
	if (!eBefore) {
		logMZ(`MZ_comp_addMessage, pas de ${oContexteCdM.nameBut}`);
		return;
	}
	let p = document.createElement('p');
	p.style.color = 'green';
	appendText(p, msg);
	insertBefore(eBefore, p);
}

function MZ_analyseCdM(idHTMLCdM, bIgnoreEltAbsent) {	// rend un contexte
	let eltCdM = document.getElementById(idHTMLCdM);
	let oRet = {};
	if (!eltCdM) {
		oRet.ok = false;
		if (!bIgnoreEltAbsent) {
			oRet.error = `Pas d'elt ${idHTMLCdM}`;
		}
		return oRet;
	}

	// le contexte contiendra
	// txtHeure : le texte de l'heure de la CdM
	// trBlessure : le <tr> de la ligne "blessure"
	// txtBlessure : le texte donnant le % de blessure
	// txtPv : le texte donnant les PV
	// ok : 1 si on a bien reconnu une CdM
	// oData : les data à envoyer en JSON au serveur MZ
	oRet.oData = {};
	oRet.oData.tabCdM = new Array();
	for (let iElt = 0; iElt < eltCdM.childNodes.length; iElt++) { // eHTML of msgEffet.childNodes) { for...of pas supporté par IE et Edge
		let eHTML = eltCdM.childNodes[iElt];
		let s = undefined;
		switch (eHTML.nodeName) {
			case '#text':
				s = eHTML.nodeValue;
			// suite : même code que <B> ou <p>
			case 'P':
			case 'B':
				if (s === undefined) {
					s = eHTML.innerText || eHTML.textContent;
				}	// récupération du contenu texte d'un élément HTML
				s = s.trim();
				if (s != '') {
					if (s.match(/aux *alentours* *de/i)) {
						oRet.txtHeure = s;
					}
					if (s.match(/Connaissance *des* *Monstres/i)) {
						oRet.ok = true;
					}
					oRet.oData.tabCdM.push(s);
				}
				break;
			case 'TABLE':
				s = 'table';
				for (let iTr = 0; iTr < eHTML.rows.length; iTr++) {	// eTr of eHTML.rows) {
					let eTr = eHTML.rows[iTr];
					let tabTd = new Array();
					for (let iTd = 0; iTd < eTr.cells.length; iTd++) {	// eTd of eTr.cells) {
						let eTd = eTr.cells[iTd];
						s = eTd.innerText || eTd.textContent;	// récupération du contenu texte d'un élément HTML
						s = s.trim();
						tabTd.push(s);
					}
					if (tabTd.length >= 2) {
						if (tabTd[0].match(/Blessure/i)) {
							oRet.trBlessure = eTr;
							oRet.txtBlessure = tabTd[1];
						} else if (tabTd[0].match(/Points* *de *Vie/i)) {
							oRet.txtPv = tabTd[1];
						}
					}
					oRet.oData.tabCdM.push(tabTd);
				}
				break;
			case 'BR':
				break;	// ignore
			default:
				s = eHTML.innerText || eHTML.textContent;	// récupération du contenu texte d'un élément HTML
				if (s != '') {
					oRet.oData.tabCdM.push(s);
				}
				logMZ(`MZ_analyseCdM, type d'élément non traité : ${eHTML.nodeName} ${s}`);
				break;
		}
	}
	oRet.oData.idTroll = numTroll;

	// préparation de l'envoi d'une CdM issue de compte-rendu de compétence
	// fonction définie ici pour avoir vue sur la variable tabCdM
	oRet.sendInfoCDM = function () {
		MY_setValue('CDMID', 1 + parseInt(MY_getValue('CDMID')));
		let buttonCDM = this;
		let texte = '';
		FF_XMLHttpRequest({
			method: 'POST',
			url: URL_pageDispatcherV2,
			data: `cdm_json=${encodeURIComponent(JSON.stringify(oRet.oData))}`,
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
			},
			trace: 'envoi CdM',
			onload: function (responseDetails) {
				texte = responseDetails.responseText;
				buttonCDM.value = texte;
				// logMZ('buttonCDM.parentNode.firstChild.nodeName=' + buttonCDM.parentNode.firstChild.nodeName);
				if (buttonCDM.parentNode && buttonCDM.parentNode.firstChild && buttonCDM.parentNode.firstChild.nodeName == 'SPAN') {	// smartphone
					buttonCDM.parentNode.firstChild.innerHTML = texte;
				}
				if (!isDEV) {
					buttonCDM.disabled = true;
				}
			},
			onerror: function (responseDetails) {
				let msgError = 'inconnue';
				if (responseDetails.status == 0) {
					msgError = ' HTTPS ou CORS';
				}
				if (responseDetails.error) {
					msgError = responseDetails.error;
				}
				msgError = `Erreur MZ ${msgError}`;
				buttonCDM.value = msgError;
				if (buttonCDM.parentNode.firstChild.nodeName == 'SPAN') {	// smartphone
					buttonCDM.parentNode.firstChild.innerHTML = msgError;
				}
			},
		});
	};
	return oRet;
}

function MZ_comp_addPvRestant(oContexteCdM) {
	// Insertion de l'estimation des PV restants
	debugMZ(`txtBlessure=${oContexteCdM.txtBlessure}, txtPv=${oContexteCdM.txtPv}`);
	if (oContexteCdM.txtBlessure === undefined || oContexteCdM.txtPv === undefined) {
		return;
	}
	let pv = getPVsRestants(oContexteCdM.txtPv, oContexteCdM.txtBlessure);
	debugMZ(`pv=${pv}`);
	if (!pv) {
		return;
	}	// pv null si le monstre n'est pas blessé
	let tr = document.createElement('tr');
	oContexteCdM.trBlessure.parentNode.insertBefore(tr, oContexteCdM.trBlessure.nextSibling);
	let th = appendThText(tr, pv[0], false);
	th.className = oContexteCdM.trBlessure.cells[0].className;
	let td = appendTdText(tr, pv[1], false);
	let eSpan = document.createElement('span');
	appendText(eSpan, ' (Calculé par Mountyzilla)');
	eSpan.style.fontSize = "small";
	eSpan.style.fontStyle = "italic";
	td.appendChild(eSpan);
}

function do_cdmcomp() {
	start_script(31, 'do_cdmcomp_log');
	MZ_comp_traiteCdMcomp();
	displayScriptTime(undefined, 'do_cdmcomp_log');
}

/** *******************************************************************************
*    This file is part of Mountyzilla.                                           *
*                                                                                *
*    Mountyzilla is free software; you can redistribute it and/or modify         *
*    it under the terms of the GNU General Public License as published by        *
*    the Free Software Foundation; either version 2 of the License, or           *
*    (at your option) any later version.                                         *
*                                                                                *
*    Mountyzilla is distributed in the hope that it will be useful,              *
*    but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*    GNU General Public License for more details.                                *
*                                                                                *
*    You should have received a copy of the GNU General Public License           *
*    along with Mountyzilla; if not, write to the Free Software                  *
*    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*********************************************************************************/

/** x~x CdmBot --------------------------------------------------------- */

/* v0.2 by Dab - 2013-08-20
 * - patch dégueu pour gérer la décomposition P/M de l'armure
 */

var buttonCDM;

/** *****************************************************************************************
CDM :
Vous avez RÉUSSI à utiliser cette compétence au niveau 5 : jet de 34 sur 95 %.

Il ne vous est pas possible d'améliorer cette compétence.

Le Monstre Ciblé fait partie des : Mort-Vivant (Archi-Nécromant [Antique] - N°4571589)
Niveau :	Inimaginable (entre 49 et 51)
Points de Vie :	Surtrollesque (entre 450 et 470)
Blessure (Approximatif) :	0 %
Dés d'Attaque :	Impressionnant (entre 30 et 32)
Dés d'Esquive :	Impressionnant (entre 28 et 30)
Dés de Dégat :	Très Fort (entre 18 et 20)
Dés de Régénération :	Excellent (égal à 13)
Armure Physique :	Moyen (entre 10 et 12)
Armure Magique :	Faible (inférieur à 6)
Vue :	Moyen (entre 9 et 11)
Maitrise Magique :	Inimaginable (supérieur à 6000)
Résistance Magique :	Inimaginable (supérieur à 6000)
Nombre d'attaques :	1
Vitesse de Déplacement :	Normale
Voir le Caché :	Oui
Attaque à distance :	Non
Attaque magique :	Oui
Vole :	Non
Sang froid :	Inexistant
DLA :	Milieu
Durée Tour :	Remarquable (entre 9 et 11)
Chargement :	Vide
Bonus Malus :	Aucun

Vous avez également gagné 1 PX pour la réussite.
*******************************************************************************************
BOT :
Vous avez utilisé CONNAISSANCE DES MONSTRES sur un Capitan Ronfleur [Naissant] (4768960)

Le Monstre ciblé fait partie des : Mort-Vivant

Niveau : Incroyable (entre 36 et 38)
*******************************************************************************************/

function getNNInt(str) {
	let nbrs = str.match(/\d+/g);
	for (let i = 0; i < nbrs.length; i++) {
		nbrs[i] = parseInt(nbrs[i]);
	}
	return nbrs;
}

// envoi d'une CdM issue d'un message du BOT
function sendCDM() {
	let td = document.evaluate(
		"//td/text()[contains(.,'CONNAISSANCE DES MONSTRES')]/..", document, null, 9, null
	).singleNodeValue;

	let tdTxt = td.innerText || td.textContent;	// récupération du contenu texte d'un élément HTML
	let oData = {};
	oData.tabCdM = tdTxt.split(/\n/);
	// nettoyage entête : enlève le premier élément tant que
	//	- suite de *
	//	- "MOUNTYHALL - La Terre des Trõlls"
	//	- ligne vide (la première expression régulière matche les lignes vides)
	while (oData.tabCdM[0].match(/^=*$/) || oData.tabCdM[0].match(/^MOUNTYHALL/i)) {
		oData.tabCdM.shift();
	}
	// nettoyage entête : enlève tout ce qui suit une ligne composée uniquement d'étoiles suivie de '^Vous avez configuré' + les lignes vides au dessus
	let iLigneNonVide;
	for (let i = 0; i < oData.tabCdM.length; i++) {
		if (oData.tabCdM[i].match(/^\*+$/) && oData.tabCdM[i + 1].match(/^Vous avez configuré/i)) {
			if (iLigneNonVide === undefined) {
				oData.tabCdM.splice(i);
			} else {
				oData.tabCdM.splice(iLigneNonVide + 1);
			}
			break;
		}
		if (!oData.tabCdM[i].match(/^$/)) {
			iLigneNonVide = i;
		}
	}

	FF_XMLHttpRequest({
		method: 'POST',
		url: URL_pageDispatcherV2,
		data: `cdm_json=${encodeURIComponent(JSON.stringify(oData))}`,
		headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		trace: 'envoi CdM msg du bot',
		onload: function (responseDetails) {
			buttonCDM.value = responseDetails.responseText;
			buttonCDM.disabled = true;
		}
	});
}

function MZ_traiteCdMmsg() {
	let oContexteCdM = MZ_analyseCdM('messageContent');	// analyse de la CdM, prépare l'envoi, prépare l'ajout de PV min/max selon blessure
	oContexteCdM.nameBut = 'bForward';	// nom du bouton avant lequel insérer le bouton ou les textes
	if (!oContexteCdM.ok) {
		if (oContexteCdM.error) {
			logMZ(`MZ_traiteCdMmsg, ${oContexteCdM.error}`);
			MZ_comp_addMessage(oContexteCdM, `Erreur MZ, ${oContexteCdM.error}`);
		}
		return;
	}
	debugMZ(`oContexteCdM=${JSON.stringify(oContexteCdM)}`);

	MZ_comp_addPvRestant(oContexteCdM);

	let txtHeure, tstamp;
	if (oContexteCdM.txtHeure) {
		txtHeure = oContexteCdM.txtHeure;
	} else {
		let etimestamp = document.getElementById('messageDateHeure');
		if (etimestamp) {
			txtHeure = etimestamp.innerText || etimestamp.textContent;
		}
	}
	if (txtHeure) {
		let m = txtHeure.match(/\d+\/\d+\/\d+ +\d+:\d+:\d+/);
		if (m) {
			tstamp = m[0];
		}
	}
	if (tstamp == undefined) {
		logMZ('MZ_traiteCdMmsg, pas de date/heure');
		MZ_comp_addMessage(oContexteCdM, 'Impossible d\'envoyer la CdM à MZ, pas de date/heure');
		return;
	}


	oContexteCdM.oData.tstamp = tstamp.trim();
	oContexteCdM.oData.bMsgBot = 1;

	// Insertion bouton envoi
	insertButtonCdm(oContexteCdM.nameBut, oContexteCdM.sendInfoCDM);
}

function do_cdmbot() {	// Roule 17/10/2016, restreint à la page des message du bot
	MZ_traiteCdMmsg();
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Menu ----------------------------------------------------------- */
// n'est lancé que sur refresh du volet de menu (activation ou [Refresh])

let menuRac, mainIco;

function updateNumTroll() {
	let eltId = document.getElementById('id');
	if (!eltId) {
		warnMZ(`updateNumTroll_log: numéro Troll introuvable (desktop)`);
		return null;
	}
	let l_numTroll = parseInt(eltId.getAttribute('data-id'));
	if (isNaN(l_numTroll)) {
		warnMZ(`updateNumTroll_log: numéro Troll introuvable: eltId=${eltId}`);
		return null;
	}
	MY_setValue('NUM_TROLL', l_numTroll);
	debugMZ(`updateNumTroll_log: numTroll=${l_numTroll}`);
	return l_numTroll;
}

function updateNomTroll() {
	let eltId = document.getElementById('id');
	let eltSpan = eltId.getElementsByTagName('span');
	if (!eltSpan[0]) {
		warnMZ(`updateNomTroll_log: nom Troll introuvable`);
		return null;
	}
	let l_nomTroll = eltSpan[0].innerText;
	if (l_nomTroll === 'Troll') {
		warnMZ(`updateNomTroll_log: nom Troll générique: Troll`);
		return null;
	}
	MY_setValue('NOM_TROLL', l_nomTroll);
	debugMZ(`updateNomTroll_log: nomTroll=${l_nomTroll}`);
	return l_nomTroll;
}

// met à jour les carac sauvegardées (position, DLA, etc.)
function updateData() {
	let l_numTroll = updateNumTroll()
	if (l_numTroll === null) {
		return;
	}
	updateNomTroll()

	let eltDLA_xyn = document.getElementById('DLA_xyn');
	if (!eltDLA_xyn) {
		logMZ('erreur updateData_log: position et DLA inconnus, pas de DLA_xyn');
		return;
	}
	let txt_dla_xyn = eltDLA_xyn.innerText;
	let m = txt_dla_xyn.match(/DLA:* *(.*)[ \n\r]*X *= *(-*\d+)[ \|]*Y *= *(-*\d+)[ \|]*N *= *(-*\d+)/);
	if (!m) {
		logMZ(`erreur updateData_log: position et DLA inconnus, échec de l'analyse de ${txt_dla_xyn}`);
		return;
	}
	let DLA = new Date(StringToDate(m[1]));
	if (MY_getValue(`${l_numTroll}.DLA.encours`)) {
		let DLAstockee = new Date(
			StringToDate(MY_getValue(`${l_numTroll}.DLA.encours`))
		);
		if (DLA > DLAstockee) {
			MY_setValue(`${l_numTroll}.DLA.ancienne`, MZ_formatDateMS(DLAstockee, false));
			debugMZ(`updateData_log: DLA précédente=${MZ_formatDateMS(DLAstockee, false)}`);
			// Pose un pb en cas de décalage de DLA
		}
	}
	MY_setValue(`${l_numTroll}.DLA.encours`, MZ_formatDateMS(DLA, false));
	debugMZ(`updateData_log: DLA =${MZ_formatDateMS(DLA, false)}`);

	let x = parseInt(m[2]);
	let y = parseInt(m[3]);
	let n = parseInt(m[4]);
	if (isNaN(x) || isNaN(y) || isNaN(n)) {
		logMZ(`erreur updateData_log, à la récupération de la position, analyse=${JSON.stringify(m)}`);
	} else {
		MY_setValue(`${l_numTroll}.position.X`, x);
		MY_setValue(`${l_numTroll}.position.Y`, y);
		MY_setValue(`${l_numTroll}.position.N`, n);
	}
}

// ajoute les raccourcis (paramétrables dans Options/Pack Graphique)
function initRaccourcis() {
	let anotherURL = MY_getValue('URL1');
	if (!anotherURL) {
		return;
	}

	/* Création de l'icône faisant apparaître le menu */
	mainIco = document.createElement('img');
	let urlIco = MY_getValue(`${numTroll}.ICOMENU`);
	if (!urlIco) {
		urlIco = `${URL_MZimg}mz_logo_small.png`;
	}
	mainIco.src = urlIco;
	mainIco.alt = 'MZ';
	mainIco.style = 'position:fixed; top:0px; left:0px';
	mainIco.onmouseover = afficheMenu;
	document.body.appendChild(mainIco);

	/* Création du menu des Raccourcis */
	menuRac = document.createElement('div');
	menuRac.className = 'mh_textbox';
	menuRac.style =
		'position:fixed; top:10px; left:10px;' +
		'max-width:190px;' +
		'border-radius: 4px; padding: 4px;' +
		'z-index: 500;' +
		'visibility: hidden;';
	document.body.appendChild(menuRac);
	document.addEventListener('mousemove', cacheMenu, false);
	let i = 1;
	while (anotherURL) {
		let a = document.createElement('a');
		let url = MY_getValue(`URL${i}`);
		let nom = MY_getValue(`URL${i}.nom`);
		let ico = MY_getValue(`URL${i}.ico`);
		a.href = url;
		a.target = '_blank';
		if (ico) {
			let txt = nom ? nom : '';
			let img = createImage(ico, txt);
			a.appendChild(img);
		} else {
			appendText(a, `[${nom}]`);
		}
		menuRac.appendChild(a);
		appendBr(menuRac);
		i++;
		anotherURL = MY_getValue(`URL${i}`);
	}
}

function afficheMenu() {
	menuRac.style.visibility = 'visible';
}

function cacheMenu(e) {
	if (menuRac.style.visibility == 'hidden') {
		return;
	}
	// Position souris
	let ptX = e.clientX;
	let ptY = e.clientY;
	// On recalcule en live les BoundingBox pour mainIco et menuRac
	// Moins optimal, mais évite des erreurs (d'originie inconnue)
	let menuRect = menuRac.getBoundingClientRect();
	let icoRect = mainIco.getBoundingClientRect();
	if ((ptX > icoRect.width || ptY > icoRect.height) &&
		(ptX < 10 || ptX > 10 + menuRect.width || ptY < 10 || ptY > 10 + menuRect.height)) {
		menuRac.style.visibility = 'hidden';
	}
}

// ajout de l'icône, branchée sur un refresh
function initUpdateCoordGauche() {
	let div = document.evaluate("//div[@class='infoMenu']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	// logMZ('initUpdateCoordGauche ' + div.innerHTML);
	if (!div) {
		return;
	}
	let img = document.createElement('img');
	img.src = `${URL_MZimg}recycl.png`;
	img.onclick = function (evt) {
		document.location.href = document.location.href;
	};
	img.title = 'Mise à jour de la localisation';
	img.style.cursor = 'pointer';
	img.style.position = 'absolute';
	img.style.bottom = 0;
	img.style.left = 0;
	div.appendChild(img);
}

// ajout sur les raccoucis des mêmes popup que dans le profil
function MZ_initPopupFrameGauche() {
	let eListeFavoris = document.getElementById('listeFavori');
	if (!eListeFavoris) {
		logMZ('**erreur** pas de listeFavori dans la frame de gauche');
		return;
	}
	let tabA = eListeFavoris.getElementsByTagName('A');
	for (let i = 0; i < tabA.length; i++) {
		let a = tabA[i];
		setInfos(a, epure(trim(a.textContent)), '*', 1);
	}
}

function do_menu() {
	// met à jour les carac sauvegardées (position, DLA, etc.)
	updateData();
	// ajoute les raccourcis (paramétrables dans Options/Pack Graphique)
	initRaccourcis();
	// Ajout du compte à rebours de DLA
	initCompteAreboursDLA();
	// Ajout bouton de mise à jour coordonnées
	initUpdateCoordGauche();
	// Ajout popup sur les raccourcis des actions
	// MZ_initPopupFrameGauche();
}

/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x Vue ------------------------------------------------------------ */

/* TODO
 * /!\ bug latent sur diminution bonusPV (perte Telaite / template Ours),
 * prévoir fix ("delete infos")
 */

/** x~x Variables Globales --------------------------------------------- */

// Position actuelle
var currentPosition = [0, 0, 0];

// Portées de la vue : [vueHpure, vueVpure, vueHlimitée, vueVlimitée]
var porteeVue = [0, 0, 0, 0];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;

// Diplomatie
var Diplo = {
	Guilde: {},
	Troll: {},
	Monstre: {}
	// .mythiques: uniquement si option activée
};
var isDiploRaw = true; // = si la Diplo n'a pas encore été analysée

// Infos tactiques
// => MZ_Tactique.popup

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = {};
var isEngagesComputed = false;
var cursorOnLink = false; // DEBUG: wtf ?

var needComputeEnchantement = MY_getValue(`${numTroll}.enchantement.liste`) &&
	MY_getValue(`${numTroll}.enchantement.liste`) != '';

// Checkboxes de filtrage
var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles,
	checkBoxDiplo, checkBoxTrou, checkBoxMythiques, checkBoxEM, checkBoxTresorsNonLibres,
	checkBoxTactique, checkBoxLevels, checkBoxGowapsS, checkBoxGowapsA, checkBoxEngages,
	comboBoxNiveauMin, comboBoxNiveauMax, comboBoxFamille;

/* Acquisition & Stockage des données de DB */
var typesAFetcher = {
	monstres: 1,
	trolls: 1,
	tresors: 1,
	champignons: 1,
	lieux: 1
};

var MZ_EtatCdMs = {	// zone où sont stockées les variables "globales" pour la gestion des cdM et infos tactiques
	nbMonstres: 0,
	tr_monstres: [],
	lastIndexDone: 0,
	isCDMsRetrieved: false, // = si les CdM ont déjà été DL
	listeCDM: [],
	indexCellDist: -1,
	indexCellActions: -1,
	indexCellID: -1,
	indexCellNivMZ: -1,
	indexCellX: -1,
	indexCellY: -1,
	indexCellN: -1,
	// Gère l'affichage en cascade des popups de CdM
	yIndexCDM: 0,
	tdWitdh: 110,
};

var VueContext = {};
var tr_trolls = {}, tr_tresors = {}, tr_champignons = {}, tr_lieux = {};
var nbTrolls = 0, nbTresors = 0, nbChampignons = 0, nbLieux = 0;

function fetchData(type) {
	try {
		let node = document.getElementById(`mh_vue_hidden_${type}`);
		VueContext[`tr_${type}`] = node.getElementsByTagName('tr');
		VueContext[`nb${type[0].toUpperCase()}${type.slice(1)}`] = VueContext[`tr_${type}`].length - 1;
	} catch (exc) {
		warnMZ(`Erreur acquisition type ${type}`, exc);
	}
}

/** x~x Fonctions utilitaires ------------------------------------------ */

function positionToString(arr) {
	return arr.join(';');
}

function MZ_deltaH(pos1, pos2) {	// pos1 et pos2 doivent être des tableaux [x, y, n]
	return Math.max(Math.abs(pos1[0] - pos2[0]), Math.abs(pos1[1] - pos2[1]));
}

function MZ_deltaV(pos1, pos2) {
	return Math.abs(pos1[2] - pos2[2]);
}

function savePosition() {
	// Stocke la position (à jour) de la vue pour les autres scripts
	// DEBUG: Lesquels et pourquoi?
	let pos = getPosition();
	let x = pos[0], y = pos[1], n = pos[2];
	if (isNaN(x) || isNaN(y) || isNaN(n)) {
		logMZ(`erreur savePosition_log, pos=${JSON.stringfy(pos)}`);
	} else {
		MY_setValue(`${numTroll}.position.X`, x);
		MY_setValue(`${numTroll}.position.Y`, y);
		MY_setValue(`${numTroll}.position.N`, n);
	}
}


/** x~x Fonctions de récupération de données (DOM) --------------------- */
/* INFOS :
 * les champs-titres (table>tbody>tr>td>table>tbody>tr>td>a)
 * sont identifiables via leur Name
 * les tables-listings sont identifiables via l'ID du tr conteneur
 * (mh_vue_hidden_XXX, XXX=trolls, champignons, etc)
 */

/* [functions] Récup données Utilisateur */
function getPosition() {
	// Pour rétrocompatibilité
	return currentPosition;
}

function getPorteVue() {
	// Pour rétrocompatibilité
	return porteeVue;
}

function getVue() {
	// Retourne [vueHpure, vueVpure]
	let vues = getPorteVue();
	return [vues[0], vues[1]];
}

// Roule 11/03/2016
/* [functions] Récup données monstres, trolls, etc. */
function getXxxDistance(xxx, i) {
	return MZ_getDistanceAvecSplit(VueContext[`tr_${xxx.toLowerCase()}`][i].cells[0].textContent);
}
function getXxxPosition(xxx, i) {
	let tds = VueContext[`tr_${xxx.toLowerCase()}`][i].childNodes;
	let l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}


/* [functions] Récup données monstres */
function getMonstreDistance(i) {
	// debugMZ('getMonstreDistance, i=' + i + ', tr=' + MZ_EtatCdMs.tr_monstres[i].innerHTML);
	let s = MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellDist].textContent;
	if (s.indexOf('|') < 0) {
		return parseInt(s);
	}
	let m = s.match(/(\d+)[^\d]+(\d+)/);
	if (!(m && m.length >= 3)) {
		return 0;
	}
	return Math.max(m[1], m[2]);
}

function getMonstreID(i) {
	return Number(MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellID].firstChild.nodeValue);
}

function getMonstreIDByTR(tr) {
	return tr.cells[MZ_EtatCdMs.indexCellID].firstChild.nodeValue;
}

function getMonstreLevelNode(i) {
	return MZ_EtatCdMs.tr_monstres[i].cells[MZ_EtatCdMs.indexCellNivMZ];
}

function isMonstreLevelOutLimit(i, limitMin, limitMax) {
	if (!MZ_EtatCdMs.isCDMsRetrieved) {
		return false;
	}
	let donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
	if (!donneesMonstre) {
		return false;
	}
	let niv = donneesMonstre.niv;
	if (niv == undefined) {
		return false;
	}
	if (limitMin > 0 && niv.max && niv.max < limitMin) {
		return true;
	}
	if (limitMax > 0 && niv.min && niv.min > limitMax) {
		return true;
	}
	return false;
}

function getMonstreNomNode(i) {
	try {
		let td = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/..",
			MZ_EtatCdMs.tr_monstres[i], null, 9, null
		).singleNodeValue;
		return td;
	} catch (exc) {
		avertissement(`[getMonstreNomNode] Impossible de trouver le monstre ${i}`, null, null, exc);
	}
}

function getMonstreNom(i) {
	return getMonstreNomByTR(MZ_EtatCdMs.tr_monstres[i], i);
}

function getMonstreNomByTR(tr, i = 'undef') {
	try {
		let nom = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/text()", tr, null, 2, null
		).stringValue;
		return nom;
	} catch (exc) {
		avertissement(`[getMonstreNom] Impossible de trouver le monstre ${i}`, null, null, exc);
	}
}

function getMonstrePosition(i) {
	let tds = MZ_EtatCdMs.tr_monstres[i].childNodes;
	return [
		parseInt(tds[MZ_EtatCdMs.indexCellX].textContent),
		parseInt(tds[MZ_EtatCdMs.indexCellY].textContent),
		parseInt(tds[MZ_EtatCdMs.indexCellN].textContent)
	];
}

function isMonstreVisible(i) {
	let tr = MZ_EtatCdMs.tr_monstres[i];
	// logMZ('isMonstreVisible(' + i + '), display=' + tr.style.display);
	return tr.style.display !== 'none';
}

function appendMonstres(txt) {
	for (let i = 1; i <= MZ_EtatCdMs.nbMonstres; i++) {
		txt = `${txt}${getMonstreID(i)};${getMonstreNom(i)};${positionToString(getMonstrePosition(i))}\n`;
	}
	return txt;
}

function getMonstres() {
	let vue = getVue();
	return appendMonstres(`${positionToString(getPosition())};${vue[0]};${vue[1]}\n`);
}

function bddMonstres(start, stop, limitH, limitV) {
	start = start || 1;
	stop = stop || MZ_EtatCdMs.nbMonstres;
	stop = Math.min(MZ_EtatCdMs.nbMonstres, stop);
	let txt = '';
	let myPosition = getPosition();
	for (let i = start; i <= stop; i++) {
		let monstrePosition = getMonstrePosition(i);
		if (MZ_deltaH(myPosition, monstrePosition) > limitH) {
			continue;
		}
		if (MZ_deltaV(myPosition, monstrePosition) > limitV) {
			continue;
		}
		if (!isMonstreVisible(i)) {
			continue;
		}
		txt = `${txt}${getMonstreID(i)};${getMonstreNom(i).replace(';', ',').replace(/[\u2000-\uFFFF]/ug, '?')};${positionToString(monstrePosition)}\n`;
	}
	return txt ? `#DEBUT MONSTRES\n${txt}#FIN MONSTRES\n` : '';
}

/** x~x Récup données Trolls ------------------------------------------- */

// Roule 12/07/2017 détecte les colonnes à partir des titres. Mamoune vient de les faire bouger :(
var COL_TROLL_DIST = 0;	// celui-là, on le garde en dur

function getTrollDistance(i) {
	return parseInt(tr_trolls[i].cells[COL_TROLL_DIST].textContent);
}

var MZ_cache_col_TrollID;
var MZ_cache_col_TrollNOM;
var MZ_cache_col_TrollGUILDE;
var MZ_cache_col_TrollNIV;

function MZ_find_col_titre(trs, titre) {
	let l = titre.length;
	for (let i = 0; i < trs[0].cells.length; i++) {
		if (trs[0].cells[i].textContent.toLowerCase().substr(0, l) == titre) {
			return i;
		}
	}
	logMZ(`impossible de trouver la colonne de titre ${titre} dans ${trs[0].textContent}`);
	return 0;
}

function getTrollID(i) {
	if (MZ_cache_col_TrollID === undefined) {
		MZ_cache_col_TrollID = MZ_find_col_titre(tr_trolls, 'réf');
	}
	// Roule 08/03/2017 protection
	let iTroll = parseInt(tr_trolls[i].cells[MZ_cache_col_TrollID].textContent);
	if (isNaN(iTroll)) {
		return;
	}
	if (iTroll == 0) {
		return;
	}
	return iTroll;
}

function getTrollNomNode(i) {
	if (MZ_cache_col_TrollNOM === undefined) {
		MZ_cache_col_TrollNOM = MZ_find_col_titre(tr_trolls, 'nom');
	}
	return tr_trolls[i].cells[MZ_cache_col_TrollNOM];
}

function getTrollNivNode(i) {
	if (MZ_cache_col_TrollNIV === undefined) {
		MZ_cache_col_TrollNIV = MZ_find_col_titre(tr_trolls, 'niv');
	}
	return tr_trolls[i].cells[MZ_cache_col_TrollNIV];
}

function getTrollGuilde(i) {
	if (MZ_cache_col_TrollGUILDE === undefined) {
		MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	}
	return trim(tr_trolls[i].cells[MZ_cache_col_TrollGUILDE].textContent);
}

function getTrollGuildeID(i) {
	if (MZ_cache_col_TrollGUILDE === undefined) {
		MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	}
	if (tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].childNodes.length > 0) {
		let href;
		try {
			if (!tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild || !tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild.getAttribute) {
				return -1;
			}	// Roule 21/12/2016 protection contre le "bug Marsak"
			href = tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].firstChild.getAttribute('href');
		} catch (exc) {	// debug pb remonté par Marsak
			logMZ(`getTrollGuildeID: nb child=${tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE].childNodes.length}` + tr_trolls[i].innerHTML.replace(/</g, '‹'), exc);
			return -1;
		}
		return href.substring(href.indexOf('(') + 1, href.indexOf(','));
	}
	return -1;
}

function getTrollPosition(i) {
	let tds = tr_trolls[i].childNodes;
	let l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function bddTrolls(limitH, limitV) {
	let myPosition = getPosition();
	let txt = `#DEBUT TROLLS\n${numTroll};${positionToString(myPosition)}\n`;
	let tabDedoubTroll = {};
	tabDedoubTroll[numTroll] = true;
	for (let i in tr_trolls) {
		if (!tr_trolls[i].childNodes) {
			continue;
		}
		let troll_id = getTrollID(i);
		if (!troll_id) {
			continue;
		}
		if (tabDedoubTroll[troll_id]) {
			continue;
		}
		tabDedoubTroll[troll_id] = true;
		let trollPosition = getTrollPosition(i);
		if (MZ_deltaH(myPosition, trollPosition) > limitH) {
			continue;
		}
		if (MZ_deltaV(myPosition, trollPosition) > limitV) {
			continue;
		}
		txt = `${txt}${troll_id};${positionToString(trollPosition)}\n`;
	}
	return `${txt}#FIN TROLLS\n`;
}

/* [functions] Récup données Trésors */
function getTresorDistance(i) {
	return MZ_getDistanceAvecSplit(tr_tresors[i].cells[0].innerText);
}

function MZ_getDistanceAvecSplit(cellTxt) {
	cellTxt = cellTxt.replace('\u2007', ' ').replace('\u2212', '-');
	let txtSplitted = cellTxt.split('|');
	if (txtSplitted.length == 1) {
		txtSplitted = cellTxt.split('/');
	}
	if (txtSplitted.length == 1) {
		return parseInt(txtSplitted[0], 10);
	}
	let dH = Math.abs(txtSplitted[0]);
	let dV = Math.abs(txtSplitted[1]);
	return Math.max(dH, dV);
}

function getTresorID(i) {
	let tds = tr_tresors[i].childNodes;
	let l = tds.length;
	return trim(tr_tresors[i].cells[l - 5].textContent);
}

function getTresorNom(i) {
	let tds = tr_tresors[i].childNodes;
	let l = tds.length;
	// Utilisation de textContent pour régler le "bug de Pollux"
	return trim(tr_tresors[i].cells[l - 4].textContent);
}

function getTresorPosition(i) {
	let tds = tr_tresors[i].childNodes;
	let l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent),
	];
}

function bddTresors(dmin, start, stop, limitH, limitV) {
	// On retire les trésors proches (dmin) pour Troogle à cause de leur description
	dmin = dmin || 0;
	start = start || 1;
	stop = stop || nbTresors;
	stop = Math.min(nbTresors, stop);
	let myPosition = getPosition();
	let txt = '';
	for (let i = start; i <= stop; i++) {
		let tresorPosition = getTresorPosition(i);
		// debugMZ('bddTresors, i=' + i + ', ' + getTresorID(i)+';'+ getTresorNom(i)+';'+ positionToString(tresorPosition) + ', dmin=' + dmin + ', start=' + start + ', stop=' + stop + ', limitH=' + limitH + ', limitV=' + limitV + ', MZ_deltaH=' + MZ_deltaH(myPosition, tresorPosition) + ', MZ_deltaV=' + MZ_deltaV(myPosition, tresorPosition) + ', distance=' + getTresorDistance(i));
		if (MZ_deltaH(myPosition, tresorPosition) > limitH) {
			continue;
		}
		if (MZ_deltaV(myPosition, tresorPosition) > limitV) {
			continue;
		}
		if (getTresorDistance(i) >= dmin) {
			txt = `${txt}${getTresorID(i)};${getTresorNom(i)};${positionToString(tresorPosition)}\n`;
		}
	}
	return txt ? `#DEBUT TRESORS\n${txt}#FIN TRESORS\n` : '';
}

/** x~x Récup données Champignons -------------------------------------- */
// DEBUG: Pas de colonne "Référence" sur serveur de test
function getChampignonNom(i) {
	return trim(tr_champignons[i].cells[2].textContent);
}

function getChampignonPosition(i) {
	let tds = tr_champignons[i].childNodes;
	let l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

function bddChampignons(limitH, limitV) {
	let myPosition = getPosition();
	let txt = '';
	for (let i = 1; i <= nbChampignons; i++) {
		let champignonPosition = getChampignonPosition(i);
		if (MZ_deltaH(myPosition, champignonPosition) > limitH) {
			continue;
		}
		if (MZ_deltaV(myPosition, champignonPosition) > limitV) {
			continue;
		}
		txt = `${txt};${ // Les champis n'ont pas de Référence
			getChampignonNom(i)};${positionToString(champignonPosition)}\n`;
	}
	return txt ? `#DEBUT CHAMPIGNONS\n${txt}#FIN CHAMPIGNONS\n` : '';
}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return MZ_getDistanceAvecSplit(tr_tresors[i].cells[0].firstChild.nodeValue);
}

function getLieuID(i) {
	return parseInt(tr_lieux[i].cells[2].textContent);
}

function getLieuNom(i) {
	// Conversion ASCII pour éviter les bugs des Vues externes
	return trim(tr_lieux[i].cells[3].textContent);
}

function getLieuPosition(i) {
	let tds = tr_lieux[i].childNodes;
	let l = tds.length;
	return [
		parseInt(tds[l - 3].textContent),
		parseInt(tds[l - 2].textContent),
		parseInt(tds[l - 1].textContent)
	];
}

// function appendLieux(txt) {
// 	for (let i = 1; i < nbLieux + 1; i++) {
//		// gath: 'x_lieux' is not defined
// 		let tds = x_lieux[i].childNodes;
// 		txt = `${txt}${tds[1].firstChild.nodeValue};${getLieuNom(i)};${tds[3].firstChild.nodeValue};${tds[4].firstChild.nodeValue};${tds[5].firstChild.nodeValue}\n`;
// 	}
// 	return txt;
// }

// function getLieux() {
// 	let vue = getVue();
// 	return appendLieux(`${positionToString(getPosition())};${vue[0]};${vue[1]}\n`);
// }

function bddLieux(start, stop, limitH, limitV) {
	start = start || 1;
	stop = stop || nbLieux;
	stop = Math.min(nbLieux, stop);
	let myPosition = getPosition();
	let txt = '';
	for (let i = start; i <= stop; i++) {
		let lieuPosition = getLieuPosition(i);
		if (MZ_deltaH(myPosition, lieuPosition) > limitH) {
			continue;
		}
		if (MZ_deltaV(myPosition, lieuPosition) > limitV) {
			continue;
		}
		txt = `${txt}${getLieuID(i)};${epure(getLieuNom(i))};${positionToString(lieuPosition)}\n`;
	}
	return txt ? `#DEBUT LIEUX\n${txt}#FIN LIEUX\n` : '';
}

/** x~x Gestion Préférences Utilisateur -------------------------------- */

function saveCheckBox(chkbox, pref) {
	// Enregistre et retourne l'état d'une CheckBox
	let etat = chkbox.checked;
	MY_setValue(pref, etat ? 'true' : 'false');
	return etat;
}

function recallCheckBox(chkbox, pref) {
	// Restitue l'état d'une CheckBox
	chkbox.checked = MY_getValue(pref) == 'true';
}

function saveComboBox(cbb, pref) {
	if (!cbb) {
		return;
	}
	// Enregistre et retourne l'état d'une ComboBox
	let opt = cbb.options[cbb.selectedIndex];
	if (!opt) {
		return;
	}
	let etat = cbb.options[cbb.selectedIndex].value;
	MY_setValue(pref, etat);
	return etat;
}

function recallComboBox(cbb, pref) {
	// Restitue l'état d'une ComboBox
	let nb = MY_getValue(pref);
	if (nb && cbb) {
		cbb.value = nb;
	}
	return nb;
}

function synchroniseFiltres() {
	// Récupération de toutes les options de la vue
	let wasActive =
		Number(recallComboBox(comboBoxNiveauMin, 'NIVEAUMINMONSTRE')) +
		Number(recallComboBox(comboBoxNiveauMax, 'NIVEAUMAXMONSTRE')) +
		(recallComboBox(comboBoxFamille, 'FAMILLEMONSTRE') == 0 ? 0 : 1);	// Roule 30/01/2020 on obtient du non numérique si il y a filtre par famille
	if (wasActive > 0) {
		debutFiltrage('Monstres');
	}
	recallCheckBox(checkBoxGowapsS, 'NOGOWAPS');
	recallCheckBox(checkBoxGowapsA, 'NOGOWAPA');
	recallCheckBox(checkBoxMythiques, 'NOMYTH');
	recallCheckBox(checkBoxEngages, 'NOENGAGE');
	recallCheckBox(checkBoxLevels, 'NOLEVEL');
	recallCheckBox(checkBoxIntangibles, 'NOINT');
	recallCheckBox(checkBoxGG, 'NOGG');
	recallCheckBox(checkBoxCompos, 'NOCOMP');
	recallCheckBox(checkBoxBidouilles, 'NOBID');
	recallCheckBox(checkBoxDiplo, `${numTroll}.diplo.off`);
	recallCheckBox(checkBoxTrou, 'NOTROU');
	recallCheckBox(checkBoxTresorsNonLibres, 'NOTRESORSNONLIBRES');
	recallCheckBox(checkBoxTactique, 'NOTACTIQUE');
	if (MY_getValue('NOINFOEM') != 'true') {
		recallCheckBox(checkBoxEM, 'NOEM');
	}
}

/** x~x Initialisation: Ajout des Boutons ------------------------------ */

function getVueScript() {
	try {
		let limitH, eLimitH = document.getElementById('MZvueExtMaxH');
		if (eLimitH) {
			limitH = eLimitH.value;
		}
		if (limitH != '') {
			limitH = parseInt(limitH);
		}
		let limitV, eLimitV = document.getElementById('MZvueExtMaxV');
		if (eLimitV) {
			limitV = eLimitV.value;
		}
		if (limitV != '') {
			limitV = parseInt(limitV);
		}
		let porteeVueExt;
		if (limitH == '' || limitH == 0) {
			MY_removeValue('MZ_VueExtMaxH');
			porteeVueExt = getPorteVue()[2];	// vue limitée horizontale
			limitH = 999;
		} else {
			MY_setValue('MZ_VueExtMaxH', limitH);
			porteeVueExt = limitH;
		}
		if (limitV == '' || limitV == 0) {
			MY_removeValue('MZ_VueExtMaxV');
			limitV = 999;
		} else {
			MY_setValue('MZ_VueExtMaxV', limitV);
		}
		let txt = `${bddTrolls(limitH, limitV) +
			bddMonstres(null, null, limitH, limitV) +
			bddChampignons(limitH, limitV) +
			bddTresors(null, null, null, limitH, limitV) +
			bddLieux(null, null, limitH, limitV)
			}#DEBUT ORIGINE\n${porteeVueExt};${positionToString(getPosition())
			}\n#FIN ORIGINE\n`;
		debugMZ(`getVueScript nbTrolls=${nbTrolls}, txt=${txt}`);
		logMZ(`fin getVueScript`);
		return txt;
	} catch (exc) {
		avertissement("[getVueScript] Erreur d'export vers Vue externe", null, null, exc);
	}
}

/** x~x Menu Vue 2D ---------------------------------------------------- */
var vue2Ddata = {
	'Bricol\' Vue': {
		url: `${URL_bricol_mountyhall}vue_form.php`,
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			mode: 'vue_SP_Vue2',
			screen_width: window.screen.width
		}
	},
	'Vue du CCM': {
		url: URL_vue_CCM,
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			id: `${numTroll};${positionToString(getPosition())}`
		}
	},
	'Vue Gloumfs 2D': {
		url: URL_vue_Gloumfs2D,
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Vue Gloumfs 3D': {
		url: URL_vue_Gloumfs3D,
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Grouky Vue!': {
		url: URL_vue_Grouky,
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			type_vue: 'V5b1'
		}
	},
	'Cube': {
		noform: true,
		func: function () {
			MZ_AnalyseVue.openVueExterne(`${URL_MZ}/${URL_vue_cube}`);
		},
		extra_params: {},
	},

	/* 'DEBUG': {
		url: 'http://weblocal/testeur.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {}
	},*/
};

function refresh2DViewButton() {
	// = EventListener menu+bouton vue 2D
	let vueext = document.getElementById('selectVue2D').value;
	MY_setValue('VUEEXT', vueext);
	let oParamVue = vue2Ddata[vueext];
	let form = document.getElementById('viewForm');
	form.innerHTML = '';
	form.method = 'post';
	form.action = oParamVue.url;
	form.target = '_blank';
	if (oParamVue.paramid) {
		appendHidden(form, oParamVue.paramid, '');
	}
	for (let key in oParamVue.extra_params) {
		appendHidden(form, key, oParamVue.extra_params[key]);
	}
	if (oParamVue.noform) {
		appendButton(form, 'Voir', oParamVue.func);
	} else {
		appendSubmit(form, 'Voir',
			() => {
				logMZ('click voir vue externe');
				document.getElementsByName(oParamVue.paramid)[0].value =
					oParamVue.func();
			}
		);
	}
}

function set2DViewSystem() {
	// Initialise le système de vue 2D
	// Recherche du point d'insertion
	let center;
	try {
		// Roule 09/03/2019, encore un changement MH, je fais suivre comme je peux
		center = document.getElementById('MHTitreH2');
		// version initiale "pré-Roule"
		if (!center) {
			center = document.evaluate(
				"//h2[@id='MHTitreH2']/following-sibling::center", document, null, 9, null
			).singleNodeValue;
		}
		// Roule 09/12/2016 J'ai remplacé following-sibling::center par following-sibling::div suite à une modification MH
		if (!center) {
			center = document.evaluate(
				"//h2[@id='MHTitreH2']/following-sibling::div", document, null, 9, null
			).singleNodeValue;
		}
	} catch (exc) {
		avertissement("Erreur d'initialisation du système de vue 2D", null, null, exc);
		return;
	}

	// Récupération de la dernière vue utilisée
	let vueext = MY_getValue('VUEEXT');
	if (!vueext || !vue2Ddata[vueext]) {
		// sinon, la vue Bricol'Trolls est employée par défaut
		vueext = 'Bricol\' Vue';
	}

	try {
		// Création du sélecteur de vue externe
		let selectVue2D = document.createElement('select');
		selectVue2D.id = 'selectVue2D';
		selectVue2D.className = 'SelectboxV2';
		// logMZ('[MZd ' + GM_info.script.version + '] préparation ' + Object.keys(vue2Ddata).length + ' types de vue, troll n°' + numTroll);
		for (let view in vue2Ddata) {
			appendOption(selectVue2D, view, view);
		}
		selectVue2D.value = vueext;
		selectVue2D.onchange = refresh2DViewButton;

		// Création du formulaire d'envoi (vide, le submit est géré via handler)
		let form = document.createElement('form');
		form.id = 'viewForm';

		// Insertion du système de vue
		let table = document.createElement('table');
		let tr = appendTr(table);
		let td = appendTd(tr);
		td.appendChild(selectVue2D);
		appendTdText(tr, 'Limiter à ').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		appendTextbox(td, 'input', 'MZvueExtMaxH', 3, 3, MY_getValue('MZ_VueExtMaxH'), 'MZvueExtMaxH');
		appendTdText(tr, ' cases horizontales et ').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		appendTextbox(td, 'input', 'MZvueExtMaxV', 3, 3, MY_getValue('MZ_VueExtMaxV'), 'MZvueExtMaxV');
		appendTdText(tr, ' cases verticales').style.whiteSpace = 'nowrap';
		td = appendTd(tr);
		td.style.fontSize = '0px'; // gère le bug de l'extra character
		td.appendChild(form);
		if (center.id == 'MHTitreH2') {	// 09/03/2019 nouvelle méthode
			let eDiv = document.createElement('div');
			eDiv.appendChild(table);
			eDiv.style.witdth = '100%';
			eDiv.style.textAlign = 'center';
			table.style.width = '180px';
			table.style.margin = '0 auto';
			center.parentNode.insertBefore(eDiv, center.nextSibling);
		} else {	// ancienne méthode
			center.insertBefore(table, center.firstChild);
			insertBr(center.childNodes[1]);
		}

		// Appelle le handler pour initialiser le bouton de submit
		refresh2DViewButton();
		logMZ('fin préparation des vues externes');
	} catch (exc) {
		avertissement("Erreur de traitement du système de vue externe", null, null, exc);
	}
}

/** x~x Tableau d'Infos ------------------------------------------------ */
function initialiseInfos() {
	// DEBUG: prévoir désactivation complète du script si infoTab non trouvé
	let infoTab = document.getElementById('infoTab'),
		tbody = infoTab.tBodies[0],
		thead = infoTab.createTHead(),
		tr = appendTr(thead, 'mh_tdtitre'),
		td = appendTdText(tr, 'INFORMATIONS', true),
		span = document.createElement('span');

	// Récupération de la position du joueur
	try {
		let strPos = document.evaluate(
			".//b/text()[contains(.,'X = ') or contains(.,'X\u00A0=\u00A0')]",	// &nbsp; en vue smartphone
			infoTab, null, 9, null
		).singleNodeValue.nodeValue;
		// ***INIT GLOBALE*** currentPosition
		currentPosition = getIntegers(strPos);
		debugMZ(`retrievePosition(): ${currentPosition}`);
	} catch (exc) {
		// Si on ne trouve pas le "X ="
		logMZ('Vue Position joueur non trouvée', exc);
	}

	// Récupération des portées (max et limitée) de la vue
	try {
		let nodes = document.evaluate(
			".//b/text()[contains(.,'horizontalement') " +
			"or contains(.,'verticalement')]",
			infoTab, null, 7, null
		);
		let array = [];
		for (let i = 0; i < 4 && i < nodes.snapshotLength; i++) {
			array.push(parseInt(nodes.snapshotItem(i).nodeValue));
		}
		// ***INIT GLOBALE*** porteeVue
		porteeVue = array;
		if (porteeVue.length < 4) {
			porteeVue[2] = array[0];
			porteeVue[3] = array[1];
		}
	} catch (exc) {
		logMZ('Vue Portées Vue non trouvée', exc);
	}

	infoTab.id = 'infoTab'; // Pour scripts externes
	tbody.id = 'corpsInfoTab';
	tbody.rows[0].cells[0].colSpan = 2;
	if (tbody.rows.length > 1) {
		tbody.rows[1].cells[0].colSpan = 2;
	}
	td.colSpan = 3;
	td.style.cursor = 'pointer';

	/* quel intérêt de changer de className ? et ça fait bouger toute la frame d'un pixel ou deux, c'est désagréable
	td.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
	};
	td.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	*/
	td.onclick = function () {
		toggleTableauInfos(false);
	};

	span.id = 'msgInfoTab';
	span.style.display = 'none';
	appendText(span,
		` => Position : X = ${currentPosition[0]
		}, Y = ${currentPosition[1]
		}, N = ${currentPosition[2]
		} --- Vue : ${porteeVue[0]}/${porteeVue[1]
		} (${porteeVue[2]}/${porteeVue[3]})`,
		true
	);
	td.appendChild(span);

	tr = appendTr(tbody, 'mh_tdpage');
	td = appendTdText(tr, 'EFFACER : ', true);
	td.align = 'center';
	td.className = 'mh_tdtitre';
	td.width = 100;
	td = appendTdCenter(tr, 2);
	// DEBUG : à quoi servent les ids si on utilise des variables globales ?
	checkBoxGG = appendCheckBoxSpan(td, 'delgg', filtreTresors, " Les GG'").firstChild;
	checkBoxCompos = appendCheckBoxSpan(td, 'delcomp', filtreTresors, ' Les Compos').firstChild;
	checkBoxBidouilles = appendCheckBoxSpan(td, 'delbid', filtreTresors, ' Les Bidouilles').firstChild;
	checkBoxIntangibles = appendCheckBoxSpan(td, 'delint', filtreTrolls, ' Les Intangibles').firstChild;
	checkBoxGowapsA = appendCheckBoxSpan(td, 'delgowapA', filtreMonstres, ' Les Gowaps Apprivoisés').firstChild;
	checkBoxGowapsS = appendCheckBoxSpan(td, 'delgowapS', filtreMonstres, ' Les Gowaps Sauvages').firstChild;
	checkBoxEngages = appendCheckBoxSpan(td, 'delengage', filtreMonstres, ' Les Engagés').firstChild;
	checkBoxLevels = appendCheckBoxSpan(td, 'delniveau', toggleLevelColumn, ' Les Niveaux').firstChild;
	checkBoxDiplo = appendCheckBoxSpan(td, 'delDiplo', refreshDiplo, ' La Diplomatie').firstChild;
	checkBoxTrou = appendCheckBoxSpan(td, 'deltrou', filtreLieux, ' Les Trous').firstChild;
	checkBoxMythiques = appendCheckBoxSpan(td, 'delmyth', filtreMonstres, ' Les Mythiques').firstChild;
	if (MY_getValue('NOINFOEM') != 'true') {
		checkBoxEM = appendCheckBoxSpan(td, 'delem', filtreMonstres, ' Les Composants EM').firstChild;
	}
	checkBoxTresorsNonLibres = appendCheckBoxSpan(td, 'deltres', filtreTresors, ' Les Trésors non libres').firstChild;
	checkBoxTactique = appendCheckBoxSpan(td, 'deltactique', updateTactique, ' Les Infos tactiques').firstChild;

	if (MY_getValue('INFOPLIE')) {
		toggleTableauInfos(true);
	}
}

function toggleTableauInfos(firstRun) {
	let msg = document.getElementById('msgInfoTab'),
		corps = document.getElementById('corpsInfoTab'),
		infoplie = parseInt(MY_getValue('INFOPLIE'));	// 27/032016 Roule, pb sur récupération booléen, force numérique
	// logMZ('toggleTableauInfos(' + firstRun + '), début, INFOPLIE=' + MY_getValue('INFOPLIE') + ', !INFOPLIE=' + !MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// debug Roule
	if (!firstRun) {
		infoplie = !infoplie;
		MY_setValue('INFOPLIE', infoplie ? 1 : 0);	// 27/032016 Roule, pb sur récupération booléen, force numérique
		// logMZ('toggleTableauInfos(' + firstRun + '), après toggle et set, INFOPLIE=' + MY_getValue('INFOPLIE') + ', infoplie=' + infoplie);	// Debug Roule
	}
	if (infoplie) {
		msg.style.display = '';
		corps.style.display = 'none';
	} else {
		msg.style.display = 'none';
		corps.style.display = '';
	}
}

/* [functions] Filtres */
function prepareFiltrage(ref, width) {
	if (!isDesktopView()) {
		return false; // gath: skip si version mobile
	}
	// = Initialise le filtre 'ref'
	let tdTitre;
	try {
		tdTitre = document.getElementById(ref.toLowerCase()).closest('td');
	} catch (exc) {
		warnMZ(`[prepareFiltrage] Référence filtrage ${ref} non trouvée`, exc);
		return false;
	}
	if (width) {
		tdTitre.width = `${width}px`;
	}
	// Ajout du tr de Filtrage (masqué)
	let tbody = tdTitre.parentNode.parentNode;
	let tr = appendTr(tbody, 'mh_tdpage');
	tr.style.display = 'none';
	tr.id = `trFiltre${ref}`;
	let td = appendTd(tr);
	td.colSpan = 5;
	// Ajout du bouton de gestion de Filtrage
	let tdBtn = insertAfterTd(tdTitre);
	tdBtn.id = `tdInsert${ref}`;
	let btn = appendButton(tdBtn, 'Filtrer');
	btn.id = `btnFiltre${ref}`;
	btn.onclick = function () {
		debutFiltrage(ref);
	};
	return td;
}

function debutFiltrage(ref) {
	// = Handler de début de filtrage (filtre 'ref')
	let e = document.getElementById(`trFiltre${ref}`);
	if (e) {
		e.style.display = '';
	}
	let btn = document.getElementById(`btnFiltre${ref}`);
	if (btn) {
		btn.value = 'Annuler Filtre';
		btn.onclick = function () {
			finFiltrage(ref);
		};
	}
}

function finFiltrage(ref) {
	// = Handler de fin de filtrage (filtre 'ref')
	/* On réassigne le bouton 'Filtrer' */
	document.getElementById(`trFiltre${ref}`).style.display = 'none';
	let btn = document.getElementById(`btnFiltre${ref}`);
	btn.value = 'Filtrer';
	btn.onclick = function () {
		debutFiltrage(ref);
	};

	/* Réinitialisation filtres */
	document.getElementById(`str${ref}`).value = '';
	switch (ref) {
		case 'Monstres':
			document.getElementById('nivMinMonstres').value = 0;
			document.getElementById('nivMaxMonstres').value = 0;
			document.getElementById('FamilleMonstres').value = 0;
			break;
		case 'Trolls':
			document.getElementById('strGuildes').value = '';
	}

	/* Nettoyage (=lance le filtre) */
	// Ici this = MZ.global = sandBox de travail de MZ
	// Roule 11/03/2016, ne fonctionne plus, il faut traiter les cas
	// this['filtre'+ref]();
	switch (ref) {
		case 'Monstres':
			filtreMonstres();
			break;
		case 'Trolls':
			filtreTrolls();
			break;
		case 'Tresors':
			filtreTresors();
			break;
		case 'Lieux':
			filtreLieux();
			break;
		default:
			logMZ(`cas incongru dans finFiltrage : ${ref}`);
			break;
	}
}

function ajoutFiltreStr(td, nomBouton, id, onClick) {
	let bouton = appendButton(td, nomBouton, onClick);
	appendText(td, '\u00a0');
	let textbox = appendTextbox(td, 'text', id, 15, 30);
	textbox.onkeypress = function (event) {
		try {
			if (event.keyCode == 13) {
				event.preventDefault();
				bouton.click();
			}
		} catch (exc) {
			avertissement(`Une erreur est survenue (ajoutFiltreStr)`, null, null, exc);
		}
	};
}

function ajoutFiltreMenu(tr, id, onChange, liste) {
	let select = document.createElement('select');
	select.id = id;
	select.onchange = onChange;
	appendOption(select, 0, 'Aucun');
	if (liste == undefined) {
		for (let i = 1; i <= 60; i++) {
			appendOption(select, i, i);
		}
	} else {
		liste.forEach((f) => {
			appendOption(select, f, f);
		});
	}
	tr.appendChild(select);
	return select;
}

function ajoutDesFiltres() {
	/* Monstres */
	let td = prepareFiltrage('Monstres', 130);
	if (td) {
		ajoutFiltreStr(td, 'Nom du monstre:', 'strMonstres', filtreMonstres);
		appendText(td, '\u00a0\u00a0\u00a0');
		appendText(td, 'Niveau Min: ');
		comboBoxNiveauMin = ajoutFiltreMenu(td, 'nivMinMonstres', filtreMonstres);
		appendText(td, '\u00a0');
		appendText(td, 'Niveau Max: ');
		comboBoxNiveauMax = ajoutFiltreMenu(td, 'nivMaxMonstres', filtreMonstres);
		appendText(td, '\u00a0');
		appendText(td, 'Famille: ');
		comboBoxFamille = ajoutFiltreMenu(td, 'FamilleMonstres', filtreMonstres, ['Animal', 'Insecte', 'Démon', 'Humanoide', 'Monstre', 'Mort-Vivant']);
	}

	/* Trõlls */
	td = prepareFiltrage('Trolls', 50);
	if (td) {
		ajoutFiltreStr(td, 'Nom du trõll:', 'strTrolls', filtreTrolls);
		appendText(td, '\u00a0\u00a0\u00a0');
		ajoutFiltreStr(td, 'Nom de guilde:', 'strGuildes', filtreTrolls);
	}

	/* Trésors */
	td = prepareFiltrage('Tresors', 55);
	if (td) {
		ajoutFiltreStr(td, 'Nom du trésor:', 'strTresors', filtreTresors);
	}

	/* Lieux */
	td = prepareFiltrage('Lieux', 40);
	if (td) {
		ajoutFiltreStr(td, 'Nom du lieu:', 'strLieux', filtreLieux);
	}
}

/** x~x Fonctions Monstres --------------------------------------------- */

function MZ_insertStyleNth(eStyle, newCol, newStyle, maxCol) {	// DOMElement du style, numéro de colonne insérée, Style supplémentaire, nombre max de col (pas grave si c'est beaucoup plus grand)
	// cette fonction patche la série de styles en "déplaçant" les colonnes qui suivent celle insérée
	let sStyle = eStyle.innerHTML;
	for (let i = maxCol; i >= newCol; i--) {	// on déplace à partir de la fin
		// Roule : j'avais utilisé string.replaceAll() mais ce n'est pas supporté par Firefox ESR
		let rNeedle = new RegExp(`\\(${i + 1}\\)`, "g");	// les styles "nth" comptent à partir de "1"
		sStyle = sStyle.replace(rNeedle, `(${i + 2})`);
	}
	sStyle = sStyle + newStyle;
	eStyle.innerHTML = sStyle;
}

/* [functions] Affichage de la colonne des niveaux */
function insertLevelColumn() {
	// Appelé dans le code attaché à la page de vue et au click/unclick de la checkbox

	MZ_EtatCdMs.indexCellNivMZ = MZ_EtatCdMs.indexCellID + 1;	// la colonne des niveaux sera insérée après la colonne des ID
	MZ_EtatCdMs.indexCellX = MZ_EtatCdMs.indexCellX + 1;	// et ça décale les colonnes suivantes
	MZ_EtatCdMs.indexCellY = MZ_EtatCdMs.indexCellY + 1;
	MZ_EtatCdMs.indexCellN = MZ_EtatCdMs.indexCellN + 1;
	let td = insertThText(getMonstreLevelNode(0), 'Niv.', false);
	// td.width = 25;

	/* plus de colgroup le 08/07/2020. Mais comme ça pourrait revenir, je laisse le bout de code en commentaire (Roule)
	let eColGroup = getMonstreLevelNode(0).closest('table').getElementsByTagName('colgroup')[0];
	let eCol = document.createElement('col');
	eCol.style.width= '35px';
	insertBefore(eColGroup.children[3],eCol);
	*/
	let monsterStyle = document.getElementById('mh_vue_hidden_monstres').getElementsByTagName('style')[0];
	let styleColNivMZ = `.mh_tdborder.footable#VueMONSTRE th:nth-child(${MZ_EtatCdMs.indexCellNivMZ + 1}) {width:35px; text-align:center;}`;
	styleColNivMZ = `${styleColNivMZ}.mh_tdborder.footable#VueMONSTRE td:nth-child(${MZ_EtatCdMs.indexCellNivMZ + 1}) {font-weight:bold;text-align:center;}`;
	MZ_insertStyleNth(monsterStyle, MZ_EtatCdMs.indexCellNivMZ, styleColNivMZ, MZ_EtatCdMs.indexCellN);

	td.id = 'MZ_TITRE_NIVEAU_MONSTRE';
	for (let i = 1; i <= MZ_EtatCdMs.nbMonstres; i++) {
		// logMZ('nbMonstres=' + MZ_EtatCdMs.nbMonstres + ', MZ_EtatCdMs.tr_monstres.length=' + MZ_EtatCdMs.tr_monstres.length);	// debug Roule
		td = insertTdText(getMonstreLevelNode(i), '-');
	}
}

function toggleLevelColumn() {	// Appelé par le code attaché à la page de vue et au click/unclick de la checkbox NOCDM
	let eltMZ_TITRE_NIVEAU_MONSTRE = document.getElementById('MZ_TITRE_NIVEAU_MONSTRE');	// test si la colonne a déjà été ajoutée
	if (saveCheckBox(checkBoxLevels, 'NOLEVEL')) {
		if (!eltMZ_TITRE_NIVEAU_MONSTRE) {
			return;
		}	// rien à faire si la colonne n'existe pas. C'est le cas à l'ouverture de la page avec NOCMD coché
		// cacher tous les td
		for (let i = 0; i <= MZ_EtatCdMs.nbMonstres; i++) {
			getMonstreLevelNode(i).style.display = 'none';
		}
	} else if (!eltMZ_TITRE_NIVEAU_MONSTRE) {
		insertLevelColumn();
		retrieveCDMs();
	} else {
		// afficher tous les td
		for (let i = 0; i <= MZ_EtatCdMs.nbMonstres; i++) {
			getMonstreLevelNode(i).style.display = '';
		}
	}
}

/* [functions] Gestion de l'AFFICHAGE des CdMs */
function basculeCDM(nom, id) {
	// = Bascule l'affichage des popups CdM
	if (MZ_EtatCdMs.listeCDM[id]) {
		if (!document.getElementById(`popupCDM${id}`)) {
			afficherCDM(nom, id);
		} else {
			cacherPopupCDM(`popupCDM${id}`);
		}
	} else {
		// DEBUG: prévoir un "else" ou désactiver l'effet onmouseover si pas de CdM
		logMZ(`pas de CdM pour id=${id}, nom=${nom}`);
	}
}

function cacherPopupCDM(titre) {
	let popup = document.getElementById(titre);
	popup.parentNode.removeChild(popup);
}

function removeTableFromClickEvent() {	// "this" est supposé être un <td> ou <th> d'une <table>
	let table = this.parentNode.parentNode.parentNode;	// <tr><tbody/thead/tfoot><table>
	table.parentNode.removeChild(table);
}

/* DEBUG: Section à mettre à jour */
var selectionFunction;

function startDrag(evt) {
	winCurr = this.parentNode;
	evt = evt || window.event; // est-ce utile sous FF ? sous FF24+ ?
	offsetX = evt.pageX - parseInt(winCurr.style.left);
	offsetY = evt.pageY - parseInt(winCurr.style.top);
	selectionFunction = document.body.style.MozUserSelect;
	document.body.style.MozUserSelect = 'none';
	winCurr.style.MozUserSelect = 'none';
	return false;
}

function stopDrag(evt) {
	winCurr.style.MozUserSelect = selectionFunction;
	document.body.style.MozUserSelect = selectionFunction;
	winCurr = null;
}

function drag(evt) {
	if (winCurr == null) {
		return;
	}
	evt = evt || window.event;
	winCurr.style.left = `${evt.pageX - offsetX}px`;
	winCurr.style.top = `${evt.pageY - offsetY}px`;
	return false;
}

/* FIN DEBUG */
if (!isPage("MH_Play/Play_equipement")) {
	// Conflit overlib/Tout_MZ:
	// Double définition du "onmousemove" sur la page d'équipement
	document.onmousemove = drag;
}

function afficherCDM(nom, id) {
	// Crée la table de CdM du mob n° id
	let donneesMonstre = MZ_EtatCdMs.listeCDM[id];

	/* Début création table */
	let table = createCDMTable(id, nom, donneesMonstre, removeTableFromClickEvent);

	/* Ajout du titre avec gestion Drag & Drop */
	let tr = table.firstChild;
	tr.style.cursor = 'move';
	tr.onmousedown = startDrag;
	tr.onmouseup = stopDrag;

	table.id = `popupCDM${id}`;
	table.style.position = 'fixed';
	table.style.backgroundColor = 'rgb(229, 222, 203)';
	table.style.zIndex = 1;
	// let topY = +(300+(30*MZ_EtatCdMs.yIndexCDM))%(30*Math.floor((window.innerHeight-400)/30));
	table.style.left = `${Number(window.innerWidth - 365)}px`;
	table.style.width = '300px';

	/* Fin création table & Affichage */
	document.body.appendChild(table);
	let topY = 90 + 30 * MZ_EtatCdMs.yIndexCDM;
	// logMZ('topY=' + topY + ', offsetHeight=' + table.offsetHeight + ', innerHeight=' + window.innerHeight);
	if (topY + table.offsetHeight > window.innerHeight) {
		MZ_EtatCdMs.yIndexCDM = 0;	// on se repositionne en haut s'il n'y a pas assez de place
		topY = 90;
	} else {
		MZ_EtatCdMs.yIndexCDM++;	// décalage pour la fois suivante
	}
	table.style.top = `${topY}px`;
}

/* [functions] Gestion de l'AFFICHAGE des Infos de combat */
function showPopupError(sHTML) {
	logMZ(`affichage PopupError ${sHTML}`);
	let divpopup = document.createElement('div');
	divpopup.id = 'divpopup';
	divpopup.style =
		'position: fixed;' +
		'border: 3px solid #000000;' +
		'top: 300px;left: 10px;' +
		'background-color: red;' +
		'color: white;' +
		'font-size: xx-large;' +
		'z-index: 200;';
	divpopup.innerHTML = sHTML;
	let divcroix = document.createElement('div');
	divcroix.style =
		'position: absolute;' +
		'top: 0;right: 0;' +
		'color: inherit;' +
		'font-size: inherit;' +
		'cursor: pointer;' +
		'z-index: 201;';
	divcroix.innerHTML = "X";
	divcroix.onclick = function () {
		document.getElementById('divpopup').style.display = 'none';
	};
	document.body.appendChild(divpopup);
	divpopup.appendChild(divcroix);
}

function retrieveCDMs() {
	// Récupère les CdM disponibles dans la BDD
	// Lancé uniquement sur toggleLevelColumn
	if (checkBoxLevels.checked) {
		return;
	}
	if (MZ_EtatCdMs.nbMonstres < 1) {
		return;
	}

	let tReq = [];
	let nbReq = 0;
	let prevLastIndexDone = MZ_EtatCdMs.lastIndexDone;
	let i = prevLastIndexDone + 1;
	for (; i <= MZ_EtatCdMs.nbMonstres; i++) {
		// tReq.push(i + "\t" + getMonstreID(i) + "\t" + getMonstreNom(i));
		// ne pas demander pour les Gowaps
		let nom = getMonstreNom(i);
		if (nom.match(/^[^\[]*Gowap/i)) {	// le mot Gowap peut être précédé par un template (qui ne contient donc pas [)
			getMonstreLevelNode(i).innerHTML = '';
			continue;
		}
		tReq.push({ index: i, id: getMonstreID(i), nom: nom });
		nbReq++;
		if (nbReq >= 500) {
			break;
		}	// limitation pour ne pas faire attendre, et aussi car on a un dépassement mémoire coté serveur si c'est trop gros
	}
	MZ_EtatCdMs.lastIndexDone = i;
	// let startAjaxCdM = new Date();  // WARNING (gath) - non utilisé -> commenté
	logMZ(`${MZ_formatDateMS()} lancement AJAX ${nbReq} demandes niveaux monstres V2`);

	FF_XMLHttpRequest({
		method: 'POST',
		url: URL_MZgetCaracMonstre,
		headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		// data: 'l=' + tReq.join("\n"),
		data: `l=${JSON.stringify(tReq)}`,
		trace: 'demande niveaux monstres V2',
		onload: function (responseDetails) {
			let texte;
			try {
				// logMZ('retrieveCDMs readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
				if (responseDetails.status == 0) {
					return;
				}
				// logMZ('[MZd] ' + (+new Date) + ' ajax niv monstres début');
				texte = responseDetails.responseText;
				let infos = JSON.parse(texte);
				displayScriptTime(new Date().getTime() - date_debut.getTime(), 'Analyse des CdM MZ');
				if (infos.length == 0) {
					return;
				}

				// ajouter les styles CSS pour les popup
				let mystyle = document.createElement('style');
				mystyle.type = 'text/css';
				let sCSS = '.MZtooltip {position: relative;color:red;text-align:center;}\n';
				sCSS = `${sCSS}.MZtooltip .MZtooltiptext {visibility: hidden;width: 250px;padding: 5px 0;border:solid 1px;position: absolute;z-index: 1;color:black;background-color:white}\n`;
				sCSS = `${sCSS}.MZtooltip:hover .MZtooltiptext {visibility: visible;}\n`;
				mystyle.innerHTML = sCSS;
				document.getElementsByTagName('head')[0].appendChild(mystyle);

				// if (MY_DEBUG) {
				// for (let i = 0; i < 20; i++) logMZ('infos[' + i + ']=' + JSON.stringify(infos[i]));
				// }
				// let begin2, end2, index;  // WARNING (gath) - non utilisé -> commenté
				for (let j = 0; j < infos.length; j++) {
					let info = infos[j];
					if (info.index == undefined) {
						continue;
					}
					let eTdLevel = getMonstreLevelNode(info.index);
					this.className = 'mh_tdpage';
					let myColor = undefined;
					if (info.niv != undefined && info.niv.max == -1 && info.Mode != 'cdm') {
						eTdLevel.className = "MZtooltip";
						eTdLevel.style.color = "black";
						eTdLevel.innerHTML = 'Var.<span class="MZtooltiptext">Ce monstre est variable.<br />On ne peut pas avoir d\'information sans CdM.</span>';
					} else if (!(info && info.esq)) {
						// debugMZ("pas d'esquive id=" + info.id + ", index=" + info.index);
						eTdLevel.className = "MZtooltip";
						eTdLevel.innerHTML = `${mkMinMaxHTML(info.niv)}<span class="MZtooltiptext">Désolé, pas de CdM dans MZ pour ce type de monstre (même âge, même template).<br />Vous pouvez aider en envoyant une CdM à MZ.</span>`;
					} else {
						eTdLevel.innerHTML = mkMinMaxHTML(info.niv);
						// info.iTR = info.index;	// Roule 29/04/2017 permet de récupérer la position du monstres dans analyseTactique (pour calcul de distance pour le PM). 15/11/2019 index contient l'info
						myColor = MZ_CdMColorFromMode(info);
						eTdLevel.style.cursor = 'pointer';
						eTdLevel.onclick = function () {
							basculeCDM(getMonstreNomByTR(this.parentNode), getMonstreIDByTR(this.parentNode));
						};
					}
					MZ_EtatCdMs.listeCDM[info.id] = info;
					if (myColor) {
						eTdLevel.style.color = myColor;
					}

					/* Roule' à étudier plus tard, cette différence de style selon la diplo...
					eTdLevel.onmouseover = function() {
						this.className = 'mh_tdtitre';
					};
					eTdLevel.onmouseout = function() {
						if(this.parentNode.diploActive=='oui') {
							this.className = '';
						} else {
							this.className = 'mh_tdpage';
						}
					};
					*/
				}
				debugMZ(`${MZ_formatDateMS()} ajax niv monstres avant computeMission`);
				computeMission(prevLastIndexDone + 1, MZ_EtatCdMs.nbMonstres);
				debugMZ(`${MZ_formatDateMS()} ajax niv monstres avant filtreMonstres`);
				filtreMonstres();	// ajout Roule' 20/01/2017 car il y a des cas où les données arrivent après le filtrage
				debugMZ(`${MZ_formatDateMS()} ajax niv monstres fin`);
				document.body.dataset.MZ_Etat = 2;	// indiquer aux scripts tiers qu'on a récupéré les carac
				if (document.body.MZ_Callback_fin_vue !== undefined) {
					for (let iCallback = 0; iCallback < document.body.MZ_Callback_fin_vue.length; iCallback++) {
						document.body.MZ_Callback_fin_vue[iCallback]();
					}
				}
			} catch (exc) {
				logMZ(`retrieveCDMs: ${URL_MZgetCaracMonstre}\n${texte}`, exc);
			}
			// debugMZ('id=6376829, info=' + JSON.stringify(MZ_EtatCdMs.listeCDM[6376829]));
			MZ_EtatCdMs.isCDMsRetrieved = true;
			// afficher/supprimer le bouton pour demander la suite
			let eltBoutonSuite = document.getElementById('MZ_boutonSuiteCdM');
			debugMZ(`lastIndexDone=${MZ_EtatCdMs.lastIndexDone}, nbMonstres=${MZ_EtatCdMs.nbMonstres}, eltBoutonSuite=${eltBoutonSuite}`);
			if (MZ_EtatCdMs.lastIndexDone < MZ_EtatCdMs.nbMonstres) {
				if (eltBoutonSuite) {
					while (eltBoutonSuite.firstChild) {
						eltBoutonSuite.removeChild(eltBoutonSuite.firstChild);
					}	// vider
					appendText(eltBoutonSuite, `en cours ${MZ_EtatCdMs.lastIndexDone}/${MZ_EtatCdMs.nbMonstres}`);
					retrieveCDMs();	// lancer la suite
				} else {
					eltBoutonSuite = document.createElement('div');
					eltBoutonSuite.id = 'MZ_boutonSuiteCdM';
					eltBoutonSuite.style.position = 'fixed';
					eltBoutonSuite.style.border = '1px solid black';
					eltBoutonSuite.style.top = '10px';
					eltBoutonSuite.style.right = '10px';
					// eltBoutonSuite.style.backgroundColor = 'white';
					eltBoutonSuite.style.backgroundImage = 'url("/mountyhall/MH_Packs/packMH_parchemin/fond/fond2.jpg")';
					eltBoutonSuite.style.color = 'black';
					eltBoutonSuite.style.fontSize = 'large';
					eltBoutonSuite.style.padding = '5px';
					eltBoutonSuite.style.borderRadius = '10px';
					eltBoutonSuite.style.cursor = 'pointer';
					eltBoutonSuite.style.zIndex = '500';
					appendText(eltBoutonSuite, `${nbReq} CdM(s) récupérées`);
					appendBr(eltBoutonSuite);	// C'est plus classe que d'utiliser innerHTML ☺
					appendText(eltBoutonSuite, 'Cliquer ici pour demander les CdMs');
					appendBr(eltBoutonSuite);
					appendText(eltBoutonSuite, `des ${MZ_EtatCdMs.nbMonstres} monstres`);
					eltBoutonSuite.title = 'Shift-Click pour faire disparaitre ce bouton sans demander les CdMs';
					eltBoutonSuite.onclick = MZ_SuiteCdMs;
					document.body.appendChild(eltBoutonSuite);
				}
			} else if (eltBoutonSuite) {
				eltBoutonSuite.parentNode.removeChild(eltBoutonSuite);
			}
		},
	});
	debugMZ(`${MZ_formatDateMS()} requête ajax partie pour ${tReq.length} monstres`);
}

function MZ_CdMColorFromMode(info) {
	switch (info.Mode) {
		case 'cdm':
			return 'blue';
		case 'stat':
			return 'purple';
		case 'statV1':
			return 'orange';
	}
}

function MZ_SuiteCdMs(e) {	// handler du click sur le bouton pour demander la suite des CdMs
	let evt = e || window.event;
	if (evt.shiftKey) {
		this.parentNode.removeChild(this);
		return;
	}
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}	// vider
	appendText(this, `en cours ${MZ_EtatCdMs.lastIndexDone}/${MZ_EtatCdMs.nbMonstres}`);
	this.title = 'Shift-Click pour faire disparaitre ce bouton';
	this.style.cursor = '';	// default
	this.onclick = MZ_SupprBoutonCdMs;
	retrieveCDMs();
}

function MZ_SupprBoutonCdMs(e) {
	let evt = e || window.event;
	if (evt.shiftKey) {
		this.parentNode.removeChild(this);
	}
}

function mkMinMaxHTML(oMM) {
	if (oMM == undefined) {
		return '';
	}
	if (oMM.min == undefined) {
		if (oMM.max == undefined) {
			return;
		}
		return `\u2A7D${oMM.max}`;	// U+2A7D "LESS-THAN OR SLANTED EQUAL TO"
	}
	if (oMM.max == undefined) {
		return `\u2A7E${oMM.min}`;	// U+2A7E "GREATER-THAN OR SLANTED EQUAL TO"
	} else if (oMM.min == oMM.max) {
		return oMM.min;
	} else if (oMM.min < oMM.max) {
		return `${oMM.min}-${oMM.max}`;
	}
	return `<span style="color:red">${oMM.min}-${oMM.max}</span>`;
}

function computeMission(begin, end) {
	// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance
	// +++logMZ('computeMission, begin=' + begin + ', end=' + end);
	computeVLC(begin, end);
	// +++logMZ('computeMission, après computeVLC');
	begin = begin || 1;
	end = end || MZ_EtatCdMs.nbMonstres;
	let str = MY_getValue(`${numTroll}.MISSIONS`);
	if (!str) {
		return;
	}

	let urlImg = `${URL_MZimg}mission.png`;
	let obMissions = JSON.parse(str);

	for (let i = end; i >= begin; i--) {
		let mess = '';
		let bPeutEtreIcone = false;
		for (let num in obMissions) {
			let mobMission = false;
			let mobMissionPeutEtre = undefined;
			let donneesMonstre;
			switch (obMissions[num].type) {
				case 'Race':
					let race = epure(obMissions[num].race.toLowerCase());
					let nom = epure(getMonstreNom(i).toLowerCase());
					if (nom.indexOf(race) != -1) {
						if (race == 'crasc') {
							if (nom.indexOf('medius') != -1) {
								// pas éligible
							} else if (nom.indexOf('maexus') != -1) {
								// pas éligible
							} else if (nom.indexOf('parasitus') != -1) {
								if (nom.match(/^crasc parasitus \[/ui)) {
									// on ne peut pas savoir
									mobMissionPeutEtre = 'Impossible de savoir si ce monstre a comme race "Crasc" ou "Crasc Parasitus"\n' +
										'Faire une CdM. Si la portée de pouvoir est "automatique", il s\'agit d\'un "Crasc", si elle est "au toucher", il s\'agit d\'un "Crasc Parasitus"';
								} else {
									// c'est un monstre de la race des Crasc Parasitus
									mobMission = false;
								}
							} else {
								mobMission = true;
							}
						} else if (race == 'crasc parasitus') {
							if (nom.match(/^crasc parasitus \[/ui)) {
								// on ne peut pas savoir
								mobMissionPeutEtre = 'Impossible de savoir si ce monstre a comme race "Crasc" ou "Crasc Parasitus"\n' +
									'Faire une CdM. Si la portée de pouvoir est "automatique", il s\'agit d\'un "Crasc", si elle est "au toucher", il s\'agit d\'un "Crasc Parasitus"';
							} else {
								// c'est un monstre de la race des Crasc Parasitus
								mobMission = true;
							}
						} else if (race == 'shai') {
							if (nom.match(/abishai/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'ombre') {
							if (nom.match(/roche/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'geck\'oo') {
							if (nom.match(/majestueux/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else if (race == 'bouj\'dla') {
							if (nom.match(/placide/ui)) {
								mobMission = false;
							} else {
								mobMission = true;
							}
						} else {
							mobMission = true;
						}
					}
					break;
				case 'Niveau':
					let minMimi, maxMimi;
					donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if (donneesMonstre) {
						let nivMimi = Number(obMissions[num].niveau);
						let mod = obMissions[num].mod;	// mission nivMimi±mod si mod est numérique, sinon, c'est >= nivMimi
						if (isNaN(mod)) {
							minMimi = nivMimi;
							maxMimi = nivMimi + 999999;
						} else {
							minMimi = nivMimi - mod;
							maxMimi = nivMimi + mod;
						}
						if (donneesMonstre.niv) {	// nouveau mode
							if (donneesMonstre.niv.max && donneesMonstre.niv.min) {
								if (donneesMonstre.niv.max <= maxMimi && donneesMonstre.niv.min >= minMimi) {
									mobMission = true;
								} else if (!(donneesMonstre.niv.max < minMimi || donneesMonstre.niv.min > maxMimi)) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
									if (isDEV) {
										mobMissionPeutEtre = `${mobMissionPeutEtre}\nMonstre=(${donneesMonstre.niv.min}, ${donneesMonstre.niv.max}), mimi=(${minMimi}, ${maxMimi})`;
									}
								}
							} else if (donneesMonstre.niv.max) {
								if (donneesMonstre.niv.max >= minMimi) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
								}
							} else if (donneesMonstre.niv.min) {
								if (donneesMonstre.niv.min <= maxMimi) {
									mobMissionPeutEtre = 'Il reste à déterminer le niveau exact du monstre';
								}
							}
						}
					}
					break;
				case 'Famille':
					donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if (donneesMonstre && donneesMonstre.fam) {
						let familleMimi = epure(obMissions[num].famille.toLowerCase()).replace(/[']/g, '');	// Roule 27/02/2019 simple quote dans les familles
						let familleMob = epure(donneesMonstre.fam.toLowerCase());
						if (familleMob.indexOf(familleMimi) != -1) {
							mobMission = true;
						}
					}
					break;
				case 'Pouvoir':
					donneesMonstre = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
					if (donneesMonstre && donneesMonstre.pouv) {
						let pvrMimi = epure(obMissions[num].pouvoir.toLowerCase());
						let pvrMob = epure(donneesMonstre.pouv.toLowerCase());
						if (pvrMob.indexOf(pvrMimi) != -1) {
							mobMission = true;
						}
					}
			}
			if (mobMission) {
				mess = mess + (mess ? '\n\n' : '');
				mess = `${mess}Mission ${num} :\n${obMissions[num].libelle}`;
			} else if (mobMissionPeutEtre !== undefined) {
				mess = mess + (mess ? '\n\n' : '');
				mess = `${mess}${mobMissionPeutEtre}\n`;
				bPeutEtreIcone = true;
				mess = `${mess}Mission ${num} :\n${obMissions[num].libelle}`;
			}
		}
		if (mess) {
			let td = getMonstreNomNode(i);
			appendText(td, ' ');
			let myURL;
			if (bPeutEtreIcone) {
				myURL = `${URL_MZimg}missionX.png`;
			} else {
				myURL = urlImg;
			}
			td.appendChild(createImage(myURL, mess));
		}
	}
}

function computeVLC(begin, end) {
	// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeMission
	// +++logMZ('computeVLC, begin=' + begin + ', end=' + end);
	computeTactique(begin, end);
	// +++logMZ('computeVLC, après computeTactique');
	begin = begin || 1;
	end = end || MZ_EtatCdMs.nbMonstres;
	let cache = getSortComp("Invisibilité") > 0 || getSortComp("Camouflage") > 0;
	if (!cache) {
		return false;
	}
	let urlImg = `${URL_MZimg}oeil.png`;
	for (let i = end; i >= begin; i--) {
		let id = getMonstreID(i);
		let donneesMonstre = MZ_EtatCdMs.listeCDM[id];
		if (donneesMonstre && donneesMonstre.vlc) {
			// if (donneesMonstre) logMZ('computeVLC i=' + i + ' id=' + id + ' ' + JSON.stringify(donneesMonstre));
			let td = getMonstreNomNode(i);
			td.appendChild(document.createTextNode(" "));
			td.appendChild(createImage(urlImg, "Voit le caché"));
		}
		if (donneesMonstre && donneesMonstre.gen) {
			let imgPh, txtPh;
			switch (donneesMonstre.gen) {
				case 1:
					imgPh = `${URL_MZimg}Phoenix1.png`;
					txtPh = 'Phœnix de première génération';
					break;
				case 2:
					imgPh = `${URL_MZimg}Phoenix2.png`;
					txtPh = 'Phœnix de deuxième génération';
					break;
				case 3:
					imgPh = `${URL_MZimg}Phoenix3.png`;
					txtPh = 'Phœnix de troisième génération';
					break;
				case 23:
					imgPh = `${URL_MZimg}Phoenix23.png`;
					txtPh = 'Phœnix de deuxième ou troisième génération';
					break;
			}
			let td = getMonstreNomNode(i);
			td.appendChild(document.createTextNode(" "));
			let img = td.appendChild(createImage(imgPh, txtPh));
			img.style.height = '15px';
			img.style.width = 'auto';
		}
	}
}

/* appelé
par updateTactique
	par initialiseInfos
		par do_vue
par computeVLC
	par computeMission
		par filtreMonstres
		par retrieveCDMs
*/
function computeTactique(begin, end) {
	// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeVLC
	begin = begin || 1;
	end = end || MZ_EtatCdMs.nbMonstres;
	let j = end;
	try {
		// +++logMZ('computeTactique, begin=' + begin + ', end=' + end + ', checkBoxTactique=' + checkBoxTactique);
		let noTactique = saveCheckBox(checkBoxTactique, 'NOTACTIQUE');
		// +++logMZ('computeTactique, noTactique=' + noTactique);
		if (noTactique || !isProfilActif()) {
			return;
		}
		// +++logMZ('computeTactique, après isProfilActif');

		for (; j >= begin; j--) {
			let id = getMonstreID(j);
			let nom = getMonstreNom(j);
			let donneesMonstre = MZ_EtatCdMs.listeCDM[id];
			let bShowTactique = false;
			if (donneesMonstre && donneesMonstre.esq) {
				bShowTactique = true;
			}
			if (bShowTactique) {
				let td = getMonstreNomNode(j);
				appendText(td, ' ');
				td.appendChild(MZ_Tactique.createImage(id, nom));
			}
		}
	} catch (exc) {
		logMZ(`computeTactique: mob num : ${j}`, exc);
	}
	filtreMonstres();
}

function updateTactique() {
	// = Handler checkBox noTactique
	let noTactique = saveCheckBox(checkBoxTactique, 'NOTACTIQUE');
	// +++logMZ('updateTactique, noTactique=' + noTactique);
	if (!MZ_EtatCdMs.isCDMsRetrieved) {
		return;
	}
	// +++logMZ('updateTactique, isCDMsRetrieved=' + MZ_EtatCdMs.isCDMsRetrieved);

	if (noTactique) {
		for (let i = MZ_EtatCdMs.nbMonstres; i > 0; i--) {
			let tr = getMonstreNomNode(i);
			let img = document.evaluate(`img[@src='${URL_MZimg}calc2.png']`, tr, null, 9, null).singleNodeValue;
			if (img) {
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
			}
		}
	} else {
		computeTactique();
	}
}

function filtreMonstres() {
	// = Handler universel pour les fonctions liées aux monstres
	let urlImg = `${URL_MZimg}Competences/ecritureMagique.png`,
		urlEnchantImg = `${URL_MZimg}enchant.png`;

	/* Vérification/Sauvegarde de tout ce qu'il faudra traiter */
	let useCss = MY_getValue(`${numTroll}.USECSS`) == 'true';
	let noGowapsS = saveCheckBox(checkBoxGowapsS, 'NOGOWAPS');
	let noGowapsA = saveCheckBox(checkBoxGowapsA, 'NOGOWAPA');
	let noEngages = saveCheckBox(checkBoxEngages, 'NOENGAGE');
	let nivMin = saveComboBox(comboBoxNiveauMin, 'NIVEAUMINMONSTRE');
	let nivMax = saveComboBox(comboBoxNiveauMax, 'NIVEAUMAXMONSTRE');
	let famille = saveComboBox(comboBoxFamille, 'FAMILLEMONSTRE');
	// old/new : détermine s'il faut ou non nettoyer les tr
	let oldNOEM = true, noEM = true;
	if (MY_getValue('NOINFOEM') != 'true') {
		noEM = saveCheckBox(checkBoxEM, 'NOEM');
	}
	// Filtrage par nom
	let eMonstre = document.getElementById('strMonstres');
	if (!eMonstre) {
		return;
	}	// cas smartphone
	let strMonstre = eMonstre.value.toLowerCase();
	// Génère la liste des mobs engagés (si filtrés)
	if (noEngages && !isEngagesComputed) {
		for (let i = nbTrolls; i > 0; i--) {
			let pos = getTrollPosition(i);
			if (!listeEngages[pos[0]]) {
				listeEngages[pos[0]] = {};
			}
			if (!listeEngages[pos[0]][pos[1]]) {
				listeEngages[pos[0]][pos[1]] = {};
			}
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}

	/** * FILTRAGE ***/
	/* À computer :
	 * - EM (nom suffit)
	 * - Enchant (nom suffit)
	 * - Mission (nécessite CdM)
	   * - mob VlC (nécessite CdM)
	 * Sans computation :
	 * - Gowap ? engagé ?
	 */
	for (let i = MZ_EtatCdMs.nbMonstres; i > 0; i--) {
		let pos = getMonstrePosition(i);
		let nom = getMonstreNom(i).toLowerCase();
		if (noEM != oldNOEM) {
			let tr = getMonstreNomNode(i);
			if (noEM) {
				// Si noEM passe de false à true, on nettoie les td "Nom"
				// DEBUG: Sauf que ce serait carrément mieux avec des id...
				while (tr.childNodes.length > 1) {
					tr.removeChild(tr.childNodes[1]);
				}
			} else {
				let TypeMonstre = getEM(nom);
				if (TypeMonstre != '') {
					let infosCompo = compoMobEM(TypeMonstre);
					if (infosCompo.length > 0) {
						tr.appendChild(document.createTextNode(' '));
						tr.appendChild(createImage(urlImg, infosCompo));
					}
				}
			}
		}
		if (needComputeEnchantement || noEM != oldNOEM && noEM) {
			let texte = getInfoEnchantementFromMonstre(nom);
			if (texte != '') {
				let td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(' '));
				td.appendChild(createImage(urlEnchantImg, texte));
			}
		}

		let dataV2 = MZ_EtatCdMs.listeCDM[getMonstreID(i)];
		MZ_EtatCdMs.tr_monstres[i].style.display =
			noGowapsS &&
				nom.indexOf('gowap sauvage') != -1 &&
				getMonstreDistance(i) > 1 ||
				noGowapsA &&
				nom.indexOf('gowap apprivoisé') != -1 &&
				getMonstreDistance(i) > 1 ||
				noEngages &&
				getMonstreDistance(i) != 0 &&
				listeEngages[pos[0]] &&
				listeEngages[pos[0]][pos[1]] &&
				listeEngages[pos[0]][pos[1]][pos[2]] ||
				strMonstre != '' &&
				nom.indexOf(strMonstre) == -1 ||
				isMonstreLevelOutLimit(i, nivMin, nivMax) &&
				getMonstreDistance(i) > 1 &&
				nom.toLowerCase().indexOf("kilamo") == -1 ||
				famille != '0' &&
				dataV2 &&
				dataV2.fam &&
				dataV2.fam != famille ?
				'none' : '';
	}

	if (MY_getValue('NOINFOEM') != 'true') {
		if (noEM != oldNOEM) {
			if (noEM && MZ_EtatCdMs.isCDMsRetrieved) {
				computeMission();
			}
		}
		oldNOEM = noEM;
	}

	needComputeEnchantement = false;
}

/** x~x Fonctions Trõlls ----------------------------------------------- */

function filtreTrolls() {
	let noIntangibles = saveCheckBox(checkBoxIntangibles, 'NOINT');
	let strTroll = document.getElementById('strTrolls').value.toLowerCase();
	let strGuilde = document.getElementById('strGuildes').value.toLowerCase();
	for (let i = 1; i <= nbTrolls; i++) {
		tr_trolls[i].style.display =
			noIntangibles &&
				getTrollNomNode(i).firstChild.className == 'mh_trolls_0' ||
				strTroll != '' &&
				getTrollNomNode(i).textContent.toLowerCase().indexOf(strTroll) == -1 ||
				strGuilde != '' &&
				getTrollGuilde(i).toLowerCase().indexOf(strGuilde) == -1 ?
				'none' : '';
	}
}

/* [functions] Bulle PX Trolls */

function initPXTroll() {
	let bulle = document.createElement('div');
	bulle.id = 'bulleTrollPX';
	let ui_classes = isDesktopView() ? 'mh_textbox mh_tdtitre' : 'ui-body-c ui-corner-all';
	bulle.className = `${ui_classes}`;
	bulle.style =
		'position: absolute;' +
		'visibility: hidden;' +
		'display: inline;' +
		'z-index: 2;';
	document.body.appendChild(bulle);

	for (let i = nbTrolls; i > 0; i--) {
		let td_niv = getTrollNivNode(i);
		td_niv.onmouseover = showPXTroll;
		td_niv.onmouseout = hidePXTroll;
	}
}

function showPXTroll(evt) {
	let lvl = this.firstChild.nodeValue;
	let lvInt = isLetter(lvl[0]) ? lvl.substring(1) : lvl;
	let bulle = document.getElementById('bulleTrollPX');
	bulle.innerHTML = `Niveau ${lvInt}${analysePXTroll(lvInt)}`;
	bulle.style.left = `${evt.pageX + 15}px`;
	bulle.style.top = `${evt.pageY}px`;
	bulle.style.visibility = 'visible';
}

function hidePXTroll() {
	let bulle = document.getElementById('bulleTrollPX');
	bulle.style.visibility = 'hidden';
}

/* [functions] Envoi PX / MP */
function putBoutonPXMP() {
	// Bouton d'initialisation du mode Envoi
	// WARNING - Nécessite que le Filtre Trõll ait été mis en place
	let td = document.getElementById('tdInsertTrolls');
	if (!td) {
		return;
	}
	td.width = 100;
	td = insertAfterTd(td);
	td.style.verticalAlign = 'top';
	let bouton = appendButton(td, 'Envoyer...', prepareEnvoi);
	bouton.id = 'btnEnvoi';
}

function prepareEnvoi() {
	// = 1er Handler du bouton d'envoi

	/* Ajout de la colonne des CheckBoxes */
	let td = insertTdText(getTrollNomNode(0), '');
	td.width = 5;
	for (let i = nbTrolls; i > 0; i--) {
		td = insertTd(getTrollNomNode(i));
		appendCheckBox(td, `envoi${i}`);
	}

	/* Ajout du radio de choix PX ou MP */
	let btnEnvoi = document.getElementById('btnEnvoi');
	if (!btnEnvoi) {
		return;
	}
	let tdEnvoi = btnEnvoi.parentNode;
	appendText(tdEnvoi, ' ');
	let label = document.createElement('label');
	label.style.whiteSpace = 'nowrap';
	let radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.id = 'radioPX';
	label.appendChild(radioElt);
	appendText(label, 'des PX ');
	tdEnvoi.appendChild(label);
	label = document.createElement('label');
	radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.checked = true;
	label.appendChild(radioElt);
	appendText(label, 'un MP');
	tdEnvoi.appendChild(label);

	/* Insertion du bouton Annuler */
	insertButton(btnEnvoi, 'Annuler', annuleEnvoi);

	/* Modification de l'effet du bouton Envoi */
	document.getElementById('btnEnvoi').onclick = effectueEnvoi;
}

function annuleEnvoi() {
	// = Handler bouton Annuler
	/* Nettoyage du td du bouton Envoi */
	let btnEnvoi = document.getElementById('btnEnvoi');
	let tdEnvoi = btnEnvoi.parentNode;
	while (tdEnvoi.firstChild) {
		tdEnvoi.removeChild(tdEnvoi.firstChild);
	}

	/* Retour à l'effet de base du bouton Envoi */
	btnEnvoi.onclick = prepareEnvoi;
	tdEnvoi.appendChild(btnEnvoi);

	/* Suppression CheckBoxes */
	for (let i = nbTrolls; i >= 0; i--) {
		let td = getTrollNomNode(i);
		td.parentNode.removeChild(td);
	}
}

function effectueEnvoi() {
	// = 2e Handler du bouton d'envoi (charge un nouveau frame)
	let str = '';
	let errID = false;
	for (let i = nbTrolls; i > 0; i--) {
		let chb = document.getElementById(`envoi${i}`);
		if (chb.checked) {
			let idTroll = getTrollID(i);
			if (idTroll == undefined) {
				errID = true;
			} else {
				str = str + ((str ? ',' : '') + idTroll);
			}
		}
	}
	if (errID) {
		avertissement('MZ : il y a eu une erreur dans la liste, vérifiez à qui vous faites l\'envoi');
	}
	let PXchecked = document.getElementById('radioPX').checked;
	if (PXchecked) {
		window.open(`./Play_a_Action.php?type=A&id=9&dest=${str}`, 'Contenu');
	} else {
		window.open(`../Messagerie/MH_Messagerie.php?cat=3&dest=${str}`, 'Contenu');
	}
}

/** x~x Fonctions Trésors ---------------------------------------------- */

function filtreTresors() {
	// += Handler checkboxes : gg, compos, bidouilles, non libres
	let noGG = saveCheckBox(checkBoxGG, 'NOGG');
	let noCompos = saveCheckBox(checkBoxCompos, 'NOCOMP');
	let noBidouilles = saveCheckBox(checkBoxBidouilles, 'NOBID');
	let noEngages = saveCheckBox(checkBoxTresorsNonLibres, 'NOTRESORSNONLIBRES');
	if (noEngages && !isEngagesComputed) {
		for (let i = nbTrolls; i > 0; i--) {
			let pos = getTrollPosition(i);
			if (!listeEngages[pos[2]]) {
				listeEngages[pos[2]] = [];
			}
			if (!listeEngages[pos[2]][pos[1]]) {
				listeEngages[pos[2]][pos[1]] = [];
			}
			listeEngages[pos[2]][pos[1]][pos[0]] = 1;
		}
		isEngagesComputed = true;
	}
	let strTresor = document.getElementById('strTresors').value.toLowerCase();
	for (let i = nbTresors; i > 0; i--) {
		let nom = getTresorNom(i);
		let pos = getTresorPosition(i);
		tr_tresors[i].style.display =
			noGG &&
				nom.indexOf('Gigots de Gob') != -1 ||
				noCompos &&
				nom.indexOf('Composant') != -1 ||
				noEngages &&
				listeEngages[pos[2]] &&
				listeEngages[pos[2]][pos[1]] &&
				listeEngages[pos[2]][pos[1]][pos[0]] &&
				getTresorDistance(i) > 0 ||
				strTresor != '' &&
				nom.toLowerCase().indexOf(strTresor) == -1 ||
				noBidouilles &&
				nom.indexOf('Bidouille') != -1 ?
				'none' : '';
	}
}

/** x~x Fonctions Lieux ------------------------------------------------ */

function filtreLieux() {
	// += Handler checkbox trous
	let noTrou = saveCheckBox(checkBoxTrou, 'NOTROU');
	let strLieu = document.getElementById('strLieux').value.toLowerCase();
	for (let i = nbLieux; i > 0; i--) {
		tr_lieux[i].style.display =
			strLieu &&
				getLieuNom(i).toLowerCase().indexOf(strLieu) == -1 ||
				noTrou &&
				getLieuNom(i).toLowerCase().indexOf("trou de météorite") != -1 &&
				getLieuDistance(i) > 1 ? 'none' : '';
	}
}

/** x~x Diplomatie ----------------------------------------------------- */

function refreshDiplo() {
	MY_setValue(`${numTroll}.diplo.off`,
		checkBoxDiplo.checked ? 'true' : 'false'
	);
	if (isDiploRaw) {
		computeDiplo();
	}
	appliqueDiplo();
}

function computeDiplo() {
	// On extrait les données de couleur et on les stocke par id
	// Ordre de préséance :
	//  source Guilde < source Perso
	//  guilde cible < troll cible

	/* Diplo de Guilde */
	diploGuilde = MY_getValue(`${numTroll}.diplo.guilde`) ? JSON.parse(MY_getValue(`${numTroll}.diplo.guilde`)) : {};
	if (diploGuilde && diploGuilde.isOn == 'true') {
		// Guilde perso
		if (diploGuilde.guilde) {
			Diplo.Guilde[diploGuilde.guilde.id] = {
				couleur: diploGuilde.guilde.couleur,
				titre: 'Ma Guilde'
			};
		}
		// Guildes/Trolls A/E
		for (let AE in { Amis: 0, Ennemis: 0 }) {
			for (let i = 0; i < 5; i++) {
				if (!diploGuilde[AE + i]) {
					continue;
				}
				for (let type in { Guilde: 0, Troll: 0 }) {
					let liste = diploGuilde[AE + i][type].split(';');
					for (let j = liste.length - 2; j >= 0; j--) {
						Diplo[type][liste[j]] = {
							couleur: diploGuilde[AE + i].couleur,
							titre: diploGuilde[AE + i].titre
						};
					}
				}
			}
		}
	}

	/* Diplo Perso */
	// let diploPerso = MY_getValue(numTroll+'.diplo.perso') ? JSON.parse(MY_getValue(numTroll+'.diplo.perso')) : {};	// déjà chargé
	if (diploPerso && diploPerso.isOn == 'true') {
		for (let type in { Guilde: 0, Troll: 0, Monstre: 0 }) {
			for (let id in diploPerso[type]) {
				Diplo[type][id] = diploPerso[type][id];
			}
		}
	}
	if (diploPerso.mythiques) {
		Diplo.mythiques = diploPerso.mythiques;
	}

	isDiploRaw = false;
}

function appliqueDiplo() {
	let aAppliquer = Diplo;
	if (checkBoxDiplo.checked) {
		// Pour retour à l'affichage basique sur désactivation de la diplo
		aAppliquer = {
			Guilde: {},
			Troll: {},
			Monstre: {}
		};
	}

	/* On applique "aAppliquer" */
	// Diplo Trõlls
	for (let i = nbTrolls; i > 0; i--) {
		let idG = getTrollGuildeID(i);
		let idT = getTrollID(i);
		let tr = tr_trolls[i];
		// logMZ('diplo i=' + i + ', troll=' + idT + ', guilde=' + idG + ', HTML=' + tr.innerHTML);
		if (aAppliquer.Troll[idT]) {
			tr.classList.remove('mh_tdpage');
			let descr = aAppliquer.Troll[idT].titre;
			if (descr) {
				getTrollNomNode(i).title = descr;
			}
			tr.style.backgroundColor = aAppliquer.Troll[idT].couleur;
		} else if (aAppliquer.Guilde[idG]) {
			tr.classList.remove('mh_tdpage');
			let descr = aAppliquer.Guilde[idG].titre;
			if (descr) {
				getTrollNomNode(i).title = descr;
			}
			tr.style.backgroundColor = aAppliquer.Guilde[idG].couleur;
		} else {
			tr.classList.add('mh_tdpage');	// ne fait rien si déjà là
			getTrollNomNode(i).removeAttribute('title');
		}
	}

	// Diplo Monstres
	for (let i = MZ_EtatCdMs.nbMonstres; i > 0; i--) {
		let id = getMonstreID(i);
		let nom = getMonstreNom(i).toLowerCase();
		let tr = MZ_EtatCdMs.tr_monstres[i];
		if (aAppliquer.Monstre[id]) {
			tr.className = '';
			tr.style.backgroundColor = aAppliquer.Monstre[id].couleur;
			tr.diploActive = 'oui';
			let descr = aAppliquer.Monstre[id].titre;
			if (descr) {
				getMonstreNomNode(i).title = descr;
			}
		} else if (aAppliquer.mythiques &&
			(nom.indexOf('liche') == 0 ||
				nom.indexOf('hydre') == 0 ||
				nom.indexOf('balrog') == 0 ||
				nom.indexOf('beholder') == 0 ||
				nom.indexOf('sidoine') == 0)) {
			tr.className = '';
			tr.style.backgroundColor = aAppliquer.mythiques;
			tr.diploActive = 'oui';
			getMonstreNomNode(i).title = 'Monstre Mythique';
		} else {
			tr.className = 'mh_tdpage';
			tr.diploActive = '';
		}
	}
}

/** x~x Actions à distance --------------------------------------------- */

function computeActionDistante(dmin, dmax, keltypes, oussa, urlIcon, message) {
	let monN = parseInt(getPosition()[2]),
		isLdP = oussa == 'self';

	for (let type in keltypes) {
		debugMZ(`computeActionDistante(${dmin}, ${dmax}, ${oussa}, ${urlIcon}, ${message}) type=${type}`);
		let alt = oussa == 'self' ? type.slice(0, -1) : oussa;
		for (let i = VueContext[`nb${type}`]; i > 0; i--) {
			let tr = VueContext[`tr_${type.toLowerCase()}`][i];
			// Roule 11/03/2016, on passe par les nouvelles fonctions getXxxPosition et getXxxDistance
			// let sonN = this['get'+type.slice(0,-1)+'Position'](i)[2];
			// let d = this['get'+type.slice(0,-1)+'Distance'](i);
			let sonN = getXxxPosition(type, i)[2];
			let d = getXxxDistance(type, i);
			let thismessage = message;
			if (isLdP) {
				let chanceToucher = getTalent("Lancer de Potions") + Math.min(10,
					10 - 10 * d +
					parseInt(MY_getValue(`${numTroll}.caracs.vue`)) +
					parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`))
				);
				thismessage = `${thismessage} (${chanceToucher}%)`;
			}

			if (sonN == monN && d >= dmin && d <= dmax) {
				let iconeAction = document.evaluate(
					`./descendant::img[@alt='${alt}']`, tr, null, 9, null
				).singleNodeValue;
				if (iconeAction) {
					if (iconeAction.title) {
						iconeAction.title = `${iconeAction.title}\n${thismessage}`;
					} else {
						iconeAction.title = thismessage;
					}
					iconeAction.src = urlIcon;
				} else {
					let tdAction = tr.getElementsByTagName('td')[1];
					let icon = document.createElement('img');
					icon.src = urlIcon;
					icon.height = 20;
					icon.alt = alt;
					icon.title = thismessage;
					tdAction.appendChild(icon);
				}
			}
		}
	}
}

function computeCharge() {
	computeActionDistante(1,
		getPortee(
			Math.ceil(MY_getValue(`${numTroll}.caracs.pv`) / 10) +
			MY_getValue(`${numTroll}.caracs.regeneration`)
		),
		{ Monstres: 1, Trolls: 1 },
		'Attaquer',
		`${MHicons}E_Metal09.png`,
		'Cible à portée de Charge'
	);
}

function computeProjo() {
	computeActionDistante(0,
		getPortee(
			parseInt(MY_getValue(`${numTroll}.caracs.vue`)) +
			parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`))
		),
		{ Monstres: 1, Trolls: 1 },
		'Attaquer',
		`${MHicons}S_Fire05.png`,
		'Cible à portée de Projo'
	);
}

function computeTelek() {
	computeActionDistante(0,
		Math.floor((
			parseInt(MY_getValue(`${numTroll}.caracs.vue`)) +
			parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`))
		) / 2),
		{ Tresors: 1 },
		'Telek',
		`${MHicons}S_Magic04.png`,
		'Trésor à portée de Télékinésie'
	);
}

function computeLdP() {
	computeActionDistante(0,
		2 + Math.floor((
			parseInt(MY_getValue(`${numTroll}.caracs.vue`)) +
			parseInt(MY_getValue(`${numTroll}.caracs.vue.bm`))
		) / 5),
		{ Monstres: 1, Trolls: 1 },
		'self',
		`${MHicons}P_Red01.png`,
		'Cible à portée de Lancer de Potions'
	);
}

/** x~x Systèmes Tactiques --------------------------------------------- */

function putScriptExterne() {
	for (let iBricol = 1; ; iBricol++) {
		let extClef = iBricol == 1 ? '' : iBricol;
		let sInfo = MY_getValue(`${numTroll}.INFOSIT${extClef}`);
		if (!sInfo) {
			break;
		}
		putScriptExterneOneIT(sInfo);
	}
}

function putScriptExterneOneIT(sInfo) {
	if (!sInfo || sInfo == '' || !tr_trolls) {
		return;
	}

	let nomit = sInfo.slice(0, sInfo.indexOf('$'));
	if (nomit == 'bricol') {
		let data = sInfo.split('$');
		try {
			// Roule' 07/11/2016. Travail avec Ratibus, remplacement du script par l'envoi de JSON
			// appendNewScript(URL_bricol+data[1]
			// +'/mz.php?login='+data[2]
			// +'&password='+data[3]
			// );
			FF_XMLHttpRequest({
				method: 'GET',
				url: `${URL_bricol + data[1]}/mz_json.php?login=${encodeURIComponent(data[2])}&password=${data[3]}`,
				trace: 'bricolTroll',
				onload: function (responseDetails) {
					try {
						if (responseDetails.status == 0) {
							logMZ('status=0 à l\'appel bricol\'troll');
							if (isHTTPS) {
								avertissement('<br />Pour utiliser l\'interface Bricol\'Troll en HTTPS, il faut accepter le certificat2 de Raistlin (voir page d\'accueil)');
							} else {
								avertissement('<br />Erreur générale avec l\'interface Bricol\'Troll<');
							}
							return;
						}
						let ratibusData;
						try {
							ratibusData = JSON.parse(responseDetails.responseText);
						} catch (e) { }
						if (ratibusData === undefined) {
							avertissement(`<br />Erreur à l'appel de l'interface Bricol'Troll. Code HTTP=${responseDetails.status}. Pas de JSON`);
							return;
						}
						if (ratibusData.error) {
							avertissement(`<br />Bricol'Troll (${data[1]}) a répondu :<br />${ratibusData.error}`);
						} else {
							putInfosTrolls(ratibusData.data.trolls, data[1]);
						}
					} catch (exc) {
						logMZ('retour bricol\'troll', exc);
						avertissement(`<br />Erreur dans la réponse de Bricol'Troll<br />${exc}<br />${responseDetails.responseText}`);
					}
				}
			});
		} catch (exc) {
			if (isHTTPS) {
				avertissement('<br />Pour utiliser l\'interface Bricol\'Troll en HTTPS, il faut autoriser le contenu mixte (voir page d\'accueil)');
			} else {
				logMZ('appel bricol\'troll', exc);
				avertissement(`<br />Erreur générale avec l'interface Bricol'Troll<br />${exc}`);
			}
		}
	}
}

/*
 * Roule 07/11/2016, on utilise mz_json qui envoie
 {
	"data": {
		"trolls": {
			"59424": {
				"id": 59424,
				"pv": xx,
				"pv_max": xx,
				"updated_at": "2016-10-31 07:28:40",
				"dla": "2016-10-05 07:28:04",
				"pa": 0
			},
		}
	}
}
 */

// Roule 07/11/2016 ATTENTION, il faudrait modifier ici (remplacer [0] par .pa, etc.)
function corrigeBricolTrolls(infosTrolls) {
	for (let i in infosTrolls) {
		let pv = infosTrolls[i][0];
		let pvmax = infosTrolls[i][1];
		let pvmem = MY_getValue(`${i}.caracs.pv.max`);
		if (pvmem && pvmem > pvmax) {
			infosTrolls[i][1] = pvmem;
			pvmax = pvmem;
		}
		if (pv > pvmax) {
			let newpvmax = 5 * Math.ceil(pv / 5);
			MY_setValue(`${i}.caracs.pv.max`, newpvmax);
			infosTrolls[i][1] = newpvmax;
		}
	}
}

// insère 2 TD avant nextTD avec les infos venant de l'IT
function addTdInfosTroll(infos, TR, itName) {
	/* cadre barre PV */
	let tab = document.createElement('div');
	tab.title = `${infos.pv}/${infos.pv_max} PV le ${SQLDateToFrenchTime(infos.updated_at)}`;

	/* barre PV */
	/* Roule' : sans aucune honte, j'ai copié la méthode de Bricol'Troll
	<div class="vieContainer"><div style="background-color: #77EE77; width: 90%">&nbsp;</div></div>
	.vieContainer {
	background-color: #CCC;
	width: 50px;
	height: 6px;
	border: 1px solid #000;
	text-align: left;
	}
	*/
	tab.style.width = '100px';
	tab.style.height = '10px';
	tab.style.border = '1px solid #000';
	tab.style.textAlign = 'left';
	let div2 = document.createElement('div');
	let pourcentVie = Math.floor(100 * infos.pv / infos.pv_max);
	let dateLimite = new Date();
	dateLimite.setDate(dateLimite.getDate() - 7);
	if (infos.oUpdatedAt < dateLimite) {
		div2.style.backgroundColor = '#888888';	// infos de plus de 7 jours => grisé
		tab.title = `${tab.title}\nLes informations sont trop vieilles pour être fiables`;
	} else if (pourcentVie > 66) {
		div2.style.backgroundColor = '#77EE77';
	} else if (pourcentVie > 33) {
		div2.style.backgroundColor = '#EEEE77';
	} else {
		div2.style.backgroundColor = '#FF0000';
	}
	div2.style.width = `${pourcentVie}%`;
	div2.style.height = '10px';
	tab.appendChild(div2);

	if (MZ_cache_col_TrollNOM === undefined) {
		MZ_cache_col_TrollNOM = MZ_find_col_titre(tr_trolls, 'nom');
	}
	let tdNom = TR.childNodes[MZ_cache_col_TrollNOM];
	if (infos.camoufle || infos.invisible) {
		let title = infos.camoufle ? "Camouflé" : "Invisible";
		tdNom.appendChild(createImage('/mountyhall/Images/hidden.png', title, 'padding-left:2px'));
	}

	/* lien vers l'IT */
	let lien = document.createElement('a');
	// let nomit = MY_getValue(numTroll+'.INFOSIT').split('$')[1];
	lien.href = `${URL_bricol + itName}/index.php`;
	lien.target = '_blank';
	lien.appendChild(tab);
	if (MZ_cache_col_TrollGUILDE === undefined) {
		MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
	}
	// logMZ('[MZd] MZ_cache_col_TrollGUILDE=' + MZ_cache_col_TrollGUILDE);
	// let tdGuilde = TR.childNodes[MZ_cache_col_TrollGUILDE];
	// insertTdElement(tdGuilde,lien);
	TR.childNodes[MZ_cache_col_TrollGUILDE].appendChild(lien);

	/* PAs dispos */
	let span = document.createElement('span');
	span.title = `DLA : ${SQLDateToFrenchTime(infos.dla)}`;
	appendText(span, `${infos.pa} PA`);
	// logMZ('dla=' + infos.dla + ', SQLDateToObject(infos.dla)=' + SQLDateToObject(infos.dla) + ', now=' + Date.now());
	if (infos.pa > 0 || SQLDateToObject(infos.dla) < Date.now()) {
		// surligner en verdâtre pour exprimer que ce Trõll peut jouer maintenant
		span.style.backgroundColor = 'B8EEB8';
	}
	// insertTdElement(tdGuilde, span);
	TR.childNodes[MZ_cache_col_TrollGUILDE + 1].appendChild(span);
}

function createTrollRowFromRef(infos, ref_tr) {
	let tr = ref_tr.cloneNode(true);
	tr.style.color = 'cc7000';
	// [dist, [act,] ref, name, pv, pa, guild, niv, [race,] x, y , z]
	let desktopView = isDesktopView();
	let idx = 0; // distance
	tr.cells[idx].innerHTML = ref_tr.cells[idx].innerHTML.replace('r_dist', infos.dist);
	if (desktopView) {
		idx++; // action
		tr.cells[idx].innerHTML = ref_tr.cells[idx].innerHTML.replace('r_ref', infos.id);
		tr.cells[idx].innerHTML = ref_tr.cells[idx].innerHTML.replace('r_ref', infos.id);
	}
	idx++; // ref
	tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_ref', infos.id);
	idx++; // name
	tr.cells[idx].innerHTML = ref_tr.cells[idx].innerHTML.replace('r_ref', infos.id).replace('r_name', infos.nom);
	idx += 3; // guild (skip: pv, pa)
	tr.cells[idx].innerHTML = ref_tr.cells[idx].innerHTML.replace('r_guild', infos.guilde ? infos.guilde : '');
	if (desktopView) {
		idx++;	// niv
		tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_niv', infos.niveau ? infos.niveau : '');
		idx++;	// race
		tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_race', infos.race ? infos.race : '');
	} else {
		idx++;	// Race + Niveau
		let lettreRace = { "Kastar": "K", "Durakuir": "D", "Skrim": "S", "Tomawak": "T", "Darkling": "G", " Nkrwapu": "N" };
		let race_niv = infos.race ? `${lettreRace[infos.race]}` : '';
		race_niv = infos.niveau ? `${race_niv}${infos.niveau}` : race_niv;
		tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_niv', race_niv);
	}
	idx++; // x
	tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_x', infos.x);
	idx++; // y
	tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_y', infos.y);
	idx++; // n
	tr.cells[idx].innerText = ref_tr.cells[idx].innerText.replace('r_n', infos.n);
	return tr;
}

function createTrollRow(infos, tr) {
	if (tr) {
		return createTrollRowFromRef(infos, tr);
	}

	// créer le tr si pas de ref disponible
	tr = document.createElement('tr');
	tr.className = 'mh_tdpage';
	tr.style.color = 'cc7000';
	let desktopView = isDesktopView();
	let td = appendTd(tr);	// distance
	appendText(td, infos.dist);
	if (desktopView) {
		td = appendTd(tr); // actions
	}
	td = appendTd(tr);	// ID
	appendText(td, infos.id);
	td = appendTd(tr);	// Nom
	// <A HREF="javascript:EPV(1649)" CLASS='mh_trolls_1'>Krounch</A>
	appendA(td, `javascript:EPV(${infos.id})`, 'mh_trolls_1 ui-link', infos.nom);
	td = appendTd(tr);	// PV
	td = appendTd(tr);	// PA
	td = appendTd(tr);	// Guilde
	if (infos.guilde !== undefined) {
		appendText(td, infos.guilde);
	}
	if (desktopView) {
		td = appendTd(tr);	// Niveau
		if (infos.niveau !== undefined) {
			appendText(td, infos.niveau);
		}
		td.align = 'center';
		td = appendTd(tr);	// Race
		if (infos.race) {
			appendText(td, infos.race);
		}
	} else {
		td = appendTd(tr);	// Race + Niveau
		let lettreRace = { "Kastar": "K", "Durakuir": "D", "Skrim": "S", "Tomawak": "T", "Darkling": "G", " Nkrwapu": "N" };
		let race_niv = infos.race ? `${lettreRace[infos.race]}` : '';
		race_niv = infos.niveau ? `${race_niv}${infos.niveau}` : race_niv;
		appendText(td, race_niv);
	}
	td = appendTd(tr);	// X
	if (infos.x !== undefined) {
		appendText(td, infos.x);
	}
	td = appendTd(tr);	// Y
	if (infos.y !== undefined) {
		appendText(td, infos.y);
	}
	td = appendTd(tr);	// N
	if (infos.n !== undefined) {
		appendText(td, infos.n);
	}
	return tr;
}

var MZ_tabTrTrollById;
function putInfosTrolls(infosTrolls, itName) {
	try {
		let ref_tr = undefined;
		let ref_anchors = ['r_dist', 'r_ref', 'r_name', 'r_pv', 'r_pa', 'r_guild', 'r_niv', 'r_x', 'r_y', 'r_n'];
		isDesktopView() ? ref_anchors.splice(1, 0, 'r_act') : '';
		isDesktopView() ? ref_anchors.splice(8, 0, 'r_race') : '';
		if (MZ_tabTrTrollById === undefined) {
			MZ_tabTrTrollById = new Array();
			// ajout des 2 colonnes dans la table HTML des Trõlls + construire le tableau MZ_tabTrTrollById
			if (MZ_cache_col_TrollGUILDE === undefined) {
				MZ_cache_col_TrollGUILDE = MZ_find_col_titre(tr_trolls, 'guild');
			}
			let td = insertThText(tr_trolls[0].childNodes[MZ_cache_col_TrollGUILDE], 'PA', false);
			td.className = "footable-visible";
			td.width = 40;
			td = insertThText(tr_trolls[0].childNodes[MZ_cache_col_TrollGUILDE], 'PV', false);
			td.className = "footable-visible";
			td.width = 105;
			for (let i = nbTrolls; i > 0; i--) {
				let td = insertTd(tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE]);
				td.className = "footable-visible";
				td = insertTd(tr_trolls[i].childNodes[MZ_cache_col_TrollGUILDE]);
				td.className = "footable-visible";
				MZ_tabTrTrollById[getTrollID(i)] = tr_trolls[i];
				if (ref_tr === undefined) {
					// gath: on construit pour afficher les trolls hors-vue
					if (tr_trolls[i].innerText.includes('[PNJ]')) {
						continue;
					}
					ref_tr = tr_trolls[i].cloneNode(true);
					for (let j = 0, col; col = tr_trolls[i].cells[j]; j++) {
						// [dist, [act,] ref, name, pv, pa, guild, niv, [race,] x, y , z]
						let r_a = ref_anchors[j];
						if (r_a == 'r_pa' || r_a == 'r_pv') {
							continue;
						} else if (r_a == 'r_act') {
							let s_id = isDesktopView() ? tr_trolls[i].cells[2].innerText : tr_trolls[i].cells[1].innerText;
							ref_tr.cells[j].innerHTML = ref_tr.cells[j].innerHTML.replace(s_id, 'r_ref').replace(s_id, 'r_ref');
						} else if (r_a == 'r_dist' || r_a == 'r_name' || r_a == 'r_guild') {
							Array.from(ref_tr.cells[j].getElementsByTagName('img')).forEach((img) => {
								img.remove(); // supprime les mentions Troll à Ghé/Pogé/Prieur de ...
							});
							let s_id = isDesktopView() ? tr_trolls[i].cells[2].innerText : tr_trolls[i].cells[1].innerText;
							let s_name = tr_trolls[i].cells[j].innerText.trim();
							r_a == 'r_dist' ? ref_tr.cells[j].removeAttribute('id') : '';
							ref_tr.cells[j].innerHTML = ref_tr.cells[j].innerHTML.replace(s_name, r_a).replace(s_id, 'r_ref');
						} else {
							let s_txt = ref_tr.cells[j].innerText;
							ref_tr.cells[j].innerText = (s_txt != '') ? ref_tr.cells[j].innerText.replace(s_txt, r_a) : r_a;
						}
					}
				}
			}
		}

		// Roule 07/11/2016 je ne suis pas trop fana de corriger les données de Bricol'Troll
		// corrigeBricolTrolls(infosTrolls);

		// supression des infos trop vieilles (un mois)
		// conversion de la date de mise à jour en objet date (on en a besoin 2 fois)
		let dateLimite = new Date();
		dateLimite.setMonth(dateLimite.getMonth() - 1);

		// Roule 07/12/2016 ajout des Trolls invi/camou/hors de portée
		let str = MY_getValue(`${numTroll}.INFOSIT`);
		let affhv = false;
		if (str) {
			let arr = str.split('$');
			affhv = arr[4] > 0;
		}

		let tBody = tr_trolls[0].parentNode;
		if (tr_trolls[1] !== undefined) {
			tBody = tr_trolls[1].parentNode;
		}

		// logMZ('nb Troll IT : ' + IDs.length);
		let pos = getPosition();

		// mise à jour des infos dans le HTML (et ajout de ligne si nécessaire)
		for (let idTroll in infosTrolls) {
			let infos = infosTrolls[idTroll];
			infos.oUpdatedAt = SQLDateToObject(infos.updated_at);	// trop vieux
			if (infos.oUpdatedAt < dateLimite) {
				continue; // infos trop vieilles
			}
			if (idTroll == numTroll) {
				continue; // pas nous-même
			}
			let tr;
			if (idTroll in MZ_tabTrTrollById) {
				// logMZ('putInfosTrolls, le Troll ' + idTroll + ' est déjà dans la table HTML');
				tr = MZ_tabTrTrollById[idTroll];
			} else {
				if (!affhv) {
					continue;
				}
				// logMZ('putInfosTrolls, le Troll ' + idTroll + ' doit être ajouté à la table HTML');
				infos.dist = Math.max(Math.abs(pos[0] - infos.x), Math.abs(pos[1] - infos.y), Math.abs(pos[2] - infos.n));
				// trouver où insérer ce Troll
				let next = undefined;
				for (let j = 0; j < tr_trolls.length; j++) {
					let thisDist = parseInt(tr_trolls[j].cells[0].textContent);
					if (thisDist > infos.dist) {
						next = tr_trolls[j];
						break;
					}
				}
				tr = createTrollRow(infos, ref_tr);
				(next !== undefined) ? insertBefore(next, tr) : tBody.appendChild(tr);
				MZ_tabTrTrollById[idTroll] = tr;
			}
			if (!tr.done) {
				addTdInfosTroll(infos, tr, itName);
				tr.done = true;
			}
		}
	} catch (exc) {
		avertissement('Erreur de traitement des informations Bricol\'Troll', null, null, exc);
	}
}

/** x~x Mode Tétalanvert! ------------------------------------------------- */

function calculeDistance(maPos, posArr) {
	return Math.max(
		Math.abs(maPos[0] - posArr[0]),
		Math.abs(maPos[1] - posArr[1]),
		Math.abs(maPos[2] - posArr[2])
	);
}

function inversionCoord() {
	let maPos = getPosition();
	let listeOffsets = {
		monstres: checkBoxLevels.checked ? 4 : 3,
		trolls: 6,
	};
	for (let type in listeOffsets) {
		let trList = VueContext[`tr_${type}`];
		let offset = listeOffsets[type];
		for (let i = trList.length - 1; i > 0; i--) {
			let oldX = parseInt(trList[i].cells[offset].textContent);
			let oldY = parseInt(trList[i].cells[offset + 1].textContent);
			let oldN = parseInt(trList[i].cells[offset + 2].textContent);
			trList[i].cells[offset].innerHTML = oldY;
			trList[i].cells[offset + 1].innerHTML = oldX;
			trList[i].cells[0].innerHTML = calculeDistance(maPos, [oldY, oldX, oldN]);
		}
	}
}


/*                             Partie principale                              */
function do_vue() {
	for (let type in typesAFetcher) {
		fetchData(type);
	}

	// roule' 11/03/2016
	// maintenant, tr_monstres et this['tr_monstres'], ce n'est plus la même chose
	// je fais une recopie :(
	MZ_EtatCdMs.tr_monstres = VueContext.tr_monstres;
	if (MZ_EtatCdMs.tr_monstres && MZ_EtatCdMs.tr_monstres[0]) {
		for (let i = 0; i < MZ_EtatCdMs.tr_monstres[0].cells.length; i++) { // Roule 22/07/2020
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/Dist/i)) {
				MZ_EtatCdMs.indexCellDist = i;
			}
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/Action/i)) {
				MZ_EtatCdMs.indexCellActions = i;
			}
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/r[eéè]f/i)) {
				MZ_EtatCdMs.indexCellID = i;
			}
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^X$/i)) {
				MZ_EtatCdMs.indexCellX = i;
			}
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^Y$/i)) {
				MZ_EtatCdMs.indexCellY = i;
			}
			if (MZ_EtatCdMs.tr_monstres[0].cells[i].innerText.match(/^N$/i)) {
				MZ_EtatCdMs.indexCellN = i;
			}
		}
	}

	tr_trolls = VueContext.tr_trolls;
	tr_tresors = VueContext.tr_tresors;
	tr_champignons = VueContext.tr_champignons;
	tr_lieux = VueContext.tr_lieux;

	MZ_EtatCdMs.nbMonstres = VueContext.nbMonstres;
	nbTrolls = VueContext.nbTrolls;
	nbTresors = VueContext.nbTresors;
	nbChampignons = VueContext.nbChampignons;
	nbLieux = VueContext.nbLieux;

	try {
		start_script(31, 'do_vue_log');

		initialiseInfos();
		savePosition();

		if (MZ_EtatCdMs.indexCellDist < 0 || MZ_EtatCdMs.indexCellID < 0 || MZ_EtatCdMs.indexCellX < 0 || MZ_EtatCdMs.indexCellY < 0 || MZ_EtatCdMs.indexCellN < 0) {
			// c'est le cas en mode smartphone, dans le cas d'une vue qui ne montre pas les monstres
			// avertissement('Impossible de retrouver les colonnes de la vue des monstres, arrêt MZ', 9999999);
			set2DViewSystem();
			return;
		}

		// Fonctionnalité "Têtalenvert" cachée, en test :
		if (MY_getValue(`${numTroll}.VERLAN`) == 'true') {
			inversionCoord();
		}

		ajoutDesFiltres();
		set2DViewSystem();
		// putBoutonTroogle();
		putBoutonPXMP();

		synchroniseFiltres();
		toggleLevelColumn();	// appel des CdM, ne fait rien si la checkbox NOCDM est cochée

		refreshDiplo();

		// 400 ms
		let noGG = saveCheckBox(checkBoxGG, "NOGG");
		let noCompos = saveCheckBox(checkBoxCompos, "NOCOMP");
		let noBidouilles = saveCheckBox(checkBoxBidouilles, "NOBID");
		let noGowapsS = saveCheckBox(checkBoxGowapsS, "NOGOWAPS");
		let noGowapsA = saveCheckBox(checkBoxGowapsA, "NOGOWAPA");
		let noEngages = saveCheckBox(checkBoxEngages, "NOENGAGE");
		let noTresorsEngages = saveCheckBox(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
		let noTrou = saveCheckBox(checkBoxTrou, "NOTROU");
		let noIntangibles = saveCheckBox(checkBoxIntangibles, "NOINT");
		filtreMonstres();
		if (noIntangibles) {
			filtreTrolls();
		}
		if (noGG || noCompos || noBidouilles || noTresorsEngages) {
			filtreTresors();
		}
		if (noTrou) {
			filtreLieux();
		}

		MZ_Tactique.initPopup();
		initPXTroll();

		if (getTalent("Projectile Magique")) {
			computeProjo();
		}
		if (getTalent("Charger")) {
			computeCharge();
		}
		if (getTalent("Télékinésie")) {
			computeTelek();
		}
		if (getTalent("Lancer de Potions")) {
			computeLdP();
		}

		putScriptExterne();

		displayScriptTime(undefined, 'do_vue_log');
	} catch (exc) {
		// gath: on garde le message sympa plutôt qu'ajouter un '- Plus d'infos
		// en console (F12)' sans ame !
		avertissement(`Une erreur est survenue. Seriez-vous sous l'effet d'un Fumeux ?`);
		logMZ('do_vue', exc);
	}
}


/** *****************************************************************************
*  This file is part of Mountyzilla.                                           *
*                                                                              *
*  Mountyzilla is free software; you can redistribute it and/or modify         *
*  it under the terms of the GNU General Public License as published by        *
*  the Free Software Foundation; either version 2 of the License, or           *
*  (at your option) any later version.                                         *
*                                                                              *
*  Mountyzilla is distributed in the hope that it will be useful,              *
*  but WITHOUT ANY WARRANTY; without even the implied warranty of              *
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the               *
*  GNU General Public License for more details.                                *
*                                                                              *
*  You should have received a copy of the GNU General Public License           *
*  along with Mountyzilla; if not, write to the Free Software                  *
*  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA  *
*******************************************************************************/

/** x~x profil2 -------------------------------------------------------- */

/*                           Variables globales                           */

var
	// Anatrolliseur
	urlAnatrolliseur,
	// Infobulles talents
	hauteur = 50, bulleStyle = null,
	// Caracteristiques
	// Infos troll
	race, niv, datecrea,
	idguilde, nomguilde,
	// Etats du troll
	fatigue, bmfatigue,

	// Experience, Pi, ...
	pxdistribuables, pxperso,
	piutilisable, pitotal,
	nbmeurtres, nbmorts,
	// utilisee pour les moyennes MM/jour, kill/jour, etc
	NBjours,
	// calcul des DLA suivantes
	DLA, DLAsuiv, HeureServeur,
	// details duree du tour (calcul pvdispo) :
	dtb, pdm, bmt, adb, dpt, dtbm, dtreserve, bmmouche,
	// posale
	posX, posY, posN,
	// caracs physiques
	vue, vuebp, vuebm, vuetotale,
	pvbase, pvbpm, pvtotal, pvcourant, pvmax,
	reg, regbp, regbm, regmoy,
	att, attbp, attbm, attmoy, atttourD, atttour, attmoytour,
	esq, esqbp, esqbm, esqmoy, esqtourD, esqmoytour,
	deg, degbp, degbm, degmoy, degmoycrit, degtour, degmoytour, degmoycrittour,
	arm, armbp, armbm, armmoy, armtourD, armmoytour,
	rm, rmbp, rmbm, rmtotale,
	mm, mmbp, mmbm, mmtotale,

	// Variables speciales Kastars
	pvActuelKastar, minParPV, overDLA,
	// id pour edition manuelle de lastDLA :
	inJour, inMois, inAn, inHr, inMin, inSec,
	// id pour auto-refresh lastDLA :
	lastDLAZone, maxAMZone, cumulZone,
	lastDLA, DLAaccel;


/* -[functions]                  Fonctions utiles                        */

// Retourne la valeur de l'element unique et identifie par son "selector" (cf querySelector())
// http://www.w3schools.com/jsref/met_document_queryselector.asp
function getUniqueValueBySelector(selector, defaultValue) {
	let valNode = document.querySelector(selector);
	if (valNode != null) {
		if (valNode.hasChildNodes()) {
			return valNode.childNodes[0].nodeValue;
		}
		return defaultValue;
	}
	debugMZ(`Pas d'element trouve correspondant au selecteur : ${selector}`);
	return defaultValue;
}
function getUniqueStringValueBySelector(selector) {
	return getUniqueValueBySelector(selector, "");
}
function getUniqueIntValueBySelector(selector) {
	let ret = getUniqueValueBySelector(selector, 0);
	if (ret == null || (/^\s*$/).test(ret)) { // test si chaine de caracteres composee de " "
		ret = 0;
	}
	return parseInt(ret);
}
function getUniqueFloatValueBySelector(selector) {
	let ret = getUniqueValueBySelector(selector, 0.0);
	if (ret == null || (/^\s*$/).test(ret)) { // test si chaine de caracteres composee de " "
		ret = 0.0;
	}
	return parseFloat(ret);
}


function resiste(Ddeg, bm) {
	// version naive mais compréhensible ^^
	// DEBUG: à revoir
	if (!bm) {
		return 2 * Math.floor(Ddeg / 2);
	}
	return 2 * Math.floor(Ddeg / 2) + Math.round(bm / 2);
}

function retourAZero(fatig) {
	let fat = fatig, raz = 0;
	while (fat > 0) {
		raz++;
		fat = Math.floor(fat / 1.25);
	}
	return raz;
}

function coefDecumul(i) {
	switch (i) {
		case 2: return 0.67;
		case 3: return 0.4;
		case 4: return 0.25;
		case 5: return 0.15;
		default: return 0.1;
	}
}

function dureeHM(dmin) {
	let ret = "";
	dmin = Math.floor(dmin);
	if (dmin > 59) {
		ret = `${Math.floor(dmin / 60)}h`;
	}
	let mins = dmin % 60;
	if (mins != 0) {
		ret = ret + (ret ? `${addZero(mins)}min` : `${mins}min`);
	}
	return ret ? ret : "-";
}

// extraction d'une durée
// l'élément pointé par le sélecteur contient "9 h 33 m" ou "- 2 h 30 m"
// c'est protégé (rend 0 si l'élément est absent)
// Roule' 24/12/2016
function extractionDuree(selecteur) {
	let s = getUniqueStringValueBySelector(selecteur);
	if (!s) {
		return 0;
	}
	let tabN = getNumbers(s);
	if (tabN.length < 1) {
		return 0;
	}
	if (tabN.length == 1) {
		tabN = [tabN[0], 0];
	}	// pas de minutes dans le texte si on a un nombre exact d'heures
	if (s.includes('-')) {
		return -tabN[0] * 60 - tabN[1];
	}
	return tabN[0] * 60 + tabN[1];
}

/* -[functions]        Extraction / Sauvegarde des donnees               */

function extractionDonnees() {
	// Variables temporaires
	let Nbrs = {};

	// *********************
	// Cadre "Description"
	// *********************
	race = getUniqueStringValueBySelector('#descr #race');
	debugMZ(`Race : ${race}`);
	let idtroll = getUniqueStringValueBySelector('#descr #id');
	numTroll = idtroll;
	debugMZ(`Id troll : ${idtroll}`);
	let strDateCrea = getUniqueStringValueBySelector('#descr td#crea>span');
	strDateCrea = strDateCrea.slice(strDateCrea.indexOf("(") + 1, strDateCrea.indexOf(")"));
	datecrea = new Date(StringToDate(strDateCrea));
	debugMZ(`Date creation : ${datecrea}`);
	// Guilde
	idguilde = getUniqueIntValueBySelector('#descr #idguilde');
	nomguilde = getUniqueStringValueBySelector('#descr #nomguilde');
	debugMZ(`Guilde: ${idguilde} ${nomguilde}`);

	// *******************
	// Cadre "Experience"
	// *******************
	// Niveau de troll
	niv = getUniqueIntValueBySelector('#exp #niv');
	nivTroll = niv;
	debugMZ(`Niveau : ${niv}`);
	// PX
	pxdistribuables = getUniqueIntValueBySelector('#exp #px');
	pxperso = getUniqueIntValueBySelector('#exp #px_perso');
	debugMZ(`Px Distrib/Perso: ${pxdistribuables} / ${pxperso}`);
	// PI
	piutilisable = getUniqueIntValueBySelector('#exp #pi');
	pitotal = getUniqueIntValueBySelector('#exp #pitot');
	debugMZ(`PI utilisables/total: ${piutilisable} / ${pitotal}`);
	// Meutres/Morts
	nbmeurtres = getUniqueIntValueBySelector('#exp #kill');
	nbmorts = getUniqueIntValueBySelector('#exp #mort');
	debugMZ(`Nb Meutres/Morts: ${nbmeurtres} / ${nbmorts}`);

	// *********************
	// Cadre "Tour de Jeu"
	// *********************
	// DLA
	Nbrs.dla = getUniqueStringValueBySelector('#dla #dla>b');
	DLA = new Date(StringToDate(Nbrs.dla));
	debugMZ(`DLA: ${DLA}`);
	// DLA suivante
	Nbrs.dlasuiv = getUniqueStringValueBySelector('#dla #dla_next');
	DLAsuiv = new Date(StringToDate(Nbrs.dlasuiv));
	debugMZ(`DLAsuiv: ${DLAsuiv}`);
	// Duree normale de mon Tour
	dtb = extractionDuree('#dla #tour');
	debugMZ(`Duree normale de mon Tour : ${dtb}`);
	// Bonus/malus
	dtbm = extractionDuree('#dla #bm');
	debugMZ(`Bonus/Malus équipement sur la duree : ${dtbm}`);
	// Réserve
	dtreserve = extractionDuree('#dla #reserve');
	debugMZ(`Durée de réserve : ${dtreserve}`);
	// Poids de l'equipement
	pdm = extractionDuree('#dla #poids');
	debugMZ(`Poids de l'equipement : ${pdm}`);
	// Bonus/Malus equipement
	bmt = extractionDuree('#dla #bmequipement');	// Roule' 24/12/2016 on a trouvé un Troll qui n'a pas de bmt !
	debugMZ(`Bonus/Malus équipement sur la duree : ${bmt}`);
	// Augmentation due aux blessures
	adb = extractionDuree('#dla #blessure');
	debugMZ(`Augmentation due aux blessures : ${adb}`);
	// Mouches
	bmmouche = extractionDuree('#dla #mouche');
	debugMZ(`Bonus des mouches : ${bmmouche}`);
	// Duree de mon prochain Tour
	dpt = extractionDuree('#dla #duree>b');
	debugMZ(`Duree de mon prochain Tour : ${dpt}`);

	// ****************
	// Cadre "Etats"
	// ****************
	// Position du troll :
	posX = getUniqueIntValueBySelector('#pos #x');
	posY = getUniqueIntValueBySelector('#pos #y');
	posN = getUniqueIntValueBySelector('#pos #n');
	debugMZ(`(X Y Z) : ${posX} ${posY} ${posN}`);
	// PV actuel
	pvcourant = getUniqueIntValueBySelector('#pos #pv_courant');
	pvActuelKastar = pvcourant;
	debugMZ(`PV actuel : ${pvcourant}`);
	// Fatigue
	fatigue = getUniqueIntValueBySelector('#pos #fatigue');
	bmfatigue = getUniqueIntValueBySelector('#pos #fatiguebm');
	debugMZ(`Fatigue : ${fatigue} + ${bmfatigue}`);

	// **************************
	// Cadre "Caracteristiques"
	// **************************
	// Attaque
	att = getUniqueIntValueBySelector('#carac #att');
	attbp = getUniqueIntValueBySelector('#carac #att_p');
	attbm = getUniqueIntValueBySelector('#carac #att_m');
	atttour = getUniqueIntValueBySelector('#carac #att_tour'); // % bonus AdA
	atttourD = getUniqueIntValueBySelector('#carac #att_tour_d'); // malus Parade
	attmoy = 3.5 * att + attbp + attbm;
	let DAttBonus = Math.floor((att + atttourD) * atttour / 100); // À vérifier
	attmoytour = 3.5 * (att + DAttBonus) + attbp + attbm;
	debugMZ(
		`ATT: ${att}+(${attbp})+(${attbm}) ;AttMoy:${attmoy
		}; BM Dé att/tour:(${atttourD}D;${atttour}%) ${atttourD + DAttBonus
		}D ;AttMoyTour:${attmoytour}`
	);
	// Esquive
	esq = getUniqueIntValueBySelector('#carac #esq');
	esqbp = getUniqueIntValueBySelector('#carac #esq_p');
	esqbm = getUniqueIntValueBySelector('#carac #esq_m');
	esqtourD = getUniqueIntValueBySelector('#carac #esq_tour_d');
	esqmoy = 3.5 * esq + esqbp + esqbm;
	esqmoytour = 3.5 * (esq + esqtourD) + esqbp + esqbm;
	debugMZ(`ESQ: ${esq}+(${esqbp})+(${esqbm}) ;EsqMoy:${esqmoy}; esq/tour:${esqtourD} ;EsqMoyTour:${esqmoytour}`);
	// Degat
	deg = getUniqueIntValueBySelector('#carac #deg');
	degbp = getUniqueIntValueBySelector('#carac #deg_p');
	degbm = getUniqueIntValueBySelector('#carac #deg_m');
	degtour = getUniqueIntValueBySelector('#carac #deg_tour'); // % bonus AdD
	degmoy = 2 * deg + degbp + degbm;
	degmoycrit = 2 * (deg + Math.floor(deg / 2)) + degbp + degbm;
	let DDegBonus = Math.floor(deg * degtour / 100);
	degmoytour = 2 * (deg + DDegBonus) + degbp + degbm;
	degmoycrittour = degmoytour + 2 * Math.floor(deg / 2);
	debugMZ(
		`DEG: ${deg}+(${degbp})+(${degbm}) ;DegMoy:${degmoy}/${degmoycrit
		} ;deg/tour:(${degtour}%) ${DDegBonus
		}D; DegMoyTour:${degmoytour}/${degmoycrittour}`
	);
	// PV
	pvbase = getUniqueIntValueBySelector('#carac #pv');
	pvbpm = getUniqueIntValueBySelector('#carac #pv_p_m');
	pvtotal = getUniqueIntValueBySelector('#carac #pv_tot');
	pvmax = getUniqueIntValueBySelector('#pv_max');
	debugMZ(`PV: ${pvbase} + (${pvbpm}) = ${pvtotal}`);
	// Regeneration
	reg = getUniqueIntValueBySelector('#carac #reg');
	regbp = getUniqueIntValueBySelector('#carac #reg_p');
	regbm = getUniqueIntValueBySelector('#carac #reg_m');
	regmoy = 2 * reg + regbp + regbm; // D3
	debugMZ(`REG: ${reg}+(${regbp})+(${regbm}) ;RegMoy:${regmoy}`);
	// Armure
	arm = getUniqueIntValueBySelector('#carac #arm');
	armbp = getUniqueIntValueBySelector('#carac #arm_p');
	armbm = getUniqueIntValueBySelector('#carac #arm_m');
	armtourD = getUniqueIntValueBySelector('#carac #arm_tour_d');
	armmoy = 2 * arm + armbp + armbm;
	armmoytour = 2 * Math.max(arm + armtourD, 0) + armbp + armbm;
	debugMZ(`ARM: ${arm}+(${armbp})+(${armbm}); ArmMoy:${armmoy}; arm/tour:${armtourD}; ArmMoyTour:${armmoytour}`);
	// TODO : D d'armure non active
	// Vue
	vue = getUniqueIntValueBySelector('#carac #vue');
	vuebp = getUniqueIntValueBySelector('#carac #vue_p');
	vuebm = getUniqueIntValueBySelector('#carac #vue_m');
	vuetotale = getUniqueIntValueBySelector('#carac #vue_tot');
	debugMZ(`Vue: ${vue} + (${vuebp}) + (${vuebm}) = ${vuetotale}`);
	// RM
	rm = getUniqueIntValueBySelector('#carac #rm');
	rmbp = getUniqueIntValueBySelector('#carac #rm_p');
	rmbm = getUniqueIntValueBySelector('#carac #rm_m');
	rmtotale = getUniqueIntValueBySelector('#carac #rm_tot');
	rmTroll = rmtotale;
	debugMZ(`RM: ${rm} + (${rmbp}) + (${rmbm}) = ${rmtotale}`);
	// MM
	mm = getUniqueIntValueBySelector('#carac #mm');
	mmbp = getUniqueIntValueBySelector('#carac #mm_p');
	mmbm = getUniqueIntValueBySelector('#carac #mm_m');
	mmtotale = getUniqueIntValueBySelector('#carac #mm_tot');
	mmTroll = mmtotale;
	debugMZ(`MM: ${mm} + (${mmbp}) + (${mmbm}) = ${mmtotale}`);

	// Heure Serveur
	try {
		let heureServeurSTR = document.querySelector("#hserveur").innerHTML;
		heureServeurSTR = heureServeurSTR.slice(heureServeurSTR.indexOf("/") - 2, heureServeurSTR.lastIndexOf(":") + 3);
		HeureServeur = new Date(StringToDate(heureServeurSTR));
	} catch (exc) {
		warnMZ(`Heure Serveur introuvable, utilisation de l'heure actuelle`, exc);
		HeureServeur = new Date();
	}
	debugMZ(`HeureServeur: ${HeureServeur}`);

	// ***INIT GLOBALE*** NBjours
	NBjours = Math.floor((HeureServeur - datecrea) / jour_en_ms) + 1;

	// Calcul debut lien anatroliseur avec les caracteristiques connues
	let amelio_dtb = function (dtbb) {
		if (dtbb > 555) {
			return Math.floor((21 - Math.sqrt(8 * dtbb / 3 - 1479)) / 2);
		}
		return 10 + Math.ceil((555 - dtbb) / 2.5);
	},
		amelio_pv = Math.floor(pvbase / 10) - 3,
		amelio_vue = vue - 3,
		amelio_att = att - 3,
		amelio_esq = esq - 3,
		amelio_deg = deg - 3,
		amelio_reg = reg - 1,
		amelio_arm = arm - 1;
	if (race === "Darkling") {
		amelio_reg--;
	}
	if (race === "Durakuir") {
		amelio_pv--;
	}
	if (race === "Kastar") {
		amelio_deg--;
	}
	if (race === "Skrim") {
		amelio_att--;
	}
	if (race === "Tomawak") {
		amelio_vue--;
	}

	urlAnatrolliseur = `${URL_AnatrolDispas
		}outils_anatrolliseur.php?anatrolliseur=v8` +
		`|r=${race.toLowerCase()
		}|dla=${amelio_dtb(dtb)
		}|pv=${amelio_pv},${pvbpm},0` +
		`|vue=${amelio_vue},${vuebp},${vuebm
		}|att=${amelio_att},${attbp},${attbm
		}|esq=${amelio_esq},${esqbp},${esqbm
		}|deg=${amelio_deg},${degbp},${degbm
		}|reg=${amelio_reg},${regbp},${regbm
		}|arm=${amelio_arm},${armbp},${armbm
		}|mm=${mmtotale
		}|rm=${rmtotale}|`;
}

function saveProfil() {
	logMZ('saveProfil()')
	let l_numTroll = MY_getValue('NUM_TROLL');
	if (l_numTroll === null) {
		logMZ('Troll encore inconnu: pas de sauvegarde de caracs')
		return;
	}
	MY_setValue(`${l_numTroll}.caracs.attaque`, att);
	MY_setValue(`${l_numTroll}.caracs.attaque.bm`, attbp + attbm);
	MY_setValue(`${l_numTroll}.caracs.attaque.bmp`, attbp);
	MY_setValue(`${l_numTroll}.caracs.attaque.bmm`, attbm);
	if (atttourD || atttour) {
		let DAttBonus = atttourD + Math.floor((att + atttourD) * atttour / 100);
		MY_setValue(`${l_numTroll}.bonus.DAttM`, DAttBonus);
	} else {
		MY_removeValue(`${l_numTroll}.bonus.DAttM`);
	}
	MY_setValue(`${l_numTroll}.caracs.esquive`, esq);
	MY_setValue(`${l_numTroll}.caracs.esquive.bm`, esqbp + esqbm);
	MY_setValue(`${l_numTroll}.caracs.esquive.bmp`, esqbp);
	MY_setValue(`${l_numTroll}.caracs.esquive.bmm`, esqbm);
	MY_setValue(`${l_numTroll}.caracs.esquive.nbattaques`, esqtourD);
	MY_setValue(`${l_numTroll}.caracs.degats`, deg);
	MY_setValue(`${l_numTroll}.caracs.degats.bm`, degbp + degbm);
	MY_setValue(`${l_numTroll}.caracs.degats.bmp`, degbp);
	MY_setValue(`${l_numTroll}.caracs.degats.bmm`, degbm);
	if (degtour) {
		let DDegBonus = Math.floor(deg * degtour / 100);
		MY_setValue(`${l_numTroll}.bonus.DDeg`, DDegBonus);
	} else {
		MY_removeValue(`${l_numTroll}.bonus.DDeg`);
	}
	MY_setValue(`${l_numTroll}.caracs.regeneration`, reg);
	MY_setValue(`${l_numTroll}.caracs.regeneration.bm`, regbp + regbm);
	MY_setValue(`${l_numTroll}.caracs.regeneration.bmp`, regbp);
	MY_setValue(`${l_numTroll}.caracs.regeneration.bmm`, regbm);
	MY_setValue(`${l_numTroll}.caracs.vue`, vue);
	MY_setValue(`${l_numTroll}.caracs.vue.bm`, vuebp + vuebm);
	MY_setValue(`${l_numTroll}.caracs.vue.bmp`, vuebp);
	MY_setValue(`${l_numTroll}.caracs.vue.bmm`, vuebm);
	MY_setValue(`${l_numTroll}.caracs.pv`, pvcourant);
	MY_setValue(`${l_numTroll}.caracs.pv.base`, pvbase);
	MY_setValue(`${l_numTroll}.caracs.pv.max`, pvtotal);
	MY_setValue(`${l_numTroll}.caracs.rm`, rm);
	MY_setValue(`${l_numTroll}.caracs.rm.bm`, rmtotale);
	MY_setValue(`${l_numTroll}.caracs.rm.bmp`, rmbp);
	MY_setValue(`${l_numTroll}.caracs.rm.bmm`, rmbm);
	MY_setValue(`${l_numTroll}.caracs.mm`, mm);
	MY_setValue(`${l_numTroll}.caracs.mm.bm`, mmtotale);
	MY_setValue(`${l_numTroll}.caracs.mm.bmp`, mmbp);
	MY_setValue(`${l_numTroll}.caracs.mm.bmm`, mmbm);
	MY_setValue(`${l_numTroll}.caracs.armure`, arm);
	MY_setValue(`${l_numTroll}.caracs.armure.bm`, armbp + armbm);
	MY_setValue(`${l_numTroll}.caracs.armure.bmp`, armbp);
	MY_setValue(`${l_numTroll}.caracs.armure.bmm`, armbm);
	MY_setValue(`${l_numTroll}.caracs.dureeProchainTour`, dpt);
	MY_setValue(`${l_numTroll}.position.X`, posX);
	MY_setValue(`${l_numTroll}.position.Y`, posY);
	MY_setValue(`${l_numTroll}.position.N`, posN);
	MY_setValue(`${l_numTroll}.race`, race);
	MY_setValue(`${l_numTroll}.niveau`, niv);
	MY_setValue(`${l_numTroll}.idguilde`, idguilde);
	MY_setValue(`${l_numTroll}.nomguilde`, nomguilde);
}

/* -[functions]            Fonctions modifiant la page                   */

function setInfosCaracteristiques() {
	// Modification de l'entete
	let thTotal = document.querySelector("table#caracs>thead>tr>th:nth-child(6)");
	thTotal.innerHTML = `${thTotal.innerHTML}|<i>Moyenne</i>`;
	thTotal.title = "Moyenne (Moyenne ce tour)";

	// Ajout des informations calculees
	let tdAttTotal = document.querySelector("table#caracs td#att").parentElement.children[5];
	tdAttTotal.innerHTML = `<i>${attmoy}</i>`;
	if (attmoy != attmoytour) {
		tdAttTotal.innerHTML = `${tdAttTotal.innerHTML} (${attmoytour})`;
	}

	let tdEsqTotal = document.querySelector("table#caracs td#esq").parentElement.children[5];
	tdEsqTotal.innerHTML = `<i>${esqmoy}</i>`;
	if (esqmoy != esqmoytour) {
		tdEsqTotal.innerHTML = `${tdEsqTotal.innerHTML} (${esqmoytour})`;
	}

	let tdDegTotal = document.querySelector("table#caracs td#deg").parentElement.children[5];
	tdDegTotal.innerHTML = `<i>${degmoy}/${degmoycrit}</i>`;
	if (degmoy != degmoytour) {
		tdDegTotal.innerHTML = `${tdDegTotal.innerHTML} (${degmoytour}/${degmoycrittour})`;
	}

	let trRegeneration = document.querySelector("table#caracs td#reg").parentElement;
	let tdRegTotal = trRegeneration.children[5];
	tdRegTotal.innerHTML = `<i>${regmoy}</i>`;
	// Temps recupere par reg (propale R')
	let regmoyTemp = Math.max(0, regmoy);
	let regTitle = `Temps moyen récupéré par régénération: ${Math.floor(250 * regmoyTemp / pvtotal)} min`;
	let sec = Math.floor(15000 * regmoyTemp / pvtotal) % 60;
	if (sec != 0) {
		regTitle = `${regTitle} ${sec} sec`;
	}
	trRegeneration.title = regTitle;

	let tdArmTotal = document.querySelector("table#caracs td#arm").parentElement.children[5];
	tdArmTotal.innerHTML = `<i>${armmoy}</i>`;
	if (armmoy != armmoytour) {
		tdArmTotal.innerHTML = `${tdArmTotal.innerHTML} (${armmoytour})`;
	}

	let trRM = document.querySelector("table#caracs #rm").parentElement;
	trRM.title = `${Math.round(10 * rm / NBjours) / 10} (${Math.round(10 * rmTroll / NBjours) / 10}) points de RM par jour | ${Math.round(10 * rm / niv) / 10} (${Math.round(10 * rmtotale / niv) / 10}) points de RM par niveau`;


	let trMM = document.querySelector("table#caracs #mm").parentElement;
	trMM.title = `${Math.round(10 * mm / NBjours) / 10} (${Math.round(10 * mmTroll / NBjours) / 10}) points de MM  par jour | ${Math.round(10 * mm / niv) / 10} (${Math.round(10 * mmtotale / niv) / 10}) points de MM par niveau`;

	let tdRefl = document.querySelector("#refl");
	// TODO : prendre en compte bonus/malus D esq du tour ?
	let refMoy = Math.floor(2 * (reg + esq) / 3) * 3.5 + esqbp + esqbm;
	tdRefl.innerHTML = `${tdRefl.innerHTML} <i>(moyenne : ${refMoy})</i>`;
}

function setLienAnatrolliseur() {
	let pTableAmelio = document.querySelector("#carac>div>p");
	if (!pTableAmelio) {
		pTableAmelio = document.querySelector("#carac>div>div>p");
	}
	if (!pTableAmelio) {
		return;
	}
	pTableAmelio.appendChild(document.createTextNode(' - '));
	let aElt = document.createElement("a");
	aElt.setAttribute("href", urlAnatrolliseur);
	aElt.setAttribute("target", "_blank");
	aElt.className = "AllLinks ui-link";
	aElt.innerHTML = "Anatrolliser";
	pTableAmelio.appendChild(aElt);
}
function setInfoDescription() {
	let txtDateCrea = NBjours != 1 ?
		` (${NBjours} jours dans le hall)` :
		" (Bienvenue à toi pour ton premier jour dans le hall)";
	appendText(document.querySelector("#descr td#crea"), txtDateCrea, false);
}

function setInfosEtatLieux() {
	let urlBricol = `${URL_bricol_mountyhall}lieux.php?search=position&orderBy=distance&posx=${posX}&posy=${posY}&posn=${posN}&typeLieu=3`;
	let tdPosition = document.querySelector("#pos td span#x").parentElement;
	appendBr(tdPosition);
	let aElt = document.createElement("a");
	aElt.setAttribute("href", urlBricol);
	aElt.setAttribute("target", "_blank");
	aElt.className = "AllLinks ui-link";
	aElt.innerHTML = "Lieux à proximité";
	tdPosition.appendChild(aElt);
}

function setInfosEtatPV() { // pour AM et Sacro
	let
		txt = `1 PV de perdu = +${Math.floor(250 / pvtotal)} min`,
		sec = Math.floor(15000 / pvtotal) % 60,
		lifebar = document.querySelector("#pos .barre-vie"),
		tr_line = document.querySelector("#pos #pv_courant").parentElement.parentElement.parentElement;
	if (sec != 0) {
		txt = `${txt} ${sec} sec`;
	}
	if (lifebar && isDesktopView()) {
		lifebar.title = txt;
	} else {
		tr_line = appendTrDetail(tr_line, '[MZ] Durée de blessure', txt);
	}
	if (pvcourant <= 0) {
		return;
	}


	// Difference PV p/r a equilibre de temps (propale R')
	// Note : pvmin pour 0 malus = pvtotal + ceiling(pvtotal/250*(dtreserve + pdm + bmt + bmmouche))
	// ***INIT GLOBALE*** pvdispo
	let bmPVHorsBlessure = dtbm + dtreserve + pdm + bmt + bmmouche;
	let pvdispo = pvcourant - pvtotal - Math.ceil(bmPVHorsBlessure * pvtotal / 250);
	let span = document.createElement("span");
	span.title = txt;
	span.style.fontStyle = "italic";
	span.className = 'detail';
	if (bmPVHorsBlessure >= 0) {
		txt = "Vous ne pouvez compenser aucune blessure actuellement.";
	} else if (pvdispo > 0) {
		txt = `Vous pouvez encore perdre ${Math.min(pvdispo, pvcourant)} PV sans malus de temps.`;
	} else if (pvdispo < 0) {
		txt = `Il vous manque ${-pvdispo} PV pour ne plus avoir de malus de temps.`;
	} else {
		txt = "Vous êtes à l'équilibre en temps (+/- 30sec).";
	}
	if (isDesktopView()) {
		appendText(span, `[MZ] ${txt}`);
		document.querySelector("#pos #pv_courant").parentElement.parentElement.appendChild(span);
	} else {
		tr_line = appendTrDetail(tr_line, '[MZ] Compensation', txt);
	}

	let marge = dtbm + dtreserve + pdm + bmt + adb + bmmouche;
	let tr = document.createElement('tr');
	tr.className = 'detail';
	let th = document.createElement('th');
	if (marge <= 0) {
		appendText(th, '[MZ] Marge');
	} else {
		appendText(th, '[MZ] Augmentation');
		tr.style.color = 'red';
	}
	tr.appendChild(th);
	let td = document.createElement('td');
	appendText(td, MZ_FormatHeureMinute(marge, true));
	tr.appendChild(td);
	document.querySelector("#dla #duree").parentElement.parentElement.appendChild(tr);
}

function MZ_FormatHeureMinute(duree, bPlus) {
	let txt = '';
	if (duree < 0) {
		txt = '- ';
		duree = -duree;
	} else if (duree > 0 && bPlus) {
		txt = '+ ';
	}
	let h = Math.floor(duree / 60);
	if (h) {
		txt = `${txt}${h} h `;
	}
	txt = `${txt}${duree % 60} m`;
	return txt;
}

// Complete le cadre "Experience"
function setInfosExp() {
	let tdNiv = document.querySelector("#exp #niv");

	// Calcul niveau monstre/troll min pour gain PX
	let nivCibleMin = Math.ceil((2 * nivTroll - 10) / 3);
	tdNiv.parentElement.title = `Vos cibles doivent être au minim de niveau ${nivCibleMin} pour qu'elles vous rapportent des PX`;

	// Calcul PX restant
	let pxRestant = pxdistribuables + pxperso - 2 * nivTroll;
	if (pxRestant >= 0) {
		let tdinfoEntrainement = document.querySelector("#exp table tr:nth-child(4) td span");
		if (tdinfoEntrainement) {
			tdinfoEntrainement.innerHTML = `${tdinfoEntrainement.innerHTML} <i>Il vous restera ${pxRestant} PX</i>`;
		}
	}

	// Calul pi/jour
	let tdPiTotal = document.querySelector("#exp #pitot").parentElement,
		tdPi = document.querySelector("#exp #pi").parentElement;
	tdPiTotal.title = `${Math.round(10 * (pitotal + pxperso + pxdistribuables) / NBjours) / 10} PI par jour`;
	tdPi.title = tdPiTotal.title;

	// Rapports meurtres,morts
	let tdKill = document.querySelector("#exp #kill");
	tdKill.setAttribute("colspan", 1);
	appendTdText(tdKill.parentElement, `${Math.round(10 * NBjours / nbmeurtres) / 10} jours/kill`, false);

	let tdMort = document.querySelector("#exp #mort");
	tdMort.setAttribute("colspan", 1);
	appendTdText(tdMort.parentElement, `${Math.round(10 * NBjours / nbmorts) / 10} jours/mort`, false);

	tdKill.parentElement.title = `Rapport meurtres/décès: ${Math.floor(nbmeurtres / nbmorts * 100) / 100}`;
	tdMort.parentElement.title = `Rapport décès/meurtres: ${Math.floor(nbmorts / nbmeurtres * 100) / 100}`;
}

/* -[functions]            Fonctions speciales Kastars                   */

function minParPVsac(fat, bm) {
	// Calcule le nombre de min gagnees / PV sacrifies pour une AM realisee sous
	// fatigue = 'fat', sans et avec un bm de fatigue = 'bm'
	let out = [];
	out[0] = fat > 4 ? Math.floor(120 / (fat * (1 + Math.floor(fat / 10)))) : 30;
	if (bm && bm > 0) {
		let totalfat = fat + bm;
		// en principe inutile pour des bm fat >= 15 mais bon...
		out[1] = totalfat > 4 ? Math.floor(120 / (totalfat * (1 + Math.floor(totalfat / 10)))) : 30;
	}
	return out;
}

function toInt(str) {
	str = parseInt(str);
	return str ? str : 0;
}

function saveLastDLA() {
	// pour les calculs d'AM max
	let str = `${addZero(toInt(inJour.value))}/${addZero(toInt(inMois.value))
		}/${toInt(inAn.value)} ${addZero(toInt(inHr.value))
		}:${addZero(toInt(inMin.value))}:${addZero(toInt(inSec.value))}`;
	lastDLA = new Date(StringToDate(str));
	MY_setValue(`${numTroll}.DLA.ancienne`, str);
	lastDLAZone.innerHTML = '';
	let b = document.createElement('b');
	b.addEventListener('click', inputMode, false);
	appendText(b, str);
	lastDLAZone.appendChild(b);
	refreshAccel();
}

function inputMode() {
	// Edition manuelle lastDLA
	let date;
	if (lastDLA) {
		date = new Date(lastDLA);
	} else {
		date = new Date(DLAaccel);
	}
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone, 'text', 'inJour', 1, 2, date.getDate());
	appendText(lastDLAZone, '/');
	inMois = appendTextbox(lastDLAZone, 'text', 'inMois', 1, 2, 1 + date.getMonth());
	appendText(lastDLAZone, '/');
	inAn = appendTextbox(lastDLAZone, 'text', 'inAn', 3, 4, date.getFullYear());
	appendText(lastDLAZone, ' - ');
	inHr = appendTextbox(lastDLAZone, 'text', 'inHr', 1, 2, `${date.getHours()}`);
	appendText(lastDLAZone, ':');
	inMin = appendTextbox(lastDLAZone, 'text', 'inMin', 1, 2, `${date.getMinutes()}`);
	appendText(lastDLAZone, ':');
	inSec = appendTextbox(lastDLAZone, 'text', 'inSec', 1, 2, `${date.getSeconds()}`);
	appendText(lastDLAZone, ' - ');
	appendButton(lastDLAZone, 'Enregistrer', saveLastDLA);
}

function setAccel() {
	let BMfrais = false,
		fat = fatigue, listeBmFat = [],
		tr, th, insertPt;

	// Creation ligne speciale pour AM dans le cadre "Etat"
	tr = document.createElement('tr');
	th = document.createElement('th');
	appendText(th, '[MZ] Fatigue et AM', true);
	tr.appendChild(th);
	insertPt = document.createElement('td');
	tr.appendChild(insertPt);
	document.querySelector('#pos table>tbody').insertBefore(tr, null);

	// Est-on en over-DLA ?
	// ***INIT GLOBALE*** overDLA
	overDLA = HeureServeur > DLA.getTime() + 3e5;
	if (overDLA) {
		fat = Math.floor(fatigue / 1.25);
	}

	// Gestion des BM de fatigue
	if (bmfatigue > 0) {
		debugMZ(`setAccel, bmfatigue=${bmfatigue}, ${numTroll}.bm.fatigue=${MY_getValue(`${numTroll}.bm.fatigue`)}`);
		// On tente de recuperer les BM de fatigue de la page des BM
		if (MY_getValue(`${numTroll}.bm.fatigue`)) {
			let BMmemoire = MY_getValue(`${numTroll}.bm.fatigue`).split(';');
			BMmemoire.pop();
			for (let i = 0; i < BMmemoire.length; i++) {
				let nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				let s = `0000${nbrs[0]}`;
				BMmemoire[i] = `${s.substr(s.length - 4)} ${nbrs[1]}`;
			}
			BMmemoire.sort();	// tri par n° de tour
			let tour = 0;
			for (let i = 0; i < BMmemoire.length; i++) {
				let nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				while (tour <= parseInt(nbrs[0])) {
					listeBmFat[tour] = parseInt(nbrs[1]);
					tour++;
				}
			}
		}
		if (listeBmFat[0] == bmfatigue) {
			// Si (bm profil=1er bm stocke), on suppose que les bm stockes sont a jour
			BMfrais = true;
			// Roule 17/06/2020 je ne vois pas du tout pourquoi on viderait xxx;bm.fatigue ici. Et ça fait que la fatigue des Kastars affiche une erreur la 2e fois qu'on va sur le profil... J'enlève
			// MY_removeValue(numTroll+".bm.fatigue");
		}
	} else {
		// S'il n'y a pas de bm de fatigue sur le profil, on est a jour
		BMfrais = true;
	}
	if (!BMfrais && bmfatigue > 0) {
		// si les BM n'ont pas ete rafraichis, on conjecture le pire:
		if (bmfatigue == 15) {
			listeBmFat = [15, 15, 15];
		} else {
			listeBmFat = [30, 30, 15];
		}
	}

	let skip = false;
	if (pvcourant <= 0) {
		appendText(insertPt, 'Aucun calcul possible : vous êtes mort voyons !');
		skip = true;
	}

	if (!skip && fat > 30) {
		appendText(insertPt, 'Vous êtes trop fatigué pour accélérer.');
		skip = true;
	}

	// Setup lastDLAZone
	if (overDLA) {
		// Si on est en over-DLA, on decale les bm d'un tour
		listeBmFat.shift();

		// bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date(DLAsuiv);
		lastDLA = new Date(DLA);
		MY_setValue(`${numTroll}.DLA.ancienne`, MZ_formatDateMS(DLA, false));
		// ***INIT GLOBALE*** pvActuelKastar
		pvActuelKastar = Math.min(pvcourant + regmoy, pvtotal);
		appendText(insertPt, 'Votre DLA est dépassée, calculs basés sur des estimations.', true, 'red');
		appendBr(insertPt);
	} else {
		DLAaccel = new Date(DLA);
		pvActuelKastar = pvcourant;
		if (MY_getValue(`${numTroll}.DLA.ancienne`)) {
			lastDLA = new Date(StringToDate(MY_getValue(`${numTroll}.DLA.ancienne`)));
		} else {
			lastDLA = false;
		}
	}

	// ***INIT GLOBALE*** minParPV
	let minppv = minParPVsac(fat, listeBmFat[0]);
	minParPV = listeBmFat[0] == void 0 ? minppv[0] : minppv[1];
	if (!skip) {
		appendText(insertPt, 'Dernière DLA enregistrée : ');
		lastDLAZone = document.createElement('span');
		lastDLAZone.style.cursor = 'pointer';
		let b = document.createElement('b');
		b.onclick = inputMode;
		lastDLAZone.appendChild(b);
		insertPt.appendChild(lastDLAZone);
		if (lastDLA) {
			appendText(b, MZ_formatDateMS(lastDLA, false));
		} else {
			appendText(b, 'aucune');
		}
		appendBr(insertPt);

		// Setup maxAMZone et cumulZone
		appendText(insertPt, 'Accélération maximale possible : ');
		maxAMZone = document.createElement('b');
		insertPt.appendChild(maxAMZone);
		appendBr(insertPt);
		cumulZone = document.createElement('span');
		insertPt.appendChild(cumulZone);
		refreshAccel();
	}

	if (!(fat > 0 || listeBmFat[0] > 0)) {
		return; // skip si rien a calculer
	}

	// ancre pour afficher le warning d'erreur de calcul
	let err_node = document.createElement('div');
	insertPt.appendChild(err_node);

	// Tableau des fatigues et accel futures
	let table, tbody, col, ligneTour, ligneFat, ligneMin, tr_detail;
	let nbsp = '\u00A0';
	let desktopView = isDesktopView();
	if (desktopView) {
		appendHr(insertPt);
		table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style.textAlign = "center";
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPt.appendChild(table);
		ligneTour = appendTr(tbody, 'mh_tdtitre');
		ligneTour.style.fontWeight = "bold";
		let td = appendTdText(ligneTour, 'Tour :', true);
		td.align = 'left';
		ligneFat = appendTr(tbody, 'mh_tdpage');
		td = appendTdText(ligneFat, 'Fatigue :', true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		ligneMin = appendTr(tbody, 'mh_tdpage');
		td = appendTdText(ligneMin, '1 PV =', true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
	} else {
		tr_detail = appendTrDetail(insertPt.parentElement, `[MZ] Tour`, `${'Fatigue'.padEnd(12, '\u00A0')}|${'1 PV ='.padStart(12, nbsp)}`, true)
	}

	col = 0;
	while (col < 9 && (fat > 0 || listeBmFat[col])) {
		let txt_tour = col == 0 ? 'En cours' : `\u00A0\u00A0+${col}\u00A0\u00A0`,
			txt_fat, txt_min;
		if (col == 0 && overDLA) {
			txt_tour = 'A activer';
			let i = document.createElement('i');
			appendText(i, txt_tour);
			ligneTour.appendChild(i);
		} else {
			appendTdText(ligneTour, txt_tour);
		}
		if (listeBmFat[col]) {
			txt_fat = (BMfrais || !overDLA && col == 0) ? `${fat}+${listeBmFat[col]}`: `${fat}+${listeBmFat[col]} (?)`;
			txt_min = (BMfrais || !overDLA && col == 0) ? `${Math.max(1, minppv[1])}'`: `${minppv[1]}' (${minppv[0]}')`;
		} else {
			txt_fat = fat;
			txt_min = `${minppv[0]}'`;
		}
		appendTdText(ligneFat, txt_fat);
		appendTdText(ligneMin, txt_min);
		tr_detail = desktopView ? '' : appendTrDetail(tr_detail, `[MZ] ${txt_tour}`, `${txt_fat.toString().padEnd(12, '\u00A0')}|${txt_min.padStart(12, nbsp)}`, true);
		col++;
		fat = Math.floor(fat / 1.25);
		minppv = minParPVsac(fat, listeBmFat[col]);
	}
	if (fat > 1 || fat == 1 && !overDLA) {
		appendTdText(ligneTour, '\u00A0\u00A0...\u00A0\u00A0', true);
		appendTdText(ligneFat, '-');
		appendTdText(ligneMin, '-');
	}
	col = overDLA ? Math.max(retourAZero(fatigue) - 1, col) : Math.max(retourAZero(fatigue), col);
	appendTdText(ligneTour, `\u00A0\u00A0+${col}\u00A0\u00A0`);
	appendTdText(ligneFat, '0');
	appendTdText(ligneMin, '30\'');
	tr_detail = desktopView ? '' : appendTrDetail(tr_detail, `[MZ] \u00A0\u00A0+${col}\u00A0\u00A0`, `${'0'.padEnd(12, '\u00A0')}|${'30\''.padStart(12, nbsp)}`, true);

	if (!BMfrais && bmfatigue) {
		// si les BM n'ont pas ete rafraichis, on signale:
		appendText(err_node, 'Attention, ce tableau est probablement faux.' +
		' Visitez la page des Bonus/Malus pour mettre à jour votre fatigue.', true, 'red');
	}
}

function refreshAccel() {
	let pvs, pvsmax;

	// Acceleration pour cumul instantane
	// debugMZ(`refreshAccel: pvActuelKastar=${pvActuelKastar},DLAaccel=${DLAaccel},lastDLA=${lastDLA},minParPV=${minParPV}`);
	if (lastDLA) {
		pvsmax = Math.min(
			pvActuelKastar - 1,
			Math.ceil(Math.floor((DLAaccel - lastDLA) / 6e4) / minParPV)
		);
		maxAMZone.innerHTML = `${pvsmax} PV`;
	} else {
		pvsmax = pvActuelKastar - 1;
		maxAMZone.innerHTML = 'inconnue';
	}

	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	pvs = Math.ceil(Math.ceil((DLAaccel - HeureServeur) / 6e4) / minParPV);
	cumulZone.innerHTML = '';
	if (pvs <= pvsmax) {
		appendText(cumulZone, 'Vous devez accélérer d\'au moins ');
		appendText(cumulZone, `${pvs} PV`, true);
		appendText(cumulZone, ' pour activer immédiatement un nouveau tour.');
		if (pvs != 1) {
			let gainSec = Math.floor((DLAaccel - HeureServeur) / 1e3) - (pvs - 1) * 60 * minParPV;
			appendText(
				cumulZone,
				` (${pvs - 1} PV dans ${Math.floor(gainSec / 60)}min${addZero(gainSec % 60)}s)`
			);
		}
	} else {
		let avantDLA = new Date(DLAaccel - HeureServeur - pvsmax * minParPV * 6e4);
		appendText(
			cumulZone,
			`Après votre accélération maximale, il vous faudra encore attendre ${dureeHM(avantDLA / 6e4)} avant de réactiver.`
		);
	}
}

function setInfosFatiguesOptimiales() {
	let thFatigue = document.querySelector('#fatigue').parentElement.parentElement,
		title = 'Fat. optimale',
		txt = '29 / 23 / 18 / 14 / 11 / 8 / 6 / 4';
	if (isDesktopView()) {
		thFatigue.title = `${title} : ${txt}`;
	} else {
		appendTrDetail(thFatigue, `[MZ] ${title}`, `${txt}`)
	}
}


/* -[functions]         Fonctions gerant les infos-bulles                */

function traitementTalents() {
	let trCompetence = document.querySelectorAll("#comp table#competences>tbody>tr");
	let trSorts = document.querySelectorAll("#sort table#sortileges>tbody>tr");
	removeAllTalents();
	let totalComp = injecteInfosBulles(trCompetence, 'competences');
	let totalSort = injecteInfosBulles(trSorts, 'sortileges');
	let comps = document.querySelector('#comp>div>h3.mh_tdtitre');
	comps.innerHTML = comps.innerHTML.replace('Compétences', `Compétences (Total : ${totalComp}%)`);
	let sorts = document.querySelector('#sort>div>h3.mh_tdtitre');
	sorts.innerHTML = sorts.innerHTML.replace('Sortilèges', `Sortilèges (Total : ${totalSort}%)`);
}

function injecteInfosBulles(liste, fonction) {
	let totalpc = 0;
	// on parse la liste des talents du type 'fonction'
	for (let i = 0; i < liste.length; i++) {
		let
			trTalent = liste[i],
			node = trTalent.cells[1].querySelector('a'),
			nomTalent = epure(trim(node.textContent)),
			indiceTDniveaux = 7,
			indiceTDSousCompetence = 2,
			sousCompetences = undefined;
		if (fonction == "competences") {
			// un TD en plus pour des information complementaire liees a la comp
			indiceTDniveaux++;
			// chercher les sous-compétence (type de golem, type de piège) s'il y a
			sousCompetences = trTalent.cells[indiceTDSousCompetence].textContent.split(',');
			for (let j = 0; j < sousCompetences.length; j++) {
				sousCompetences[j] = sousCompetences[j].epure().trim();
				if (arrayTalents[sousCompetences[j]]) {
					sousCompetences[j] = arrayTalents[sousCompetences[j]];
				}
			}
		}
		let niveauxMaitrisesTalentArray = getNumbers(trTalent.cells[indiceTDniveaux].textContent);
		setInfos(node, nomTalent, fonction, niveauxMaitrisesTalentArray[0]);
		setTalent(nomTalent, niveauxMaitrisesTalentArray[1], niveauxMaitrisesTalentArray[0], sousCompetences);
		totalpc = totalpc + niveauxMaitrisesTalentArray[1];

		// stockage des niveaux inferieurs du talent si presents
		for (let j = 2; j < niveauxMaitrisesTalentArray.length; j = j + 2) {
			setTalent(nomTalent, niveauxMaitrisesTalentArray[j + 1], niveauxMaitrisesTalentArray[j], sousCompetences);
			totalpc = totalpc + niveauxMaitrisesTalentArray[j + 1];
		}
	}
	return totalpc;
}

function setInfos(node, nom, fonction, niveau) {
	node.nom = nom;
	node.fonction = fonction;
	node.niveau = niveau;
	node.onmouseover = setBulle;
	node.onmouseout = cacherBulle;
}

var arrayModifAnatroll = {
	Glue: 'Glu',
	PuM: 'PuiM',
	HE: 'Hurlement',
	// 'Insultes':'Insu',
	Pistage: 'Pist',
	PuC: 'Planter',
	Golemo: 'Golem',
};

function setTalent(nom, pc, niveau, sousCompetences) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement
	// (et pas les % dont osf) ne serait pas plus rentable
	let nomEnBase = arrayTalents[epure(nom)];
	if (!nomEnBase) {
		debugMZ(`setTalent: le talent ${nom} n'est pas dans la base MZ`);
		return;
	}
	if (!niveau) {
		niveau = 1;
	}

	switch (nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur = `${urlAnatrolliseur}Insu${niveau}|`;
		case 'IdT':
			nomEnBase = nomEnBase + niveau;
			break;
		case 'Piege':
			for (let i = 0; i < sousCompetences.length; i++) {
				urlAnatrolliseur = `${urlAnatrolliseur}${arrayModifAnatroll[sousCompetences[i]] ?
					arrayModifAnatroll[sousCompetences[i]] : sousCompetences[i]}|`;
			}
			break;
		case 'AP':
		case 'CdB':
		case 'CdM':
		case 'Parer':
		case 'Retraite':
		case 'RB':
		case 'SInterposer':
			nomEnBase = nomEnBase + niveau;
		default:
			urlAnatrolliseur = `${urlAnatrolliseur}${arrayModifAnatroll[nomEnBase] ?
				arrayModifAnatroll[nomEnBase] : nomEnBase}|`;
	}
	// debugMZ("setTalent: nom=" + nom + ", pc=" + pc + ", niveau=" + niveau + ", sousCompetences=" + JSON.stringify(sousCompetences) + "=>setValue(" + numTroll+'.talent.'+nomEnBase+", " + pc + ")");
	MY_setValue(`${numTroll}.talent.${nomEnBase}`, pc);
}

function creerBulleVide() {
	let table = document.createElement('table');
	table.id = 'bulle';
	table.className = 'mh_tdborder';
	table.width = 300;
	table.border = 0;
	table.cellPadding = 5;
	table.cellSpacing = 1;
	table.style =
		'position:absolute;' +
		'visibility:hidden;' +
		'z-index:800;' +
		'height:auto;';
	let tr = appendTr(table, 'mh_tdtitre');
	appendTdText(tr, 'Titre');
	tr = appendTr(table, 'mh_tdpage');
	appendTdText(tr, 'Contenu');
	let aList = document.getElementsByTagName('a');
	aList[aList.length - 1].parentNode.appendChild(table);
	return table;
}

function cacherBulle() {
	if (bulleStyle) {
		bulleStyle.visibility = 'hidden';
	}
}

function setBulle(evt) {
	let nom = this.nom;
	let fonction = this.fonction;
	let niveau = parseInt(this.niveau);
	let str = '';
	if (fonction == 'competences') {
		str = competences(nom, niveau);
	} else if (fonction == 'sortileges') {
		str = sortileges(nom);
	} else if (fonction == '*') {	// pour les raccourcis de la frame de gauche : on ne sait pas si c'est compétence ou sort
		str = competences(nom, niveau);
		if (str == '') {
			str = sortileges(nom);
		}
	}
	if (str == '') {
		debugMZ(`setBulle, pas de description sur ${nom}`);
		return;
	}
	if (nom.indexOf('Golem') != -1) {
		nom = 'Golemologie';
	}

	let xfenetre, yfenetre, xpage, ypage, element = null;
	let offset = 15;
	let bulleWidth = 300;
	if (!hauteur) {
		hauteur = 50;
	}
	element = document.getElementById('bulle');
	if (!element) {
		element = creerBulleVide();
	}
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if (evt.pageX) {
		xpage = evt.pageX;
	}
	if (evt.pageY) {
		ypage = evt.pageY;
	}
	if (element) {
		bulleStyle = element.style;
		element.firstChild.firstChild.innerHTML = `<b>${nom}</b>`;
		element.childNodes[1].firstChild.innerHTML = str;
	}
	if (bulleStyle) {
		if (xfenetre > bulleWidth + offset) {
			xpage = xpage - (bulleWidth + offset);
		} else {
			xpage = xpage + offset;
		}
		if (yfenetre > hauteur + offset) {
			ypage = ypage - (hauteur + offset);
		}
		bulleStyle.width = bulleWidth;
		bulleStyle.left = `${xpage}px`;
		bulleStyle.top = `${ypage}px`;
		bulleStyle.visibility = 'visible';
	}
}

/* -[functions] Textes des infos-bulles pour les competences et sortileges - */

function competences(comp, niveau) {
	let modA = atttour ? Math.floor((att + atttourD) * atttour / 100) : 0,
		modD = degtour ? Math.floor(deg * degtour / 100) : 0,
		texte = "";

	if (comp.indexOf('Acceleration du Metabolisme') != -1 && minParPV != null) {
		texte = `<b>1</b> PV = <b>${minParPV}</b> minute`;
		if (minParPV > 1) {
			texte = `${texte}s`;
		}
		if (overDLA) {
			texte = `${texte}<br/><i>(Votre DLA est dépassée.)</i>`;
		}
	} else if (comp.indexOf("Attaque Precise") != -1) {
		let pc, lastmax = 0,
			jetatt, espatt = 0,
			notMaxedOut = false;

		for (let i = niveau; i > 0; i--) {
			pc = getTalent(comp, i);
			if (lastmax != 0 && pc <= lastmax) {
				// Si %AP(i)<%AP(i+1), on passe AP(i)
				continue;
			}
			jetatt = Math.round(3.5 * (
				Math.min(Math.floor(1.5 * att), att + 3 * i) + modA
			)) + attbp + attbm;
			espatt = espatt + (pc - lastmax) * jetatt;
			texte = `${texte}Attaque niv. ${i} (${pc - lastmax}%) : <b>${Math.min(Math.floor(att * 1.5), att + 3 * i)}</b> D6 `;
			if (modA) {
				texte = `${texte}<i>${aff(modA)}D6</i> `;
			}
			texte = `${texte}${aff(attbp + attbm)} => <b>${jetatt}</b><br>`;
			lastmax = pc;
			if (i < niveau) {
				// Si l'un des % de niveau inf est > % nivmax,
				// on affiche l'espérance à la fin
				notMaxedOut = true;
			}
		}
		if (notMaxedOut) {
			texte = `${texte}<i>Attaque moyenne (si réussite) : <b>${Math.floor(10 * espatt / lastmax) / 10}</b></i><br>`;
		}
		texte = `${texte}Dégâts : <b>${deg}</b> D3 `;
		if (modD) {
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		}
		texte = `${texte}${aff(degbp + degbm)} => <b>${degmoytour}/${degmoycrittour}</b>`;
	} else if (comp.indexOf("Balayage") != -1) {
		texte = `Déstabilisation : <b>${att}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(attbp + attbm)} => <b>${attmoytour}</b><br>` +
			`Effet : <b>Met à terre l'adversaire</b>`;
	} else if (comp.indexOf('Bidouille') != -1) {
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet ' +
			'de votre inventaire avec le texte de votre choix.';
	} else if (comp.indexOf('Baroufle') != -1) {
		texte = 'Vous voulez encourager vos compagnons de chasse ? ' +
			'Ramassez quelques Coquillages, et en avant la musique !<br>';
		texte = `${texte}${'<table class="mh_tdborder" cellspacing="1" cellpadding="1" border="0"><tbody>' +
			'<tr class="mh_tdtitre"><th>Nom</th><th>Effet</th></tr>' +
			'<tr class="mh_tdpage"><td>Badaboum</td><td>att +1</td></tr>' +
			'<tr class="mh_tdpage"><td>Booong</td><td>deg +1 / esq -1</td></tr>' +
			'<tr class="mh_tdpage"><td>Gaaaw</td><td>Fatigue +1</td></tr>' +
			'<tr class="mh_tdpage"><td>Ghimighimighimi</td><td>Impacte le baroufleur</td></tr>' +
			'<tr class="mh_tdpage"><td>Huitsch</td><td>deg -1</td></tr>' +
			'<tr class="mh_tdpage"><td>Kliketiiik</td><td>esq -1 / concentration -1</td></tr>' +
			'<tr class="mh_tdpage"><td>Krouiiik</td><td>concentration -2</td></tr>' +
			'<tr class="mh_tdpage"><td>Kssksss</td><td>esq +1</td></tr>' +
			'<tr class="mh_tdpage"><td>Praaaouuut</td><td>reg-1 </td></tr>' +
			'<tr class="mh_tdpage"><td>Sssrileur</td><td>seuil 6, rend visible</td></tr>' +
			'<tr class="mh_tdpage"><td>Tagadagada</td><td>augmente le nombre de tours (1 tour par tranche de 2)</td></tr>' +
			'<tr class="mh_tdpage"><td>Tuutuuuut</td><td>att -1</td></tr>' +
			'<tr class="mh_tdpage"><td>Whaaag</td><td>augmente la portée horizontale (1 case par tranche de 4)</td></tr>' +
			'<tr class="mh_tdpage"><td>Whoooom</td><td>concentration +2</td></tr>' +
			'<tr class="mh_tdpage"><td>Ytseukayndof</td><td>seuil 2, rend les bonus magiques</td></tr>' +
			'<tr class="mh_tdpage"><td>Zbouing </td><td>reg +1</td></tr>' +
			'</tbody></table>'}`;
	} else if (comp.indexOf("Botte Secrete") != -1) {
		modA = atttour ? Math.floor(Math.floor(2 * att / 3) * atttour / 100) : 0;
		modD = degtour ? Math.floor(Math.floor(att / 2) * degtour / 100) : 0;
		texte = `Attaque : <b>${Math.floor(2 * att / 3)}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(Math.floor((attbp + attbm) / 2))
			} => <b>${Math.round(
				3.5 * (Math.floor(2 * att / 3) + modA) + Math.floor((attbp + attbm) / 2)
			)}</b><br/>Dégâts : <b>${Math.floor(att / 2)}</b> D3 `;
		if (modD) {
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		}
		texte = `${texte}${aff(Math.floor((degbp + degbm) / 2))} => <b>${2 * (Math.floor(att / 2) + modD) + Math.floor((degbp + degbm) / 2)
			}/${2 * (Math.floor(1.5 * Math.floor(att / 2)) + modD) +
			Math.floor((degbp + degbm) / 2)}</b>`;
	} else if (comp.indexOf('Camouflage') != -1) {
		let camou = getTalent('Camouflage');
		texte = `${'Pour conserver son camouflage, il faut réussir un jet sous:<br/>' +
			'<i>Déplacement :</i> <b>'}${Math.floor(0.75 * camou)}%</b><br/>` +
			`<i>Attaque :</i> <b>perte automatique</b>.<br/>` +
			`<i>Projectile Magique :</i> <b>${Math.floor(0.25 * camou)}%</b>`;
	} else if (comp.indexOf("Charger") != -1) {
		if (pvcourant <= 0) {
			// N'est plus censé se produire : activation obligatoire si mort
			return "<i>On ne peut charger personne quand on est mort !</i>";
		}
		let portee = Math.min(
			Math.max(
				getPortee(reg + Math.floor(pvcourant / 10)) -
				Math.floor((fatigue + bmfatigue) / 5),
				1
			),
			vuetotale
		);
		if (portee < 1) {
			return "<b>Impossible de charger</b>";
		}
		texte = `Attaque : <b>${att}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(attbp + attbm)
			} => <b>${attmoytour}</b><br>` +
			`Dégâts : <b>${deg}</b> D3 `;
		if (modD) {
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		}
		texte = `${texte}${aff(degbp + degbm)
			} => <b>${degmoytour}/${degmoycrittour}</b><br>` +
			`Portée : <b>${portee}</b> case`;
		if (portee > 1) {
			texte = `${texte}s`;
		}
	} else if (comp.indexOf('Connaissance des Monstres') != -1) {
		texte = `Portée horizontale : <b>${vuetotale}</b> case`;
		if (vuetotale > 1) {
			texte = `${texte}s`;
		}
		texte = `${texte}<br/>Portée verticale : <b>${Math.ceil(vuetotale / 2)}</b> case`;
		if (vuetotale > 2) {
			texte = `${texte}s`;
		}
	} else if (comp.indexOf('Piege') != -1) {
		texte = 'Piège à Glue :<ul><li>Et si vous colliez vos adversaires au sol ?</li></ul>';
		texte = `${texte}Piège à Feu: <ul><li>À moins que vous ne préfériez les envoyer en l'air !</li>`;
		texte = `${texte}<li>Dégats du piège à feu : <b>${Math.floor((esq + vue) / 2)}</b> D3` +
			` => <b>${2 * Math.floor((esq + vue) / 2)} (${resiste((esq + vue) / 2)})</b></li></ul>`;
	} else if (comp.indexOf("Contre-Attaquer") != -1) {
		modA = atttour ? Math.floor(Math.floor(att / 2) * atttour / 100) : 0;
		texte = `Attaque : <b>${Math.floor(att / 2)}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(Math.floor((attbp + attbm) / 2))
			} => <b>${Math.round(
				3.5 * (Math.floor(att / 2) + modA) + Math.floor((attbp + attbm) / 2)
			)}</b><br>` +
			`Dégâts : <b>${deg}</b> D3 `;
		if (modD) {
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		}
		texte = `${texte}${aff(degbp + degbm)
			} => <b>${degmoytour}/${degmoycrittour}</b>`;
	} else if (comp.indexOf("Coup de Butoir") != -1) {
		let pc, lastmax = 0,
			jetdeg, espdeg = 0,
			notMaxedOut = false;

		texte = `Attaque : <b>${att}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(attbp + attbm)
			} => <b>${attmoytour}</b>`;
		for (let i = niveau; i > 0; i--) {
			pc = getTalent(comp, i);
			if (lastmax != 0 && pc <= lastmax) {
				// Si %CdB(i)<%CdB(i+1), on passe CdB(i)
				continue;
			}
			jetdeg = 2 * (
				Math.min(Math.floor(1.5 * deg), deg + 3 * i) + modD
			) + degbp + degbm;
			espdeg = espdeg + (pc - lastmax) * jetdeg;
			texte = `${texte}<br>Dégâts niv. ${i} (${pc - lastmax}%) : <b>${Math.min(Math.floor(deg * 1.5), deg + 3 * i)}</b> D3 `;
			if (modD) {
				texte = `${texte}<i>${aff(modD)}D3</i> `;
			}
			texte = `${texte}${aff(degbp + degbm)
				} => <b>${jetdeg
				}/${jetdeg + 2 * Math.floor(deg / 2)}</b>`;
			lastmax = pc;
			if (i < niveau) {
				// Si l'un des % de niveau inf est > % nivmax,
				// on affiche l'espérance à la fin
				notMaxedOut = true;
			}
		}
		if (notMaxedOut) {
			texte = `${texte}<br><i>Dégâts moyens (si réussite) : <b>${Math.floor(10 * espdeg / lastmax) / 10}/${Math.floor(10 * espdeg / lastmax) / 10 + 2 * Math.floor(deg / 2)
				}</b></i>`;
		}
	} else if (comp.indexOf('Course') != -1) {
		texte = `Déplacement gratuit : <b>${Math.floor(getTalent('Course') / 2)
			} %</b> de chance`;
	} else if (comp.indexOf('Deplacement Eclair') != -1) {
		texte = 'Permet d\'économiser <b>1</b> PA ' +
			'par rapport au déplacement classique';
	} else if (comp.indexOf('Dressage') != -1) {
		texte = 'Le dressage permet d\'apprivoiser un Gowap redevenu sauvage, un Mouch\'oo Sauvage ' +
			'ou un Gnu Sauvage. La portée est de une case.';
	} else if (comp.indexOf('Ecriture Magique') != -1) {
		texte = 'Réaliser la copie d\'un sortilège après en avoir découvert ' +
			'la formule nécessite de réunir les composants de cette formule, ' +
			'd\'obtenir un parchemin vierge sur lequel écrire, et de récupérer ' +
			'un champignon adéquat pour confectionner l\'encre.';
	} else if (comp.indexOf('Frenesie') != -1) {
		texte = `Attaque : <b>${att}</b> D6 ${aff(attbp + attbm)
			} => <b>${attmoy}</b><br/>` +
			`Dégâts : <b>${deg}</b> D3 ${aff(degbp + degbm)
			} => <b>${degmoy}/${degmoycrit}</b>`;
	} else if (comp.indexOf('Golem') != -1) {
		texte = 'Animez votre golem en assemblant divers matériaux ' +
			'autour d\'un cerveau minéral.';
	} else if (comp.indexOf('Grattage') != -1) {
		texte = 'Permet de confectionner un Parchemin Vierge ' +
			'à partir de composants et de Gigots de Gob\'.';
	} else if (comp.indexOf('Hurlement Effrayant') != -1) {
		texte = 'Fait fuir un monstre si tout se passe bien.' +
			'<br/>Lui donne de gros bonus sinon...';
	} else if (comp.indexOf('Identification des Champignons') != -1) {
		texte = `Portée horizontale : <b>${Math.floor(vuetotale / 2)}</b> case`;
		if (vuetotale > 2) {
			texte = `${texte}s`;
		}
		texte = `${texte}<br/>Portée verticale : <b>${Math.floor(vuetotale / 4)}</b> case`;
		if (vuetotale > 4) {
			texte = `${texte}s`;
		}
	} else if (comp.indexOf('Insultes') != -1) {
		texte = `Portée horizontale : <b>${Math.min(vuetotale, 1)}</b> case`;
	} else if (comp.indexOf('interposer') != -1) {
		texte = `Jet de réflexe : <b>${Math.floor(2 * (esq + reg) / 3)}</b> D6 ${aff(esqbp + esqbm)
			} => <b>${Math.round(3.5 * Math.floor(2 * (esq + reg) / 3) + (esqbp + esqbm))}</b>`;
	} else if (comp.indexOf('Lancer de Potions') != -1) {
		texte = `Portée : <b>${2 + Math.floor(vuetotale / 5)}</b> cases`;
	} else if (comp.indexOf('Marquage') != -1) {
		texte = 'Marquage permet de rajouter un sobriquet à un monstre. Il faut ' +
			'bien choisir le nom à ajouter car celui-ci sera définitif. Il faut ' +
			'se trouver dans la même caverne que le monstre pour le marquer.';
	} else if (comp.indexOf('Melange Magique') != -1) {
		texte = 'Cette Compétence permet de combiner deux Potions pour ' +
			'en réaliser une nouvelle dont l\'effet est la somme ' +
			'des effets des potions initiales.';
	} else if (comp.indexOf('Travail de la Pierre') != -1) {
		texte = `Miner :<ul><li>Portée horizontale (officieuse) : <b>${2 * vuetotale}</b> cases</li>` +
			`<li>Portée verticale (officieuse) : <b>${2 * Math.ceil(vuetotale / 2)}</b> cases</li></ul>` +
			`Tailler: <ul><li>Permet d'augmenter sensiblement la valeur marchande de certains ` +
			`minerais. Mais cette opération délicate n'est pas sans risques...</li></ul>`;
	} else if (comp.indexOf('Necromancie') != -1) {
		texte = 'La Nécromancie permet à partir des composants d\'un monstre ' +
			'de faire "revivre" ce monstre.';
	} else if (comp.indexOf('Painthure de Guerre') != -1) {
		texte = 'Grimez vos potrõlls et réveillez l\'esprit guerrier ' +
			'qui sommeille en eux ! Un peu d\'encre, une Tête Réduite ' +
			'pour s\'inspirer, et laissez parler votre créativité.';
	} else if (comp.indexOf("Parer") != -1) {
		modA = atttour ? Math.floor(Math.floor(att / 2) * atttour / 100) : 0;
		texte = `Jet de parade : <b>${Math.floor(att / 2)}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(Math.floor((attbp + attbm) / 2))
			} => <b>${Math.round(
				3.5 * (Math.floor(att / 2) + modA) +
				Math.floor((attbp + attbm) / 2)
			)}</b><hr>Equivalent esquive : <b>${Math.floor(att / 2) + esq}</b> D6 `;
		if (modA) {
			texte = `${texte}<i>${aff(modA)}D6</i> `;
		}
		texte = `${texte}${aff(Math.floor((attbp + attbm) / 2) + esqbp + esqbm)
			} => <b>${Math.round(
				3.5 * (Math.floor(att / 2) + modA + esq) +
				Math.floor((attbp + attbm) / 2)
			) + esqbp + esqbm}</b></i>`;
	} else if (comp.indexOf('Pistage') != -1) {
		texte = `Portée horizontale : <b>${2 * vuetotale}</b> cases<br/>` +
			`Portée verticale : <b>${2 * Math.ceil(vuetotale / 2)}</b> cases`;
	} else if (comp.indexOf('Planter un Champignon') != -1) {
		texte = 'Planter un Champignon est une compétence qui vous permet de ' +
			'créer des colonies d\'une variété donnée de champignon à partir de ' +
			'quelques exemplaires préalablement enterrés.';
	} else if (comp.indexOf('Regeneration Accrue') != -1) {
		texte = `Régénération : <b>${Math.floor(pvtotal / 15)}</b> D3` +
			` => <b>+${2 * Math.floor(pvtotal / 15)}</b> PV`;
	} else if (comp.indexOf('Reparation') != -1) {
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, ' +
			'et réparez vous-même votre matériel !';
	} else if (comp.indexOf('Retraite') != -1) {
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait ' +
			'préférable de préparer un repli stratégique pour déconcerter ' +
			'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! ' +
			'Quelle intelligence démoniaque.';
	} else if (comp.indexOf("RotoBaffe") != -1) {
		let Datt = att, vattbm = attbp + attbm,
			Ddeg = deg, vdegbm = degbp + degbm,
			tabTxt = [];
		for (let iNiveau = 0, iAttaque = 1; iNiveau <= niveau; iNiveau++) {
			for (let i2 = 0; i2 < (iNiveau == 0 ? 1 : iNiveau); i2++, iAttaque++) {
				texte = `<b>Attaque n°${iAttaque} :</b><br>` +
					`Attaque : <b>${Datt}</b> D6 `;
				if (modA) {
					texte = `${texte}<i>${aff(modA)}D6</i> `;
				}
				texte = `${texte}${aff(vattbm)
					} => <b>${Math.round(3.5 * (Datt + modA)) + vattbm}</b><br>` +
					`Dégâts : <b>${Ddeg}</b> D3 `;
				if (modD) {
					texte = `${texte}<i>${aff(modD)}D3</i> `;
				}
				texte = `${texte}${aff(vdegbm)
					} => <b>${2 * (Ddeg + modD) + vdegbm
					}/${2 * (Math.floor(1.5 * Ddeg) + modD) + vdegbm}</b>`;
				tabTxt.push(texte);
			}
			// Datt = Math.floor(0.75*Datt);	// il n'y a plus de baisse d'attaque
			modA = atttour ? Math.floor((Datt + atttourD) * atttour / 100) : 0;
			// vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75 * Ddeg);
			modD = degtour ? Math.floor(Ddeg * degtour / 100) : 0;
			vdegbm = Math.floor(0.75 * vdegbm);
		}
		texte = tabTxt.join('<hr>');
	} else if (comp.indexOf('Shamaner') != -1) {
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux ' +
			'des monstres en utilisant des champignons (de 1 à 3).';
	}
	return texte;
}

function sortileges(sort) {
	sort = sort.toLowerCase();
	let
		// Fonctions utiles uniquement à "sortileges"
		decumul_buff = function (nom, str, buff) {
			// Décumul des sorts de buff (old school)
			let txt = `1<sup>ere</sup>${nom} : <b>${str} +${buff}</b>`,
				dec = buff,
				total = buff,
				i = 1;
			while (i < 6) {
				i++;
				dec = Math.floor(coefDecumul(i) * buff);
				if (dec <= 1 || i == 6) {
					break;
				}
				total = total + dec;
				txt = `${txt}<br/><i>${i}<sup>e</sup> ${nom} : ${str} +${dec} (+${total})</i>`;
			}
			txt = `${txt}<br/><i>${i}<sup>e</sup> et + : ${str} +${dec}</i>`;
			return txt;
		},
		nbrAdX = function (pc) {
			// Détermine le nombre d'AdX actifs à partir du % de D
			switch (Number(pc)) {
				case 0: return 0;
				case 20: return 1;
				case 33: return 2;
				case 41: return 3;
				case 46: return 4;
				default: return Math.floor((Number(pc) - 39) / 2);
			}
		},
		decumulPc = function (n) {
			// Détermine le % de D décumulé du n-ième AdX
			switch (Number(n)) {
				case 0: return 0;
				case 1: return 20;
				case 2: return 13;
				case 3: return 8;
				case 4: return 5;
				case 5: return 3;
				default: return 2;
			}
		},
		decumulFixe = function (bm, n) {
			// Détermine le bonus fixe décumulé du n-ième AdX
			switch (Number(n)) {
				case 0: return 0;
				case 1: return Math.max(1, bm);
				case 2: return Math.max(1, Math.round(bm * 6.7) / 10);
				case 3: return Math.max(1, Math.round(bm * 4) / 10);
				default: return 1; // Sous les 1 de moyenne même en D6
			}
		},
		texte = "";

	if (sort.indexOf('analyse anatomique') != -1) {
		texte = `Portée horizontale : <b>${Math.floor(vuetotale / 2)}</b> case`;
		if (vuetotale > 3) {
			texte = `${texte}s`;
		}
		texte = `${texte}<br/>Portée verticale : <b>${Math.floor((vuetotale + 1) / 4)}</b> case`;
		if (vuetotale > 7) {
			texte = `${texte}s`;
		}
	} else if (sort.indexOf('armure etheree') != -1) {
		texte = decumul_buff('AE', 'Armure magique', reg);
	} else if (sort.indexOf("augmentation") != -1 && sort.indexOf("attaque") != -1) {
		let categoriesAdA = {
			"attx1": {
				// Affichage: code MZ (cf arrayTalents)
				AN: true,
				AP: "AP1",
				Balayage: "Balayage",
				Charge: "Charger",
				CdB: "CdB1",
				Frénésie: "Frenesie",
				RB: "RB1",
				GdS: "GdS",
				Siphon: "Siphon"
			},
			"attx2/3": {
				"Botte Secrète": "BS"
			},
			"attx1/2": {
				CA: "CA",
				Parer: "Parer1"
			},
			"degx2/3": {
				Vampirisme: "Vampi"
			},
			"vuex1": {
				"Projectile Magique": "Projo"
			}
		};
		let baseAdA = {
			"attx1": att,
			"attx2/3": Math.floor(2 * att / 3),
			"attx1/2": Math.floor(att / 2),
			"degx2/3": Math.floor(2 * deg / 3),
			"vuex1": vue
		};
		let pc = atttour,
			pcInit = pc,
			nbrAdA = nbrAdX(pc),
			newTalent,
			i, DSup, fixe = 0;

		i = nbrAdA;
		while (i++ < nbrAdA + 3) {
			pc = pc + decumulPc(i);
			fixe = fixe + decumulFixe(3.5, i);
			if (texte) {
				texte = `${texte}<hr>`;
			}
			texte = `${texte}<b>${i}<sup>e</sup> AdA : ${aff(pc)}% de Dés d'attaque :</b><br>`;
			for (let categorie in categoriesAdA) {
				// On génére la liste: "talent1, talent2"
				DSup = Math.floor(baseAdA[categorie] * pc / 100) -
					Math.floor(baseAdA[categorie] * pcInit / 100);
				newTalent = false;
				for (let talent in categoriesAdA[categorie]) {
					if (getTalent(categoriesAdA[categorie][talent])) {
						if (newTalent) {
							texte = `${texte}, `;
						}
						texte = texte + talent;
						newTalent = true;
					}
				}
				if (newTalent) {
					// Si le trõll a au moins un talent dans la catégorie :
					texte = `${texte}: <b>+${DSup}D6 +${Math.floor(fixe)}</b> <i>(+${Math.floor(3.5 * DSup + fixe)})</i><br>`;
				}
			}
		}
	} else if (sort.indexOf('augmentation') != -1 && sort.indexOf('esquive') != -1) {
		texte = decumul_buff('AdE', 'Esquive', Math.floor((esq - 1) / 2));
	} else if (sort.indexOf("augmentation des degats") != -1) {
		let categoriesAdD = {
			"attx1/2": {
				"Botte Secrète": "BS"
			},
			"degx1": {
				AN: true,
				AP: "AP1",
				Charge: "Charger",
				CA: "CA",
				CdB: "CdB1",
				Frénésie: "Frenesie",
				RB: "RB1",
				Rafale: "Rafale",
				Vampi: "Vampi"
			},
			"degx1/2": {
				"Griffe du Sorcier": "GdS"
			},
			"vuex1/2": {
				"Projectile Magique": "Projo"
			},
			"regx1": {
				"Siphon des Âmes": "Siphon"
			}
		};
		let baseAdD = {
			"attx1/2": Math.floor(att / 2),
			"degx1": deg,
			"degx1/2": Math.floor(deg / 2),
			"vuex1/2": Math.floor(vue / 2),
			"regx1": reg
		};
		let pc = degtour,
			pcInit = pc,
			nbrAdD = nbrAdX(pc),
			newTalent,
			i, DSup, fixe = 0;

		i = nbrAdD;
		while (i++ < nbrAdD + 3) {
			pc = pc + decumulPc(i);
			fixe = fixe + decumulFixe(2, i);
			if (texte) {
				texte = `${texte}<hr>`;
			}
			texte = `${texte}<b>${i}<sup>e</sup> AdD : ${aff(pc)}% de Dés de dégâts :</b><br>`;
			for (let categorie in categoriesAdD) {
				// On génére la liste: "talent1, talent2"
				DSup = Math.floor(baseAdD[categorie] * pc / 100) -
					Math.floor(baseAdD[categorie] * pcInit / 100);
				newTalent = false;
				for (let talent in categoriesAdD[categorie]) {
					if (getTalent(categoriesAdD[categorie][talent])) {
						if (newTalent) {
							texte = `${texte}, `;
						}
						texte = texte + talent;
						newTalent = true;
					}
				}
				if (newTalent) {
					// Si le trõll a au moins un talent dans la catégorie :
					texte = `${texte}: <b>+${DSup}D3 +${Math.floor(fixe)}</b> <i>(+${Math.floor(2 * DSup + fixe)})</i><br>`;
				}
			}
		}
	} else if (sort.indexOf('bulle anti-magie') != -1) {
		texte = `RM : <b>+${rm}</b><br/>MM : <b>-${mm}</b>`;
	} else if (sort.indexOf('bulle magique') != -1) {
		texte = `RM : <b>-${rm}</b><br/>MM : <b>+${mm}</b>`;
	} else if (sort.indexOf('explosion') != -1) {
		texte = `Dégâts : <b>${Math.floor(1 + (deg + Math.floor(pvbase / 10)) / 2)}</b> D3 ` +
			` => <b>${2 * Math.floor(1 + (deg + Math.floor(pvbase / 10)) / 2)
			} (${resiste(1 + (deg + Math.floor(pvbase / 10)) / 2)})</b>`;
	} else if (sort.indexOf('faiblesse passagere') != -1) {
		if (pvcourant <= 0) {
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		}
		texte = `Portée horizontale : <b>${Math.min(1, vuetotale)}</b> case<br/>` +
			`Dégâts physiques : <b>-${Math.ceil((Math.floor(pvcourant / 10) + deg - 5) / 4)
			} (-${Math.ceil((Math.floor(pvcourant / 10) + deg - 5) / 8)})</b><br/>` +
			`Dégâts magiques : <b>-${Math.floor((Math.floor(pvcourant / 10) + deg - 4) / 4)
			} (-${Math.floor((Math.floor(pvcourant / 10) + deg - 2) / 8)})</b>`;
	} else if (sort.indexOf('flash aveuglant') != -1) {
		texte = `Vue, Attaque, Esquive : <b>-${1 + Math.floor(vue / 5)}</b>`;
	} else if (sort.indexOf('glue') != -1) {
		texte = `Portée : <b>${1 + Math.floor(vuetotale / 3)}</b> case`;
		if (vuetotale > 2) {
			texte = `${texte}s`;
		}
	} else if (sort.indexOf("griffe du sorcier") != -1) {
		let modD = 0,
			addVenin = function (type, effet, duree) {
				let ret = `<b>Venin ${type} : </b><br/><b>${effet}</b> D3  pendant <b>${duree}</b> tour`,
					dureeReduite = Math.max(Math.floor(duree / 2), 1);
				if (duree > 1) {
					ret = `${ret}s`;
				}
				return `${ret} => <b>${2 * effet} x ${duree} = ${2 * effet * duree}</b> (${2 * effet} x ${dureeReduite} = ${2 * effet * dureeReduite})`;
			},
			effet = 1 + Math.floor((Math.floor(pvmax / 10) + reg) / 3);
		// Frappe
		texte = `Attaque : <b>${att}</b> D6 `;
		if (atttour != 0) {
			modD = Math.floor(att * atttour / 100);
			texte = `${texte}<i>${aff(modD)}D6</i> `;
		}
		texte = `${texte}${aff(attbm)
			} => <b>${Math.round(3.5 * (att + modD)) + attbm}</b><br/>` +
			`Dégâts : <b>${Math.floor(deg / 2)}</b> D3 `;
		if (degtour != 0) {
			modD = Math.floor(Math.floor(deg / 2) * degtour / 100);
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		} else {
			modD = 0;
		}
		texte = `${texte}${aff(degbm)
			} => <b>${2 * (Math.floor(deg / 2) + modD) + degbm
			}/${2 * (Math.floor(deg / 2) + Math.floor(deg / 4) + modD) + degbm
			} (${resiste(Math.floor(deg / 2) + modD, degbm)
			}/${resiste(Math.floor(deg / 2) + Math.floor(deg / 4) + modD, degbm)
			})</b>`;
		// Venins
		texte = `${texte}<hr>${addVenin("insidieux", effet, 2 + Math.floor(vue / 5))}`;
		effet = Math.floor(1.5 * effet);
		texte = `${texte}<hr>${addVenin("virulent", effet, 1 + Math.floor(vue / 10))}`;
	} else if (sort.indexOf('hypnotisme') != -1) {
		texte = `Esquive : <b>-${Math.floor(1.5 * esq)}</b> Dés (<b>-${Math.floor(esq / 3)}</b> Dés)`;
	} else if (sort.indexOf('identification des tresors') != -1) {
		texte = 'Permet de connaitre les caractéristiques et effets précis d\'un trésor.';
	} else if (sort.indexOf('invisibilite') != -1) {
		texte = 'Un troll invisible est indétectable même quand on se trouve ' +
			'sur sa zone. Toute action physique ou sortilège d\'attaque ' +
			'fait disparaître l\'invisibilité.';
	} else if (sort.indexOf('levitation') != -1) {
		texte = 'Prendre un peu de hauteur permet parfois d\'éviter les ennuis. Comme les pièges ou les trous par exemple...';
	} else if (sort.indexOf("projectile magique") != -1) {
		let modD = 0,
			portee = getPortee(vuetotale);
		// Att
		texte = `Attaque : <b>${vue}</b> D6 `;
		if (atttour != 0) {
			modD = Math.floor(vue * atttour / 100);
			texte = `${texte}<i>${aff(modD)}D6</i> `;
		}
		texte = `${texte}${aff(attbm)
			} => <b>${Math.round(3.5 * (vue + modD)) + attbm}</b><br>` +
			`Dégâts : <b>${Math.floor(vue / 2)}</b> D3 `;
		// Deg
		if (degtour != 0) {
			modD = Math.floor(Math.floor(vue / 2) * degtour / 100);
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		} else {
			modD = 0;
		}
		texte = `${texte}${aff(degbm)
			} => <b>${2 * (Math.floor(vue / 2) + modD) + degbm
			}/${2 * (Math.floor(1.5 * Math.floor(vue / 2)) + modD) + degbm
			} (${resiste(Math.floor(vue / 2) + modD, degbm)
			}/${resiste(1.5 * Math.floor(vue / 2) + modD, degbm)
			}) (+ 1D3 par bonus de portée)</b>`;
		// Portée
		texte = `${texte}<br/>Portée : <b>${portee}</b> case`;
		if (portee > 1) {
			texte = `${texte}s`;
		}
	} else if (sort.indexOf('projection') != -1) {
		texte = 'Si le jet de résistance de la victime est raté:<br/>' +
			'la victime est <b>déplacée</b> et perd <b>1D6</b> d\'Esquive<hr>' +
			'Si le jet de résistance de la victime est réussi:<br/>' +
			'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
	} else if (sort.indexOf("rafale psychique") != -1) {
		let modD = 0;
		texte = `Dégâts : <b>${deg}</b> D3 `;
		if (degtour != 0) {
			modD = Math.floor(deg * degtour / 100);
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		}
		texte = `${texte}${aff(degbm)
			} => <b>${2 * (deg + modD) + degbm
			} (${resiste(deg + modD, degbm)})</b><br>` +
			`Malus : régénération <b>-${deg + modD}</b>`;
	} else if (sort.indexOf("sacrifice") != -1) {
		if (pvcourant <= 0) {
			// N'est plus censé se produire : activation obligatoire si mort
			return "<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>";
		}
		let perteSacro = function (sac) {
			return ` (-${sac + 2 * (1 + Math.floor(sac / 5))} PV)`;
		},
			sac = Math.floor((pvcourant - 1) / 2);
		let bmPVHorsBlessure = dtbm + dtreserve + pdm + bmt + bmmouche;
		let pvdispoSansMalusTemps = pvcourant - pvtotal - Math.ceil(bmPVHorsBlessure * pvtotal / 250);

		texte = `Portée horizontale : <b>${Math.min(1, vuetotale)}</b> case<br>` +
			`Soin maximal : <b>${sac}</b> PV${perteSacro(sac)}`;
		// Sacros max et optimal sans malus (propale R')
		sac = Math.floor((pvdispoSansMalusTemps - 2) * 5 / 7);
		if (sac > 0) {
			texte = `${texte}${"<hr>Soin maximum limitant les risques de malus " +
				"de temps : <b>"}${sac}</b> PV${perteSacro(sac)}`;
		} else {
			texte = `${texte}<hr>Vous ne pouvez pas compenser de blessures dues à un sacrifice`;
		}
	} else if (sort.indexOf("siphon") != -1) {
		let modD = 0;
		texte = `Attaque : <b>${att}</b> D6 `;
		if (atttour != 0) {
			modD = Math.floor(att * atttour / 100);
			texte = `${texte}<i>${aff(modD)}D6</i> `;
		}
		texte = `${texte}${aff(attbm)
			} => <b>${Math.round(3.5 * (att + modD) + attbm)}</b><br>` +
			`Dégâts : <b>${reg}</b> D3 `;
		if (degtour != 0) {
			modD = Math.floor(reg * degtour / 100);
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		} else {
			modD = 0;
		}
		texte = `${texte}${aff(degbm)
			} => <b>${2 * (reg + modD) + degbm
			}/${2 * (Math.floor(1.5 * reg) + modD) + degbm
			} (${resiste(reg + modD, degbm)
			}/${resiste(1.5 * reg + modD, degbm)})</b>`;
		texte = `${texte}<br>Nécrose : attaque magique <b>-${reg + modD}</b>`;
	} else if (sort.indexOf('telekinesie') != -1) {
		texte = 'Portée horizontale  :';
		let vt = Math.floor(vuetotale / 2) + 2;
		let strList = ['d\'une Plum\' ou Très Léger', 'Léger', 'Moyen', 'Lourd', 'Très Lourd ou d\'une Ton\''];
		for (let i = 0; i < 5; i++) {
			texte = `${texte}<br/><i>Trésor ${strList[i]} : </i><b>${vt}</b> case`;
			if (vt > 1) {
				texte = `${texte}s`;
			}
			vt = Math.max(0, vt - 1);
		}
	} else if (sort.indexOf('teleportation') != -1) {
		let portee = getPortee(pitotal / 5);	// Roule, 30/09/2016, TP basé sur les PI
		debugMZ(`calcul portée Teleportation, pitotal=${pitotal}, portée=${portee}`);
		let pmh = 20 + vue + portee;
		let pmv = 3 + Math.floor(portee / 3);
		texte = `Portée horizontale : <b>${pmh}</b> cases<br/>` +
			`Portée verticale : <b>${pmv}</b> cases<hr>` +
			`X compris entre ${posX - pmh} et ${posX + pmh}<br/>` +
			`Y compris entre ${posY - pmh} et ${posY + pmh}<br/>` +
			`N compris entre ${posN - pmv} et ${Math.min(-1, posN + pmv)}<br/>`;
	} else if (sort.indexOf('vampirisme') != -1) {
		let modD = 0;
		texte = `Attaque : <b>${Math.floor(2 * deg / 3)}</b> D6 `;
		if (atttour != 0) {
			modD = Math.floor(Math.floor(2 * deg / 3) * atttour / 100);
			texte = `${texte}<i>${aff(modD)}D6</i> `;
		}
		texte = `${texte}${aff(attbm)
			} => <b>${Math.round(3.5 * (Math.floor(2 * deg / 3) + modD) + attbm)
			}</b><br/>Dégâts : <b>${deg}</b> D3 `;
		if (degtour != 0) {
			modD = Math.floor(deg * degtour / 100);
			texte = `${texte}<i>${aff(modD)}D3</i> `;
		} else {
			modD = 0;
		}
		texte = `${texte}${aff(degbm)
			} => <b>${2 * (deg + modD) + degbm
			}/${2 * (Math.floor(1.5 * deg) + modD) + degbm
			} (${resiste(deg + modD, degbm)
			}/${resiste(1.5 * deg + modD, degbm)})</b>`;
	} else if (sort.indexOf('vision accrue') != -1) {
		texte = decumul_buff('VA', 'Vue', Math.floor(vue / 2));
	} else if (sort.indexOf('vision lointaine') != -1) {
		texte = 'En ciblant une zone située n\'importe où dans le ' +
			'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	} else if (sort.indexOf('voir le cache') != -1) {
		texte = `<b>Sur soi :</b><br/>Portée horizontale : <b>${Math.min(5, getPortee(vue))}</b> cases<hr>` +
			`<b>A distance :</b><br/>Portée horizontale : <b>${getPortee(vuetotale)}</b> cases`;
	} else if (sort.indexOf('vue troublee') != -1) {
		texte = `Portée horizontale : <b>${Math.min(1, vuetotale)}</b> case<br/>` +
			`Vue : <b>-${Math.floor(vue / 3)}</b>`;
	}
	return texte;
}

/*                                 Main                                   */

function do_profil2() {
	try {
		start_script(31, 'do_profil2_log');

		extractionDonnees();
		setInfosCaracteristiques();
		setInfoDescription();
		setInfosEtatLieux();
		setInfosEtatPV();
		setInfosExp();
		setInfosFatiguesOptimiales();

		creerBulleVide();
		traitementTalents();
		setLienAnatrolliseur();

		// Cette fonction modifie lourdement le DOM, à placer en dernier :
		if (race == 'Kastar' || MY_DEBUG) {
			setAccel();
		}
		saveProfil();
		displayScriptTime(undefined, 'do_profil2_log');
	} catch (exc) {
		avertissement(`Une erreur est survenue (do_profil2)`, null, null, exc);
	}
}

/** *****************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

/** x~x md5.js --------------------------------------------------------- */
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) {
	return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function b64_md5(s) {
	return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}
function str_md5(s) {
	return binl2str(core_md5(str2binl(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
	return binl2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
	return binl2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
	return binl2str(core_hmac_md5(key, data));
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
	return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
	/* append padding */
	x[len >> 5] |= 0x80 << len % 32;
	x[(len + 64 >>> 9 << 4) + 14] = len;

	let a = 1732584193;
	let b = -271733879;
	let c = -1732584194;
	let d = 271733878;

	for (let i = 0; i < x.length; i = i + 16) {
		let olda = a;
		let oldb = b;
		let oldc = c;
		let oldd = d;

		a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
		d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
		c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
		b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
		a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
		d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
		c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
		b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
		a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
		d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
		c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
		b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
		a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
		d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
		c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
		b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

		a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
		d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
		c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
		b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
		a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
		d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
		c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
		b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
		a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
		d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
		c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
		b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
		a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
		d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
		c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
		b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

		a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
		d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
		c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
		b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
		a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
		d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
		c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
		b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
		a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
		d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
		c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
		b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
		a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
		d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
		c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
		b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

		a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
		d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
		c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
		b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
		a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
		d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
		c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
		b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
		a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
		d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
		c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
		b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
		a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
		d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
		c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
		b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
	}
	return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
	return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
	return md5_cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
	return md5_cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
	return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
	return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
	let bkey = str2binl(key);
	if (bkey.length > 16) {
		bkey = core_md5(bkey, key.length * chrsz);
	}

	let ipad = Array(16), opad = Array(16);
	for (let i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5C5C5C5C;
	}

	let hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
	return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
	let lsw = (x & 0xFFFF) + (y & 0xFFFF);
	let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 0xFFFF;
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
	return num << cnt | num >>> 32 - cnt;
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
	let bin = Array();
	let mask = (1 << chrsz) - 1;
	for (let i = 0; i < str.length * chrsz; i = i + chrsz) {
		bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
	}
	return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
	let str = "";
	let mask = (1 << chrsz) - 1;
	for (let i = 0; i < bin.length * 32; i = i + chrsz) {
		str = str + String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
	}
	return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
	let hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	let str = "";
	for (let i = 0; i < binarray.length * 4; i++) {
		str = str + (hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) +
			hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF));
	}
	return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
	let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let str = "";
	for (let i = 0; i < binarray.length * 4; i = i + 3) {
		let triplet = (binarray[i >> 2] >> 8 * (i % 4) & 0xFF) << 16 |
			(binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 0xFF) << 8 |
			binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 0xFF;
		for (let j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > binarray.length * 32) {
				str = str + b64pad;
			} else {
				str = str + tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
			}
		}
	}
	return str;
}

/** x~x Tests et essais ------------------------------------------------ */

// /////////////////////////////////////////
// debug cartes capitan Roule 07/12/2016
// /////////////////////////////////
// essais : objet
//	.mode : description
//	.essais : tableau d'objets essai
//		.mode : description
//		.essais : tableau de cartes
//			.noCarte : id de la carte
//			.essais : tableau d'essais, [x, y, n, nb]
function AfficheEssais(essais, sMode) {
	let eBigDiv = document.getElementById('ListeEssaiCapitan');
	if (!eBigDiv) {
		let insertPoint = getFooter();
		eBigDiv = document.createElement('table');
		eBigDiv.id = 'ListeEssaiCapitan';
		insertBefore(insertPoint, document.createElement('p'));
		insertTitle(insertPoint, 'Capitan : Liste des essais');
		insertBefore(insertPoint, eBigDiv);
		addTrEssais(eBigDiv, 'mode', 'carte', 'nombre d\'essais', true);
	}
	if (!essais) {
		addTrEssais(eBigDiv, sMode, '', 'pas d\'essai', false);
		return;
	}
	let carte;
	for (carte in essais) {
		addTrEssais(eBigDiv, sMode, carte, `${essais[carte]} essai(s)`, false);
	}
	if (carte === undefined) {
		addTrEssais(eBigDiv, sMode, '', '0 essai', false);
	}
}

function addTrEssais(eTable, sMode, sCarte, sText, bBold) {
	let tr = appendTr(eTable);
	let td = appendTd(tr);
	appendText(td, sMode, bBold);
	td = appendTd(tr);
	appendText(td, sCarte, bBold);
	td = appendTd(tr);
	appendText(td, sText, bBold);
}

function getEssaiV1_0() {
	try {
		let prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefs = prefs.getBranch("mountyzilla.storage.capitan.");
		let tabK, nK;
		prefs.getChildList('', nK, tabK);
		logMZ(`getEssaiV1_0, nb key : ${nK}`);
		// logMZ('getEssaiV1_0, ' + nK);
		return;
		// return r;
	} catch (exc) {
		logMZ('getEssaiV1_0', exc);
	}
}

function getEssaiV1_1() {
	let locSto = window.localStorage;
	logMZ(`getEssaiV1_1, nb key : ${locSto.length}`);
	let r = [];
	for (let i = 0; i < locSto.length; i++) {
		let k = locSto.key(i);
		// logMZ('getEssaiV1_1 key ' + k + ' => ' + locSto.getItem(k));
		let t = k.split(/\./);
		if (t[0] !== 'capitan') {
			continue;
		}
		if (t[2] !== 'essai') {
			continue;
		}
		let carte = `carte n°${t[1]}`;
		if (r[carte]) {
			r[carte]++;
		} else {
			r[carte] = 1;
		}
		// logMZ('getEssaiV1_1 r[' + carte + ']=' + r[carte]);
	}
	return r;
}

function showEssaiCartes() {
	logMZ('début showEssai Tout_MZ');
	let essais = getEssaiV1_0();
	AfficheEssais(essais, 'V1.0');
	essais = getEssaiV1_1();
	AfficheEssais(essais, 'V1.1');
	logMZ('fin showEssai Tout_MZ');
}

function testBoolLocalStorage() {
	let b = true;
	let key = 'MZ_essai_bool';
	GM_setValue(key, b);
	window.localStorage[key] = b;
	let v = GM_getValue(key);
	logMZ(`recup GM true => ${v}, ${typeof v}`);
	v = window.localStorage.getItem(key);
	logMZ(`recup localstorage true => ${v}, ${typeof v}`);	// localStorage nous rend une chaine 'true' :(

	b = false;
	GM_setValue(key, b);
	window.localStorage[key] = b;
	v = GM_getValue(key);
	logMZ(`recup GM false => ${v}, ${typeof v}`);
	v = window.localStorage.getItem(key);
	logMZ(`recup localstorage false => ${v}, ${typeof v}`);

	let x = window.localStorage.getItem('lkjlkjerziurlijzer');
	logMZ(`recup LocalStorage inconnu => ${typeof x}`);	// object null
	let y = GM_getValue('654654897894654654');
	logMZ(`recup GM inconnu => ${typeof y}`);	// undefined
	logMZ(`égalité ? => ${x == y}`);	// les deux sont "égaux" avec l'opérateur == (pas avec ===, bien sûr)
}

/* --------------------------------- Création liste trolligion --------------------------------- */
function export_trolligion() {
	let txt = '';
	try {
		let tabDl = document.getElementsByTagName('dl');
		if (!tabDl || !tabDl[0]) {
			logMZ(`pas de dl`);
			return;
		}
		let tabDieux = [];	// chaque élément est un objet avec les propriétés suivantes
		// nom : string
		// rayonnement : entier
		// grades : table d'objets (une occurence par grade)
		// nom : string
		// trolls : table d'objets (un par Trõll)
		// id
		// nom
		// idguilde
		// guilde
		// race
		// niveau
		// ferveur
		let currentDieu;
		let currentGrade;
		for (let iChild1 in tabDl[0].children) {
			let eChild1 = tabDl[0].children[iChild1];
			if (eChild1.tagName) {
				switch (eChild1.tagName.toLowerCase()) {
					case 'dd':	// Trõll
						let oTroll = {};
						export_trolligion_analyse(oTroll, eChild1);
						currentGrade.trolls.push(oTroll);
						break;
					case 'dt':
						let tabH3 = eChild1.getElementsByTagName('h3');
						if (tabH3 && tabH3[0]) {	// changement de dieu
							currentDieu = {
								nom: tabH3[0].innerText || tabH3[0].textContent,
								grades: []
							};
							txt = eChild1.innerText || eChild1.textContent;
							let m = txt.match(/yon*ement *:* *(\d+)/);
							if (m) {
								currentDieu.rayonnement = parseInt(m[1]);
							}
							currentGrade = undefined;
							tabDieux.push(currentDieu);
							break;
						}
						let tabH4 = eChild1.getElementsByTagName('h4');
						if (tabH4 && tabH4[0]) {	// changement de grade
							let grade;
							txt = tabH4[0].innerText || tabH4[0].textContent;
							let tabI = tabH4[0].getElementsByTagName('i');
							if (tabI && tabI[0]) {
								grade = tabI[0].innerText || tabI[0].textContent;
								grade = grade.replace(/"/g, '');
								let m = txt.match(/\((.*)\)/);	// cas particulier Líhã dont les grades ont des catégories
								if (m) {
									grade = `${grade} (${m[1]})`;
								}
							} else {
								grade = txt.replace(/"/g, '');
							}
							currentGrade = { nom: grade, trolls: [] };
							currentDieu.grades.push(currentGrade);
							break;
						}
						logMZ(`ignore tag dt ${eChild1.innerHTML}`);
						break;
					default:
						logMZ(`ignore tag ${eChild1.tagName}`); // + ' ' + eChild1);
				}
			}
		}

		// logMZ('nb dieux = ' + tabDieux.length);
		// logMZ(' + JSON.stringify(tabDieux));
		txt = "Dieu\tRayonnement\tGrade\tidTroll\tTroll\tidGuilde\tGuilde\tRace\tNiveau\tFerveur\n";
		let txt2 = "Dieu\tRayonnement\n";	// Roule 25/01/2017 ajout d'un tableau résumé par religion
		for (let iDieu in tabDieux) {
			let oDieu = tabDieux[iDieu];
			for (let iGrade in oDieu.grades) {
				let oGrade = oDieu.grades[iGrade];
				for (let iTroll in oGrade.trolls) {
					let oTroll = oGrade.trolls[iTroll];
					let t = [oDieu.nom, oDieu.rayonnement,
					oGrade.nom,
					oTroll.id, oTroll.nom,
					oTroll.idguilde, oTroll.guilde,
					oTroll.race, oTroll.niveau,
					oTroll.ferveur];
					for (let iParam in t) {
						if (t[iParam] === undefined) {
							t[iParam] = '';
						}	// protection
						t[iParam] = t[iParam].toString().replace(/[\n\r\t]/g, ' ').trim();	// plus de protection
					}
					txt = `${txt}${t.join("\t")}\n`;
				}
			}
			let t = [oDieu.nom, oDieu.rayonnement];
			for (let iParam in t) {
				if (t[iParam] === undefined) {
					t[iParam] = '';
				}	// protection
				t[iParam] = t[iParam].toString().replace(/[\n\r\t]/g, ' ').trim();	// plus de protection
			}
			txt2 = `${txt2}${t.join("\t")}\n`;
		}
		txt = `${txt}\n${txt2}`;
	} catch (exc) {
		avertissement(`Échec durant l'export de trolligion`, null, null, exc);
	}
	try {
		if (copyTextToClipboard(txt)) {
			avertissement("Les données ont été copiées dans le presse-papier\n" +
				"Collez dans Calc\nou, au pire, dans EXCEL®");
		} else {
			avertissement("Échec durant la copie vers le presse-papier");
		}
	} catch (exc) {
		avertissement(`Échec durant la copie vers le presse-papier`, exc);
	}
}

function export_trolligion_analyse(oTroll, eChild1) {
	for (let iChild2 in eChild1.childNodes) {	// childNodes pour obtenir les éléments texte aussi
		let eChild2 = eChild1.childNodes[iChild2];
		if (eChild2.nodeType === undefined) {
			continue;
		}	// properties
		// logMZ('eChild2 ' + iChild2 + ' ' + eChild2.nodeName);
		switch (eChild2.nodeType) {
			case 1:	// ELEMENT_NODE:
				switch (eChild2.nodeName.toLowerCase()) {
					case 'a':
						let m;
						if (!eChild2.href) {
							logMZ(`a sans href ${eChild2.outerHTML}`);
							break;
						}
						m = eChild2.href.match(/EnterPJView\((\d+) *,/);
						if (m) {
							oTroll.id = parseInt(m[1]);
							oTroll.nom = (eChild2.innerText || eChild2.textContent).trim();
							break;
						}
						m = eChild2.href.match(/EnterAllianceView\((\d+) *,/);
						if (m) {
							let idGuilde = parseInt(m[1]);
							if (idGuilde > 1) {	// MH donne 1 comme idGuilde quand le Trõll n'est pas guildé
								oTroll.idguilde = parseInt(m[1]);
								oTroll.guilde = (eChild2.innerText || eChild2.textContent).trim();
							}
							break;
						}
						logMZ(`a non traité ${eChild2.outerHTML}`);
						break;
					case 'br':	// ignore
					case 'style':	// ignore
					case 'img':	// ignore
						break;
					case 'div':	// barre de vie
						if (eChild2.style && eChild2.style.width) {
							oTroll.ferveur = eChild2.style.width;
							break;
						}
						// logMZ(eChild2.innerHTML);
						export_trolligion_analyse(oTroll, eChild2);
						// logMZ('troll ' + JSON.stringify(oTroll));
						break;
					default:
						logMZ(`ignore élément tag ${eChild2.nodeName}`);
						break;
				}
				break;
			case 3:	// TEXT_NODE:
				let txt = eChild2.nodeValue.trim();
				if (txt === '') {
					break;
				}
				let m = txt.match(/(.*) *\((\d+)\)/);
				if (m) {
					oTroll.race = m[1].trim();
					oTroll.niveau = parseInt(m[2]);
				} else {
					oTroll.race = txt;
				}
				break;
			default:	// ne devrait pas arriver
				logMZ(`ignore élément type ${eChild2.nodeType}`);
				break;
		}
	}
}

function do_trolligion() {
	let divpopup = document.createElement('div');
	divpopup.id = 'MZ_divCopier';
	divpopup.style.position = 'fixed';
	divpopup.style.top = '2px';
	divpopup.style.left = '2px;';
	divpopup.style.backgroundColor = 'rgba(255,255,255,0.5)';
	divpopup.style.cursor = 'pointer';
	divpopup.style.zIndex = 200;
	divpopup.title = '[MZ] Cliquer ici pour copier les données';
	divpopup.onclick = export_trolligion;
	let img = createAltImage(`${URL_MZimg}copy_32.png`, 'Cliquer ici pour copier les données');
	divpopup.appendChild(img);
	document.body.appendChild(divpopup);
}

function do_memoPA() {
	let t = document.body.innerText;
	let m = t.match(/Il\s*me\s*reste\s*(\d+)\s*PA/i);
	//debugMZ('do_memoPA_log t=' + t);
	//debugMZ('do_memoPA_log m=' + JSON.stringify(m));
	if (m && m.length > 1) {
		let pa = parseInt(m[1], 10);
		if (numTroll !== undefined && !isNaN(pa)) MY_setValue(numTroll + '.PA', pa);
	}
}

function MZ_extern_param() {
	if (!document.body.MZ_Params) {
		return;
	}
	if (document.body.MZ_Params.INFOCARAC != undefined) {
		MY_setValue('INFOCARAC', document.body.MZ_Params.INFOCARAC);
	}
	if (document.body.MZ_Params.PRINTSTACK != undefined) {
		MY_setValue('PRINTSTACK', document.body.MZ_Params.PRINTSTACK);
	}
	if (document.body.MZ_Params.CONFIRMEDECALAGE != undefined) {
		MY_setValue('CONFIRMEDECALAGE', document.body.MZ_Params.CONFIRMEDECALAGE);
	}
	if (document.body.MZ_Params.COMPTEAREBOURSDLA != undefined) {
		MY_setValue('COMPTEAREBOURSDLA', document.body.MZ_Params.COMPTEAREBOURSDLA);
	}
	if (document.body.MZ_Params.COMPTEAREBOURSTITRE != undefined) {
		MY_setValue('COMPTEAREBOURSTITRE', document.body.MZ_Params.COMPTEAREBOURSTITRE);
	}
	if (document.body.MZ_Params.COMPTEAREBOURSSUIVANTE != undefined) {
		MY_setValue('COMPTEAREBOURSSUIVANTE', document.body.MZ_Params.COMPTEAREBOURSSUIVANTE);
	}
	if (document.body.MZ_Params.MZ_SuivantsOrdres != undefined) {
		MY_setValue('MZ_SuivantsOrdres', document.body.MZ_Params.MZ_SuivantsOrdres);
	}
	if (document.body.MZ_Params.MZ_SuivantsCompress != undefined) {
		MY_setValue('MZ_SuivantsCompress', document.body.MZ_Params.MZ_SuivantsCompress);
	}
	if (document.body.MZ_Params.MZ_SuivantsTresUnique != undefined) {
		MY_setValue('MZ_SuivantsTresUnique', document.body.MZ_Params.MZ_SuivantsTresUnique);
	}
}

function MZ_CompoTanieresPrepare(eTable) {
	if (!eTable) {
		eTable = document.getElementById('tabTresorInfo');
	}
	if (!eTable) {
		debugMZ('MZ_CompoTanieresPrepare erreur, impossible de trouver tabTresorInfo');
		return;
	}
	let eDiv = document.getElementById('MZ_CompoTanieres');
	if (eDiv) {
		debugMZ('MZ_CompoTanieresPrepare div MZ_CompoTanieres déjà là');
		return;
	}
	let oInfo = MZ_AnalyseInfoHistoTresor(eTable);
	if (oInfo.type != 'Composant') {
		debugMZ(`MZ_CompoTanieresPrepare div MZ_CompoTanieres pas composant (${oInfo.type})`);
		return;
	}
	debugMZ('MZ_CompoTanieresPrepare création div MZ_CompoTanieres');
	let eNew = document.createElement('table');
	eNew.id = 'MZ_CompoTanieres';
	eNew.className = 'mh_tdborder';
	eNew.style.width = '98%';
	eNew.style.margin = 'auto';
	let eTr = document.createElement('tr');
	let eTd = document.createElement('td');
	eTd.className = 'mh_tdpage';
	eTd.style.cursor = 'pointer';
	eTd.style.color = 'blue';
	eTd.onclick = MZ_doSearchCompoTanieres;
	eTd.appendChild(document.createTextNode(`[MZ] Voir mes compos de ${oInfo.monstre} en tanière`));
	eTr.appendChild(eTd);
	eNew.appendChild(eTr);
	eTable.parentNode.insertBefore(eNew, eTable.nextSibling);
}

function MZ_doSearchCompoTanieres(event) {
	let eTableTaniere = document.getElementById('MZ_CompoTanieres');
	if (!eTableTaniere) {
		logMZ('MZ_doSearchCompoTanieres, erreur, pas de MZ_CompoTanieres');
		return;
	}
	let eTableMH = document.getElementById('tabTresorInfo');
	if (!eTableMH) {
		logMZ('MZ_doSearchCompoTanieres, erreur, impossible de trouver tabTresorInfo');
		return;
	}
	let oInfo = MZ_AnalyseInfoHistoTresor(eTableMH);
	if (oInfo.type != 'Composant') {
		logMZ('MZ_doSearchCompoTanieres, erreur, pas sur un compo');
		return;
	}
	let url = `/mountyhall/MH_Comptoirs/Comptoir_Recherche.php?as_type=Composant&as_nom_base=${oInfo.monstre}&as_Action=Rechercher`;
	if (!event) {
		url = `${url}&as_composant_morceau=${oInfo.composant}`;
	}
	FF_XMLHttpRequest({
		method: 'GET',
		HTML: true,
		url: url,
		trace: `recherche en tanière compos ${oInfo.monstre}`,
		onload: function (responseDetails) {
			try {
				// logMZ('MZ_doSearchCompoTanieres readyState=' + responseDetails.readyState + ', error=' + responseDetails.error + ', status=' + responseDetails.status);
				if (responseDetails.status == 0) {
					return;
				}
				let eDivRecherches = responseDetails.responseXML.getElementById('recherches');
				if (!eDivRecherches) {
					logMZ('MZ_doSearchCompoTanieres réponse sans DIV recherches');
					return;
				}
				let oCompos = {};
				let bFound = false;
				let nTotal = 0;
				for (let eDiv of eDivRecherches.children) {
					if (eDiv.tagName != 'DIV') {
						continue;
					}
					let oTable = eDiv.getElementsByTagName('table')[0];
					if (!oTable) {
						continue;
					}
					for (let oTr of oTable.rows) {
						for (let oTd of oTr.cells) {
							let tabA = oTd.getElementsByTagName('a');
							if (!tabA[0]) {
								continue;
							}
							if (tabA[0].href.indexOf('TresorHistory.php') <= 0) {
								continue;
							}
							let m = oTd.textContent.match(/^(.*) d'une* (.*) de Qualité (.*) \[/i);
							if (!m) {
								debugMZ(`MZ_doSearchCompoTanieres no match ${oTd.textContent}`);
								continue;
							}
							let compo = m[1];
							let monstre = m[2];
							let qualite = m[3];
							let oCompo = oCompos[compo];
							if (oCompo == undefined) {
								oCompo = {};
								oCompos[compo] = oCompo;
							}
							let qty = oCompo[qualite];
							if (qty == undefined) {
								qty = 0;
							}
							oCompo[qualite] = ++qty;
							nTotal++;
							bFound = true;
						}
					}
				}
				while (eTableTaniere.rows.length > 0) {
					eTableTaniere.deleteRow(0);
				}
				let eTr = document.createElement('tr');
				let eTd = document.createElement('td');
				eTd.className = 'mh_tdpage';
				let bErreur = false;
				let color = 'blue';
				let sMsg = '';
				if (!bFound) {
					sMsg = 'Pas de ';
					if (!event) {
						sMsg = sMsg + oInfo.composant;
					} else {
						sMsg = `${sMsg}composant`;
					}
					sMsg = `${sMsg} de ${oInfo.monstre} en tanière`;
					bErreur = true;
					color = 'red';
				} else if (nTotal < 100) {
					if (!event) {
						sMsg = `Vous avez au moins 100 composants de ${oInfo.monstre} en tanière.`;
						sMsg = `${sMsg} La recherche a été restreinte aux composants de type ${oInfo.composant}`;
						color = 'purple';
					} else {
						sMsg = `Composants de ${oInfo.monstre} en tanière`;
					}
					eTd.colSpan = 6;
				} else if (!event) {
					bErreur = true;
					color = 'red';
					sMsg = `Vous avez au moins 100 ${oInfo.composant} de ${oInfo.monstre}. MZ met les pouces.`;
				} else {
					MZ_doSearchCompoTanieres(false);
					return;
				}
				eTd.style.color = color;
				eTd.appendChild(document.createTextNode(`[MZ] ${sMsg}`));
				eTr.appendChild(eTd);
				eTableTaniere.appendChild(eTr);
				if (bErreur) {
					return;
				}
				debugMZ(`MZ_doSearchCompoTanieres réponse OK ${JSON.stringify(oCompos)}`);
				// tri par nom de compo
				let tabTri = [];
				for (let compo in oCompos) {
					tabTri.push(compo);
				}
				if (!tabTri.includes(oInfo.composant)) {
					tabTri.push(oInfo.composant);
				}
				tabTri.sort();
				eTr = document.createElement('tr');
				eTr.className = 'mh_tdtitre';
				let tabQualite = ['', 'Très Bonne', 'Bonne', 'Moyenne', 'Mauvaise', 'Très Mauvaise'];
				for (let qualite of tabQualite) {
					let eTh = document.createElement('th');
					eTh.appendChild(document.createTextNode(qualite));
					if (qualite == '') {
						eTh.style.width = '30%';
					} else {
						eTh.style.width = '14%';
					}
					eTh.style.border = 'solid black 1px';
					eTr.appendChild(eTh);
				}
				eTableTaniere.appendChild(eTr);
				for (let compo of tabTri) {
					eTr = document.createElement('tr');
					for (let qualite of tabQualite) {
						eTd = document.createElement('td');
						eTd.style.border = 'solid black 1px';
						eTd.className = 'mh_tdpage';
						if (oInfo.composant == compo && oInfo.qualite == qualite) {
							eTd.style.background = 'white';
						} else {
						}
						if (qualite == '') {
							eTd.appendChild(document.createTextNode(compo));
						} else if (oCompos[compo] && oCompos[compo][qualite]) {
							eTd.appendChild(document.createTextNode(oCompos[compo][qualite]));
							eTd.style.textAlign = 'right';
						}
						eTr.appendChild(eTd);
					}
					eTableTaniere.appendChild(eTr);
				}
			} catch (exc) {
				logMZ('compo taniere .onload', exc);
			}
		},
	});
}

function MZ_AnalyseInfoHistoTresor(eTable, oRet) {
	if (oRet == undefined) {
		oRet = {};
	}
	for (let oTr of eTable.rows) {
		if (oTr.cells[0] == undefined) {
			// ça arrive
			// debugMZ('MZ_AnalyseInfoHistoTresor pas de oTr.cells[0] => ' + JSON.stringify(oTr));
			continue;
		}
		if (oTr.cells[0].className == 'titre2' || oTr.className == 'mh_tdtitre') {
			let s = oTr.cells[0].textContent;
			let m = s.match(/\] (.*) d'une* (.+) de Qualité (.*) \[/i);
			if (m) {
				debugMZ(`MZ_AnalyseInfoHistoTresor match titre => ${JSON.stringify(m)}`);
				oRet.monstre = m[2];
				oRet.composant = m[1];
				oRet.qualite = m[3];
			} else {
				debugMZ(`MZ_AnalyseInfoHistoTresor no match titre ${s}, class=${oTr.cells[0].className}`);
			}
			continue;
		}
		if (oTr.cells.length < 2) {
			for (let oT2 of oTr.cells[0].getElementsByTagName('table')) {
				MZ_AnalyseInfoHistoTresor(oT2, oRet);
			}	// appel récursif
			continue;
		}
		let c0 = oTr.cells[0].textContent;
		// debugMZ('MZ_AnalyseInfoHistoTresor nb cell=' + oTr.cells.length + ' [' + c0 + '][' + oTr.cells[1].textContent + ']');
		if (c0.match(/Type/i)) {
			oRet.type = oTr.cells[1].textContent;
			continue;
		}
	}
	return oRet;
}

var MZ_hookCompoTanieresCounter;

function MZ_CompoTanieresCallback() {
	let eTable = document.getElementById('tabTresorInfo');
	if (!eTable) {
		debugMZ(`MZ_CompoTanieresCallback pas de tabTresorInfo`);
		if (MZ_hookCompoTanieresCounter--) {
			window.setTimeout(MZ_CompoTanieresCallback, 100);
		} else {
			MZ_hookCompoTanieresCounter = undefined;
		}
		return;
	}
	MZ_hookCompoTanieresCounter = undefined;
	MZ_CompoTanieresPrepare(eTable);
}

function MZdo_hookCompoTanieres() {
	debugMZ('do_hookCompoTanieres');
	let hookSetCallback = function () {
		if (MZ_hookCompoTanieresCounter != undefined) {
			MZ_hookCompoTanieresCounter = MZ_hookCompoTanieresCounter + 50;
			return;
		}
		MZ_hookCompoTanieresCounter = 50;
		window.setTimeout(MZ_CompoTanieresCallback, 100);
	};
	document.body.onclick = hookSetCallback;
	document.body.onkeypress = hookSetCallback;
}

/* --------------------------------- Dispatch --------------------------------- */

// chargerScriptDev("libs");
// chargerScriptDev("ALWAYS");	// ALWAYS contient des aides au test (GOD-MODE ;)
// if (isDEV) testBoolLocalStorage();
/* Roule, test getPVsRestants
	let pv = 'Inimaginables (supérieurs à 200)';
	let pvminmax = pv.match(/\d+/g);
	let oMinMaxPV = {min: pvminmax[0], max: pvminmax[1]};
	logMZ('minmax=' + JSON.stringify(pvminmax) + ', oMinMaxPV=' + JSON.stringify(oMinMaxPV));
	logMZ('ret getPVsRestants=' + JSON.stringify(getPVsRestants(pv, '±70%')));
	logMZ('ret getPVsRestants=' + JSON.stringify(getPVsRestants(pv, '±70%', true)));
*/

var MZ_fo_tresor = isPageWithParam({url: 'MH_Play/Play_a_Action', ids:['t_fo_equip']});
try {
	// Détection de la page à traiter
	if (isPage("MH_Play/PlayStart2")) {
		replaceLinkMHtoMZ();
	} else if (isPage("MH_Play/TurnStart")) {
		updateNumTroll();
	} else if (MZ_fo_ordres) {
		do_ordresgowap();
	} else if (isPage("MH_Play/Play_a_ActionResult")) {
		debugMZ(`Play_a_ActionResult id=${document.body.id}`);
		switch (document.body.id) {
			case 'p_comptenceconnaissancedesmonstres':
				do_cdmcomp();
				break;
		}
	} else if (isPage("Messagerie/ViewMessageBot")) {
		do_cdmbot();
	} else if (isPage("MH_Play/Play_a_TalentResult")) {
		do_cdmcomp();
	} else if (isPage("MH_Guildes/Guilde_o_AmiEnnemi")) {
		do_diplo();
	} else if (isPage("MH_Play/Play_equipement")) {
		do_equip();
	} else if (isPage("MH_Play/Play_menu")) {
		do_menu();
	} else if (isPage("MH_Play/Options/Play_o_Interface") || isPage("installPack")) {
		do_option();
		// showEssaiCartes();
	} else if (isPage("View/PJView_Events")) {
		do_scizOverwriteEvents(); /* SCIZ */
	} else if (isPage("View/PJView")) {
		do_pjview();
	} else if (isPage("MH_Taniere/TanierePJ_o_Stock") || isPage("MH_Comptoirs/Comptoir_o_Stock")) {
		do_tancompo();
	} else if (isPage("MH_Play/Play_vue")) {
		do_vue();
		do_scizEnhanceView(); /* SCIZ */
	} else if (isPage("MH_Play/Play_news")) {
		do_news();
	} else if (isPage("MH_Play/Play_evenement")) {
		do_scizOverwriteEvents(); /* SCIZ */
	} else if (isPageWithParam({url: 'MH_Play/Play_a_Action', params: {type: 'C', id: 12}})) {
		do_move();
	} else if (isPageWithParam({url: 'MH_Play/Play_a_Action', params: {type: 'A', id: 1}})) {
		do_move();
	} else if (isPage("MH_Missions/Mission_Etape")) {
		do_mission();
	} else if (isPage("View/MonsterView")) {
		do_infomonstre();
		do_scizOverwriteEvents(); /* SCIZ */
	} else if (isPage("MH_Play/Play_e_follo.php")) {
		do_listegowap();
	} else if (isPage("MH_Lieux/Lieu_Description.php")) {
		do_lieuDescription();
	} else if (isPage("MH_Lieux/Lieu_Teleport")) {
		do_lieuTeleport();
	} else if (MZ_fo_tresor) {
		do_equipgowap();
	} else if (isPage("MH_Play/Play_mouche")) {
		do_mouches();
	} else if (isPage("MH_Play/Play_BM")) {
		do_malus();
	} else if (isPage("MH_Play/Play_evenement")) {
		do_myevent();
	} else if (isPage("MH_Lieux/Lieu_DemanderEnchantement")) {
		do_enchant();
	} else if (isPage("MH_Lieux/Lieu_Enchanteur")) {
		do_pre_enchant();
	} else if (isPage("MH_Play/Actions") || isPage("Messagerie/ViewMessageBot")) {	// 25/03/2024 MH_Play/Actions n'existe plus. À surveiller...
		do_actions();
	} else if (isPage('MH_Missions/Mission_Liste.php')) { // Roule 28/03/2016 je n'ai pas vu l'utilité et ça bloque... && MY_getValue(numTroll+'.MISSIONS')) {
		do_mission_liste();
	} else if (isPage('MH_Play/Play_action')) {
		do_actions();
	} else if (isPage("MH_Play/Play_profil") && !isPage('MH_Play/Play_profil2')) {
		do_profil2();
	} else if (isPage('MH_Play/Play_profil2')) {
		do_profil2();
	} else if (isPage('View/TrolligionView.php')) {
		do_trolligion();
	} else if (isPage('View/TresorHistory.php')) {
		MZ_CompoTanieresPrepare();
	}
	if (isPage('MH_Play/Play_equipement.php') ||
		isPage('MH_Play/Play_e_follo.php') ||
		MZ_fo_tresor ||
		isPage('MH_Taniere/TanierePJ_o_Stock.php') ||
		isPage('MH_Comptoirs/Comptoir_Recherche.php')) {
		MZdo_hookCompoTanieres();
	}
	if (document.body.dataset.MZ_Etat === undefined) {	// si l'état a été positionné par quelqu'un d'autre, laisser tel quel
		document.body.dataset.MZ_Etat = 1;	// indiquer aux scripts tiers qu'on a fini la première initialisation
	}
	if (document.body.MZ_Callback_init !== undefined) {
		for (let iCallback = 0; iCallback < document.body.MZ_Callback_init.length; iCallback++) {
			document.body.MZ_Callback_init[iCallback]();
		}
	}
	setTimeout(MZ_extern_param, 500);
} catch (exc) {
	logMZ(`Catch général page ${window.location.pathname}`, exc);
}
