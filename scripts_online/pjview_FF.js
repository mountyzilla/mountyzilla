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
/* 2013-08-19 : correction auto syntaxe alert */

/*********************************************************************************
* v1.1.1 by Dabihul - 2012-07-21                                                 *
* - màn de l'analyseur de profil                                                 *
* - correction des valeurs (MM/RM et qq erreurs)                                 *
* - ajout d'une 18e carac (poids max pour les anneaux... ok c'est moche)         *
* - gestion des items renforcés ou légers                                        *
* - résolution du problème lower/upper-case                                      *
* TODO                                                                           *
* - màn pour ZZ                                                                  *
*********************************************************************************/
/* 2013-08-19 : correction auto syntaxe alert */

var mh_caracs = new Array();
var mh_templates = new Array();

//liste du matos
//mh_caracs ['Nom'] = new Array('Type', 'AttP','AttM', 'DegP','DegM', 'Esq', 'ArmP','ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max', 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
mh_caracs["armure d'anneaux"] = new Array('armure',0,0,0,0,-8,8,0,0,0,90,180,0,0,0,0.00,80.00,80.00);
mh_caracs['armure de bois'] = new Array('armure',0,0,0,0,-3,5,0,0,0,20,50,0,0,0,0.00,50.00,50.00);
mh_caracs['armure de cuir'] = new Array('armure',0,0,0,0,0,2,0,0,0,10,20,0,0,0,0.00,10.00,10.00);
mh_caracs['armure de peaux'] = new Array('armure',0,0,0,0,-2,4,0,0,0,20,60,0,0,0,0.00,45.00,45.00);
mh_caracs['armure de pierre'] = new Array('armure',0,0,0,0,-6,12,0,0,0,60,150,0,0,0,0.00,120.00,120.00);
mh_caracs['armure de plates'] = new Array('armure',0,0,0,0,-5,10,0,0,0,50,100,0,0,0,0.00,100.00,100.00);
mh_caracs['bottes'] = new Array('bottes',0,0,0,0,2,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['bouclier à pointes'] = new Array('bouclier',1,0,1,0,-1,4,0,0,0,0,0,0,0,0,0.00,35.00,35.00);
mh_caracs['boulet et chaîne'] = new Array('arme',-3,0,5,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs['bâtons de parade'] = new Array('arme',-4,0,0,0,2,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs['cagoule'] = new Array('casque',0,0,0,0,1,0,0,-1,0,0,0,5,10,0,0.00,2.50,2.50);
mh_caracs['casque en cuir'] = new Array('casque',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,5.00,5.00);
mh_caracs['casque en métal'] = new Array('casque',0,0,0,0,0,2,0,-1,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs['casque à cornes'] = new Array('casque',0,0,1,0,-1,3,0,-1,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs['casque à pointes'] = new Array('casque',1,0,1,0,0,3,0,-1,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs['chaîne cloutée'] = new Array('arme',-2,0,4,0,1,0,0,0,0,0,0,0,0,0,0.00,35.00,35.00);
mh_caracs['collier de dents'] = new Array('talisman',0,0,1,0,0,0,0,0,0,0,0,0,0,0,5.00,1.00,1.00);
mh_caracs['collier de pierre'] = new Array('talisman',0,0,0,0,0,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50);
mh_caracs['collier à pointes'] = new Array('talisman',0,0,1,0,-1,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs['cotte de mailles'] = new Array('armure',0,0,0,0,-3,7,0,0,0,30,60,0,0,0,0.00,70.00,70.00);
mh_caracs["coutelas d'obsidienne"] = new Array('arme',2,0,2,0,0,0,0,0,-2,-10,-5,-30,-15,0,0.00,5.00,5.00);
mh_caracs['coutelas en os'] = new Array('arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,4.00,4.00);
mh_caracs['crochet'] = new Array('arme',-2,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs['cuir bouilli'] = new Array('armure',0,0,0,0,-1,3,0,0,0,20,40,0,0,0,0.00,18.00,18.00);
mh_caracs["cuirasse d'ossements"] = new Array('armure',0,0,0,0,-3,5,0,0,0,15,30,15,30,0,0.00,68.00,68.00);
mh_caracs["cuirasse d'écailles"] = new Array('armure',0,0,0,0,-3,6,0,0,0,30,70,0,0,0,0.00,60.00,60.00);
mh_caracs['culotte en cuir'] = new Array('armure',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs['dague'] = new Array('arme',0,0,1,0,0,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['epée courte'] = new Array('arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs['epée longue'] = new Array('arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs['espadon'] = new Array('arme',-6,0,8,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00);
mh_caracs['fouet'] = new Array('arme',4,0,-2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00);
mh_caracs['fourrures'] = new Array('armure',0,0,0,0,0,2,0,0,0,15,30,0,0,0,0.00,10.00,10.00);
mh_caracs['gantelet'] = new Array('arme',-2,0,1,0,1,2,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs['gorgeron en cuir'] = new Array('talisman',0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs['gorgeron en métal'] = new Array('talisman',0,0,0,0,0,2,0,0,-1,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['gourdin'] = new Array('arme',-1,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,12.50,12.50);
mh_caracs['gourdin clouté'] = new Array('arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs["gros'porte"] = new Array('bouclier',0,0,0,0,-1,5,0,0,0,10,20,0,0,0,0.00,50.00,50.00);
mh_caracs['grosse stalagmite'] = new Array('arme',-20,0,28,0,-15,0,0,-4,0,0,0,0,0,0,0.00,125.00,125.00);
mh_caracs['hache de bataille'] = new Array('arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,40.00,40.00);
mh_caracs['hache de guerre en os'] = new Array('arme',-4,0,6,0,0,0,0,0,0,0,0,0,0,0,0.00,25.00,25.00);
mh_caracs['hache de guerre en pierre'] = new Array('arme',-10,0,14,0,0,0,0,0,0,5,10,0,0,0,0.00,75.00,75.00);
mh_caracs["hache à deux mains d'obsidienne"] = new Array('arme',-8,0,16,0,0,0,0,0,-4,-90,-50,-30,-15,0,0.00,75.00,75.00);
mh_caracs['hallebarde'] = new Array('arme',-10,0,12,0,0,0,0,0,0,0,0,0,0,0,0.00,60.00,60.00);
mh_caracs["haubert d'écailles"] = new Array('armure',0,0,0,0,-4,8,0,0,0,40,80,0,0,0,0.00,80.00,80.00);
mh_caracs['haubert de mailles'] = new Array('armure',0,0,0,0,-4,9,0,0,0,40,90,0,0,0,0.00,90.00,90.00);
mh_caracs['heaume'] = new Array('casque',-1,0,0,0,0,4,0,-2,0,10,20,0,0,0,0.00,20.00,20.00);
mh_caracs['jambières en cuir'] = new Array('bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs['jambières en fourrure'] = new Array('bottes',0,0,0,0,0,1,0,0,0,5,10,0,0,0,0.00,2.50,2.50);
mh_caracs['jambières en maille'] = new Array('bottes',0,0,0,0,-1,3,0,0,0,5,10,0,0,0,0.00,20.00,20.00);
mh_caracs['jambières en métal'] = new Array('bottes',0,0,0,0,-2,4,0,0,0,5,10,0,0,0,0.00,25.00,25.00);
mh_caracs['jambières en os'] = new Array('bottes',0,0,0,0,-1,2,0,0,0,5,10,0,0,0,0.00,10.00,10.00);
mh_caracs["lame d'obsidienne"] = new Array('arme',2,0,6,0,0,0,0,0,-3,-60,-30,-20,-10,0,0.00,20.00,20.00);
mh_caracs['lame en os'] = new Array('arme',0,0,2,0,0,0,0,0,0,0,0,0,0,0,0.00,7.00,7.00);
mh_caracs['lame en pierre'] = new Array('arme',-2,0,4,0,0,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs['lorgnons'] = new Array('casque',0,0,0,0,-1,0,0,1,0,0,0,5,10,0,0.00,2.50,2.50);
mh_caracs['machette'] = new Array('arme',1,0,2,0,-1,0,0,0,0,0,0,0,0,0,0.00,20.00,20.00);
mh_caracs["masse d'arme"] = new Array('arme',-1,0,3,0,0,0,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs['pagne de mailles'] = new Array('armure',0,0,0,0,2,1,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs['pagne en cuir'] = new Array('armure',0,0,0,0,2,-1,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['rondache en bois'] = new Array('bouclier',0,0,0,0,1,1,0,0,0,0,0,0,0,0,0.00,15.00,15.00);
mh_caracs['rondache en métal'] = new Array('bouclier',0,0,0,0,1,2,0,0,0,0,0,0,0,0,0.00,30.00,30.00);
mh_caracs['sandales'] = new Array('bottes',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,2.50,2.50);
mh_caracs["talisman d'obsidienne"] = new Array('talisman',1,0,2,0,0,0,0,0,-4,20,40,20,40,0,0.00,2.50,2.50);
mh_caracs['talisman de pierre'] = new Array('talisman',0,0,0,0,0,0,0,0,-1,10,20,10,20,0,0.00,2.50,2.50);
mh_caracs['targe'] = new Array('bouclier',0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['torche'] = new Array('arme',1,0,1,0,0,0,0,1,0,0,0,0,0,0,0.00,5.00,5.00);
mh_caracs['torque de pierre'] = new Array('talisman',0,0,0,0,0,0,0,0,-2,20,40,20,40,0,0.00,2.50,2.50);
mh_caracs['tunique'] = new Array('armure',0,0,0,0,1,0,0,0,0,5,10,5,10,0,0.00,2.50,2.50);
mh_caracs["tunique d'écailles"] = new Array('armure',0,0,0,0,-1,3,0,0,0,15,30,0,0,0,0.00,30.00,30.00);
mh_caracs['turban'] = new Array('casque',0,0,0,0,0,0,0,0,0,10,20,0,0,0,0.00,2.50,2.50);
mh_caracs['baton lesté'] = new Array('arme',2,0,-1,0,0,0,0,0,0,0,0,0,0,0,0.00,7.50,7.50);
mh_caracs['grosse racine'] = new Array('arme',-1,0,3,0,0,0,0,0,0,5,10,0,0,0,0.00,20.00,20.00);
mh_caracs["couronne d'obsidienne"] = new Array('arme',0,0,0,-1,0,0,1,2,-1,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs['couronne de cristal'] = new Array('arme',0,0,0,1,-1,0,-1,3,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs['chapeau pointu'] = new Array('arme',0,0,0,0,0,1,0,0,0,0,0,5,10,0,0.00,5.00,5.00);
mh_caracs['souliers dorés'] = new Array('arme',0,0,0,0,-1,1,1,0,0,0,0,0,0,0,0.00,10.00,10.00);
mh_caracs['grimoire'] = new Array('arme',-2,2,-1,1,0,0,0,0,0,0,0,5,10,0,10.00,25.00,25.00);
mh_caracs['robe de mage'] = new Array('arme',0,0,0,0,-1,2,1,0,0,10,20,10,20,0,0.00,20.00,20.00);
mh_caracs['anneau de protection'] = new Array('anneau',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00,3.00,13.00);

//mh_templates['Nom'] = new Array( 'AttP', 'AttM', 'DegP', 'DegM', 'Esq', 'ArmP', 'ArmM', 'Vue', 'Reg', 'RM_Min', 'RM_Max', 'MM_Min', 'MM_Max', 'PV', 'DLA', 'Poids_Min', 'Poids_Max');
mh_templates['de Feu'] = new Array(0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['de Résistance'] = new Array(0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0);
mh_templates["de l'Aigle"] = new Array(0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0);
mh_templates['de la Salamandre'] = new Array(0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0);
mh_templates['des Cyclopes'] = new Array(0,1,0,1,0,0,0,-1,0,0,0,0,0,0,0,0,0);
mh_templates['des Enragés'] = new Array(0,1,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['des Tortues'] = new Array(0,0,0,0,0,0,2,0,0,0,0,0,0,0,30,0,0);
mh_templates['des Vampires'] = new Array(0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0);
mh_templates['du Glacier'] = new Array(0,1,0,0,0,0,1,0,0,5,5,0,0,0,0,0,0);
mh_templates['du Rat'] = new Array(0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['du Roc'] = new Array(0,0,0,0,-1,0,1,0,0,0,0,0,0,0,0,0,0);
mh_templates['du Temps'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,-30,0,0);
mh_templates['du Vent'] = new Array(0,0,0,-1,1,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['en Mithril'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['des Anciens'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['des Champions'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['des Duellistes'] = new Array(0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['de la Terre'] = new Array(0,0,0,0,0,0,0,0,2,0,0,0,0,5,30,0,0);
mh_templates["de l'Orage"] = new Array(0,0,0,-1,2,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates["de l'Ours"] = new Array(0,0,0,2,0,0,0,0,0,0,0,0,0,5,30,0,0);
mh_templates['des Béhémoths'] = new Array(0,0,0,0,0,0,3,0,0,0,0,0,0,0,30,0,0);
mh_templates['des Mages'] = new Array(0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0);
mh_templates['du Pic'] = new Array(0,0,0,0,-1,0,2,0,0,0,0,0,0,0,0,0,0);
mh_templates['du Sable'] = new Array(0,0,0,0,3,0,-1,-1,0,0,0,0,0,0,0,0,0);
mh_templates['léger'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['légère'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['renforcé'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['renforcée'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
mh_templates['robuste'] = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

function addArray(array1, array2) {
	var arrayResult = new Array();
//	if (Array1.length != Array2.length)
//		return -1;
	for ( i=array1.length ; --i >= 0 ; )
		arrayResult[i] = array1[i] + array2[i];
	return arrayResult;
	}

function getTemplates(tmpItem) {
	var b = true;
	var item = tmpItem;
	var ar = new Array();
	while (b) {
		b = false;
		for (var cle in mh_templates) {
			if (item.substr(item.length - cle.length, cle.length) != cle)
				continue;
			item = item.substr(0, item.length - cle.length - 1);
			ar.unshift(cle);
			if (item.substr(item.length - 3, 3) == ' et')
				item = item.substr(0, item.length - 3);
			b = true;
			}
		}
	ar.unshift(item);
	return ar;
	}

function addMithril(arrayCaracs, tmpTypeItem) {
	if (tmpTypeItem == 'arme') {
		if (arrayCaracs[0] < 0)
			arrayCaracs[0] = Math.ceil(arrayCaracs[0] / 2);
		}
	else {
		if (arrayCaracs[4] < 0) // Il y a *aussi* diminution dans le cas Esq = -1
			arrayCaracs[4] = Math.ceil(arrayCaracs[4] / 2);
		}
	arrayCaracs[15] = arrayCaracs[15] / 2;
	arrayCaracs[16] = arrayCaracs[16] / 2;
	return arrayCaracs;
	}

function addRenfort(arrayCaracs, typeTemplate) {
	// À appliquer APRÈS le mithril
	if (typeTemplate == 'léger' || typeTemplate == 'légère') {
		arrayCaracs[4]++;
		arrayCaracs[5]--;
		var coef = -1;
		}
	else {
		arrayCaracs[5]++;
		var coef = 1;
		}
	// Cette formule n'a rien d'officiel, gare !
	arrayCaracs[15] = arrayCaracs[15] + coef * Math.floor(arrayCaracs[15] * 0.1);
	arrayCaracs[16] = arrayCaracs[16] + coef * Math.floor(arrayCaracs[16] * 0.1);
	return arrayCaracs;
	}

function getCaracs(item) {
	var templates = getTemplates(item);
	var caracs = mh_caracs[templates[0]];
	if (!caracs)
		return new Array();

	var typeItem = caracs[0];
	caracs.shift();
	templates.shift();
	if (templates[templates.length - 1] == 'en Mithril') {
		caracs = addMithril(caracs, typeItem);
		templates.pop();
		}
	if (templates[0] == 'léger' || templates[0] == 'légère' || templates[0] == 'renforcé'
		|| templates[0] == 'renforcée' || templates[0] == 'robuste') {
		caracs = addRenfort(caracs,templates[0]);
		templates.shift();
		}
	for (var i = templates.length ; --i >= 0 ; )
		caracs = addArray(caracs, mh_templates[templates[i]]);
//	Comment ça marchait avant, il me semble qu'il faut toujours traiter le mithril avant ?
//	for (var i = 1; i < templates.length; i++)
//		caracs = templates[i] == 'en Mithril' ? addMithril(caracs, typeItem)
//				: addArray(caracs, mh_templates[templates[i]]);
	return caracs;
	}

function getLine(tab) {
	var str = '';
	if (tab[0] != 0 || tab[1] != 0) {
		str += '<b>Att : </b>' + aff(tab[0]);
		if (tab[1] != 0)
			str += '/' + aff(tab[1]);
		str += ' | ';
		}
	if (tab[4] != 0) {
		str += '<b>Esq : </b>' + aff(tab[4]);
		str += ' | ';
		}
	if (tab[2] != 0 || tab[3] != 0) {
		str += '<b>Deg : </b>' + aff(tab[2]);
		if (tab[3] != 0)
			str += '/' + aff(tab[3]);
		str += ' | ';
		}
	if (tab[8] != 0) {
		str += '<b>Reg : </b>' + aff(tab[8]);
		str += ' | ';
		}
	if (tab[7] != 0) {
		str += '<b>Vue : </b>' + aff(tab[7]);
		str += ' | ';
		}
	if (tab[5] != 0 || tab[6] != 0) {
		str += '<b>Arm : </b>' + aff(tab[5]);
		if (tab[6] != 0)
			str += '/' + aff(tab[6]);
		str += ' | ';
		}
	if (tab[9] != 0 || tab[10] != 0) {
		str += '<b>RM : </b>' + aff(tab[9]) + '%';
		if (tab[9] != tab[10])
			str += '/' + aff(tab[10]) + '%';
		str += ' | ';
		}
	if (tab[11] != 0 || tab[12] != 0) {
		str += '<b>MM : </b>' + aff(tab[11]) + '%';
		if (tab[11] != tab[12])
			str += '/' + aff(tab[12]) + '%';
		str += ' | ';
		}
	if (tab[13] != 0) {
		str += '<b>PV : </b>' + aff(tab[13]);
		str += ' | ';
		}
	if (tab[14] != 0) {
		str += '<b>DLA : </b>' + aff(tab[14]) + ' min';
		str += ' | ';
		}
	str += '<b>Poids : </b>' + tab[15] + ' min';
	if (tab[15] != tab[16])
		str += ' / ' + tab[16] + ' min';
	return str;
	}

function toolTipInit() {
	DivInfo = document.createElement('div');
	DivInfo.setAttribute('id', 'infosVue');
	DivInfo.setAttribute('class', 'mh_textbox');
	DivInfo.setAttribute('style', 'position: absolute; border: 1px solid #000000;'
		+ ' visibility: hidden; display: inline; zIndex: 99;');
	document.body.appendChild(DivInfo);
	document.addEventListener('mousemove', getXY, false);
	document.addEventListener('click', changeFreezeStatus, false);
	DivInfosStyle = DivInfo.style;
	}

function getXY(evt) {
	if (!freezed && DivInfosStyle.visibility == 'visible') {
		DivInfosStyle.left = evt.pageX + 'px';
		DivInfosStyle.top = evt.pageY + 10 + 'px';
		}
	}

function changeFreezeStatus() {
	if (DivInfosStyle.visibility == 'visible') {
		freezed = !freezed;
		if (!freezed)
			hideInfos();
		}
	}

function showInfos() {
	var currentInfos = this.getAttribute('infos');
	if (!freezed) {
		DivInfo.innerHTML = currentInfos;
		DivInfosStyle.visibility = 'visible';
		}
	}

function hideInfos() {
	if (!freezed)
		DivInfosStyle.visibility = 'hidden';
	}

function treateEquipement() {
	if (MZ_getValue('INFOCARAC') == 'false')
		return false;

	var faireligne = false;
	var caracs = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	var nodes = document.evaluate("//td/b[text() = 'Equipement Utilisé']/../../td[2]/img[contains(@src,bullet)]",
				document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength > 0) {
		for (var j=0 ; j<nodes.snapshotLength ; j++) {
			var node = nodes.snapshotItem(j);
			var next = node.nextSibling;
			var nnext = next.nextSibling;
			var nom = next.nodeValue.toLowerCase();
			if (nnext.childNodes.length == 1)
				nom += nnext.firstChild.nodeValue;
			nom = trim(nom);
			var c = String.fromCharCode(180); // winpostrophe
			while (nom.indexOf(c) != -1)
				nom = nom.replace(c, "'");

			var ar = getCaracs(nom);
			if (ar.length != 0) {
				faireligne=true;
				caracs = addArray(caracs, ar);
				var span = document.createElement('span');
				span.appendChild(next);
				span.appendChild(nnext);
				span.setAttribute('infos',getLine(ar));
				span.addEventListener('mouseover', showInfos,true);
				span.addEventListener('mouseout', hideInfos,true);
				insertBefore(node.nextSibling, span);
				}
			}

		if (faireligne) {
			var nodes = document.evaluate("//td/b[text() = 'Equipement Utilisé']",
						document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var node = nodes.snapshotItem(0);
			node.setAttribute('infos',getLine(caracs));
			node.addEventListener('mouseover', showInfos,true);
			node.addEventListener('mouseout', hideInfos,true);
			}
		}
	else {
		nodes = document.evaluate("//dd[@class = 'equipement']/ul/li",
					document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (nodes.snapshotLength > 0) {
			for (var j = 0; j < nodes.snapshotLength; j++) {
				var node = nodes.snapshotItem(j);
				var nom = node.firstChild.nodeValue.toLowerCase();
				if (node.childNodes.length > 1)
					nom += node.childNodes[1].firstChild.nodeValue;
				nom = trim(nom);
				var c = String.fromCharCode(180);
				while (nom.indexOf(c) != -1)
					nom = nom.replace(c, "'");
				var ar = getCaracs(nom);
				if (ar.length != 0) {
					caracs = addArray(caracs, ar);
					node.setAttribute('infos',getLine(ar));
					node.addEventListener('mouseover', showInfos,true);
					node.addEventListener('mouseout', hideInfos,true);
					}
				}
			var nodes = document.evaluate("//dt[@class = 'equipement']",
						document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var node = nodes.snapshotItem(0);
			node.setAttribute('infos',getLine(caracs));
			node.addEventListener('mouseover', showInfos,true);
			node.addEventListener('mouseout', hideInfos,true);
			}
		}
	}

var DivInfo;
var DivInfosStyle;
var freezed = false;

treateEquipement();
toolTipInit();
