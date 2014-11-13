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
		console.log(e);
		return;
	}
	
	nomMonstre = texte.slice(0,texte.indexOf('(')-1);
	if(nomMonstre.indexOf(']')!=-1) {
		nomMonstre = nomMonstre.slice(0,nomMonstre.indexOf(']')+1);
	}
	idMonstre = texte.match(/\d+/);
	FF_XMLHttpRequest({
		method: 'GET',
		url: 'http://mountypedia.ratibus.net/mz/monstres_0.9_FF.php?begin=-1&idcdm='
			+MZ_getValue('CDMID')
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
					computeMission();
				}
			} catch(e) {
				window.alert(e);
			}
		}
	});
}

function initPopup() {
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
		popup.style.left = Math.min(evt.pageX-120,window.innerWidth-300)+'px';
		popup.style.top = evt.pageY+15+'px';
		popup.style.visibility = 'visible';
	} catch(e) {
		window.alert(e);
	}
}

function hidePopup() {
	popup.style.visibility = 'hidden';
}

function toggleTableau() {
	tbody.style.display = tbody.style.display=='none' ? '' : 'none';
}

function computeMission() {
// C'est quoi ce titre de fonction ? (O_o)
	try {
		var nodeInsert = document.evaluate(
			"//div[@class = 'titre3']",
			document, null, 9, null
		).singleNodeValue;
	} catch(e) {
		console.log(e);
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

start_script();
try {
	initPopup();
	traiteMonstre();
} catch(e) {
	window.alert('Erreur infoMonstre:\n'+e);
}
displayScriptTime();
