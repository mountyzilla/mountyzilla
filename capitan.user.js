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
// @version 8.8.23
// @namespace https://greasyfork.org/users/70018
// ==/UserScript==

"use strict";

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

var oCAPITAN_MH_ROULE;
if (oCAPITAN_MH_ROULE instanceof Object) {
	window.console.log("script capitan déjà chargé");	// ça arrive dans le cas de l'affichage des détails d'une carte en popup
} else {
	oCAPITAN_MH_ROULE = {
		bDebug: true,
		/* pour mémoire
		numTroll: undefined,
		modeIntege: undefined,
		MZ_ok: undefined,
		curPos: undefined,	// object genre {x:10, y:10, n:-10}, non renseigné en cas smartphone sans MZ
		// */
		infoCartes: {},	// {"1234": {"mort": {x:10, y:10, n:-10}, "essais": [{x:10, y:10, n:-10, c=0}, {x:11, y:11, n:-10, c=1}], "signex": 1, "signey": -1}
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
		gEssais: new Array(),	// tableau d'objets de type cEssai
		oMort: null,	// objet de type cEssai sans "c"

		cEssai: function(x, y, n, c) {	// déclaration d'objet méthode "function"
			if (y == undefined) {	// initialisation à partir d'une chaine séparée par ";"
				if (typeof x === 'string' || x instanceof String) {
					let t = x.split(";");
					this.x = parseInt(t[0], 10);
					this.y = parseInt(t[1], 10);
					this.n = parseInt(t[2], 10);
					if (t.length > 3) this.c = parseInt(t[3], 10);
				} else if (x != undefined) {
					this.x = x.x;
					this.y = x.y;
					this.n = x.n;
					if (x.c !== undefined) this.c = x.c;
				}
			} else {
				this.x = parseInt(x, 10);
				this.y = parseInt(y, 10);
				this.n = parseInt(n, 10);
				if (c !== undefined) this.c = parseInt(c, 10);
			}

			/*
			this.xAbs = Math.abs(this.x);
			this.yAbs = Math.abs(this.y);
			this.nAbs = Math.abs(this.n);
			this.xText = this.xAbs + '';
			if (this.xText.length < 2) this.xText = '0' + this.xText;
			this.yText = this.yAbs + '';
			if (this.yText.length < 2) this.yText = '0' + this.yText;
			this.nText = this.nAbs + '';
			if (this.nText.length < 2) this.nText = '0' + this.nText;
			*/
			this.coord2text = function(coord) {
				let t = coord + '';
				if (t.length < 2) t = '0' + t;
				return t;
			};

			this.xText = function() {return this.coord2text(this.x)};
			this.yText = function() {return this.coord2text(this.y)};
			this.nText = function() {return this.coord2text(this.n)};

			this.isValidLoc = function() {
				if (this.x === undefined || isNaN(this.x)) return false;
				if (this.y === undefined || isNaN(this.y)) return false;
				if (this.n === undefined || isNaN(this.n)) return false;
				return true;
			};

			this.isValidEssai = function() {
				if (!this.isValidLoc) return false;
				if (this.c === undefined || isNaN(this.c)) return false;
				return true;
			};

			this.sameLocAs = function(oOther) {
				if (this.x != oOther.x) return false;
				if (this.y != oOther.y) return false;
				if (this.n != oOther.n) return false;
				return true;
			};

			this.sameAs = function(oOther) {
				if (!this.sameLocAs(oOther)) return false;
				if (this.c !== oOther.c) return false;
				return true;
			};

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
				var nMatches = this.nbMatchesOne(this.xText(), tabCoord[0]);
				nMatches += this.nbMatchesOne(this.yText(), tabCoord[1]);
				nMatches += this.nbMatchesOne(this.nText(), tabCoord[2]);
				return nMatches == this.c
			};

			this.forPsychoChasseur = function() {	// rend le bout de texte à mettre dans l'URL vers l'outil des Psycho Chasseurs
				return Math.abs(this.x) + '+' + Math.abs(this.y) + '+' + Math.abs(this.n) + '+' + this.c;
			};

			this.nbChiffre = function() {	// rend le nombre de chiffres (une coord à 1 chiffe en donne 2, le "0" et le chiffre des unités)
				return this.xText().length + this.yText().length + this.nText().length;
			};

			this.tabOccurenceChiffre = function() {	// le nombre d'occurrences de chaque chiffre (0 à 9) dans les coord
				var tabRet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				this.addOccurenceChiffre(tabRet, this.xText());
				this.addOccurenceChiffre(tabRet, this.yText());
				this.addOccurenceChiffre(tabRet, this.nText());
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
				for (let cEssai of this.gEssais) {
					if (!cEssai.isCompatible(newContexte.tabCoord)) {
						isCompatible = false;
						break;
					}
				}
				if (this.bDebug && newContexte.tabCoord[0] == '03' && newContexte.tabCoord[1] == '80') {
					let sCause = '';
					if (!isCompatible) {
						sCause = ' bad ' + cEssai.forPsychoChasseur() + ' nMatches=';
						sCause += cEssai.nbMatchesOne(cEssai.xText(), newContexte.tabCoord[0]);
						sCause += ' ' + cEssai.nbMatchesOne(cEssai.yText(), newContexte.tabCoord[1]);
						sCause += ' ' + cEssai.nbMatchesOne(cEssai.nText(), newContexte.tabCoord[2]);
					}
					window.console.log('CAPITAN calculeSolutionRecursifDigit, teste ' + newContexte.tabCoord.join("; ") + ', isCompatible=' + isCompatible + sCause);
				}
				if (isCompatible) {
					this.gListeSolutions.push(newContexte.tabCoord.slice());	// slice pour cloner le tableau
				}
			}
		},

		afficheInfoCarte: function(idCarte) {
			this.idCarte = idCarte;
			this.initCarte();
			/*
			var originalPosText = this.CAPITAN_getValue("capitan."+idCarte+".position");
			if (originalPosText === undefined) {
				let msg = "La recherche a été enregistrée. Mais vous n'avez pas encore affiché le détail de la carte "
					+ idCarte + " et le « script du Capitan » ne connait pas la position de la mort du Capitan. Il ne peut pas vous en dire plus. Allez dans «  EQUIPEMENT » et affichez cette carte.";
				window.console.log('afficheInfoCarte_log: ' + msg);
				this.afficheMsg(msg, 'red');
				return;
			}
			var originalPos = originalPosText.split(";");
			if(originalPos.length!=3) {
				msg = 'Text non reconnu : ' + originalPosText;
				window.console.log('afficheInfoCarte_log: ' + msg);
				this.afficheMsg(msg, 'red');
				return;
			}
			*/
			this.oMort = this.infoCartes[this.idCarte].mort;
			this.gEssais = new Array();
			var i = 0;
			var essaiText;
			while((essaiText = this.CAPITAN_getValue("capitan."+idCarte+".essai."+i)) != null)
			{
				//this.gEssais.push(this.CAPITAN_getValue("capitan."+idCarte+".essai."+i).split(";"));
				this.gEssais.push(new this.cEssai(essaiText));
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
		newRecherche: function(listeSolutions) {
			if(listeSolutions.length<=1)
				return null;

			var table = document.createElement('table');
			table.setAttribute('class', 'mh_tdborder');
			table.setAttribute('border', '0');
			table.setAttribute('cellspacing', '1');
			table.setAttribute('cellpadding', '4');
			table.setAttribute('style', 'width: 400px;');
			table.setAttribute('align', 'center');

			if (this.curPos == undefined) {
				var thead = document.createElement('thead');
				var tr = this.appendTr(thead, 'mh_tdtitre');
				var td = this.appendTdText(tr, "Impossible de suggérer une loc en mode smartphone sans MZ", true);
				td.setAttribute('align', 'center');
				table.appendChild(thead);
				return table;
			}

			// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, j'utilise repartition.length
			//var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
			var repartition = this.getRepartitionFromCase(this.curPos.x, this.curPos.y, this.curPos.n, listeSolutions);
			var size = repartition.length;
			if (this.bDebug) window.console.log('newRecherche_log: this.newRecherche_log, repartition=' + JSON.stringify(repartition));

			var nbNotZero = 0;
			for(var i=0;i<size;i++)
			{
				if(repartition[i]!=0)
					nbNotZero++;
			}
			var string = "Il y a une utilité de faire une recherche en X = "+this.curPos.x+" Y = "+this.curPos.y+" N = "+this.curPos.n;
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
							var tmprepartition = this.getRepartitionFromCase(this.curPos.x+dx, this.curPos.y+dy, this.curPos.n+dn, listeSolutions);
							var tmpmeanscore = this.getMeanPositionNumber(tmprepartition,listeSolutions.length);
							if(((dn==0 || !isNotN) && minsolution>=tmpmeanscore) || (dn!=0 && isNotN && tmpmeanscore<=2*minsolution/3))
							{
								minsolution = tmpmeanscore;
								repartition = tmprepartition;
								newpos = "X = "+(this.curPos.x+dx)+" Y = "+(this.curPos.y+dy)+" N = "+(this.curPos.n+dn);
								isNotN = (dn==0);
							}
						}
				if(minsolution == listeSolutions.length)
				{
					var thead = document.createElement('thead');
					var tr = this.appendTr(thead, 'mh_tdtitre');
					var td = this.appendTdText(tr, "Il n'y a aucune utilité de faire une recherche en X = "+this.curPos.x+" Y = "+this.curPos.y+" N = "+this.curPos.n, true);
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

		getIDCarte: function() {
			//if (this.bDebug) return;
			var infoObjet = document.evaluate("//h2[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			// si échec, essayer avec l'ancienne méthode
			if (!infoObjet) infoObjet = document.evaluate("//td[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			// si échec, essayer avec l'ancienne méthode
			if (!infoObjet) infoObjet = document.evaluate("//div[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if(infoObjet) return parseInt(infoObjet.nodeValue.replace('[', ''));
		},

		analyseObject: function() {
			//if (this.bDebug) {console.log('[Capitan debug] analyseObject: début'); console.trace();}
			var eSpacer = document.getElementById('spacerMZCapitan');
			if (eSpacer) return;	// déjà affiché
			if( !this.numTroll) {
				window.console.log('CAPITAN analyseObject: *** erreur *** pas de numéro de Trõll');
				return;
			}
			this.idCarte = this.getIDCarte();
			if (this.bDebug && this.idCarte == 11987020) {	// test Roule
				this.info.mort = new this.cEssai(-101, -8, -73);
			} else if (this.idCarte > 0) {
				this.initCarte();
			} else {
				var parentElt = document.body;
				var modalElt = document.evaluate("//div[@class = 'modal']",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (modalElt && !modalElt.errorIDDone) {
					modalElt.appendChild(document.createTextNode("Erreur à la récupération de l'ID de la carte"));
					modalElt.errorIDDone = true;
				}
				if (this.bDebug) console.log('[Capitan debug] analyseObject: pas trouvé de idCarte');
				return;
			}
			if (this.bDebug) window.console.log('CAPITAN analyseObject: this.analyseObject numTroll=' + this.numTroll + ', this.idCarte=' + this.idCarte + ', originalPos=' + originalPos);
			if(!originalPos || originalPos == null)
			{
				var infoPos = document.evaluate("//td/text()[contains(.,'ai été tué en')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if(!infoPos) {
					if (this.bDebug) window.console.log('CAPITAN analyseObject: numTroll=' + this.numTroll + ', this.idCarte=' + this.idCarte + ', impossible de trouver le texte de la mort du Capitan');
					return;
				}
				var listePos = infoPos.nodeValue.split("=");
				if(listePos.length!=4) {
					if (this.bDebug) window.console.log('CAPITAN analyseObject: numTroll=' + this.numTroll + ', this.idCarte=' + this.idCarte + ', impossible de trouver les coord. de la mort du Capitan ' + infoPos.nodeValue);
					return;
				}
				var x = parseInt(listePos[1]);
				var y = parseInt(listePos[2]);
				var n = parseInt(listePos[3]);
				if (this.bDebug) window.console.log('CAPITAN analyseObject: setValue("capitan.'+this.idCarte+'.position, '+x+";"+y+";"+n);
				this.CAPITAN_setValue("capitan."+this.idCarte+".position",x+";"+y+";"+n);
			}
			// Roule 23/11/2016 travail dans le body (ancienne version, fenêtre indépendante) ou dans la div modale (nouvelle version en "popup")
			var parentElt = document.body;
			var modalElt = document.evaluate("//div[@class = 'modal']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (modalElt) parentElt = modalElt;
			this.gDiv = document.createElement('div');
			parentElt.appendChild(this.gDiv);
			parentElt = this.gDiv;

			// bloc liste de solutions
			var table = this.afficheInfoCarte(this.idCarte);
			if (table) {
				var p = document.createElement('p');
				p.id = 'spacerMZCapitan';
				//window.console.log('analyseObject_log: table=' + JSON.stringify(table));
				p.appendChild(table);
				parentElt.appendChild(p);
			}

			// bloc utilité de faire une recherche sur la position courante
			table = this.newRecherche(this.gListeSolutions);
			if(table != null)
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
				table = this.prevRecherche(this.idCarte);
				var p = document.createElement('p');
				p.id = 'MZ_capitan_p_liste_memo';
				p.appendChild(table);
				parentElt.appendChild(p);
				// Roule 08/08/2016 bloc préparant les infos pour l'outil Mamoune (Psyko-Chasseurs)
				table = this.blocMamoune(this.idCarte);
				if(table!=null)
				{
					p = document.createElement('p');
					p.appendChild(table);
					parentElt.appendChild(p);
				}
			}
		},

		afficheMsg: function(msg, color) {
			let p = document.createElement('p');
			if (color) p.style.color = color;
			p.appendChild(document.createTextNode('MZ Capitan : ' + msg));
			let contMsg = document.getElementById('msgEffet');
			if (!contMsg) {
				contMsg = document.evaluate("//div[@class = 'modal']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			}
			if (!contMsg) contMsg = document.body;
			contMsg.appendChild(p);
		},

		// Roule 08/08/2016
		blocMamoune: function(idCarte) {
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
			if (this.curPos != undefined) {
				let currentPosAlreadyDone = false;
				for (let i = 0; i < this.gEssais.length; i++) {
					tabtxt.push(this.gEssais[i].forPsychoChasseur());
					if (this.gEssais[i].x == this.curPos.x && this.gEssais[i].y == this.curPos.y && this.gEssais[i].n == this.curPos.n) currentPosAlreadyDone = true;
				}
				if (!currentPosAlreadyDone) tabtxt.push(this.curPos.x + '+' + this.curPos.y + '+' + this.curPos.n + '+%3F');	// spécial pour demander à Mamoune ce qu'elle pense d'un essai à la position courante
			}
			var tr2 = this.appendTr(tbody, 'mh_tdpage');
			var td2 = this.appendTd(tr2);
			var originalPos = this.CAPITAN_getValue("capitan."+idCarte+".position").split(";");
			if(originalPos.length!=3) {
				td2.this.appendText('Erreur\u00A0: impossible de retrouver les coordonnées de la mort');
			} else {
				let a = document.createElement('a');
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

			let delRecherche = this.delRecherche.bind(this);	// créer une version de delrecherche qui aura le "bon" this
			for (var i = 0; i < this.gEssais.length; i++) {
				var td2 = this.createCase("X = " + this.gEssais[i].x + ", Y = "+this.gEssais[i].y +", N = " + this.gEssais[i].n + " => " + this.gEssais[i].c,tbody,400);
				var td3 = this.appendTd(td2.parentNode);
				var bt = this.appendButton(td3, "Supprimer", delRecherche);
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

		delRecherche: function(e) {
			let idEssaiDel = e.target.idEssai;
			let idCarte = e.target.idCarte;
			if (this.bDebug) window.console.log('CAPITAN delRecherche: idEssaiDel=' + idEssaiDel + ', idCarte=' + idCarte + ', this.gEssais.length=' + this.gEssais.length);
			this.gEssais.splice(idEssaiDel, 1);
			if (this.bDebug) window.console.log('delRecherche_log ' + JSON.stringify(this.gEssais));
			let lg = this.gEssais.length;
			for (let i = 0; i < lg; i++) {
				let clef = "capitan." + idCarte + ".essai." + i;
				let cEssai = this.gEssais[i];
				let v = cEssai.x + ';' + cEssai.y + ';' + cEssai.n + ';' + cEssai.c;
				if (this.bDebug) window.console.log('CAPITAN delRecherche_log: set ' + clef + '=' + v);
				this.CAPITAN_setValue(clef, v);
			}
			for (let i = 0; i < 10; i++) {	// pour être sûr, on  supprime les 10 suivantes
				let clef = "capitan." + idCarte + ".essai." + (i + lg);
				if (this.bDebug) window.console.log('CAPITAN delRecherche_log: remove ' + clef);
				this.CAPITAN_deleteValue(clef);
			}
			let eP = document.getElementById('MZ_capitan_p_liste_memo');
			while (eP.lastChild) eP.removeChild(eP.lastChild);
			let eTable = this.prevRecherche(idCarte);
			eP.appendChild(eTable);
			let tbody = document.getElementById('MZ_capitan_tbody_liste_memo');
			tbody.style.display = '';	// show
		},

		createNewRecherche: function(parentElt) {
			let p = document.createElement('p');

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
			this.addInput(td, "MZ_rX");
			td.appendChild(document.createTextNode(" Y = "));
			this.addInput(td, "MZ_rY");
			td.appendChild(document.createTextNode(" N = "));
			this.addInput(td, "MZ_rN");
			td.appendChild(document.createElement('br'));
			td.appendChild(document.createTextNode("Nombre de chiffres bien placés : "));
			this.addInput(td, "MZ_rBP",1);
			td.appendChild(document.createElement('br'));
			this.appendButton(td, "Ajouter", this.addRecherche.bind(this));

			p.appendChild(table);
			parentElt.appendChild(p);
		},

		addRecherche: function()
		{
			try
			{
				var x = document.getElementById('MZ_rX').value;
				var y = document.getElementById('MZ_rY').value;
				var n = document.getElementById('MZ_rN').value;
				var nbChiffres = document.getElementById('MZ_rBP').value;
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
				this.addOneRecherche(this.getIDCarte(), x, y, n, nbChiffres);
				this.reinit();
			}
			catch(e)
			{
				console.log(e);
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
			input.id = nom;
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
				var msg = document.getElementById("msgEffet").textContent;

				// fonctionne à la fois pour "Tu es dans..." et "Vous êtes dans..."
				if(!msg.match(/es dans le bon Xcoin/))
					x = -x;
				if(!msg.match(/es dans le bon Ycoin/))
					y = -y;

				this.CAPITAN_setValue("capitan."+idCarte+".this.signe",this.signe(x)+";"+this.signe(y));
			}

			var table = this.afficheInfoCarte(idCarte);

			if (!table) return;
			var p = document.createElement('p');
			p.appendChild(table);
			let t = document.getElementsByTagName('TABLE');
			if (t.length > 0) {
				t[0].parentNode.insertBefore(p, t[0].nextSibling);
			} else {
				document.body.appendChild(p);
			}
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

		CAPITAN_horsGM: false,

		initCarte: function() {	// idCarte dans this.idCarte
			if (this.infoCartes[this.idCarte]) return;	// déjà fait
			let info = {};
			if (this.modeIntege && MH_capitan_json && MH_capitan_json[this.idCarte]) {
				for (let k in MH_capitan_json[this.idCarte])
					info[k] = new cEssai(MH_capitan_json[k]);
				this.infoCartes[this.idCarte] = MH_capitan_json[this.idCarte];
			}
			// merge position mort en localStorage
			let oMortLocalStorage = new this.cEssai(this.CAPITAN_getValue("capitan."+this.idCarte+".position"));
			if (oMortLocalStorage.isValidLoc()) {
				if (info.mort) {
					if (!info.sameLocAs(oMortLocalStorage)) {
						console.log('[Capitan] divergence de loc de mort');
						console.log('centralisé');
						console.log(info.mort);
						console.log('localStorage');
						console.log(oMortLocalStorage);
					}
				} else {
					info.mort = oMortLocalStorage;
				}
			} else {
				console.log('[Capitan] mauvaise log de mort en localStorage: ' + this.CAPITAN_getValue("capitan."+this.idCarte+".position"));
				console.log(oMortLocalStorage);
			}
			// merge essais en localStorage
			let essaiText;
			for (let i = 0; (essaiText = this.CAPITAN_getValue("capitan."+this.idCarte+".essai."+i)) != null; i++) {
				let cEssai = new this.cEssai(essaiText);
				if (!cEssai.isValidEssai()) {
					console.log(`[Capitan] mauvaise loc en localStorage: ${essaiText}`);
					continue;
				}
				if (info.essais) for (let oEssai2 of info.essais) {
					if (!oEssai2.sameLocAs(cEssai)) continue;
					if (!oEssai2.sameAs(cEssai)) {
						console.log(`[Capitan] essais incohérents en localStorage: ${essaiText} <-> ${JSON.stringify(oEssai2)}`);
					}
					continue;
				}
				if (!info.essais) info.essais = [];
				info.essais.push(cEssai);
			}
			// merge cadran
			let txtCadran = this.CAPITAN_getValue("capitan."+this.idCarte+".this.signe");
			if (txtCadran != null) {
				var signes = this.CAPITAN_getValue("capitan."+this.idCarte+".this.signe").split(";");
				if (this.bDebug) window.console.log(`[CAPITAN debug] afficheInfoCarte_log txtCadran=${txtCadran}, signes=${JSON.stringify(signes)}`);
				if (info.signex) {
					if (signes[0] != info.signex) console.log(`[Capitan] signe X incohérent en localStorage: ${signes[0]} <-> ${info.signex}`);
				} else {
					info.signx = signes[0];
				}
				if (info.signey) {
					if (signes[1] != info.signey) console.log(`[Capitan] signe Y incohérent en localStorage: ${signes[1]} <-> ${info.signey}`);
				} else {
					info.signy = signes[1];
				}
			}

			/*
			if (originalPosText === undefined) {
				let msg = "La recherche a été enregistrée. Mais vous n'avez pas encore affiché le détail de la carte "
					+ idCarte + " et le « script du Capitan » ne connait pas la position de la mort du Capitan. Il ne peut pas vous en dire plus. Allez dans «  EQUIPEMENT » et affichez cette carte.";
				window.console.log('afficheInfoCarte_log: ' + msg);
				this.afficheMsg(msg, 'red');
				return;
			}
			}
			*/
			if (this.bDebug) console.log(`[Capitan debug] initCarte(${this.idCarte} => ${JSON.stringify(info)}`);
			this.infoCartes[this.idCarte] = info;
		},

		reinit: function() {
			if (this.gDiv) this.gDiv.parentNode.removeChild(this.gDiv);
			this.analyseObject();
		},

		MutationObserverConfig: { childList: true, subtree: true },

		init: function () {
			this.CAPITAN_horsGM = false;
			try {	// à partir du 11/07/2018, (GM_info === undefined) provoque une exception
				if (GM_info == undefined) {
					this.CAPITAN_horsGM = true;
				} else if (GM_info.script == undefined) {
					this.CAPITAN_horsGM = true;
				} else {
					if (this.bDebug) window.console.log('GM_info.script=' + JSON.stringify(GM_info.script));
					// si un autre script GM est actif sur la page, on peut avoir GM_Info.script qui existe. Ça ressemble à un bug de ViolentMonkey
					if (GM_info.script.name != 'Capitan') {
						this.CAPITAN_horsGM = true;
					} else if (GM_info.script.version == 'sans GM') {
						this.CAPITAN_horsGM = true;
					}
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

			this.modeIntege = (typeof MH_capitan_json !== 'undefined');
			this.MZ_ok = (typeof MH_capitan_json !== 'undefined');

			// charger le numéro du Troll
			let frameSommaire;
			let eltId = document.getElementById('footer');	// cas smartphone
			let p = window.parent;	// cas classique (pas smartphone)
			while (p) {	// cas classique (pas smartphone)
				frameSommaire = p.frames['Sommaire'];
				if (frameSommaire) break;
				p = p.parent;
			}
			if (frameSommaire) eltId = frameSommaire.document.getElementById ('id');
			if (eltId) {
				this.numTroll = parseInt(eltId.getAttribute('data-id'));
				if (this.bDebug) console.log(`[Capitan debug] troll id=${this.numTroll}`);
			} else this.numTroll = 0;	// on continue, pas de problème en mode intégré sauf qu'on ne récupère pas les anciennes cartes
			if (this.numTroll == 0) console.log('[Capitan] erreur à la récupération du numéro de Troll');
			// position courante du Troll
			eltId = undefined;
			if (frameSommaire) eltId = frameSommaire.document.getElementById ('DLA_xyn');
			if (eltId) {
				let m = eltId.innerText.match(/X\s*=\s*([-\d]+)[\s|]+Y\s*=\s*([-\d]+)[\s|]+N\s*=\s*([-\d]+)/im);
				if (m && m.length == 4) {
					this.curPos = new this.cEssai(m[1], m[2], m[3]);
					//if (this.bDebug) console.log(`[Capitan debug] init: pos from MH ${eltId.innerText}`)
				} else {
					console.log(`[Capitan] init erreur analyse position troll pour ${eltId.innerText}`);
				}
			}
			if (this.MZ_ok && !this.curPos) {
				// Roule 08/08/2016 utilisation de localStorage car c'est là que tout_MZ stocke les coord
				this.curPos = new this.cEssai(window.localStorage[this.numTroll+".position.X"],
					window.localStorage[this.numTroll+".position.Y"],
					window.localStorage[this.numTroll+".position.N"]);
				if (this.bDebug) window.console.log('CAPITAN init: position du troll récupérée en localStorage');
			}
			if (this.curPos && !this.curPos.isValidLoc()) {
				console.log(`[Capitan] position troll invalide: ${JSON.stringify(this.curPos)}`);
				this.curPos = undefined;
			}
			if (this.bDebug) window.console.log('CAPITAN init: position du troll=' + JSON.stringify(this.curPos));

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
				this.mutationObserver = new MutationObserver(this.analyseObject.bind(this));
				this.mutationObserver.observe(document.body, this.MutationObserverConfig);
			}
		},
	}
	try
	{
		oCAPITAN_MH_ROULE.init();
	} catch(e) {
		window.console.log('script capitan exception: ' + e + "\n" + e.stack);
	}
}
