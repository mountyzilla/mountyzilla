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


/*-[variables+function]- Données sur les trous de météorites -----------------*/

var petitsTrous = {
	'-52;57': true,
	'55;70': true,
	'64;70': true,
	'12;-15': true,
	'30;-52': true,
	'48;-39': true
};

var grosTrous = {
	'-35;65': true,
	'-13;73': true,
	'-64;9': true,
	'-35;15': true,
	'5;32': true,
	'10;64': true,
	'21;36': true,
	'46;52': true,
	'74;32': true,
	'-71;-7': true,
	'-67;-37': true,
	'-60;-32': true,
	'-51;-22': true,
	'-36;-51': true,
	'5;-49': true
};

var centreCarmine_X = 56.5;
var centreCarmine_Y = 23.5;
var rayonCarmine = 8.7;

function isTrou(x,y,n) {
	if(petitsTrous[x+';'+y]) {
		return n<0 && n>-60;
	}
	if(grosTrous[x+';'+y]
		|| grosTrous[x-1+';'+y]
		|| grosTrous[x+';'+y+1]
		|| grosTrous[x-1+';'+y+1]) {
		return n<0 && n>-70;
	}
	if(Math.sqrt(
			Math.pow(x-centreCarmine_X,2)+Math.pow(y-centreCarmine_Y,2)
		)<=rayonCarmine) {
		return n<0 && n>-100;
	}
	return false;
}

/*-[functions]----------------- Gestion des DEs ------------------------------*/

function validateDestination() {
	var x = Number(document.getElementsByName('ai_XDepart')[0].value);
	var y = Number(document.getElementsByName('ai_YDepart')[0].value);
	var n = Number(document.getElementsByName('ai_NDepart')[0].value);
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		for(var i=0 ; i<document.getElementsByName('ai_DeplX').length ; i++) {
			if(document.getElementsByName('ai_DeplX')[i].checked) {
				x += Number(document.getElementsByName('ai_DeplX')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplY').length ; i++)	{
			if(document.getElementsByName('ai_DeplY')[i].checked) {
				y += Number(document.getElementsByName('ai_DeplY')[i].value);
			}
		}
		for(var i=0 ; i<document.getElementsByName('ai_DeplN').length ; i++) {
			if(document.getElementsByName('ai_DeplN')[i].checked) {
				n += Number(document.getElementsByName('ai_DeplN')[i].value);
			}
		}
		if(isTrou(x,y,n)) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous allez tomber dans un trou de météorite.\n'
				+'Êtes vous sûr de vouloir effectuer ce déplacement ?'
			);
		}
	}
	return true;
}

function newsubmitDE(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateDestination()) {
		this.submit();
	}
}

function changeValidation() {
	var form = document.getElementsByName('ActionForm')[0];
	if(form) {
		form.addEventListener('submit', newsubmitDE, true);
	}
}


/*-[functions]----------------- Gestion des TPs ------------------------------*/

function validateTPDestination() {
	try {
		var text = document.getElementsByTagName('B')[0];
		var a = text.firstChild.nodeValue.split('|');
		var pos_x = a[0].substring(4, a[0].length - 1) * 1;
		var pos_y = a[1].substring(5, a[1].length - 1) * 1;
		var pos_n = a[2].substring(5, a[2].length) * 1;

		var nbtrous = 0;
		for(var signX=-1 ; signX<=1 ; signX+=2) {
			for(var x=0 ; x<=2 ; x++) {
				for(var signY=-1 ; signY<=1 ; signY+=2) {
					for(var y=0 ; y<=2 ; y++) {
						for(var signN = -1 ; signN <= 1 ; signN+=2) {
							for(var n = 0 ; n <= 1 ; n++) {
								if(isTrou(
										pos_x+signX*x,pos_y+signY*y,Math.min(-1,pos_n+signN*n)
									)) {
									nbtrous++;
								}
							}
						}
					}
				}
			}
		}
		if(nbtrous>0 && nbtrous<72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) résonne dans votre tête :\n'
				+'Vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite.\n'
				+'Êtes-vous sûr de vouloir prendre ce portail ?'
			);
		}
		else if(nbtrous>=72) {
			return window.confirm(
				'La voix de  mini TilK (n°36216) tonne dans votre tête :\n'
				+'Malheureux, vous avez '+Math.floor((100*nbtrous)/144)
				+'% de risque de tomber dans un trou de météorite !\n'
				+'Êtes-vous bien certain de vouloir prendre ce portail ?'
			);
		}
		return true;
	}
	catch(e) {
		window.alert(e)
	}
}

function newsubmitTP(event) {
	event.stopPropagation();
	event.preventDefault();
	if(validateTPDestination()) {
		this.submit();
	}
}

function changeButtonValidate() {
	var form = document.getElementsByName('Formulaire')[0];
	if(form) {
		if(!form.getAttribute('onsubmit')) {
			form.setAttribute('onsubmit','return true;');
		}
		form.addEventListener('submit', newsubmitTP, true);
	}
}


/*-[functions]---------------- Partie Principale -----------------------------*/

if(isPage('MH_Play/Actions/Play_a_Move.php')) {
	changeValidation();
}
else if(isPage('MH_Lieux/Lieu_Teleport.php')) {
	changeButtonValidate();
}
