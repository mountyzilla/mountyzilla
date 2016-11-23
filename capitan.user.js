// ==UserScript==
// @author TilK, Dabihul, Rouletabille
// @description Aide à la recherche de cachettes de Capitan
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @include */mountyhall/View/TresorHistory*
// @include */mountyhall/MH_Play/Actions/Play_a_TrouverCachette2*
// @include */mountyhall/MH_Play/Play_equipement.php*
// @name Capitan
// @version 8.1.4
// @namespace https://greasyfork.org/users/70018
// ==/UserScript==

/****************************************************************
*         Aide à la recherche de cachettes de Capitan           *
*              Développé par Mini TilK (n°36216)                *
*                      mini@tilk.info                           *
*****************************************************************
*        Adapté pour GreaseMonkey par Dabihul (n°79738)         *
*        Roule : ajout https 07/08/2016                         *
*****************************************************************
*         Pour utiliser la recherche, allez des les infos       *
*             de la carte de la cachette du capitan             *
*                    Une fois ceci fait,                        *
*           toutes les recherches seront sauvergardées          *
*            Et dans le détail de la carte vous verrez          *
*       Le nombre de cachettes possibles et leur position       *
****************************************************************/

/*
Roule 08 à 10/08/2016
	recopie ici de appendButton() version MZ
	Ajout liste des essais et possibilité d'en supprimer
	Ajout lien vers Psyko Chasseurs
	Adaptation aux IDs dans la page de résultat d'une recherche de cachette (et plus besoin de stocker le numéro de carte)
Roule 15/08/2016 V8.1.1
	Ajout demande d'avis sur la position courante sur le site Psyko-Chasseurs
	Quelques corrections de calcul (on avait du NaN)
Roule 24 à 26/08/2016 V8.1.2
	Ajout outils de récupération des recherches pré Greasemonkey
Roule 14/10/2016 V8.1.3
	simplification de l'entête GM (include)
	passage à greasyfork
Roule 23/11/2016 V8.1.4
	Adapatation à l'affichage en popup du détail d'un équipement (méthode très discutable par setInterval) 
*/

function appendButton(paren,value,onClick) {
	var input = document.createElement('input');
	input.type = 'button';
	input.className = 'mh_form_submit';
	input.value = value;
	input.onmouseover = function(){this.style.cursor='pointer';};
	if (onClick) input.onclick = onClick;
	paren.appendChild(input);
	return input;
	}

/* Ajout des éléments manquants de libs */
function isPage(url) {
	return window.location.href.indexOf(url)!=-1;
}

// Roule 08/08/2016 ajout cssClass
function appendTr(tbody, cssClass) {
	var tr = document.createElement('tr');
	tbody.appendChild(tr);
	if (cssClass) tr.className = cssClass;
	return tr;
}

function appendTd(tr) {
	var td = document.createElement('td');
	if(tr) { tr.appendChild(td); }
	return td;	
}

function appendText(paren,text,bold) {
	if(bold) {
		var b = document.createElement('b');
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
		}
	else
		paren.appendChild(document.createTextNode(text));
}

function appendTdText(tr,text,bold) {
	var td = appendTd(tr);
	appendText(td,text,bold);
	return td;
}
/* */

function sortNumber(a,b)
{
	return b-a;
}

function removeTab(tab, i)
{
	var newTab = new Array();
	for(var j=0;j<i;j++)
	{
		newTab.push(tab[j]);
	}
	for(var j=i+1;j<tab.length;j++)
	{
		newTab.push(tab[j]);
	}
	return newTab;
}
var cache=new Array();

function tabToString(tab)
{
	var string = tab[0];
	for(var i=1;i<tab.length;i++)
		string+=";"+tab[i];
	return string;
}

function combi(tab)
{
	var newTab = new Array();
	if(tab.length==1)
	{
		newTab[""+tab[0]]=1;
		return newTab;
	}
	var val = tabToString(tab);
	if(cache[val])
		return cache[val];
	for(var i=0;i<tab.length;i++)
	{
		var lastTab = combi(removeTab(tab,i));
		for(var j in lastTab)
			newTab[tab[i]+";"+j]=1;
	}
	cache[val]=newTab;
	return newTab;
}

function affiche(tab)
{
	var newTab = combi(tab);
	var string="";
	for(var i in newTab)
	{
		string += i+"\n";
	}
	window.alert(string);
}

function extractPosition(nombre, indice)
{
	if((nombre+"").length<=indice)
		return "%";
	indice = (nombre+"").length - 1 - indice;
	return (nombre+"").substring(indice,indice+1);
}

function comparePos(x,y,n,x1,y1,n1)
{
	x = Math.abs(x);
	y = Math.abs(y);
	n = Math.abs(n);
	x1 = Math.abs(x1);
	y1 = Math.abs(y1);
	n1 = Math.abs(n1);
	var nbGood=0;
	for(var i=0;i<(x+"").length;i++)
		if(extractPosition(x,i)==extractPosition(x1,i))
			nbGood++;
	for(var i=0;i<(y+"").length;i++)
		if(extractPosition(y,i)==extractPosition(y1,i))
			nbGood++;
	for(var i=0;i<(n+"").length;i++)
		if(extractPosition(n,i)==extractPosition(n1,i))
			nbGood++;
	return nbGood;
}

function signe(x)
{
	if(x<0)
		return -1;
	return 1;
}

function getPosFromArray(liste,begin,length)
{
	var pos="";
	for(var i=begin;i<begin+length;i++)
		pos+=""+liste[i];
	return parseInt(pos, 10);
}

function calculeSolution6(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,listeChiffre.length/3);
		var y1 = getPosFromArray(liste,listeChiffre.length/3,listeChiffre.length/3);
		var n1 = getPosFromArray(liste,2*(listeChiffre.length)/3,listeChiffre.length/3);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution5(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var length = Math.floor(listeChiffre.length/3);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length+1);
		var n1 = getPosFromArray(liste,2*length+1,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length);
		var n1 = getPosFromArray(liste,2*length+1,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length+1);
		var n1 = getPosFromArray(liste,2*length+2,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution4(x,y,n,essais)
{
	var listeChiffre = new Array();
	for(var i=0;i<(Math.abs(x)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(x),i));
	for(var i=0;i<(Math.abs(y)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(y),i));
	for(var i=0;i<(Math.abs(n)+"").length;i++)
		listeChiffre.push(extractPosition(Math.abs(n),i));
	var listeSolutionsPossibles = combi(listeChiffre);
	var length = Math.floor(listeChiffre.length/3);
	var listeSolutions = new Array();
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length);
		var n1 = getPosFromArray(liste,2*length,length+1);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length+1);
		var y1 = getPosFromArray(liste,length+1,length);
		var n1 = getPosFromArray(liste,2*length+1,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	for(var key in listeSolutionsPossibles)
	{
		var liste = key.split(";");
		var x1 = getPosFromArray(liste,0,length);
		var y1 = getPosFromArray(liste,length,length+1);
		var n1 = getPosFromArray(liste,2*length+1,length);
		var oki = true;
		for(var i=0;i<essais.length;i++)
		{
			if(essais[i][3] != comparePos(x1,y1,n1,Math.abs(essais[i][0]),Math.abs(essais[i][1]),Math.abs(essais[i][2])))
			{
				oki=false;
				break;
			}
		}
		if(oki)
			listeSolutions.push(new Array(x1*signe(x),y1*signe(y),n1*signe(n)));
	}
	return listeSolutions;
}

function calculeSolution(x,y,n,essais)
{
	var size = (";"+Math.abs(x)+Math.abs(y)+Math.abs(n)).length-1;
	if(size%3==0)
		return calculeSolution6(x,y,n,essais);
	if(size%3==1)
		return calculeSolution4(x,y,n,essais);
	if(size%3==2)
		return calculeSolution5(x,y,n,essais);
}
function afficheSolutions(x,y,n,essais)
{
	var listeSolutions = calculeSolution(x,y,n,essais);
	var string="Il y a "+listeSolutions.length+" solutions";
	if(listeSolutions.length<=10)
	{
		for(var i=0;i<listeSolutions.length;i++)
		{
			string+= "\n x="+listeSolutions[i][0]+" y="+listeSolutions[i][1]+" n="+listeSolutions[i][2];
		}
	}
	return string;
}

function toggleTableau() {

	var tbody = this.parentNode.parentNode.parentNode.childNodes[1];
	
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
}

function createCase(titre,table,width)
{
	if(width==null)
		width="120";
	var tr = appendTr(table, 'mh_tdpage');

	var td = appendTdText(tr, titre, true);
	td.setAttribute('class', 'mh_tdpage');
	td.setAttribute('width', width);
	td.setAttribute('align', 'center');

	return td;
}

var tbody;

function generateTable(listeSolutions)
{
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	if(listeSolutions.length==1)
	{
		var thead = document.createElement('thead');
		var tr = appendTr(thead, 'mh_tdtitre');
		var td = appendTdText(tr, "Position de la cachette : X = "+listeSolutions[0][0]+", Y = "+listeSolutions[0][1]+", N = "+listeSolutions[0][2], true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		return table;
	}
	else if(listeSolutions.length==0)
	{
		var thead = document.createElement('thead');
		var tr = appendTr(thead, 'mh_tdtitre');
		var td = appendTdText(tr, "Aucune solution trouvée.", true);
		td.setAttribute('align', 'center');
		table.appendChild(thead);
		return table;
	}
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Il y a "+listeSolutions.length+" positions possibles", true);
	td.setAttribute('align', 'center');
	table.appendChild(thead);
	
	tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	for (var i = 0; i < listeSolutions.length; i++) {
		 createCase("X = "+listeSolutions[i][0]+", Y = "+listeSolutions[i][1]+", N = "+listeSolutions[i][2],tbody,400);
	}
	
	
	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

var listeSolutions = new Array();
var essais;	// Roule 08/08/2016 essais en variable globale (pour générer le bloc liste et le bloc pour l'outils de Psycho Chasseurs)

function afficheInfoCarte(idCarte)
{
	var originalPos = GM_getValue("capitan."+idCarte+".position").split(";");
	if(originalPos.length!=3)
		return;
	essais = new Array();
	var i = 0;
	while(GM_getValue("capitan."+idCarte+".essai."+i) != null)
	{
		essais.push(GM_getValue("capitan."+idCarte+".essai."+i).split(";"));
		i++;
	}
	if(GM_getValue("capitan."+idCarte+".signe") !=null)
	{
		var signes = GM_getValue("capitan."+idCarte+".signe").split(";");
		listeSolutions = calculeSolution(Math.abs(originalPos[0])*signe(signes[0]),Math.abs(originalPos[1])*signe(signes[1]),originalPos[2],essais);
	}
	else
	{
		listeSolutions = calculeSolution(originalPos[0],originalPos[1],originalPos[2],essais);
	}
	return generateTable(listeSolutions);
}

function getRepartitionFromCase(tx, ty, tn, listeSolutions)
{
	// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, je modifie l'algorithme
	//var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
	var repartition = new Array();
	//for(var i=0;i<size;i++)
	//	repartition.push(0);
	for(var i=0;i<listeSolutions.length;i++)
	{
		var nbGood = comparePos(listeSolutions[i][0],listeSolutions[i][1],listeSolutions[i][2],tx,ty,tn);
		for (var j = repartition.length; j <= nbGood; j++) repartition.push(0);	// Roule 15/08/2016 compléter le tableau selon le besoin
		repartition[nbGood]++;
	}
	repartition.sort(sortNumber);
	return repartition;
}

function getMeanPositionNumber(repartition,nbSolutions)
{
	var result=0;
	for(var i=0;i<repartition.length;i++)
	{
		result+=repartition[i]*repartition[i];
	}
	return result/nbSolutions;
}

// Roule 08/08/2016 passage numTroll en paramètre
// Roule 15/08/2016 passage position courante en paramètre (tableau des 3 valeurs)
function newRecherche(listeSolutions, currentPos)
{
	if(listeSolutions.length<=1)
		return null;
	// Roule 15/08/2016 plus que dubitatif sur ce calcul de Size, j'utilise repartition.length
	//var size = (";"+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])+Math.abs(listeSolutions[0][0])).length-1;
	var repartition = getRepartitionFromCase(currentPos[0], currentPos[1], currentPos[2], listeSolutions);
	var size = repartition.length;
	//window.console.log('newRecherche, repartition=' + JSON.stringify(repartition));
	
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var nbNotZero = 0;
	for(var i=0;i<size;i++)
	{
		if(repartition[i]!=0)
			nbNotZero++;
	}
	var string = "Il y a une utilité de faire une recherche en X = "+currentPos[0]+" Y = "+currentPos[1]+" N = "+currentPos[2];
	if(nbNotZero<=1)
	{
		//
		var minsolution = listeSolutions.length;
		var newpos = "";
		var isNotN = true;
		for(var dx=-1;dx<=1;dx++)
			for(var dy=-1;dy<=1;dy++)
				for(var dn=0;dn!=-3;dn=(dn==0?1:dn-2))
				{
					if(dx==0 && dy==0 && dn==0)
						continue;
					var tmprepartition = getRepartitionFromCase(currentPos[0]+dx, currentPos[1]+dy, currentPos[2]+dn, listeSolutions);
					var tmpmeanscore = getMeanPositionNumber(tmprepartition,listeSolutions.length);
					if(((dn==0 || !isNotN) && minsolution>=tmpmeanscore) || (dn!=0 && isNotN && tmpmeanscore<=2*minsolution/3))
					{
						minsolution = tmpmeanscore;
						repartition = tmprepartition;
						newpos = "X = "+(currentPos[0]+dx)+" Y = "+(currentPos[1]+dy)+" N = "+(currentPos[2]+dn);
						isNotN = (dn==0);
					}
				}
		if(minsolution == listeSolutions.length)
		{
			var thead = document.createElement('thead');
			var tr = appendTr(thead, 'mh_tdtitre');
			var td = appendTdText(tr, "Il n'y a aucune utilité de faire une recherche en X = "+currentPos[0]+" Y = "+currentPos[1]+" N = "+currentPos[2], true);
			td.setAttribute('align', 'center');
			table.appendChild(thead);
			return table;
		}
		string = "Conseil : allez faire une recherche en "+newpos;
	}
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr,string, true);
	td.setAttribute('align', 'center');
	table.appendChild(thead);
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	for(var i=0;i<size;i++)
	{
		if(i==size-1)
		{
			if(repartition[i]!=0)
				createCase(Math.round(100*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
		}
		else
		{
			var n=1;
			while((i+n)<size && repartition[i]==repartition[i+n])
				n++;
			if(repartition[i]!=0)
				createCase(Math.round(100*n*repartition[i]/listeSolutions.length)+"% de chance d'éliminer "+(listeSolutions.length-repartition[i])+" positions possibles",tbody,400);
			i+=n-1;
		}
	}
	
	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	tbody.setAttribute('style', 'display:none;');
	return table;
}

// Roule 08/08/2016 récupération numéro de Troll dans la page HTML
function getNumTroll()
{
	var infoObjet = document.evaluate("//td[@class = 'mh_tdtitre']/text()[contains(.,'Propriétaire actuel')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	//window.console.log('infoObjet.nodeValue=' + infoObjet.nodeValue);
	var numTroll = 0;
	if(infoObjet)
	{
		// infoObjet.nodeValue=Propriétaire actuel : TROLL - 91305. Rouletabille
		var m = infoObjet.nodeValue.match(/troll[ -]*(\d*)[. +]/i);
		if (m) {
			//window.console.log(m);
			if (m.length > 1) numTroll = parseInt(m[1]);
		}
	}
	//window.console.log('numTroll=' + numTroll);
	return numTroll;
}

function getIDCarte()
{
	var infoObjet = document.evaluate("//div[@class = 'titre2']/text()[contains(.,'Carte de la Cachette')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var idCarte = 0;
	if(infoObjet)
	{
		idCarte = parseInt(infoObjet.nodeValue);
	}
	return idCarte;
}

function analyseObject()
{
	var eSpacer = document.getElementById('spacerMZCapitan');
	if (eSpacer) return;	// déjà affiché
	var numTroll = getNumTroll();	// Roule 08/08/2016 récupération numéro de Troll dans la page HTML
	var idCarte = getIDCarte();
	//window.console.log('analyseObject numTroll=' + numTroll + ', idCarte=' + idCarte);
	var originalPos = GM_getValue("capitan."+idCarte+".position");
	if(!originalPos || originalPos == null)
	{
		var infoPos = document.evaluate("//td/text()[contains(.,'ai été tué en')]",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if(!infoPos) {
			//window.console.log('analyseObject numTroll=' + numTroll + ', idCarte=' + idCarte + ', impossible de trouver le texte de la mort du Capitan');
			return;
		}
		var listePos = infoPos.nodeValue.split("=");
		if(listePos.length!=4) {
			window.console.log('analyseObject numTroll=' + numTroll + ', idCarte=' + idCarte + ', impossible de trouver les coord. de la mort du Capitan ' + infoPos.nodeValue);
			return;
		}
		var x = parseInt(listePos[1]);
		var y = parseInt(listePos[2]);
		var n = parseInt(listePos[3]);
		GM_setValue("capitan."+idCarte+".position",x+";"+y+";"+n);
	}
	// Roule 23/11/2016 travail dans le body (ancienne version, fenêtre indépendante) ou dans la div modale (nouvelle version en "popup")
	var parentElt = document.body;
	var modalElt = document.evaluate("//div[@class = 'modal']",
		document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (modalElt) parentElt = modalElt;

	// bloc liste de solutions
	var table = afficheInfoCarte(idCarte);
	var p = document.createElement('p');
	p.id = 'spacerMZCapitan';
	p.appendChild(table);
	parentElt.appendChild(p);

	// position courante du Troll
	// Roule 08/08/2016 utilisation de localStorage car c'est là que tout_MZ stocke les coord
	var curPos = [];
	curPos[0] = parseInt(window.localStorage[numTroll+".position.X"]);
	curPos[1] = parseInt(window.localStorage[numTroll+".position.Y"]);
	curPos[2] = parseInt(window.localStorage[numTroll+".position.N"]);

	// bloc utilité de faire une recherche sur la position courante
	table = newRecherche(listeSolutions, curPos);
	if(table!=null)
	{
		var p = document.createElement('p');
		p.appendChild(table);
		parentElt.appendChild(p);
		// bloc ajout de nouvelle recherche
		createNewRecherche();
	}

	// Roule 08/08/2016 bloc des recherches mémorisées
	if(essais)
	{
		table = prevRecherche(idCarte);
		var p = document.createElement('p');
		p.appendChild(table);
		parentElt.appendChild(p);
		// Roule 08/08/2016 bloc préparant les infos pour l'outil Mamoune (Psyko-Chasseurs)
		table = blocMamoune(idCarte, curPos);
		if(table!=null)
		{
			p = document.createElement('p');
			p.appendChild(table);
			parentElt.appendChild(p);
		}
	}

	// Roule 25/08/2016 récupération des anciennes recherches (préférences)
	table = PrepareRecupFromPreferences();
	if(table!=null)
	{
		p = document.createElement('p');
		p.appendChild(table);
		parentElt.appendChild(p);
	}

	// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
	table = PrepareRecupFromLocalStorage(idCarte);
	if(table!=null)
	{
		p = document.createElement('p');
		p.appendChild(table);
		parentElt.appendChild(p);
	}
}

// Roule 08/08/2016
function blocMamoune(idCarte, currentPos) {
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Outil du cercle des Psyko-Chasseurs", true);
	td.setAttribute('align', 'center');
	td.setAttribute('title', 'sélectionnez (triple-clic), copiez et collez dans l\'outil des Psyko-Chasseurs');
	table.appendChild(thead);
	
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	// http://mountyhall.dispas.net/dynamic/outils_capitan.php?x=1&y=2&n=3&t=4+5+6+7%0D%0A10+11+12+5&enter=Go#
	var tabtxt = new Array();
	var currentPosAlreadyDone = false;
	for (var i = 0; i < essais.length; i++) {
		tabtxt.push(essais[i].join('+'));
		if (essais[i][0] == currentPos[0] && essais[i][1] == currentPos[1] && essais[i][2] == currentPos[2]) currentPosAlreadyDone = true;
	}
	if (!currentPosAlreadyDone) tabtxt.push(currentPos.join('+') + '+%3F');	// spécial pour demander à Mamoune ce qu'elle pense d'un essai à la position courante
	var tr2 = appendTr(tbody, 'mh_tdpage');
	var td2 = appendTd(tr2);
	var originalPos = GM_getValue("capitan."+idCarte+".position").split(";");
	if(originalPos.length!=3) {
		td2.appendText('Erreur\u00A0: impossible de retrouver les coordonnées de la mort');
	} else {
		var a = document.createElement('a');
		appendText(a, 'Cliquer ici pour savoir ce qu\'en pensent les Psyko-Chasseurs');
		a.setAttribute('href', 'http://mountyhall.dispas.net/dynamic/outils_capitan.php?x=' + originalPos[0] + '&y=' + originalPos[1] + '&n=' + originalPos[2] + '&t=' + tabtxt.join('%0D%0A'));
		a.setAttribute('target', 'psykochasseurs');
		td2.appendChild(a);
	}
	
	td.setAttribute('class', 'mh_tdpage');
	//td.setAttribute('width', width);
	td.setAttribute('align', 'center');

	
	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	td.setAttribute('colspan', 2);
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

function prevRecherche(idCarte)
{
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Vous avez mémorisé " + essais.length + " essai" + (essais.length > 1 ? "s" : ""), true);
	td.setAttribute('align', 'center');
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	for (var i = 0; i < essais.length; i++) {
		var td2 = createCase("X = "+essais[i][0]+", Y = "+essais[i][1]+", N = "+essais[i][2]+" => "+essais[i][3],tbody,400);
		var td3 = appendTd(td2.parentNode);
		var bt = appendButton(td3, "Supprimer", delRecherche);
		bt.idEssai = i;
		bt.idCarte = idCarte;
		td3.setAttribute('class', 'mh_tdpage');
		td3.setAttribute('width', 200);
		td3.setAttribute('align', 'center');
	}

	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	td.setAttribute('colspan', 2);
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

function delRecherche(e) {
	var idEssaiDel = e.target.idEssai;
	var idCarte = e.target.idCarte;
	window.console.log('idEssaiDel=' + idEssaiDel + ', idCarte=' + idCarte + ', essais.length=' + essais.length);
	for (var i = 0; i < essais.length; i++) {
		if (i == essais.length - 1) {
			window.console.log("delete capitan."+idCarte+".essai."+i)
			GM_deleteValue("capitan."+idCarte+".essai."+i);
		} else if (i >= idEssaiDel) {
			window.console.log("set capitan."+idCarte+".essai."+(i)+'+++'+essais[i+1][0]+";"+essais[i+1][1]+";"+essais[i+1][2]+";"+essais[i+1][3]);
			GM_setValue("capitan."+idCarte+".essai."+(i),essais[i+1][0]+";"+essais[i+1][1]+";"+essais[i+1][2]+";"+essais[i+1][3]);
		}
	}
	window.location.replace(window.location);
}

function createNewRecherche()
{
	p = document.createElement('p');
	
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	var tbody = document.createElement('tbody');
	table.appendChild(tbody);
	
	var td = createCase("Rajouter manuellement  une recherche :",tbody);

	td.appendChild(document.createElement('br'));
	td.appendChild(document.createTextNode("X = "));
	addInput(td, "rX");
	td.appendChild(document.createTextNode(" Y = "));
	addInput(td, "rY");
	td.appendChild(document.createTextNode(" N = "));
	addInput(td, "rN");
	td.appendChild(document.createElement('br'));
	td.appendChild(document.createTextNode("Nombre de chiffres bien placés : "));
	addInput(td, "rBP",1);
	td.appendChild(document.createElement('br'));
	var button=appendButton(td, "Ajouter", addRecherche);
	
	p.appendChild(table);
	document.body.appendChild(p);
}

// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
function PrepareRecupFromLocalStorage(idCarte) {
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Récupération des anciens essais V1.1", true);
	td.setAttribute('align', 'center');
	td.title = "C'est ici pour tenter de récupérer les essais faits avec le version 1.1 du script";
	table.appendChild(thead);
	
	var tbody = document.createElement('tbody');
	tbody.idCarte = idCarte;
	table.appendChild(tbody);
	
	td.addEventListener("click", recupFromLocalStorage, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	td.setAttribute('colspan', 2);
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

// Roule 24/08/2016 récupération des anciennes recherches (localStorage)
function recupFromLocalStorage() {
	var tbody = this.parentNode.parentNode.parentNode.childNodes[1];
	if (tbody.RecupVisible) return;	// ne pas populer 2 fois
	var idCarte = parseInt(tbody.idCarte);
	tbody.setAttribute('style', !tbody.getAttribute('style') || tbody.getAttribute('style') == '' ? 'display:none;' : '');
	// entrée d'un jeu de test
	// window.localStorage.setItem('91305.capitan.8600686.essai.1', '1;2;3;4');
	// window.localStorage.removeItem('91305.capitan.8600686.essai.2');
	// window.localStorage.removeItem('91305.capitan.8600686.essai.3');
	// window.localStorage.removeItem('91306.capitan.8600686.essai.1');
	// window.localStorage.setItem('91305.capitan.8600686.essai.2', '1;2;-4;4');
	// window.localStorage.setItem('91305.capitan.8600686.essai.3', '1;-2;5;4');
	// window.localStorage.setItem('91306.capitan.8600686.essai.1', '-1;2;6;4');
	 // return;

	try {
		var nLocalStorage = window.localStorage.length;
		//var td2 = createCase('nLocalStorage=' + nLocalStorage,tbody,400);
		var nAlready = 0;
		var nRecup = 0;
		for (var iKey = 0; iKey < nLocalStorage; iKey++) {
			var k = window.localStorage.key(iKey);
			//var td2 = createCase(k + '=' + v,tbody,400);	// debug
			var m = k.match(/(\d*)\.capitan\.(\d*)\.essai\.(\d*)/i);
			if (!m) continue;	// pas une entrée de carte de capitan
			if (parseInt(m[2]) != idCarte) continue;	// pas la même carte

			var v = window.localStorage.getItem(k);
			//var nTroll = parseInt(m[1]);	// pas utile
			//var nEssai = parseInt(m[3]);	// pas utile non plus
			var bAlready = testAlready(idCarte, v);
			if (bAlready) {	// déjà connu : on compte et on ignore
				nAlready++;
				continue;
			}
			// extraire x, y, n, nb
			m = v.match(/([+-]?\d*);([+-]?\d*);([+-]?\d*);(\d*)/i);
			if (!m) {
				var td2 = createCase('Erreur à la récupération des coordonnées ' + v,tbody,400);
				continue;
			}
			var x = m[1];
			var y = m[2];
			var n = m[3];
			var nbChiffres = m[4];
			// ajout sous Greasemonkey
			addOneRecherche(idCarte, x, y, n, nbChiffres);
			nRecup++;
			var td2 = createCase('Recherche récupérée X = '+ x + ', Y = ' + y + ', N = ' + n + ' => ' + nbChiffres,tbody,400);
		}
		if (nRecup > 0) {
			var td2 = createCase('Recharger la page (F5) maintenant',tbody,400);
			td2.style.fontWeight="bold";
		}
		if (nAlready > 0) {
			var td2 = createCase(nAlready + ' recherche(s) avaient déjà été récupérée(s)',tbody,400);
			td2.style.fontStyle="italic";
		}
		if (nRecup == 0 && nAlready == 0) {
			var td2 = createCase('Désolé, je n\'ai rien trouvé pour la carte ' + idCarte,tbody,400);
		}
	}
	catch(e)
	{
		window.console.log(e);
	}

	tbody.RecupVisible = true;
}

function testAlready(idCarte, v) {
	var v2;
	// tester si cet essai est déjà connu sous Greasemonkey
	var bAlready = false;
	for (var iGM = 0; v2 = GM_getValue("capitan."+idCarte+".essai."+iGM); iGM++) {
		if (v2 != v) continue;
		return true;
		break;
	}
	return false;
}

// Roule 25/08/2016 récupération des anciennes recherches (préférences)
function PrepareRecupFromPreferences() {
	var table = document.createElement('table');
	table.setAttribute('class', 'mh_tdborder');
	table.setAttribute('border', '0');
	table.setAttribute('cellspacing', '1');
	table.setAttribute('cellpadding', '4');
	table.setAttribute('style', 'width: 400px;');
	table.setAttribute('align', 'center');
	
	var thead = document.createElement('thead');
	var tr = appendTr(thead, 'mh_tdtitre');
	var td = appendTdText(tr, "Récupération des anciens essais V1.0", true);
	td.setAttribute('align', 'center');
	td.title = "C'est ici pour entrer manuellement les essais faits avec la version 1.0 du script";
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	table.appendChild(tbody);

	var td2 = createCase("Ouvrez un nouvel onglet sous Firefox",tbody);
	td2.style.textAlign = "left";

	var nbsp = String.fromCharCode(160);
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("(«" + nbsp + "+" + nbsp + "» à droite des onglets)"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("Tapez dans la barre d'adresse «" + nbsp + "about:config" + nbsp + "» et validez"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("C'est promis, vous ferez attention" + nbsp + "!"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("Filtrez ensuite par «" + nbsp + "capitan" + nbsp +"» (zone «" + nbsp + "Rechercher" + nbsp + "» en haut)"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("Ensuite, ligne par ligne,"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("copiez la ligne (bouton de droite de la souris - copier),"));
	td2.appendChild(document.createElement('br'));
	td2.appendChild(document.createTextNode("Collez ci-dessous et Ajouter"));
	td2.appendChild(document.createElement('br'));
	var inp = addInput(td2, "t", 100);
	inp.style.width = "350px";
	td2.appendChild(document.createElement('br'));
	var button=appendButton(td2, "Ajouter", addV1);

	td.addEventListener("click", toggleTableau, true);
	td.setAttribute('onmouseover', "this.style.cursor = 'pointer'; this.className = 'mh_tdpage';");
	td.setAttribute('onmouseout', "this.className = 'mh_tdtitre';");
	td.setAttribute('colspan', 2);
	tbody.setAttribute('style', 'display:none;');
	
	return table;
}

function addV1(eButton) {
	// pour test mountyhall.91306.capitan.8600686.essai.1;-1;2;6;4
	try
	{
		var td=this.parentNode;
		var eInput = td.getElementsByTagName("input")[0];
		var val = eInput.value;
		//window.console.log('val=' + val);
		var m = val.match(/capitan\.(\d*)\.essai\.(\d*);([+-]?\d*);([+-]?\d*);([+-]?\d*);(\d*)/i);
		if (!m) {
			alert("Désolé, impossible de retrouver le numéro de carte, les coordonnées et le nombre de chiffres bien placés");
			return;
		}
		var bAlready = testAlready(m[1], m[3] + ';' + m[4] + ';' + m[5] + ';' + m[6]);
		if (bAlready) {
			alert("L'essai pour la carte " + m[1] + "\nX = " + m[3] 
				+ ", Y=" + m[4] + ", N=" + m[5] + " => " + m[6] 
				+ "\navait DÉJÀ été entré");
			eInput.value = '';	// vider le champ pour que l'utilisateur puisse copier à nouveau
			return;
		}
		addOneRecherche(parseInt(m[1]), m[3], m[4], m[5], m[6]);
		alert("L'essai pour la carte " + m[1] + "\nX = " + m[3] 
			+ ", Y=" + m[4] + ", N=" + m[5] + " => " + m[6] 
			+ "\na bien été enregistré\nIl faudra rafraichir cette page (F5) quand vous aurez terminé");
		eInput.value = '';	// vider le champ pour que l'utilisateur puisse copier à nouveau
	}
	catch(e)
	{
		window.alert(e);
	}
}

function addRecherche()
{
	try
	{
		var td=this.parentNode;
		var x = (td.getElementsByTagName("input")[0]).value;
		var y = (td.getElementsByTagName("input")[1]).value;
		var n = (td.getElementsByTagName("input")[2]).value;
		var nbChiffres = (td.getElementsByTagName("input")[3]).value;
		if(x==null || isNaN(parseInt(x)))
		{
			window.alert("Erreur : champ X mal formaté.");
			return;
		}
		if(y==null || isNaN(parseInt(y)))
		{
			window.alert("Erreur : champ Y mal formaté.");
			return;
		}
		if(n==null || isNaN(parseInt(n)))
		{
			window.alert("Erreur : champ N mal formaté.");
			return;
		}
		if(nbChiffres==null || isNaN(parseInt(nbChiffres)))
		{
			window.alert("Erreur : nombre de chiffres bien placés mal formaté.");
			return;
		}
		addOneRecherche(getIDCarte(), x, y, n, nbChiffres);
		window.location.replace(window.location);
	}
	catch(e)
	{
		window.alert(e);
	}
}

function addOneRecherche(idCarte, x, y, n, nbChiffres) {
	for (var i = 0; GM_getValue("capitan."+idCarte+".essai."+i); i++){}
	GM_setValue("capitan."+idCarte+".essai."+i,parseInt(x)+";"+parseInt(y)+";"+parseInt(n)+";"+parseInt(nbChiffres));
}

function addInput(parent, nom, size)
{
	var input = document.createElement('input');
	input.setAttribute('type','text');
	input.setAttribute('name',nom);
	input.setAttribute('type','text');
	input.setAttribute('maxlength',size==null?4:size);
	input.setAttribute('size',size==null?4:size);
	parent.appendChild(input);
	return input;
}

function infoRecherche()
{
	var idCarte = getIntegerByID('carte', 'numéro de carte');
	if (idCarte === undefined) return;
	var x = getIntegerByID('x', 'x');
	if (x === undefined) return;	// ne pas utiliser «!» car x peut être «0» !
	var y = getIntegerByID('y', 'y');
	if (y === undefined) return;
	var n = getIntegerByID('n', 'n');
	if (n === undefined) return;
	var nb = getIntegerByID('nb', 'le nombre de chiffres bien placés');
	if (nb === undefined) return;

	var i = 0;
	while(GM_getValue("capitan."+idCarte+".essai."+i) != null)
	{
		i++;
	}
	GM_setValue("capitan."+idCarte+".essai."+i,x+";"+y+";"+n+";"+nb);

	var table = afficheInfoCarte(idCarte);
	
	form = document.getElementsByTagName('FORM')[0];
	var p = document.createElement('p');
	p.appendChild(table);
	form.appendChild(p);
}

// return undefined if not found
function getIntegerByID(id, msg) {
	var e = document.getElementById(id);
	if (!e || !e.childNodes || !e.childNodes[0] || !e.childNodes[0].nodeValue) {
		if (msg) window.alert('Script carte de Capitan : impossible de retrouver le ' + msg);
		return;
	}
	return parseInt(e.childNodes[0].nodeValue);
}

try
{
	if (isPage("View/TresorHistory.php"))
	{
		analyseObject();
	}
	else if(isPage("MH_Play/Actions/Play_a_TrouverCachette2.php"))
	{
		infoRecherche();
	}
	else if(isPage("MH_Play/Play_equipement.php"))
	{
		window.setInterval(analyseObject, 1000);	// Roule, 23/11/2016, il faudrait trouver mieux pour s'activer quand l'utilisateur ouvre le popup
	}
}
catch(e)
{
	window.alert(e);
}

