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

var listeCDM = new Array();
var idMonstre=-1;
var nomMonstre="";
var tbody;
var popup;

function treateMonstre() {
	var nodes = document.evaluate(
			"//div[@class = 'titre2' and contains(text(),'(')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	var node = nodes.snapshotItem(0);
	var texte = node.childNodes[0].nodeValue;
	nomMonstre = texte.substring(0,texte.indexOf('(')-1);
	if(nomMonstre.indexOf(']') != -1)
		nomMonstre = nomMonstre.substring(0,nomMonstre.indexOf(']')+1);
	idMonstre = texte.substring(texte.indexOf('(')+1,texte.indexOf(')'))*1;
	FF_XMLHttpRequest({
		method: 'GET',
		url: 'http://mountypedia.free.fr/mz/monstres_0.9_FF.php?begin=-1&idcdm=' + MZ_getValue('CDMID') + '&nom[]=' + escape(nomMonstre) + '$' + idMonstre,
		headers : {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml'
		},
		onload: function(responseDetails) {
			try
			{
				var texte = responseDetails.responseText;
				var lines = texte.split("\n");
				if(lines.length>=1)
				{
					var infos = lines[0].split(";");
					if(infos.length<4)
						return;
					var idMonstre=infos[0];
					infos=infos.slice(3);
					listeCDM[idMonstre] = infos;
					computeMission();
				}
			}
			catch(e)
			{
				window.alert(e);
			}

		}
	});
	//appendNewScript('http://mountypedia.free.fr/mz/monstres_FF.php?begin=-1&end=true&idcdm=' + MZ_getValue('CDMID') + '&nom[]=' + escape(nomMonstre) + '$' + idMonstre);
}

function initPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 300px;');
	document.body.appendChild(popup);
}

function createPopupImage2(url, id, nom)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("id",id);
	img.setAttribute("nom",nom);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function showPopup(evt) {
	try
	{
		var id = this.getAttribute("id");
		var nom = this.getAttribute("nom");
		var texte = getAnalyseTactique(id,nom);
		if(texte=="")
			return;
		popup.innerHTML = texte;
		popup.style.left = Math.min(evt.pageX - 120,window.innerWidth-300) + 'px';
		popup.style.top = evt.pageY+15 + 'px';
		popup.style.visibility = "visible";
	}
	catch(e)
	{
		window.alert(e);
	}
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function toggleTableau() {
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
}

function computeMission()
{
	if (listeCDM[idMonstre])
	{
		var donneesMonstre = listeCDM[idMonstre];
		var nodes = document.evaluate("//div[@class = 'titre3']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var node = nodes.snapshotItem(0);
		var table = createCDMTable(idMonstre,nomMonstre,donneesMonstre);
		table.setAttribute('align', 'center');
		tbody = table.childNodes[1];
		table.firstChild.firstChild.firstChild.addEventListener("click", toggleTableau, true);
		table.firstChild.firstChild.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
		table.firstChild.firstChild.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
		tbody.setAttribute('style', 'display:none;');
		table.setAttribute('style', 'width: 350px;');
		node.parentNode.insertBefore(table,node);
	}
}

start_script();
try
{
	initPopup();
	treateMonstre();
}
catch(e)
{
	window.alert(e);
}

displayScriptTime();
