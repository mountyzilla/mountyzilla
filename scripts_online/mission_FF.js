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

function treateMeneurMission() {
	var nodes = document.evaluate(
			"//tr/td/input[starts-with(@value,'Valider')]/../../td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	var node = nodes.snapshotItem(0);
	var enonce = node.childNodes[0].nodeValue;
	for(var i=1;i<node.childNodes.length;i++)
	{
		if(node.childNodes[i].nodeName == "#text")
			enonce += node.childNodes[i].nodeValue;
		else
			enonce += node.childNodes[i].childNodes[0].nodeValue;
	}
	if(enonce.indexOf("niveau égal à") != -1)
	{
		var nbr = 1;
		var niveau;
		if(node.childNodes[0].nodeValue.indexOf("niveau égal à") == -1)
		{
			nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
			niveau = trim(node.childNodes[3].childNodes[0].nodeValue);
		}
		else
		{
			niveau = trim(node.childNodes[1].childNodes[0].nodeValue);
		}
		var mundidey = (enonce.indexOf("Mundidey") != -1);
		MZ_setValue("MISSION_" + numTroll, "N$"+nbr+"$"+niveau+"$"+mundidey+"$"+enonce);
		return true;
	}
	else if(enonce.indexOf("de la race") != -1)
	{
		try
		{
			var nbr = 1;
			var type;
			if(node.childNodes[0].nodeValue.indexOf("de la race") == -1)
			{
				nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
				type = trim(node.childNodes[3].childNodes[0].nodeValue);
			}
			else
			{
				type = trim(node.childNodes[1].childNodes[0].nodeValue);
			}
			var mundidey = (enonce.indexOf("Mundidey") != -1);
			MZ_setValue("MISSION_" + numTroll, "R$"+nbr+"$"+type+"$"+mundidey+"$"+enonce);
		}
		catch(e) {window.alert(e)}
		return true;
	}
	else if(enonce.indexOf("de la famille des") != -1)
	{
		var nbr = 1;
		var famille;
		if(node.childNodes[0].nodeValue.indexOf("de la famille des") == -1)
		{
			nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
			famille = trim(node.childNodes[3].childNodes[0].nodeValue);
		}
		else
		{
			famille = trim(node.childNodes[1].childNodes[0].nodeValue);
		}
		var mundidey = (enonce.indexOf("Mundidey") != -1);
		MZ_setValue("MISSION_" + numTroll, "F$"+nbr+"$"+famille+"$"+mundidey+"$"+enonce);
		return true;
	}
	else if(enonce.indexOf("capacité spéciale") != -1)
	{
		var effet = epure(trim(node.childNodes[1].childNodes[0].nodeValue));
		MZ_setValue("MISSION_" + numTroll, "P$"+1+"$"+effet+"$"+false+"$"+enonce);
		return true;
	}
}

function treateEquipierMission() {
	var nodes = document.evaluate(
			"//tr/td/b[starts-with(text(),'Etape à valider')]/../../td[2]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	var node = nodes.snapshotItem(0);
	var enonce = node.childNodes[0].nodeValue;
	for(var i=1;i<node.childNodes.length;i++)
	{
		if(node.childNodes[i].nodeName == "#text")
			enonce += node.childNodes[i].nodeValue;
		else
			enonce += node.childNodes[i].childNodes[0].nodeValue;
	}
	if(enonce.indexOf("meneur")!=-1)
		return false;
	if(enonce.indexOf("niveau égal à") != -1)
	{
		var nbr = 1;
		var niveau;
		if(node.childNodes[0].nodeValue.indexOf("niveau égal à") == -1)
		{
			nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
			niveau = trim(node.childNodes[3].childNodes[0].nodeValue);
		}
		else
		{
			niveau = trim(node.childNodes[1].childNodes[0].nodeValue);
		}
		var mundidey = (enonce.indexOf("Mundidey") != -1);
		MZ_setValue("MISSION_" + numTroll, "N$"+nbr+"$"+niveau+"$"+mundidey+"$"+enonce);
		return true;
	}
	else if(enonce.indexOf("de la race") != -1)
	{
		var nbr = 1;
		var type;
		if(node.childNodes[0].nodeValue.indexOf("de la race") == -1)
		{
			nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
			type = trim(node.childNodes[3].childNodes[0].nodeValue);
		}
		else
		{
			type = trim(node.childNodes[1].childNodes[0].nodeValue);
		}
		var mundidey = (enonce.indexOf("Mundidey") != -1);
		MZ_setValue("MISSION_" + numTroll, "R$"+nbr+"$"+type+"$"+mundidey+"$"+enonce);
		return true;
	}
	else if(enonce.indexOf("de la famille des") != -1)
	{
		var nbr = 1;
		var famille;
		if(node.childNodes[0].nodeValue.indexOf("de la famille des") == -1)
		{
			nbr = 1*node.childNodes[1].childNodes[0].nodeValue;
			famille = trim(node.childNodes[3].childNodes[0].nodeValue);
		}
		else
		{
			famille = trim(node.childNodes[1].childNodes[0].nodeValue);
		}
		var mundidey = (enonce.indexOf("Mundidey") != -1);
		MZ_setValue("MISSION_" + numTroll, "F$"+nbr+"$"+famille+"$"+mundidey+"$"+enonce);
		return true;
	}
}

start_script(60);
MZ_removeValue("MISSION_" + numTroll);
if(!treateMeneurMission())
	treateEquipierMission();

displayScriptTime();
