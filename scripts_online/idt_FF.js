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

var idtURL = "http://mh.byethost5.com/idt_serveur.php";

function getIdt() {
	if (MZ_getValue("SEND_IDT") == "non")
		return false;

	var nomIdt = document.evaluate(
			"//tr/td[contains(text()[1],'identification a donné le résultat suivant : ')]/../../tr[2]/td/b/text()",
			document, null, XPathResult.STRING_TYPE, null).stringValue;
	if (!nomIdt)
		return false;

	var caracIdt;
	if (nomIdt.indexOf("Malheureux !") != -1) {
		caracIdt = "";
		nomIdt = "Mission maudite";
	} else {
		caracIdt = nomIdt.slice(nomIdt.indexOf("(") + 1, nomIdt.indexOf(")"));
		nomIdt = nomIdt.slice(0, nomIdt.indexOf("(") - 1);
	}
	addScript(idtURL + "?item=" + URLencode(nomIdt) + "&descr=" + URLencode(caracIdt));
	return true;
}

start_script();

getIdt();
