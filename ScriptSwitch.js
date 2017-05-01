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
const MZ_URL_Tout_MZ_DEV = 'https://mz.mh.raistlin.fr/mzdev/js/Tout_MZ.user.js';
const MZ_URL_XPATH = 'https://mz.mh.raistlin.fr/mz/js/mz-xpath.js';
const MZ_URL_XPATH_DEV = 'https://mz.mh.raistlin.fr/mzdev/js/mz-xpath.js';

function MZ_add_script(url, defer) {
	var head = window.head;
	if (!head) head = document.getElementsByTagName('head')[0];	// IE ancien
	var script = document.createElement("script");
	script.src = url;
	if (defer) script.defer = true;
	head.appendChild(script);
}

function MZ_switch_scripts() {
	// faisabilite : charge uniquement Tout_MZ
	if (window.location.host.indexOf('dev') >= 0) {
		if (document.evaluate === undefined)
			MZ_add_script(MZ_URL_XPATH_DEV, true);
		MZ_add_script(MZ_URL_Tout_MZ_DEV, true);
	} else {
		if (document.evaluate === undefined)
			MZ_add_script(MZ_URL_XPATH, true);
		MZ_add_script(MZ_URL_Tout_MZ, true);
	}
}

MZ_switch_scripts();

} catch(e) {
	window.console.log('[MH Script switcher] catch general page ' + window.location.pathname + "\n" + e.message);
}
