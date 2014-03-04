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

function positive(i)
{
	if(i==null)
		return 0;
	if(i>=0)
		return "+"+i;
	return i;
}

function isEmpty(array)
{
	var t=0;
	for(var i in array)
		t=1;
	return t==0;
}


function treateMalus() {
try
{
	var malus = document.evaluate("//tr[@class='mh_tdpage']/td/text()[contains(.,'Tour')]/../../td[4]/text()[contains(.,':')]",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var listePouvoirsByTurn = new Array();
	var listePouvoirs = new Array();
	var listeDuree = new Array();
	var listeType = new Array();
	for(var i=0;i<malus.snapshotLength;i++)
	{
		var textes = malus.snapshotItem(i).nodeValue.split(" | ");
		var nbTour = parseInt(document.evaluate("td/text()[contains(.,'Tour')]", malus.snapshotItem(i).parentNode.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue);
		var type = document.evaluate("td[5]/text()", malus.snapshotItem(i).parentNode.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.nodeValue;
		if(listePouvoirsByTurn[nbTour] == null)
			listePouvoirsByTurn[nbTour] = new Array();
		if(listePouvoirsByTurn[nbTour][type] == null)
			listePouvoirsByTurn[nbTour][type] = new Array();
		for(var j=0;j<textes.length;j++)
		{
			var texte = trim(textes[j]);
			if(texte.indexOf(":")==-1)
				continue;
			var bonus = trim(texte.substring(0,texte.indexOf(":")));
			listePouvoirs[bonus] = 1;
			var valeur = parseInt(texte.substring(texte.indexOf(":")+1));
			if(listePouvoirsByTurn[nbTour][type][bonus] == null)
				listePouvoirsByTurn[nbTour][type][bonus] = valeur;
			else
				listePouvoirsByTurn[nbTour][type][bonus] += valeur;
		}
		listeDuree[nbTour]=1;
		listeType[type] = 1;
	}
	var tbody = document.evaluate("//form[@name='ActionForm']/table[@class='mh_tdborder']/tbody[1]",
			document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var keys = new Array();
	for(k in listeDuree)
	{
	     keys.push(k);
	}
	keys.sort( function (a, b){return (parseInt(a) > parseInt(b)) - (parseInt(a) < parseInt(b));} );
	
	for(var i=0;i<keys.length;i++)
	{
		var duree = keys[i];
		var nbTypes=0;
		for(type in listeType)
		{
			if(listePouvoirsByTurn[duree][type] == null)
				listePouvoirsByTurn[duree][type] = new Array();
			for(var j=i+1;j<keys.length;j++)
			{
				var duree2 = keys[j];
				for(pouv in listePouvoirs)
				{
					if(listePouvoirsByTurn[duree2][type]!= null && listePouvoirsByTurn[duree2][type][pouv] != null)
					{
						valeur = listePouvoirsByTurn[duree2][type][pouv];
						if(listePouvoirsByTurn[duree][type][pouv] == null)
							listePouvoirsByTurn[duree][type][pouv] = valeur;
						else
							listePouvoirsByTurn[duree][type][pouv] += valeur;
					}
				}
			}
			if(!isEmpty(listePouvoirsByTurn[duree][type]))
				nbTypes++;
		}
		if(nbTypes==1)
		{
			for(type in listeType)
			{
				var text="";
				for (key in listePouvoirsByTurn[duree][type])
				{
					if(text.length!=0)
						text+=" | ";
					text+=key+" : "+positive(listePouvoirsByTurn[duree][type][key]);
					if(key=="TOUR")
						text+=" min";
					if(key=="RM" || key=="MM")
						text+="%";
				}
				if(text.length!=0)
				{
					var tr = appendTr(tbody,"mh_tdtitre");
					var td = appendTdText(tr,"Total",1);
					td = appendTdText(tr,text,1);
					td.setAttribute('colspan',3);
					td = appendTdText(tr,type);
					td = appendTdText(tr,duree+" Tour(s)");
				}
			}
		}
		else if(nbTypes>1)
		{
			var text="";
			for(pouv in listePouvoirs)
			{
				if(listePouvoirsByTurn[duree]["Physique"][pouv] || listePouvoirsByTurn[duree]["Magie"][pouv])
				{
					if(text.length!=0)
						text+=" | ";
					text+=pouv;
					if(listePouvoirsByTurn[duree]["Physique"][pouv]==null)
						text+="* : ";
					else
						text+=" : "+positive(listePouvoirsByTurn[duree]["Physique"][pouv]);
					if(listePouvoirsByTurn[duree]["Physique"][pouv] && listePouvoirsByTurn[duree]["Magie"][pouv])
						text+="/";
					if(listePouvoirsByTurn[duree]["Magie"][pouv])
						text+=positive(listePouvoirsByTurn[duree]["Magie"][pouv]);
					if(pouv=="TOUR")
						text+=" min";
					if(pouv=="RM" || pouv=="MM")
						text+="%";
					if(listePouvoirsByTurn[duree]["Physique"][pouv] && listePouvoirsByTurn[duree]["Magie"][pouv])
					{
						text+=" ("+positive(listePouvoirsByTurn[duree]["Magie"][pouv]+listePouvoirsByTurn[duree]["Physique"][pouv]);
						if(pouv=="TOUR")
							text+=" min";
						if(pouv=="RM" || pouv=="MM")
							text+="%";
						text+=")";
					}
				}
			}
/*			for(type in listeType)
			{
				for (key in listePouvoirsByTurn[duree][type])
				{
					if(text.length!=0)
						text+=" | ";
					if(type=="Magie")
						text+=key+"* : "+positive(listePouvoirs);
					else
						text+=key+" : "+positive(listePouvoirsByTurn[duree][type][key]);
					if(key=="TOUR")
						text+=" min";
					if(key=="RM" || key=="MM")
						text+="%";
				}
			}*/
			if(text.length!=0)
			{
				var tr = appendTr(tbody,"mh_tdtitre");
				var td = appendTdText(tr,"Total",1);
				td = appendTdText(tr,text,1);
				td.setAttribute('colspan',3);
				td = appendTdText(tr,"Mixte");
				td = appendTdText(tr,duree+" Tour(s)");
			}
		}
	}

}
catch(e) {alert(e)}
}

start_script();

treateMalus();

displayScriptTime();
