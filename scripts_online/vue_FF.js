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

/* VERSION PROVISOIRE --- BUGGUÉE !!!
 * v0.1.1b by Dab - 2013-04-23
 * - downgrade getTrollGuildeID pour suivre MH
 * - grouky vue -> 5b1 ; vue kilamo -> DEAD
 * v0.1.2 by Dab - 2013-04-30
 * - adaptation aux nouvelles options
 * - modif insertion des urls (v-centrage avec table autour)
 * v0.1.3 by Dab - 2013-05-08
 * - correction insertion données Bricol'Trolls (les BT ne gèrent pas les bonus de PV)
 * /!\ bug latent sur diminution bonusPV (perte Telaite / template Ours), prévoir fix ("delete infos")
 */


var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles, checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres, checkBoxTactique;
var checkBoxLevels, checkBoxGowaps, checkBoxEngages, checkBoxMythiques;
var comboBoxNiveauMin, comboBoxNiveauMax;
var selectVue2D, viewForm;
var filtreMonstre = '', filtreTroll = '', filtreGuilde = '', filtreTresor = '', filtreLieu = '';

// Infos remplies par des scripts extérieurs
var cg = [];
var ct = [];
var listeCDM = [];

var listeLevels = [];
var listeTags = [];
var listeTagsInfos = [];
var listeTagsGuilde = [];
var listeTagsInfosGuilde = [];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.addEventListener('mousemove', drag, false);

// PX trolls
var bulle;

// Infos trolls
var popup;

var nbCDM = 0;

var oldNOEM = true;

// Différents tableaux
var mainTabs = document.getElementsByClassName('mh_tdborder');
var x_monstres = mainTabs[2].getElementsByTagName('tr');
var nbMonstres = x_monstres.length-1;
var x_trolls = mainTabs[4].getElementsByTagName('tr');
var nbTrolls = x_trolls.length-1;
var x_tresors = mainTabs[6].getElementsByTagName('tr');
var nbTresors = x_tresors.length-1;
var x_champis = mainTabs[8].getElementsByTagName('tr');
var nbChampis = x_champis.length-1;
var x_lieux = mainTabs[10].getElementsByTagName('tr');
var nbLieux = x_lieux.length-1;

var isCDMsRetrieved = false; // = si les CdM ont déjà été DL (affichées ou non)
var isDiploComputed = false; // = si la Diplo a déjà été DL

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = [];
var isEngagesComputed = false;
var cursorOnLink = false;

var needComputeEnchantement =
		MZ_getValue(numTroll+'.enchantement.liste') && MZ_getValue(numTroll+'.enchantement.liste')!='';


/*                       Gestion Préférences Utilisateur                        */

function saveCheckBoxStatus(chkb, pref) {
	var etat = chkb.checked;
	MZ_setValue(pref, etat ? 'true' : 'false' );
	return etat;
	}

function recallCheckBoxStatus(chkb, pref) {
	chkb.checked = (MZ_getValue(pref)=='true');
	}

function saveComboBoxStatus(cbb, pref) {
	var etat = cbb.selectedIndex;
	MZ_setValue(pref, etat);
	return etat;
	}

function recallComboBoxStatus(cbb, pref) {
	if (MZ_getValue(pref))
		{ cbb.value = MZ_getValue(pref); }
	}

function synchroniseFiltres() {
	recallComboBoxStatus(comboBoxNiveauMin, 'NIVEAUMINMONSTRE');
	recallComboBoxStatus(comboBoxNiveauMax, 'NIVEAUMAXMONSTRE');
	recallCheckBoxStatus(checkBoxGowaps, 'NOGOWAP');
	recallCheckBoxStatus(checkBoxMythiques, 'NOMYTH');
	recallCheckBoxStatus(checkBoxEngages, 'NOENGAGE');
	recallCheckBoxStatus(checkBoxLevels, 'NOLEVEL');
	recallCheckBoxStatus(checkBoxIntangibles, 'NOINT');

	recallCheckBoxStatus(checkBoxGG, 'NOGG');
	recallCheckBoxStatus(checkBoxCompos, 'NOCOMP');
	recallCheckBoxStatus(checkBoxBidouilles, 'NOBID');
	recallCheckBoxStatus(checkBoxDiplo, 'NODIPLO');
	recallCheckBoxStatus(checkBoxTrou, 'NOTROU');
	recallCheckBoxStatus(checkBoxTresorsNonLibres, 'NOTRESORSNONLIBRES');
	recallCheckBoxStatus(checkBoxTactique, 'NOTACTIQUE');
	if (MZ_getValue('NOINFOEM')!='true')
		{ recallCheckBoxStatus(checkBoxEM, 'NOEM'); }
	}


/*                              Fonctions Monstres                              */

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
	if (!isCDMsRetrieved) {return -1;}
	var donneesMonstre = listeCDM[getMonstreID(i)];
	return (donneesMonstre) ? parseInt(donneesMonstre[0]) : -1;
	}

function getMonstreNom(i, force) { // mode forcé = demandé lors du toggle sur affichage des CdM
	try {
		return x_monstres[i].childNodes[checkBoxLevels.checked && !force ? 2 : 3].firstChild.firstChild.nodeValue;
		}
	catch(e) {
		alert('Impossible de trouver le monstre '+i);
		}
	}

function getMonstreNomByTR(tr, force) {
	return tr.childNodes[checkBoxLevels.checked && !force ? 2 : 3].firstChild.firstChild.nodeValue;
	}

function getMonstrePosition(i) {
	var tds = x_monstres[i].childNodes;
	var c = checkBoxLevels.checked ? 0 : 1;
	return [tds[3+c].firstChild.nodeValue, tds[4+c].firstChild.nodeValue, tds[5+c].firstChild.nodeValue];
	}

function updateTactique() {
	var noTactique = saveCheckBoxStatus(checkBoxTactique, 'NOTACTIQUE');
	if (!isCDMsRetrieved) {return;}
	
	var imgUrl = 'http://mountyzilla.tilk.info/scripts_0.9/images/calc2.png';
//	var imgUrl = 'http:/localhost/~nico/mountyzilla.tilk.info/scripts_0.9/images/calc2.png'; // DEBUG
	if (noTactique) {
		for (var i=nbMonstres ; i>0 ; i--) {
			var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
			var img = document.evaluate("img[@src='"+imgUrl+"']", tr, null, 9, null).singleNodeValue;
			if (img) {
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
				}
			}
		}
	else
		{ computeTactique(); }
	}

function filtreMonstres() { // mais elle fait quoi au juste cette fonction ?
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/Competences/ecritureMagique.png';
//	var urlImg = 'http://localhost/~nico/mountyzilla.tilk.info/scripts_0.9/images/Competences/ecritureMagique.png';
	var urlEnchantImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png';
//	var urlEnchantImg = 'http://localhost/~nico/mountyzilla.tilk.info/scripts_0.9/images/enchant.png'; // DEBUG
	var useCss = (MZ_getValue(numTroll+'.USECSS')=='true');
	var noGowaps = saveCheckBoxStatus(checkBoxGowaps, 'NOGOWAP');
	var noMythiques = saveCheckBoxStatus(checkBoxMythiques, 'NOMYTH');
	var noEngages = saveCheckBoxStatus(checkBoxEngages, 'NOENGAGE');
	var niveau_min = saveComboBoxStatus(comboBoxNiveauMin, 'NIVEAUMINMONSTRE');
	var niveau_max = saveComboBoxStatus(comboBoxNiveauMax, 'NIVEAUMAXMONSTRE');
	var noEM = true;
	if (MZ_getValue('NOINFOEM')!='true')
		{ noEM = saveCheckBoxStatus(checkBoxEM, 'NOEM') };
	
	/* Liste mobs engagés */
	if (noEngages && !isEngagesComputed) {
		for (var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if (!listeEngages[pos[0]])
				{ listeEngages[pos[0]] = []; }
			if (!listeEngages[pos[0]][pos[1]])
				{ listeEngages[pos[0]][pos[1]] = []; }
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
			}
		isEngagesComputed = true;
		}
	
	var isFiltreOn = (filtreMonstre!='');
	var strfilter = '';
	if (niveau_min>0 || niveau_max>0) {
		if (niveau_max>0)
			{ strfilter += ' '+niveau_max+' >='; }
		strfilter += ' NIVEAU';
		if (niveau_min>0)
			{ strfilter += ' >= '+niveau_min; }
		}
	mainTabs[1].rows[0].cells[0].childNodes[1].rows[0].cells[1].firstChild.firstChild.innerHTML=
			'MONSTRES ERRANTS' + (isFiltreOn?' (filtrés sur '+filtreMonstre+') ':' ') + strfilter;
	for (var i=nbMonstres ; i>0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if (noEM!=oldNOEM) {
			if (noEM) {
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				while (tr.childNodes.length>1)
					{ tr.removeChild(tr.childNodes[1]); }
				}
			else {
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				var TypeMonstre=getEM(nom);
				if (TypeMonstre!='') {
					var infosCompo=compoEM(TypeMonstre);
					if(infosCompo.length>0) {
						tr.appendChild(document.createTextNode(' '));
						tr.appendChild(createImage(urlImg, infosCompo));
						}
					}
				}
			}
		if (needComputeEnchantement || (noEM != oldNOEM && noEM)) {
			var texte = getInfoEnchantementFromMonstre(nom);
			if(texte!='') {
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(' '));
				tr.appendChild(createImage(urlEnchantImg, texte));
			}
		}

		x_monstres[i].style.display =
				(noGowaps && nom.indexOf('gowap apprivoisé')!=-1 && getMonstreDistance(i)>1)
				|| (noEngages &&  getMonstreDistance(i)!=0
					&& listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]] && listeEngages[pos[0]][pos[1]][pos[2]])
				|| (isFiltreOn && nom.indexOf(filtreMonstre)==-1)
				|| (niveau_min>0 && getMonstreLevel(i)<niveau_min
					&& getMonstreDistance(i)>1 && getMonstreDistance(i)!=-1
					&& nom.toLowerCase().indexOf("kilamo")==-1)
				|| (niveau_max>0 && getMonstreLevel(i)>niveau_max
					&& getMonstreDistance(i)>1 && getMonstreDistance(i)!=-1
					&& nom.toLowerCase().indexOf("kilamo") == -1)
				? 'none' : '';
		if (nom.indexOf('liche')==0 || nom.indexOf('hydre')==0
			|| nom.indexOf('balrog')==0 || nom.indexOf('beholder')==0) {
			if (!noMythiques) {
				if (useCss)
					{ x_monstres[i].setAttribute('class', 'mh_trolls_ennemis'); }
				else {
					x_monstres[i].setAttribute('class', '');
					x_monstres[i].style.backgroundColor = '#FFAAAA';
					}
				}
			}
		else {
			x_monstres[i].style.backgroundColor = '';
			x_monstres[i].setAttribute('class', 'mh_tdpage');
			}
		}
	
	if (MZ_getValue('NOINFOEM')!='true') {
		if (noEM != oldNOEM) {
			if (noEM)
				{ computeChargeProjoMonstre(); }
			if (noEM && isCDMsRetrieved)
				{ computeMission(); }
			}
		oldNOEM = noEM;
		}
	
	needComputeEnchantement = false;
	}

function toggleLevelColumn() { // chk
	if (!saveCheckBoxStatus(checkBoxLevels, 'NOLEVEL')) {
		insertLevelColumn();
		if (!isCDMsRetrieved) { retrieveCDMs(); }
		}
    else if (getMonstreLevelNode(0).textContent=='Niveau') {
		for (var i=nbMonstres ; i>=0 ; i--) {
			if (isCDMsRetrieved)
				{ listeLevels[i] = getMonstreLevelNode(i).innerHTML; } // mémorisation ...
			x_monstres[i].removeChild(getMonstreLevelNode(i));
			}
		}
	}

function insertLevelColumn() { // chk
	var td = insertTdText(getMonstreLevelNode(0), 'Niveau', true);
	td.setAttribute('width', '25');

	for (var i=nbMonstres ; i>0 ; i--) {
		td = insertTdText(getMonstreLevelNode(i), '-');
		td.addEventListener('click',
			function() {
				getCDM( getMonstreNomByTR(this.parentNode, true) , getMonstreIDByTR(this.parentNode) );
				} , true);
		td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdtitre'");
		td.setAttribute('onmouseout', "this.className = 'mh_tdpage';");
		td.setAttribute('style', 'font-weight:bold; text-align:center;');
		if (isCDMsRetrieved)
			{ td.innerHTML = listeLevels[i]; } // ... et recall
		}
	}

function sansMarquage(nom) { // chk
	var i = nom.indexOf(']');
	switch (i) {
		case -1:
		case nom.length-1:
			return nom;
		default:
			return nom.substring(0,i+1);
		}
	}

function retrieveCDMs() { // chk
	if (checkBoxLevels.checked) {return;}
	
	var str = '';
	var begin = 1; // num de début de lot si plusieurs lots de CdM (>500 CdM)
	var max = MZ_getValue(numTroll+'.MAXCDM');
	max = Math.min(nbMonstres, (max) ? max : 500);
	if (MZ_getValue('CDMID')==null)
		{ MZ_setValue('CDMID',1); } // à quoi sert CDMID ??
	for (var i=1 ; i<=max ; i++) {
		var nomMonstre = sansMarquage(getMonstreNom(i, true));
		if (nomMonstre.indexOf(']') != -1)
			{ nomMonstre = nomMonstre.substring(0,nomMonstre.indexOf(']')+1); }
		str += 'nom[]=' + escape(nomMonstre) + '$'
			+ (getMonstreDistance(i) <= 5 ? getMonstreID(i) : -getMonstreID(i)) + '&';
		
		if (i%500==0 || i==max) { // demandes de CdM par lots de 500 max
			var url = 'http://mountypedia.free.fr/mz/monstres_0.9_post_FF.php';
			
			MZ_xmlhttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'begin='+begin+'&idcdm='+MZ_getValue('CDMID')+'&'+str,
				onload: function(responseDetails) {
					try
					{
						var texte = responseDetails.responseText;
						var lines = texte.split('\n');
						if(lines.length==0)
							return;
						var begin2,end2,index;
						for(var j=0;j<lines.length;j++) {
							var infos = lines[j].split(';');
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
								x_monstres[index].childNodes[2].innerHTML='<i>'+level+'</i>';
							else
								x_monstres[index].childNodes[2].innerHTML=level;
							}
						computeMission(begin2,end2);
					}
					catch(e)
					{
						alert(e+'\n'+url+'\n'+texte);
					}
					}
				});
			str = '';
			begin = i + 1;
			}
		}
	isCDMsRetrieved=true;
	}


/*********************************************************************************
*                                Fonctions Trõlls                                *
*********************************************************************************/

function getTrollPosition(i) {
	var tds = x_trolls[i].childNodes;
	var l = tds.length;
	return [tds[l-3].firstChild.nodeValue, tds[l-2].firstChild.nodeValue, tds[l-1].firstChild.nodeValue];
	}

function getTrollID(i) {
	return x_trolls[i].childNodes[1].firstChild.nodeValue;
	}

function getTrollGuildeID(i) {
	if(x_trolls[i].childNodes[5].firstChild.childNodes.length>0) {
		var href = x_trolls[i].childNodes[5].firstChild.getAttribute('href');
		return href.substring(href.indexOf('(')+1,href.indexOf(','));
		}
	return -1;
	}

function getTrollDistance(i) {
	return x_trolls[i].firstChild.firstChild.nodeValue;
	}

function filtreTrolls() {
	var noIntangibles = saveCheckBoxStatus(checkBoxIntangibles, 'NOINT');
	var isFTOn = (filtreTroll!='');
	var isFGOn = (filtreGuilde!='');
	mainTabs[3].rows[0].cells[0].childNodes[1].rows[0].cells[1].firstChild.firstChild.innerHTML =
				'TRÕLLS' + (isFTOn ? ' (filtrés sur '+filtreTroll+')' : '')
				+ (isFGOn ? ' (guildes filtrées sur '+filtreGuilde+')' : '');

	for (var i=nbTrolls ; i>0 ; i--) {
		var tds = x_trolls[i].childNodes;
		x_trolls[i].style.display =
			((noIntangibles && tds[2].firstChild.className == 'mh_trolls_0')
			|| (isFTOn && tds[2].firstChild.firstChild.nodeValue.toLowerCase().indexOf(filtreTroll) == -1)
			|| (isFGOn &&
					(!tds[5].firstChild.firstChild
						|| tds[5].firstChild.firstChild.nodeValue.toLowerCase().indexOf(filtreGuilde) == -1)))
			? 'none' : '';
		}
	}

function refreshDiplo() {
	if (saveCheckBoxStatus(checkBoxDiplo, 'NODIPLO')) {
		for (var i=nbTrolls ; i>0 ; i--) {
			x_trolls[i].style.backgroundColor = '';
			x_trolls[i].setAttribute('class', 'mh_tdpage');
			}
		return;
		}
	
	if (!isDiploComputed) {
		MZ_xmlhttpRequest({
		    method: 'GET',
		    url: 'http://mountyzilla.tilk.info/scripts_0.9/getTroll_FF.php?num='+numTroll,
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
				catch(e) {alert(e);	}
				}
			});
		}
	else
		putRealDiplo();
	}

function putRealDiplo() {
	var useCss = MZ_getValue(numTroll+'.USECSS') == "true";
	for (var i = nbTrolls+1; --i >= 1;) {
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

function initPXTroll() { //chk
	bulle = document.createElement('div');
	bulle.setAttribute('id', 'bulle');
	bulle.setAttribute('class', 'mh_textbox');
	bulle.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;'
								+'display: inline; z-index: 2;');
	document.body.appendChild(bulle);

	for (var i=nbTrolls ; i>0 ; i--) {
		var niv = x_trolls[i].childNodes[3];
		niv.addEventListener('mouseover', showPXTroll, true);
		niv.addEventListener('mouseout', hidePXTroll, true);
		}
	}

function showPXTroll(evt) {
	var lvl = this.firstChild.nodeValue;
	bulle.innerHTML = 'Niveau ' + lvl + analysePXTroll(lvl);
	bulle.style.left = evt.pageX + 15 + 'px';
	bulle.style.top = evt.pageY + 'px';
	bulle.style.visibility = 'visible';
	}

function hidePXTroll() {
	bulle.style.visibility = 'hidden';
	}


/*********************************************************************************
*                               Fonctions Trésors                                *
*********************************************************************************/

function getTresorNom(i) {
	var nom = x_tresors[i].childNodes[2].firstChild.childNodes;
	return (nom.length==1) ? nom[0].nodeValue : nom[1].firstChild.nodeValue;
	}

function getTresorPosition(i) {
	var tds = x_tresors[i].childNodes;
	return [tds[3].firstChild.nodeValue, tds[4].firstChild.nodeValue, tds[5].firstChild.nodeValue];
	}

function getTresorDistance(i) {
	return x_tresors[i].firstChild.firstChild.nodeValue;
	}

function filtreTresors() {
	var noGG = saveCheckBoxStatus(checkBoxGG, 'NOGG');
	var noCompos = saveCheckBoxStatus(checkBoxCompos, 'NOCOMP');
	var noBidouilles = saveCheckBoxStatus(checkBoxBidouilles, 'NOBID');
	var filtre = filtreTresor != '';
	var noEngages = saveCheckBoxStatus(checkBoxTresorsNonLibres, 'NOTRESORSNONLIBRES');
	if (noEngages && !isEngagesComputed) {
		for (var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if (!listeEngages[pos[0]])
				{ listeEngages[pos[0]] = []; }
			if (!listeEngages[pos[0]][pos[1]])
				{ listeEngages[pos[0]][pos[1]] = []; }
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
			}
		isEngagesComputed = true;
		}
	mainTabs[5].rows[0].cells[0].childNodes[1].rows[0].cells[1].firstChild.firstChild.innerHTML =
				'TRESORS' + (filtre ? ' (filtrés sur ' + filtreTresor + ')' : '');
	for (var i = nbTresors ; i>0 ; i--) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		x_tresors[i].style.display = (noGG && nom.indexOf('Gigots de Gob') != -1)
				|| (noCompos && nom.indexOf(' Composant') != -1)
				|| (noEngages && listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]] && listeEngages[pos[0]][pos[1]][pos[2]] && getTresorDistance(i)>0)
				|| (filtre && nom.toLowerCase().indexOf(filtreTresor) == -1)
				|| (noBidouilles && nom.indexOf('[Bidouille] ') != -1)
				? 'none' : '';
	}
}


/*********************************************************************************
*                                Fonctions Lieux                                 *
*********************************************************************************/

function getLieuNom(i) {
	var nom = x_lieux[i].childNodes[2].childNodes[1].firstChild;
	return (nom.nodeName!='A') ?
		nom.nodeValue : (nom.firstChild.nodeValue==null ? nom.firstChild.innerHTML:nom.firstChild.nodeValue);
}

function getDistanceLieu(i) {
	return x_lieux[i].childNodes[0].childNodes[0].nodeValue * 1;
}

function filtreLieux() {
	var noTrou = saveCheckBoxStatus(checkBoxTrou, 'NOTROU');
	var filtre = filtreLieu != '';
	mainTabs[9].rows[0].cells[0].childNodes[1].rows[0].cells[1].firstChild.firstChild.innerHTML =
				'LIEUX PARTICULIERS' + (filtre ? ' (filtrés sur ' + filtreLieu + ')' : '');
	for (var i = nbLieux+1; --i >= 1;)
		x_lieux[i].style.display = ((filtre && getLieuNom(i).toLowerCase().indexOf(filtreLieu) == -1) 
			|| (noTrou && getLieuNom(i).toLowerCase().indexOf("trou de météorite") != -1 && getDistanceLieu(i) > 1))
			? 'none' : '';
}


/*********************************************************************************
*                               Ajouts des Boutons                               *
*********************************************************************************/

function putExternalLinks() { // Insertion des liens déclarés dans les options MZ
	var Rdiv = document.evaluate("//div/a[contains(./text(),'Logout')]/..", document,
									null, 9, null).singleNodeValue;
	if (!Rdiv) {return;}
	anotherURL = MZ_getValue('URL1');
	if (!anotherURL) {return;}
	
	/* Insertion du div Logout dans une table */
	var table = document.createElement('table');
	table.setAttribute('width','100%');
	var tr = appendTr(table);
	var td = appendTd(tr);
	var Ldiv = document.createElement('div');
	Ldiv.setAttribute('align','left');
	td.appendChild(Ldiv);
	td = appendTd(tr);
	Rdiv.parentNode.replaceChild(table,Rdiv);
	td.appendChild(Rdiv);
	/* Insertion Liens */
	var i=1;
	while( anotherURL ) {
		var a = document.createElement('a');
		Ldiv.appendChild(a);
		var url = MZ_getValue('URL'+i);
		var nom = MZ_getValue('URL'+i+'.nom');
		var ico = MZ_getValue('URL'+i+'.ico');
		a.setAttribute('href',url);
		a.setAttribute('target','_blank');
		a.setAttribute('class','AllLinks'); // ???
		if (ico) {
			var txt = nom ? nom : '';
			var img = createImage(ico,txt);
			a.appendChild(img);
			}
		else
			{ appendText(a, '['+nom+']' ); }
		i++;
		anotherURL = MZ_getValue('URL'+i);
		}
	}

// Bouton vue 2D
var vue2Ddata = [];
vue2Ddata['Bricol\' Vue'] = ['http://trolls.ratibus.net/mountyhall/vue_form.php',
	'vue', getVueScript, ['mode', 'vue_SP_Vue2', 'screen_width', screen.width ] ];
vue2Ddata['Vue du CCM'] = ['http://clancentremonde.free.fr/Vue2/RecupVue.php',
	'vue', getVueScript, ['id', numTroll+';'+getPositionStr(getPosition()) ] ];
/*vue2Ddata['Vue Evolution'] = ['http://www.evolution-mountyhall.com/fr/spe/evo/evo_v2d_mz.php',
	'vue', getVueScript, ['action', 'generer'] ]; // erreur script */
/*vue2Ddata['Vue Garush'] = ['http://garush.free.fr/TrtVueScript.php',
	'Vue', getVueScript, [] ];*/
vue2Ddata['Vue Gloumfs 2D'] = ['http://gloumf.free.fr/vue2d.php',
	'vue_mountyzilla', getVueScript, [] ];
vue2Ddata['Vue Gloumfs 3D'] = ['http://gloumf.free.fr/vue3d.php',
	'vue_mountyzilla', getVueScript, [] ];
vue2Ddata['Grouky Vue!'] = ['http://ythogtha.org/MH/grouky.py/grouky',
	'vue', getVueScript, ['type_vue', 'V5b1'] ];
/*vue2Ddata['Vue KiLaMo'] = ['http://zadorateursdekilamo.free.fr/public/pub_chrgvue.php',
	'VUEMH', getVueScript, [] ];
vue2Ddata['Vue LXGT'] = ['http://fryrd.free.fr/troll/forum/majvuemh.php',
	'vue', getVueScript, [] ];
vue2Ddata['Vue OTAN'] = ['http://drunk.cryo.free.fr/resultat_vue.php',
	'txtVue', getVueScript, ['txtTypeVue', 'Mountyzilla'] ];
vue2Ddata['Vue R&M'] = ['http://outils.relaismago.com/vue2d/get_vue.php3',
	'datas', getLieux, [] ]; // erreur script
vue2Ddata['Vue Xtrolls'] = ['http://thextrolls.free.fr/carte/partage/vue_mozilla.php',
	'vue', getVueScript, [] ]; */

function refresh2DViewButton() {
	var vueext = selectVue2D.value;
	MZ_setValue('VUEEXT',vueext);
	viewForm.innerHTML = '';
	viewForm.setAttribute('method', 'post');
	viewForm.setAttribute('action', vue2Ddata[vueext][0]);
	viewForm.setAttribute('target', '_blank');
	appendHidden(viewForm, vue2Ddata[vueext][1], '');
	var listeParams = vue2Ddata[vueext][3];
	for (var i=0 ; i<listeParams.length ; i+=2)
		appendHidden(viewForm, listeParams[i], listeParams[i+1]);
	appendSubmit(viewForm, 'Voir',
		function() {document.getElementsByName(vue2Ddata[vueext][1])[0].value = vue2Ddata[vueext][2]();} );
	}

function set2DViewSystem() { // choix de la vue sans passer par les options
	var vueext = MZ_getValue('VUEEXT');
	if (!vueext || !vue2Ddata[vueext])
		{ vueext = 'Bricol\' Vue'; }
	
	selectVue2D = document.createElement('select');
	selectVue2D.setAttribute('class','SelectboxV2');
	for (var view in vue2Ddata)
		{ appendOption(selectVue2D, view, view); }
	selectVue2D.value = vueext;
	selectVue2D.addEventListener('change', refresh2DViewButton, false);
	
	viewForm = document.createElement('form');
	refresh2DViewButton();
	
	var center = document.getElementById('titre2').nextSibling;
	var table = document.createElement('table');
	var tr = appendTr(table);
	var td = appendTd(tr);
	td.appendChild(selectVue2D);
	td = appendTd(tr);
	td.setAttribute('style','font-size:0px');
	td.appendChild(viewForm);
	center.insertBefore(table, center.firstChild);
	insertBr(center.childNodes[1]);
	}

function appendSendBouton(paren, url, id, value, text) {
	var myForm = document.createElement('form');
	myForm.setAttribute('method', 'post');
	myForm.setAttribute('align', 'right');
	myForm.setAttribute('action', url);
	myForm.setAttribute('name', 'frmvue');
	myForm.setAttribute('target', '_blank');
	appendHidden(myForm, id, '');
	appendSubmit(myForm, text, function() {document.getElementsByName(id)[0].value=value();});
	paren.appendChild(myForm);
	}

function putMonstresBouton() {
	var tdTitle = document.evaluate(".//text()[contains(.,'MONSTRES')]/../../..",
										mainTabs[1], null, 9, null).singleNodeValue;
	if (!tdTitle) {return;}
	
	var td = insertTd(tdTitle.nextSibling);
	td.setAttribute('style','font-size:0px'); // p***n d'extra character de m***e
	appendSendBouton(td,
				'http://mountyhall.clubs.resel.fr/script/v2/get_monstres.php',
				'listemonstres', getMonstres, 'Ajouter les monstres à la base des Teubreux');
	}

function putLieuxBouton() {
	var tdTitle = document.evaluate(".//text()[contains(.,'LIEUX')]/../../..",
										mainTabs[9], null, 9, null).singleNodeValue;
	if (!tdTitle) {return;}
	
	var td = insertTd(tdTitle.nextSibling);
	td.setAttribute('style','font-size:0px');
	appendSendBouton(td,
				'http://mountyzilla.tilk.info/scripts/lieux.php',
				'listelieux', getLieux, 'Ajouter les lieux à la base');
	}

function creerTableauInfos() {
	var tr = mainTabs[0].childNodes[1].firstChild;
	tr.addEventListener('click', function() {toggleTableauInfos();}, true);
	var thead = document.createElement('thead');
	thead.appendChild(tr);

	insertBefore(mainTabs[0].firstChild, thead);
	tr.firstChild.setAttribute('colspan', '11');
	tr.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	tr.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	}

function toggleTableauInfos() {
	if (cursorOnLink) {return;} // ???
	
	var tbody = mainTabs[0].childNodes[1];
	MZ_setValue('INFOPLIE', !tbody.getAttribute('style') || tbody.getAttribute('style')=='');
	if (!tbody.getAttribute('style') || tbody.getAttribute('style')=='') {
		var vues = getPorteVue();
		var pos = getPosition();
		appendText(mainTabs[0].childNodes[0].firstChild.firstChild,
						' => Position : X = '+pos[0]+', Y = '+pos[1]+', N = '+pos[2]
						+' --- Vue : '+vues[0]+'/'+vues[1]+' ('+vues[2]+'/'+vues[3]+')',1);
		}
	else {
		texte = mainTabs[0].childNodes[0].firstChild.firstChild.childNodes[1];
		texte.parentNode.removeChild(texte);
		}
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
	}

function putFiltresBoutons() {
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	tr.addEventListener('click', function() {toggleTableauInfos();} ,true);

	var td = appendTdText(tr, 'INFORMATIONS', true);
	mainTabs[0].removeChild(mainTabs[0].firstChild);
	insertBefore(mainTabs[0].firstChild, thead);

	td.setAttribute('colspan', '9');
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className='mh_tdtitre';");

	// On met le limitateur de vue à gauche pour des questions de taille de tableau
	var tr = mainTabs[0].childNodes[1].firstChild;
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
	checkBoxLevels = appendNobr(td, 'delniveau', toggleLevelColumn, ' Les Niveaux').firstChild;
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
			toggleTableauInfos();
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
	var tr = insertTr(mainTabs[0].childNodes[1].childNodes[1], 'mh_tdpage');
	var td = appendTdText(tr, 'RECHERCHER :', true);
	td.setAttribute('align', 'right');
	td = appendTdCenter(tr);
	appendSearch(td, 'rec_monstre', 'Monstre',
		function() {filtreMonstre = document.getElementById('rec_monstre').value.toLowerCase(); filtreMonstres();});
	appendSearch(td, 'rec_troll', 'Trõll',
		function() {filtreTroll = document.getElementById('rec_troll').value.toLowerCase(); filtreTrolls();});
	appendSearch(td, 'rec_guilde', 'Guilde',
		function() {filtreGuilde = document.getElementById('rec_guilde').value.toLowerCase(); filtreTrolls();});
	appendSearch(td, 'rec_tresor', 'Trésor',
		function() {filtreTresor = document.getElementById('rec_tresor').value.toLowerCase(); filtreTresors();});
	appendSearch(td, 'rec_lieu', 'Lieu',
		function() {filtreLieu = document.getElementById('rec_lieu').value.toLowerCase(); filtreLieux();});
	tr = insertTr(mainTabs[0].childNodes[1].childNodes[1], 'mh_tdpage');
	td = appendTdText(tr, 'FILTRAGE MONSTRES :', true);
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
	var nodes = document.evaluate("//li/b/text()[contains(.,'horizontalement') or contains(.,'verticalement')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(nodes.snapshotLength!=4)
		return null;
	for(var i=0;i<4;i++)
	{
		array.push(parseInt(nodes.snapshotItem(i).nodeValue));

	}
	return array;
}

function getPositionStr(pos) {
	return pos[0]+';'+pos[1]+';'+pos[2];
	}

function getVue() {
	var vues = getPorteVue();
	return new Array(vues[0], vues[1]);
}

function appendMonstres(txt) {
	for (var i = 1; i <= nbMonstres; i++)
		txt += getMonstreID(i) + ";" + getMonstreNom(i) + ";" + getPositionStr(getMonstrePosition(i)) + "\n";
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(getPositionStr(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function appendLieux(txt) {
	for (var i = 1; i < nbLieux+1; i++) {
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
	    for (var i = 1; i < nbTrolls+1; i++)
        {
		    txt += getTrollID(i) + ";" + getPositionStr(getTrollPosition(i)) + "\n";
        }
	    txt = appendMonstres(txt + "#FIN TROLLS\n#DEBUT MONSTRES\n") + "#FIN MONSTRES\n#DEBUT TRESORS\n";
	    for (var i = 1; i < nbTresors+1; i++) {
		    var tds = x_tresors[i].childNodes;
		    txt += tds[1].firstChild.nodeValue + ";" + getTresorNom(i) + ";" + tds[3].firstChild.nodeValue + ";"
				    + tds[4].firstChild.nodeValue + ";" + tds[5].firstChild.nodeValue + "\n";
	    }
	    txt = appendLieux(txt + "#FIN TRESORS\n#DEBUT LIEUX\n") + "#FIN LIEUX\n#DEBUT CHAMPIGNONS\n";
	    for (var i = 1; i < nbChampis+1; i++) {
		    var tds = x_champis[i].childNodes;
		    txt += tds[1].firstChild.nodeValue + ";" + tds[2].firstChild.nodeValue + ";" + tds[3].firstChild.nodeValue
				    + ";" + tds[4].firstChild.nodeValue + "\n";
	    }
        return txt + "#FIN CHAMPIGNONS\n#DEBUT ORIGINE\n" + getVue()[0] + ";" + getPositionStr(getPosition()) + "\n#FIN ORIGINE\n";
	}
	catch(e) { alert(e)}
}

function putScriptExterne() {
	var infoit = MZ_getValue(numTroll+'.INFOSIT');
	if (!infoit || infoit == '')
		return;
	var nomit = infoit.substring(0, infoit.indexOf('$'));
	if (nomit=='bricol') {
		var data = infoit.split('$');
		appendNewScript('http://trolls.ratibus.net/'+data[1]+'/mz.php?login='+data[2]+'&password='+data[3]);
		}
	}

/* Le script de Ratibus renvoie :
 * infosTrolls = new Array();
 * infosTrolls[numdutroll] = new Array(PV,PVbase,date màj "le JJ/MM/AAAA à hh:mm:ss",date pDLA,PA dispos);
 * etc
 * putInfosTrolls();
 */

function corrigeBricolTrolls() {
	for (var i in infosTrolls) {
		var pv = infosTrolls[i][0];
		var pvmax = infosTrolls[i][1];
		var pvmem = MZ_getValue(i+'.pv.max');
		if (pvmem && pvmem>pvmax) {
			infosTrolls[i][1] = pvmem;
			pvmax = pvmem;
			}
		if (pv>pvmax) {
			var newpvmax = 5*Math.ceil(pv/5);
			MZ_setValue(i+'.pv.max',newpvmax);
			infosTrolls[i][1] = newpvmax;
			}
		}
	}

function erreur( chaine ) { // inutilisé ?
	var infoit = MZ_getValue(numTroll+'.INFOSIT');
	if (!infoit || infoit=='')
		return;
	var it = infoit.substring(0, infoit.indexOf('$'));
	if (it=='bricol')
			alert("Erreur lors de la connection avec l'interface des Bricol'Trolls :\n"+chaine);
	MZ_removeValue(numTroll+'.INFOSIT');
	}

function putInfosTrolls() {
	// teste la présence de trõlls de l'IT
	var i=1;
	while ( i<=nbTrolls && !infosTrolls[getTrollID(i)] ) {i++;}
	if (i==nbTrolls+1) {return;}
	
	try
	{
	var td = insertTdText(x_trolls[0].childNodes[6], 'PA', true);
	td.setAttribute('width', '40');
	td = insertTdText(x_trolls[0].childNodes[6], 'PV', true);
	td.setAttribute('width', '105');
	
	corrigeBricolTrolls();
	
	for (i=1 ; i<=nbTrolls ; i++) {
		var infos = infosTrolls[getTrollID(i)];
		if (infos) {
			/* PAs dipos */
			var span = document.createElement('span');
			span.setAttribute('title', infos[3]);
			appendText(span, infos[4]+' PA' );
			insertTdElement(x_trolls[i].childNodes[6], span);
			/* cadre barre PV */
			var tab = document.createElement('div');
			tab.setAttribute('width', '100');
			tab.style.background='#FFFFFF';
			tab.style.width=100;
			tab.style.border=1;
			tab.setAttribute('height', '10');
			tab.setAttribute('title', infos[0]+'/'+infos[1]+' '+ infos[2]);
			/* barre PV */
			var img = document.createElement('img');
			img.setAttribute('src', '../Images/Interface/milieu.gif');
			img.setAttribute('height', '10');
			img.setAttribute('width', Math.floor( (100*infos[0])/infos[1] ));
			tab.appendChild(img);
			insertTdElement(x_trolls[i].childNodes[6], tab);
			}
		else {
			insertTd(x_trolls[i].childNodes[6]);
			insertTd(x_trolls[i].childNodes[6]);
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
	for (var i = 1; i < nbTrolls+1; i++) 
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
	if (MZ_getValue(numTroll+'.TAGSURL')==null || MZ_getValue(numTroll+'.TAGSURL')=='')
		return false;
	var tagsurl = MZ_getValue(numTroll+'.TAGSURL');
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
	for (var i = nbTresors+1; --i >= 1;) {
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
	for (var i = 1; i < nbTrolls+1; i++) 
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
	for (var i = nbMonstres+1; --i >= 1;) 
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

function computeTactique(begin, end) {
	try
	{
	var j;
	if(begin==null)
		begin=1;
	if(end==null)
		end=nbMonstres;
	var noTactique = saveCheckBoxStatus(checkBoxTactique, "NOTACTIQUE");
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
//			var imgUrl = "http://localhost/~nico/MZimg/calc2.png"; // DEBUG
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
		begin=1;
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
		begin=1;
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
	table.setAttribute('id', 'popupCDM'+id );
	table.setAttribute('style', 'display: none; position: fixed; z-index: 1; top: '+ (300
			+ (30 * nbCDM)) % (30 * Math.floor((window.innerHeight - 400) / 30)) + 'px; left: '
			+ (window.innerWidth - 365) + 'px; width: 300px; height: 200px;');
	mainTabs[0].parentNode.appendChild(table);

	var tr = table.firstChild;
	tr.setAttribute('style', 'cursor:move;');
	tr.addEventListener("mousedown", startDrag, true);
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


function savePosition() {
	var pos = getPosition();
	MZ_setValue(numTroll+'.position.X',pos[0]);
	MZ_setValue(numTroll+'.position.Y',pos[1]);
	MZ_setValue(numTroll+'.position.N',pos[2]);
	}


/*                              Partie principale                               */

try
{
start_script(31);
	

putFiltresBoutons();
putSearchForms();
putExternalLinks();
set2DViewSystem();
putLieuxBouton();
putMonstresBouton();


//800 ms
synchroniseFiltres();
toggleLevelColumn();
savePosition();

//400 ms
{
	var noGG = saveCheckBoxStatus(checkBoxGG, "NOGG");
	var noCompos = saveCheckBoxStatus(checkBoxCompos, "NOCOMP");
	var noBidouilles = saveCheckBoxStatus(checkBoxBidouilles, "NOBID");
	var noGowaps = saveCheckBoxStatus(checkBoxGowaps, "NOGOWAP");
	var noMythiques = saveCheckBoxStatus(checkBoxMythiques, "NOMYTH");
	var noEngages = saveCheckBoxStatus(checkBoxEngages, "NOENGAGE");
	var noTresorsEngages = saveCheckBoxStatus(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	var noTrou = saveCheckBoxStatus(checkBoxTrou, "NOTROU");
	var noIntangibles = saveCheckBoxStatus(checkBoxIntangibles, "NOINT");
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
