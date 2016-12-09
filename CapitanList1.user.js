// ==UserScript==
// @author Rouletabille
// @description Affichage des essais de recherche de cachette de Capitan (avec grant)
// @grant GM_getValue
// @grant GM_listValues
// @include */mountyhall/MH_Play/Options/Play_o_Interface.php
// @downloadURL https://greasyfork.org/scripts/23991-capitan/code/Capitan.user.js
// @name CapitanList1
// @version 1.0
// @namespace https://greasyfork.org/users/70018
// ==/UserScript==

var gMode = 'avec grant';

// essais : objet
//	.mode : description
//	.essais : tableau d'objets essai
//		.mode : description
//		.essais : tableau de cartes
//			.noCarte : id de la carte
//			.essais : tableau d'essais, [x, y, n, nb]
function AfficheEssais(essais) {
	var insertPoint = document.getElementById('footer1');
	insertBefore(insertPoint,document.createElement('p'));
	insertTitle(insertPoint,'Capitan : Liste des essais (' + gMode + ')');
	return;
	insertOptionTable(insertPoint);
	insertBefore(insertPoint,document.createElement('p'));
	insertTitle(insertPoint,'Mountyzilla : Crédits');
	insertCreditsTable(insertPoint);
	insertBefore(insertPoint,document.createElement('p'));

}

function getEssaiV1_0() {
	
}

function getEssaiV1_1() {
}

function getEssaiV1_2() {
	if (!GM_getValue) return;
	var tabKey = GM_listValues();
	for (var i = 0; i < tabKey.length; i++) {
		window.console.log('key ' + tabKey[i] + ' => ' + GM_getValue(tabKey[i]));
	}
}

function main() {
	var essai1_2 = getEssaiV1_2();
}

function insertTitle(next,txt) {
	var div = document.createElement('div');
	div.className = 'titre2';
	appendText(div,txt);
	insertBefore(next,div);
}


/**********************************************************
**** Début de zone à déplacer dans une bibli commune ******
**********************************************************/

// URLs externes images (déplacées sur infra raistlin 09/11/2016, pas besoin deCORS, HTTPS OK)
//const URL_MZimg09 = 'http://mountyzilla.tilk.info/scripts_0.9/images/';	// en cours de migration vers infra raistlin
//const URL_MZimg11 = 'http://mountyzilla.tilk.info/scripts_1.1/images/'
const URL_MZimg = 'http://mz.mh.raistlin.fr/mz/img/';
var URL_MZimg09 = URL_MZimg;	// à fusioner
var URL_MZimg11 = URL_MZimg;
// URLs externes images (pas de souci CORS mais pas de HTTPS)
const URL_MZscriptCarte = "http://mountyzilla.tilk.info/scripts_0.8/carte_trajet2.php";

// URLs externes redirection (pas de souci CORS)
const URL_pageNiv = 'http://mountypedia.ratibus.net/mz/niveau_monstre_combat.php';
const URL_MZmountyhall = 'http://trolls.ratibus.net/mountyhall/';
const URL_AnatrolDispas = 'http://mountyhall.dispas.net/dynamic/';
const URL_vue_CCM = 'http://clancentremonde.free.fr/Vue2/RecupVue.php';
const URL_vue_Gloumfs2D = 'http://gloumf.free.fr/vue2d.php';
const URL_vue_Gloumfs3D = 'http://gloumf.free.fr/vue3d.php';
const URL_vue_Grouky= 'http://mh.ythogtha.org/grouky.py/grouky';
//const URL_tilk_js = 'http://mountyzilla.tilk.info/scripts/';	// un de moins \o/ source intégré dans tout_MZ
const URL_troc_mh = 'http://troc.mountyhall.com/search.php';
const URL_cyclotrolls = 'http://www.cyclotrolls.be/';

// URLs de test HTTPS
const URL_CertifRaistlin1 = 'https://mz.mh.raistlin.fr/mz/img/1.gif';
const URL_CertifRaistlin2 = 'https://cdm.mh.raistlin.fr/mz/niveau_monstre_combat.php';

// URLs externes ajax (nécessite l'entête CORS, solution actuelle : passage en proxy chez raistlin)
// var URL_MZinfoMonstre = 'http://mz.mh.raistlin.fr/mz/monstres_0.9_FF.php';	// infra sur serveur raistlin en préparation
// var URL_MZinfoMonstrePost = 'http://mz.mh.raistlin.fr/mz/monstres_0.9_post_FF.php';
// var URL_pageDispatcher = "http://mz.mh.raistlin.fr/mz/cdmdispatcher.php";
var URL_MZinfoMonstre = 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_FF.php';	// redirigé vers http://mountypedia.free.fr/mz/monstres_0.9_FF.php
var URL_MZinfoMonstrePost = 'http://cdm.mh.raistlin.fr/mz/monstres_0.9_post_FF.php';	// redirigé vers mountypedia.free.fr
var URL_pageDispatcher = "http://cdm.mh.raistlin.fr/mz/cdmdispatcher.php";		// envoi des CdM, redirigé vers mountypedia.free.fr
// pour passer en mode IP, commenter les 3 lignes précédentes et décommenter les 3 suivantes
//var URL_MZinfoMonstre = 'http://192.99.225.92/mz/monstres_0.9_FF.php';
//var URL_MZinfoMonstrePost = 'http://192.99.225.92/mz/monstres_0.9_post_FF.php';
//var URL_pageDispatcher = 'http://192.99.225.92/mz/cdmdispatcher.php';

// ceux-ci rendent bien les 2 entêtes CORS (mais pas de HTTPS)
const URL_ratibus_lien = 'http://trolls.ratibus.net/';	// recupération des infos des trolls dans l'IT bricol'troll
const URL_anniv = 'http://mountyzilla.tilk.info/scripts/anniv.php'; // Url de récup des jubilaires:
const URL_rss = 'http://mountyzilla.tilk.info/news/rss.php';	// Flux RSS des news MZ
const URL_trooglebeta = 'http://troogle-beta.aacg.be/view_submission';

// x~x Libs

/* TODO
 * - revoir la gestion des CdM --> nott armure magique
 * - revoir tout ce qui est lié à la vue (estimateurs dég nott)
 * - vérfier la gestion des enchants
 */

// Roule 04/09/2016 switch extern URLs to https if available
var isHTTPS = false;
if ( window.location.protocol.indexOf('https') === 0) {
	URL_MZinfoMonstre = URL_MZinfoMonstre.replace(/http:\/\//, 'https://');
	URL_MZinfoMonstrePost = URL_MZinfoMonstrePost.replace(/http:\/\//, 'https://');
	URL_pageDispatcher = URL_pageDispatcher.replace(/http:\/\//, 'https://');
	// Roule 09/11/2016 images OK en https sur infra Raistlin
	URL_MZimg09 = URL_MZimg09.replace(/http:\/\//, 'https://');
	URL_MZimg11 = URL_MZimg11.replace(/http:\/\//, 'https://');
	isHTTPS = true;
}
 
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
		//window.console.log('XMLHttp readystatechange url=' + MY_XHR_Ob.url + ', readyState=' + request.readyState + ', error=' + request.error + ', status=' + request.status);
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
	if(!duree) duree = 15000;
	var div = document.createElement('div');
	// On numérote les avertissements pour destruction sélective
	var num = document.getElementsByName('avertissement').length;
	div.num = num;
	// Numéro enregistré dans le DOM pour récupération sur getElementsByName()
	div.setAttribute('name','avertissement');
	div.className = 'mh_textbox';
	div.style.position = 'fixed';
	div.style.top = (10+15*num)+'px';
	div.style.left = (10+5*num)+'px';
	div.style.border = '5px solid red';
	div.style.zIndex = 2+num;
	div.style.cursor = 'pointer';
	div.style.fontSize = 'large';
	div.innerHTML = txt;
	div.onclick=function(){ tueAvertissement(this.num) };

	// un croix en haut à droite pour signifier à l'utilisateur qu'il peut cliquer pour fermer ce popup
	var divcroix = document.createElement('div');
	divcroix.style.position = 'absolute';
	divcroix.style.top = 0;
	divcroix.style.right = 0;
	divcroix.style.color = 'black';
	divcroix.style.fontSize = 'inherit';
	divcroix.style.cursor = 'pointer'
	divcroix.style.zIndex = 2+num;
	divcroix.innerHTML = "X";
	div.appendChild(divcroix);

	document.body.appendChild(div);
	// Destruction automatique de l'avertissement après "un certain temps"
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

/**********************************************************
**** Fin de zone à déplacer dans une bibli commune ********
**********************************************************/

main();
