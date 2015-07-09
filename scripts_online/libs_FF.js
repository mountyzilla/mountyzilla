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
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

var MZimg = 'http://mountyzilla.tilk.info/scripts_0.9/images/';

/*---------------- mise à jour de variables globales utiles ------------------*/
// utilisé pour accès bdd (un peu partout) :
var numTroll = MZ_getValue('NUM_TROLL');
// utilisé dans vue pour PX :
var nivTroll = MZ_getValue('NIV_TROLL');
// utilisés dans actions et vue (calculs SR) :
var mmTroll = MZ_getValue(numTroll+'.caracs.mm');
var rmTroll = MZ_getValue(numTroll+'.caracs.rm');

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

function chargerScript(script) {
	// (mauvaise) Détection du chargement de la page
	if(document.getElementsByTagName('A').length > 0)
		appendNewScript(
			script.indexOf('http://') != -1 ? script : scriptsMZ+script+'_FF.js'
			);
	}

function addScript(src) {
	var newScript = document.createElement('script');
	newScript.setAttribute('language','JavaScript');
	newScript.setAttribute('src',src);
	var parent = document.body;
	parent.appendChild(newScript);
	return newScript;
	}

function appendNewScript(src,paren) {
	MZ_appendNewScript(src);
	}


/*-[functions]---------- DEBUG: Communication serveurs -----------------------*/

function FF_XMLHttpRequest(MZ_XHR_Ob) {
	var request = new XMLHttpRequest();
	request.open(MZ_XHR_Ob.method,MZ_XHR_Ob.url);
	for(var head in MZ_XHR_Ob.headers) {
		request.setRequestHeader(head,MZ_XHR_Ob.headers[head]);
	}
	request.onreadystatechange = function() {
		if(request.readyState!=4) { return; }
		if(request.error) {
			if(MZ_XHR_Ob.onerror) {
				MZ_XHR_Ob.onerror(request);
			}
		}
		else if(MZ_XHR_Ob.onload) {
			/* DEBUG: Ajouter à request les pptés de MZ_XHR_Ob à transmettre */
			MZ_XHR_Ob.onload(request);
		}
	};
	request.send(MZ_XHR_Ob.data);
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
	//'Construire un Piege':'Piege',
	'Piege a Feu':'PiegeFeu',
	'Piege a Glue':'PiegeGlue',
	'Contre-Attaquer':'CA',
	'Coup de Butoir':'CdB',
	'Course':'Course',
	'Deplacement Eclair':'DE',
	'Dressage':'Dressage',
	'Ecriture Magique':'EM',
	'Frenesie':'Frenesie',
	//'Golemologie':'Golemo',
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
	if(MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau))
		return MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau);
	return 0;
	}

function removeAllTalents() {
	for(var talent in arrayTalents) {
		var nomEnBase = arrayTalents[talent];
		if(MZ_getValue(numTroll+'.talent.'+nomEnBase)) {
			MZ_removeValue(numTroll+'.talent.'+nomEnBase);
			continue;
			}
		var niveau = 1;
		while(MZ_getValue(numTroll+'.talent.'+nomEnBase+niveau)) {
			MZ_removeValue(numTroll+'.talent.'+nomEnBase+niveau);
			niveau++;
			}
		}
	}

function isProfilActif() { // DEBUG: Réfléchir à l'utilité de cette fonction
	var att = MZ_getValue(numTroll+'.caracs.attaque');
	var attbmp = MZ_getValue(numTroll+'.caracs.attaque.bmp');
	var attbmm = MZ_getValue(numTroll+'.caracs.attaque.bmm');
	var mm = MZ_getValue(numTroll+'.caracs.mm');
	var deg = MZ_getValue(numTroll+'.caracs.degats');
	var degbmp = MZ_getValue(numTroll+'.caracs.degats.bmp');
	var degbmm = MZ_getValue(numTroll+'.caracs.degats.bmm');
	var vue = MZ_getValue(numTroll+'.caracs.vue');
	var bmvue = MZ_getValue(numTroll+'.caracs.vue.bm');
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
	var liste = MZ_getValue(numTroll+'.enchantement.liste').split(';');
	for(var i=0;i<liste.length;i++)
	{
		var idEquipement = liste[i]*1;
		if(MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet')==null || MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur')==null)
			continue;
		var nomEquipement = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.objet');
		var infoEnchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur').split(';');
		var texteGlobal='';
		for(var j=0;j<3;j++)
		{
			var infoComposant = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.composant.'+j).split(';');
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
			var enchanteur = MZ_getValue(numTroll+'.enchantement.'+idEquipement+'.enchanteur');
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
			MZ_setValue(numTroll+'.enchantement.'+idEquipement+'.objet',nomEquipement+' ('+idEquipement+')');
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
	var att = MZ_getValue(numTroll+".caracs.attaque");
	var attbmp = MZ_getValue(numTroll+".caracs.attaque.bmp");
	var attbmm = MZ_getValue(numTroll+".caracs.attaque.bmm");
	var mm = MZ_getValue(numTroll+".caracs.mm");
	var deg = MZ_getValue(numTroll+".caracs.degats");
	var degbmp = MZ_getValue(numTroll+".caracs.degats.bmp");
	var degbmm = MZ_getValue(numTroll+".caracs.degats.bmm");
	var vue = MZ_getValue(numTroll+".caracs.vue");
	var pv = MZ_getValue(numTroll+".caracs.pv");
	var esq = Math.max(MZ_getValue(numTroll+".caracs.esquive")-MZ_getValue(numTroll+".caracs.esquive.nbattaques"),0);
	var esqbonus = MZ_getValue(numTroll+".caracs.esquive.bm");
	var arm = MZ_getValue(numTroll+".caracs.armure");
	var armbmp = MZ_getValue(numTroll+".caracs.armure.bmp");
	var armbmm = MZ_getValue(numTroll+".caracs.armure.bmm");
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


/*-[functions]----------- Gestion des tags de trõlls -------------------------*/

var tagPopup = null;
var nbTagFile = 0, nbTagFileAnalyzed = 0;
var infoTagTrolls = [], infoTagGuildes = [];

/* [functions] Gestion des popups de tag */
function initTagPopup() {
	if(tagPopup!=null) { return; }
	tagPopup = document.createElement('div');
	tagPopup.id = 'tagPopup';
	tagPopup.className = 'mh_textbox';
	tagPopup.style =
		'position:absolute;'
		+'border:1px solid #000000;'
		+'visibility:hidden;'
		+'display:inline;'
		+'z-index:3;'
		+'max-width:400px;';
	document.body.appendChild(tagPopup);
	}

function showTagPopup(evt) {
	var texte = this.texteinfo;
	tagPopup.innerHTML = texte;
	tagPopup.style.left = (evt.pageX+15)+'px';
	tagPopup.style.top = evt.pageY+'px';
	tagPopup.style.visibility = 'visible';
	}

function hideTagPopup() {
	tagPopup.style.visibility = 'hidden';
	}

function performTagComputation() { // uniquement lancé par libs
	var nbGuildes = document.evaluate("//a[contains(@href,'javascript:EAV') "
		+"or contains (@href,'javascript:EnterAllianceView')]",
		document, null, 7, null).snapshotLength;
	var nbTrolls = document.evaluate("//a[contains(@href,'javascript:EPV') "
		+"or contains(@href,'javascript:EnterPJView')]",
		document, null, 7, null).snapshotLength;
	if(nbTrolls>0 || nbGuildes>0) {
		initTagPopup();
		getTag(analyseTags,showTags);
		}
	}

function getTag(fonctionAnalyse,fonctionAffiche) {
try {
	if(!MZ_getValue(numTroll+'.TAGSURL') || MZ_getValue(numTroll+'.TAGSURL')=='')
		return;
	var tagsurl = MZ_getValue(numTroll+'.TAGSURL');
	var listeTagsURL = tagsurl.split('$');
	nbTagFile = listeTagsURL.length;
	for(var i=0 ; i<listeTagsURL.length ; i++) {
		if(listeTagsURL[i].toLowerCase().indexOf('http')==0) {
			FF_XMLHttpRequest({
				method: 'GET',
				url: listeTagsURL[i],
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Mountyzilla',
					'Accept': 'application/xml,text/xml',
					},
				onload: function(responseDetails) {
					try {
						fonctionAnalyse(responseDetails.responseText);
						}
					catch(e) {window.alert(e);}
					nbTagFileAnalyzed++;
					if(nbTagFileAnalyzed==nbTagFile)
						fonctionAffiche();
					},
				onerror: function(responseDetails) {
					nbTagFileAnalyzed++;
					if(nbTagFileAnalyzed==nbTagFile)
						fonctionAffiche();
					},
				});
			}
		else {
			nbTagFileAnalyzed++;
			if(nbTagFileAnalyzed==nbTagFile)
				fonctionAffiche();
			}
		}
	}
	catch(e) {window.alert(e);}
	}

function createTagImage(url,text) {
	var img = document.createElement('img');
	img.src = url;
	img.align = 'absmiddle'; // WARNING - Obsolete
	img.texteinfo = text;
	img.onmouseover = showTagPopup;
	img.onmouseout = hideTagPopup;
	return img;
	}

function showTags() { // uniquement dans libs
try {
	if(infoTagGuildes.length>0)
		{ // nom mais quelle brutasse !!!
			var nodes = document.evaluate(
				"//a[contains(@href,'javascript:EAV') "
				+"or contains(@href,'javascript:EnterAllianceView')]",
				document, null, 7, null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href');
				var guildeID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(',')));
				var infos = infoTagGuildes[guildeID];
				if(infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0],infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
		if(infoTagTrolls.length>0)
		{
			var nodes = document.evaluate("//a[contains(@href,'javascript:EPV') or contains(@href,'javascript:EnterPJView')]",document,null,7,null);
			for(var i=0;i<nodes.snapshotLength;i++)
			{
				var node = nodes.snapshotItem(i);
				var link = node.getAttribute('href').replace(/'/g,"");
				var trollID = parseInt(link.substring(link.indexOf('(')+1,link.indexOf(')')));
				var infos = infoTagTrolls[trollID];
				if(infos) 
				{
					for(var j=0;j<infos.length;j++)
					{
						insertAfter(node,createTagImage(infos[j][0],infos[j][1]));
						insertAfter(node,document.createTextNode(" "));
					}
				}	
			}
		}
	}
	catch(e) {window.alert(e);}
}

function analyseTags(data) {
	var icones = [];
	var descriptions = [];
	
	var lignes = data.split('\n');
	for(var i=0;i<lignes.length;i++) {
	try {
		var args = lignes[i].split(';');
		if(args.length<=1) continue;
		
		if(args[0]=='I')
			icones.push(args[1]);
		else if(args[0]=='D')
			descriptions.push(bbcode(lignes[i].substring(lignes[i].indexOf(";")+1)));
		else if(args[0]=='T') {
			if(args.length<=2) continue;
			var id = args[1]*1;
			var icone = icones[args[2]*1];
			var texte = '';
			for(var j=3;j<args.length;j++)
				texte+=descriptions[args[j]*1];
			var info = [icone,texte];
			if(infoTagTrolls[id] == null)
				infoTagTrolls[id] = [];
			infoTagTrolls[id].push(info);
			}
		else if(args[0]=='G') {
			if(args.length<=2) continue;
			var id = args[1]*1;
			var icone = icones[args[2]*1];
			var texte = '';
			for(var j=3;j<args.length;j++)
				texte+=descriptions[args[j]*1];
			var info = [icone,texte];
			if(infoTagGuildes[id] == null)
				infoTagGuildes[id] = [];
			infoTagGuildes[id].push(info);
			}
		}
		catch(e)
		{
			window.alert(e);
			break;
		}
	}
}

if(!isPage("MH_Play/Play_vue.php") && !isPage("MH_Play/Play_menu.php"))
	performTagComputation();

/* DEBUG - En attendant l'upgrade vers MZ2 */
if(isPage('MH_Missions/Mission_Liste.php')
	&& MZ_getValue(numTroll+'.MISSIONS')) {
	MZ_appendNewScript(
		'http://mountyzilla.tilk.info/scripts_0.9/mission_liste_FF.js'
	);
}

if(isPage('MH_Play/Play_action')) {
	appendNewScript(
		'http://mountyzilla.tilk.info/scripts_0.9/actions_FF.js'
	);
}
