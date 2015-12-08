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

/*--------------------------- Variables Globales -----------------------------*/

// Infos remplies par des scripts extérieurs
var listeCDM = [], listeLevels = [];

// Position actuelle
var currentPosition=[0,0,0];

// Portées de la vue : [vueHpure, vueVpure, vueHlimitée, vueVlimitée]
var porteeVue=[0,0,0,0];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.onmousemove = drag;

// Diplomatie
var Diplo = {
	Guilde: {},
	Troll: {},
	Monstre: {}
	// .mythiques: uniquement si option activée
};
var isDiploRaw = true; // = si la Diplo n'a pas encore été analysée

// Infos tactiques
var popup;

// Gère l'affichage en cascade des popups de CdM
var nbCDM = 0;

var isCDMsRetrieved = false; // = si les CdM ont déjà été DL

// Utilisé pour supprimer les monstres "engagés"
var listeEngages = {};
var isEngagesComputed = false;
var cursorOnLink = false; // DEBUG: wtf ?

var needComputeEnchantement = MZ_getValue(numTroll+'.enchantement.liste')
	&& MZ_getValue(numTroll+'.enchantement.liste')!='';

// Checkboxes de filtrage
var checkBoxGG, checkBoxCompos, checkBoxBidouilles, checkBoxIntangibles,
	checkBoxDiplo, checkBoxTrou, checkBoxEM, checkBoxTresorsNonLibres,
	checkBoxTactique, checkBoxLevels, checkBoxGowaps, checkBoxEngages,
	comboBoxNiveauMin, comboBoxNiveauMax;

/* Acquisition & Stockage des données de DB */
const typesAFetcher = {
	'monstres':1,
	'trolls':1,
	'tresors':1,
	'champignons':1,
	'lieux':1
}
var tr_monstres = {}, tr_trolls = {}, tr_tresors = {},
	tr_champignons = {}, tr_lieux = {};
var nbMonstres = 0, nbTrolls = 0, nbTresors = 0,
	nbChampignons = 0, nbLieux = 0;

function fetchData(type) {
	try {
		var node = document.getElementById('mh_vue_hidden_'+type);
		// this = MZ.global = sandBox de travail de MZ
		// On définit donc des variables MZ-globales
		this['tr_'+type] = node.getElementsByTagName('tr');
		this['nb'+type[0].toUpperCase()+type.slice(1)] = this['tr_'+type].length-1;
	} catch(e) {
		window.console.warn('[MZ Vue] Erreur acquisition type '+type+'\n'+e);
	}
}

for(var type in typesAFetcher) {
	fetchData(type);
}

/*---------------------------------- DEBUG -----------------------------------*/
var mainTabs = document.getElementsByClassName('mh_tdborder');
var x_monstres = tr_monstres;
var x_trolls = tr_trolls;
var x_tresors = tr_tresors;
var x_champis = tr_champignons;
var x_lieux = tr_lieux;
/*-------------------------------- FIN DEBUG ---------------------------------*/


/*-[functions]-------------- Fonctions utilitaires ---------------------------*/

function positionToString(arr) {
	return arr.join(';');
}

function getPortee(param) {
	return Math.ceil((Math.sqrt(19 + 8 * (param + 3)) - 7) / 2);
}

function savePosition() {
	// Stocke la position (à jour) de la vue pour les autres scripts
	// DEBUG: Lesquels et pourquoi?
	var pos = getPosition();
	MZ_setValue(numTroll+'.position.X',pos[0]);
	MZ_setValue(numTroll+'.position.Y',pos[1]);
	MZ_setValue(numTroll+'.position.N',pos[2]);
}


/*-[functions]--- Fonctions de récupération de données (DOM) -----------------*/
/* INFOS :
 * les champs-titres (table>tbody>tr>td>table>tbody>tr>td>a)
 * sont identifiables via leur Name
 * les tables-listings sont identifiables via l'ID du tr conteneur
 * (mh_vue_hidden_XXX, XXX=trolls, champignons, etc)
 */

/* [functions] Récup données Utilisateur */
function getPosition() {
	// Pour rétrocompatibilité
	return currentPosition;
}

function getPorteVue() {
	// Pour rétrocompatibilité
	return porteeVue;
}

function getVue() {
	// Retourne [vueHpure, vueVpure]
	var vues = getPorteVue();
	return [ vues[0], vues[1] ];
	}

/* [functions] Récup données monstres */
function getMonstreDistance(i) {
	return parseInt(tr_monstres[i].cells[0].textContent);
}

function getMonstreID(i) {
	return tr_monstres[i].cells[2].firstChild.nodeValue;
}

function getMonstreIDByTR(tr) {
	return tr.cells[2].firstChild.nodeValue;
}

function getMonstreLevelNode(i) {
	return tr_monstres[i].cells[3];
}

function getMonstreLevel(i) {
	if(!isCDMsRetrieved) return -1;
	var donneesMonstre = listeCDM[getMonstreID(i)];
	return donneesMonstre ? parseInt(donneesMonstre[0]) : -1;
}

function getMonstreNomNode(i) {
	try {
		var td = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/..",
			tr_monstres[i], null, 9, null
		).singleNodeValue;
		return td;
	} catch(e) {
		avertissement('[getMonstreNomNode] Impossible de trouver le monstre '+i);
		window.console.error(e);
	}
}

function getMonstreNom(i) {
	return getMonstreNomByTR(tr_monstres[i]);
}

function getMonstreNomByTR(tr) {
	try {
		var nom = document.evaluate(
			"./td/a[starts-with(@href, 'javascript:EMV')]/text()",
			tr, null, 2, null
		).stringValue;
		return nom;
	} catch(e) {
		avertissement('[getMonstreNom] Impossible de trouver le monstre '+i);
		window.console.error(e);
	}
}

function getMonstrePosition(i) {
	var tds = tr_monstres[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function appendMonstres(txt) {
	for(var i=1; i<=nbMonstres ; i++)
		txt += getMonstreID(i)+';'+getMonstreNom(i)+';'+positionToString(getMonstrePosition(i))+'\n';
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddMonstres(start,stop) {
	if(!start) { var start = 1; }
	if(!stop) { var stop = nbMonstres; }
	stop = Math.min(nbMonstres,stop);
	var txt='';
	for(var i=start ; i<=stop ; i++) {
		txt += getMonstreID(i)+';'+
			getMonstreNom(i)+';'+
			positionToString(getMonstrePosition(i))+'\n';
	}
	return txt ? '#DEBUT MONSTRES\n'+txt+'#FIN MONSTRES\n' : '';
}

/* [functions] Récup données Trolls */
function getTrollDistance(i) {
	return parseInt(tr_trolls[i].cells[0].textContent);
}

function getTrollID(i) {
	return parseInt(tr_trolls[i].cells[2].textContent);
}

function getTrollNomNode(i) {
	var isEnvoiOn =
		document.getElementById('btnEnvoi').parentNode.childNodes.length>1;
	return tr_trolls[i].cells[ isEnvoiOn ? 4 : 3 ];
}

function getTrollNivNode(i) {
	// Pas de test sur isEnvoiOn, n'est appelé qu'au pageload
	return tr_trolls[i].cells[4];
}

function getTrollGuilde(i) {
	return trim(tr_trolls[i].cells[6].textContent);
}

function getTrollGuildeID(i) {
	if(tr_trolls[i].childNodes[6].childNodes.length>0) {
		var href = tr_trolls[i].childNodes[6].firstChild.getAttribute('href');
		return href.substring(href.indexOf('(')+1,href.indexOf(','));
	}
	return -1;
}

function getTrollPosition(i) {
	var tds = tr_trolls[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function bddTrolls() {
	var txt='#DEBUT TROLLS\n'+
		numTroll+';'+positionToString(getPosition())+'\n';
	for(var i=1 ; i<=nbTrolls ; i++) {
		txt += getTrollID(i)+';'+
			positionToString(getTrollPosition(i))+'\n';
	}
	return txt+'#FIN TROLLS';
}

/* [functions] Récup données Trésors */
function getTresorDistance(i) {
	return tr_tresors[i].cells[0].firstChild.nodeValue;
}

function getTresorID(i) {
	return trim(tr_tresors[i].cells[2].textContent);
}

function getTresorNom(i) {
	// Utilisation de textContent pour régler le "bug de Pollux"
	return trim(tr_tresors[i].cells[3].textContent);
}

function getTresorPosition(i) {
	var tds = tr_tresors[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent),
	];
}

function bddTresors(dmin,start,stop) {
// On retire les trésors proches (dmin) pour Troogle à cause de leur description
	if(!dmin) { var dmin = 0; }
	if(!start) { var start = 1; }
	if(!stop) { var stop = nbTresors; }
	stop = Math.min(nbTresors,stop);
	var txt='';
	for(var i=start ; i<=stop ; i++) {
		if(getTresorDistance(i)>=dmin) {
			txt += getTresorID(i)+';'+
				getTresorNom(i)+';'+
				positionToString(getTresorPosition(i))+'\n';
		}
	}
	return txt ? '#DEBUT TRESORS\n'+txt+'#FIN TRESORS\n' : '';
}

/* [functions] Récup données Champignons */
// DEBUG: Pas de colonne "Référence" sur serveur de test
function getChampignonNom(i) {
	return trim(tr_champignons[i].cells[2].textContent);
}

function getChampignonPosition(i) {
	var tds = tr_champignons[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
}

function bddChampignons() {
	var txt='';
	for(var i=1 ; i<=nbChampignons ; i++) {
		txt += ';'+ // Les champis n'ont pas de Référence
			getChampignonNom(i)+';'+
			positionToString(getChampignonPosition(i))+'\n';
	}
	return txt ? '#DEBUT CHAMPIGNONS\n'+txt+'#FIN CHAMPIGNONS\n' : '';
}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return parseInt(tr_lieux[i].cells[0].textContent);
}

function getLieuID(i) {
	return parseInt(tr_lieux[i].cells[2].textContent);
}

function getLieuNom(i) {
	// Conversion ASCII pour éviter les bugs des Vues externes
	return trim(tr_lieux[i].cells[3].textContent);
}

function getLieuPosition(i) {
	var tds = tr_lieux[i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
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
	return appendLieux(positionToString(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

function bddLieux(start,stop) {
	if(!start) { var start = 1; }
	if(!stop) { var stop = nbLieux; }
	stop = Math.min(nbLieux,stop);
	var txt='';
	for(var i=start ; i<=stop ; i++) {
		txt += getLieuID(i)+';'+
			epure(getLieuNom(i))+';'+
			positionToString(getLieuPosition(i))+'\n';
	}
	return txt ? '#DEBUT LIEUX\n'+txt+'#FIN LIEUX\n' : '';
}


/*-[functions]--------- Gestion Préférences Utilisateur ----------------------*/

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
	var nb = MZ_getValue(pref);
	if(nb) cbb.value = nb;
	return nb;
	}

function synchroniseFiltres() {
	// Récupération de toutes les options de la vue
	var numBool = recallComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE');
	numBool = recallComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE') || numBool;
	if(numBool) {
		debutFiltrage('Monstres');
	}
	recallCheckBox(checkBoxGowaps,'NOGOWAP');
	recallCheckBox(checkBoxMythiques,'NOMYTH');
	recallCheckBox(checkBoxEngages,'NOENGAGE');
	recallCheckBox(checkBoxLevels,'NOLEVEL');
	recallCheckBox(checkBoxIntangibles,'NOINT');
	recallCheckBox(checkBoxGG,'NOGG');
	recallCheckBox(checkBoxCompos,'NOCOMP');
	recallCheckBox(checkBoxBidouilles,'NOBID');
	recallCheckBox(checkBoxDiplo,numTroll+'.diplo.off');
	recallCheckBox(checkBoxTrou,'NOTROU');
	recallCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	recallCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(MZ_getValue('NOINFOEM')!='true')
		recallCheckBox(checkBoxEM,'NOEM');
}


/*-[functions]-------- Initialisation: Ajout des Boutons ---------------------*/

/* [functions] Menu Vue 2D */
var vue2Ddata = {
	'Bricol\' Vue': {
		url: 'http://trolls.ratibus.net/mountyhall/vue_form.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'mode': 'vue_SP_Vue2',
			'screen_width': window.screen.width
		}
	},
	'Vue du CCM': {
		url: 'http://clancentremonde.free.fr/Vue2/RecupVue.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'id': numTroll+';'+positionToString(getPosition())
		}
	},
	'Vue Gloumfs 2D': {
		url: 'http://gloumf.free.fr/vue2d.php',
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Vue Gloumfs 3D': {
		url: 'http://gloumf.free.fr/vue3d.php',
		paramid: 'vue_mountyzilla',
		func: getVueScript,
		extra_params: {}
	},
	'Grouky Vue!': {
		url: 'http://mh.ythogtha.org/grouky.py/grouky',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {
			'type_vue': 'V5b1'
		}
	},
	/*'DEBUG': {
		url: 'http://weblocal/testeur.php',
		paramid: 'vue',
		func: getVueScript,
		extra_params: {}
	}*/
};

function getVueScript() {
	try {
		var txt = bddTrolls()+
			bddMonstres()+
			bddChampignons()+
			bddTresors()+
			bddLieux()+
			'#DEBUT ORIGINE\n'+
			getPorteVue()[2]+';'+positionToString(getPosition())+
			'\n#FIN ORIGINE\n';
		return txt;
	} catch(e) {
		avertissement("[getVueScript] Erreur d'export vers Vue externe");
		window.console.error('[MZ getVueScript]\n',e)
	}
}

function refresh2DViewButton() {
	// = EventListener menu+bouton vue 2D
	var vueext = document.getElementById('selectVue2D').value;
	MZ_setValue('VUEEXT',vueext);
	var form = document.getElementById('viewForm');
	form.innerHTML = '';
	form.method = 'post';
	form.action = vue2Ddata[vueext].url;
	form.target = '_blank';
	appendHidden(form, vue2Ddata[vueext].paramid, '');
	for(var key in vue2Ddata[vueext].extra_params) {
		appendHidden(form, key, vue2Ddata[vueext].extra_params[key]);
	}
	appendSubmit(form, 'Voir',
		function() {
			document.getElementsByName(vue2Ddata[vueext].paramid)[0].value =
				vue2Ddata[vueext].func();
		}
	);
}

function set2DViewSystem() {
// Initialise le système de vue 2D
	// Recherche du point d'insertion
	try {
		var center = document.evaluate(
			"//h2[@id='titre2']/following-sibling::center",
			document, null, 9, null
		).singleNodeValue;
	} catch(e) {
		avertissement("Erreur d'initialisation du système de vue 2D");
		window.console.error("[MZ] set2DViewSystem",e);
		return;
	}
	
	// Récupération de la dernière vue utilisée
	var vueext = MZ_getValue('VUEEXT');
	if(!vueext || !vue2Ddata[vueext]) {
		// sinon, la vue Bricol'Trolls est employée par défaut
		vueext = 'Bricol\' Vue';
	}
	
	// Création du sélecteur de vue externe
	selectVue2D = document.createElement('select');
	selectVue2D.id = 'selectVue2D';
	selectVue2D.className = 'SelectboxV2';
	for(var view in vue2Ddata) {
		appendOption(selectVue2D, view, view);
	}
	selectVue2D.value = vueext;
	selectVue2D.onchange = refresh2DViewButton;
	
	// Création du formulaire d'envoi (vide, le submit est géré via handler)
	var form = document.createElement('form');
	form.id = 'viewForm';
	
	// Insertion du système de vue
	var table = document.createElement('table');
	var tr = appendTr(table);
	var td = appendTd(tr);
	td.appendChild(selectVue2D);
	td = appendTd(tr);
	td.style.fontSize = '0px'; // gère le bug de l'extra character
	td.appendChild(form);
	center.insertBefore(table,center.firstChild);
	insertBr(center.childNodes[1]);
	
	// Appelle le handler pour initialiser le bouton de submit
	refresh2DViewButton();
}

/* [functions] Tableau d'Infos */
function initialiseInfos() {
	// DEBUG: prévoir désactivation complète du script si infoTab non trouvé
	var
		infoTab = document.getElementsByName('LimitViewForm')[0].
			getElementsByTagName('table')[0],
		tbody = infoTab.tBodies[0],
		thead = infoTab.createTHead(),
		tr = appendTr(thead,'mh_tdtitre'),
		td = appendTdText(tr,'INFORMATIONS',true),
		span = document.createElement('span');
	
	// Récupération de la position du joueur
	try {
		var strPos = document.evaluate(
				".//li/b/text()[contains(.,'X = ')]",
				infoTab, null, 9, null
			).singleNodeValue.nodeValue;
		// ***INIT GLOBALE*** currentPosition
		currentPosition = getNumbers(strPos);
		debugMZ("retrievePosition(): "+currentPosition);
	} catch(e) {
		// Si on ne trouve pas le "X ="
		window.console.error("[MZ Vue] Position joueur non trouvée",e);
	}
	
	// Récupération des portées (max et limitée) de la vue
	try {
		var	
			nodes = document.evaluate(
				".//li/b/text()[contains(.,'horizontalement') "+
				"or contains(.,'verticalement')]",
				infoTab, null, 7, null
			),
			array = [];
		for(var i=0 ; i<4 ; i++) {
			array.push(parseInt(nodes.snapshotItem(i).nodeValue));
		}
		// ***INIT GLOBALE*** porteeVue
		porteeVue = array;
	} catch(e) {
		window.console.error("[MZ Vue] Portées Vue non trouvées",e);
	}

	infoTab.id = 'infoTab'; // Pour scripts externes
	tbody.id = 'corpsInfoTab';
	tbody.rows[0].cells[0].colSpan = 2;
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
	
	span.id = 'msgInfoTab';
	span.style.display = 'none';
	appendText(
		span,
		' => Position : X = '+currentPosition[0]+
		', Y = '+currentPosition[1]+
		', N = '+currentPosition[2]+
		' --- Vue : '+porteeVue[0]+'/'+porteeVue[1]+
		' ('+porteeVue[2]+'/'+porteeVue[3]+')',
		true
	);
	td.appendChild(span);
	
	tr = appendTr(tbody,'mh_tdpage');
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
		td,'delDiplo',refreshDiplo,' La Diplomatie'
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
	var
		msg = document.getElementById('msgInfoTab'),
		corps = document.getElementById('corpsInfoTab');
	if(!firstRun) {
		MZ_setValue('INFOPLIE', !MZ_getValue('INFOPLIE') );
	}
	if(MZ_getValue('INFOPLIE')) {
		msg.style.display = '';
		corps.style.display = 'none';
	} else {
		msg.style.display = 'none';
		corps.style.display = '';
	}
}

/* [functions] Filtres */
function prepareFiltrage(ref,width) {
// = Initialise le filtre 'ref'
	try {
		var tdTitre = document.getElementsByName(ref.toLowerCase())[0].parentNode;
	} catch(e) {
		window.console.warn('[prepareFiltrage] Référence filtrage '+ref+' non trouvée\n'+e);
		return false;
	}
	if(width) { tdTitre.width = width; }
	// Ajout du tr de Filtrage (masqué)
	var tbody = tdTitre.parentNode.parentNode;
	var tr = appendTr(tbody,'mh_tdpage');
	tr.style.display = 'none';
	tr.id = 'trFiltre'+ref;
	var td = appendTd(tr);
	td.colSpan = 5;
	// Ajout du bouton de gestion de Filtrage
	var tdBtn = insertTd(tdTitre.nextSibling);
	tdBtn.id = 'tdInsert'+ref;
	var btn = appendButton(tdBtn,'Filtrer');
	btn.id = 'btnFiltre'+ref;
	btn.onclick =	function() {
		debutFiltrage(ref)
	};
	return td;
}

function debutFiltrage(ref) {
	// = Handler de début de filtrage (filtre 'ref')
	document.getElementById('trFiltre'+ref).style.display = '';
	var btn = document.getElementById('btnFiltre'+ref);
	btn.value = 'Annuler Filtre';
	btn.onclick = function() {
		finFiltrage(ref);
	};
}

function finFiltrage(ref) {
// = Handler de fin de filtrage (filtre 'ref')
	/* On réassigne le bouton 'Filtrer' */
	document.getElementById('trFiltre'+ref).style.display = 'none';
	var btn = document.getElementById('btnFiltre'+ref);
	btn.value = 'Filtrer';
	btn.onclick = function() {
		debutFiltrage(ref);
	};
	/* Réinitialisation filtres */
	document.getElementById('str'+ref).value = '';
	switch(ref) {
		case 'Monstres':
			document.getElementById('nivMinMonstres').value = 0;
			document.getElementById('nivMaxMonstres').value = 0;
			break;
		case 'Trolls':
			document.getElementById('strGuildes').value = '';
	}
	/* Nettoyage (=lance le filtre) */
	// Ici this = MZ.global = sandBox de travail de MZ
	this['filtre'+ref]();
}

function ajoutFiltreStr(td,nomBouton,id,onClick) {
	var bouton = appendButton(td,nomBouton,onClick);
	appendText(td,'\u00a0');
	var textbox = appendTextbox(td,'text',id,15,30);
	textbox.onkeypress = function(event) {
		try {
			if(event.keyCode==13) {
				event.preventDefault();
				bouton.click();
			}
		}
		catch(e){
			window.alert(e)
		}
	};
}

function ajoutFiltreMenu(tr,id,onChange) {
	var select = document.createElement('select');
	select.id = id;
	select.onchange = onChange;
	appendOption(select,0,'Aucun');
	for(var i=1 ; i<=60 ; i++) {
		appendOption(select,i,i);
	}
	tr.appendChild(select);
	return select;
}

function ajoutDesFiltres() {
	/* Monstres */
	var td = prepareFiltrage('Monstres',120);
	if(td) {
		ajoutFiltreStr(td,'Nom du monstre:','strMonstres',filtreMonstres);
		appendText(td,'\u00a0\u00a0\u00a0');
		appendText(td,'Niveau Min: ');
		comboBoxNiveauMin = ajoutFiltreMenu(td,'nivMinMonstres',filtreMonstres);
		appendText(td,'\u00a0');
		appendText(td,'Niveau Max: ');
		comboBoxNiveauMax = ajoutFiltreMenu(td,'nivMaxMonstres',filtreMonstres);
	}
	/* Trõlls */
	td = prepareFiltrage('Trolls',50);
	if(td) {
		ajoutFiltreStr(td,'Nom du trõll:','strTrolls',filtreTrolls);
		appendText(td,'\u00a0\u00a0\u00a0');
		ajoutFiltreStr(td,'Nom de guilde:','strGuildes',filtreTrolls);
	}
	/* Trésors */
	td = prepareFiltrage('Tresors',55);
	if(td) {
		ajoutFiltreStr(td,'Nom du trésor:','strTresors',filtreTresors);
	}
	/* Lieux */
	td = prepareFiltrage('Lieux',40);
	if(td) {
		ajoutFiltreStr(td,'Nom du lieu:','strLieux',filtreLieux);
	}
}

/* [functions] Bouton d'envoi vers Troogle */
// WARNING - Nécessite que le Filtre Monstres ait été mis en place
function envoiVersTroogle() {
// = 1er Handler bouton Troogle
	try {
		var bouton = document.getElementById('bouton_Troogle');
	} catch(e) {
		window.console.log('Bouton d\'envoi non trouvé.');
		return;
	}
	bouton.onclick = lireInfosTroogle;
	bouton.value = 'Envoi en cours';
	var responses = {}, erreur = false;
	var maxDonnees = Math.max(
		nbMonstres,
		nbTresors,
		nbLieux
	);
	var parLot = 100;
	var lotStop = Math.ceil(maxDonnees/parLot);
	for(var i=0 ; i<lotStop ; i++) {
		var debutLot = parLot*i+1;
		var finLot = parLot*(i+1);
		var data = //'#'+numTroll+
			bddMonstres(debutLot,finLot)+'\n'+
			bddTresors(1,debutLot,finLot)+'\n'+
			bddLieux(debutLot,finLot);
		FF_XMLHttpRequest({
			method: 'POST',
			url: 'http://troogle-beta.aacg.be/view_submission',
			//url: 'http://weblocal/POST_RESULT/index.php',
			headers : {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			data: 'view='+encodeURIComponent(data), //+'&from='+debutLot,
			lot: i,
			debutLot: debutLot,
			finLot: finLot,
			onload:	function(responseDetails) {
				try {
					var resp = responseDetails.responseText;
					responses[this.lot] = 'Envoi des éléments '+this.debutLot+
						' à '+Math.min(maxDonnees,this.finLot)+' :\n'+resp;
					if(resp.indexOf('succès')==-1) {
						erreur = true;
					}
				} catch(e) {
					console.error(e);
					return;
				}
				var txt = '';
				var fini = true;
				for(var j=0 ; j<lotStop ; j++) {
					if(responses[j]) {
						txt += txt ? '\n'+responses[j] : responses[j];
					} else {
						fini = false;
					}
				}
				bouton.info = txt;
				if(fini) {
					bouton.value = erreur ? 'Erreur' : 'Envoi réussi';
				}
			}
		});
	}
}

function lireInfosTroogle() {
// = 2e Handler bouton Troogle
	try {
		var infos = document.getElementById('bouton_Troogle').info;
	} catch(e) {
		avertissement('[lireInfosTroogle] Bouton Troogle non trouvé');
		window.console.error('[lireInfosTroogle]\n'+e);
		return;
	}
	window.alert(infos);
}

function putBoutonTroogle() {
	var td = document.getElementById('tdInsertMonstres');
	td = insertTd(td.nextSibling);
	td.style.fontSize = '0px';
	var bouton = document.createElement('input');
	bouton.type = 'button';
	bouton.id = 'bouton_Troogle';
	bouton.className = 'mh_form_submit';
	bouton.value = 'Envoyer les données vers Troogle';
	bouton.onmouseover = function(){
		this.style.cursor='pointer';
	};
	bouton.onclick = envoiVersTroogle;
	td.appendChild(bouton);
}


/*-[functions]--------------- Fonctions Monstres -----------------------------*/

/* [functions] Affichage de la colonne des niveaux */
function insertLevelColumn() {
// Déclenché si bascule vers affichage des niveaux des mobs
	var td = insertTdText(getMonstreLevelNode(0),'Niveau',true);
	td.width = 25;
	for(var i=1 ; i<=nbMonstres ; i++) {
		td = insertTdText(getMonstreLevelNode(i), '-');
		td.onclick = function() {
			basculeCDM(
				getMonstreNomByTR(this.parentNode),
				getMonstreIDByTR(this.parentNode)
			);
		};
		td.onmouseover = function() {
			this.style.cursor = 'pointer';
			this.className = 'mh_tdtitre';
		};
		td.onmouseout = function() {
			if(this.parentNode.diploActive=='oui') {
				this.className = '';
			} else {
				this.className = 'mh_tdpage';
			}
		};
		td.style = 'font-weight:bold;text-align:center;';
		if(isCDMsRetrieved) {
			// Rappel des niveaux si mémorisés
			td.innerHTML = listeLevels[i];
		}
	}
}

function toggleLevelColumn() {
// = Handler checkBox noLevel
	if(!saveCheckBox(checkBoxLevels,'NOLEVEL')) {
		insertLevelColumn();
		if(!isCDMsRetrieved) { retrieveCDMs(); }
	} else if(getMonstreLevelNode(0).textContent=='Niveau') {
		for(var i=0 ; i<=nbMonstres ; i++) {
			if(isCDMsRetrieved) {
				// Mémorisation des niveaux pour rappel éventuel
				listeLevels[i] = getMonstreLevelNode(i).innerHTML;
			}
			// Suppression du td Niveau
			tr_monstres[i].removeChild(getMonstreLevelNode(i));
		}
	}
}

/* [functions] Gestion de l'AFFICHAGE des CdMs */
function basculeCDM(nom,id) {
// = Bascule l'affichage des popups CdM
	if(listeCDM[id]) {
		if(!document.getElementById('popupCDM'+id)) {
			afficherCDM(nom, id);
		} else {
			cacherPopupCDM('popupCDM'+id);
		}
	}
	// DEBUG: prévoir un "else" ou désactiver l'effet onmouseover si pas de CdM
}

function cacherPopupCDM(titre) {
	var popup = document.getElementById(titre);
	popup.parentNode.removeChild(popup);
}

/* DEBUG: Section à mettre à jour */
var selectionFunction;

function startDrag(evt) {
	winCurr = this.parentNode;
	evt = evt || window.event; // est-ce utile sous FF ? sous FF24+ ?
	offsetX = evt.pageX - parseInt( winCurr.style.left );
	offsetY = evt.pageY - parseInt( winCurr.style.top );
	selectionFunction = document.body.style.MozUserSelect;
	document.body.style.MozUserSelect = 'none';
	winCurr.style.MozUserSelect = 'none';
	return false;
}

function stopDrag(evt) {
	winCurr.style.MozUserSelect = selectionFunction;
	document.body.style.MozUserSelect = selectionFunction;
	winCurr = null;
}

function drag(evt) {
	if(winCurr==null) { return; }
	evt = evt || window.event;
	winCurr.style.left = (evt.pageX - offsetX)+'px';
	winCurr.style.top = (evt.pageY - offsetY)+'px';
	return false;
}
/* FIN DEBUG */

function afficherCDM(nom,id) {
// Crée la table de CdM du mob n° id
	var donneesMonstre = listeCDM[id];
	/* Début création table */
	var table = createCDMTable(id,nom,donneesMonstre); // voir Libs
	table.id = 'popupCDM'+id;
	table.style =
		'position:fixed;'+
		'z-index:1;'+
		'top:'+(300+(30*nbCDM))%(30*Math.floor((window.innerHeight-400)/30))+'px;'+
		'left:'+(window.innerWidth-365)+'px;'+
		'width:300px;'+
		'height:200px;';
	/* Ajout du titre avec gestion Drag & Drop */
	var tr = table.firstChild;
	tr.style.cursor = 'move';
	tr.onmousedown = startDrag;
	tr.onmouseup = stopDrag;
	/* Ajout du bouton "Fermer" */
	tr = appendTr(table.childNodes[1], 'mh_tdtitre');
	tr.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
	};
	tr.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	tr.idcdm = id;
	tr.onclick = function() {
		cacherPopupCDM('popupCDM'+this.idcdm);
		this.className = 'mh_tdtitre';
	};
	td = appendTdText(tr,'Fermer',true);
	td.colSpan = 2;
	td.style = 'text-align:center;';
	nbCDM++;
	/* Fin création table & Affichage */
	document.body.appendChild(table);
}

/* [functions] Gestion de l'AFFICHAGE des Infos de combat */
function initPopup() {
	popup = document.createElement('div');
	popup.id = 'popup';
	popup.className = 'mh_textbox';
	popup.style =
		'position: absolute;'+
		'border: 1px solid #000000;'+
		'visibility: hidden;'+
		'display: inline;'+
		'z-index: 3;'+
		'max-width: 400px;';
	document.body.appendChild(popup);
}

function showPopupTactique(evt) {
	var id = this.id;
	var nom = this.nom;
	var texte = getAnalyseTactique(id,nom);
	if(texte=='') { return; }
	popup.innerHTML = texte;
	popup.style.left = Math.min(evt.pageX+15,window.innerWidth-400)+'px';
	popup.style.top = (evt.pageY+15)+'px';
	popup.style.visibility = 'visible';
}

function hidePopup() {
	popup.style.visibility = 'hidden';
}

/* [functions] Récupération / Computation des Infos Tactiques */
// TODO à revoir
function retireMarquage(nom) {
	var i = nom.indexOf(']');
	switch(i) {
		case -1:
		case nom.length-1:
			return nom;
		default:
			return nom.slice(0,i+1);
	}
}

function retrieveCDMs() {
// Récupère les CdM disponibles dans la BDD
// Lancé uniquement sur toggleLevelColumn
	if(checkBoxLevels.checked) { return; }
	
	var str = '';
	var begin = 1; // num de début de lot si plusieurs lots de CdM (501+ CdM)
	var cdmMax = MZ_getValue(numTroll+'.MAXCDM');
	cdmMax = Math.min(nbMonstres, cdmMax ? cdmMax : 500);
	if(MZ_getValue('CDMID')==null) MZ_setValue('CDMID',1); // à quoi sert CDMID ??
	
	for(var i=1 ; i<=cdmMax ; i++) {
		var nomMonstre = retireMarquage(getMonstreNom(i));
		if(nomMonstre.indexOf(']') != -1) {
			nomMonstre = nomMonstre.slice(0,nomMonstre.indexOf(']')+1);
		}
		// *** WARNING : PROXY RATIBUS ***
		// *** NE PAS CHANGER la fonction obsolète 'escape' ***
		str += 'nom[]='+escape(nomMonstre)+'$'+(
			getMonstreDistance(i)<=5 ? getMonstreID(i) : -getMonstreID(i)
		)+'&';
		
		if(i%500==0 || i==cdmMax) { // demandes de CdM par lots de 500 max
			var url = 'http://mountypedia.ratibus.net/mz/monstres_0.9_post_FF.php';
			
			FF_XMLHttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'begin='+begin+'&idcdm='+MZ_getValue('CDMID')+'&'+str,
				onload: function(responseDetails) {
					try {
						var texte = responseDetails.responseText;
						var lines = texte.split('\n');
						if(lines.length==0) { return; }
						var begin2, end2, index;
						for(var j=0 ; j<lines.length ; j++) {
							var infos = lines[j].split(';');
							if(infos.length<4) { continue; }
							var idMonstre=infos[0];
							var isCDM = infos[1];
							index = parseInt(infos[2]);
							var level = infos[3];
							infos = infos.slice(3);
							if(begin2==null) { begin2 = index; }
							end2 = index;
							listeCDM[idMonstre] = infos;
							if(isCDM==1) {
								getMonstreLevelNode(index).innerHTML = '<i>'+level+'</i>';
							} else {
								getMonstreLevelNode(index).innerHTML = level;
							}
						}
						computeMission(begin2,end2);
					} catch(e) {
						window.console.error(
							'[retrieveCDMs]\n'+e+'\n'+url+'\n'+texte
						);
					}
				}
			});
			str = '';
			begin = i+1;
		}
	}
	isCDMsRetrieved=true;
}

function computeMission(begin,end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance
	computeVLC(begin,end);
	if(!begin) begin=1;
	if(!end) end=nbMonstres;
	var str = MZ_getValue(numTroll+'.MISSIONS');
	if(!str) { return; }
	
	var urlImg = MZimg+'mission.png';
	var obMissions = JSON.parse(str);
	
	for(var i=end ; i>=begin ; i--) {
		var mess = '';
		for(var num in obMissions) {
			var mobMission = false;
			switch(obMissions[num].type) {
				case 'Race':
					var race = epure(obMissions[num].race.toLowerCase());
					var nom = epure(getMonstreNom(i).toLowerCase());
					if(nom.indexOf(race)!=-1) {
						mobMission = true;
					}
					break;
				case 'Niveau':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if(donneesMonstre) {
						var nivMob = Number(donneesMonstre[0]);
						var	nivMimi = Number(obMissions[num].niveau),
							mod = obMissions[num].mod;
						if((!isNaN(mod) && Math.abs(nivMimi-nivMob)<=Number(mod))
							|| (isNaN(mod) && nivMob>=nivMimi)) {
							mobMission = true;
						}
					}
					break;
				case 'Famille':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if(donneesMonstre) {
						var familleMimi = epure(obMissions[num].famille.toLowerCase());
						var familleMob = epure(donneesMonstre[1].toLowerCase());
						if(familleMob.indexOf(familleMimi)!=-1) {
							mobMission = true;
						}
					}
					break;
				case 'Pouvoir':
					var donneesMonstre = listeCDM[getMonstreID(i)];
					if(donneesMonstre) {
						var pvrMimi = epure(obMissions[num].pouvoir.toLowerCase());
						var pvrMob = epure(donneesMonstre[10].toLowerCase());
						if(pvrMob.indexOf(pvrMimi)!=-1) {
							mobMission = true;
						}
					}
			}
			if(mobMission) {
				mess += mess ? '\n\n' : '';
				mess += 'Mission '+num+' :\n'+obMissions[num].libelle;
			}
		}
		if(mess) {
			var td = getMonstreNomNode(i);
			appendText(td,' ');
			td.appendChild(createImage(urlImg,mess));
		}
	}
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
				var td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(" "));
				td.appendChild(createImage(urlImg, "Voit le caché"));
			}
		}
	}
}

function computeTactique(begin, end) {
// pk begin/end ? --> parce qu'au chargement c'est RetrieveCdMs qui le lance via computeVLC
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
				var td = getMonstreNomNode(j);
				appendText(td,' ');
				td.appendChild(
					createImageTactique(MZimg+'calc2.png', id, nom)
				);
			}
		}
	}
	catch(e) {
		window.alert('Erreur computeTactique mob num : '+j+' :\n'+e)
	}
	filtreMonstres();
}

function updateTactique() {
// = Handler checkBox noTactique
	var noTactique = saveCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(!isCDMsRetrieved) return;
	
	if(noTactique) {
		for(var i=nbMonstres ; i>0 ; i--) {
			var tr = getMonstreNomNode(i);
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
// = Handler universel pour les fonctions liées aux monstres
	var urlImg = MZimg+'Competences/ecritureMagique.png',
		urlEnchantImg = MZimg+'images/enchant.png';
	
	/* Vérification/Sauvegarde de tout ce qu'il faudra traiter */
	var useCss = MZ_getValue(numTroll+'.USECSS')=='true';
	var noGowaps = saveCheckBox(checkBoxGowaps,'NOGOWAP'),
		noEngages = saveCheckBox(checkBoxEngages,'NOENGAGE'),
		nivMin = saveComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE'),
		nivMax = saveComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE');
	// old/new : détermine s'il faut ou non nettoyer les tr
	var oldNOEM = true, noEM = true;
	if(MZ_getValue('NOINFOEM')!='true') {
		noEM = saveCheckBox(checkBoxEM, 'NOEM');
	}
	// Filtrage par nom
	var strMonstre = document.getElementById('strMonstres').value.toLowerCase();
	// Génère la liste des mobs engagés (si filtrés)
	if(noEngages && !isEngagesComputed) {
		for(var i=nbTrolls ; i>0 ; i--) {
			var pos = getTrollPosition(i);
			if(!listeEngages[pos[0]]) { listeEngages[pos[0]]={}; }
			if(!listeEngages[pos[0]][pos[1]]) { listeEngages[pos[0]][pos[1]]={}; }
			listeEngages[pos[0]][pos[1]][pos[2]] = 1;
		}
		isEngagesComputed = true;
	}
	
	/*** FILTRAGE ***/
	/* À computer :
	 * - EM (nom suffit)
	 * - Enchant (nom suffit)
	 * - Mission (nécessite CdM)
 	 * - mob VlC (nécessite CdM)
	 * Sans computation :
	 * - Gowap ? engagé ?
	 */
	for(var i=nbMonstres ; i>0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(noEM!=oldNOEM) {
			if(noEM) {
				// Si noEM passe de false à true, on nettoie les td "Nom"
				// DEBUG: Sauf que ce serait carrément mieux avec des id...
				var tr = getMonstreNomNode(i);
				while(tr.childNodes.length>1) {
					tr.removeChild(tr.childNodes[1]);
				}
			} else {
				var tr = getMonstreNomNode(i);
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
				var td = getMonstreNomNode(i);
				td.appendChild(document.createTextNode(' '));
				td.appendChild(createImage(urlEnchantImg, texte));
			}
		}
		
		tr_monstres[i].style.display = (
			noGowaps &&
			nom.indexOf('gowap apprivoisé')!=-1 &&
			getMonstreDistance(i)>1
		) || (
			noEngages &&
			getMonstreDistance(i)!=0 &&
			listeEngages[pos[0]] &&
			listeEngages[pos[0]][pos[1]] &&
			listeEngages[pos[0]][pos[1]][pos[2]]
		) || (
			strMonstre!='' &&
			nom.indexOf(strMonstre)==-1
		) || (
			nivMin>0 &&
			getMonstreLevel(i)!=-1 &&
			getMonstreLevel(i)<nivMin &&
			getMonstreDistance(i)>1 &&
			nom.toLowerCase().indexOf("kilamo")==-1  // wtf ?!...
		) || (
			nivMax>0 &&
			getMonstreLevel(i)>nivMax &&
			getMonstreDistance(i)>1 &&
			nom.toLowerCase().indexOf("kilamo")==-1
		) ? 'none' : '';
	}
	
	if(MZ_getValue('NOINFOEM')!='true') {
		if(noEM != oldNOEM) {
			if(noEM && isCDMsRetrieved) computeMission();
		}
		oldNOEM = noEM;
	}
	
	needComputeEnchantement = false;
}


/*-[functions]---------------- Fonctions Trõlls ------------------------------*/

function filtreTrolls() {
	var noIntangibles = saveCheckBox(checkBoxIntangibles,'NOINT');
	var strTroll = document.getElementById('strTrolls').value.toLowerCase();
	var strGuilde = document.getElementById('strGuildes').value.toLowerCase();
	for(var i=1 ; i<=nbTrolls ; i++) {
		tr_trolls[i].style.display = (
			noIntangibles &&
			getTrollNomNode(i).firstChild.className=='mh_trolls_0'
		) || (
			strTroll!='' &&
			getTrollNomNode(i).textContent.toLowerCase().indexOf(strTroll)==-1
		) || (
			strGuilde!='' &&
			getTrollGuilde(i).toLowerCase().indexOf(strGuilde)==-1
		) ? 'none' : '';
	}
}

/* [functions] Bulle PX Trolls */
var bulle;

function initPXTroll() {
	bulle = document.createElement('div');
	bulle.id = 'bulle';
	bulle.className = 'mh_textbox';
	bulle.style =
		'position: absolute;'+
		'border: 1px solid #000000;'+
		'visibility: hidden;'+
		'display: inline;'+
		'z-index: 2;';
	document.body.appendChild(bulle);

	for(var i=nbTrolls ; i>0 ; i--) {
		var td_niv = getTrollNivNode(i);
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

/* [functions] Envoi PX / MP */
function putBoutonPXMP() {
// Bouton d'initialisation du mode Envoi
// WARNING - Nécessite que le Filtre Trõll ait été mis en place
	var td = document.getElementById('tdInsertTrolls');
	if(!td) { return; }
	td.width = 100;
	td = insertTd(td.nextSibling);
	td.style.verticalAlign = 'top';
	var bouton = appendButton(td,'Envoyer...',prepareEnvoi);
	bouton.id = 'btnEnvoi';
}

function prepareEnvoi() {
// = 1er Handler du bouton d'envoi
	
	/* Ajout de la colonne des CheckBoxes */
	var td = insertTdText(getTrollNomNode(0),'');
	td.width = 5;
	for(var i=nbTrolls ; i>0 ; i--) {
		td = insertTd(getTrollNomNode(i));
		appendCheckBox(td,'envoi'+i);
	}
	
	/* Ajout du radio de choix PX ou MP */
	var btnEnvoi = document.getElementById('btnEnvoi');
	if(!btnEnvoi) { return; }
	var tdEnvoi = btnEnvoi.parentNode;
	appendText(tdEnvoi,' ');
	var span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	var radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.id = 'radioPX';
	span.appendChild(radioElt);
	appendText(span,' des PX ');
	radioElt = document.createElement('input');
	radioElt.type = 'radio';
	radioElt.name = 'envoiPXMP';
	radioElt.checked = true;
	span.appendChild(radioElt);
	appendText(span,' un MP');
	tdEnvoi.appendChild(span);
	
	/* Insertion du bouton Annuler */
	insertButton(btnEnvoi,'Annuler',annuleEnvoi);
	
	/* Modification de l'effet du bouton Envoi */
	document.getElementById('btnEnvoi').onclick = effectueEnvoi;
}

function annuleEnvoi() {
// = Handler bouton Annuler
	/* Nettoyage du td du bouton Envoi */
	var btnEnvoi = document.getElementById('btnEnvoi');
	var tdEnvoi = btnEnvoi.parentNode;
	while(tdEnvoi.firstChild) {
		tdEnvoi.removeChild(tdEnvoi.firstChild);
	}
	/* Retour à l'effet de base du bouton Envoi */
	btnEnvoi.onclick = prepareEnvoi;
	tdEnvoi.appendChild(btnEnvoi);
	/* Suppression CheckBoxes */
	for(var i=nbTrolls ; i>=0 ; i--) {
		var td = getTrollNomNode(i);
		td.parentNode.removeChild(td);
	}
}

function effectueEnvoi() {
// = 2e Handler du bouton d'envoi (charge un nouveau frame)
	var str='';
	for(var i=nbTrolls ; i>0 ; i--) {
		var chb = document.getElementById('envoi'+i);
		if(chb.checked)	{
			str += (str?',':'')+getTrollID(i);
		}
	}
	var PXchecked = document.getElementById('radioPX').checked;
	if(PXchecked) {
		window.open('./Actions/Play_a_DonPX.php?cat=8&dest='+str,'Contenu');
	} else {
		window.open('../Messagerie/MH_Messagerie.php?cat=3&dest='+str,'Contenu');
	}
}

/*-[functions]---------------- Fonctions Trésors -----------------------------*/

function filtreTresors() {
// += Handler checkboxes : gg, compos, bidouilles, non libres
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
	var strTresor = document.getElementById('strTresors').value.toLowerCase();
	for(var i=nbTresors ; i>0 ; i--) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		tr_tresors[i].style.display = (
			noGG &&
			nom.indexOf('Gigots de Gob')!=-1
		) || (
			noCompos &&
			nom.indexOf('Composant')!=-1
		) || (
			noEngages &&
			listeEngages[pos[2]] &&
			listeEngages[pos[2]][pos[1]] &&
			listeEngages[pos[2]][pos[1]][pos[0]] &&
			getTresorDistance(i)>0
		) || (
			strTresor!='' &&
			nom.toLowerCase().indexOf(strTresor)==-1
		) || (
			noBidouilles &&
			nom.indexOf('Bidouille')!=-1
		) ? 'none' : '';
	}
}


/*-[functions]----------------- Fonctions Lieux ------------------------------*/

function filtreLieux() {
// += Handler checkbox trous
	var noTrou = saveCheckBox(checkBoxTrou,'NOTROU');
	var strLieu = document.getElementById('strLieux').value.toLowerCase();
	for(var i=nbLieux ; i>0 ; i--) {
		tr_lieux[i].style.display = (
			strLieu &&
			getLieuNom(i).toLowerCase().indexOf(strLieu)==-1
		) || (
			noTrou &&
			getLieuNom(i).toLowerCase().indexOf("trou de météorite")!=-1 &&
			getLieuDistance(i)>1
		) ? 'none' : '';
	}
}


/*-[functions]-------------------- Diplomatie --------------------------------*/

function refreshDiplo() {
	MZ_setValue(numTroll+'.diplo.off',
		checkBoxDiplo.checked?'true':'false'
	);
	if(isDiploRaw) { computeDiplo(); }
	appliqueDiplo();
}

function computeDiplo() {
// On extrait les données de couleur et on les stocke par id
// Ordre de préséance :
//  source Guilde < source Perso
//  guilde cible < troll cible
	
	/* Diplo de Guilde */
	var diploGuilde = MZ_getValue(numTroll+'.diplo.guilde') ?
		JSON.parse(MZ_getValue(numTroll+'.diplo.guilde')) : {};
	if(diploGuilde && diploGuilde.isOn=='true') {
		// Guilde perso
		if(diploGuilde.guilde) {
			Diplo.Guilde[diploGuilde.guilde.id] = {
				couleur: diploGuilde.guilde.couleur,
				titre: 'Ma Guilde'
			};
		}
		// Guildes/Trolls A/E
		for(var AE in {Amis:0,Ennemis:0}) {
			for(var i=0 ; i<5 ; i++) {
				if(diploGuilde[AE+i]) {
					for(var type in {Guilde:0,Troll:0}) {
						var liste = diploGuilde[AE+i][type].split(';');
						for(var j=liste.length-2 ; j>=0 ; j--) {
							Diplo[type][liste[j]] = {
								couleur: diploGuilde[AE+i].couleur,
								titre: diploGuilde[AE+i].titre
							};
						}
					}
				}
			}
		}
	}
	
	/* Diplo Perso */
	var diploPerso = MZ_getValue(numTroll+'.diplo.perso') ?
		JSON.parse(MZ_getValue(numTroll+'.diplo.perso')) : {};
	if(diploPerso && diploPerso.isOn=='true') {
		for(var type in {Guilde:0,Troll:0,Monstre:0}) {
			for(var id in diploPerso[type]) {
				Diplo[type][id] = diploPerso[type][id];
			}
		}
	}
	if(diploPerso.mythiques) {
		Diplo.mythiques = diploPerso.mythiques;
	}
	
	isDiploRaw = false;
}

function appliqueDiplo() {
	var aAppliquer = Diplo;
	if(checkBoxDiplo.checked) {
		// Pour retour à l'affichage basique sur désactivation de la diplo
		aAppliquer = {
			Guilde: {},
			Troll: {},
			Monstre: {}
		};
	}
	
	/* On applique "aAppliquer" */
	// Diplo Trõlls
	for(var i=nbTrolls ; i>0 ; i--) {
		var idG = getTrollGuildeID(i);
		var idT = getTrollID(i);
		var tr = tr_trolls[i];
		if(aAppliquer.Troll[idT]) {
			tr.className = '';
			var descr = aAppliquer.Troll[idT].titre;
			if(descr) {
				getTrollNomNode(i).title = descr
			}
			tr.style.backgroundColor = aAppliquer.Troll[idT].couleur;
		} else if(aAppliquer.Guilde[idG]) {
			tr.className = '';
			var descr = aAppliquer.Guilde[idG].titre;
			if(descr) {
				getTrollNomNode(i).title = descr
			}
			tr.style.backgroundColor = aAppliquer.Guilde[idG].couleur;
		} else {
			tr.className = 'mh_tdpage';
			getTrollNomNode(i).title = '';
		}
	}
	
	// Diplo Monstres
	for(var i=nbMonstres ; i>0 ; i--) {
		var id = getMonstreID(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(aAppliquer.Monstre[id]) {
			tr_monstres[i].className = '';
			tr_monstres[i].style.backgroundColor = aAppliquer.Monstre[id].couleur;
			tr_monstres[i].diploActive = 'oui';
			var descr = aAppliquer.Monstre[id].titre;
			if(descr) {
				getMonstreNomNode(i).title = descr;
			}
		} else if(aAppliquer.mythiques &&
			(nom.indexOf('liche')==0 ||
			nom.indexOf('hydre')==0 ||
			nom.indexOf('balrog')==0 ||
			nom.indexOf('beholder')==0)) {
			tr_monstres[i].className = '';
			tr_monstres[i].style.backgroundColor = aAppliquer.mythiques;
			tr_monstres[i].diploActive = 'oui';
			getMonstreNomNode(i).title = 'Monstre Mythique';
		} else {
			tr_monstres[i].className = 'mh_tdpage';
			tr_monstres[i].diploActive = '';
		}
	}
}


/*-[functions]---------------- Actions à distance ----------------------------*/

function computeActionDistante(dmin,dmax,keltypes,oussa,urlIcon,message) {
	var monN = parseInt(getPosition()[2]);
	
	for(var type in keltypes) {
		alt = oussa=='self' ? type.slice(0,-1) : oussa;
		for(var i=this['nb'+type] ; i>0 ; i--)  {
			var tr = this['tr_'+type.toLowerCase()][i];
			var sonN = this['get'+type.slice(0,-1)+'Position'](i)[2];
			var d = this['get'+type.slice(0,-1)+'Distance'](i);
			
			if(sonN==monN && d>=dmin && d<=dmax) {
				var iconeAction = document.evaluate(
					"./descendant::img[@alt='"+alt+"']",
					tr, null, 9, null
				).singleNodeValue;
				if(iconeAction) {
					if(iconeAction.title) {
						iconeAction.title += "\n"+message;
					} else {
						iconeAction.title = message;
					}
					iconeAction.src = urlIcon;
				} else {
					var tdAction = tr.getElementsByTagName('td')[1];
					var icon = document.createElement('img');
					icon.src = urlIcon;
					icon.height = 20;
					icon.alt = alt;
					icon.title = message;
					tdAction.appendChild(icon);
				}
			}
		}
	}
}

function computeCharge() {
	computeActionDistante(1,
		getPortee(
			Math.ceil(MZ_getValue(numTroll+".caracs.pv")/10)+
			MZ_getValue(numTroll+".caracs.regeneration")
		),
		{'Monstres':1, 'Trolls':1},
		'Attaquer',
		MHicons+'E_Metal09.png',
		'Cible à portée de Charge'
	);
}

function computeProjo() {
	computeActionDistante(0,
		getPortee(
			MZ_getValue(numTroll+".caracs.vue")+
			MZ_getValue(numTroll+".caracs.vue.bm")
		),
		{'Monstres':1, 'Trolls':1},
		'Attaquer',
		MHicons+'S_Fire05.png',
		'Cible à portée de Projo'
	);
}

function computeTelek() {
	computeActionDistante(0,
		Math.floor((
			MZ_getValue(numTroll+".caracs.vue")+
			MZ_getValue(numTroll+".caracs.vue.bm")
		)/2),
		{'Tresors':1},
		'Telek',
		MHicons+'S_Magic04.png',
		'Trésor à portée de Télékinésie'
	);
}

function computeLdP() {
	computeActionDistante(0,
		2+Math.floor((
			MZ_getValue(numTroll+".caracs.vue")+
			MZ_getValue(numTroll+".caracs.vue.bm")
		)/5),
		{'Monstres':1, 'Trolls':1},
		'self',
		MHicons+'P_Red01.png',
		'Cible à portée de Lancer de Potions'
	);
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
			/* PAs dispos */
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


/* Mode Tétalanvert! ---------------------------------------------------------*/

function calculeDistance(maPos,posArr) {
	return Math.max(
		Math.abs(maPos[0]-posArr[0]),
		Math.abs(maPos[1]-posArr[1]),
		Math.abs(maPos[2]-posArr[2])
	);
}

function inversionCoord() {
	var maPos = getPosition();
	var listeOffsets = {
		'monstres':checkBoxLevels.checked?4:3,
		'trolls':6,
	};
	for(var type in listeOffsets) {
		var trList = this['tr_'+type];
		var offset = listeOffsets[type];
		for(var i=trList.length-1 ; i>0 ; i--) {
			var oldX = parseInt(trList[i].cells[offset].textContent);
			var oldY = parseInt(trList[i].cells[offset+1].textContent);
			var oldN = parseInt(trList[i].cells[offset+2].textContent);
			trList[i].cells[offset].innerHTML = oldY;
			trList[i].cells[offset+1].innerHTML = oldX;
			trList[i].cells[0].innerHTML = calculeDistance(maPos,[oldY,oldX,oldN]);
		}
	}
}


/*                             Partie principale                              */

try {
	start_script(31);
	
	initialiseInfos();
	savePosition();

	// Fonctionnalité "Têtalenvert" cachée, en test :
	if(MZ_getValue(numTroll+'.VERLAN')=='true') {
		inversionCoord();
	}
	
	ajoutDesFiltres();
	set2DViewSystem();
	//putBoutonTroogle();
	putBoutonPXMP();
	
	synchroniseFiltres();
	toggleLevelColumn();

	refreshDiplo();
	
	//400 ms
	var noGG = saveCheckBox(checkBoxGG, "NOGG");
	var noCompos = saveCheckBox(checkBoxCompos, "NOCOMP");
	var noBidouilles = saveCheckBox(checkBoxBidouilles, "NOBID");
	var noGowaps = saveCheckBox(checkBoxGowaps, "NOGOWAP");
	var noEngages = saveCheckBox(checkBoxEngages, "NOENGAGE");
	var noTresorsEngages =
		saveCheckBox(checkBoxTresorsNonLibres, "NOTRESORSNONLIBRES");
	var noTrou = saveCheckBox(checkBoxTrou, "NOTROU");
	var noIntangibles = saveCheckBox(checkBoxIntangibles, "NOINT");
	filtreMonstres();
	if(noIntangibles) {
		filtreTrolls();
	}
	if(noGG || noCompos || noBidouilles || noTresorsEngages) {
		filtreTresors();
	}
	if(noTrou) {
		filtreLieux();
	}

	initPopup();
	initPXTroll();

	if(getTalent("Projectile Magique")!=0) {
		computeProjo();
	}
	if(getTalent("Charger")!=0) {
		computeCharge();
	}
	if(getTalent("Télékinésie")!=0) {
		computeTelek();
	}
	if(getTalent("Lancer de Potions")!=0) {
		computeLdP();
	}
	
	putScriptExterne();
	
	displayScriptTime();
} catch(e) {
	avertissement("[MZ] Une erreur s'est produite.");
	window.console.error("[MZ] Erreur générale Vue",e);
}
