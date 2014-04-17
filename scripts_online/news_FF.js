/*******************************************************************************
* This file is part of Mountyzilla (http://mountyzilla.tilk.info/)             *
* Mountyzilla is free software; provided under the GNU General Public License  *
*******************************************************************************/

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
		MZ_xmlhttpRequest({
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
		MZ_xmlhttpRequest({
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

start_script();

traiterJubilaires();
traiterNouvelles();

displayScriptTime();
