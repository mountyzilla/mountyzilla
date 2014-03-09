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

/* v1.1.1 by Dabihul - 2012-07-21
 * - màn de l'analyseur de profil
 * - correction des valeurs (MM/RM et qq erreurs)
 * - ajout d'une 18e carac (poids max pour les anneaux... ok c'est moche)
 * - gestion des items renforcés ou légers
 * - résolution du problème lower/upper-case
 * v2.0a0 - 2014-04-09
 * - màj syntaxe en vue dépôt GitHub : BDD en json + multiples màj code
 TODO
 * - MZ2.0 : Implémenter les BDD en dur dans le module interne
 */


// liste du matos
// mh_caracs ['Nom'] = [ 'Type', 'AttP','AttM', 'DegP','DegM', 'Esq',
// 'ArmP','ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max' ];
var mh_caracs = {
	"armure d'anneaux":
		['armure',0,0,0,0,-8,8,0,0,0,90,180,0,0,0,0.00,80.00,80.00],
	'armure de bois':
		['armure',0,0,0,0,-3,5,0,0,0,20,50,0,0,0,0.00,50.00,50.00],
	'armure de cuir':
		['armure',0,0,0,0,0,2,0,0,0,10,20,0,0,0,0.00,10.00,10.00],
	'armure de peaux':
		['armure',0,0,0,0,-2,4,0,0,0,20,60,0,0,0,0.00,45.00,45.00],
	'armure de pierre':
		['armure',0,0,0,0,-6,12,0,0,0,60,150,0,0,0,0.00,120.00,120.00],
	'armure de plates':
		['armure',0,0,0,0,-5,10,0,0,0,50,100,0,0,0,0.00,100.00,100.00],
	'bottes':
		['bottes',0,0,0,0,2,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'bouclier à pointes':
		['bouclier',1,0,1,0,-1,4,0,0,0,0,0,0,0,0,0.00,35.00,35.00],
	'boulet et chaîne':
		['arme',-3,0,5,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'bâtons de parade':
		['arme',-4,0,0,0,2,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'cagoule':
		['casque',0,0,0,0,1,0,0,-1,0,0,0,5,10,0,0.00,2.50,2.50],
	'casque en cuir':
		['casque',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,5.00,5.00],
	'casque en métal':
		['casque',0,0,0,0,0,2,0,-1,0,5,10,0,0,0,0.00,10.00,10.00],
	'casque à cornes':
		['casque',0,0,1,0,-1,3,0,-1,0,5,10,0,0,0,0.00,10.00,10.00],
	'casque à pointes':
		['casque',1,0,1,0,0,3,0,-1,0,0,0,0,0,0,0.00,12.50,12.50],
	'chaîne cloutée':
		['arme',-2,0,4,0,1,0,0,0,0,0,0,0,0,0,0.00,35.00,35.00],
	'collier de dents':
		['talisman',0,0,1,0,0,0,0,0,0,0,0,0,0,0,5.00,1.00,1.00],
	'collier de pierre':
		['talisman',0,0,0,0,0,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50],
	'collier à pointes':
		['talisman',0,0,1,0,-1,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'cotte de mailles':
		['armure',0,0,0,0,-3,7,0,0,0,30,60,0,0,0,0.00,70.00,70.00],
	"coutelas d'obsidienne":
		['arme',2,0,2,0,0,0,0,0,-2,-10,-5,-30,-15,0,0.00,5.00,5.00],
	'coutelas en os':
		['arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,4.00,4.00],
	'crochet':
		['arme',-2,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50],
	'cuir bouilli':
		['armure',0,0,0,0,-1,3,0,0,0,20,40,0,0,0,0.00,18.00,18.00],
	"cuirasse d'ossements":
		['armure',0,0,0,0,-3,5,0,0,0,15,30,15,30,0,0.00,68.00,68.00],
	"cuirasse d'écailles":
		['armure',0,0,0,0,-3,6,0,0,0,30,70,0,0,0,0.00,60.00,60.00],
	'culotte en cuir':
		['armure',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'dague':
		['arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'epée courte':
		['arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,10.00,10.00],
	'epée longue':
		['arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	'espadon':
		['arme',-6,0,8,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00],
	'fouet':
		['arme',4,0,-2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00],
	'fourrures':
		['armure',0,0,0,0,0,2,0,0,0,15,30,0,0,0,0.00,10.00,10.00],
	'gantelet':
		['arme',-2,0,1,0,1,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'gorgeron en cuir':
		['talisman',0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	'gorgeron en métal':
		['talisman',0,0,0,0,0,2,0,0,-1,0,0,0,0,0,0.00,5.00,5.00],
	'gourdin':
		['arme',-1,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50],
	'gourdin clouté':
		['arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	"gros'porte":
		['bouclier',0,0,0,0,-1,5,0,0,0,10,20,0,0,0,0.00,50.00,50.00],
	'grosse stalagmite':
		['arme',-20,0,28,0,-15,0,0,-4,0,0,0,0,0,0,0.00,125.00,125.00],
	'hache de bataille':
		['arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00],
	'hache de guerre en os':
		['arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,25.00,25.00],
	'hache de guerre en pierre':
		['arme',-10,0,14,0,0,0,0,0,0,5,10,0,0,0,0.00,75.00,75.00],
	"hache à deux mains d'obsidienne":
		['arme',-8,0,16,0,0,0,0,0,-4,-90,-50,-30,-15,0,0.00,75.00,75.00],
	'hallebarde':
		['arme',-10,0,12,0,0,0,0,0,0,0,0,0,0,0,0.00,60.00,60.00],
	"haubert d'écailles":
		['armure',0,0,0,0,-4,8,0,0,0,40,80,0,0,0,0.00,80.00,80.00],
	'haubert de mailles':
		['armure',0,0,0,0,-4,9,0,0,0,40,90,0,0,0,0.00,90.00,90.00],
	'heaume':
		['casque',-1,0,0,0,0,4,0,-2,0,10,20,0,0,0,0.00,20.00,20.00],
	'jambières en cuir':
		['bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,10.00,10.00],
	'jambières en fourrure':
		['bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,2.50,2.50],
	'jambières en maille':
		['bottes',0,0,0,0,-1,3,0,0,0,5,10,0,0,0,0.00,20.00,20.00],
	'jambières en métal':
		['bottes',0,0,0,0,-2,4,0,0,0,5,10,0,0,0,0.00,25.00,25.00],
	'jambières en os':
		['bottes',0,0,0,0,-1,2,0,0,0,5,10,0,0,0,0.00,10.00,10.00],
	"lame d'obsidienne":
		['arme',2,0,6,0,0,0,0,0,-3,-60,-30,-20,-10,0,0.00,20.00,20.00],
	'lame en os':
		['arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00],
	'lame en pierre':
		['arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	'lorgnons':
		['casque',0,0,0,0,-1,0,0,1,0,0,0,5,10,0,0.00,2.50,2.50],
	'machette':
		['arme',1,0,2,0,-1,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00],
	"masse d'arme":
		['arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'pagne de mailles':
		['armure',0,0,0,0,2,1,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'pagne en cuir':
		['armure',0,0,0,0,2,-1,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'rondache en bois':
		['bouclier',0,0,0,0,1,1,0,0,0,0,0,0,0,0,0.00,15.00,15.00],
	'rondache en métal':
		['bouclier',0,0,0,0,1,2,0,0,0,0,0,0,0,0,0.00,30.00,30.00],
	'sandales':
		['bottes',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50],
	"talisman d'obsidienne":
		['talisman',1,0,2,0,0,0,0,0,-4,20,40,20,40,0,0.00,2.50,2.50],
	'talisman de pierre':
		['talisman',0,0,0,0,0,0,0,0,-1,10,20,10,20,0,0.00,2.50,2.50],
	'targe':
		['bouclier',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00],
	'torche':
		['arme',1,0,1,0,0,0,0,1,0,0,0,0,0,0,0.00,5.00,5.00],
	'torque de pierre':
		['talisman',0,0,0,0,0,0,0,0,-2,20,40,20,40,0,0.00,2.50,2.50],
	'tunique':
		['armure',0,0,0,0,1,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50],
	"tunique d'écailles":
		['armure',0,0,0,0,-1,3,0,0,0,15,30,0,0,0,0.00,30.00,30.00],
	'turban':
		['casque',0,0,0,0,0,0,0,0,0,10,20,0,0,0,0.00,2.50,2.50],
	'baton lesté':
		['arme',2,0,-1,0,0,0,0,0,0,0,0,0,0,0,0.00,7.50,7.50],
	'grosse racine':
		['arme',-1,0,3,0,0,0,0,0,0,5,10,0,0,0,0.00,20.00,20.00],
	"couronne d'obsidienne":
		['arme',0,0,0,-1,0,0,1,2,-1,0,0,0,0,0,0.00,10.00,10.00],
	'couronne de cristal':
		['arme',0,0,0,1,-1,0,-1,3,0,0,0,0,0,0,0.00,10.00,10.00],
	'chapeau pointu':
		['arme',0,0,0,0,0,1,0,0,0,0,0,5,10,0,0.00,5.00,5.00],
	'souliers dorés':
		['arme',0,0,0,0,-1,1,1,0,0,0,0,0,0,0,0.00,10.00,10.00],
	'grimoire':
		['arme',-2,2,-1,1,0,0,0,0,0,0,0,5,10,0,10.00,25.00,25.00],
	'robe de mage':
		['arme',0,0,0,0,-1,2,1,0,0,10,20,10,20,0,0.00,20.00,20.00],
	'anneau de protection':
		['anneau',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00,3.00,13.00]
	}

// mh_templates['Nom'] = [ 'AttP', 'AttM', 'DegP', 'DegM', 'Esq',
// 'ArmP', 'ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max',
// 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
var mh_templates = {
	'de Feu':
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de Résistance':
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
	"de l'Aigle":
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
	'de la Salamandre':
		[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'des Cyclopes':
		[0,1,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0],
	'des Enragés':
		[0,1,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Tortues':
		[0,0,0,0,0,0,2,0,0,0,0,0,0,0,30,0,0],
	'des Vampires':
		[0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
	'du Glacier':
		[0,1,0,0,0,0,1,0,0,5,5,0,0,0,0,0,0],
	'du Rat':
		[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'du Roc':
		[0,0,0,0,-1,0,1,0,0,0,0,0,0,0,0,0,0],
	'du Temps':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,0,0],
	'du Vent':
		[0,0,0,-1,1,0,0,0,0,0,0,0,0,0,0,0,0],
	'en Mithril':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Anciens':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Champions':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'des Duellistes':
		[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'de la Terre':
		[0,0,0,0,0,0,0,0,2,0,0,0,0,5,30,0,0],
	"de l'Orage":
		[0,0,0,-1,2,0,0,0,0,0,0,0,0,0,0,0,0],
	"de l'Ours":
		[0,0,0,2,0,0,0,0,0,0,0,0,0,5,30,0,0],
	'des Béhémoths':
		[0,0,0,0,0,0,3,0,0,0,0,0,0,0,30,0,0],
	'des Mages':
		[0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0],
	'du Pic':
		[0,0,0,0,-1,0,2,0,0,0,0,0,0,0,0,0,0],
	'du Sable':
		[0,0,0,0,3,0,-1,-1,0,0,0,0,0,0,0,0,0],
	'léger':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'légère':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'renforcé':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'renforcée':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	'robuste':
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	}

Array.prototype.clone = function() {
	// Clonage rapide
	return this.slice(0);
	}

function addArray(arr1,arr2) {
	// Somme matricielle
	var res = arr1.clone();
	for(i=res.length-1 ; i>=0 ; i--)
		res[i] += arr2[i];
	return res;
	}

function getTemplates(nomItem) {
	// Déstructure la nom de l'item en array [nom, template1, ...]
	var tempFound = true;
	var str = nomItem.trim();
	var arr = [];
	while(tempFound) {
		tempFound = false;
		for(var temp in mh_templates) {
			if(str.slice(-temp.length)!=temp) continue;
			tempFound = true;
			str = str.slice(0,-temp.length-1);
			arr.unshift(temp);
			if(str.slice(-3)==' et')
				str = str.slice(0,-3);
			}
		}
	arr.unshift(str);
	return arr;
	}

function addMithril(arrayCaracs,typeItem) {
	// Ajoute l'effet du Mithril sur les caracs
	if(typeItem=='arme') {
		if(arrayCaracs[0]<0)
			arrayCaracs[0] = Math.ceil(arrayCaracs[0]/2);
		}
	else {
		if(arrayCaracs[4]<0)
			arrayCaracs[4] = Math.ceil(arrayCaracs[4]/2);
		}
	arrayCaracs[15] /= 2;
	arrayCaracs[16] /= 2;
	return arrayCaracs;
	}

function addRenfort(arrayCaracs,template) {
	// Ajoute l'effet des pseudo-templates sur les caracs
	// S'applique APRÈS le mithril
	// WARNING - Cette formule n'a rien d'officiel, gare !
	if(template=='léger' || template=='légère') {
		arrayCaracs[4]++;
		arrayCaracs[5]--;
		var coef = -1;
		}
	else {
		arrayCaracs[5]++;
		var coef = 1;
		}
	arrayCaracs[15] = arrayCaracs[15]+coef*Math.floor(arrayCaracs[15]/10);
	arrayCaracs[16] = arrayCaracs[16]+coef*Math.floor(arrayCaracs[16]/10);
	return arrayCaracs;
	}

function getCaracs(item) {
	// Calcule les caractéristiques de l'item
	var templates = getTemplates(item);
	var caracs = mh_caracs[templates[0]];
	if(!caracs) return [];
	
	var typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if(templates[templates.length-1]=='en Mithril') {
		caracs = addMithril(caracs,typeItem);
		templates.pop();
		}
	if(templates[0]=='léger' || templates[0]=='légère' ||
		templates[0]=='renforcé' || templates[0]=='renforcée' ||
		templates[0]=='robuste') {
		caracs = addRenfort(caracs,templates[0]);
		templates.shift();
		}
	for(var i=templates.length-1 ; i>=0 ; i--)
		caracs = addArray(caracs,mh_templates[templates[i]]);
	return caracs;
	}

function getLine(tab) {
	// Préparation de la ligne à afficher lors d'un mouseover
	var str = '';
	if(tab[0]!=0 || tab[1]!=0) {
		str += '<b>Att : </b>'+aff(tab[0]);
		if(tab[1]!=0) str += '/'+aff(tab[1]);
		str += ' | ';
		}
	if(tab[4]!=0) {
		str += '<b>Esq : </b>'+aff(tab[4])+' | ';
		}
	if(tab[2]!=0 || tab[3]!=0) {
		str += '<b>Deg : </b>'+aff(tab[2]);
		if(tab[3]!=0) str += '/'+aff(tab[3]);
		str += ' | ';
		}
	if(tab[8]!=0) {
		str += '<b>Reg : </b>'+aff(tab[8])+' | ';
		}
	if(tab[7]!=0) {
		str += '<b>Vue : </b>'+aff(tab[7])+' | ';
		}
	if(tab[5]!=0 || tab[6]!=0) {
		str += '<b>Arm : </b>'+aff(tab[5]);
		if(tab[6]!=0) str += '/'+aff(tab[6]);
		str += ' | ';
		}
	if(tab[9]!=0 || tab[10]!=0) {
		str += '<b>RM : </b>'+aff(tab[9])+'%';
		if(tab[9]!=tab[10]) str += '/'+aff(tab[10])+'%';
		str += ' | ';
		}
	if(tab[11]!=0 || tab[12]!=0) {
		str += '<b>MM : </b>'+aff(tab[11])+'%';
		if(tab[11]!=tab[12]) str += '/'+aff(tab[12])+'%';
		str += ' | ';
		}
	if(tab[13]!=0) {
		str += '<b>PV : </b>'+aff(tab[13])+' | ';
		}
	if(tab[14]!=0) {
		str += '<b>DLA : </b>'+aff(tab[14])+' min | ';
		}
	str += '<b>Poids : </b>'+tab[15]+' min';
	if(tab[15]!=tab[16]) str += ' / '+tab[16]+' min';
	return str;
	}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.id = 'infosVue';
	DivInfo.className = 'mh_textbox';
	DivInfo.style =
		'position: absolute;'
		+'border: 1px solid #000000;'
		+'visibility:hidden;'
		+'display:inline;'
		+'z-index:99;';
	document.body.appendChild(DivInfo);
	document.onmousemove = getXY;
	document.onclick = changeFreezeStatus;
	DivInfosStyle = DivInfo.style;
	}

function getXY(evt) {
	if(!freezed && DivInfosStyle.visibility=='visible') {
		DivInfosStyle.left = evt.pageX+'px';
		DivInfosStyle.top = evt.pageY+10+'px';
		}
	}

function changeFreezeStatus() {
	if(DivInfosStyle.visibility=='visible') {
		if(freezed) hideInfos();
		freezed = !freezed;
		}
	}

function showInfos() {
	var currentInfos = this.infos;
	if(!freezed) {
		DivInfo.innerHTML = currentInfos;
		DivInfosStyle.visibility = 'visible';
		}
	}

function hideInfos() {
	if(!freezed) DivInfosStyle.visibility = 'hidden';
	}

function treateEquipement() {
	// Extrait les données du matos et réinjecte les infos déduites
	if(MZ_getValue('INFOCARAC')=='false') return;
	
	var faireLigne = false;
	var caracs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var nodes = document.evaluate(
		"//td/b[text()='Equipement Utilisé']/../../"
		+"td[2]/img[contains(@src,bullet)]",
		document, null, 7, null);
	if(nodes.snapshotLength>0) {
		// Si CSS de base
		for(var i=0 ; i<nodes.snapshotLength ; i++) {
			var node = nodes.snapshotItem(i);
			var next = node.nextSibling;
			var nnext = next.nextSibling;
			var nom = next.nodeValue.toLowerCase();
			if(nnext.childNodes.length==1)
				nom += nnext.firstChild.nodeValue;
			nom = nom.trim();
			// gestion winpostrophe
			var c = String.fromCharCode(180);
			while(nom.indexOf(c)!=-1)
				nom = nom.replace(c,"'");
			var arr = getCaracs(nom);
			if(arr.length>0) {
				faireLigne = true;
				caracs = addArray(caracs,arr);
				var span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.infos = getLine(arr);
				span.onmouseover = showInfos;
				span.onmouseout = hideInfos;
				insertBefore(node.nextSibling,span);
				}
			}
		
		if(faireLigne) {
			var node = document.evaluate("//td/b[text()='Equipement Utilisé']",
				document, null, 9, null).singleNodeValue;
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
			}
		}
	else {
		// Si CSS avancée
		nodes = document.evaluate("//dd[@class='equipement']/ul/li",
			document, null, 7, null);
		if(nodes.snapshotLength>0) {
			for(var i=0 ; i<nodes.snapshotLength ; i++) {
				var node = nodes.snapshotItem(i);
				var nom = node.firstChild.nodeValue.toLowerCase();
				if(node.childNodes.length>1)
					nom += node.childNodes[1].firstChild.nodeValue;
				nom = nom.trim();
				// gestion winpostrophe
				var c = String.fromCharCode(180);
				while(nom.indexOf(c)!=-1)
					nom = nom.replace(c,"'");
				var arr = getCaracs(nom);
				if(arr.length!=0) {
					caracs = addArray(caracs,arr);
					node.infos = getLine(arr);
					node.onmouseover = showInfos;
					node.onmouseout = hideInfos;
					}
				}
			var nodes = document.evaluate("//dt[@class='equipement']",
				document, null, 7, null);
			var node = nodes.snapshotItem(0);
			node.infos = getLine(caracs);
			node.onmouseover = showInfos;
			node.onmouseout = hideInfos;
			}
		}
	}

var DivInfo;
var DivInfosStyle;
var freezed = false;

treateEquipement();
toolTipInit();
