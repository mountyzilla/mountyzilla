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

var pageNivURL = 'http://mountypedia.free.fr/mz/niveau_monstre_combat.php';
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
	}
	else {
		node = node.parentNode;
		appendBr(node);
		appendText(node, intitule);
		appendText(node, magie, true);
	}		
}

function getMM(sr) {
	sr = Number(sr.match(/\d+/));
	if(sr==10) {
		return '\u2265 ' + Math.round(50*rmTroll/sr);
	}
	if(sr<=50) {
		return Math.round(50*rmTroll/sr);
	}
	if(sr<90) {
		return Math.round((100-sr)*rmTroll/50);
	}
	return '\u2264 ' + Math.round((100-sr)*rmTroll/50);
}

function traiteMM() {
	var node = document.evaluate(
		"//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]",
		document, null, 9, null).singleNodeValue;
	
	if(node) {
		var mm = getMM(node.nodeValue);
		node = node.parentNode.nextSibling.nextSibling.nextSibling;
	}
	else {
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
	sr = Number(sr.match(/\d+/));
	var rm;
	if(mmTroll<=0)
		rm = 'Inconnue (quelle idée d\'avoir une MM valant'+mmTroll+' !)';
	else if(sr==10)
		rm = '\u2264 '+Math.round(sr*mmTroll/50);
	else if(sr<=50)
		rm = Math.round(sr*mmTroll/50);
	else if(sr<90)
		rm = Math.round(50*mmTroll/(100-sr));
	else
		rm = '\u2265 '+Math.round(50*mmTroll/(100-sr));
	return rm;
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


/*                            Fonction Poissotron                             */

function sendDices() {
	var dice = MZ_getValue(numTroll+'.POISS'); // = hash du mdp poissotron
	if(!dice || dice == '' || dice=='false')
		return false;
	
	var bonus = 0;
	var seuil_base = 0;
	var seuil_tot = 0;
	var chaineDes = '';
	
	var node = document.evaluate(
		"//td/text()[contains(., 'Page générée en')]",
		document, null, 2, null).stringValue;
	if(node)
		chaineDes += 'temps='+node.substring(node.indexOf('générée')+11, node.indexOf('sec')-1)+'&';
	
	node = document.evaluate("//b/text()[position()=1 and starts-with(., 'bonus')]",
						document, null, 2, null).stringValue;
	if(node)
		bonus = parseInt(node.match(/\d+/));
	
	var nodes = document.evaluate("//b/text()[position()=1 and contains(., 'jet de')]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++) {
		var nbrs = nodes.snapshotItem(i).nodeValue.match(/\d+/g);
		var diceValue = nbrs[0];
		seuil_base = parseInt(nbrs[1]);
		seuil_tot = seuil_base+bonus;
		chaineDes += 'comp[]='+diceValue+'&comp_seuil[]='+seuil_tot+'&';
		}
	
	// à revoir dès que j'ai une amélio...
	node = document.evaluate("//b[descendant::text()[1]=\"Jet d'amélioration\"]/following::b[1]/descendant::text()[1]",
						document, null, 2, null).stringValue;
	if(node)
		chaineDes += 'amel[]='+node+'&amel_seuil[]='+seuil_base+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Jet de Résistance.....')]/text()[1]",
						document, null, 7, null);
	for (var i=0 ; i<nodes.snapshotLength ; i++)
		chaineDes += 'sr[]='+nodes.snapshotItem(i).nodeValue+'&';
	
	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de Résistance de la Cible')]/text()[1]",
						document, null, 7, null);
	for (var i = 0; i < nodes.snapshotLength; i++)
		chaineDes += 'sr_seuil[]='+nodes.snapshotItem(i).nodeValue.match(/\d+/)+'&';
	
	if(chaineDes == '')
		return false;
	
	var fin = currentURL.indexOf('?');
	var url = currentURL.slice(currentURL.indexOf('/Actions')+9, fin != -1 ? fin : 500);
	if(url == 'Play_a_SortResult.php') {
		url = document.referrer;
		if(url.indexOf('?') == -1)
			url = url.slice(url.indexOf('/Actions')+9);
		else
			url = url.slice(url.indexOf('/Actions')+9, url.indexOf('?'));
		if(url == 'Sorts/Play_a_SortXX.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortXX.php/'+url;
			}
		else if(url == 'Sorts/Play_a_SortYY.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort')+12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortYY.php/'+url;
			}
		}
	else if(url == 'Play_a_Combat.php') {
		url = document.referrer;
		url = url.substring(url.indexOf('/Actions')+9);
		if(url.indexOf('ai_IdComp') != -1) {
			url = url.substring(url.indexOf('ai_IdComp')+10);
			url = url.substring(0,url.indexOf('&'));
			url = 'Competences/Play_a_Combat'+url+'.php';
			}
		else if(url.indexOf('as_NomSort') != -1) {
			url = url.substring(url.indexOf('as_NomSort')+11)
			url = url.substring(0,url.indexOf('&'));
			url = 'Sorts/'+url;
			}
		}
	
	addScript();
	MZ_xmlhttpRequest({
		method: 'GET',
		url: poissotron+'?url='+url+'&'+chaineDes+'&id='+numTroll+'&mdp='+dice,
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
			},
		onload: function(responseDetails) {
				var texte = responseDetails.responseText;
				if(texte.indexOf('error: ')!=-1) {
					window.alert(texte.substring(texte.indexOf('error: ')+7));
					MZ_setValue(numTroll+'.POISS', false);
					}
				}
		});
	return true;
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
	MZ_xmlhttpRequest({
		method: 'GET',
		url: idtURL + "?item=" + escape(nomIdt) + "&descr=" + escape(caracIdt),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		}
	});
	return true;
}*/


/*-[functions]------------------- Alerte Mundi -------------------------------*/

function prochainMundi() {
	var node = document.evaluate(
		"//form/descendant::div/b/text()[contains(.,'cycle après Ragnarok')]",
		document, null, 9, null).singleNodeValue;
	if(!node) {
		return;
	}
	var jour = 29-getNumber(node.nodeValue);
	if(node.nodeValue.indexOf('Mundidey')!=-1) jour=28;
	var txt = '[Prochain Mundidey ';
	if(jour>1) {
		txt += 'dans '+jour+' jours]';
	}
	else {
		txt += 'demain]';
	}
	insertText(node.parentNode.parentNode.nextSibling,txt,true);
}


/*                            Fonction principale                             */

function dispatch() {
	if(isPage('MH_Play/Play_action')) {
		prochainMundi();
	}
	else if(isPage('MH_Play/Actions')) {
		sendDices();
		if(document.evaluate(
				"//form/descendant::p/text()[contains(., 'Zone Piégée')]",
				document, null, 2, null).stringValue) {
			traiteMM();
		}
		else if(document.evaluate(
				"//tr/td/descendant::p/text()[contains(., 'identification a donné')]",
				document, null, 2, null).stringValue) {
			//getIdt();
			traiteRM();
		}
		else {
			traiteRM();
			getLevel();
		}
	}
	else {
		/* Traitement des messages du bot */
		var messageTitle = document.evaluate("//form/table/tbody/tr[1]/td[1]/"
			+"descendant::text()[contains(.,'[MountyHall]')]",
			document, null, 2, null).stringValue;
		if(messageTitle.indexOf('Attaquant') != -1
			&& messageTitle.indexOf('sur') != -1) {
			getLevel();
			traiteRM();
		}
		else if(messageTitle.indexOf('Résultat du pouvoir') != -1
			|| messageTitle.indexOf('Défenseur') != -1) {
			traiteMM();
		}
		else if(messageTitle.indexOf('Identification des trésors') != -1
			// à replacer avec Attaque après révision getLvl :
			|| messageTitle.indexOf('Explosion') != -1) {
			traiteRM();
		}
	}
}


start_script(31);
dispatch();
displayScriptTime();
