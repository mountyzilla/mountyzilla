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

var popup;

function initPopup() {
	popup = document.createElement('div');
	popup.setAttribute('id', 'popup');
	popup.setAttribute('class', 'mh_textbox');
	popup.setAttribute('style', 'position: absolute; border: 1px solid #000000; visibility: hidden;' +
			'display: inline; z-index: 3; max-width: 400px;');
	document.body.appendChild(popup);
}

function showPopup(evt) {
	var texte = this.getAttribute("texteinfo");
	popup.innerHTML = texte;
	popup.style.left = evt.pageX + 15 + 'px';
	popup.style.top = evt.pageY + 'px';
	popup.style.visibility = "visible";
}

function hidePopup() {
	popup.style.visibility = "hidden";
}

function createPopupImage(url, text)
{
	var img = document.createElement('img');
	img.setAttribute('src',url);
	img.setAttribute('align','ABSMIDDLE');
	img.setAttribute("texteinfo",text);
	img.addEventListener("mouseover", showPopup,true);
	img.addEventListener("mouseout", hidePopup,true);
	return img;
}

function formateTexte(texte)
{
	texte = texte.replace(/\n/g,"<br/>");
	texte = texte.replace(/^([^<]*) d'un/g,"<b>$1</b> d'un");
	texte = texte.replace(/<br\/>([^<]*) d'un/g,"<br/><b>$1</b> d'un");
	texte = texte.replace(/(d'une? )([^<]*) d'au/g,"$1<b>$2</b> d'au");
	texte = texte.replace(/(Qualité )([^<]*) \[/g,"$1<b>$2</b> [");
	texte = texte.replace(/\[([^<]*)\]/g,"[<b>$1</b>]");
	return texte;
}


function treateGowaps() {
	//On récupère les gowaps possédants des composants
	var tbodys = document.evaluate(
			"//table[@width='98%' and @class='mh_tdborder']/descendant::img[@alt = 'Composant - Spécial']/../../..",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j = 0; j < tbodys.snapshotLength; j++) 
	{
		var tbody = tbodys.snapshotItem(j);
		var tbody1 = tbody.parentNode.parentNode.parentNode.parentNode.parentNode;
		var node = document.evaluate("./descendant::a[contains(@href,'FO_Profil.php')]/text()",
				tbody1, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		
		
		//insertButtonComboDB(tbody, 'gowap', parseInt(node.nodeValue.substring(0, node.nodeValue.indexOf('.'))));
		if(MZ_getValue("NOINFOEM") != "true")
			insertEMInfos(tbody);
	}
}

function positive(i)
{
	if(i>=0)
		return "+"+i;
	return i;
}

function treateEquipement() {
	//On récupère les gowaps possédants des composants
	var textes = document.evaluate(
		"//table[@class = 'TableEq']/descendant::text()[contains(.,' : +') or contains(.,' : -')]"
		, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var listeBonus = new Array();
	for (var i = 0; i < textes.snapshotLength; i++) 
	{
		var texte = textes.snapshotItem(i).nodeValue;
		var liste = texte.split("|");
		for(var j=0;j<liste.length;j++)
		{
			var bonus = liste[j];
			if(bonus.indexOf(" : ")!=-1)
			{
				var valeur = bonus.substring(bonus.indexOf(" : ")+3).split("\\");
				bonus = trim(bonus.substring(0,bonus.indexOf(" : ")));
				if(listeBonus[bonus] == null)
				{
					listeBonus[bonus] = new Array();
					listeBonus[bonus][0] = parseInt(valeur[0]);
					listeBonus[bonus][1] = parseInt(valeur.length==1?0:valeur[1]);
				}
				else
				{
					listeBonus[bonus][0] += parseInt(valeur);
					listeBonus[bonus][1] += parseInt(valeur.length==1?0:valeur[1]);
				}
			}
		}
	}
	var ids = document.evaluate(
		"//table[@class = 'TableEq']/descendant::table[@width = '100%']/descendant::input[@name='ai_IDObjet']"
		, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(ids.snapshotLength>=2 && ids.snapshotItem(ids.snapshotLength-1).getAttribute("value")==ids.snapshotItem(0).getAttribute("value"))
	{
		textes = document.evaluate(
		"descendant::text()[contains(.,' : +') or contains(.,' : -')]"
		, textes.snapshotItem(1).parentNode.parentNode.parentNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < textes.snapshotLength; i++) 
		{
			var texte = textes.snapshotItem(i).nodeValue;
			var liste = texte.split("|");
			for(var j=0;j<liste.length;j++)
			{
				var bonus = liste[j];
				if(bonus.indexOf(" : ")!=-1)
				{
					var valeur = bonus.substring(bonus.indexOf(" : ")+3).split("\\");
					bonus = trim(bonus.substring(0,bonus.indexOf(" : ")));
					listeBonus[bonus][0] -= parseInt(valeur[0]);
					if(valeur.length>1)
						listeBonus[bonus][1] -= parseInt(valeur[1]);
				}
			}
		}
	}
	var text="";
	for (key in listeBonus)
	{
		if(listeBonus[key][0]==0 && listeBonus[key][1]==0)
			continue;
		if(text.length!=0)
			text+=" | ";
		text+=key+" : "+positive(listeBonus[key][0]);
		if( listeBonus[key][1]!=0)
			text+="\\"+positive(listeBonus[key][1])
		if(key=="TOUR")
			text+=" min";
		if(key=="RM" || key=="MM")
			text+="%";
	}
	if(text.length>0)
	{
		var node = document.evaluate("//table[@class = 'mh_tdpage']",
				document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		insertText(node,'Total : '+text, true);
		insertBr(node);
	}
	
}

function treateChampi() {
	if(MZ_getValue("NOINFOEM") == "true")
		return false;
	var nodes = document.evaluate("//img[@alt = 'Champignon - Spécial']/../a/text()",
			document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (nodes.snapshotLength == 0)
		return false;

	for (var i = 0; i < nodes.snapshotLength; i++) {
			var node = nodes.snapshotItem(i);
			var texte = trim(node.nodeValue.replace(/\240/g, " "));
			if(texte.indexOf("*")!=-1)
				texte = texte.substring(0,texte.lastIndexOf(" "));
			var nomChampi = texte.substring(0,texte.lastIndexOf(" "));
			if(moisChampi[nomChampi])
			{
				appendText(node.parentNode.parentNode," [Mois "+moisChampi[nomChampi]+"]");
			}
			
	}
}



try
{
start_script();

if (currentURL.indexOf("?as_CurSect=follo") != -1)
{
	treateChampi();
	treateGowaps();
}
else if(currentURL.indexOf("?")==-1 || currentURL.indexOf("?as_CurSect=equip") != -1)
	treateEquipement();
	
if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
{
	initPopup();
	computeEnchantementEquipement(createPopupImage,formateTexte);
}
	
displayScriptTime();
}
catch(e){alert(e)}
