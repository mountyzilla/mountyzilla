// ==UserScript==
// @author TilK, Dabihul, Rouletabille
// @description Aide à la recherche de cachettes de Capitan
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @include */mountyhall/View/TresorHistory*
// @include */mountyhall/MH_Play/Play_a_TrouverCachette2*
// @include */mountyhall/MH_Play/Play_equipement.php*
// @include */mountyhall/MH_Taniere/TanierePJ_o_Stock.php*
// @include */mountyhall/MH_Play/Play_a_ActionResult.php*
// @exclude *mh2.mh.raistlin.fr*
// @exclude *mzdev.mh.raistlin.fr*
// @name Capitan
// @version 8.8.16
// @namespace https://greasyfork.org/users/70018
// ==/UserScript==

/****************************************************************
*         Aide à la recherche de cachettes de Capitan           *
*              Développé par Mini TilK (n°36216)                *
*                      mini@tilk.info                           *
*****************************************************************
*        Adapté pour GreaseMonkey par Dabihul (n°79738)         *
*        Roule : ajout https 07/08/2016                         *
*****************************************************************
*         Pour utiliser la recherche, allez des les infos       *
*             de la carte de la cachette du capitan             *
*                    Une fois ceci fait,                        *
*           toutes les recherches seront sauvergardées          *
*            Et dans le détail de la carte vous verrez          *
*       Le nombre de cachettes possibles et leur position       *
****************************************************************/

/*
Roule 06/02/2024 V8.8.14
	Remise en route
Roule 01/05/2023 V8.8.13
	Adaptation modif de présentation MH
Roule 27/11/2021 V8.8.12
	Fix résultat pas remis à zéro quand on affiche une 2e fois
Roule 03/01/2021 V8.8.10
	Réécriture de la recherche des solutions
Roule 26/11/2020 V8.8.09
	Fix suppression d'essai
Roule 16/10/2020 V8.8.08
	Adaptation à des modifications MH
Roule 07/10/2020 V8.8.07
	Adaptation à des modifications MH
disciple 17/06/2020 V8.8.06
	Correction ± #2
Roule 05/08/2018 V8.8.04
	Saut de version suite à une erreur de numérotation
	Correction ± (Tu es => Vous êtes)
Roule 05/08/2018 V8.2.03
	Passage en objet pour assurer l'indépendance par rapport aux autres scripts
	Blindage de la détection sous/hors GreaseMonkey ou ViolentMonkey
Roule 05/08/2018 V8.1.67
	Correction ±
Roule 04/08/2018 V8.1.66
	Utilisation hors GM
Roule 25/08/2017 V8.1.61
	Réactivation de la gestion des signes (+/-)
Roule 23/11/2016 V8.1.6
	Adaptation à l'affichage en popup dans les tanières (méthode toujours très discutable par setInterval)
Roule 09/12/2016 V8.1.5
	Nouvelle méthode de migration des essais V1.0 par copier/coller de tout pref.js
Roule 23/11/2016 V8.1.4
	Adaptation à l'affichage en popup du détail d'un équipement (méthode très discutable par setInterval)
Roule 14/10/2016 V8.1.3
	simplification de l'entête GM (include)
	passage à greasyfork
Roule 24 à 26/08/2016 V8.1.2
	Ajout outils de récupération des recherches pré Greasemonkey
Roule 15/08/2016 V8.1.1
	Ajout demande d'avis sur la position courante sur le site Psyko-Chasseurs
	Quelques corrections de calcul (on avait du NaN)
Roule 08 à 10/08/2016
	recopie ici de this.appendButton() version MZ
	Ajout liste des essais et possibilité d'en supprimer
	Ajout lien vers Psyko Chasseurs
	Adaptation aux IDs dans la page de résultat d'une recherche de cachette (et plus besoin de stocker le numéro de carte)
*/

/* 05/08/2018 passage en objet
	avantages
		indépendance du nomage par rapport aux autres scripts (il y avait effectivement un souci aléatoire sans doute lié à une collision de nom)
	inconvénient
		syntaxe plus compliquée (utilisation de this, déclaration pas naturelle des fonctions
		complexité pour l'utilisation des callback (par exemple setIntervale)
*/

var oCAPITAN_MH_ROULE;
if (oCAPITAN_MH_ROULE instanceof Object) {
	window.console.log("script capitan déjà chargé");	// ça arrive dans le cas de l'affichage des détails d'une carte en popup
} else {
	oCAPITAN_MH_ROULE = {
		bDebug: false,
		appendButton: function(paren,value,onClick) {
			var input = document.createElement('input');
			input.type = 'button';
			input.className = 'mh_form_submit';
			input.value = value;
			input.onmouseover = function(){this.style.cursor='pointer';};
			if (onClick) input.onclick = onClick;
			paren.appendChild(input);
			return input;
		},

		/* Ajout des éléments manquants de libs */
		isPage: function(url) {
			return window.location.href.indexOf(url)!=-1;
		},

		insertTitle: function(next,txt) {
			var div = document.createElement('div');
			div.className = 'titre2';
			this.appendText(div,txt);
			this.insertBefore(next,div);
		},

		insertBefore: function(next,el) {
			next.parentNode.this.insertBefore(el,next);
		},

		// Roule 08/08/2016 ajout cssClass
		appendTr: function(tbody, cssClass) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
			if (cssClass) tr.className = cssClass;
			return tr;
		},

		appendTd: function(tr) {
			var td = document.createElement('td');
			if(tr) { tr.appendChild(td); }
			return td;
		},

		appendText: function(paren,text,bold) {
			if(bold) {
				var b = document.createElement('b');
				b.appendChild(document.createTextNode(text));
				paren.appendChild(b);
				}
			else
				paren.appendChild(document.createTextNode(text));
		},

		appendTdText: function(tr,text,bold) {
			var td = this.appendTd(tr);
			this.appendText(td,text,bold);
			return td;
		},
		/* */

		sortNumber: function(a,b) {
			return b-a;
		},

		removeTab: function(tab, i) {
			var newTab = new Array();
			for(var j=0;j<i;j++)
			{
				newTab.push(tab[j]);
			}
			for(var j=i+1;j<tab.length;j++)
			{
				newTab.push(tab[j]);
			}
			return newTab;
		},
		cache: new Array(),

		tabToString: function(tab) {
			var string = tab[0];
			for(var i=1;i<tab.length;i++)
				string+=";"+tab[i];
			return string;
		},

		extractPosition: function(nombre, indice) {
			if((nombre+"").length<=indice)
				return "%";
			indice = (nombre+"").length - 1 - indice;
			return (nombre+"").substring(indice,indice+1);
		},

		comparePos: function(x,y,n,x1,y1,n1) {
			x = Math.abs(x);
			y = Math.abs(y);
			n = Math.abs(n);
			x1 = Math.abs(x1);
			y1 = Math.abs(y1);
			n1 = Math.abs(n1);
			var nbGood=0;
			for(var i=0;i<(x+"").length;i++)
				if(this.extractPosition(x,i)==this.extractPosition(x1,i))
					nbGood++;
			for(var i=0;i<(y+"").length;i++)
				if(this.extractPosition(y,i)==this.extractPosition(y1,i))
					nbGood++;
			for(var i=0;i<(n+"").length;i++)
				if(this.extractPosition(n,i)==this.extractPosition(n1,i))
					nbGood++;
			return nbGood;
		},

		signe: function(x) {
			if(x<0)
				return -1;
			return 1;
		},

		getPosFromArray: function(liste,begin,length) {
			var pos="";
			for(var i=begin;i<begin+length;i++)
				pos+=""+liste[i];
			return parseInt(pos, 10);
		},

		toggleTableau: function() {
			var tbody = this.parentNode.parentNode.parentNode.childNodes[1];

			tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
		},

		createCase: function(titre,table,width) {
			if(width==null)
				width="120";
			var tr = this.appendTr(table, 'mh_tdpage');

			var td = this.appendTdText(tr, titre, true);
			td.setAttribute('class', 'mh_tdpage');
			td.setAttribute('width', width);
			td.setAttribute('align', 'center');

			return td;
		},

		showXYN: function(tabXYN, signes) {
			var sx = '±';
			var sy = '±';
			if (signes) {
				sx = '+';
				sy = '+';
				if (signes[0] < 0) sx = '-';
				if (signes[1] < 0) sy = '-';
			}
			return "X = " + sx + Math.abs(tabXYN[0]) + ", Y = " + sy + Math.abs(tabXYN[1]) + ", N = -" + Math.abs(tabXYN[2]);
		},

		is200: function(tabXYN) {	// vrai si au moins une coord >= 200
			if (Math.abs(tabXYN[0]) >= 200) return true;
			if (Math.abs(tabXYN[1]) >= 200) return true;
			if (Math.abs(tabXYN[2]) >= 200) return true;
			return false;
		},

		gbody: null,

		generateTable: function(listeSolutions, signes) {
			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			if(listeSolutions.length==1)
			{
				var thead = document.createElement('thead');
				var tr = this.appendTr(thead, 'mh_tdtitre');
				var td = this.appendTdText(tr, "Position de la cachette : " + this.showXYN(listeSolutions[0], signes), true);
				td.setAttribute('align', 'center');
				table.appendChild(thead);
				return table;
			}
			else if(listeSolutions.length==0)
			{
				var thead = document.createElement('thead');
				var tr = this.appendTr(thead, 'mh_tdtitre');
				var td = this.appendTdText(tr, "Aucune solution trouvée.", true);
				td.setAttribute('align', 'center');
				table.appendChild(thead);
				return table;
			}

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr, "Il y a "+listeSolutions.length+" positions possibles", true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);

			this.gbody = document.createElement('tbody');
			table.appendChild(this.gbody);

			var bExist200 = false;
			for (var i = 0; i < listeSolutions.length; i++) {
				if (this.is200(listeSolutions[i]))
					bExist200 = true;
				else
					this.createCase(this.showXYN(listeSolutions[i], signes),this.gbody,400);
			}
			if (bExist200) {
				this.createCase("Les suivantes sont peu probables car trop en dehors du Hall",this.gbody,400);
				for (var i = 0; i < listeSolutions.length; i++) {
					if (this.is200(listeSolutions[i]))
						this.createCase(this.showXYN(listeSolutions[i], signes),this.gbody,400);
				}
			}

			td.addEventListener("click", this.toggleTableau, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			this.gbody.setAttribute('style', 'display:none;');

			return table;
		},

		gListeSolutions: new Array(),	// tableau de tableaux des 3 coord
		gEssais: new Array(),	// tableau d'objets de type oEssai
		oMort: null,	// objet de type oEssai sans "c"

		oEssai: function(x, y, n, c) {	// déclaration d'objet méthode "function"
			if (y == undefined) {	// initialisation à partir d'une chaine séparée par ";"
				let t = x.split(";");
				this.x = parseInt(t[0], 10);
				this.y = parseInt(t[1], 10);
				this.n = parseInt(t[2], 10);
				this.c = parseInt(t[3], 10);
			} else {
				this.x = x;
				this.y = y;
				this.n = n;
				this.c = c;
			}

			this.xAbs = Math.abs(this.x);
			this.yAbs = Math.abs(this.y);
			this.nAbs = Math.abs(this.n);
			this.xText = this.xAbs + '';
			if (this.xText.length < 2) this.xText = '0' + this.xText;
			this.yText = this.yAbs + '';
			if (this.yText.length < 2) this.yText = '0' + this.yText;
			this.nText = this.nAbs + '';
			if (this.nText.length < 2) this.nText = '0' + this.nText;

			this.nbMatchesOne = function (t1, t2) {
				t1 = '' + parseInt(t1, 10);	// virer le zéro à gauche. MH n'en tient pas compte quand il compte le nombre de match
				t2 = '' + parseInt(t2, 10);
				var nRet = 0;
				var l1 = t1.length;
				var l2 = t2.length;
				for (var i = 0; i < l1 && i < l2; i++)
					if (t1.substring(l1 - (i+1), l1 - i) == t2.substring(l2 - (i+1), l2 - i)) nRet++;
				return nRet;
			};

			this.isCompatible = function(tabCoord) {	// vérifie si c'est compatible avec les coord passées en argument sous forme de tableau de chaines
				var nMatches = this.nbMatchesOne(this.xText, tabCoord[0]);
				nMatches += this.nbMatchesOne(this.yText, tabCoord[1]);
				nMatches += this.nbMatchesOne(this.nText, tabCoord[2]);
				return nMatches == this.c
			};

			this.forPsychoChasseur = function() {	// rend le bout de texte à mettre dans l'URL vers l'outil des Psycho Chasseurs
				return this.xAbs + '+' + this.yAbs + '+' + this.nAbs + '+' + this.c;
			};

			this.nbChiffre = function() {	// rend le nombre de chiffres (une coord à 1 chiffe en donne 2, le "0" et le chiffre des unités)
				return this.xText.length + this.yText.length + this.nText.length;
			};

			this.tabOccurenceChiffre = function() {	// le nombre d'occurrence de chaque chiffre (0 à 9) dans les coord
				var tabRet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				this.addOccurenceChiffre(tabRet, this.xText);
				this.addOccurenceChiffre(tabRet, this.yText);
				this.addOccurenceChiffre(tabRet, this.nText);
				return tabRet;
			};

			this.addOccurenceChiffre = function(t, s) {
				var l = s.length;
				for (var i = 0; i < l; i++) {
					var c = s.substring(i, i+1);
					var n = parseInt(c, 10);
					if (!isNaN(n)) t[n]++;
				}
			};
		},

		calculeSolution2: function() {	// calcule les solutions à partir des propriétés de oMort et gEssai
			var oContexte = {
				// nombre de chiffres (une coord à 1 chiffe en donne 2, le "0" et le chiffre des unités) dans les coord de la mort du Capitan
				nbChiffre: this.oMort.nbChiffre(),
				// nombre d'occurrence de chaque chiffre (0 à 9) dans les coord de la mort du Capitan
				tabOccurrenceChiffre: this.oMort.tabOccurenceChiffre(),
				// Si on a plus de 6 chiffres, il y a des coordonnées à 3 chiffres, leur nombre sera calculé plus loin
				nCoord3: undefined,
				// On n'a encore traité aucune coordonnée
				nCoordEnCours: 0,	// 0:x, 1:y, 2:n
				// les chaines des coord en cours de construction
				tabCoord: ['', '', ''],
			};
			oContexte.nCoord3 = oContexte.nbChiffre - 6;
			if (this.bDebug) window.console.log("CAPITAN calculeSolution2 contexte initial=" + JSON.stringify(oContexte));

			// On lance le balayage récursif des possibilités
			this.gListeSolutions = new Array();
			this.calculeSolutionRecursifCoord(oContexte);
			if (this.bDebug) window.console.log("CAPITAN calculeSolution2 résultat=" + JSON.stringify(this.gListeSolutions));
		},

		calculeSolutionRecursifCoord: function(oContexte) {	// balayage récursif des solutions, balayage coordonnée (x, y ou n)
			if (oContexte.nCoord3 > 0) {	// lancer le test sur une coord à 3 chiffres
				var newContexte = Object.assign({}, oContexte);	// clone car on modifie le contexte
				newContexte.nCoord3--;
				this.calculeSolutionRecursifDigit(newContexte, 3);
			}
			if (oContexte.nCoord3 <= (2- oContexte.nCoordEnCours)) {	// pas de test à 2 chiffres si toutes les coord restantes doivent être à 3 chiffres
				this.calculeSolutionRecursifDigit(oContexte, 2);
			}
		},

		calculeSolutionRecursifDigit: function(oContexte, nChiffreThisCoord) {	// balayage récursif des solutions, balayages des suites de chiffres possibles
			var thisCoord = '';
			var newContexte = Object.assign({}, oContexte);	// clone car on modifie le contexte
			newContexte.tabCoord = oContexte.tabCoord.slice();	// clone (le clone ci-dessus est un "shallow" clone)
			for (var i = 0; i <= 9; i++) {	// boucle sur les chiffres possibles à cette position
				if (oContexte.tabOccurrenceChiffre[i] == 0) continue;	// chiffre non disponible
				newContexte.tabCoord[oContexte.nCoordEnCours] = oContexte.tabCoord[oContexte.nCoordEnCours] + i;
				newContexte.tabOccurrenceChiffre = oContexte.tabOccurrenceChiffre.slice();	// clone car on modifie ce tableau
				newContexte.tabOccurrenceChiffre[i]--;
				if (nChiffreThisCoord > 1) {	// continuer à tirer des chiffres pour cette coord
					this.calculeSolutionRecursifDigit(newContexte, nChiffreThisCoord-1);
					continue;
				}
				// on a fini avec cette coord
				if (oContexte.nCoordEnCours != 2) {
					// continuer sur la coord suivante
					newContexte.nCoordEnCours = oContexte.nCoordEnCours + 1;
					this.calculeSolutionRecursifCoord(newContexte);
					continue;
				}
				// ici, on a tiré tous les chiffres des 3 coordonnées, on teste si ces coord sont compatibles avec les essais
				var isCompatible = true;
				for (oEssai of this.gEssais) {
					if (!oEssai.isCompatible(newContexte.tabCoord)) {
						isCompatible = false;
						break;
					}
				}
				if (this.bDebug && newContexte.tabCoord[0] == '03' && newContexte.tabCoord[1] == '80') {
					let sCause = '';
					if (!isCompatible) {
						sCause = ' bad ' + oEssai.forPsychoChasseur() + ' nMatches=';
						sCause += oEssai.nbMatchesOne(oEssai.xText, newContexte.tabCoord[0]);
						sCause += ' ' + oEssai.nbMatchesOne(oEssai.yText, newContexte.tabCoord[1]);
						sCause += ' ' + oEssai.nbMatchesOne(oEssai.nText, newContexte.tabCoord[2]);
					}
					window.console.log('CAPITAN calculeSolutionRecursifDigit, teste ' + newContexte.tabCoord.join("; ") + ', isCompatible=' + isCompatible + sCause);
				}
				if (isCompatible) {
					this.gListeSolutions.push(newContexte.tabCoord.slice());	// slice pour cloner le tableau
				}
			}
		},

		afficheInfoCarte: function(idCarte) {
			var originalPosText = this.CAPITAN_getValue("capitan."+idCarte+".position");
			if (originalPosText === undefined) {
				let msg = "La recherche a été enregistrée. Mais vous n'avez pas encore affiché le détail de la carte "
					+ idCarte + " et le « script du Capitan » ne connait pas la position de la mort du Capitan. Il ne peut pas vous en dire plus. Allez dans «  EQUIPEMENT » et affichez cette carte.";
				this.afficheMsg(msg, 'red');
				window.console.log('afficheInfoCarte_log: ' + msg);
				return;
			}
			var originalPos = originalPosText.split(";");
			if(originalPos.length!=3) {
				msg = 'Text non reconnu : ' + originalPosText;
				this.afficheMsg(msg, 'red');
				window.console.log('afficheInfoCarte_log: ' + msg);
				return;
			}
			this.oMort = new this.oEssai(originalPosText);
			this.gEssais = new Array();
			var i = 0;
			var essaiText;
			while((essaiText = this.CAPITAN_getValue("capitan."+idCarte+".essai."+i)) != null)
			{
				//this.gEssais.push(this.CAPITAN_getValue("capitan."+idCarte+".essai."+i).split(";"));
				this.gEssais.push(new this.oEssai(essaiText));
				i++;
			}
			if(this.CAPITAN_getValue("capitan."+idCarte+".this.signe") !=null)
			{
				var signes = this.CAPITAN_getValue("capitan."+idCarte+".this.signe").split(";");
				if (this.bDebug) window.console.log('CAPITAN afficheInfoCarte_log signes=' + JSON.stringify(signes));
			}
			else
			{
				if (this.bDebug) window.console.log('CAPITAN afficheInfoCarte_log pas de signe ' + originalPos[0] + ',' + originalPos[1] + ',' + originalPos[2]);
			}
			this.calculeSolution2();
			return this.generateTable(this.gListeSolutions, signes);
		},

		getRepartitionFromCase: function(tx, ty, tn, listeSolutions) {
			// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, je modifie l'algorithme
			//var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
			var repartition = new Array();
			//for(var i=0;i<size;i++)
			//	repartition.push(0);
			for(var i=0;i<listeSolutions.length;i++)
			{
				var nbGood = this.comparePos(listeSolutions[i][0],listeSolutions[i][1],listeSolutions[i][2],tx,ty,tn);
				for (var j = repartition.length; j <= nbGood; j++) repartition.push(0);	// Roule 15/08/2016 compléter le tableau selon le besoin
				repartition[nbGood]++;
			}
			repartition.sort(this.sortNumber);
			return repartition;
		},

		getMeanPositionNumber: function(repartition,nbSolutions) {
			var result=0;
			for(var i=0;i<repartition.length;i++)
			{
				result+=repartition[i]*repartition[i];
			}
			return result/nbSolutions;
		},

		// Roule 08/08/2016 passage numTroll en paramètre
		// Roule 15/08/2016 passage position courante en paramètre (tableau des 3 valeurs)
		newRecherche: function(listeSolutions, currentPos) {
			if(listeSolutions.length<=1)
				return null;
			// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, j'utilise repartition.length
			//var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
			var repartition = this.getRepartitionFromCase(currentPos[0], currentPos[1], currentPos[2], listeSolutions);
			var size = repartition.length;
			if (this.bDebug) window.console.log('newRecherche_log: this.newRecherche_log, repartition=' + JSON.stringify(repartition));

			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			var nbNotZero = 0;
			for(var i=0;i<size;i++)
			{
				if(repartition[i]!=0)
					nbNotZero++;
			}
			var string = "Il y a une utilité de faire une recherche en X = "+currentPos[0]+" Y = "+currentPos[1]+" N = "+currentPos[2];
			if(nbNotZero<=1)
			{
				//
				var minsolution = listeSolutions.length;
				var newpos = "";
				var isNotN = true;
				for(var dx=-1;dx<=1;dx++)
					for(var dy=-1;dy<=1;dy++)
						for(var dn=0;dn!=-3;dn=(dn==0?1:dn-2))
						{
							if(dx==0 && dy==0 && dn==0)
								continue;
							var tmprepartition = this.getRepartitionFromCase(currentPos[0]+dx, currentPos[1]+dy, currentPos[2]+dn, listeSolutions);
							var tmpmeanscore = this.getMeanPositionNumber(tmprepartition,listeSolutions.length);
							if(((dn==0 || !isNotN) && minsolution>=tmpmeanscore) || (dn!=0 && isNotN && tmpmeanscore<=2*minsolution/3))
							{
								minsolution = tmpmeanscore;
								repartition = tmprepartition;
								newpos = "X = "+(currentPos[0]+dx)+" Y = "+(currentPos[1]+dy)+" N = "+(currentPos[2]+dn);
								isNotN = (dn==0);
							}
						}
				if(minsolution == listeSolutions.length)
				{
					var thead = document.createElement('thead');
					var tr = this.appendTr(thead, 'mh_tdtitre');
					var td = this.appendTdText(tr, "Il n'y a aucune utilité de faire une recherche en X = "+currentPos[0]+" Y = "+currentPos[1]+" N = "+currentPos[2], true);
					td.setAttribute('align', 'center');
					table.appendChild(thead);
					return table;
				}
				string = "Conseil : allez faire une recherche en "+newpos;
			}

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr,string, true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);
			var tbody = document.createElement('tbody');
			table.appendChild(tbody);
			for(var i=0;i<size;i++)
			{
				if(i==size-1)
				{
					if(repartition[i]!=0)
						this.createCase(Math.round(100*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
				}
				else
				{
					var n=1;
					while((i+n)<size && repartition[i]==repartition[i+n])
						n++;
					if(repartition[i]!=0)
						this.createCase(Math.round(100*n*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
					i+=n-1;
				}
			}

			td.addEventListener("click", this.toggleTableau, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			tbody.setAttribute('style', 'display:none;');
			return table;
		},

		// Roule 08/08/2016 récupération numéro de Troll dans la page HTML
		getNumTroll: function() {
			/* 07/10/2020, l'info n'est plus dans la page, on se replie sur le localStorage
			var infoObjet = document.evaluate("//td[@class = 'mh_tdtitre']/text()[contains(.,'Propriétaire actuel')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (this.bDebug) {
				if (infoObjet) {
					window.console.log('CAPITAN getNumTroll: infoObjet.nodeValue=' + infoObjet.nodeValue);
				} else {
					window.console.log('CAPITAN getNumTroll: infoObjet est nul');
				}
			}
			var numTroll = 0;
			if (infoObjet)
			{
				// infoObjet.nodeValue=Propriétaire actuel : TROLL - 91305. Rouletabille
				var m = infoObjet.nodeValue.match(/troll[ -]*(\d*)[. +]/i);
				if (m) {
					if (this.bDebug) window.console.log('CAPITAN getNumTroll: m=' + m);
					if (m.length > 1) numTroll = parseInt(m[1]);
				}
			}
			*/
			numTroll = parseInt(window.localStorage['NUM_TROLL']);
			if (this.bDebug) window.console.log('CAPITAN getNumTroll: numTroll=' + numTroll);
			return numTroll;
		},

		getIDCarte: function() {
			var infoObjet = document.evaluate("//h2[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			// si échec, essayer avec l'ancienne méthode
			if (!infoObjet) infoObjet = document.evaluate("//td[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			// si échec, essayer avec l'ancienne méthode
			if (!infoObjet) infoObjet = document.evaluate("//div[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			var idCarte = 0;
			if(infoObjet)
			{
				idCarte = parseInt(infoObjet.nodeValue.replace('[', ''));
			}
			return idCarte;
		},

		analyseObjectCallback: function() {	// appelle analyseObject dans le contexte de l'objet
			oCAPITAN_MH_ROULE.analyseObject();
		},

		analyseObject: function() {
			var eSpacer = document.getElementById('spacerMZCapitan');
			if (eSpacer) return;	// déjà affiché
			var numTroll = this.getNumTroll();	// Roule 08/08/2016 récupération numéro de Troll dans la page HTML
			if( !numTroll) {
				window.console.log('CAPITAN analyseObject: *** erreur *** pas de numéro de Trõll');
				return;
			}
			var idCarte = this.getIDCarte();
			if (this.bDebug && idCarte == 11987020) {	// test Roule
				var originalPos = '-101;-8;-73';
				this.CAPITAN_setValue("capitan."+idCarte+".position", originalPos)
			} else if (idCarte > 0) {
				var originalPos = this.CAPITAN_getValue("capitan."+idCarte+".position");
			} else {
				var parentElt = document.body;
				var modalElt = document.evaluate("//div[@class = 'modal']",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (modalElt && !modalElt.errorIDDone) {
					modalElt.appendChild(document.createTextNode("Erreur à la récupération de l'ID de la carte"));
					modalElt.errorIDDone = true;
				}
				return;
			}
			if (this.bDebug) window.console.log('CAPITAN analyseObject: this.analyseObject numTroll=' + numTroll + ', idCarte=' + idCarte + ', originalPos=' + originalPos);
			if(!originalPos || originalPos == null)
			{
				var infoPos = document.evaluate("//td/text()[contains(.,'ai été tué en')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if(!infoPos) {
					if (this.bDebug) window.console.log('CAPITAN analyseObject: numTroll=' + numTroll + ', idCarte=' + idCarte + ', impossible de trouver le texte de la mort du Capitan');
					return;
				}
				var listePos = infoPos.nodeValue.split("=");
				if(listePos.length!=4) {
					if (this.bDebug) window.console.log('CAPITAN analyseObject: numTroll=' + numTroll + ', idCarte=' + idCarte + ', impossible de trouver les coord. de la mort du Capitan ' + infoPos.nodeValue);
					return;
				}
				var x = parseInt(listePos[1]);
				var y = parseInt(listePos[2]);
				var n = parseInt(listePos[3]);
				if (this.bDebug) window.console.log('CAPITAN analyseObject: setValue("capitan.'+idCarte+'.position, '+x+";"+y+";"+n);
				this.CAPITAN_setValue("capitan."+idCarte+".position",x+";"+y+";"+n);
			}
			// Roule 23/11/2016 travail dans le body (ancienne version, fenêtre indépendante) ou dans la div modale (nouvelle version en "popup")
			var parentElt = document.body;
			var modalElt = document.evaluate("//div[@class = 'modal']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (modalElt) parentElt = modalElt;

			// bloc liste de solutions
			var table = this.afficheInfoCarte(idCarte);
			var p = document.createElement('p');
			p.id = 'spacerMZCapitan';
			//window.console.log('analyseObject_log: table=' + JSON.stringify(table));
			p.appendChild(table);
			parentElt.appendChild(p);

			// position courante du Troll
			// Roule 08/08/2016 utilisation de localStorage car c'est là que tout_MZ stocke les coord
			var curPos = [];
			curPos[0] = parseInt(window.localStorage[numTroll+".position.X"]);
			curPos[1] = parseInt(window.localStorage[numTroll+".position.Y"]);
			curPos[2] = parseInt(window.localStorage[numTroll+".position.N"]);
			if (this.bDebug) window.console.log('CAPITAN analyseObject: position du troll récupérée en localStorage=' + JSON.stringify(curPos));

			// bloc utilité de faire une recherche sur la position courante
			table = this.newRecherche(this.gListeSolutions, curPos);
			if(table!=null)
			{
				var p = document.createElement('p');
				p.appendChild(table);
				parentElt.appendChild(p);
				// bloc ajout de nouvelle recherche
				this.createNewRecherche(parentElt);
			}

			// Roule 08/08/2016 bloc des recherches mémorisées
			if(this.gEssais)
			{
				table = this.prevRecherche(idCarte);
				var p = document.createElement('p');
				p.id = 'MZ_capitan_p_liste_memo';
				p.appendChild(table);
				parentElt.appendChild(p);
				// Roule 08/08/2016 bloc préparant les infos pour l'outil Mamoune (Psyko-Chasseurs)
				table = this.blocMamoune(idCarte, curPos);
				if(table!=null)
				{
					p = document.createElement('p');
					p.appendChild(table);
					parentElt.appendChild(p);
				}
			}

			// Roule 25/08/2016 récupération des anciennes recherches (préférences)
			table = this.PrepareRecupFromPreferences();
			if(table!=null)
			{
				p = document.createElement('p');
				p.appendChild(table);
				parentElt.appendChild(p);
			}

			// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
			table = this.PrepareRecupFromLocalStorage(idCarte);
			if(table!=null)
			{
				p = document.createElement('p');
				p.appendChild(table);
				parentElt.appendChild(p);
			}
		},

		afficheMsg: function(msg, color) {
			let p = document.createElement('p');
			if (color) p.style.color = color;
			p.appendChild(document.createTextNode('MZ Capitan : ' + msg));
			document.getElementById('msgDiv').appendChild(p);
		},

		// Roule 08/08/2016
		blocMamoune: function(idCarte, currentPos) {
			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr, "Outil du cercle des Psyko-Chasseurs", true);
			td.setAttribute('align', 'center');
			//td.setAttribute('title', 'sélectionnez (triple-clic), copiez et collez dans l\'outil des Psyko-Chasseurs');
			table.appendChild(thead);

			var tbody = document.createElement('tbody');
			table.appendChild(tbody);

			// http://mountyhall.dispas.net/dynamic/outils_capitan.php?x=101&y=8&n=73&t=3+77+30+1%0D%0A37+57+48+0%0D%0A33+32+29+1%0D%0A87+20+74+2%0D%0A17+56+63+0%0D%0A22+89+78+2&voir=1&cent=100&enter=Go#
			var tabtxt = new Array();
			var currentPosAlreadyDone = false;
			for (var i = 0; i < this.gEssais.length; i++) {
				tabtxt.push(this.gEssais[i].forPsychoChasseur());
				if (this.gEssais[i].x == currentPos[0] && this.gEssais[i].y == currentPos[1] && this.gEssais[i].n == currentPos[2]) currentPosAlreadyDone = true;
				//tabtxt.push(this.gEssais[i].join('+'));
				//if (this.gEssais[i][0] == currentPos[0] && this.gEssais[i][1] == currentPos[1] && this.gEssais[i][2] == currentPos[2]) currentPosAlreadyDone = true;
			}
			if (!currentPosAlreadyDone) tabtxt.push(currentPos.join('+') + '+%3F');	// spécial pour demander à Mamoune ce qu'elle pense d'un essai à la position courante
			var tr2 = this.appendTr(tbody, 'mh_tdpage');
			var td2 = this.appendTd(tr2);
			var originalPos = this.CAPITAN_getValue("capitan."+idCarte+".position").split(";");
			if(originalPos.length!=3) {
				td2.this.appendText('Erreur\u00A0: impossible de retrouver les coordonnées de la mort');
			} else {
				var a = document.createElement('a');
				this.appendText(a, 'Cliquer ici pour savoir ce qu\'en pensent les Psyko-Chasseurs');
				a.setAttribute('href', 'http://mountyhall.dispas.net/dynamic/outils_capitan.php?x=' + originalPos[0] + '&y=' + originalPos[1] + '&n=' + originalPos[2] + '&t=' + tabtxt.join('%0D%0A') + '&voir=1&cent=100');
				a.setAttribute('target', 'psykochasseurs');
				td2.appendChild(a);
			}

			td.setAttribute('class', 'mh_tdpage');
			//td.setAttribute('width', width);
			td.setAttribute('align', 'center');


			td.addEventListener("click", this.toggleTableau, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			td.setAttribute('colspan', 2);
			tbody.setAttribute('style', 'display:none;');

			return table;
		},

		prevRecherche: function(idCarte) {
			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr, "Vous avez mémorisé " + this.gEssais.length + " essai" + (this.gEssais.length > 1 ? "s" : ""), true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);

			var tbody = document.createElement('tbody');
			tbody.id = 'MZ_capitan_tbody_liste_memo';
			table.appendChild(tbody);

			for (var i = 0; i < this.gEssais.length; i++) {
				var td2 = this.createCase("X = " + this.gEssais[i].x + ", Y = "+this.gEssais[i].y +", N = " + this.gEssais[i].n + " => " + this.gEssais[i].c,tbody,400);
				var td3 = this.appendTd(td2.parentNode);
				var bt = this.appendButton(td3, "Supprimer", this.delRecherche);
				bt.idEssai = i;
				bt.idCarte = idCarte;
				td3.setAttribute('class', 'mh_tdpage');
				td3.setAttribute('width', 200);
				td3.setAttribute('align', 'center');
			}

			td.addEventListener("click", this.toggleTableau, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			td.setAttribute('colspan', 2);
			tbody.setAttribute('style', 'display:none;');

			return table;
		},

		delRecherche: function(e) {	// ATTENTION, cette fonction ne tourne pas dans le contexte de l'objet ("this" pointe vers le bouton)
			let idEssaiDel = e.target.idEssai;
			let idCarte = e.target.idCarte;
			if (oCAPITAN_MH_ROULE.bDebug) window.console.log('CAPITAN delRecherche: idEssaiDel=' + idEssaiDel + ', idCarte=' + idCarte + ', oCAPITAN_MH_ROULE.gEssais.length=' + oCAPITAN_MH_ROULE.gEssais.length);
			oCAPITAN_MH_ROULE.gEssais.splice(idEssaiDel, 1);
			if (oCAPITAN_MH_ROULE.bDebug) window.console.log('delRecherche_log ' + JSON.stringify(oCAPITAN_MH_ROULE.gEssais));
			let lg = oCAPITAN_MH_ROULE.gEssais.length;
			for (let i = 0; i < lg; i++) {
				let clef = "capitan." + idCarte + ".essai." + i;
				let oEssai = oCAPITAN_MH_ROULE.gEssais[i];
				let v = oEssai.x + ';' + oEssai.y + ';' + oEssai.n + ';' + oEssai.c;
				if (oCAPITAN_MH_ROULE.bDebug) window.console.log('CAPITAN delRecherche_log: set ' + clef + '=' + v);
				oCAPITAN_MH_ROULE.CAPITAN_setValue(clef, v);
			}
			for (let i = 0; i < 10; i++) {	// pour être sûr, on  supprime les 10 suivantes
				let clef = "capitan." + idCarte + ".essai." + (i + lg);
				if (oCAPITAN_MH_ROULE.bDebug) window.console.log('CAPITAN delRecherche_log: remove ' + clef);
				oCAPITAN_MH_ROULE.CAPITAN_deleteValue(clef);
			}
			let eP = document.getElementById('MZ_capitan_p_liste_memo');
			while (eP.lastChild) eP.removeChild(eP.lastChild);
			let eTable = oCAPITAN_MH_ROULE.prevRecherche(idCarte);
			eP.appendChild(eTable);
			let tbody = document.getElementById('MZ_capitan_tbody_liste_memo');
			tbody.style.display = '';	// show
		},

		createNewRecherche: function(parentElt) {
			p = document.createElement('p');

			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');
			var tbody = document.createElement('tbody');
			table.appendChild(tbody);

			var td = this.createCase("Rajouter manuellement  une recherche :",tbody);

			td.appendChild(document.createElement('br'));
			td.appendChild(document.createTextNode("X = "));
			this.addInput(td, "rX");
			td.appendChild(document.createTextNode(" Y = "));
			this.addInput(td, "rY");
			td.appendChild(document.createTextNode(" N = "));
			this.addInput(td, "rN");
			td.appendChild(document.createElement('br'));
			td.appendChild(document.createTextNode("Nombre de chiffres bien placés : "));
			this.addInput(td, "rBP",1);
			td.appendChild(document.createElement('br'));
			var button=this.appendButton(td, "Ajouter", this.addRecherche);

			p.appendChild(table);
			parentElt.appendChild(p);
		},

		// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
		PrepareRecupFromLocalStorage: function(idCarte) {
			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr, "Récupération des anciens essais V1.1", true);
			td.setAttribute('align', 'center');
			td.title = "C'est ici pour tenter de récupérer les essais faits avec le version 1.1 du script";
			table.appendChild(thead);

			var tbody = document.createElement('tbody');
			tbody.idCarte = idCarte;
			table.appendChild(tbody);

			td.addEventListener("click", this.recupFromLocalStorage, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			td.setAttribute('colspan', 2);
			tbody.setAttribute('style', 'display:none;');

			return table;
		},

		// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
		recupFromLocalStorage: function() {
			var tbody = this.parentNode.parentNode.parentNode.childNodes[1];
			if (tbody.RecupVisible) return;	// ne pas populer 2 fois
			var idCarte = parseInt(tbody.idCarte);
			tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
			// entrée d'un jeu de test
			// window.localStorage.setItem('91305.capitan.8600686.essai.1', '1;2;3;4');
			// window.localStorage.removeItem('91305.capitan.8600686.essai.2');
			// window.localStorage.removeItem('91305.capitan.8600686.essai.3');
			// window.localStorage.removeItem('91306.capitan.8600686.essai.1');
			// window.localStorage.setItem('91305.capitan.8600686.essai.2', '1;2;-4;4');
			// window.localStorage.setItem('91305.capitan.8600686.essai.3', '1;-2;5;4');
			// window.localStorage.setItem('91306.capitan.8600686.essai.1', '-1;2;6;4');
			 // return;

			try {
				var nLocalStorage = window.localStorage.length;
				//var td2 = this.createCase('nLocalStorage=' + nLocalStorage,tbody,400);
				var nAlready = 0;
				var nRecup = 0;
				for (var iKey = 0; iKey < nLocalStorage; iKey++) {
					var k = window.localStorage.key(iKey);
					//var td2 = this.createCase(k + '=' + v,tbody,400);	// debug
					var m = k.match(/(\d*)\.capitan\.(\d*)\.essai\.(\d*)/i);
					if (!m) continue;	// pas une entrée de carte de capitan
					if (parseInt(m[2]) != idCarte) continue;	// pas la même carte

					var v = window.localStorage.getItem(k);
					//var nTroll = parseInt(m[1]);	// pas utile
					//var nEssai = parseInt(m[3]);	// pas utile non plus
					var bAlready = this.testAlready(idCarte, v);
					if (bAlready) {	// déjà connu : on compte et on ignore
						nAlready++;
						continue;
					}
					// extraire x, y, n, nb
					m = v.match(/([+-]?\d*);([+-]?\d*);([+-]?\d*);(\d*)/i);
					if (!m) {
						var td2 = this.createCase('Erreur à la récupération des coordonnées ' + v,tbody,400);
						continue;
					}
					var x = m[1];
					var y = m[2];
					var n = m[3];
					var nbChiffres = m[4];
					// ajout sous Greasemonkey
					this.addOneRecherche(idCarte, x, y, n, nbChiffres);
					nRecup++;
					var td2 = this.createCase('Recherche récupérée X = '+ x + ', Y = ' + y + ', N = ' + n + ' => ' + nbChiffres,tbody,400);
				}
				if (nRecup > 0) {
					var td2 = this.createCase('Recharger la page (F5) maintenant',tbody,400);
					td2.style.fontWeight="bold";
				}
				if (nAlready > 0) {
					var td2 = this.createCase(nAlready + ' recherche(s) avaient déjà été récupérée(s)',tbody,400);
					td2.style.fontStyle="italic";
				}
				if (nRecup == 0 && nAlready == 0) {
					var td2 = this.createCase('Désolé, je n\'ai rien trouvé pour la carte ' + idCarte,tbody,400);
				}
			}
			catch(e)
			{
				window.console.log(e);
			}

			tbody.RecupVisible = true;
		},

		testAlready: function(idCarte, v) {
			var v2;
			// tester si cet essai est déjà connu sous Greasemonkey
			var bAlready = false;
			for (var iGM = 0; v2 = this.CAPITAN_getValue("capitan."+idCarte+".essai."+iGM); iGM++) {
				if (v2 != v) continue;
				return true;
				break;
			}
			return false;
		},

		// Roule 25/08/2016 récupération des anciennes recherches (préférences)
		PrepareRecupFromPreferences: function() {
			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			var thead = document.createElement('thead');
			var tr = this.appendTr(thead, 'mh_tdtitre');
			var td = this.appendTdText(tr, "Récupération des anciens essais V1.0", true);
			td.setAttribute('align', 'center');
			td.title = "C'est ici pour entrer manuellement les essais faits avec la version 1.0 du script";
			table.appendChild(thead);

			var tbody = document.createElement('tbody');
			table.appendChild(tbody);

			var td2 = this.createCase("Ouvrez un nouvel onglet sous Firefox",tbody);
			td2.style.textAlign = "left";

			var nbsp = String.fromCharCode(160);
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("(«" + nbsp + "+" + nbsp + "» à droite des onglets)"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("Tapez dans la barre d'adresse «" + nbsp + "about:config" + nbsp + "» et validez"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("C'est promis, vous ferez attention" + nbsp + "!"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("Filtrez ensuite par «" + nbsp + "capitan" + nbsp +"» (zone «" + nbsp + "Rechercher" + nbsp + "» en haut)"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("Ensuite, ligne par ligne,"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("copiez la ligne (bouton de droite de la souris - copier),"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("(Vous pouvez aussi copier *tout* le contenu de pref.js trouvé dans le profil Firefox)"));
			td2.appendChild(document.createElement('br'));
			td2.appendChild(document.createTextNode("Collez ci-dessous et Ajouter"));
			td2.appendChild(document.createElement('br'));
			var inp = this.addInput(td2, "t", 100);
			inp.removeAttribute('maxlength');	// permettre de copier tout pref.js
			inp.style.width = "350px";
			td2.appendChild(document.createElement('br'));
			var button=this.appendButton(td2, "Ajouter", this.addV1);

			td.addEventListener("click", this.toggleTableau, true);
			td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
			td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
			td.setAttribute('colspan', 2);
			tbody.setAttribute('style', 'display:none;');

			return table;
		},

		addV1: function(eButton) {
			// pour test mountyhall.91306.capitan.8600686.essai.1;-1;2;6;4
			try
			{
				var td=this.parentNode;
				var eInput = td.getElementsByTagName("input")[0];
				var val = eInput.value;
				var bClear;
				if (val.match(/user_pref\(/)) {
					bClear = this.addV1Pref(val);
				} else {
					bClear = this.addV1Unitaire(val);
				}
				if (bClear)eInput.value = '';	// vider le champ pour que l'utilisateur puisse copier à nouveau
			}
			catch(e)
			{
				window.alert(e);
			}
		},

		addV1Pref: function(val) {
			// on a tout le contenu de pref.js dans val
			tabPref = val.split(/\);/);
			if (this.bDebug) window.console.log('CAPITAN addV1Pref: nb val=' + tabPref.length);
			//user_pref("mountyzilla.storage.91305.capitan.8600686.essai.1", "1;2;3;4");
			var nAlready = 0;
			var nDone = 0;
			for (var i = 0; i < tabPref.length; i++) {
				var m = tabPref[i].match(/user_pref\(\"mountyzilla\.storage\.(\d*)\.capitan\.(\d*)\.essai\.(\d*)\", *\"([+-]?\d*);([+-]?\d*);([+-]?\d*);(\d*)\"/i);
				if (!m) continue;
				//window.console.log('CAPITAN addV1Pref: trouvé troll ' + m[1] + ', carte ' + m[2] + ', essai ' + m[3] + ', X = ' + m[4] + ', Y=' + m[5] + ', N=' + m[6] + ' => ' + m[7]);
				var bAlready = this.testAlready(m[2], m[4] + ';' + m[5] + ';' + m[6] + ';' + m[7]);
				if (bAlready) {
					nAlready++;
				} else {
					this.addOneRecherche(parseInt(m[2]), m[4], m[5], m[6], m[7]);
					nDone++;
				}
			}
			alert(nAlready + ' essai(s) ont été ignorés car déjà migrés'
				+ "\n" + nDone + ' essai(s) viennent d\'être migrés'
				+ "\nIl faut rafraichir cette page (F5 ou afficher à nouveau l'équipement)");
			return true;
		},

		addV1Unitaire: function(val) {
			if (this.bDebug) window.console.log('CAPITAN addV1Unitaire: val=' + val);
			var m = val.match(/capitan\.(\d*)\.essai\.(\d*);([+-]?\d*);([+-]?\d*);([+-]?\d*);(\d*)/i);
			if (!m) {
				alert("Désolé, impossible de retrouver le numéro de carte, les coordonnées et le nombre de chiffres bien placés");
				return false;
			}
			var bAlready = this.testAlready(m[1], m[3] + ';' + m[4] + ';' + m[5] + ';' + m[6]);
			if (bAlready) {
				alert("L'essai pour la carte " + m[1] + "\nX = " + m[3]
					+ ", Y=" + m[4] + ", N=" + m[5] + " => " + m[6]
					+ "\navait DÉJÀ été entré");
				return true;
			}
			this.addOneRecherche(parseInt(m[1]), m[3], m[4], m[5], m[6]);
			alert("L'essai pour la carte " + m[1] + "\nX = " + m[3]
				+ ", Y=" + m[4] + ", N=" + m[5] + " => " + m[6]
				+ "\na bien été enregistré\nIl faudra rafraichir cette page (F5) quand vous aurez terminé");
			return true;
		},

		addRecherche: function()
		{
			try
			{
				var td=this.parentNode;
				var x = (td.getElementsByTagName("input")[0]).value;
				var y = (td.getElementsByTagName("input")[1]).value;
				var n = (td.getElementsByTagName("input")[2]).value;
				var nbChiffres = (td.getElementsByTagName("input")[3]).value;
				if(x==null || isNaN(parseInt(x)))
				{
					window.alert("Erreur : champ X mal formaté.");
					return;
				}
				if(y==null || isNaN(parseInt(y)))
				{
					window.alert("Erreur : champ Y mal formaté.");
					return;
				}
				if(n==null || isNaN(parseInt(n)))
				{
					window.alert("Erreur : champ N mal formaté.");
					return;
				}
				if(nbChiffres==null || isNaN(parseInt(nbChiffres)))
				{
					window.alert("Erreur : nombre de chiffres bien placés mal formaté.");
					return;
				}
				oCAPITAN_MH_ROULE.addOneRecherche(oCAPITAN_MH_ROULE.getIDCarte(), x, y, n, nbChiffres);
				window.location.replace(window.location);
			}
			catch(e)
			{
				window.alert(e);
			}
		},

		addOneRecherche: function(idCarte, x, y, n, nbChiffres) {
			for (var i = 0; this.CAPITAN_getValue("capitan."+idCarte+".essai."+i); i++){}
			this.CAPITAN_setValue("capitan."+idCarte+".essai."+i,parseInt(x)+";"+parseInt(y)+";"+parseInt(n)+";"+parseInt(nbChiffres));
		},

		addInput: function(parent, nom, size)
		{
			var input = document.createElement('input');
			input.setAttribute('type','text');
			input.setAttribute('name',nom);
			input.setAttribute('type','text');
			input.setAttribute('maxlength',size==null?4:size);
			input.setAttribute('size',size==null?4:size);
			parent.appendChild(input);
			return input;
		},

		infoRecherche: function()
		{
			var idCarte = this.getIntegerByID('carte', 'numéro de carte');
			if (idCarte === undefined) return;
			var x = this.getIntegerByID('x', 'x');
			if (this.bDebug) window.console.log("infoRecherche_log: X=" + x);
			if (x === undefined) return;	// ne pas utiliser «!» car x peut être «0» !
			var y = this.getIntegerByID('y', 'y');
			if (this.bDebug) window.console.log("infoRecherche_log: Y=" + y);
			if (y === undefined) return;
			var n = this.getIntegerByID('n', 'n');
			if (this.bDebug) window.console.log("infoRecherche_log: N=" + n);
			if (n === undefined) return;
			var nb = this.getIntegerByID('nb', 'Vous avez retrouvé');
			if (this.bDebug) window.console.log("infoRecherche_log: nb=" + nb);
			if (nb === undefined) return;

			var i = 0;
			while(this.CAPITAN_getValue("capitan."+idCarte+".essai."+i) != null)
			{
				i++;
			}
			this.CAPITAN_setValue("capitan."+idCarte+".essai."+i,x+";"+y+";"+n+";"+nb);

			if(this.CAPITAN_getValue("capitan."+idCarte+".this.signe") == null)
			{
				var msg = document.getElementById("msgDiv").textContent;

				// fonctionne à la fois pour "Tu es dans..." et "Vous êtes dans..."
				if(!msg.match(/es dans le bon Xcoin/))
					x = -x;
				if(!msg.match(/es dans le bon Ycoin/))
					y = -y;

				this.CAPITAN_setValue("capitan."+idCarte+".this.signe",this.signe(x)+";"+this.signe(y));
			}

			var table = this.afficheInfoCarte(idCarte);

			if (!table) return;
			form = document.getElementsByTagName('FORM')[0];
			var p = document.createElement('p');
			p.appendChild(table);
			form.appendChild(p);
		},

		// return undefined if not found
		getIntegerByID: function(id, msg) {
			var e = document.getElementById(id);
			if (!e || !e.childNodes || !e.childNodes[0] || !e.childNodes[0].nodeValue) {
				if (msg) window.alert('Script carte de Capitan : impossible de retrouver le ' + msg);
				return;
			}
			return parseInt(e.childNodes[0].nodeValue);
		},

		///////////////////////////////////
		// debuging
		// essais : objet
		//	.mode : description
		//	.essais : tableau d'objets essai
		//		.mode : description
		//		.essais : tableau de cartes
		//			.noCarte : id de la carte
		//			.essais : tableau d'essais, [x, y, n, nb]
		AfficheEssais: function(essais, sMode) {
			var eBigDiv = document.getElementById('ListeEssaiCapitan');
			if (!eBigDiv) {
				var insertPoint = document.getElementById('footer1');
				eBigDiv = document.createElement('table');
				eBigDiv.id = 'ListeEssaiCapitan';
				this.insertBefore(insertPoint, document.createElement('p'));
				this.insertTitle(insertPoint,'Capitan : Liste des essais');
				this.insertBefore(insertPoint, eBigDiv);
				this.addTrEssais(eBigDiv, 'mode', 'carte', 'nombre d\'essais', true);
			}
			if (!essais) {
				this.addTrEssais(eBigDiv, sMode, '', 'pas d\'essai', false);
				return;
			}
			var carte;
			for (carte in essais) {
				this.addTrEssais(eBigDiv, sMode, carte, essais[carte] + ' essai(s)', false);
			}
			if (carte === undefined) {
				this.addTrEssais(eBigDiv, sMode, '', '0 essai', false);
			}
		},

		addTrEssais: function(eTable, sMode, sCarte, sText, bBold) {
			var tr = this.appendTr(eTable);
			var td = this.appendTd(tr);
			this.appendText(td, sMode, bBold);
			td = this.appendTd(tr);
			this.appendText(td, sCarte, bBold);
			td = this.appendTd(tr);
			this.appendText(td, sText, bBold);
		},

		getEssaiV1_2: function() {
			if (!GM_getValue) {
				window.console.log('CAPITAN getEssaiV1_2: pas de GM_getValue');
				return;
			}
			var tabKey = GM_listValues();
			window.console.log('CAPITAN getEssaiV1_2: nb key : ' + tabKey.length);
			var r = [];
			for (var i = 0; i < tabKey.length; i++) {
				var k = tabKey[i];
				//window.console.log('CAPITAN getEssaiV1_2: key ' + k + ' => ' + GM_getValue(k));
				var t = k.split(/\./);
				if (t[0] !== 'capitan') continue;
				if (t[2] !== 'essai') continue;
				var carte = 'carte n°' + t[1];
				if (r[carte]) r[carte]++;
				else         r[carte] = 1;
				//window.console.log('CAPITAN getEssaiV1_2: r[' + carte + ']=' + r[carte]);
			}
			return r;
		},

		showEssai: function() {
			window.console.log('CAPITAN début this.showEssai CapitanList');
			var essai1_2 = this.getEssaiV1_2();
			this.AfficheEssais(essai1_2, 'V1.2');
			window.console.log('CAPITAN fin this.showEssai CapitanList');
		},

		CAPITAN_horsGM: false,
		init: function () {
			this.CAPITAN_horsGM = false;
			try {	// à partir du 11/07/2018, (GM_info === undefined) provoque une exception
				if (GM_info == undefined) {
					this.CAPITAN_horsGM = true;
				} else if (GM_info.script.version == 'sans GM') {
					this.CAPITAN_horsGM = true;
				}
			} catch (e2) {
				this.CAPITAN_horsGM = true;
				if (this.bDebug) window.console.log('CAPITAN init_log: test GM_deleteValue, exception=' + e2);
			}
			try {
				if (GM_getValue == undefined) {
					this.CAPITAN_horsGM = true;
				}
				GM_getValue('x');	// provoque une exception hors GM
			} catch (e2) {
				this.CAPITAN_horsGM = true;
				if (this.bDebug) window.console.log('CAPITAN init_log: test GM_deleteValue, exception=' + e2);
			}
			try {
				if (GM_deleteValue == undefined) {
					this.CAPITAN_horsGM = true;
				}
			} catch (e2) {
				this.CAPITAN_horsGM = true;
				if (this.bDebug) window.console.log('CAPITAN init_log: test GM_deleteValue, exception=' + e2);
			}
			if (this.bDebug) window.console.log('CAPITAN init_log: horsGM=' + this.CAPITAN_horsGM);
			if (this.CAPITAN_horsGM) {	// remplacer GM_xxxValue
				this.CAPITAN_getValue = function(key) {
					return window.localStorage[key];
				}
				this.CAPITAN_deleteValue = function(key) {
					window.localStorage.removeItem(key);
				}
				this.CAPITAN_setValue = function(key, val) {
					//if (this.bDebug) window.console.log('CAPITAN_setValue_log: ' + key + '=>' + val);
					window.localStorage[key] = val;
				}
			} else {
				this.CAPITAN_getValue = GM_getValue;
				this.CAPITAN_deleteValue = GM_deleteValue;
				this.CAPITAN_setValue = GM_setValue;
			}
			if (this.isPage("View/TresorHistory.php"))
			{
				this.analyseObject();
			}
			else if(this.isPage("MH_Play/Play_a_ActionResult.php") || this.isPage("MH_Play/Play_a_TrouverCachette2.php"))
			{
				// uniquement si l'id du body est p_trouverunecachette
				if (document.body.id != 'p_trouverunecachette') return;
				this.infoRecherche();
			}
			else if(this.isPage("MH_Play/Play_equipement.php") || this.isPage("MH_Taniere/TanierePJ_o_Stock.php"))
			{
				// Roule, 23/11/2016, il faudrait trouver mieux pour s'activer quand l'utilisateur ouvre le popup
				//window.setInterval(this.analyseObject.bind(this), 1000);	// ceci fonctionne mais n'est supporté que par les navigateurs récents
				window.setInterval(this.analyseObjectCallback, 1000);
			}
			// debuging
			// else if(this.isPage("MH_Play/Options/Play_o_Interface"))
			// {
			// 	this.showEssai();
			// }
		},
	}
	try
	{
		oCAPITAN_MH_ROULE.init();
	} catch(e) {
		window.console.log('script capitan exception: ' + e + "\n" + e.stack);
	}
}
