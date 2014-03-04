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

function updateIT(node,value)
{
	var child = node.childNodes[5];
	if (value == "none") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdVide);
		if (node.childNodes.length > 11)
			node.removeChild(node.childNodes[6]);
	} else if (value == "ssgg") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdSSGG);
		if (node.childNodes.length > 11)
			node.removeChild(node.childNodes[6]);
	} else if (value == "bricol") {
		child.removeChild(
		child.childNodes[1]);
		child.appendChild(tdBricol);
		if (node.childNodes.length == 11)
			insertBefore(node.childNodes[6], trBricol);
	}
}

function modifyIT() {
	var node = this.parentNode.parentNode.parentNode;
	updateIT(node,this.value);
}

function updateTags(node,value)
{
	var child = node.childNodes[node.childNodes.length-3];
	if (value == "none") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdVide2);
	} else if (value == "default") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdVide2);
	} else if (value == "defaultv2") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdVide2);
	} else if (value == "others") {
		child.removeChild(child.childNodes[1]);
		child.appendChild(tdTagsURL);
	}
}

function deleteEnchantement()
{
	try
	{
	var idEquipement = this.getAttribute('name');
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".objet");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".enchanteur");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.0");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.1");
	MZ_removeValue(numTroll+".enchantement."+idEquipement+".composant.2");
	var listeEquipement = MZ_getValue(numTroll+".enchantement.liste").split(";");
	var string = "";
	for(var i=0;i<listeEquipement.length;i++)
	{
		if(listeEquipement[i]!=idEquipement)
			if(string=="")
				string = listeEquipement[i];
			else
				string += ";"+listeEquipement[i];
	}
	if(string=="")
	{
		MZ_removeValue(numTroll+".enchantement.liste");
		var table = this.parentNode.parentNode.parentNode.parentNode;
		var parent = table.parentNode;
		for(var i=0;i<parent.childNodes.length;i++)
		{
			if(parent.childNodes[i]==table)
			{
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				parent.removeChild(parent.childNodes[i-1]);
				break;
			}
		}
	}
	else
	{
		MZ_getValue(numTroll+".enchantement.liste",string);
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	}
	}
	catch(e)
	{
		alert(e);
	}
}

function modifyTags() {
	var node = this.parentNode.parentNode.parentNode;
	updateTags(node,this.value);
}

function apply() {
try
{
	var form = this.form;
	if (document.getElementById("url1").value != "" && document.getElementById("nom1").value != "") {
		MZ_setValue("URL1", document.getElementById("url1").value);
		MZ_setValue("NOM1", document.getElementById("nom1").value);
	} else {
		MZ_removeValue("URL1");
		MZ_removeValue("NOM1");
	}
	if (document.getElementById("url2").value != "" && document.getElementById("nom2").value != "") {
		MZ_setValue("URL2", document.getElementById("url2").value);
		MZ_setValue("NOM2", document.getElementById("nom2").value);
	} else {
		MZ_removeValue("URL2");
		MZ_removeValue("NOM2");
	}
	if (document.getElementById("url3").value != "" && document.getElementById("nom3").value != "") {
		MZ_setValue("URL3", document.getElementById("url3").value);
		MZ_setValue("NOM3", document.getElementById("nom3").value);
	} else {
		MZ_removeValue("URL3");
		MZ_removeValue("NOM3");
	}
	if (document.getElementById("vueext").value != "")
		MZ_setValue("VUEEXT", document.getElementById("vueext").value);
	else
		MZ_removeValue("VUEEXT");
	if (document.getElementById("max_level").value != "")
		MZ_setValue("MAX_LEVEL", document.getElementById("max_level").value);
	else
		MZ_removeValue("MAX_LEVEL");
	MZ_setValue("USECSS", document.getElementById("usecss").checked ? "true" : "false");
	MZ_setValue("FORMAT_TIME", document.getElementById("format_time").checked ? "oui" : "non");
	MZ_setValue("INFOCARAC", document.getElementById("infocarac").checked ? "true" : "false");
	MZ_setValue("SEND_IDT", document.getElementById("send_idt").checked ? "oui" : "non");
	MZ_setValue("NOINFOEM", document.getElementById("noInfoEM").checked ? "true" : "false");

	if (document.getElementById("usepoiss").checked && document.getElementById("passpoiss").value != "") {
		MZ_removeValue("POISS_" + numTroll);
		MZ_setValue("POISS_" + numTroll, hex_md5(document.getElementById("passpoiss").value));
	} else if(!document.getElementById("usepoiss").checked)
		MZ_removeValue("POISS_" + numTroll);

	if (document.getElementById("tactic").value != "none") {
		if (document.getElementById("tactic").value == "ssgg" && document.getElementById("mdpssgg").value != "") {
			MZ_removeValue("IT_" + numTroll);
			MZ_setValue("IT_" + numTroll, "ssgg$" + hex_md5(document.getElementById("mdpssgg").value));
		} else if (document.getElementById("tactic").value == "bricol" && document.getElementById("urlbricol").value != "" && document.getElementById("loginbricol").value != ""
				   && document.getElementById("passbricol").value != "") {
			MZ_setValue("IT_" + numTroll, "bricol$" + document.getElementById("urlbricol").value + "$" + document.getElementById("loginbricol").value
					+ "$" + hex_md5(document.getElementById("passbricol").value));
		}
	} else
		MZ_removeValue("IT_" + numTroll);
	
	var previousInfo = MZ_getValue("TAGSURL");
	MZ_removeValue("TAGSURL");
	if (document.getElementById("tags").value == "default")
	{
		MZ_setValue("TAGSURL","http://mountypedia.free.fr/mz/typeTrolls.csv");
	}
	else if (document.getElementById("tags").value == "defaultv2")
	{
		MZ_setValue("TAGSURL","http://mountypedia.free.fr/mz/typeTrolls_new.csv");
	}
	else if (document.getElementById("tags").value == "pogo2009")
	{
		MZ_setValue("TAGSURL","http://mountyzilla.tilk.info/resources/pogo2009.csv");
	}
	else if (document.getElementById("tags").value == "others")
	{
		if(previousInfo != document.getElementById("tagsurl").value.replace(/;http/g,"$http"))
		{
			if(confirm('Utiliser des fichiers de tags peut-être potentiellement dangereux.\nN\'utilisez que ceux provenant de personnes dont vous avez confiance.\nEtes-vous sûr de vouloir utiliser ceux là ?'))
				MZ_setValue("TAGSURL",document.getElementById("tagsurl").value.replace(/;http/g,"$http"));
			else
				MZ_setValue("TAGSURL",previousInfo);
		}
		else
			MZ_setValue("TAGSURL",previousInfo);
	}
		
	document.getElementById("Bouton").setAttribute('Value', 'Données sauvegardées');
} catch(error)
{
	alert(error);
}
}

function insertTitle(next, txt) {
	var div = document.createElement('DIV');
	div.setAttribute('class', 'Titre2');
	appendText(div, txt);
	insertBefore(next, div);
}

start_script(712);

appendNewScript('http://mountyzilla.tilk.info/scripts/md5.js');

// OPTIONS

var aList = document.getElementsByTagName('A');
var insertPoint = aList[aList.length - 1].parentNode.parentNode.parentNode.parentNode;

insertTitle(insertPoint, 'Options du script Mountyzilla');

var form = document.createElement('form');
insertBefore(insertPoint, form);
var table = document.createElement('table');
table.setAttribute('width', '98%');
table.setAttribute('border', '0');
table.setAttribute('align', 'center');
table.setAttribute('cellpadding', '2');
table.setAttribute('cellspacing', '1');
table.setAttribute('class', 'mh_tdborder');
form.appendChild(table);

var tbody = document.createElement('tbody');
table.appendChild(tbody);

var tr = appendTr(tbody, 'mh_tdtitre');
appendText(appendTdCenter(tr), 'Lien 1 :');
appendTextbox(appendTdCenter(tr), 'text', 'url1', '50', '150', MZ_getValue("URL1"));
appendText(appendTdCenter(tr), 'Nom :');
appendTextbox(appendTdCenter(tr), 'text', 'nom1', '50', '150', MZ_getValue("NOM1"));

tr = appendTr(tbody, 'mh_tdtitre');
appendText(appendTdCenter(tr), 'Lien 2 :');
appendTextbox(appendTdCenter(tr), 'text', 'url2', '50', '150', MZ_getValue("URL2"));
appendText(appendTdCenter(tr), 'Nom :');
appendTextbox(appendTdCenter(tr), 'text', 'nom2', '50', '150', MZ_getValue("NOM2"));

tr = appendTr(tbody, 'mh_tdtitre');
appendText(appendTdCenter(tr), 'Lien 3 :');
appendTextbox(appendTdCenter(tr), 'text', 'url3', '50', '150', MZ_getValue("URL3"));
appendText(appendTdCenter(tr), 'Nom :');
appendTextbox(appendTdCenter(tr), 'text', 'nom3', '50', '150', MZ_getValue("NOM3"));

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendText(td, "Vue externe : ");
var select = document.createElement('SELECT');
select.setAttribute('id', 'vueext');
td.appendChild(select);
appendOption(select, 'bricol', 'Bricol\' Vue');
appendOption(select, 'ccm', 'Vue du CCM');
appendOption(select, 'evo', 'Vue Evolution');
appendOption(select, 'garush', 'Vue Garush');
appendOption(select, 'gloumfs2d', 'Vue Gloumfs 2D');
appendOption(select, 'gloumfs3d', 'Vue Gloumfs 3D');
appendOption(select, 'grouky', 'Grouky Vue');
appendOption(select, 'kilamo', 'Vue KiLaMo');
appendOption(select, 'lxgt', 'Vue LXGT');
appendOption(select, 'otan', 'Vue OTAN');
appendOption(select, 'relaismago', 'Vue R&M');
appendOption(select, 'xtrolls', 'Vue X Trolls');
appendOption(select, 'noone', 'Aucune');
if (MZ_getValue("VUEEXT") != "" && MZ_getValue("VUEEXT")!= null)
	select.value = MZ_getValue("VUEEXT");
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'usecss', MZ_getValue("USECSS") == "true")
appendText(td, " Utiliser la CSS pour les couleurs de la diplomatie");

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendText(td, "Nombre de niveaux de monstres à afficher : ");
appendTextbox(td, 'text', 'max_level', '5', '10', (MZ_getValue("MAX_LEVEL") == "" || MZ_getValue("MAX_LEVEL") == null)? 5000 : MZ_getValue("MAX_LEVEL"));
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'format_time',  MZ_getValue("FORMAT_TIME") == null || MZ_getValue("FORMAT_TIME") == '' || MZ_getValue("FORMAT_TIME") == "oui")
appendText(td, " Utiliser les dates Mountyhall");

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendText(td, "Interface Tactique : ");
select = document.createElement('SELECT');
select.addEventListener("change",modifyIT,true);
select.setAttribute('id', 'tactic');
select.setAttribute('name', 'tactic');
td.appendChild(select);
appendOption(select, 'none', 'Aucune');
appendOption(select, 'ssgg', 'SSGG');
appendOption(select, 'bricol', 'Système Tactique des Bricol\'Trolls');

var tdSSGG = appendTdCenter(null, 2);
appendText(tdSSGG, "Mot de passe pour le SSGG : ");
appendTextbox(tdSSGG, 'password', 'mdpssgg', '20', '50');

var trBricol = document.createElement('TR');
trBricol.setAttribute('class', 'mh_tdtitre');
var tdBricol = appendTdCenter(trBricol, 2);
appendText(tdBricol, "Nom du système : ");
appendTextbox(tdBricol, 'text', 'urlbricol', '20', '50');
tdBricol = appendTdCenter(trBricol, 2);
appendText(tdBricol, "Login du compte : ");
appendTextbox(tdBricol, 'text', 'loginbricol', '20', '50');
tdBricol = appendTdCenter(trBricol, 2);
appendText(tdBricol, "Mot de passe du compte : ");
appendTextbox(tdBricol, 'password', 'passbricol', '20', '50');

var tdVide = appendTdCenter(tr, 2);

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'usepoiss', MZ_getValue("POISS_" + numTroll) != "" && MZ_getValue("POISS_" + numTroll) != null)
appendText(td, " Envoyer vos jets de dé au ");
var link = document.createElement('A');
link.setAttribute('href', 'http://www.fur4x-hebergement.net/minitilk');
link.setAttribute('target', '_blank');
td.appendChild(link);
appendText(link, "Poissotron");
td = appendTdCenter(tr, 2);
appendText(td, "Mot de passe pour le Poissotron : ");
appendTextbox(td, 'password', 'passpoiss', '20', '50');

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'infocarac', MZ_getValue("INFOCARAC") != "false")
appendText(td, " Afficher les caractéristiques des équipements des autres Trõlls");
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'send_idt', MZ_getValue("SEND_IDT") != "non")
appendText(td, " Envoyer les objets identifiés au système de stats");

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendText(td, "Tags de Trolls : ");
select = document.createElement('SELECT');
select.addEventListener("change", modifyTags,true);
select.setAttribute('id', 'tags');
select.setAttribute('name', 'tags');
td.appendChild(select);
appendOption(select, 'none', 'Aucuns');
appendOption(select, 'defaultv2', 'Types de Trolls (Nouveau)');
appendOption(select, 'default', 'Types de Trolls (Ancien)');
appendOption(select, 'pogo2009', 'Les équipes du pogo 2009');
appendOption(select, 'others', 'Autres');

var tdVide2 = appendTdCenter(tr, 2);

var tdTagsURL = appendTdCenter(null, 2);
appendText(tdTagsURL, "Adresses des fichiers de tags : ");
appendTextbox(tdTagsURL, 'text', 'tagsurl', '50', '500');

tr = appendTr(tbody, 'mh_tdtitre');
td = appendTdCenter(tr, 2);
appendCheckBox(td, 'noInfoEM', MZ_getValue("NOINFOEM") == "true")
appendText(td, " Cacher toutes les informations à propos de l'écriture magique");
td = appendTdCenter(tr, 2);

td = appendTdCenter(appendTr(tbody, 'mh_tdtitre'), 4);
input = appendButton(td, 'Sauvegarder', apply);
input.setAttribute('id', 'Bouton');

//Les enchantements

if(MZ_getValue(numTroll+".enchantement.liste") && MZ_getValue(numTroll+".enchantement.liste")!="" )
{
	insertTitle(insertPoint, 'Les Enchantements en cours');
	table = document.createElement('table');
	table.setAttribute('width', '98%');
	table.setAttribute('border', '0');
	table.setAttribute('align', 'center');
	table.setAttribute('cellpadding', '2');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('class', 'mh_tdborder');

	tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	tr = appendTr(tbody, 'mh_tdtitre');
	appendTdText(tr, 'Equipement',1);
	appendTdText(tr, 'Composants',1);
	appendTdText(tr, 'Enchanteur',1);
	appendTdText(tr, 'Action',1);
	
	var listeEquipement = MZ_getValue(numTroll+".enchantement.liste").split(";");
	for(var i=0;i<listeEquipement.length;i++)
	{
		try
		{
			var idEquipement = listeEquipement[i];
			var nomEquipement = MZ_getValue(numTroll+".enchantement."+idEquipement+".objet");
			var infoEnchanteur = MZ_getValue(numTroll+".enchantement."+idEquipement+".enchanteur").split(";");
			var ul = document.createElement('UL');
			for(var j=0;j<3;j++)
			{
				var infoComposant = MZ_getValue(numTroll+".enchantement."+idEquipement+".composant."+j).split(";");
				var texte = infoComposant[4].replace("Ril ","Œil ");
				for(var k=5;k<infoComposant.length;k++)
				{
					texte += ";"+infoComposant[k].replace("Ril ","Œil ");
				}
				li = appendLI(ul,texte);
				var string = '<form action="http://troc.mountyhall.com/search.php" method="post" TARGET = "_blank">';
				string+= '<input type="hidden" name="monster" value="'+infoComposant[2]+'" />';
				string+= '<input type="hidden" name="part" value="'+infoComposant[0]+'" />';
				string+= '<input type="hidden" name="qualite" value="'+(getQualite(infoComposant[3])+1)+'" />';
				string+= '<input type="hidden" name="q" value="min" />';
				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Rechercher sur le Troc de l\'Hydre" />';
				string+= ' &nbsp; <input type="button" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" onClick="javascript:window.open(&quot;http://www.cyclotrolls.be/wakka.php?wiki=TroOGle&trooglephr=base%3Amonstres+tag%3Anom+%22'+infoComposant[2]+'%22&quot;)" value="Localiser le monstre grâce à Troogle" /></form>';
				
				string+= '</form>';
//				string += '<form action="http://www.cyclotrolls.be/wakka.php" method="get" TARGET = "_blank">';
//				string+= '<input type="hidden" name="wiki" value="TroOGle" />';
//				string+= '<input type="hidden" name="trooglephr" value="base:monstres tag:nom &quot;'+infoComposant[2]+'&quot;" />';
//				string+= '<input type="submit" class="mh_form_submit" onMouseOver="this.style.cursor=\'hand\';" name="enter" value="Localiser grâce à Troogle" /></form>';
				li.innerHTML += string;
			}
			tr = appendTr(tbody, 'mh_tdpage');
			
			td = appendTdText(tr, nomEquipement);
			td.setAttribute('valign', 'center');
			
			td = document.createElement('td');
			td.appendChild(ul);
			tr.appendChild(td);
			td.setAttribute('valign', 'center');
			
			td = appendTdText(tr, "Enchanteur n°"+infoEnchanteur[0]+" ("+infoEnchanteur[1]+"|"+infoEnchanteur[2]+"|"+infoEnchanteur[3]+")");
			td.setAttribute('valign', 'center');
			
			td = document.createElement('td');
			input = appendButton(td, 'Supprimer l\'enchantement', deleteEnchantement);
			input.setAttribute('name', idEquipement);
			tr.appendChild(td);
			td.setAttribute('valign', 'center');
		}
		catch(e)
		{
		}
	}
	insertBefore(insertPoint, table);
	insertBefore(insertPoint, document.createElement('p'));
}


// REMERCIEMENTS

insertTitle(insertPoint, 'Crédits du script');

table = document.createElement('table');
table.setAttribute('width', '98%');
table.setAttribute('border', '0');
table.setAttribute('align', 'center');
table.setAttribute('cellpadding', '2');
table.setAttribute('cellspacing', '1');
table.setAttribute('class', 'mh_tdborder');

tbody = document.createElement('tbody');
table.appendChild(tbody);

td = appendTdText(appendTr(tbody, 'mh_tdtitre'), 'Beaucoup de personnes ont travaillés sur ce script :');

var ul = document.createElement('UL');
td.appendChild(ul);
appendLI(ul, 'Fine fille (6465) pour les popup javascript');
appendLI(ul, 'Reivax (4234) pour les infos bulles');
appendLI(ul, 'Noc (2770) pour les moyennes des caracs');
appendLI(ul, 'Endymion (12820) pour les infos sur les comp/sorts');
appendLI(ul, 'Ratibus (15916) pour l\'envoi de CdM');
appendLI(ul, 'TetDure (41931) pour les PVs restants dans les CdM');
appendLI(ul, 'Les Teubreux pour leur bestiaire !');
appendLI(ul, 'Les développeurs de vue qui font des efforts pour s\'intégrer à Mountyzilla');
appendLI(ul, 'Gros Kéké (233) qui permet de tester le script aux limites du raisonnable avec sa vue de barbare');
appendLI(ul, 'TuttiRikikiMaoussKosTroll (61214) pour le script sur les caracs de l\'équipement');
appendLI(ul, 'Ashitaka (9485) pour le gros nettoyage de l\'extension, des scripts, et beaucoup de choses à venir');
appendLI(ul, 'Tous ceux que j\'ai oubliés');
insertBefore(insertPoint, table);


insertBefore(insertPoint, document.createElement('p'));
try
{
if (MZ_getValue("IT_" + numTroll) != "") {
	var c = MZ_getValue("IT_" + numTroll);
	if(c)
	{
		document.getElementsByName("tactic")[0].value = c.substring(0, c.indexOf('$'));
		updateIT(document.getElementsByName("tactic")[0].parentNode.parentNode.parentNode,document.getElementsByName("tactic")[0].value);
		if (document.getElementsByName("tactic")[0].value == "bricol") {
			var t = c.split('$');
			document.getElementsByName("urlbricol")[0].value = t[1];
			document.getElementsByName("loginbricol")[0].value = t[2];
		}
	}
}

if (MZ_getValue("TAGSURL") != "" && MZ_getValue("TAGSURL") != null) {
	var c = MZ_getValue("TAGSURL");
	if(c=="http://mountypedia.free.fr/mz/typeTrolls.csv")
		document.getElementsByName("tags")[0].value = "default";
	else if(c=="http://mountypedia.free.fr/mz/typeTrolls_new.csv")
		document.getElementsByName("tags")[0].value = "defaultv2";
	else if(c=="http://mountyzilla.tilk.info/resources/pogo2009.csv")
		document.getElementsByName("tags")[0].value = "pogo2009";
	else if(c)
	{
		document.getElementsByName("tags")[0].value = "others";
		updateTags(document.getElementsByName("tags")[0].parentNode.parentNode.parentNode,document.getElementsByName("tags")[0].value);
		tdTagsURL.childNodes[1].value = c.replace(/\$http/g,";http");
	}
}
}
catch(e)
{
alert(e);
}

displayScriptTime();
