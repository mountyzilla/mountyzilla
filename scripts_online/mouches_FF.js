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

var mainTab, tr_mouches;

function initialiseMouches() {
// Lanceur global
	try {
		mainTab = document.getElementById('mouches');
		tr_mouches = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	} catch(e) {
		avertissement('Erreur MZ:<br />Consulter la console.');
		window.console.error('Erreur MZ mouches:\n'+e);
		return;
	}
	if(mainTab===void(0) || tr_mouches.snapshotLength==0) { return; }
	
	setDisplayMouches();
	traiteMouches();
}

function setDisplayMouches() {
// Initialise l'affichage / l'effacement du détail des mouches
	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleMouches;
	}
	
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(tfoot) {
		tfoot.style.cursor = 'pointer';
		tfoot.onclick = toggleMouches;
	}
	
	if(MZ_getValue('HIDEMOUCHES')=='true') {
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function toggleMouches() {
// Handler pour afficher / masquer les détasil
	if(MZ_getValue('HIDEMOUCHES')=='true') {
		MZ_setValue('HIDEMOUCHES','false');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = '';
		}
		document.getElementsByTagName('thead')[0].style.display = '';
	} else {
		MZ_setValue('HIDEMOUCHES','true');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function traiteMouches() {
// Traitement complet: présence et effets des mouches
	var listeTypes = {}, effetsActifs = {};
	
	for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
		var tr = tr_mouches.snapshotItem(i);
	
		// La mouche est-elle présente?
		var etat = document.evaluate(
			'./img',
			tr.cells[6], null, 9, null
		).singleNodeValue.alt;
		if(etat!='La Mouche est là') { continue; }
		// Extraction du type de mouche
		var type = trim(tr.cells[3].textContent);
		if(!listeTypes[type]) {
			listeTypes[type] = 1;
		} else {
			listeTypes[type]++;
		}
		
		// La mouche a-t-elle un effet?
		var effet = trim(tr.cells[2].textContent);
		if(etat!='La Mouche est là' || !effet) { continue; }
		// Si oui, extraction des effets (multiples pour pogées)
		var caracs = effet.split(' | ');
		for(var j=0 ; j<caracs.length ; j++) {
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			var valeur = Number(caracs[j].match(/-?\d+/)[0]);
			if(effetsActifs[carac]===void(0)) {
				effetsActifs[carac] = valeur;
			} else {
				effetsActifs[carac] += valeur;
			}
		}
	}
	
	// Extraction Effet total et affichage des différences à la normale
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(!tfoot) { return; }
	var nodeTotal = document.evaluate(
		".//b[contains(./text(),'Effet total')]",
		tfoot, null, 9, null
	).singleNodeValue.nextSibling;
	var effetsTheoriques = nodeTotal.nodeValue.split('|');
	var texte = ' ';
	for(var i=0 ; i<effetsTheoriques.length ; i++) {
		if(texte.length>1) { texte += ' | '; }
		var carac = trim(
			effetsTheoriques[i].substring(0,effetsTheoriques[i].indexOf(':')-1)
		);
		var valeur = effetsTheoriques[i].match(/-?\d+/)[0];
		if(effetsActifs[carac]!==void(0) && effetsActifs[carac]==valeur) {
			texte += effetsTheoriques[i];
		} else {
			texte += '<b>'+carac+' : '+aff(effetsActifs[carac]);
			if(carac=='TOUR') { texte += ' min'; }
			texte += '</b>';
		}
	}
	var span = document.createElement('span');
	span.innerHTML = texte;
	nodeTotal.parentNode.replaceChild(span,nodeTotal);
	
	// Affichage des différences du nombre de mouches de chaque type
	var mouchesParType = document.evaluate(
		"./tr/td/ul/li/text()",
		tfoot, null, 7, null
	);
	for(var i=0 ; i<mouchesParType.snapshotLength ; i++) {
		var node = mouchesParType.snapshotItem(i);
		var mots = node.nodeValue.split(' ');
		var type = mots.pop();
		if(!listeTypes[type]) {
			node.nodeValue += ' (0 présente)';
		} else if(mots[0]!=listeTypes[type]) {
			if(listeTypes[type]==1) {
				node.nodeValue += ' (1 présente)';
			} else {
				node.nodeValue += ' ('+listeTypes[type]+' présentes)';
			}
		}
	}
}

start_script();
initialiseMouches();
displayScriptTime();
