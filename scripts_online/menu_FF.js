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

// n'est lancé que sur refresh du volet de menu (activation ou [Refresh])

var menuRac, menuWidth, menuHeight;

function updateData() {
	var inputs = document.getElementsByTagName('input');
	var divs = document.getElementsByTagName('div');
	
	numTroll = inputs[0].value;
	MZ_setValue('NUM_TROLL', numTroll);
	MZ_setValue('NIV_TROLL',inputs[1].value);
	if(!MZ_getValue(numTroll+'.caracs.rm')) {
		MZ_setValue(numTroll+'.caracs.rm',0);
		// assure l'init des 4 var de libs
	}
	MZ_setValue(numTroll+'.caracs.mm',inputs[2].value);
	
	var DLA = new Date(
		StringToDate(divs[1].firstChild.nodeValue.slice(5))
	);
	if(MZ_getValue(numTroll+'.DLA.encours')) {
		var DLAstockee = new Date(
			StringToDate(MZ_getValue(numTroll+'.DLA.encours'))
		);
		if(DLA>DLAstockee) {
			MZ_setValue(numTroll+'.DLA.ancienne',DateToString(DLAstockee));
		}
	}
	MZ_setValue(numTroll+'.DLA.encours',DateToString(DLA));
	
	var listePos = divs[1].childNodes[2].nodeValue.split('=');
	MZ_setValue(numTroll+'.position.X',parseInt(listePos[1]));
	MZ_setValue(numTroll+'.position.Y',parseInt(listePos[2]));
	MZ_setValue(numTroll+'.position.N',parseInt(listePos[3]));
}

function initRaccourcis() {
	var anotherURL = MZ_getValue('URL1');
	if(!anotherURL) { return; }
	
	/* Création de l'icône faisant apparaître le menu */
	var iconeMZ = document.createElement('img');
	iconeMZ.src = 'http://weblocal/mountyzilla.tilk.info/scripts_0.9/images/mz_logo_small.png';
	iconeMZ.alt = 'MZ';
	iconeMZ.style = 'position:fixed; top:0px; left:0px';
	iconeMZ.onmouseover = afficheMenu;
	document.body.appendChild(iconeMZ);
	
	/* Création du menu des Raccourcis */
	menuRac = document.createElement('div');
	menuRac.className = 'mh_tdpage mh_tdborder';
	menuRac.style =
		'position:fixed; top:10px; left:10px;'+
		'max-width:190px;'+
	 	'border-radius: 4px; padding: 4px;'+
	 	'z-index: 500;'+
	 	'visibility:hidden;';
	document.body.appendChild(menuRac);
	document.addEventListener('mousemove',cacheMenu,false);
	var i=1;
	while(anotherURL) {
		var a = document.createElement('a');
		var url = MZ_getValue('URL'+i);
		var nom = MZ_getValue('URL'+i+'.nom');
		var ico = MZ_getValue('URL'+i+'.ico');
		a.href = url;
		a.target = '_blank';
		if(ico) {
			var txt = nom ? nom : '';
			var img = createImage(ico,txt);
			a.appendChild(img);
		}
		else {
			appendText(a,'['+nom+']');
		}
		menuRac.appendChild(a);
		appendBr(menuRac);
		i++;
		anotherURL = MZ_getValue('URL'+i);
	}
	menuWidth = menuRac.getBoundingClientRect().width;
	menuHeight = menuRac.getBoundingClientRect().height;
}

function afficheMenu() {
	menuRac.style.visibility = 'visible';
}

function cacheMenu(e) {
	var ptX = e.clientX;
	var ptY = e.clientY;
	if(menuRac.style.visibility=='visible'
		&& (ptX>24 || ptY>24)
		&& (ptX<10 || ptX>10+menuWidth || ptY<10 || ptY>10+menuHeight)) {
		menuRac.style.visibility = 'hidden';
	}
}

start_script(31);

updateData();
initRaccourcis();
