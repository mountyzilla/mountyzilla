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

// x~x Libs

/* TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

var MZimg = 'http://mountyzilla.tilk.info/scripts_0.9/images/';
var MHicons = '/mountyhall/Images/Icones/';
// Active l'affichage des log de DEBUG (fonction debugMZ(str))
var MY_DEBUG = false;

/* remplacement fonction MZ */
function MY_getValue(key) {
	return window.localStorage[key];
}

function MY_removeValue(key) {
	window.localStorage.removeItem(key);
}

function MY_setValue(key, val) {
	window.localStorage[key] = val;
}

/*---------------- mise à jour de variables globales utiles ------------------*/
// utilisé pour accès bdd (un peu partout) :
var numTroll = MY_getValue('NUM_TROLL');
// utilisé dans vue pour PX :
var nivTroll = MY_getValue('NIV_TROLL');
// utilisés dans actions et vue (calculs SR) :
var mmTroll = MY_getValue(numTroll+'.caracs.mm');
var rmTroll = MY_getValue(numTroll+'.caracs.rm');

/* DEBUG: NETTOYAGE TAGS */
if(MY_getValue(numTroll+'.TAGSURL')) {
	MY_removeValue(numTroll+'.TAGSURL');
}

/*-[functions]------------ Fonctions durée de script -------------------------*/
var date_debut = null;

function start_script(nbJours_exp) {
	if(date_debut) return;
	date_debut = new Date();
	// Créé la variable expdate si demandé
	if(nbJours_exp) {
		expdate = new Date();
		expdate.setTime(expdate.getTime()+nbJours_exp*864e5);
		}
	}

function displayScriptTime() {
	var footerNode = document.getElementById('footer2');
	if(!footerNode) return;
	try{
	var node = document.evaluate(
		".//text()[contains(.,'Page générée en')]/../br",
		footerNode,null,9,null).singleNodeValue;
	}
	catch(e){return;}
	insertText(node,
		' - [Script exécuté en '
		+(new Date().getTime()-date_debut.getTime())/1000+' sec.]');
	}


/*-[functions]-------------- Insertion de scripts ----------------------------*/

function isPage(url) {
	return window.location.href.indexOf(MHURL+url)==0;
}

/*-[functions]---------- DEBUG: Communication serveurs -----------------------*/

function debugMZ(str){
    if(MY_DEBUG){
        window.console.debug('[MY_DEBUG] '+str);
        if(typeof str === "object"){
            window.console.debug(str);
        }
    }
}

function FF_XMLHttpRequest(MY_XHR_Ob) {
	var request = new XMLHttpRequest();
	request.open(MY_XHR_Ob.method,MY_XHR_Ob.url);
	for(var head in MY_XHR_Ob.headers) {
		request.setRequestHeader(head,MY_XHR_Ob.headers[head]);
	}
	request.onreadystatechange = function() {
		if(request.readyState!=4) { return; }
		if(request.error) {
			if(MY_XHR_Ob.onerror) {
				MY_XHR_Ob.onerror(request);
			}
		}
		else if(MY_XHR_Ob.onload) {
			/* DEBUG: Ajouter à request les pptés de MY_XHR_Ob à transmettre */
			MY_XHR_Ob.onload(request);
		}
	};
	request.send(MY_XHR_Ob.data);
}


/*-[functions]-------------- Interface utilisateur ---------------------------*/

function avertissement(txt,duree) {
	if(!duree) { duree = 5000; }
	var div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	var num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name','avertissement');
	div.className = 'mh_textbox';
	div.style =
		'position:fixed;'+
		'top:'+(10+15*num)+'px;'+
		'left:'+(10+5*num)+'px;'+
		'border:1px solid #000000;'+
		'z-index:'+(2+num)+';'+
		'cursor:crosshair;';
	div.innerHTML = txt;
	div.onclick=function(){ tueAvertissement(this.num) };
	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après 3 sec :
	window.setTimeout(function(){ tueAvertissement(num) },duree);
}

function tueAvertissement(num) {
	var divs = document.getElementsByName('avertissement');
	if(divs.length==0) { return; }
	for(var i=0 ; i<divs.length ; i++) {
		if(divs[i].num==num) {
			divs[i].parentNode.removeChild(divs[i]);
			return;
		}
	}
}


/*-[functions]-------------- Modifications du DOM ----------------------------*/

function insertBefore(next,el) {
	next.parentNode.insertBefore(el,next);
	}

function appendTr(tbody,clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	tbody.appendChild(tr);
	return tr;
	}

function insertTr(next,clas) {
	var tr = document.createElement('tr');
	if(clas) tr.className = clas;
	insertBefore(next,tr);
	return tr;
	}

function appendTd(tr) {
	var td = document.createElement('td');
	if(tr) tr.appendChild(td);
	return td;	
	}

function insertTd(next) {
	var td = document.createElement('td');
	insertBefore(next,td);
	return td;
	}

function appendTdCenter(tr,colspan) {
	var td = appendTd(tr);
	td.align = 'center'; // WARNING - Obsolete
	if(colspan) td.colSpan = colspan;
	return td;
	}

function insertTdElement(next,el) {
	var td = insertTd(next);
	if(el) td.appendChild(el);
	return td;
	}

function appendText(paren,text,bold) {
	if(bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
		}
	else
		paren.appendChild(document.createTextNode(text));
	}

function insertText(next,text,bold) {
	if(bold) {
		var b = document.createElement('b');
		appendText(b,text);
		insertBefore(next,b);
		}
	else
		insertBefore(next,document.createTextNode(text));
	}

function appendTdText(tr,text,bold) {
	var td = appendTd(tr);
	appendText(td,text,bold);
	return td;
	}

function insertTdText(next,text,bold) {
	var td = insertTd(next);
	appendText(td,text,bold);
	return td;
	}

function appendBr(paren) {
	paren.appendChild(document.createElement('br'));
	}

function insertBr(next) {
	insertBefore(next,document.createElement('br'));
	}

function appendLI(ul,text) {
	// uniquement utilisé dans les options (crédits)
	var li = document.createElement('li');
	appendText(li,text);
	ul.appendChild(li);
	return li;
	}

function appendTextbox(paren,type,nam,size,maxlength,value) {
	var input = document.createElement('input');
	input.className = 'TextboxV2';
	input.type = type;
	input.name = nam;
	input.id = nam;
	input.size = size;
	input.maxLength = maxlength;
	if(value) input.value = value;
	paren.appendChild(input);
	return input;
	}

function appendCheckBox(paren,nam,checked,onClick) {
	var input = document.createElement('input');
	input.type = 'checkbox';
	input.name = nam;
	input.id = nam;
	if(checked) input.checked = true;
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function appendNobr(paren,id,delgg,text) {
	var nobr = document.createElement('nobr');
	appendCheckBox(nobr,id,null,delgg);
	appendText(nobr,text);
	paren.appendChild(nobr);
	appendText(paren,'   ');
	return nobr;
	}

function appendCheckBoxSpan(paren,id,onClick,text) {
	var span = document.createElement('span');
	span.style.whiteSpace = 'nowrap';
	appendCheckBox(span,id,false,onClick);
	appendText(span,text);
	paren.appendChild(span);
	appendText(paren,'   ');
	return span;
	}

function appendOption(select,value,text) {
	var option = document.createElement('option');
	option.value = value;
	appendText(option,text);
	select.appendChild(option);
	return option;
	}

function appendHidden(form,nam,value) {
	var input = document.createElement('input');
	input.type = 'hidden';
	input.name = nam;
	input.id = nam;
	input.value = value;
	form.appendChild(input);
	}

function appendButton(paren,value,onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function insertButton(next,value,onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	input.onclick = onClick;
	insertBefore(next,input);
	return input;
	}

function appendSubmit(paren,value,onClick) {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

function createImage(url,title) {
	var img = document.createElement('img');
	img.src = url;
	img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
	}

function createAltImage(url,alt,title) {
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.title = title;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	return img;
	}

function createImageSpan(url,alt,title,text,bold) {
	var span = document.createElement('span');
	span.title = title;
	var img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	img.align = 'absmiddle'; // WARNING - Obsolete in HTML5.0
	span.appendChild(img);
	appendText(span,text,bold);
	return span;
	}

function createCase(titre,table,width) {
	if(!width) width=120;
	var tr = appendTr(table,'mh_tdpage');
	
	var td = appendTdText(tr,titre,true);
	td.className = 'mh_tdtitre';
	td.width = width;
	
	td = appendTdText(tr,'');
	td.className = 'mh_tdpage';
	return td;
	}

function getMyID(e) {
	var parent = e.parentNode;
	for(var i=0 ; i<parent.childNodes.length ; i++) {
		if(e==parent.childNodes[i])
			return i;
		}
	return -1;
	}

function insertAfter(elt,newElt) {
	var id = getMyID(elt);
	if(id==-1) return;
	if(id<elt.parentNode.childNodes.length-1)
		insertBefore(elt.nextSibling,newElt);
	else
		elt.parentNode.appendChild(newElt);
	}


/*-[functions]------- Fonctions de mise en forme du texte --------------------*/

function aff(nb) {
	return (nb>=0) ? '+'+nb : nb;
	}

function getNumber(str) {
	var nbr = str.match(/\d+/);
	return nbr ? Number(nbr[0]) : Number.NaN;
}

function getNumbers(str) {
	var nbrs = str.match(/-?\d+/g);
	for(var i=0 ; i<nbrs.length ; i++)
		nbrs[i] = Number(nbrs[i]);
	return nbrs;
	}

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g,'');
	}

String.prototype.trim = function() {
    return this.replace(/^\s+/,'').replace(/\s+$/,'');
    }

function epure(texte) {
	return texte.replace(/[àâä]/g,'a').replace(/Â/g,'A')
		.replace(/[ç]/g,'c')
		.replace(/[éêèë]/g,'e')
		.replace(/[ïî]/g,'i')
		.replace(/[ôöõ]/g,'o')
		.replace(/[ùûü]/g,'u');
	}

String.prototype.epure = function () {
	return this.replace(/[àâä]/g,'a').replace(/Â/g,'A')
		.replace(/[ç]/g,'c')
		.replace(/[éêèë]/g,'e')
		.replace(/[ïî]/g,'i')
		.replace(/[ôöõ]/g,'o')
		.replace(/[ùûü]/g,'u');
	}

function bbcode(texte) {
	return texte.replace(/&/g,'&amp;')
		.replace(/"/g,'&quot;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/'/g,'&#146;')
		.replace(/\[b\](.*?)\[\/b\]/g,'<b>$1</b>')
		.replace(/\[i\](.*?)\[\/i\]/g,'<i>$1</i>')
		.replace(/\[img\]([^"]*?)\[\/img\]/g,'<img src="$1" />');
	}


/*-[functions]------- Gestion / Transformation des Dates ---------------------*/

function addZero(i) {
	return (i<10) ? '0'+i : i;
	}

function DateToString(date) {
	return addZero(date.getDate())+'/'+addZero(date.getMonth()+1)
		+'/'+date.getFullYear()+' '+addZero(date.getHours())
		+':'+addZero(date.getMinutes())+':'+addZero(date.getSeconds());
	}

function StringToDate(str) {
	return str.replace(/([0-9]+)\/([0-9]+)/,"$2/$1");
	}


/*-[functions]----------- Calculs expérience / niveau ------------------------*/

function getPXKill(niv) {
	return Math.max(0,10+3*niv-2*nivTroll);
	}

function getPXDeath(niv) {
	return Math.max(0,10+3*nivTroll-2*niv);
	}

function analysePX(niv) {
	niv = niv+'';
	var i = niv.indexOf('+');
	if(i!=-1) // si niv = 'XX+' ??
		return ' --> \u2265 <b>'+getPXKill(niv.slice(0,i))+'</b> PX';
	i = niv.slice(1).indexOf('-'); // si niv = 'XX-YY' ??
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+2));
		if(max==0)
			return ' --> <b>0</b> PX';
		return ' --> <b>'+getPXKill(niv.slice(0,i+1))
			+'</b> \u2264 PX \u2264 <b>'+max+'</b>';
		}
	i = niv.indexOf('='); // ???
	if(i!=-1) {
		var max = getPXKill(niv.slice(i+1));
		return max==0 ? ' --> <b>0</b> PX' : ' --> \u2264 <b>'+max+'</b> PX';
		}
	return ' --> <b>'+getPXKill(niv)+'</b> PX';
	}

function analysePXTroll(niv) {
	var str = analysePX(niv);
	str += '<br/>Vous lui rapportez <b>'+getPXDeath(niv)+'</b> PX.';
	return str;
	}


/*-[functions]------------- Gestion Compos / Champis -------------------------*/
// Refonte totale du code de Zorya

// Elements à implémenter en dur dans MZ2.0
var numQualite = {
	'Très Mauvaise':1,
	'Mauvaise':2,
	'Moyenne':3,
	'Bonne':4,
	'Très Bonne':5
	};

var qualiteNum = [
	'_dummy_',
	'Très Mauvaise',
	'Mauvaise',
	'Moyenne',
	'Bonne',
	'Très Bonne'
	];

var nival = {
	'Abishaii Bleu':19,
	'Abishaii Noir':10,
	'Abishaii Rouge':23,
	'Abishaii Vert':15,
	'Ame-en-peine':8,
	'Amibe Geante':9,
	'Anaconda des Catacombes':8,
	'Ankheg':10,
	'Anoploure Purpurin':36,
	'Araignee Geante':2,
	'Ashashin':35,
	'Balrog':50,
	'Banshee':16,
	'Barghest':36,
	'Basilisk':11,
	'Behemoth':34,
	'Behir':14,
	'Beholder':50,
	'Boggart':3,
	'Bondin':9,
	"Bouj'Dla Placide":37,
	"Bouj'Dla":19,
	'Bulette':19,
	'Caillouteux':1,
	'Capitan':35,
	'Carnosaure':25,
	'Champi-Glouton':3,
	'Chauve-Souris Geante':4,
	'Cheval a Dents de Sabre':23,
	'Chevalier du Chaos':20,
	'Chimere':13,
	'Chonchon':24,
	'Coccicruelle':22,
	'Cockatrice':5,
	'Crasc Medius':17,
	'Crasc Maexus':25,
	'Crasc':10,
	'Croquemitaine':6,
	'Cube Gelatineux':32,
	'Daemonite':27,
	'Diablotin':5,
	'Dindon du Chaos':1,
	'Djinn':29,
	'Ectoplasme':18,
	'Effrit':27,
	"Elementaire d'Air":23,
	"Elementaire d'Eau":17,
	'Elementaire de Feu':21,
	'Elementaire de Terre':21,
	'Elementaire du Chaos':26,
	'Erinyes':7,
	'Esprit-Follet':16,
	'Essaim Craterien':30,
	'Essaim Sanguinaire':25,
	'Ettin':8,
	'Familier':1,
	'Fantome':24,
	'Feu Follet':20,
	'Flagelleur Mental':33,
	'Foudroyeur':38,
	'Fumeux':22,
	'Fungus Geant':9,
	'Fungus Violet':4,
	'Furgolin':10,
	'Gargouille':3,
	'Geant de Pierre':13,
	'Geant des Gouffres':22,
	"Geck'oo Majestueux":40,
	"Geck'oo":15,
	'Glouton':20,
	'Gnoll':5,
	'Gnu Domestique':1,
	'Gnu Sauvage':1,
	'Goblin':4,
	'Goblours':4,
	"Golem d'Argile":15,
	'Golem de cuir':1,
	'Golem de Chair':8,
	'Golem de Fer':31,
	'Golem de mithril':1,
	'Golem de metal':1,
	'Golem de papier':1,
	'Golem de Pierre':23,
	'Gorgone':11,
	'Goule':4,
	'Gowap Apprivoise':1,
	'Gowap Sauvage':1,
	'Gremlins':3,
	'Gritche':39,
	'Grouilleux':4,
	'Grylle':31,
	'Harpie':4,
	'Hellrot':18,
	'Homme-Lezard':4,
	'Hurleur':8,
	'Hydre':50,
	'Incube':13,
	'Kobold':2,
	'Labeilleux':26,
	'Lezard Geant':5,
	'Liche':50,
	'Limace Geante':10,
	'Loup-Garou':8,
	'Lutin':4,
	'Mante Fulcreuse':30,
	'Manticore':9,
	'Marilith':33,
	'Meduse':6,
	'Megacephale':38,
	'Mille-Pattes Geant':14,
	'Mimique':6,
	'Minotaure':7,
	'Molosse Satanique':8,
	'Momie':4,
	'Monstre Rouilleur':3,
	"Mouch'oo Domestique":14,
	"Mouch'oo Majestueux Sauvage":33,
	"Mouch'oo Sauvage":14,
	'Na-Haniym-Heee':0,
	'Necrochore':37,
	'Necromant':39,
	'Necrophage':8,
	'Naga':10,
	'Nuee de Vermine':13,
	"Nuage d'Insectes":7,
	'Ogre':7,
	'Ombre de Roches':13,
	'Ombre':2,
	'Orque':3,
	'Ours-Garou':18,
	'Palefroi Infernal':29,
	'Phoenix':32,
	'Pititabeille':0,
	'Plante Carnivore':4,
	'Pseudo-Dragon':5,
	'Rat Geant':2,
	'Rat-Garou':3,
	'Rocketeux':5,
	'Sagouin':3,
	'Scarabee Geant':4,
	'Scorpion Geant':10,
	'Shai':28,
	'Sirene':8,
	'Slaad':5,
	'Sorciere':17,
	'Spectre':14,
	'Sphinx':30,
	'Squelette':1,
	'Strige':2,
	'Succube':13,
	'Tertre Errant':20,
	'Thri-kreen':10,
	'Tigre-Garou':12,
	'Titan':26,
	'Trancheur':35,
	'Tubercule Tueur':14,
	'Tutoki':4,
	'Vampire':29,
	'Ver Carnivore Geant':12,
	'Ver Carnivore':11,
	'Veskan Du Chaos':14,
	'Vouivre':33,
	'Worg':5,
	'Xorn':14,
	'Yeti':8,
	'Yuan-ti':15,
	'Zombie':2
	}

var tabEM = {
	//Monstre: [Compo exact, Sort, Position, Localisation]
	// AA
	'Basilisk':["Œil d'un ","Analyse Anatomique",3,"Tête"],
	// AE
	'Ankheg':["Carapace d'un","Armure Ethérée",3,"Spécial"],
	'Rocketeux':["Tripes d'un","Armure Ethérée",4,"Corps"],
	// AdA
	'Loup-Garou':["Bras d'un","Augmentation de l'Attaque",3,"Membre"],
	'Titan':["Griffe d'un","Augmentation de l'Attaque",4,"Membre"],
	// AdE
	'Erinyes':["Plume d'une","Augmentation de l'Esquive",3,"Membre"],
	'Palefroi Infernal':["Sabot d'un","Augmentation de l'Esquive",4,"Membre"],
	// AdD
	'Manticore':["Patte d'une","Augmentation des Dégâts",3,"Membre"],
	'Trancheur':["Griffe d'un","Augmentation des Dégâts",4,"Membre"],
	// BAM
	'Banshee':["Peau d'une","Bulle Anti-Magie",3,"Corps"],
	// BuM
	'Essaim Sanguinaire':["Pattes d'un","Bulle Magique",3,"Membre"],
	'Sagouin':["Patte d'un","Bulle Magique",4,"Membre"],
	'Effrit':["Cervelle d'un","Bulle Magique",5,"Tête"],
	// Explo
	'Diablotin':["Cœur d'un","Explosion",3,"Corps"],
	'Chimère':["Sang d'une","Explosion",4,"Corps"],
	'Barghest':["Bave d'un","Explosion",5,"Spécial"],
	// FP
	'Nécrophage':["Tête d'un","Faiblesse Passagère",3,"Tête"],
	'Vampire':["Canine d'un","Faiblesse Passagère",4,"Spécial"],
	// FA
	'Gorgone':["Chevelure d'une","Flash Aveuglant",3,"Tête"],
	'Géant des Gouffres':["Cervelle d'un","Flash Aveuglant",4,"Tête"],
	// Glue
	'Limace Géante':["Mucus d'une","Glue",3,"Spécial"],
	'Grylle':["Gueule d'un","Glue",4,"Tête"],
	// GdS
	'Abishaii Noir':["Serre d'un","Griffe du Sorcier",3,"Membre"],
	'Vouivre':["Venin d'une","Griffe du Sorcier",4,"Spécial"],
	'Araignée Géante':["Mandibule d'une","Griffe du Sorcier",5,"Spécial"],
	// Invi
	"Nuage d'Insectes":["Chitine d'un","Invisibilité",3,"Spécial"],
	'Yuan-ti':["Cervelle d'un","Invisibilité",4,"Tête"],
	'Gritche':["Epine d'un","Invisibilité",5,"Spécial"],
	// Lévitation
	// ???
	// PréM :
	'Ashashin':["Œil d'un ","Précision Magique",3,"Tête"],
	'Crasc':["Œil Rougeoyant d'un ","Précision Magique",4,"Tête"],
	// Proj
	'Yéti':["Jambe d'un","Projection",3,"Membre"],
	'Djinn':["Tête d'un","Projection",4,"Tête"],
	// PuM :
	'Incube':["Épaule musclée d'un","Puissance Magique",3,"Membre"],
	'Capitan':["Tripes Puantes d'un","Puissance Magique",4,"Corps"],
	// Sacro
	'Sorcière':["Verrue d'une","Sacrifice",3,"Spécial"],
	// Télék
	'Plante Carnivore':["Racine d'une","Télékinésie",3,"Spécial"],
	'Tertre Errant':["Cervelle d'un","Télékinésie",4,"Tête"],
	// TP
	'Boggart':["Main d'un","Téléportation",3,"Membre"],
	'Succube':["Téton Aguicheur d'une","Téléportation",4,"Corps"],
	'Nécrochore':["Os d'un","Téléportation",5,"Corps"],
	// VA
	'Abishaii Vert':["Œil d'un","Vision Accrue",3,"Tête"],
	// VL
	'Fungus Géant':["Spore d'un","Vision Lointaine",3,"Spécial"],
	'Abishaii Rouge':["Aile d'un","Vision Lointaine",4,"Membre"],
	// VlC
	'Zombie':["Cervelle Putréfiée d'un","Voir le Caché",3,"Tête"],
	'Shai':["Tripes d'un","Voir le Caché",4,"Corps"],
	'Phoenix':["Œil d'un","Voir le Caché",5,"Tête"],
	// VT
	'Naga':["Ecaille d'un","Vue Troublée",3,"Corps"],
	'Marilith':["Ecaille d'une","Vue Troublée",4,"Membre"],
	// Variables
	'Rat':["d'un"],
	'Rat Géant':["d'un"],
	'Dindon':["d'un"],
	'Goblin':["d'un"],
	'Limace':["d'une"],
	'Limace Géante':["d'une"],
	'Ver':["d'un"],
	'Ver Carnivore':["d'un"],
	'Ver Carnivore Géant':["d'un"],
	'Fungus':["d'un"],
	'Vouivre':["d'une"],
	'Gnu':["d'un"],
	'Scarabée':["d'un"]
	};

var mundiChampi = {
	'Préscientus Reguis':'du Phoenix',
	'Amanite Trolloïde':'de la Mouche',
	'Girolle Sanglante':'du Dindon',
	'Horreur Des Prés':'du Gobelin',
	'Bolet Péteur':'du Démon',
	'Pied Jaune':'de la Limace',
	'Agaric Sous-Terrain':'du Rat',
	'Suinte Cadavre':"de l'Hydre",
	'Cèpe Lumineux':'du Ver',
	'Fungus Rampant':'du Fungus',
	'Nez Noir':'de la Vouivre',
	'Pleurote Pleureuse':'du Gnu',
	'Phytomassus Xilénique':'du Scarabée'
	};

function addInfoMM(node,mob,niv,qualite,effetQ) {
	appendText(node,' ');
	var urlImg = 'http://mountyzilla.tilk.info/scripts_1.1/images/'
		+'Competences/melangeMagique.png';
	var text = ' [-'+(niv+effetQ)+' %]';
	var str = '';
	switch(mob[0]) {
		case 'A':
		case 'E':
		case 'I':
		case 'O':
		case 'U':
			str = "Compo d'";
			break;
		default:
			str = 'Compo de ';
		}
	var title = str+mob+' : -'+niv+'\nQualité '+qualite+' : -'+effetQ;
	var span = createImageSpan(urlImg,'MM:',title,text);
	node.appendChild(span);
	}
	
function addInfoEM(node,mob,compo,qualite,localisation) {
	if(!tabEM[mob]) return;
	var title = 'Composant variable', texte = 'Variable';
	var bold = false;
	if(tabEM[mob].length>1) {
		var pc = 5*(numQualite[qualite]-tabEM[mob][2]);
		if(tabEM[mob][0].indexOf(compo)==-1) pc -= 20;
		if(localisation.indexOf(tabEM[mob][3])==-1) pc -= 5;
		if(pc<-20) return;
		if(pc>=0) bold = true;
		texte = aff(pc)+'%';
		title = texte+" pour l'écriture de "+tabEM[mob][1];
		}
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/'
		+'Competences/ecritureMagique.png';
	var span = createImageSpan(urlImg,'EM:',title,' ['+texte+']',bold);
	node.appendChild(span);
	}

function insererInfosEM(tbody) {
	// lancé par equip, equipgowap
	var trCompos = document.evaluate(
		"./tr[not(starts-with(td[2]/img/@alt,'Pas'))]",
		tbody,null,7,null);
	var strCompos = '';
	for(var i=0 ; i<trCompos.snapshotLength ; i++) {
		var node = trCompos.snapshotItem(i).childNodes[7];
		var str = node.firstChild.textContent;
		var compo = trim(str.slice(0,str.indexOf(" d'un")));
		var mob = trim(str.slice(str.indexOf("d'un")+5));
		// Si non-EM on stoppe le traitement
		if(!tabEM[mob]) continue;
		str = trCompos.snapshotItem(i).childNodes[9].textContent;
		var qualite = trim(str.slice(str.indexOf('Qualit')+9));
		var localisation = trim(str.slice(0,str.indexOf(' |')));
		addInfoEM(node,mob,compo,qualite,localisation);
		}
	}

function getQualite(qualite) {
	var nb = numQualite[qualite];
	return nb ? nb-1 : -1;
	}

function getEM(nom) {
	if(nom.indexOf('[')!=-1)
		nom = trim(nom.substring(0,nom.indexOf('[')));
	if(tabEM[nom]) return nom;
	return '';
	}

// DEBUG ex-fonction composantEM
function compoMobEM(mob) {
	if(!tabEM[mob]) return '';
	if(tabEM[mob].length==1)
		return 'Divers composants '+tabEM[mob][0]+' '+mob+' (Composant Variable)';
	return tabEM[mob][0]+' '+mob+" (Qualité "+qualiteNum[tabEM[mob][2]]
			+") pour l'écriture de "+tabEM[mob][1];
	}

// DEBUG ex-fonction compoEM
function titreCompoEM(mob,compo,localisation,qualite) {
	if(!tabEM[mob]) return '';
	if(tabEM[mob].length==1) return 'Composant variable';
	
	var pc = 5*(tabEM[mob][2]-numQualite[qualite]);
	if(compo.indexOf(tabEM[mob][0])==-1) pc -= 20;
	if(localisation.indexOf(tabEM[mob][3])==-1) pc -= 5;
	
	if(pc>=-20) return pc+"% pour l'écriture de "+tabEM[mob][2];
	return '';
	}

// DEBUG - rétrocompatibilité
function compoEM(mob) {
	// appelé dans libs, vue
	return compoMobEM(mob);
	}
function composantEM(mob,compo,localisation,qualite) {
	// appelé dans libs, tancompo
	return titreCompoEM(mob,compo,localisation,qualite);
	}
//


/*-[functions]-------------- Stockage des Talents ----------------------------*/

arrayTalents = {
	/* Compétences */
	'Acceleration du Metabolisme':'AM',
	'Attaque Precise':'AP',
	'Balayage':'Balayage',
	//'Balluchonnage':'Ballu',
	'Baroufle':'Baroufle',
	'Bidouille':'Bidouille',
	'Botte Secrete':'BS',
	'Camouflage':'Camou',
	'Charger':'Charger',
	'Connaissance des Monstres':'CdM',
	'Construire un Piege':'Piege',
	'Piege a Feu':'PiegeFeu',
	'Piege a Glue':'PiegeGlue',
	'Contre-Attaquer':'CA',
	'Coup de Butoir':'CdB',
	'Course':'Course',
	'Deplacement Eclair':'DE',
	'Dressage':'Dressage',
	'Ecriture Magique':'EM',
	'Frenesie':'Frenesie',
	'Golemologie':'Golemo',
	'Golem de cuir':'GolemCuir',
	'Golem de metal':'GolemMetal',
	'Golem de mithril':'GolemMithril',
	'Golem de papier':'GolemPapier',
	'Grattage':'Grattage',
	'Hurlement Effrayant':'HE',
	'Identification des Champignons':'IdC',
	'Insultes':'Insultes',
	'Lancer de Potions':'LdP',
	'Marquage':'Marquage',
	'Melange Magique':'Melange',
	'Miner':'Miner',
	'Necromancie':'Necro',
	'Painthure de Guerre':'PG',
	'Parer':'Parer',
	'Pistage':'Pistage',
	'Planter un Champignon':'PuC',
	'Regeneration Accrue':'RA',
	'Reparation':'Reparation',
	'Retraite':'Retraite',
	'Rotobaffe':'RB',
	'Shamaner':'Shamaner',
	"S'interposer":'SInterposer',
	'Tailler':'Tailler',
	//'Vol':'Vol',
	/* Sortilèges */
	'Analyse Anatomique':'AA',
	'Armure Etheree':'AE',
	'Augmentation de l´Attaque':'AdA',
	'Augmentation de l´Esquive':'AdE',
	'Augmentation des Degats':'AdD',
	'Bulle Anti-Magie':'BAM',
	'Bulle Magique':'BuM',
	'Explosion':'Explo',
	'Faiblesse Passagere':'FP',
	'Flash Aveuglant':'FA',
	'Glue':'Glue',
	'Griffe du Sorcier':'GdS',
	'Hypnotisme':'Hypno',
	'Identification des tresors':'IdT',
	'Invisibilite':'Invi',
	'Levitation':'Levitation',
	'Precision Magique':'PreM',
	'Projectile Magique':'Projo',
	'Projection':'Proj',
	'Puissance Magique':'PuM',
	'Rafale Psychique':'Rafale',
	'Sacrifice':'Sacro',
	'Siphon des Ames':'Siphon',
	'Telekinesie':'Telek',
	'Teleportation':'TP',
	'Vampirisme':'Vampi',
	'Vision Accrue':'VA',
	'Vision lointaine':'VL',
	'Voir le Cache':'VlC',
	'Vue Troublee':'VT'
	//'':''
	}

// DEBUG - Pour rétrocompatibilité 
function getSortComp(nom,niveau) {
	return getTalent(nom,niveau);
	}
//

function getTalent(nom,niveau) {
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) return 0;
	if(!niveau) var niveau = '';
	if(MY_getValue(numTroll+'.talent.'+nomEnBase+niveau))
		return MY_getValue(numTroll+'.talent.'+nomEnBase+niveau);
	return 0;
	}

function removeAllTalents() {
	for(var talent in arrayTalents) {
		var nomEnBase = arrayTalents[talent];
		if(MY_getValue(numTroll+'.talent.'+nomEnBase)) {
			MY_removeValue(numTroll+'.talent.'+nomEnBase);
			continue;
			}
		var niveau = 1;
		while(MY_getValue(numTroll+'.talent.'+nomEnBase+niveau)) {
			MY_removeValue(numTroll+'.talent.'+nomEnBase+niveau);
			niveau++;
			}
		}
	}

function isProfilActif() { // DEBUG: Réfléchir à l'utilité de cette fonction
	var att = MY_getValue(numTroll+'.caracs.attaque');
	var attbmp = MY_getValue(numTroll+'.caracs.attaque.bmp');
	var attbmm = MY_getValue(numTroll+'.caracs.attaque.bmm');
	var mm = MY_getValue(numTroll+'.caracs.mm');
	var deg = MY_getValue(numTroll+'.caracs.degats');
	var degbmp = MY_getValue(numTroll+'.caracs.degats.bmp');
	var degbmm = MY_getValue(numTroll+'.caracs.degats.bmm');
	var vue = MY_getValue(numTroll+'.caracs.vue');
	var bmvue = MY_getValue(numTroll+'.caracs.vue.bm');
	if(att==null || attbmp==null || attbmm==null || mm==null || deg==null
		|| degbmp==null || degbmm==null || vue==null || bmvue==null)
		return false;
	return true;
	}


/*-[functions]---------------- Gestion des CDMs ------------------------------*/

function getPVsRestants(pv,bless,vue) {
	bless = Number(bless.match(/\d+/)[0]);
	if(bless==0) return null;
	var pvminmax = pv.match(/\d+/g);
	if(bless==95) {
		var pvb = 1;
		var pvh = Math.floor( pvminmax[1]/20 );
		}
	else if(bless==5) {
		var pvb = Math.floor( pvminmax[0]*19/20 );
		var pvh = pvminmax[1];
		}
	else {
		var pvb = Math.ceil( pvminmax[0]*(95-bless) / 100 );
		var pvh = Math.floor( pvminmax[1]*(105-bless) / 100 );
		}
	return vue ? ' ('+pvb+'-'+pvh+')' :
		['Points de Vie restants : ','Entre '+pvb+' et '+pvh];
	}

function insertButtonCdm(nextName,onClick,texte) {
	if(texte==null) texte = 'Participer au bestiaire';
	var nextNode = document.getElementsByName(nextName)[0];

	var espace = document.createTextNode('\t');
	insertBefore(nextNode,espace);

	var button = document.createElement('input');
	button.type = 'button';
	button.className = 'mh_form_submit';
	button.value = texte;
	button.onmouseover = function(){this.style.cursor='pointer';};
	if(onClick)  button.onclick = onClick;
	insertBefore(espace,button);
	return button;
	}

var listeTitres = ['Niveau','Famille','Points de Vie','Blessure',
	'Attaque','Esquive','Dégâts','Régénération','Armure','Vue',
	'Capacité spéciale','Résistance Magique','Autres'];

function createImageTactique(url,id,nom) {
	var img = document.createElement('img');
	img.src = url;
	img.align = 'ABSMIDDLE'; // DEBUG: OBSOLÈTE
	img.id = id;
	img.nom = nom;
	img.onmouseover = showPopupTactique;
	img.onmouseout = hidePopup;
	return img;
}

function createCDMTable(id,nom,donneesMonstre) {
try {
	var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/';
	var table = document.createElement('table');
	var profilActif = isProfilActif();
	table.className = 'mh_tdborder';
	table.border = 0;
	table.cellSpacing = 1;
	table.cellPadding = 4;
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead,'mh_tdtitre');
	var td = appendTdText(tr,
		'CDM de '+nom+ (donneesMonstre[11]!='???' ? ' (N° '+id+')' : ''),
		true
	);
	td.colSpan = 2;
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	for(var i=0 ; i<listeTitres.length-3 ; i++) {
		createCase(listeTitres[i],tbody,80);
	}
	var TypeMonstre = getEM(nom);
	var infosCompo='';
	if(TypeMonstre!='') {
	   infosCompo = compoEM(TypeMonstre);
	}
	var nodes = tbody.childNodes;
	nodes[0].childNodes[1].innerHTML =
		bbcode(donneesMonstre[0])+analysePX(bbcode(donneesMonstre[0]));
	nodes[1].childNodes[1].firstChild.nodeValue = bbcode(donneesMonstre[1]);
	nodes[2].childNodes[1].innerHTML = bbcode(donneesMonstre[2]);
	nodes[3].childNodes[1].innerHTML = bbcode(donneesMonstre[11]);
	nodes[4].childNodes[1].innerHTML = bbcode(donneesMonstre[3]);
	nodes[5].childNodes[1].innerHTML = bbcode(donneesMonstre[4]);
	nodes[6].childNodes[1].innerHTML = bbcode(donneesMonstre[5]);
	nodes[7].childNodes[1].innerHTML = bbcode(donneesMonstre[6]);
	nodes[8].childNodes[1].innerHTML = bbcode(donneesMonstre[7]);
	nodes[9].childNodes[1].innerHTML = bbcode(donneesMonstre[8]);
	if(donneesMonstre[10] && donneesMonstre[10].length>0) {
		td = createCase(listeTitres[10],tbody);
		td.innerHTML = bbcode(donneesMonstre[10]);
		if(donneesMonstre[16] && donneesMonstre[16].length>0) {
			td.appendChild(document.createTextNode(" "));
			if(donneesMonstre[16] == "De zone")
				td.appendChild(createImage(urlImg+"zone.gif","Portée : Zone"));
			else if(donneesMonstre[16] == "Automatique")
				td.appendChild(createImage(urlImg+"automatique.gif","Toucher automatique"));
			else if(donneesMonstre[16] == "Au toucher")
				td.appendChild(createImage(urlImg+"toucher.gif","Pouvoir au toucher"));
			}
		}
	if(donneesMonstre[9] && donneesMonstre[9].length>0)
	{
		td = createCase(listeTitres[11],tbody);
		td.innerHTML = bbcode(donneesMonstre[9]);
		// seuil de résistance du monstre
		var lb = td.getElementsByTagName('b');
		if(lb.length == 1) {
			var mrm = lb[0].firstChild.nodeValue * 1;
			var v = (mrm / mmTroll);
			lb[0].firstChild.nodeValue += " ("
					+ (mrm < mmTroll ? Math.max(10,Math.floor(v*50)) : Math.min(90,Math.floor(100 - 50/v))) + " %)";
		}
	}
	
	if(donneesMonstre[12]>0 || donneesMonstre[13]>=0 || donneesMonstre[14]>0 || donneesMonstre[15].length>0
		|| (donneesMonstre[17] && donneesMonstre[17].length>0)
		|| infosCompo.length>0 || nom.indexOf("Gowap Apprivoisé")==-1)
	{
		
		td = createCase(listeTitres[12],tbody);
		if(donneesMonstre[12]==1)
		{
			td.appendChild(createImage(urlImg+"oeil.gif","Voit le caché"));
		}
		
		if(donneesMonstre[13]==1)
		{
			td.appendChild(createImage(urlImg+"distance.gif","Attaque à distance"));
		}
		else if(donneesMonstre[13]==0)
		{
			td.appendChild(createImage(urlImg+"cac.gif","Corps à corps"));
		}
		
		if(donneesMonstre[14]==1)
		{
			td.appendChild(createImage(urlImg+"1.gif","1 attaque par tour"));
		}
		
		if(donneesMonstre[14]>1 && donneesMonstre[14]<=6)
		{
			td.appendChild(createImage(urlImg+donneesMonstre[14]+".gif",donneesMonstre[14]+" attaque(s) par tour"));
		}
		else if(donneesMonstre[14]>6)
		{
			td.appendChild(createImage(urlImg+"plus.gif","Beaucoup d'attaques par tour"));
		}
		
		if(donneesMonstre[15]=="Lente")
		{
			td.appendChild(createImage(urlImg+"lent.gif","Lent à se déplacer"));
		}
		else if(donneesMonstre[15]=="Normale")
		{
			td.appendChild(createImage(urlImg+"normal.gif","Vitesse normale de déplacement"));
		}
		else if(donneesMonstre[15]=="Rapide")
		{
			td.appendChild(createImage(urlImg+"rapide.gif","Déplacement rapide"));
		}
		
		if(donneesMonstre[17] && donneesMonstre[17].length>0 && donneesMonstre[17]!="Vide")
		{
			td.appendChild(createImage(urlImg+"charge2.gif","Possède de l'équipement ("+donneesMonstre[17]+")"));
		}
		if(infosCompo.length>0)
		{
			td.appendChild(createImage(urlImg+"Competences/ecritureMagique.png",infosCompo));
		}
		
		if(profilActif && nom.indexOf("Gowap Apprivoisé")==-1 && nom.indexOf("Gowap Sauvage")==-1)
		{
			td.appendChild(createImageTactique(urlImg+"calc.png",id,nom));
		}
	}
	
	// pourcentage de blessure
	lb = nodes[3].childNodes[1].getElementsByTagName('b');
	if(lb.length == 1 && donneesMonstre[2].indexOf("-") != -1) {
		var pvs = getPVsRestants(donneesMonstre[2],lb[0].firstChild.nodeValue,true);
		if(pvs)
			lb[0].firstChild.nodeValue += pvs;
	}
	return table;
	}
	catch(e){window.alert('Erreur createCDMTable() :\n'+e);}
}


/*-[functions]------------ Gestion des enchantements -------------------------*/

var listeMonstreEnchantement = null,
	listeEquipementEnchantement = null,
	listeInfoEnchantement = null;

function computeCompoEnchantement()
{
	listeMonstreEnchantement = new Array();
	listeInfoEnchantement = new Array();
	listeEquipementEnchantement = new Array();
	var liste = MY_getValue(numTroll+'.enchantement.liste').split(';');
	for(var i=0;i<liste.length;i++)
	{
		var idEquipement = liste[i]*1;
		if(MY_getValue(numTroll+'.enchantement.'+idEquipement+'.objet')==null || MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur')==null)
			continue;
		var nomEquipement = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.objet');
		var infoEnchanteur = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur').split(';');
		var texteGlobal='';
		for(var j=0;j<3;j++)
		{
			var infoComposant = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.composant.'+j).split(';');
			listeMonstreEnchantement[infoComposant[2]] = 1;
			var array = new Array();
			array[0]=infoComposant[0].replace("Ril","Œil");
			array[1]=infoComposant[1];
			array[2]=infoComposant[2];
			array[3]=getQualite(infoComposant[3]);
			var texte = infoComposant[4].replace("Ril","Œil");
			for(var k=5;k<infoComposant.length;k++)
			{
				texte += ";"+infoComposant[k].replace("Ril","Œil");
			}
			texteGlobal+=texte+'\n';
			texte += " pour l'enchantement d'un(e) "+nomEquipement+" chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
			array[4]=texte;
			listeInfoEnchantement.push(array);
		}
		texteGlobal += "chez l'enchanteur n°"+infoEnchanteur[0]+' ('+infoEnchanteur[1]+'|'+infoEnchanteur[2]+'|'+infoEnchanteur[3]+')';
		listeEquipementEnchantement[idEquipement] = texteGlobal;
	}
	
}

function isEnchant(nom) {
	var monstreEnchant = '';
	for(j in listeInfoEnchantement) {
		monstre = listeInfoEnchantement[j][2].toLowerCase();
		if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
			monstreEnchant=monstre;
			break; // ça permet d'arreter de chercher dans le tableau des EM -> on gagne du temps
		}
	}
	return trim(monstreEnchant);
}

function getInfoEnchantementFromMonstre(nom)
{
	try
	{
		if(!listeMonstreEnchantement)
		{
			computeCompoEnchantement();
		}
		var infosEnchant = '';
		for(j in listeInfoEnchantement) {
			monstre = listeInfoEnchantement[j][2].toLowerCase();
			if((nom+' ').toLowerCase().indexOf(monstre+' ')>=0){		
				if(infosEnchant=='')
					infosEnchant=listeInfoEnchantement[j][4];
				else
					infosEnchant+='\n'+listeInfoEnchantement[j][4];
			}
		}
		return trim(infosEnchant);
	}
	catch(e)
	{
		window.alert(e);
	}
}

function composantEnchant(Monstre,composant,localisation,qualite) {
     var compo='';
	for(var i=0; i<listeInfoEnchantement.length; i++) {
	 	if(listeInfoEnchantement[i][2].toLowerCase()==Monstre.toLowerCase() && 
			listeInfoEnchantement[i][0].toLowerCase()==composant.toLowerCase() && 
			listeInfoEnchantement[i][1].toLowerCase()==localisation.toLowerCase() && 
			listeInfoEnchantement[i][3]<=qualite
		) {
			return listeInfoEnchantement[i][4];
		}
	}
	return compo;     
}

function insertEnchantInfos(tbody) {
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("descendant::img[@alt = 'Composant - Spécial']",
				tbody,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i).nextSibling.nextSibling;
			var nomCompoTotal = link.firstChild.nodeValue.replace(/\240/g,' ');
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf(' ')+1,nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" de Qualité"));
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(' ['));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf('[')+1,nomCompoTotal.indexOf(']'));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre,nomCompo,localisation,getQualite(qualite));
				if(infos.length>0)
				{
					if(link.parentNode == link.nextSibling.parentNode)
					{
						var tmp = link.nextSibling;
						link.parentNode.insertBefore(createImage(urlImg,infos),link.nextSibling);
					}
					else
					{
						link.parentNode.appendChild(createImage(urlImg,infos));
					}
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function computeEnchantementEquipement(fontionTexte,formateTexte)
{
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate("//a[@class='AllLinks' and contains(@href,'TresorHistory.php')]",
				document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		if(nodes.snapshotLength == 0)
			return false;
		var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png';
		for(var i = 0; i < nodes.snapshotLength; i++) 
		{
			var link = nodes.snapshotItem(i);
			var idEquipement = link.getAttribute('href');
			idEquipement = idEquipement.substring(idEquipement.indexOf('ai_IDTresor=')+12);
			idEquipement = parseInt(idEquipement.substring(0,idEquipement.indexOf("'")));
			var nomEquipement = trim(link.firstChild.nodeValue);
			var enchanteur = MY_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur');
			if(!enchanteur || enchanteur == '')
				continue;
			var infos = listeEquipementEnchantement[idEquipement];
			infos=formateTexte(infos);
			if(infos.length>0)
			{
				if(link.parentNode == link.nextSibling.parentNode)
				{
					var tmp = link.nextSibling;
					link.parentNode.insertBefore(fontionTexte(urlImg,infos),link.nextSibling);
				}
				else
				{
					link.parentNode.appendChild(fontionTexte(urlImg,infos));
				}
			}
			MY_setValue(numTroll+'.enchantement.'+idEquipement+'.objet',nomEquipement+' ('+idEquipement+')');
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

/*-[functions]---------------- Analyse Tactique ------------------------------*/


// Les % de toucher
var c = new Array();

// coefficients binomiaux
function cnp(n,k)
{
	if(c[n] != null && c[n][k] != null)
		return c[n][k];
	if(c[n] == null)
		c[n] = new Array();
	if(k==0)
	{
		c[n][k] = 1;
		return 1;
	}
	var result = cnp(n-1,k-1)*n/k; // mouais... k mul+k div
	c[n][k] = result;
	// Roule debug
	//window.console.log('cnp(' + n + ',' + k + ')=' + result);
	return result;
}

// by Dab, à comparer
function binom(n,p) {
	if(p<0 || p>n) return 0;
	
	if(c[n])
		if(c[n][p]) return c[n][p];
	else {
		c[n]=[1];
		c[n][n]=1;
		if(p==0 || p==n) return 1;
		}
	
	if(2*p>n)
		c[n][p]=binom(n,n-p);
	else
		c[n][p]=binom(n-1,p-1)+binom(n-1,p); // k(k-1)/2 additions
	
	return c[n][p];
	}

var coeff = new Array();

function coef(n,p)
{
	if(n==0 && p==0)
		return 1;
	if(p>n*3.5)
		p = 7*n-p
	// roule désactive cache
	 if(coeff[n] != null && coeff[n][p] !=null)
		return coeff[n][p];
	if(coeff[n] == null)
		coeff[n] = new Array();
	var kmax = Math.floor((p-n)/6);
	var x=0;
	for(var k=0;k<=kmax;k++)
	{
		x+=(1-2*(k%2)) * cnp(n,k) * cnp(p-6*k-1,n-1);
	}
	coeff[n][p] = x;
	// Roule debug
	//window.console.log('cnk(' + n + ',' + p + ')=' + x);
	return x;
}

function chanceEsquiveParfaite(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
/*	if(6*a+ba<2*(d+bd))
		return 100;
	if(a+ba>2*(6*d+bd))
		return 0;*/
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(2*Math.max(as+ba,0) < Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	// roule debug
	//window.console.log('chanceEsquiveParfaite, att=' + a + ', esq=' + d + ', ba=' + ba + ', bd=' + bd + ', win=' + win + ', los=' + los);
	return Math.round(100*win/(win+los));
}

function chanceTouche(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>6*d+bd)
		return 100;
	if(6*a+ba<d+bd)
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

function chanceCritique(a,d,ba,bd)
{
	var win = 0;
	var los = 0;
	if(ba==null)
		ba=0;
	if(bd==null)
		bd=0;
	if(a+ba>2*(6*d+bd))
		return 100;
	if(6*a+ba<2*(d+bd))
		return 0;
	for(var ds=d;ds<=6*d;ds++)
	{
		var cd = coef(d,ds);
		for(var as=a;as<=6*a;as++)
		{
			if(Math.max(as+ba,0) > 2*Math.max(ds+bd,0))
				win += cd * coef(a,as);
			else
				los += cd * coef(a,as);
		}
	}
	return Math.round(100*win/(win+los));
}

/***********************************************
Analyse tactique
***********************************************/

function getTexteAnalyse(modificateur,chiffre)
{
	if(chiffre==0)
		return chiffre;
	return modificateur+chiffre;
} 

function getAnalyseTactique(id,nom)
{
	var donneesMonstre = listeCDM[id];
	var needAutres=false;
	var i;
	if(donneesMonstre == null)
		return;
	var array = analyseTactique(donneesMonstre,nom);
	if(array==null)
		return "";
	var str = "<table class='mh_tdborder' border='0' cellspacing='1' cellpadding='4'><tr class='mh_tdtitre'><td>Attaque</td><td>Esq. Parfaite</td><td>Touché</td><td>Critique</td><td>Dégâts</td></tr>";
	for(i=0;i<array.length;i++)
	{
		if(array[i][1]==100 && i>0)
		{
			needAutres=true;
			break;
		}
		if(i==1 && array[i][4]>0)
			str+= "<tr class=mh_tdpage><td><b>"+array[i][0]+"</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][1])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][2])+"%</b></td><td><b>"+getTexteAnalyse(array[i][5],array[i][3])+"%</b></td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==0)
			str+= "<tr class=mh_tdpage><td><i>"+array[i][0]+"</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][1])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][2])+"%</i></td><td><i>"+getTexteAnalyse(array[i][5],array[i][3])+"%<i></td><td><b><i>"+getTexteAnalyse(array[i][6],array[i][4])+"<i></b></td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
	}
	if(needAutres)
	{
		if(i==array.length-1)
			str+= "<tr class=mh_tdpage><td>"+array[i][0]+"</td><td>"+getTexteAnalyse(array[i][5],array[i][1])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][2])+"%</td><td>"+getTexteAnalyse(array[i][5],array[i][3])+"%</td><td><b>"+getTexteAnalyse(array[i][6],array[i][4])+"</b></td></tr>";
		else if(i==1)
			str+= "<tr class=mh_tdpage><td><b>Toutes attaques</b></td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
		else
			str+= "<tr class=mh_tdpage><td>Autres attaques</td><td>100%</td><td>0%</td><td>0%</td><td>0</td></tr>";
	}
	return str+"</table>";
}

function analyseTactique(donneesMonstre,nom) {
	try
	{
	var listeAttaques = [];
	// Roule 16/03/2016 ajout des ParseInt car je récupérais parfois une chaine non numérique :(
	var att = parseInt(MY_getValue(numTroll+".caracs.attaque"), 10);
	var attbmp = parseInt(MY_getValue(numTroll+".caracs.attaque.bmp"), 10);
	var attbmm = parseInt(MY_getValue(numTroll+".caracs.attaque.bmm"), 10);
	var mm = parseInt(MY_getValue(numTroll+".caracs.mm"), 10);
	var deg = parseInt(MY_getValue(numTroll+".caracs.degats"), 10);
	var degbmp = parseInt(MY_getValue(numTroll+".caracs.degats.bmp"), 10);
	var degbmm = parseInt(MY_getValue(numTroll+".caracs.degats.bmm"), 10);
	var vue = parseInt(MY_getValue(numTroll+".caracs.vue"), 10);
	var pv = parseInt(MY_getValue(numTroll+".caracs.pv"), 10);
	var esq = parseInt(Math.max(MY_getValue(numTroll+".caracs.esquive"), 10)-parseInt(MY_getValue(numTroll+".caracs.esquive.nbattaques"),0), 10);
	var esqbonus = parseInt(MY_getValue(numTroll+".caracs.esquive.bm"), 10);
	var arm = parseInt(MY_getValue(numTroll+".caracs.armure"), 10);
	var armbmp = parseInt(MY_getValue(numTroll+".caracs.armure.bmp"), 10);
	var armbmm = parseInt(MY_getValue(numTroll+".caracs.armure.bmm"), 10);
	var modificateurEsquive = '';
	var modificateurArmure = '';
	var modificateurMagie = '';
	var modificateurEsquiveM = '';
	var modificateurArmureM = '';
	var pasDeSR=false;
	var esqM,attM,armM,degM;
	if(donneesMonstre==null || att==null || attbmp==null || attbmm==null || mm==null || deg==null || degbmp==null || degbmm==null || vue==null ||pv==null || esq==null || arm==null)
		return null;
	
	var td = document.createElement('td')
	td.innerHTML = bbcode(donneesMonstre[4]); // sans déconner ? C'est quoi cette histoire ?
	var esqM = 0;
	try
	{
		esqM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		esqM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquive = '<';
		modificateurArmure = '<';
		modificateurMagie = '<';
	}
	
	td.innerHTML = bbcode(donneesMonstre[3]);
	var attM = 0;
	try
	{
		attM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		attM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurEsquiveM = '>';
		modificateurArmureM = '>';
	}
	
	td.innerHTML = bbcode(donneesMonstre[5]);
	var degM = 0;
	try
	{
		degM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		degM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmureM = '>';
	}
	
	td.innerHTML = bbcode(donneesMonstre[7]);
	var armM = 0;
	try
	{
		armM=Math.ceil(td.getElementsByTagName('b')[0].firstChild.nodeValue);
	} 
	catch(e)
	{
		armM=Math.ceil(parseInt(td.firstChild.nodeValue));
		modificateurArmure = '<';
	}
	
	var coeffSeuil = 0.95;
	try
	{
		td.innerHTML = bbcode(donneesMonstre[9]);
		var rm = parseInt(td.getElementsByTagName('b')[0].firstChild.nodeValue);
		var v = (rm / mm);
		var seuil = (rm < mm ? Math.max(10,Math.floor(v*50)) : Math.min(90,Math.floor(100 - 50/v)));
		coeffSeuil = (200-seuil)/200;
	}
	catch(e) 
	{
		modificateurMagie = '<';
		pasDeSR = true;
	}
	
	var chanceDEsquiveParfaite = chanceEsquiveParfaite(att,esqM,attbmp+attbmm,0);
	var chanceDeTouche = chanceTouche(att,esqM,attbmp+attbmm,0);
	var chanceDeCritique = chanceCritique(att,esqM,attbmp+attbmm,0);
	// roule debug
	//window.console.log('Attaque normale troll sur monstre, att=' + att + ', esqM=' + esqM + ', attbmp=' + attbmp + ', attbmm=' + attbmm 
	//	+ ', chanceDEsquiveParfaite=' + chanceDEsquiveParfaite + ', chanceDeTouche=' + chanceDeTouche + ', chanceDeCritique=' + chanceDeCritique);
	var degats = (((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-armM,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-armM,1))/100);
	//str += "Attaque normale : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmp+degbmm-arm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmp+degbmm-arm,1))/100);	
	listeAttaques.push(new Array("Attaque normale",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	if(getSortComp("Vampirisme")>0)
	{
		var pour = getSortComp("Vampirisme");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(deg*2/3),esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nVampirisme : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Vampirisme",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Botte Secrète")>0)
	{
		var pour = getSortComp("Botte Secrète");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(Math.floor(2*att/3),esqM,Math.floor((attbmp+attbmm)/2),0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5/2)*2+Math.floor((degbmp+degbmm)/2)-Math.floor(armM/2),1)))/100;
		//str += "\nBotte Secrète : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Botte Secrète",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Rafale Psychique")>0)
	{
		var pour = getSortComp("Rafale Psychique");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(deg*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Rafale Psychique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Explosion")>0)
	{
		var pour = getSortComp("Explosion");
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = Math.round(100*pour/100);
		chanceDeCritique = Math.round(0*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(1+deg/2+pv/20)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(1+deg/2+pv/20)*1.5)*2+degbmm,1)))/100;
		//str += "\nRafale Psychique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Explosion",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,'',pasDeSR?modificateurMagie:''));
	}
	if(getSortComp("Projectile Magique")>0)
	{
		var pour = getSortComp("Projectile Magique");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(vue,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(vue,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(vue,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(vue/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(vue/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nProjectile Magique : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Projectile Magique",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Frénésie")>0)
	{
		var pour = getSortComp("Frénésie");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		degats = Math.round(((chanceDeTouche-chanceDeCritique)*2*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*2*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nFrénésie : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Frénésie",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Charger")>0)
	{
		var pour = getSortComp("Charger");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm+attbmp,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm+attbmp,0)*pour/100);
		var degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritique*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1)))/100;
		//str += "\nCharge : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Charger",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Griffe du Sorcier")>0)
	{
		var pour = getSortComp("Griffe du Sorcier");
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(att,esqM,attbmm,0)*pour/100);
		chanceDeTouche = Math.round(chanceTouche(att,esqM,attbmm,0)*pour/100);
		chanceDeCritique = Math.round(chanceCritique(att,esqM,attbmm,0)*pour/100);
		degats = Math.round(coeffSeuil*((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(deg/2)*2+degbmm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(deg/2)*1.5)*2+degbmm,1)))/100;
		//str += "\nGriffe du Sorcier : Touché "+chanceDeTouche+"% Critique "+chanceDeCritique+"% Dégâts "+(degats);
		listeAttaques.push(new Array("Griffe du Sorcier",chanceDEsquiveParfaite,chanceDeTouche,chanceDeCritique,degats,modificateurEsquive,modificateurMagie));
	}
	if(getSortComp("Attaque Précise",1)>0)
	{
		var niveau = 5;
		var oldPour = 0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche = 0;
		var chanceDeCritique = 0;
		degats = 0;
		while(niveau>0)
		{
			var pour = getSortComp("Attaque Précise",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(Math.min(att+3*niveau,Math.floor(att*1.5)),esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((deg*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(deg*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nAttaque Précise : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Attaque Précise",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	if(getSortComp("Coup de Butoir",1)>0)
	{
		var niveau = 5;
		var oldPour =0;
		var chanceDEsquiveParfaite = 0;
		var chanceDeTouche=0;
		var chanceDeCritique=0;
		degats=0;
		while(niveau>0)
		{
			var pour = getSortComp("Coup de Butoir",niveau);
			if(pour>oldPour)
			{
				var chanceDEsquiveParfaiteNiveau = chanceEsquiveParfaite(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeToucheNiveau = chanceTouche(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				var chanceDeCritiqueNiveau = chanceCritique(att,esqM,attbmm+attbmp,0)*(pour-oldPour)/100;
				chanceDEsquiveParfaite += chanceDEsquiveParfaiteNiveau;
				chanceDeTouche += chanceDeToucheNiveau;
				chanceDeCritique += chanceDeCritiqueNiveau;
				degats += (((chanceDeToucheNiveau-chanceDeCritiqueNiveau)*Math.max((Math.min(Math.floor(deg*1.5),deg+3*niveau)*2+degbmp+degbmm-armM),1)+chanceDeCritiqueNiveau*Math.max(Math.floor(Math.min(Math.floor(deg*1.5),deg+3*niveau)*1.5)*2+degbmm+degbmp-armM,1))/100);
				oldPour = pour;
			}
			niveau--;
		}
		//str += "\nCoup de Butoir : Touché "+(Math.round(chanceDeTouche*100)/100)+"% Critique "+(Math.round(chanceDeCritique*100)/100)+"% Dégâts "+Math.round(degats*100)/100;
		listeAttaques.push(new Array("Coup de Butoir",chanceDEsquiveParfaite,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	}
	listeAttaques.sort(function(a,b){var diff = parseInt(100*b[4])-parseInt(100*a[4]);if(diff==0) return parseInt(b[1])-parseInt(a[1]); return diff;});
	if(nom.toLowerCase().indexOf("mégacéphale")==-1)
	{
		chanceDEsquiveParfaite = Math.round(chanceEsquiveParfaite(attM,esq,0,esqbonus));
		chanceDeTouche = Math.round(chanceTouche(attM,esq,0,esqbonus));
		chanceDeCritique = Math.round(chanceCritique(attM,esq,0,esqbonus));
	}
	else
	{
		chanceDEsquiveParfaite = 0;
		chanceDeTouche = 100;
		chanceDeCritique = 0;
	}
	degats = Math.round(((chanceDeTouche-chanceDeCritique)*Math.max(Math.floor(degM)*2-arm,1)+chanceDeCritique*Math.max(Math.floor(Math.floor(degM)*1.5)*2-arm*2-armbmm-armbmp,1)))/100;

	listeAttaques.unshift(new Array("Monstre",Math.round(chanceDEsquiveParfaite*100)/100,Math.round(chanceDeTouche*100)/100,Math.round(chanceDeCritique*100)/100,Math.round(degats*100)/100,modificateurEsquive,modificateurArmure));
	return listeAttaques;
	}
	catch(e) { window.alert(e);}
	}

// x~~x	marque pour s'y retrouver sous l'éditeur

/*
 * This file is part of MountyZilla (http://mountyzilla.tilk.info/),
 * published under GNU License v2.
 *
 * Patch :
 * gestion des missions terminées
 */
 
 // x~x mission_liste

function checkLesMimis() {
	try {
		var titresMimis = document.evaluate(
			"//div[@class='mh_titre3']/b/a[contains(@href,'Mission_')]",
			document, null, 7, null
		);
		var obMissions = JSON.parse(MY_getValue(numTroll+'.MISSIONS'));
	} catch(e) {
		window.console.error('[MZ mission_liste] Erreur initialisation:\n'+e);
		return;
	}
	
	var enCours = {};
	for(var i=0 ; i<titresMimis.snapshotLength ; i++) {
		var num = titresMimis.snapshotItem(i).textContent.match(/\d+/)[0];
		enCours[num] = true;
	}
	
	for(var numMimi in obMissions) {
		if(!enCours[numMimi]) {
			delete obMissions[numMimi];
		}
	}
	MY_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
}

function do_mission_liste() {
	checkLesMimis();
}

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

// x~x actions

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
	if(MY_getValue("SEND_IDT") == "non")
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
	if(MY_getValue('CONFIRMEDECALAGE')!='true') {
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

function do_actions() {
	start_script(31);
	dispatch();
	displayScriptTime();
}

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

// x~x pre-enchant

/* 2013-08-19 : correction auto syntaxe alert */

var combobox=null;

function changeObject()
{
	if(!combobox)
		return ;
	var id = combobox.options[combobox.selectedIndex].value;
	var texte = combobox.options[combobox.selectedIndex].firstChild.nodeValue;
	if(!id || id=="")
	{
		MY_removeValue(numTroll+".enchantement.lastEquipement");
		return;
	}
	MY_setValue(numTroll+".enchantement.lastEquipement",id+";"+texte);
}

function treatePreEnchantement() {
	var input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")=="hidden")
	{
		return false;
	}
	MY_setValue(numTroll+".enchantement.lastEnchanteur",input.getAttribute("value"));
	combobox = document.evaluate("//select[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!combobox)
	{
		return true;
	}
	combobox.addEventListener('change', changeObject, true);
	return true;
}

function treateEnchantement() {
	var input = document.evaluate("//input[@name='ai_IDTE']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")!="hidden")
	{
		return false;
	}
	var idEquipement = input.getAttribute("value");
	var nomEquipement = "Equipement inconnu ("+idEquipement+")";
	var enchanteur = MY_getValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	if(enchanteur && enchanteur != null)
		return true;
	input = document.evaluate("//input[@name='ai_IDLI']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!input || input.getAttribute("type")!="hidden")
	{
		return false;
	}
	var idEnchanteur = input.getAttribute("value");
	
	var nodes = document.evaluate(
			"//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3)
		return;
	for(var i=0;i<3;i++)
	{
		var texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une "," d'un ");
		var compo = texte.substring(0,texte.indexOf(" d'un "));
		var monstre = texte.substring(texte.indexOf(" d'un ")+6,texte.indexOf(" d'au minimum"));
		var qualite = texte.substring(texte.indexOf("Qualité ")+8,texte.indexOf(" ["));
		var localisation = texte.substring(texte.indexOf("[")+1,texte.indexOf("]"));
		//window.alert(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(numTroll+".enchantement."+idEquipement+".composant."+i,compo+";"+localisation+";"+monstre.replace(/ Géante?/,"")+";"+qualite+";"+trim(nodes.snapshotItem(i).nodeValue));
	}
	MY_setValue(numTroll+".enchantement."+idEquipement+".enchanteur",idEnchanteur+";"+MY_getValue(numTroll+".position.X")+";"+MY_getValue(numTroll+".position.Y")+";"+MY_getValue(numTroll+".position.N"));
	MY_setValue(numTroll+".enchantement."+idEquipement+".objet",nomEquipement);
	var liste = MY_getValue(numTroll+".enchantement.liste");
	if(!liste || liste=="")
	{
		MY_setValue(numTroll+".enchantement.liste",idEquipement);
	}
	else
		MY_setValue(numTroll+".enchantement.liste",liste+";"+idEquipement);
}

function do_pre_enchant() {
	start_script(60);
	if(!treatePreEnchantement())
		treateEnchantement();
	displayScriptTime();
}

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

// x~x enchant

/* 2013-08-19 : correction auto syntaxe alert */

function treateEnchantement() {
	var idEnchanteur = MY_getValue(numTroll+".enchantement.lastEnchanteur");
	var infoEquipement = MY_getValue(numTroll+".enchantement.lastEquipement");
	if(!idEnchanteur || idEnchanteur=="" || !infoEquipement || infoEquipement=="")
		return;
	var tab = infoEquipement.split(";");
	if(tab.length<2)
		return;
	var idEquipement = tab[0];
	var nomEquipement = tab[1];
	for(var i=2;i<tab.length;i++)
		nomEquipement += ";"+tab[i];
	
	var nodes = document.evaluate(
			"//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3)
		return;
	for(var i=0;i<3;i++)
	{
		var texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une "," d'un ");
		var compo = texte.substring(0,texte.indexOf(" d'un "));
		var monstre = texte.substring(texte.indexOf(" d'un ")+6,texte.indexOf(" d'au minimum"));
		monstre = monstre.replace(/ Géante?/,"");
		var qualite = texte.substring(texte.indexOf("Qualité ")+8,texte.indexOf(" ["));
		var localisation = texte.substring(texte.indexOf("[")+1,texte.indexOf("]"));
		//window.alert(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MY_setValue(numTroll+".enchantement."+idEquipement+".composant."+i,compo+";"+localisation+";"+monstre.replace(/ Géante?/,"")+";"+qualite+";"+trim(nodes.snapshotItem(i).nodeValue));
	}
	MY_setValue(numTroll+".enchantement."+idEquipement+".enchanteur",idEnchanteur+";"+MY_getValue(numTroll+".position.X")+";"+MY_getValue(numTroll+".position.Y")+";"+MY_getValue(numTroll+".position.N"));
	MY_setValue(numTroll+".enchantement."+idEquipement+".objet",nomEquipement);
	var liste = MY_getValue(numTroll+".enchantement.liste");
	if(!liste || liste=="")
	{
		MY_setValue(numTroll+".enchantement.liste",idEquipement);
	}
	else
		MY_setValue(numTroll+".enchantement.liste",liste+";"+idEquipement);
}

function do_enchant() {
	start_script(60);

	treateEnchantement();
	MY_removeValue(numTroll+".enchantement.lastEquipement");
	MY_removeValue(numTroll+".enchantement.lastEnchanteur");
	displayScriptTime();
}

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

// x~x myevent

// Script désactivé en attendant la màj vers le nouveau système de missions.
function do_myevent() {
}

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

// x~x malus

/* v1.4 - 2014-01-06
 * - Gestion des sorts double composante
 * v1.4.1 - 2014-01-22
 * - Correction décumul
 * TODO
 * - Identifier la position de "PV" dans l'ordre MH
 */

var listeBM;


/* [functions]                     Utilitaires                                  */

function decumul(bmt,nbr) {
	var bmr;
	if(!nbr || nbr<2) bmr = bmt;
	else if(nbr==2) bmr = parseInt(0.67*bmt);
	else if(nbr==3) bmr = parseInt(0.40*bmt);
	else if(nbr==4) bmr = parseInt(0.25*bmt);
	else if(nbr==5) bmr = parseInt(0.15*bmt);
	else bmr = parseInt(0.1*bmt);
	if(bmt<0) return Math.min(-1,bmr);
	return Math.max(1,bmr);
	}

function triecaracs(a,b) { // version Yoyor, mod by Dab
	switch( a ) {
	case 'ATT':
		return -1;
	case 'ESQ': 
		if(b=='ATT') return 1;
		return -1;
	case 'DEG': 
		switch( b ) {
			case 'ATT':
			case 'ESQ':
				return 1;
			default:
				return -1;
			}
	case 'REG':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
				return 1;
			default:
				return -1;
			}
	case 'Vue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
				return 1;
			default:
				return -1;
			}
	case 'TOUR':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
				return 1;
			default:
				return -1;
			}
	case 'Armure':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
				return 1;
			default:
				return -1;
			}
	case 'RM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
				return 1;
			default:
				return -1;
			}
	case 'MM':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
				return 1;
			default:
				return -1;
			}
	case 'Concentration':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
				return 1;
			default:
				return -1;
			}	
	case 'Fatigue':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
				return 1;
			default:
				return -1;
			}
	case "Dés d'attaque":
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
				return 1;
			default:
				return -1;
			}
	case 'Dés de dégâts':
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
			case "Dés d'attaque":
				return 1;
			default:
				return -1;
			}
	default :
		switch( b ) {
			case 'ATT':
			case 'ESQ':
			case 'DEG':
			case 'REG':
			case 'Vue':
			case 'TOUR':
			case 'Armure':
			case 'RM':
			case 'MM':
			case 'Concentration':
			case 'Fatigue':
			case "Dés d'attaque":
			case 'Dés de dégâts':
				return 1;
			default:
				return -1;
			}
		}
	}


/* [functions]              Fonctions hide / display                            */

function toggleDetails() {
	if(MY_getValue('BMDETAIL')!='false') {
		MY_setValue('BMDETAIL','false');
		var trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';	
		}
	else {	
		MY_setValue('BMDETAIL','true');
		var trlist = document.getElementsByClassName('mh_tdpage BilanSomme');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style.display = 'none';
		trlist = document.getElementsByClassName('mh_tdpage BilanDetail');
		for(var i=0 ; i<trlist.length ; i++)
			trlist[i].style = '';
		}
	}

function toggleBMList() {
	if(MY_getValue('BMHIDELIST')=='true') {
		MY_setValue('BMHIDELIST','false');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style = '';
		document.getElementsByTagName('thead')[0].style = '';
		document.getElementById('trhelp').style = '';
		}
	else {
		MY_setValue('BMHIDELIST','true');
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		document.getElementById('trhelp').style.display = 'none';
		}
	}

function setDisplayBM() {
	if(!listeBM) return;
	
	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleBMList;
		}
	
	var tfoot = document.getElementsByTagName('tfoot')[0];
	var tr = document.evaluate("./tr/td/text()[contains(.,'décumul')]/../..",
								tfoot, null, 9, null).singleNodeValue;
	tr.id = 'trhelp';
	
	if(MY_getValue('BMHIDELIST')=='true') {
		for(var i=0 ; i<listeBM.snapshotLength ; i++)
			listeBM.snapshotItem(i).style.display = 'none';
		document.getElementsByTagName('thead')[0].style.display = 'none';
		tr.style.display = 'none';
		}
	}


/* [functions]                 Fonction principale                              */

function traiteMalus() {
	var mainTab = document.getElementsByTagName('table')[0];
	listeBM = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	if(listeBM.snapshotLength==0) return;
	
	/* Suppression des BM de fatigue stockés */
	if(MY_getValue(numTroll+'.bm.fatigue'))
		MY_removeValue(numTroll+'.bm.fatigue');
	
	/* Extraction des données */
	var uniListe = [], listeDurees = {}, listeDecumuls = {};
	var nb = 0;
	while(nb<listeBM.snapshotLength) {
		tr = listeBM.snapshotItem(nb); nb++;
		var effetsT = tr.childNodes[5].textContent.split(' | ');
		var phymag = tr.childNodes[9].textContent;
		var duree = Number(tr.childNodes[11].textContent.match(/\d+/)[0]);
		var type = tr.childNodes[3].textContent, nom;
		// si c'est un type à décumul
		switch(type) {
			case 'Potion':
			case 'Parchemin':
			case 'Sortilège':
			case 'Capacité Spéciale':
				nom = tr.childNodes[1].textContent+phymag;
				break;
			default:
				nom = 'pasdedecumul';
			}
		if(nom.indexOf('Amnésie')!=-1) // !! Amnésie = Capa, mais pas décumulée
			nom = 'pasdedecumul';
		
		uniListe[nb] = {
			'duree':duree,
			'nom':nom, // permet de gérer le non décumul des sorts à double composante
			'caracs':{}
			}
		for(var i=0 ; i<effetsT.length ; i++) {
			if(effetsT[i].indexOf(':')==-1) continue;
			// structure : liste[nb]=[duree , nom , [type ,] Array[caracs] ]
			// nom = 'pasdedecumul' si pas de décumul
			var carac = trim( effetsT[i].substring(0,effetsT[i].indexOf(':')) ) ;
			if(carac=='ATT' || carac=='DEG' || carac=='Armure')
				uniListe[nb]['type'] = phymag;
			var bm = Number(effetsT[i].match(/-?\d+/)[0]);
			uniListe[nb]['caracs'][carac] = bm;
			listeDurees[duree] = true;
			}
		}
	
	/* Gestion des décumuls et cumuls des durées */
	var toursGeres = [];
	for(var d in listeDurees) toursGeres.push(d);
	toursGeres.sort( function (a,b){return b-a;} );
	// pour sauvegarder les bm de fatigue
	var strfat = '';
	// Pour affichage & adpatation à footable.js (statique)
	var thead = document.getElementsByTagName('thead')[0];
	var nbHidden = document.evaluate("./tr/th[@style='display: none;']",
									thead, null, 7, null).snapshotLength;
	var tfoot = document.getElementsByTagName('tfoot')[0];
	
	for(var i=0 ; i<toursGeres.length ; i++) {
		var tour = toursGeres[i];
		var effetsCeTour = {}; decumulsCeTour = {};
		for(var nb=1 ; nb<uniListe.length ; nb++) {
			if(uniListe[nb]['duree']<toursGeres[i]) // si durée pvr < durée analysée, on passe
				continue;
			var nom = uniListe[nb]['nom'];
			if(nom!='pasdedecumul') {
				if(decumulsCeTour[nom]==null) decumulsCeTour[nom] = 0;
				decumulsCeTour[nom]++;
				}
			for(var carac in uniListe[nb]['caracs']) {
				var bm = uniListe[nb]['caracs'][carac];
				if(carac=='ATT' || carac=='DEG' || carac=='Armure') {
					var type = uniListe[nb]['type'];
					if(!effetsCeTour[carac])
						effetsCeTour[carac] = {'Physique':0, 'Magie':0};
					if(nom=='pasdedecumul')
						effetsCeTour[carac][type] += bm;
					else
						effetsCeTour[carac][type] += decumul(bm,decumulsCeTour[nom]);
					}
				else {
					if(!effetsCeTour[carac]) effetsCeTour[carac]=0;
					if(nom=='pasdedecumul' || carac=='Fatigue')
						effetsCeTour[carac] += bm;
					else if(carac=='TOUR') // les durees se comptent en demi-minutes dans MH
						effetsCeTour[carac] += decumul(2*bm,decumulsCeTour[nom])/2;
					else 
						effetsCeTour[carac] += decumul(bm,decumulsCeTour[nom]);
					}
				}
			}
		
		/* Création du bilan du tour */
		var texteD = '', texteS = '';
		var caracGerees = [];
		for(var k in effetsCeTour) caracGerees.push(k);
		caracGerees.sort( triecaracs );
		
		for(var j=0 ; j<caracGerees.length ; j++) {
			var carac = caracGerees[j], str = '';
			
			switch( carac ) {
				case 'ATT':
				case 'DEG':
				case 'Armure':
					var phy = effetsCeTour[carac]['Physique'];
					var mag = effetsCeTour[carac]['Magie'];
					texteD += (phy || mag)? ' | '+carac+' : '+aff(phy)+'/'+aff(mag) : '';
					texteS += (phy+mag) ? ' | '+carac+' : '+aff(phy+mag) : '';
					break;
				case 'TOUR':
					str = effetsCeTour[carac]? ' | TOUR : '+aff( effetsCeTour[carac] )+' min' : '';
					break;
 				case 'Fatigue':
					strfat += toursGeres[i]+'-'+effetsCeTour[carac]+';';
				case 'PV':
				case 'ESQ':
				case 'REG':
				case 'Vue':
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] ) : '';
					break;
				default:
					str = effetsCeTour[carac]? ' | '+carac+' : '+aff( effetsCeTour[carac] )+' %' : '';
				}
			if(str) {
				texteD += str;
				texteS += str;
				}
			}
		
		/* Affichage */
		// Si rien à afficher on passe
		if(!texteD) continue;
		// Si BMM+BMP=0
		texteS = texteS ? texteS.substring(3) : 'Aucun effet';
		var tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanDetail');
		if(MY_getValue('BMDETAIL')=='false')
			tr.style.display = 'none';
		var td = appendTdText(tr,texteD.substring(3));
		td.colSpan = 5-nbHidden;
		var txttour = toursGeres[i]+' Tour';
		if(toursGeres[i]>1) txttour += 's';
		appendTdText(tr,txttour);
		
		tr = insertTr(tfoot.childNodes[2],'mh_tdpage BilanSomme');
		if(MY_getValue('BMDETAIL')!='false')
			tr.style.display = 'none';
		td = appendTdText(tr,texteS);
		td.colSpan = 5-nbHidden;
		appendTdText(tr,txttour);
		}
	
	/* mise en place toggleDetails */
	tfoot.style.cursor = 'pointer';
	tfoot.onclick = toggleDetails;
	
	/* Stockage fatigue : tour-fatigue;tour-fatigue;... */
	if(strfat)
		MY_setValue(numTroll+'.bm.fatigue',strfat);
}

function do_malus() {
	try {
	start_script();
	traiteMalus();
	setDisplayBM();
	displayScriptTime();
	}
	catch(e) {window.alert(e)};
}

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

// x~x mouches

var mainTab, tr_mouches;

function initialiseMouches() {
// Lanceur global
	try {
		mainTab = document.getElementById('mouches');
		tr_mouches = document.evaluate('./tbody/tr', mainTab, null, 7, null);
	} catch(e) {
		avertissement('Erreur MZ:<br />Consulter la console.');
		window.console.error('Erreur MZ mouches:\n'+e);
		return;
	}
	if(mainTab===void(0) || tr_mouches.snapshotLength==0) { return; }
	
	setDisplayMouches();
	traiteMouches();
}

function setDisplayMouches() {
// Initialise l'affichage / l'effacement du détail des mouches
	var titre = document.getElementById('titre2');
	if(titre) {
		titre.style.cursor = 'pointer';
		titre.onclick = toggleMouches;
	}
	
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(tfoot) {
		tfoot.style.cursor = 'pointer';
		tfoot.onclick = toggleMouches;
	}
	
	if(MY_getValue('HIDEMOUCHES')=='true') {
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function toggleMouches() {
// Handler pour afficher / masquer les détasil
	if(MY_getValue('HIDEMOUCHES')=='true') {
		MY_setValue('HIDEMOUCHES','false');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = '';
		}
		document.getElementsByTagName('thead')[0].style.display = '';
	} else {
		MY_setValue('HIDEMOUCHES','true');
		for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
			tr_mouches.snapshotItem(i).style.display = 'none';
		}
		document.getElementsByTagName('thead')[0].style.display = 'none';
	}
}

function traiteMouches() {
// Traitement complet: présence et effets des mouches
	var listeTypes = {}, effetsActifs = {};
	
	for(var i=0 ; i<tr_mouches.snapshotLength ; i++) {
		var tr = tr_mouches.snapshotItem(i);
	
		// La mouche est-elle présente?
		var etat = document.evaluate(
			'./img',
			tr.cells[6], null, 9, null
		).singleNodeValue.alt;
		if(etat!='La Mouche est là') { continue; }
		// Extraction du type de mouche
		var type = trim(tr.cells[3].textContent);
		if(!listeTypes[type]) {
			listeTypes[type] = 1;
		} else {
			listeTypes[type]++;
		}
		
		// La mouche a-t-elle un effet?
		var effet = trim(tr.cells[2].textContent);
		if(etat!='La Mouche est là' || !effet) { continue; }
		// Si oui, extraction des effets (multiples pour pogées)
		var caracs = effet.split(' | ');
		for(var j=0 ; j<caracs.length ; j++) {
			var carac = caracs[j].substring(0,caracs[j].indexOf(':')-1);
			var valeur = Number(caracs[j].match(/-?\d+/)[0]);
			if(effetsActifs[carac]===void(0)) {
				effetsActifs[carac] = valeur;
			} else {
				effetsActifs[carac] += valeur;
			}
		}
	}
	
	// Extraction Effet total et affichage des différences à la normale
	var tfoot = document.getElementsByTagName('tfoot')[0];
	if(!tfoot) { return; }
	var nodeTotal = document.evaluate(
		".//b[contains(./text(),'Effet total')]",
		tfoot, null, 9, null
	).singleNodeValue.nextSibling;
	var effetsTheoriques = nodeTotal.nodeValue.split('|');
	var texte = ' ';
	for(var i=0 ; i<effetsTheoriques.length ; i++) {
		if(texte.length>1) { texte += ' | '; }
		var carac = trim(
			effetsTheoriques[i].substring(0,effetsTheoriques[i].indexOf(':')-1)
		);
		var valeur = effetsTheoriques[i].match(/-?\d+/)[0];
		if(effetsActifs[carac]!==void(0) && effetsActifs[carac]==valeur) {
			texte += effetsTheoriques[i];
		} else {
			texte += '<b>'+carac+' : '+aff(effetsActifs[carac]);
			if(carac=='TOUR') { texte += ' min'; }
			texte += '</b>';
		}
	}
	var span = document.createElement('span');
	span.innerHTML = texte;
	nodeTotal.parentNode.replaceChild(span,nodeTotal);
	
	// Affichage des différences du nombre de mouches de chaque type
	var mouchesParType = document.evaluate(
		"./tr/td/ul/li/text()",
		tfoot, null, 7, null
	);
	for(var i=0 ; i<mouchesParType.snapshotLength ; i++) {
		var node = mouchesParType.snapshotItem(i);
		var mots = node.nodeValue.split(' ');
		var type = mots.pop();
		if(!listeTypes[type]) {
			node.nodeValue += ' (0 présente)';
		} else if(mots[0]!=listeTypes[type]) {
			if(listeTypes[type]==1) {
				node.nodeValue += ' (1 présente)';
			} else {
				node.nodeValue += ' ('+listeTypes[type]+' présentes)';
			}
		}
	}
}

function do_mouches() {
	start_script();
	initialiseMouches();
	displayScriptTime();
}

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

// x~x equipgowap

var popup;

function initPopupEquipgowap() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopupEquipgowap(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
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
	img.addEventListener("mouseover", showPopupEquipgowap,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}


function treateGowaps() {
	//On récupère les gowaps possédants des composants
	var tbodys = document.evaluate(
			"//tr[@class='mh_tdpage_fo']/descendant::img[@alt = 'Composant - Spécial']/../../..",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < tbodys.snapshotLength; j++) {
		var tbody = tbodys.snapshotItem(j);
		var id_gowap = currentURL.substring(currentURL.indexOf("?ai_IdFollower=")+15)*1;
		//insertButtonComboDB(tbody, 'gowap', id_gowap,'mh_tdpage_fo');
		if(MY_getValue("NOINFOEM") != "true")
			insertEMInfos(tbody);
		if(MY_getValue(numTroll+".enchantement.liste") && MY_getValue(numTroll+".enchantement.liste")!="" )
			insertEnchantInfos(tbody);
	}
}

function treateChampi() {
	if(MY_getValue("NOINFOEM") == "true")
		return false;
	var nodes = document.evaluate("//img[@alt = 'Champignon - Spécial']/../a/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
			var node = nodes.snapshotItem(i);
			var texte = trim(node.nodeValue.replace(/\240/g, " "));
			if(texte.indexOf("*")!=-1)
				texte = texte.substring(0,texte.lastIndexOf(" "));
			var nomChampi = texte.substring(0,texte.lastIndexOf(" "));
			if(moisChampi[nomChampi])
			{
				appendText(node.parentNode.parentNode," [Mois "+moisChampi[nomChampi]+"]");
			}
			
	}
}

function do_equipgowap() {
	start_script();

	treateGowaps();
	treateChampi();
	if(MY_getValue(numTroll+".enchantement.liste") && MY_getValue(numTroll+".enchantement.liste")!="" )
	{
		initPopupEquipgowap();
		computeEnchantementEquipement(createPopupImage,formateTexte);
	}

	displayScriptTime();
}

/*********************************************************************************
*   This file is part of zoryazilla & mountyzilla, published under GNU License   *
*********************************************************************************/

// x~x ordresgowap

/* v0.2 by Dab - 2013-08-31
 * - correction acquisition posale initiale
 * - correction tare et affichage mire
 */

function setCarteGogo() {
	try {
	var pars = document.getElementsByTagName('p');
	var pos = document.evaluate(".//table/descendant::table/tbody/tr/td/text()[contains(.,'X =')]",
								pars[0], null, 9, null).singleNodeValue.nodeValue.match(/-?\d+/g);
	}
	catch(e) {return;}
	var serv_scpt = "http://mountyzilla.tilk.info/scripts_0.8/carte_trajet2.php";
	var serv_img_trou = "http://mountyzilla.tilk.info/scripts_0.8/images/carte_trou.png";
	var serv_img_cible = "http://mountyzilla.tilk.info/scripts_0.8/images/rep.png";

	var expreg = /X=(-?\d+) \| Y=(-?\d+) \| N=(-?\d+)/;
	var lignes = pars[0].getElementsByTagName('tr');
	var nbpt = 0;
	var trajet = pos[0]+','+pos[1]+','+pos[2]+',';
	for(var i=0 ; i<lignes.length ; i++) {
		if(lignes[i].className == 'mh_tdpage_fo') {
			point = lignes[i].getElementsByTagName('td')[2].firstChild.nodeValue.match(expreg);
			if(point) {
				nbpt++;
				trajet += point[1]+','+point[2]+','+point[3]+',';
				}
			}
		}
	var nvdiv = "<div class='mh_tdpage' style='width:510px;height:455px;'><img src='"+serv_img_trou+"' style='position:relative;top:0px;left:0px;z-index:100;border-width:0px' usemap='#coord_trou'/>";
	var base = [-229,-5];
	if (nbpt>0) {
		base = [-684,-5];
		nvdiv += "<img src='"+serv_scpt+"?trajet="+trajet+"' style='position:relative;top:-455px;left:0px;z-index:500;border-width:0px' usemap='#coord_trou'/>";
	}
	nvdiv += "<img src='"+serv_img_cible+"' style='position:relative;top:"+(base[0]-2*pos[1])+"px;left:"+(base[1]+2*pos[0])+"px;z-index:100;'/>";

	nvdiv += '<map name="coord_trou"><area shape="circle" href="#" coords="260,333,3" title="X=5, Y=-49"  ><area shape="circle" href="#" coords="262,335,3" title="X=6, Y=-50"  ><area shape="circle" href="#" coords="260,335,3" title="X=5, Y=-50"  ><area shape="circle" href="#" coords="262,333,3" title="X=6, Y=-49"  ><area shape="circle" href="#" coords="294,163,3" title="X=22, Y=36"  ><area shape="circle" href="#" coords="292,163,3" title="X=21, Y=36"  ><area shape="circle" href="#" coords="294,165,3" title="X=22, Y=35"  ><area shape="circle" href="#" coords="292,165,3" title="X=21, Y=35"  ><area shape="circle" href="#" coords="124,217,3" title="X=-63, Y=9"  ><area shape="circle" href="#" coords="122,217,3" title="X=-64, Y=9"  ><area shape="circle" href="#" coords="124,219,3" title="X=-63, Y=8"  ><area shape="circle" href="#" coords="122,219,3" title="X=-64, Y=8"  ><area shape="circle" href="#" coords="378,95,3" title="X=64, Y=70"  ><area shape="circle" href="#" coords="146,121,3" title="X=-52, Y=57"  ><area shape="circle" href="#" coords="346,313,3" title="X=48, Y=-39"  ><area shape="circle" href="#" coords="310,339,3" title="X=30, Y=-52"  ><area shape="circle" href="#" coords="274,265,3" title="X=12, Y=-15"  ><area shape="circle" href="#" coords="360,95,3" title="X=55, Y=70"  ><area shape="circle" href="#" coords="224,91,3" title="X=-13, Y=72"  ><area shape="circle" href="#" coords="226,91,3" title="X=-12, Y=72"  ><area shape="circle" href="#" coords="224,89,3" title="X=-13, Y=73"  ><area shape="circle" href="#" coords="226,89,3" title="X=-12, Y=73"  ><area shape="circle" href="#" coords="148,281,3" title="X=-51, Y=-23"  ><area shape="circle" href="#" coords="150,281,3" title="X=-50, Y=-23"  ><area shape="circle" href="#" coords="148,279,3" title="X=-51, Y=-22"  ><area shape="circle" href="#" coords="150,279,3" title="X=-50, Y=-22"  ><area shape="circle" href="#" coords="130,301,3" title="X=-60, Y=-33"  ><area shape="circle" href="#" coords="132,301,3" title="X=-59, Y=-33"  ><area shape="circle" href="#" coords="130,299,3" title="X=-60, Y=-32"  ><area shape="circle" href="#" coords="132,299,3" title="X=-59, Y=-32"  ><area shape="circle" href="#" coords="116,311,3" title="X=-67, Y=-38"  ><area shape="circle" href="#" coords="118,311,3" title="X=-66, Y=-38"  ><area shape="circle" href="#" coords="116,309,3" title="X=-67, Y=-37"  ><area shape="circle" href="#" coords="118,309,3" title="X=-66, Y=-37"  ><area shape="circle" href="#" coords="260,173,3" title="X=5, Y=31"  ><area shape="circle" href="#" coords="262,173,3" title="X=6, Y=31"  ><area shape="circle" href="#" coords="260,171,3" title="X=5, Y=32"  ><area shape="circle" href="#" coords="262,171,3" title="X=6, Y=32"  ><area shape="circle" href="#" coords="178,339,3" title="X=-36, Y=-52"  ><area shape="circle" href="#" coords="180,339,3" title="X=-35, Y=-52"  ><area shape="circle" href="#" coords="178,337,3" title="X=-36, Y=-51"  ><area shape="circle" href="#" coords="180,337,3" title="X=-35, Y=-51"  ><area shape="circle" href="#" coords="182,107,3" title="X=-34, Y=64"  ><area shape="circle" href="#" coords="182,105,3" title="X=-34, Y=65"  ><area shape="circle" href="#" coords="270,109,3" title="X=10, Y=63"  ><area shape="circle" href="#" coords="272,109,3" title="X=11, Y=63"  ><area shape="circle" href="#" coords="270,107,3" title="X=10, Y=64"  ><area shape="circle" href="#" coords="272,107,3" title="X=11, Y=64"  ><area shape="circle" href="#" coords="180,207,3" title="X=-35, Y=14"  ><area shape="circle" href="#" coords="182,207,3" title="X=-34, Y=14"  ><area shape="circle" href="#" coords="180,205,3" title="X=-35, Y=15"  ><area shape="circle" href="#" coords="182,205,3" title="X=-34, Y=15"  ><area shape="circle" href="#" coords="398,173,3" title="X=74, Y=31"  ><area shape="circle" href="#" coords="400,173,3" title="X=75, Y=31"  ><area shape="circle" href="#" coords="398,171,3" title="X=74, Y=32"  ><area shape="circle" href="#" coords="400,171,3" title="X=75, Y=32"  ><area shape="circle" href="#" coords="342,133,3" title="X=46, Y=51"  ><area shape="circle" href="#" coords="344,133,3" title="X=47, Y=51"  ><area shape="circle" href="#" coords="342,131,3" title="X=46, Y=52"  ><area shape="circle" href="#" coords="344,131,3" title="X=47, Y=52"  ><area shape="circle" href="#" coords="180,107,3" title="X=-35, Y=64"  ><area shape="circle" href="#" coords="180,105,3" title="X=-35, Y=65"  ><area shape="circle" href="#" coords="108,251,3" title="X=-71, Y=-8"  ><area shape="circle" href="#" coords="110,251,3" title="X=-70, Y=-8"  ><area shape="circle" href="#" coords="108,249,3" title="X=-71, Y=-7"  ><area shape="circle" href="#" coords="110,249,3" title="X=-70, Y=-7"  ><area shape="circle" href="#" coords="346,191,3" title="X=48, Y=22"  ><area shape="circle" href="#" coords="346,189,3" title="X=48, Y=23"  ><area shape="circle" href="#" coords="346,187,3" title="X=48, Y=24"  ><area shape="circle" href="#" coords="346,185,3" title="X=48, Y=25"  ><area shape="circle" href="#" coords="348,195,3" title="X=49, Y=20"  ><area shape="circle" href="#" coords="348,193,3" title="X=49, Y=21"  ><area shape="circle" href="#" coords="348,191,3" title="X=49, Y=22"  ><area shape="circle" href="#" coords="348,189,3" title="X=49, Y=23"  ><area shape="circle" href="#" coords="348,187,3" title="X=49, Y=24"  ><area shape="circle" href="#" coords="348,185,3" title="X=49, Y=25"  ><area shape="circle" href="#" coords="348,183,3" title="X=49, Y=26"  ><area shape="circle" href="#" coords="348,181,3" title="X=49, Y=27"  ><area shape="circle" href="#" coords="350,199,3" title="X=50, Y=18"  ><area shape="circle" href="#" coords="350,197,3" title="X=50, Y=19"  ><area shape="circle" href="#" coords="350,195,3" title="X=50, Y=20"  ><area shape="circle" href="#" coords="350,193,3" title="X=50, Y=21"  ><area shape="circle" href="#" coords="350,191,3" title="X=50, Y=22"  ><area shape="circle" href="#" coords="350,189,3" title="X=50, Y=23"  ><area shape="circle" href="#" coords="350,187,3" title="X=50, Y=24"  ><area shape="circle" href="#" coords="350,185,3" title="X=50, Y=25"  ><area shape="circle" href="#" coords="350,183,3" title="X=50, Y=26"  ><area shape="circle" href="#" coords="350,181,3" title="X=50, Y=27"  ><area shape="circle" href="#" coords="350,179,3" title="X=50, Y=28"  ><area shape="circle" href="#" coords="350,177,3" title="X=50, Y=29"  ><area shape="circle" href="#" coords="352,201,3" title="X=51, Y=17"  ><area shape="circle" href="#" coords="352,199,3" title="X=51, Y=18"  ><area shape="circle" href="#" coords="352,197,3" title="X=51, Y=19"  ><area shape="circle" href="#" coords="352,195,3" title="X=51, Y=20"  ><area shape="circle" href="#" coords="352,193,3" title="X=51, Y=21"  ><area shape="circle" href="#" coords="352,191,3" title="X=51, Y=22"  ><area shape="circle" href="#" coords="352,189,3" title="X=51, Y=23"  ><area shape="circle" href="#" coords="352,187,3" title="X=51, Y=24"  ><area shape="circle" href="#" coords="352,185,3" title="X=51, Y=25"  ><area shape="circle" href="#" coords="352,183,3" title="X=51, Y=26"  ><area shape="circle" href="#" coords="352,181,3" title="X=51, Y=27"  ><area shape="circle" href="#" coords="352,179,3" title="X=51, Y=28"  ><area shape="circle" href="#" coords="352,177,3" title="X=51, Y=29"  ><area shape="circle" href="#" coords="352,175,3" title="X=51, Y=30"  ><area shape="circle" href="#" coords="354,201,3" title="X=52, Y=17"  ><area shape="circle" href="#" coords="354,199,3" title="X=52, Y=18"  ><area shape="circle" href="#" coords="354,197,3" title="X=52, Y=19"  ><area shape="circle" href="#" coords="354,195,3" title="X=52, Y=20"  ><area shape="circle" href="#" coords="354,193,3" title="X=52, Y=21"  ><area shape="circle" href="#" coords="354,191,3" title="X=52, Y=22"  ><area shape="circle" href="#" coords="354,189,3" title="X=52, Y=23"  ><area shape="circle" href="#" coords="354,187,3" title="X=52, Y=24"  ><area shape="circle" href="#" coords="354,185,3" title="X=52, Y=25"  ><area shape="circle" href="#" coords="354,183,3" title="X=52, Y=26"  ><area shape="circle" href="#" coords="354,181,3" title="X=52, Y=27"  ><area shape="circle" href="#" coords="354,179,3" title="X=52, Y=28"  ><area shape="circle" href="#" coords="354,177,3" title="X=52, Y=29"  ><area shape="circle" href="#" coords="354,175,3" title="X=52, Y=30"  ><area shape="circle" href="#" coords="356,203,3" title="X=53, Y=16"  ><area shape="circle" href="#" coords="356,201,3" title="X=53, Y=17"  ><area shape="circle" href="#" coords="356,199,3" title="X=53, Y=18"  ><area shape="circle" href="#" coords="356,197,3" title="X=53, Y=19"  ><area shape="circle" href="#" coords="356,195,3" title="X=53, Y=20"  ><area shape="circle" href="#" coords="356,193,3" title="X=53, Y=21"  ><area shape="circle" href="#" coords="356,191,3" title="X=53, Y=22"  ><area shape="circle" href="#" coords="356,189,3" title="X=53, Y=23"  ><area shape="circle" href="#" coords="356,187,3" title="X=53, Y=24"  ><area shape="circle" href="#" coords="356,185,3" title="X=53, Y=25"  ><area shape="circle" href="#" coords="356,183,3" title="X=53, Y=26"  ><area shape="circle" href="#" coords="356,181,3" title="X=53, Y=27"  ><area shape="circle" href="#" coords="356,179,3" title="X=53, Y=28"  ><area shape="circle" href="#" coords="356,177,3" title="X=53, Y=29"  ><area shape="circle" href="#" coords="356,175,3" title="X=53, Y=30"  ><area shape="circle" href="#" coords="356,173,3" title="X=53, Y=31"  ><area shape="circle" href="#" coords="358,203,3" title="X=54, Y=16"  ><area shape="circle" href="#" coords="358,201,3" title="X=54, Y=17"  ><area shape="circle" href="#" coords="358,199,3" title="X=54, Y=18"  ><area shape="circle" href="#" coords="358,197,3" title="X=54, Y=19"  ><area shape="circle" href="#" coords="358,195,3" title="X=54, Y=20"  ><area shape="circle" href="#" coords="358,193,3" title="X=54, Y=21"  ><area shape="circle" href="#" coords="358,191,3" title="X=54, Y=22"  ><area shape="circle" href="#" coords="358,189,3" title="X=54, Y=23"  ><area shape="circle" href="#" coords="358,187,3" title="X=54, Y=24"  ><area shape="circle" href="#" coords="358,185,3" title="X=54, Y=25"  ><area shape="circle" href="#" coords="358,183,3" title="X=54, Y=26"  ><area shape="circle" href="#" coords="358,181,3" title="X=54, Y=27"  ><area shape="circle" href="#" coords="358,179,3" title="X=54, Y=28"  ><area shape="circle" href="#" coords="358,177,3" title="X=54, Y=29"  ><area shape="circle" href="#" coords="358,175,3" title="X=54, Y=30"  ><area shape="circle" href="#" coords="358,173,3" title="X=54, Y=31"  ><area shape="circle" href="#" coords="360,205,3" title="X=55, Y=15"  ><area shape="circle" href="#" coords="360,203,3" title="X=55, Y=16"  ><area shape="circle" href="#" coords="360,201,3" title="X=55, Y=17"  ><area shape="circle" href="#" coords="360,199,3" title="X=55, Y=18"  ><area shape="circle" href="#" coords="360,197,3" title="X=55, Y=19"  ><area shape="circle" href="#" coords="360,195,3" title="X=55, Y=20"  ><area shape="circle" href="#" coords="360,193,3" title="X=55, Y=21"  ><area shape="circle" href="#" coords="360,191,3" title="X=55, Y=22"  ><area shape="circle" href="#" coords="360,189,3" title="X=55, Y=23"  ><area shape="circle" href="#" coords="360,187,3" title="X=55, Y=24"  ><area shape="circle" href="#" coords="360,185,3" title="X=55, Y=25"  ><area shape="circle" href="#" coords="360,183,3" title="X=55, Y=26"  ><area shape="circle" href="#" coords="360,181,3" title="X=55, Y=27"  ><area shape="circle" href="#" coords="360,179,3" title="X=55, Y=28"  ><area shape="circle" href="#" coords="360,177,3" title="X=55, Y=29"  ><area shape="circle" href="#" coords="360,175,3" title="X=55, Y=30"  ><area shape="circle" href="#" coords="360,173,3" title="X=55, Y=31"  ><area shape="circle" href="#" coords="360,171,3" title="X=55, Y=32"  ><area shape="circle" href="#" coords="362,205,3" title="X=56, Y=15"  ><area shape="circle" href="#" coords="362,203,3" title="X=56, Y=16"  ><area shape="circle" href="#" coords="362,201,3" title="X=56, Y=17"  ><area shape="circle" href="#" coords="362,199,3" title="X=56, Y=18"  ><area shape="circle" href="#" coords="362,197,3" title="X=56, Y=19"  ><area shape="circle" href="#" coords="362,195,3" title="X=56, Y=20"  ><area shape="circle" href="#" coords="362,193,3" title="X=56, Y=21"  ><area shape="circle" href="#" coords="362,191,3" title="X=56, Y=22"  ><area shape="circle" href="#" coords="362,189,3" title="X=56, Y=23"  ><area shape="circle" href="#" coords="362,187,3" title="X=56, Y=24"  ><area shape="circle" href="#" coords="362,185,3" title="X=56, Y=25"  ><area shape="circle" href="#" coords="362,183,3" title="X=56, Y=26"  ><area shape="circle" href="#" coords="362,181,3" title="X=56, Y=27"  ><area shape="circle" href="#" coords="362,179,3" title="X=56, Y=28"  ><area shape="circle" href="#" coords="362,177,3" title="X=56, Y=29"  ><area shape="circle" href="#" coords="362,175,3" title="X=56, Y=30"  ><area shape="circle" href="#" coords="362,173,3" title="X=56, Y=31"  ><area shape="circle" href="#" coords="362,171,3" title="X=56, Y=32"  ><area shape="circle" href="#" coords="364,205,3" title="X=57, Y=15"  ><area shape="circle" href="#" coords="364,203,3" title="X=57, Y=16"  ><area shape="circle" href="#" coords="364,201,3" title="X=57, Y=17"  ><area shape="circle" href="#" coords="364,199,3" title="X=57, Y=18"  ><area shape="circle" href="#" coords="364,197,3" title="X=57, Y=19"  ><area shape="circle" href="#" coords="364,195,3" title="X=57, Y=20"  ><area shape="circle" href="#" coords="364,193,3" title="X=57, Y=21"  ><area shape="circle" href="#" coords="364,191,3" title="X=57, Y=22"  ><area shape="circle" href="#" coords="364,189,3" title="X=57, Y=23"  ><area shape="circle" href="#" coords="364,187,3" title="X=57, Y=24"  ><area shape="circle" href="#" coords="364,185,3" title="X=57, Y=25"  ><area shape="circle" href="#" coords="364,183,3" title="X=57, Y=26"  ><area shape="circle" href="#" coords="364,181,3" title="X=57, Y=27"  ><area shape="circle" href="#" coords="364,179,3" title="X=57, Y=28"  ><area shape="circle" href="#" coords="364,177,3" title="X=57, Y=29"  ><area shape="circle" href="#" coords="364,175,3" title="X=57, Y=30"  ><area shape="circle" href="#" coords="364,173,3" title="X=57, Y=31"  ><area shape="circle" href="#" coords="364,171,3" title="X=57, Y=32"  ><area shape="circle" href="#" coords="366,205,3" title="X=58, Y=15"  ><area shape="circle" href="#" coords="366,203,3" title="X=58, Y=16"  ><area shape="circle" href="#" coords="366,201,3" title="X=58, Y=17"  ><area shape="circle" href="#" coords="366,199,3" title="X=58, Y=18"  ><area shape="circle" href="#" coords="366,197,3" title="X=58, Y=19"  ><area shape="circle" href="#" coords="366,195,3" title="X=58, Y=20"  ><area shape="circle" href="#" coords="366,193,3" title="X=58, Y=21"  ><area shape="circle" href="#" coords="366,191,3" title="X=58, Y=22"  ><area shape="circle" href="#" coords="366,189,3" title="X=58, Y=23"  ><area shape="circle" href="#" coords="366,187,3" title="X=58, Y=24"  ><area shape="circle" href="#" coords="366,185,3" title="X=58, Y=25"  ><area shape="circle" href="#" coords="366,183,3" title="X=58, Y=26"  ><area shape="circle" href="#" coords="366,181,3" title="X=58, Y=27"  ><area shape="circle" href="#" coords="366,179,3" title="X=58, Y=28"  ><area shape="circle" href="#" coords="366,177,3" title="X=58, Y=29"  ><area shape="circle" href="#" coords="366,175,3" title="X=58, Y=30"  ><area shape="circle" href="#" coords="366,173,3" title="X=58, Y=31"  ><area shape="circle" href="#" coords="366,171,3" title="X=58, Y=32"  ><area shape="circle" href="#" coords="368,203,3" title="X=59, Y=16"  ><area shape="circle" href="#" coords="368,201,3" title="X=59, Y=17"  ><area shape="circle" href="#" coords="368,199,3" title="X=59, Y=18"  ><area shape="circle" href="#" coords="368,197,3" title="X=59, Y=19"  ><area shape="circle" href="#" coords="368,195,3" title="X=59, Y=20"  ><area shape="circle" href="#" coords="368,193,3" title="X=59, Y=21"  ><area shape="circle" href="#" coords="368,191,3" title="X=59, Y=22"  ><area shape="circle" href="#" coords="368,189,3" title="X=59, Y=23"  ><area shape="circle" href="#" coords="368,187,3" title="X=59, Y=24"  ><area shape="circle" href="#" coords="368,185,3" title="X=59, Y=25"  ><area shape="circle" href="#" coords="368,183,3" title="X=59, Y=26"  ><area shape="circle" href="#" coords="368,181,3" title="X=59, Y=27"  ><area shape="circle" href="#" coords="368,179,3" title="X=59, Y=28"  ><area shape="circle" href="#" coords="368,177,3" title="X=59, Y=29"  ><area shape="circle" href="#" coords="368,175,3" title="X=59, Y=30"  ><area shape="circle" href="#" coords="368,173,3" title="X=59, Y=31"  ><area shape="circle" href="#" coords="370,203,3" title="X=60, Y=16"  ><area shape="circle" href="#" coords="370,201,3" title="X=60, Y=17"  ><area shape="circle" href="#" coords="370,199,3" title="X=60, Y=18"  ><area shape="circle" href="#" coords="370,197,3" title="X=60, Y=19"  ><area shape="circle" href="#" coords="370,195,3" title="X=60, Y=20"  ><area shape="circle" href="#" coords="370,193,3" title="X=60, Y=21"  ><area shape="circle" href="#" coords="370,191,3" title="X=60, Y=22"  ><area shape="circle" href="#" coords="370,189,3" title="X=60, Y=23"  ><area shape="circle" href="#" coords="370,187,3" title="X=60, Y=24"  ><area shape="circle" href="#" coords="370,185,3" title="X=60, Y=25"  ><area shape="circle" href="#" coords="370,183,3" title="X=60, Y=26"  ><area shape="circle" href="#" coords="370,181,3" title="X=60, Y=27"  ><area shape="circle" href="#" coords="370,179,3" title="X=60, Y=28"  ><area shape="circle" href="#" coords="370,177,3" title="X=60, Y=29"  ><area shape="circle" href="#" coords="370,175,3" title="X=60, Y=30"  ><area shape="circle" href="#" coords="370,173,3" title="X=60, Y=31"  ><area shape="circle" href="#" coords="372,201,3" title="X=61, Y=17"  ><area shape="circle" href="#" coords="372,199,3" title="X=61, Y=18"  ><area shape="circle" href="#" coords="372,197,3" title="X=61, Y=19"  ><area shape="circle" href="#" coords="372,195,3" title="X=61, Y=20"  ><area shape="circle" href="#" coords="372,193,3" title="X=61, Y=21"  ><area shape="circle" href="#" coords="372,191,3" title="X=61, Y=22"  ><area shape="circle" href="#" coords="372,189,3" title="X=61, Y=23"  ><area shape="circle" href="#" coords="372,187,3" title="X=61, Y=24"  ><area shape="circle" href="#" coords="372,185,3" title="X=61, Y=25"  ><area shape="circle" href="#" coords="372,183,3" title="X=61, Y=26"  ><area shape="circle" href="#" coords="372,181,3" title="X=61, Y=27"  ><area shape="circle" href="#" coords="372,179,3" title="X=61, Y=28"  ><area shape="circle" href="#" coords="372,177,3" title="X=61, Y=29"  ><area shape="circle" href="#" coords="372,175,3" title="X=61, Y=30"  ><area shape="circle" href="#" coords="374,201,3" title="X=62, Y=17"  ><area shape="circle" href="#" coords="374,199,3" title="X=62, Y=18"  ><area shape="circle" href="#" coords="374,197,3" title="X=62, Y=19"  ><area shape="circle" href="#" coords="374,195,3" title="X=62, Y=20"  ><area shape="circle" href="#" coords="374,193,3" title="X=62, Y=21"  ><area shape="circle" href="#" coords="374,191,3" title="X=62, Y=22"  ><area shape="circle" href="#" coords="374,189,3" title="X=62, Y=23"  ><area shape="circle" href="#" coords="374,187,3" title="X=62, Y=24"  ><area shape="circle" href="#" coords="374,185,3" title="X=62, Y=25"  ><area shape="circle" href="#" coords="374,183,3" title="X=62, Y=26"  ><area shape="circle" href="#" coords="374,181,3" title="X=62, Y=27"  ><area shape="circle" href="#" coords="374,179,3" title="X=62, Y=28"  ><area shape="circle" href="#" coords="374,177,3" title="X=62, Y=29"  ><area shape="circle" href="#" coords="374,175,3" title="X=62, Y=30"  ><area shape="circle" href="#" coords="376,199,3" title="X=63, Y=18"  ><area shape="circle" href="#" coords="376,197,3" title="X=63, Y=19"  ><area shape="circle" href="#" coords="376,195,3" title="X=63, Y=20"  ><area shape="circle" href="#" coords="376,193,3" title="X=63, Y=21"  ><area shape="circle" href="#" coords="376,191,3" title="X=63, Y=22"  ><area shape="circle" href="#" coords="376,189,3" title="X=63, Y=23"  ><area shape="circle" href="#" coords="376,187,3" title="X=63, Y=24"  ><area shape="circle" href="#" coords="376,185,3" title="X=63, Y=25"  ><area shape="circle" href="#" coords="376,183,3" title="X=63, Y=26"  ><area shape="circle" href="#" coords="376,181,3" title="X=63, Y=27"  ><area shape="circle" href="#" coords="376,179,3" title="X=63, Y=28"  ><area shape="circle" href="#" coords="376,177,3" title="X=63, Y=29"  ><area shape="circle" href="#" coords="378,195,3" title="X=64, Y=20"  ><area shape="circle" href="#" coords="378,193,3" title="X=64, Y=21"  ><area shape="circle" href="#" coords="378,191,3" title="X=64, Y=22"  ><area shape="circle" href="#" coords="378,189,3" title="X=64, Y=23"  ><area shape="circle" href="#" coords="378,187,3" title="X=64, Y=24"  ><area shape="circle" href="#" coords="378,185,3" title="X=64, Y=25"  ><area shape="circle" href="#" coords="378,183,3" title="X=64, Y=26"  ><area shape="circle" href="#" coords="378,181,3" title="X=64, Y=27"  ><area shape="circle" href="#" coords="380,191,3" title="X=65, Y=22"  ><area shape="circle" href="#" coords="380,189,3" title="X=65, Y=23"  ><area shape="circle" href="#" coords="380,187,3" title="X=65, Y=24"  ><area shape="circle" href="#" coords="380,185,3" title="X=65, Y=25"  ></map>';

	var nvspan = document.createElement('div');
		nvspan.align = 'center';
		nvspan.valign = 'top';
		nvspan.innerHTML += nvdiv;
	pars[1].insertBefore(nvspan,pars[1].firstChild);
}

function do_ordresgowap() {
	setCarteGogo();		// Via script des trouillots
}

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

// x~x attaque

// Script désactivé en attendant la màj vers le nouveau système de missions.

function do_attaque() {
}

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

// x~x infomonstre

// DEBUG
// Utilisation obligatoire de listeCDM à cause de getAnalyseTactique()
// À corriger, évidemment.
var listeCDM = {};
var nomMonstre='';
var idMonstre=-1;
var tbody;
var popup;

function traiteMonstre() {
	try {
		var nodeTitre = document.evaluate(
			"//div[@class='titre2' and contains(text(),'(')]",
			document, null, 9, null
		).singleNodeValue;
		var texte = nodeTitre.firstChild.nodeValue;
	} catch(e) {
		window.console.log(e);
		return;
	}
	
	nomMonstre = texte.slice(0,texte.indexOf('(')-1);
	if(nomMonstre.indexOf(']')!=-1) {
		nomMonstre = nomMonstre.slice(0,nomMonstre.indexOf(']')+1);
	}
	idMonstre = texte.match(/\d+/)[0];
	FF_XMLHttpRequest({
		method: 'GET',
		url: 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_FF.php?begin=-1&idcdm='
			+MY_getValue('CDMID')
			+'&nom[]='+escape(nomMonstre)+'$'+idMonstre,
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml'
		},
		onload: function(responseDetails) {
			try {
				var texte = responseDetails.responseText;
				var lines = texte.split("\n");
				if(lines.length>=1) {
					var infos = lines[0].split(";");
					if(infos.length<4) { return; }
					var idMonstre = infos[0];
					infos=infos.slice(3);
					listeCDM[idMonstre]=infos;
					computeMissionInfomonstre();
				}
			} catch(e) {
				window.alert(e);
			}
		}
	});
}

function initPopupInfomonstre() {
// Initialise le popup tactique (calculs att/deg)
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
	try {
		var id = this.id;
		var nom = this.nom;
		var texte = getAnalyseTactique(id,nom);
		if(texte=='') { return; }
		popup.innerHTML = texte;
		// roule 16/03/2016 déclage horizontal différent suivant la page qu'on traite
		if(isPage("View/MonsterView")) {
			popup.style.left = Math.min(evt.pageX-120,window.innerWidth-300)+'px';
		} else {
			popup.style.left = Math.min(evt.pageX+15,window.innerWidth-400)+'px';
		}
		popup.style.top = evt.pageY+15+'px';
		popup.style.visibility = 'visible';
	} catch(e) {
		window.alert(e);
	}
}

// roule 16/03/2016, existe déjà ailleurs
// function hidePopup() {
	// popup.style.visibility = 'hidden';
// }

function toggleTableau() {
	tbody.style.display = tbody.style.display=='none' ? '' : 'none';
}

function computeMissionInfomonstre() {
// C'est quoi ce titre de fonction ? (O_o)
	try {
		var nodeInsert = document.evaluate(
			"//div[@class = 'titre3']",
			document, null, 9, null
		).singleNodeValue;
	} catch(e) {
		window.console.log(e);
		return;
	}
	var table = createCDMTable(idMonstre,nomMonstre,listeCDM[idMonstre]);
	table.align = 'center';
	tbody = table.childNodes[1];
	table.firstChild.firstChild.firstChild.onclick = toggleTableau;
	table.firstChild.firstChild.onmouseover = function() {
		this.style.cursor = 'pointer';
		this.className = 'mh_tdpage';
	};
	table.firstChild.firstChild.onmouseout = function() {
		this.className = 'mh_tdtitre';
	};
	tbody.style.display = 'none';
	table.style.width = '350px';
	insertBefore(nodeInsert,table);
}

function do_infomonstre() {
	start_script();
	try {
		initPopupInfomonstre();
		traiteMonstre();
	} catch(e) {
		window.alert('Erreur infoMonstre:\n'+e);
	}
	displayScriptTime();
}

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

// x~x mission

/* TODO
 * MZ2.0 : gérer le nettoyage des missions terminées via script principal
 *
 * Note: nbKills n'est pas géré pour l'instant (voir avec Actions?)
 */

function saveMission(num,obEtape) {
	var obMissions = {};
	if(MY_getValue(numTroll+'.MISSIONS')) {
		try {
			obMissions = JSON.parse(MY_getValue(numTroll+'.MISSIONS'));
		} catch(e) {
			window.console.error('[MZ Mission] Erreur parsage:\n'+e);
			return;
		}
	}
	if(obEtape) {
		obMissions[num] = obEtape;
	} else if(obMissions[num]) {
		delete obMissions[num];
	}
	MY_setValue(numTroll+'.MISSIONS',JSON.stringify(obMissions));
}

function traiteMission() {
	try {
		var titreMission = document.getElementsByClassName('titre2')[0];
		var numMission = titreMission.textContent.match(/\d+/)[0];
		var missionForm = document.getElementsByName('ActionForm')[0];
		var tdLibelle = document.evaluate(
			"./table/tbody/tr/td/input[starts-with(@value,'Valider')]/../../td[2]",
			missionForm, null, 9, null).singleNodeValue;
	} catch(e) {
		window.console.error('[MZ Mission] Erreur récupération mission:\n'+e);
		return;
	}
	if(!numMission) { return; }
	if(!tdLibelle) {
		// S'il n'y a plus d'étape en cours (=mission finie), on supprime
		saveMission(numMission,false);
		return;
	}
	
	var libelle = trim(tdLibelle.textContent.replace(/\n/g,''));
	var siMundidey = libelle.indexOf('Mundidey')!=-1;
	if(libelle.indexOf('niveau égal à')!=-1) {
		var nbKills = 1, niveau, mod;
		if(tdLibelle.firstChild.nodeValue.indexOf('niveau égal à')==-1) {
			// Étape de kill multiple de niveau donné
			//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			niveau = Number(tdLibelle.childNodes[3].firstChild.nodeValue);
			// Modificateur de niveau : "niv +/- mod" ou bien "niv +"
			mod = tdLibelle.childNodes[4].nodeValue.match(/\d+/);
			mod = mod ? Number(mod[0]) : 'plus';
		} else {
			// Étape de kill unique de niveau donné
			niveau = Number(tdLibelle.childNodes[1].firstChild.nodeValue);
			mod = tdLibelle.childNodes[2].nodeValue.match(/\d+/);
			mod = mod ? Number(mod[0]) : 'plus';
		}
		saveMission(numMission,{
			type: 'Niveau',
			niveau: niveau,
			mod: mod,
			mundidey: siMundidey,
			libelle: libelle
		});
	} else if(libelle.indexOf('de la race')!=-1) {
		var nbKills = 1, race;
		if(tdLibelle.firstChild.nodeValue.indexOf('de la race')==-1) {
			// Étape de kill multiple de race donnée
			//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			race = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
		} else {
			// Étape de kill unique de race donnée
			race = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
		}
		saveMission(numMission,{
			type: 'Race',
			race: race.replace(/\"/g,''),
			mundidey: siMundidey,
			libelle: libelle
		});
	} else if(libelle.indexOf('de la famille')!=-1) {
		var nbKills = 1, famille;
		if(tdLibelle.firstChild.nodeValue.indexOf('de la famille')==-1) {
			// Étape de kill multiple de famille donnée
			//nbKills = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
			famille = trim(tdLibelle.childNodes[3].firstChild.nodeValue);
		} else {
			// Étape de kill unique de famille donnée
			famille = trim(tdLibelle.childNodes[1].firstChild.nodeValue);
		}
		saveMission(numMission,{
			type: 'Famille',
			famille: famille,
			mundidey: siMundidey,
			libelle: libelle
		});
	} else if(libelle.indexOf('capacité spéciale')!=-1) {
		var pouvoir = epure(trim(tdLibelle.childNodes[1].firstChild.nodeValue));
		saveMission(numMission,{
			type: 'Pouvoir',
			pouvoir: pouvoir,
			libelle: libelle
		});
	} else {
		saveMission(numMission,false);
	}
}

function do_mission() {
	start_script(60);

	traiteMission();

	displayScriptTime();
}

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

// x~x move

/*-[variables+function]- Données sur les trous de météorites -----------------*/

var petitsTrous = {
	'-52;57': true,
	'55;70': true,
	'64;70': true,
	'12;-15': true,
	'30;-52': true,
	'48;-39': true
};

var grosTrous = {
	'-35;65': true,
	'-13;73': true,
	'-64;9': true,
	'-35;15': true,
	'5;32': true,
	'10;64': true,
	'21;36': true,
	'46;52': true,
	'74;32': true,
	'-71;-7': true,
	'-67;-37': true,
	'-60;-32': true,
	'-51;-22': true,
	'-36;-51': true,
	'5;-49': true
};

var centreCarmine_X = 56.5;
var centreCarmine_Y = 23.5;
var rayonCarmine = 8.7;

function isTrou(x,y,n) {
	if(petitsTrous[x+';'+y]) {
		return n<0 && n>-60;
	}
	if(grosTrous[x+';'+y]
		|| grosTrous[x-1+';'+y]
		|| grosTrous[x+';'+y+1]
		|| grosTrous[x-1+';'+y+1]) {
		return n<0 && n>-70;
	}
	if(Math.sqrt(
			Math.pow(x-centreCarmine_X,2)+Math.pow(y-centreCarmine_Y,2)
		)<=rayonCarmine) {
		return n<0 && n>-100;
	}
	return false;
}

/*-[functions]----------------- Gestion des DEs ------------------------------*/

function validateDestination() {
	var x = Number(document.getElementsByName('ai_XDepart')[0].value);
	var y = Number(document.getElementsByName('ai_YDepart')[0].value);
	var n = Number(document.getElementsByName('ai_NDepart')[0].value);
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		for(var i=0 ; i<document.getElementsByName('ai_DeplX').length ; i++) {
			if(document.getElementsByName('ai_DeplX')[i].checked) {
				x += Number(document.getElementsByName('ai_DeplX')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplY').length ; i++)	{
			if(document.getElementsByName('ai_DeplY')[i].checked) {
				y += Number(document.getElementsByName('ai_DeplY')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplN').length ; i++) {
			if(document.getElementsByName('ai_DeplN')[i].checked) {
				n += Number(document.getElementsByName('ai_DeplN')[i].value);
			}
		}
		if(isTrou(x,y,n)) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous allez tomber dans un trou de météorite.\n'
				+'Êtes vous sûr de vouloir effectuer ce déplacement ?'
			);
		}
	}
	return true;
}

function newsubmitDE(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateDestination()) {
		this.submit();
	}
}

function changeValidation() {
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDE, true);
	}
}


/*-[functions]----------------- Gestion des TPs ------------------------------*/

function validateTPDestination() {
	try {
		var text = document.getElementsByTagName('B')[0];
		var a = text.firstChild.nodeValue.split('|');
		var pos_x = a[0].substring(4, a[0].length - 1) * 1;
		var pos_y = a[1].substring(5, a[1].length - 1) * 1;
		var pos_n = a[2].substring(5, a[2].length) * 1;

		var nbtrous = 0;
		for(var signX=-1 ; signX<=1 ; signX+=2) {
			for(var x=0 ; x<=2 ; x++) {
				for(var signY=-1 ; signY<=1 ; signY+=2) {
					for(var y=0 ; y<=2 ; y++) {
						for(var signN = -1 ; signN <= 1 ; signN+=2) {
							for(var n = 0 ; n <= 1 ; n++) {
								if(isTrou(
										pos_x+signX*x,pos_y+signY*y,Math.min(-1,pos_n+signN*n)
									)) {
									nbtrous++;
								}
							}
						}
					}
				}
			}
		}
		if(nbtrous>0 && nbtrous<72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite.\n'
				+'Êtes-vous sûr de vouloir prendre ce portail ?'
			);
		}
		else if(nbtrous>=72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) tonne dans votre tête :\n'
				+'Malheureux, vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite !\n'
				+'Êtes-vous bien certain de vouloir prendre ce portail ?'
			);
		}
		return true;
	}
	catch(e) {
		window.alert(e)
	}
}

function newsubmitTP(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateTPDestination()) {
		this.submit();
	}
}

function changeButtonValidate() {
	var form = document.getElementsByName('Formulaire')[0];
	if(form) {
		if(!form.getAttribute('onsubmit')) {
			form.setAttribute('onsubmit','return true;');
		}
		form.addEventListener('submit', newsubmitTP, true);
	}
}


/*-[functions]---------------- Partie Principale -----------------------------*/

function do_move() {
	if(isPage('MH_Play/Actions/Play_a_Move.php')) {
		changeValidation();
	}
	else if(isPage('MH_Lieux/Lieu_Teleport.php')) {
		changeButtonValidate();
	}
}

/*******************************************************************************
* This file is part of Mountyzilla (http://mountyzilla.tilk.info/)             *
* Mountyzilla is free software; provided under the GNU General Public License  *
*******************************************************************************/

// x~x news

// Url de récup des jubilaires:
const annivURL = 'http://mountyzilla.tilk.info/scripts/anniv.php';
// Flux RSS des news MZ:
const rssURL = 'http://mountyzilla.tilk.info/news/rss.php';
// Nombre de news à afficher & nb max de caractères par news:
const nbItems = 5;
const maxCarDescription = 300;

/*-[functions]------------------- Utilitaires --------------------------------*/

// Ne semble avoir strictement aucun effet:
String.prototype.epureDescription = function() {
	return this.replace(/\\(.)/g,"$1");
	}

function appendTitledTable(node,titre,description) {
	// Crée les tables contenant les infos (avec titre)
	var table = document.createElement('table');
	table.border = 0;
	table.className = 'mh_tdborder';
	table.cellSpacing = 1;
	table.cellPadding = 1;
	table.style.maxWidth = '98%';
	table.style.marginLeft = 'auto';
	table.style.marginRight = 'auto';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	var tr = appendTr(tbody,'mh_tdtitre');
	var td = appendTdCenter(tr,2);
	var span = document.createElement('span');
	appendText(span,titre,true);
	if(description) {
		span.title = description;
		}
	td.appendChild(span);
	node.appendChild(table);
	return tbody;
	}


/*-[functions]------------------- Jubilaires ---------------------------------*/

function traiterJubilaires() {
	try {
		FF_XMLHttpRequest({
			method: 'GET',
			url: annivURL,
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				'Accept': 'application/xml,text/xml',
				},
			onload: function(responseDetails) {
				var listeTrolls = responseDetails.responseText.split('\n');
				if(!listeTrolls || listeTrolls.length==0) {
					return;
					}
				afficherJubilaires(listeTrolls);
				},
			});
		}
	catch(e) {
		window.alert('Erreur Jubilaires:\n'+e)
		};
	}

function afficherJubilaires(listeTrolls) {
	try {
		var rappels = document.evaluate(
			"//p[contains(a/text(),'messagerie')]",
			document, null, 9, null).singleNodeValue;
		}
	catch(e) {
		return;
		}
	var p = document.createElement('p');
	var tbody = appendTitledTable(p,
		"Les Trõlls qui fêtent leur anniversaire aujourd'hui:",
		'Envoyez leur un message ou un cadeau !'
		);
	tr = appendTr(tbody,'mh_tdpage');
	td = appendTdCenter(tr);
	var small = document.createElement('small');
	td.appendChild(small);
	var first = true;
	for(var i=0 ; i<listeTrolls.length ; i++) {
		var infos = listeTrolls[i].split(';');
		if(infos.length!=3 || infos[2]==='0') {
			continue;
			}
		if(first) {
			first = false;
			}
		else {
			appendText(small,', ');
			}
		var a = document.createElement('a');
		a.href = 'javascript:EPV('+infos[0]+')';
		appendText(a,infos[1]);
		small.appendChild(a);
		appendText(small, ' ('+infos[2]+(infos[2]==='1' ? ' an)' : ' ans)') );
		}
	insertBefore(rappels,p);
	}


/*-[functions]--------------------- News MZ ----------------------------------*/

function traiterNouvelles() {
	try {
		FF_XMLHttpRequest({
			method: 'GET',
			url: rssURL,
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
				'Accept': 'application/xml,text/xml',
				},
			onload: function(responseDetails) {
				responseDetails.responseXML = new DOMParser().parseFromString(
						responseDetails.responseText,
						'text/xml');
				afficherNouvelles(responseDetails.responseXML);
				}
			});
		}
	catch(e) {
		window.alert('Erreur News:\n'+e)
		};
	}

function afficherNouvelles(xml_data) {
	var footer = document.getElementById('footer1');
	if(!footer) {
		return;
		}
	try {
		var titre = xml_data.evaluate('//channel/title/text()',
			xml_data, null, 9, null).singleNodeValue.nodeValue;
		var description = xml_data.evaluate('//channel/description/text()',
			xml_data, null, 9, null).singleNodeValue.nodeValue;
		var items = xml_data.evaluate('//channel/item',
			xml_data, null, 7, null);
		}
	catch(e) {
		return;
		}
	if(!titre || !description || items.snapshotLength==0) {
		return;
		}
	var p = document.createElement('p');
	var tbody = appendTitledTable(p,titre,description);
	for(var i=0 ; i<Math.min(items.snapshotLength,nbItems) ; i++) {
		var item = items.snapshotItem(i);
		var sousTitre = xml_data.evaluate('title/text()',
			item, null, 9, null).singleNodeValue.nodeValue;
		var details = xml_data.evaluate('description/text()',
			item, null, 9, null).singleNodeValue.nodeValue;
		if(sousTitre && details) {
			var tr = appendTr(tbody,'mh_tdpage');
			var td = appendTdCenter(tr);
			td.style.verticalAlign = 'middle'; // semble sans effet
			appendText(td,sousTitre,true);
			td = appendTd(tr);
			td.innerHTML = details.epureDescription().slice(0,maxCarDescription);
			// DEBUG
			// pourquoi il ajoute une ligne vide sous les listes ??
			// même avec trim(), il vire le textNode mais pas l'espace !
			}
		}
	insertBefore(footer,p);
	}


/*---------------------------------- Main ------------------------------------*/

function do_news() {
	start_script();

	traiterJubilaires();
	traiterNouvelles();

	displayScriptTime();
}

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

// x~x tabcompo

var popup;

function initPopupTabcompo() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;'
						+ 'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

// roule 16/03/2016, existe déjà ailleurs
// function hidePopup() {
	// popup.style.visibility = 'hidden';
// }

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

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}

function arrondi(x) {
	return Math.ceil(x-0.5); // arrondi à l'entier le plus proche, valeurs inf
	}

function traiteMinerai() {
	if (currentURL.indexOf("as_type=Divers")==-1) return;
	try {
	var node = document.evaluate("//form/table/tbody[@class='tablesorter-no-sort'"
								+" and contains(./tr/th/text(),'Minerai')]",
								document, null, 9, null).singleNodeValue;
	node = node.nextSibling.nextSibling;
	}
	catch(e) {return;}
	
	var trlist = document.evaluate('./tr', node, null, 7, null);
	for (var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i);
		var nature = node.childNodes[5].textContent;
		var caracs = node.childNodes[7].textContent;
		var taille = caracs.match(/\d+/)[0];
		var coef = 1;
		if (caracs.indexOf('Moyen')!=-1) coef = 2;
		else if (caracs.indexOf('Normale')!=-1) coef = 3;
		else if (caracs.indexOf('Bonne')!=-1) coef = 4;
		else if (caracs.indexOf('Exceptionnelle')!=-1) coef = 5;
		if (nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			appendText(node.childNodes[7], ' | UM: '+arrondi(taille*coef) );
			}
		else {
			coef = 0.75*coef+1.25;
			if (nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			appendText(node.childNodes[7], ' | Carats: '+arrondi(taille*coef) );
			}
		}
	}

function treateComposants() {
	if (currentURL.indexOf("as_type=Compo")==-1) return;
	//On récupère les composants
	var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and (contains(td[3]/text()[2],'Tous les trolls') or contains(td[3]/text()[1],'Tous les trolls') ) "
			+ "and td[1]/img/@alt = 'Identifié']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
//		window.alert('treateComposants DOWN');
		return;
		}
	window.alert(nodes.snapshotLength);

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
			prix = n3.childNodes[3].getAttribute('value') + " GG'";
		texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.lastIndexOf('(') + 1, id_taniere.lastIndexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"));
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateAllComposants() {
	if(currentURL.indexOf("as_type=Compo")==-1) return;
	
	//On récupère les composants
	var categ = document.evaluate( "count(//table/descendant::text()[contains(.,'Sans catégorie')])",
							document, null, 0, null ).numberValue;
	var c = (categ == 0 ? 3 : 4);
	var nodes = document.evaluate("//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') "
		+ "or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]/following::table[@width = '100%']"
		+ "/descendant::tr[contains(td[1]/a/b/text(),']') and ("
			+ "td["+c+"]/text()[1] = '\240-\240' "
			+ "or contains(td["+c+"]/text()[2],'Tous les trolls') "
			+ "or contains(td["+c+"]/text()[1],'Tous les trolls') "
			+ "or (count(td["+c+"]/text()) = 1 and td["+c+"]/text()[1]='n°') ) "
		+ "and td[1]/img/@alt = 'Identifié']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
//		window.alert('treateAllComposants DOWN');
		return;
		}

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
		{	
			if(n3.childNodes[3].getAttribute('value') && n3.childNodes[3].getAttribute('value')!="")
				prix = n3.childNodes[3].getAttribute('value') + " GG'";
		}
		else
		{
			prix= prix.replace(/[\240 ]/g, "");
			if(prix=="-")
				prix=null;
		}
		if(prix)
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
		else
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";pas défini\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.indexOf('(') + 1, id_taniere.indexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"),"Vendre tous les composants non réservés sur le Troc de l\'Hydre");
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateEM()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.8/images/Competences/ecritureMagique.png";
	var nodes = document.evaluate("//tr[@class='mh_tdpage']"
			, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var desc = nodes.snapshotItem(i).getElementsByTagName('td') ;
		var link = desc[2].firstChild ;
		var nomCompoTotal = desc[2].textContent ;
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		var nomMonstre = trim(nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length-1)) ;
		var locqual = desc[3].textContent ;
		var qualite = trim(locqual.substring(locqual.indexOf("Qualité:")+9)) ;
		var localisation = trim(locqual.substring(0,locqual.indexOf("|")-1)) ;
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, trim(nomCompo), localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = "Variable";
				var bold = 0;
				if(infos != "Composant variable")
				{
					shortDescr = infos.substring(0,infos.indexOf(" "));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				link.parentNode.appendChild(createImage(urlImg,infos)) ;
				appendText(link.parentNode," ["+shortDescr+"]",bold) ;
			}
		}
		
	}
}

function treateChampi() {
	if (currentURL.indexOf('as_type=Champi')==-1)
		return false;
	var nodes = document.evaluate("//img[@alt = 'Identifié']/../a/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var nomChampi = trim(node.nodeValue.replace(/\240/g, ' '));
		if (moisChampi[nomChampi])
			appendText(node.parentNode.parentNode,' [Mois '+moisChampi[nomChampi]+']');
		}
	}

function treateEnchant()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and td[1]/img/@alt = 'Identifié']/td[1]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png";
		for (var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i);
			var nomCompoTotal = link.firstChild.nodeValue;
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length);
			nomCompoTotal = link.childNodes[1].childNodes[0].nodeValue;
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(" ["));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf("[")+1,nomCompoTotal.indexOf("]"));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function treateEquipEnchant()
{
	if(currentURL.indexOf('as_type=Arme')==-1 && currentURL.indexOf('as_type=Armure')==-1)
		return false;
	initPopupTabcompo();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}

function do_tancompo() {
	start_script();

	treateAllComposants();
	treateComposants();
	traiteMinerai();
	if (MY_getValue('NOINFOEM')!='true') {
		treateChampi();
		treateEM();
		}
	if (MY_getValue(numTroll+'.enchantement.liste') && MY_getValue(numTroll+'.enchantement.liste')!='') {
		treateEnchant();
		treateEquipEnchant();
		}

	displayScriptTime();
}

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

// x~x profil

/*---------------------------- Variables globales ----------------------------*/

var	
	// Structure générale des données
	lignesProfil, lignesPV,
	tr_comps, tr_sorts,
	
	// Anatrolliseur
	urlAnatrolliseur,
	
	// Infobulles talents
	hauteur = 50, bulleStyle = null,
	
	// Caractéristiques (ordre de la page)
		// pour setAccel()
	race,
		// utilisée pour les moyennes MM/jour, kill/jour, etc
	NBjours,
		// calcul des DLA suivantes
	DLA, DLAsuiv, HeureServeur,
		// détails durée du tour (calcul pvdispo) :
	dtb, pdm, bmt,
		//posale
	posX, posY, posN,
		// caracs physiques
	vue, vuebm, vuetotale,
	pvbase, pvmax, pv, pvdispo,
	fatigue, bmfatigue,
	reg, regbm, regmoy,
	att, attbm, attbmm, attmoy,
	esq, esqbm, esqmoy,
	deg, degbm, degbmm, degmoy,
	arm, armbmp, armbmm, armmoy,
	rm, rmbm, mm, mmbm,
	
	// Modificateurs
	// DEBUG: revoir le fonctionnement de "nbattaques" (obsolète) :
	//  |-> gestion (x3) : malusDAtt, malusDEsq, malusDArm
	//  |-> réinit. sur menu
	nbattaques, bmDDegM, bmDAttM,
	
	// Variables spéciales Kastars
	pva, minParPV, overDLA,
		// id pour édition manuelle de lastDLA :
	inJour, inMois, inAn, inHr, inMin, inSec,
		// id pour auto-refresh lastDLA :
	lastDLAZone, maxAMZone, cumulZone,
	lastDLA, DLAaccel;


/*-[functions]----------------- Fonctions utiles -----------------------------*/

function resiste(Ddeg,bm) {
	// version naive mais compréhensible ^^
	// DEBUG: à revoir
	if(!bm) {
		return 2*Math.floor(Ddeg/2);
	}
	return 2*Math.floor(Ddeg/2)+Math.round(bm/2);
}

function getPortee(param) {
	param = Math.max(0,Number(param));
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	// ça devrait être floor, +10.25, -2.5
}

function retourAZero(fatig) {
	var fat = fatig, raz = 0;
	while(fat>0) {
		raz++;
		fat = Math.floor(fat/1.25);
	}
	return raz;
}

function decumulPumPrem(bonus) {
	switch(bonus) {
		case 20: return 33;
		case 33: return 41;
		case 41: return 46;
		case 46: return 49;
		case 49: return 51;
		default: return 20;
	}
}

function coefDecumul(i) {
	switch(i) {
		case 2: return 0.67;
		case 3: return 0.4;
		case 4: return 0.25;
		case 5: return 0.15;
		default: return 0.1;
	}
}

function dureeHM(dmin) {
	var ret = "";
	dmin = Math.floor(dmin);
	if(dmin>59) { ret = Math.floor(dmin/60)+"h"; }
	var mins = dmin%60;
	if(mins!=0) { ret += (ret) ? addZero(mins)+"min" : mins+"min"; }
	return (ret) ? ret : "-";
}


/*-[functions]------- Extraction / Sauvegarde des données --------------------*/

function initAll() {
	var tablePrincipale, lignesCaracs, Nbrs={},
		lignes, paragraphes, str;
	
	// On recherche la table principale du profil et on en extrait les "lignes"
	tablePrincipale = document.evaluate(
		"//h2[@id='titre2']/following-sibling::table",
		document, null, 9, null
	).singleNodeValue;
	
	// ***INIT GLOBALE*** lignesProfil
	// On utilise un snapshot pour continuer à accéder aux lignes dans l'ordre
	// original même si on en ajoute (e.g. fatigue des Kastars)
	lignesProfil = document.evaluate(
		"./tbody/tr",
		tablePrincipale, null, 7, null
	);
	
	// EXTRACTION DES DONNEES BRUTES
	lignes = lignesProfil.snapshotItem(1).cells[1].getElementsByTagName("p")[2].
		childNodes;
	// dtb = Durée Tour de Base, bmt = BM Temps, pdm = Poids Du Matos
	for(var i=lignes.length-1 ; i>=0 ; --i) {
		if(lignes[i].nodeType!=3) { continue; }
		str = trim(lignes[i].nodeValue);
		switch(str.slice(0,5)) {
			case "Durée": Nbrs["dtb"] = str; continue;
			case "Bonus": Nbrs["bmt"] = str; continue;
			case "Poids": Nbrs["pdm"] = str; continue;
		}
	}
	
	lignes = lignesProfil.snapshotItem(2).cells[1].childNodes;
	for(var i=lignes.length-1 ; i>=0 ; --i) {
		if(lignes[i].nodeType!=3) { continue; }
		str = trim(lignes[i].nodeValue);
		switch(str.slice(0,3)) {
			case "X =": Nbrs["pos"] = str; continue;
			case "Vue": Nbrs["vue"] = str; continue;
		}
	}

	Nbrs["niv"] = document.evaluate(
		"./text()[contains(.,'Niveau')]",
		lignesProfil.snapshotItem(3).cells[1],
		null, 9, null
	).singleNodeValue.nodeValue;
	
	// ***INIT GLOBALE*** lignesPV
	// Il y a 4 lignes :
	// 0) PV actuels+barre de PVs, 1) PV max, 2) vide, 3) fatigue
	lignesPV = lignesProfil.snapshotItem(4).cells[1].
		getElementsByTagName("table")[0].rows;
	Nbrs["pva"] = lignesPV[0].cells[0].textContent;
	Nbrs["pvm"] = lignesPV[1].cells[0].textContent;
	Nbrs["fat"] = document.evaluate(
		"./text()[contains(.,'atigue')]",
		lignesPV[3].cells[0],
		null, 9, null
	).singleNodeValue.nodeValue;
	
	lignesCaracs = lignesProfil.snapshotItem(5).cells[1].
		getElementsByTagName("table")[0].rows;
	for(var i=lignesCaracs.length-1 ; i>=0 ; --i) {
		str = trim(lignesCaracs[i].cells[0].textContent).slice(0,3).toLowerCase().
			replace(/é/,'e');
		Nbrs[str] = lignesCaracs[i].textContent;
	}
	
	lignes = lignesProfil.snapshotItem(9).cells[1].childNodes;
	for(var i=lignes.length-1 ; i>=0 ; --i) {
		if(lignes[i].nodeType!=3) { continue; }
		str = trim(lignes[i].nodeValue);
		switch(str.slice(0,3)) {
			case "Rés": Nbrs["rm"] = str; continue;
			case "Maî": Nbrs["mm"] = str; continue;
		}
	}
	
	// TRAITEMENT DES DONNEES
	for(var key in Nbrs) {
		//window.console.debug(key,Nbrs[key]);
		Nbrs[key] = getNumbers(Nbrs[key]);
		//window.console.debug("traitement:",Nbrs[key]);
	}
	
	dtb = Nbrs["dtb"][0]*60+Nbrs["dtb"][1];
	// la ligne des bm de temps n'existe pas si bmt=0 :
	bmt = Nbrs["bmt"] ? Nbrs["bmt"][0]*60+Nbrs["bmt"][1] : 0;
	pdm = Nbrs["pdm"][0]*60+Nbrs["pdm"][1];
	
	posX = Nbrs["pos"][0];
	posY = Nbrs["pos"][1];
	posN = Nbrs["pos"][2];
	
	vue = Nbrs["vue"][0];
	vuebm = Nbrs["vue"][1];
	vuetotale = Math.max(0,vue+vuebm);
	
	nivTroll = Nbrs["niv"][0];
	
	pv = Nbrs["pva"][0];
	pvbase = Nbrs["pvm"][0];
	pvmax = pvbase;
	if(Nbrs["pvm"].length>1) {
		// s'il y a des BM de PV
		pvmax += Nbrs["pvm"][1];
	}
	
	fatigue = Nbrs["fat"][0];
	// bmfat = 0 si pas de BM fat
	bmfatigue = (Nbrs["fat"].length>1) ? Nbrs["fat"][1] : 0;
	
	// les Nbrs[...][1] contiennent les 3 ou les 6 de "D3" ou "D6"
	reg = Nbrs["reg"][0];
	regbm = Nbrs["reg"][2]+Nbrs["reg"][3];
	regmoy = 2*reg+regbm;
	appendTdText(lignesCaracs[0],"(moyenne : "+regmoy+")");
	regmoy = Math.max(0,regmoy);
	// Temps récupéré par reg (propale R')
	str = "Temps moyen récupéré par régénération : "+
		Math.floor(250*regmoy/pvmax)+
		" min";
	var sec = Math.floor(15000*regmoy/pvmax)%60;
	if(sec!=0) { str += " "+sec+" sec"; }
	lignesCaracs[0].title = str;
	
	att = Nbrs["att"][0];
	attbmm = Nbrs["att"][3];
	attbm = Nbrs["att"][2]+attbmm;
	attmoy = 3.5*att+attbm;
	appendTdText(lignesCaracs[1],"(moyenne : "+attmoy+")");
	
	esq = Nbrs["esq"][0];
	esqbm = Nbrs["esq"][2]+Nbrs["esq"][3];
	esqmoy = 3.5*esq+esqbm;
	appendTdText(lignesCaracs[2],"(moyenne : "+esqmoy+")");
	
	deg = Nbrs["deg"][0];
	degbmm = Nbrs["deg"][3];
	degbm = Nbrs["deg"][2]+degbmm;
	degmoy = 2*deg+degbm;
	appendTdText(lignesCaracs[3],
		"(moyenne : "+degmoy+"/"+(2*Math.floor(1.5*deg)+degbm)+")"
	);
	
	rm = Nbrs["rm"][0];
	rmbm = Nbrs["rm"][1];
	rmTroll = rm+rmbm;
	mm = Nbrs["mm"][0];
	mmbm = Nbrs["mm"][1];
	mmTroll = mm+mmbm;
	
	arm = Nbrs["arm"][0];
	if(Nbrs["arm"].length>4) {
		// s'il y a des D d'armure non activés
		armbmp = Nbrs["arm"][4];
		armbmm = Nbrs["arm"][5];
	} else {
		armbmp = Nbrs["arm"][2];
		armbmm = Nbrs["arm"][3];
	}
	armmoy = 2*arm+armbmp+armbmm;
	appendTdText(lignesCaracs[4],"(moyenne : "+armmoy+")");
	
	// Race
	str = lignesProfil.snapshotItem(0).cells[1].innerHTML.split("<br>")[1];
	race = trim(str.slice(str.indexOf(":")+2));
	
	// PuM/PréM
	paragraphes = lignesProfil.snapshotItem(6).cells[1].getElementsByTagName("p");
	if(paragraphes.length>2) {
		lignes = paragraphes[1].childNodes;
		for(var i=lignes.length-1 ; i>=0 ; --i) {
			if(lignes[i].nodeType!=3) { continue; }
			str = lignes[i].nodeValue;
			if(str.indexOf("Dés d'attaque")!=-1) {
				bmDAttM = getNumbers(str)[0];
			} else if(str.indexOf("Dés de dégâts")!=-1) {
				bmDDegM = getNumbers(str)[0];
			}
		}
	}
	//window.console.debug("PuM/PréM",bmDAttM,bmDDegM);
	
	// setDLA()
	str = lignesProfil.snapshotItem(1).cells[1].getElementsByTagName("p")[0].
		getElementsByTagName("b")[0].textContent;
	DLA = new Date( StringToDate(str) );
	
	// setHeureServeur()
	try {
		str = document.evaluate(
			".//text()[contains(.,'Serveur')]",
			document.getElementById("footer2"),
			null, 9, null
		).singleNodeValue.nodeValue;
		str = str.slice(str.indexOf("/")-2,str.lastIndexOf(":")+3);
		HeureServeur = new Date( StringToDate(str) );
	} catch(e) {
		window.console.warn(
			"[MZ] Heure Serveur introuvable, utilisation de l'heure actuelle", e
		);
		HeureServeur = new Date();
	}
	
	// initAnatrolliseur()
	var amelio_dtb = function(dtb) {
		if(dtb>555) {
			return Math.floor((21-Math.sqrt(8*dtb/3-1479))/2);
		}
		return 10+Math.ceil((555-dtb)/2.5);
	},
		amelio_pv = Math.floor(pvbase/10)-3,
		amelio_vue = vue-3,
		amelio_att = att-3,
		amelio_esq = esq-3,
		amelio_deg = deg-3,
		amelio_reg = reg-1,
		amelio_arm = arm-1;
	if(race==="Darkling") { amelio_reg--; }
	if(race==="Durakuir") { amelio_pv-- ; }
	if(race==="Kastar")   { amelio_deg--; }
	if(race==="Skrim")    { amelio_att--; }
	if(race==="Tomawak")  { amelio_vue--; }
	
	urlAnatrolliseur = "http://mountyhall.dispas.net/dynamic/"
		+"outils_anatrolliseur.php?anatrolliseur=v8"
		+"|r="+race.toLowerCase()
		+"|dla="+amelio_dtb(dtb)
		+"|pv="+amelio_pv+",0,"+(pvmax-pvbase)
		+"|vue="+amelio_vue+",0,"+vuebm
		+"|att="+amelio_att+","+Nbrs["att"][2]+","+attbmm
		+"|esq="+amelio_esq+","+Nbrs["esq"][2]+","+Nbrs["esq"][3]
		+"|deg="+amelio_deg+","+Nbrs["deg"][2]+","+degbmm
		+"|reg="+amelio_reg+","+Nbrs["reg"][2]+","+Nbrs["reg"][3]
		+"|arm="+amelio_arm+","+armbmp+","+armbmm
		+"|mm="+mmTroll
		+"|rm="+rmTroll+"|";
}

function saveProfil() {
	//MY_setValue(numTroll+'.profilON',true); // pour remplacer isProfilActif ?
	//MY_setValue('NIV_TROLL',nivTroll);
	MY_setValue(numTroll+'.caracs.attaque',att);
	MY_setValue(numTroll+'.caracs.attaque.bm',attbm);
	MY_setValue(numTroll+'.caracs.attaque.bmp',attbm-attbmm);
	MY_setValue(numTroll+'.caracs.attaque.bmm',attbmm);
	MY_setValue(numTroll+'.caracs.esquive',esq);
	MY_setValue(numTroll+'.caracs.esquive.bm',esqbm);
	MY_setValue(numTroll+'.caracs.esquive.nbattaques',nbattaques);
	MY_setValue(numTroll+'.caracs.degats',deg);
	MY_setValue(numTroll+'.caracs.degats.bm',degbm);
	MY_setValue(numTroll+'.caracs.degats.bmp',degbm-degbmm);
	MY_setValue(numTroll+'.caracs.degats.bmm',degbmm);
	MY_setValue(numTroll+'.caracs.regeneration',reg);
	MY_setValue(numTroll+'.caracs.regeneration.bm',regbm);
	MY_setValue(numTroll+'.caracs.vue',vue);
	MY_setValue(numTroll+'.caracs.vue.bm',vuebm);
	MY_setValue(numTroll+'.caracs.pv',pv);
	MY_setValue(numTroll+'.caracs.pv.base',pvbase);
	MY_setValue(numTroll+'.caracs.pv.max',pvmax);
	MY_setValue(numTroll+'.caracs.rm',rmTroll);
	MY_setValue(numTroll+'.caracs.rm.bm',rmbm);
	MY_setValue(numTroll+'.caracs.mm',mmTroll);
	MY_setValue(numTroll+'.caracs.mm.bm',mmbm);
	MY_setValue(numTroll+'.caracs.armure',arm);
	MY_setValue(numTroll+'.caracs.armure.bm',armbmp+armbmm);
	MY_setValue(numTroll+'.caracs.armure.bmp',armbmp);
	MY_setValue(numTroll+'.caracs.armure.bmm',armbmm);
	if(bmDAttM) MY_setValue(numTroll+'.bonus.DAttM',+bmDAttM);
	if(bmDDegM) MY_setValue(numTroll+'.bonus.DDegM',bmDDegM);
	MY_setValue(numTroll+'.position.X',posX);
	MY_setValue(numTroll+'.position.Y',posY);
	MY_setValue(numTroll+'.position.N',posN);
	MY_setValue(numTroll+'.race',race);
	}


/*-[functions]----------- Fonctions modifiant la page ------------------------*/

function newStyleLink() {
	appendButton(
		document.getElementById("titre2"),
		"Nouveau Profil",
		function(){
			window.open("Play_profil2.php","Contenu");
		}
	);
}

function setAnatrolliseur() {
	appendButton(
		lignesProfil.snapshotItem(0).cells[0],
		"Anatrolliser!",
		function(){
			window.open(urlAnatrolliseur,"_blank")
		}
	);
}

function setInfoDateCreation() {
	var strCreation, dateCreation, txt;
	
	strCreation = lignesProfil.snapshotItem(0).cells[1].textContent;
	strCreation = strCreation.slice(
		strCreation.indexOf("(")+1, strCreation.indexOf(")")
	);
	dateCreation = new Date( StringToDate(strCreation) );
	
	// ***INIT GLOBALE*** NBjours
	NBjours = Math.floor((HeureServeur-dateCreation)/864e5)+1;
	
	txt = (NBjours!=1) ?
		"("+NBjours+" jours dans le hall)" :
		"(Bienvenue à toi pour ton premier jour dans le hall)" ;
	appendText(lignesProfil.snapshotItem(0).cells[1], txt, false);
}

function setNextDLA() {
	var
		parDLAsuiv, dureeTourMS, DLAsuivMS, nbLoupes,
		title, nextPv, nextTour,
		str, nbrs;
	
	// ***INIT GLOBALE*** DLAsuiv
	parDLAsuiv = lignesProfil.snapshotItem(1).cells[1].
		getElementsByTagName("p")[3];
	str = parDLAsuiv.getElementsByTagName("i")[0].textContent;
	DLAsuiv = new Date( StringToDate(str) );
	
	// Affichage des tours manqués
	nbrs = getNumbers(
		lignesProfil.snapshotItem(1).cells[1].getElementsByTagName("p")[2].
		getElementsByTagName("b")[0].textContent
	);
	dureeTourMS = nbrs[0]*36e5+nbrs[1]*6e4;
	DLAsuivMS = DLA.getTime()+dureeTourMS;
	nbLoupes = 0;
	while(DLAsuivMS<HeureServeur) {
		DLAsuivMS += dureeTourMS;
		nbLoupes++;
	}
	if(nbLoupes>0) {
		// ***RE-INIT GLOBALE*** DLAsuiv
		DLAsuiv = new Date( DLAsuivMS );
		txt = "(+"+nbLoupes+" tour"+
			(nbLoupes>1?"s":"")+" : "+
			DateToString( DLAsuiv )+
			")";
		appendBr(parDLAsuiv);
		appendText(parDLAsuiv, txt, false);
	}

	// Estimation des DLA suivantes
	title = ""; nextPv = pv;
	for(var i=1 ; i<4 ; ++i) {
		nextPv = Math.min(nextPv+regmoy,pvmax);
		nextTour = dtb +
			Math.max( 0, pdm+bmt + Math.floor(500*(pvmax-nextPv)/pvmax)/2 );
		title += (title?"\n":"")+
			"DLA +"+i+": "+
			DateToString( new Date(DLAsuivMS) )+
			" ("+nextPv+"PV, durée: "+dureeHM(nextTour)+")";
		DLAsuivMS += nextTour*6e4;
	}
	parDLAsuiv.title = title;
}

function vueCarac() {
	var tableCaracs, nodeVue, parentNodeVue,
		tr, td;
	
	// On insère la Vue dans les caracs
	tableCaracs = lignesProfil.snapshotItem(5).cells[1].
		getElementsByTagName("table")[0];
	tr = tableCaracs.insertRow(0);
	appendTdText(tr,"Vue..................:");
	td = appendTdText(tr,vue+" Cases");
	td.colSpan = 2;
	td.align = "right";
	td = appendTdText(tr,aff(vuebm));
	td.align = "right";
	
	// On retire la Vue de la ligne "Position"
	parentNodeVue = lignesProfil.snapshotItem(2).cells[1];
	nodeVue = document.evaluate(
		"./text()[contains(.,'Vue')]",
		parentNodeVue,
		null, 9, null
	).singleNodeValue;
	parentNodeVue.removeChild(nodeVue.previousSibling);
	parentNodeVue.removeChild(nodeVue);
}

function setLieu() {
	var urlBricol = 'http://trolls.ratibus.net/mountyhall/lieux.php'+
		'?search=position&orderBy=distance&posx='+
		posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3';
	if(MY_getValue('VUECARAC')=='true') {
		insertButton(
			lignesProfil.snapshotItem(2).cells[1].getElementsByTagName("b")[0],
			'Lieux à proximité',
			function(){ window.open(urlBricol,'_blank') }
		);
	} else {
		appendBr(lignesProfil.snapshotItem(2).cells[0]);
		appendButton(
			lignesProfil.snapshotItem(2).cells[0],
			'Lieux à proximité',
			function(){ window.open(urlBricol,'_blank') }
		);
	}
}

function setInfosPxPi() {
	if(nivTroll==60) return;
	
	/* Extraction des données */
	var TDexp = lignesProfil.snapshotItem(3).cells[1];
	var node = TDexp.firstChild;
	var str = node.nodeValue;
	var pi_tot = parseInt(str.match(/\d+/g)[1]);
	var nbrs = getNumbers(TDexp.childNodes[2].nodeValue);
	var px = nbrs[0]+nbrs[1];
	var pi_nextLvl = nivTroll*(nivTroll+3)*5;
	var px_ent = 2*nivTroll;
	if(nivTroll<3) px_ent=Math.max(px_ent,Math.min(px,5));
	var nb_ent = Math.ceil((pi_nextLvl-pi_tot)/px_ent);
	
	/* Modification ligne "Niveau" */
	str = str.substring(0,str.length-1)+' | Niveau '+(nivTroll+1)+' : '
		+pi_nextLvl+' PI => '+nb_ent+' entraînement';
	if(nb_ent>1) str += 's';
	str += ')';
	var span = document.createElement('span');
	span.title = (Math.round(10*(pi_tot+px)/NBjours)/10)+' PI par jour';
	appendText(span,str);
	TDexp.replaceChild(span,node);
	
	/* Ajout ligne PX entrainement */
	insertBr(TDexp.childNodes[3]);
	node = document.createElement('i');
	if(px<px_ent)
		appendText(node,
			'Il vous manque '+(px_ent-px)+' PX pour vous entraîner.'
			);
	else
		appendText(node,
			'Entraînement possible. Il vous restera '+(px-px_ent)+' PX.'
			);
	insertBefore(TDexp.childNodes[4],node);
	}

function setInfosPV() { // pour AM et Sacro
	var
		txt = "1 PV de perdu = +"+Math.floor(250/pvmax)+" min",
		sec = Math.floor(15000/pvmax)%60,
		lifebar = lignesPV[0].cells[1].getElementsByTagName("table")[0];
	if(sec!=0) { txt += " "+sec+" sec"; }
	if(lifebar) { lifebar.title = txt; }
	if(pv<=0) { return; }
	
	// Différence PV p/r à équilibre de temps (propale R')
	// Note : pvmin pour 0 malus = pvmax + ceiling(pvmax/250*(bmt+pdm))
	// ***INIT GLOBALE*** pvdispo
	pvdispo = pv-pvmax-Math.ceil((bmt+pdm)*pvmax/250);
	var	
		td = appendTd(lignesPV[2]),
		span = document.createElement("span");
	span.title = txt;
	span.style.fontStyle = "italic";
	if(bmt+pdm>=0) {
		txt = "Vous ne pouvez compenser aucune blessure actuellement.";
	} else if(pvdispo>0) {
		txt = "Vous pouvez encore perdre "+
			Math.min(pvdispo,pv)+
			" PV sans malus de temps.";
	} else if(pvdispo<0) {
		txt = "Il vous manque "
			+(-pvdispo)
			+" PV pour ne plus avoir de malus de temps.";
	} else {
		txt = "Vous êtes à l'équilibre en temps (+/- 30sec).";
	}
	appendText(span,txt);
	td.appendChild(span);
}

function setCurrentEsquive() {
	var pnode = lignesProfil.snapshotItem(6).cells[1].
		getElementsByTagName("p")[0];
	var attmod = pnode.childNodes[3].nodeValue.match(/\d+/)[0];
	pnode.childNodes[3].nodeValue +=
		' (moyenne attaque : '+Math.max(attmoy-3.5*attmod,attbm,0)+')';
	var esqmod = pnode.childNodes[5].nodeValue.match(/\d+/)[0];
	pnode.childNodes[5].nodeValue +=
		' (moyenne esquive : '+Math.max(esqmoy-3.5*esqmod,esqbm,0)+')';
	nbattaques = parseInt(esqmod);
	var armmod = pnode.childNodes[7].nodeValue.match(/\d+/)[0];
	pnode.childNodes[7].nodeValue +=	
		' (moyenne armure : '+Math.max(armmoy-2*armmod,armbmp+armbmm,0)+')';
	}

function setStabilite() {
	var node = lignesProfil.snapshotItem(5).getElementsByTagName("p")[0];
	appendBr(node);
	appendText(node,
		'- Stabilité..........: '+Math.floor(2*(esq+reg)/3)+' D6 '+aff(esqbm)
		+' (moyenne : '+Math.round(3.5*Math.floor(2*(esq+reg)/3)+esqbm)+')'
	);
}

function setRatioKillDeath() {
	try{
		var node = document.evaluate(
			"./td[2]/p[contains(./text(),'Adversaires tués')]",
			lignesProfil.snapshotItem(6),null,9,null).singleNodeValue;
		var killnode = node.firstChild;
		var deathnode = node.childNodes[2];
		}
	catch(e){return;}
	var kill = getNumbers(killnode.nodeValue)[0];
	var span = document.createElement('span');
	span.title  = 'Un kill tous les '
		+(Math.round(10*NBjours/kill)/10)+' jours';
	appendText(span,killnode.nodeValue);
	node.replaceChild(span,killnode);
	var death = getNumbers(deathnode.nodeValue)[0];
	if(death) {
		span = document.createElement('span');
		span.title = 'Une mort tous les '
			+(Math.round(10*NBjours/death)/10)+' jours';
		appendText(span,deathnode.nodeValue);
		node.replaceChild(span,deathnode);
		appendBr(node);
		appendText(node,
			'Rapport meurtres/décès : '+Math.floor((kill/death)*1000)/1000
			);
		}
	}

function setTotauxMagie() {
	var td = lignesProfil.snapshotItem(9).cells[1];
	/* RM */
	var span = document.createElement('span');
	span.title = (Math.round(10*rm/NBjours)/10)
				+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
				+(Math.round(10*rm/nivTroll)/10)+
				' ('+(Math.round(10*rmTroll/nivTroll)/10)+') points de RM par niveau';
	appendText(span,td.firstChild.nodeValue+' (Total : '+rmTroll+')');
	td.replaceChild(span,td.firstChild);
	/* MM */
	span = document.createElement('span');
	span.title = (Math.round(10*mm/NBjours)/10)
				+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
				+(Math.round(10*mm/nivTroll)/10)
				+' ('+(Math.round(10*mmTroll/nivTroll)/10)+') points de MM par niveau';
	appendText(span,td.childNodes[2].nodeValue+' (Total : '+mmTroll+')');
	td.replaceChild(span,td.childNodes[2]);
	}


/*-[functions]----------- Fonctions spéciales Kastars ------------------------*/

function minParPVsac(fat,bm) {
// Calcule le nombre de min gagnées / PV sacrifiés pour une AM réalisée sous
// fatigue = 'fat', sans et avec un bm de fatigue = 'bm'
	var out = [];
	out[0] = (fat>4) ?
		Math.floor(120/( fat*(1+Math.floor(fat/10)) )) :
		30;
	if(bm && bm>0) {
		var totalfat=fat+bm;
		out[1] = (totalfat>4) ?
			Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) )) :
			30; // en principe inutile pour des bm fat >= 15 mais bon...
	}
	return out;
}

function toInt(str) {
	str = parseInt(str);
	return (str) ? str : 0;
	}

function saveLastDLA() {
	// pour les calculs d'AM max
	var str = addZero(toInt(inJour.value))+'/'+addZero(toInt(inMois.value))
		+'/'+toInt(inAn.value)+' '+addZero(toInt(inHr.value))
		+':'+addZero(toInt(inMin.value))+':'+addZero(toInt(inSec.value));
	lastDLA = new Date( StringToDate(str) );
	MY_setValue(numTroll+'.DLA.ancienne',str);
	lastDLAZone.innerHTML = '';
	var b = document.createElement('b');
	b.addEventListener('click',inputMode,false);
	appendText(b,str);
	lastDLAZone.appendChild(b);
	refreshAccel();
	}

function inputMode() {
	// édition manuelle lastDLA
	var date;
	if(lastDLA)
		date = new Date( lastDLA );
	else
		date = new Date( DLAaccel );
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone,'text','inJour',1,2,date.getDate());
	appendText(lastDLAZone,'/');
	inMois = appendTextbox(lastDLAZone,'text','inMois',1,2,1+date.getMonth());
	appendText(lastDLAZone,'/');
	inAn = appendTextbox(lastDLAZone,'text','inAn',3,4,date.getFullYear());
	appendText(lastDLAZone,' - ');
	inHr = appendTextbox(lastDLAZone,'text','inHr',1,2,date.getHours()+'');
	appendText(lastDLAZone,':');
	inMin = appendTextbox(lastDLAZone,'text','inMin',1,2,date.getMinutes()+'');
	appendText(lastDLAZone,':');
	inSec = appendTextbox(lastDLAZone,'text','inSec',1,2,date.getSeconds()+'');
	appendText(lastDLAZone,' - ');
	appendButton(lastDLAZone,'Enregistrer',saveLastDLA);
	}

function setAccel() {
	var
		BMfrais=false,
		fat=fatigue, listeBmFat=[], minppv,
		tr, td, insertPt;

	// Création d'une nouvelle ligne du profil spéciale AM
	tr = document.createElement('tr');
	tr.className = 'mh_tdpage';
	td = document.createElement('td');
	td.className = 'mh_tdtitre';
	td.vAlign = 'top';
	appendText(td,'Fatigue et AM',true);
	tr.appendChild(td);
	insertPt = document.createElement('td');
	tr.appendChild(insertPt);
	// si pas PDA, augmenter la hauteur de la bannière de pub
	if(lignesProfil.snapshotItem(0).cells.length>2) {
		lignesProfil.snapshotItem(0).cells[2].rowSpan = 12;
	}
	insertBefore(lignesProfil.snapshotItem(5),tr);
	
	// Est-on en over-DLA ?
	// ***INIT GLOBALE*** overDLA
	overDLA = (HeureServeur>DLA.getTime()+3e5);
	if(overDLA) {
		fatigue = Math.floor(fatigue/1.25);
		fat=fatigue;
	}

	// Gestion des BM de fatigue
	if(bmfatigue>0) {
		// On tente de récupérer les BM de fatigue de la page des BM
		if(MY_getValue(numTroll+'.bm.fatigue')) {
			var BMmemoire = MY_getValue(numTroll+'.bm.fatigue').split(';');
			BMmemoire.pop();
			var tour = 0;
			for(var i=0 ; i<BMmemoire.length ; i++) {
				var nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				while(tour<=parseInt(nbrs[0])) {
					listeBmFat[tour]=parseInt(nbrs[1]);
					tour++;
				}
			}
		}
		if(listeBmFat[0]==bmfatigue) {
			// Si (bm profil=1er bm stocké), on suppose que les bm stockés sont à jour
			BMfrais = true;
			MY_removeValue(numTroll+".bm.fatigue");
		}
	} else {
		// S'il n'y a pas de bm de fatigue sur le profil, on est à jour
		BMfrais = true;
	}
	if(!BMfrais && bmfatigue>0) {
		// si les BM n'ont pas été rafraîchis, on conjecture le pire:
		if(bmfatigue==15) {
			listeBmFat = [15,15,15];
		} else {
			listeBmFat = [30,30,15];
		}
	}
	if(overDLA) {
		// Si on est en over-DLA, on décale les bm d'un tour
		listeBmFat.shift();
	}
	
	// Tableau des fatigues et accel futures
	var
		minppv = minParPVsac(fat,listeBmFat[0]),
		table, tbody,
		ligneTour, ligneFat, ligneMin,
		col;
	// ***INIT GLOBALE*** minParPV
	minParPV = (listeBmFat[0]==void(0)) ? minppv[0] : minppv[1];
	if(fatigue>0 || listeBmFat[0]>0) {
		table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style.textAlign = "center";
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPt.appendChild(table);
		
		ligneTour = appendTr(tbody,'mh_tdtitre');
		ligneTour.style.fontWeight = "bold";
		td = appendTdText(ligneTour,'Tour :',true);
		td.align = 'left';
		ligneFat = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneFat,'Fatigue :',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		ligneMin = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneMin,'1 PV =',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		col=0;
		while(col<9 && (fat>0 || listeBmFat[col])) {
			if(col==0) {
				if(overDLA) {
					var i = document.createElement('i');
					appendText(i,'À activer');
					ligneTour.appendChild(i);
				} else {
					appendTdText(ligneTour,'En cours');
				}
			} else {
				appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
			}
			if(listeBmFat[col]) {
				if(BMfrais || (!overDLA && col==0)) {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]);
					appendTdText(ligneMin,minppv[1]+'\'');
				} else {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]+' (?)');
					appendTdText(ligneMin,minppv[1]+'\' ('+minppv[0]+'\')');
				}
			} else {
				appendTdText(ligneFat,fat);
				appendTdText(ligneMin,minppv[0]+'\'');
			}
			col++;
			fat = Math.floor(fat / 1.25);
			minppv = minParPVsac(fat,listeBmFat[col]);
		}
		if(fat>1 || (fat==1 && !overDLA)) {
			appendTdText(ligneTour,'\u00A0 ... \u00A0',true);
			appendTdText(ligneFat,'-');
			appendTdText(ligneMin,'-');
		}
		col = (overDLA) ?	
			Math.max(retourAZero(fatigue)-1,col) :
			Math.max(retourAZero(fatigue),col);
		appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
		appendTdText(ligneFat,'0');
		appendTdText(ligneMin,'30\'');
		
		if(!BMfrais && bmfatigue) {
			// si les BM n'ont pas été rafraîchis, on signale:
			appendText(
				insertPt,
				'/!\\ Visitez la page des Bonus/Malus '+
				'pour mettre à jour votre fatigue. /!\\',
				true
			);
			appendBr(insertPt);
		}
		appendBr(insertPt);
	}
	
	if(pv<=0) {
		appendText(insertPt,'Aucun calcul possible : vous êtes mort voyons !');
		return;
	}
	
	if(fatigue>30) {
		appendText(insertPt,'Vous êtes trop fatigué pour accélérer.');
		return;
	}
	
	// Setup lastDLAZone
	if(overDLA) {
		// bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date( DLAsuiv );
		lastDLA = new Date( DLA );
		MY_setValue(numTroll+'.DLA.ancienne',DateToString(DLA));
		// ***INIT GLOBALE*** pva
		pva = Math.min(pv+regmoy,pvmax);
		appendText(
			insertPt,
			'/!\\ Votre DLA est dépassée, calculs basés sur des estimations. /!\\',
			true
		);
		appendBr(insertPt);
	} else {
		DLAaccel = new Date( DLA );
		pva = pv;
		if(MY_getValue(numTroll+'.DLA.ancienne')) {
			lastDLA = new Date(StringToDate(MY_getValue(numTroll+'.DLA.ancienne')));
		} else {
			lastDLA = false;
		}
	}
	appendText(insertPt,'Dernière DLA enregistrée : ');	
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var b = document.createElement('b');
	b.onclick = inputMode;
	lastDLAZone.appendChild(b);
	insertPt.appendChild(lastDLAZone);
	if(lastDLA) {
		appendText(b,DateToString(lastDLA));
	} else {
		appendText(b,'aucune');
	}
	appendBr(insertPt);
	
	// Setup maxAMZone et cumulZone
	appendText(insertPt,'Accélération maximale possible : ');
	maxAMZone = document.createElement('b');
	insertPt.appendChild(maxAMZone);
	appendBr(insertPt);
	cumulZone = document.createElement('span');
	insertPt.appendChild(cumulZone);
	
	refreshAccel();
}

function refreshAccel() {
	var pvs, pvsmax;
	
	// Accélération pour cumul instantané
	//window.console.debug('refreshAccel',pva,DLAaccel,lastDLA,minParPV);
	if(lastDLA) {
		pvsmax = Math.min(
			pva-1,
			Math.ceil( Math.floor((DLAaccel-lastDLA)/6e4)/minParPV )
		);
		maxAMZone.innerHTML = pvsmax+" PV";
	} else {
		pvsmax = pva-1;
		maxAMZone.innerHTML = "inconnue";
	}
	
	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/6e4) / minParPV );
	cumulZone.innerHTML = '';
	if(pvs<=pvsmax) {
		appendText(cumulZone,'Vous devez accélérer d\'au moins ');
		appendText(cumulZone,pvs+' PV', true);
		appendText(cumulZone,' pour activer immédiatement un nouveau tour.');
		if(pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1e3)
				-(pvs-1)*60*minParPV;
			appendText(
				cumulZone,
				' ('+(pvs-1)+' PV dans '+
				Math.floor(gainSec/60)+'min'+
				addZero(gainSec%60)+'s)'
			);
		}
	} else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*6e4 );
		appendText(
			cumulZone,
			'Après votre accélération maximale, il vous faudra encore attendre '+
			dureeHM(avantDLA/6e4)+
			' avant de réactiver.'
		);
	}
}


/*-[functions]-------- Fonctions gérant les infos-bulles ---------------------*/

function traitementTalents() {
	try {
		tr_comps = document.getElementById('competences').rows;
		tr_sorts = document.getElementById('sortileges').rows;
		var titres = document.evaluate(
			"./tbody/tr/td/b/text()",
			document.getElementById('competences').parentNode.
				parentNode.parentNode.parentNode,
			null, 7, null
		);
	} catch(e) {
		avertissement('[traitementTalents] Données non trouvées')
		window.console.error(e);
		return false;
	}
	removeAllTalents();
	var totalComp = injecteInfosBulles(tr_comps,'competences');
	var totalSort = injecteInfosBulles(tr_sorts,'sortileges');
	titres.snapshotItem(0).nodeValue += ' (Total : '+totalComp+'%)';
	titres.snapshotItem(1).nodeValue += ' (Total : '+totalSort+'%)';
	return true;
}

function injecteInfosBulles(liste,fonction) {
	var totalpc = 0;
	// on parse la liste des talents du type 'fonction'
	for(var i=1 ; i<liste.length ; i++) {
		var node = liste[i].cells[1].getElementsByTagName('a')[0];
		var nom = epure(trim(node.textContent));
		var nbrs = getNumbers(
			liste[i].cells[7].textContent
		);
		/*if(nom.indexOf('Piege')!=-1 || nom.indexOf('Golemo')!=-1) {
			// pour piège et golemo, on extrait les sous-comps pour stockage
			// est-ce bien utile ?...
			var lstNoms = trim(
				epure(liste[i].cells[1].lastChild.nodeValue)
			).slice(1,-1).split(', ');
			for(var j=0 ; j<lstNoms.length ; j++) {
				setTalent(lstNoms[j],nbrs[1],nbrs[0]);
			}
			setInfos(node,lstNoms.join(', '),fonction,nbrs[0]);
			totalpc += nbrs[1];
		} else {
			// pour les autres talents, stockage direct
			window.console.debug(nom,fonction,nbrs);
			setInfos(node,nom,fonction,nbrs[0]);
			setTalent(nom,nbrs[1],nbrs[0]);
			totalpc += nbrs[1];
		}*/
		//window.console.debug(nom,fonction,nbrs);
		setInfos(node,nom,fonction,nbrs[0]);
		setTalent(nom,nbrs[1],nbrs[0]);
		totalpc += nbrs[1];

		// stockage des niveaux inférieurs du talent si présents
		for(var j=2 ; j<nbrs.length ; j+=2) {
			//window.console.debug("setTalent(",nom,nbrs[j+1],nbrs[j],")");
			setTalent(nom,nbrs[j+1],nbrs[j]);
			totalpc += nbrs[j+1];
		}
	}
	return totalpc;
}

function setInfos(node,nom,fonction,niveau) {
	node.nom = nom;
	node.fonction = fonction;
	node.niveau = niveau;
	node.onmouseover = setBulle;
	node.onmouseout = cacherBulle;
}

var arrayModifAnatroll = {
	'Glue':'Glu',
	'PuM':'PuiM',
	'HE':'Hurlement',
	//'Insultes':'Insu',
	'Pistage':'Pist',
	'PuC':'Planter'
}

function setTalent(nom,pc,niveau) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement 
	// (et pas les % dont osf) ne serait pas plus rentable
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) { return; }
	if(!niveau) { niveau = 1; }
	
	switch(nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur += 'Insu'+niveau+'|';
		case 'IdT':
			nomEnBase += niveau;
			break;
		case 'AP':
		case 'Baroufle':
		case 'CdB':
		case 'CdM':
		case 'Parer':
		case 'Retraite':
		case 'RB':
		case 'SInterposer':
			nomEnBase += niveau;
		default:
			urlAnatrolliseur += (arrayModifAnatroll[nomEnBase] ? 
				arrayModifAnatroll[nomEnBase] : nomEnBase) + '|';
	}
	
	MY_setValue(numTroll+'.talent.'+nomEnBase,pc);
}

function creerBulleVide() {
	var table = document.createElement('table');
	table.id = 'bulle';
	table.className = 'mh_tdborder';
	table.width = 300;
	table.border = 0;
	table.cellPadding = 5;
	table.cellSpacing = 1;
	table.style =	
		 'position:absolute;'
		+'visibility:hidden;'
		+'z-index:800;'
		+'height:auto;';
	var tr = appendTr(table,'mh_tdtitre');
	appendTdText(tr,'Titre');
	tr = appendTr(table,'mh_tdpage');
	appendTdText(tr,'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(table);
	}

function cacherBulle() {
	if(bulleStyle) bulleStyle.visibility = 'hidden';
	}

function setBulle(evt) {
	var nom = this.nom;
	var fonction = this.fonction;
	var niveau = parseInt(this.niveau);
	var str='';
	if(fonction=='competences') str=competences(nom,niveau);
	else if(fonction=='sortileges') str=sortileges(nom,true);
	if(str=='') return;
	if(nom.indexOf('Golem')!=-1) nom='Golemologie';
	
	var xfenetre, yfenetre, xpage, ypage, element = null;
	var offset = 15;
	var bulleWidth = 300;
	if(!hauteur) hauteur = 50;
	element = document.getElementById('bulle');
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if(evt.pageX) xpage = evt.pageX;
	if(evt.pageY) ypage = evt.pageY;
	if(element) {
		bulleStyle = element.style;
		element.firstChild.firstChild.innerHTML = '<b>'+nom+'</b>';
		element.childNodes[1].firstChild.innerHTML = str;
		}
	if(bulleStyle) {
		if(xfenetre>bulleWidth+offset)
			xpage -= bulleWidth+offset;
		else
			xpage += offset;
		if(yfenetre>hauteur+offset)
			ypage -= hauteur + offset;
		bulleStyle.width = bulleWidth;
		bulleStyle.left = xpage + 'px';
		bulleStyle.top = ypage + 'px';
		bulleStyle.visibility = 'visible';
		}
	}


/*-[functions] Textes des infos-bulles pour les compétences et sortilèges ----*/

function competences(comp,niveau) {
	var texte = '';
	if(comp.indexOf('Acceleration du Metabolisme')!=-1 && minParPV!=null) {
		texte = '<b>1</b> PV = <b>'+minParPV+'</b> minute';
		if(minParPV>1) texte += 's';
		if(overDLA) texte += '<br/><i>(Votre DLA est dépassée.)</i>';
		}
	else if(comp.indexOf('Attaque Precise')!=-1) {
		var pc, lastmax=0, espatt=0;
		var notMaxedOut = false;
		for(var i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetatt = Math.round(3.5*Math.min(Math.floor(1.5*att),att+3*i))+attbm;
			texte += 'Attaque niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(att*1.5),att+3*i)+'</b> D6 '+aff(attbm)+
				' => <b>'+jetatt+'</b><br/>';
			espatt += (pc-lastmax)*jetatt;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<i>Attaque moyenne (si réussite) : <b>'+
				Math.floor(10*espatt/lastmax)/10+'</b></i><br/>';
		}
		texte += 'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
	}
	else if(comp.indexOf('Balayage')!=-1)
		texte = 'Déstabilisation : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+(Math.round(3.5*att)+attbm)+'</b><br/>'
			+'Effet : <b>Met à terre l\'adversaire</b>';
	else if(comp.indexOf('Bidouille')!=-1)
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet '
			+'de votre inventaire avec le texte de votre choix.';
	else if(comp.indexOf('Baroufle')!=-1)
		texte = 'Vous voulez encourager vos compagnons de chasse ? '
			+'Ramassez quelques Coquillages, et en avant la musique !';
	else if(comp.indexOf('Botte Secrete')!=-1)
		texte = 'Attaque : <b>'
			+Math.floor(2*att/3)+'</b> D6 '+aff(Math.floor(attbm/2))
			+' => <b>'
			+Math.round(3.5*Math.floor(2*att/3)+Math.floor(attbm/2))
			+'</b><br/>Dégâts : <b>'
			+Math.floor(att/2)+'</b> D3 '+aff(Math.floor(degbm/2))
			+' => <b>'
			+(2*Math.floor(att/2)+Math.floor(degbm/2))
			+'/'+(2*Math.floor(1.5*Math.floor(att/2))+Math.floor(degbm/2))
			+'</b>';
	else if(comp.indexOf('Camouflage')!=-1) {
		var camou = getTalent('Camouflage');
		texte = 'Pour conserver son camouflage, il faut réussir un jet sous:<br/>'
			+'<i>Déplacement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+'<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+'<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
		}
	else if(comp.indexOf('Charger')!=-1) {
		if(pv<=0)
			return '<i>On ne peut charger personne quand on est mort !</i>';
		var portee = Math.min(
			getPortee(reg+Math.floor(pv/10))-Math.floor((fatigue+bmfatigue)/5),
			vuetotale);
		if(portee<1)
			return '<b>Impossible de charger</b>';
		else {
			texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
				+' => <b>'+attmoy+'</b><br/>'
				+'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
				+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>'
				+'<br/>Portée : <b>'+portee+'</b> case';
			if(portee>1) texte += 's';
			}
		}
	else if(comp.indexOf('Connaissance des Monstres')!=-1) {
		texte = 'Portée horizontale : <b>'+vuetotale+'</b> case';
		if(vuetotale>1) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		}
	else if(comp.indexOf('Piege')!=-1) {
		if(comp.indexOf('Glue')!=-1)
			texte = 'Et si vous colliez vos adversaires au sol ?';
		if(comp.indexOf('Feu')!=-1) {
			if(texte)
				texte += ' À moins que vous ne préfériez les envoyer en l\'air !<br/>';
			texte += 'Dégats du piège à feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
				+' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b>';
			}
		}
	else if(comp.indexOf('Contre-Attaquer')!=-1)
		texte = 'Attaque : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor(attbm/2))
			+' => <b>'+Math.round(3.5*Math.floor(att/2)+Math.floor(attbm/2))
			+'</b><br/>Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
	else if(comp.indexOf('Coup de Butoir')!=-1) {
		var pc, lastmax=0, espdeg=0;
		var notMaxedOut = false;
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+attmoy+'</b>';
		for(var i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetdeg = 2*Math.min(Math.floor(1.5*deg),deg+3*i)+degbm;
			texte += '<br/>Dégâts niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(deg*1.5),deg+3*i)+'</b> D6 '+aff(degbm)+
				' => <b>'+jetdeg+'/'+(jetdeg+2*Math.floor(deg/2))+'</b>';
			espdeg += (pc-lastmax)*jetdeg;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<br/><i>Dégâts moyens (si réussite) : <b>'+
				Math.floor(10*espdeg/lastmax)/10+'/'+
				(Math.floor(10*espdeg/lastmax)/10+2*Math.floor(deg/2))+'</b></i>';
		}
	}
	else if(comp.indexOf('Course')!=-1)
		texte = 'Déplacement gratuit : <b>'
			+Math.floor(getTalent('Course')/2)
			+' %</b> de chance';
	else if(comp.indexOf('Deplacement Eclair')!=-1)
		texte = 'Permet d\'économiser <b>1</b> PA '
			+'par rapport au déplacement classique';
	else if(comp.indexOf('Dressage')!=-1)
		texte = 'Le dressage permet d\'apprivoiser un gowap redevenu sauvage '
			+'ou un gnu sauvage.';
	else if(comp.indexOf('Ecriture Magique')!=-1)
		texte = 'Réaliser la copie d\'un sortilège après en avoir découvert '
			+'la formule nécessite de réunir les composants de cette formule, '
			+'d\'obtenir un parchemin vierge sur lequel écrire, et de récupérer '
			+'un champignon adéquat pour confectionner l\'encre.';
	else if(comp.indexOf('Frenesie')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff(attbm)
			+' => <b>'+attmoy+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 '+aff(degbm)
			+' => <b>'+degmoy+'/'+(degmoy+2*Math.floor(deg/2))+'</b>';
		}
	else if(comp.indexOf('Golem')!=-1)
		texte = 'Animez votre golem en assemblant divers matériaux '
			+'autour d\'un cerveau minéral.'
	else if(comp.indexOf('Grattage')!=-1) {
		texte = 'Permet de confectionner un Parchemin Vierge '
			+'à partir de composants et de Gigots de Gob\'.';
		}
	else if(comp.indexOf('Hurlement Effrayant')!=-1)
		texte = 'Fait fuir un monstre si tout se passe bien.'
			+'<br/>Lui donne de gros bonus sinon...';
	else if(comp.indexOf('Identification des Champignons')!=-1) {
		texte = 'Portée horizontale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/4)+'</b> case';
		if(vuetotale>4) texte += 's';
		}
	else if(comp.indexOf('Insultes')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(vuetotale,1)+'</b> case';
	else if(comp.indexOf('interposer')!=-1)
		texte = 'Jet de réflexe : <b>'
			+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff(esqbm)
			+' => <b>'+Math.round(3.5*Math.floor(2*(esq+reg)/3)+esqbm)+'</b>';
	else if(comp.indexOf('Lancer de Potions') != -1)
		texte = 'Portée : <b>'+(2+Math.floor(vuetotale/5))+'</b> cases';
	else if(comp.indexOf('Marquage')!=-1)
		texte = 'Marquage permet de rajouter un sobriquet à un monstre. Il faut '
			+'bien choisir le nom à ajouter car celui-ci sera définitif. Il faut '
			+'se trouver dans la même caverne que le monstre pour le marquer.';
	else if(comp.indexOf('Melange Magique')!=-1)
		texte = 'Cette Compétence permet de combiner deux Potions pour '
			+'en réaliser une nouvelle dont l\'effet est la somme '
			+'des effets des potions initiales.';
	else if(comp.indexOf('Miner')!=-1)
		texte = 'Portée horizontale (officieuse) : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale (officieuse) : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Necromancie')!=-1)
		texte = 'La Nécromancie permet à partir des composants d\'un monstre '
			+'de faire "revivre" ce monstre.';
	else if(comp.indexOf('Painthure de Guerre')!=-1)
		texte = 'Grimez vos potrõlls et réveillez l\'esprit guerrier '
			+'qui sommeille en eux ! Un peu d\'encre, une Tête Réduite '
			+'pour s\'inspirer, et laissez parler votre créativité.'
	else if(comp.indexOf('Parer')!=-1)
		texte = 'Jet de parade : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor(attbm)/2)
			+' => <b>'
			+Math.round(3.5*Math.floor(att/2)+Math.floor(attbm/2))
			+'</b><hr><i>Equivalent esquive : <b>'
			+(Math.floor(att/2)+esq)+'</b> D6 '+aff(Math.floor(attbm/2)+esqbm)
			+' => <b>'
			+(Math.round(3.5*(Math.floor(att/2)+esq)+Math.floor(attbm/2))+esqbm)
			+'</b></i>';
	else if(comp.indexOf('Pistage')!=-1)
		texte = 'Portée horizontale : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Planter un Champignon')!=-1)
		texte = 'Planter un Champignon est une compétence qui vous permet de '
			+'créer des colonies d\'une variété donnée de champignon à partir de '
			+'quelques exemplaires préalablement enterrés.';
	else if(comp.indexOf('Regeneration Accrue')!=-1)
		texte = 'Régénération : <b>'+Math.floor(pvmax/15)+'</b> D3'
			+' => <b>+'+2*Math.floor(pvmax/15)+'</b> PV';
	else if(comp.indexOf('Reparation')!=-1)
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+'et réparez vous-même votre matériel !';
	else if(comp.indexOf('Retraite')!=-1)
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait '
			+'préférable de préparer un repli stratégique pour déconcerter '
			+'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! '
			+'Quelle intelligence démoniaque.';
	else if(comp.indexOf('Rotobaffe')!=-1) {
		var Datt = att, vattbm = attbm;
		var Ddeg = deg, vdegbm = degbm;
		for(var i=1 ; i<niveau+2 ; i++) {
			texte += '<b>Attaque n°'+i+' :</b><br/>'
				+'Attaque : <b>'+Datt+'</b> D6 '+aff(attbm)
				+' => <b>'+(Math.round(3.5*Datt)+attbm)+'</b><br/>'
				+'Dégâts : <b>'+Ddeg+'</b> D3 '+aff(degbm)
				+' => <b>'+(2*Ddeg+degbm)+'</b>';
			Datt = Math.floor(0.75*Datt); vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75*Ddeg); vdegbm = Math.floor(0.75*vdegbm);
			if(i<niveau+1) texte += '<hr>';
			}
		}
	else if(comp.indexOf('Shamaner')!=-1)
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux '
			+'des monstres en utilisant des champignons (de 1 à 3).';
	else if(comp.indexOf('Tailler')!=-1)
		texte = 'Permet d\'augmenter sensiblement la valeur marchande de certains '
			+'minerais. Mais cette opération délicate n\'est pas sans risques...';
	return texte;
	}

function decumul_buff(nom,str,buff) {
	// Décumul des sorts de buff
	var ret = '1<sup>ere</sup>'+nom+' : <b>'+str+' +'+buff+'</b>';
	var dec = buff, total = buff, i=1;
	while(i<6) {
		i++;
		dec = Math.floor(coefDecumul(i)*buff);
		if(dec<=1 || i==6) break;
		total += dec;
		ret += '<br/><i>'+i+'<sup>e</sup> '+nom+' : '
			+str+' +'+dec+' (+'+total+')</i>';
		}
	ret += '<br/><i>'+i+'<sup>e</sup> et + : '+str+' +'+dec+'</i>';
	return ret;
	}


function sortileges(sort,mainCall,pcA,pcD) {
	// Si mainCall==false, affichage réduit des infos (pour PuM/PréM)
	var texte = '';
	if(mainCall) {
		var pcA = (bmDAttM) ? bmDAttM : false;
		var pcD = (bmDDegM) ? bmDDegM : false;
	}
	if(sort.indexOf('Analyse Anatomique')!=-1) {
		texte = 'Portée horizontale : <b>'
			+Math.floor(vuetotale/2)+'</b> case';
		if(vuetotale>3) { texte += 's'; }
		texte += '<br/>Portée verticale : <b>'
			+Math.floor((vuetotale+1)/4)+'</b> case';
		if(vuetotale>7) { texte += 's'; } 
	}
	else if(sort.indexOf('Armure Etheree')!=-1)
		texte = decumul_buff('AE','Armure magique',reg);
	else if(sort.indexOf('Augmentation')!=-1 && sort.indexOf('Attaque')!=-1)
		texte = decumul_buff('AdA','Attaque physique',1+Math.floor((att-3)/2));
	else if(sort.indexOf('Augmentation')!=-1 && sort.indexOf('Esquive')!=-1)
		texte = decumul_buff('AdE','Esquive',1+Math.floor((esq-3)/2));
	else if(sort.indexOf('Augmentation des Degats')!=-1)
		texte = decumul_buff('AdD','Dégâts physiques',1+Math.floor((deg-3)/2));
	else if(sort.indexOf('Bulle Anti-Magie')!=-1) {
		texte = 'RM : <b>+'+rm+'</b><br/>MM : <b>-'+mm+'</b>';
	}
	else if(sort.indexOf('Bulle Magique')!=-1) {
		texte = 'RM : <b>-'+rm+'</b><br/>MM : <b>+'+mm+'</b>';
	}
	else if(sort.indexOf('Explosion')!=-1)
		texte = 'Dégâts : <b>'
			+Math.floor( 1+(deg+Math.floor(pvmax/10))/2 )+'</b> D3 '
			+' => <b>'+2*Math.floor( 1+(deg+Math.floor(pvmax/10))/2 )
			+' ('+resiste( 1+(deg+Math.floor(pvmax/10))/2 )+')</b>';
	else if(sort.indexOf('Faiblesse Passagere')!=-1) {
		if(pv<=0)
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		texte = 'Portée horizontale : <b>'
			+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Dégâts physiques : <b>-'
			+Math.ceil( (Math.floor(pv/10)+deg-5)/4 )
			+' (-'+Math.ceil( (Math.floor(pv/10)+deg-5)/8 )+')</b><br/>'
			+'Dégâts magiques : <b>-'
			+Math.floor( (Math.floor(pv/10)+deg-4)/4 )
			+' (-'+Math.floor( (Math.floor(pv/10)+deg-2)/8 )+')</b>';
		}
	else if(sort.indexOf('Flash Aveuglant')!=-1)	
		texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>';
	else if(sort.indexOf('Glue')!=-1) {
		texte = 'Portée : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if(vuetotale>2) texte += 's';
		}
	else if(sort.indexOf('Griffe du Sorcier')!=-1) {
		/* Frappe */
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+(Math.round(3.5*(att+modD))+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(deg/2)+'</b> D3 ';
		if(pcD) {
			modD = parseInt(Math.floor(deg/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)+' => <b>'
			+(2*(Math.floor(deg/2)+modD)+degbmm)
			+'/'+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbmm)
			+' ('+resiste(Math.floor(deg/2)+modD,degbmm)
			+'/'+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbmm)
			+')</b>';
		if(!mainCall) return texte;
		/* Venins */
		function addVenin(type,effet,duree) {
			var ret = '<b>Venin '+type+' : </b><br/><b>'+effet+'</b> D3'
				+' pendant <b>'+duree+'</b> tour';
			if(duree>1) ret += 's';
			var dred = Math.max(Math.floor(duree/2),1);
			return ret+' => <b>'+2*effet+' x '+duree+' = '+2*effet*duree
				+'</b> ('+2*effet+' x '+dred+' = '+2*effet*dred+')';
			}
		var effet = 1+Math.floor((Math.floor(pvbase/10)+reg)/3);
		texte += '<hr>'+addVenin('insidieux',effet,2+Math.floor(vue/5));
		effet = Math.floor(1.5*effet);
		texte += '<hr>'+addVenin('virulent',effet,1+Math.floor(vue/10));
		}
	else if(sort.indexOf('Hypnotisme')!=-1)
		texte = 'Esquive : <b>-'+Math.floor(1.5*esq)+'</b> Dés'
			+' (<b>-'+Math.floor(esq/3)+'</b> Dés)';
	else if(sort.indexOf('Identification des tresors')!=-1)
		texte = 'Permet de connaitre les caractéristiques et effets précis '
			+'d\'un trésor.';
	else if(sort.indexOf('Invisibilite')!=-1)
		texte = 'Un troll invisible est indétectable même quand on se trouve '
			+'sur sa zone. Toute action physique ou sortilège d\'attaque '
			+'fait disparaître l\'invisibilité.';
	else if(sort.indexOf('Levitation')!=-1)
		texte = 'Prendre un peu de hauteur permet parfois d\'éviter les ennuis. '
			+'Comme les pièges ou les trous par exemple...';
	else if(sort.indexOf('Precision')!=-1 || sort.indexOf('Puissance')!=-1) {
		var eps = 1, pc = 20;
		var str = 'PréM';
		var newSort;
		var sortAtt = [
			'Projectile Magique',
			'Rafale Psychique',
			'Siphon des Ames',
			'Vampirisme',
			'Griffe du Sorcier'
		];
		if(sort.indexOf('Puissance')!=-1) {
			eps = -1; str='PuM';
		}
		for(var i=1 ; i<4 ; i++) {
			if(texte) { texte += '<hr>'; }
			texte += '<b>'+i+'<sup>e</sup> '+str+' ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for(var j=0 ; j<5 ; j++) {
				if(getTalent(sortAtt[j])) {
					if(newSort) { texte += '<br/><br/>'; }
					texte += '<i>'+sortAtt[j]+' :</i><br/>'
						+sortileges(sortAtt[j],false,eps*pc,-eps*pc);
					newSort = true;
				}
			}
			pc = decumulPumPrem(pc);
		}
	}
	else if(sort.indexOf('Projectile Magique')!=-1) {
		var modD = 0;
		var portee = getPortee(vuetotale);
		texte = 'Attaque : <b>'+vue+'</b> D6 ';
		if(pcA) {
			modD = parseInt(vue*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+(Math.round(3.5*(vue+modD))+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(vue/2)+'</b> D3 ';
		if(pcD) {
			modD = parseInt(Math.floor(vue/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			{ modD = 0; }
		texte += aff(degbmm)
			+' => <b>'+(2*(Math.floor(vue/2)+modD)+degbmm)
			+'/'+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbmm)
			+' ('+resiste(Math.floor(vue/2)+modD,degbmm)
			+'/'+resiste(1.5*Math.floor(vue/2)+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Portée : <b>'+portee+'</b> case';
		if(portee>1) texte += 's';
		}
	else if(sort.indexOf('Projection')!=-1) {
		texte = 'Si le jet de résistance de la victime est raté:<br/>'
			+'la victime est <b>déplacée</b> et perd <b>1D6</b> d\'Esquive<hr>'
			+'Si le jet de résistance de la victime est réussi:<br/>'
			+'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
		}
	else if(sort.indexOf('Rafale Psychique')!=-1) {
		var modD = 0;
		texte = 'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		texte += aff(degbmm)
			+' => <b>'+(2*(deg+modD)+degbmm)+' ('+resiste(deg+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Malus : régénération <b>-'+deg+'</b>';
		}
	else if(sort.indexOf('Sacrifice')!=-1) {
		if(pv<=0)
			return '<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>';
		
		function perteSacro(sac) {
			return ' (-'+(sac+2*Math.floor(sac/5)+2)+' PV)';
			}
		
		var sac = Math.floor((pv-1)/2);
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Soin maximal : <b>'+sac+'</b> PV'+perteSacro(sac);
		/* Sacros max et optimal sans malus (propale R') */
		sac = Math.floor(pvdispo/1.4)-1;
		if(sac>0)
			texte += '<hr>Soin maximal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
		if(sac>3) {
			sac = 5*Math.floor((sac+1)/5)-1;
			texte += '<br/>Soin optimal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
			}
		}
	else if(sort.indexOf('Siphon')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+Math.round(3.5*(att+modD)+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+reg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(reg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)
			+' => <b>'+(2*(reg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*reg)+modD)+degbmm)
			+' ('+resiste(reg+modD,degbmm)+'/'+resiste(1.5*reg+modD,degbmm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Nécrose : attaque magique <b>-'+reg+'</b>';
		}
	else if(sort.indexOf('Telekinesie')!=-1) {
		texte = 'Portée horizontale  :';
		var vt = Math.floor(vuetotale/2)+2;
		var strList = ['d\'une Plum\' ou Très Léger','Léger',
					'Moyen','Lourd','Très Lourd ou d\'une Ton\''];
		for(var i=0 ; i<5 ; i++) {
			texte += '<br/><i>Trésor '+strList[i]+' : </i><b>'+vt+'</b> case';
			if(vt>1) texte += 's';
			vt=Math.max(0,vt-1);
			}
		}
	else if(sort.indexOf('Teleportation')!=-1) {
		var portee = getPortee(mmTroll/5);
		var pmh = (20+vue+portee);
		var pmv = 3+Math.floor(portee/3);
		texte = 'Portée horizontale : <b>'+pmh+'</b> cases<br/>'
			+'Portée verticale : <b>'+pmv+'</b> cases<hr>'
			+'X compris entre '+(posX-pmh)+' et '+(posX+pmh)+'<br/>'
			+'Y compris entre '+(posY-pmh)+' et '+(posY+pmh)+'<br/>'
			+'N compris entre '+(posN-pmv)+' et '+Math.min(-1,posN+pmv)+'<br/>';
		}
	else if(sort.indexOf('Vampirisme')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+Math.floor(2*deg/3)+'</b> D6 ';
		if(pcA) {
			modD = parseInt(Math.floor(2*deg/3)*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
			}
		texte += aff(attbmm)
			+' => <b>'+Math.round(3.5*(Math.floor(2*deg/3)+modD)+attbmm)+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
			}
		else
			modD = 0;
		texte += aff(degbmm)
			+' => <b>'+(2*(deg+modD)+degbmm)+'/'+(2*(Math.floor(1.5*deg)+modD)+degbmm)
			+' ('+resiste(deg+modD,degbmm)+'/'+resiste(1.5*deg+modD,degbmm)+')</b>';
		}
	else if(sort.indexOf('Vision Accrue')!=-1)
		texte = decumul_buff('VA','Vue',Math.floor(vue/2));
	else if(sort.indexOf('Vision lointaine')!=-1)
		texte = 'En ciblant une zone située n\'importe où dans le '
			+'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	else if(sort.indexOf('Voir le Cache')!=-1)
		texte = '<b>Sur soi :</b><br/>Portée horizontale : <b>'
			+Math.min(5,getPortee(vue))+'</b> cases<hr>'
			+'<b>À distance :</b><br/>Portée horizontale : <b>'
			+getPortee(vuetotale)+'</b> cases';
	else if(sort.indexOf('Vue Troublee')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Vue : <b>-'+Math.floor(vue/3)+'</b>';
	return texte;
	}


/*---------------------------------- Main ------------------------------------*/

function do_profil() {
	try {
		start_script(31);

		initAll();

		creerBulleVide();
		newStyleLink();
		setInfoDateCreation();
		setNextDLA();
		if(MY_getValue('VUECARAC')=='true') { vueCarac(); }
		setLieu();
		setInfosPV();
		setInfosPxPi();
		setStabilite();
		setCurrentEsquive();
		setRatioKillDeath();
		setTotauxMagie();
		if(traitementTalents()) {
			setAnatrolliseur();
		}
		// Cette fonction modifie lourdement le DOM, à placer en dernier :
		if(race=='Kastar') { setAccel(); }
		saveProfil();
		displayScriptTime();
	} catch(e) {
		avertissement("[MZ] Une erreur s'est produite.");
		window.console.error("[MZ] Erreur générale Profil",e);
	}
}

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

// x~x pjview

/* TODO
 * - MZ2.0 : Implémenter les BDD en dur dans le module interne
 */

// Bulle d'infos
var DivInfo;
// Booléen stockant l'état de freezing de la bulle
var freezed = false;

// liste du matos
// mh_caracs ['Nom'] = [ 'Type', 'AttP', 'AttM', 'DegP','DegM', 'Esq',
// 'ArmP','ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max' ];
var mh_caracs = {
	'anneau de protection':
		['anneau',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00,3.00,13.00],
	"armure d'anneaux":
		['armure',0,0,0,0,-8,8,0,0,0,90,180,0,0,0,0.00,80.00,80.00],
	'armure de bois':
		['armure',0,0,0,0,-3,5,0,0,0,20,50,0,0,0,0.00,50.00,50.00],
	'armure de cuir':
		['armure',0,0,0,0,0,2,0,0,0,10,20,0,0,0,0.00,10.00,10.00],
	'armure de peaux':
		['armure',0,0,0,0,-2,4,0,0,0,20,60,0,0,0,0.00,45.00,45.00],
	'armure de pierre':
		['armure',0,0,0,0,-6,12,0,0,0,60,150,0,0,0,0.00,120.00,120.00],
	'armure de plates':
		['armure',0,0,0,0,-5,10,0,0,0,50,100,0,0,0,0.00,100.00,100.00],
	'baton lesté':
		['arme',2,0,-1,0,0,0,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'bâtons de parade':
		['arme',-4,0,0,0,2,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'bottes':
		['bottes',0,0,0,0,2,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'bouclier à pointes':
		['bouclier',1,0,1,0,-1,4,0,0,0,0,0,0,0,0,0.00,35.00,35.00],
	'boulet et chaîne':
		['arme',-3,0,5,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'cagoule':
		['casque',0,0,0,0,1,0,0,-1,0,0,0,5,10,0,0.00,2.50,2.50],
	'casque à cornes':
		['casque',0,0,1,0,-1,3,0,-1,0,5,10,0,0,0,0.00,10.00,10.00],
	'casque à pointes':
		['casque',1,0,1,0,0,3,0,-1,0,0,0,0,0,0,0.00,12.50,12.50],
	'casque en cuir':
		['casque',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,5.00,5.00],
	'casque en métal':
		['casque',0,0,0,0,0,2,0,-1,0,5,10,0,0,0,0.00,10.00,10.00],
	'chaîne cloutée':
		['arme',-2,0,4,0,1,0,0,0,0,0,0,0,0,0,0.00,35.00,35.00],
	'chapeau pointu':
		['casque',0,0,0,0,0,1,0,0,0,0,0,5,10,0,0.00,5.00,5.00],
	'collier de dents':
		['talisman',0,0,1,0,0,0,0,0,0,0,0,0,0,0,5.00,1.00,1.00],
	'collier de pierre':
		['talisman',0,0,0,0,0,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50],
	'collier à pointes':
		['talisman',0,0,1,0,-1,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'cotte de mailles':
		['armure',0,0,0,0,-3,7,0,0,0,30,60,0,0,0,0.00,70.00,70.00],
	'couronne de cristal':
		['casque',0,0,0,1,-1,0,-1,3,0,0,0,0,0,0,0.00,10.00,10.00],
	"couronne d'obsidienne":
		['casque',0,0,0,-1,0,1,2,0,-1,0,0,0,0,0,0.00,10.00,10.00],
	"coutelas d'obsidienne":
		['arme',2,0,2,0,0,0,0,0,-2,-10,-5,-30,-15,0,0.00,5.00,5.00],
	'coutelas en os':
		['arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,4.00,4.00],
	'crochet':
		['arme',-2,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50],
	'cuir bouilli':
		['armure',0,0,0,0,-1,3,0,0,0,20,40,0,0,0,0.00,18.00,18.00],
	"cuirasse d'ossements":
		['armure',0,0,0,0,-3,5,0,0,0,15,30,15,30,0,0.00,67.50,67.50],
	"cuirasse d'écailles":
		['armure',0,0,0,0,-3,6,0,0,0,30,70,0,0,0,0.00,60.00,60.00],
	'culotte en cuir':
		['armure',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'dague':
		['arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'epée courte':
		['arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,10.00,10.00],
	'epée longue':
		['arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	'espadon':
		['arme',-6,0,8,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00],
	'fouet':
		['arme',4,0,-2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00],
	'fourrures':
		['armure',0,0,0,0,0,2,0,0,0,15,30,0,0,0,0.00,10.00,10.00],
	'gantelet':
		['arme',-2,0,1,0,1,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'gorgeron en cuir':
		['talisman',0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'gorgeron en métal':
		['talisman',0,0,0,0,0,2,0,0,-1,0,0,0,0,0,0.00,5.00,5.00],
	'gourdin':
		['arme',-1,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50],
	'gourdin clouté':
		['arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'grimoire':
		['bouclier',-2,2,-1,1,0,0,0,0,0,0,0,5,10,0,10.00,25.00,25.00],
	"gros'porte":
		['bouclier',0,0,0,0,-1,5,0,0,0,10,20,0,0,0,0.00,50.00,50.00],
	'grosse racine':
		['arme',-1,0,3,0,0,0,0,0,0,5,10,0,0,0,0.00,20.00,20.00],
	'grosse stalagmite':
		['arme',-20,0,28,0,-15,0,0,-4,0,0,0,0,0,0,0.00,125.00,125.00],
	'hache de bataille':
		['arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00],
	'hache de guerre en os':
		['arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,25.00,25.00],
	'hache de guerre en pierre':
		['arme',-10,0,14,0,0,0,0,0,0,5,10,0,0,0,0.00,75.00,75.00],
	"hache à deux mains d'obsidienne":
		['arme',-8,0,16,0,0,0,0,0,-4,-90,-50,-30,-15,0,0.00,75.00,75.00],
	'hallebarde':
		['arme',-10,0,12,0,0,0,0,0,0,0,0,0,0,0,0.00,60.00,60.00],
	"haubert d'écailles":
		['armure',0,0,0,0,-4,8,0,0,0,40,80,0,0,0,0.00,80.00,80.00],
	'haubert de mailles':
		['armure',0,0,0,0,-4,9,0,0,0,40,90,0,0,0,0.00,90.00,90.00],
	'heaume':
		['casque',-1,0,0,0,0,4,0,-2,0,10,20,0,0,0,0.00,20.00,20.00],
	'jambières en cuir':
		['bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,10.00,10.00],
	'jambières en fourrure':
		['bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,2.50,2.50],
	'jambières en maille':
		['bottes',0,0,0,0,-1,3,0,0,0,5,10,0,0,0,0.00,20.00,20.00],
	'jambières en métal':
		['bottes',0,0,0,0,-2,4,0,0,0,5,10,0,0,0,0.00,25.00,25.00],
	'jambières en os':
		['bottes',0,0,0,0,-1,2,0,0,0,5,10,0,0,0,0.00,10.00,10.00],
	"lame d'obsidienne":
		['arme',2,0,6,0,0,0,0,0,-3,-60,-30,-20,-10,0,0.00,20.00,20.00],
	'lame en os':
		['arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00],
	'lame en pierre':
		['arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	'lorgnons':
		['casque',0,0,0,0,-1,0,0,1,0,0,0,5,10,0,0.00,2.50,2.50],
	'machette':
		['arme',1,0,2,0,-1,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	"masse d'arme":
		['arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'pagne de mailles':
		['armure',0,0,0,0,2,1,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'pagne en cuir':
		['armure',0,0,0,0,2,-1,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'robe de mage':
		['armure',0,0,0,0,-1,2,1,0,0,10,20,10,20,0,0.00,20.00,20.00],
	'rondache en bois':
		['bouclier',0,0,0,0,1,1,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'rondache en métal':
		['bouclier',0,0,0,0,1,2,0,0,0,0,0,0,0,0,0.00,30.00,30.00],
	'sandales':
		['bottes',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'souliers dorés':
		['bottes',0,0,0,0,-1,1,1,0,0,0,0,0,0,0,0.00,10.00,10.00],
	"talisman d'obsidienne":
		['talisman',1,0,2,0,0,0,0,0,-4,20,40,20,40,0,0.00,2.50,2.50],
	'talisman de pierre':
		['talisman',0,0,0,0,0,0,0,0,-1,10,20,10,20,0,0.00,2.50,2.50],
	'targe':
		['bouclier',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'torche':
		['arme',1,0,1,0,0,0,0,1,0,0,0,0,0,0,0.00,5.00,5.00],
	'torque de pierre':
		['talisman',0,0,0,0,0,0,0,0,-2,20,40,20,40,0,0.00,2.50,2.50],
	'tunique':
		['armure',0,0,0,0,1,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50],
	"tunique d'écailles":
		['armure',0,0,0,0,-1,3,0,0,0,15,30,0,0,0,0.00,30.00,30.00],
	'turban':
		['casque',0,0,0,0,0,0,0,0,0,10,20,0,0,0,0.00,2.50,2.50]
}

// liste des templates
// mh_templates['Nom'] = [ 'AttP', 'AttM', 'DegP', 'DegM', 'Esq',
// 'ArmP', 'ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
var mh_templates = {
	'de Feu':
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de Résistance':
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
	"de l'Aigle":
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
	'de la Salamandre':
		[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'des Cyclopes':
		[0,1,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0],
	'des Enragés':
		[0,1,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Tortues':
		[0,0,0,0,0,0,2,0,0,0,0,0,0,0,30,0,0],
	'des Vampires':
		[0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'du Glacier':
		[0,1,0,0,0,0,1,0,0,5,5,0,0,0,0,0,0],
	'du Rat':
		[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'du Roc':
		[0,0,0,0,-1,0,1,0,0,0,0,0,0,0,0,0,0],
	'du Temps':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,0,0],
	'du Vent':
		[0,0,0,-1,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'en Mithril':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Anciens':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Champions':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Duellistes':
		[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de la Terre':
		[0,0,0,0,0,0,0,0,2,0,0,0,0,5,30,0,0],
	"de l'Orage":
		[0,0,0,-1,2,0,0,0,0,0,0,0,0,0,0,0,0],
	"de l'Ours":
		[0,0,0,2,0,0,0,0,0,0,0,0,0,5,30,0,0],
	'des Béhémoths':
		[0,0,0,0,0,0,3,0,0,0,0,0,0,0,30,0,0],
	'des Mages':
		[0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0],
	'du Pic':
		[0,0,0,0,-1,0,2,0,0,0,0,0,0,0,0,0,0],
	'du Sable':
		[0,0,0,0,3,0,-1,-1,0,0,0,0,0,0,0,0,0],
	'acéré':
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'acérée':
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'équilibré':
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'équilibrée':
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'léger':
		[0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0],
	'légère':
		[0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0],
	'renforcé':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	'renforcée':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	'robuste':
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
}

function clone(arr) {
// Clonage rapide
	return arr.slice(0);
}

function addArray(arr1,arr2) {
// Somme matricielle
	var res = clone(arr1);
	for(i=res.length-1 ; i>=0 ; i--) {
		res[i] += arr2[i];
	}
	return res;
}

function getTemplates(nomItem) {
// Déstructure le nom de l'item en array [nom, template1, ...]
	var tempFound = true;
	var str = nomItem.trim();
	var arr = [];
	while(tempFound) {
		tempFound = false;
		for(var temp in mh_templates) {
			// on teste la fin du nom contre chaque template
			if(str.slice(-temp.length)!=temp) { continue; }
			tempFound = true;
			str = str.slice(0,-temp.length-1);
			arr.unshift(temp);
			if(str.slice(-3)==' et') {
				str = str.slice(0,-3);
			}
		}
	}
	arr.unshift(str);
	return arr;
}

function addMithril(arrayCaracs,typeItem) {
// Ajoute l'effet du Mithril sur les caracs
	if(typeItem=='arme') {
		if(arrayCaracs[0]<0) {
			arrayCaracs[0] = Math.ceil(arrayCaracs[0]/2);
		}
	}
	else {
		if(arrayCaracs[4]<0) {
			arrayCaracs[4] = Math.ceil(arrayCaracs[4]/2);
		}
	}
	arrayCaracs[15] /= 2;
	arrayCaracs[16] /= 2;
	return arrayCaracs;
}

function addRenfort(arrayCaracs,template) {
// Ajoute l'effet des pseudo-templates sur les caracs
// S'applique APRÈS le mithril
// WARNING - Cette formule n'a rien d'officiel, gare !
	var coef = 0;
	if(/^lég[e,è]re?$/.test(template)) {
		coef = -1;
	}
	else if(/^renforcée?$/.test(template)
		|| template==='robuste') {
		coef = 1;
	}
	if(coef) {
		arrayCaracs[15] = arrayCaracs[15]+coef*Math.floor(arrayCaracs[15]/10);
		arrayCaracs[16] = arrayCaracs[16]+coef*Math.floor(arrayCaracs[16]/10);
	}
	arrayCaracs = addArray(arrayCaracs,mh_templates[template]);
	return arrayCaracs;
}

function getCaracs(item) {
// Calcule les caractéristiques de l'item
	var templates = getTemplates(item);
	if(!mh_caracs[templates[0]]) {
		// Si l'item est inconnu
		return [];
	}
	var caracs = clone(mh_caracs[templates[0]]);
	var typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if(templates[templates.length-1]=='en Mithril') {
		caracs = addMithril(caracs,typeItem);
		templates.pop();
	}
	if(/^acérée?$/.test(templates[0])
		|| /^équilibrée?$/.test(templates[0])
		|| /^lég[e,è]re?$/.test(templates[0])
		|| /^renforcée?$/.test(templates[0])
		|| templates[0]=='robuste') {
		caracs = addRenfort(caracs,templates[0]);
		templates.shift();
	}
	for(var i=templates.length-1 ; i>=0 ; i--) {
		caracs = addArray(caracs,mh_templates[templates[i]]);
	}
	return caracs;
}

function getLine(tab) {
// Préparation de la ligne à afficher lors d'un mouseover
	var str = '';
	if(tab[0]!=0 || tab[1]!=0) {
		str += '<b>Att : </b>'+aff(tab[0]);
		if(tab[1]!=0) { str += '/'+aff(tab[1]); }
		str += ' | ';
	}
	if(tab[4]!=0) {
		str += '<b>Esq : </b>'+aff(tab[4])+' | ';
	}
	if(tab[2]!=0 || tab[3]!=0) {
		str += '<b>Deg : </b>'+aff(tab[2]);
		if(tab[3]!=0) { str += '/'+aff(tab[3]); }
		str += ' | ';
	}
	if(tab[8]!=0) {
		str += '<b>Reg : </b>'+aff(tab[8])+' | ';
	}
	if(tab[7]!=0) {
		str += '<b>Vue : </b>'+aff(tab[7])+' | ';
	}
	if(tab[5]!=0 || tab[6]!=0) {
		str += '<b>Arm : </b>'+aff(tab[5]);
		if(tab[6]!=0) { str += '/'+aff(tab[6]); }
		str += ' | ';
	}
	if(tab[9]!=0 || tab[10]!=0) {
		str += '<b>RM : </b>'+aff(tab[9])+'%';
		if(tab[9]!=tab[10]) {
			str += '/'+aff(tab[10])+'%';
			}
		str += ' | ';
		}
	if(tab[11]!=0 || tab[12]!=0) {
		str += '<b>MM : </b>'+aff(tab[11])+'%';
		if(tab[11]!=tab[12]) { str += '/'+aff(tab[12])+'%'; }
		str += ' | ';
	}
	if(tab[13]!=0) {
		str += '<b>PV : </b>'+aff(tab[13])+' | ';
	}
	if(tab[14]!=0) {
		str += '<b>DLA : </b>'+aff(tab[14])+' min | ';
	}
	str += '<b>Poids : </b>'+tab[15]+' min';
	if(tab[15]!=tab[16]) {
		str += ' / '+tab[16]+' min';
	}
	return str;
}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.id = 'infosVue';
	DivInfo.className = 'mh_textbox';
	DivInfo.style =
		'position: absolute;'
		+'border: 1px solid #000000;'
		+'visibility:hidden;'
		+'display:inline;'
		+'z-index:99;';
	document.body.appendChild(DivInfo);
	document.onmousemove = getXY;
	document.onclick = changeFreezeStatus;
}

function getXY(evt) {
	if(!freezed && DivInfo.style.visibility=='visible') {
		DivInfo.style.left = evt.pageX+'px';
		DivInfo.style.top = evt.pageY+10+'px';
	}
}

function changeFreezeStatus() {
	if(DivInfo.style.visibility=='visible') {
		freezed = !freezed;
		if(!freezed) { hideInfos(); }
	}
}

function showInfos() {
	if(freezed) { return; } 
	var currentInfos = this.infos;
	DivInfo.innerHTML = currentInfos;
	DivInfo.style.visibility = 'visible';
}

function hideInfos() {
	if(!freezed) { DivInfo.style.visibility = 'hidden'; }
}

function treateEquipement() {
// Extrait les données du matos et réinjecte les infos déduites
	if(MY_getValue('INFOCARAC')=='false') { return; }
	
	var faireLigne = false;
	var caracs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var nodes = document.evaluate(
		"//td/b[text()='Equipement Utilisé']/../../"
		+"td[2]/img[contains(@src,bullet)]",
		document, null, 7, null);
	if(nodes.snapshotLength>0) {
		// Si CSS de base
		for(var i=0 ; i<nodes.snapshotLength ; i++) {
			var node = nodes.snapshotItem(i);
			var next = node.nextSibling;
			var nnext = next.nextSibling;
			var nom = next.nodeValue.toLowerCase();
			if(nnext.childNodes.length==1) {
				nom += nnext.firstChild.nodeValue;
			}
			nom = nom.trim();
			// gestion winpostrophe
			var c = String.fromCharCode(180);
			while(nom.indexOf(c)!=-1) {
				nom = nom.replace(c,"'");
			}
			var arr = getCaracs(nom);
			if(arr.length>0) {
				faireLigne = true;
				caracs = addArray(caracs,arr);
				var span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.infos = getLine(arr);
				span.onmouseover = showInfos;
				span.onmouseout = hideInfos;
				insertBefore(node.nextSibling,span);
			}
		}
		
		if(faireLigne) {
			var node = document.evaluate("//td/b[text()='Equipement Utilisé']",
				document, null, 9, null).singleNodeValue;
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	}
	else {
		// Si CSS avancée
		nodes = document.evaluate("//dd[@class='equipement']/ul/li",
			document, null, 7, null);
		if(nodes.snapshotLength>0) {
			for(var i=0 ; i<nodes.snapshotLength ; i++) {
				var node = nodes.snapshotItem(i);
				var nom = node.firstChild.nodeValue.toLowerCase();
				if(node.childNodes.length>1) {
					nom += node.childNodes[1].firstChild.nodeValue;
				}
				nom = nom.trim();
				// gestion winpostrophe
				var c = String.fromCharCode(180);
				while(nom.indexOf(c)!=-1) {
					nom = nom.replace(c,"'");
				}
				var arr = getCaracs(nom);
				if(arr.length!=0) {
					caracs = addArray(caracs,arr);
					node.infos = getLine(arr);
					node.onmouseover = showInfos;
					node.onmouseout = hideInfos;
				}
			}
			var nodes = document.evaluate("//dt[@class='equipement']",
				document, null, 7, null);
			var node = nodes.snapshotItem(0);
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
		}
	}
}

function do_pjview() {
	treateEquipement();
	toolTipInit();
}

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

// x~x option

/* TODO
 * Passer le HTML injecté aux conventions HTML5
 */


/*-[functions]------------- Fonctions de sauvegarde --------------------------*/

function saveITData() {
	var IT = document.getElementById('itSelect').value;
	if(IT=='bricol') {
		var system = document.getElementById('urlbricol').value;
		var login = document.getElementById('loginbricol').value;
		var pass = document.getElementById('passbricol').value;
		if(system && login && pass) {
			MY_setValue(numTroll+'.INFOSIT',
				'bricol$'+system+'$'+login+'$'+hex_md5(pass) );
		}
	}
	else {
		MY_removeValue(numTroll+'.INFOSIT');
	}
}

function saveLinks() {
	var numLinks = document.getElementById('linksBody').childNodes.length;
	var data=[ [] ];
	/* Récupération et tri des liens */
	for(var i=1 ; i<=numLinks ; i++) {
		MY_removeValue('URL'+i);
		MY_removeValue('URL'+i+'.nom');
		MY_removeValue('URL'+i+'.ico');
		var url = document.getElementById('url'+i).value;
		var nom = document.getElementById('nom'+i).value;
		var ico = document.getElementById('ico'+i).value;
		if(url && (nom || ico) ) {
			data.push( [url, nom ? nom : '', ico ? ico : ''] );
		}
	}
	/* Sauvegarde */
	for(var i=1 ; i<data.length ; i++) {
		MY_setValue('URL'+i,data[i][0]);
		MY_setValue('URL'+i+'.nom',data[i][1]);
		MY_setValue('URL'+i+'.ico',data[i][2]);
	}
}

function saveAll() {
	var urlIco = document.getElementById('icoMenuIco').value;
	if(urlIco) {
		MY_setValue(numTroll+'.ICOMENU', urlIco );
	}
	else {
		MY_removeValue(numTroll+'.ICOMENU', urlIco );
		document.getElementById('icoMenuIco').value = '';
	}
	saveLinks();
	refreshLinks();
	
	MY_setValue('VUEEXT',document.getElementById('vueext').value);
	
	var maxcdm = parseInt(document.getElementById('maxcdm').value);
	if(maxcdm) {
		MY_setValue(numTroll+'.MAXCDM', maxcdm );
	}
	else {
		MY_removeValue(numTroll+'.MAXCDM');
		document.getElementById('maxcdm').value = '';
	}

	MY_setValue('NOINFOEM',
		document.getElementById('noInfoEM').checked ? 'true' : 'false');
	
	// Pourquoi Tilk stockait-il tout en str ?
	// -> parce que les booléens c'est foireux (vérifié)
	MY_setValue(numTroll+'.USECSS',
		document.getElementById('usecss').checked ? 'true':'false');
	MY_setValue('INFOCARAC',
		document.getElementById('infocarac').checked ? 'true' : 'false');
	//MY_setValue(numTroll+'.SEND_IDT',
	//	document.getElementById('send_idt').checked ? 'oui' : 'non');
	// Fonctionnalité désactivée

	MY_setValue(numTroll+'.AUTOCDM',
		document.getElementById('autoCdM').checked ? 'true' : 'false');
	MY_setValue('VUECARAC',
		document.getElementById('vueCarac').checked ? 'true' : 'false');
	MY_setValue('CONFIRMEDECALAGE',
		document.getElementById('confirmeDecalage').checked ? 'true' : 'false');
	MY_setValue(numTroll+".OLDSCHOOL",
		document.getElementById("oldShoolStyle").checked ? "true" : "false");

	saveITData();
	
	var bouton = document.getElementById('saveAll');
	bouton.value = (bouton.value=='Sauvegardé !') ?	
		'Re-sauvegardé !' : 'Sauvegardé !';
}


/*-[functions]----------------- EventListeners -------------------------------*/

function onChangeIT() {
	var IT = document.getElementById('itSelect').value;
	var itBody = document.getElementById('itBody');
	itBody.innerHTML = '';
	
	if(IT=='bricol') {
		var tr = appendTr(itBody,'mh_tdpage')
		var td = appendTd(tr);
		var str = MY_getValue(numTroll+'.INFOSIT');
		if(str) {
			var arr = str.split('$');
			var system = arr[1];
			var login = arr[2];
		}
		appendText(td,'Nom du système : ');
		appendTextbox(td,'text','urlbricol',20,50,system);
		td = appendTd(tr);
		appendText(td,'Login du compte : ');
		appendTextbox(td,'text','loginbricol',20,50,login);
		td = appendTd(tr);
		appendText(td,'Mot de passe du compte : ');
		appendTextbox(td,'password','passbricol',20,50);
	}
}

function refreshLinks() {
	document.getElementById('linksBody').innerHTML = '';
	var anotherURL = MY_getValue('URL1');
	if(!anotherURL) { addLinkField(); }
	var i=1;
	while(anotherURL && i<99) {
		addLinkField(i,anotherURL,
			MY_getValue('URL'+i+'.nom'),MY_getValue('URL'+i+'.ico') );
		i++;
		anotherURL = MY_getValue('URL'+i);
	}
}

function addLinkField(i,url,nom,ico) {
	var linksBody = document.getElementById('linksBody');
	if(!(i>0)) { i = linksBody.childNodes.length+1; }
	var tr = appendTr(linksBody);
	var td = appendTdCenter(tr);
	appendText(td,'Lien '+i+' : ');
	appendTextbox(td,'text','url'+i,40,150,url);
	td = appendTdCenter(tr);
	appendText(td,'Nom : ');
	appendTextbox(td,'text','nom'+i,20,150,nom);
	td = appendTdCenter(tr);
	appendText(td,'Icône : ');
	appendTextbox(td,'text','ico'+i,40,150,ico);
}

function removeLinkField() {
	var linksBody = document.getElementById('linksBody');
	var i = linksBody.childNodes.length;
	MY_removeValue('URL'+i);
	MY_removeValue('URL'+i+'.nom');
	MY_removeValue('URL'+i+'.ico');
	linksBody.removeChild(linksBody.lastChild);
	if(linksBody.childNodes.length==0) { addLinkField(); }
}

function resetMainIco() {
	document.getElementById('icoMenuIco').value=
		'http://mountyzilla.tilk.info/scripts_0.9/images/MY_logo_small.png';
}


/*-[functions]-------------- Fonctions d'insertion ---------------------------*/

function insertTitle(next,txt) {
	var div = document.createElement('div');
	div.className = 'titre2';
	appendText(div,txt);
	insertBefore(next,div);
}

function insertMainTable(next) {
	var table = document.createElement('table');
	table.width = '98%';
	table.border = 0;
	table.align = 'center';
	table.cellPadding = 2;
	table.cellSpacing = 1;
	table.className =  'mh_tdborder';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	insertBefore(next,table);
	return tbody;
}

function appendSubTable(node) {
	var table = document.createElement('table');
	table.width = '100%';
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	node.appendChild(table);
	return tbody;
}

function insertOptionTable(insertPt) {
	var mainBody = insertMainTable(insertPt);
	
	/* Liens dans le Menu */
	var tr = appendTr(mainBody,'mh_tdtitre');
	var td = appendTdText(tr,'Hyperliens ajoutés dans le Menu :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendText(td,'Icône du Menu: ');
	var url = MY_getValue(numTroll+'.ICOMENU');
	if(!url) { 
		url = 'http://mountyzilla.tilk.info/scripts_0.9/images/MY_logo_small.png';
	}
	appendTextbox(td,'text','icoMenuIco',50,200,url);
	appendButton(td,'Réinitialiser',resetMainIco);
	
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	var tbody = appendSubTable(td);
	tbody.id = 'linksBody';
	refreshLinks();
	
	td = appendTdCenter(appendTr(mainBody,'mh_tdpage'));
	appendButton(td,'Ajouter',addLinkField);
	appendButton(td,'Supprimer',removeLinkField);
	
	/* Options de la Vue : vue externe, nb de CdM, etc */
	tr = appendTr(mainBody,'mh_tdtitre');
	appendTdText(tr,'Options de la Vue :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	tbody = appendSubTable(td);
	
	tr = appendTr(tbody);
	td = appendTdText(tr,'Vue externe : ');
	var select = document.createElement('select');
	select.id = 'vueext';
	td.appendChild(select);
	var listeVues2D = [
		'Bricol\' Vue',
		'Vue du CCM',
		'Vue Gloumfs 2D',
		'Vue Gloumfs 3D',
		'Grouky Vue!'
	];
	for(var i=0 ; i<listeVues2D.length ; i++) {
		appendOption(select,listeVues2D[i],listeVues2D[i]);
	}
	if(MY_getValue('VUEEXT')) {
		select.value = MY_getValue('VUEEXT');
	}
	
	td = appendTd(tr);
	appendCheckBox(td,'noInfoEM',MY_getValue('NOINFOEM')=='true');
	appendText(td,' Masquer les informations à propos de l\'écriture magique');
	
	tr = appendTr(tbody);
	td = appendTdText(tr,'Nombre de CdM automatiquement récupérées : ');
	appendTextbox(td,'text','maxcdm',5,10,MY_getValue(numTroll+'.MAXCDM'));
	
	td = appendTd(tr);
	appendCheckBox(td,'usecss',MY_getValue(numTroll+'.USECSS')=='true');
	appendText(td,' Utiliser la CSS pour les couleurs de la diplomatie');
	
	/* Interface Tactique */
	td = appendTd(appendTr(mainBody,'mh_tdtitre'));
	appendText(td,'Interface Tactique : ',true);
	select = document.createElement('select');
	select.id = 'itSelect';
	appendOption(select,'none','Aucune');
	appendOption(select,'bricol','Système Tactique des Bricol\'Trolls');
	// seule interface supportée !
	td.appendChild(select);
	
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	tbody = appendSubTable(td);
	tbody.id = 'itBody';
	select.onchange = onChangeIT;
	var str = MY_getValue(numTroll+'.INFOSIT');
	if(str) {
		select.value = str.slice(0,str.indexOf('$'));
		onChangeIT();
	}
	
	/* Options diverses */
	td = appendTd(appendTr(mainBody,'mh_tdtitre'));
	appendText(td,'Options diverses :',true);
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'infocarac',MY_getValue('INFOCARAC')!='false');
	appendText(td,
		' Afficher les caractéristiques des équipements des autres Trõlls');
	
	/*td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'send_idt',MY_getValue(numTroll+'.SEND_IDT') != 'non')
	appendText(td,' Envoyer les objets identifiés au système de stats');*/
	
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'autoCdM',MY_getValue(numTroll+'.AUTOCDM')=='true');
	appendText(td,' Envoyer automatiquement les CdM vers la base MountyZilla');
	
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'vueCarac',MY_getValue('VUECARAC')=='true');
	appendText(td,' Afficher la Vue avec les caractéristique dans le Profil');
	
	td = appendTd(appendTr(mainBody,'mh_tdpage'));
	appendCheckBox(td,'confirmeDecalage',MY_getValue('CONFIRMEDECALAGE')=='true');
	appendText(td,' Demander confirmation lors d\'un décalage de DLA');
	
	td = appendTd(appendTr(mainBody,"mh_tdpage"));
	appendCheckBox(td,"oldShoolStyle",MY_getValue(numTroll+".OLDSCHOOL")=="true");
	appendText(td," Ouvrir l'ancien profil par défaut");
	
	/* Bouton SaveAll */
	td = appendTdCenter(appendTr(mainBody,'mh_tdtitre'));
	input = appendButton(td,'Sauvegarder',saveAll);
	input.id = 'saveAll';
	}

function insertCreditsTable(insertPt) {
	var tbody = insertMainTable(insertPt);
	
	var td = appendTdText( appendTr(tbody,'mh_tdtitre'),
		'Depuis son origine, nombreux sont ceux qui ont contribué à faire '
		+'de MountyZilla ce qu\'il est aujourd\'hui. Merci à eux !' );

	var ul = document.createElement('ul');
	td.appendChild(ul);
	appendLI(ul,'Fine fille (6465) pour les popup javascript');
	appendLI(ul,'Reivax (4234) pour les infos bulles');
	appendLI(ul,'Noc (2770) pour les moyennes des caracs');
	appendLI(ul,'Endymion (12820) pour les infos sur les comp/sorts');
	appendLI(ul,'Ratibus (15916) pour l\'envoi de CdM');
	appendLI(ul,'TetDure (41931) pour les PVs restants dans les CdM');
	appendLI(ul,'Les Teubreux pour leur bestiaire !');
	appendLI(ul,'Les développeurs de vue qui font des efforts pour s\'intégrer '
		+'à Mountyzilla');
	appendLI(ul,'Gros Kéké (233) qui permet de tester le script aux limites '
		+'du raisonnable avec sa vue de barbare');
	appendLI(ul,'TuttiRikikiMaoussKosTroll (61214) pour le script '
		+'sur les caracs de l\'équipement');
	appendLI(ul,'Ashitaka (9485) pour le gros nettoyage de l\'extension, '
		+'des scripts, et beaucoup de choses à venir');
	appendLI(ul,'Tous ceux de l\'ancienne génération oubliés par Tilk');
	appendLI(ul,'Zorya (28468), Vapulabehemot (82169), Breizhou13 (50233)... '
		+'et tous les participants au projet ZoryaZilla');
	appendLI(ul,'Yoyor (87818) pour diverses améliorations de code');
	appendLI(ul,'Rokü Menton-brûlant (108387) pour m\'avoir incité à passer '
		+'sur GitHub');
	appendLI(ul,'Rouletabille (91305) & Marmotte (93138) pour leur support '
		+'technique récurrent');
	appendLI(ul,'Hennet (74092) pour le script du nouveau profil');
	appendLI(ul,'Tous les testeurs de la nouvelle génération '
		+'oubliés par Dabihul');
	}


/* [functions]                     Obsolètes                                  */
function deleteEnchantement()
{
	try
	{
	var idEquipement = this.getAttribute('name');
	MY_removeValue(numTroll+".enchantement."+idEquipement+".objet");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.0");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.1");
	MY_removeValue(numTroll+".enchantement."+idEquipement+".composant.2");
	var listeEquipement = MY_getValue(numTroll+".enchantement.liste").split(";");
	var string = "";
	for(var i=0;i<listeEquipement.length;i++)
	{
		if(listeEquipement[i]!=idEquipement)
			if(string=="")
				string = listeEquipement[i];
			else
				string += ";"+listeEquipement[i];
	}
	if(string=="")
	{
		MY_removeValue(numTroll+".enchantement.liste");
		var table = this.parentNode.parentNode.parentNode.parentNode;
		var parent = table.parentNode;
		for(var i=0;i<parent.childNodes.length;i++)
		{
			if(parent.childNodes[i]==table)
			{
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				break;
			}
		}
	}
	else
	{
		MY_getValue(numTroll+".enchantement.liste",string);
		this.parentNode.parentNode.parentNode
			.removeChild(this.parentNode.parentNode);
	}
	}
	catch(e)
	{
		window.alert(e);
	}
}
/* [functions]                     fin Obsolètes                                  */

/*-[functions]---------------- Partie principale -----------------------------*/

function do_option() {
	start_script(712);

	// Pour cryptage des mdp IT
	appendNewScript('http://mountyzilla.tilk.info/scripts/md5.js');

	var insertPoint = document.getElementById('footer1');
	insertBefore(insertPoint,document.createElement('p'));
	insertTitle(insertPoint,'Mountyzilla : Options');
	insertOptionTable(insertPoint);
	/* insertion enchantements ici
	if(...)
	insertEnchantementTable();
	*/
	insertBefore(insertPoint,document.createElement('p'));
	insertTitle(insertPoint,'Mountyzilla : Crédits');
	insertCreditsTable(insertPoint);
	insertBefore(insertPoint,document.createElement('p'));

	/* [zone]                     Obsolète ??                                  */
	if(MY_getValue(numTroll+".enchantement.liste")
		&& MY_getValue(numTroll+".enchantement.liste")!="" )
	{
		insertTitle(insertPoint, 'Les Enchantements en cours');
		table = document.createElement('table');
		table.setAttribute('width', '98%');
		table.setAttribute('border', '0');
		table.setAttribute('align', 'center');
		table.setAttribute('cellpadding', '2');
		table.setAttribute('cellspacing', '1');
		table.setAttribute('class', 'mh_tdborder');

		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		
		tr = appendTr(tbody, 'mh_tdtitre');
		appendTdText(tr, 'Equipement',1);
		appendTdText(tr, 'Composants',1);
		appendTdText(tr, 'Enchanteur',1);
		appendTdText(tr, 'Action',1);
		
		var listeEquipement = MY_getValue(numTroll+".enchantement.liste").split(";");
		for(var i=0;i<listeEquipement.length;i++)
		{
			try
			{
				var idEquipement = listeEquipement[i];
				var nomEquipement = MY_getValue(numTroll+".enchantement."
					+idEquipement+".objet");
				var infoEnchanteur = MY_getValue(numTroll+".enchantement."
					+idEquipement+".enchanteur").split(";");
				var ul = document.createElement('UL');
				for(var j=0;j<3;j++)
				{
					var infoComposant = MY_getValue(numTroll+".enchantement."
						+idEquipement+".composant."+j).split(";");
					var texte = infoComposant[4].replace("Ril ","Œil ");
					for(var k=5;k<infoComposant.length;k++)
					{
						texte += ";"+infoComposant[k].replace("Ril ","Œil ");
					}
					li = appendLI(ul,texte);
					var string = '<form action="http://troc.mountyhall.com/search.php" method="post" TARGET = "_blank">';
					string+= '<input type="hidden" name="monster" value="'+infoComposant[2]+'" />';
					string+= '<input type="hidden" name="part" value="'+infoComposant[0]+'" />';
					string+= '<input type="hidden" name="qualite" value="'+(getQualite(infoComposant[3])+1)+'" />';
					string+= '<input type="hidden" name="q" value="min" />';
					string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Rechercher sur le Troc de l\'Hydre" />';
					string+= ' &nbsp; <input type="button" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" onClick="javascript:window.open(&quot;http://www.cyclotrolls.be/wakka.php?wiki=TroOGle&trooglephr=base%3Amonstres+tag%3Anom+%22'+infoComposant[2]+'%22&quot;)" value="Localiser le monstre grâce à Troogle" /></form>';
					
					string+= '</form>';
	//				string += '<form action="http://www.cyclotrolls.be/wakka.php" method="get" TARGET = "_blank">';
	//				string+= '<input type="hidden" name="wiki" value="TroOGle" />';
	//				string+= '<input type="hidden" name="trooglephr" value="base:monstres tag:nom &quot;'+infoComposant[2]+'&quot;" />';
	//				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Localiser grâce à Troogle" /></form>';
					li.innerHTML += string;
				}
				tr = appendTr(tbody, 'mh_tdpage');
				
				td = appendTdText(tr, nomEquipement);
				td.setAttribute('valign', 'center');
				
				td = document.createElement('td');
				td.appendChild(ul);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');
				
				td = appendTdText(tr, "Enchanteur n°"+infoEnchanteur[0]+" ("+infoEnchanteur[1]+"|"+infoEnchanteur[2]+"|"+infoEnchanteur[3]+")");
				td.setAttribute('valign', 'center');
				
				td = document.createElement('td');
				input = appendButton(td, 'Supprimer l\'enchantement', deleteEnchantement);
				input.setAttribute('name', idEquipement);
				tr.appendChild(td);
				td.setAttribute('valign', 'center');
			}
			catch(e)
			{
			}
		}
		insertBefore(insertPoint, table);
		insertBefore(insertPoint, document.createElement('p'));
	}
	/* [zone]                     fin Obsolète ??                                  */


	displayScriptTime();
}

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

// x~x equip

/**
 * 2014-02-08 - v2.0a (from scratch)
 * 2014-02-18 - v2.0a0
 * - ajout calcul Carats / UM des minerais + totaux
 * 2014-03-06 - v2.0a1
 * - retour Infos EM des Champis
 * TODO
 * Ces fonctions sont dev ici en test, à terme elles seront à intégrer dans libs
 */

function traiteChampis() {
	try{
		var tr = document.getElementById('mh_objet_hidden_Champignon');
		var trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
		}
	catch(e){return;}
	if(trlist.length<=0) return;
	for(var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i).childNodes[7];
		var str = node.textContent.trim();
		var type = str.slice(0,str.lastIndexOf(' '));
		var mundi = mundiChampi[type];
		if(!mundi) continue;
		var urlImg = 'http://mountyzilla.tilk.info/scripts_0.9/images/'
			+'Competences/ecritureMagique.png';
		var img = createAltImage(urlImg,'EM','Mundidey '+mundi);
		appendText(node,' ');
		node.appendChild(img);
		}
	}

function traiteCompos() {
	try {
		var tr = document.getElementById('mh_objet_hidden_Composant');
		var tbody = document.evaluate("./td/table/tbody",
			tr, null, 9, null).singleNodeValue;
		}
	catch(e) {return;}
	insererInfosEM(tbody);
	}

function traiteMinerai() {
	try{
		var tr = document.getElementById('mh_objet_hidden_Minerai');
		var trlist = document.evaluate('./td/table/tbody/tr', tr, null, 7, null);
		}
	catch(e){return;}
	if(trlist.length<=0) return;
	var totaux = {};
	var str;
	for(var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i);
		var nature = node.childNodes[7].textContent,
			caracs = node.childNodes[9].textContent;
		var taille = Number(caracs.match(/\d+/)[0]);
		var coef = 1;
		if(caracs.indexOf('Moyen')!=-1) coef = 2;
		else if(caracs.indexOf('Normale')!=-1) coef = 3;
		else if(caracs.indexOf('Bonne')!=-1) coef = 4;
		else if(caracs.indexOf('Exceptionnelle')!=-1) coef = 5;
		if(nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			str = ' | UM: ';
			}
		else {
			coef = 0.75*coef+1.25;
			if(nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			str = ' | Carats: ';
			}
		var carats = Math.round(taille*coef)
		appendText(node.childNodes[9], str+carats );
		if(!totaux[nature]) {
			totaux[nature] = [taille,carats];
			}
		else {
			totaux[nature][0] += taille;
			totaux[nature][1] += carats;
			}
		}
	str = 'Total : ';
	for(var nature in totaux) {
		if(str.length>8) str += ', ';
		if(nature.indexOf('Mithril')!=-1) {
			str += nature+totaux[nature][1]+' UM';
			}
		else {
			str += nature+totaux[nature][0]+'U/'
				+totaux[nature][1]+'c';
			}
		}
	/*var node = document.getElementById('mh_plus_Minerai');
	var titre = document.evaluate("./td[contains(./b/text(),'Minerai')]",
		node.parentNode.parentNode.parentNode, null, 9, null).singleNodeValue;
	if(!titre) return;*/
	// Il faut préalablement injecter du CSS pour ne pas hériter de 'mh_titre3'
	var td = appendTdText(trlist.snapshotItem(0).parentNode, '('+str+')');
	td.colSpan = 7;
	}

function do_equip() {
	start_script();

	traiteChampis();
	traiteCompos();
	traiteMinerai();

	displayScriptTime();
}

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

// x~x diplo

/*
TODO:
 V Étape 1: Gestion comme actuellement, avec 2 couleurs (amis/ennemis)
 V Étape 2: Gestion couleurs par catégorie (10 couleurs)
 V Étape 3: Ajout de la diplo perso
 X Étape 4: Gestion distante (sécurisée par mdp) de cette option
 V Étape 5: Ajout des fioritures (preview de la couleur...)
 
 Options Globales:
 Actuelles:
 	numTroll.USECSS,
 	numTroll.NODIPLO
 	NOMYTH
 Nouvelles:
 	TODO numTroll.USECSS
 	numTroll.diplo.off (remplace NODIPLO)
 	numTroll.diplo.guilde
 	numTroll.diplo.perso
 
 Structure de diplo.guilde:
 isOn: 'true' ou 'false'
 isDetailOn: 'true' ou 'false'
 guilde
 	> id
 	> couleur
 AllAmis,AllEnnemis: couleur
 Amis0,...,Ennemis5
 	> Troll: idTroll1;...;
 	> Guilde: idGuilde1;...;
 	> titre
 	> couleur
 
 Structure de diplo.perso:
 isOn: 'true' ou 'false'
 mythiques: couleur
 Troll,Guilde,Monstre:
 	> id
 	> couleur
 	> description
*/

/*-[functions]-------------- Fonctions utilitaires ---------------------------*/

function couleurAleatoire() {
	var alph = '0123456789ABCDEF'.split('');
	var clr = '#';
	for (var i=0; i<6; i++) {
		clr+=alph[ Math.floor(16*Math.random()) ];
	}
	return clr;
}

function isCouleur(str) {
	return /^#[0-9A-F]{6}$/i.test(str);
}

/*-[functions]---------------- Analyse de la page ----------------------------*/

function appendChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	if(isDetailOn) {
		span.style.display = 'none';
	}
	var couleur = id=='AllAmis'?'#AAFFAA':'#FFAAAA';
	if(diploGuilde[id]) {
		couleur = diploGuilde[id];
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	node.appendChild(span);
}

function insertChoixCouleur(node,id) {
	var span = document.createElement('span');
	span.id = 'span'+id;
	// La couleur détaillée passera à une valeur aléatoire
	// si toggle vers isDetailOn
	var couleur = couleurAleatoire();
	if(!isDetailOn) {
		span.style.display = 'none';
	} else if(diploGuilde[id]) {
		couleur = diploGuilde[id].couleur;
	}
	appendText(span,' - Couleur HTML: ');
	var input = appendTextbox(span,'text',id,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	insertBefore(node,span);
}

function setChoixCouleurs() {
	try {
		var form = document.getElementsByName('ActionForm')[0];
		var nodesAE = document.evaluate(
			"./table/tbody/tr/td[@class='mh_tdtitre']",
			form, null, 7, null
		);
		var nodes = document.evaluate(
			"./table/tbody/tr/td[not(@class='mh_tdtitre')]",
			form, null, 7, null
		);
	} catch(e) {
		window.console.error('[Diplomatie] Structure de la page non reconnue');
		return false;
	};
	nodesAE.snapshotItem(0).parentNode.id = 'insertPt';
	appendChoixCouleur(nodesAE.snapshotItem(0),'AllAmis');
	appendChoixCouleur(nodesAE.snapshotItem(1),'AllEnnemis');
	for(var i=0 ; i<5 ; i++) {
		nodes.snapshotItem(i).id = 'tdAmis'+i;
		insertChoixCouleur(nodes.snapshotItem(i).childNodes[1],'Amis'+i);
		nodes.snapshotItem(i+5).id = 'tdEnnemis'+i;
		insertChoixCouleur(nodes.snapshotItem(i+5).childNodes[1],'Ennemis'+i);
	}
	return true;
}

function fetchDiploGuilde() {
	try {
		for(var AE in {Amis:0,Ennemis:0}) {
			for(var i=0 ; i<5 ; i++) {
				/* Récup des A/E de rang i */
				var td = document.getElementById('td'+AE+i);
				var ligne = td.getElementsByTagName('table')[0].rows;
				var titre = trim(td.firstChild.textContent);
				// On laisse la gestion des couleurs à setChoixCouleurs:
				var couleur = document.getElementById(AE+i).value;
				diploGuilde[AE+i] = {
					Troll:'',
					Guilde:'',
					titre: titre,
					couleur: couleur
				};
				for(var j=1 ; j<ligne.length ; j++) {
					var str = trim(ligne[j].cells[0].textContent);
					var idx = str.lastIndexOf('(');
					var num = str.slice(idx+1,-1);
					var type = trim(ligne[j].cells[1].textContent);
					diploGuilde[AE+i][type] += num+';';
				}
			}
		}
	} catch(e) {
		window.console.error('[Diplomatie] Échec de récupération de la diplo\n'+e);
		return false;
	}
	return true;
}


/*-[functions]--------------------- Handlers ---------------------------------*/

function toggleDetails() {
	isDetailOn = !isDetailOn;
	for(var AE in {Amis:0,Ennemis:0}) {
		document.getElementById('spanAll'+AE).style.display =
			(isDetailOn?'none':'');
		for(var i=0 ; i<5 ; i++) {
			document.getElementById('span'+AE+i).style.display =
				(isDetailOn?'':'none');
		}
	}
}

function toggleMythiques() {
	isMythiquesOn = !isMythiquesOn;
	document.getElementById('spanMythiques').style.display =
		(isMythiquesOn?'':'none');
}

function previewCouleur() {
	var value = this.value;
	if(isCouleur(value)) {
		this.style.backgroundColor = value;
		this.title = '';
	} else {
		this.style.backgroundColor = '';
		this.title = 'Entrez une couleur au format #789ABC pour prévisualiser';
	}
}

function appendMenuType(node,duType) {
	var select = document.createElement('select');
	select.className = 'SelectboxV2';
	var type = ['Guilde','Troll','Monstre'];
	for(var i=0 ; i<3 ; i++) {
		appendOption(select,type[i],type[i]);
		if(type[i]==duType) { select.selectedIndex=i; }
	}
	node.appendChild(select);
}

function ajouteChamp(type,num,couleur,descr) {
	var champs = document.getElementById('diploPerso');
	var nb = champs.rows.length;
	var tr = champs.insertRow(-1);
	var td = appendTd(tr);
	appendMenuType(td,type);
	td = appendTd(tr);
	appendText(td,' n°');
	appendTextbox(td,'text','num'+nb,6,15,num);
	td = appendTd(tr);
	appendText(td,' couleur HTML:');
	var input = appendTextbox(td,'text','couleur'+nb,7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td = appendTd(tr);
	appendText(td,' Description:');
	appendTextbox(td,'text','descr'+nb,30,150,descr);
	td = appendTd(tr);
	var span = document.createElement('span');
	appendText(span,'[ok!]',true);
	span.style.visibility = 'hidden';
	td.appendChild(span);
	td = appendTd(tr);
	var bouton = appendButton(td,'Suppr.',retireCeChamp);
}

function retireCeChamp() {
	var thisTr = this.parentNode.parentNode;
	thisTr.parentNode.removeChild(thisTr);
	var champs = document.getElementById('diploPerso');
	if(champs.rows.length==0) { ajouteChamp(); }
}

function valideChamp(champ) {
	var isValide = /^\d+$/.test(champ.cells[1].childNodes[1].value) &&
		isCouleur(champ.cells[2].childNodes[1].value);
	if(isValide) {
		champ.cells[4].firstChild.style.visibility = 'visible';
	} else {
		champ.cells[4].firstChild.style.visibility = 'hidden';
	}
	return isValide;
}

function sauvegarderTout() {
	/* Diplo de guilde */
	diploGuilde.isOn =
		document.getElementById('isGuildeOn').checked?'true':'false';
	diploGuilde.isDetailOn = (isDetailOn?'true':'false');
	var numGuilde = Number(document.getElementById('numGuilde').value);
	var couleur = document.getElementById('couleurGuilde').value;
	if(numGuilde) {
		diploGuilde.guilde = {
			id: numGuilde,
			couleur: couleur
		};
	} else {
		delete diploGuilde.guilde;
	}
	for(var AE in {Amis:0,Ennemis:0}) {
		diploGuilde['All'+AE] = document.getElementById('All'+AE).value;
		for(var i=0 ; i<5 ; i++) {
			if(isDetailOn) {
				diploGuilde[AE+i].couleur = document.getElementById(AE+i).value;
			} else {
				diploGuilde[AE+i].couleur = diploGuilde['All'+AE];
			}
		}
	}
	MY_setValue(numTroll+'.diplo.guilde',JSON.stringify(diploGuilde));
	
	/* Diplo personnelle (ex-fonction saveChamps) */
	var champs = document.getElementById('diploPerso');
	diploPerso = {
		isOn: document.getElementById('isPersoOn').checked?'true':'false',
		Guilde: {},
		Troll: {},
		Monstre: {}
	};
	if(isMythiquesOn &&
		isCouleur(document.getElementById('couleurMythiques').value)) {
		diploPerso.mythiques = document.getElementById('couleurMythiques').value;
	}
	for(var i=0 ; i<champs.rows.length ; i++) {
		if(valideChamp(champs.rows[i])) {
			var type = champs.rows[i].cells[0].firstChild.value;
			var num = champs.rows[i].cells[1].childNodes[1].value;
			var couleur = champs.rows[i].cells[2].childNodes[1].value;
			var descr = champs.rows[i].cells[3].childNodes[1].value;
			diploPerso[type][num] = {
				couleur: couleur
			};
			if(descr) {
				diploPerso[type][num].titre = descr;
			}
		}
	}
	MY_setValue(numTroll+'.diplo.perso',JSON.stringify(diploPerso));

	avertissement('Données sauvegardées');
}


/*-[functions]------------- Modifications de la page -------------------------*/

function creeTablePrincipale() {
	var insertPt = document.getElementById('insertPt');
	
	/* Titre + bouton de Sauvegarde */
	var tr = insertTr(insertPt,'mh_tdtitre');
	var td = appendTdText(tr,'[Mountyzilla] Options de Diplomatie ',true);
	appendButton(td,'Sauvegarder',sauvegarderTout);
	
	/* Options fixes */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie de guilde:',true);
	appendBr(td);
	appendCheckBox(td,'isGuildeOn',diploGuilde.isOn!='false');
	appendText(td,'Afficher la diplomatie de guilde dans la Vue');
	appendBr(td);
	appendCheckBox(td,'detailOn',isDetailOn,toggleDetails);
	appendText(td,'Utiliser des couleurs détaillées (10)');
	
	/* Diplo personnelle */
	tr = insertTr(insertPt,'mh_tdpage');
	td = appendTdText(tr,'Diplomatie personnelle:',true);
	appendBr(td);
	// Diplo Mythiques
	appendCheckBox(td,'isMythiquesOn',isMythiquesOn,toggleMythiques);
	appendText(td,'Ajouter les monstres Mythiques à la Diplomatie');
	var span = document.createElement('span');
	span.id = 'spanMythiques';
	if(!isMythiquesOn) {
		span.style.display = 'none';
	}
	var couleur = '#FFAAAA';
	if(diploPerso.mythiques) {
		couleur = diploPerso.mythiques;
	}
	appendText(span,' - couleur HTML:');
	var input = appendTextbox(span,'text','couleurMythiques',7,7,couleur);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
	td.appendChild(span);
	appendBr(td);
	// Diplo éditable
	appendCheckBox(td,'isPersoOn',diploPerso.isOn!='false');
	appendText(td,'Afficher la diplomatie personnelle dans la Vue:');
	appendBr(td);
	var table = document.createElement('table');
	table.id = 'diploPerso'
	td.appendChild(table);
	for(var type in {Guilde:0,Troll:0,Monstre:0}) {
		for(var num in diploPerso[type]) {
			ajouteChamp(
				type,
				num,
				diploPerso[type][num].couleur,
				diploPerso[type][num].titre
			);
		}
	}
	if(table.rows.length==0) {
		ajouteChamp();
	}
	appendButton(td,'Ajouter',ajouteChamp)
	// Prévisualisation couleurs (merci à Vys d'avoir implémenté ça xD)
	appendText(td,' ');
	appendButton(td,
		'Exemples de couleur',
		function() {
			var fenetre = window.open(
				'/mountyhall/MH_Play/Options/Play_o_Color.php',
				'Divers',
				'width=500,height=550,toolbar=0,location=0,directories=0,'+
				'status=0,menubar=0,resizable=1,scrollbars=1'
			);
			fenetre.focus();
		}
	);
	
	/* Couleur de Guilde */
	tr = insertTr(insertPt,'mh_tdtitre');
	td = appendTdText(tr,'GUILDE',true);
	appendText(td,' - n°');
	appendTextbox(td,'text','numGuilde',5,10,
		diploGuilde.guilde && diploGuilde.guilde.id ?
			diploGuilde.guilde.id : ''
	);
	appendText(td,' - Couleur HTML: ');
	var input = appendTextbox(td,'text','couleurGuilde',7,7,
		diploGuilde.guilde && diploGuilde.guilde.couleur ?
			diploGuilde.guilde.couleur : '#BBBBFF'
	);
	input.onkeyup = previewCouleur;
	input.onchange = previewCouleur;
	input.onkeyup();
}


/*-[functions]----------------------- Main -----------------------------------*/

var diploGuilde = MY_getValue(numTroll+'.diplo.guilde') ?
	JSON.parse(MY_getValue(numTroll+'.diplo.guilde')) : {};
var isDetailOn = diploGuilde.isDetailOn=='true';
var diploPerso = MY_getValue(numTroll+'.diplo.perso') ?
	JSON.parse(MY_getValue(numTroll+'.diplo.perso')) : {};
var isMythiquesOn = diploPerso.mythiques!=undefined;

function do_diplo() {
	if(setChoixCouleurs() && fetchDiploGuilde()) {
		creeTablePrincipale();
	}
}

/*******************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

// x~x cdmcomp

var pageDispatcher = "http://mountypedia.ratibus.net/mz/cdmdispatcher.php";
//var pageDispatcher = "http://m2m-bugreport.dyndns.org/scripts/dev/cdmdispatcher.php";
//var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var cdm = '';

function getNonNegInts(str) {
	var nbrs = str.match(/\d+/g);
	for(var i=0 ; i<nbrs.length ; i++) {
		nbrs[i] = Number(nbrs[i]);
	}
	return nbrs;
}

function traiteCdM() {
	try {
		var msgEffet = document.getElementById('msgEffet');
	} catch(e) {
		window.console.log('[traiteCdM] msgEffet non trouvé');
		return;
	}

	// Teste si ce message du bot est un message de CdM
	if(!document.evaluate(
			"./p/b/text()[contains(.,'fait partie')]",
			msgEffet, null, 9, null
		).singleNodeValue) {
		return;
	}
	
	// Début de récupération de la CdM
	cdm = document.evaluate(
		"./p/b/text()[contains(.,'fait partie')]",
		msgEffet, null, 9, null
	).singleNodeValue.nodeValue+'\n';
	
	var tbody = document.evaluate(
		"descendant::table/tbody",
		msgEffet, null, 9, null
	).singleNodeValue;
	var nomStat = document.evaluate(
		"./tr/td[1]/b/text()",
		tbody, null, 7, null
	);
	var valStat = document.evaluate(
		"./tr/td[2]/descendant::text()",
		tbody, null, 7, null
	);
	var i=0;
	while(i<nomStat.snapshotLength) {
		if(nomStat.snapshotItem(i).nodeValue.indexOf('Armure Physique')!=-1) {
			cdm += 'Armure : ';
			var armp = getNonNegInts(valStat.snapshotItem(i).nodeValue);
			var armm = getNonNegInts(valStat.snapshotItem(i+1).nodeValue);
			if(valStat.snapshotItem(i).nodeValue.indexOf('(inf')!=-1) {
				armp = [0,armp[0]];
			}
			if(valStat.snapshotItem(i+1).nodeValue.indexOf('(inf')!=-1) {
				armm = [0,armm[0]];
			}
			if(valStat.snapshotItem(i).nodeValue.indexOf('(sup')!=-1 ||
				valStat.snapshotItem(i+1).nodeValue.indexOf('(sup')!=-1) {
				cdm += 'adj (supérieur à '+(armp[0]+armm[0]);
			} else {
				cdm += 'adj (entre '+(armp[0]+armm[0])+' et '+(armp[1]+armm[1]);
			}
			cdm += ')\n';
			i++;
		} else {
			cdm += nomStat.snapshotItem(i).nodeValue+
				' '+valStat.snapshotItem(i).nodeValue+'\n';
		}
		i++;
	}
	
	// Envoi auto ou insertion bouton envoi (suivant option)
	if(MY_getValue(numTroll+'.AUTOCDM')=='true') {
		sendInfoCDM();
		var p = document.createElement('p');
		p.style.color = 'green';
		appendText(p,'CdM envoyée vers la base MountyZilla !');
		insertBefore(document.getElementsByName('as_Action')[0].parentNode,p);
	} else {
		insertButtonCdm('as_Action', sendInfoCDM);
	}

	// Insertion de l'estimation des PV restants
	var pv = valStat.snapshotItem(1).nodeValue;
	if(pv.indexOf("entre")==-1) {
		return;
	}
	pv = getPVsRestants(pv,valStat.snapshotItem(2).nodeValue);
	if(pv) {
		var tr = insertTr(nomStat.snapshotItem(3).parentNode.parentNode.parentNode);
		appendTdText(tr, pv[0], true);
		appendTdText(tr, pv[1], true);
	}
}

function sendInfoCDM() {
	MY_setValue('CDMID', 1+parseInt(MY_getValue('CDMID')) );
	var buttonCDM = this;
	var texte = '';
	FF_XMLHttpRequest({
		method: 'GET',
		url: pageDispatcher+'?cdm='+escape(cdm),
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml'
		},
		onload: function(responseDetails) {
			texte = responseDetails.responseText;
			buttonCDM.value = texte;
			buttonCDM.disabled = true;
		}
	});
}

function do_cdmcomp() {
	start_script(31);
	traiteCdM();
	displayScriptTime();
}

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

// x~x cmdbot

/* v0.2 by Dab - 2013-08-20
 * - patch dégueu pour gérer la décomposition P/M de l'armure
 */

var pageDispatcher = "http://mountypedia.ratibus.net/mz/cdmdispatcher.php";
//var pageDispatcher = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
//var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
//var pageEffetDispatcher = "http://mountypedia.ratibus.net/mz/effetdispatcher.php";
var buttonCDM;

/*******************************************************************************************
CDM :
Vous avez RÉUSSI à utiliser cette compétence au niveau 5 : jet de 34 sur 95 %.

Il ne vous est pas possible d'améliorer cette compétence.

Le Monstre Ciblé fait partie des : Mort-Vivant (Archi-Nécromant [Antique] - N°4571589)
Niveau :	Inimaginable (entre 49 et 51)
Points de Vie :	Surtrollesque (entre 450 et 470)
Blessure (Approximatif) :	0 %	
Dés d'Attaque :	Impressionnant (entre 30 et 32)
Dés d'Esquive :	Impressionnant (entre 28 et 30)
Dés de Dégat :	Très Fort (entre 18 et 20)
Dés de Régénération :	Excellent (égal à 13)
Armure Physique :	Moyen (entre 10 et 12)
Armure Magique :	Faible (inférieur à 6)
Vue :	Moyen (entre 9 et 11)
Maitrise Magique :	Inimaginable (supérieur à 6000)
Résistance Magique :	Inimaginable (supérieur à 6000)
Nombre d'attaques :	1
Vitesse de Déplacement :	Normale
Voir le Caché :	Oui
Attaque à distance :	Non
Attaque magique :	Oui
Vole :	Non
Sang froid :	Inexistant
DLA :	Milieu
Durée Tour :	Remarquable (entre 9 et 11)
Chargement :	Vide
Bonus Malus :	Aucun

Vous avez également gagné 1 PX pour la réussite.
*******************************************************************************************
BOT :
Vous avez utilisé CONNAISSANCE DES MONSTRES sur un Capitan Ronfleur [Naissant] (4768960)

Le Monstre ciblé fait partie des : Mort-Vivant

Niveau : Incroyable (entre 36 et 38)
*******************************************************************************************/

function getNNInt(str) {
	var nbrs = str.match(/\d+/g);
	for (var i=0 ; i<nbrs.length ; i++)
		nbrs[i] = parseInt(nbrs[i]);
	return nbrs;
	}

function sendCDM() {
	var td = document.evaluate("//td/text()[contains(.,'fait partie')]/..",
								document, null, 9, null).singleNodeValue;
	cdm = td.innerHTML;
	cdm = cdm.replace(/.* MONSTRES sur une? ([^(]+) \(([0-9]+)\)(.*partie des : )([^<]+)<br>/,
						"$3$4 ($1 - N°$2)<br>");
	cdm = cdm.replace(/Blessure :[\s]*[0-9]+ % \(approximativement\)/,
						'Blessure : XX % (approximativement)');
	// Supprime la décomposition P/M de l'Armure
	var bgn = cdm.indexOf('Armure Physique');
	if (bgn!=-1) {
		var end = cdm.indexOf('Vue')-2;
		var lines = cdm.substring(bgn,end).split('<br>');
		var armp = getNNInt(lines[0]);
		var armm = getNNInt(lines[1]);
		if (lines[0].indexOf('(inf')!=-1)
			armp = [0,armp[0]];
		if (lines[1].indexOf('(inf')!=-1)
			armm = [0,armm[0]];
		var insrt = 'Armure : ';
		if (lines[0].indexOf('(sup')!=-1 || lines[1].indexOf('(sup')!=-1)
			insrt += 'adj (supérieur à '+(armp[0]+armm[0]);
		else
			insrt += 'adj (entre '+(armp[0]+armm[0])+' et '+(armp[1]+armm[1]);
		cdm = cdm.replace(cdm.substring(bgn,end),insrt+')<br>');
		}
	cdm = cdm.replace(/<br>/g,'\n');
	
	FF_XMLHttpRequest({
				method: 'GET',
				url: pageDispatcher+'?cdm='+escape(cdm),
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
					},
				onload: function(responseDetails) {
					buttonCDM.value=responseDetails.responseText;
					buttonCDM.disabled = true;
					}
				});
	}

function traiteCdM() {
	// Teste si ce message du bot est un message de CdM
	var td = document.evaluate("//td/text()[contains(.,'fait partie')]/..",
								document, null, 9, null).singleNodeValue;
	if (!td) return false;
		
	cdm = td.innerHTML;
		
	// Insertion de l'estimation des PV restants
	var des = cdm.indexOf('Dés');
	var pv = cdm.slice(cdm.indexOf('Points de Vie'),cdm.indexOf('Blessure'));
	pv = getPVsRestants(pv, cdm.slice(cdm.indexOf('Blessure :'),des) );
	if(pv)
		td.innerHTML = cdm.slice(0,des-4)+'<br />'+(pv[0]+pv[1]) + cdm.substring(des-4);

	// Insertion bouton envoi + espace
	buttonCDM = insertButtonCdm('bClose',sendCDM);
	}

/*function traitePouvoir() {
	// Teste si ce message du bot est un message de CdM
	// le test "capa" évite les pouvoirs type Chonchon (pas de SR)
	var td = document.evaluate("//td/text()[contains(.,'POUVOIR')]/../text()[contains(.,'capacité spéciale')]/..",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (!td)
		return false;
		
	var infos = td.innerHTML;
	var id = /monstre n°([0-9]+) /.exec(infos)[1];
	var nomMonstre = /\(une? ([^)]+)\)/.exec(infos)[1];
	var nomPouvoir = /spéciale : ([^<]+)/.exec(infos)[1];
	var date = /alors : ([^<]+)\./.exec(infos)[1];
	date = new Date(date.replace(/([0-9]+)\/([0-9]+)\//,"$2/$1/"));
	var effetPouvoir="";
	var full=false;
	if(infos.indexOf("REDUIT")!=-1) {
		effetPouvoir = /effet REDUIT : ([^<]+)/.exec(infos)[1];
		}
	else {
		effetPouvoir = /effet : ([^<]+)/.exec(infos)[1];
		full=true;
		}
	var dureePouvoir = /durée de ([0-9]+)/.exec(infos)[1];
	// On insère le bouton et un espace
	//var url = pageEffetDispatcher + "?pouv="+escape(nomPouvoir)+"&monstre="+escape(nomMonstre)+"&id="+escape(id)+"&effet="+escape(effetPouvoir)+"&duree="+escape(dureePouvoir)+"&date="+escape(Math.round(date.getTime()/1000));
	// ce type d'URL est obsolète (se fait par msgId dorénavant)
	if(!MY_getValue('AUTOSENDPOUV'))
	{
		var button = insertButtonCdm('bClose',null,"Collecter les infos du pouvoir");
		button.setAttribute("onClick", "window.open('" + url
				+ "', 'popupEffet', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes'); "
				+ "this.value='Merci de votre participation'; this.disabled = true;");
	}
	else
	{
		FF_XMLHttpRequest({
				method: 'GET',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				}});
	}
}*/

traiteCdM();
//traitePouvoir(); méthode d'envoi obsolète et gestion inconnue niveau DB

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

// x~x menu
// n'est lancé que sur refresh du volet de menu (activation ou [Refresh])

var menuRac, mainIco;

function updateData() {
	var inputs = document.getElementsByTagName('input');
	var divs = document.getElementsByTagName('div');
	
	numTroll = inputs[0].value;
	MY_setValue('NUM_TROLL', numTroll);
	MY_setValue('NIV_TROLL',inputs[1].value);
	if(!MY_getValue(numTroll+'.caracs.rm')) {
		MY_setValue(numTroll+'.caracs.rm',0);
		// assure l'init des 4 var de libs
	}
	MY_setValue(numTroll+'.caracs.mm',inputs[2].value);
	
	var DLA = new Date(
		StringToDate(divs[1].firstChild.nodeValue.slice(5))
	);
	if(MY_getValue(numTroll+'.DLA.encours')) {
		var DLAstockee = new Date(
			StringToDate(MY_getValue(numTroll+'.DLA.encours'))
		);
		if(DLA>DLAstockee) {
			MY_setValue(numTroll+'.DLA.ancienne',DateToString(DLAstockee));
			// Pose un pb en cas de décalage de DLA
		}
	}
	MY_setValue(numTroll+'.DLA.encours',DateToString(DLA));
	
	var listePos = divs[1].childNodes[2].nodeValue.split('=');
	MY_setValue(numTroll+'.position.X',parseInt(listePos[1]));
	MY_setValue(numTroll+'.position.Y',parseInt(listePos[2]));
	MY_setValue(numTroll+'.position.N',parseInt(listePos[3]));
}

function initRaccourcis() {
	var anotherURL = MY_getValue('URL1');
	if(!anotherURL) { return; }
	
	/* Création de l'icône faisant apparaître le menu */
	mainIco = document.createElement('img');
	var urlIco = MY_getValue(numTroll+'.ICOMENU');
	if(!urlIco) {
		urlIco =
			'http://mountyzilla.tilk.info/scripts_0.9/images/MY_logo_small.png';
	}
	mainIco.src = urlIco;
	mainIco.alt = 'MZ';
	mainIco.style = 'position:fixed; top:0px; left:0px';
	mainIco.onmouseover = afficheMenu;
	document.body.appendChild(mainIco);
	
	/* Création du menu des Raccourcis */
	menuRac = document.createElement('div');
	menuRac.className = 'mh_textbox';
	menuRac.style =
		'position:fixed; top:10px; left:10px;'+
		'max-width:190px;'+
	 	'border-radius: 4px; padding: 4px;'+
	 	'z-index: 500;'+
	 	'visibility: hidden;';
	document.body.appendChild(menuRac);
	document.addEventListener('mousemove',cacheMenu,false);
	var i=1;
	while(anotherURL) {
		var a = document.createElement('a');
		var url = MY_getValue('URL'+i);
		var nom = MY_getValue('URL'+i+'.nom');
		var ico = MY_getValue('URL'+i+'.ico');
		a.href = url;
		a.target = '_blank';
		if(ico) {
			var txt = nom ? nom : '';
			var img = createImage(ico,txt);
			a.appendChild(img);
		}
		else {
			appendText(a,'['+nom+']');
		}
		menuRac.appendChild(a);
		appendBr(menuRac);
		i++;
		anotherURL = MY_getValue('URL'+i);
	}
}

function afficheMenu() {
	menuRac.style.visibility = 'visible';
}

function cacheMenu(e) {
	if(menuRac.style.visibility=='hidden') { return; }
	// Position souris
	var ptX = e.clientX;
	var ptY = e.clientY;
	// On recalcule en live les BoundingBox pour mainIco et menuRac
	// Moins optimal, mais évite des erreurs (d'originie inconnue)
	var menuRect = menuRac.getBoundingClientRect();
	var icoRect = mainIco.getBoundingClientRect();
	if((ptX>icoRect.width || ptY>icoRect.height) &&
		(ptX<10 || ptX>10+menuRect.width || ptY<10 || ptY>10+menuRect.height)) {
		menuRac.style.visibility = 'hidden';
	}
}

function oldSchoolProfile() {
	try {
		var lienProfil = document.getElementById("Image1").parentNode;
		lienProfil.href = "Play_profil.php";
	} catch(e) {
		avertissement();
		window.console.log("[MZ menu] Lien vers le profil non trouvé",e);
	}
}

function do_menu() {
	updateData();
	initRaccourcis();
	if(MY_getValue(numTroll+".OLDSCHOOL")=="true") {
		oldSchoolProfile();
	}
}

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

// x~x vue

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

var needComputeEnchantement = MY_getValue(numTroll+'.enchantement.liste')
	&& MY_getValue(numTroll+'.enchantement.liste')!='';

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
	MY_setValue(numTroll+'.position.X',pos[0]);
	MY_setValue(numTroll+'.position.Y',pos[1]);
	MY_setValue(numTroll+'.position.N',pos[2]);
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

// Roule 11/03/2016 
/* [functions] Récup données monstres, trolls, etc. */
function getXxxDistance(xxx, i) {
	return parseInt(this['tr_' + xxx.toLowerCase()][i].cells[0].textContent);
}
function getXxxPosition(xxx, i) {
	var tds = this['tr_' + xxx.toLowerCase()][i].childNodes;
	var l = tds.length;
	return [
		parseInt(tds[l-3].textContent),
		parseInt(tds[l-2].textContent),
		parseInt(tds[l-1].textContent)
	];
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

function saveCheckBox(chkbo, pref) {
	// Enregistre et retourne l'état d'une CheckBox
	var etat = chkbo.checked;
	MY_setValue(pref, etat ? 'true' : 'false' );
	return etat;
	}

function recallCheckBox(chkbox, pref) {
	// Restitue l'état d'une CheckBox
	chkbox.checked = (MY_getValue(pref)=='true');
	}

function saveComboBox(cbb, pref) {
	// Enregistre et retourne l'état d'une ComboBox
	var etat = cbb.selectedIndex;
	MY_setValue(pref, etat);
	return etat;
	}

function recallComboBox(cbb, pref) {
	// Restitue l'état d'une ComboBox
	var nb = MY_getValue(pref);
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
	if(MY_getValue('NOINFOEM')!='true')
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
	MY_setValue('VUEEXT',vueext);
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
	var vueext = MY_getValue('VUEEXT');
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
	if(MY_getValue('NOINFOEM')!='true') {
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
	
	if(MY_getValue('INFOPLIE')) {
		toggleTableauInfos(true);
	}
}

function toggleTableauInfos(firstRun) {
	var
		msg = document.getElementById('msgInfoTab'),
		corps = document.getElementById('corpsInfoTab');
	if(!firstRun) {
		MY_setValue('INFOPLIE', !MY_getValue('INFOPLIE') );
	}
	if(MY_getValue('INFOPLIE')) {
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
	// Roule 11/03/2016, ne fonctionne plus, il faut traiter les cas
	//this['filtre'+ref]();
	switch (ref) {
		case 'Monstres':
			filtreMonstres();
			break;
		case 'Trolls':
			filtreTrolls();
			break;
		case 'Tresors':
			filtreTresors();
			break;
		case 'Lieux':
			filtreLieux();
			break;
		default:
			window.console.log('cas incongru dans finFiltrage : ' + ref);
			break;
	}
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
	//window.console.log('nbMonstres=' + nbMonstres + ', tr_monstres.length=' + tr_monstres.length);	// debug Roule
	var td = insertTdText(getMonstreLevelNode(0),'Niveau',true);
	td.width = 25;
	for(var i=1 ; i<=nbMonstres ; i++) {
		//window.console.log('nbMonstres=' + nbMonstres + ', tr_monstres.length=' + tr_monstres.length);	// debug Roule
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
function initPopupVue() {
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

// roule 16/03/2016 supprimé, existe déjà dans vue
// function showPopupTactique(evt) {
	// var id = this.id;
	// var nom = this.nom;
	// var texte = getAnalyseTactique(id,nom);
	// if(texte=='') { return; }
	// popup.innerHTML = texte;
	// popup.style.left = Math.min(evt.pageX+15,window.innerWidth-400)+'px';
	// popup.style.top = (evt.pageY+15)+'px';
	// popup.style.visibility = 'visible';
// }

// roule 16/03/2016, existe déjà ailleurs
// function hidePopup() {
	// popup.style.visibility = 'hidden';
// }

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
	var cdmMax = MY_getValue(numTroll+'.MAXCDM');
	cdmMax = Math.min(nbMonstres, cdmMax ? cdmMax : 500);
	if(MY_getValue('CDMID')==null) MY_setValue('CDMID',1); // à quoi sert CDMID ??
	
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
			var url = 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_post_FF.php';
			
			FF_XMLHttpRequest({
				method: 'POST',
				url: url,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml',
					'Content-type':'application/x-www-form-urlencoded'
				},
				data: 'begin='+begin+'&idcdm='+MY_getValue('CDMID')+'&'+str,
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
	var str = MY_getValue(numTroll+'.MISSIONS');
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
	var useCss = MY_getValue(numTroll+'.USECSS')=='true';
	var noGowaps = saveCheckBox(checkBoxGowaps,'NOGOWAP'),
		noEngages = saveCheckBox(checkBoxEngages,'NOENGAGE'),
		nivMin = saveComboBox(comboBoxNiveauMin,'NIVEAUMINMONSTRE'),
		nivMax = saveComboBox(comboBoxNiveauMax,'NIVEAUMAXMONSTRE');
	// old/new : détermine s'il faut ou non nettoyer les tr
	var oldNOEM = true, noEM = true;
	if(MY_getValue('NOINFOEM')!='true') {
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
	
	if(MY_getValue('NOINFOEM')!='true') {
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
	MY_setValue(numTroll+'.diplo.off',
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
	var diploGuilde = MY_getValue(numTroll+'.diplo.guilde') ?
		JSON.parse(MY_getValue(numTroll+'.diplo.guilde')) : {};
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
	var diploPerso = MY_getValue(numTroll+'.diplo.perso') ?
		JSON.parse(MY_getValue(numTroll+'.diplo.perso')) : {};
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
			// Roule 11/03/2016, on passe par les nouvelles fonctions getXxxPosition et getXxxDistance
			//var sonN = this['get'+type.slice(0,-1)+'Position'](i)[2];
			//var d = this['get'+type.slice(0,-1)+'Distance'](i);
			var sonN = getXxxPosition(type, i)[2];
			var d = getXxxDistance(type, i);
			
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
			Math.ceil(MY_getValue(numTroll+".caracs.pv")/10)+
			MY_getValue(numTroll+".caracs.regeneration")
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
			MY_getValue(numTroll+".caracs.vue")+
			MY_getValue(numTroll+".caracs.vue.bm")
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
			MY_getValue(numTroll+".caracs.vue")+
			MY_getValue(numTroll+".caracs.vue.bm")
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
			MY_getValue(numTroll+".caracs.vue")+
			MY_getValue(numTroll+".caracs.vue.bm")
		)/5),
		{'Monstres':1, 'Trolls':1},
		'self',
		MHicons+'P_Red01.png',
		'Cible à portée de Lancer de Potions'
	);
}


/*-[functions]--------------- Systèmes Tactiques -----------------------------*/

function putScriptExterne() {
	var infoit = MY_getValue(numTroll+'.INFOSIT');
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
	MY_removeValue(numTroll+'.INFOSIT');
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
		var pvmem = MY_getValue(i+'.caracs.pv.max');
		if(pvmem && pvmem>pvmax) {
			infosTrolls[i][1] = pvmem;
			pvmax = pvmem;
			}
		if(pv>pvmax) {
			var newpvmax = 5*Math.ceil(pv/5);
			MY_setValue(i+'.caracs.pv.max',newpvmax);
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
			var nomit = MY_getValue(numTroll+'.INFOSIT').split('$')[1];
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
function do_vue() {
	for(var type in typesAFetcher) {
		fetchData(type);
	}

	// roule' 11/03/2016
	// maintenant, tr_monstres et this['tr_monstres'], ce n'est plus la même chose
	// je fais une recopie :(
	tr_monstres = this['tr_monstres'];
	tr_trolls = this['tr_trolls'];
	tr_tresors = this['tr_tresors'];
	tr_champignons = this['tr_champignons'];
	tr_lieux = this['tr_lieux'];

	nbMonstres = this['nbMonstres']; 
	nbTrolls = this['nbTrolls']; 
	nbTresors = this['nbTresors']; 
	nbChampignons = this['nbChampignons']; 
	nbLieux = this['nbLieux'];

	try {
		start_script(31);
		
		initialiseInfos();
		savePosition();

		// Fonctionnalité "Têtalenvert" cachée, en test :
		if(MY_getValue(numTroll+'.VERLAN')=='true') {
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

		initPopupVue();
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
}



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

// x~x profil2

/*---------------------------- Variables globales ----------------------------*/

var
	// Anatrolliseur
	urlAnatrolliseur,
	// Infobulles talents
	hauteur = 50, bulleStyle = null,
	// Caracteristiques
		// Infos troll
	race, niv, idtroll, datecrea,
		// Etats du troll
	fatigue, bmfatigue,

		// Experience, Pi, ...
	pxdistribuables, pxperso,
	piutilisable, pitotal,
	nbmeurtres, nbmorts,
		// utilisee pour les moyennes MM/jour, kill/jour, etc
	NBjours,
		// calcul des DLA suivantes
	DLA, DLAsuiv, HeureServeur,
		// details duree du tour (calcul pvdispo) :
	dtb, pdm, bmt, adb, dpt,
		//posale
	posX, posY, posN,
		// caracs physiques
	vue, vuebp, vuebm, vuetotale,
	pvbase, pvbp, pvbm, pvtotal, pvcourant,
	reg, regbp, regbm, regmoy,
	att, attbp, attbm, attmoy, atttourD,atttourP,atttourM, attmoytour,
	esq, esqbp, esqbm, esqmoy, esqtourD,  esqmoytour,
	deg, degbp, degbm, degmoy, degmoycrit, degtourP,degtourM, degmoytour, degmoycrittour,
	arm, armbp, armbm, armmoy, armtourD, armmoytour,
	rm, rmbp, rmbm, rmtotale,
	mm, mmbp, mmbm, mmtotale,

	// Variables speciales Kastars
	pvActuelKastar, minParPV, overDLA,
		// id pour edition manuelle de lastDLA :
	inJour, inMois, inAn, inHr, inMin, inSec,
		// id pour auto-refresh lastDLA :
	lastDLAZone, maxAMZone, cumulZone,
	lastDLA, DLAaccel;


/*-[functions]----------------- Fonctions utiles -----------------------------*/

// Retourne la valeur de l'element unique et identifie par son "selector" (cf querySelector())
// http://www.w3schools.com/jsref/met_document_queryselector.asp
function getUniqueValueBySelector(selector, defaultValue){
	var valNode = document.querySelector(selector);
	if(valNode!=null){
		if(valNode.hasChildNodes()) {
			return valNode.childNodes[0].nodeValue;
		}else{
			return defaultValue;
		}
	} else{
		debugMZ("Pas d'element trouve correspondant au selecteur : " + selector);
		return defaultValue;
	}
}
function getUniqueStringValueBySelector(selector){
    return getUniqueValueBySelector(selector,"");
}
function getUniqueIntValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0);
	if(ret==null || /^\s*$/.test(ret)){ // test si chaine de caracteres composee de " "
		ret = 0;
	}
	return parseInt(ret);
}
function getUniqueFloatValueBySelector(selector){
	var ret = getUniqueValueBySelector(selector,0.0);
	if(ret==null || /^\s*$/.test(ret)){  // test si chaine de caracteres composee de " "
		ret = 0.0;
	}
	return parseFloat(ret);
}


function resiste(Ddeg,bm) {
	// version naive mais compréhensible ^^
	// DEBUG: à revoir
	if(!bm) {
		return 2*Math.floor(Ddeg/2);
	}
	return 2*Math.floor(Ddeg/2)+Math.round(bm/2);
}

function getPortee(param) {
	param = Math.max(0,Number(param));
	return Math.ceil( Math.sqrt( 2*param+10.75 )-3.5 );
	// ça devrait être floor, +10.25, -2.5
}

function retourAZero(fatig) {
	var fat = fatig, raz = 0;
	while(fat>0) {
		raz++;
		fat = Math.floor(fat/1.25);
	}
	return raz;
}

function decumulPumPrem(bonus) {
	switch(bonus) {
		case 20: return 33;
		case 33: return 41;
		case 41: return 46;
		case 46: return 49;
		case 49: return 51;
		default: return 20;
	}
}

function coefDecumul(i) {
	switch(i) {
		case 2: return 0.67;
		case 3: return 0.4;
		case 4: return 0.25;
		case 5: return 0.15;
		default: return 0.1;
	}
}

function dureeHM(dmin) {
	var ret = "";
	dmin = Math.floor(dmin);
	if(dmin>59) { ret = Math.floor(dmin/60)+"h"; }
	var mins = dmin%60;
	if(mins!=0) { ret += (ret) ? addZero(mins)+"min" : mins+"min"; }
	return (ret) ? ret : "-";
}


/*-[functions]------- Extraction / Sauvegarde des donnees --------------------*/

function extractionDonnees() {
	    // Variables temporaires
	var Nbrs = {};

// *********************
// Cadre "Description"
// *********************
	race = getUniqueStringValueBySelector('#descr #race');
	debugMZ("Race : " + race);
	idtroll = getUniqueStringValueBySelector('#descr #id');
	debugMZ("Id troll : " + idtroll);
	var strDateCrea = getUniqueStringValueBySelector('#descr td#crea>span');
	strDateCrea = strDateCrea.slice(strDateCrea.indexOf("(") + 1, strDateCrea.indexOf(")"));
	datecrea = new Date(StringToDate(strDateCrea));
	debugMZ("Date creation : " + datecrea);

// *******************
// Cadre "Experience"
// *******************
        // Niveau de troll
	niv = getUniqueIntValueBySelector('#exp #niv');
	nivTroll = niv;
	debugMZ("Niveau : " + niv);
        // PX
	pxdistribuables = getUniqueIntValueBySelector('#exp #px');
	pxperso = getUniqueIntValueBySelector('#exp #px_perso');
	debugMZ("Px Distrib/Perso: "+pxdistribuables+" / "+pxperso);
        // PI
	piutilisable = getUniqueIntValueBySelector('#exp #pi');
	pitotal = parseInt(document.querySelector('#exp #pi').parentElement.nextElementSibling.childNodes[2].textContent);
	debugMZ("PI utilisables/total: "+piutilisable+" / "+pitotal);
        // Meutres/Morts
	nbmeurtres = getUniqueIntValueBySelector('#exp #kill');
	nbmorts = getUniqueIntValueBySelector('#exp #mort');
	debugMZ("Nb Meutres/Morts: "+nbmeurtres+" / "+nbmorts);

// *********************
// Cadre "Tour de Jeu"
// *********************
	    // DLA
	Nbrs["dla"] = getUniqueStringValueBySelector("#dla #dla>b");
	DLA = new Date(StringToDate(Nbrs["dla"]));
	debugMZ("DLA: " + DLA);
	    // DLA suivante
	Nbrs["dlasuiv"] = getUniqueStringValueBySelector("#dla #dla_next");
	DLAsuiv = new Date(StringToDate(Nbrs["dlasuiv"]));
	debugMZ("DLAsuiv: " + DLAsuiv);
	    // Duree normale de mon Tour
	Nbrs["dtb"] = getNumbers(getUniqueStringValueBySelector("#dla #tour"));
	dtb = Nbrs["dtb"][0] * 60 + Nbrs["dtb"][1];
	debugMZ("Duree normale de mon Tour : " + dtb);
	    // Bonus/Malus sur la duree
	Nbrs["bmt"] = getNumbers(getUniqueStringValueBySelector("#dla #bm"));
	bmt = Nbrs["bmt"][0] * 60 + Nbrs["bmt"][1];
	debugMZ("Bonus/Malus sur la duree : " + bmt);
	    // Augmentation due aux blessures
	Nbrs["adb"] = getNumbers(getUniqueStringValueBySelector("#dla #blessure"));
	adb = Nbrs["adb"][0] * 60 + Nbrs["adb"][1];
	debugMZ("Augmentation due aux blessures : " + adb);
	    // Poids de l'equipement
	Nbrs["pdm"] = getNumbers(getUniqueStringValueBySelector("#dla #poids"));
	pdm = Nbrs["pdm"][0] * 60 + Nbrs["pdm"][1];
	debugMZ("Poids de l'equipement : " + pdm);
	    // Duree de mon prochain Tour
	Nbrs["dpt"] = getNumbers(getUniqueStringValueBySelector("#dla #duree>b"));
	dpt = Nbrs["dpt"][0] * 60 + Nbrs["dpt"][1];
	debugMZ('Duree de mon prochain Tour : ' + dpt);

// ****************
// Cadre "Etats"
// ****************
	    // Position du troll :
	posX = getUniqueIntValueBySelector('#pos #x');
	posY = getUniqueIntValueBySelector('#pos #y');
	posN = getUniqueIntValueBySelector('#pos #n');
	debugMZ("(X Y Z) : " + posX + " " + posY + " " + posN);
	    // PV actuel
	pvcourant = getUniqueIntValueBySelector('#pos #pv_courant');
	pvActuelKastar = pvcourant;
	debugMZ("PV actuel : " + pvcourant)
	    // Fatigue
	fatigue = getUniqueIntValueBySelector('#pos #fatigue');
    bmfatigue = getUniqueIntValueBySelector('#pos #fatiguebm');
	debugMZ('Fatigue : '+fatigue+" + "+bmfatigue);

// **************************
// Cadre "Caracteristiques"
// **************************
	    // Attaque
	att = getUniqueIntValueBySelector('#carac #att');
	attbp = getUniqueIntValueBySelector('#carac #att_p');
	attbm = getUniqueIntValueBySelector('#carac #att_m');
	atttourD = getUniqueIntValueBySelector('#carac #att_tour_d');
    atttourP = getUniqueIntValueBySelector('#carac #att_tour_p');
    atttourM = getUniqueIntValueBySelector('#carac #att_tour_m');
	attmoy = 3.5*att + attbp + attbm;
    var bmDAttTotalTour = atttourD + Math.floor(((att+atttourD)*(atttourP+atttourM)/100));
	attmoytour = 3.5*(att+bmDAttTotalTour) + attbp + attbm;
	debugMZ("ATT: "+att+"+("+attbp+")+("+attbm+") ;AttMoy:"+attmoy+"; BM Dé att/tour:("+atttourD+"D;"+atttourP+"%;"+atttourM+"%)"+bmDAttTotalTour+" ;AttMoyTour:"+attmoytour);
	    // Esquive
	esq = getUniqueIntValueBySelector('#carac #esq');
	esqbp = getUniqueIntValueBySelector('#carac #esq_p');
	esqbm = getUniqueIntValueBySelector('#carac #esq_m');
	esqtourD = getUniqueIntValueBySelector('#carac #esq_tour_d');
	esqmoy = 3.5*esq + esqbp+esqbm;
	esqmoytour = 3.5*(esq+esqtourD) + esqbp+esqbm;
	debugMZ("ESQ: "+esq+"+("+esqbp+")+("+esqbm+") ;EsqMoy:"+esqmoy+"; esq/tour:"+esqtourD+" ;EsqMoyTour:"+esqmoytour);
	    // Degat
	deg = getUniqueIntValueBySelector('#carac #deg');
	degbp = getUniqueIntValueBySelector('#carac #deg_p');
	degbm = getUniqueIntValueBySelector('#carac #deg_m');
	degtourP = getUniqueIntValueBySelector('#carac #deg_tour_p');
    degtourM = getUniqueIntValueBySelector('#carac #deg_tour_m');
	degmoy = 2*deg + degbp+degbm;
	degmoycrit = 3*deg + degbp+degbm;
    var bmDDegTotalTour = Math.floor(deg*(degtourP+degtourM)/100);
	degmoytour = 2*(deg + bmDDegTotalTour) + degbp + degbm;
	degmoycrittour = 3 * (deg + bmDDegTotalTour) + degbp + degbm;
	debugMZ("DEG: "+deg+"+("+degbp+")+("+degbm+") ;DegMoy:"+degmoy+"/"+degmoycrit+" ;deg/tour:("+degtourP+"%;"+degtourM+"%)"+bmDDegTotalTour+"; DegMoyTour:"+degmoytour+"/"+degmoycrittour);
	    // PV
	pvbase = getUniqueIntValueBySelector('#carac #pv');
	pvbp = getUniqueIntValueBySelector('#carac #pv_p');
	pvbm = getUniqueIntValueBySelector('#carac #pv_m');
	pvtotal = getUniqueIntValueBySelector('#carac #pv_tot');
	debugMZ("PV: " + pvbase + " + (" + pvbp + ") + (" + pvbm + ") = " + pvtotal);
	    // Regeneration
	reg = getUniqueIntValueBySelector('#carac #reg');
	regbp = getUniqueIntValueBySelector('#carac #reg_p');
	regbm = getUniqueIntValueBySelector('#carac #reg_m');
	regmoy = 2 * reg + regbp + regbm; // D3
	debugMZ("REG: "+reg+"+("+regbp+")+("+regbm+") ;RegMoy:" + regmoy);
	    // Armure
	arm = getUniqueIntValueBySelector('#carac #arm');
	armbp = getUniqueIntValueBySelector('#carac #arm_p');
	armbm = getUniqueIntValueBySelector('#carac #arm_m');
	armtourD = getUniqueIntValueBySelector('#carac #arm_tour_d');
	armmoy = 2*arm + armbp+armbm;
	armmoytour = 2*(arm+armtourD) + armbp+armbm;
	debugMZ("ARM: "+arm+"+("+armbp+")+("+armbm+"); ArmMoy:"+armmoy+"; arm/tour:"+armtourD+"; ArmMoyTour:"+armmoytour);
	// TODO : D d'armure non active
	    // Vue
	vue = getUniqueIntValueBySelector('#carac #vue');
	vuebp = getUniqueIntValueBySelector('#carac #vue_p');
	vuebm = getUniqueIntValueBySelector('#carac #vue_m');
	vuetotale = getUniqueIntValueBySelector('#carac #vue_tot');
	debugMZ("Vue: " + vue + " + (" + vuebp + ") + (" + vuebm + ") = " + vuetotale);
	    // RM
	rm = getUniqueIntValueBySelector('#carac #rm');
	rmbp = getUniqueIntValueBySelector('#carac #rm_p');
	rmbm = getUniqueIntValueBySelector('#carac #rm_m');
	rmtotale = getUniqueIntValueBySelector('#carac #rm_tot');
	rmTroll = rmtotale;
	debugMZ("RM: " + rm + " + (" + rmbp + ") + (" + rmbm + ") = " + rmtotale);
	    // MM
	mm = getUniqueIntValueBySelector('#carac #mm');
	mmbp = getUniqueIntValueBySelector('#carac #mm_p');
	mmbm = getUniqueIntValueBySelector('#carac #mm_m');
	mmtotale = getUniqueIntValueBySelector('#carac #mm_tot');
	mmTroll = mmtotale;
	debugMZ("MM: " + mm + " + (" + mmbp + ") + (" + mmbm + ") = " + mmtotale);

	// Heure Serveur
	try {
        var heureServeurSTR = document.querySelector("#hserveur").innerHTML;
        heureServeurSTR = heureServeurSTR.slice(heureServeurSTR.indexOf("/") - 2, heureServeurSTR.lastIndexOf(":") + 3);
		HeureServeur = new Date(StringToDate(heureServeurSTR));
	} catch (e) {
		window.console.warn(
			"[MZ] Heure Serveur introuvable, utilisation de l'heure actuelle", e
		);
		HeureServeur = new Date();
	}
	debugMZ("HeureServeur: " + HeureServeur);

	// ***INIT GLOBALE*** NBjours
	NBjours = Math.floor((HeureServeur-datecrea)/864e5)+1;

	    // Calcul debut lien anatroliseur avec les caracteristiques connues
	var amelio_dtb = function(dtb) {
			if(dtb>555) {
				return Math.floor((21-Math.sqrt(8*dtb/3-1479))/2);
			}
			return 10+Math.ceil((555-dtb)/2.5);
		},
		amelio_pv = Math.floor(pvbase/10)-3,
		amelio_vue = vue-3,
		amelio_att = att-3,
		amelio_esq = esq-3,
		amelio_deg = deg-3,
		amelio_reg = reg-1,
		amelio_arm = arm-1;
	if(race==="Darkling"){amelio_reg--; }
	if(race==="Durakuir"){amelio_pv-- ; }
	if(race==="Kastar")  {amelio_deg--; }
	if(race==="Skrim")   {amelio_att--; }
	if(race==="Tomawak") {amelio_vue--; }

	urlAnatrolliseur = "http://mountyhall.dispas.net/dynamic/"
	+"outils_anatrolliseur.php?anatrolliseur=v8"
	+"|r="+race.toLowerCase()
	+"|dla="+amelio_dtb(dtb)
	+"|pv="+amelio_pv+","+pvbp+","+pvbm
	+"|vue="+amelio_vue+","+vuebp+","+vuebm
	+"|att="+amelio_att+","+attbp+","+attbm
	+"|esq="+amelio_esq+","+esqbp+","+esqbm
	+"|deg="+amelio_deg+","+degbp+","+degbm
	+"|reg="+amelio_reg+","+regbp+","+regbm
	+"|arm="+amelio_arm+","+armbp+","+armbm
	+"|mm="+mmtotale
	+"|rm="+rmtotale+"|";
}

function saveProfil() {
	MY_setValue(idtroll+'.caracs.attaque',att);
	MY_setValue(idtroll+'.caracs.attaque.bm',(attbp+attbm));
	MY_setValue(idtroll+'.caracs.attaque.bmp',attbp);
	MY_setValue(idtroll+'.caracs.attaque.bmm',attbm);
    if(atttourD||atttourP||atttourM) {
        var bmDAttTotalTour = atttourD + Math.floor(((att+atttourD)*(atttourP+atttourM)/100));
        MY_setValue(idtroll+'.bonus.DAttM',bmDAttTotalTour);
    }
	MY_setValue(idtroll+'.caracs.esquive',esq);
    MY_setValue(idtroll+'.caracs.esquive.bm',(esqbp+esqbm));
	MY_setValue(idtroll+'.caracs.esquive.bmp',esqbp);
	MY_setValue(idtroll+'.caracs.esquive.bmm',esqbm);
    MY_setValue(idtroll+'.caracs.esquive.nbattaques',esqtourD);
	MY_setValue(idtroll+'.caracs.degats',deg);
    MY_setValue(idtroll+'.caracs.degats.bm',(degbp+degbm));
	MY_setValue(idtroll+'.caracs.degats.bmp',degbp);
	MY_setValue(idtroll+'.caracs.degats.bmm',degbm);
    if(degtourP||degtourM){
        var bmDDegTotalTour = Math.floor(deg*(degtourP+degtourM)/100);
        MY_setValue(idtroll+'.bonus.DDegM',bmDDegTotalTour);
    }
	MY_setValue(idtroll+'.caracs.regeneration',reg);
	MY_setValue(idtroll+'.caracs.regeneration.bm',(regbp+regbm));
	MY_setValue(idtroll+'.caracs.regeneration.bmp',regbp);
	MY_setValue(idtroll+'.caracs.regeneration.bmm',regbm);
	MY_setValue(idtroll+'.caracs.vue',vue);
	MY_setValue(idtroll+'.caracs.vue.bm',(vuebp+vuebm));
	MY_setValue(idtroll+'.caracs.vue.bmp',vuebp);
	MY_setValue(idtroll+'.caracs.vue.bmm',vuebm);
	MY_setValue(idtroll+'.caracs.pv',pvcourant);
	MY_setValue(idtroll+'.caracs.pv.base',pvbase);
	MY_setValue(idtroll+'.caracs.pv.max',pvtotal);
	MY_setValue(idtroll+'.caracs.rm',rm);
    MY_setValue(idtroll+'.caracs.rm.bm',(rm+rmbp+rmbm));
	MY_setValue(idtroll+'.caracs.rm.bmp',rmbp);
	MY_setValue(idtroll+'.caracs.rm.bmm',rmbm);
	MY_setValue(idtroll+'.caracs.mm',mm);
    MY_setValue(idtroll+'.caracs.mm.bm',(mm+mmbp+mmbm));
	MY_setValue(idtroll+'.caracs.mm.bmp',mmbp);
	MY_setValue(idtroll+'.caracs.mm.bmm',mmbm);
	MY_setValue(idtroll+'.caracs.armure',arm);
	MY_setValue(idtroll+'.caracs.armure.bm',(armbp+armbm));
	MY_setValue(idtroll+'.caracs.armure.bmp',armbp);
	MY_setValue(idtroll+'.caracs.armure.bmm',armbm);
	MY_setValue(idtroll+'.position.X',posX);
	MY_setValue(idtroll+'.position.Y',posY);
	MY_setValue(idtroll+'.position.N',posN);
	MY_setValue(idtroll+'.race',race);
	MY_setValue(idtroll+'.niveau',niv);
}


/*-[functions]----------- Fonctions modifiant la page ------------------------*/

function setInfosCaracteristiques() {
        // Modification de l'entete
    var thTotal = document.querySelector("table#caracs>thead>tr>th:nth-child(6)");
    thTotal.innerHTML+='|<i>Moyenne</i>';
    thTotal.title="Moyenne (Moyenne ce tour)";

	    // Ajout des informations calculees
	var tdAttTotal = document.querySelector("table#caracs td#att").parentElement.children[5];
	tdAttTotal.innerHTML="<i>"+attmoy+"</i>";
	if(attmoy!=attmoytour){tdAttTotal.innerHTML+=" ("+attmoytour+")";}

	var tdEsqTotal = document.querySelector("table#caracs td#esq").parentElement.children[5];
    tdEsqTotal.innerHTML="<i>"+esqmoy+"</i>";
	if(esqmoy!=esqmoytour){tdEsqTotal.innerHTML+=" ("+esqmoytour+")";}

	var tdDegTotal = document.querySelector("table#caracs td#deg").parentElement.children[5];
	tdDegTotal.innerHTML="<i>"+degmoy+"/"+degmoycrit+"</i>";
	if(degmoy!=degmoytour){tdDegTotal.innerHTML+=" ("+degmoytour+"/"+degmoycrittour+")";}

	var trRegeneration = document.querySelector("table#caracs td#reg").parentElement;
    var tdRegTotal = trRegeneration.children[5];
    tdRegTotal.innerHTML = "<i>"+regmoy+"</i>";
	    // Temps recupere par reg (propale R')
	var regmoyTemp = Math.max(0, regmoy);
	var regTitle = "Temps moyen récupéré par régénération: " + Math.floor(250 * regmoyTemp / pvtotal) + " min";
	var sec = Math.floor(15000 * regmoyTemp / pvtotal) % 60;
	if (sec != 0) {
		regTitle += " " + sec + " sec";
	}
	trRegeneration.title = regTitle;

	var tdArmTotal = document.querySelector("table#caracs td#arm").parentElement.children[5];
	tdArmTotal.innerHTML= "<i>"+armmoy+"</i>";
	if(armmoy!=armmoytour){tdArmTotal.innerHTML+=" ("+armmoytour+")";}

	var trRM=document.querySelector("table#caracs #rm").parentElement;
	trRM.title = (Math.round(10*rm/NBjours)/10)+' ('+(Math.round(10*rmTroll/NBjours)/10)+') points de RM par jour | '
				+(Math.round(10*rm/niv)/10)+' ('+(Math.round(10*rmtotale/niv)/10)+') points de RM par niveau';


	var trMM=document.querySelector("table#caracs #mm").parentElement;
	trMM.title = (Math.round(10*mm/NBjours)/10)+' ('+(Math.round(10*mmTroll/NBjours)/10)+') points de MM  par jour | '
				+(Math.round(10*mm/niv)/10)+' ('+(Math.round(10*mmtotale/niv)/10)+') points de MM par niveau';

    var tdRefl=document.querySelector("#refl");
    // TODO : prendre en compte bonus/malus D esq du tour ?
    var refMoy = Math.floor(2*(reg+esq)/3)*3.5 + (esqbp);
    tdRefl.innerHTML+=" <i>(moyenne : "+refMoy+")</i>";
}

function setLienAnatrolliseur(){
	var pTableAmelio = document.querySelector("#carac>div>p");
    pTableAmelio.innerHTML+=" - ";
    var aElt = document.createElement("a");
    aElt.setAttribute("href",urlAnatrolliseur);
    aElt.setAttribute("target","_blank");
    aElt.className="AllLinks";
    aElt.innerHTML="Anatrolliser";
    pTableAmelio.appendChild(aElt);
}
function setInfoDescription() {
	var txtDateCrea = (NBjours!=1) ?
		" ("+NBjours+" jours dans le hall)" :
		" (Bienvenue à toi pour ton premier jour dans le hall)" ;
	appendText(document.querySelector("#descr td#crea"), txtDateCrea, false);
}

function setInfosEtatLieux() {
	var urlBricol = 'http://trolls.ratibus.net/mountyhall/lieux.php'+
		'?search=position&orderBy=distance&posx='+
		posX+'&posy='+posY+'&posn='+posN+'&typeLieu=3';
	var tdPosition = document.querySelector("#pos td span#x").parentElement;
	appendBr(tdPosition);
    var aElt = document.createElement("a");
    aElt.setAttribute("href",urlBricol);
    aElt.setAttribute("target","_blank");
    aElt.className="AllLinks";
    aElt.innerHTML="Lieux à proximité";
    tdPosition.appendChild(aElt);
}

function setInfosEtatPV() { // pour AM et Sacro
	var
		txt = "1 PV de perdu = +"+Math.floor(250/pvtotal)+" min",
		sec = Math.floor(15000/pvtotal)%60,
		lifebar = document.querySelector("#pos .barre-vie");
	if(sec!=0) { txt += " "+sec+" sec"; }
	if(lifebar) { lifebar.title = txt; }
	if(pvcourant<=0) { return; }
	
	// Difference PV p/r a equilibre de temps (propale R')
	// Note : pvmin pour 0 malus = pvtotal + ceiling(pvtotal/250*(bmt+pdm))
	// ***INIT GLOBALE*** pvdispo
	var pvdispo = pvcourant-pvtotal-Math.ceil((bmt+pdm)*pvtotal/250);
	var	span = document.createElement("span");
	span.title = txt;
	span.style.fontStyle = "italic";
	if(bmt+pdm>=0) {
		txt = "Vous ne pouvez compenser aucune blessure actuellement.";
	} else if(pvdispo>0) {
		txt = "Vous pouvez encore perdre "+
			Math.min(pvdispo,pvcourant)+
			" PV sans malus de temps.";
	} else if(pvdispo<0) {
		txt = "Il vous manque "
			+(-pvdispo)
			+" PV pour ne plus avoir de malus de temps.";
	} else {
		txt = "Vous êtes à l'équilibre en temps (+/- 30sec).";
	}
	appendText(span,txt);
	document.querySelector("#pos #pv_courant").parentElement.parentElement.appendChild(span);
}

// Complete le cadre "Experience"
function setInfosExp() {
    var tdNiv = document.querySelector("#exp #niv");

    // Calcul niveau monstre/troll min pour gain PX
    var nivCibleMin = Math.ceil((2 * nivTroll - 10) / 3);
    tdNiv.parentElement.title = "Vos cibles doivent être au minim de niveau " + nivCibleMin + " pour qu'elles vous rapportent des PX";

    // Calcul PX restant
    var pxRestant = (pxdistribuables + pxperso) - 2 * nivTroll;
    if (pxRestant >= 0) {
        var tdinfoEntrainement = document.querySelector("#exp table tr:nth-child(4) td span");
        tdinfoEntrainement.innerHTML += " <i>Il vous restera " + pxRestant + " PX</i>";
    }

    // Calul pi/jour
    var
    	tdPiTotal=document.querySelector("#exp #pitot").parentElement,
    	tdPi = document.querySelector("#exp #pi").parentElement;
    tdPiTotal.title=(Math.round(10 * (pitotal + pxperso + pxdistribuables) / NBjours) / 10) + ' PI par jour'
    tdPi.title = tdPiTotal.title;

    // Rapports meurtres,morts
    var tdKill = document.querySelector("#exp #kill");
    tdKill.setAttribute("colspan", 1);
    appendTdText(tdKill.parentElement, (Math.round(10 * NBjours / nbmeurtres) / 10) + ' jours/kill', false);

    var tdMort = document.querySelector("#exp #mort");
    tdMort.setAttribute("colspan", 1);
    appendTdText(tdMort.parentElement, (Math.round(10 * NBjours / nbmorts) / 10) + ' jours/mort', false);

    tdKill.parentElement.title = 'Rapport meurtres/décès: ' + Math.floor((nbmeurtres / nbmorts) * 100) / 100;
    tdMort.parentElement.title = 'Rapport décès/meurtres: ' + Math.floor((nbmorts / nbmeurtres) * 100) / 100;
}


/*-[functions]----------- Fonctions speciales Kastars ------------------------*/

function minParPVsac(fat,bm) {
// Calcule le nombre de min gagnees / PV sacrifies pour une AM realisee sous
// fatigue = 'fat', sans et avec un bm de fatigue = 'bm'
	var out = [];
	out[0] = (fat>4) ?
		Math.floor(120/( fat*(1+Math.floor(fat/10)) )) :
		30;
	if(bm && bm>0) {
		var totalfat=fat+bm;
		out[1] = (totalfat>4) ?
			Math.floor(120/( totalfat*(1+Math.floor(totalfat/10)) )) :
			30; // en principe inutile pour des bm fat >= 15 mais bon...
	}
	return out;
}

function toInt(str) {
	str = parseInt(str);
	return (str) ? str : 0;
	}

function saveLastDLA() {
	// pour les calculs d'AM max
	var str = addZero(toInt(inJour.value))+'/'+addZero(toInt(inMois.value))
		+'/'+toInt(inAn.value)+' '+addZero(toInt(inHr.value))
		+':'+addZero(toInt(inMin.value))+':'+addZero(toInt(inSec.value));
	lastDLA = new Date( StringToDate(str) );
	MY_setValue(numTroll+'.DLA.ancienne',str);
	lastDLAZone.innerHTML = '';
	var b = document.createElement('b');
	b.addEventListener('click',inputMode,false);
	appendText(b,str);
	lastDLAZone.appendChild(b);
	refreshAccel();
	}

function inputMode() {
	// Edition manuelle lastDLA
	var date;
	if(lastDLA)
		date = new Date( lastDLA );
	else
		date = new Date( DLAaccel );
	lastDLAZone.innerHTML = '';
	inJour = appendTextbox(lastDLAZone,'text','inJour',1,2,date.getDate());
	appendText(lastDLAZone,'/');
	inMois = appendTextbox(lastDLAZone,'text','inMois',1,2,1+date.getMonth());
	appendText(lastDLAZone,'/');
	inAn = appendTextbox(lastDLAZone,'text','inAn',3,4,date.getFullYear());
	appendText(lastDLAZone,' - ');
	inHr = appendTextbox(lastDLAZone,'text','inHr',1,2,date.getHours()+'');
	appendText(lastDLAZone,':');
	inMin = appendTextbox(lastDLAZone,'text','inMin',1,2,date.getMinutes()+'');
	appendText(lastDLAZone,':');
	inSec = appendTextbox(lastDLAZone,'text','inSec',1,2,date.getSeconds()+'');
	appendText(lastDLAZone,' - ');
	appendButton(lastDLAZone,'Enregistrer',saveLastDLA);
	}

function setAccel() {
	var
		BMfrais=false,
		fat=fatigue, listeBmFat=[],
		tr, th, insertPt;

	// Creation ligne speciale pour AM dans le cadre "Etat"
	tr = document.createElement('tr');
	th = document.createElement('th');
	appendText(th,'Fatigue et AM',true);
	tr.appendChild(th);
	insertPt = document.createElement('td');
	tr.appendChild(insertPt);
	document.querySelector('#pos table>tbody').insertBefore(tr,null);

	// Est-on en over-DLA ?
	// ***INIT GLOBALE*** overDLA
	overDLA = (HeureServeur>DLA.getTime()+3e5);
	if(overDLA) {
		fat=Math.floor(fatigue/1.25);
	}

	// Gestion des BM de fatigue
	if(bmfatigue>0) {
		// On tente de recuperer les BM de fatigue de la page des BM
		if(MY_getValue(numTroll+'.bm.fatigue')) {
			var BMmemoire = MY_getValue(numTroll+'.bm.fatigue').split(';');
			BMmemoire.pop();
			var tour = 0;
			for(var i=0 ; i<BMmemoire.length ; i++) {
				var nbrs = BMmemoire[i].match(/\d+/g); // [tour,fatigue]
				while(tour<=parseInt(nbrs[0])) {
					listeBmFat[tour]=parseInt(nbrs[1]);
					tour++;
				}
			}
		}
		if(listeBmFat[0]==bmfatigue) {
			// Si (bm profil=1er bm stocke), on suppose que les bm stockes sont a jour
			BMfrais = true;
			MY_removeValue(numTroll+".bm.fatigue");
		}
	} else {
		// S'il n'y a pas de bm de fatigue sur le profil, on est a jour
		BMfrais = true;
	}
	if(!BMfrais && bmfatigue>0) {
		// si les BM n'ont pas ete rafraichis, on conjecture le pire:
		if(bmfatigue==15) {
			listeBmFat = [15,15,15];
		} else {
			listeBmFat = [30,30,15];
		}
	}
	if(overDLA) {
		// Si on est en over-DLA, on decale les bm d'un tour
		listeBmFat.shift();
	}
	
	// Tableau des fatigues et accel futures
	var
		minppv = minParPVsac(fat,listeBmFat[0]),
		table, tbody,
		ligneTour, ligneFat, ligneMin,
		col;
	// ***INIT GLOBALE*** minParPV
	minParPV = (listeBmFat[0]==void(0)) ? minppv[0] : minppv[1];
	if(fat>0 || listeBmFat[0]>0) {
		table = document.createElement('table');
		table.className = 'mh_tdborder';
		table.border = 0;
		table.cellSpacing = 1;
		table.cellPadding = 1;
		table.style.textAlign = "center";
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
		insertPt.appendChild(table);
		
		ligneTour = appendTr(tbody,'mh_tdtitre');
		ligneTour.style.fontWeight = "bold";
		var td = appendTdText(ligneTour,'Tour :',true);
		td.align = 'left';
		ligneFat = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneFat,'Fatigue :',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		ligneMin = appendTr(tbody,'mh_tdpage');
		td = appendTdText(ligneMin,'1 PV =',true);
		td.className = 'mh_tdtitre';
		td.align = 'left';
		col=0;
		while(col<9 && (fat>0 || listeBmFat[col])) {
			if(col==0) {
				if(overDLA) {
					var i = document.createElement('i');
					appendText(i,'A activer');
					ligneTour.appendChild(i);
				} else {
					appendTdText(ligneTour,'En cours');
				}
			} else {
				appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
			}
			if(listeBmFat[col]) {
				if(BMfrais || (!overDLA && col==0)) {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]);
					appendTdText(ligneMin,minppv[1]+'\'');
				} else {
					appendTdText(ligneFat,fat+'+'+listeBmFat[col]+' (?)');
					appendTdText(ligneMin,minppv[1]+'\' ('+minppv[0]+'\')');
				}
			} else {
				appendTdText(ligneFat,fat);
				appendTdText(ligneMin,minppv[0]+'\'');
			}
			col++;
			fat = Math.floor(fat / 1.25);
			minppv = minParPVsac(fat,listeBmFat[col]);
		}
		if(fat>1 || (fat==1 && !overDLA)) {
			appendTdText(ligneTour,'\u00A0 ... \u00A0',true);
			appendTdText(ligneFat,'-');
			appendTdText(ligneMin,'-');
		}
		col = (overDLA) ?	
			Math.max(retourAZero(fatigue)-1,col) :
			Math.max(retourAZero(fatigue),col);
		appendTdText(ligneTour,'\u00A0\u00A0+'+col+'\u00A0\u00A0');
		appendTdText(ligneFat,'0');
		appendTdText(ligneMin,'30\'');
		
		if(!BMfrais && bmfatigue) {
			// si les BM n'ont pas ete rafraichis, on signale:
			appendText(
				insertPt,
				'/!\\ Visitez la page des Bonus/Malus '+
				'pour mettre à jour votre fatigue. /!\\',
				true
			);
			appendBr(insertPt);
		}
		appendBr(insertPt);
	}
	
	if(pvcourant<=0) {
		appendText(insertPt,'Aucun calcul possible : vous êtes mort voyons !');
		return;
	}
	
	if(fatigue>30) {
		appendText(insertPt,'Vous êtes trop fatigué pour accélérer.');
		return;
	}
	
	// Setup lastDLAZone
	if(overDLA) {
		// bypass des infos de "menu_FF.js" en cas d'overDLA
		DLAaccel = new Date(  DLAsuiv );
		lastDLA = new Date( DLA );
		MY_setValue(numTroll+'.DLA.ancienne',DateToString(DLA));
		// ***INIT GLOBALE*** pvActuelKastar
		pvActuelKastar = Math.min(pvcourant+regmoy,pvtotal);
		appendText(
			insertPt,
			'/!\\ Votre DLA est dépassée, calculs basés sur des estimations. /!\\',
			true
		);
		appendBr(insertPt);
	} else {
		DLAaccel = new Date( DLA );
		pvActuelKastar = pvcourant;
		if(MY_getValue(numTroll+'.DLA.ancienne')) {
			lastDLA = new Date(StringToDate(MY_getValue(numTroll+'.DLA.ancienne')));
		} else {
			lastDLA = false;
		}
	}
	appendText(insertPt,'Dernière DLA enregistrée : ');
	lastDLAZone = document.createElement('span');
	lastDLAZone.style.cursor = 'pointer';
	var b = document.createElement('b');
	b.onclick = inputMode;
	lastDLAZone.appendChild(b);
	insertPt.appendChild(lastDLAZone);
	if(lastDLA) {
		appendText(b,DateToString(lastDLA));
	} else {
		appendText(b,'aucune');
	}
	appendBr(insertPt);
	
	// Setup maxAMZone et cumulZone
	appendText(insertPt,'Accélération maximale possible : ');
	maxAMZone = document.createElement('b');
	insertPt.appendChild(maxAMZone);
	appendBr(insertPt);
	cumulZone = document.createElement('span');
	insertPt.appendChild(cumulZone);
	
	refreshAccel();
}

function refreshAccel() {
	var pvs, pvsmax;
	
	// Acceleration pour cumul instantane
	//window.console.debug('refreshAccel',pvActuelKastar,DLAaccel,lastDLA,minParPV);
	if(lastDLA) {
		pvsmax = Math.min(
			pvActuelKastar-1,
			Math.ceil( Math.floor((DLAaccel-lastDLA)/6e4)/minParPV )
		);
		maxAMZone.innerHTML = pvsmax+" PV";
	} else {
		pvsmax = pvActuelKastar-1;
		maxAMZone.innerHTML = "inconnue";
	}
	
	// pvAccel = (nb min avant DLA (arr. sup) / nb min p/ PVsac) (arrondi sup)
	pvs = Math.ceil( Math.ceil((DLAaccel-HeureServeur)/6e4) / minParPV );
	cumulZone.innerHTML = '';
	if(pvs<=pvsmax) {
		appendText(cumulZone,'Vous devez accélérer d\'au moins ');
		appendText(cumulZone,pvs+' PV', true);
		appendText(cumulZone,' pour activer immédiatement un nouveau tour.');
		if(pvs!=1) {
			var gainSec = Math.floor((DLAaccel-HeureServeur)/1e3)
				-(pvs-1)*60*minParPV;
			appendText(
				cumulZone,
				' ('+(pvs-1)+' PV dans '+
				Math.floor(gainSec/60)+'min'+
				addZero(gainSec%60)+'s)'
			);
		}
	} else {
		var avantDLA = new Date( DLAaccel-HeureServeur-pvsmax*minParPV*6e4 );
		appendText(
			cumulZone,
			'Après votre accélération maximale, il vous faudra encore attendre '+
			dureeHM(avantDLA/6e4)+
			' avant de réactiver.'
		);
	}
}


/*-[functions]-------- Fonctions gerant les infos-bulles ---------------------*/

function traitementTalents() {
	trCompetence = document.querySelectorAll("#comp table#competences>tbody>tr");
	trSorts = document.querySelectorAll("#sort table#sortileges>tbody>tr");
	removeAllTalents();
	var totalComp = injecteInfosBulles(trCompetence,'competences');
	var totalSort = injecteInfosBulles(trSorts,'sortileges');
	document.querySelector('#comp>div>h3.mh_tdtitre').textContent+=' (Total : '+totalComp+'%)';
	document.querySelector('#sort>div>h3.mh_tdtitre').textContent+=' (Total : '+totalSort+'%)';
}

function injecteInfosBulles(liste,fonction) {
	var totalpc = 0;
	// on parse la liste des talents du type 'fonction'
	for(var i=0 ; i<liste.length ; i++) {
		var
			trTalent=liste[i],
			node=trTalent.cells[1].querySelector('a'),
			nomTalent=epure(trim(node.textContent)),
			indiceTDniveaux=7,
			indiceTDSousCompetence=2,
			sousCompetences=undefined;
		if(fonction=="competences"){
			// un TD en plus pour des information complementaire liees a la comp
			indiceTDniveaux++;
			// chercher les sous-compétence (type de golem, type de piège) s'il y a
			sousCompetences = trTalent.cells[indiceTDSousCompetence].textContent.split(',');
			for (var j=0; j < sousCompetences.length; j++) {
				sousCompetences[j] = sousCompetences[j].epure().trim();
				if (arrayTalents[sousCompetences[j]]) sousCompetences[j] = arrayTalents[sousCompetences[j]];
			}
		}
		var niveauxMaitrisesTalentArray=getNumbers(trTalent.cells[indiceTDniveaux].textContent);
		setInfos(node,nomTalent,fonction,niveauxMaitrisesTalentArray[0]);
		setTalent(nomTalent,niveauxMaitrisesTalentArray[1],niveauxMaitrisesTalentArray[0],sousCompetences);
		totalpc += niveauxMaitrisesTalentArray[1];

		// stockage des niveaux inferieurs du talent si presents
		for(var j=2 ; j<niveauxMaitrisesTalentArray.length ; j+=2) {
			setTalent(nomTalent,niveauxMaitrisesTalentArray[j+1],niveauxMaitrisesTalentArray[j],sousCompetences);
			totalpc+=niveauxMaitrisesTalentArray[j+1];
		}
	}
	return totalpc;
}

function setInfos(node,nom,fonction,niveau) {
	node.nom = nom;
	node.fonction = fonction;
	node.niveau = niveau;
	node.onmouseover = setBulle;
	node.onmouseout = cacherBulle;
}

var arrayModifAnatroll = {
	'Glue':'Glu',
	'PuM':'PuiM',
	'HE':'Hurlement',
	//'Insultes':'Insu',
	'Pistage':'Pist',
	'PuC':'Planter'
}

function setTalent(nom,pc,niveau,sousCompetences) {
	// Nota : voir plus tard si stocker les effets des comps/sorts directement 
	// (et pas les % dont osf) ne serait pas plus rentable
	var nomEnBase = arrayTalents[epure(nom)];
	if(!nomEnBase) { return; }
	if(!niveau) { niveau = 1; }
	
	switch(nomEnBase) {
		case 'Insultes':
			urlAnatrolliseur += 'Insu'+niveau+'|';
		case 'IdT':
			nomEnBase += niveau;
			break;
		case 'Golemo':
		case 'Piege':
			for (var i=0 ; i < sousCompetences.length ; i++) {
				urlAnatrolliseur += (arrayModifAnatroll[sousCompetences[i]] ? 
					arrayModifAnatroll[sousCompetences[i]] : sousCompetences[i]) + '|';
			}
			break;
		case 'AP':
		case 'Baroufle':
		case 'CdB':
		case 'CdM':
		case 'Parer':
		case 'Retraite':
		case 'RB':
		case 'SInterposer':
			nomEnBase += niveau;
		default:
			urlAnatrolliseur += (arrayModifAnatroll[nomEnBase] ? 
				arrayModifAnatroll[nomEnBase] : nomEnBase) + '|';
	}
	
	MY_setValue(numTroll+'.talent.'+nomEnBase,pc);
}

function creerBulleVide() {
	var table = document.createElement('table');
	table.id = 'bulle';
	table.className = 'mh_tdborder';
	table.width = 300;
	table.border = 0;
	table.cellPadding = 5;
	table.cellSpacing = 1;
	table.style =	
		 'position:absolute;'
		+'visibility:hidden;'
		+'z-index:800;'
		+'height:auto;';
	var tr = appendTr(table,'mh_tdtitre');
	appendTdText(tr,'Titre');
	tr = appendTr(table,'mh_tdpage');
	appendTdText(tr,'Contenu');
	var aList = document.getElementsByTagName('a');
	aList[aList.length-1].parentNode.appendChild(table);
	}

function cacherBulle() {
	if(bulleStyle)
        bulleStyle.visibility = 'hidden';
}

function setBulle(evt) {
	var nom = this.nom;
	var fonction = this.fonction;
	var niveau = parseInt(this.niveau);
	var str='';
	if(fonction=='competences'){
		str=competences(nom,niveau);
	} else if(fonction=='sortileges') {
		str=sortileges(nom,true);
	}
	if(str=='') return;
	if(nom.indexOf('Golem')!=-1) nom='Golemologie';
	
	var xfenetre, yfenetre, xpage, ypage, element = null;
	var offset = 15;
	var bulleWidth = 300;
	if(!hauteur) hauteur = 50;
	element = document.getElementById('bulle');
	xfenetre = evt.clientX;
	yfenetre = evt.clientY;
	xpage = xfenetre;
	ypage = yfenetre;
	if(evt.pageX) xpage = evt.pageX;
	if(evt.pageY) ypage = evt.pageY;
	if(element) {
		bulleStyle = element.style;
		element.firstChild.firstChild.innerHTML = '<b>'+nom+'</b>';
		element.childNodes[1].firstChild.innerHTML = str;
	}
	if(bulleStyle) {
		if(xfenetre>bulleWidth+offset)
			xpage -= bulleWidth+offset;
		else
			xpage += offset;
		if(yfenetre>hauteur+offset)
			ypage -= hauteur + offset;
		bulleStyle.width = bulleWidth;
		bulleStyle.left = xpage + 'px';
		bulleStyle.top = ypage + 'px';
		bulleStyle.visibility = 'visible';
    }
}


/*-[functions] Textes des infos-bulles pour les competences et sortileges ----*/

function competences(comp,niveau) {
	var texte = '';
	if(comp.indexOf('Acceleration du Metabolisme')!=-1 && minParPV!=null) {
		texte = '<b>1</b> PV = <b>'+minParPV+'</b> minute';
		if(minParPV>1) texte += 's';
		if(overDLA) texte += '<br/><i>(Votre DLA est dépassée.)</i>';
	}
	else if(comp.indexOf('Attaque Precise')!=-1) {
		var pc, lastmax=0, espatt=0;
		var notMaxedOut = false;
		for(var i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetatt = Math.round(3.5*Math.min(Math.floor(1.5*att),att+3*i))+
				attbp+attbm;
			texte += 'Attaque niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(att*1.5),att+3*i)+'</b> D6 '+aff(attbp+attbm)+
				' => <b>'+jetatt+'</b><br/>';
			espatt += (pc-lastmax)*jetatt;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<i>Attaque moyenne (si réussite) : <b>'+
				Math.floor(10*espatt/lastmax)/10+'</b></i><br/>';
		}
		texte += 'Dégâts : <b>'+deg+'</b> D3 '+aff(degbp+degbm)+
			' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Balayage')!=-1)
		texte = 'Déstabilisation : <b>'+att+'</b> D6 '+aff(attbp+attbm)
			+' => <b>'+attmoy+'</b><br/>'
			+'Effet : <b>Met à terre l\'adversaire</b>';
	else if(comp.indexOf('Bidouille')!=-1)
		texte = 'Bidouiller un trésor permet de compléter le nom d\'un objet '
			+'de votre inventaire avec le texte de votre choix.';
	else if(comp.indexOf('Baroufle')!=-1){
		texte = 'Vous voulez encourager vos compagnons de chasse ? '
			+'Ramassez quelques Coquillages, et en avant la musique !<br>';
        texte +='<table class="mh_tdborder" cellspacing="1" cellpadding="1" border="0"><tbody>' +
            '<tr class="mh_tdtitre"><th>Nom</th><th>Effet</th></tr>' +
            '<tr class="mh_tdpage"><td>Booong</td><td>deg +1 / esq -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Badaboum</td><td>att +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Zbouing </td><td>reg +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Whoooom</td><td>concentration +2</td></tr>' +
            '<tr class="mh_tdpage"><td>Krouiiik</td><td>concentration -2</td></tr>' +
            '<tr class="mh_tdpage"><td>Tuutuuuut</td><td>att -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Gaaaw</td><td>Fatigue +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Huitsch</td><td>deg -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Kliketiiik</td><td>esq -1 / concentration -1</td></tr>' +
            '<tr class="mh_tdpage"><td>Kssksss</td><td>esq +1</td></tr>' +
            '<tr class="mh_tdpage"><td>Praaaouuut</td><td>reg-1 </td></tr>'+
            '<tr class="mh_tdpage"><td>Sssrileur</td><td>seuil 6, rend visible</td></tr>' +
            '<tr class="mh_tdpage"><td>Tagadagada</td><td>augmente le nombre de tours (1 tour par tranche de 2)</td></tr>' +
            '<tr class="mh_tdpage"><td>Ytseukayndof</td><td>seuil 2, rend les bonus magiques</td></tr>' +
            '<tr class="mh_tdpage"><td>Whaaag</td><td>augmente la portée horizontale (1 case par tranche de 4)</td></tr>' +
        '</tbody></table>';
    }
    else if(comp.indexOf('Botte Secrete')!=-1){
		texte = 'Attaque : <b>'
			+Math.floor(2*att/3)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2))
			+' => <b>'
			+Math.round(3.5*Math.floor(2*att/3)+Math.floor((attbp+attbm)/2))
			+'</b><br/>Dégâts : <b>'
			+Math.floor(att/2)+'</b> D3 '+aff(Math.floor((degbp+degbm)/2))
			+' => <b>'
			+(2*Math.floor(att/2)+Math.floor((degbp+degbm)/2))
			+'/'+(2*Math.floor(1.5*Math.floor(att/2))+Math.floor((degbp+degbm)/2))
			+'</b>';
	}
	else if(comp.indexOf('Camouflage')!=-1) {
		var camou = getTalent('Camouflage');
		texte = 'Pour conserver son camouflage, il faut réussir un jet sous:<br/>'
			+'<i>Déplacement :</i> <b>'+Math.floor(0.75*camou)+'%</b><br/>'
			+'<i>Attaque :</i> <b>perte automatique</b>.<br/>'
			+'<i>Projectile Magique :</i> <b>'+Math.floor(0.25*camou)+'%</b>';
	}
	else if(comp.indexOf('Charger')!=-1) {
		if(pvcourant<=0)
			return '<i>On ne peut charger personne quand on est mort !</i>';
		var portee = Math.min(
			getPortee(reg+Math.floor(pvcourant/10))-Math.floor((fatigue+bmfatigue)/5),
			vuetotale);
		if(portee<1)
			return '<b>Impossible de charger</b>';
		else {
			texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
				+' => <b>'+attmoy+'</b><br/>'
				+'Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
				+' => <b>'+degmoy+'/'+degmoycrit+'</b>'
				+'<br/>Portée : <b>'+portee+'</b> case';
			if(portee>1) texte += 's';
		}
	}
	else if(comp.indexOf('Connaissance des Monstres')!=-1) {
		texte = 'Portée horizontale : <b>'+vuetotale+'</b> case';
		if(vuetotale>1) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
	}
	else if(comp.indexOf('Piege')!=-1) {
		if(comp.indexOf('Glue')!=-1)
			texte = 'Et si vous colliez vos adversaires au sol ?';
		if(comp.indexOf('Feu')!=-1) {
			if(texte){
				texte += ' À moins que vous ne préfériez les envoyer en l\'air !<br/>';
			}
			texte += 'Dégats du piège à feu : <b>'+Math.floor((esq+vue)/2)+'</b> D3'
				+' => <b>'+2*Math.floor((esq+vue)/2)+' ('+resiste((esq+vue)/2)+')</b>';
		}
	}
	else if(comp.indexOf('Contre-Attaquer')!=-1){
		texte = 'Attaque : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2))
			+' => <b>'+Math.round(3.5*Math.floor(att/2)+Math.floor((attbp+attbm)/2))
			+'</b><br/>Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
			+' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Coup de Butoir')!=-1) {
		var pc, lastmax=0, espdeg=0;
		var notMaxedOut = false;
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
			+' => <b>'+attmoy+'</b>';
		for(var i=niveau ; i>0 ; i--) {
			pc = getTalent(comp,i);
			if(lastmax!=0 && pc<=lastmax) continue;
			var jetdeg = 2*Math.min(Math.floor(1.5*deg),deg+3*i)+(degbp+degbm);
			texte += '<br/>Dégâts niv. '+i+' ('+(pc-lastmax)+'%) : <b>'+
				Math.min(Math.floor(deg*1.5),deg+3*i)+'</b> D6 '+aff((degbp+degbm))+
				' => <b>'+jetdeg+'/'+(jetdeg+2*Math.floor(deg/2))+'</b>';
			espdeg += (pc-lastmax)*jetdeg;
			lastmax = pc;
			if(i<niveau) notMaxedOut = true;
		}
		if(notMaxedOut) {
			texte += '<br/><i>Dégâts moyens (si réussite) : <b>'+
				Math.floor(10*espdeg/lastmax)/10+'/'+
				(Math.floor(10*espdeg/lastmax)/10+2*Math.floor(deg/2))+'</b></i>';
		}
	}
	else if(comp.indexOf('Course')!=-1)
		texte = 'Déplacement gratuit : <b>'
			+Math.floor(getTalent('Course')/2)
			+' %</b> de chance';
	else if(comp.indexOf('Deplacement Eclair')!=-1)
		texte = 'Permet d\'économiser <b>1</b> PA '
			+'par rapport au déplacement classique';
	else if(comp.indexOf('Dressage')!=-1)
		texte = 'Le dressage permet d\'apprivoiser un gowap redevenu sauvage '
			+'ou un gnu sauvage.';
	else if(comp.indexOf('Ecriture Magique')!=-1)
		texte = 'Réaliser la copie d\'un sortilège après en avoir découvert '
			+'la formule nécessite de réunir les composants de cette formule, '
			+'d\'obtenir un parchemin vierge sur lequel écrire, et de récupérer '
			+'un champignon adéquat pour confectionner l\'encre.';
	else if(comp.indexOf('Frenesie')!=-1) {
		texte = 'Attaque : <b>'+att+'</b> D6 '+aff((attbp+attbm))
			+' => <b>'+attmoy+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 '+aff((degbp+degbm))
			+' => <b>'+degmoy+'/'+degmoycrit+'</b>';
	}
	else if(comp.indexOf('Golem')!=-1)
		texte = 'Animez votre golem en assemblant divers matériaux '
			+'autour d\'un cerveau minéral.'
	else if(comp.indexOf('Grattage')!=-1) {
		texte = 'Permet de confectionner un Parchemin Vierge '
			+'à partir de composants et de Gigots de Gob\'.';
	}
	else if(comp.indexOf('Hurlement Effrayant')!=-1)
		texte = 'Fait fuir un monstre si tout se passe bien.'
			+'<br/>Lui donne de gros bonus sinon...';
	else if(comp.indexOf('Identification des Champignons')!=-1) {
		texte = 'Portée horizontale : <b>'+Math.ceil(vuetotale/2)+'</b> case';
		if(vuetotale>2) texte += 's';
		texte += '<br/>Portée verticale : <b>'+Math.ceil(vuetotale/4)+'</b> case';
		if(vuetotale>4) texte += 's';
	}
	else if(comp.indexOf('Insultes')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(vuetotale,1)+'</b> case';
	else if(comp.indexOf('interposer')!=-1)
		texte = 'Jet de réflexe : <b>'
			+Math.floor(2*(esq+reg)/3)+'</b> D6 '+aff((esqbp+esqbm))
			+' => <b>'+Math.round(3.5*Math.floor(2*(esq+reg)/3)+(esqbp+esqbm))+'</b>';
	else if(comp.indexOf('Lancer de Potions') != -1)
		texte = 'Portée : <b>'+(2+Math.floor(vuetotale/5))+'</b> cases';
	else if(comp.indexOf('Marquage')!=-1)
		texte = 'Marquage permet de rajouter un sobriquet à un monstre. Il faut '
			+'bien choisir le nom à ajouter car celui-ci sera définitif. Il faut '
			+'se trouver dans la même caverne que le monstre pour le marquer.';
	else if(comp.indexOf('Melange Magique')!=-1)
		texte = 'Cette Compétence permet de combiner deux Potions pour '
			+'en réaliser une nouvelle dont l\'effet est la somme '
			+'des effets des potions initiales.';
	else if(comp.indexOf('Miner')!=-1)
		texte = 'Portée horizontale (officieuse) : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale (officieuse) : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Necromancie')!=-1)
		texte = 'La Nécromancie permet à partir des composants d\'un monstre '
			+'de faire "revivre" ce monstre.';
	else if(comp.indexOf('Painthure de Guerre')!=-1)
		texte = 'Grimez vos potrõlls et réveillez l\'esprit guerrier '
			+'qui sommeille en eux ! Un peu d\'encre, une Tête Réduite '
			+'pour s\'inspirer, et laissez parler votre créativité.'
	else if(comp.indexOf('Parer')!=-1)
		texte = 'Jet de parade : <b>'
			+Math.floor(att/2)+'</b> D6 '+aff(Math.floor((attbp+attbm))/2)
			+' => <b>'
			+Math.round(3.5*Math.floor(att/2)+Math.floor((attbp+attbm)/2))
			+'</b><hr><i>Equivalent esquive : <b>'
			+(Math.floor(att/2)+esq)+'</b> D6 '+aff(Math.floor((attbp+attbm)/2)+(esqbp+esqbm))
			+' => <b>'
			+(Math.round(3.5*(Math.floor(att/2)+esq)+Math.floor((attbp+attbm)/2))+(esqbp+esqbm))
			+'</b></i>';
	else if(comp.indexOf('Pistage')!=-1)
		texte = 'Portée horizontale : <b>'
			+2*vuetotale+'</b> cases<br/>'
			+'Portée verticale : <b>'
			+2*Math.ceil(vuetotale/2)+'</b> cases';
	else if(comp.indexOf('Planter un Champignon')!=-1)
		texte = 'Planter un Champignon est une compétence qui vous permet de '
			+'créer des colonies d\'une variété donnée de champignon à partir de '
			+'quelques exemplaires préalablement enterrés.';
	else if(comp.indexOf('Regeneration Accrue')!=-1)
		texte = 'Régénération : <b>'+Math.floor(pvtotal/15)+'</b> D3'
			+' => <b>+'+2*Math.floor(pvtotal/15)+'</b> PV';
	else if(comp.indexOf('Reparation')!=-1)
		texte = 'Marre de ces arnaqueurs de forgerons ? Prenez quelques outils, '
			+'et réparez vous-même votre matériel !';
	else if(comp.indexOf('Retraite')!=-1)
		texte = 'Vous jugez la situation avec sagesse et estimez qu\'il serait '
			+'préférable de préparer un repli stratégique pour déconcerter '
			+'l\'ennemi et lui foutre une bonne branlée ... plus tard. MOUAHAHA ! '
			+'Quelle intelligence démoniaque.';
	else if(comp.indexOf('Rotobaffe')!=-1) {
		var Datt = att, vattbm = attbp+attbm;
		var Ddeg = deg, vdegbm = degbp+degbm;
		for(var i=1 ; i<niveau+2 ; i++) {
			texte += '<b>Attaque n°'+i+' :</b><br/>'
				+'Attaque : <b>'+Datt+'</b> D6 '+aff(vattbm)
				+' => <b>'+(Math.round(3.5*Datt)+vattbm)+'</b><br/>'
				+'Dégâts : <b>'+Ddeg+'</b> D3 '+aff(vdegbm)
				+' => <b>'+(2*Ddeg+vdegbm)+'</b>';
			Datt = Math.floor(0.75*Datt); vattbm = Math.floor(0.75*vattbm);
			Ddeg = Math.floor(0.75*Ddeg); vdegbm = Math.floor(0.75*vdegbm);
			if(i<niveau+1) texte += '<hr>';
		}
	}
	else if(comp.indexOf('Shamaner')!=-1)
		texte = 'Permet de contrecarrer certains effets des pouvoirs spéciaux '
			+'des monstres en utilisant des champignons (de 1 à 3).';
	else if(comp.indexOf('Tailler')!=-1){
		texte = 'Permet d\'augmenter sensiblement la valeur marchande de certains '
			+'minerais. Mais cette opération délicate n\'est pas sans risques...';
	}
	return texte;
	}

function decumul_buff(nom,str,buff) {
	// Decumul des sorts de buff
	var ret = '1<sup>ere</sup>'+nom+' : <b>'+str+' +'+buff+'</b>';
	var dec = buff, total = buff, i=1;
	while(i<6) {
		i++;
		dec = Math.floor(coefDecumul(i)*buff);
		if(dec<=1 || i==6) break;
		total += dec;
		ret += '<br/><i>'+i+'<sup>e</sup> '+nom+' : '
			+str+' +'+dec+' (+'+total+')</i>';
		}
	ret += '<br/><i>'+i+'<sup>e</sup> et + : '+str+' +'+dec+'</i>';
	return ret;
	}


function sortileges(sort,mainCall,pcA,pcD) {
	// Si mainCall==false, affichage réduit des infos des sorts d'attaque pour PuM/PréM
	var texte = '';
	if (mainCall) {
        /* pourcentages Des bonus/malus du a PuM/PreM : Att et Deg*/
		pcA = (atttourP+atttourM);
		pcD = (degtourP+degtourM);
	}
	if (sort.indexOf('Analyse Anatomique') != -1) {
		texte = 'Portée horizontale : <b>'
			+ Math.floor(vuetotale / 2) + '</b> case';
		if (vuetotale > 3){ texte += 's'; }
		texte += '<br/>Portée verticale : <b>'
			+ Math.floor((vuetotale+1)/4)+'</b> case';
		if (vuetotale > 7){ texte += 's'; }
	}
	else if (sort.indexOf('Armure Etheree') != -1){
		texte = decumul_buff('AE', 'Armure magique', reg);
	}
	else if (sort.indexOf('Augmentation') != -1 && sort.indexOf('Attaque') != -1){
		texte = decumul_buff('AdA', 'Attaque physique', 1+Math.floor((att-3)/2));
	}
	else if (sort.indexOf('Augmentation') != -1 && sort.indexOf('Esquive') != -1){
		texte = decumul_buff('AdE', 'Esquive', 1+Math.floor((esq-3)/2));
	}
	else if (sort.indexOf('Augmentation des Degats') != -1){
		texte = decumul_buff('AdD', 'Dégâts physiques', 1 + Math.floor((deg-3)/2));
	}
	else if(sort.indexOf('Bulle Anti-Magie')!=-1){
		texte = 'RM : <b>+'+rm+'</b><br/>MM : <b>-'+mm+'</b>';
	}
	else if(sort.indexOf('Bulle Magique')!=-1){
		texte = 'RM : <b>-'+rm+'</b><br/>MM : <b>+'+mm+'</b>';
	}
	else if(sort.indexOf('Explosion')!=-1){
		texte = 'Dégâts : <b>'
			+Math.floor( 1+(deg+Math.floor(pvtotal/10))/2 )+'</b> D3 '
			+' => <b>'+2*Math.floor(1+(deg+Math.floor(pvtotal/10))/2)
			+' ('+resiste(1+(deg+Math.floor(pvtotal/10))/2 )+')</b>';
	}
	else if(sort.indexOf('Faiblesse Passagere')!=-1){
		if(pvcourant<=0)
			return '<i>Dans votre état, vous n\'affaiblirez personne...</i>';
		texte = 'Portée horizontale : <b>'
			+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Dégâts physiques : <b>-'
			+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/4 )
			+' (-'+Math.ceil( (Math.floor(pvcourant/10)+deg-5)/8 )+')</b><br/>'
			+'Dégâts magiques : <b>-'
			+Math.floor( (Math.floor(pvcourant/10)+deg-4)/4 )
			+' (-'+Math.floor( (Math.floor(pvcourant/10)+deg-2)/8 )+')</b>';
	}
	else if(sort.indexOf('Flash Aveuglant')!=-1){
		texte = 'Vue, Attaque, Esquive : <b>-'+(1+Math.floor(vue/5))+'</b>';
	}
	else if(sort.indexOf('Glue')!=-1) {
		texte = 'Portée : <b>'+(1+Math.floor(vuetotale/3))+'</b> case';
		if(vuetotale>2) texte += 's';
	}
	else if(sort.indexOf('Griffe du Sorcier')!=-1){
		/* Frappe */
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA!=0){
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+(Math.round(3.5*(att+modD))+attbm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(deg/2)+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(Math.floor(deg/2)*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)+' => <b>'
			+(2*(Math.floor(deg/2)+modD)+degbm)
			+'/'+(2*(Math.floor(deg/2)+Math.floor(deg/4)+modD)+degbm)
			+' ('+resiste(Math.floor(deg/2)+modD,degbm)
			+'/'+resiste(Math.floor(deg/2)+Math.floor(deg/4)+modD,degbm)
			+')</b>';
		if(!mainCall) return texte;
		/* Venins */
		function addVenin(type,effet,duree) {
			var ret = '<b>Venin '+type+' : </b><br/><b>'+effet+'</b> D3'
				+' pendant <b>'+duree+'</b> tour';
			if(duree>1) ret += 's';
			var dred = Math.max(Math.floor(duree/2),1);
			return ret+' => <b>'+2*effet+' x '+duree+' = '+2*effet*duree
				+'</b> ('+2*effet+' x '+dred+' = '+2*effet*dred+')';
			}
		var effet = 1+Math.floor((Math.floor(pvbase/10)+reg)/3);
		texte += '<hr>'+addVenin('insidieux',effet,2+Math.floor(vue/5));
		effet = Math.floor(1.5*effet);
		texte += '<hr>'+addVenin('virulent',effet,1+Math.floor(vue/10));
	}
	else if(sort.indexOf('Hypnotisme')!=-1)
		texte = 'Esquive : <b>-'+Math.floor(1.5*esq)+'</b> Dés'
			+' (<b>-'+Math.floor(esq/3)+'</b> Dés)';
	else if(sort.indexOf('Identification des tresors')!=-1)
		texte = 'Permet de connaitre les caractéristiques et effets précis '
			+'d\'un trésor.';
	else if(sort.indexOf('Invisibilite')!=-1)
		texte = 'Un troll invisible est indétectable même quand on se trouve '
			+'sur sa zone. Toute action physique ou sortilège d\'attaque '
			+'fait disparaître l\'invisibilité.';
	else if(sort.indexOf('Levitation')!=-1)
		texte = 'Prendre un peu de hauteur permet parfois d\'éviter les ennuis. '
			+'Comme les pièges ou les trous par exemple...';
	else if(sort.indexOf('Precision')!=-1 || sort.indexOf('Puissance')!=-1) {
		var eps = 1,
            pc = 20;
		var str = 'PréM';
		var newSort;
		var sortAtt = [
			'Projectile Magique',
			'Rafale Psychique',
			'Siphon des Ames',
			'Vampirisme',
			'Griffe du Sorcier'
		];
		if(sort.indexOf('Puissance')!=-1) {
			eps = -1; str='PuM';
		}
		for(var i=1 ; i<4 ; i++) {
			if(texte) { texte += '<hr>'; }
			texte += '<b>'+i+'<sup>e</sup> '+str+' ('+aff(pc)+' %) :</b><br/>';
			newSort = false;
			for(var j=0 ; j<sortAtt.length ; j++) {
				if(getTalent(sortAtt[j])) {
					if(newSort) { texte += '<br/><br/>'; }
					texte += '<i>'+sortAtt[j]+' :</i><br/>'
						+sortileges(sortAtt[j],false,eps*pc,-eps*pc);
					newSort = true;
				}
			}
			pc = decumulPumPrem(pc);
		}
	}
	else if(sort.indexOf('Projectile Magique')!=-1) {
		var modD = 0;
		var portee = getPortee(vuetotale);
		texte = 'Attaque : <b>'+vue+'</b> D6 ';
		if(pcA!=0) {
			modD = parseInt(vue*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+(Math.round(3.5*(vue+modD))+attbm)+'</b><br/>'
			+'Dégâts : <b>'+Math.floor(vue/2)+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(Math.floor(vue/2)+pcD);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
            modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(Math.floor(vue/2)+modD)+degbm)
			+'/'+(2*(Math.floor(1.5*Math.floor(vue/2))+modD)+degbm)
			+' ('+resiste(Math.floor(vue/2)+modD,degbm)
			+'/'+resiste(1.5*Math.floor(vue/2)+modD,degbm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Portée : <b>'+portee+'</b> case';
		if(portee>1) texte += 's';
	}
	else if(sort.indexOf('Projection')!=-1) {
		texte = 'Si le jet de résistance de la victime est raté:<br/>'
			+'la victime est <b>déplacée</b> et perd <b>1D6</b> d\'Esquive<hr>'
			+'Si le jet de résistance de la victime est réussi:<br/>'
			+'la victime ne <b>bouge pas</b> mais perd <b>1D6</b> d\'Esquive.';
	}
	else if(sort.indexOf('Rafale Psychique')!=-1) {
		var modD = 0;
		texte = 'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}
		texte += aff(degbm)
			+' => <b>'+(2*(deg+modD)+degbm)+' ('+resiste(deg+modD,degbm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Malus : régénération <b>-'+deg+'</b>';
	}
	else if(sort.indexOf('Sacrifice')!=-1) {
		if(pvcourant<=0)
			return '<i>Qui voulez-vous donc soigner ? Vous êtes mort !</i>';

		function perteSacro(sac) {
			return ' (-'+(sac+2*(1+Math.floor(sac/5)))+' PV)';
		}

		var sac = Math.floor((pvcourant-1)/2);
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Soin maximal : <b>'+sac+'</b> PV'+perteSacro(sac);
		/* Sacros max et optimal sans malus (propale R') */
        var pvdispoSansMalusTemps = pvcourant-pvtotal-Math.ceil((bmt+pdm)*pvtotal/250);
        sac = Math.floor((pvdispoSansMalusTemps-2)*5/7);
		if(sac>0)
			texte += '<hr>Soin maximum limitant les risques de malus de temps : <b>' +sac+'</b> PV'+perteSacro(sac);
        else
            texte += '<hr>Vous ne pouvez pas compenser de blessures dues à un sacrifice';
		/*if(sac>3) {
			sac = 5*Math.floor((sac+1)/5)-1;
			texte += '<br/>Soin optimal sans malus de temps : <b>'
				+sac+'</b> PV'+perteSacro(sac);
		}*/
	}
	else if(sort.indexOf('Siphon')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+att+'</b> D6 ';
		if(pcA!=0) {
			modD = parseInt(att*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+Math.round(3.5*(att+modD)+attbm)+'</b><br/>'
			+'Dégâts : <b>'+reg+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(reg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(reg+modD)+degbm)+'/'+(2*(Math.floor(1.5*reg)+modD)+degbm)
			+' ('+resiste(reg+modD,degbm)+'/'+resiste(1.5*reg+modD,degbm)+')</b>';
		if(!mainCall) return texte;
		texte += '<br/>Nécrose : attaque magique <b>-'+reg+'</b>';
	}
	else if(sort.indexOf('Telekinesie')!=-1) {
		texte = 'Portée horizontale  :';
		var vt = Math.floor(vuetotale/2)+2;
		var strList = ['d\'une Plum\' ou Très Léger','Léger',
					'Moyen','Lourd','Très Lourd ou d\'une Ton\''];
		for(var i=0 ; i<5 ; i++) {
			texte += '<br/><i>Trésor '+strList[i]+' : </i><b>'+vt+'</b> case';
			if(vt>1) texte += 's';
			vt=Math.max(0,vt-1);
		}
	}
	else if(sort.indexOf('Teleportation')!=-1) {
		var portee = getPortee(mmTroll/5);
		var pmh = (20+vue+portee);
		var pmv = 3+Math.floor(portee/3);
		texte = 'Portée horizontale : <b>'+pmh+'</b> cases<br/>'
			+'Portée verticale : <b>'+pmv+'</b> cases<hr>'
			+'X compris entre '+(posX-pmh)+' et '+(posX+pmh)+'<br/>'
			+'Y compris entre '+(posY-pmh)+' et '+(posY+pmh)+'<br/>'
			+'N compris entre '+(posN-pmv)+' et '+Math.min(-1,posN+pmv)+'<br/>';
	}
	else if(sort.indexOf('Vampirisme')!=-1) {
		var modD = 0;
		texte = 'Attaque : <b>'+Math.floor(2*deg/3)+'</b> D6 ';
		if(pcA!=0) {
			modD = parseInt(Math.floor(2*deg/3)*pcA/100);
			texte += '<i>'+aff(modD)+'D6</i> ';
		}
		texte += aff(attbm)
			+' => <b>'+Math.round(3.5*(Math.floor(2*deg/3)+modD)+attbm)+'</b><br/>'
			+'Dégâts : <b>'+deg+'</b> D3 ';
		if(pcD!=0) {
			modD = parseInt(deg*pcD/100);
			texte += '<i>'+aff(modD)+'D3</i> ';
		}else
			modD = 0;
		texte += aff(degbm)
			+' => <b>'+(2*(deg+modD)+degbm)+'/'+(2*(Math.floor(1.5*deg)+modD)+degbm)
			+' ('+resiste(deg+modD,degbm)+'/'+resiste(1.5*deg+modD,degbm)+')</b>';
	}
	else if(sort.indexOf('Vision Accrue')!=-1)
		texte = decumul_buff('VA','Vue',Math.floor(vue/2));
	else if(sort.indexOf('Vision lointaine')!=-1)
		texte = 'En ciblant une zone située n\'importe où dans le '
			+'Monde Souterrain, votre Trõll peut voir comme s\'il s\'y trouvait.';
	else if(sort.indexOf('Voir le Cache')!=-1)
		texte = '<b>Sur soi :</b><br/>Portée horizontale : <b>'
			+Math.min(5,getPortee(vue))+'</b> cases<hr>'
			+'<b>A distance :</b><br/>Portée horizontale : <b>'
			+getPortee(vuetotale)+'</b> cases';
	else if(sort.indexOf('Vue Troublee')!=-1)
		texte = 'Portée horizontale : <b>'+Math.min(1,vuetotale)+'</b> case<br/>'
			+'Vue : <b>-'+Math.floor(vue/3)+'</b>';
	return texte;
}


/*---------------------------------- Main ------------------------------------*/

function do_profil2()
{
	try {
		start_script(31);

		extractionDonnees();
		setInfosCaracteristiques();
		setInfoDescription();
		setInfosEtatLieux();
		setInfosEtatPV();
		setInfosExp();

		creerBulleVide();
		traitementTalents();
		setLienAnatrolliseur();

		// Cette fonction modifie lourdement le DOM, à placer en dernier :
		if(race=='Kastar'){ setAccel(); }
		saveProfil();
		displayScriptTime();
	} catch(e) {
		avertissement("[MZ] Une erreur s'est produite.");
		window.console.error("[MZ] Erreur générale Profil",e);
	}
}

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

// x~x tancompo

var popup;

function initPopupTancompo() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;'
						+ 'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

// roule 16/03/2016, existe déjà ailleurs
// function showPopup(evt) {
	// var texte = this.getAttribute("texteinfo");
	// popup.innerHTML = texte;
	// popup.style.left = evt.pageX + 15 + 'px';
	// popup.style.top = evt.pageY + 'px';
	// popup.style.visibility = "visible";
// }

// roule 16/03/2016, existe déjà ailleurs
// function hidePopup() {
	// popup.style.visibility = 'hidden';
// }

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

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}

function arrondi(x) {
	return Math.ceil(x-0.5); // arrondi à l'entier le plus proche, valeurs inf
	}

function traiteMinerai() {
	if (currentURL.indexOf("as_type=Divers")==-1) return;
	try {
	var node = document.evaluate("//form/table/tbody[@class='tablesorter-no-sort'"
								+" and contains(./tr/th/text(),'Minerai')]",
								document, null, 9, null).singleNodeValue;
	node = node.nextSibling.nextSibling;
	}
	catch(e) {return;}
	
	var trlist = document.evaluate('./tr', node, null, 7, null);
	for (var i=0 ; i<trlist.snapshotLength ; i++) {
		var node = trlist.snapshotItem(i);
		var nature = node.childNodes[5].textContent;
		var caracs = node.childNodes[7].textContent;
		var taille = caracs.match(/\d+/)[0];
		var coef = 1;
		if (caracs.indexOf('Moyen')!=-1) coef = 2;
		else if (caracs.indexOf('Normale')!=-1) coef = 3;
		else if (caracs.indexOf('Bonne')!=-1) coef = 4;
		else if (caracs.indexOf('Exceptionnelle')!=-1) coef = 5;
		if (nature.indexOf('Mithril')!=-1) {
			coef = 0.2*coef;
			appendText(node.childNodes[7], ' | UM: '+arrondi(taille*coef) );
			}
		else {
			coef = 0.75*coef+1.25;
			if (nature.indexOf('Taill')!=-1) coef = 1.15*coef;
			appendText(node.childNodes[7], ' | Carats: '+arrondi(taille*coef) );
			}
		}
	}

function treateComposants() {
	if (currentURL.indexOf("as_type=Compo")==-1) return;
	//On récupère les composants
	var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and (contains(td[3]/text()[2],'Tous les trolls') or contains(td[3]/text()[1],'Tous les trolls') ) "
			+ "and td[1]/img/@alt = 'Identifié']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
//		window.alert('treateComposants DOWN');
		return;
		}
	window.alert(nodes.snapshotLength);

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
			prix = n3.childNodes[3].getAttribute('value') + " GG'";
		texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.lastIndexOf('(') + 1, id_taniere.lastIndexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"));
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateAllComposants() {
	if(currentURL.indexOf("as_type=Compo")==-1) return;
	
	//On récupère les composants
	var categ = document.evaluate( "count(//table/descendant::text()[contains(.,'Sans catégorie')])",
							document, null, 0, null ).numberValue;
	var c = (categ == 0 ? 3 : 4);
	var nodes = document.evaluate("//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') "
		+ "or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]/following::table[@width = '100%']"
		+ "/descendant::tr[contains(td[1]/a/b/text(),']') and ("
			+ "td["+c+"]/text()[1] = '\240-\240' "
			+ "or contains(td["+c+"]/text()[2],'Tous les trolls') "
			+ "or contains(td["+c+"]/text()[1],'Tous les trolls') "
			+ "or (count(td["+c+"]/text()) = 1 and td["+c+"]/text()[1]='n°') ) "
		+ "and td[1]/img/@alt = 'Identifié']",
		document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0) {
//		window.alert('treateAllComposants DOWN');
		return;
		}

	var texte = "";
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var n1 = nodes.snapshotItem(i).childNodes[1];
		var n3 = nodes.snapshotItem(i).childNodes[3];
		var debut = n1.childNodes[2].nodeValue.replace(/\n/g, '');
		var prix = n3.childNodes[0].nodeValue;
		if (!prix)
		{	
			if(n3.childNodes[3].getAttribute('value') && n3.childNodes[3].getAttribute('value')!="")
				prix = n3.childNodes[3].getAttribute('value') + " GG'";
		}
		else
		{
			prix= prix.replace(/[\240 ]/g, "");
			if(prix=="-")
				prix=null;
		}
		if(prix)
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";"
				+ prix.replace(/\n/g, '') + "\n";
		else
			texte += debut.substring(debut.indexOf('[') + 1, debut.indexOf(']')) + ";"
				+ n1.childNodes[3].firstChild.nodeValue.replace(/\n/g, '')
				+ n1.childNodes[3].childNodes[1].firstChild.nodeValue.replace(/\n/g, '') + ";pas défini\n";
	}

	var c = document.evaluate("//div[@class = 'titre2']/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var id_taniere = c.snapshotItem(0).nodeValue;
	id_taniere = id_taniere.substring(id_taniere.indexOf('(') + 1, id_taniere.indexOf(')'));

	var form = getFormComboDB(currentURL.indexOf('MH_Taniere') != -1 ? 'taniere' : 'grande_taniere', id_taniere,
			texte.replace(/\240/g, " ").replace(/d'un/g, "d un"),"Vendre tous les composants non réservés sur le Troc de l\'Hydre");
	if (form)
	{
		if(document.getElementsByTagName('form').length>0)
			insertBefore(document.getElementsByTagName('form')[0].nextSibling, form);
		else
		{
			var thisP = document.evaluate("//p/table/descendant::text()[contains(.,'Heure Serveur')]/../../../../..",	document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			insertBefore(thisP, form);
		}
	}
}

function treateEM()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.8/images/Competences/ecritureMagique.png";
	var nodes = document.evaluate("//tr[@class='mh_tdpage']"
			, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var desc = nodes.snapshotItem(i).getElementsByTagName('td') ;
		var link = desc[2].firstChild ;
		var nomCompoTotal = desc[2].textContent ;
		var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
		nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
		var nomMonstre = trim(nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length-1)) ;
		var locqual = desc[3].textContent ;
		var qualite = trim(locqual.substring(locqual.indexOf("Qualité:")+9)) ;
		var localisation = trim(locqual.substring(0,locqual.indexOf("|")-1)) ;
		if(isEM(nomMonstre).length>0)
		{
			var infos = composantEM(nomMonstre, trim(nomCompo), localisation,getQualite(qualite));
			if(infos.length>0)
			{
				var shortDescr = "Variable";
				var bold = 0;
				if(infos != "Composant variable")
				{
					shortDescr = infos.substring(0,infos.indexOf(" "));
					if(parseInt(shortDescr)>=0)
						bold=1;
				}
				link.parentNode.appendChild(createImage(urlImg,infos)) ;
				appendText(link.parentNode," ["+shortDescr+"]",bold) ;
			}
		}
		
	}
}

function treateChampi() {
	if (currentURL.indexOf('as_type=Champi')==-1)
		return false;
	var nodes = document.evaluate("//img[@alt = 'Identifié']/../a/text()[1]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var nomChampi = trim(node.nodeValue.replace(/\240/g, ' '));
		if (moisChampi[nomChampi])
			appendText(node.parentNode.parentNode,' [Mois '+moisChampi[nomChampi]+']');
		}
	}

function treateEnchant()
{
	if(currentURL.indexOf("as_type=Compo")==-1)
		return false;
	try
	{
		if(!listeMonstreEnchantement)
			computeCompoEnchantement();
		var nodes = document.evaluate(
			"//a[starts-with(@href,'TanierePJ_o_Stock.php?IDLieu=') or starts-with(@href,'Comptoir_o_Stock.php?IDLieu=')]"
			+ "/following::table[@width = '100%']/descendant::tr[contains(td[1]/a/b/text(),']') "
			+ "and td[1]/img/@alt = 'Identifié']/td[1]/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength == 0)
			return false;
		var urlImg = "http://mountyzilla.tilk.info/scripts_0.9/images/enchant.png";
		for (var i = 0; i < nodes.snapshotLength; i++) {
			var link = nodes.snapshotItem(i);
			var nomCompoTotal = link.firstChild.nodeValue;
			var nomCompo = nomCompoTotal.substring(0,nomCompoTotal.indexOf(" d'un"));
			nomCompoTotal = nomCompoTotal.substring(nomCompoTotal.indexOf("d'un"),nomCompoTotal.length);
			var nomMonstre = nomCompoTotal.substring(nomCompoTotal.indexOf(" ")+1,nomCompoTotal.length);
			nomCompoTotal = link.childNodes[1].childNodes[0].nodeValue;
			var qualite = nomCompoTotal.substring(nomCompoTotal.indexOf("de Qualité")+11,nomCompoTotal.indexOf(" ["));
			var localisation = nomCompoTotal.substring(nomCompoTotal.indexOf("[")+1,nomCompoTotal.indexOf("]"));
			if(isEnchant(nomMonstre).length>0)
			{
				var infos = composantEnchant(nomMonstre, nomCompo, localisation,getQualite(qualite));
				if(infos.length>0)
				{
					link.parentNode.appendChild(createImage(urlImg,infos));
				}
			}
		}
	}
	catch(e)
	{
		window.alert(e);
	}
}

function treateEquipEnchant()
{
	if(currentURL.indexOf('as_type=Arme')==-1 && currentURL.indexOf('as_type=Armure')==-1)
		return false;
	initPopupTancompo();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}

function do_tancompo()
{
start_script();

treateAllComposants();
treateComposants();
traiteMinerai();
if (MY_getValue('NOINFOEM')!='true') {
	treateChampi();
	treateEM();
	}
if (MY_getValue(numTroll+'.enchantement.liste') && MY_getValue(numTroll+'.enchantement.liste')!='') {
	treateEnchant();
	treateEquipEnchant();
	}

displayScriptTime();
}





/*******************************************************************************
*   This file is part of Mountyzilla.                                          *
*                                                                              *
*   Mountyzilla is free software; you can redistribute it and/or modify        *
*   it under the terms of the GNU General Public License as published by       *
*   the Free Software Foundation; either version 2 of the License, or          *
*   (at your option) any later version.                                        *
*                                                                              *
*   Mountyzilla is distributed in the hope that it will be useful,             *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of             *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              *
*   GNU General Public License for more details.                               *
*                                                                              *
*   You should have received a copy of the GNU General Public License          *
*   along with Mountyzilla; if not, write to the Free Software                 *
*   Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA *
*******************************************************************************/

// x~x script_principal

function isPage(url) {
	return window.location.pathname.indexOf("/mountyhall/"+url) == 0;
}

/*--------------------------------- Dispatch ---------------------------------*/

//chargerScriptDev("libs");
//chargerScriptDev("ALWAYS");	// ALWAYS contient des aides au test (GOD-MODE ;)

// Détection de la page à traiter
if(isPage("Messagerie/ViewMessageBot")) {
	do_cdmbot();
} else if(isPage("MH_Play/Actions/Competences/Play_a_Competence16b")) {
	do_cdmcomp();
} else if(isPage("MH_Guildes/Guilde_o_AmiEnnemi")) {
	do_diplo();
} else if(isPage("MH_Play/Play_equipement")) {
	do_equip();
} else if(isPage("MH_Play/Play_menu")) {
	do_menu();
} else if(isPage("MH_Play/Options/Play_o_Interface") || isPage("installPack")) {
	do_option();
} else if(isPage("View/PJView")) {
	do_pjview();
} else if(isPage("MH_Play/Play_profil") && !isPage('MH_Play/Play_profil2')) {
	do_profil();
} else if(isPage("MH_Taniere/TanierePJ_o_Stock") || isPage("MH_Comptoirs/Comptoir_o_Stock")) {
	do_tancompo();
} else if(isPage("MH_Play/Play_vue")) {
	do_vue();
} else if(isPage("MH_Play/Play_news")) {
	do_news();
} else if(isPage("MH_Play/Actions/Play_a_Move") || 	isPage("MH_Lieux/Lieu_Teleport")) {
	do_move();
} else if(isPage("MH_Missions/Mission_Etape")) {
	do_mission();
} else if(isPage("View/MonsterView")) {
	do_infomonstre();
} else if(isPage("MH_Play/Actions/Play_a_Attack")) {
	do_attaque();
} else if(isPage("MH_Follower/FO_Ordres")) {
	do_ordresgowap();
} else if(isPage("MH_Follower/FO_Equipement")) {
	do_equipgowap();
} else if(isPage("MH_Play/Play_mouche")) {
	do_mouches();
} else if(isPage("MH_Play/Play_BM")) {
	do_malus();
} else if(isPage("MH_Play/Play_evenement")) {
	do_myevent();
} else if(isPage("MH_Lieux/Lieu_DemanderEnchantement")) {
	do_enchant();
} else if(isPage("MH_Lieux/Lieu_Enchanteur")) {
	do_pre_enchant();
} else if(isPage("MH_Play/Actions") || isPage("Messagerie/ViewMessageBot")) {
	do_actions();
} else if(isPage('MH_Missions/Mission_Liste.php') && MY_getValue(numTroll+'.MISSIONS')) {
	do_mission_liste();
} else if(isPage('MH_Play/Play_action')) {
	do_actions();
} else if(isPage('MH_Play/Play_profil2')) {
    do_profil2();
}
