/*******************************************************************************
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

/*-[functions]-------------- Fonctions utilitaires ---------------------------*/

function couleurAleatoire() {
	var alph = '0123456789ABCDEF'.split('');
	var clr = '#';
	for (var i=0; i<6; i++) {
		clr+=alph[ Math.floor(16*Math.random()) ];
	}
	return clr;
}

function isCouleur(str) {
	return /^#[0-9A-F]{6}$/i.test(str);
}

/*-[functions]---------------- Analyse de la page ----------------------------*/

function appendChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	if(isDetailOn) {
		span.style.display = 'none';
	}
	var couleur = id=='AllAmis'?'#AAFFAA':'#FFAAAA';
	if(diploGuilde[id]) {
		couleur = diploGuilde[id];
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	node.appendChild(span);
}

function insertChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	// La couleur détaillée passera à une valeur aléatoire
	// si toggle vers isDetailOn
	var couleur = couleurAleatoire();
	if(!isDetailOn) {
		span.style.display = 'none';
	} else if(diploGuilde[id]) {
		couleur = diploGuilde[id].couleur;
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	insertBefore(node,span);
}

function setChoixCouleurs() {
	try {
		var form = document.getElementsByName('ActionForm')[0];
		var nodesAE = document.evaluate(
			"./table/tbody/tr/td[@class='mh_tdtitre']",
			form, null, 7, null
		);
		var nodes = document.evaluate(
			"./table/tbody/tr/td[not(@class='mh_tdtitre')]",
			form, null, 7, null
		);
	} catch(e) {
		console.error('[Diplomatie] Structure de la page non reconnue');
		return false;
	};
	nodesAE.snapshotItem(0).parentNode.id = 'insertPt';
	appendChoixCouleur(nodesAE.snapshotItem(0),'AllAmis');
	appendChoixCouleur(nodesAE.snapshotItem(1),'AllEnnemis');
	for(var i=0 ; i<5 ; i++) {
		nodes.snapshotItem(i).id = 'tdAmis'+i;
		insertChoixCouleur(nodes.snapshotItem(i).childNodes[1],'Amis'+i);
		nodes.snapshotItem(i+5).id = 'tdEnnemis'+i;
		insertChoixCouleur(nodes.snapshotItem(i+5).childNodes[1],'Ennemis'+i);
	}
	return true;
}

function fetchDiploGuilde() {
	try {
		for(var AE in {Amis:0,Ennemis:0}) {
			for(var i=0 ; i<5 ; i++) {
				/* Récup des A/E de rang i */
				var td = document.getElementById('td'+AE+i);
				var ligne = td.getElementsByTagName('table')[0].rows;
				var titre = trim(td.firstChild.textContent);
				// On laisse la gestion des couleurs à setChoixCouleurs:
				var couleur = document.getElementById(AE+i).value;
				diploGuilde[AE+i] = {
					Troll:'',
					Guilde:'',
					titre: titre,
					couleur: couleur
				};
				for(var j=1 ; j<ligne.length ; j++) {
					var str = trim(ligne[j].cells[0].textContent);
					var idx = str.lastIndexOf('(');
					var num = str.slice(idx+1,-1);
					var type = trim(ligne[j].cells[1].textContent);
					diploGuilde[AE+i][type] += num+';';
				}
			}
		}
	} catch(e) {
		console.error('[Diplomatie] Échec de récupération de la diplo\n'+e);
		return false;
	}
	return true;
}


/*-[functions]--------------------- Handlers ---------------------------------*/

function toggleDetails() {
	isDetailOn = !isDetailOn;
	for(var AE in {Amis:0,Ennemis:0}) {
		document.getElementById('spanAll'+AE).style.display =
			(isDetailOn?'none':'');
		for(var i=0 ; i<5 ; i++) {
			document.getElementById('span'+AE+i).style.display =
				(isDetailOn?'':'none');
		}
	}
}

function toggleMythiques() {
	isMythiquesOn = !isMythiquesOn;
	document.getElementById('spanMythiques').style.display =
		(isMythiquesOn?'':'none');
}

function previewCouleur() {
	var value = this.value;
	if(isCouleur(value)) {
		this.style.backgroundColor = value;
		this.title = '';
	} else {
		this.style.backgroundColor = '';
		this.title = 'Entrez une couleur au format #789ABC pour prévisualiser';
	}
}

function appendMenuType(node,duType) {
	var select = document.createElement('select');
	select.className = 'SelectboxV2';
	var type = ['Guilde','Troll','Monstre'];
	for(var i=0 ; i<3 ; i++) {
		appendOption(select,type[i],type[i]);
		if(type[i]==duType) { select.selectedIndex=i; }
	}
	node.appendChild(select);
}

function ajouteChamp(type,num,couleur,descr) {
	var champs = document.getElementById('diploPerso');
	var nb = champs.rows.length;
	var tr = champs.insertRow(-1);
	var td = appendTd(tr);
	appendMenuType(td,type);
	td = appendTd(tr);
	appendText(td,' n°');
	appendTextbox(td,'text','num'+nb,6,15,num);
	td = appendTd(tr);
	appendText(td,' couleur HTML:');
	var input = appendTextbox(td,'text','couleur'+nb,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td = appendTd(tr);
	appendText(td,' Description:');
	appendTextbox(td,'text','descr'+nb,30,150,descr);
	td = appendTd(tr);
	var span = document.createElement('span');
	appendText(span,'[ok!]',true);
	span.style.visibility = 'hidden';
	td.appendChild(span);
	td = appendTd(tr);
	var bouton = appendButton(td,'Suppr.',retireCeChamp);
}

function retireCeChamp() {
	var thisTr = this.parentNode.parentNode;
	thisTr.parentNode.removeChild(thisTr);
	var champs = document.getElementById('diploPerso');
	if(champs.rows.length==0) { ajouteChamp(); }
}

function valideChamp(champ) {
	var isValide = /^\d+$/.test(champ.cells[1].childNodes[1].value) &&
		isCouleur(champ.cells[2].childNodes[1].value);
	if(isValide) {
		champ.cells[4].firstChild.style.visibility = 'visible';
	} else {
		champ.cells[4].firstChild.style.visibility = 'hidden';
	}
	return isValide;
}

function sauvegarderTout() {
	/* Diplo de guilde */
	diploGuilde.isOn =
		document.getElementById('isGuildeOn').checked?'true':'false';
	diploGuilde.isDetailOn = (isDetailOn?'true':'false');
	var numGuilde = Number(document.getElementById('numGuilde').value);
	var couleur = document.getElementById('couleurGuilde').value;
	if(numGuilde) {
		diploGuilde.guilde = {
			id: numGuilde,
			couleur: couleur
		};
	} else {
		delete diploGuilde.guilde;
	}
	for(var AE in {Amis:0,Ennemis:0}) {
		diploGuilde['All'+AE] = document.getElementById('All'+AE).value;
		for(var i=0 ; i<5 ; i++) {
			if(isDetailOn) {
				diploGuilde[AE+i].couleur = document.getElementById(AE+i).value;
			} else {
				diploGuilde[AE+i].couleur = diploGuilde['All'+AE];
			}
		}
	}
	MZ_setValue(numTroll+'.diplo.guilde',JSON.stringify(diploGuilde));
	
	/* Diplo personnelle (ex-fonction saveChamps) */
	var champs = document.getElementById('diploPerso');
	diploPerso = {
		isOn: document.getElementById('isPersoOn').checked?'true':'false',
		Guilde: {},
		Troll: {},
		Monstre: {}
	};
	if(isMythiquesOn &&
		isCouleur(document.getElementById('couleurMythiques').value)) {
		diploPerso.mythiques = document.getElementById('couleurMythiques').value;
	}
	for(var i=0 ; i<champs.rows.length ; i++) {
		if(valideChamp(champs.rows[i])) {
			var type = champs.rows[i].cells[0].firstChild.value;
			var num = champs.rows[i].cells[1].childNodes[1].value;
			var couleur = champs.rows[i].cells[2].childNodes[1].value;
			var descr = champs.rows[i].cells[3].childNodes[1].value;
			diploPerso[type][num] = {
				couleur: couleur
			};
			if(descr) {
				diploPerso[type][num].titre = descr;
			}
		}
	}
	MZ_setValue(numTroll+'.diplo.perso',JSON.stringify(diploPerso));

	avertissement('Données sauvegardées');
}


/*-[functions]------------- Modifications de la page -------------------------*/

function creeTablePrincipale() {
	var insertPt = document.getElementById('insertPt');
	
	/* Titre + bouton de Sauvegarde */
	var tr = insertTr(insertPt,'mh_tdtitre');
	var td = appendTdText(tr,'[Mountyzilla] Options de Diplomatie ',true);
	appendButton(td,'Sauvegarder',sauvegarderTout);
	
	/* Options fixes */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie de guilde:',true);
	appendBr(td);
	appendCheckBox(td,'isGuildeOn',diploGuilde.isOn!='false');
	appendText(td,'Afficher la diplomatie de guilde dans la Vue');
	appendBr(td);
	appendCheckBox(td,'detailOn',isDetailOn,toggleDetails);
	appendText(td,'Utiliser des couleurs détaillées (10)');
	
	/* Diplo personnelle */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie personnelle:',true);
	appendBr(td);
	// Diplo Mythiques
	appendCheckBox(td,'isMythiquesOn',isMythiquesOn,toggleMythiques);
	appendText(td,'Ajouter les monstres Mythiques à la Diplomatie');
	var span = document.createElement('span');
	span.id = 'spanMythiques';
	if(!isMythiquesOn) {
		span.style.display = 'none';
	}
	var couleur = '#FFAAAA';
	if(diploPerso.mythiques) {
		couleur = diploPerso.mythiques;
	}
	appendText(span,' - couleur HTML:');
	var input = appendTextbox(span,'text','couleurMythiques',7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td.appendChild(span);
	appendBr(td);
	// Diplo éditable
	appendCheckBox(td,'isPersoOn',diploPerso.isOn!='false');
	appendText(td,'Afficher la diplomatie personnelle dans la Vue:');
	appendBr(td);
	var table = document.createElement('table');
	table.id = 'diploPerso'
	td.appendChild(table);
	for(var type in {Guilde:0,Troll:0,Monstre:0}) {
		for(var num in diploPerso[type]) {
			ajouteChamp(
				type,
				num,
				diploPerso[type][num].couleur,
				diploPerso[type][num].titre
			);
		}
	}
	if(table.rows.length==0) {
		ajouteChamp();
	}
	appendButton(td,'Ajouter',ajouteChamp)
	// Prévisualisation couleurs (merci à Vys d'avoir implémenté ça xD)
	appendText(td,' ');
	appendButton(td,
		'Exemples de couleur',
		function() {
			var fenetre = window.open(
				'/mountyhall/MH_Play/Options/Play_o_Color.php',
				'Divers',
				'width=500,height=550,toolbar=0,location=0,directories=0,'+
				'status=0,menubar=0,resizable=1,scrollbars=1'
			);
			fenetre.focus();
		}
	);
	
	/* Couleur de Guilde */
	tr = insertTr(insertPt,'mh_tdtitre');
	td = appendTdText(tr,'GUILDE',true);
	appendText(td,' - n°');
	appendTextbox(td,'text','numGuilde',5,10,
		diploGuilde.guilde && diploGuilde.guilde.id ?
			diploGuilde.guilde.id : ''
	);
	appendText(td,' - Couleur HTML: ');
	var input = appendTextbox(td,'text','couleurGuilde',7,7,
		diploGuilde.guilde && diploGuilde.guilde.couleur ?
			diploGuilde.guilde.couleur : '#BBBBFF'
	);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
}


/*-[functions]----------------------- Main -----------------------------------*/

var diploGuilde = MZ_getValue(numTroll+'.diplo.guilde') ?
	JSON.parse(MZ_getValue(numTroll+'.diplo.guilde')) : {};
var isDetailOn = diploGuilde.isDetailOn=='true';
var diploPerso = MZ_getValue(numTroll+'.diplo.perso') ?
	JSON.parse(MZ_getValue(numTroll+'.diplo.perso')) : {};
var isMythiquesOn = diploPerso.mythiques!=undefined;

if(setChoixCouleurs() && fetchDiploGuilde()) {
	creeTablePrincipale();
}
