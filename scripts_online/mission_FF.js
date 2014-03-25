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

/* v0.1a by Dab - 2013-08-20
 * - révision complète du script
 * NB : il n'est plus possible de différencier meneur et équipier par la validation d'étape
 * TODO
 * À remettre totalement à jour avec la réforme des missions
 */

function treateMission() {
	var node = document.evaluate(
					"//form/table/tbody/tr/td/input[starts-with(@value,'Valider')]/../../td[2]",
					document, null, 9, null).singleNodeValue;
	if (!node) return false;
	
	var enonce = node.textContent;
	var mundidey = (enonce.indexOf('Mundidey')!=-1);
	if (enonce.indexOf('niveau égal à')!=-1) {
		var nbr = 1;
		var niveau, mod;
		if (node.firstChild.nodeValue.indexOf('niveau égal à')==-1) {
			nbr = trim(node.childNodes[1].firstChild.nodeValue);
			niveau = trim(node.childNodes[3].firstChild.nodeValue);
			mod = node.childNodes[4].nodeValue.match(/\d+/);
			mod = mod ? mod : 'plus';
			}
		else {
			niveau = trim(node.childNodes[1].firstChild.nodeValue);
			mod = node.childNodes[2].nodeValue.match(/\d+/);
			mod = mod ? mod : 'plus';
			}
		MZ_setValue(numTroll+'.MISSION', 'N$'+nbr+'$'+niveau+'$'+mod+'$'+mundidey+'$'+enonce);
		return true;
		}
	else if(enonce.indexOf('de la race')!=-1) {
		var nbr = 1;
		var race;
		if (node.firstChild.nodeValue.indexOf('de la race')==-1) {
			nbr = trim(node.childNodes[1].firstChild.nodeValue);
			race = trim(node.childNodes[3].firstChild.nodeValue);
			}
		else
			race = trim(node.childNodes[1].firstChild.nodeValue);
		MZ_setValue(numTroll+'.MISSION', 'R$'+nbr+'$'+race+'$'+mundidey+'$'+enonce);
		return true;
		}
	else if(enonce.indexOf('de la famille des')!=-1) {
		var nbr = 1;
		var famille;
		if (node.firstChild.nodeValue.indexOf('de la famille des')==-1) {
			nbr = trim(node.childNodes[1].firstChild.nodeValue);
			famille = trim(node.childNodes[3].firstChild.nodeValue);
			}
		else
			famille = trim(node.childNodes[1].firstChild.nodeValue);
		MZ_setValue(numTroll+'.MISSION', 'F$'+nbr+'$'+famille+'$'+mundidey+'$'+enonce);
		return true;
		}
	else if(enonce.indexOf('capacité spéciale')!=-1) {
		var effet = epure(trim(node.childNodes[1].firstChild.nodeValue));
		MZ_setValue(numTroll+'.MISSION', 'E$'+effet+'$'+enonce);
		return true;
		}
	}

start_script(60);

MZ_removeValue(numTroll+'.MISSION');
treateMission();

displayScriptTime();
