/*********************************************************************************
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

/* v3.1.1 by Dabihul - 2013-05-30
 * - nouvelle nouvelle gestion recherches (jquery + ajout colonne + renommage)
 * - ajout toggleMouches
 * 2013-08-19
 * - correction syntaxe alert
 * v3.1.2b by Dab - 2013-08-22
 * - correction affichage bordures via hide & display du thead
 */

var mainTab = document.getElementById('mouches');
var trmouches='';

function toggleMouches() {
	if (MZ_getValue('HIDEMOUCHES')=='true') {
		MZ_setValue('HIDEMOUCHES','false');
		for (var i=0 ; i<trmouches.snapshotLength ; i++)
			trmouches.snapshotItem(i).setAttribute('style','');
		document.getElementsByTagName('thead')[0].setAttribute('style','');
		}
	else {
		MZ_setValue('HIDEMOUCHES','true');
		for (var i=0 ; i<trmouches.snapshotLength ; i++)
			trmouches.snapshotItem(i).setAttribute('style','display:none;');
		document.getElementsByTagName('thead')[0].setAttribute('style','display:none;');
		}
	}

function setDisplayMouches() {
	if (!mainTab) return;
	trmouches = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	if (!trmouches) return;
	
	var titre = document.getElementById('titre2');
	if (titre) {
		titre.setAttribute('style','cursor:pointer;');
		titre.addEventListener('click', toggleMouches , false);
		}
	
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if (tfoot) {
		tfoot.setAttribute('style','cursor:pointer;');
		tfoot.addEventListener('click', toggleMouches , false);
		}
	
	if (MZ_getValue('HIDEMOUCHES')=='true') {
		for (var i=0 ; i<trmouches.snapshotLength ; i++)
			trmouches.snapshotItem(i).setAttribute('style','display:none;');
		document.getElementsByTagName('thead')[0].setAttribute('style','display:none;');
		}
	}

function traiteMouches() {
	if (!mainTab) return;

	/* Extraction des bm des mouches actives */
	var mouchesLa = document.evaluate("./tbody/tr/td[7]/img[@alt='La Mouche est là']/../../td[3]/nobr[1]",
										mainTab, null, 7, null);
	var listePouvoirs = [], listeTypes = [];
	for (var i=0 ; i<mouchesLa.snapshotLength ; i++) {
		var node = mouchesLa.snapshotItem(i);
		// pour décompte final type de mouches
		var type = trim(node.parentNode.parentNode.childNodes[7].textContent);
		if (!listeTypes[type])
			listeTypes[type] = 1;
		else
			listeTypes[type]++;
		if (!node.textContent) continue;
		// gestion bonus (multiples pour pogées)
		var caracs = node.textContent.split(' | ');
		for (var j=0 ; j<caracs.length ; j++) {
			var valeur = parseInt(caracs[j].match(/-?\d+/));
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			if (!listePouvoirs[carac])
				listePouvoirs[carac] = valeur;
			else
				listePouvoirs[carac] += valeur;
			}
		}
	
	/* Extraction Effet total et affichage variation */
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if (!tfoot) return;
	var node = document.evaluate(".//b[contains(./text(),'Effet total')]", tfoot,
								null, 9, null).singleNodeValue.nextSibling;
	var effetsmax = node.nodeValue.split('|');
	var texte = ' ';
	for (var i=0 ; i<effetsmax.length ; i++) {
		if (texte.length!=1)
			texte += ' | ';
		var carac = trim(effetsmax[i].substring(0,effetsmax[i].indexOf(':')-1));
		var bonus = effetsmax[i].match(/-?\d+/);
		if (!listePouvoirs[carac]) listePouvoirs[carac]=0;
		if (listePouvoirs[carac]!=bonus) {
			texte += '<b>'+carac+' : '+aff(listePouvoirs[carac]);
			if (carac=='TOUR') texte += ' min';
			texte += '</b>';
			}
		else
			texte += effetsmax[i];
		}
	span = document.createElement('span');
	span.innerHTML = texte;
	node.parentNode.replaceChild(span, node);
	
	/* Affichage différences décomptes par type */
	var mouchesParType = document.evaluate("./tr/td/ul/li/text()", tfoot, null, 7, null);
	for (var i=0 ; i<mouchesParType.snapshotLength ; i++) {
		var node = mouchesParType.snapshotItem(i);
		var mots = node.nodeValue.split(' ');
		var type = mots.pop();
		if (!listeTypes[type])
			node.nodeValue += ' (0 présente)';
		else if (mots[0]!=listeTypes[type]) {
			if (listeTypes[type]==1)
				node.nodeValue += ' (1 présente)';
			else
				node.nodeValue += ' ('+listeTypes[type]+' présentes)';
			}
		}
	}

try {
start_script();
setDisplayMouches();
traiteMouches();
displayScriptTime();
}
catch(e) {window.alert(e)}
