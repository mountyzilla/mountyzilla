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
	var DLA = document.getElementsByTagName('script')[1]
		.textContent.match(/\d+/g);
	var newDLA = new Date( DLA[1],DLA[2],DLA[3],DLA[4],DLA[5],DLA[6] );
	newDLA.setMinutes(
		newDLA.getMinutes()+parseInt(document.getElementById('ai_NbMinutes').value)
	);
	return window.confirm(
		'Votre DLA sera décalée au : '+newDLA.toLocaleString()
		+'\nConfirmez-vous cette heure ?'
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
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDLA, true);
	}
}

/*-[functions]------------------- Alerte Mundi -------------------------------*/

function date_HommeVersTroll(dateH) {
// Entrée : arr(3) [jour, mois, an] humain
// Sortie : arr(3) [jour, mundi, cycle] trõll
	var jour = dateH[0], mois = dateH[1], an = dateH[2];
	
	// 26/08/2001 = 1° jour de la Saison du Hum du 1° cycle après Ragnarok
	var jour1 = new Date(2001,7,26);
	var date = new Date(an,mois-1,jour);
	var nbJours = Math.floor((date-jour1)/864e5);
	if(nbJours<0) {
		return  [nbJours, 0, 0];
	}
	
	var numCycle = Math.floor(nbJours/378);
	nbJours-=378*numCycle;
	numCycle+=1;
	if(nbJours<15) {
		var numMundi = 0;
	} else {
		nbJours-=14;
		var numMundi = Math.floor(nbJours/28);
		nbJours-=28*numMundi;
		numMundi+=1;
	}
	nbJours+=1;
	
	return [nbJours,numMundi,numCycle];
}

function isPaques(jour,mois,an) {
// Calcul du jour de Pâques grégorien, année>1583
// Algorithme "de Butcher", benchmark-optimal
	var nbCyclesMeton = an%19;
	var siecle = Math.floor(an/100);
	var dansSiecle = an-100*siecle;
	var nbCycles400a = Math.floor(siecle/4);
	var dansCycle400a = siecle-4*nbCycles400a;
	var proemptose = Math.floor((siecle+8)/25);
	var metemptpose = Math.floor((siecle-proemptose+1)/3);
	var epacte = (19*nbCyclesMeton+siecle-nbCycles400a-metemptpose+15)%30;
	var nbCycles4a = Math.floor(dansSiecle/4);
	var dansCycle4a = dansSiecle-4*nbCycles4a;
	var numLettreDom = (32+2*dansCycle400a+2*nbCycles4a-epacte-dansCycle4a)%7;
	var corr = Math.floor((nbCyclesMeton+11*epacte+22*numLettreDom)/451);
	var x = epacte+numLettreDom-7*corr+114;
	var moisPaques = Math.floor(x/31);
	var jourPaques = x+1-31*moisPaques;
	
	return jour==jourPaques && mois==moisPaques;
}

function chaineDateTrolle(dateT,dateH) {
	// Assignation des données de base
	var numJour = dateT[0], numMundi = dateT[1], numCycle = dateT[2];
	var jour = dateH[0], mois = dateH[1], an = dateH[2];
	var nomMundi = [
		'de la Saison du Hum',
		'du Phoenix',
		'de la Mouche',
		'du Dindon',
		'du Goblin',
		'du Démon',
		'de la Limace',
		'du Rat',
		"de l'Hydre",
		'du Ver',
		'du Fungus',
		'de la Vouivre',
		'du Gnu',
		'du Scarabée'
	];
	
	// Dates anté-Ragnarok
	if(numJour<0) {
		return (-numJour)+'° jour avant Ragnarok';
	}
	
	// Chaîne de base
	var str = "[";
	if(numJour==1) {
		str += "Mundidey ";
	} else {
		str += numJour+"° jour ";
	}
	str+=nomMundi[numMundi]+" du "+numCycle+"° cycle après Ragnarok]";
	
	// Ajout Z'nits & Fêtes
	if(jour==19 && mois==3) {
		str+=" [Z'nit du Silence]";
	} else if(jour==21 && mois==6) {
		str+=" [Z'nit de l'Obscurité]";
	} else if(jour==21 && mois==6) {
		str+=" [Z'nit du Jeûn]";
	} else if(jour==21 && mois==6) {
		str+=" [Z'nit de Folie]";
	} else if(jour==1 && mois==3) {
		str+=' [Jour du Sang]';
	} else if(jour==31 && mois==10) {
		str+=" [Fête d'Alouïne]";
	} else if(jour==25 && mois==12) {
		str+=" [Fête de N'hoyël]"
	} else if(jour==25 && mois==10) {
		str+=" [Journée d'la Paquerette]";
	} else if(isPaques(jour,mois,an)) {
		str+=" [Fête de Pähäk]";
	}
	// Ajout Sainte Malchance
	if(numJour==13) {
		str+=" [Jour de la Sainte Malchance]";
	}
	
	return str;
}

function corrigeLaDate() {
	try {
		var node = document.evaluate(
			"//div[@class='dateAction']/b",
			document, null, 9, null
		).singleNodeValue;
	} catch(e) {
		window.console.error('[corrigeLaDate] Node introuvable');
		return;
	}
	if(!node) { return; }
	
	// Construction chaîne date trõlle
	var ceJour = new Date();
	var dateH = [
		ceJour.getDate(),
		ceJour.getMonth()+1,
		ceJour.getFullYear()
	];
	var dateT = date_HommeVersTroll(dateH);
	var strDate = chaineDateTrolle(dateT,dateH);
	
	// Construction chaîne prochain Mundi
	var longueurMundi = (dateT[1]==0)?14:28;
	var avantMundi = longueurMundi+1-dateT[0];
	var strMundi = '[Prochain Mundidey ';
	if(avantMundi>1) {
		strMundi += 'dans '+avantMundi+' jours]';
	} else {
		strMundi += 'demain]';
	}
	
	// Déploiement
	node.innerHTML = strDate;
	try {
		node.parentNode.parentNode.replaceChild(
			document.createTextNode(strMundi),
			node.parentNode.nextSibling
		);
	} catch(e) {
		window.console.error('[corrigeLaDate/prochainMundi] Node introuvable');
	}
}

function prochainMundi() {
	try {
		var node = document.evaluate(
			"//form/descendant::div/b/text()[contains(.,'cycle après Ragnarok')]",
			document, null, 9, null).singleNodeValue;
	} catch(e) {
		window.console.error('[prochainMundi] Node introuvable');
		return;
	}
	if(!node) { return; }
	
	var longueurMois = node.nodeValue.indexOf('Saison du Hum')==-1?28:14;
	var jour = longueurMois+1-getNumber(node.nodeValue);
	if(node.nodeValue.indexOf('Mundidey')!=-1) { jour=longueurMois; }
	var txt = '[Prochain Mundidey ';
	if(jour>1) {
		txt += 'dans '+jour+' jours]';
	} else {
		txt += 'demain]';
	}
	insertText(node.parentNode.parentNode.nextSibling,txt,true);
}


/*                            Fonction principale                             */

function dispatch() {
	if(isPage('MH_Play/Play_action')) {
		corrigeLaDate();
	}
	else if(isPage('MH_Play/Actions/Play_a_Decaler.php')) {
		changeActionDecalage();
	}
	else if(isPage('MH_Play/Actions')) {
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
			|| messageTitle.indexOf('Explosion') != -1
			|| messageTitle.indexOf('Insulte') != -1) {
			traiteRM();
		}
	}
}

start_script(31);
dispatch();
displayScriptTime();
