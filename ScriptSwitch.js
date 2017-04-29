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

/////////////////////////////
// Eviter les lettres accentuees pour ne pas risquer de probleme de codage
/////////////////////////////

// script qui charge dynamiquement les autres scripts

try {
const MZ_URL_Tout_MZ = 'https://greasyfork.org/scripts/23602-tout-mz/code/Tout_MZ.user.js';

function MZ_add_script(url) {
	var head = window.head;
	if (!head) head = document.getElementsByTagName('head')[0];	// IE ancien
	var script = document.createElement("script");
	script.src = url;
	script.defer = true;
	head.appendChild(script);
}

function MZ_switch_scripts() {
	// faisabilite : charge uniquement Tout_MZ
	MZ_add_script(MZ_URL_Tout_MZ);
}

MZ_switch_scripts();

} catch(e) {
	window.console.log('[MH Script switcher] catch general page ' + window.location.pathname + "\n" + e.message);
}
