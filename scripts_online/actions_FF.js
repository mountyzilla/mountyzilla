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

/* TODO
 * getLvl pour Explo, Rotobaffe et cie
 */

var pageNivURL = 'http://mountypedia.ratibus.net/mz/niveau_monstre_combat.php';
//var idtURL = "http://mh.byethost5.com/idt_serveur.php";


/*                                Page de combat                                */

function getLevel() {
	var divList = document.getElementsByTagName('div');
	if(divList.length <= 2)
		return;
	
	// On essaie de voir si cette action était une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = '';
	// Modification pour Frénésie by TetDure
	var numAtt = 0;
	for (var i = 0; i < pList.length; i++) {
		if(pList[i].firstChild) {
			nomM = pList[i].firstChild.nodeValue;
			if(nomM && nomM.indexOf('Vous avez attaqué un') == 0)
				numAtt++;
			}
		}
	
	if(nomM == '')
		return;
	
	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if(divList[2].firstChild.nodeValue.indexOf('Attaque Normale') == -1 && numAtt != 2)
		comPX++;

	// Extraction des infos du monstre attaqué
	var idM;
	var male;
	if(nomM.slice(20, 21) == 'e') {
		male = false;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(22, nomM.indexOf('(') - 1);
		}
	else {
		male = true;
		idM = nomM.substring(nomM.indexOf('(') + 1, nomM.indexOf(')'));
		nomM = nomM.slice(21, nomM.indexOf('(') - 1);
		}
	
	if(idM == '')
		return;
	
	var bList = document.getElementsByTagName('b');
	var niveau = '';
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if(b.childNodes[0].nodeValue != "TUÉ")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			if(bList[i].childNodes[0].nodeValue == "TUÉ")
				return;
			if(bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if(nbPX == '')
			return;
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if(!nbPX)
			nbPX = 0;
		chaine = (male ? "Il" : "Elle") + " était de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if(comPX > nbPX) {
			chaine += "inférieur ou égal à " + Math.floor(niveau) + ".";
			niveau = "";
		} else if(Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if(niveau != '') {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick","window.open('" + pageNivURL + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}


/*-[functions]------------- Messages du bot : MM/RM --------------------------*/

function insertInfoMagie(node, intitule, magie) {
	if(node.nextSibling) {
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
	if(rmTroll<=0) {
		return 'Inconnue (quelle idée d\'avoir une RM valant'+rmTroll+' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if(sr==10) {
		return '\u2265 '+5*rmTroll;
	}
	if(sr<=50) {
		return Math.round(50*rmTroll/sr);
	}
	if(sr<90) {
		return Math.round((100-sr)*rmTroll/50);
	}
	return '\u2264 '+Math.round(rmTroll/5);
}

function traiteMM() {
	var node = document.evaluate(
		"//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]",
		document, null, 9, null).singleNodeValue;
	
	if(node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
	} else {
		var node = document.evaluate(
			"//p/text()[contains(., 'Seuil de Résistance')]",
			document, null, 9, null).singleNodeValue;
		if(!node) {
			return;
		}
		var mm = getMM(node.nodeValue);
		node = node.nextSibling.nextSibling;
	}
	insertInfoMagie(node,'MM approximative de l\'Attaquant...: ',mm);
}

function getRM(sr) {
	if(mmTroll<=0) {
		return 'Inconnue (quelle idée d\'avoir une MM valant'+mmTroll+' !)';
	}
	sr = Number(sr.match(/\d+/)[0]);
	if(sr==10) {
		return '\u2264 '+Math.round(mmTroll/5);
	}
	if(sr<=50) {
		return Math.round(sr*mmTroll/50);
	}
	if(sr<90) {
		return Math.round(50*mmTroll/(100-sr));
	}
	return '\u2265 '+5*mmTroll;
}

function traiteRM() {
	var nodes = document.evaluate(
		"//b[contains(preceding::text()[1],'Seuil de Résistance')]/text()[1]",
		document, null, 7, null);
	if(nodes.snapshotLength==0) {
		return;
	}
	
	for(var i=0 ; i<nodes.snapshotLength ; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
	}
}


/*                      Fonction stats IdT par Raistlin                       */
	
/*function getIdt() {
	if(MZ_getValue("SEND_IDT") == "non")
		return false;
		
	var regExpBeginning = /^\s+/;
	var regExpEnd       = /\s+$/;

	var nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donné le résultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if(!nomIdt)
		return false;

	var caracIdt;
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


/*-[functions]------------------- Décalage DLA -------------------------------*/

function confirmeDecalage() {
	// On vérifie que MH n'excluera pas déjà la demande (validNumeric)
	var nbMinutes = document.getElementById('ai_NbMinutes').value;
	if(!nbMinutes || isNaN(nbMinutes) || nbMinutes<1) { return false; }
	
	var newDLA = new Date( oldDLA );
	newDLA.setMinutes( newDLA.getMinutes()+Number(nbMinutes) );
	return window.confirm(
		'Votre DLA sera décalée au : '+newDLA.toLocaleString()
		+'\nConfirmez-vous ce décalage ?'
	);
}

function newsubmitDLA(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if(confirmeDecalage()) {
		this.submit();
	}
}

function changeActionDecalage() {
	if(MZ_getValue('CONFIRMEDECALAGE')!='true') {
		return;
	}
	try {
		// On récupère le contenu du script JS MH de calcul du décalage
		var scriptTxt = document.evaluate(
			".//script[ not(@src) ]",
			document, null, 9, null
		).singleNodeValue.textContent;
		// On en extrait la DLA courante
		scriptTxt = scriptTxt.slice(scriptTxt.indexOf('new Date(')+9);
		scriptTxt = scriptTxt.split('\n')[0];
		var nbs = scriptTxt.match(/\d+/g);
		oldDLA = new Date( nbs[0],nbs[1],nbs[2],nbs[3],nbs[4],nbs[5] );
	} catch(e) {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error('[changeActionDecalage] DLA non trouvée',e);
		return;
	}
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDLA, true);
	} else {
		avertissement('Erreur de parsage : confirmation de décalage impossible');
		window.console.error('[changeActionDecalage] ActionForm non trouvé');
	}
}

/*-[functions]------------------- Alerte Mundi -------------------------------*/

function prochainMundi() {
	try {
		var node = document.evaluate(
			"//div[@class='dateAction']/b",
			document, null, 9, null
		).singleNodeValue;
	} catch(e) {
		window.console.error('[prochainMundi] Date introuvable',e);
		return;
	}
	if(!node) { return; }
	
	var longueurMois = node.textContent.indexOf('Saison du Hum')==-1?28:14;
	var jour = longueurMois+1-getNumber(node.textContent);
	if(node.textContent.indexOf('Mundidey')!=-1) { jour=longueurMois; }
	var txt = '[Prochain Mundidey ';
	if(jour>1) {
		txt += 'dans '+jour+' jours]';
	} else {
		txt += 'demain]';
	}
	insertText(node.parentNode.nextSibling,txt,true);
}


/*                            Fonction principale                             */

function dispatch() {
	if(isPage('MH_Play/Play_action')) {
		prochainMundi();
	} else if(isPage('MH_Play/Actions/Play_a_Decaler.php')) {
		var oldDLA;
		changeActionDecalage();
	} else if(isPage('MH_Play/Actions')) {
		if(document.evaluate(
			"//form/descendant::p/text()[contains(., 'Zone Piégée')]",
			document, null, 2, null
		).stringValue) {
			traiteMM();
		} else if(document.evaluate(
			"//tr/td/descendant::p/text()[contains(., 'identification a donné')]",
			document, null, 2, null
		).stringValue) {
			//getIdt();
			traiteRM();
		} /*else {
			// Est censé se lancer sur quoi *précisément* ?
			traiteRM();
			getLevel();
		}*/
	} else {
		/* Traitement des messages du bot */
		var messageTitle = document.evaluate(
			"//form/table/tbody/tr[1]/td[1]/"
			+"descendant::text()[contains(.,'[MountyHall]')]",
			document, null, 2, null
		).stringValue;
		if(messageTitle.indexOf('Attaquant') != -1 &&
			messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
		} else if(messageTitle.indexOf('Résultat du pouvoir') != -1 ||
			messageTitle.indexOf('Défenseur') != -1) {
			traiteMM();
		} else if(messageTitle.indexOf('Identification des trésors') != -1 ||
			// à replacer avec Attaque après révision getLvl :
			messageTitle.indexOf('Explosion') != -1 ||
			messageTitle.indexOf('Insulte') != -1) {
			traiteRM();
		}
	}
}

start_script(31);
dispatch();
displayScriptTime();
