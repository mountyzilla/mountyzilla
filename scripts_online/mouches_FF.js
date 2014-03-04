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

function positive(i)
{
	if(i>=0)
		return "+"+i;
	return i;
}

function treateMouches() {
try
{
	var mouches = document.evaluate("//tr[@class='mh_tdpage']/td/img[@alt='Là']/../../td[2]/text()[contains(.,'(')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	listePouvoirs = new Array();
	for(var i=0;i<mouches.snapshotLength;i++)
	{
		var texte = mouches.snapshotItem(i).nodeValue;
		if(texte.indexOf(":")==-1)
			continue;
		var bonus = trim(texte.substring(texte.indexOf("(")+1,texte.indexOf(":")));
		var valeur = parseInt(texte.substring(texte.indexOf(":")+1,texte.indexOf(")")));
		if(listePouvoirs[bonus] == null)
			listePouvoirs[bonus] = valeur;
		else
			listePouvoirs[bonus] += valeur;
	}
	var nombreMouches = document.evaluate("//tr[@class='mh_tdpage']/td[4]/text()[contains(.,'jours')]/../../td[2]/text()[contains(.,'(')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
	var tbody = document.evaluate("//form[@name='ActionForm']/table[@class='mh_tdborder']/tbody[1]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var tr = appendTr(tbody,"mh_tdtitre");
	var td = appendTdText(tr,"Total",1);
	td = appendTdText(tr,mouches.snapshotLength+" mouches présentes sur "+nombreMouches+"",1);
	td.setAttribute('colspan', 4);
	var text="";
	for (key in listePouvoirs)
	{
		if(text.length!=0)
			text+=" | ";
		text+=key+" : "+positive(listePouvoirs[key]);
		if(key=="TOUR")
			text+=" min";
		if(key=="RM" || key=="MM")
			text+="%";
	}
	appendText(td," ( "+text+" )");
}
catch(e) {alert(e)}
}

start_script();

treateMouches();

displayScriptTime();
