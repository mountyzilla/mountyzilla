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

var listeCDM = new Array();
var idMonstre=-1;
var nomMonstre="";
var tbody;

function treateMission() {
	if(!MZ_getValue("MISSION_"+numTroll) || MZ_getValue("MISSION_"+numTroll)=="")
		return false;
	var nodes = document.evaluate(
			"//tr/td[position() = 2 and text() = 'MORT']/../td[3]/b[2]/a[@class='mh_monstres']/..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	var str = "";
	for(var i=0;i<nodes.snapshotLength;i++)
	{
		var node = nodes.snapshotItem(i);
		var idMonstre = node.nextSibling.nodeValue;
		var nomMonstre = node.childNodes[0].childNodes[0].nodeValue;
		idMonstre = idMonstre.substring(idMonstre.indexOf("(")+1,idMonstre.indexOf(")"))*1;
		nomMonstre = trim(nomMonstre.substring(nomMonstre.indexOf(" ")+1));
		str += 'nom[]=' + escape(nomMonstre) + '$'+idMonstre+'&';
		if (i % 50 == 49 || i == nodes.snapshotLength - 1) 
		{
			MZ_xmlhttpRequest({
				method: 'GET',
				url: 'http://mountypedia.free.fr/mz/monstres_0.9_FF.php?begin='+Math.floor(i/50)+'&idcdm=' + MZ_getValue('CDMID') + '&' + str,
				headers : {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				onload: function(responseDetails) {
					try
					{
						var texte = responseDetails.responseText;
						var lines = texte.split("\n");
						var begin,end;
						if(lines.length==0)
							return;
						for(var j=0;j<lines.length;j++)
						{
							var infos = lines[j].split(";");
							if(infos.length<4)
								continue;
							var index = infos[2];
							if(begin==null)
								begin=index;
							end=index;
							var idMonstre=infos[0];
							infos=infos.slice(3);
							listeCDM[idMonstre] = infos;
						}
						computeMission(begin,begin+50);
					}
					catch(e)
					{
						window.alert(e);
					}

				}
			});
			//appendNewScript('http://mountypedia.free.fr/mz/monstres_FF.php?begin=-1&end='+(i == nodes.snapshotLength - 1)+'&idcdm=' + MZ_getValue('CDMID') + '&' + str);
			str = "";
		}
	}
}

function createImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('title',text);
	img.setAttribute('align','ABSMIDDLE');
	return img;
}


function computeMission(begin,end)
{
	var nodes = document.evaluate(
			"//tr/td[position() = 2 and text() = 'MORT']/../td[3]/b[2]/a[@class='mh_monstres']/..", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;
	if(!MZ_getValue("MISSION_"+numTroll) || MZ_getValue("MISSION_"+numTroll)=="")
		return false;
	var urlImg = "http://mountyzilla.tilk.info/scripts_0.8/images/mission.png";
	var data = MZ_getValue("MISSION_"+numTroll);
	var infosMission = data.split("$");
	for(var i=begin;i<nodes.snapshotLength && i<=end;i++)
	{
		var node = nodes.snapshotItem(i);
		var idMonstre = node.nextSibling.nodeValue;
		var nomMonstre = node.childNodes[0].childNodes[0].nodeValue;
		idMonstre = idMonstre.substring(idMonstre.indexOf("(")+1,idMonstre.indexOf(")"))*1;
		nomMonstre = trim(nomMonstre.substring(nomMonstre.indexOf(" ")+1));
			
		var nom = nomMonstre.toLowerCase();
			
		if(infosMission[0]=="R")
		{
			if(epure(nom).indexOf(epure(infosMission[2].toLowerCase()))!=-1)
			{
				var tr = node;
				tr.appendChild(document.createTextNode(" "));
				tr.appendChild(createImage(urlImg, infosMission[4]));
			}
		}
		if (listeCDM[idMonstre])
		{
			var donneesMonstre = listeCDM[idMonstre];
			var id = idMonstre;
			
			if(infosMission[0]=="N")
			{
				var donneesMonstre = listeCDM[id];
				if(donneesMonstre)
				{
					if(donneesMonstre[0]*1>=infosMission[2]*1-1 && donneesMonstre[0]*1<=infosMission[2]*1+1)
					{
						var tr = node;
						tr.appendChild(document.createTextNode(" "));
						tr.appendChild(createImage(urlImg, infosMission[4]));
					}
				}
			}
			else if(infosMission[0]=="F")
			{
				var donneesMonstre = listeCDM[id];
				if(donneesMonstre)
				{
					if(epure(donneesMonstre[1]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase()))!=-1)
					{
						var tr = node;
						tr.appendChild(document.createTextNode(" "));
						tr.appendChild(createImage(urlImg, infosMission[4]));
					}
				}
			}
			//Ca sert à rien de frapper un monstre de ce type, il faut son pouvoir actif...
/*			else if(infosMission[0]=="P")
			{
				var donneesMonstre = listeCDM[id];
				if(donneesMonstre)
				{
					if(epure(donneesMonstre[10]).toLowerCase().indexOf(epure(infosMission[2].toLowerCase())+" =>")!=-1)
					{
						var tr = node;
						tr.appendChild(document.createTextNode(" "));
						tr.appendChild(createImage(urlImg, infosMission[4]));
					}
				}
			}*/
		}
	}
}

start_script();

treateMission();

displayScriptTime();
