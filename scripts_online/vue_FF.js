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
 * /!\ bug latent sur diminution bonusPV (perte Telaite / template Ours),
 * prévoir fix ("delete infos")
 */

var filtreMonstre = ''; // obsolète - DEBUG

// Infos remplies par des scripts extérieurs
var cg = [], ct = []; // Couleur Guilde, Couleur Trõll (Diplo)

var listeCDM = [], listeLevels = [];

var listeTags = [], listeTagsInfos = [],
	listeTagsGuilde = [], listeTagsInfosGuilde = [];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.onmousemove = drag;

// Infos trolls
var popup;

var nbCDM = 0;

var isCDMsRetrieved = false; // = si les CdM ont déjà été DL
var isDiploComputed = false; // = si la Diplo a déjà été DL

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = [];
var isEngagesComputed = false;
var cursorOnLink = false;

var needComputeEnchantement = MZ_getValue(numTroll+'.enchantement.liste')
	&& MZ_getValue(numTroll+'.enchantement.liste')!='';


/*-[functions]--------- Gestion Préférences Utilisateur ----------------------*/
/*------------------------------- CHECK DONE ---------------------------------*/

var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles,
	checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres,
	checkBoxTactique, checkBoxLevels, checkBoxGowaps, checkBoxEngages,
	checkBoxMythiques, comboBoxNiveauMin, comboBoxNiveauMax;

function saveCheckBox(chkb, pref) {
	// Enregistre et retourne l'état d'une CheckBox
	var etat = chkb.checked;
	MZ_setValue(pref, etat ? 'true' : 'false' );
	return etat;
	}

function recallCheckBox(chkb, pref) {
	// Restitue l'état d'une CheckBox
	chkb.checked = (MZ_getValue(pref)=='true');
	}

function saveComboBox(cbb, pref) {
	// Enregistre et retourne l'état d'une ComboBox
	var etat = cbb.selectedIndex;
	MZ_setValue(pref, etat);
	return etat;
	}

function recallComboBox(cbb, pref) {
	// Restitue l'état d'une ComboBox
	if(MZ_getValue(pref)) cbb.value = MZ_getValue(pref);
	}

function synchroniseFiltres() {
	// Récupération de toutes les options de la vue
	recallComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE');
	recallComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE');
	recallCheckBox(checkBoxGowaps,'NOGOWAP');
	recallCheckBox(checkBoxMythiques,'NOMYTH');
	recallCheckBox(checkBoxEngages,'NOENGAGE');
	recallCheckBox(checkBoxLevels,'NOLEVEL');
	recallCheckBox(checkBoxIntangibles,'NOINT');
	recallCheckBox(checkBoxGG,'NOGG');
	recallCheckBox(checkBoxCompos,'NOCOMP');
	recallCheckBox(checkBoxBidouilles,'NOBID');
	recallCheckBox(checkBoxDiplo,'NODIPLO');
	recallCheckBox(checkBoxTrou,'NOTROU');
	recallCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	recallCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(MZ_getValue('NOINFOEM')!='true')
		recallCheckBox(checkBoxEM,'NOEM');
	}


/*-[functions]--- Fonctions de récupération de données (DOM) -----------------*/
/* INFOS :
 * les champs-titres (table>tbody>tr>td>table>tbody>tr>td>a)
 * sont identifiables via leur Name
 * les tables-listings sont identifiables via l'ID du tr conteneur
 * (mh_vue_hidden_XXX, XXX=trolls, champis, etc)
 */

/* Acquisition & Stockage des données  */
var node = document.getElementById('mh_vue_hidden_monstres');
var tr_monstres = node.getElementsByTagName('tr');
var nbMonstres = tr_monstres.length-1;
node = document.getElementById('mh_vue_hidden_trolls');
var tr_trolls = node.getElementsByTagName('tr');
var nbTrolls = tr_trolls.length-1;
node = document.getElementById('mh_vue_hidden_tresors');
var tr_tresors = node.getElementsByTagName('tr');
var nbTresors = tr_tresors.length-1;
node = document.getElementById('mh_vue_hidden_champignons');
var tr_champis = node.getElementsByTagName('tr');
var nbChampis = tr_champis.length-1;
node = document.getElementById('mh_vue_hidden_lieux');
var tr_lieux = node.getElementsByTagName('tr');
var nbLieux = tr_lieux.length-1;
/*---------------------------------- DEBUG -----------------------------------*/
var mainTabs = document.getElementsByClassName('mh_tdborder');
var x_monstres = tr_monstres;
var x_trolls = tr_trolls;
var x_tresors = tr_tresors;
var x_champis = tr_champis;
var x_lieux = tr_lieux;
/*-------------------------------- FIN DEBUG ---------------------------------*/

/* [functions] Récup données monstres */
function getMonstreDistance(i) {
	return tr_monstres[i].firstChild.firstChild.nodeValue;
	}

function getMonstreID(i) {
	return tr_monstres[i].childNodes[1].firstChild.nodeValue;
	}

function getMonstreIDByTR(tr) {
	return tr.childNodes[1].firstChild.nodeValue;
	}

function getMonstreLevelNode(i) {
	return tr_monstres[i].childNodes[2];
	}

function getMonstreLevel(i) {
	if(!isCDMsRetrieved) return -1;
	var donneesMonstre = listeCDM[getMonstreID(i)];
	return donneesMonstre ? parseInt(donneesMonstre[0]) : -1;
	}

function getMonstreTdNom(i) {
	try {
		return tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
		}
	catch(e) {
		window.alert('Impossible de trouver le monstre '+i);
		}
	}

function getMonstreNom(i) {
	try {
		return tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3]
			.firstChild.firstChild.nodeValue;
		}
	catch(e) {
		window.alert('Impossible de trouver le monstre '+i);
		}
	}

function getMonstreNomByTR(tr) {
	return tr.childNodes[checkBoxLevels.checked ? 2 : 3]
		.firstChild.firstChild.nodeValue;
	}

function getMonstrePosition(i) {
	var tds = tr_monstres[i].childNodes;
	var c = checkBoxLevels.checked ? 0 : 1;
	return [ tds[3+c].firstChild.nodeValue,
			tds[4+c].firstChild.nodeValue,
			tds[5+c].firstChild.nodeValue ];
	}

/* [functions] Récup données Trolls */
function getTrollDistance(i) {
	return tr_trolls[i].firstChild.firstChild.nodeValue;
	}

function getTrollID(i) {
	return tr_trolls[i].childNodes[1].firstChild.nodeValue;
	}

function getTrollNomNode(i) {
	return tr_trolls[i].childNodes[2];
	}

function getTrollGuildeID(i) {
	if(tr_trolls[i].childNodes[5].firstChild.childNodes.length>0) {
		var href = tr_trolls[i].childNodes[5].firstChild.getAttribute('href');
		return href.substring(href.indexOf('(')+1,href.indexOf(','));
		}
	return -1;
	}

function getTrollPosition(i) {
	var tds = tr_trolls[i].childNodes;
	var l = tds.length;
	return [
		tds[l-3].firstChild.nodeValue,
		tds[l-2].firstChild.nodeValue,
		tds[l-1].firstChild.nodeValue ];
	}

/* [functions] Récup données Trésors */
function getTresorDistance(i) {
	return tr_tresors[i].firstChild.firstChild.nodeValue;
	}

function getTresorNom(i) {
	var nom = tr_tresors[i].childNodes[2].firstChild.childNodes;
	return (nom.length==1) ? nom[0].nodeValue : nom[1].firstChild.nodeValue;
	}

function getTresorPosition(i) {
	var tds = tr_tresors[i].childNodes;
	return [
		tds[3].firstChild.nodeValue,
		tds[4].firstChild.nodeValue,
		tds[5].firstChild.nodeValue ];
	}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return parseInt(tr_lieux[i].firstChild.firstChild.nodeValue);
	}

function getLieuNom(i) { /* DEBUG - en test */
	return tr_lieux[i].childNodes[2].childNodes[1].textContent;
	}


/*-[functions]--------------- Fonctions Monstres -----------------------------*/

/* [functions] Affichage des niveaux */
/*------------------------------- CHECK DONE ---------------------------------*/
function insertLevelColumn() {
	// déclenché si toggle vers affichage du niveau
	var td = insertTdText(getMonstreLevelNode(0), 'Niveau', true);
	td.width = 25;
	for(var i=1 ; i<=nbMonstres ; i++) {
		td = insertTdText(getMonstreLevelNode(i), '-');
		td.onclick = function() {
			getCDM(getMonstreNomByTR(this.parentNode),
			getMonstreIDByTR(this.parentNode) );
			};
		td.onmouseover = function() {
			this.style.cursor = 'pointer';
			this.className = 'mh_tdtitre';
			};
		td.onmouseout = function() {this.className = 'mh_tdpage';};
		td.style = 'font-weight:bold;text-align:center;';
		if(isCDMsRetrieved)
			td.innerHTML = listeLevels[i];
			// recall des levels si mémorisés
		}
	}

function toggleLevelColumn() {
	// = EventListener checkBox noLevel
	if(!saveCheckBox(checkBoxLevels,'NOLEVEL')) {
		insertLevelColumn();
		if(!isCDMsRetrieved) {
			retrieveCDMs();
			}
		}
	else if(getMonstreLevelNode(0).textContent=='Niveau') {
		for(var i=0 ; i<=nbMonstres ; i++) {
			if(isCDMsRetrieved) {
				// mémorisation des levels pour recall
				listeLevels[i] = getMonstreLevelNode(i).innerHTML;
				}
			tr_monstres[i].removeChild(getMonstreLevelNode(i));
			}
		}
	}

/* [functions] Infos Tactiques */
function computeTactique(begin, end) {
	try {
		if(!begin) begin = 1;
		if(!end) end = nbMonstres;
		var noTactique = saveCheckBox(checkBoxTactique,'NOTACTIQUE');
		if(noTactique || !isProfilActif()) return;
		
		for(var j=end ; j>=begin ; j--) {
			var id = getMonstreID(j);
			var nom = getMonstreNom(j);
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre && nom.indexOf('Gowap')==-1) {
				var td = getMonstreTdNom(j);
				appendText(td,' ');
				td.appendChild( createPopupImage2(MZimg+'calc2.png', id, nom) );
				}
			}
		}
	catch(e) {
		window.alert('Erreur computeTactique mob num : '+j+' :\n'+e)
		}
	filtreMonstres();
	}

function updateTactique() {
	// = EventListener checkBox noTactique
	var noTactique = saveCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(!isCDMsRetrieved) return;
	
	if(noTactique) {
		for(var i=nbMonstres ; i>0 ; i--) {
			var tr = getMonstreTdNom(i);
			var img = document.evaluate("img[@src='"+MZimg+"calc2.png']",
				tr, null, 9, null).singleNodeValue;
			if(img) {
				img.parentNode.removeChild(img.previousSibling);
				img.parentNode.removeChild(img);
				}
			}
		}
	else
		computeTactique();
	}

function filtreMonstres() {
	// = EventListener universel pour les fonctions liées aux monstres
	var urlImg = MZimg+'Competences/ecritureMagique.png',
		urlEnchantImg = MZimg+'images/enchant.png';
	var useCss = MZ_getValue(numTroll+'.USECSS')=='true';
	var noGowaps = saveCheckBox(checkBoxGowaps,'NOGOWAP'),
		noMythiques = saveCheckBox(checkBoxMythiques,'NOMYTH'),
		noEngages = saveCheckBox(checkBoxEngages,'NOENGAGE'),
		niveau_min = saveComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE'),
		niveau_max = saveComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE');
	var oldNOEM = true, noEM = true;
	if(MZ_getValue('NOINFOEM')!='true')
		noEM = saveCheckBox(checkBoxEM, 'NOEM'); // wtf ?
	
	/* Liste mobs engagés */
	if(noEngages && !isEngagesComputed) {
		for(var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if(!listeEngages[pos[0]]) listeEngages[pos[0]] = [];
			if(!listeEngages[pos[0]][pos[1]]) listeEngages[pos[0]][pos[1]] = [];
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
			}
		isEngagesComputed = true;
		}
	
	var isFiltreOn = (filtreMonstre!='');
	var strfilter = '';
	if(niveau_min>0 || niveau_max>0) {
		if(niveau_min>0) strfilter += ' '+niveau_min+' \u2264';
		strfilter += ' NIVEAU';		
		if(niveau_max>0) strfilter += ' \u2264'+niveau_max;
		}
	mainTabs[1].rows[0].cells[0].childNodes[1].rows[0].cells[1]
		.firstChild.firstChild.innerHTML=
		'MONSTRES ERRANTS'+ (isFiltreOn?' (filtrés sur '+filtreMonstre+') ':' ')
		+strfilter;
	for(var i=nbMonstres ; i>0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(noEM!=oldNOEM) {
			if(noEM) {
				var tr = getMonstreTdNom(i);
				while(tr.childNodes.length>1) tr.removeChild(tr.childNodes[1]);
				}
			else {
				var tr = getMonstreTdNom(i);
				var TypeMonstre=getEM(nom);
				if(TypeMonstre!='') {
					var infosCompo=compoMobEM(TypeMonstre);
					if(infosCompo.length>0) {
						tr.appendChild(document.createTextNode(' '));
						tr.appendChild(createImage(urlImg, infosCompo));
						}
					}
				}
			}
		if(needComputeEnchantement || (noEM!=oldNOEM && noEM)) {
			var texte = getInfoEnchantementFromMonstre(nom);
			if(texte!='') {
				var tr = x_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(' '));
				tr.appendChild(createImage(urlEnchantImg, texte));
			}
		}

		x_monstres[i].style.display =
			(noGowaps	&& nom.indexOf('gowap apprivoisé')!=-1
				&& getMonstreDistance(i)>1) ||
			(noEngages && getMonstreDistance(i)!=0
				&& listeEngages[pos[0]] && listeEngages[pos[0]][pos[1]]
				&& listeEngages[pos[0]][pos[1]][pos[2]]) ||
			(isFiltreOn && nom.indexOf(filtreMonstre)==-1) ||
			(niveau_min>0 && getMonstreLevel(i)<niveau_min
			&& getMonstreDistance(i)>1 && getMonstreDistance(i)!=-1
			&& nom.toLowerCase().indexOf("kilamo")==-1) ||
			(niveau_max>0 && getMonstreLevel(i)>niveau_max
			&& getMonstreDistance(i)>1 && getMonstreDistance(i)!=-1
			&& nom.toLowerCase().indexOf("kilamo") == -1) ? 'none' : '';
		if(nom.indexOf('liche')==0 || nom.indexOf('hydre')==0
			|| nom.indexOf('balrog')==0 || nom.indexOf('beholder')==0) {
			if(!noMythiques) {
				if(useCss)
					x_monstres[i].setAttribute('class', 'mh_trolls_ennemis');
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
	
	if(MZ_getValue('NOINFOEM')!='true') {
		if(noEM != oldNOEM) {
			if(noEM) computeChargeProjoMonstre();
			if(noEM && isCDMsRetrieved) computeMission();
			}
		oldNOEM = noEM;
		}
	
	needComputeEnchantement = false;
	}

function retireMarquage(nom) {
	var i = nom.indexOf(']');
	switch(i) {
		case -1:
		case nom.length-1:
			return nom;
		default:
			return nom.substring(0,i+1);
		}
	}

function retrieveCDMs() {
	if(checkBoxLevels.checked) return;

	var str = '';
	var begin = 1; // num de début de lot si plusieurs lots de CdM (>500 CdM)
	var max = MZ_getValue(numTroll+'.MAXCDM');
	max = Math.min(nbMonstres, (max) ? max : 500);
	if(MZ_getValue('CDMID')==null) MZ_setValue('CDMID',1); // à quoi sert CDMID ??
	
	for(var i=1 ; i<=max ; i++) {
		var nomMonstre = retireMarquage(getMonstreNom(i,true));
		if(nomMonstre.indexOf(']') != -1)
			nomMonstre = nomMonstre.substring(0,nomMonstre.indexOf(']')+1);
		str += 'nom[]=' + escape(nomMonstre) + '$'
			+ (getMonstreDistance(i) <= 5 ? getMonstreID(i) : -getMonstreID(i)) + '&';
		
		if(i%500==0 || i==max) { // demandes de CdM par lots de 500 max
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
						window.alert(e+'\n'+url+'\n'+texte);
					}
					}
				});
			str = '';
			begin = i + 1;
			}
		}
	isCDMsRetrieved=true;
	}



/*-[functions]---------------- Fonctions Trõlls ------------------------------*/

function filtreTrolls() {
	var noIntangibles = saveCheckBox(checkBoxIntangibles,'NOINT');
	var strTroll = document.getElementById('rec_troll').value.toLowerCase();
	var strGuilde = document.getElementById('rec_guilde').value.toLowerCase();
	var isFiltreTrollOn = strTroll!='';
	var isFiltreGuildeOn = strGuilde!='';
	var titre = document.getElementsByName('trolls')[0].firstChild.firstChild;
	titre.nodeValue = 'TRÕLLS'
		+(isFiltreTrollOn ? ' (filtrés sur '+strTroll+')' : '')
		+(isFiltreGuildeOn ? ' (guildes filtrées sur '+strGuilde+')' : '');

	for(var i=1 ; i<=nbTrolls ; i++) {
		var tds = tr_trolls[i].childNodes;
		tr_trolls[i].style.display =
			(noIntangibles
				&& tds[2].firstChild.className=='mh_trolls_0') ||
			(isFiltreTrollOn	
				&& tds[2].textContent.toLowerCase().indexOf(strTroll)==-1) ||
			(isFiltreGuildeOn
				&& (!tds[5].firstChild.firstChild ||
					tds[5].textContent.toLowerCase().indexOf(strGuilde)==-1))
			? 'none' : '';
		}
	}

/* [functions] Diplomatie */
function refreshDiplo() {
	if(saveCheckBox(checkBoxDiplo,'NODIPLO')) {
		for(var i=nbTrolls ; i>0 ; i--) {
			tr_trolls[i].style.backgroundColor = '';
			tr_trolls[i].className = 'mh_tdpage';
			}
		return;
		}
	
	if(!isDiploComputed) {
		MZ_xmlhttpRequest({
			method: 'GET',
			url: 'http://mountyzilla.tilk.info/scripts_0.9/getTroll_FF.php?num='
				+numTroll,
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				'Accept': 'application/xml,text/xml',
				},
			onload: function(responseDetails) {
				try	{
					responseDetails.responseXML =
						new DOMParser().parseFromString(
							responseDetails.responseText,'text/xml'
							);
					var infosDiplo = responseDetails.responseXML;
					if(infosDiplo.getElementsByTagName('error').length>0) {
						MZ_setValue('NODIPLO','true');
						var bouton=document.getElementsByName('deldiplo')[0];
						bouton.checked=true;
						window.alert(infosDiplo.getElementsByTagName('error')[0]
							.firstChild.nodeValue);
						return;
						}
					var infosDiploTrolls = infosDiplo.getElementsByTagName('troll');
					for(var i=0 ; i<infosDiploTrolls.length ; i++) {
						ct[parseInt(infosDiploTrolls[i].firstChild.nodeValue)] =
							infosDiploTrolls[i].getAttribute("couleur");
						}
					var infosDiploGuildes = infosDiplo.getElementsByTagName('guilde');
					for(var i=0 ; i<infosDiploGuildes.length ; i++) {
						cg[parseInt(infosDiploGuildes[i].firstChild.nodeValue)] =
							infosDiploGuildes[i].getAttribute("couleur");
						}
					isDiploComputed = true;
					putRealDiplo();
					}
				catch(e) {
					window.alert('Erreur Diplo :\n'+e)
					}
				}
			});
		}
	else
		putRealDiplo();
	}

function putRealDiplo() {
	var useCss = MZ_getValue(numTroll+'.USECSS') == 'true';
	for(var i=1 ; i<=nbTrolls ; i++) {
		var troll = tr_trolls[i];
		var cl = ct[getTrollID(i)];
		var guildeID = getTrollGuildeID(i);
		if(cl) {
			if(useCss && cl=='#AAFFAA')
				troll.className = 'mh_trolls_amis';
			else if(useCss && cl=='#FFAAAA')
				troll.className = 'mh_trolls_ennemis';
			else {
				troll.className = '';
				troll.style.backgroundColor = cl;
				}
			}
		else if(guildeID!=1) {
			cl = cg[guildeID];
			if(!cl)
				continue;
			if(useCss && cl == '#AAFFAA')
				troll.className = 'mh_guildes_amis';
			else if(useCss && cl == '#FFAAAA')
				troll.className = 'mh_guildes_ennemis';
			else if(useCss && cl == '#BBBBFF')
				troll.className = 'mh_guildes_perso';
			else {
				troll.className = '';
				troll.style.backgroundColor = cl;
				}
			}
		}
	}

/* [functions] Bulle PX Trolls */
/*------------------------------- CHECK DONE ---------------------------------*/
var bulle;

function initPXTroll() {
	bulle = document.createElement('div');
	bulle.id = 'bulle';
	bulle.className = 'mh_textbox';
	bulle.style =
		'position: absolute;'
		+'border: 1px solid #000000;'
		+'visibility: hidden;'
		+'display: inline;'
		+'z-index: 2;';
	document.body.appendChild(bulle);

	for(var i=nbTrolls ; i>0 ; i--) {
		var td_niv = tr_trolls[i].childNodes[3];
		td_niv.onmouseover = showPXTroll;
		td_niv.onmouseout = hidePXTroll;
		}
	}

function showPXTroll(evt) {
	var lvl = this.firstChild.nodeValue;
	bulle.innerHTML = 'Niveau '+lvl+analysePXTroll(lvl);
	bulle.style.left = evt.pageX+15+'px';
	bulle.style.top = evt.pageY+'px';
	bulle.style.visibility = 'visible';
	}

function hidePXTroll() {
	bulle.style.visibility = 'hidden';
	}

/* [functions] Envoi PX / MP */

function putBoutonPXMP() {
	// Bouton d'initialisation du mode Envoi
	var tdTitle = document.getElementsByName('trolls')[0];
	if(!tdTitle) return;
	tdTitle = tdTitle.parentNode;
	tdTitle.width = 70;
	var td = insertTd(tdTitle.nextSibling);
	var bouton = appendButton(td,'Envoyer...',prepareEnvoi);
	bouton.id = 'boutonEnvoi';
	}

function prepareEnvoi() {
	// = EventListener bouton d'envoi
	/* Ajout du radio de choix PX ou MP */
	var btnEnvoi = document.getElementById('boutonEnvoi');
	if(!btnEnvoi) return;
	var tdEnvoi = btnEnvoi.parentNode;
	var radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.id = 'radioPX';
	appendText(tdEnvoi,' ');
	tdEnvoi.appendChild(radioElt);
	appendText(tdEnvoi,' des PX ');
	radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.checked = true;
	tdEnvoi.appendChild(radioElt);
	appendText(tdEnvoi,' un MP');
	
	/* Insertion du bouton Annuler */
	insertButton(btnEnvoi,'Annuler',annuleEnvoi);
	
	/* Ajout de la colonne des CheckBoxes */
	var td = insertTdText(getTrollNomNode(0),'');
	td.width = 5;
	for(var i=nbTrolls ; i>0 ; i--) {
		td = insertTd(getTrollNomNode(i));
		appendCheckBox(td,'envoi'+i);
		}
	
	/* Modification de l'effet du bouton Envoi */
	document.getElementById('boutonEnvoi').onclick = effectueEnvoi;
	}

function annuleEnvoi() {
	// = EventListener du bouton Annuler
	/* Nettoyage du td du bouton Envoi */
	var btnEnvoi = document.getElementById('boutonEnvoi');
	var tdEnvoi = btnEnvoi.parentNode;
	while(tdEnvoi.firstChild) {
		tdEnvoi.removeChild(tdEnvoi.firstChild);
		}
	/* Suppression CheckBoxes */
	for(var i=nbTrolls ; i>=0 ; i--) {
		var td = getTrollNomNode(i);
		td.parentNode.removeChild(td);
		}
	/* Retour à l'effet de base du bouton Envoi */
	btnEnvoi.onclick = prepareEnvoi;
	tdEnvoi.appendChild(btnEnvoi);
	}

function effectueEnvoi() {
	// = Second Listener du bouton d'envoi PX MP (charge un nouveau frame)
	var str='';
	for(var i=nbTrolls ; i>0 ; i--) {
		var chb = document.getElementById('envoi'+i);
		if(chb.checked)	str += (str?',':'')+getTrollID(i);
		}
	var PXchecked = document.getElementById('radioPX').checked;
	if(PXchecked) {
		window.open('Actions/Play_a_DonPX.php?cat=8&dest='+str,'Contenu');
		}
	else {
		window.open('../Messagerie/MH_Messagerie.php?cat=3&dest='+str,'Contenu');
		}
	}

/*-[functions]---------------- Fonctions Trésors -----------------------------*/
/*------------------------------- CHECK DONE ---------------------------------*/

function filtreTresors() {	
	// = EventListener ChB : gg, compos, bidouilles, non libres
	var noGG = saveCheckBox(checkBoxGG,'NOGG');
	var noCompos = saveCheckBox(checkBoxCompos,'NOCOMP');
	var noBidouilles = saveCheckBox(checkBoxBidouilles,'NOBID');
	var noEngages = saveCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	if(noEngages && !isEngagesComputed) {
		for(var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if(!listeEngages[pos[2]]) listeEngages[pos[2]] = [];
			if(!listeEngages[pos[2]][pos[1]]) listeEngages[pos[2]][pos[1]] = [];
			listeEngages[pos[2]][pos[1]][pos[0]] = 1;
			}
		isEngagesComputed = true;
		}
	var strTresor = document.getElementById('rec_tresor').value.toLowerCase();
	var filtreON = strTresor!='';
	var titre = document.getElementsByName('tresors')[0].firstChild.firstChild;
	titre.nodeValue =
		'TRÉSORS' + (filtreON ? ' (filtrés sur '+strTresor+')' : '');
	for(var i=nbTresors ; i>0 ; i--) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		tr_tresors[i].style.display =
			(noGG && nom.indexOf('Gigots de Gob')!=-1) ||
			(noCompos && nom.indexOf('Composant')!=-1) ||
			(noEngages && listeEngages[pos[2]] && listeEngages[pos[2]][pos[1]]
			&& listeEngages[pos[2]][pos[1]][pos[0]] && getTresorDistance(i)>0) ||
			(filtreON && nom.toLowerCase().indexOf(strTresor)==-1) ||
			(noBidouilles && nom.indexOf('[Bidouille]')!=-1)
			? 'none' : '';
		}
	}


/*-[functions]----------------- Fonctions Lieux ------------------------------*/
/*------------------------------- CHECK DONE ---------------------------------*/

function filtreLieux() {
	// = EventListener ChB trous
	var noTrou = saveCheckBox(checkBoxTrou,'NOTROU');
	var strLieu = document.getElementById('rec_lieu').value.toLowerCase();
	var titre = document.getElementsByName('lieux')[0].firstChild.firstChild;
	titre.nodeValue =
		'LIEUX PARTICULIERS' + (strLieu ? ' (filtrés sur '+strLieu+')' : '');
	for(var i=nbLieux ; i>0 ; i--) {
		tr_lieux[i].style.display =
			(strLieu && getLieuNom(i).toLowerCase().indexOf(strLieu)==-1) ||
			(noTrou && getLieuNom(i).toLowerCase().indexOf("trou de météorite")!=-1
			&& getLieuDistance(i)>1)
			? 'none' : '';
		}
	}



/*-[functions]---------------- Ajout des Boutons -----------------------------*/

/* [functions] Insertion raccourcis urls */
/*------------------------------- CHECK DONE ---------------------------------*/
function putExternalLinks() {
	// Insertion dans la vue des liens déclarés dans les options MZ
	var Rdiv = document.evaluate("//div/a[contains(./text(),'Logout')]/..",
		document, null, 9, null).singleNodeValue;
	if(!Rdiv) return;
	var anotherURL = MZ_getValue('URL1');
	if(!anotherURL) return;
	
	/* Insertion du div Logout dans une table */
	var table = document.createElement('table');
	table.width = '100%';
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
	while(anotherURL) {
		var a = document.createElement('a');
		Ldiv.appendChild(a);
		var url = MZ_getValue('URL'+i);
		var nom = MZ_getValue('URL'+i+'.nom');
		var ico = MZ_getValue('URL'+i+'.ico');
		a.href = url;
		a.target = '_blank';
		a.className = 'AllLinks'; // ??? DEBUG
		if(ico) {
			var txt = nom ? nom : '';
			var img = createImage(ico,txt);
			a.appendChild(img);
			}
		else
			appendText(a,'['+nom+']');
		i++;
		anotherURL = MZ_getValue('URL'+i);
		}
	}

/* [functions] Menu Vue 2D */
/*------------------------------- CHECK DONE ---------------------------------*/
var vue2Ddata = {
	'Bricol\' Vue':
		['http://trolls.ratibus.net/mountyhall/vue_form.php', 'vue',
		getVueScript, ['mode','vue_SP_Vue2','screen_width',screen.width] ],
	'Vue du CCM':
		['http://clancentremonde.free.fr/Vue2/RecupVue.php', 'vue',
		getVueScript, ['id',numTroll+';'+getPositionStr(getPosition())] ],
	'Vue Gloumfs 2D' :
		['http://gloumf.free.fr/vue2d.php', 'vue_mountyzilla', getVueScript, [] ],
	'Vue Gloumfs 3D':
		['http://gloumf.free.fr/vue3d.php', 'vue_mountyzilla', getVueScript, [] ],
	'Grouky Vue!':
		['http://ythogtha.org/MH/grouky.py/grouky', 'vue',
		getVueScript, ['type_vue', 'V5b1'] ]
	};

function refresh2DViewButton() {
	// = EventListener menu+bouton vue 2D
	var vueext = document.getElementById('selectVue2D').value;
	MZ_setValue('VUEEXT',vueext);
	var form = document.getElementById('viewForm');
	form.innerHTML = '';
	form.method = 'post';
	form.action = vue2Ddata[vueext][0];
	form.target = '_blank';
	appendHidden(form, vue2Ddata[vueext][1], '');
	var listeParams = vue2Ddata[vueext][3];
	for(var i=0 ; i<listeParams.length ; i+=2)
		appendHidden(form, listeParams[i], listeParams[i+1]);
	appendSubmit(form, 'Voir',
		function() {
			document.getElementsByName(vue2Ddata[vueext][1])[0].value =
				vue2Ddata[vueext][2]();
			});
	}

function set2DViewSystem() {
	var vueext = MZ_getValue('VUEEXT');
	if(!vueext || !vue2Ddata[vueext]) vueext = 'Bricol\' Vue';
	
	/* Choix de la vue sans passer par les options */
	selectVue2D = document.createElement('select');
	selectVue2D.id = 'selectVue2D';
	selectVue2D.className = 'SelectboxV2';
	for(var view in vue2Ddata)
		appendOption(selectVue2D, view, view);
	selectVue2D.value = vueext;
	selectVue2D.onchange = refresh2DViewButton;
	
	var form = document.createElement('form');
	form.id = 'viewForm';
	
	var center = document.getElementById('titre2').nextSibling;
	var table = document.createElement('table');
	var tr = appendTr(table);
	var td = appendTd(tr);
	td.appendChild(selectVue2D);
	td = appendTd(tr);
	td.style = 'font-size:0px;';
	// gère la fameuse erreur de l'extra character
	td.appendChild(form);
	center.insertBefore(table,center.firstChild);
	insertBr(center.childNodes[1]);
	
	refresh2DViewButton();
	}

/* [functions] Boutons d'envoi d'infos aux bases */
function appendSendBouton(paren, url, id, func, text) {
	var myForm = document.createElement('form');
	myForm.method = 'post';
	myForm.align = 'right';
	myForm.action = url;
	myForm.name = 'frmvue';
	myForm.target = '_blank';
	appendHidden(myForm,id,'');
	appendSubmit(myForm,text,
		function() {document.getElementsByName(id)[0].value=func();}
		);
	paren.appendChild(myForm);
	}

function putMonstresBouton() {
	var tdTitle = document.getElementsByName('monstres')[0];
	if(!tdTitle) return;
	tdTitle = tdTitle.parentNode;
	
	var td = insertTd(tdTitle.nextSibling);
	td.setAttribute('style','font-size:0px'); // p***n d'extra character de m***e
	appendSendBouton(td,
		'http://mountyhall.clubs.resel.fr/script/v2/get_monstres.php',
		'listemonstres', getMonstres,
		'Ajouter les monstres à la base des Teubreux');
	}

function putLieuxBouton() {
	var tdTitle = document.getElementsByName('lieux')[0];
	if(!tdTitle) return;
	tdTitle = tdTitle.parentNode;
	
	var td = insertTd(tdTitle.nextSibling);
	td.setAttribute('style','font-size:0px');
	appendSendBouton(td,
				'http://mountyzilla.tilk.info/scripts/lieux.php',
				'listelieux', getLieux, 'Ajouter les lieux à la base');
	}

/* [functions] Boutons de filtrages (TableauInfos) */
function putFiltresBoutons() {
	/* creerTableauInfos() */
	var infoTab = document.getElementsByName('LimitViewForm')[0].childNodes[1];
	infoTab.id = 'infoTab';
	var thead = document.createElement('thead');
	var tr = appendTr(thead,'mh_tdtitre');
	var td = appendTdText(tr,'INFORMATIONS',true);
	td.colSpan = 3;
	td.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
		};
	td.onmouseout = function() {
		this.className = 'mh_tdtitre';
		};
	td.onclick = function() {
		toggleTableauInfos(false);
		};
	infoTab.childNodes[1].firstChild.childNodes[1].colSpan = 2;
	infoTab.replaceChild(thead,infoTab.firstChild);
	tr = appendTr(infoTab.childNodes[1],'mh_tdpage');
	td = appendTdText(tr,'EFFACER : ',true);
	td.align = 'center';
	td.className = 'mh_tdtitre';
	td.width = 100;
	td = appendTdCenter(tr,2);
	// DEBUG : à quoi servent les ids si on utilise des var globales ?
	checkBoxGG = appendCheckBoxSpan(
		td,'delgg',filtreTresors," Les GG'"
		).firstChild;
	checkBoxCompos = appendCheckBoxSpan(
		td,'delcomp',filtreTresors,' Les Compos'
		).firstChild;
	checkBoxBidouilles = appendCheckBoxSpan(
		td,'delbid',filtreTresors,' Les Bidouilles'
		).firstChild;
	checkBoxIntangibles = appendCheckBoxSpan(
		td,'delint',filtreTrolls,' Les Intangibles'
		).firstChild;
	checkBoxGowaps = appendCheckBoxSpan(
		td,'delgowap',filtreMonstres,' Les Gowaps'
		).firstChild;
	checkBoxEngages = appendCheckBoxSpan(
		td,'delengage',filtreMonstres,' Les Engagés'
		).firstChild;
	checkBoxLevels = appendCheckBoxSpan(
		td,'delniveau',toggleLevelColumn,' Les Niveaux'
		).firstChild;
	checkBoxDiplo = appendCheckBoxSpan(
		td,'deldiplo',refreshDiplo,' La Diplo'
		).firstChild;
	checkBoxTrou = appendCheckBoxSpan(
		td,'deltrou',filtreLieux,' Les Trous'
		).firstChild;
	checkBoxMythiques = appendCheckBoxSpan(
		td,'delmyth',filtreMonstres,' Les Mythiques'
		).firstChild;
	if(MZ_getValue('NOINFOEM')!='true') {
		checkBoxEM = appendCheckBoxSpan(
			td,'delem',filtreMonstres,' Les Composants EM'
			).firstChild;
		}
	checkBoxTresorsNonLibres = appendCheckBoxSpan(
		td,'deltres',filtreTresors,' Les Trésors non libres'
		).firstChild;
	checkBoxTactique = appendCheckBoxSpan(
		td,'deltactique',updateTactique,' Les Infos tactiques'
		).firstChild;
	
	if(MZ_getValue('INFOPLIE')) {
		toggleTableauInfos(true);
		}
	}

function toggleTableauInfos(firstRun) {
	if(cursorOnLink) return; // héritage Tilk, utilité inconnue ???
	
	var infoTab = document.getElementById('infoTab');
	if(!firstRun) {
		MZ_setValue('INFOPLIE', !MZ_getValue('INFOPLIE') );
		}
	if(MZ_getValue('INFOPLIE')) {
		var vues = getPorteVue();
		var pos = getPosition();
		appendText(
			infoTab.firstChild.firstChild.firstChild,
			' => Position : X = '+pos[0]+', Y = '+pos[1]+', N = '+pos[2]
			+' --- Vue : '+vues[0]+'/'+vues[1]+' ('+vues[2]+'/'+vues[3]+')',
			true
			);
		infoTab.childNodes[1].style.display = 'none';
		}
	else {
		var titre = infoTab.firstChild.firstChild.firstChild.childNodes[1];
		titre.parentNode.removeChild(titre);
		infoTab.childNodes[1].style.display = '';
		}
	}

function appendSearch(td,text,buttonValue,buttonOnClick) {
	var nobr = document.createElement('NOBR');
	var textbox = appendTextbox(nobr,'text',text,'12','20');
	appendText(nobr,"\u00a0");
	var button=appendButton(nobr,buttonValue,buttonOnClick);
	textbox.onkeypress =
		function(event){
			try {
				if(event.keyCode==13) {
					event.preventDefault();
					button.click();
					}
				}
			catch(e){window.alert(e)}
			};
	td.appendChild(nobr);
	appendText(td,"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 ");
	}

function appendComboSearch(td,text,comboName,comboOnChange) {
	var nobr = document.createElement('nobr');
	appendText(nobr,'\u00a0'+text);
	appendText(nobr,'\u00a0');
	var select = document.createElement('select');
	select.name = comboName;
	select.onchange = comboOnChange;
	var option = document.createElement('OPTION');
	option.value = 0;
	appendText(option,'Aucun');
	select.appendChild(option);
	for(var i=1;i<=50;i++) {
		option = document.createElement('OPTION');
		option.setAttribute("value",i);
		appendText(option,i);
		select.appendChild(option);
	}
	nobr.appendChild(select);
	td.appendChild(nobr);
	appendText(td,"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 ");
	return select;
}

function putSearchForms() {
	var tr = insertTr(mainTabs[0].childNodes[1].childNodes[1],'mh_tdpage');
	var td = appendTdText(tr,'RECHERCHER :',true);
	td.align = 'right';
	td = appendTdCenter(tr);
	td.colSpan = 2;
	appendSearch(td,'rec_monstre','Monstre',filtreMonstres);
	appendSearch(td,'rec_troll','Trõll',filtreTrolls);
	appendSearch(td,'rec_guilde','Guilde',filtreTrolls);
	appendSearch(td,'rec_tresor','Trésor',filtreTresors);
	appendSearch(td,'rec_lieu','Lieu',filtreLieux);
	tr = insertTr(mainTabs[0].childNodes[1].childNodes[1],'mh_tdpage');
	td = appendTdText(tr,'FILTRAGE MONSTRES :',true);
	td.align = 'right';
	td = appendTdCenter(tr);
	td.colSpan = 2;
	comboBoxNiveauMin = appendComboSearch(td,'Niveau min :','rec_niveau_monstre_min',filtreMonstres);
	comboBoxNiveauMax = appendComboSearch(td,'Niveau max :','rec_niveau_monstre_max',filtreMonstres);
	}

// SCRIPTS

function getPosition() {
	// DEBUG : et pourquoi c'est pas juste stocké en var globale... ?
	var pos = document.evaluate("//li/b/text()[contains(.,'X = ')]",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
	var posx = pos.substring(pos.indexOf('=') + 2, pos.indexOf(','));
	pos = pos.substr(pos.indexOf(',') + 1);
	return new Array(posx, pos.substring(pos.indexOf('=') + 2, pos.indexOf(',')), pos.substr(pos.lastIndexOf('=') + 2));
}

function getPorteVue() {
	// Retourne [vueHpure, vueVpure, vueHlimitée, vueVlimitée]
	// DEBUG : et pourquoi c'est pas juste stocké en var globale... ?
	var array = [];
	var infoTab = document.getElementById('infoTab');
	var nodes = document.evaluate(
		".//li/b/text()[contains(.,'horizontalement') "
		+"or contains(.,'verticalement')]",
		infoTab, null, 7, null);
	if(nodes.snapshotLength!=4) {
		return null;
		}
	for(var i=0 ; i<4 ; i++) {
		array.push(parseInt(nodes.snapshotItem(i).nodeValue));
		}
	return array;
	}

function getPositionStr(pos) {
	return pos[0]+';'+pos[1]+';'+pos[2];
	}

function getVue() {
	// Retourne [vueHpure, vueVpure]
	var vues = getPorteVue();
	return [ vues[0], vues[1] ];
	}

function appendMonstres(txt) {
	for(var i=1; i<=nbMonstres ; i++)
		txt += getMonstreID(i)+';'+getMonstreNom(i)+';'+getPositionStr(getMonstrePosition(i))+'\n';
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(getPositionStr(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function appendLieux(txt) {
	for(var i = 1; i < nbLieux+1; i++) {
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

function getVueScript() {
	try
	{
		txt = '#DEBUT TROLLS\n'+numTroll+';'+getPositionStr(getPosition())+'\n';
		for(var i=1; i <=nbTrolls ; i++) {
			txt += getTrollID(i)+';'+getPositionStr(getTrollPosition(i))+'\n';
			}
		txt = appendMonstres(txt+'#FIN TROLLS\n#DEBUT MONSTRES\n')+'#FIN MONSTRES\n#DEBUT TRESORS\n';
		for(var i=1 ; i<=nbTresors ; i++) {
			var tds = x_tresors[i].childNodes;
			txt += tds[1].firstChild.nodeValue+';'+getTresorNom(i)+';'+tds[3].firstChild.nodeValue+';'
				+tds[4].firstChild.nodeValue+';'+tds[5].firstChild.nodeValue+'\n';
			}
	    txt = appendLieux(txt+'#FIN TRESORS\n#DEBUT LIEUX\n')+'#FIN LIEUX\n#DEBUT CHAMPIGNONS\n';
	    for(var i=1 ; i <=nbChampis ; i++) {
			var tds = x_champis[i].childNodes;
			txt += ';'+tds[1].firstChild.nodeValue+';'+tds[2].firstChild.nodeValue+';'
				+tds[3].firstChild.nodeValue+';'+tds[4].firstChild.nodeValue+'\n';
			}
		return txt+'#FIN CHAMPIGNONS\n#DEBUT ORIGINE\n'+getVue()[0]+';'+getPositionStr(getPosition())+'\n#FIN ORIGINE\n';
	}
	catch(e) {window.alert(e)}
	}



/*-[functions]--------------- Systèmes Tactiques -----------------------------*/

function putScriptExterne() {
	var infoit = MZ_getValue(numTroll+'.INFOSIT');
	if(!infoit || infoit=='') return;
	
	var nomit = infoit.slice(0,infoit.indexOf('$'));
	if(nomit=='bricol') {
		var data = infoit.split('$');
		try {
			appendNewScript('http://trolls.ratibus.net/'+data[1]
				+'/mz.php?login='+data[2]
				+'&password='+data[3]
				);
			}
		catch(e) { window.alert(erreurIT(e,it)); }
		}
	}

function erreurIT( chaine , it ) {
	if(it=='bricol')
		window.alert(
			"Erreur lors de la connection avec l'interface des Bricol'Trolls :\n"
			+chaine
			);
	MZ_removeValue(numTroll+'.INFOSIT');
	}

/* Le script de Ratibus renvoie :
 + infosTrolls = new Array();
 + infosTrolls[numdutroll] =
 new Array(PV,PVbase,date màj: "le JJ/MM/AAAA à hh:mm:ss",date pDLA,PA dispos);
 + etc ...
 + putInfosTrolls();
 * 
 * Il est donc impossible d'afficher les invis d'une IT Bricol'Trolls.
 */

function corrigeBricolTrolls() {
	for(var i in infosTrolls) {
		var pv = infosTrolls[i][0];
		var pvmax = infosTrolls[i][1];
		var pvmem = MZ_getValue(i+'.caracs.pv.max');
		if(pvmem && pvmem>pvmax) {
			infosTrolls[i][1] = pvmem;
			pvmax = pvmem;
			}
		if(pv>pvmax) {
			var newpvmax = 5*Math.ceil(pv/5);
			MZ_setValue(i+'.caracs.pv.max',newpvmax);
			infosTrolls[i][1] = newpvmax;
			}
		}
	}

function putInfosTrolls() {
	// teste la présence de trõlls de l'IT
	var i=nbTrolls;
	while( i>0 && !infosTrolls[getTrollID(i)] ) i--;
	if(i==0) return;
	
	try
	{
	var td = insertTdText(tr_trolls[0].childNodes[6],'PA',true);
	td.width = 40;
	td = insertTdText(tr_trolls[0].childNodes[6],'PV',true);
	td.width = 105;
	
	corrigeBricolTrolls();
	
	for(i=nbTrolls ; i>0 ; i--) {
		var infos = infosTrolls[getTrollID(i)];
		if(infos) {
			/* PAs dipos */
			var span = document.createElement('span');
			span.title = infos[3];
			appendText(span, infos[4]+' PA' );
			insertTdElement(tr_trolls[i].childNodes[6], span);
			/* cadre barre PV */
			var tab = document.createElement('div');
			tab.width = 100;
			tab.style.background = '#FFFFFF';
			tab.style.width = 100;
			tab.style.border = 1;
			tab.height = 10;
			tab.title = infos[0]+'/'+infos[1]+' '+ infos[2];
			/* barre PV */
			var img = document.createElement('img');
			img.src = '../Images/Interface/milieu.gif';
			img.height = 10;
			img.width = Math.floor( (100*infos[0])/infos[1] );
			tab.appendChild(img);
			/* lien vers l'IT */
			var lien = document.createElement('a');
			var nomit = MZ_getValue(numTroll+'.INFOSIT').split('$')[1];
			lien.href = 'http://trolls.ratibus.net/'+nomit+'/index.php';
			lien.target = '_blank';
			lien.appendChild(tab);
			insertTdElement(tr_trolls[i].childNodes[6],lien);
			}
		else {
			insertTd(tr_trolls[i].childNodes[6]);
			insertTd(tr_trolls[i].childNodes[6]);
			}
		}
	}
	catch(e) {
		window.alert('Erreur troll='+i+'\n'+e+'\n'+tr_trolls[i].innerHTML);
		}
	}


/* [functions] Gros tas de fonctions à ranger */

// POPUP CDM

function getCDM(nom, id) {
	if(listeCDM[id]) {
		if(!document.getElementById("popupCDM" + id))
			afficherCDM(nom, id);
		else
			cacherPopupCDM("popupCDM" + id);
	}
}

function initPopup() {
	popup = document.createElement('div');
	popup.id = 'popup';
	popup.className = 'mh_textbox';
	popup.style =
		'position: absolute;'
		+'border: 1px solid #000000;'
		+'visibility: hidden;'
		+'display: inline;'
		+'z-index: 3;'
		+'max-width: 400px;';
	document.body.appendChild(popup);
	}

function showPopup(evt) {
	var texte = this.getAttribute('texteinfo');
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
	for(var i = 0; i < listeTags; i++) 
	{
		computeTypeTrolls(listeTags[i],listeTagsInfos[i]);
	}
	for(var i = 0; i < listeTagsGuilde; i++) 
	{
		computeTypeGuildes(listeTagsGuilde[i],listeTagsInfosGuilde[i]);
	}
}

function setAllTags(infoTrolls,infoGuildes)
{
	for(var i = 1; i < nbTrolls+1; i++) 
	{
		var infos = infoGuildes[getTrollGuildeID(i)];
		if(infos) 
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
		if(infos) 
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
			window.alert(e);
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
	if(MZ_getValue(numTroll+'.TAGSURL')==null || MZ_getValue(numTroll+'.TAGSURL')=='')
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
						window.alert(e);
					}
				}
			});
		}
	}
	}
	catch(e) {window.alert(e);}
}

function computeTelek()
{
	if(getSortComp("Télékinésie")==0)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/Sorts/telekinesie.png";
	var trolln = getPosition()[2];
	for(var i = nbTresors+1; --i >= 1;) {
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
	if(!computeChargeProjoMonstre()) return false;
	
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
	for(var i = 1; i < nbTrolls+1; i++) 
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
	for(var i = nbMonstres+1; --i >= 1;) 
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

function computeVLC(begin,end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeMission
	computeTactique(begin,end);
	if(!begin) begin=1;
	if(!end) end=nbMonstres;
	var cache = getSortComp("Invisibilité")>0 || getSortComp("Camouflage")>0;
	if(!cache)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/oeil.png";
	for(var i = end; i >= begin;i--)
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


function computeMission(begin,end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance
	computeVLC(begin,end);
	if(!begin) begin=1;
	if(!end) end=nbMonstres;
	if(!MZ_getValue(numTroll+'.MISSION') || MZ_getValue(numTroll+'.MISSION')=='') return false;
	
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/mission.png';
	var infosMission = MZ_getValue(numTroll+'.MISSION').split('$');
	for(var i=end ; i>=begin ; i--) {
		var id = getMonstreID(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(infosMission[0]=='R') { // Si étape Race
			if(epure(nom).indexOf(epure(infosMission[2].toLowerCase()))!=-1) {
				var tr = tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
				tr.appendChild(document.createTextNode(' '));
				tr.appendChild(createImage(urlImg,infosMission[4]));
				}
			}
		else if(infosMission[0]=='N') { // Si étape Niveau
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre) {
				var niveau = parseInt(infosMission[2]);
				var mod = infosMission[3];
				if(parseInt(mod) && Math.abs(parseInt(donneesMonstre[0])-niveau)<=parseInt(mod)
					|| mod=='plus' && donneesMonstre[0]>=niveau) {
					var tr = tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(' '));
					tr.appendChild(createImage(urlImg, infosMission[5]));
					}
				}
			}
		else if(infosMission[0]=='F') { // Si étape Famille
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre) {
				if(epure(donneesMonstre[1]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase()))!=-1) {
					var tr = tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(' '));
					tr.appendChild(createImage(urlImg, infosMission[4]));
					}
				}
			}
		else if(infosMission[0]=='E') { // Si étape 'sous l'effet d'une capa'
			var donneesMonstre = listeCDM[id];
			if(donneesMonstre) {
				if(epure(donneesMonstre[10]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase())+' =>')!=-1) {
					var tr = tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3];
					tr.appendChild(document.createTextNode(' '));
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

	if(winCurr == null)
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


/*                             Partie principale                              */

try
{
start_script(31);
	

putFiltresBoutons();
putSearchForms();
putExternalLinks();
set2DViewSystem();
putLieuxBouton();
putMonstresBouton();
putBoutonPXMP();


//800 ms
synchroniseFiltres();
toggleLevelColumn();
savePosition();

//400 ms
{
	var noGG = saveCheckBox(checkBoxGG, "NOGG");
	var noCompos = saveCheckBox(checkBoxCompos, "NOCOMP");
	var noBidouilles = saveCheckBox(checkBoxBidouilles, "NOBID");
	var noGowaps = saveCheckBox(checkBoxGowaps, "NOGOWAP");
	var noMythiques = saveCheckBox(checkBoxMythiques, "NOMYTH");
	var noEngages = saveCheckBox(checkBoxEngages, "NOENGAGE");
	var noTresorsEngages =
		saveCheckBox(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	var noTrou = saveCheckBox(checkBoxTrou, "NOTROU");
	var noIntangibles = saveCheckBox(checkBoxIntangibles, "NOINT");
	filtreMonstres();
	if(noIntangibles) filtreTrolls();
	if(noGG || noCompos || noBidouilles || noTresorsEngages) filtreTresors();
	if(noTrou) filtreLieux();
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
window.alert(e);
}
