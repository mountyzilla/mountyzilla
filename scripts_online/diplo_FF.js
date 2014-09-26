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
 X Étape 3: Ajout de la diplo perso
 X Étape 4: Gestion distante (sécurisée par mdp) de cette option
 X Étape 5: Ajout des fioritures (preview de la couleur...)
 
 Options Globales:
 Actuelles:
 	numTroll.USECSS,
 	numTroll.NODIPLO
 Nouvelles:
 	TODO numTroll.USECSS
 	numTroll.diplo.guilde
 	numTroll.diplo.guilde.off (remplace NODIPLO)
 	numTroll.diplo.perso
 	numTroll.diplo.perso.off (remplace NODIPLO)
 	
 Structure de diplo.guilde :
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


/*-[functions]---------------- Lecture de la page ----------------------------*/

function appendChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	if(isDetailOn) {
		span.style.display = 'none';
	}
	var couleur = id=='AllAmis' ? '#AAFFAA':'#FFAAAA';
	if(diploGuilde[id]) {
		couleur = diploGuilde[id];
	}
	appendText(span,' - Couleur HTML: ');
	appendTextbox(span,'text',id,7,7,couleur);
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
	appendTextbox(span,'text',id,7,7,couleur);
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
				if(ligne.length>1) {
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
		}
	} catch(e) {
		console.error('[Diplomatie] Échec de récupération de la diplo\n'+e);
		return statutDiplo!='tout';
	}
	/*console.log('STR=\n'+str);
	console.log('MZ_getValue='+MZ_getValue(numTroll+'.diplo.guilde'));*/
	return true;
}


/*-[functions]------------- Modifications de la page -------------------------*/

function creeTablePrincipale() {
	var insertPt = document.getElementById('insertPt');
	
	/* Titre + bouton de Sauvegarde */
	var tr = insertTr(insertPt,'mh_tdtitre');
	var td = appendTdText(tr,'[Mountyzilla] Diplomatie personnelle ',true);
	appendButton(td,'Sauvegarder',sauvegarderTout);
	
	/* Options fixes */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie de Guilde:',true);
	appendBr(td);
	chb = appendCheckBox(td,'diploGuildeOn',
		MZ_getValue(numTroll+'.diplo.guilde.off')!='true'
	);
	appendText(td,'Afficher la diplomatie de Guilde dans la Vue');
	appendBr(td);
	chb = appendCheckBox(td,'detailOn',isDetailOn,toggleDetails);
	appendText(td,'Utiliser des couleurs détaillées (10)');
	
	/* Diplo personnelle */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie personnelle:',true);
	appendBr(td);
	chb = appendCheckBox(td,'diploPersoOn',
		MZ_getValue(numTroll+'.diplo.perso.off')!='true'
	);
	appendText(td,'Afficher la diplomatie personnelle dans la Vue');
	appendBr(td);
	var table = document.createElement('table');
	table.id = 'diploPerso'
	td.appendChild(table);
	
	/* Couleur de Guilde */
	tr = insertTr(insertPt,'mh_tdtitre');
	td = appendTdText(tr,'GUILDE',true);
	appendText(td,' - n°');
	appendTextbox(td,'text','numGuilde',5,10,
		diploGuilde.guilde && diploGuilde.guilde.id ?
			diploGuilde.guilde.id : ''
	);
	appendText(td,' - Couleur HTML: ');
	appendTextbox(td,'text','couleurGuilde',7,7,
		diploGuilde.guilde && diploGuilde.guilde.couleur ?
			diploGuilde.guilde.couleur : '#BBBBFF'
	);
}

function refreshDiploPerso() {
	var td = document.getElementById('td_diploPerso');
	chb = appendCheckBox(td,'diploGuilde',statutDiplo!='perso');
	appendText(td,'Afficher la diplomatie de Guilde dans la Vue');
	appendBr(td);
	chb = appendCheckBox(td,'detailOn',isDetailOn,toggleDetails);
	appendText(td,
		'Utiliser des couleurs détaillées (10)'
	);
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

function validation() {
// Vérifie si les entrées sont au bon format

}

function sauvegarderTout() {
	/* Statut de la diplo */
	MZ_setValue(
		numTroll+'.diplo.guilde.off',
		document.getElementById('diploGuildeOn').checked?'false':'true'
	);
	MZ_setValue(
		numTroll+'.diplo.perso.off',
		document.getElementById('diploPersoOn').checked?'false':'true'
	);
	diploGuilde.isDetailOn = (isDetailOn?'true':'false');	
	
	/* Diplo de guilde */
	var numGuilde = Number(document.getElementById('numGuilde').value);
	var couleur = document.getElementById('couleurGuilde').value;
	if(numGuilde) {
		var obGuilde = {
			id: numGuilde,
			couleur: couleur
		};
		diploGuilde.guilde = obGuilde;
	} else {
		delete diploGuilde.guilde;
	}
	for(var AE in {Amis:0,Ennemis:0}) {
		diploGuilde['All'+AE] = document.getElementById('All'+AE).value;
		for(var i=0 ; i<5 ; i++) {
			if(diploGuilde[AE+i]) {
				diploGuilde[AE+i].titre = diploGuilde[AE+i].titre;
				if(isDetailOn) {
					diploGuilde[AE+i].couleur = diploGuilde[AE+i].couleur;
				} else {
					diploGuilde[AE+i].couleur = diploGuilde['All'+AE];
				}
			}
		}
	}
	// DEBUG
	//avertissement(JSON.stringify(diploGuilde));
	MZ_setValue(numTroll+'.diplo.guilde',JSON.stringify(diploGuilde));
	
	/* Diplo personnelle */
	/// ...
	
	avertissement('Données sauvegardées');
}


/*-[functions]----------------------- Main -----------------------------------*/

var diploGuilde = MZ_getValue(numTroll+'.diplo.guilde') ?
	JSON.parse(MZ_getValue(numTroll+'.diplo.guilde')) : {};
var isDetailOn = diploGuilde.isDetailOn=='true';
var diploPerso = MZ_getValue(numTroll+'.dilpo.perso') ?
	JSON.parse(MZ_getValue(numTroll+'.dilpo.perso')) : {};

if(setChoixCouleurs() && fetchDiploGuilde()) {
	creeTablePrincipale();
}
// DEBUG
//window.alert(MZ_getValue(numTroll+'.diplo.guilde').replace(/,/g,',\n'));
