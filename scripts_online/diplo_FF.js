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

/* 2013-10-03 - correction des alert / window.alert */

var getDiploURL = "http://mountyzilla.tilk.info/scripts_0.9/getDiplo_FF.php";

function addButtonDiplo() {
	var td = document.evaluate("//td[@align='center' and @colspan='2']",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	appendText(td, '\t');
	appendButton(td, 'Envoyer votre Diplomatie', sendDiplo);
}

function sendDiplo() {
	var param = "";
	var nodes = document.evaluate(
			"//table[@class = 'mh_tdborder']/tbody/tr[position()<7]/descendant::tr[@class = 'mh_tdpage' and td[2]/text() = 'Troll']/td[1]/text()", 
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var texte = node.nodeValue;
		texte = texte.substring(texte.lastIndexOf('(') + 1, texte.lastIndexOf(')'));
		if (texte * 1 == 0)
			param += "nta[]=" + encodeURI(node.nodeValue) + "&";
		else
			param += "ta[]=" + texte + '&';
	}
	nodes = document.evaluate(
			"//table[@class = 'mh_tdborder']/tbody/tr[position()<7]/descendant::tr[@class = 'mh_tdpage' and td[2]/text() = 'Guilde']/td[1]/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var texte = nodes.snapshotItem(i).nodeValue;
		texte = texte.substring(texte.lastIndexOf('(') + 1, texte.lastIndexOf(')'));
		param += "ga[]=" + texte + '&';
	}
	nodes = document.evaluate(
			"//table[@class = 'mh_tdborder']/tbody/tr[position()>7]/descendant::tr[@class = 'mh_tdpage' and td[2]/text() = 'Guilde']/td[1]/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var texte = nodes.snapshotItem(i).nodeValue;
		texte = texte.substring(texte.lastIndexOf('(') + 1, texte.lastIndexOf(')'));
		param += "ge[]=" + texte + '&';
	}
	nodes = document.evaluate(
			"//table[@class = 'mh_tdborder']/tbody/tr[position()>7]/descendant::tr[@class = 'mh_tdpage' and td[2]/text() = 'Troll']/td[1]/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < nodes.snapshotLength; i++) {
		var node = nodes.snapshotItem(i);
		var texte = node.nodeValue;
		texte = texte.substring(texte.lastIndexOf('(') + 1, texte.lastIndexOf(')'));
		if (texte * 1 == 0)
			param += "nte[]=" + encodeURI(node.nodeValue) + "&";
		else
			param += "te[]=" + texte + '&';
	}
	if (param != "")
		FF_XMLHttpRequest({
			method: 'GET',
			url: getDiploURL + '?num=' + numTroll + '&' + param,
			headers : {
				'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				'Accept': 'application/atom+xml,application/xml,text/xml'
			},
			onload: function(responseDetails) {
				var texte = responseDetails.responseText;
				if(texte.indexOf("alert")!=-1)
				{
					window.alert(texte.substring(texte.indexOf("alert('")+7,texte.indexOf("')")));
				}
			}
		});
}

start_script();
try
{
	addButtonDiplo();
}
catch(e)
{
	window.alert(e);
}

displayScriptTime();
