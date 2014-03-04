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

/* v0.2 by Dab - 2013-08-19
 * - gestion autoCdM
 * - patch dégueu pour gérer la décomposition P/M de l'armure
 */

var pageDispatcher = "http://mountypedia.free.fr/mz/cdmdispatcher.php";
//var pageDispatcher = "http://m2m-bugreport.dyndns.org/scripts/dev/cdmdispatcher.php";
//var pageCdmRecord = "http://nocmh.free.fr/scripts/cdmCollecteur.php";
var cdm = '';

function getNNInt(str) {
	var nbrs = str.match(/\d+/g);
	for (var i=0 ; i<nbrs.length ; i++)
		nbrs[i] = parseInt(nbrs[i]);
	return nbrs;
	}

function traiteCdM() {
	var form = document.getElementsByTagName('form')[0];

	// Teste si ce message du bot est un message de CdM
	if (!document.evaluate("./p/b/text()[contains(.,'fait partie')]", form, null, 9, null).singleNodeValue)
		return;
	
	cdm = document.evaluate("./p/b/text()[contains(.,'fait partie')]", form,
							null, 9, null).singleNodeValue.nodeValue + '\n';
	var tbody = document.evaluate("descendant::table/tbody", form,
								null, 9, null).singleNodeValue;
	var intits = document.evaluate("descendant::td[@width='25%']/descendant::b/text()", tbody,
								null, 7, null);
	var vals = document.evaluate("descendant::td[@width='79%']/descendant::b/text()", tbody,
								null, 7, null);
	var i=0;
	while (i<intits.snapshotLength) {
		if (intits.snapshotItem(i).nodeValue.indexOf('Armure Physique')!=-1) {
			cdm += 'Armure : ';
			var armp = getNNInt(vals.snapshotItem(i).nodeValue);
			var armm = getNNInt(vals.snapshotItem(i+1).nodeValue);
			if (vals.snapshotItem(i).nodeValue.indexOf('(inf')!=-1)
				armp = [0,armp[0]];
			if (vals.snapshotItem(i+1).nodeValue.indexOf('(inf')!=-1)
				armm = [0,armm[0]];
			if (vals.snapshotItem(i).nodeValue.indexOf('(sup')!=-1 ||
				vals.snapshotItem(i+1).nodeValue.indexOf('(sup')!=-1)
				cdm += 'adj (supérieur à '+(armp[0]+armm[0]);
			else
				cdm += 'adj (entre '+(armp[0]+armm[0])+' et '+(armp[1]+armm[1]);
			cdm += ')\n';
			i++;
			}
		else
			cdm += intits.snapshotItem(i).nodeValue+' '+vals.snapshotItem(i).nodeValue+'\n';
		i++;
		}
	
	// Envoi auto ou insertion bouton envoi (suivant option)
	if (MZ_getValue(numTroll+'.AUTOCDM')=='true') {
		sendInfoCDM();
		var p = document.createElement('p');
		p.setAttribute('style','color:green;');
		appendText(p,'CdM envoyée vers la base MountyZilla !');
		insertBefore(document.getElementsByName('as_Action')[0].parentNode,p);
		}
	else
		var button = insertButtonCdm('as_Action', sendInfoCDM);

	// Insertion de l'estimation des PV restants
	var pv = vals.snapshotItem(1).nodeValue;
	if (pv.indexOf("entre") == -1)
		return;
	pv = getPVsRestants(pv,vals.snapshotItem(2).nodeValue);
	if (pv) {
		var tr = insertTr(intits.snapshotItem(3).parentNode.parentNode.parentNode);
		appendTdText(tr, pv[0], true);
		appendTdText(tr, pv[1], true);
		}
	}

function sendInfoCDM() {
	MZ_setValue('CDMID', 1+parseInt(MZ_getValue('CDMID')) );
	var buttonCDM = this;
	var texte = '';
	MZ_xmlhttpRequest({
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

start_script(31);
traiteCdM();
