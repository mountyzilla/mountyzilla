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

var pageNivURL = "http://mountypedia.free.fr/mz/niveau_monstre_combat.php";
var idtURL = "http://mh.byethost5.com/idt_serveur.php";

function getLevel() {
	var divList = document.getElementsByTagName('div');

	if (divList.length <= 2)
		return;

	// On essaie de voir si cette action était une attaque
	var pList = document.getElementsByTagName('p');
	var nomM = "";
	// Modification pour Frénésie by TetDure
	var numAtt = 0;
	for (var i = 0; i < pList.length; i++) {
		if(pList[i].childNodes[0])
		{
			nomM = pList[i].childNodes[0].nodeValue;
			if (nomM && nomM.indexOf("Vous avez attaqué un") == 0)
				numAtt++;
		}
	}

	if (nomM == "")
		return;

	// Si c'est une attaque normale, un seul PX
	var comPX = 1;
	if (divList[2].childNodes[0].nodeValue.indexOf("Attaque Normale") == -1 && numAtt != 2)
		comPX++;

	// Extraction des infos du monstre attaqué
	var idM;
	var male;
	if (nomM.slice(20, 21) == "e") {
		male = false;
		idM = nomM.substring(nomM.indexOf("(") + 1, nomM.indexOf(")"));
		nomM = nomM.slice(22, nomM.indexOf("(") - 1);
	} else {
		male = true;
		idM = nomM.substring(nomM.indexOf("(") + 1, nomM.indexOf(")"));
		nomM = nomM.slice(21, nomM.indexOf("(") - 1);
	}

	if (idM == "")
		return;

	var bList = document.getElementsByTagName('b');
	var niveau = "";
	for (var i = 0; i < bList.length; i++) {
		var b = bList[i];
		if (b.childNodes[0].nodeValue != "TUÉ")
			continue;
		var nbPX = "";
		for (i++; i < bList.length; i++) {
			// Si plusieurs monstres ont été tués (par ex. explo), on ne peut pas déduire leurs niveaux
			if (bList[i].childNodes[0].nodeValue == "TUÉ")
				return;
			if (bList[i].childNodes[0].nodeValue.indexOf("PX") != -1) {
				nbPX = bList[i].childNodes[0].nodeValue;
				break;
			}
		}
		if (nbPX == "")
			return;
		// Si on arrive ici c'est qu'on a trouvé un (et un seul) monstre tué et les PX gagnés
		nbPX = parseInt(nbPX.slice(0, nbPX.indexOf("P") - 1));
		if (!nbPX)
			nbPX = 0;
		chaine = (male ? "Il" : "Elle") + " était de niveau ";
		niveau = (nbPX * 1 + 2 * nivTroll - 10 - comPX) / 3;
		if (comPX > nbPX) {
			chaine += "inférieur ou égal à " + Math.floor(niveau) + ".";
			niveau = "";
		} else if (Math.floor(niveau) == niveau) {
			chaine += niveau + ".";
		} else {
			chaine = "Mountyzilla n'est pas arrivé à calculer le niveau du monstre.";
			niveau = "";
		}
		insertBr(b.nextSibling.nextSibling.nextSibling);
		insertText(b.nextSibling.nextSibling.nextSibling, chaine);
	}

	if (niveau != "") {
		var button = insertButtonCdm('as_Action');
		button.setAttribute("onClick","window.open('" + pageNivURL + "?id=" + (idM * 1) + "&monstre="
				+ escape(nomM) + "&niveau=" + escape(niveau)
				+ "', 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value = 'Merci de votre participation'; this.disabled = true;");
	}
}

// Magie

function insertInfoMagie(node, intitule, magie) {
	var gp = node.parentNode.parentNode;
	if (gp.childNodes.length > 5) {
		var lastNode = node.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
		insertBr(lastNode);
		insertText(lastNode, intitule);
		insertText(lastNode, magie, true);
	} else {
		appendBr(gp);
		appendText(gp, intitule);
		appendText(gp, magie, true);
	}
}

function getMM(sr) {
	sr = sr.slice(0, sr.indexOf("%") - 1);
	if (sr == 10)
		return "\u2265 " + Math.round((50 * rmTroll) / sr);
	if (sr <= 50)
		return Math.round((50 * rmTroll) / sr);
	if (sr < 90)
		return Math.round((100 - sr) * rmTroll / 50);
	return "\u2264 " + Math.round((100 - sr) * rmTroll / 50);
}

function traiteMM() {
	if (rmTroll == "")
		return false;

	var node = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (node)
		insertInfoMagie(node, "MM approximative de l'Attaquant...: ", getMM(node.nodeValue));
}

function getRM(sr, tsr, i) {
	sr = sr.slice(0, sr.indexOf("%") - 1);
	var rm;
	if (mmTroll <= 0)
		rm = "Inconnue (quelle idée d'avoir une MM valant" + mmTroll + " !)";
	else if (sr == 10)
		rm = "\u2264 " + Math.round((sr * mmTroll) / 50);
	else if (sr <= 50)
		rm = Math.round((sr * mmTroll) / 50);
	else if (sr < 90)
		rm = Math.round(50 * mmTroll / (100 - sr));
	else
		rm = "\u2265 " + Math.round(50 * mmTroll / (100 - sr));
	if (tsr)
		tsr[i] = sr > 10 && sr < 90 ? rm : -1;
	return rm;
}

function traiteRM() {
	var nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de Résistance')]/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	var tsr = new Array();
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var rm = getRM(node.nodeValue, tsr, i);
		insertInfoMagie(node, 'RM approximative de la Cible.......: ', rm);
	}
}

// Fonction Poissotron

function sendDices() {
	var dice = MZ_getValue("POISS_" + numTroll);
	if (!dice || dice == "" || dice=="false")
		return false;

	var bonus = 0;
	var comp_seuil = 0;
	var chaineDes = "";

	var node = document.evaluate("//td/text()[contains(., 'Page générée en')]",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (node)
		chaineDes += "temps=" + node.substring(node.indexOf("générée") + 11, node.indexOf("sec") - 1) + "&";

	node = document.evaluate("//b/descendant::text()[position() = 1 and contains(., '%') and starts-with(., 'bonus')]",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (node)
		bonus = node.substring(node.indexOf("de ") + 3, node.indexOf("%") - 1);

	var nodes = document.evaluate("//b/descendant::text()[position() = 1 and contains(., ' %)') "
			+ "and starts-with(., '(') and contains(., ' sur ')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var diceValue = nodes.snapshotItem(i).nodeValue;
		var seuil = diceValue.substring(diceValue.indexOf('sur') + 4, diceValue.indexOf('%') - 1);
		diceValue = diceValue.substring(1, diceValue.indexOf(' '));
		chaineDes += "comp[]=" + diceValue + "&comp_seuil[]=" + seuil + "&";
		comp_seuil = seuil;
	}

	node = document.evaluate("//b[descendant::text()[1] = \"Jet d'amélioration\"]/following::b[1]/descendant::text()[1]",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (node)
		chaineDes += "amel[]=" + node + "&amel_seuil[]=" + (comp_seuil - bonus) + "&";

	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Jet de Résistance.....')]/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++)
		chaineDes += "sr[]=" + nodes.snapshotItem(i).nodeValue + "&";

	nodes = document.evaluate("//b[contains(preceding::text()[1], 'Seuil de Résistance de la Cible')]/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var diceValue = nodes.snapshotItem(i).nodeValue;
		chaineDes += "sr_seuil[]=" + diceValue.substring(0, diceValue.indexOf(' ')) + "&";
	}

	if (chaineDes == "")
		return false;

	var fin = currentURL.indexOf('?');
	var url = currentURL.slice(currentURL.indexOf('/Actions') + 9, fin != -1 ? fin : 500);
	if (url == 'Play_a_SortResult.php') {
		url = document.referrer;
		if (url.indexOf('?') == -1)
			url = url.slice(url.indexOf('/Actions') + 9);
		else
			url = url.slice(url.indexOf('/Actions') + 9, url.indexOf('?'));
		if (url == 'Sorts/Play_a_SortXX.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort') + 12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortXX.php/' + url;
		} else if (url == 'Sorts/Play_a_SortYY.php') {
			url = document.referrer;
			url = url.slice(url.indexOf('&as_NomSort') + 12);
			url = url.slice(0, url.indexOf('&'));
			url = 'Sorts/Play_a_SortYY.php/' + url;
		}
	}
	else if(url == "Play_a_Combat.php")
	{
		url = document.referrer;
		url=url.substring(url.indexOf('/Actions')+9);
	    if(url.indexOf("ai_IdComp") != -1)
	    {
	      url=url.substring(url.indexOf('ai_IdComp')+10)
	      url=url.substring(0,url.indexOf('&'));
	      url="Competences/Play_a_Combat"+url+".php";
	    }
	    else if(url.indexOf("as_NomSort") != -1)
	    {
	      url=url.substring(url.indexOf('as_NomSort')+11)
	      url=url.substring(0,url.indexOf('&'));
	      url="Sorts/"+url;
	    }
	}

	addScript();
	MZ_xmlhttpRequest({
		method: 'GET',
		url: poissotron + "?url=" + url + "&" + chaineDes + "&id=" + numTroll + "&mdp=" + dice,
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml',
		},
		onload: function(responseDetails) {
				var texte = responseDetails.responseText;
				if(texte.indexOf("error: ")!=-1)
				{
					alert(texte.substring(texte.indexOf("error: ")+7));
					MZ_setValue("POISS_" + numTroll,false);
				}
			}
	});
	return true;
}

function getIdt() {
	if (MZ_getValue("SEND_IDT") == "non")
		return false;
		
	var regExpBeginning = /^\s+/;
	var regExpEnd       = /\s+$/;

	var nomIdt = document.evaluate(
			"//tr/td[contains(p/text(),'identification a donné le résultat suivant : ')]/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (!nomIdt)
		return false;

	var caracIdt;
	if (nomIdt.indexOf("Malédiction !") != -1) {
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
}

function dispatch() {
	if (isPage("MH_Play/Actions")) {
		sendDices();
		if (document.evaluate("//form/descendant::p/text()[contains(., 'Vous êtes entré dans une Zone Piégée')]",
			document, null, XPathResult.STRING_TYPE, null).stringValue)
			traiteMM();
		else if(document.evaluate("//tr/td/descendant::p/text()[contains(., 'identification a donné le résultat suivant')]",
			document, null, XPathResult.STRING_TYPE, null).stringValue)
		{
			traiteRM();
			getIdt();
		}
		else {
			traiteRM();
			getLevel();
		}
	} else {
		var messageTitle = document.getElementsByTagName('table')[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].firstChild.nodeValue;
		if (messageTitle.indexOf("[MountyHall] Résultat d'un pouvoir du monstre") != -1
				|| messageTitle.indexOf("[MountyHall] Résultat de Combat - Défenseur : ") != -1 )
			traiteMM();
		else {
			if (messageTitle.indexOf("[MountyHall] Résultat de Combat - Attaquant") != -1)
				getLevel();
			traiteRM();
		}
	}
}

start_script(31);

dispatch();

displayScriptTime();
