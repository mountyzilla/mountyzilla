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

var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles, checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres, checkBoxTactique;
var checkBoxLevels, checkBoxGowaps, checkBoxEngages, checkBoxMythiques;
var comboBoxNiveauMin, comboBoxNiveauMax;
var filtreMonstre = "", filtreTroll = "", filtreGuilde = "", filtreTresor = "", filtreLieu = "";
var listeCDM = new Array();

// Infos remplies par des scripts extérieurs
var cg = new Array();
var ct = new Array();
var listeCDM = new Array();

var listeLevels = new Array();
var listeTags = new Array();
var listeTagsInfos = new Array();
var listeTagsGuilde = new Array();
var listeTagsInfosGuilde = new Array();

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.addEventListener('mousemove', drag, false);

// PX trolls
var bulle;

//Infos trolls 
var popup;

var nbCDM = 0;

var nbTabSup = 0;
var oldNOEM = true;

// Différents tableaux
var totaltab = document.getElementsByTagName('table');
var x_monstres = totaltab[4].getElementsByTagName('tr');
var nbMonstres = x_monstres.length - 1;
var x_trolls = totaltab[6].getElementsByTagName('tr');
var nbTrolls = x_trolls.length - 1;
var x_tresors = totaltab[8].getElementsByTagName('tr');
var nbTresors = x_tresors.length - 1;
var x_champis = totaltab[10].getElementsByTagName('tr');
var nbChampis = x_champis.length - 1;
var x_lieux = totaltab[12].getElementsByTagName('tr');
var nbLieux = x_lieux.length - 1;

var isCDMsRetrieved = false;
var isDiploComputed = false;

//Utilisé pour supprimer les monstres "engagés"
var listeEngages = new Array();
var isEngagesComputed = false;
var cursorOnLink=false;

// UTILITAIRES

function setCheckBoxCookie(checkBox, cookie) {
	var filtre = checkBox.checked;
	MZ_setValue(cookie, filtre ? "true" : "false");
	return filtre;
}

function getCheckBoxCookie(checkBox, cookie) {
	checkBox.checked = MZ_getValue(cookie) == "true";
}

function setComboBoxCookie(comboBox, cookie) {
	var filtre = comboBox.selectedIndex;
	MZ_setValue(cookie, filtre);
	return filtre;
}

function getComboBoxCookie(comboBox, cookie) {
	if(MZ_getValue(cookie)!=null)
		comboBox.value = MZ_getValue(cookie);
}


function synchroniseFiltres() {
	getComboBoxCookie(comboBoxNiveauMin, "NIVEAUMINMONSTRE");
	getComboBoxCookie(comboBoxNiveauMax, "NIVEAUMAXMONSTRE");
	getCheckBoxCookie(checkBoxGowaps, "NOGOWAP");
	getCheckBoxCookie(checkBoxMythiques, "NOMYTH");
	getCheckBoxCookie(checkBoxEngages, "NOENGAGE");
	getCheckBoxCookie(checkBoxLevels, "NOLEVEL");

	getCheckBoxCookie(checkBoxIntangibles, "NOINT");

	getCheckBoxCookie(checkBoxGG, "NOGG");
	getCheckBoxCookie(checkBoxCompos, "NOCOMP");
	getCheckBoxCookie(checkBoxBidouilles, "NOBID");

	getCheckBoxCookie(checkBoxDiplo, "NODIPLO");
	getCheckBoxCookie(checkBoxTrou, "NOTROU");
	getCheckBoxCookie(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	getCheckBoxCookie(checkBoxTactique, "NOTACTIQUE");
	if(MZ_getValue("NOINFOEM") != "true")
		getCheckBoxCookie(checkBoxEM, "NOEM");
}

function getMonstreDistance(i) {
	return x_monstres[i].firstChild.firstChild.nodeValue;
}

function getMonstreID(i) {
	return x_monstres[i].childNodes[1].firstChild.nodeValue;
}

function getMonstreIDByTR(tr) {
	return tr.childNodes[1].firstChild.nodeValue;
}

function getMonstreLevelNode(i) {
	return x_monstres[i].childNodes[2];
}

function getMonstreLevel(i) {
	if(!isCDMsRetrieved)
		return -1;
	var id = getMonstreID(i);
	var donneesMonstre = listeCDM[id];
	if(!donneesMonstre)
		return -1;
	var level = donneesMonstre[0];
	return parseInt(level);
}

function getMonstreNom(i, force) {
	try
	{
		return x_monstres[i].childNodes[checkBoxLevels.checked && !force ? 2 : 3].firstChild.firstChild.nodeValue;
	}
	catch(e)
	{
		alert("Impossible de trouver le monstre "+i);
	}
}

function getMonstreNomByTR(tr, force) {
	return tr.childNodes[checkBoxLevels.checked && !force ? 2 : 3].firstChild.firstChild.nodeValue;
}

function getMonstrePosition(i) {
	var tds = x_monstres[i].childNodes;
	var c = checkBoxLevels.checked ? 0 : 1;
	return new Array(tds[3 + c].firstChild.nodeValue, tds[4 + c].firstChild.nodeValue, tds[5 + c].firstChild.nodeValue);
}

function updateTactique()
{
	var noTactique = setCheckBoxCookie(checkBoxTactique, "NOTACTIQUE");
	if(!isCDMsRetrieved)
		return;
	var imgUrl = "http://mountyzilla.tilk.info/scripts_0.9/images/calc2.png";
	if(noTactique)
	{
		for (var i = nbMonstres; --i >= 1;) 
		{
			var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
			var img = document.evaluate("img[@src='"+imgUrl+"']",
			tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if(img)
			{
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
			}
		}
	}
	else
	{
		computeTactique();
	}
}

var needComputeEnchantement = MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="";

function filtreMonstres() {
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/Competences/ecritureMagique.png";
	var urlEnchantImg = "http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png";
	var useCss = MZ_getValue("USECSS") == "true";
	var noGowaps = setCheckBoxCookie(checkBoxGowaps, "NOGOWAP");
	var noMythiques = setCheckBoxCookie(checkBoxMythiques, "NOMYTH");
	var noEngages = setCheckBoxCookie(checkBoxEngages, "NOENGAGE");
	var niveau_min = setComboBoxCookie(comboBoxNiveauMin, "NIVEAUMINMONSTRE");
	var niveau_max = setComboBoxCookie(comboBoxNiveauMax, "NIVEAUMAXMONSTRE");
	var noEM = true;
	if(MZ_getValue("NOINFOEM") != "true")
		noEM = setCheckBoxCookie(checkBoxEM, "NOEM");
	if (noEngages && !isEngagesComputed) {
		for (var i = nbTrolls+1; --i >= 3;) {
			var pos = getTrollPosition(i);
			if (!listeEngages[pos[0]])
				listeEngages[pos[0]] = new Array();
			if (!listeEngages[pos[0]][pos[1]])
				listeEngages[pos[0]][pos[1]] = new Array();
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}
	var filtre = filtreMonstre != "";
	totaltab[4].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.
				nodeValue = "MONSTRES ERRANTS" + (filtre ? " (filtrés sur " + filtreMonstre + ")" : "");
	if(niveau_min>0 || niveau_max>0)
	{
		var node = totaltab[4].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
		if(niveau_max>0)
			node.nodeValue += " "+niveau_max+ " >=";
		node.nodeValue += " NIVEAU";
		if(niveau_min>0)
			node.nodeValue += " >= "+niveau_min;
	}
	for (var i = nbMonstres+1; --i >= 3;) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(noEM != oldNOEM)
		{
			if(noEM)
			{
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				while(tr.childNodes.length>1)
					tr.removeChild(tr.childNodes[1]);
			}
			else
			{
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				var TypeMonstre=getEM(nom);
				if (TypeMonstre!="") {
				   var infosCompo=compoEM(TypeMonstre);
				   if(infosCompo.length>0)
				   {
						tr.appendChild(document.createTextNode(" "));
						tr.appendChild(createImage(urlImg, infosCompo));
					}
				}
			}
		}
		if(needComputeEnchantement || (noEM != oldNOEM && noEM))
		{
			var texte = getInfoEnchantementFromMonstre(nom);
			if(texte!="")
			{
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createImage(urlEnchantImg, texte));
			}
		}
		x_monstres[i].style.display =
				(noGowaps && nom.indexOf("gowap apprivoisé") != -1 && getMonstreDistance(i) > 1)
				|| (noEngages &&  getMonstreDistance(i)!=0 && listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]] && listeEngages[pos[0]][pos[1]][pos[2]])
				|| (filtre && nom.indexOf(filtreMonstre) == -1)
				|| ( niveau_min>0 && getMonstreLevel(i)<niveau_min && getMonstreDistance(i) > 1 && getMonstreDistance(i)!=-1 && nom.toLowerCase().indexOf("super bouffon") == -1 && nom.toLowerCase().indexOf("kilamo") == -1)
				|| ( niveau_max>0 && getMonstreLevel(i)>niveau_max && getMonstreDistance(i) > 1 && getMonstreDistance(i)!=-1 && nom.toLowerCase().indexOf("super bouffon") == -1 && nom.toLowerCase().indexOf("kilamo") == -1)
				? 'none' : '';
		if(nom.indexOf('liche')==0 || nom.indexOf('hydre')==0 || nom.indexOf('balrog')==0 || nom.indexOf('beholder')==0)
			if (!noMythiques)
			{
				if(useCss)
					x_monstres[i].setAttribute('class', 'mh_trolls_ennemis');
				else {
					x_monstres[i].setAttribute('class', '');
					x_monstres[i].style.backgroundColor = '#FFAAAA';
				}
			}
			else 
			{
				x_monstres[i].style.backgroundColor = "";
				x_monstres[i].setAttribute('class', 'mh_tdpage');
			}
	}
	if(MZ_getValue("NOINFOEM") != "true")
	{
		if(noEM != oldNOEM)
		{
			if(noEM)
				computeChargeProjoMonstre();
			if(noEM && isCDMsRetrieved)
			{
				computeMission();
			}
		}
		oldNOEM = noEM;
	}
	needComputeEnchantement = false;
}

function filtreLevels() {
	if (!setCheckBoxCookie(checkBoxLevels, "NOLEVEL")) {
		insertLevelColumn();
		if (!isCDMsRetrieved)
			retrieveCDMs();
		return;
	}
	if (!isCDMsRetrieved)
		return;
	for (var i = 3; i < nbMonstres+2; i++) {
		listeLevels[i] = getMonstreLevelNode(i).innerHTML;
		x_monstres[i].removeChild(getMonstreLevelNode(i));
	}
}

function retrieveCDMs() {
	if (checkBoxLevels.checked)
		return;
	var str = "";
	var begin = 3;
	var max = MZ_getValue("MAX_LEVEL");
	if(MZ_getValue('CDMID')==null)
		MZ_setValue('CDMID',1);
	max = Math.min(nbMonstres+1, (max == "" || max== null) ? 5000 : max);
	for (var i = 3; i < max; i++) {
		var nomMonstre = demarque(getMonstreNom(i, true));
		if(nomMonstre.indexOf(']') != -1)
			nomMonstre = nomMonstre.substring(0,nomMonstre.indexOf(']')+1);
		str += 'nom[]=' + escape(nomMonstre) + '$'
				+ (getMonstreDistance(i) <= 5 ? getMonstreID(i) : -getMonstreID(i)) + '&';
		if (i % 2000 == 0 || i == max - 1)
		{
			var url = 'http://mountypedia.free.fr/mz/monstres_0.9_post_FF.php';
			//?begin=' + begin+'&idcdm=' + MZ_getValue('CDMID') + '&' + str;
			//alert(url+"?"+'begin=' + begin+'&idcdm=' + MZ_getValue('CDMID') + '&' + str);
			MZ_xmlhttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'begin=' + begin+'&idcdm=' + MZ_getValue('CDMID') + '&' + str,
				onload: function(responseDetails) {
					try
					{
						var texte = responseDetails.responseText;
						var lines = texte.split("\n");
						if(lines.length==0)
							return;
						var begin2,end2,index;
						for(var j=0;j<lines.length;j++)
						{
								var infos = lines[j].split(";");
								if(infos.length<4)
									continue;
								var idMonstre=infos[0];
								var isCDM = infos[1];
								index = parseInt(infos[2]);
								var level = infos[3];
								infos=infos.slice(3);
								if(begin2==null)
									begin2=index;
								end2=index;
								listeCDM[idMonstre] = infos;
								if(isCDM==1)
									x_monstres[index].childNodes[2].innerHTML="<i>"+level+"</i>";
								else
									x_monstres[index].childNodes[2].innerHTML=level;
						}
						computeMission(begin2,end2);
					}
					catch(e)
					{
						alert(e+"\n"+url+"\n"+texte);
					}
				}
			});

			//appendNewScript('http://mountypedia.free.fr/mz/monstres_FF.php?begin=' + begin
			//		+'&end='+(i == max - 1)+'&idcdm=' + MZ_getValue('CDMID') + '&' + str,
			//		x_lieux[nbLieux - 1].parentNode.parentNode.parentNode);
			str = "";
			begin = i + 1;
		}
	}
	isCDMsRetrieved = true;
}


function insertLevelColumn() {
	var tr = insertTdText(getMonstreLevelNode(2), 'Niveau', true);
	tr.setAttribute('width', '25');

	for (var i = nbMonstres+1; --i >= 3;) {
		var td = insertTdText(getMonstreLevelNode(i), '-');
		//td.addEventListener("click", function() {getCDM(getMonstreNom(i, true),getMonstreID(i));},true);
		td.addEventListener("click", function() {getCDM(getMonstreNomByTR(this.parentNode, true),getMonstreIDByTR(this.parentNode));},true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdtitre'");
		td.setAttribute('onmouseout', "this.className = 'mh_tdpage';");
		td.setAttribute('style', "font-weight:bold; text-align:center;");
		if (isCDMsRetrieved)
			td.innerHTML = listeLevels[i];
	}
}

// GESTION TROLLS

function getTrollPosition(i) {
	var tds = x_trolls[i].childNodes;
	var j = tds.length;
	return new Array(tds[j - 3].firstChild.nodeValue, tds[j - 2].firstChild.nodeValue, tds[j - 1].firstChild.nodeValue);
}

function getTrollID(i) {
	return x_trolls[i].childNodes[1].firstChild.nodeValue;
}

function getTrollGuildeID(i) {
	if(x_trolls[i].childNodes[5].firstChild.nodeName=="A")
	{
		var href = x_trolls[i].childNodes[5].firstChild.getAttribute("href");
		return href.substring(href.indexOf('(')+1,href.indexOf(","));
	}
	return 1;
}

function getTrollDistance(i) {
	return x_trolls[i].firstChild.firstChild.nodeValue;
}

function filtreTrolls() {
	var noIntangibles = setCheckBoxCookie(checkBoxIntangibles, "NOINT");
	var filtreT = filtreTroll != "";
	var filtreG = filtreGuilde != "";
	totaltab[6].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.
				firstChild.firstChild.nodeValue = "TROLLS" + (filtreT ? " (filtrés sur " + filtreTroll + ")" : "")
				+ (filtreG ? " (guildes filtrées sur " + filtreGuilde + ")" : "");

	for (var i = nbTrolls+1; --i >= 3;) {
		var tds = x_trolls[i].childNodes;
		x_trolls[i].style.display = (noIntangibles && tds[2].firstChild.className == 'mh_trolls_0')
				|| (filtreT && tds[2].firstChild.firstChild.nodeValue.toLowerCase().indexOf(filtreTroll) == -1)
				|| (filtreG && (!tds[5].firstChild.firstChild || tds[5].firstChild.firstChild.nodeValue.toLowerCase().indexOf(filtreGuilde) == -1))
				? 'none' : '';
	}
}

function refreshDiplo() {
	if (setCheckBoxCookie(checkBoxDiplo, "NODIPLO")) {
		for (var i = nbTrolls+1; --i >= 3;) {
			x_trolls[i].style.backgroundColor = "";
			x_trolls[i].setAttribute('class', 'mh_tdpage');
		}
		return;
	}

	if (!isDiploComputed)
	{	
		MZ_xmlhttpRequest({
		    method: 'GET',
		    url: 'http://mountyzilla.tilk.info/scripts_0.9/getTroll_FF.php?num=' + numTroll,
		    headers: {
		        'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
		        'Accept': 'application/xml,text/xml',
		    },
		    onload: function(responseDetails) {
				try
				{
					responseDetails.responseXML = new DOMParser().parseFromString(responseDetails.responseText,'text/xml');
					var infosDiplo = responseDetails.responseXML;
					if(infosDiplo.getElementsByTagName('error').length>0)
					{
						MZ_setValue('NODIPLO','true');
						var bouton=document.getElementsByName('deldiplo')[0];
						bouton.checked=true;
						alert(infosDiplo.getElementsByTagName('error')[0].firstChild.nodeValue);
						return;
					}
					var infosDiploTrolls = infosDiplo.getElementsByTagName('troll');
					for(var i=0;i<infosDiploTrolls.length;i++)
					{
						ct[parseInt(infosDiploTrolls[i].firstChild.nodeValue)]=infosDiploTrolls[i].getAttribute("couleur");
					}
					var infosDiploGuildes = infosDiplo.getElementsByTagName('guilde');
					for(var i=0;i<infosDiploGuildes.length;i++)
					{
						cg[parseInt(infosDiploGuildes[i].firstChild.nodeValue)]=infosDiploGuildes[i].getAttribute("couleur");
					}
					isDiploComputed = true;
					putRealDiplo();
				}
				catch(e)
				{
					alert(e);
				}
			}
		});
	}
	else
		putRealDiplo();
}

function putRealDiplo() {
	var useCss = MZ_getValue("USECSS") == "true";
	for (var i = nbTrolls+1; --i >= 3;) {
		var troll = x_trolls[i];
		var cl = ct[getTrollID(i)];
		var guildeID = getTrollGuildeID(i);
		if (cl) {
			if (useCss && cl == '#AAFFAA')
				troll.setAttribute('class', 'mh_trolls_amis');
			else if (useCss && cl == '#FFAAAA')
				troll.setAttribute('class', 'mh_trolls_ennemis');
			else {
				troll.setAttribute('class', '');
				troll.style.backgroundColor = cl;
			}
		} else if (guildeID!=1) {
			cl = cg[guildeID];
			if (!cl)
				continue;
			if (useCss && cl == '#AAFFAA')
				troll.setAttribute('class', 'mh_guildes_amis');
			else if (useCss && cl == '#FFAAAA')
				troll.setAttribute('class', 'mh_guildes_ennemis');
			else if (useCss && cl == '#BBBBFF')
				troll.setAttribute('class', 'mh_guildes_perso');
			else {
				troll.setAttribute('class', '');
				troll.style.backgroundColor = cl;
			}
		}
	}
}

function initPXTroll() {
	bulle = document.createElement('div');
	bulle.setAttribute('id', 'bulle');
	bulle.setAttribute('class', 'mh_textbox');
	bulle.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 2;');
	document.body.appendChild(bulle);

	for (var i = nbTrolls+1; --i >= 3;) {
		var niv = x_trolls[i].childNodes[3];
		niv.addEventListener("mouseover", showPXTroll,true);
		niv.addEventListener("mouseout", hidePXTroll,true);
	}
}

function showPXTroll(evt) {
	var lvl = this.firstChild.nodeValue;
	bulle.innerHTML = 'Niveau ' + lvl + analysePXTroll(lvl);
	bulle.style.left = evt.pageX + 15 + 'px';
	bulle.style.top = evt.pageY + 'px';
	bulle.style.visibility = "visible";
}

function hidePXTroll() {
	bulle.style.visibility = "hidden";
}

// GESTION TRESORS

function getTresorNom(i) {
	var nom = x_tresors[i].childNodes[2].firstChild.childNodes;
	return nom.length == 1 ? nom[0].nodeValue : nom[1].firstChild.nodeValue;
}

function getTresorPosition(i) {
	var tds = x_tresors[i].childNodes;
	return new Array(tds[3].firstChild.nodeValue, tds[4].firstChild.nodeValue, tds[5].firstChild.nodeValue);
}

function getTresorDistance(i) {
	return x_tresors[i].firstChild.firstChild.nodeValue;
}

function filtreTresors() {
	var noGG = setCheckBoxCookie(checkBoxGG, "NOGG");
	var noCompos = setCheckBoxCookie(checkBoxCompos, "NOCOMP");
	var noBidouilles = setCheckBoxCookie(checkBoxBidouilles, "NOBID");
	var filtre = filtreTresor != "";
	var noEngages = setCheckBoxCookie(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	if (noEngages && !isEngagesComputed) {
		for (var i = nbTrolls+1; --i >= 3;) 
		{	
			var pos = getTrollPosition(i);
			if (!listeEngages[pos[0]])
				listeEngages[pos[0]] = new Array();
			if (!listeEngages[pos[0]][pos[1]])
				listeEngages[pos[0]][pos[1]] = new Array();
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}
	totaltab[nbTabSup+8].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.
				firstChild.firstChild.nodeValue = "TRESORS" + (filtre ? " (filtrés sur " + filtreTresor + ")" : "");
	for (var i = nbTresors+1; --i >= 3;) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		x_tresors[i].style.display = (noGG && nom.indexOf("Gigots de Gob") != -1)
				|| (noCompos && nom.indexOf(" Composant") != -1)
				|| (noEngages && listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]] && listeEngages[pos[0]][pos[1]][pos[2]] && getTresorDistance(i)>0)
				|| (filtre && nom.toLowerCase().indexOf(filtreTresor) == -1)
				|| (noBidouilles && nom.indexOf("[Bidouille] ") != -1)
			? 'none' : '';
	}
}

// GESTION LIEUX

function getLieuNom(i) {
	var nom = x_lieux[i].childNodes[2].childNodes[1].firstChild;
	return nom.nodeName != 'A' ? nom.nodeValue : (nom.firstChild.nodeValue == null ? nom.firstChild.innerHTML:nom.firstChild.nodeValue);
}

function getDistanceLieu(i) {
	return x_lieux[i].childNodes[0].childNodes[0].nodeValue * 1;
}

function filtreLieux() {
	var noTrou = setCheckBoxCookie(checkBoxTrou, "NOTROU");
	var filtre = filtreLieu != "";
	totaltab[nbTabSup+12].firstChild.firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.
			nodeValue = "LIEUX PARTICULIERS" + (filtre ? " (filtrés sur " + filtreLieu + ")" : "");
	for (var i = nbLieux+1; --i >= 3;)
		x_lieux[i].style.display = ((filtre && getLieuNom(i).toLowerCase().indexOf(filtreLieu) == -1) 
			|| (noTrou && getLieuNom(i).toLowerCase().indexOf("trou de météorite") != -1 && getDistanceLieu(i) > 1))
			? 'none' : '';
}

// AJOUT BOUTONS

function putExternalLinks() {
	var cookie = MZ_getValue("URL1");
	if (cookie && cookie != "") {
		var myDivi = document.createElement('DIV');
		myDivi.setAttribute('align', 'LEFT');
		myDivi.appendChild(document.createElement('A'));
		myDivi.firstChild.setAttribute('href', cookie);
		myDivi.firstChild.setAttribute('target', '_blank');
		myDivi.firstChild.setAttribute('CLASS', 'AllLinks');
		appendText(myDivi.firstChild, "[" + MZ_getValue("NOM1") + "]");

		cookie = MZ_getValue("URL2");
		if (cookie && cookie != "") {
			myDivi.appendChild(document.createElement('A'));
			myDivi.childNodes[1].setAttribute('href', cookie);
			myDivi.childNodes[1].setAttribute('target', '_blank');
			myDivi.childNodes[1].setAttribute('CLASS', 'AllLinks');
			appendText(myDivi.childNodes[1], "[" + MZ_getValue("NOM2") + "]");

			cookie = MZ_getValue("URL3");
			if (cookie && cookie != "") {
				myDivi.appendChild(document.createElement('A'));
				myDivi.childNodes[2].setAttribute('href', cookie);
				myDivi.childNodes[2].setAttribute('target', '_blank');
				myDivi.childNodes[2].setAttribute('CLASS', 'AllLinks');
				appendText(myDivi.childNodes[2], "[" + MZ_getValue("NOM3") + "]");
			}
		}
		insertBefore(document.getElementsByTagName('div')[1], myDivi);
	}
}

function appendVue2DBouton(url, id, vue, texte, listeParams) {
	var myForm = document.createElement('form');
	myForm.setAttribute('method', 'post');
	myForm.setAttribute('action', url);
	myForm.setAttribute('target', '_blank');
	appendHidden(myForm, id, '');
	for (var i = 0; i < listeParams.length; i += 2)
		appendHidden(myForm, listeParams[i], listeParams[i + 1]);
	appendSubmit(myForm, texte, function() {document.getElementsByName(id)[0].value = vue();});

	var arr = document.getElementsByTagName('a');
	appendBr(arr[7].parentNode);
	arr[7].parentNode.appendChild(myForm);
}

// Le bouton pour la vue 2d
function putVue2DBouton() {
	var vueext = MZ_getValue("VUEEXT");
	if (vueext == "" || vueext == null || vueext == "grouky")
		appendVue2DBouton('http://ythogtha.org/MH/grouky.py/grouky', 'vue', getVueScript,
					   'La grouky vue !', new Array('type_vue', 'V4'));
	else if (vueext == "otan")
		appendVue2DBouton('http://drunk.cryo.free.fr/resultat_vue.php', 'txtVue', getVueScript,
					   'La vue OTAN', new Array('txtTypeVue', 'Mountyzilla'));
	else if (vueext == "ccm")
		appendVue2DBouton('http://clancentremonde.free.fr/Vue2/RecupVue.php', 'vue', getVueScript,
					   'La vue du CCM', new Array('id', numTroll + ";" + getPositionStr(getPosition())));
	else if (vueext == "relaismago")
		appendVue2DBouton('http://outils.relaismago.com/vue2d/get_vue.php3', 'datas', getLieux,
					   'Vue R&M', '');
	else if (vueext == "xtrolls")
		appendVue2DBouton('http://thextrolls.free.fr/carte/partage/vue_mozilla.php', 'vue',
					   getVueScript, 'La vue Xtrolls', new Array());
	else if (vueext == "lxgt")
		appendVue2DBouton('http://fryrd.free.fr/troll/forum/majvuemh.php', 'vue', getVueScript,
					   'La vue LXGT', new Array());
	else if (vueext == "garush")
		appendVue2DBouton('http://garush.free.fr/TrtVueScript.php', 'Vue', getVueScript, 'Vue Garush',
					   new Array());
	else if (vueext == "gloumfs2d")
		appendVue2DBouton('http://gloumf.free.fr/vue2d.php', 'vue_mountyzilla', getVueScript,
					   'La vue Gloumfs 2D', new Array());
	else if (vueext == "gloumfs3d")
		appendVue2DBouton('http://gloumf.free.fr/vue3d.php', 'vue_mountyzilla', getVueScript,
					   'La vue Gloumfs 3D', new Array());
	else if (vueext == "bricol")
		appendVue2DBouton('http://trolls.ratibus.net/mountyhall/vue_form.php', 'vue', getVueScript,
					   'La Bricol\' Vue', new Array('mode', 'vue_SP_Vue2', 'screen_width', screen.width));
	else if (vueext == "kilamo")
		appendVue2DBouton('http://zadorateursdekilamo.free.fr/public/pub_chrgvue.php', 'VUEMH',
					   getVueScript, 'La vue KiLaMo', new Array());
	else if (vueext == "evo")
		appendVue2DBouton('http://www.evolution-mountyhall.com/fr/spe/evo/evo_v2d_mz.php', 'vue',
					   getVueScript, 'La Vue Evolution', new Array('action', 'generer'));
}

function insertBouton(next, url, id, value, text) {
	var myForm = document.createElement('form');
	myForm.setAttribute('method', 'post');
	myForm.setAttribute('align', 'right');
	myForm.setAttribute('action', url);
	myForm.setAttribute('name', 'frmvue');
	myForm.setAttribute('target', '_blank');
	appendHidden(myForm, id, '');
	appendSubmit(myForm, text, function() {document.getElementsByName(id)[0].value=value();});
	next.parentNode.insertBefore(myForm, next);
}

function putMonstresBouton() {
	insertBouton (totaltab[4], 'http://mountyhall.clubs.resel.fr/script/v2/get_monstres.php',
			'listemonstres', getMonstres, 'Ajouter les monstres à la base des Teubreux');
}

function putLieuxBouton() {
	insertBouton(totaltab[12], 'http://mountyzilla.tilk.info/scripts/lieux.php',
			'listelieux', getLieux, 'Ajouter les lieux à la base');
}

function putFiltresBoutons() {
	var thead = document.createElement('thead');
	totaltab[3].removeChild(totaltab[3].firstChild);
	insertBefore(totaltab[3].firstChild, thead);
	var tr = appendTr(thead, 'mh_tdtitre');
	tr.addEventListener("click", function() {toggleTableau(3);},true);
	var td = appendTdText(tr, "INFORMATIONS", true);

	td.setAttribute('colspan', '9');
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className='mh_tdtitre';");

	// On met le limitateur de vue à gauche pour des questions de taille de tableau
	var tr = totaltab[3].childNodes[1].firstChild;
	tr.setAttribute('class', 'mh_tdpage');
	td = tr.childNodes[1];
	tr.removeChild(td);
	tr.appendChild(td);
// TODO: *** de *** pourquoi il veut pas me center le TD de gauche ??
//	tr.firstChild.setAttribute('align', 'center');

	tr = insertTr(tr, 'mh_tdpage');
	td = appendTdText(tr, "EFFACER : ", true);
	td.setAttribute('align', 'right');
	td = appendTdCenter(tr);
	checkBoxGG = appendNobr(td, 'delgg', filtreTresors, ' Les GG\'').firstChild;
	checkBoxCompos = appendNobr(td, 'delcomp', filtreTresors, ' Les Compos').firstChild;
	checkBoxBidouilles = appendNobr(td, 'delbid', filtreTresors, ' Les Bidouilles').firstChild;
	checkBoxIntangibles = appendNobr(td, 'delint', filtreTrolls, ' Les Intangibles').firstChild;
	checkBoxGowaps = appendNobr(td, 'delgowap', filtreMonstres, ' Les Gowaps').firstChild;
	checkBoxEngages = appendNobr(td, 'delengage', filtreMonstres, ' Les Engagés').firstChild;
	checkBoxLevels = appendNobr(td, 'delniveau', filtreLevels, ' Les Niveaux').firstChild;
	checkBoxDiplo = appendNobr(td, 'deldiplo', refreshDiplo, ' La Diplo').firstChild;
	checkBoxTrou = appendNobr(td, 'deltrou', filtreLieux, ' Les Trous').firstChild;
	checkBoxMythiques = appendNobr(td, 'delmyth', filtreMonstres, ' Les Mythiques').firstChild;
	if(MZ_getValue("NOINFOEM") != "true")
		checkBoxEM = appendNobr(td, 'delem', filtreMonstres, ' Les Composants EM').firstChild;
	checkBoxTresorsNonLibres = appendNobr(td, 'deltres', filtreTresors, ' Les Trésors non libres').firstChild;
	checkBoxTactique = appendNobr(td, 'deltactique', updateTactique, ' Les Infos tactiques').firstChild;
	
	if(MZ_getValue("INFOPLIE"))
	{
		try
		{
			toggleTableau(3);
		}
		catch(e)
		{
			alert(e);
		}
	}
}

function appendSearch(td, text, buttonValue, buttonOnClick) {
	var nobr = document.createElement('NOBR');
	var textbox = appendTextbox(nobr, 'text', text, '12', '20');
	appendText(nobr, "\u00a0");
	var button=appendButton(nobr, buttonValue, buttonOnClick);
	textbox.addEventListener("keypress",function(event){try{if(event.keyCode == 13) {event.preventDefault();button.click();}}catch(e){alert(e)}}, true);
	td.appendChild(nobr);
	appendText(td, "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 ");
}

function appendComboSearch(td, text, comboName, comboOnChange) {
	var nobr = document.createElement('NOBR');
	appendText(nobr, "\u00a0"+text);
	appendText(nobr, "\u00a0");
	var select = document.createElement('SELECT');
	select.setAttribute('name', comboName);
	select.addEventListener("change",comboOnChange, true);
	var option = document.createElement('OPTION');
	option.setAttribute("value",0);
	appendText(option, "Aucun");
	select.appendChild(option);
	for(var i=1;i<=50;i++)
	{
		option = document.createElement('OPTION');
		option.setAttribute("value",i);
		appendText(option, i);
		select.appendChild(option);
	}
	nobr.appendChild(select);
	td.appendChild(nobr);
	appendText(td, "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 ");
	return select;
}

function putSearchForms() {
	var tr = insertTr(totaltab[3].childNodes[1].childNodes[1], 'mh_tdpage');
	var td = appendTdText(tr, "RECHERCHER :", true);
	td.setAttribute('align', 'right');
	td = appendTdCenter(tr);
	appendSearch(td, 'rec_monstre', 'Monstre', function() {filtreMonstre = document.getElementById("rec_monstre").value.toLowerCase(); filtreMonstres();});
	appendSearch(td, 'rec_troll', 'Trõll', function() {filtreTroll = document.getElementById("rec_troll").value.toLowerCase(); filtreTrolls();});
	appendSearch(td, 'rec_guilde', 'Guilde', function() {filtreGuilde = document.getElementById("rec_guilde").value.toLowerCase(); filtreTrolls();});
	appendSearch(td, 'rec_tresor', 'Trésor', function() {filtreTresor = document.getElementById("rec_tresor").value.toLowerCase(); filtreTresors();});
	appendSearch(td, 'rec_lieu', 'Lieu', function() {filtreLieu = document.getElementById("rec_lieu").value.toLowerCase(); filtreLieux();});
	tr = insertTr(totaltab[3].childNodes[1].childNodes[1], 'mh_tdpage');
	td = appendTdText(tr, "FILTRAGE MONSTRES :", true);
	td.setAttribute('align', 'right');
	td = appendTdCenter(tr);
	comboBoxNiveauMin=appendComboSearch(td, 'Niveau min :', 'rec_niveau_monstre_min', filtreMonstres);
	comboBoxNiveauMax=appendComboSearch(td, 'Niveau max :', 'rec_niveau_monstre_max', filtreMonstres);
}

// SCRIPTS

function getPosition() {
	var pos = document.evaluate("//li/b/text()[contains(.,'X = ')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
	var posx = pos.substring(pos.indexOf('=') + 2, pos.indexOf(','));
	pos = pos.substr(pos.indexOf(',') + 1);
	return new Array(posx, pos.substring(pos.indexOf('=') + 2, pos.indexOf(',')), pos.substr(pos.lastIndexOf('=') + 2));
}

function getPorteVue() {
	var array=new Array();
	var nodes = document.evaluate("//li/b/text()[contains(.,'horizontalement') or contains(.,'verticalement')]", document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(nodes.snapshotLength!=4)
		return null;
	for(var i=0;i<4;i++)
	{
		array.push(parseInt(nodes.snapshotItem(i).nodeValue));
	}
	return array;
}

function getPositionStr(pos) {
	return pos[0] + ";" + pos[1] + ";" + pos[2];
}

function getVue() {
	var vues = getPorteVue();
	return new Array(vues[0], vues[1]);
}

function appendMonstres(txt) {
	for (var i = 3; i <= nbMonstres; i++)
		txt += getMonstreID(i) + ";" + getMonstreNom(i) + ";" + getPositionStr(getMonstrePosition(i)) + "\n";
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(getPositionStr(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function appendLieux(txt) {
	for (var i = 3; i < nbLieux+1; i++) {
		var tds = x_lieux[i].childNodes;
		txt += tds[1].firstChild.nodeValue + ";" + getLieuNom(i) + ";" + tds[3].firstChild.nodeValue + ";"
				+ tds[4].firstChild.nodeValue + ";" + tds[5].firstChild.nodeValue + "\n";
	}
	return txt;
}

function getLieux() {
	var vue = getVue();
	return appendLieux(getPositionStr(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function getVueScript() 
{
	try
	{
	txt = "#DEBUT TROLLS\n" + numTroll + ";" + getPositionStr(getPosition()) + "\n";
	for (var i = 3; i < nbTrolls+1; i++)
		txt += getTrollID(i) + ";" + getPositionStr(getTrollPosition(i)) + "\n";
	txt = appendMonstres(txt + "#FIN TROLLS\n#DEBUT MONSTRES\n") + "#FIN MONSTRES\n#DEBUT TRESORS\n";
	for (var i = 3; i < nbTresors+1; i++) {
		var tds = x_tresors[i].childNodes;
		txt += tds[1].firstChild.nodeValue + ";" + getTresorNom(i) + ";" + tds[3].firstChild.nodeValue + ";"
				+ tds[4].firstChild.nodeValue + ";" + tds[5].firstChild.nodeValue + "\n";
	}
	txt = appendLieux(txt + "#FIN TRESORS\n#DEBUT LIEUX\n") + "#FIN LIEUX\n#DEBUT CHAMPIGNONS\n";
	for (var i = 3; i < nbChampis+1; i++) {
		var tds = x_champis[i].childNodes;
		txt += tds[1].firstChild.nodeValue + ";" + tds[2].firstChild.nodeValue + ";" + tds[3].firstChild.nodeValue
				+ ";" + tds[4].firstChild.nodeValue + "\n";
	}
	return txt + "#FIN CHAMPIGNONS\n#DEBUT ORIGINE\n" + getVue()[0] + ";" + getPositionStr(getPosition()) + "\n#FIN ORIGINE\n";
	}
	catch(e) { alert(e)}
}

function putScriptExterne() {
	var infoit = MZ_getValue("IT_" + numTroll);
	if (!infoit || infoit == "")
		return;
	var it = infoit.substring(0, infoit.indexOf('$'));
	if (it == "ssgg")
		appendNewScript('http://zarh.homeip.net/ssgg/mz_ssgg.php?id_troll=' + numTroll
				+ '&password=' + infoit.substr(infoit.indexOf('$') + 1));
	else if (it == "bricol") {
		var t = infoit.split('$');
		appendNewScript('http://trolls.ratibus.net/' + t[1] + '/mz.php?login=' + t[2] + '&password=' + t[3]);
	}
}

function erreur( chaine )
{
  var infoit = MZ_getValue("IT_" + numTroll);
  if (!infoit || infoit == "")
		return;
  var it = infoit.substring(0, infoit.indexOf('$'));
  if(it=="ssgg")
    alert("Erreur lors de la connection avec le SSGG :\n"+chaine);
  else if(it=="bricol")
    alert("Erreur lors de la connection avec l'interface des bricol'Trolls :\n"+chaine);
  MZ_removeValue("IT_"+numTroll);
}

function putInfosTrolls() {
try
{
	var i;
	for (i = 3; i < nbTrolls+1; i++)
		if (infosTrolls[getTrollID(i)])
			break;
	if (i == nbTrolls+1)
		return;

	var td = insertTdText(x_trolls[2].childNodes[6], 'PV', true);
	td.setAttribute('width', '105');
	td = insertTdText(x_trolls[2].childNodes[7], 'PA', true);
	td.setAttribute('width', '40');

	for (i = 3; i < nbTrolls+1; i++) {
		var infos = infosTrolls[getTrollID(i)];
		if (infos) {
			var tab = document.createElement('div');
			tab.setAttribute('width', '100');
			//tab.setAttribute('border', '0');
			//tab.setAttribute('cellspacing', '1');
			//tab.setAttribute('cellpadding', '0');
			//tab.setAttribute('bgcolor', '#000000');
			tab.style.background='#FFFFFF';
			tab.style.width=100;
			tab.style.border=1;
			tab.setAttribute('height', '10');
			var img = document.createElement('img');
			img.setAttribute('src', '../Images/Interface/milieu.gif');
			img.setAttribute('height', '10');
			img.setAttribute('width', Math.floor((100 * infos[0]) / infos[1]));
			tab.setAttribute('title', infos[0] + '/' + infos[1] + ' ' + infos[2]);
			tab.appendChild(img);
			insertTdElement(x_trolls[i].childNodes[6], tab);
			//insertTdElement(x_trolls[i].childNodes[6], img);
			var span = document.createElement('span');
			insertTdElement(x_trolls[i].childNodes[7], span);
			span.setAttribute('title', infos[3]);
			appendText(span, infos[4] + " PA");
		} else {
			insertTdElement(x_trolls[i].childNodes[6]);
			insertTdElement(x_trolls[i].childNodes[7]);
		}
	}
}
catch(e)
{
  alert(e+" "+i+"\n"+x_trolls[i].innerHTML);
}
}

// POPUP CDM

function getCDM(nom, id) {
	if (listeCDM[id]) {
		if (!document.getElementById("popupCDM" + id))
			afficherCDM(nom, id);
		else
			cacherPopupCDM("popupCDM" + id);
	}
}

function initPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function showPopup2(evt) {
	var id = this.getAttribute("id");
	var nom = this.getAttribute("nom");
	var texte = getAnalyseTactique(id,nom);
	if(texte=="")
		return;
	popup.innerHTML = texte;
	popup.style.left = Math.min(evt.pageX + 15,window.innerWidth-400) + 'px';
	popup.style.top = evt.pageY+15 + 'px';
	popup.style.visibility = "visible";
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function createPopupImage2(url, id, nom)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("id",id);
	img.setAttribute("nom",nom);
	img.addEventListener("mouseover", showPopup2,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function recomputeTypeTrolls()
{
	for (var i = 0; i < listeTags; i++) 
	{
		computeTypeTrolls(listeTags[i],listeTagsInfos[i]);
	}
	for (var i = 0; i < listeTagsGuilde; i++) 
	{
		computeTypeGuildes(listeTagsGuilde[i],listeTagsInfosGuilde[i]);
	}
}

function setAllTags(infoTrolls,infoGuildes)
{
	for (var i = 3; i < nbTrolls+1; i++) 
	{
		var infos = infoGuildes[getTrollGuildeID(i)];
		if (infos) 
		{
			var tr = document.evaluate("td/a[contains(@href,'EAV')]/..",
			x_trolls[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			for(var j=0;j<infos.length;j++)
			{
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createPopupImage(infos[j][0], infos[j][1]));
			}
		}
		infos = infoTrolls[getTrollID(i)];
		if (infos) 
		{
			var tr = document.evaluate("td/a[contains(@href,'EPV')]/..",
			x_trolls[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			for(var j=0;j<infos.length;j++)
			{
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createPopupImage(infos[j][0], infos[j][1]));
			}
		}
	}
}

function analyseTagFile(data)
{
	var icones = new Array();
	var descriptions = new Array();
	var infoTrolls = new Array();
	var infoGuildes = new Array();
	
	var lignes = data.split("\n");
	for(var i=0;i<lignes.length;i++)
	{
		try
		{
			var data = lignes[i].split(";");
			if(data.length<=1)
				continue;
			if(data[0]=="I")
			{
				icones.push(lignes[i].substring(lignes[i].indexOf(";")+1));
			}
			else if(data[0]=="D")
			{
				descriptions.push(bbcode(lignes[i].substring(lignes[i].indexOf(";")+1)));
			}
			else if(data[0]=="T")
			{
				if(data.length<=2)
				continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoTrolls[id] == null)
					infoTrolls[id] = new Array();
				infoTrolls[id].push(info);
			}
			else if(data[0]=="G")
			{
				if(data.length<=2)
					continue;
				var id = data[1]*1;
				var icone = icones[data[2]*1];
				var texte = "";
				for(var j=3;j<data.length;j++)
					texte+=descriptions[data[j]*1];
				var info = new Array(icone,texte);
				if(infoGuildes[id] == null)
					infoGuildes[id] = new Array();
				infoGuildes[id].push(info);
			}
		}
		catch(e)
		{
			alert(e);
			break;
		}
	}
	if(infoGuildes.length!=0 || infoTrolls.length!=0)
		setAllTags(infoTrolls,infoGuildes);
}

function computeTag()
{
	try
	{
	initPopup();
	if(MZ_getValue("TAGSURL") == null || MZ_getValue("TAGSURL")=="")
		return false;
	var tagsurl = MZ_getValue("TAGSURL");
	var listeTagsURL = tagsurl.split("$");
	for(var i=0;i<listeTagsURL.length;i++)
	{
		if(listeTagsURL[i].toLowerCase().indexOf("http")==0)
		{
			//appendNewScript(listeTagsURL[i]);
			MZ_xmlhttpRequest({
			    method: 'GET',
			    url: listeTagsURL[i],
			    headers: {
			        'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
			        'Accept': 'application/xml,text/xml',
			    },
			    onload: function(responseDetails) {
					try
					{
						analyseTagFile(responseDetails.responseText);
					}
					catch(e)
					{
						alert(e);
					}
				}
			});
		}
	}
	}
	catch(e) {alert(e);}
}

function computeTelek()
{
	if(getSortComp("Télékinésie")==0)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/Sorts/telekinesie.png";
	var trolln = getPosition()[2];
	for (var i = nbTresors+1; --i >= 3;) {
		var pos = getTresorPosition(i);
		if(pos[2]==trolln)
		{
			var tr = x_tresors[i].childNodes[2];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createImage(urlImg, "Trésor transportable par Télékinésie"));
		}	
	}
}

function getPortee(param) {
	return Math.ceil((Math.sqrt(19 + 8 * (param + 3)) - 7) / 2);
}

function computeChargeProjo()
{
	var urlImgCharge = "http://mountyzilla.tilk.info/scripts_0.9/images/Competences/charger.png";
	var urlImgProjo = "http://mountyzilla.tilk.info/scripts_0.9/images/Sorts/projectileMagique.png";
	var trolln = getPosition()[2];
	if(!computeChargeProjoMonstre())
		return false;
	var charger = getSortComp("Charger")!=0;
	var projo = getSortComp("Projectile Magique")!=0;
	if(!charger && !projo)
	{
		return false;
	}
	var porteeCharge = -1;
	var porteeProjo = -1;
	if(charger)
	{
		var aux = Math.ceil(MZ_getValue(numTroll+".caracs.pv") / 10) + MZ_getValue(numTroll+".caracs.regeneration");
		porteeCharge = getPortee(aux);
	}
	if(projo)
	{
		porteeProjo = getPortee(MZ_getValue(numTroll+".caracs.vue.bm")+MZ_getValue(numTroll+".caracs.vue"));
	}
	for (var i = 3; i < nbTrolls+1; i++) 
	{
		var id = getTrollID(i);
		var pos = getTrollPosition(i);
		var dist = getTrollDistance(i);
		if(dist>0 && pos[2] == trolln && dist<=porteeCharge)
		{
			var tr = x_trolls[i].childNodes[2];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createImage(urlImgCharge, "Accessible en charge"));
		}
		if(pos[2] == trolln && dist<=porteeProjo)
		{
			var tr = x_trolls[i].childNodes[2];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createImage(urlImgProjo, "Touchable avec un projectile magique"));
		}

	}
}

function computeChargeProjoMonstre()
{
	var urlImgCharge = "http://mountyzilla.tilk.info/scripts_0.9/images/Competences/charger.png";
	var urlImgProjo = "http://mountyzilla.tilk.info/scripts_0.9/images/Sorts/projectileMagique.png";
	var charger = getSortComp("Charger")!=0;
	var projo = getSortComp("Projectile Magique")!=0;
	var trolln = getPosition()[2];
	if(!charger && !projo)
	{
		return false;
	}
	var porteeCharge = -1;
	var porteeProjo = -1;
	if(charger)
	{
		var aux = Math.ceil(MZ_getValue(numTroll+".caracs.pv") / 10) + MZ_getValue(numTroll+".caracs.regeneration");
		porteeCharge = getPortee(aux);
	}
	if(projo)
	{
		porteeProjo = getPortee(MZ_getValue(numTroll+".caracs.vue.bm")+MZ_getValue(numTroll+".caracs.vue"));
	}
	
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/oeil.png";
	for (var i = nbMonstres+1; --i >= 3;) 
	{
		var id = getMonstreID(i);
		var pos = getMonstrePosition(i);
		var dist = getMonstreDistance(i);
		if(dist>0 && pos[2] == trolln && dist<=porteeCharge)
		{
			var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createImage(urlImgCharge, "Accessible en charge"));
		}
		if(pos[2] == trolln && dist<=porteeProjo)
		{
			var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createImage(urlImgProjo, "Touchable avec un projectile magique"));
		}
	}
	return true;
}

function computeTactique(begin, end)
{
	try
	{
	var j;
	if(begin==null)
		begin=3;
	if(end==null)
		end=nbMonstres;
	var noTactique = setCheckBoxCookie(checkBoxTactique, "NOTACTIQUE");
	if(noTactique || !isProfilActif())
		return;
	for (j = end; j>=begin;j--)
	{
		var id = getMonstreID(j);
		var donneesMonstre = listeCDM[id];
		var nom = getMonstreNom(j);

		if(donneesMonstre && nom.indexOf("Gowap Apprivoisé")==-1 && nom.indexOf("Gowap Sauvage") == -1)
		{
			var imgUrl = "http://mountyzilla.tilk.info/scripts_0.9/images/calc2.png";
			var tr = x_monstres[j].childNodes[checkBoxLevels.checked ? 2 : 3];
			tr.appendChild(document.createTextNode(" "));
			tr.appendChild(createPopupImage2(imgUrl, id, nom));
		}
	}
	}catch(e){alert(j+" "+e)}
	filtreMonstres();
}

function computeVLC(begin,end)
{
	computeTactique(begin,end);
	if(begin==null)
		begin=3;
	if(end==null)
		end=nbMonstres;
	var cache = getSortComp("Invisibilité")>0 || getSortComp("Camouflage")>0;
	if(!cache)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/oeil.png";
	for (var i = end; i >= begin;i--)
	{
		var id = getMonstreID(i);
		var donneesMonstre = listeCDM[id];
		if(donneesMonstre && donneesMonstre.length>12)
		{
			if(donneesMonstre[12]==1)
			{
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createImage(urlImg, "Voit le caché"));
			}
		}
	}
}


function computeMission(begin,end)
{
	computeVLC(begin,end);
	if(begin==null)
		begin=3;
	if(end==null)
		end=nbMonstres;
	if(!MZ_getValue("MISSION_"+numTroll) || MZ_getValue("MISSION_"+numTroll)=="")
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/mission.png";
	var cookie = MZ_getValue("MISSION_"+numTroll);
	var infosMission = cookie.split("$");
	for (var i = end; i >= begin;i--)
	{
		var id = getMonstreID(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(infosMission[0]=="R")
		{
			if(epure(nom).indexOf(epure(infosMission[2].toLowerCase()))!=-1)
			{
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createImage(urlImg, infosMission[4]));
			}
		}
		else if(infosMission[0]=="N")
		{
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre)
			{
				if(donneesMonstre[0]*1>=infosMission[2]*1-1 && donneesMonstre[0]*1<=infosMission[2]*1+1)
				{
					var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(" "));
					tr.appendChild(createImage(urlImg, infosMission[4]));
				}
			}
		}
		else if(infosMission[0]=="F")
		{
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre)
			{
				if(epure(donneesMonstre[1]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase()))!=-1)
				{
					var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(" "));
					tr.appendChild(createImage(urlImg, infosMission[4]));
				}
			}
		}
		else if(infosMission[0]=="P")
		{
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre)
			{
				if(epure(donneesMonstre[10]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase())+" =>")!=-1)
				{
					var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(" "));
					tr.appendChild(createImage(urlImg, infosMission[4]));
				}
			}
		}
	}
}

function afficherCDM(nom, id) {
	var donneesMonstre = listeCDM[id];
	var table = createCDMTable(id,nom,donneesMonstre);
	table.setAttribute('id', "popupCDM" + id);
	table.setAttribute('style', 'display: none; position: fixed; z-index: 1; top: '+ (300
			+ (30 * nbCDM)) % (30 * Math.floor((window.innerHeight - 400) / 30)) + 'px; left: '
			+ (window.innerWidth - 365) + 'px; width: 300px; height: 200px;');
	totaltab[0].parentNode.appendChild(table);

	var tr = table.firstChild;
	tr.setAttribute('style', 'cursor:move;');
	tr.addEventListener("mousedown",startDrag,true);
//	tr.addEventListener("mousemove", drag, true);
	tr.addEventListener("mouseup", stopDrag, true);
	tr = appendTr(table.childNodes[1], 'mh_tdtitre');
	tr.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	tr.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tr.setAttribute('cdmindex',id);
	tr.addEventListener("click", function() {id=this.getAttribute("cdmindex");cacherPopupCDM( 'popupCDM' + id); this.className = 'mh_tdtitre';},true);
	td = appendTdText(tr, 'Fermer', true);
	td.setAttribute('colspan', '2');
	td.setAttribute('style', 'text-align:center;');
	nbCDM++;
	table.style.display = '';
}

function demarque(nom)
{
   var indice = nom.indexOf("]");
   if(indice == -1)
      return nom;
   if(indice == nom.length-1)
      return nom;
   return nom.substring(0,indice+1);
}

var selectionFunction;

function startDrag(evt) {

	winCurr = this.parentNode;
	evt = evt || window.event;
	offsetX = evt.pageX - parseInt( winCurr.style.left );
	offsetY = evt.pageY - parseInt( winCurr.style.top );
	selectionFunction = document.body.style.MozUserSelect;
	document.body.style.MozUserSelect="none";
	winCurr.style.MozUserSelect="none";
	
	return false;
}

function stopDrag(evt) {
	winCurr.style.MozUserSelect=selectionFunction;
	document.body.style.MozUserSelect = selectionFunction;
	winCurr = null;
}

function drag(evt) {

	if (winCurr == null)
		return;
	evt = evt || window.event;
	winCurr.style.left = (evt.pageX - offsetX)+'px';
	winCurr.style.top = (evt.pageY - offsetY)+'px';
	return false;
}

function cacherPopupCDM(titre) {
	var popup = document.getElementById(titre);
	popup.parentNode.removeChild(popup);
}

// TABLES REPLIABLES

function creerTHead(num) {
	var tr = totaltab[num].childNodes[1].firstChild;
	tr.addEventListener("click", function() {toggleTableau(num);},true);
	var thead = document.createElement('thead');
	thead.appendChild(tr);
	var links=tr.getElementsByTagName('a');
	for(var i=1;i<links.length;i++)
	{
		links[i].setAttribute('onmouseover','cursorOnLink=true;');
        links[i].setAttribute('onmouseout','cursorOnLink=false;');
	}
	insertBefore(totaltab[num].firstChild, thead);
	tr.firstChild.setAttribute('colspan', '11');
	tr.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	tr.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
}

function toggleTableau(num) {
	if(cursorOnLink) return;
	var tbody;
	if(num<=6)
		tbody = totaltab[num].childNodes[2];
	else
		tbody = totaltab[nbTabSup+num].childNodes[2];
	if(num==3)
	{
		tbody = totaltab[num].childNodes[1];
		MZ_setValue("INFOPLIE",!tbody.getAttribute('style') || tbody.getAttribute('style') == '');
		if(!tbody.getAttribute('style') || tbody.getAttribute('style') == '')
		{
			var vues = getPorteVue();
			var pos = getPosition();
			appendText(totaltab[num].childNodes[0].firstChild.firstChild," => Position : X = "+pos[0]+", Y = "+pos[1]+", N = "+pos[2]+" --- Vue : "+vues[0]+"/"+vues[1]+" ("+vues[2]+"/"+vues[3]+")",1);
		}
		else
		{
			texte = totaltab[num].childNodes[0].firstChild.firstChild.childNodes[1];
			texte.parentNode.removeChild(texte);
		}
			
	}
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
}

function savePosition()
{
	var pos = getPosition();
	MZ_setValue(numTroll+".position.X",pos[0]);
	MZ_setValue(numTroll+".position.Y",pos[1]);
	MZ_setValue(numTroll+".position.N",pos[2]);
}
try
{
start_script(31);

for (var i = 4; i < 15; i += 2)
	creerTHead(i);
	

putFiltresBoutons();
putSearchForms();
putExternalLinks();
putVue2DBouton();
putLieuxBouton();
putMonstresBouton();



//800 ms
synchroniseFiltres();
filtreLevels();
savePosition();

//400 ms
{
	var noGG = setCheckBoxCookie(checkBoxGG, "NOGG");
	var noCompos = setCheckBoxCookie(checkBoxCompos, "NOCOMP");
	var noBidouilles = setCheckBoxCookie(checkBoxBidouilles, "NOBID");
	var noGowaps = setCheckBoxCookie(checkBoxGowaps, "NOGOWAP");
	var noMythiques = setCheckBoxCookie(checkBoxMythiques, "NOMYTH");
	var noEngages = setCheckBoxCookie(checkBoxEngages, "NOENGAGE");
	var noTresorsEngages = setCheckBoxCookie(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	var noTrou = setCheckBoxCookie(checkBoxTrou, "NOTROU");
	var noIntangibles = setCheckBoxCookie(checkBoxIntangibles, "NOINT");
	filtreMonstres();
	if(noIntangibles)
		filtreTrolls();
	if(noGG || noCompos || noBidouilles || noTresorsEngages)
		filtreTresors();
	if(noTrou)
		filtreLieux();
}
refreshDiplo();
initPXTroll();
computeTag();
computeTelek();
computeChargeProjo();
putScriptExterne();

displayScriptTime();
}
catch(e)
{
	alert(e);
}
