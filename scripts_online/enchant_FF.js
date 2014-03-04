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

function treateEnchantement() {
	var idEnchanteur = MZ_getValue(numTroll+".enchantement.lastEnchanteur");
	var infoEquipement = MZ_getValue(numTroll+".enchantement.lastEquipement");
	if(!idEnchanteur || idEnchanteur=="" || !infoEquipement || infoEquipement=="")
		return;
	var tab = infoEquipement.split(";");
	if(tab.length<2)
		return;
	var idEquipement = tab[0];
	var nomEquipement = tab[1];
	for(var i=2;i<tab.length;i++)
		nomEquipement += ";"+tab[i];
	
	var nodes = document.evaluate(
			"//p/img[@src='../Images/greenball.gif']/following-sibling::text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength != 3)
		return;
	for(var i=0;i<3;i++)
	{
		var texte = trim(nodes.snapshotItem(i).nodeValue);
		texte = texte.replace(" d'une "," d'un ");
		var compo = texte.substring(0,texte.indexOf(" d'un "));
		var monstre = texte.substring(texte.indexOf(" d'un ")+6,texte.indexOf(" d'au minimum"));
		monstre = monstre.replace(/ Géante?/,"");
		var qualite = texte.substring(texte.indexOf("Qualité ")+8,texte.indexOf(" ["));
		var localisation = texte.substring(texte.indexOf("[")+1,texte.indexOf("]"));
		//alert(compo+" ["+localisation+"] "+monstre+" "+qualite);
		MZ_setValue(numTroll+".enchantement."+idEquipement+".composant."+i,compo+";"+localisation+";"+monstre.replace(/ Géante?/,"")+";"+qualite+";"+trim(nodes.snapshotItem(i).nodeValue));
	}
	MZ_setValue(numTroll+".enchantement."+idEquipement+".enchanteur",idEnchanteur+";"+MZ_getValue(numTroll+".position.X")+";"+MZ_getValue(numTroll+".position.Y")+";"+MZ_getValue(numTroll+".position.N"));
	MZ_setValue(numTroll+".enchantement."+idEquipement+".objet",nomEquipement);
	var liste = MZ_getValue(numTroll+".enchantement.liste");
	if(!liste || liste=="")
	{
		MZ_setValue(numTroll+".enchantement.liste",idEquipement);
	}
	else
		MZ_setValue(numTroll+".enchantement.liste",liste+";"+idEquipement);
}


start_script(60);

treateEnchantement();
MZ_removeValue(numTroll+".enchantement.lastEquipement");
MZ_removeValue(numTroll+".enchantement.lastEnchanteur");
displayScriptTime();
