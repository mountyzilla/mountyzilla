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

function updateData() {
	var inputs = document.getElementsByTagName('input');
	var nom = document.getElementsByTagName('div')[0].childNodes[0].nodeValue;
	//Un cookie par troll joué
	if (nom != nomTroll) {
		MZ_setValue("NUM_TROLL", inputs[0].getAttribute('value'));
		MZ_setValue("NOM_TROLL", nom);
		MZ_removeValue("RM_TROLL");
	}
	MZ_setValue("NIV_TROLL", inputs[1].getAttribute('value'));
	MZ_setValue("MM_TROLL", inputs[2].getAttribute('value'));
	
	var infoPos = document.evaluate("//div[@class='infoMenu']/text()[contains(.,'|Y=')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(!infoPos)
		return;
	var listePos = infoPos.nodeValue.split("=");
	if(listePos.length!=4)
		return;
	var x = parseInt(listePos[1]);
	var y = parseInt(listePos[2]);
	var n = parseInt(listePos[3]);
	MZ_setValue(numTroll+".position.X",x);
	MZ_setValue(numTroll+".position.Y",y);
	MZ_setValue(numTroll+".position.N",n);
}


var listeCookies=new Array("NUM_TROLL","NOM_TROLL","CDMID","NIV_TROLL","URL1","URL2","URL3","NOM1","NOM2","NOM3","VUEEXT","MAX_LEVEL","USECSS","FORMAT_TIME",
	"INFOCARAC","TAGSURL","SEND_IDT","NOINFOEM","MM_TROLL","RM_TROLL","NOENGAGE","NOINT","NOGG","NOCOMP","NOBID","NODIPLO","NOMYTH","NOEM","NOTROU","NOGOWAP",
	"NOLEVEL");

var listeCookiesByTroll = new Array("MISSION_","IT_","POISS_");
	
function cookiesToStorage()
{
	for(var i=0;i<listeCookies.length;i++)
		cookieToStorage(listeCookies[i]);
	var numTroll = MZ_getValue("NUM_TROLL");
	if(numTroll != null)
	{
		for(var i=0;i<listeCookiesByTroll.length;i++)
			cookieToStorage(listeCookiesByTroll[i]+numTroll);
	}
}

function cookieToStorage(value)
{
	if(getCookie(value) != null && getCookie(value).length>0)
	{
		if(MZ_getValue(value) == null)
			MZ_setValue(value,getCookie(value));
			//A réactiver lors du vrai changement
		deleteCookie(value);
	}
}


start_script(31);

updateData();
cookiesToStorage();
