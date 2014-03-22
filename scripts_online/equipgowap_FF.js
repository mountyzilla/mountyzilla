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

var popup;

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
		if(MZ_getValue("NOINFOEM") != "true")
			insertEMInfos(tbody);
		if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
			insertEnchantInfos(tbody);
	}
}

function treateChampi() {
	if(MZ_getValue("NOINFOEM") == "true")
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

start_script();

treateGowaps();
treateChampi();
if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
{
	initPopup();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}

displayScriptTime();
