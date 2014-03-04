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

var pageDispatcher = "http://mountypedia.free.fr/mz/cdmdispatcher.php";
//var pageDispatcher = "http://m2m-bugreport.dyndns.org/scripts/dev/cdmdispatcher.php";
var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var cdm = "";

function traiteCdM() {
	var form = document.evaluate("//form[@name = 'ActionForm']",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

	// Teste si ce message du bot est un message de CdM
	if (!document.evaluate("b/b/text()[contains(.,'RÉUSSI')]",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
		return;
		
	cdm = document.evaluate("p/b/text()[contains(.,'Le Monstre Ciblé fait partie des')]",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue + "\n";
	var tbody = document.evaluate("descendant::table/tbody",
			form, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var intits = document.evaluate("descendant::td[@width = '25%']/descendant::b/text()",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var vals = document.evaluate("descendant::td[@width = '79%']/descendant::b/text()",
			tbody, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var i = 0; i < intits.snapshotLength; i++)
		cdm += intits.snapshotItem(i).nodeValue + " " + vals.snapshotItem(i).nodeValue + "\n";

	// On insère le bouton et un espace
	var button = insertButtonCdm('as_Action',sendInfoCDM);

	// pour mettre une estimation des PV restants
	var pv = vals.snapshotItem(1).nodeValue;
	if (pv.indexOf("entre") == -1)
		return;
	pv = getPVsRestants(pv, vals.snapshotItem(2).nodeValue);
	if (pv) {
		var blessure = document.evaluate("descendant::td[@width = '25%']/b/text()[contains(.,'Blessure')]/../../..",
				tbody, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		var tr = insertTr(blessure.nextSibling);
		appendTdText(tr, pv[0], true);
		appendTdText(tr, pv[1], true);
	}
}

function sendInfoCDM()
{
	MZ_setValue('CDMID',1 + (MZ_getValue('CDMID') * 1));
	var buttonCDM = this;
	//window.open(pageCdmRecord + "?cdm=" + escape(cdm) + "&source=mountyzilla/script_teubreu&forwardTo=" + pageDispatcher
	//		, 'popupCdm', 'width=400, height=240, toolbar=no, status=no, location=no, resizable=yes');
	MZ_xmlhttpRequest({
				method: 'GET',
				url: pageDispatcher+"?cdm="+escape(cdm),
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

start_script(31);

traiteCdM();
