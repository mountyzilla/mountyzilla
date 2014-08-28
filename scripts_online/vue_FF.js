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
var cg = [], ct = []; // Couleur Guilde, Couleur Trõll (Diplo)

var listeCDM = [], listeLevels = [];

var listeTags = [], listeTagsInfos = [],
	listeTagsGuilde = [], listeTagsInfosGuilde = [];

// Fenêtres déplaçables
var winCurr = null;
var offsetX, offsetY;
document.onmousemove = drag;

// Infos de combat (& tags)
var popup;

// Gère l'affichage en cascade des popups de CdM
var nbCDM = 0;

var isCDMsRetrieved = false; // = si les CdM ont déjà été DL
var isDiploComputed = false; // = si la Diplo a déjà été DL

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
	checkBoxMythiques, comboBoxNiveauMin, comboBoxNiveauMax;


/*-[functions]-------------- Fonctions utilitaires ---------------------------*/
function getPortee(param) {
	return Math.ceil((Math.sqrt(19 + 8 * (param + 3)) - 7) / 2);
}

function savePosition() {
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

function getPositionStr(pos) {
	// À renommer. Grave.
	return pos[0]+';'+pos[1]+';'+pos[2];
}

/* [functions] Récup données Utilisateur */
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

function getVue() {
	// Retourne [vueHpure, vueVpure]
	var vues = getPorteVue();
	return [ vues[0], vues[1] ];
	}

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
		window.alert('[getMonstreTdNom] Impossible de trouver le monstre '+i);
		}
	}

function getMonstreNom(i) {
	try {
		return tr_monstres[i].childNodes[checkBoxLevels.checked ? 2 : 3]
			.firstChild.firstChild.nodeValue;
		}
	catch(e) {
		window.alert('[getMonstreNom] Impossible de trouver le monstre '+i);
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

function appendMonstres(txt) {
	for(var i=1; i<=nbMonstres ; i++)
		txt += getMonstreID(i)+';'+getMonstreNom(i)+';'+getPositionStr(getMonstrePosition(i))+'\n';
	return txt;
}

function getMonstres() {
	var vue = getVue();
	return appendMonstres(getPositionStr(getPosition()) + ";" + vue[0] + ";" + vue[1] + "\n");
}

/* [functions] Récup données Trolls */
function getTrollDistance(i) {
	return tr_trolls[i].firstChild.firstChild.nodeValue;
	}

function getTrollID(i) {
	return tr_trolls[i].childNodes[1].firstChild.nodeValue;
	}

function getTrollNomNode(i) {
	var isEnvoiOn =
		document.getElementById('btnEnvoi').parentNode.childNodes.length>1;
	return tr_trolls[i].childNodes[ isEnvoiOn ? 3 : 2 ];
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

function getTresorTdNom(i) {
	return tr_tresors[i].childNodes[2];
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
		tds[5].firstChild.nodeValue
	];
}

/* [functions] Récup données Lieux */
function getLieuDistance(i) {
	return parseInt(tr_lieux[i].firstChild.firstChild.nodeValue);
}

function getLieuNom(i) { /* DEBUG - en test */
	return tr_lieux[i].childNodes[2].childNodes[1].textContent;
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
	recallCheckBox(checkBoxDiplo,'NODIPLO');
	recallCheckBox(checkBoxTrou,'NOTROU');
	recallCheckBox(checkBoxTresorsNonLibres,'NOTRESORSNONLIBRES');
	recallCheckBox(checkBoxTactique,'NOTACTIQUE');
	if(MZ_getValue('NOINFOEM')!='true')
		recallCheckBox(checkBoxEM,'NOEM');
}


/*-[functions]-------- Initialisation: Ajout des Boutons ---------------------*/

/* [functions] Menu Vue 2D */
// DEBUG: à refaire plus clairement en JSON
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
	for(var i=0 ; i<listeParams.length ; i+=2) {
		appendHidden(form, listeParams[i], listeParams[i+1]);
	}
	appendSubmit(form, 'Voir',
		function() {
			document.getElementsByName(vue2Ddata[vueext][1])[0].value =
				vue2Ddata[vueext][2]();
		}
	);
}

function set2DViewSystem() {
	// = Initialiseur du système de vue 2D
	var vueext = MZ_getValue('VUEEXT');
	if(!vueext || !vue2Ddata[vueext]) {
		// La vue Bricol'Trolls est employée par défaut
		vueext = 'Bricol\' Vue';
	}
	
	/* Création du sélecteur de vue */
	selectVue2D = document.createElement('select');
	selectVue2D.id = 'selectVue2D';
	selectVue2D.className = 'SelectboxV2';
	for(var view in vue2Ddata) {
		appendOption(selectVue2D, view, view);
	}
	selectVue2D.value = vueext;
	selectVue2D.onchange = refresh2DViewButton;
	
	/* Création du formulaire d'envoi (vide, le submit est géré via handler) */
	var form = document.createElement('form');
	form.id = 'viewForm';
	
	/* Insertion du système de vue */
	var center = document.getElementById('titre2').nextSibling;
	var table = document.createElement('table');
	var tr = appendTr(table);
	var td = appendTd(tr);
	td.appendChild(selectVue2D);
	td = appendTd(tr);
	td.style.fontSize = '0px'; // gère l'erreur de l'extra character
	td.appendChild(form);
	center.insertBefore(table,center.firstChild);
	insertBr(center.childNodes[1]);
	
	/* Appelle le handler pour initialiser le bouton de submit */
	refresh2DViewButton();
}

/* [functions] Tableau d'Infos */
function creerTableauInfos() {
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
	if(cursorOnLink) { return; } // DEBUG: héritage Tilk, utilité inconnue
	
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

/* [functions] Filtres */
function prepareFiltrage(ref,width) {
// = Initialise le filtre 'ref'
	var tdTitre = document.getElementsByName(ref.toLowerCase())[0].parentNode;
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
	// Ici this = MZ.global (!= window), permet d'accéder aux fonctions MZ
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
	ajoutFiltreStr(td,'Nom du monstre:','strMonstres',filtreMonstres);
	appendText(td,'\u00a0\u00a0\u00a0');
	appendText(td,'Niveau Min: ');
	comboBoxNiveauMin = ajoutFiltreMenu(td,'nivMinMonstres',filtreMonstres);
	appendText(td,'\u00a0');
	appendText(td,'Niveau Max: ');
	comboBoxNiveauMax = ajoutFiltreMenu(td,'nivMaxMonstres',filtreMonstres);
	/* Trõlls */
	td = prepareFiltrage('Trolls',50);
	ajoutFiltreStr(td,'Nom du trõll:','strTrolls',filtreTrolls);
	appendText(td,'\u00a0\u00a0\u00a0');
	ajoutFiltreStr(td,'Nom de guilde:','strGuildes',filtreTrolls);
	/* Trésors */
	td = prepareFiltrage('Tresors',55);
	ajoutFiltreStr(td,'Nom du trésor:','strTresors',filtreTresors);
	/* Lieux */
	td = prepareFiltrage('Lieux',40);
	ajoutFiltreStr(td,'Nom du lieu:','strLieux',filtreLieux);
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
		function() {
			document.getElementsByName(id)[0].value = func();
		}
	);
	paren.appendChild(myForm);
}

function putBoutonMonstres() {
	var td = document.getElementById('tdInsertMonstres');
	td = insertTd(td.nextSibling);
	td.style.fontSize = '0px';
	appendSendBouton(td,
		'http://mountyhall.clubs.resel.fr/script/v2/get_monstres.php',
		'listeMonstres', getMonstres,
		'Envoyer les monstres aux Teubreux');
	}

function putBoutonLieux() {
	var td = document.getElementById('tdInsertLieux');
	td = insertTd(td.nextSibling);
	td.style.fontSize = '0px';
	appendSendBouton(td,
		'http://mountyzilla.tilk.info/scripts/lieux.php',
		'listeLieux', getLieux,
		'Ajouter les lieux à la base MZ');
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
			this.className = 'mh_tdpage';
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
	}
	else if(getMonstreLevelNode(0).textContent=='Niveau') {
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

/* [functions] Gestion de l'AFFICHAGE des Infos de combat */
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
		var nomMonstre = retireMarquage(getMonstreNom(i,true));
		if(nomMonstre.indexOf(']') != -1)
			nomMonstre = nomMonstre.substring(0,nomMonstre.indexOf(']')+1);
		str += 'nom[]=' + escape(nomMonstre) + '$'
			+ (getMonstreDistance(i) <= 5 ? getMonstreID(i) : -getMonstreID(i)) + '&';
		
		if(i%500==0 || i==cdmMax) { // demandes de CdM par lots de 500 max
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
						console.error(e+'\n'+url+'\n'+texte);
					}
					}
				});
			str = '';
			begin = i + 1;
			}
		}
	isCDMsRetrieved=true;
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
				var td = getMonstreTdNom(j);
				appendText(td,' ');
				td.appendChild(
					createPopupImage2(MZimg+'calc2.png', id, nom)
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

function filtreMonstres() {
// = Handler universel pour les fonctions liées aux monstres
	var urlImg = MZimg+'Competences/ecritureMagique.png',
		urlEnchantImg = MZimg+'images/enchant.png';
	
	/* Vérification/Sauvegarde de tout ce qu'il faudra traiter */
	var useCss = MZ_getValue(numTroll+'.USECSS')=='true';
	var noGowaps = saveCheckBox(checkBoxGowaps,'NOGOWAP'),
		noMythiques = saveCheckBox(checkBoxMythiques,'NOMYTH'),
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
	 * - Projotable (posale suffit)
 	 * - Chargeable (posale suffit)
	 * - EM (nom suffit)
	 * - Enchant (nom suffit)
	 * - Mission (nécessite CdM)
 	 * - mob VlC (nécessite CdM)
	 * Sans computation :
	 * - Mythique ? Gowap ? engagé ?
	 */
	for(var i=nbMonstres ; i>0 ; i--) {
		var pos = getMonstrePosition(i);
		var nom = getMonstreNom(i).toLowerCase();
		if(noEM!=oldNOEM) {
			if(noEM) {
				// Si noEM passe de false à true, on nettoie les td "Nom"
				// DEBUG: Sauf que ce serait carrément mieux avec des id...
				var tr = getMonstreTdNom(i);
				while(tr.childNodes.length>1) {
					tr.removeChild(tr.childNodes[1]);
				}
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
		
		tr_monstres[i].style.display =
			(noGowaps
				&& nom.indexOf('gowap apprivoisé')!=-1
				&& getMonstreDistance(i)>1) ||
			(noEngages
				&& getMonstreDistance(i)!=0
				&& listeEngages[pos[0]]
				&& listeEngages[pos[0]][pos[1]]
				&& listeEngages[pos[0]][pos[1]][pos[2]]) ||
			(strMonstre!=''
				&& nom.indexOf(strMonstre)==-1) ||
			(nivMin>0
				&& getMonstreLevel(i)<=nivMin
				&& getMonstreDistance(i)>1
				&& getMonstreDistance(i)!=-1 // wtf ?
				&& nom.toLowerCase().indexOf("kilamo")==-1) ||
			(nivMax>0
				&& getMonstreLevel(i)>=nivMax
				&& getMonstreDistance(i)>1
				&& getMonstreDistance(i)!=-1
				&& nom.toLowerCase().indexOf("kilamo") == -1
			) ? 'none' : '';
		
		if(nom.indexOf('liche')==0
			|| nom.indexOf('hydre')==0
			|| nom.indexOf('balrog')==0
			|| nom.indexOf('beholder')==0) {
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


/*-[functions]---------------- Fonctions Trõlls ------------------------------*/

function filtreTrolls() {
	var noIntangibles = saveCheckBox(checkBoxIntangibles,'NOINT');
	var strTroll = document.getElementById('strTrolls').value.toLowerCase();
	var strGuilde = document.getElementById('strGuildes').value.toLowerCase();
	for(var i=1 ; i<=nbTrolls ; i++) {
		var tds = tr_trolls[i].childNodes;
		tr_trolls[i].style.display =
			(noIntangibles && tds[2].firstChild.className=='mh_trolls_0')
			|| (strTroll!=''
				&& getTrollNomNode(i).textContent.toLowerCase().indexOf(strTroll)==-1)
			|| (strGuilde!=''
				&& (!tds[5].firstChild.firstChild
					|| tds[5].textContent.toLowerCase().indexOf(strGuilde)==-1) )
			? 'none' : '';
	}
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

/* [functions] Diplomatie */
// TODO à revoir
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

/* [functions] Envoi PX / MP */
function putBoutonPXMP() {
// Bouton d'initialisation du mode Envoi
	var td = document.getElementById('tdInsertTrolls');
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
		window.open('Actions/Play_a_DonPX.php?cat=8&dest='+str,'Contenu');
	} else {
		window.open('../Messagerie/MH_Messagerie.php?cat=3&dest='+str,'Contenu');
	}
}

/*-[functions]---------------- Fonctions Trésors -----------------------------*/

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
	var strTresor = document.getElementById('strTresors').value.toLowerCase();
	for(var i=nbTresors ; i>0 ; i--) {
		var nom = getTresorNom(i);
		var pos = getTresorPosition(i);
		tr_tresors[i].style.display =
			(noGG	
				&& nom.indexOf('Gigots de Gob')!=-1) ||
			(noCompos	
				&& nom.indexOf('Composant')!=-1) ||
			(noEngages
				&& listeEngages[pos[2]]
				&& listeEngages[pos[2]][pos[1]]
				&& listeEngages[pos[2]][pos[1]][pos[0]]
				&& getTresorDistance(i)>0) ||
			(strTresor!=''
				&& nom.toLowerCase().indexOf(strTresor)==-1) ||
			(noBidouilles
				&& nom.indexOf('[Bidouille]')!=-1)
			? 'none' : '';
	}
}

function computeTelek() {
	if(getSortComp('Télékinésie')==0) { return; }
	var urlImg = MZimg+'Sorts/telekinesie.png';
	var posN = getPosition()[2];
	for(var i=nbTresors ; i>0 ; i--) {
		var pos = getTresorPosition(i);
		if(pos[2]==posN) {
			var td = getTresorTdNom(i);
			appendText(td,' ');
			td.appendChild(
				createImage(urlImg,'Trésor transportable par Télékinésie')
			);
		}
	}
}


/*-[functions]----------------- Fonctions Lieux ------------------------------*/

function filtreLieux() {
// = EventListener ChB trous
	var noTrou = saveCheckBox(checkBoxTrou,'NOTROU');
	var strLieu = document.getElementById('strLieux').value.toLowerCase();
	for(var i=nbLieux ; i>0 ; i--) {
		tr_lieux[i].style.display =
			(strLieu
				&& getLieuNom(i).toLowerCase().indexOf(strLieu)==-1)
			|| (noTrou
				&& getLieuNom(i).toLowerCase().indexOf("trou de météorite")!=-1
				&& getLieuDistance(i)>1)
			? 'none' : '';
	}
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

// POPUP TAGS

function showPopup(evt) {
	var texte = this.getAttribute('texteinfo');
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
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


/*                             Partie principale                              */

try
{
start_script(31);
	

creerTableauInfos();
ajoutDesFiltres();
set2DViewSystem();
putBoutonMonstres();
putBoutonLieux();
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
